const db = require("../config/db");

/**
 * Chat attached to one booked request.
 *
 * There is deliberately no thread until a request exists — the conversation is
 * about a specific appointment, so it starts when that appointment is booked.
 *
 * Admins may open any request's thread; a company only ever reaches its own.
 */
const resolveRequestAccess = async (user, requestId) => {
  const [rows] = await db.query(
    `SELECT r.id, r.company_id, c.user_id
       FROM service_requests r
       JOIN companies c ON c.id = r.company_id
      WHERE r.id = ?`,
    [requestId]
  );

  if (rows.length === 0) return { allowed: false, notFound: true };
  // Coordinators chat with clients too, so both staff roles reach any thread.
  if (user.role === "ADMIN" || user.role === "COORDINATOR") return { allowed: true };
  return { allowed: rows[0].user_id === user.userId };
};

/**
 * Messages for a thread. Pass ?after=<id> to fetch only what's new — that's
 * what the polling client uses so it isn't re-downloading the whole history
 * every few seconds.
 */
const listMessages = async (req, res) => {
  try {
    const { requestId } = req.params;
    const after = Number(req.query.after) || 0;

    const access = await resolveRequestAccess(req.user, requestId);
    if (access.notFound) return res.status(404).json({ success: false, message: "Request not found" });
    if (!access.allowed) return res.status(403).json({ success: false, message: "Access denied" });

    const [rows] = await db.query(
      `SELECT m.id, m.body, m.created_at, m.sender_user_id, u.role AS sender_role, u.email AS sender_email
       FROM messages m
       JOIN users u ON u.id = m.sender_user_id
       WHERE m.service_request_id = ? AND m.id > ?
       ORDER BY m.id ASC`,
      [requestId, after]
    );

    // Anything the other side sent is now on screen, so mark it read.
    await db.query(
      `UPDATE messages SET read_at = NOW()
       WHERE service_request_id = ? AND read_at IS NULL AND sender_user_id <> ?`,
      [requestId, req.user.userId]
    );

    return res.status(200).json({
      success: true,
      messages: rows.map((m) => ({
        id: m.id,
        body: m.body,
        createdAt: m.created_at,
        senderUserId: m.sender_user_id,
        senderRole: m.sender_role,
        senderEmail: m.sender_email,
        mine: m.sender_user_id === req.user.userId,
      })),
    });
  } catch (error) {
    console.error("listMessages error:", error);
    return res.status(500).json({ success: false, message: "Failed to load messages" });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { requestId } = req.params;
    const body = (req.body?.body || "").trim();

    if (!body) {
      return res.status(400).json({ success: false, message: "Message cannot be empty" });
    }

    const access = await resolveRequestAccess(req.user, requestId);
    if (access.notFound) return res.status(404).json({ success: false, message: "Request not found" });
    if (!access.allowed) return res.status(403).json({ success: false, message: "Access denied" });

    const [result] = await db.query(
      "INSERT INTO messages (service_request_id, sender_user_id, body) VALUES (?, ?, ?)",
      [requestId, req.user.userId, body]
    );

    return res.status(201).json({ success: true, id: result.insertId });
  } catch (error) {
    console.error("sendMessage error:", error);
    return res.status(500).json({ success: false, message: "Failed to send message" });
  }
};

/** Unread counts per request, for badges next to each appointment. */
const getUnreadCounts = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT m.service_request_id AS requestId, COUNT(*) AS unread
         FROM messages m
         JOIN service_requests r ON r.id = m.service_request_id
         JOIN companies c ON c.id = r.company_id
        WHERE m.read_at IS NULL
          AND m.sender_user_id <> ?
          AND (? IN ('ADMIN','COORDINATOR') OR c.user_id = ?)
        GROUP BY m.service_request_id`,
      [req.user.userId, req.user.role, req.user.userId]
    );
    return res.status(200).json({ success: true, unread: rows });
  } catch (error) {
    console.error("getUnreadCounts error:", error);
    return res.status(500).json({ success: false, message: "Failed to load unread counts" });
  }
};

module.exports = { listMessages, sendMessage, getUnreadCounts };
