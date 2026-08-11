const db = require("../config/db");

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

const getCompanyDashboard = async (req, res) => {
  try {
    const company = await getCompanyByUserId(req.user.userId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found",
      });
    }

    const [[requestStats]] = await db.query(
      `
        SELECT
          COUNT(*) AS totalRequests,
          SUM(status = 'PENDING') AS pendingRequests,
          SUM(status = 'IN_REVIEW') AS inReviewRequests,
          SUM(status = 'APPROVED') AS approvedRequests,
          SUM(status = 'REJECTED') AS rejectedRequests,
          SUM(status = 'COMPLETED') AS completedRequests
        FROM service_requests
        WHERE company_id = ?
      `,
      [company.id]
    );

    const [[contactStats]] = await db.query(
      `
        SELECT COUNT(*) AS totalContactMessages
        FROM contact_messages
        WHERE company_id = ?
      `,
      [company.id]
    );

    return res.status(200).json({
      success: true,
      stats: {
        ...requestStats,
        ...contactStats,
      },
    });
  } catch (error) {
    console.error("Get company dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch company dashboard",
    });
  }
};

/**
 * The signed-in user's own profile.
 *
 * A company row is returned as null rather than a 404 when it doesn't exist
 * yet, so every logged-in user gets a working profile page — one that invites
 * them to fill in their details instead of showing an error.
 */
const getMyProfile = async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, email, role, created_at FROM users WHERE id = ?",
      [req.user.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const [companies] = await db.query(
      `SELECT id, company_name, contact_name, contact_phone, created_at
         FROM companies WHERE user_id = ?`,
      [req.user.userId]
    );

    const company = companies[0] || null;
    let stats = null;

    if (company) {
      const [[requestStats]] = await db.query(
        `SELECT
           COUNT(*) AS total,
           SUM(status = 'PENDING') AS pending,
           SUM(status = 'APPROVED') AS approved,
           SUM(status = 'COMPLETED') AS completed
         FROM service_requests WHERE company_id = ?`,
        [company.id]
      );

      const [[nextMeeting]] = await db.query(
        `SELECT MIN(s.starts_at) AS next_at
           FROM service_requests r
           JOIN availability_slots s ON s.id = r.slot_id
          WHERE r.company_id = ? AND s.starts_at >= NOW()`,
        [company.id]
      );

      stats = {
        total: Number(requestStats.total) || 0,
        pending: Number(requestStats.pending) || 0,
        approved: Number(requestStats.approved) || 0,
        completed: Number(requestStats.completed) || 0,
        nextMeetingAt: nextMeeting.next_at,
      };
    }

    return res.status(200).json({
      success: true,
      user: {
        id: users[0].id,
        email: users[0].email,
        role: users[0].role,
        createdAt: users[0].created_at,
      },
      company: company
        ? {
            id: company.id,
            companyName: company.company_name,
            contactName: company.contact_name,
            contactPhone: company.contact_phone,
            createdAt: company.created_at,
          }
        : null,
      stats,
    });
  } catch (error) {
    console.error("getMyProfile error:", error);
    return res.status(500).json({ success: false, message: "Failed to load your profile" });
  }
};

/** Create the company record on first save, update it thereafter. */
const saveMyProfile = async (req, res) => {
  try {
    const { companyName, contactName, contactPhone } = req.body;

    if (!companyName?.trim() || !contactName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Company name and contact name are required",
      });
    }

    const [existing] = await db.query("SELECT id FROM companies WHERE user_id = ?", [
      req.user.userId,
    ]);

    if (existing.length > 0) {
      await db.query(
        `UPDATE companies SET company_name = ?, contact_name = ?, contact_phone = ?
          WHERE user_id = ?`,
        [companyName.trim(), contactName.trim(), contactPhone?.trim() || null, req.user.userId]
      );
      return res.status(200).json({ success: true, id: existing[0].id });
    }

    const [result] = await db.query(
      `INSERT INTO companies (user_id, company_name, contact_name, contact_phone)
       VALUES (?, ?, ?, ?)`,
      [req.user.userId, companyName.trim(), contactName.trim(), contactPhone?.trim() || null]
    );

    return res.status(201).json({ success: true, id: result.insertId });
  } catch (error) {
    console.error("saveMyProfile error:", error);
    return res.status(500).json({ success: false, message: "Failed to save your profile" });
  }
};

const createCompanyContactMessage = async (req, res) => {
  try {
    const {
      name,
      email,
      serviceInterest,
      message,
    } = req.body;

    const missingFields = [];

    if (!name) {
      missingFields.push("name");
    }

    if (!email) {
      missingFields.push("email");
    }

    if (!message) {
      missingFields.push("message");
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        missingFields,
      });
    }

    const company = await getCompanyByUserId(req.user.userId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found",
      });
    }

    const [result] = await db.query(
      `
        INSERT INTO contact_messages
          (
            company_id,
            name,
            email,
            company,
            service_interest,
            message
          )
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        company.id,
        name,
        email,
        company.company_name,
        serviceInterest || null,
        message,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Contact message sent successfully",
      contactMessage: {
        id: result.insertId,
        companyId: company.id,
        name,
        email,
        company: company.company_name,
        serviceInterest: serviceInterest || null,
        message,
        status: "NEW",
      },
    });
  } catch (error) {
    console.error("Create company contact message error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send contact message",
    });
  }
};

const getMyContactMessages = async (req, res) => {
  try {
    const company = await getCompanyByUserId(req.user.userId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found",
      });
    }

    const [messages] = await db.query(
      `
        SELECT *
        FROM contact_messages
        WHERE company_id = ?
        ORDER BY created_at DESC
      `,
      [company.id]
    );

    return res.status(200).json({
      success: true,
      contactMessages: messages,
    });
  } catch (error) {
    console.error("Get my contact messages error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch contact messages",
    });
  }
};

module.exports = {
  getCompanyDashboard,
  getMyProfile,
  saveMyProfile,
  createCompanyContactMessage,
  getMyContactMessages,
};
