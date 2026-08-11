/**
 * Move chat from being company-wide to belonging to a specific booked request.
 *
 *   node scripts/migrate-003-chat-per-request.js
 *
 * Chat should only exist once there is an appointment to talk about, so a
 * message now hangs off a service_request rather than a company. Existing
 * messages are attached to that company's earliest request; any that can't be
 * matched (a company with no requests at all) are removed, since there is no
 * longer anywhere for them to live.
 */
// Resolved against this file, not the shell's directory, so the script works
// whether it's run from the repo root or from inside backend/.
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const db = require("../src/config/db");

async function columnExists(table, column) {
  const [rows] = await db.query(
    `SELECT 1 FROM information_schema.columns
      WHERE table_schema = DATABASE() AND table_name = ? AND column_name = ?`,
    [table, column]
  );
  return rows.length > 0;
}

async function constraintExists(name) {
  const [rows] = await db.query(
    `SELECT 1 FROM information_schema.table_constraints
      WHERE table_schema = DATABASE() AND constraint_name = ?`,
    [name]
  );
  return rows.length > 0;
}

async function main() {
  if (await columnExists("messages", "service_request_id")) {
    console.log("  ok  messages.service_request_id already present — nothing to do");
    await db.end();
    return;
  }

  await db.query("ALTER TABLE `messages` ADD COLUMN `service_request_id` int DEFAULT NULL");
  console.log("  ok  added messages.service_request_id");

  const [backfill] = await db.query(
    `UPDATE messages m
       JOIN (SELECT company_id, MIN(id) AS request_id
               FROM service_requests GROUP BY company_id) r
         ON r.company_id = m.company_id
        SET m.service_request_id = r.request_id`
  );
  console.log(`  ok  attached ${backfill.affectedRows} existing message(s) to a request`);

  const [orphans] = await db.query("DELETE FROM messages WHERE service_request_id IS NULL");
  if (orphans.affectedRows > 0) {
    console.log(`  ok  removed ${orphans.affectedRows} message(s) with no request to belong to`);
  }

  await db.query("ALTER TABLE `messages` MODIFY COLUMN `service_request_id` int NOT NULL");
  await db.query(
    "ALTER TABLE `messages` ADD CONSTRAINT `fk_message_request` " +
      "FOREIGN KEY (`service_request_id`) REFERENCES `service_requests` (`id`) ON DELETE CASCADE"
  );
  console.log("  ok  service_request_id is now required");

  // company_id is redundant now that the request identifies the company.
  if (await constraintExists("fk_message_company")) {
    await db.query("ALTER TABLE `messages` DROP FOREIGN KEY `fk_message_company`");
  }
  await db.query("ALTER TABLE `messages` DROP COLUMN `company_id`");
  console.log("  ok  dropped the old company_id column");

  console.log("\nMigration complete.");
  await db.end();
}

main().catch((err) => {
  console.error("\nMigration failed:", err.message);
  process.exit(1);
});
