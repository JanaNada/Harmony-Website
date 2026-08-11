/**
 * Set (or reset) a user's password.
 *
 *   node scripts/set-password.js <email> <password> [role]
 *
 * Creates the user if the email is new, otherwise updates the existing row.
 * Credentials are passed as arguments so they never live in the repo.
 */
// Resolved against this file, not the shell's directory, so the script works
// whether it's run from the repo root or from inside backend/.
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const bcrypt = require("bcrypt");
const db = require("../src/config/db");

async function main() {
  const [rawEmail, rawPassword, role = "ADMIN"] = process.argv.slice(2);

  if (!rawEmail || !rawPassword) {
    console.error("Usage: node scripts/set-password.js <email> <password> [role]");
    process.exit(1);
  }

  // Trim to match how login compares them, so a password can never be stored
  // with surrounding whitespace that nobody could then type.
  const email = rawEmail.trim();
  const password = rawPassword.trim();

  const passwordHash = await bcrypt.hash(password, 10);

  const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [email]);

  if (existing.length > 0) {
    await db.query(
      "UPDATE users SET password_hash = ?, role = ?, is_active = 1 WHERE email = ?",
      [passwordHash, role, email]
    );
    console.log(`Updated password for ${email} (role ${role}, id ${existing[0].id})`);
  } else {
    const [result] = await db.query(
      "INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)",
      [email, passwordHash, role]
    );
    console.log(`Created ${email} (role ${role}, id ${result.insertId})`);
  }

  await db.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
