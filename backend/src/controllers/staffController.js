const bcrypt = require("bcrypt");
const db = require("../config/db");

/**
 * Staff accounts.
 *
 * Two roles:
 *   ADMIN       — everything, including opening up availability and the catalogue
 *   COORDINATOR — client-facing only: contact clients, approve meetings, chat.
 *                 Deliberately cannot publish meeting times.
 *
 * Only an ADMIN may manage these accounts.
 */

const STAFF_ROLES = ["ADMIN", "COORDINATOR"];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const listStaff = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, email, role, is_active, created_at
         FROM users
        WHERE role IN ('ADMIN','COORDINATOR')
        ORDER BY role ASC, created_at ASC`
    );

    return res.status(200).json({
      success: true,
      staff: rows.map((u) => ({
        id: u.id,
        email: u.email,
        role: u.role,
        isActive: !!u.is_active,
        createdAt: u.created_at,
        isYou: u.id === req.user.userId,
      })),
    });
  } catch (error) {
    console.error("listStaff error:", error);
    return res.status(500).json({ success: false, message: "Failed to load staff" });
  }
};

const createStaff = async (req, res) => {
  try {
    const email = req.body?.email?.trim().toLowerCase();
    const password = req.body?.password?.trim();
    const { role } = req.body;

    if (!email || !EMAIL.test(email)) {
      return res.status(400).json({ success: false, message: "Enter a valid email address" });
    }
    if (!password || password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
    }
    if (!STAFF_ROLES.includes(role)) {
      return res.status(400).json({ success: false, message: "Role must be ADMIN or COORDINATOR" });
    }

    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: "An account with that email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)",
      [email, passwordHash, role]
    );

    return res.status(201).json({ success: true, id: result.insertId, email, role });
  } catch (error) {
    console.error("createStaff error:", error);
    return res.status(500).json({ success: false, message: "Failed to create the account" });
  }
};

/** Change a staff member's role, reset their password, or deactivate them. */
const updateStaff = async (req, res) => {
  try {
    const { role, isActive } = req.body;
    const password = req.body?.password?.trim();
    const targetId = Number(req.params.id);

    const [rows] = await db.query(
      "SELECT id, role FROM users WHERE id = ? AND role IN ('ADMIN','COORDINATOR')",
      [targetId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Staff account not found" });
    }

    /* Guard against an admin locking everyone out: you can't demote or
       deactivate yourself, and the last active admin must stay an admin. */
    const changingSelf = targetId === req.user.userId;
    const losingAdmin = rows[0].role === "ADMIN" && (role === "COORDINATOR" || isActive === false);

    if (changingSelf && (role === "COORDINATOR" || isActive === false)) {
      return res.status(409).json({
        success: false,
        message: "You can't remove your own admin access. Ask another admin to do it.",
      });
    }

    if (losingAdmin) {
      const [[{ admins }]] = await db.query(
        "SELECT COUNT(*) AS admins FROM users WHERE role = 'ADMIN' AND is_active = 1"
      );
      if (admins <= 1) {
        return res.status(409).json({
          success: false,
          message: "That's the last active admin — promote someone else first.",
        });
      }
    }

    const sets = [];
    const params = [];

    if (role !== undefined) {
      if (!STAFF_ROLES.includes(role)) {
        return res.status(400).json({ success: false, message: "Role must be ADMIN or COORDINATOR" });
      }
      sets.push("role = ?");
      params.push(role);
    }
    if (isActive !== undefined) {
      sets.push("is_active = ?");
      params.push(isActive ? 1 : 0);
    }
    if (password) {
      if (password.length < 8) {
        return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
      }
      sets.push("password_hash = ?");
      params.push(await bcrypt.hash(password, 10));
    }

    if (sets.length === 0) return res.status(200).json({ success: true });

    params.push(targetId);
    await db.query(`UPDATE users SET ${sets.join(", ")} WHERE id = ?`, params);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("updateStaff error:", error);
    return res.status(500).json({ success: false, message: "Failed to update the account" });
  }
};

module.exports = { listStaff, createStaff, updateStaff };
