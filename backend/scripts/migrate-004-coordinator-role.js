/**
 * Add the COORDINATOR staff role.
 *
 *   node scripts/migrate-004-coordinator-role.js
 *
 * A coordinator handles clients — contacting them, approving meetings and
 * chatting — but cannot open up availability or manage the catalogue. Adding
 * to the enum is additive; existing ADMIN and COMPANY rows are untouched.
 */
require("dotenv").config();

const db = require("../src/config/db");

async function main() {
  const [[column]] = await db.query(
    `SELECT COLUMN_TYPE AS type FROM information_schema.columns
      WHERE table_schema = DATABASE() AND table_name = 'users' AND column_name = 'role'`
  );

  if (column.type.includes("COORDINATOR")) {
    console.log("  ok  COORDINATOR already in the role enum — nothing to do");
    await db.end();
    return;
  }

  await db.query(
    "ALTER TABLE `users` MODIFY COLUMN `role` enum('ADMIN','COORDINATOR','COMPANY') NOT NULL"
  );
  console.log("  ok  role enum is now ADMIN / COORDINATOR / COMPANY");

  const [[counts]] = await db.query(
    `SELECT SUM(role='ADMIN') AS admins, SUM(role='COMPANY') AS companies FROM users`
  );
  console.log(`  ok  existing rows intact: ${counts.admins} admin(s), ${counts.companies} company account(s)`);

  console.log("\nMigration complete.");
  await db.end();
}

main().catch((err) => {
  console.error("\nMigration failed:", err.message);
  process.exit(1);
});
