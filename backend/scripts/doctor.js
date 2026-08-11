/**
 * Check that this machine is set up correctly.
 *
 *   node backend/scripts/doctor.js
 *
 * Reports what's working, what isn't, and what to do about it. Safe to run at
 * any time; it only reads.
 */
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const fs = require("fs");
const path = require("path");
const http = require("http");

const ENV_FILE = path.join(__dirname, "..", ".env");

const problems = [];
const ok = (m) => console.log(`  OK    ${m}`);
const bad = (m, fix) => { console.log(`  FAIL  ${m}`); problems.push(fix); };
const warn = (m) => console.log(`  WARN  ${m}`);

/** GET a URL, resolving to a status code or null if nothing is listening. */
function probe(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => { res.resume(); resolve(res.statusCode); });
    req.on("error", () => resolve(null));
    req.setTimeout(4000, () => { req.destroy(); resolve(null); });
  });
}

async function main() {
  console.log("\nHarmony setup check\n");

  // ── 1. Node version ──────────────────────────────────────────────────────
  console.log("Node");
  const major = Number(process.versions.node.split(".")[0]);
  const minor = Number(process.versions.node.split(".")[1]);
  if (major > 20 || (major === 20 && minor >= 9)) {
    ok(`Node ${process.versions.node}`);
  } else {
    bad(
      `Node ${process.versions.node} is too old — this project needs 20.9 or newer`,
      "Install Node 20 LTS or newer from nodejs.org, then delete node_modules and run the installs again.\n" +
      "  This is the usual cause of 'the page loads but nothing is clickable'."
    );
  }

  // ── 2. Env file ──────────────────────────────────────────────────────────
  console.log("\nConfiguration");
  if (!fs.existsSync(ENV_FILE)) {
    bad("backend/.env is missing", "Copy backend/.env.example to backend/.env and fill in DB_PASSWORD and JWT_SECRET.");
  } else {
    ok("backend/.env exists");

    const { DB_PASSWORD, JWT_SECRET, DB_NAME, PORT } = process.env;

    if (!DB_PASSWORD || DB_PASSWORD === "your_mysql_password_here") {
      bad("DB_PASSWORD is still the template value", "Set DB_PASSWORD in backend/.env to your own MySQL root password.");
    } else ok("DB_PASSWORD is set");

    if (!JWT_SECRET || JWT_SECRET === "change_me_to_a_long_random_string") {
      bad("JWT_SECRET is still the template value", "Set JWT_SECRET in backend/.env to any long random string of your own.");
    } else ok("JWT_SECRET is set");

    ok(`database name: ${DB_NAME || "harmony_db"}, API port: ${PORT || 4000}`);
  }

  // ── 3. Database ──────────────────────────────────────────────────────────
  console.log("\nDatabase");
  let db;
  try {
    const mysql = require("mysql2/promise");
    db = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "harmony_db",
    });
    ok("connected to MySQL");

    const [tables] = await db.query("SHOW TABLES");
    if (tables.length >= 10) ok(`${tables.length} tables present`);
    else bad(`only ${tables.length} tables found, expected 10`, "Run: node backend/scripts/setup-db.js");

    const [[admins]] = await db.query("SELECT COUNT(*) AS n FROM users WHERE role = 'ADMIN' AND is_active = 1");
    if (admins.n > 0) ok(`${admins.n} active admin account(s)`);
    else bad("no admin account", "Run: node backend/scripts/setup-db.js --admin you@harmony.com --password yourpassword");
  } catch (err) {
    if (err.code === "ECONNREFUSED") {
      bad("MySQL is not running", "Start MySQL. On Windows: open Services and start MySQL80. On macOS: brew services start mysql");
    } else if (err.code === "ER_ACCESS_DENIED_ERROR") {
      bad("MySQL refused the password", "DB_PASSWORD in backend/.env does not match your MySQL root password.");
    } else if (err.code === "ER_BAD_DB_ERROR") {
      bad("the database does not exist yet", "Run: node backend/scripts/setup-db.js --admin you@harmony.com --password yourpassword");
    } else {
      bad(`database error: ${err.message}`, "Check backend/.env against your MySQL setup.");
    }
  } finally {
    if (db) await db.end();
  }

  // ── 4. Servers ───────────────────────────────────────────────────────────
  console.log("\nServers");
  const apiPort = process.env.PORT || 4000;
  const api = await probe(`http://localhost:${apiPort}/api/catalog`);
  if (api) ok(`API is running on port ${apiPort}`);
  else bad(`nothing is answering on port ${apiPort}`, `Start the API in its own terminal: npm --prefix backend start`);

  const web = await probe("http://localhost:3000/about");
  if (web === 200) ok("website is running on port 3000");
  else if (web) warn(`website answered with ${web} on port 3000`);
  else bad("nothing is answering on port 3000", "Start the website in its own terminal: npm run dev");

  // Does the site actually reach the API through its proxy?
  if (web && api) {
    const proxied = await probe("http://localhost:3000/api/catalog");
    if (proxied) ok("the website can reach the API");
    else bad("the website cannot reach the API", "Make sure the API port matches PORT in backend/.env.");
  }

  // ── Verdict ──────────────────────────────────────────────────────────────
  console.log("");
  if (problems.length === 0) {
    console.log("Everything checks out. Open http://localhost:3000\n");
  } else {
    console.log(`${problems.length} thing(s) to fix:\n`);
    problems.forEach((p, i) => console.log(`  ${i + 1}. ${p}\n`));
  }
}

main().catch((err) => {
  console.error("\nThe check itself failed:", err.message);
  process.exit(1);
});
