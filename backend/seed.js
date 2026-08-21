const mysql = require("mysql2/promise");
require("dotenv").config();

async function main() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST, port: Number(process.env.DB_PORT),
    user: process.env.DB_USER, password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME, multipleStatements: true,
  });

  try {
    // Add icon column
    const [cols] = await db.query("SHOW COLUMNS FROM services LIKE 'icon'");
    if (cols.length === 0) {
      await db.query("ALTER TABLE services ADD COLUMN icon VARCHAR(100) DEFAULT 'Box'");
      console.log("Added icon column to services table.");
    }
  } catch (err) {
    console.error("Error adding icon column:", err.message);
  }

  const initialServices = [
    { title: "Business Development", tagline: "New Ventures & Running Businesses", description: "We build a business end to end — the place, the design, the product, the team, the systems.", accent_color: "#F5841F", image_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=80", icon: "Building2" },
    { title: "Events", tagline: "Built From Nothing, In A Room", description: "Weddings, corporate nights, concerts. We build the whole thing — centerpiece to stage.", accent_color: "#E91E8C", image_url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=900&q=80", icon: "Calendar" },
    { title: "Marketing", tagline: "The Moment People Remember", description: "Hand someone an ice cream with a chocolate spoon and you've changed the whole experience.", accent_color: "#3AADE0", image_url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=900&q=80", icon: "Megaphone" },
    { title: "Recruitment & Training", tagline: "The People, Ready To Work", description: "We find them, test them, interview them, and train them — before they reach your HR desk.", accent_color: "#78BE1F", image_url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900&q=80", icon: "UserCheck" },
    { title: "F&B Technology", tagline: "Your Own Ordering App", description: "Guests order from the table, pay on their phone, and never queue at the till.", accent_color: "#F5841F", image_url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=900&q=80", icon: "Smartphone" }
  ];

  for (const s of initialServices) {
    const [rows] = await db.query("SELECT id FROM services WHERE title = ?", [s.title]);
    if (rows.length === 0) {
      await db.query("INSERT INTO services (title, tagline, description, accent_color, image_url, icon) VALUES (?, ?, ?, ?, ?, ?)", [s.title, s.tagline, s.description, s.accent_color, s.image_url, s.icon]);
      console.log(`Inserted ${s.title}`);
    }
  }

  await db.end();
  console.log("Done.");
}

main().catch(console.error);
