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
  createCompanyContactMessage,
  getMyContactMessages,
};
