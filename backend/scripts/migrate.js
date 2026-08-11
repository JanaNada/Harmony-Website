/**
 * Apply the scheduling + chat migration.
 *
 *   node scripts/migrate.js
 *
 * Safe to run more than once: every step checks before it changes anything,
 * and no existing table is dropped.
 */
require("dotenv").config();

const fs = require("fs");
const path = require("path");
const db = require("../src/config/db");

const MIGRATION = path.join(__dirname, "..", "src", "database", "migrations", "002_scheduling_and_chat.sql");

async function columnExists(table, column) {
  const [rows] = await db.query(
    `SELECT 1 FROM information_schema.columns
      WHERE table_schema = DATABASE() AND table_name = ? AND column_name = ?`,
    [table, column]
  );
  return rows.length > 0;
}

async function main() {
  const sql = fs.readFileSync(MIGRATION, "utf8");

  // Strip comments, then split on statement boundaries.
  const statements = sql
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n")
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);

  for (const statement of statements) {
    const label = statement.split("\n")[0].slice(0, 70);
    await db.query(statement);
    console.log(`  ok  ${label}`);
  }

  // MySQL has no ADD COLUMN IF NOT EXISTS, so guard this one by hand.
  if (await columnExists("service_requests", "slot_id")) {
    console.log("  ok  service_requests.slot_id already present");
  } else {
    await db.query("ALTER TABLE `service_requests` ADD COLUMN `slot_id` int DEFAULT NULL");
    await db.query(
      "ALTER TABLE `service_requests` ADD CONSTRAINT `fk_request_slot` " +
        "FOREIGN KEY (`slot_id`) REFERENCES `availability_slots` (`id`)"
    );
    console.log("  ok  added service_requests.slot_id");
  }

  console.log("\nMigration complete.");
  await db.end();
}

main().catch((err) => {
  console.error("\nMigration failed:", err.message);
  process.exit(1);
});
