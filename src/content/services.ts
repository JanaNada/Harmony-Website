import {
  Building2, Calendar, Megaphone, UserCheck, Smartphone,
  MapPin, ClipboardCheck, PenTool, Sofa, ChefHat, Utensils, Users, Settings, TrendingUp,
  CreditCard, ShoppingBag, Bike, Monitor, AppWindow, BarChart3,
  Sparkles, Music, Lightbulb, Landmark, Coffee, Wine, UsersRound, Ticket,
  Gift, Package, Heart, Instagram, Video, Camera, Palette, Rocket, Star,
  Search, MessagesSquare, Briefcase, GraduationCap, ShieldCheck, LineChart,
  Box, type LucideIcon,
} from "lucide-react";
import * as LucideIcons from "lucide-react";

/* ────────────────────────────────────────────────────────────────────────────
   The content model.

   Five services. Each holds groups of individually selectable modules — a
   customer can pick one module, several, or everything, across any services.
   Every page in the site renders from this file.
   ──────────────────────────────────────────────────────────────────────────── */

export type ServiceId =
  | "business" | "events" | "marketing" | "recruitment" | "technology";

export interface ServiceModule {
  id: string;
  label: string;
  /** One line, always visible on the card. */
  desc: string;
  /** Shown when the card is expanded. */
  long: string;
  image: string;
  icon: LucideIcon;
}

export interface ModuleGroup {
  title: string;
  blurb: string;
  modules: ServiceModule[];
}

export interface GapQuestion {
  id: string;
  label: string;
  type: "choice" | "select" | "text" | "date" | "multichoice";
  options?: string[];
  placeholder?: string;
  required?: boolean;
}

export interface Service {
  id: ServiceId;
  label: string;
  tagline: string;
  color: string;
  dim: string;
  icon: LucideIcon;
  image: string;
  /** One line, on the card. */
  promise: string;
  /** Opening paragraph on the sector page. */
  intro: string;
  groups: ModuleGroup[];
  questions: GapQuestion[];
}

export const C_ORANGE = "#F5841F";
export const C_PINK = "#E91E8C";
export const C_BLUE = "#3AADE0";
export const C_GREEN = "#78BE1F";

/* Photography pool — kept small and reused so nothing renders broken. */
const IMG = {
  venue: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=80",
  dining: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&q=80",
  interior: "https://images.unsplash.com/photo-1600607686527-6fb886090705?w=900&q=80",
  event: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=900&q=80",
  marketing: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=900&q=80",
  team: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900&q=80",
  meeting: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&q=80",
  training: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=900&q=80",
  data: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=900&q=80",
  office: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=80",
  tech: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=900&q=80",
  dashboard: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80",
  dessert: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=900&q=80",
  hygiene: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=900&q=80",
  boardroom: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=900&q=80",
};

export const SERVICES: Service[] = [
  /* ── 1. Business Development ──────────────────────────────────────────── */
  {
    id: "business",
    label: "Business Development",
    tagline: "Physical Establishment From Scratch",
    color: C_ORANGE,
    dim: `${C_ORANGE}15`,
    icon: Building2,
    image: IMG.venue,
    promise:
      "We physically build and establish Food & Beverage businesses end-to-end — from empty plots to grand openings.",
    intro:
      "Our Business Development division focuses purely on the physical, structural, and operational establishment of F&B businesses from scratch. We handle the market analysis, site selection, kitchen design, culinary development, and staffing. (Note: If you are an established business looking to upgrade your digital systems, software, or POS, please see our dedicated F&B Technology department).",
    groups: [
      {
        title: "Strategic Planning & Design",
        blurb: "From market analysis to the physical kitchen blueprint.",
        modules: [
          { id: "biz-market", label: "Market Analysis & Business Modeling", desc: "We pressure-test the numbers before you spend anything.", long: "Before you spend money, we tell you honestly whether the idea works. Comprehensive market research, competitor mapping, financial modeling, and precise positioning to ensure profitability.", image: IMG.meeting, icon: ClipboardCheck },
          { id: "biz-site", label: "Site Selection", desc: "Finding and assessing the perfect location.", long: "We shortlist locations against your concept and budget, study the catchment and foot traffic, and handle lease terms so the location works for your long-term margins.", image: IMG.venue, icon: MapPin },
          { id: "biz-kitchen", label: "Kitchen Design (AutoCAD & 3D Max)", desc: "A back of house laid out for maximum efficiency.", long: "We design the production area around your actual menu and volume using AutoCAD and 3D Max, specifying and sourcing the exact equipment needed for optimal service flow.", image: IMG.interior, icon: PenTool },
        ],
      },
      {
        title: "Brand & Culinary Development",
        blurb: "The visual identity and the product you serve.",
        modules: [
          { id: "biz-brand", label: "Branding & Visual Identity", desc: "Full brand development for your physical space.", long: "Complete visual identity design including logos, color palettes, typography, and signage that translates seamlessly into your physical interior and packaging.", image: IMG.marketing, icon: Palette },
          { id: "biz-recipes", label: "Recipe & Menu Development", desc: "Creating and costing the dishes you sell.", long: "Our chefs build the menu from scratch — developing the dishes, costing every plate to protect your margin, and writing the exact specs for repeatable quality.", image: IMG.dessert, icon: Utensils },
          { id: "biz-vendors", label: "Vendor Development", desc: "Sourcing reliable suppliers for your ingredients.", long: "We establish your supply chain, negotiating terms with the best vendors and suppliers to ensure consistent quality and pricing from day one.", image: IMG.office, icon: Package },
        ],
      },
      {
        title: "Operational Management",
        blurb: "The people and systems that hold it together.",
        modules: [
          { id: "biz-sops", label: "Creation of SOPs & Manuals", desc: "The operating manual for your business.", long: "We write the comprehensive operating manual: service standards, Operation Manuals, Opening/Closing Checklists, and Equipment Handling Guides.", image: IMG.office, icon: Settings },
          { id: "biz-staff", label: "Staffing & Training", desc: "Building the team that runs the floor and the kitchen.", long: "We work out the roles you need, handle the recruitment, and train the front of house and kitchen staff so they are ready for opening day.", image: IMG.team, icon: Users },
        ],
      },
      {
        title: "Auditing & Quality Assurance",
        blurb: "Ensuring standards are met and money isn't leaking.",
        modules: [
          { id: "biz-mystery-shopper", label: "Mystery Shopper", desc: "Anonymous guest checks that reveal the real customer experience.", long: "A covert evaluation of your restaurant covering cleanliness, staff behavior, and food quality, resulting in a detailed report uploaded directly to your dashboard.", image: IMG.boardroom, icon: Search },
          { id: "biz-audit", label: "Financial Audits & Control", desc: "Straight assessments of where the money is going.", long: "We run deep financial audits and compliance checks to find leaks in your operations, adjust food costs, and enforce strict financial control.", image: IMG.dashboard, icon: TrendingUp },
        ],
      },
    ],
    questions: [
      { id: "stage", label: "Where are you right now?", type: "choice", options: ["Starting from scratch", "Already trading", "Expanding an existing business"], required: true },
      { id: "sector", label: "Which sector is your business in?", type: "select", options: ["Food & Beverage", "Hotels & Hospitality", "Other"], required: true },
      { id: "location", label: "Do you have the location?", type: "choice", options: ["Signed", "Shortlisted", "Not yet"] },
      { id: "city", label: "Which city?", type: "text", placeholder: "Riyadh, Cairo, etc." },
      { id: "opening", label: "Target opening or launch date", type: "date" },
    ],
  },

  /* ── 2. Events ────────────────────────────────────────────────────────── */
  {
    id: "events",
    label: "Events",
    tagline: "Built From Nothing, In A Room",
    color: C_PINK,
    dim: `${C_PINK}15`,
    icon: Calendar,
    image: IMG.event,
    promise:
      "Weddings, corporate nights, concerts. We build the whole thing — centerpiece to stage.",
    intro:
      "This is the one place we work with people as well as companies. A wedding, an annual celebration, a concert, a product launch — we can handle just the food, or build the entire event from the first centerpiece to the last light on the stage.",
    groups: [
      {
        title: "Building The Event",
        blurb: "The physical thing your guests walk into.",
        modules: [
          { id: "ev-production", label: "Full Event Production", desc: "We design and build the whole event, start to finish.", long: "You tell us the occasion and the feeling you want; we handle everything else. Concept, design, build, suppliers, schedule and a team on site running the day so you're a guest at your own event rather than a project manager.", image: IMG.event, icon: Sparkles },
          { id: "ev-decor", label: "Décor & Centerpieces", desc: "Every table, every surface, every detail people photograph.", long: "We design and build the styling — centerpieces, table settings, florals, backdrops, entrances and the small details guests notice up close. Made for your event specifically, not pulled off a rental shelf.", image: IMG.event, icon: Lightbulb },
          { id: "ev-stage", label: "Stage, Sound & Lighting", desc: "Stage build and full technical production.", long: "Stage design and construction, sound system, lighting design, screens and rigging — specified for the venue and the size of the crowd, installed and operated by a technical crew who stay for the whole event.", image: IMG.event, icon: Music },
          { id: "ev-venue", label: "Venue Sourcing", desc: "We find and negotiate the right space.", long: "We shortlist venues that fit your guest count, budget and the tone of the occasion, arrange the viewings, and negotiate the contract — including the things people forget to check, like load-in access and noise curfews.", image: IMG.interior, icon: Landmark },
        ],
      },
      {
        title: "Food & Drink",
        blurb: "Our catering division, at any scale.",
        modules: [
          { id: "ev-catering", label: "Catering", desc: "From a coffee break to a thousand-seat gala dinner.", long: "Menus built for your event and your guests, cooked and served to international hygiene standards. We handle the logistics that make catering at scale actually work — timing, holding, plating and service flow — so food reaches the table properly.", image: IMG.dining, icon: Coffee },
          { id: "ev-bar", label: "Bar & Beverage Service", desc: "Bar setup, drinks menu, and the people pouring.", long: "Full bar build and service: drinks list designed to the occasion, glassware, ice and stock logistics, and trained bartenders. We size it to the crowd so there's never a twenty-minute queue at the bar.", image: IMG.dining, icon: Wine },
        ],
      },
      {
        title: "People & Programme",
        blurb: "Everyone working the room, and everything happening in it.",
        modules: [
          { id: "ev-staff", label: "Event Staffing", desc: "Service staff, hosts, and supervisors for the day.", long: "Briefed, uniformed and supervised teams for the event — waiters, hosts, runners and floor supervisors. They're trained on your specific run sheet before they arrive, not handed a clipboard on the day.", image: IMG.team, icon: UsersRound },
          { id: "ev-guests", label: "Guest Management", desc: "Invitations, RSVPs, seating, and check-in.", long: "We run the guest list end to end — invitations, RSVP tracking, seating plans, name cards and check-in on the door. You get a clean list of who's coming and no bottleneck at the entrance.", image: IMG.boardroom, icon: Ticket },
          { id: "ev-talent", label: "Entertainment Booking", desc: "Artists, bands, DJs, and performers.", long: "We source and book the talent, handle the contracts and fees, and manage their technical requirements and timings on the day so the programme runs when it's supposed to.", image: IMG.event, icon: Star },
        ],
      },
    ],
    questions: [
      { id: "who", label: "Are you booking as a company or as an individual?", type: "choice", options: ["A company", "An individual"], required: true },
      { id: "type", label: "What's the occasion?", type: "select", options: ["Wedding", "Corporate event", "Annual celebration", "Concert", "Exhibition / activation", "Private celebration", "Other"], required: true },
      { id: "date", label: "When is it?", type: "date" },
      { id: "flexible", label: "Is the date fixed?", type: "choice", options: ["Fixed", "Some flexibility", "Not decided"] },
      { id: "guests", label: "Roughly how many guests?", type: "select", options: ["Under 50", "50 – 150", "150 – 400", "400 – 1000", "1000+"] },
      { id: "venue", label: "Do you have a venue?", type: "choice", options: ["Booked", "Looking", "Need help finding one"] },
    ],
  },

  /* ── 3. Marketing ─────────────────────────────────────────────────────── */
  {
    id: "marketing",
    label: "Marketing",
    tagline: "Brand Identity, Social Media & AI",
    color: C_BLUE,
    dim: `${C_BLUE}15`,
    icon: Megaphone,
    image: IMG.marketing,
    promise:
      "From establishing your core identity to hyper-realistic AI cinematic ads, we offer end-to-end marketing solutions.",
    intro:
      "Our Digital Marketing & AI Agency is built on two main pathways depending on where you are. Pathway 1 is for those starting from scratch — we build your entire Brand Identity. Pathway 2 is for established businesses needing ongoing Social Media Management, Content Production, and cutting-edge AI integrations. You can select an entire pathway or individually pick specific modules.",
    groups: [
      {
        title: "Pathway 1: Brand Identity (Starting from Scratch)",
        blurb: "Building the visual and strategic foundation of your brand.",
        modules: [
          { id: "mk-identity", label: "Brand Identity & Logo", desc: "Name, logo, palette, and voice.", long: "Complete brand identity creation including logos, typography, tone of voice, and guidelines applied across menus, signage, packaging, and social media.", image: IMG.marketing, icon: Palette },
          { id: "mk-strategy", label: "Brand Strategy & Positioning", desc: "Crafting a unique voice connecting with your target audience.", long: "We develop a strategic positioning and voice that sets your brand apart in the F&B and hospitality market.", image: IMG.meeting, icon: MapPin },
          { id: "mk-web", label: "Lightning-Fast Web Apps", desc: "SEO-optimized websites and digital menus.", long: "Custom-designed, highly responsive web applications integrated with interactive digital menus that convert attention into action seamlessly.", image: IMG.tech, icon: AppWindow },
        ],
      },
      {
        title: "Pathway 2: Social Media & Content Production",
        blurb: "Ongoing management and high-quality production.",
        modules: [
          { id: "mk-social", label: "Social Media Management", desc: "Consistent content calendars and real-time engagement.", long: "Full community management across Instagram, Facebook, and TikTok. We handle your daily posting, captions, and replies.", image: IMG.marketing, icon: Instagram },
          { id: "mk-photo-video", label: "Photography & Video Production", desc: "Food styling, reels, and commercial shoots.", long: "Professional commercial production of food and venue shoots enhanced by art direction and food styling. Includes short-form Reels and TikToks.", image: IMG.dining, icon: Camera },
          { id: "mk-performance", label: "Performance Ads", desc: "ROI-focused media buying on Meta, Google, and TikTok.", long: "Data-driven performance campaigns utilizing insightful analytics and real-time optimization to maximize your advertising spend.", image: IMG.data, icon: LineChart },
          { id: "mk-influencer", label: "Influencer & PR", desc: "Collaboration with models and influencers.", long: "Strategic partnerships and campaigns with creators who authentically reach your customers and amplify your brand.", image: IMG.event, icon: Users },
        ],
      },
      {
        title: "AI Marketing & Software Solutions",
        blurb: "Next-gen blend of real production and AI-driven technology.",
        modules: [
          { id: "mk-ai-cinematic", label: "Cinematic AI Ads", desc: "Emotional storytelling using AI and real shoots.", long: "We utilize real shoots enhanced by advanced AI cinematic processing (color grading, lighting, motion enhancement) resulting in visually stunning hyper-realistic content with infinite variations.", image: IMG.tech, icon: Video },
          { id: "mk-ai-virtual", label: "Virtual Showrooms", desc: "Immersive experiences for Kitchen & Interior Design.", long: "AI-enhanced virtual showrooms that transform traditional footage into engaging, interactive environments for prospective customers.", image: IMG.interior, icon: Sparkles },
        ],
      },
    ],
    questions: [
      { id: "pathway", label: "Which pathway fits you best?", type: "choice", options: ["Pathway 1: Starting from scratch (Identity)", "Pathway 2: Established (Social Media)", "Both - I need a full overhaul"], required: true },
      { id: "sector", label: "What sector are you in?", type: "select", options: ["Food & Beverage", "Kitchen & Interior Design", "Hotels & Hospitality", "Other"], required: true },
      { id: "handles", label: "Where can we see you? (social handle or website)", type: "text", placeholder: "@yourbrand" },
    ],
  },

  /* ── 4. Recruitment & Training ────────────────────────────────────────── */
  {
    id: "recruitment",
    label: "Recruitment & Training",
    tagline: "The People, Ready To Work",
    color: C_GREEN,
    dim: `${C_GREEN}15`,
    icon: UserCheck,
    image: IMG.team,
    promise:
      "We find them, test them, interview them, and train them — before they reach your HR desk.",
    intro:
      "You can use us for one hire or for an entire opening team. We handle sourcing, assessment and interviews, and we train people on the realities of your business so they're useful on day one. If a placement doesn't work out, we replace them.",
    groups: [
      {
        title: "Hiring",
        blurb: "Finding people and proving they can do the job.",
        modules: [
          { id: "rc-sourcing", label: "Talent Acquisition", desc: "Sourcing candidates who actually fit the role.", long: "We search our own database and the open market for people who match the role, the salary and the culture — then screen them before you ever see a CV. You get a shortlist, not a pile of applications.", image: IMG.office, icon: Search },
          { id: "rc-assess", label: "Assessment & Testing", desc: "Technical tests, so skills are verified before you meet them.", long: "Practical, role-specific testing — a chef cooks, a bartender pours, a manager works through a real scenario. You find out what someone can actually do before you hire them rather than three weeks after.", image: IMG.training, icon: ClipboardCheck },
          { id: "rc-interview", label: "Interviewing", desc: "We run first-round interviews and hand you a shortlist.", long: "We conduct the first round, check references and work history, and pass on only the candidates worth your time — with notes on each one so your final interview is a decision, not a discovery.", image: IMG.meeting, icon: MessagesSquare },
          { id: "rc-exec", label: "Executive Placement", desc: "General managers, head chefs, and senior operators.", long: "Discreet, targeted search for senior roles, including people who aren't actively looking. We manage the approach, the negotiation and the transition, and we back the placement with a replacement guarantee.", image: IMG.boardroom, icon: Briefcase },
          { id: "rc-culinary", label: "Chef & Culinary Sourcing", desc: "Kitchen talent, from line cook to executive chef.", long: "Kitchen hiring is its own discipline and we treat it that way. We source across cuisines and levels, test candidates on the pass, and understand the difference between a chef who can cook and one who can run a brigade.", image: IMG.dining, icon: ChefHat },
          { id: "rc-seasonal", label: "Seasonal & Event Staffing", desc: "Temporary teams for peaks, openings, and events.", long: "Trained temporary teams for the times you need volume — a season, an opening, a run of events. Briefed and supervised, so a short-term team doesn't mean a drop in your standards.", image: IMG.team, icon: UsersRound },
        ],
      },
      {
        title: "Training",
        blurb: "Turning people you already have into people who perform.",
        modules: [
          { id: "rc-training", label: "Custom Training Programmes", desc: "Built around your venue, your menu, your standards.", long: "Programmes written for your business specifically — your menu, your systems, your service standards — and delivered on site. Staff train on the real thing instead of a generic hospitality slide deck.", image: IMG.training, icon: GraduationCap },
          { id: "rc-service", label: "Service Standards", desc: "How your floor team makes guests feel.", long: "Practical floor training: greeting, reading a table, upselling without being pushy, handling complaints, and recovering a bad experience before the guest leaves. Measured afterwards, not just delivered.", image: IMG.meeting, icon: Star },
          { id: "rc-safety", label: "Food Safety & Hygiene", desc: "International standards, properly taught and documented.", long: "Certified food safety and hygiene training with the paperwork to prove it — HACCP principles, storage, temperature control, allergen handling and cleaning routines that survive an inspection.", image: IMG.hygiene, icon: ShieldCheck },
          { id: "rc-leadership", label: "Leadership Development", desc: "Turning supervisors into managers.", long: "For the people you promoted from the floor: running a shift, managing a rota, holding a team accountable, reading a P&L and having difficult conversations without losing good staff.", image: IMG.boardroom, icon: TrendingUp },
          { id: "rc-analysis", label: "Labour Analysis", desc: "Where your turnover comes from and how to stop it.", long: "We measure your workforce properly — turnover, cost as a percentage of revenue, productivity per shift, and where people leave and why. Then we tell you what to change, with numbers behind it.", image: IMG.data, icon: LineChart },
        ],
      },
    ],
    questions: [
      { id: "positionTitle", label: "Position Title", type: "text", required: true },
      { id: "department", label: "Department", type: "text" },
      { id: "employmentType", label: "Employment Type", type: "choice", options: ["Full-Time", "Part-Time", "Temporary", "Internship"], required: true },
      { id: "workLocation", label: "Work Location", type: "text" },
      { id: "positionsNeeded", label: "Number of Positions Needed", type: "text" },
      { id: "desiredStartDate", label: "Desired Start Date", type: "date" },
      { id: "reportingTo", label: "Reporting To", type: "text" },
      { id: "jobResponsibilities", label: "Job Responsibilities (Brief)", type: "text" },
      { id: "requiredQualifications", label: "Required Qualifications", type: "text" },
      { id: "proposedSalaryRange", label: "Proposed Salary Range", type: "text", placeholder: "$4,000 - $5,000" },
      { id: "budgetApproved", label: "Is Budget Approved?", type: "choice", options: ["Yes", "No"] },
      { id: "budgetCode", label: "Budget Code (if applicable)", type: "text" },
      { id: "benefits", label: "Benefits & Compensation", type: "multichoice", options: ["Medical Insurance", "Social Insurance", "Transportation", "Meals", "Tips", "Paid Time Off", "Uniform"] },
    ],
  },

  /* ── 5. F&B Technology ────────────────────────────────────────────────── */
  {
    id: "technology",
    label: "F&B Technology",
    tagline: "Your Own Ordering App",
    color: C_ORANGE,
    dim: `${C_ORANGE}15`,
    icon: Smartphone,
    image: IMG.tech,
    promise:
      "Guests order from the table, pay on their phone, and never queue at the till.",
    intro:
      "We build the ordering app for your venue, under your name. A guest sits down, scans, browses the menu and orders without waiting for anyone — then pays on their phone and leaves. The same app handles pickup and your own delivery, so you're not handing a third of every order to a platform.",
    groups: [
      {
        title: "In The Venue",
        blurb: "What changes for a guest sitting at one of your tables.",
        modules: [
          { id: "tech-qr", label: "Order From The Table", desc: "Guests scan, browse, and order without waiting for anyone.", long: "A guest scans the code on the table and the full menu opens on their phone — photos, descriptions, allergens and live availability. They order when they're ready, add to the same tab through the meal, and never wait to catch a server's eye. Orders go straight to the kitchen with the table number attached.", image: IMG.tech, icon: Smartphone },
          { id: "tech-pay", label: "Pay Online", desc: "The bill settles on their phone. No cashier, no waiting.", long: "The bill is paid on the phone by card or wallet, with split-the-bill and tipping built in. Nobody queues at the till and nobody waits fifteen minutes for a card machine — which turns your tables faster on a busy night.", image: IMG.dashboard, icon: CreditCard },
        ],
      },
      {
        title: "Off-Premise",
        blurb: "Selling to people who aren't in the room.",
        modules: [
          { id: "tech-pickup", label: "Pickup Ordering", desc: "Order ahead, collect at the counter.", long: "Customers order and pay in advance and collect at a time they choose. The kitchen gets the order timed to the collection slot, so food is ready when they walk in rather than sitting under a lamp.", image: IMG.dining, icon: ShoppingBag },
          { id: "tech-delivery", label: "Delivery", desc: "Your own delivery channel, off the aggregator platforms.", long: "Take delivery orders directly through your own app, with delivery zones, fees and timing you control. You keep the commission the aggregators charge — and you keep the customer data, which they never give you.", image: IMG.tech, icon: Bike },
        ],
      },
      {
        title: "Behind The Counter",
        blurb: "How it fits the systems you already run.",
        modules: [
          { id: "tech-pos", label: "POS Integration", desc: "Orders land in the system you already run.", long: "We connect the app to your existing point of sale so orders, payments and reporting flow into one place. No second screen for staff to watch and no reconciling two sets of numbers at the end of the night.", image: IMG.office, icon: Monitor },
          { id: "tech-app", label: "Branded Customer App", desc: "The app carries your name, not ours.", long: "A published app under your own brand, on the App Store and Google Play, with your identity throughout. Push notifications, saved favourites and repeat ordering — so regulars come back through a channel you own.", image: IMG.marketing, icon: AppWindow },
          { id: "tech-insights", label: "Sales & Guest Insights", desc: "What sells, when, and who keeps coming back.", long: "A dashboard showing your best and worst sellers, peak hours, average spend and repeat customer behaviour. The kind of information that tells you what to cut from the menu and when to add staff.", image: IMG.data, icon: BarChart3 },
        ],
      },
    ],
    questions: [
      { id: "venue", label: "What kind of venue is it?", type: "select", options: ["Restaurant", "Café", "Bar", "Cloud kitchen", "Food court / QSR", "Hotel F&B", "Other"], required: true },
      { id: "branches", label: "How many branches?", type: "choice", options: ["One", "2 – 5", "6 – 20", "More than 20"], required: true },
      { id: "pos", label: "What POS do you use today?", type: "text", placeholder: "Or 'none yet'" },
      { id: "timeline", label: "When do you want it live?", type: "choice", options: ["As soon as possible", "Within 3 months", "Just exploring"] },
    ],
  },
];

/* ── Lookups ────────────────────────────────────────────────────────────── */

export const SERVICE_BY_ID: Record<ServiceId, Service> = SERVICES.reduce(
  (acc, s) => ({ ...acc, [s.id]: s }),
  {} as Record<ServiceId, Service>,
);

export const ALL_MODULES: (ServiceModule & { serviceId: ServiceId })[] =
  SERVICES.flatMap((s) =>
    s.groups.flatMap((g) => g.modules.map((m) => ({ ...m, serviceId: s.id }))),
  );

import type { CatalogService } from "@/lib/api";

let dynamicModules: Record<string, ServiceModule & { serviceId: string | number }> = {};

export function setDynamicCatalog(services: CatalogService[]) {
  const registry: Record<string, ServiceModule & { serviceId: string | number }> = {};
  for (const s of services) {
    const serviceId = s.id;
    const iconName = s.icon;
    let serviceIcon = Box;
    if (iconName && (LucideIcons as any)[iconName]) {
      serviceIcon = (LucideIcons as any)[iconName];
    }
    
    for (const sub of s.subservices) {
      registry[String(sub.id)] = {
        id: String(sub.id),
        label: sub.title,
        desc: sub.shortDescription || "",
        long: sub.description || "",
        image: sub.imageUrl || s.imageUrl || "/imports/image-11.png",
        icon: serviceIcon,
        serviceId: serviceId,
      };
    }
  }
  dynamicModules = registry;
}

let dynamicServices: CatalogService[] = [];

export function setDynamicServicesCatalog(services: CatalogService[]) {
  dynamicServices = services;
  setDynamicCatalog(services);
}

export function findModule(id: string) {
  const staticMod = ALL_MODULES.find((m) => m.id === id);
  if (staticMod) return staticMod;
  return dynamicModules[id] || null;
}

// export function findService(id: string | number | undefined | null) {
//   if (id === undefined || id === null) return null;
//   const staticSvc = SERVICES.find((s) => s.id === id);
//   if (staticSvc) return staticSvc;
//   const dbSvc = dynamicServices.find((s) => s.id === id || String(s.id) === String(id));
//   if (dbSvc) {
//     const color = dbSvc.accentColor || C_ORANGE;
//     const iconName = dbSvc.icon;
//     let IconComponent = Box;
//     if (iconName && (LucideIcons as any)[iconName]) {
//       IconComponent = (LucideIcons as any)[iconName];
//     }
//     return {
//       id: dbSvc.id,
//       label: dbSvc.title,
//       tagline: dbSvc.tagline || "",
//       color: color,
//       dim: `${color}15`,
//       icon: IconComponent,
//       image: dbSvc.imageUrl || "/imports/image-11.png",
//       promise: dbSvc.description || "",
//       intro: dbSvc.description || "",
//       groups: dbSvc.sections.map((sec) => ({
//         title: sec.title,
//         blurb: "",
//         modules: sec.subservices.filter(s => s.isActive).map((sub) => ({
//           id: String(sub.id),
//           label: sub.title,
//           desc: sub.shortDescription || "",
//           long: sub.description || "",
//           image: sub.imageUrl || dbSvc.imageUrl || "/imports/image-11.png",
//           icon: IconComponent,
//         })),
//       })),
//       questions: [] as GapQuestion[],
//     };
//   }
//   return null;
// }
export function findService(id: string | number | undefined | null) {
  if (id === undefined || id === null) return null;

  const staticSvc = SERVICES.find((s) => s.id === id);
  if (staticSvc) return staticSvc;

  const dbSvc = dynamicServices.find(
    (s) => s.id === id || String(s.id) === String(id)
  );

  if (dbSvc) {
    // Reuse the existing gap questions for the matching service.
    // The rest of the service content comes from the database catalog.
    const staticMatch = SERVICES.find(
      (s) => s.label.toLowerCase() === dbSvc.title.toLowerCase()
    );

    const color = dbSvc.accentColor || C_ORANGE;
    const iconName = dbSvc.icon;

    let IconComponent = Box;

    if (iconName && (LucideIcons as any)[iconName]) {
      IconComponent = (LucideIcons as any)[iconName];
    }

    return {
      id: dbSvc.id,
      label: dbSvc.title,
      tagline: dbSvc.tagline || "",
      color,
      dim: `${color}15`,
      icon: IconComponent,
      image: dbSvc.imageUrl || "/imports/image-11.png",
      promise: dbSvc.description || "",
      intro: dbSvc.description || "",

      groups: dbSvc.sections.map((sec) => ({
        title: sec.title,
        blurb: "",
        modules: sec.subservices
          .filter((s) => s.isActive)
          .map((sub) => ({
            id: String(sub.id),
            label: sub.title,
            desc: sub.shortDescription || "",
            long: sub.description || "",
            image:
              sub.imageUrl ||
              dbSvc.imageUrl ||
              "/imports/image-11.png",
            icon: IconComponent,
          })),
      })),

      questions: staticMatch?.questions ?? [],
    };
  }

  return null;
}

export function moduleCount(s: Service) {
  return s.groups.reduce((n, g) => n + g.modules.length, 0);
}

/* ── Entry points: the customer's mental model, not our org chart ───────── */

export interface IntentRoute {
  id: string;
  title: string;
  sub: string;
  color: string;
  icon: LucideIcon;
  services: ServiceId[];
}

export const INTENTS: IntentRoute[] = [
  {
    id: "opening",
    title: "I'm opening something new",
    sub: "A venue or business that doesn't exist yet.",
    color: C_ORANGE,
    icon: Rocket,
    services: ["business", "marketing", "recruitment"],
  },
  {
    id: "running",
    title: "I'm already running a business",
    sub: "It's open, and you want it working better.",
    color: C_BLUE,
    icon: TrendingUp,
    services: ["business", "technology", "recruitment"],
  },
  {
    id: "event",
    title: "I'm hosting an event",
    sub: "A wedding, a corporate night, a concert. Companies and individuals both.",
    color: C_PINK,
    icon: Calendar,
    services: ["events"],
  },
];
