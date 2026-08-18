/**
 * Normalize service sections into their own table and backfill existing data.
 *
 *   node scripts/migrate-005-service-sections.js
 *
 * This migration is intentionally conservative:
 * - it creates the new table first
 * - copies section rows from the existing subservice text fields
 * - re-links subservices
 * - only then drops the old columns
 */
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const db = require("../src/config/db");

async function columnExists(table, column) {
  const [rows] = await db.query(
    `SELECT 1
       FROM information_schema.columns
      WHERE table_schema = DATABASE()
        AND table_name = ?
        AND column_name = ?`,
    [table, column]
  );
  return rows.length > 0;
}

async function tableExists(table) {
  const [rows] = await db.query(
    `SELECT 1
       FROM information_schema.tables
      WHERE table_schema = DATABASE()
        AND table_name = ?`,
    [table]
  );
  return rows.length > 0;
}

async function main() {
  if (!(await tableExists("service_sections"))) {
    await db.query(`
      CREATE TABLE \`service_sections\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`service_id\` int NOT NULL,
        \`title\` varchar(255) NOT NULL,
        \`sort_order\` int NOT NULL DEFAULT 0,
        \`created_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`idx_service_sections_service_sort\` (\`service_id\`, \`sort_order\`, \`id\`),
        CONSTRAINT \`service_sections_service_fk\`
          FOREIGN KEY (\`service_id\`) REFERENCES \`services\` (\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
    `);
    console.log("  ok  created service_sections table");
  } else {
    console.log("  ok  service_sections table already present");
  }

  if (!(await columnExists("subservices", "section_id"))) {
    await db.query("ALTER TABLE `subservices` ADD COLUMN `section_id` int DEFAULT NULL");
    console.log("  ok  added subservices.section_id");
  } else {
    console.log("  ok  subservices.section_id already present");
  }

  const [subservices] = await db.query(
    `SELECT id, service_id, section_title, section_sort_order
       FROM subservices
      ORDER BY service_id ASC, COALESCE(section_sort_order, 0) ASC, id ASC`
  );

  const sectionMap = new Map();

  for (const row of subservices) {
    const title = row.section_title ? row.section_title.trim() : "";
    if (!title) continue;

    const key = `${row.service_id}::${title}`;
    if (!sectionMap.has(key)) {
      const [existing] = await db.query(
        `SELECT id
           FROM service_sections
          WHERE service_id = ? AND title = ?
          LIMIT 1`,
        [row.service_id, title]
      );

      if (existing.length > 0) {
        sectionMap.set(key, existing[0].id);
      } else {
        const [inserted] = await db.query(
          `INSERT INTO service_sections (service_id, title, sort_order)
           VALUES (?, ?, ?)`,
          [row.service_id, title, row.section_sort_order || 0]
        );
        sectionMap.set(key, inserted.insertId);
      }
    }

    const sectionId = sectionMap.get(key);
    await db.query("UPDATE subservices SET section_id = ? WHERE id = ?", [sectionId, row.id]);
  }

  const [rowsWithoutSection] = await db.query(
    `SELECT id, service_id
       FROM subservices
      WHERE section_id IS NULL
      ORDER BY service_id ASC, id ASC`
  );

  for (const row of rowsWithoutSection) {
    const [existing] = await db.query(
      `SELECT id
         FROM service_sections
        WHERE service_id = ? AND title = ?
        LIMIT 1`,
      [row.service_id, "General"]
    );

    let sectionId;
    if (existing.length > 0) {
      sectionId = existing[0].id;
    } else {
      const [inserted] = await db.query(
        `INSERT INTO service_sections (service_id, title, sort_order)
         VALUES (?, ?, ?)`,
        [row.service_id, "General", 0]
      );
      sectionId = inserted.insertId;
    }
    await db.query("UPDATE subservices SET section_id = ? WHERE id = ?", [sectionId, row.id]);
  }

  await db.query(
    `UPDATE service_sections s
        JOIN (
          SELECT service_id, title, MIN(sort_order) AS sort_order
            FROM service_sections
           GROUP BY service_id, title
        ) dedup
          ON dedup.service_id = s.service_id
         AND dedup.title = s.title
       SET s.sort_order = dedup.sort_order`
  );

  await db.query(
    "ALTER TABLE `subservices` MODIFY COLUMN `section_id` int NOT NULL"
  );

  if (await columnExists("subservices", "section_title")) {
    await db.query("ALTER TABLE `subservices` DROP COLUMN `section_title`");
    console.log("  ok  dropped subservices.section_title");
  }

  if (await columnExists("subservices", "section_sort_order")) {
    await db.query("ALTER TABLE `subservices` DROP COLUMN `section_sort_order`");
    console.log("  ok  dropped subservices.section_sort_order");
  }

  console.log("\nMigration complete.");
  await db.end();
}

main().catch((err) => {
  console.error("\nMigration failed:", err.message);
  process.exit(1);
});
