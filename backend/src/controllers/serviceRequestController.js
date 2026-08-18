const db = require("../config/db");

const SERVICE_TYPES = [
  "MANAGEMENT",
  "EVENTS",
  "MARKETING",
  "RECRUITMENT",
  "FNB",
  "CATERING",
  "TECHNOLOGY",
  "OTHER",
];

const STATUSES = [
  "PENDING",
  "IN_REVIEW",
  "APPROVED",
  "REJECTED",
  "COMPLETED",
];

const getCompanyByUserId = async (userId) => {
  const [companies] = await db.query(
    `
      SELECT id, company_name, contact_name, contact_phone
      FROM companies
      WHERE user_id = ?
    `,
    [userId]
  );

  return companies[0] || null;
};

const createServiceRequest = async (req, res) => {
  try {
    const {
      serviceType,
      title,
      description,
      preferredDate,
      location,
      budgetRange,
      notes,
      slotId,
    } = req.body;

    const missingFields = [];
    if (!serviceType) missingFields.push("serviceType");
    if (!title) missingFields.push("title");
    if (!description) missingFields.push("description");

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        missingFields,
      });
    }

    const normalizedServiceType = serviceType.toUpperCase();

    if (!SERVICE_TYPES.includes(normalizedServiceType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service type",
        allowedServiceTypes: SERVICE_TYPES,
      });
    }

    const company = await getCompanyByUserId(req.user.userId);
    if (!company) {
      return res.status(404).json({ success: false, message: "Company profile not found" });
    }

    let connection;
    let result;

    try {
      connection = await db.getConnection();
      await connection.beginTransaction();

      if (slotId) {
        const [claim] = await connection.query(
          "UPDATE availability_slots SET status = 'BOOKED' WHERE id = ? AND status = 'OPEN'",
          [slotId]
        );

        if (claim.affectedRows === 0) {
          await connection.rollback();
          return res.status(409).json({
            success: false,
            message: "That time has just been taken. Please choose another slot.",
          });
        }
      }

      const status = slotId ? "APPROVED" : "PENDING";

      [result] = await connection.query(
        `INSERT INTO service_requests
          (company_id, service_type, title, description, preferred_date, location, budget_range, notes, slot_id, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          company.id,
          normalizedServiceType,
          title,
          description,
          preferredDate || null,
          location || null,
          budgetRange || null,
          notes || null,
          slotId || null,
          status,
        ]
      );

      await connection.commit();
    } catch (error) {
      if (connection) await connection.rollback();
      throw error;
    } finally {
      if (connection) connection.release();
    }

    return res.status(201).json({
      success: true,
      message: "Service request created successfully",
      serviceRequest: {
        id: result.insertId,
        companyId: company.id,
        serviceType: normalizedServiceType,
        title,
        description,
        preferredDate: preferredDate || null,
        location: location || null,
        budgetRange: budgetRange || null,
        notes: notes || null,
        slotId: slotId || null,
        status: slotId ? "APPROVED" : "PENDING",
      },
    });
  } catch (error) {
    console.error("Create service request error:", error);
    return res.status(500).json({ success: false, message: "Failed to create service request" });
  }
};

const getCompanyServiceRequests = async (req, res) => {
  try {
    const company = await getCompanyByUserId(req.user.userId);
    if (!company) {
      return res.status(200).json({ success: true, serviceRequests: [] });
    }

    const [requests] = await db.query(
      `SELECT
          r.id, r.title, r.description, r.service_type, r.status,
          r.budget_range, r.location, r.preferred_date, r.notes,
          r.created_at, r.updated_at, r.slot_id,
          s.starts_at AS meeting_at, s.ends_at AS meeting_ends_at
        FROM service_requests r
        LEFT JOIN availability_slots s ON s.id = r.slot_id
        WHERE r.company_id = ?
        ORDER BY r.created_at DESC`,
      [company.id]
    );

    return res.status(200).json({
      success: true,
      serviceRequests: requests.map((r) => ({
        id: r.id,
        title: r.title,
        description: r.description,
        serviceType: r.service_type,
        status: r.status,
        budgetRange: r.budget_range,
        location: r.location,
        preferredDate: r.preferred_date,
        notes: r.notes,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
        slotId: r.slot_id,
        meetingAt: r.meeting_at,
        meetingEndsAt: r.meeting_ends_at,
      })),
    });
  } catch (error) {
    console.error("Get company service requests error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch service requests" });
  }
};

const getAllServiceRequests = async (req, res) => {
  try {
    const [requests] = await db.query(
      `SELECT sr.*, c.company_name, c.contact_name, c.contact_phone, u.email AS company_email
       FROM service_requests sr
       JOIN companies c ON sr.company_id = c.id
       JOIN users u ON c.user_id = u.id
       ORDER BY sr.created_at DESC`
    );

    return res.status(200).json({ success: true, serviceRequests: requests });
  } catch (error) {
    console.error("Get all service requests error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch service requests" });
  }
};

const getServiceRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    const [requests] = await db.query(
      `SELECT sr.*, c.company_name, c.contact_name, c.contact_phone, u.email AS company_email
       FROM service_requests sr
       JOIN companies c ON sr.company_id = c.id
       JOIN users u ON c.user_id = u.id
       WHERE sr.id = ?`,
      [id]
    );

    if (requests.length === 0) {
      return res.status(404).json({ success: false, message: "Service request not found" });
    }

    const request = requests[0];

    if (req.user.role === "COMPANY") {
      const company = await getCompanyByUserId(req.user.userId);
      if (!company || request.company_id !== company.id) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }
    }

    return res.status(200).json({ success: true, serviceRequest: request });
  } catch (error) {
    console.error("Get service request by id error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch service request" });
  }
};

const updateServiceRequestStatus = async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    if (!status) return res.status(400).json({ success: false, message: "Status is required" });

    const normalizedStatus = status.toUpperCase();

    if (!STATUSES.includes(normalizedStatus)) {
      return res.status(400).json({ success: false, message: "Invalid status", allowedStatuses: STATUSES });
    }

    connection = await db.getConnection();
    await connection.beginTransaction();

    const [existing] = await connection.query("SELECT id FROM service_requests WHERE id = ?", [id]);
    if (existing.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: "Service request not found" });
    }

    await connection.query(
      "UPDATE service_requests SET status = ?, admin_notes = ? WHERE id = ?",
      [normalizedStatus, adminNotes || null, id]
    );

    /* If rejected, free up any associated calendar slots to avoid dead resources */
    if (normalizedStatus === "REJECTED") {
      await connection.query(
        "UPDATE availability_slots s JOIN service_requests r ON s.id = r.slot_id SET s.status = 'OPEN' WHERE r.id = ?",
        [id]
      );
      await connection.query(
        "UPDATE availability_slots s JOIN meeting_reschedules mr ON s.id = mr.proposed_slot_id SET s.status = 'OPEN' WHERE mr.service_request_id = ? AND mr.status = 'PENDING'",
        [id]
      );
      await connection.query(
        "UPDATE meeting_reschedules SET status = 'DECLINED', resolved_at = NOW() WHERE service_request_id = ? AND status = 'PENDING'",
        [id]
      );
    }

    await connection.commit();

    return res.status(200).json({
      success: true,
      message: "Service request status updated successfully",
      serviceRequest: { id, status: normalizedStatus, adminNotes: adminNotes || null },
    });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Update service request status error:", error);
    return res.status(500).json({ success: false, message: "Failed to update service request status" });
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  createServiceRequest,
  getCompanyServiceRequests,
  getAllServiceRequests,
  getServiceRequestById,
  updateServiceRequestStatus,
};