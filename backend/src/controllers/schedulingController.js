const db = require("../config/db");

const SERVICE_TYPES = [
  "MANAGEMENT", "EVENTS", "MARKETING", "RECRUITMENT",
  "FNB", "CATERING", "TECHNOLOGY", "OTHER",
];

const getCompanyByUserId = async (userId) => {
  const [rows] = await db.query("SELECT * FROM companies WHERE user_id = ?", [userId]);
  return rows[0] || null;
};

const listSlots = async (req, res) => {
  try {
    const { from, to, service } = req.query;
    const isAdmin = req.user?.role === "ADMIN" || req.user?.role === "COORDINATOR";

    const where = [];
    const params = [];

    if (from) { where.push("s.starts_at >= ?"); params.push(from); }
    if (to) { where.push("s.starts_at <= ?"); params.push(to); }
    if (!isAdmin) where.push("s.status = 'OPEN'");
    if (service) {
      where.push("EXISTS (SELECT 1 FROM availability_slot_services x WHERE x.slot_id = s.id AND x.service_type = ?)");
      params.push(service);
    }

    const [slots] = await db.query(
      `SELECT
         s.id, s.starts_at, s.ends_at, s.status,
         (SELECT GROUP_CONCAT(ss.service_type) FROM availability_slot_services ss WHERE ss.slot_id = s.id) AS services,
         ${isAdmin ? "COALESCE(r.id, proposed_request.id) AS request_id, COALESCE(r.title, proposed_request.title) AS request_title, COALESCE(c.id, proposed_company.id) AS company_id, COALESCE(c.company_name, proposed_company.company_name) AS company_name" : "NULL AS request_id, NULL AS request_title, NULL AS company_id, NULL AS company_name"}
       FROM availability_slots s
       ${isAdmin ? "LEFT JOIN service_requests r ON r.slot_id = s.id LEFT JOIN companies c ON c.id = r.company_id LEFT JOIN meeting_reschedules pending_proposal ON pending_proposal.proposed_slot_id = s.id AND pending_proposal.status = 'PENDING' LEFT JOIN service_requests proposed_request ON proposed_request.id = pending_proposal.service_request_id LEFT JOIN companies proposed_company ON proposed_company.id = proposed_request.company_id" : ""}
       ${where.length ? "WHERE " + where.join(" AND ") : ""}
       ORDER BY s.starts_at ASC`,
      params
    );

    return res.status(200).json({
      success: true,
      slots: slots.map((s) => ({
        id: s.id,
        startsAt: s.starts_at,
        endsAt: s.ends_at,
        status: s.status,
        services: s.services ? s.services.split(",") : [],
        requestId: s.request_id,
        requestTitle: s.request_title,
        companyId: s.company_id,
        companyName: s.company_name,
      })),
    });
  } catch (error) {
    console.error("listSlots error:", error);
    return res.status(500).json({ success: false, message: "Failed to load calendar" });
  }
};

const createSlots = async (req, res) => {
  let connection;
  try {
    const { starts = [], services = [], durationMinutes = 60 } = req.body;

    if (!Array.isArray(starts) || starts.length === 0) {
      return res.status(400).json({ success: false, message: "Pick at least one date and time" });
    }
    if (!Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ success: false, message: "Pick at least one service" });
    }

    const invalid = services.filter((s) => !SERVICE_TYPES.includes(s));
    if (invalid.length) {
      return res.status(400).json({ success: false, message: `Unknown service: ${invalid.join(", ")}` });
    }

    connection = await db.getConnection();
    await connection.beginTransaction();

    const created = [];
    const skipped = [];

    for (const startsAt of starts) {
      const [existing] = await connection.query("SELECT id FROM availability_slots WHERE starts_at = ?", [startsAt]);
      if (existing.length > 0) {
        skipped.push(startsAt);
        continue;
      }

      const [result] = await connection.query(
        `INSERT INTO availability_slots (starts_at, ends_at, created_by) VALUES (?, DATE_ADD(?, INTERVAL ? MINUTE), ?)`,
        [startsAt, startsAt, durationMinutes, req.user.userId]
      );

      for (const service of services) {
        await connection.query("INSERT INTO availability_slot_services (slot_id, service_type) VALUES (?, ?)", [result.insertId, service]);
      }
      created.push(result.insertId);
    }

    await connection.commit();
    return res.status(201).json({ success: true, created: created.length, skipped });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("createSlots error:", error);
    return res.status(500).json({ success: false, message: "Failed to save availability" });
  } finally {
    if (connection) connection.release();
  }
};

const deleteSlot = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT status FROM availability_slots WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: "Slot not found" });

    if (rows[0].status !== "OPEN") {
      return res.status(409).json({ success: false, message: "That time already has a company on it. Reschedule the meeting instead." });
    }

    await db.query("DELETE FROM availability_slots WHERE id = ?", [req.params.id]);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("deleteSlot error:", error);
    return res.status(500).json({ success: false, message: "Failed to remove slot" });
  }
};

const getCompanyProfile = async (req, res) => {
  try {
    const [companies] = await db.query(
      `SELECT c.*, u.email, u.is_active FROM companies c JOIN users u ON u.id = c.user_id WHERE c.id = ?`,
      [req.params.id]
    );

    if (companies.length === 0) return res.status(404).json({ success: false, message: "Company not found" });

    const [requests] = await db.query(
      `SELECT r.id, r.title, r.description, r.service_type, r.status, r.budget_range, r.location, r.created_at,
              s.id AS slot_id, s.starts_at AS meeting_at, s.ends_at AS meeting_ends_at
       FROM service_requests r
       LEFT JOIN availability_slots s ON s.id = r.slot_id
       WHERE r.company_id = ? ORDER BY r.created_at DESC`,
      [req.params.id]
    );

    const [reschedules] = await db.query(
      `SELECT mr.id, mr.status, mr.message, mr.created_at, mr.service_request_id, s.starts_at AS proposed_at
       FROM meeting_reschedules mr
       JOIN availability_slots s ON s.id = mr.proposed_slot_id
       JOIN service_requests r ON r.id = mr.service_request_id
       WHERE r.company_id = ? ORDER BY mr.created_at DESC`,
      [req.params.id]
    );

    return res.status(200).json({
      success: true,
      company: {
        id: companies[0].id, companyName: companies[0].company_name, contactName: companies[0].contact_name,
        contactPhone: companies[0].contact_phone, email: companies[0].email, isActive: !!companies[0].is_active,
        createdAt: companies[0].created_at,
      },
      requests: requests.map((r) => ({
        id: r.id, title: r.title, description: r.description, serviceType: r.service_type, status: r.status,
        budgetRange: r.budget_range, location: r.location, createdAt: r.created_at,
        slotId: r.slot_id, meetingAt: r.meeting_at, meetingEndsAt: r.meeting_ends_at,
      })),
      reschedules: reschedules.map((m) => ({
        id: m.id, requestId: m.service_request_id, status: m.status, message: m.message,
        proposedAt: m.proposed_at, createdAt: m.created_at,
      })),
    });
  } catch (error) {
    console.error("getCompanyProfile error:", error);
    return res.status(500).json({ success: false, message: "Failed to load company profile" });
  }
};

const proposeReschedule = async (req, res) => {
  let connection;
  try {
    const { slotId, message } = req.body;
    const requestId = req.params.id;

    if (!slotId) return res.status(400).json({ success: false, message: "Choose a new time to propose" });

    const [requests] = await db.query("SELECT id FROM service_requests WHERE id = ?", [requestId]);
    if (requests.length === 0) return res.status(404).json({ success: false, message: "Request not found" });

    const [slots] = await db.query("SELECT id, status FROM availability_slots WHERE id = ?", [slotId]);
    if (slots.length === 0) return res.status(404).json({ success: false, message: "Slot not found" });
    if (slots[0].status !== "OPEN") return res.status(409).json({ success: false, message: "That time is no longer free" });

    connection = await db.getConnection();
    await connection.beginTransaction();

    await connection.query(
      `INSERT INTO meeting_reschedules (service_request_id, proposed_slot_id, message, requested_by) VALUES (?, ?, ?, ?)`,
      [requestId, slotId, message || null, req.user.userId]
    );

    /* Enums validated to match DB strictly */
    await connection.query("UPDATE service_requests SET status = 'IN_REVIEW' WHERE id = ?", [requestId]);
    await connection.query("UPDATE availability_slots SET status = 'REQUESTED' WHERE id = ?", [slotId]);

    await connection.commit();
    return res.status(201).json({ success: true });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("proposeReschedule error:", error);
    return res.status(500).json({ success: false, message: "Failed to propose a new time" });
  } finally {
    if (connection) connection.release();
  }
};

const listMyReschedules = async (req, res) => {
  try {
    const company = await getCompanyByUserId(req.user.userId);
    if (!company) return res.status(200).json({ success: true, reschedules: [] });

    const [rows] = await db.query(
      `SELECT mr.id, mr.status, mr.message, mr.created_at, r.id AS request_id, r.title,
              proposed.starts_at AS proposed_at, current.starts_at AS current_at
       FROM meeting_reschedules mr
       JOIN service_requests r ON r.id = mr.service_request_id
       JOIN availability_slots proposed ON proposed.id = mr.proposed_slot_id
       LEFT JOIN availability_slots current ON current.id = r.slot_id
       WHERE r.company_id = ? ORDER BY mr.created_at DESC`,
      [company.id]
    );

    return res.status(200).json({
      success: true,
      reschedules: rows.map((r) => ({
        id: r.id, requestId: r.request_id, title: r.title, status: r.status, message: r.message,
        proposedAt: r.proposed_at, currentAt: r.current_at, createdAt: r.created_at,
      })),
    });
  } catch (error) {
    console.error("listMyReschedules error:", error);
    return res.status(500).json({ success: false, message: "Failed to load reschedule requests" });
  }
};

const respondToReschedule = async (req, res) => {
  let connection;
  try {
    const { decision } = req.body;
    if (!["APPROVE", "DECLINE"].includes(decision)) {
      return res.status(400).json({ success: false, message: "Decision must be APPROVE or DECLINE" });
    }

    const company = await getCompanyByUserId(req.user.userId);
    if (!company) return res.status(404).json({ success: false, message: "Company profile not found" });

    const [rows] = await db.query(
      `SELECT mr.*, r.company_id, r.slot_id AS current_slot_id
       FROM meeting_reschedules mr JOIN service_requests r ON r.id = mr.service_request_id
       WHERE mr.id = ?`,
      [req.params.id]
    );

    if (rows.length === 0) return res.status(404).json({ success: false, message: "Reschedule request not found" });

    const reschedule = rows[0];
    if (reschedule.company_id !== company.id) return res.status(403).json({ success: false, message: "Access denied" });
    if (reschedule.status !== "PENDING") return res.status(409).json({ success: false, message: "This request has already been answered" });

    connection = await db.getConnection();
    await connection.beginTransaction();

    if (decision === "APPROVE") {
      await connection.query("UPDATE service_requests SET slot_id = ?, status = 'APPROVED' WHERE id = ?", [reschedule.proposed_slot_id, reschedule.service_request_id]);
      const [bookedSlot] = await connection.query(
        "UPDATE availability_slots SET status = 'BOOKED' WHERE id = ? AND status = 'REQUESTED'",
        [reschedule.proposed_slot_id]
      );
      if (bookedSlot.affectedRows === 0) {
        throw new Error("The proposed slot is no longer awaiting a response");
      }
      if (reschedule.current_slot_id) {
        await connection.query("UPDATE availability_slots SET status = 'OPEN' WHERE id = ?", [reschedule.current_slot_id]);
      }
    } else {
      /* Properly decline the specific time slot instead of rejecting the entire project */
      await connection.query("UPDATE availability_slots SET status = 'OPEN' WHERE id = ?", [reschedule.proposed_slot_id]);
      const revertStatus = reschedule.current_slot_id ? 'APPROVED' : 'PENDING';
      await connection.query("UPDATE service_requests SET status = ? WHERE id = ?", [revertStatus, reschedule.service_request_id]);
    }

    await connection.query("UPDATE meeting_reschedules SET status = ?, resolved_at = NOW() WHERE id = ?", [decision === "APPROVE" ? "APPROVED" : "DECLINED", reschedule.id]);

    await connection.commit();
    return res.status(200).json({ success: true });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("respondToReschedule error:", error);
    return res.status(500).json({ success: false, message: "Failed to answer the reschedule request" });
  } finally {
    if (connection) connection.release();
  }
};

const listCompanies = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT c.id, c.company_name, c.contact_name, c.contact_phone, c.created_at, u.email, u.is_active,
         (SELECT COUNT(*) FROM service_requests r WHERE r.company_id = c.id) AS request_count,
         (SELECT COUNT(*) FROM service_requests r WHERE r.company_id = c.id AND r.status IN ('PENDING','IN_REVIEW')) AS open_count,
         (SELECT MIN(s.starts_at) FROM service_requests r JOIN availability_slots s ON s.id = r.slot_id WHERE r.company_id = c.id AND s.status = 'BOOKED') AS booked_meeting_at,
         (SELECT GROUP_CONCAT(DISTINCT r.service_type) FROM service_requests r WHERE r.company_id = c.id) AS services
       FROM companies c JOIN users u ON u.id = c.user_id ORDER BY c.company_name ASC`
    );
    return res.status(200).json({
      success: true,
      companies: rows.map((c) => ({
        id: c.id, companyName: c.company_name, contactName: c.contact_name, contactPhone: c.contact_phone, email: c.email,
        isActive: !!c.is_active, createdAt: c.created_at, requestCount: Number(c.request_count) || 0,
        openCount: Number(c.open_count) || 0, bookedMeetingAt: c.booked_meeting_at, services: c.services ? c.services.split(",") : [],
      })),
    });
  } catch (error) {
    console.error("listCompanies error:", error);
    return res.status(500).json({ success: false, message: "Failed to load companies" });
  }
};

const listProjects = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT r.id, r.title, r.description, r.service_type, r.status, r.budget_range, r.location, r.notes, r.created_at, r.updated_at,
         s.starts_at AS meeting_at, s.ends_at AS meeting_ends_at, c.id AS company_id, c.company_name, c.contact_name, c.contact_phone, u.email
       FROM service_requests r JOIN companies c ON c.id = r.company_id JOIN users u ON u.id = c.user_id
       LEFT JOIN availability_slots s ON s.id = r.slot_id ORDER BY r.created_at DESC`
    );
    return res.status(200).json({
      success: true,
      projects: rows.map((r) => ({
        id: r.id, title: r.title, description: r.description, serviceType: r.service_type, status: r.status,
        budgetRange: r.budget_range, location: r.location, notes: r.notes, createdAt: r.created_at, updatedAt: r.updated_at,
        meetingAt: r.meeting_at, meetingEndsAt: r.meeting_ends_at, companyId: r.company_id, companyName: r.company_name,
        contactName: r.contact_name, contactPhone: r.contact_phone, email: r.email,
      })),
    });
  } catch (error) {
    console.error("listProjects error:", error);
    return res.status(500).json({ success: false, message: "Failed to load projects" });
  }
};

const updateProjectStatus = async (req, res) => {
  let connection;
  try {
    const ALLOWED = ["PENDING", "IN_REVIEW", "APPROVED", "REJECTED", "COMPLETED"];
    const { status } = req.body;

    if (!ALLOWED.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of ${ALLOWED.join(", ")}` });
    }

    connection = await db.getConnection();
    await connection.beginTransaction();

    const [result] = await connection.query("UPDATE service_requests SET status = ? WHERE id = ?", [status, req.params.id]);

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    if (status === "REJECTED") {
      await connection.query("UPDATE availability_slots s JOIN service_requests r ON s.id = r.slot_id SET s.status = 'OPEN' WHERE r.id = ?", [req.params.id]);
      await connection.query("UPDATE availability_slots s JOIN meeting_reschedules mr ON s.id = mr.proposed_slot_id SET s.status = 'OPEN' WHERE mr.service_request_id = ? AND mr.status = 'PENDING'", [req.params.id]);
      await connection.query("UPDATE meeting_reschedules SET status = 'DECLINED', resolved_at = NOW() WHERE service_request_id = ? AND status = 'PENDING'", [req.params.id]);
    }

    await connection.commit();
    return res.status(200).json({ success: true });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("updateProjectStatus error:", error);
    return res.status(500).json({ success: false, message: "Failed to update the project" });
  } finally {
    if (connection) connection.release();
  }
};

const getOverviewStats = async (req, res) => {
  try {
    const [[companies]] = await db.query("SELECT COUNT(*) AS total FROM companies");
    const [[meetings]] = await db.query("SELECT COUNT(*) AS total FROM availability_slots WHERE status = 'BOOKED' AND starts_at >= NOW()");
    const [[pendingRequests]] = await db.query("SELECT COUNT(*) AS total FROM service_requests WHERE status IN ('PENDING', 'IN_REVIEW')");
    return res.status(200).json({ success: true, companies: companies.total, upcomingMeetings: meetings.total, pendingRequests: pendingRequests.total });
  } catch (error) {
    console.error("getOverviewStats error:", error);
    return res.status(500).json({ success: false, message: "Failed to load stats" });
  }
};

module.exports = {
  listSlots,
  listCompanies,
  listProjects,
  updateProjectStatus,
  getOverviewStats,
  createSlots,
  deleteSlot,
  getCompanyProfile,
  proposeReschedule,
  listMyReschedules,
  respondToReschedule,
};
