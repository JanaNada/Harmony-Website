require("dotenv").config();

const app = require("./app");
const db = require("./config/db");

const PORT = process.env.PORT; // 3000 for frontend

async function startServer() {
  try {
    const [rows] = await db.query("SHOW TABLES");

    console.log("Connected database:", process.env.DB_NAME);
    console.log("Tables found:", rows);
    console.log("MySQL connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to MySQL:", error.message);
    process.exit(1);
  }
}

startServer();