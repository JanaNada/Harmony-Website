require('dotenv').config();
const db = require("./src/config/db");

async function main() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS service_metrics (
        service_id VARCHAR(50) PRIMARY KEY,
        view_count INT NOT NULL DEFAULT 0,
        last_viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log("Created service_metrics table successfully.");
  } catch (err) {
    console.error("Error creating table:", err);
  } finally {
    process.exit();
  }
}

main();
