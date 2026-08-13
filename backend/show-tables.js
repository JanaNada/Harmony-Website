require('dotenv').config();
const db = require("./src/config/db");

async function main() {
  try {
    const [tables] = await db.query("SHOW TABLES");
    console.log("Tables:", tables);
    
    // If services table exists, show its columns
    const hasServices = tables.some(t => Object.values(t)[0] === 'services');
    if (hasServices) {
      const [columns] = await db.query("SHOW COLUMNS FROM services");
      console.log("Services Columns:", columns);
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    process.exit();
  }
}

main();
