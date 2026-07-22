const db = require("../config/db");

const SERVICE_TYPES = [
  "MANAGEMENT",
  "EVENTS",
  "MARKETING",
  "RECRUITMENT",
  "FNB",
  "CATERING",
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
    } = req.body;

    const missingFields = [];

    if (!serviceType) {
      missingFields.push("serviceType");
    }

    if (!title) {
      missingFields.push("title");
    }

    if (!description) {
      missingFields.push("description");
    }

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
      return res.status(404).json({
        success: false,
        message: "Company profile not found",
      });
    }

    const [result] = await db.query(
      `
        INSERT INTO service_requests
          (
            company_id,
            service_type,
            title,
            description,
            preferred_date,
            location,
            budget_range,
            notes
          )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        company.id,
        normalizedServiceType,
        title,
        description,
        preferredDate || null,
        location || null,
        budgetRange || null,
        notes || null,
      ]
    );

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
        status: "PENDING",
      },
    });
  } catch (error) {
    console.error("Create service request error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create service request",
    });
  }
};

const getCompanyServiceRequests = async (req, res) => {
  try {
    const company = await getCompanyByUserId(req.user.userId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found",
      });
    }

    const [requests] = await db.query(
      `
        SELECT *
        FROM service_requests
        WHERE company_id = ?
        ORDER BY created_at DESC
      `,
      [company.id]
    );

    return res.status(200).json({
      success: true,
      serviceRequests: requests,
    });
  } catch (error) {
    console.error("Get company service requests error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch service requests",
    });
  }
};

const getAllServiceRequests = async (req, res) => {
  try {
    const [requests] = await db.query(
      `
        SELECT
          sr.*,
          c.company_name,
          c.contact_name,
          c.contact_phone,
          u.email AS company_email
        FROM service_requests sr
        JOIN companies c ON sr.company_id = c.id
        JOIN users u ON c.user_id = u.id
        ORDER BY sr.created_at DESC
      `
    );

    return res.status(200).json({
      success: true,
      serviceRequests: requests,
    });
  } catch (error) {
    console.error("Get all service requests error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch service requests",
    });
  }
};

const getServiceRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    const [requests] = await db.query(
      `
        SELECT
          sr.*,
          c.company_name,
          c.contact_name,
          c.contact_phone,
          u.email AS company_email
        FROM service_requests sr
        JOIN companies c ON sr.company_id = c.id
        JOIN users u ON c.user_id = u.id
        WHERE sr.id = ?
      `,
      [id]
    );

    if (requests.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Service request not found",
      });
    }

    const request = requests[0];

    if (req.user.role === "COMPANY") {
      const company = await getCompanyByUserId(req.user.userId);

      if (!company || request.company_id !== company.id) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }
    }

    return res.status(200).json({
      success: true,
      serviceRequest: request,
    });
  } catch (error) {
    console.error("Get service request by id error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch service request",
    });
  }
};

const updateServiceRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const normalizedStatus = status.toUpperCase();

    if (!STATUSES.includes(normalizedStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
        allowedStatuses: STATUSES,
      });
    }

    const [result] = await db.query(
      `
        UPDATE service_requests
        SET status = ?, admin_notes = ?
        WHERE id = ?
      `,
      [normalizedStatus, adminNotes || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Service request not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Service request status updated successfully",
      serviceRequest: {
        id,
        status: normalizedStatus,
        adminNotes: adminNotes || null,
      },
    });
  } catch (error) {
    console.error("Update service request status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update service request status",
    });
  }
};

module.exports = {
  createServiceRequest,
  getCompanyServiceRequests,
  getAllServiceRequests,
  getServiceRequestById,
  updateServiceRequestStatus,
};