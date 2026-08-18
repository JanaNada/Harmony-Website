/**
 * Add section support to subservices.
 *
 *   node scripts/migrate-005-subservice-sections.js
 */

require("dotenv").config({
  path: require("path").join(__dirname, "..", ".env"),
});

const db = require("../src/config/db");

async function columnExists(table, column) {
  const [rows] = await db.query(
    `SELECT 1 FROM information_schema.columns
     WHERE table_schema = DATABASE()
       AND table_name = ?
       AND column_name = ?`,
    [table, column]
  );

  return rows.length > 0;
}

async function main() {
  if (!(await columnExists("subservices", "section_title"))) {
    await db.query(
      "ALTER TABLE `subservices` ADD COLUMN `section_title` varchar(255) DEFAULT NULL"
    );
    console.log("  ok  added subservices.section_title");
  } else {
    console.log("  ok  subservices.section_title already present");
  }

  if (!(await columnExists("subservices", "section_sort_order"))) {
    await db.query(
      "ALTER TABLE `subservices` ADD COLUMN `section_sort_order` int NOT NULL DEFAULT 0"
    );
    console.log("  ok  added subservices.section_sort_order");
  } else {
    console.log("  ok  subservices.section_sort_order already present");
  }

  console.log("\nMigration complete.");
  await db.end();
}

main().catch((err) => {
  console.error("\nMigration failed:", err.message);
  process.exit(1);
});