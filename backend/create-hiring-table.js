require('dotenv').config();
const db = require("./src/config/db");

async function main() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS hiring_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        requestor_name VARCHAR(255) NOT NULL,
        department VARCHAR(255),
        job_title VARCHAR(255),
        date_of_request DATE,
        position_title VARCHAR(255) NOT NULL,
        employment_type VARCHAR(50),
        work_location VARCHAR(255),
        positions_needed INT,
        desired_start_date DATE,
        reporting_to VARCHAR(255),
        job_responsibilities TEXT,
        required_qualifications TEXT,
        preferred_qualifications TEXT,
        proposed_salary_range VARCHAR(255),
        budget_approved BOOLEAN,
        budget_code VARCHAR(255),
        benefits_json JSON,
        status VARCHAR(50) DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await db.query(query);
    console.log("Table created successfully");
  } catch (err) {
    console.error("Error creating table:", err);
  } finally {
    process.exit();
  }
}

main();
