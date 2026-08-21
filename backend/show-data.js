require('dotenv').config();
const db = require("./src/config/db");

async function main() {
  try {
    const [rows] = await db.query("SELECT * FROM services");
    console.log("Services Data:", rows);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    process.exit();
  }
}

main();
