const db = require("../config/db");

const CONTACT_STATUSES = [
  "NEW",
  "READ",
  "REPLIED",
  "ARCHIVED",
];

const createContactMessage = async (req, res) => {
  try {
    const {
      name,
      email,
      company,
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

    const [result] = await db.query(
      `
        INSERT INTO contact_messages
          (
            name,
            email,
            company,
            service_interest,
            message
          )
        VALUES (?, ?, ?, ?, ?)
      `,
      [
        name,
        email,
        company || null,
        serviceInterest || null,
        message,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Contact message sent successfully",
      contactMessage: {
        id: result.insertId,
        name,
        email,
        company: company || null,
        serviceInterest: serviceInterest || null,
        message,
        status: "NEW",
      },
    });
  } catch (error) {
    console.error("Create contact message error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send contact message",
    });
  }
};

const getAllContactMessages = async (req, res) => {
  try {
    const [messages] = await db.query(
      `
        SELECT *
        FROM contact_messages
        ORDER BY created_at DESC
      `
    );

    return res.status(200).json({
      success: true,
      contactMessages: messages,
    });
  } catch (error) {
    console.error("Get all contact messages error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch contact messages",
    });
  }
};

const getContactMessageById = async (req, res) => {
  try {
    const { id } = req.params;

    const [messages] = await db.query(
      `
        SELECT *
        FROM contact_messages
        WHERE id = ?
      `,
      [id]
    );

    if (messages.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found",
      });
    }

    return res.status(200).json({
      success: true,
      contactMessage: messages[0],
    });
  } catch (error) {
    console.error("Get contact message by id error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch contact message",
    });
  }
};

const updateContactMessageStatus = async (req, res) => {
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

    if (!CONTACT_STATUSES.includes(normalizedStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
        allowedStatuses: CONTACT_STATUSES,
      });
    }

    const [result] = await db.query(
      `
        UPDATE contact_messages
        SET status = ?, admin_notes = ?
        WHERE id = ?
      `,
      [normalizedStatus, adminNotes || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contact message status updated successfully",
      contactMessage: {
        id,
        status: normalizedStatus,
        adminNotes: adminNotes || null,
      },
    });
  } catch (error) {
    console.error("Update contact message status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update contact message status",
    });
  }
};

module.exports = {
  createContactMessage,
  getAllContactMessages,
  getContactMessageById,
  updateContactMessageStatus,
};