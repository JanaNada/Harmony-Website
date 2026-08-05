"use client"

import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { ImageWithFallback } from "@/components";
import AdminDashboard from "./AdminDashboard";
import {
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Youtube,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Globe,
  Rocket,
  Clock,
  Phone,
  MapPin,
  Menu,
  X,
  Settings,
  Users,
  ShieldCheck,
  Lightbulb,
  Handshake,
  Calendar,
  UserCheck,
  BarChart,
  GraduationCap,
  Megaphone,
  Building2,
  Building,
  Heart,
  Zap,
  Mail,
  Lock,
  User,
  Briefcase,
} from 'lucide-react';

import { SERVICES, SERVICE_BY_ID, INTENTS, type ServiceId } from "@/content/services";
import { BriefProvider } from "@/state/BriefContext";
import { BriefBar } from "@/components/brief/BriefBar";
import { BookingPage } from "@/components/brief/BookingPage";
import { ServicesOverview } from "@/components/services/ServicesOverview";
import { SectorPage } from "@/components/services/SectorPage";
import { MarketingStory } from "@/components/services/MarketingStory";

// Image paths - move images from src/imports to public/imports
const logoImg = "/imports/image-10.png";
const welcomeImg = "/imports/image-11.png";
const missionTopImg = "/imports/image-7.png";

type Page =
  | "services" | "stories" | "about" | "mission"
  | "booking" | "contact" | "login" | "admin"
  | ServiceId;

const C_ORANGE = "#F5841F";
const C_PINK = "#E91E8C";
const C_BLUE = "#3AADE0";
const C_GREEN = "#78BE1F";

// ── Brand ───────────────────────────────────────────────────────────────────
const C = {
  management:    "#FFB343",
  managementDim: "#FFF8EC",
  events:        "#E91E8C",
  eventsDim:     "#FEF0F8",
  marketing:     "#2AAEDE",
  marketingDim:  "#EDF8FE",
  recruitment:   "#3DAA68",
  recruitmentDim:"#EDF8F2",
};
const GRAD = `linear-gradient(90deg,${C.management},${C.events},${C.marketing},${C.recruitment})`;

function HeroCircle({ go }: { go: (p: Page) => void }) {
  return (
    <div className="flex justify-center">
      <div className="relative w-80 h-80 rounded-full border-4 border-white shadow-2xl flex items-center justify-center overflow-hidden">
        {/* Central HCH Circle */}
        <div className="absolute z-10 bg-white w-28 h-28 rounded-full flex flex-col items-center justify-center font-bold text-lg shadow-lg">
          HCH <span className="text-[10px] text-gray-400 font-normal tracking-widest">HARMONY</span>
        </div>
        
        {/* Quadrant Buttons - Passing 'go' correctly to each */}
        <div className="grid grid-cols-2 w-full h-full">
          <button onClick={() => go("business")} className="bg-[#FFB343] flex items-center justify-center text-white font-bold text-xs hover:opacity-90 transition-opacity">BUSINESS DEV</button>
          <button onClick={() => go("events")} className="bg-[#E91E8C] flex items-center justify-center text-white font-bold text-xs hover:opacity-90 transition-opacity">EVENTS</button>
          <button onClick={() => go("recruitment")} className="bg-[#3DAA68] flex items-center justify-center text-white font-bold text-xs hover:opacity-90 transition-opacity">RECRUITMENT</button>
          <button onClick={() => go("marketing")} className="bg-[#2AAEDE] flex items-center justify-center text-white font-bold text-xs hover:opacity-90 transition-opacity">MARKETING</button>
        </div>
      </div>
    </div>
  );
}

// ─── Nav ─────────────────────────────────────────────────────────────────────

function Nav({ current, go }: { current: Page; go: (p: Page) => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const tabs: { label: string; page: Page; exact?: boolean }[] = [
    { label: "About Us", page: "about" },
    { label: "Mission & Vision", page: "mission" },
    { label: "Service", page: "services" },
    { label: "Portfolio", page: "stories" },
  ];

  const isActive = (page: Page) =>
    current === page && current !== "contact";

  return (
    <header className="bg-[#FAF7F2] border-b border-black/[0.07] flex-shrink-0 z-50 relative">
      <div className="h-[80px] md:h-[90px] flex items-center px-6 md:px-12 gap-8">
        {/* Brand */}
        <button
          onClick={() => { go("about"); }}
          className="flex-shrink-0 flex items-center gap-2.5 transition-opacity hover:opacity-80 text-left"
        >
          <ImageWithFallback src="/imports/friend-logo.png" alt="Harmony Club House" className="h-9 w-9 object-contain rounded-full"/>
          <div className="hidden sm:block">
            <div className="text-base font-black leading-none tracking-widest text-gray-900" style={{fontFamily:"'Montserrat',sans-serif"}}>HARMONY</div>
            <div className="text-[10px] font-semibold tracking-[0.22em] text-gray-400 leading-none mt-0.5" style={{fontFamily:"'Montserrat',sans-serif"}}>CLUB HOUSE</div>
          </div>
        </button>

        {/* Tab links — desktop */}
        <nav className="hidden md:flex items-center gap-2 flex-1 justify-center">
          {tabs.map(({ label, page }) =>
            page === "services" ? (
              // Services opens a menu so all four are one click away
              <div key={label} className="relative group/svc">
                <button
                  onClick={() => go("services")}
                  className={`relative text-[14.5px] font-bold px-4 py-2.5 rounded-full transition-all duration-300 inline-flex items-center gap-1.5 ${
                    isActive(page) || SERVICES.some((s) => s.id === current)
                      ? "text-[#1a1a1a] bg-black/[0.04]"
                      : "text-[#1a1a1a]/50 hover:text-[#1a1a1a] hover:bg-black/[0.02]"
                  }`}
                >
                  {label}
                  <ChevronDown size={13} className="transition-transform duration-300 group-hover/svc:rotate-180" />
                </button>

                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 invisible group-hover/svc:opacity-100 group-hover/svc:visible transition-all duration-200 z-50">
                  <div className="bg-white rounded-[22px] shadow-[0_25px_50px_-15px_rgba(0,0,0,0.18)] border border-black/[0.05] p-2.5 w-[290px]">
                    {SERVICES.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => go(s.id)}
                        className="w-full text-left flex items-start gap-3 p-3 rounded-2xl hover:bg-black/[0.03] transition-colors group/item"
                      >
                        <span
                          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover/item:scale-110"
                          style={{ background: s.dim, color: s.color }}
                        >
                          <s.icon size={16} />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-lg font-extrabold text-[#1a1a1a] leading-tight mb-0.5">
                            {s.label}
                          </span>
                          <span className="block text-[11.5px] font-semibold text-[#1a1a1a]/45 leading-snug">
                            {s.tagline}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <button
                key={label}
                onClick={() => go(page)}
                className={`relative text-[14.5px] font-bold px-4 py-2.5 rounded-full transition-all duration-300 ${
                  isActive(page)
                    ? "text-[#1a1a1a] bg-black/[0.04]"
                    : "text-[#1a1a1a]/50 hover:text-[#1a1a1a] hover:bg-black/[0.02]"
                }`}
              >
                {label}
                {isActive(page) && (
                  <span
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full"
                    style={{ background: C_ORANGE }}
                  />
                )}
              </button>
            ),
          )}
        </nav>

        

        <div className="flex-1 md:hidden" />

        {/* Primary CTA — the whole site points here */}
        <button
          onClick={() => go("booking")}
          className="hidden md:inline-flex text-lg font-bold text-white px-7 py-3 rounded-full transition-all duration-300 hover:scale-[1.05] shadow-[0_10px_20px_-10px_rgba(233,30,140,0.5)] flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${C_ORANGE}, ${C_PINK})` }}
        >
          Book Appointment
        </button>

        <button 
            onClick={() => go("login")} // Directs to the login page
            className="text-lg font-bold text-[#1a1a1a] px-5 py-2.5 rounded-full hover:bg-black/5 transition-all"
          >
            Sign In
          </button>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-[#1a1a1a]/60 p-2"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-black/[0.07] bg-[#FAF7F2] px-6 py-6 flex flex-col gap-8 absolute w-full shadow-xl">
          {tabs.map(({ label, page }) => (
            <button
              key={label}
              onClick={() => { go(page); setMobileOpen(false); }}
              className="text-left text-xl font-bold text-[#1a1a1a]/70 hover:text-[#1a1a1a] transition-colors"
            >
              {label}
            </button>
          ))}
          <div className="pl-3 flex flex-col gap-3 border-l-2 border-black/[0.06]">
            {SERVICES.map((s) => (
              <button
                key={s.id}
                onClick={() => { go(s.id); setMobileOpen(false); }}
                className="text-left text-[14.5px] font-bold text-[#1a1a1a]/55 hover:text-[#1a1a1a] transition-colors inline-flex items-center gap-2.5"
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
                {s.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => { go("booking"); setMobileOpen(false); }}
            className="mt-4 text-lg font-bold text-white py-3.5 rounded-full shadow-[0_10px_20px_-10px_rgba(233,30,140,0.5)]"
            style={{ background: `linear-gradient(135deg, ${C_ORANGE}, ${C_PINK})` }}
          >
            Book Appointment
          </button>
        </div>
      )}
    </header>
  );
}

// ─── Home Page (single-screen) ────────────────────────────────────────────────



function LoginPage({ go }: { go: (p: Page) => void }) {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <div className="flex-1 overflow-y-auto flex items-center justify-center bg-[#FAF7F2] relative p-6 py-12">
      
      {/* Soft Colorful Ambient Backgrounds (Matches your theme) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] left-[20%] w-[40vw] h-[40vw] bg-[#F5841F]/15 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[10%] right-[20%] w-[40vw] h-[40vw] bg-[#E91E8C]/15 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white shadow-sm border border-gray-100 mb-4 cursor-pointer" onClick={() => go("about")}>
             <img src="/imports/friend-logo.png" alt="HCH" className="w-8 h-8 object-contain" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight text-[#1a1a1a]">
            {mode === "login" ? "Welcome Back" : "Create an Account"}
          </h1>
          <p className="text-xl md:text-2xl text-[#1a1a1a]/70 font-medium leading-[1.8] mt-2">
            {mode === "login" ? "Sign in to access your dashboard" : "Join the Harmony ecosystem"}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white/80 backdrop-blur-2xl p-8 md:p-10 rounded-[40px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] border border-white">
          <form onSubmit={(e) => { e.preventDefault(); go("admin"); }} className="space-y-8">
            
            {/* Sign Up Only: Name */}
            {mode === "signup" && (
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5" style={{fontFamily:"'Montserrat',sans-serif"}}>Full Name</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><User size={16} /></div>
                  <input type="text" placeholder="Ahmed Hassan" required
                    className="w-full pl-11 pr-4 py-3 rounded-xl text-base border border-gray-200 outline-none transition-all placeholder-gray-300 text-gray-800 focus:border-[#F5841F] bg-white/50" />
                </div>
              </div>
            )}

            {/* Shared: Email */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5" style={{fontFamily:"'Montserrat',sans-serif"}}>Email Address</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Mail size={16} /></div>
                <input type="email" placeholder="hello@example.com" required
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-base border border-gray-200 outline-none transition-all placeholder-gray-300 text-gray-800 focus:border-[#F5841F] bg-white/50" />
              </div>
            </div>

            {/* Shared: Password */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5" style={{fontFamily:"'Montserrat',sans-serif"}}>Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Lock size={16} /></div>
                <input type="password" placeholder="••••••••" required
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-base border border-gray-200 outline-none transition-all placeholder-gray-300 text-gray-800 focus:border-[#F5841F] bg-white/50" />
              </div>
            </div>

            {/* Sign Up Only: User Type */}
            {mode === "signup" && (
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5" style={{fontFamily:"'Montserrat',sans-serif"}}>I am a...</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Briefcase size={16} /></div>
                  <select required className="w-full pl-11 pr-10 py-3 rounded-xl text-base border border-gray-200 outline-none transition-all text-gray-700 focus:border-[#F5841F] bg-white/50 appearance-none cursor-pointer">
                    <option value="" disabled selected>Select your objective</option>
                    <option value="restaurant">Restaurant / F&B Owner</option>
                    <option value="recruiter">Recruiter / Seeking Talent</option>
                    <option value="event">Client (Planning an Event)</option>
                    <option value="marketing">Client (Seeking Marketing)</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button type="button" onClick={() => go("admin")}
              className="w-full py-3.5 mt-2 rounded-full text-lg font-bold text-white transition-all hover:shadow-lg hover:-translate-y-0.5 group flex items-center justify-center gap-2"
              style={{ background: `linear-gradient(135deg, #F5841F, #E91E8C)`, fontFamily:"'Montserrat',sans-serif" }}>
              {mode === "login" ? "Sign In" : "Create Account"} 
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-8 text-center pt-6 border-t border-gray-100">
            <p className="text-base text-[#1a1a1a]/55 font-medium">
              {mode === "login" ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => setMode(mode === "login" ? "signup" : "login")} 
                className="font-bold text-[#E91E8C] hover:text-[#F5841F] transition-colors"
              >
                {mode === "login" ? "Sign up" : "Log in"}
              </button>
            </p>
          </div>
        </div>
        
      </div>
    </div>
  );
}


function StoriesPage({ go }: { go: (p: Page) => void }) {
  // Empty placeholder array to maintain the exact grid structure without actual stories or images
  const placeholderCards = [1, 2, 3];

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF7F2] text-[#1a1a1a] relative">

      {/* Soft Colorful Ambient Backgrounds (Fixed to cover entire scroll) */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] bg-[#F5841F]/15 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] bg-[#3AADE0]/10 blur-[150px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vw] bg-[#E91E8C]/15 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      <div className="relative z-10 pt-24 pb-32">
        <div className="max-w-[800px] mx-auto px-6 text-center mb-24 md:mb-32">
          <div className="inline-flex items-center gap-3 mb-6">
  <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
  <span className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/50">Portfolio</span>
  <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
</div>
          <h1 className="font-extrabold text-5xl md:text-6xl leading-[1.1] tracking-tight mb-8 text-[#1a1a1a]">
            Our <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(135deg, #E91E8C, #3AADE0)` }}>Stories.</span>
          </h1>
          <p className="text-xl md:text-2xl leading-[1.8] text-[#1a1a1a]/70 font-medium">
            30+ projects across 4 continents. Real challenges, real results.
          </p>
        </div>

        <div className="w-full w-full max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {placeholderCards.map((_, i) => (
              <div key={i} className="group bg-white/60 backdrop-blur-xl rounded-[40px] p-4 border border-white shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] transition-all duration-500">
                {/* Empty Image Placeholder */}
                <div className="relative overflow-hidden bg-[#E0DCD5] rounded-[32px] aspect-[4/3] mb-6 flex items-center justify-center border border-black/5">
                  <div className="font-bold text-[#1a1a1a]/20 text-lg uppercase tracking-widest">
                    Image
                  </div>
                </div>
                {/* Empty Text Skeleton Structure */}
                <div className="px-4 pb-4">
                  <div className="w-3/4 h-6 bg-black/5 rounded-md mb-3" />
                  <div className="w-1/2 h-4 bg-black/5 rounded-md mb-6" />
                  <div className="pt-5 border-t border-black/[0.05]">
                    <div className="text-xs font-bold uppercase tracking-[0.1em] text-[#1a1a1a]/40 mb-3">The Result</div>
                    <div className="w-full h-4 bg-black/5 rounded-md mb-2" />
                    <div className="w-4/5 h-4 bg-black/5 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full px-4 md:px-8 text-center mt-32 md:mt-40">
           <div className="w-full bg-white/80 backdrop-blur-xl p-12 md:p-20 rounded-[48px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.08)] border border-white">
             <h2 className="font-extrabold text-4xl md:text-5xl leading-[1.15] tracking-tight text-[#1a1a1a] mb-8">Your success story starts here.</h2>
             <button onClick={() => go("contact")} className="inline-flex items-center gap-3 text-lg font-bold text-white px-8 py-4 rounded-full transition-all duration-300 hover:scale-[1.05] shadow-[0_15px_30px_-10px_rgba(245,132,31,0.5)] group" style={{ background: `linear-gradient(135deg, ${C_ORANGE}, ${C_PINK})` }}>
               Start a Conversation <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
             </button>
           </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

const C_FRIEND = {
  management:    "#FFB343",
  managementDim: "#FFF8EC",
  events:        "#E91E8C",
  eventsDim:     "#FEF0F8",
  marketing:     "#2AAEDE",
  marketingDim:  "#EDF8FE",
  recruitment:   "#3DAA68",
  recruitmentDim:"#EDF8F2",
};
const GRAD_FRIEND = `linear-gradient(90deg,${C_FRIEND.management},${C_FRIEND.events},${C_FRIEND.marketing},${C_FRIEND.recruitment})`;

const TIMELINE_FRIEND = [
  { year:"2012", label:"Founded",          desc:"Harmony Club House established in Cairo with a bold vision to redefine F&B consulting.", color:C_FRIEND.management },
  { year:"2015", label:"First Expansion",  desc:"Expanded operations across MENA, partnering with Kempinski, Marriott, and Baron Hotels.", color:C_FRIEND.events },
  { year:"2017", label:"Events Division",  desc:"Launched dedicated events arm, delivering 50+ large-scale corporate and private events.", color:C_FRIEND.marketing },
  { year:"2019", label:"Digital & Marketing",desc:"Introduced full-stack marketing services as brands demanded stronger digital presence.", color:C_FRIEND.recruitment },
  { year:"2021", label:"2,500 Trained",    desc:"Milestone: trained over 2,500 hospitality professionals across the region.", color:C_FRIEND.management },
  { year:"2024", label:"4 Continents",     desc:"Active across MENA, Europe, Asia, and the Americas — 30+ projects and growing.", color:C_FRIEND.events },
];

function TimelineSection() {
  return (
    <section id="timeline" className="py-24 overflow-hidden">
      <div className="w-full w-full max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-px w-8" style={{background:GRAD_FRIEND}}/>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400" >Our Journey</span>
            <div className="h-px w-8" style={{background:GRAD_FRIEND}}/>
          </div>
          <h2 className="font-extrabold text-4xl md:text-5xl leading-[1.15] tracking-tight text-[#1a1a1a]">
            13 Years of <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(135deg, #F5841F, #E91E8C)` }}>Excellence</span>
          </h2>
        </div>

        {/* Desktop flowing SVG timeline */}
        <div className="hidden md:block relative" style={{height:"400px", marginTop: "20px"}}>
          <svg viewBox="0 0 1100 200" className="absolute inset-0 w-full" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="tl-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor={C_FRIEND.management}/>
                <stop offset="33%"  stopColor={C_FRIEND.events}/>
                <stop offset="66%"  stopColor={C_FRIEND.marketing}/>
                <stop offset="100%" stopColor={C_FRIEND.recruitment}/>
              </linearGradient>
            </defs>
            {/* Flowing S-curve */}
            <path d="M 60 120 C 160 40, 260 160, 400 100 C 540 40, 640 160, 780 100 C 880 60, 960 140, 1040 100"
              stroke="url(#tl-grad)" strokeWidth="3" fill="none" strokeLinecap="round"/>
            {/* Milestone dots */}
            {[
              {x:60,  y:120},
              {x:220, y:100},
              {x:400, y:100},
              {x:600, y:100},
              {x:780, y:100},
              {x:1040,y:100},
            ].map(({x,y},i)=>{
              const colors=[C_FRIEND.management,C_FRIEND.events,C_FRIEND.marketing,C_FRIEND.recruitment,C_FRIEND.management,C_FRIEND.events];
              return (
                <g key={i}>
                  <circle cx={x} cy={y} r="10" fill={colors[i]} opacity="0.2"/>
                  <circle cx={x} cy={y} r="5.5" fill={colors[i]}/>
                  <circle cx={x} cy={y} r="2.5" fill="white"/>
                </g>
              );
            })}
          </svg>

          {/* Milestone labels */}
          <div className="absolute inset-0 flex items-stretch">
            {TIMELINE_FRIEND.map(({year,label,desc,color},i)=>{
              const xPercents=[5.5,20,36.4,54.5,71,94.5];
              const above=[true,false,true,false,true,false];
              return (
                <div key={year} className="absolute" style={{left:`${xPercents[i]}%`, top:above[i]?"-15%":"65%", width:"200px", transform:"translateX(-50%)"}}>
                  <div className={`${above[i]?"pb-2 text-bottom":"pt-2"}`}>
                    <div className="text-base md:text-lg font-black mb-0.5" style={{color}}>{year}</div>
                    <div className="text-lg md:text-xl font-bold text-gray-900 mb-1" >{label}</div>
                    <div className="text-base text-gray-500 leading-tight">{desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile stacked */}
        <div className="md:hidden space-y-0">
          {TIMELINE_FRIEND.map(({year,label,desc,color},i)=>(
            <div key={year} className="flex gap-8">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full flex-shrink-0 mt-1" style={{background:color}}/>
                {i<TIMELINE_FRIEND.length-1 && <div className="w-0.5 flex-1 mt-1 mb-1" style={{background:`linear-gradient(to bottom, ${color}, ${TIMELINE_FRIEND[i+1].color})`}}/>}
              </div>
              <div className="pb-8">
                <div className="text-xs font-black mb-0.5" style={{color}}>{year}</div>
                <div className="text-2xl font-bold text-gray-900 mb-1" >{label}</div>
                <div className="text-xs text-gray-500 leading-relaxed">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const PARTNERS_FRIEND = [
  { name:"Baron Hotels & Resorts", cat:"Hospitality", domain:"baronhotels.com" },
  { name:"Kempinski",              cat:"Hospitality", domain:"kempinski.com" },
  { name:"Marriott",               cat:"Hospitality", domain:"marriott.com" },
  { name:"Dunkin'",                cat:"F&B",         domain:"dunkindonuts.com" },
  { name:"Hardee's",               cat:"F&B",         domain:"hardees.com" },
  { name:"Krispy Kreme",           cat:"F&B",         domain:"krispykreme.com" },
  { name:"Mori Sushi",             cat:"F&B",         domain:"mori-intl.net" },
  { name:"Tamara",                 cat:"F&B",         domain:"tamarabistro.com" },
  { name:"Grand Cafe",             cat:"F&B",         domain:"grandcafe-eg.com" },
  { name:"Butcher's Burger",       cat:"F&B",         domain:"butchersburger.com" },
  { name:"TBS",                    cat:"Retail",      domain:"tbsfresh.com" },
  { name:"Vodafone",               cat:"Corporate",   domain:"vodafone.com" },
  { name:"BLOM Bank",              cat:"Finance",     domain:"blombank.com" },
  { name:"GUC Cairo",              cat:"Education",   domain:"guc.edu.eg" },
];
const CAT_COLOR_FRIEND: Record<string,string> = {
  Hospitality:C_FRIEND.management, "F&B":C_FRIEND.events, Retail:C_FRIEND.marketing, Corporate:C_FRIEND.recruitment, Finance:C_FRIEND.recruitment, Education:C_FRIEND.marketing,
};

function PartnersSection() {
  const [cat, setCat] = useState("All");
  const cats = ["All", ...Array.from(new Set(PARTNERS_FRIEND.map(p=>p.cat)))];
  const shown = cat==="All" ? PARTNERS_FRIEND : PARTNERS_FRIEND.filter(p=>p.cat===cat);
  return (
    <section id="partners" className="py-24">
      <div className="w-full w-full max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-px w-8" style={{background:GRAD_FRIEND}}/>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400" >Success Partners</span>
            <div className="h-px w-8" style={{background:GRAD_FRIEND}}/>
          </div>
          <h2 className="font-extrabold text-4xl md:text-5xl leading-[1.15] tracking-tight text-[#1a1a1a] mb-4">
            Trusted by <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(135deg, #F5841F, #E91E8C)` }}>Industry Giants</span>
          </h2>
          <p className="text-lg font-medium leading-[1.7] text-[#1a1a1a]/60 max-w-4xl mx-auto">
            From global hospitality leaders and banking institutions to iconic F&B brands — 14 trusted partners across the industry.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {cats.map(c=>(
            <button key={c} onClick={()=>setCat(c)}
              className="px-4 py-1.5 rounded-full text-xs font-bold transition-all"
              style={{background:cat===c?"#1a1a1a":"#efefef", color:cat===c?"white":"#666"}}>
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {shown.map(({name,cat:c, domain})=>(
            <div key={name}
              className="group relative overflow-hidden bg-white rounded-2xl px-4 py-5 text-center border border-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-default"
            >
              <div className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-[0.08] transition-opacity duration-300 group-hover:opacity-[0.15]" 
                   style={{ backgroundImage: `url(https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${domain}&size=128)`, backgroundSize: '50%', backgroundPosition: 'center' }} />
              <div className="relative z-10">
                <div className="w-8 h-0.5 rounded-full mx-auto mb-3 transition-all duration-300"
                  style={{background:"#d1d5db"}}
                  onMouseEnter={e=>(e.currentTarget.style.background=CAT_COLOR_FRIEND[c]||C_FRIEND.management)}
                  onMouseLeave={e=>(e.currentTarget.style.background="#d1d5db")}
                />
                <div className="text-2xl font-bold text-gray-300 leading-tight transition-all duration-300 group-hover:text-gray-800"
                  >
                  {name}
                </div>
                <div className="text-xs mt-1.5 font-medium text-gray-300 transition-all duration-300 group-hover:text-gray-400">{c}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutPage({ go }: { go: (p: Page) => void }) {
  const whyPartnerReasons = [
    { title: "End-to-End Expertise", text: "We expertly navigate the complexities of business setup, managing legal structures, financial planning, and facility logistics so you can focus entirely on scaling your core business.", color: "#F5841F", bgImage: "/imports/bg_expertise.png" },
    { title: "Data-Driven Results", text: "We identify weak spots and elevate your strengths through rigorous analysis, ensuring your business is structurally built for long-term profitability.", color: "#E91E8C", bgImage: "/imports/bg_data.png" },
    { title: "Global Standards", text: "We seamlessly blend elite international hospitality benchmarks with our deep, localized knowledge of the Egyptian market to deliver highly creative and practical solutions.", color: "#3AADE0", bgImage: "/imports/bg_standards.png" }
  ];

  const coreValues = [
    { icon: Lightbulb, title: "Practical Wisdom", text: "Our consultancy goes beyond theory; it is deeply anchored in the reality of navigating the global hospitality industry.", color: "#F5841F", bgImage: "/imports/bg_wisdom.png" },
    { icon: Heart, title: "Harmonious Partnership", text: "By fully understanding your brand's unique character, we act as a true extension of your team to create customized, perfectly aligned solutions.", color: "#E91E8C", bgImage: "/imports/bg_partnership.png" },
    { icon: BarChart, title: "Operational Integrity", text: "We commit to absolute transparency, using data-driven precision to repair operations and ensure your business transitions to profitability.", color: "#3AADE0", bgImage: "/imports/bg_integrity.png" },
    { icon: Users, title: "Human-Centric Growth", text: "We recognize that a business relies on its people, heavily investing in high-qualification teams through expert recruitment and rigorous training.", color: "#78BE1F", bgImage: "/imports/bg_growth.png" },
    { icon: ShieldCheck, title: "Quality Without Compromise", text: "We strictly adhere to the highest international safety and efficiency standards across all food, kitchen, and event logistics.", color: "#F5841F", bgImage: "/imports/bg_quality.png" },
    { icon: Zap, title: "Innovation & Agility", text: "We keep your brand relevant in a dynamic market by blending creative concept development with cutting-edge digital tools.", color: "#E91E8C", bgImage: "/imports/bg_innovation.png" }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF7F2] text-[#1a1a1a] relative">
      {/* Soft Colorful Ambient Backgrounds */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] bg-[#F5841F]/15 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] bg-[#3AADE0]/10 blur-[150px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vw] bg-[#E91E8C]/15 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      <div className="relative z-10 pb-32 pt-24 w-full px-0">
        
        {/* NEW DYNAMIC ABOUT HERO (Replaces image_0ef220.jpg) */}
        <div className="w-full mb-24 md:mb-32 relative px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-center">
            
            {/* Left Column: Text & Floating Stats */}
            <div className="lg:col-span-7 space-y-10 relative z-20">
              <div>
                <h1 className="font-extrabold text-5xl md:text-6xl leading-[1.1] tracking-tight text-[#1a1a1a]">
                  We don't just consult,<br/>
                  <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(135deg, ${C_ORANGE}, ${C_PINK})` }}>
                    We partner.
                  </span>
                </h1>
              </div>
              
              <p className="text-xl md:text-2xl leading-[1.8] text-[#1a1a1a]/70 font-medium max-w-4xl">
                Harmony Club House is a premier platform for F&B development and hospitality consultancy, empowering investors and operators to unlock the full potential of their ventures. Established in 2012, we bring over 13 years of hands-on international experience to build your success.
              </p>

              {/* Glassmorphism Stats Bar */}
              <div className="bg-white/80 backdrop-blur-2xl p-6 md:p-8 rounded-[32px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] border border-white max-w-4xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-8">
                  {[
                    { icon: Clock, val: "13+", label: "Years Exp.", color: C_ORANGE },
                    { icon: Globe, val: "4", label: "Continents", color: C_PINK },
                    { icon: Rocket, val: "30+", label: "Projects", color: C_BLUE },
                    { icon: GraduationCap, val: "2,500+", label: "Trained", color: C_GREEN }
                  ].map((stat, i) => (
                    <div key={i} className="flex flex-col items-center text-center group">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:-translate-y-1" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                        <stat.icon size={22} />
                      </div>
                      <div className="font-black text-3xl md:text-4xl text-[#1a1a1a] leading-none mb-1">{stat.val}</div>
                      <div className="text-sm md:text-base font-bold text-[#1a1a1a]/50 uppercase tracking-widest">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Modern Staggered Pillars Grid */}
            <div className="lg:col-span-5 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#F5841F]/20 via-[#E91E8C]/20 to-[#3AADE0]/20 blur-[60px] rounded-full" />
              
              <div className="grid grid-cols-2 gap-8 relative z-10">
                {/* Offset Column 1 */}
                <div className="space-y-8 pt-12">
                  <div className="relative h-64 rounded-[32px] overflow-hidden group shadow-lg">
                    <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&q=80" alt="Management" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#F5841F] via-[#F5841F]/40 to-transparent opacity-90" />
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <Building2 size={24} className="mb-2 opacity-80" />
                      <h4 className="font-bold text-3xl">Management</h4>
                    </div>
                  </div>
                  <div className="relative h-56 rounded-[32px] overflow-hidden group shadow-lg">
                    <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500&q=80" alt="Marketing" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#3AADE0] via-[#3AADE0]/40 to-transparent opacity-90" />
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <Megaphone size={24} className="mb-2 opacity-80" />
                      <h4 className="font-bold text-3xl">Marketing</h4>
                    </div>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="space-y-8">
                  <div className="relative h-56 rounded-[32px] overflow-hidden group shadow-lg">
                    <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500&q=80" alt="Events" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#E91E8C] via-[#E91E8C]/40 to-transparent opacity-90" />
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <Calendar size={24} className="mb-2 opacity-80" />
                      <h4 className="font-bold text-3xl">Events</h4>
                    </div>
                  </div>
                  <div className="relative h-64 rounded-[32px] overflow-hidden group shadow-lg">
                    <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=500&q=80" alt="Recruitment" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#78BE1F] via-[#78BE1F]/40 to-transparent opacity-90" />
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <UserCheck size={24} className="mb-2 opacity-80" />
                      <h4 className="font-bold text-3xl">Recruitment</h4>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Text */}
              <div className="absolute -bottom-12 -right-4 md:right-4 text-right">
                 <div className="italic font-bold text-3xl md:text-3xl text-[#1a1a1a]/40">Bridging Challenges.</div>
                 <div className="italic font-bold text-3xl md:text-3xl text-[#E91E8C]">Building Success.</div>
              </div>
            </div>

          </div>
          
          {/* Explore More Indicator */}
          <div 
            onClick={() => document.getElementById("why-partner")?.scrollIntoView({ behavior: "smooth" })}
            className="w-full flex flex-col items-center justify-center mt-12 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
          >
            <span className="uppercase tracking-[0.2em] font-bold text-sm text-[#1a1a1a]/60 mb-2">Explore Our Journey</span>
            <ChevronDown className="animate-bounce text-[#F5841F]" size={24} />
          </div>
        </div>

        <TimelineSection />

        {/* Why Partner With Us */}
        <div id="why-partner" className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 mb-24 md:mb-32">
          <div className="text-center mb-24 md:mb-32">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-px w-8" style={{background:GRAD_FRIEND}}/>
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400" >Why Choose Us</span>
              <div className="h-px w-8" style={{background:GRAD_FRIEND}}/>
            </div>
            <h2 className="font-extrabold text-4xl md:text-5xl leading-[1.15] tracking-tight text-[#1a1a1a] mb-6">
              Why Partner With <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(135deg, #F5841F, #E91E8C)` }}>Us?</span>
            </h2>
            <p className="text-xl md:text-2xl leading-[1.8] text-[#1a1a1a]/70 font-medium max-w-4xl mx-auto">
              We believe every brand has a unique story, and we help you tell it through operational excellence anchored in first-hand experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {whyPartnerReasons.map((r, i) => (
              <div key={i} className="relative overflow-hidden bg-white/80 backdrop-blur-lg p-10 md:p-12 rounded-[40px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] border border-white hover:-translate-y-2 transition-transform duration-500 group">
                <div className="absolute inset-0 bg-cover bg-center opacity-[0.08] transition-opacity duration-500 group-hover:opacity-[0.15]" style={{ backgroundImage: `url(${r.bgImage})` }} />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mb-8" style={{ backgroundColor: `${r.color}15`, color: r.color }}>
                    <span className="font-bold text-xl">0{i+1}</span>
                  </div>
                  <h3 className="font-bold text-2xl leading-[1.3] text-[#1a1a1a] mb-4">{r.title}</h3>
                  <p className="text-lg leading-[1.7] text-[#1a1a1a]/60">{r.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Core Values */}
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 mb-24 md:mb-32">
          <div className="text-center mb-24 md:mb-32">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-px w-8" style={{background:GRAD_FRIEND}}/>
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400" >Our Principles</span>
              <div className="h-px w-8" style={{background:GRAD_FRIEND}}/>
            </div>
            <h2 className="font-extrabold text-4xl md:text-5xl leading-[1.15] tracking-tight text-[#1a1a1a]">
              Our Core <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(135deg, #F5841F, #E91E8C)` }}>Values</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-8 w-full">
            {coreValues.map((v, i) => (
              <div key={i} className="relative overflow-hidden bg-white p-8 md:p-10 rounded-[32px] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] border border-white hover:-translate-y-2 transition-all duration-500 group">
                <div className="absolute inset-0 bg-cover bg-center opacity-[0.08] transition-opacity duration-500 group-hover:opacity-[0.15]" style={{ backgroundImage: `url(${v.bgImage})` }} />
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-[20px] flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110" style={{ backgroundColor: `${v.color}15`, color: v.color }}>
                    <v.icon size={28} strokeWidth={2} />
                  </div>
                  <h3 className="font-bold text-2xl leading-[1.3] text-[#1a1a1a] mb-3">{v.title}</h3>
                  <p className="text-lg leading-[1.7] text-[#1a1a1a]/60">{v.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Success Partners */}
        <PartnersSection />

        {/* Footer / Bottom Image */}
        <div className="w-full flex justify-center mt-16 md:mt-24 mb-16 px-6">
           
        </div>
      </div>
      <Footer />
    </div>
  );
}



function MissionPage({ go }: { go: (p: Page) => void }) {
  const pillars = [
    { icon: Settings, title: "Operational Excellence", text: "We repair weak spots and elevate strengths through strategic planning and precise analysis.", color: "#F5841F", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop&auto=format" },
    { icon: Users, title: "Human Capital Development", text: "We build high-performing teams through expert recruitment and hands-on training for long-term stability.", color: "#E91E8C", image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop&auto=format" },
    { icon: ShieldCheck, title: "Quality & Safety", text: "We deliver world-class F&B and facility services, strictly adhering to the highest international safety and hygiene standards.", color: "#3AADE0", image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&h=600&fit=crop&auto=format" },
    { icon: Lightbulb, title: "Creative Innovation", text: "We blend concept creation with artistic execution—from menu engineering to digital marketing—to deliver memorable customer experiences.", color: "#78BE1F", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop&auto=format" },
    { icon: Handshake, title: "Client-Centric Approach", text: "We handle the complex operations and logistics so you can focus on your core business. We build long-term partnerships by understanding your unique brand story.", color: "#F5841F", image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&fit=crop&auto=format" }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF7F2] text-[#1a1a1a] relative">

      {/* Soft Colorful Ambient Backgrounds (Fixed to cover entire scroll) */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] bg-[#F5841F]/15 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] bg-[#3AADE0]/10 blur-[150px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vw] bg-[#E91E8C]/15 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      <div className="relative z-10 pb-16">
        
        {/* Top Image*/}
        <div className="w-full flex justify-center mb-16 px-0 mt-8">
          <div className="relative w-full overflow-hidden border-y border-white/60 group bg-white/40 backdrop-blur-sm">
            {/* Soft overlay gradient for aesthetics */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 z-10 pointer-events-none transition-opacity duration-700 group-hover:opacity-0" />
            
            <ImageWithFallback 
              src={missionTopImg} 
              alt="Mission and Vision" 
              className="w-full h-auto object-contain transition-transform duration-[2s] group-hover:scale-[1.02]" 
            />
          </div>
        </div>

        {/* Section 1: Our Mission */}
        <div className="w-full mb-24 md:mb-32 px-4 md:px-8">
          <div className="relative w-full overflow-hidden bg-white/80 backdrop-blur-2xl p-12 md:p-24 rounded-[40px] border border-white/60 shadow-[0_25px_60px_-25px_rgba(0,0,0,0.06)] text-center">
            {/* Colorful soft glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] bg-[#F5841F]/15 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-[#E91E8C]/15 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 max-w-[900px] mx-auto">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
                <span className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/50">Mission</span>
                <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
              </div>
              <h1 className="font-extrabold text-5xl md:text-6xl leading-[1.1] tracking-tight mb-8 text-[#1a1a1a]">
                Our <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(135deg, #F5841F, #E91E8C)` }}>Mission.</span>
              </h1>
              <p className="text-xl md:text-2xl leading-[1.8] text-[#1a1a1a]/70 font-medium">
                Our mission is to bridge the gap between operational excellence and sustainable growth. We offer end-to-end, integrated solutions tailored to your unique brand.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Our Commitments (The 5 Pillars) */}
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 mb-16">
          <div className="text-center mb-24 md:mb-32">
            <h2 className="font-extrabold text-4xl md:text-5xl leading-[1.15] tracking-tight text-[#1a1a1a]">We are committed to:</h2>
          </div>
          {/* Centering a 5-card grid by using flex wrap or custom grid col spans */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-8">
            {pillars.map((p, i) => (
              <div key={p.title} className="relative group w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] bg-white/60 backdrop-blur-xl rounded-[40px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] border border-white hover:-translate-y-2 transition-transform duration-500 overflow-hidden">
                {/* Faded Background Image */}
                <div className="absolute inset-0 z-0 opacity-[0.12] transition-opacity duration-500 group-hover:opacity-20">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover mix-blend-luminosity" />
                </div>
                {/* Gradient overlay to ensure text legibility */}
                <div className="absolute inset-0 z-0 bg-gradient-to-br from-white/90 to-white/40 pointer-events-none" />
                
                <div className="relative z-10 p-8 md:p-10">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: `${p.color}15`, color: p.color }}>
                    <p.icon size={24} />
                  </div>
                  <h3 className="font-bold text-2xl text-[#1a1a1a] mb-3 leading-[1.3]">{p.title}</h3>
                  <p className="text-lg leading-[1.7] text-[#1a1a1a]/60">{p.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Our Vision */}
        <div className="w-full mb-24 px-4 md:px-8">
          <div className="relative w-full overflow-hidden bg-white/80 backdrop-blur-2xl p-12 md:p-24 rounded-[40px] border border-white/60 shadow-[0_25px_60px_-25px_rgba(0,0,0,0.06)] text-center">
            {/* Colorful soft glows */}
            <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] bg-[#E91E8C]/15 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-[#3AADE0]/15 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 max-w-[900px] mx-auto">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
                <span className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/50">Vision</span>
                <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
              </div>
              <h2 className="font-extrabold text-5xl md:text-6xl tracking-tight text-[#1a1a1a] mb-8">
                Our <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(135deg, #3AADE0, #E91E8C)` }}>Vision.</span>
              </h2>
              <p className="text-xl md:text-2xl text-[#1a1a1a]/70 leading-[1.8] font-medium">
                To become a leading force in the hospitality industry by providing services beyond expectations. We implement flawless operational and event experiences that exceed client goals and unlock every project's highest potential.
              </p>
            </div>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}



function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", company: "", service: "", message: "" });
  const [sent, setSent] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF7F2]">
      <div className="w-full px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_500px] gap-16 items-start">
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight text-[#1a1a1a] mb-6">Let's build something great.</h1>
            <p className="text-xl md:text-2xl text-[#1a1a1a]/70 font-medium leading-[1.8] mb-10 max-w-2xl">Whether you have a clear brief or just a big ambition — reach out.</p>
            <div className="space-y-5">
              {[{ Icon: Mail, text: "hello@harmonyclubhouse.com" }, { Icon: Phone, text: "+20 100 000 0000" }, { Icon: MapPin, text: "Cairo, Egypt — 4 Continents" }].map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-8">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${C_ORANGE}15` }}>
                    <Icon size={16} style={{ color: C_ORANGE }} />
                  </div>
                  <span className="text-lg text-[#1a1a1a]/60">{text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-black/[0.06]">
            {sent ? (
              <div className="py-12 text-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: `${C_GREEN}15` }}>
                  <CheckCircle2 size={26} style={{ color: C_GREEN }} />
                </div>
                <h2 className="font-extrabold text-4xl md:text-5xl leading-[1.15] text-[#1a1a1a] mb-3">Message received.</h2>
                <p className="text-lg text-[#1a1a1a]/60 font-medium leading-[1.7]">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-5">
                <h2 className="font-extrabold text-4xl md:text-5xl leading-[1.15] tracking-tight text-[#1a1a1a] mb-6">Tell us about your project.</h2>
                {[
                  { label: "Your name", key: "name" as const, type: "text", placeholder: "Ahmed Hassan", required: true },
                  { label: "Email address", key: "email" as const, type: "email", placeholder: "ahmed@brand.com", required: true },
                  { label: "Company / Brand", key: "company" as const, type: "text", placeholder: "Your brand name", required: false },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#1a1a1a]/35 block mb-2">{f.label}</label>
                    <input type={f.type} required={f.required} value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.placeholder}
                      className="w-full text-base text-[#1a1a1a] bg-[#FAF7F2] border border-black/[0.08] rounded-xl px-4 py-3 outline-none focus:border-black/25 transition-colors placeholder:text-[#1a1a1a]/20" />
                  </div>
                ))}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#1a1a1a]/35 block mb-2">Area of interest</label>
                  <div className="relative">
                    <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}
                      className="w-full text-base text-[#1a1a1a] bg-[#FAF7F2] border border-black/[0.08] rounded-xl px-4 py-3 outline-none focus:border-black/25 transition-colors appearance-none cursor-pointer">
                      <option value="">Select a service</option>
                      {["Business Developement", "Events & Catering", "Marketing", "Recruitment & Training", "Not sure yet"].map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#1a1a1a]/35 block mb-2">Your message</label>
                  <textarea required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us about your goals..."
                    className="w-full text-base text-[#1a1a1a] bg-[#FAF7F2] border border-black/[0.08] rounded-xl px-4 py-3 outline-none focus:border-black/25 transition-colors resize-none placeholder:text-[#1a1a1a]/20" />
                </div>
                <button type="submit"
                  className="w-full text-lg font-bold text-white py-4 rounded-full flex items-center justify-center gap-2 hover:opacity-90 transition-all duration-200 group"
                  style={{ background: `linear-gradient(135deg, ${C_ORANGE}, ${C_PINK})` }}>
                  Send Message <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────


const FOOTER_SOCIAL_ICONS = [
  { Icon: Instagram, label: "Instagram", color: C_PINK },
  { Icon: Facebook, label: "Facebook", color: C_BLUE },
  { Icon: Linkedin, label: "LinkedIn", color: C_BLUE },
  { Icon: Twitter, label: "Twitter / X", color: C_BLUE },
  { Icon: Youtube, label: "YouTube", color: C_ORANGE },
];

const FOOTER_SERVICES = [
  { id: "management", color: "#F5841F", label: "Management", features: ["Pre-opening planning & setup", "Operations audit & restructuring", "Menu engineering", "P&L optimization"] },
  { id: "events", color: "#E91E8C", label: "Events & Catering", features: ["Venue scouting & negotiation", "Bespoke catering design", "AV & décor coordination", "Guest management"] },
  { id: "marketing", color: "#3AADE0", label: "Marketing", features: ["Brand identity & positioning", "Social media strategy", "Influencer & PR campaigns", "Photography direction"] },
  { id: "recruitment", color: "#78BE1F", label: "Recruitment", features: ["Executive placement", "Chef & culinary sourcing", "FOH & BOH recruitment", "Event & seasonal staffing"] }
];

function Footer() {
  return (
    <footer className="relative bg-[#FAF7F2] border-t border-gray-100 w-full overflow-hidden shrink-0">
      
      {/* Soft Ambient Background matching the screenshot */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[5%] w-[50vw] h-[50vw] bg-[#F5841F]/10 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-10%] right-[10%] w-[40vw] h-[40vw] bg-[#3AADE0]/10 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute top-[20%] left-[40%] w-[40vw] h-[40vw] bg-[#E91E8C]/10 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      <div className="relative z-10">
        {/* The Colorful Bar */}
        <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #F5841F, #E91E8C, #3AADE0, #78BE1F)' }} />
        
        <div className="w-full w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-16">
          <div className="grid md:grid-cols-5 gap-12 mb-16">
            <div className="md:col-span-2">
              <div className="flex items-center gap-8 mb-6">
                <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-white border border-gray-100 p-1.5 shadow-sm">
                  <img src="/imports/friend-logo.png" alt="HCH" className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="font-extrabold text-[#1a1a1a] text-lg tracking-tight leading-none mb-1.5">HARMONY CLUB HOUSE</div>
                  <div className="text-xs text-[#1a1a1a]/40 font-bold uppercase tracking-wider">Est. 2012 &middot; Cairo, Egypt</div>
                </div>
              </div>
              <p className="text-lg text-[#1a1a1a]/60 font-medium leading-[1.8] max-w-[320px]">
                Premier F&B development and hospitality consultancy with over 13 years of international excellence.
              </p>
            </div>
            
            {FOOTER_SERVICES.map(s => (
              <div key={s.id}>
                <div className="text-xs font-extrabold mb-4 uppercase tracking-widest" style={{ color: s.color }}>{s.label}</div>
                {s.features.map(f => (
                  <div key={f} className="text-lg text-[#1a1a1a]/50 mb-3 hover:text-[#1a1a1a] cursor-pointer transition-colors leading-relaxed font-medium">{f}</div>
                ))}
              </div>
            ))}
          </div>
          
          <div className="pt-8 border-t border-black/[0.04] flex flex-col md:flex-row items-center justify-between gap-8 text-base text-[#1a1a1a]/40 font-medium">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <span>&copy; 2026 Harmony Club House. All rights reserved.</span>
              <div className="flex gap-8">
                {FOOTER_SOCIAL_ICONS.map(({ Icon, label, color }) => (
                  <button
                    key={label}
                    aria-label={label}
                    className="w-10 h-10 rounded-full bg-white/50 backdrop-blur-sm shadow-sm border border-black/5 flex items-center justify-center text-[#1a1a1a]/40 transition-all duration-300 hover:scale-110 hover:bg-white hover:shadow-md"
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = color; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = ""; }}
                  >
                    <Icon size={16} />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-8">
              {["Privacy", "Terms", "Cookies"].map(l => (
                <span key={l} className="hover:text-[#1a1a1a] cursor-pointer transition-colors">{l}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

const SERVICE_IDS = SERVICES.map((s) => s.id);
const isServicePage = (p: Page): p is ServiceId =>
  (SERVICE_IDS as string[]).includes(p);

export default function App() {
  const [page, setPage] = useState<Page>("about");

  const go = (p: Page) => setPage(p);

  return (
    <BriefProvider>
      <div
        className="h-screen overflow-hidden flex flex-col"
        style={{ background: "#FAF7F2", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <Nav current={page} go={go} />
        {page === "services" && (
          <ServicesOverview onOpen={(id) => go(id)} onBook={() => go("booking")} />
        )}
        {isServicePage(page) && (
          <SectorPage
            key={page}
            service={SERVICE_BY_ID[page]}
            onBook={() => go("booking")}
            story={page === "marketing" ? <MarketingStory /> : undefined}
          />
        )}
        {page === "booking" && <BookingPage onBrowse={() => go("services")} />}
        {page === "stories" && <StoriesPage go={go} />}
        {page === "about" && <AboutPage go={go} />}
        {page === "mission" && <MissionPage go={go} />}
        {page === "login" && <LoginPage go={go} />}
        {page === "contact" && <ContactPage />}
        {page === "admin" && <AdminDashboard />}

        {/* The running selection follows the visitor everywhere except checkout
            and sign-in, where it would sit on top of the form. */}
        {page !== "booking" && page !== "login" && page !== "admin" && (
          <BriefBar onBook={() => go("booking")} />
        )}
      </div>
    </BriefProvider>
  );
}







