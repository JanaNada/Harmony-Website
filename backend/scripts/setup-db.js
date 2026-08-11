/**
 * One-command database setup for a fresh machine.
 *
 *   node scripts/setup-db.js
 *
 * Creates the database if it doesn't exist, builds every table from
 * schema-full.sql, and optionally creates a first admin account:
 *
 *   node scripts/setup-db.js --admin you@harmony.com --password yourpassword
 *
 * Existing tables are left alone, so this is safe to re-run.
 */
// Resolved against this file, not the shell's directory, so the script works
// whether it's run from the repo root or from inside backend/.
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");

const SCHEMA = path.join(__dirname, "..", "src", "database", "schema-full.sql");

function arg(name) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 ? process.argv[i + 1] : null;
}

async function main() {
  const {
    DB_HOST = "localhost",
    DB_PORT = "3306",
    DB_USER = "root",
    DB_PASSWORD = "",
    DB_NAME = "harmony_db",
  } = process.env;

  if (!fs.existsSync(SCHEMA)) {
    throw new Error(`Schema file missing: ${SCHEMA}`);
  }

  // Connect without a database first — it may not exist yet.
  const root = await mysql.createConnection({
    host: DB_HOST, port: Number(DB_PORT), user: DB_USER, password: DB_PASSWORD,
    multipleStatements: true,
  });

  await root.query(
    `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`
       CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci`
  );
  console.log(`  ok  database "${DB_NAME}" ready`);
  await root.end();

  const db = await mysql.createConnection({
    host: DB_HOST, port: Number(DB_PORT), user: DB_USER, password: DB_PASSWORD,
    database: DB_NAME, multipleStatements: true,
  });

  const [before] = await db.query("SHOW TABLES");
  if (before.length > 0) {
    console.log(`  ..  ${before.length} table(s) already present — leaving them as they are`);
  }

  /* The dump has no DROP statements and every CREATE is guarded, so running
     this against a populated database won't touch existing data. */
  const sql = fs
    .readFileSync(SCHEMA, "utf8")
    .replace(/CREATE TABLE `/g, "CREATE TABLE IF NOT EXISTS `");

  await db.query(sql);

  const [after] = await db.query("SHOW TABLES");
  console.log(`  ok  ${after.length} tables in place`);

  const email = arg("admin");
  const password = arg("password");

  if (email && password) {
    const clean = email.trim().toLowerCase();
    if (password.trim().length < 8) {
      throw new Error("Admin password must be at least 8 characters");
    }

    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [clean]);
    const hash = await bcrypt.hash(password.trim(), 10);

    if (existing.length > 0) {
      await db.query("UPDATE users SET password_hash = ?, role = 'ADMIN', is_active = 1 WHERE email = ?", [hash, clean]);
      console.log(`  ok  updated admin ${clean}`);
    } else {
      await db.query("INSERT INTO users (email, password_hash, role) VALUES (?, ?, 'ADMIN')", [clean, hash]);
      console.log(`  ok  created admin ${clean}`);
    }
  } else {
    console.log("  ..  no admin created — pass --admin <email> --password <password> to make one");
  }

  await db.end();
  console.log("\nSetup complete. Start the API with:  npm start");
}

main().catch((err) => {
  console.error("\nSetup failed:", err.message);
  if (err.code === "ER_ACCESS_DENIED_ERROR") {
    console.error("Check DB_USER and DB_PASSWORD in backend/.env");
  }
  if (err.code === "ECONNREFUSED") {
    console.error("MySQL isn't reachable. Is the MySQL service running?");
  }
  process.exit(1);
});
