const mysql = require("mysql2/promise");
require("dotenv").config();

// We need to fetch the hardcoded services to seed their subservices
const SERVICES = [
  {
    title: "Business Development",
    modules: [
      { label: "Site Selection & Scouting", desc: "We find and assess the location, foot traffic, and lease terms.", long: "We shortlist locations against your concept and budget, study the catchment and competition around each one, and pressure-test the numbers before anything is signed. We sit in on the lease negotiation so the terms don't quietly eat your first two years.", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=80" },
      { label: "Feasibility & Concept", desc: "Market study, positioning, and the numbers behind the idea.", long: "Before you spend money, we tell you honestly whether the idea works. Market research, competitor mapping, positioning, projected covers and a full financial model — so you're deciding on evidence instead of optimism.", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&q=80" },
      { label: "Interior Design", desc: "Full design of the space, flow, and atmosphere.", long: "We design the room around how it actually has to work — where guests enter, how they move, where staff need to be, and how many people you can seat without it feeling crowded. Drawings, materials, lighting and finishes all included.", image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?w=900&q=80" },
      { label: "Furniture & Fit-Out", desc: "Sourcing and installing everything that goes in the room.", long: "We source, negotiate and install every physical thing in the space — furniture, fixtures, lighting, signage. We manage the contractors and the delivery schedule so the fit-out lands on the date you're supposed to open.", image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?w=900&q=80" },
      { label: "Kitchen & Back of House", desc: "A back of house laid out for the menu it has to produce.", long: "We design the production area around your actual menu and volume, specify and source the equipment, and lay out the flow so your team isn't walking into each other during service. Includes storage, prep and waste handling.", image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&q=80" },
      { label: "Recipe & Menu Development", desc: "We create the dishes, cost them, and make them repeatable.", long: "Our chefs build the menu from scratch — developing the dishes, costing every plate to protect your margin, and writing the specs so it tastes the same on a Tuesday afternoon as it does on a Saturday night. Includes tastings and staff training on execution.", image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=900&q=80" },
      { label: "Staffing the Operation", desc: "Building the team that runs the floor and the kitchen.", long: "We work out the roles you actually need, what they should be paid, and how the shifts should be structured — then we fill them. Covers management, kitchen and front of house, ready for opening day.", image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900&q=80" },
      { label: "Operations Setup & SOPs", desc: "The systems, standards, and daily routines that hold it together.", long: "We write the operating manual for your business: opening and closing procedures, service standards, stock control, supplier terms, hygiene routines and reporting. The point is that it runs properly when you're not in the building.", image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=80" },
      { label: "Audit & Turnaround", desc: "For a business already open: find what's leaking and fix it.", long: "We come in, watch how it actually runs, and give you a straight assessment of where the money and the quality are going. Then we fix it — costs, menu, staffing, layout or process — and stay long enough to prove the change held.", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80" }
    ]
  },
  {
    title: "Events",
    modules: [
      { label: "Full Event Production", desc: "We design and build the whole event, start to finish.", long: "You tell us the occasion and the feeling you want; we handle everything else. Concept, design, build, suppliers, schedule and a team on site running the day so you're a guest at your own event rather than a project manager.", image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=900&q=80" },
      { label: "Décor & Centerpieces", desc: "Every table, every surface, every detail people photograph.", long: "We design and build the styling — centerpieces, table settings, florals, backdrops, entrances and the small details guests notice up close. Made for your event specifically, not pulled off a rental shelf.", image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=900&q=80" },
      { label: "Stage, Sound & Lighting", desc: "Stage build and full technical production.", long: "Stage design and construction, sound system, lighting design, screens and rigging — specified for the venue and the size of the crowd, installed and operated by a technical crew who stay for the whole event.", image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=900&q=80" },
      { label: "Venue Sourcing", desc: "We find and negotiate the right space.", long: "We shortlist venues that fit your guest count, budget and the tone of the occasion, arrange the viewings, and negotiate the contract — including the things people forget to check, like load-in access and noise curfews.", image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?w=900&q=80" },
      { label: "Catering", desc: "From a coffee break to a thousand-seat gala dinner.", long: "Menus built for your event and your guests, cooked and served to international hygiene standards. We handle the logistics that make catering at scale actually work — timing, holding, plating and service flow — so food reaches the table properly.", image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&q=80" },
      { label: "Bar & Beverage Service", desc: "Bar setup, drinks menu, and the people pouring.", long: "Full bar build and service: drinks list designed to the occasion, glassware, ice and stock logistics, and trained bartenders. We size it to the crowd so there's never a twenty-minute queue at the bar.", image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&q=80" },
      { label: "Event Staffing", desc: "Service staff, hosts, and supervisors for the day.", long: "Briefed, uniformed and supervised teams for the event — waiters, hosts, runners and floor supervisors. They're trained on your specific run sheet before they arrive, not handed a clipboard on the day.", image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900&q=80" },
      { label: "Guest Management", desc: "Invitations, RSVPs, seating, and check-in.", long: "We run the guest list end to end — invitations, RSVP tracking, seating plans, name cards and check-in on the door. You get a clean list of who's coming and no bottleneck at the entrance.", image: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=900&q=80" },
      { label: "Entertainment Booking", desc: "Artists, bands, DJs, and performers.", long: "We source and book the talent, handle the contracts and fees, and manage their technical requirements and timings on the day so the programme runs when it's supposed to.", image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=900&q=80" }
    ]
  },
  {
    title: "Marketing",
    modules: [
      { label: "Experiential Touchpoints", desc: "The chocolate spoon in the ice cream. The detail nobody expected.", long: "We design the small physical surprises that come with your product — the edible spoon, the note in the bag, the thing that arrives with the bill. They cost very little and they're the reason people describe your place to a friend instead of just eating there.", image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=900&q=80" },
      { label: "Packaging & Unboxing", desc: "What it feels like to receive the thing you sell.", long: "Takeaway boxes, bags, cups, sleeves and delivery packaging designed as part of the experience rather than an afterthought. It's the piece of your brand that physically travels home with the customer.", image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=900&q=80" },
      { label: "In-Venue Moments", desc: "Designed reasons for a guest to stop and take a picture.", long: "We build deliberate moments into the space — a wall, a ritual at the table, a way a dish arrives. Done properly, your guests produce better content about you than any agency will, for free.", image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?w=900&q=80" },
      { label: "Social Media Management", desc: "Running your channels, day to day.", long: "We run the accounts properly — content calendar, posting, captions, community management and replies. Consistent presence rather than a burst of activity and then three quiet weeks.", image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=900&q=80" },
      { label: "Reels & Video", desc: "Short-form video built for how people actually scroll.", long: "Shot, edited and formatted for reels and short-form feeds — food in motion, the room filling up, the moment a dish lands. Built to stop a thumb in the first second, not to look nice on a showreel.", image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=900&q=80" },
      { label: "Photography", desc: "Food, venue, and brand photography that sells.", long: "Professional shoots of your food, space and team, art-directed so the images work everywhere you need them — menus, delivery platforms, social, print and press.", image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&q=80" },
      { label: "Brand Identity", desc: "Name, logo, palette, voice, and how it all holds together.", long: "The full identity — naming, logo, colours, typography, tone of voice — plus the guidelines and applications so it stays consistent across menus, signage, uniforms, packaging and social.", image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=900&q=80" },
      { label: "Launch Campaign", desc: "Getting a room full on opening night.", long: "A campaign built around your opening: pre-launch teasers, press and influencer invitations, the opening event itself, and the follow-through in the weeks after so the momentum doesn't die on day three.", image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=900&q=80" },
      { label: "Influencer & PR", desc: "The right people talking about you, for the right reasons.", long: "We identify and manage the creators and press who actually reach your customers, handle the outreach and the visits, and make sure what they publish reflects the experience you've built.", image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=900&q=80" }
    ]
  },
  {
    title: "Recruitment & Training",
    modules: [
      { label: "Talent Acquisition", desc: "Sourcing candidates who actually fit the role.", long: "We search our own database and the open market for people who match the role, the salary and the culture — then screen them before you ever see a CV. You get a shortlist, not a pile of applications.", image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=80" },
      { label: "Assessment & Testing", desc: "Technical tests, so skills are verified before you meet them.", long: "Practical, role-specific testing — a chef cooks, a bartender pours, a manager works through a real scenario. You find out what someone can actually do before you hire them rather than three weeks after.", image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=900&q=80" },
      { label: "Interviewing", desc: "We run first-round interviews and hand you a shortlist.", long: "We conduct the first round, check references and work history, and pass on only the candidates worth your time — with notes on each one so your final interview is a decision, not a discovery.", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&q=80" },
      { label: "Executive Placement", desc: "General managers, head chefs, and senior operators.", long: "Discreet, targeted search for senior roles, including people who aren't actively looking. We manage the approach, the negotiation and the transition, and we back the placement with a replacement guarantee.", image: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=900&q=80" },
      { label: "Chef & Culinary Sourcing", desc: "Kitchen talent, from line cook to executive chef.", long: "Kitchen hiring is its own discipline and we treat it that way. We source across cuisines and levels, test candidates on the pass, and understand the difference between a chef who can cook and one who can run a brigade.", image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&q=80" },
      { label: "Seasonal & Event Staffing", desc: "Temporary teams for peaks, openings, and events.", long: "Trained temporary teams for the times you need volume — a season, an opening, a run of events. Briefed and supervised, so a short-term team doesn't mean a drop in your standards.", image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900&q=80" },
      { label: "Custom Training Programmes", desc: "Built around your venue, your menu, your standards.", long: "Programmes written for your business specifically — your menu, your systems, your service standards — and delivered on site. Staff train on the real thing instead of a generic hospitality slide deck.", image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=900&q=80" },
      { label: "Service Standards", desc: "How your floor team makes guests feel.", long: "Practical floor training: greeting, reading a table, upselling without being pushy, handling complaints, and recovering a bad experience before the guest leaves. Measured afterwards, not just delivered.", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&q=80" },
      { label: "Food Safety & Hygiene", desc: "International standards, properly taught and documented.", long: "Certified food safety and hygiene training with the paperwork to prove it — HACCP principles, storage, temperature control, allergen handling and cleaning routines that survive an inspection.", image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=900&q=80" },
      { label: "Leadership Development", desc: "Turning supervisors into managers.", long: "For the people you promoted from the floor: running a shift, managing a rota, holding a team accountable, reading a P&L and having difficult conversations without losing good staff.", image: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=900&q=80" },
      { label: "Labour Analysis", desc: "Where your turnover comes from and how to stop it.", long: "We measure your workforce properly — turnover, cost as a percentage of revenue, productivity per shift, and where people leave and why. Then we tell you what to change, with numbers behind it.", image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=900&q=80" }
    ]
  },
  {
    title: "F&B Technology",
    modules: [
      { label: "Order From The Table", desc: "Guests scan, browse, and order without waiting for anyone.", long: "A guest scans the code on the table and the full menu opens on their phone — photos, descriptions, allergens and live availability. They order when they're ready, add to the same tab through the meal, and never wait to catch a server's eye. Orders go straight to the kitchen with the table number attached.", image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=900&q=80" },
      { label: "Pay Online", desc: "The bill settles on their phone. No cashier, no waiting.", long: "The bill is paid on the phone by card or wallet, with split-the-bill and tipping built in. Nobody queues at the till and nobody waits fifteen minutes for a card machine — which turns your tables faster on a busy night.", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80" },
      { label: "Pickup Ordering", desc: "Order ahead, collect at the counter.", long: "Customers order and pay in advance and collect at a time they choose. The kitchen gets the order timed to the collection slot, so food is ready when they walk in rather than sitting under a lamp.", image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&q=80" },
      { label: "Delivery", desc: "Your own delivery channel, off the aggregator platforms.", long: "Take delivery orders directly through your own app, with delivery zones, fees and timing you control. You keep the commission the aggregators charge — and you keep the customer data, which they never give you.", image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=900&q=80" },
      { label: "POS Integration", desc: "Orders land in the system you already run.", long: "We connect the app to your existing point of sale so orders, payments and reporting flow into one place. No second screen for staff to watch and no reconciling two sets of numbers at the end of the night.", image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=80" },
      { label: "Branded Customer App", desc: "The app carries your name, not ours.", long: "A published app under your own brand, on the App Store and Google Play, with your identity throughout. Push notifications, saved favourites and repeat ordering — so regulars come back through a channel you own.", image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=900&q=80" },
      { label: "Sales & Guest Insights", desc: "What sells, when, and who keeps coming back.", long: "A dashboard showing your best and worst sellers, peak hours, average spend and repeat customer behaviour. The kind of information that tells you what to cut from the menu and when to add staff.", image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=900&q=80" }
    ]
  }
];

async function main() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST, port: Number(process.env.DB_PORT),
    user: process.env.DB_USER, password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME, multipleStatements: true,
  });

  try {
    // Make sure we have the Marketing service in DB as well, just in case
    const [marketingCheck] = await db.query("SELECT id FROM services WHERE title = 'Marketing'");
    if (marketingCheck.length === 0) {
      await db.query(
        "INSERT INTO services (title, tagline, description, accent_color, image_url, icon) VALUES (?, ?, ?, ?, ?, ?)",
        ["Marketing", "The Moment People Remember", "Hand someone an ice cream with a chocolate spoon and you've changed the whole experience.", "#3AADE0", "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=900&q=80", "Megaphone"]
      );
      console.log("Inserted Marketing");
    }

    for (const serviceData of SERVICES) {
      // Find service ID
      const [rows] = await db.query("SELECT id FROM services WHERE title = ?", [serviceData.title]);
      if (rows.length > 0) {
        const serviceId = rows[0].id;
        console.log(`Seeding subservices for service: ${serviceData.title} (ID: ${serviceId})`);

        for (const mod of serviceData.modules) {
          // Check if subservice already exists
          const [subRows] = await db.query(
            "SELECT id FROM subservices WHERE service_id = ? AND title = ?",
            [serviceId, mod.label]
          );

          if (subRows.length === 0) {
            await db.query(
              `INSERT INTO subservices (service_id, title, short_description, description, image_url, is_active)
               VALUES (?, ?, ?, ?, ?, 1)`,
              [serviceId, mod.label, mod.desc, mod.long, mod.image]
            );
            console.log(`  Inserted subservice: ${mod.label}`);
          }
        }
      } else {
        console.log(`Service not found in DB: ${serviceData.title}`);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    await db.end();
  }
}

main();
