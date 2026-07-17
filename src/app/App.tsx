"use client"

import { useState } from "react";
import { motion } from "motion/react";
import { ImageWithFallback } from "@/components";
import {      
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Youtube,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  Menu,
  X,
  Settings, 
  Users, 
  ShieldCheck, 
  Lightbulb, 
  Handshake 
, Calendar, UserCheck, ChevronRight, PenTool, Utensils, TrendingUp, BarChart, ChefHat , Coffee, Briefcase, PartyPopper, Sparkles , Search, ClipboardCheck, UsersRound, Repeat, BookOpen, GraduationCap, LineChart, Palette, MonitorSmartphone, Target, Megaphone , Building2, Landmark, Music, LayoutTemplate , PieChart, Building, Monitor, Heart, Zap } from 'lucide-react';

// Image paths - move images from src/imports to public/imports
const logoImg = "/imports/image-10.png";
const mgmtIcon = "/imports/image.png";
const eventsIcon = "/imports/image-2.png";
const marketingIcon = "/imports/image-3.png";
const recruitmentIcon = "/imports/image-4.png";
const welcomeImg = "/imports/image-11.png";
const aboutImg1 = "/imports/image-12.png";
const aboutImg2 = "/imports/image-13.png";
const aboutImg3 = "/imports/image-14.png";
const aboutImg4 = "/imports/image-15.png";
const interactiveImg = "/imports/image-5.png";
const partnersBottomImg = "/imports/image-6.png";
const missionTopImg = "/imports/image-7.png";
const divFnbImg = "/imports/image-16.png";
const divCateringImg = "/imports/image-17.png";
const teamImg = "/imports/image-18.png";

type Page = "home" | "services" | "stories" | "about" | "mission" | "fnb" | "catering" | "recruitment" | "marketing" | "events" | "management" | "contact";

const C_ORANGE = "#F5841F";
const C_PINK = "#E91E8C";
const C_BLUE = "#3AADE0";
const C_GREEN = "#78BE1F";

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
    current === page && current !== "home" && current !== "contact";

  return (
    <header className="bg-[#FAF7F2] border-b border-black/[0.07] flex-shrink-0 z-50 relative">
      <div className="h-[80px] md:h-[90px] flex items-center px-6 md:px-12 gap-8">
        {/* Brand */}
        <button
          onClick={() => { go("home"); }}
          className="flex-shrink-0 flex items-center gap-2.5 transition-opacity hover:opacity-80 text-left"
        >
          <ImageWithFallback src="/imports/friend-logo.png" alt="Harmony Club House" className="h-9 w-9 object-contain rounded-full"/>
          <div className="hidden sm:block">
            <div className="text-[13px] font-black leading-none tracking-widest text-gray-900" style={{fontFamily:"'Montserrat',sans-serif"}}>HARMONY</div>
            <div className="text-[8px] font-semibold tracking-[0.22em] text-gray-400 leading-none mt-0.5" style={{fontFamily:"'Montserrat',sans-serif"}}>CLUB HOUSE</div>
          </div>
        </button>

        {/* Tab links — desktop */}
        <nav className="hidden md:flex items-center gap-2 flex-1 justify-center">
          {tabs.map(({ label, page }) => (
            <button
              key={label}
              onClick={() => go(page)}
              className={`relative font-['Plus_Jakarta_Sans'] text-[14.5px] font-bold px-4 py-2.5 rounded-full transition-all duration-300 ${
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
          ))}
        </nav>

        <div className="flex-1 md:hidden" />

        {/* Contact CTA */}
        <button
          onClick={() => go("contact")}
          className="hidden md:inline-flex font-['Plus_Jakarta_Sans'] text-[14px] font-bold text-white px-7 py-3 rounded-full transition-all duration-300 hover:scale-[1.05] shadow-[0_10px_20px_-10px_rgba(233,30,140,0.5)] flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${C_ORANGE}, ${C_PINK})` }}
        >
          Contact Us
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
        <div className="md:hidden border-t border-black/[0.07] bg-[#FAF7F2] px-6 py-6 flex flex-col gap-4 absolute w-full shadow-xl">
          {tabs.map(({ label, page }) => (
            <button
              key={label}
              onClick={() => { go(page); setMobileOpen(false); }}
              className="text-left font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#1a1a1a]/70 hover:text-[#1a1a1a] transition-colors"
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => { go("contact"); setMobileOpen(false); }}
            className="mt-4 font-['Plus_Jakarta_Sans'] text-[14px] font-bold text-white py-3.5 rounded-full shadow-[0_10px_20px_-10px_rgba(233,30,140,0.5)]"
            style={{ background: `linear-gradient(135deg, ${C_ORANGE}, ${C_PINK})` }}
          >
            Contact Us
          </button>
        </div>
      )}
    </header>
  );
}

// ─── Home Page (single-screen) ────────────────────────────────────────────────

function HomePage({ go }: { go: (p: Page) => void }) {
  const services: { img: string; label: string; page: Page; color: string; glow: string; }[] = [
    { img: mgmtIcon, label: "Management", page: "management", color: C_ORANGE, glow: `${C_ORANGE}35` },
    { img: eventsIcon, label: "Events", page: "events", color: C_PINK, glow: `${C_PINK}35` },
    { img: marketingIcon, label: "Marketing", page: "marketing", color: C_BLUE, glow: `${C_BLUE}35` },
    { img: recruitmentIcon, label: "Recruitment", page: "recruitment", color: C_GREEN, glow: `${C_GREEN}35` },
  ];


  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto bg-[#FAF7F2] relative">

      {/* Soft Colorful Ambient Backgrounds (Fixed to cover entire scroll) */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] bg-[#F5841F]/15 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] bg-[#3AADE0]/10 blur-[150px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vw] bg-[#E91E8C]/15 blur-[120px] rounded-full mix-blend-multiply" />
      </div>


      <div className="relative z-10 pb-32">
        {/* ── Hero ─────────────────────────────────────────────── */}
        <div className="flex flex-col items-center pb-20">
          {/* Logo */}
          <div className="w-full flex justify-center mb-12">
            <ImageWithFallback
              src={logoImg}
              alt="Harmony Club House"
              className="object-cover w-full h-auto drop-shadow-xl"
            />
          </div>

          {/* Headline */}
          <div className="text-center max-w-[860px] px-6">
            <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[#1a1a1a] leading-[1.15] tracking-tight mb-8" style={{ fontSize: "30px" }}>
              Elevating hospitality through expert <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(135deg, ${C_ORANGE}, ${C_PINK})` }}>management</span>, curated <span style={{ color: C_PINK }}>events</span>, strategic <span style={{ color: C_BLUE }}>marketing</span>, and top-tier <span style={{ color: C_GREEN }}>recruitment</span>.
            </h1>
            <p className="font-['Plus_Jakarta_Sans'] text-center text-[#1a1a1a]/60 max-w-[600px] mx-auto font-medium leading-[1.8]" style={{ fontSize: "clamp(13px, 1.5vw, 16px)" }}>
              We bridge the gap between ambition and operational reality, transforming concepts into industry-leading destinations.
            </p>
          </div>
        </div>

        {/* ── Welcome Section ──────────────────────────────────── */}
        <div className="max-w-[1200px] w-full mx-auto px-6 mb-32 md:mb-48">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
            <div className="relative order-2 md:order-1 group">
               <div className="absolute inset-0 bg-gradient-to-r from-[#F5841F]/30 via-[#E91E8C]/20 to-[#3AADE0]/30 blur-[50px] rounded-[48px] opacity-30 group-hover:opacity-60 transition-opacity duration-700" />
               <div className="relative bg-white/60 backdrop-blur-2xl rounded-[48px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white/60 overflow-hidden">
                <div className="aspect-[4/3] bg-black/5 w-full">
                  <ImageWithFallback 
                    src={welcomeImg} 
                    alt="Hospitality Interior" 
                    className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-[1.03]"
                  />
                </div>
                {/* Small circular badge */}
                <div className="absolute bottom-4 right-4 w-24 h-24 md:w-28 md:h-28 bg-white/80 backdrop-blur-xl rounded-full p-2 shadow-xl shadow-black/5 flex items-center justify-center border border-white">
                  <div className="w-full h-full rounded-full border border-dashed border-[#1a1a1a]/20 flex flex-col items-center justify-center font-['Plus_Jakarta_Sans'] text-[#1a1a1a]">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/50">Est.</span>
                    <span className="text-[16px] font-extrabold">2013</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2 text-center md:text-left">
              <div className="inline-flex items-center gap-3 mb-6">
  <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
  <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold uppercase tracking-widest text-[#1a1a1a]/50">Welcome</span>
  <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
</div>
              <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[32px] md:text-[48px] text-[#1a1a1a] mb-8 leading-[1.1] tracking-tight">
                Welcome to Harmony Club House
              </h2>
              <p className="font-['Plus_Jakarta_Sans'] text-[16px] md:text-[18px] text-[#1a1a1a]/70 leading-[1.8] font-medium">
                We are a premium hospitality consultancy dedicated to elevating brand experiences. With over 13 years of industry obsession, we provide hands-on leadership, strategic direction, and creative execution to hospitality businesses worldwide. Our approach is grounded in evidence, accountability, and putting people at the center of every strategy.
              </p>
            </div>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}


function ServicesPage({ go }: { go: (p: Page) => void }) {
  const SERVICES = [
    { id:"management", color: C_ORANGE, dim: `${C_ORANGE}15`, label:"Management",  tagline:"Operational Excellence",   icon: Building2,
      desc:"From concept feasibility and kitchen design to full operational restructuring. We embed with your team to build venues that perform.",
      image:"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop&auto=format" },
    { id:"events",     color: C_PINK,      dim: `${C_PINK}15`,      label:"Events",      tagline:"Unforgettable Experiences",icon: Calendar,
      desc:"From intimate corporate dinners to grand galas — every detail handled. Venue sourcing, catering design, logistics, and on-the-day execution.",
      image:"https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop&auto=format" },
    { id:"marketing",  color: C_BLUE,   dim: `${C_BLUE}15`,   label:"Marketing",   tagline:"Brand & Digital Growth",  icon: Megaphone,
      desc:"We build hospitality brands that resonate. Identity, digital strategy, influencer campaigns, and PR — all under one roof.",
      image:"https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop&auto=format" },
    { id:"recruitment",color: C_GREEN, dim: `${C_GREEN}15`, label:"Recruitment", tagline:"Talent Acquisition",      icon: UserCheck,
      desc:"We source, vet, and place hospitality professionals across every function. Our global network spans four continents.",
      image:"https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop&auto=format" },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF7F2] text-[#1a1a1a] relative">
      {/* Soft Colorful Ambient Backgrounds */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] bg-[#F5841F]/15 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] bg-[#3AADE0]/10 blur-[150px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vw] bg-[#E91E8C]/15 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      <div className="relative z-10 pt-24 pb-0">
        <div className="max-w-[1200px] mx-auto px-6 text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
            <span className="font-['Plus_Jakarta_Sans'] text-[11px] md:text-[12px] font-bold uppercase tracking-[0.2em] text-[#1a1a1a]/50">WHAT WE DO</span>
            <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
          </div>
          <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[40px] md:text-[60px] leading-[1.1] tracking-tight mb-8 text-[#1a1a1a]">
            Four Pillars of Expertise
          </h1>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 mb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {SERVICES.map((s) => (
              <div key={s.id} className="group flex flex-col bg-white rounded-[32px] overflow-hidden shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2">
                <div className="h-1.5 w-full" style={{background:s.color}}/>
                <div className="relative h-56 overflow-hidden bg-[#FAF7F2]">
                  <img src={s.image} alt={s.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent opacity-80" />
                </div>
                <div className="p-8 flex flex-col flex-1 bg-white relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform duration-500 group-hover:scale-110" style={{background:s.dim}}>
                      <s.icon size={22} style={{color:s.color}} />
                    </div>
                    <div>
                      <p className="font-['Plus_Jakarta_Sans'] text-[10px] font-bold uppercase tracking-widest mb-1" style={{color:s.color}}>{s.tagline}</p>
                      <h3 className="font-['Plus_Jakarta_Sans'] text-[22px] font-extrabold text-[#1a1a1a] leading-tight">{s.label}</h3>
                    </div>
                  </div>
                  <p className="font-['Plus_Jakarta_Sans'] text-[15px] text-[#1a1a1a]/70 leading-[1.7] mb-8 flex-1 font-medium">
                    {s.desc}
                  </p>
                  <button onClick={() => go(s.id as Page)} className="inline-flex items-center gap-2 font-['Plus_Jakarta_Sans'] text-[15px] font-bold hover:gap-3 transition-all mt-auto" style={{color:s.color}}>
                    Request Service <ChevronRight size={18}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 1: The Bridge / Introduction */}
        <div className="max-w-[900px] mx-auto px-6 mt-32 md:mt-40 text-center">
          <p className="font-['Plus_Jakarta_Sans'] text-[18px] md:text-[24px] leading-[1.8] text-[#1a1a1a]/80 font-medium">
            At Harmony Club House, we bridge the gap between traditional hospitality excellence and cutting-edge digital innovation. We provide end-to-end solutions designed to streamline operations, elevate your brand, and maximize your market presence.
          </p>
        </div>

        {/* Section 2: Specialized Divisions */}
        <div className="max-w-[1200px] mx-auto px-6 mt-32 md:mt-40 flex flex-col gap-24 md:gap-32 pb-32">
          {/* Block 1: Food & Beverage Division */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="order-2 lg:order-1 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#F5841F]/30 to-[#E91E8C]/20 blur-[40px] rounded-[40px] opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
              <ImageWithFallback src={divFnbImg} alt="Food & Beverage Division" className="relative w-full h-auto object-contain rounded-[32px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-white/60 transition-transform duration-700 group-hover:scale-[1.02] bg-white" />
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-3 mb-6">
  <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
  <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold uppercase tracking-widest text-[#1a1a1a]/50">Division</span>
  <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
</div>
              <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[32px] md:text-[48px] text-[#1a1a1a] mb-6 leading-[1.1] tracking-tight">Food & Beverage Division</h2>
              <p className="font-['Plus_Jakarta_Sans'] text-[16px] md:text-[18px] text-[#1a1a1a]/70 leading-[1.8]">
                End-to-end concept creation and execution. From innovative kitchen design and strategic equipment sourcing to comprehensive menu engineering, we build the culinary foundations for your success.
              </p>
              <button onClick={() => go("fnb")} className="mt-8 inline-flex items-center gap-2 font-['Plus_Jakarta_Sans'] text-[14px] font-bold text-white px-6 py-3 rounded-full transition-all duration-300 hover:scale-[1.05] shadow-[0_10px_20px_-10px_rgba(245,132,31,0.5)] group" style={{ background: C_ORANGE }}>
                Explore F&B Division <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Block 2: Premium Catering Services */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="order-1 lg:order-1">
              <div className="inline-flex items-center gap-3 mb-6">
  <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
  <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold uppercase tracking-widest text-[#1a1a1a]/50">Division</span>
  <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
</div>
              <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[32px] md:text-[48px] text-[#1a1a1a] mb-6 leading-[1.1] tracking-tight">Premium Catering Services</h2>
              <p className="font-['Plus_Jakarta_Sans'] text-[16px] md:text-[18px] text-[#1a1a1a]/70 leading-[1.8]">
                Delivering culinary excellence at scale. Whether it is a corporate mega-event, a grand opening, or an exclusive gathering, our catering division ensures flawless execution, strict international hygiene standards, and memorable flavors.
              </p>
              <button onClick={() => go("catering")} className="mt-8 inline-flex items-center gap-2 font-['Plus_Jakarta_Sans'] text-[14px] font-bold text-white px-6 py-3 rounded-full transition-all duration-300 hover:scale-[1.05] shadow-[0_10px_20px_-10px_rgba(233,30,140,0.5)] group" style={{ background: C_PINK }}>
                Explore Catering Services <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="order-2 lg:order-2 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#E91E8C]/30 to-[#3AADE0]/20 blur-[40px] rounded-[40px] opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
              <ImageWithFallback src={divCateringImg} alt="Premium Catering Services" className="relative w-full h-auto object-contain rounded-[32px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-white/60 transition-transform duration-700 group-hover:scale-[1.02] bg-white" />
            </div>
          </div>
        </div>

        {/* Section 3: Bottom Call-to-Action */}
        <div className="w-full bg-[#111111] py-24 md:py-32 px-6 relative overflow-hidden">
          {/* Ambient Glows for Dark Footer */}
          <div className="absolute top-[-50%] left-[-10%] w-[500px] h-[500px] bg-[#F5841F]/20 blur-[150px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[-50%] right-[-10%] w-[500px] h-[500px] bg-[#E91E8C]/20 blur-[150px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 max-w-[800px] mx-auto text-center">
            <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[36px] md:text-[56px] text-white mb-10 tracking-tight leading-[1.1]">
              Ready to unlock your full potential?
            </h2>
            <button onClick={() => go("contact")} className="inline-flex items-center gap-3 font-['Plus_Jakarta_Sans'] text-[15px] font-bold text-white px-10 py-5 rounded-full transition-all duration-300 hover:scale-[1.05] shadow-[0_15px_30px_-10px_rgba(245,132,31,0.5)] group" style={{ background: `linear-gradient(135deg, ${C_ORANGE}, ${C_PINK})` }}>
              Contact Us <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

      </div>
      <Footer />
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
        <div className="max-w-[800px] mx-auto px-6 text-center mb-20 md:mb-32">
          <div className="inline-flex items-center gap-3 mb-6">
  <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
  <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold uppercase tracking-widest text-[#1a1a1a]/50">Portfolio</span>
  <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
</div>
          <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[40px] md:text-[60px] leading-[1.1] tracking-tight mb-8 text-[#1a1a1a]">
            Our <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(135deg, #E91E8C, #3AADE0)` }}>Stories.</span>
          </h1>
          <p className="font-['Plus_Jakarta_Sans'] text-[16px] md:text-[18px] leading-[1.8] text-[#1a1a1a]/70 font-medium">
            30+ projects across 4 continents. Real challenges, real results.
          </p>
        </div>

        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {placeholderCards.map((_, i) => (
              <div key={i} className="group bg-white/60 backdrop-blur-xl rounded-[40px] p-4 border border-white shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] transition-all duration-500">
                {/* Empty Image Placeholder */}
                <div className="relative overflow-hidden bg-[#E0DCD5] rounded-[32px] aspect-[4/3] mb-6 flex items-center justify-center border border-black/5">
                  <div className="font-['Plus_Jakarta_Sans'] font-bold text-[#1a1a1a]/20 text-[14px] uppercase tracking-widest">
                    Image
                  </div>
                </div>
                {/* Empty Text Skeleton Structure */}
                <div className="px-4 pb-4">
                  <div className="w-3/4 h-6 bg-black/5 rounded-md mb-3" />
                  <div className="w-1/2 h-4 bg-black/5 rounded-md mb-6" />
                  <div className="pt-5 border-t border-black/[0.05]">
                    <div className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold uppercase tracking-[0.1em] text-[#1a1a1a]/40 mb-3">The Result</div>
                    <div className="w-full h-4 bg-black/5 rounded-md mb-2" />
                    <div className="w-4/5 h-4 bg-black/5 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-[800px] mx-auto px-6 text-center mt-32 md:mt-40">
           <div className="bg-white/80 backdrop-blur-xl p-12 md:p-20 rounded-[48px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.08)] border border-white">
             <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[32px] md:text-[40px] tracking-tight text-[#1a1a1a] mb-8">Your success story starts here.</h2>
             <button onClick={() => go("contact")} className="inline-flex items-center gap-3 font-['Plus_Jakarta_Sans'] text-[15px] font-bold text-white px-8 py-4 rounded-full transition-all duration-300 hover:scale-[1.05] shadow-[0_15px_30px_-10px_rgba(245,132,31,0.5)] group" style={{ background: `linear-gradient(135deg, ${C_ORANGE}, ${C_PINK})` }}>
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
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-px w-8" style={{background:GRAD_FRIEND}}/>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400" style={{fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Our Journey</span>
            <div className="h-px w-8" style={{background:GRAD_FRIEND}}/>
          </div>
          <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[32px] md:text-[48px] tracking-tight text-[#1a1a1a]">
            13 Years of <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(135deg, #F5841F, #E91E8C)` }}>Excellence</span>
          </h2>
        </div>

        {/* Desktop flowing SVG timeline */}
        <div className="hidden md:block relative" style={{height:"320px"}}>
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
                <div key={year} className="absolute" style={{left:`${xPercents[i]}%`, top:above[i]?"0":"55%", width:"140px", transform:"translateX(-50%)"}}>
                  <div className={`${above[i]?"pb-2 text-bottom":"pt-2"}`}>
                    <div className="text-xs font-black mb-0.5" style={{color, fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{year}</div>
                    <div className="text-xs font-bold text-gray-900 mb-1" style={{fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{label}</div>
                    <div className="text-[10px] text-gray-400 leading-tight">{desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile stacked */}
        <div className="md:hidden space-y-0">
          {TIMELINE_FRIEND.map(({year,label,desc,color},i)=>(
            <div key={year} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full flex-shrink-0 mt-1" style={{background:color}}/>
                {i<TIMELINE_FRIEND.length-1 && <div className="w-0.5 flex-1 mt-1 mb-1" style={{background:`linear-gradient(to bottom, ${color}, ${TIMELINE_FRIEND[i+1].color})`}}/>}
              </div>
              <div className="pb-8">
                <div className="text-xs font-black mb-0.5" style={{color, fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{year}</div>
                <div className="text-sm font-bold text-gray-900 mb-1" style={{fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{label}</div>
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
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-px w-8" style={{background:GRAD_FRIEND}}/>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400" style={{fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Success Partners</span>
            <div className="h-px w-8" style={{background:GRAD_FRIEND}}/>
          </div>
          <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[32px] md:text-[48px] tracking-tight text-[#1a1a1a] mb-4">
            Trusted by <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(135deg, #F5841F, #E91E8C)` }}>Industry Giants</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto font-light leading-relaxed">
            From global hospitality leaders and banking institutions to iconic F&B brands — 14 trusted partners across the industry.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {cats.map(c=>(
            <button key={c} onClick={()=>setCat(c)}
              className="px-4 py-1.5 rounded-full text-xs font-bold transition-all"
              style={{background:cat===c?"#1a1a1a":"#efefef", color:cat===c?"white":"#666", fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
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
                <div className="text-sm font-bold text-gray-300 leading-tight transition-all duration-300 group-hover:text-gray-800"
                  style={{fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
                  {name}
                </div>
                <div className="text-[10px] mt-1.5 font-medium text-gray-300 transition-all duration-300 group-hover:text-gray-400">{c}</div>
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

      {/* Soft Colorful Ambient Backgrounds (Fixed to cover entire scroll) */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] bg-[#F5841F]/15 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] bg-[#3AADE0]/10 blur-[150px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vw] bg-[#E91E8C]/15 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      <div className="relative z-10 pb-32">
        {/* Intro Image */}
        <div className="w-full mb-16 md:mb-24">
          <div className="relative w-full">
            <ImageWithFallback src={interactiveImg} alt="Harmony Club House" className="w-full h-auto object-cover" />
          </div>
        </div>

        {/* Who We Are */}
        <div className="max-w-[1200px] mx-auto px-6 mb-32 md:mb-48">
          <div className="relative overflow-hidden bg-white/80 backdrop-blur-2xl p-12 md:p-24 rounded-[48px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.08)] border border-white text-center">
            {/* Colorful soft glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] bg-[#F5841F]/15 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-[#E91E8C]/15 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 max-w-[900px] mx-auto">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
                <span className="font-['Plus_Jakarta_Sans'] text-[11px] md:text-[12px] font-bold uppercase tracking-[0.2em] text-[#1a1a1a]/50">Our Story</span>
                <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
              </div>
              <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[40px] md:text-[60px] leading-[1.1] tracking-tight mb-8 text-[#1a1a1a]">
                Redefining the art of <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(135deg, #F5841F, #E91E8C)` }}>hospitality.</span>
              </h1>
              <p className="font-['Plus_Jakarta_Sans'] text-[18px] md:text-[22px] leading-[1.8] text-[#1a1a1a]/70 font-medium">
                Established in 2012, Harmony Club House (HCH) stands as a premier platform for F&B development and hospitality consultancy. We are a dedicated team of passionate entrepreneurs and experts, bringing over 13 years of hands-on international experience across four continents. From initial feasibility studies and innovative kitchen design to menu engineering and complete operational restructuring, we have successfully launched over 30 projects and trained more than 2,500 professionals.
              </p>
            </div>
          </div>
        </div>

        <TimelineSection />

        {/* Why Partner With Us */}
        <div className="max-w-[1200px] mx-auto px-6 mb-32 md:mb-48">
          <div className="text-center mb-16 md:mb-24">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-px w-8" style={{background:GRAD_FRIEND}}/>
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400" style={{fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Why Choose Us</span>
              <div className="h-px w-8" style={{background:GRAD_FRIEND}}/>
            </div>
            <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[32px] md:text-[48px] tracking-tight text-[#1a1a1a] mb-6">
              Why Partner With <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(135deg, #F5841F, #E91E8C)` }}>Us?</span>
            </h2>
            <p className="font-['Plus_Jakarta_Sans'] text-[16px] text-[#1a1a1a]/60 max-w-[600px] mx-auto leading-[1.8]">
              We believe every brand has a unique story, and we help you tell it through operational excellence anchored in first-hand experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {whyPartnerReasons.map((r, i) => (
              <div key={i} className="relative overflow-hidden bg-white/80 backdrop-blur-lg p-10 md:p-12 rounded-[40px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] border border-white hover:-translate-y-2 transition-transform duration-500 group">
                <div className="absolute inset-0 bg-cover bg-center opacity-[0.08] transition-opacity duration-500 group-hover:opacity-[0.15]" style={{ backgroundImage: `url(${r.bgImage})` }} />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mb-8" style={{ backgroundColor: `${r.color}15`, color: r.color }}>
                    <span className="font-bold text-[18px]">0{i+1}</span>
                  </div>
                  <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[20px] text-[#1a1a1a] mb-4 leading-[1.3]">{r.title}</h3>
                  <p className="font-['Plus_Jakarta_Sans'] text-[15px] leading-[1.7] text-[#1a1a1a]/60">{r.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Core Values */}
        <div className="max-w-[1200px] mx-auto px-6 mb-32 md:mb-48">
          <div className="text-center mb-16 md:mb-24">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-px w-8" style={{background:GRAD_FRIEND}}/>
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400" style={{fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Our Principles</span>
              <div className="h-px w-8" style={{background:GRAD_FRIEND}}/>
            </div>
            <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[32px] md:text-[48px] tracking-tight text-[#1a1a1a]">
              Our Core <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(135deg, #F5841F, #E91E8C)` }}>Values</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-[1200px] mx-auto">
            {coreValues.map((v, i) => (
              <div key={i} className="relative overflow-hidden bg-white p-8 md:p-10 rounded-[32px] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] border border-white hover:-translate-y-2 transition-all duration-500 group">
                <div className="absolute inset-0 bg-cover bg-center opacity-[0.08] transition-opacity duration-500 group-hover:opacity-[0.15]" style={{ backgroundImage: `url(${v.bgImage})` }} />
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-[20px] flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110" style={{ backgroundColor: `${v.color}15`, color: v.color }}>
                    <v.icon size={28} strokeWidth={2} />
                  </div>
                  <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[20px] text-[#1a1a1a] mb-3 leading-[1.3]">{v.title}</h3>
                  <p className="font-['Plus_Jakarta_Sans'] text-[15px] leading-[1.7] text-[#1a1a1a]/60">{v.text}</p>
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
        
        {/* Top Image (Full Bleed, No Void Space) */}
        <div className="w-full flex justify-center mb-12">
          <ImageWithFallback 
            src={missionTopImg} 
            alt="Mission and Vision" 
            className="w-full h-auto object-cover" 
          />
        </div>

        {/* Section 1: Our Mission */}
        <div className="max-w-[1200px] mx-auto px-6 mb-16">
          <div className="relative overflow-hidden bg-white/80 backdrop-blur-2xl p-12 md:p-24 rounded-[48px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.08)] border border-white text-center">
            {/* Colorful soft glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] bg-[#F5841F]/15 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-[#E91E8C]/15 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 max-w-[900px] mx-auto">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
                <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold uppercase tracking-widest text-[#1a1a1a]/50">Mission</span>
                <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
              </div>
              <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[40px] md:text-[56px] leading-[1.1] tracking-tight mb-8 text-[#1a1a1a]">
                Our <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(135deg, #F5841F, #E91E8C)` }}>Mission.</span>
              </h1>
              <p className="font-['Plus_Jakarta_Sans'] text-[18px] md:text-[22px] leading-[1.8] text-[#1a1a1a]/70 font-medium">
                Our mission is to bridge the gap between operational excellence and sustainable growth. We offer end-to-end, integrated solutions tailored to your unique brand.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Our Commitments (The 5 Pillars) */}
        <div className="max-w-[1200px] mx-auto px-6 mb-16">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[32px] md:text-[48px] tracking-tight text-[#1a1a1a]">We are committed to:</h2>
          </div>
          {/* Centering a 5-card grid by using flex wrap or custom grid col spans */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
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
                  <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[20px] text-[#1a1a1a] mb-3 leading-[1.3]">{p.title}</h3>
                  <p className="font-['Plus_Jakarta_Sans'] text-[15px] leading-[1.7] text-[#1a1a1a]/60">{p.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Our Vision */}
        <div className="max-w-[1200px] mx-auto px-6 mb-24">
          <div className="relative overflow-hidden bg-white/80 backdrop-blur-2xl p-12 md:p-24 rounded-[48px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.08)] border border-white text-center">
            {/* Colorful soft glows */}
            <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] bg-[#E91E8C]/15 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-[#3AADE0]/15 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 max-w-[900px] mx-auto">
              <div className="inline-flex items-center gap-3 mb-6">
  <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
  <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold uppercase tracking-widest text-[#1a1a1a]/50">Vision</span>
  <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
</div>
              <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[40px] md:text-[56px] tracking-tight text-[#1a1a1a] mb-8">
                Our <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(135deg, #3AADE0, #E91E8C)` }}>Vision.</span>
              </h2>
              <p className="font-['Plus_Jakarta_Sans'] text-[18px] md:text-[22px] text-[#1a1a1a]/70 leading-[1.8] font-medium">
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



function FnbPage({ go }: { go: (p: Page) => void }) {
  const approaches = [
    { icon: PenTool, title: "Concept & Identity", text: "Comprehensive market research and unique brand storytelling to define your outlet's DNA.", color: C_ORANGE },
    { icon: ChefHat, title: "Menu Engineering", text: "Designing high-margin, operationally efficient, and gastronomically compelling menus.", color: C_PINK },
    { icon: ShieldCheck, title: "Operational Excellence", text: "Implementing strict SOPs for kitchen logistics, food safety, and international service standards.", color: C_BLUE },
    { icon: TrendingUp, title: "Management & Turnaround", text: "Pinpointing weak spots in performance and providing full-scale management for sustainable profitability.", color: C_GREEN }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF7F2] text-[#1a1a1a] relative">
      
      {/* Seamless Ambient Gradient Background spanning the whole page */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[0%] left-[-10%] w-[50vw] h-[50vw] bg-[#F5841F]/15 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute top-[40%] right-[-10%] w-[60vw] h-[60vw] bg-[#E91E8C]/10 blur-[150px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vw] bg-[#3AADE0]/15 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      <div className="relative z-10 pt-24 pb-32 px-6">
        {/* Section 1: Division Header & Intro */}
        <div className="relative w-full max-w-[1200px] mx-auto min-h-[60vh] rounded-[48px] overflow-hidden flex items-center justify-center shadow-2xl border border-white/50 mb-32">
          <div className="absolute inset-0 w-full h-full bg-[#FAF7F2]">
            <img 
              src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1600&q=80" 
              alt="High-end restaurant" 
              className="w-full h-full object-cover opacity-20" 
            />
          </div>
          
          <div className="relative z-10 bg-white/10 backdrop-blur-md max-w-[900px] w-[90%] p-10 md:p-16 rounded-[40px] text-center border border-white/20 mt-16 shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
            <div className="inline-flex items-center gap-3 mb-6">
  <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
  <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold uppercase tracking-widest text-[#1a1a1a]/50">Specialized Division</span>
  <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
</div>
            <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[40px] md:text-[56px] leading-[1.1] tracking-tight mb-8 text-[#1a1a1a]">
              Food & Beverage Division
            </h1>
            <p className="font-['Plus_Jakarta_Sans'] text-[16px] md:text-[20px] text-[#1a1a1a]/70 leading-[1.8] font-medium max-w-[700px] mx-auto">
              We craft and launch innovative F&B concepts that blend creative vision with operational reality. We balance the art of hospitality with the science of profitability to maximize your ROI.
            </p>
          </div>
        </div>

        {/* Section 2: Our Approach (The 4-Step Methodology) */}
        <div className="max-w-[1200px] mx-auto mb-32">
          <div className="text-center mb-16 md:mb-24">
            <div className="inline-flex items-center gap-3 mb-6">
  <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
  <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold uppercase tracking-widest text-[#1a1a1a]/50">Methodology</span>
  <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
</div>
            <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[32px] md:text-[48px] tracking-tight text-[#1a1a1a]">From Concept to Profitability</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {approaches.map((item, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-xl p-10 md:p-12 rounded-[40px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] border border-white flex flex-col md:flex-row gap-8 items-start group hover:-translate-y-2 transition-transform duration-500">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                  <item.icon size={28} />
                </div>
                <div>
                  <div className="font-['Plus_Jakarta_Sans'] font-bold text-[13px] uppercase tracking-[0.1em] mb-3" style={{ color: item.color }}>Step 0{i + 1}</div>
                  <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[22px] md:text-[24px] text-[#1a1a1a] mb-4 leading-[1.3] tracking-tight">{item.title}</h3>
                  <p className="font-['Plus_Jakarta_Sans'] text-[15px] md:text-[16px] leading-[1.7] text-[#1a1a1a]/60 font-medium">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Why Choose HCH? */}
        <div className="max-w-[1400px] mx-auto">
          <div className="relative overflow-hidden rounded-[48px] p-8 md:p-16 border border-white/40 shadow-2xl group">
            {/* Smooth blended gradient background replacing the stark solid orange */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#F5841F] via-[#E91E8C] to-[#F5841F] opacity-90 transition-transform duration-1000 group-hover:scale-105" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-center">
              {/* Text Side */}
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-3 mb-6">
  <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
  <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold uppercase tracking-widest text-[#1a1a1a]/50">Why Choose HCH?</span>
  <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
</div>
                <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[36px] md:text-[56px] text-white mb-12 leading-[1.1] tracking-tight">Your Strategic Partner</h2>
                
                {/* 3-Column Text Layout for the paragraph */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 text-white/95">
                  <div>
                    <p className="font-['Plus_Jakarta_Sans'] text-[15px] leading-[1.8] font-medium">
                      We act as an extension of your team. With a track record of training 2,500+ professionals and expertise spanning upscale restaurants to corporate food courts,
                    </p>
                  </div>
                  <div>
                    <p className="font-['Plus_Jakarta_Sans'] text-[15px] leading-[1.8] font-medium">
                      we provide end-to-end integration and data-driven growth. We do not rely on guesswork;
                    </p>
                  </div>
                  <div>
                    <p className="font-['Plus_Jakarta_Sans'] text-[15px] leading-[1.8] font-medium">
                      we ensure your success is measurable, sustainable, and entirely unparalleled.
                    </p>
                  </div>
                </div>
                
                <button onClick={() => go("contact")} className="mt-16 inline-flex items-center gap-3 font-['Plus_Jakarta_Sans'] text-[15px] font-bold text-[#1a1a1a] bg-white px-8 py-4 rounded-full transition-all duration-300 hover:scale-[1.05] shadow-2xl group">
                  Discuss Your F&B Concept <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Image Side */}
              <div className="lg:col-span-5 relative group/img">
                <div className="absolute inset-0 bg-white/40 blur-[50px] rounded-[40px] transition-opacity duration-700 group-hover/img:opacity-80" />
                <div className="relative rounded-[40px] overflow-hidden shadow-2xl border border-white/30 aspect-[4/5] bg-black/10">
                  <ImageWithFallback 
                    src={teamImg} 
                    alt="Team Collaboration" 
                    className="w-full h-auto object-contain transition-transform duration-[2s] group-hover/img:scale-[1.08]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}



function CateringPage({ go }: { go: (p: Page) => void }) {
  const pillars = [
    { icon: Coffee, title: "Diverse Menus", text: "From quick coffee breaks to elaborate gala dinners, our menus are customized to suit the exact tone of your event.", color: C_ORANGE },
    { icon: Briefcase, title: "Corporate Catering", text: "Reliable, efficient catering for business meetings and conferences to keep your team energized and focused.", color: C_BLUE },
    { icon: PartyPopper, title: "Event Solutions", text: "Managing the logistics of delivery, setup, and service for large-scale exhibitions and exclusive gatherings alike.", color: C_PINK },
    { icon: Sparkles, title: "Cleanliness & Safety", text: "Maintaining the highest international hygiene benchmarks, ensuring all preparation and service areas are impeccable.", color: C_GREEN }
  ];

  const advantages = [
    { title: "First-Hand Expertise", text: "Deep F&B roots mean we understand exactly how catering fits into your event's wider operational success." },
    { title: "Logistical Precision", text: "We flawlessly manage the entire supply chain, ensuring timely delivery, seamless setup, and fluid service." },
    { title: "Value-Added Service", text: "We bring strict operational discipline to presentation and consistency so you can focus entirely on your guests." },
    { title: "Trusted Quality", text: "We are the reliable partner for prestigious organizations, consistently matching the elite standards of our clients." }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF7F2] text-[#1a1a1a] relative">
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[0%] left-[-10%] w-[50vw] h-[50vw] bg-[#E91E8C]/15 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute top-[40%] right-[-10%] w-[60vw] h-[60vw] bg-[#F5841F]/10 blur-[150px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vw] bg-[#3AADE0]/15 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      <div className="relative z-10 pt-24 pb-32 px-6">
        {/* Section 1: Division Header & Philosophy */}
        <div className="relative w-full max-w-[1200px] mx-auto min-h-[60vh] rounded-[48px] overflow-hidden flex items-center justify-center shadow-2xl border border-white/50 mb-32">
          {/* CRITICAL: GREY PLACEHOLDER FOR IMAGE */}
          <div className="absolute inset-0 w-full h-full bg-[#FAF7F2]">
            <img 
              src="https://images.unsplash.com/photo-1555244162-803834f70033?w=1600&q=80" 
              alt="Catering Setup" 
              className="w-full h-full object-cover opacity-20" 
            />
          </div>
          
          <div className="relative z-10 bg-white/80 backdrop-blur-2xl max-w-[900px] w-[90%] p-10 md:p-16 rounded-[40px] text-center border border-white/40 shadow-[0_20px_40px_rgba(0,0,0,0.1)] mt-8">
            <div className="inline-flex items-center gap-3 mb-6">
  <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
  <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold uppercase tracking-widest text-[#1a1a1a]/50">Specialized Service</span>
  <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
</div>
            <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[36px] md:text-[52px] leading-[1.1] tracking-tight mb-8 text-[#1a1a1a]">
              Catering Services:<br/>Culinary Excellence, Delivered
            </h1>
            <p className="font-['Plus_Jakarta_Sans'] text-[16px] md:text-[18px] text-[#1a1a1a]/70 leading-[1.8] font-medium max-w-[800px] mx-auto">
              We redefine the catering experience by blending culinary artistry with operational precision. Whether hosting an intimate corporate breakfast or a high-profile gala, we deliver 'home-style' taste, impeccable hygiene, and professional service. We believe food is the centerpiece of any successful gathering; every meal is not just prepared—it is crafted.
            </p>
          </div>
        </div>

        {/* Section 2: What We Offer (The 4 Pillars) */}
        <div className="max-w-[1200px] mx-auto mb-32">
          <div className="text-center mb-16 md:mb-20">
            <div className="inline-flex items-center gap-3 mb-6">
  <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
  <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold uppercase tracking-widest text-[#1a1a1a]/50">Solutions</span>
  <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
</div>
            <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[32px] md:text-[48px] tracking-tight text-[#1a1a1a]">Tailored Catering Solutions</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {pillars.map((item, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-xl p-8 rounded-[40px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] border border-white hover:-translate-y-2 transition-transform duration-500 text-center flex flex-col items-center group">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                  <item.icon size={28} />
                </div>
                <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[18px] text-[#1a1a1a] mb-3 leading-[1.3] tracking-tight">{item.title}</h3>
                <p className="font-['Plus_Jakarta_Sans'] text-[14px] leading-[1.6] text-[#1a1a1a]/60 font-medium">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Why Choose HCH? */}
        <div className="max-w-[1400px] mx-auto mb-32">
          <div className="rounded-[48px] p-8 md:p-16 border border-white/30 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#E91E8C] via-[#F5841F] to-[#E91E8C] opacity-90 transition-transform duration-1000 group-hover:scale-105" />
            
            <div className="relative z-10">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-3 mb-6">
  <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
  <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold uppercase tracking-widest text-[#1a1a1a]/50">The HCH Advantage</span>
  <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
</div>
                <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[36px] md:text-[48px] text-white leading-[1.1] tracking-tight">Why Choose HCH?</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {advantages.map((adv, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[32px] text-white hover:-translate-y-2 transition-transform duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.1)]">
                    <div className="font-['Plus_Jakarta_Sans'] font-extrabold text-[32px] text-white/40 mb-4 tracking-tighter">0{i+1}</div>
                    <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[18px] mb-3 leading-[1.3]">{adv.title}</h3>
                    <p className="font-['Plus_Jakarta_Sans'] text-[14px] leading-[1.6] text-white/90 font-medium">{adv.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Our Commitment (Footer CTA) */}
        <div className="max-w-[800px] mx-auto text-center">
           <div className="bg-white/80 backdrop-blur-xl p-10 md:p-16 rounded-[48px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.08)] border border-white">
             <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[32px] md:text-[40px] tracking-tight text-[#1a1a1a] mb-6">Your Preferred Catering Partner</h2>
             <p className="font-['Plus_Jakarta_Sans'] text-[16px] text-[#1a1a1a]/60 leading-[1.8] max-w-[600px] mx-auto mb-10">
               We take pride in the operational rigor required to turn any gathering into a truly memorable experience. Let us meet your catering requirements with accuracy, professionalism, and a genuine passion for hospitality.
             </p>
             <button onClick={() => go("contact")} className="inline-flex items-center gap-3 font-['Plus_Jakarta_Sans'] text-[15px] font-bold text-white px-8 py-4 rounded-full transition-all duration-300 hover:scale-[1.05] shadow-[0_15px_30px_-10px_rgba(233,30,140,0.5)] group" style={{ background: `linear-gradient(135deg, ${C_PINK}, ${C_ORANGE})` }}>
               Contact Us <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
             </button>
           </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}



function RecruitmentPage({ go }: { go: (p: Page) => void }) {
  const recruitmentPillars = [
    { icon: Search, title: "Candidate Sourcing", text: "Selecting top-quality candidates perfectly compatible with the job.", color: C_GREEN },
    { icon: ClipboardCheck, title: "Technical Assessments", text: "Facilitating tests to guarantee candidates possess the required skills.", color: C_ORANGE },
    { icon: UsersRound, title: "Interview Management", text: "Conducting initial interviews to deliver only a highly curated shortlist.", color: C_BLUE },
    { icon: Repeat, title: "Continuity & Replacement", text: "Ensuring stability with guaranteed replacements within an agreed grace period.", color: C_PINK }
  ];

  const trainingPrograms = [
    { icon: BookOpen, title: "Customized Upskilling", text: "Focused programs designed to train employees for their exact titles and responsibilities.", color: C_BLUE, img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80" },
    { icon: GraduationCap, title: "Practical Preparation", text: "Training candidates on the core realities of your business so they are fully prepared on day one.", color: C_ORANGE, img: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80" },
    { icon: LineChart, title: "Data-Driven Stability", text: "Utilizing our labor analyzing system to monitor workforce effectiveness and drastically reduce turnover.", color: C_GREEN, img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80" }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF7F2] text-[#1a1a1a] relative">
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[0%] left-[-10%] w-[50vw] h-[50vw] bg-[#78BE1F]/15 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute top-[40%] right-[-10%] w-[60vw] h-[60vw] bg-[#3AADE0]/10 blur-[150px] rounded-full mix-blend-multiply" />
      </div>

      <div className="relative z-10 pt-24 pb-32 px-6">
        
        {/* Section 1: Department Header & Overview */}
        <div className="max-w-[1200px] mx-auto mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1 relative group">
              <div className="absolute inset-0 bg-[#78BE1F]/20 blur-[50px] rounded-[40px] opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
              <div className="w-full aspect-[4/3] rounded-[40px] shadow-2xl border border-white/50 overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80" alt="Training & Recruitment" className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-[1.03]" />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-3 mb-6">
  <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
  <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold uppercase tracking-widest text-[#1a1a1a]/50">Department</span>
  <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
</div>
              <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[40px] md:text-[56px] leading-[1.1] tracking-tight mb-8 text-[#1a1a1a]">
                Training & Recruitment Solutions
              </h1>
              <p className="font-['Plus_Jakarta_Sans'] text-[16px] md:text-[18px] text-[#1a1a1a]/70 leading-[1.8] font-medium">
                Founded in 2012, Harmony Club House provides specialized hiring and professional development solutions. We ensure our clients receive high-quality, risk-free, and highly skilled employees ready to meet the dynamic demands of the market.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Vision & Mission (Split Layout) */}
        <div className="max-w-[1200px] mx-auto mb-32 rounded-[48px] overflow-hidden flex flex-col md:flex-row shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white/60">
          {/* Left Side - Our Vision */}
          <div className="md:w-1/2 bg-white/90 backdrop-blur-xl p-10 md:p-16">
             <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8" style={{ backgroundColor: `${C_BLUE}15`, color: C_BLUE }}>
               <span className="font-bold text-[24px]">V</span>
             </div>
             <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[32px] text-[#1a1a1a] mb-6">Our Vision</h2>
             <p className="font-['Plus_Jakarta_Sans'] text-[16px] text-[#1a1a1a]/70 leading-[1.8] font-medium">
               To provide services beyond expectations by generating perfectly matched applicants. We identify, vet, and train qualified candidates before they ever reach your HR department.
             </p>
          </div>
          
          {/* Right Side - Our Mission */}
          <div className="md:w-1/2 bg-[#1a1a1a] p-10 md:p-16 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#78BE1F]/20 blur-[80px] rounded-full pointer-events-none" />
             <div className="relative z-10">
               <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 bg-white/10">
                 <span className="font-bold text-[24px]">M</span>
               </div>
               <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[32px] text-white mb-8">Our Mission</h2>
               <div className="space-y-6">
                 <div>
                   <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[18px] mb-2" style={{ color: C_GREEN }}>Team Building</h3>
                   <p className="font-['Plus_Jakarta_Sans'] text-[14px] text-white/70 leading-[1.6]">Creating harmonious, highly-qualified teams.</p>
                 </div>
                 <div>
                   <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[18px] mb-2" style={{ color: C_GREEN }}>Performance Enhancement</h3>
                   <p className="font-['Plus_Jakarta_Sans'] text-[14px] text-white/70 leading-[1.6]">Tailored training programs to elevate staff performance.</p>
                 </div>
                 <div>
                   <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[18px] mb-2" style={{ color: C_GREEN }}>Staff Stability</h3>
                   <p className="font-['Plus_Jakarta_Sans'] text-[14px] text-white/70 leading-[1.6]">Maintaining workforce stability through our proprietary labor analyzing system.</p>
                 </div>
               </div>
             </div>
          </div>
        </div>

        {/* Section 3: Recruitment Services (The 4 Pillars) */}
        <div className="max-w-[1200px] mx-auto mb-32">
          <div className="text-center mb-16 md:mb-20 max-w-[800px] mx-auto">
            <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[32px] md:text-[48px] tracking-tight text-[#1a1a1a] mb-6">End-to-End Recruitment Services</h2>
            <p className="font-['Plus_Jakarta_Sans'] text-[16px] text-[#1a1a1a]/60 leading-[1.8]">
              We act as an extension of your HR department, handling the entire recruitment lifecycle:
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {recruitmentPillars.map((item, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-xl p-8 rounded-[32px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] border border-white hover:-translate-y-2 transition-transform duration-500 text-center flex flex-col items-center group">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                  <item.icon size={28} />
                </div>
                <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[18px] text-[#1a1a1a] mb-3 leading-[1.3] tracking-tight">{item.title}</h3>
                <p className="font-['Plus_Jakarta_Sans'] text-[14px] leading-[1.6] text-[#1a1a1a]/60 font-medium">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Professional Training Programs */}
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16 md:mb-20 max-w-[800px] mx-auto">
            <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[32px] md:text-[48px] tracking-tight text-[#1a1a1a] mb-6">Professional Training Programs</h2>
            <p className="font-['Plus_Jakarta_Sans'] text-[16px] text-[#1a1a1a]/60 leading-[1.8]">
              A team is only as good as its training. We bridge the gap between potential and performance:
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {trainingPrograms.map((program, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-xl rounded-[40px] overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-white group hover:-translate-y-2 transition-transform duration-500">
                <div className="w-full aspect-[4/3] bg-black/5 overflow-hidden">
                  <img src={program.img} alt={program.title} className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-[1.03]" />
                </div>
                <div className="p-8 md:p-10 relative">
                  <div className="absolute top-[-24px] right-8 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg border border-white" style={{ backgroundColor: program.color, color: "white" }}>
                    <program.icon size={20} />
                  </div>
                  <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[22px] text-[#1a1a1a] mb-4 leading-[1.3] mt-2">{program.title}</h3>
                  <p className="font-['Plus_Jakarta_Sans'] text-[15px] leading-[1.7] text-[#1a1a1a]/60 font-medium">{program.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}


function MarketingPage({ go }: { go: (p: Page) => void }) {
  const pillars = [
    { icon: Palette, title: "Brand Identity", text: "Crafting unique logos, visual aesthetics, and brand narratives that resonate with your target demographic.", color: C_ORANGE },
    { icon: MonitorSmartphone, title: "Digital Marketing", text: "Driving customer engagement through targeted social media management, SEO, and online advertising.", color: C_PINK },
    { icon: Target, title: "Market Positioning", text: "Utilizing data-driven market research to position your brand effectively against competitors.", color: C_BLUE },
    { icon: Megaphone, title: "Campaign Management", text: "Designing and executing high-impact promotional campaigns for launches, events, and seasonal offers.", color: C_GREEN }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF7F2] text-[#1a1a1a] relative">
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        {/* Blended ambient background */}
        <div className="absolute top-[0%] left-[-10%] w-[50vw] h-[50vw] bg-[#3AADE0]/20 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute top-[40%] right-[-10%] w-[60vw] h-[60vw] bg-[#E91E8C]/15 blur-[150px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vw] bg-[#F5841F]/20 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      <div className="relative z-10 pt-24 pb-0">
        
        {/* Section 1: Division Header & Overview */}
        <div className="px-6 mb-32">
          <div className="relative w-full max-w-[1200px] mx-auto min-h-[60vh] rounded-[48px] overflow-hidden flex items-center justify-center shadow-sm border border-black/5 mt-8 group bg-white/40 backdrop-blur-xl">
            {/* Added Hero Image */}
            <div className="absolute inset-0 w-full h-full p-6">
              <img 
                src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1600&q=80" 
                alt="Marketing Strategy" 
                className="w-full h-full object-cover rounded-[32px] opacity-20 transition-transform duration-[2s] group-hover:scale-[1.03]" 
              />
            </div>
            
            <div className="relative z-10 bg-white/90 backdrop-blur-2xl max-w-[900px] w-[90%] p-10 md:p-16 rounded-[40px] text-center border border-white/40 shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
              <div className="inline-flex items-center gap-3 mb-6">
  <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
  <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold uppercase tracking-widest text-[#1a1a1a]/50">Division</span>
  <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
</div>
              <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[36px] md:text-[52px] leading-[1.1] tracking-tight mb-8 text-[#1a1a1a]">
                Marketing & Branding Solutions
              </h1>
              <p className="font-['Plus_Jakarta_Sans'] text-[16px] md:text-[18px] text-[#1a1a1a]/70 leading-[1.8] font-medium max-w-[800px] mx-auto">
                We develop powerful visual identities and execute strategic marketing campaigns tailored specifically for the hospitality and F&B sectors. We power new and existing projects with bold ideas and creative execution to maximize your market presence.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Our Core Capabilities (The 4 Pillars) */}
        <div className="max-w-[1200px] mx-auto mb-32 px-6">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[32px] md:text-[48px] tracking-tight text-[#1a1a1a]">End-to-End Marketing Services</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {pillars.map((item, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-xl p-8 rounded-[32px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] border border-white hover:-translate-y-2 transition-transform duration-500 text-center flex flex-col items-center group">
                {/* Colorful Icon */}
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                  <item.icon size={28} />
                </div>
                <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[18px] text-[#1a1a1a] mb-3 leading-[1.3] tracking-tight">{item.title}</h3>
                <p className="font-['Plus_Jakarta_Sans'] text-[14px] leading-[1.6] text-[#1a1a1a]/60 font-medium">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: The HCH Advantage */}
        <div className="max-w-[1200px] mx-auto px-6 mb-32 flex flex-col gap-20 md:gap-32">
          <div className="text-center">
             <div className="inline-flex items-center gap-3 mb-6">
  <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
  <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold uppercase tracking-widest text-[#1a1a1a]/50">Advantage</span>
  <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
</div>
             <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[32px] md:text-[48px] tracking-tight text-[#1a1a1a]">Why Partner With Us?</h2>
          </div>
          
          {/* Block 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center group">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#F5841F]/30 to-[#E91E8C]/20 blur-[40px] rounded-[40px] opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
              <div className="relative w-full aspect-[4/3] rounded-[40px] shadow-xl border border-white/60 overflow-hidden bg-[#111]">
                <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80" alt="Industry Expertise" className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-[1.03]" />
              </div>
            </div>
            <div className="order-1 lg:order-2">
               <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[28px] md:text-[36px] text-[#1a1a1a] mb-6 leading-[1.1] tracking-tight">Industry Expertise</h3>
               <p className="font-['Plus_Jakarta_Sans'] text-[16px] md:text-[18px] text-[#1a1a1a]/70 leading-[1.8] font-medium">We don't just know marketing; we know hospitality. Our campaigns are built on a deep understanding of F&B consumer behavior.</p>
            </div>
          </div>
          
          {/* Block 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center group">
            <div className="order-1 lg:order-1">
               <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[28px] md:text-[36px] text-[#1a1a1a] mb-6 leading-[1.1] tracking-tight">Creative Execution</h3>
               <p className="font-['Plus_Jakarta_Sans'] text-[16px] md:text-[18px] text-[#1a1a1a]/70 leading-[1.8] font-medium">From menu design to digital storytelling, we ensure every touchpoint reflects your brand's unique artistic vision.</p>
            </div>
            <div className="order-2 lg:order-2 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#E91E8C]/30 to-[#3AADE0]/20 blur-[40px] rounded-[40px] opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
              <div className="relative w-full aspect-[4/3] rounded-[40px] shadow-xl border border-white/60 overflow-hidden bg-[#111]">
                <img src="https://images.unsplash.com/photo-1600607686527-6fb886090705?w=800&q=80" alt="Creative Execution" className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-[1.03]" />
              </div>
            </div>
          </div>
          
          {/* Block 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center group">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#3AADE0]/30 to-[#78BE1F]/20 blur-[40px] rounded-[40px] opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
              <div className="relative w-full aspect-[4/3] rounded-[40px] shadow-xl border border-white/60 overflow-hidden bg-[#111]">
                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80" alt="Measurable ROI" className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-[1.03]" />
              </div>
            </div>
            <div className="order-1 lg:order-2">
               <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[28px] md:text-[36px] text-[#1a1a1a] mb-6 leading-[1.1] tracking-tight">Measurable ROI</h3>
               <p className="font-['Plus_Jakarta_Sans'] text-[16px] md:text-[18px] text-[#1a1a1a]/70 leading-[1.8] font-medium">We track, analyze, and optimize every campaign to ensure your marketing budget translates directly into increased footfall and revenue.</p>
            </div>
          </div>
        </div>

        {/* Section 4: Call to Action (Footer) */}
        <div className="w-full bg-[#111111] py-24 md:py-32 px-6 relative overflow-hidden">
          <div className="absolute top-[-50%] left-[-10%] w-[500px] h-[500px] bg-[#3AADE0]/20 blur-[150px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[-50%] right-[-10%] w-[500px] h-[500px] bg-[#E91E8C]/20 blur-[150px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 max-w-[800px] mx-auto text-center">
            <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[36px] md:text-[56px] text-white mb-10 tracking-tight leading-[1.1]">
              Ready to Build a Powerful Brand?
            </h2>
            <button onClick={() => go("contact")} className="inline-flex items-center gap-3 font-['Plus_Jakarta_Sans'] text-[15px] font-bold text-white px-10 py-5 rounded-full transition-all duration-300 hover:scale-[1.05] shadow-[0_15px_30px_-10px_rgba(58,173,224,0.5)] group" style={{ background: C_BLUE }}>
              Contact Our Marketing Team <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}



function EventsPage({ go }: { go: (p: Page) => void }) {
  const pillars = [
    { icon: Building2, title: "Corporate & Business", text: "Conferences, seminars, and annual meetings managed flawlessly to project your brand's authority.", color: C_BLUE },
    { icon: Landmark, title: "Governmental & Official", text: "Executing high-profile functions with strict protocol expertise, professionalism, and security.", color: C_GREEN },
    { icon: Music, title: "Celebrations & Social", text: "Crafting aesthetic, culinary, and atmospheric elements for grand weddings, proms, and intimate gatherings.", color: C_PINK },
    { icon: LayoutTemplate, title: "Exhibitions & Activations", text: "Bringing brand activations to life by managing everything from stand logistics to crowd flow.", color: C_ORANGE }
  ];

  const advantages = [
    { title: "Creative Concepts", text: "We develop unique concepts that reflect your brand’s personality and the event's purpose." },
    { title: "End-to-End Logistics", text: "We manage the entire lifecycle, including venue coordination, supply chains, and on-site troubleshooting." },
    { title: "Seamless Experience", text: "We meticulously align all departments to ensure a smooth, stress-free experience for your guests." },
    { title: "Professionalism", text: "We apply the same elite standards of quality, safety, and operational excellence to every single detail." }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF7F2] text-[#1a1a1a] relative">
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[0%] left-[-10%] w-[50vw] h-[50vw] bg-[#E91E8C]/20 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute top-[40%] right-[-10%] w-[60vw] h-[60vw] bg-[#3AADE0]/15 blur-[150px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vw] bg-[#F5841F]/20 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      <div className="relative z-10 pt-24 pb-0">
        
        {/* Section 1: Division Header & Intro */}
        <div className="px-6 mb-32">
          <div className="relative w-full max-w-[1200px] mx-auto min-h-[60vh] rounded-[48px] overflow-hidden flex items-center justify-center shadow-sm border border-black/5 mt-8 group bg-white/40 backdrop-blur-xl">
            {/* Added Hero Image blending gracefully without black borders */}
            <div className="absolute inset-0 w-full h-full">
              <ImageWithFallback src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1600&q=80" alt="Event Management" className="w-full h-full object-cover opacity-30 transition-transform duration-[2s] group-hover:scale-[1.03]" />
            </div>
            
            <div className="relative z-10 bg-white/90 backdrop-blur-2xl max-w-[900px] w-[90%] p-10 md:p-16 rounded-[40px] text-center border border-white/40 shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
              <div className="inline-flex items-center gap-3 mb-6">
  <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
  <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold uppercase tracking-widest text-[#1a1a1a]/50">Specialized Division</span>
  <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
</div>
              <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[36px] md:text-[52px] leading-[1.1] tracking-tight mb-8 text-[#1a1a1a]">
                Event Management Division:<br/>Crafting Unforgettable Experiences
              </h1>
              <p className="font-['Plus_Jakarta_Sans'] text-[16px] md:text-[18px] text-[#1a1a1a]/70 leading-[1.8] font-medium max-w-[800px] mx-auto">
                We transform visions into seamless, high-impact realities. By combining creative conceptualization with rigorous logistical precision, we ensure every detail—from the initial spark to the final guest departure—is managed with professional care.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Our Expertise (The 4 Pillars) */}
        <div className="max-w-[1200px] mx-auto mb-32 px-6">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[32px] md:text-[48px] tracking-tight text-[#1a1a1a]">We Curate Experiences</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {pillars.map((item, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-xl p-8 rounded-[32px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] border border-white hover:-translate-y-2 transition-transform duration-500 text-center flex flex-col items-center group">
                {/* Colorful vibrant icons */}
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                  <item.icon size={28} />
                </div>
                <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[18px] text-[#1a1a1a] mb-3 leading-[1.3] tracking-tight">{item.title}</h3>
                <p className="font-['Plus_Jakarta_Sans'] text-[14px] leading-[1.6] text-[#1a1a1a]/60 font-medium">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Why Partner with HCH? */}
        <div className="max-w-[1400px] mx-auto mb-32 px-6">
          <div className="rounded-[48px] p-8 md:p-16 border border-white/40 shadow-2xl relative overflow-hidden group">
            {/* Soft Light Pink background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFE3E8] via-[#FFD1DA] to-[#FFE3E8] opacity-90 transition-transform duration-1000 group-hover:scale-105" />

            <div className="relative z-10">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-3 mb-6">
  <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
  <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold uppercase tracking-widest text-[#1a1a1a]/50">Advantage</span>
  <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
</div>
                <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[36px] md:text-[48px] text-[#1a1a1a] leading-[1.1] tracking-tight">The HCH Advantage</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {[
                  { title: "Creative Concepts", text: "We develop unique concepts that reflect your brand’s personality and the event's purpose." },
                  { title: "End-to-End Logistics", text: "We manage the entire lifecycle, including venue coordination, supply chains, and on-site troubleshooting." },
                  { title: "Seamless Experience", text: "We meticulously align all departments to ensure a smooth, stress-free experience for your guests." },
                  { title: "Professionalism", text: "We apply the same elite standards of quality, safety, and operational excellence to every single detail." }
                ].map((adv, i) => (
                  <div key={i} className="bg-white/60 backdrop-blur-xl border border-white/50 p-8 rounded-[32px] text-[#1a1a1a] hover:-translate-y-2 transition-transform duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
                    <div className="font-['Plus_Jakarta_Sans'] font-extrabold text-[32px] text-[#E91E8C]/30 mb-4 tracking-tighter">0{i+1}</div>
                    <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[18px] mb-3 leading-[1.3]">{adv.title}</h3>
                    <p className="font-['Plus_Jakarta_Sans'] text-[14px] leading-[1.6] text-[#1a1a1a]/70 font-medium">{adv.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Our Commitment (Footer) */}
        <div className="w-full bg-[#111111] py-24 md:py-32 px-6 relative overflow-hidden">
          <div className="absolute top-[-50%] left-[-10%] w-[500px] h-[500px] bg-[#E91E8C]/20 blur-[150px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[-50%] right-[-10%] w-[500px] h-[500px] bg-[#E91E8C]/20 blur-[150px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 max-w-[800px] mx-auto text-center">
            <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[36px] md:text-[56px] text-white mb-6 tracking-tight leading-[1.1]">
              Your Dedicated Event Partner
            </h2>
            <p className="font-['Plus_Jakarta_Sans'] text-[16px] md:text-[18px] text-white/70 leading-[1.8] font-medium max-w-[600px] mx-auto mb-10">
              We aim to become your only partner for both corporate and social occasions, establishing long-term relationships built on trust, impeccable service, and the creativity required to make your event truly stand out.
            </p>
            <button onClick={() => go("contact")} className="inline-flex items-center gap-3 font-['Plus_Jakarta_Sans'] text-[15px] font-bold text-white px-10 py-5 rounded-full transition-all duration-300 hover:scale-[1.05] shadow-[0_15px_30px_-10px_rgba(233,30,140,0.5)] group" style={{ background: C_PINK }}>
              Contact Us <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
</div>
      <Footer />
    </div>
  );
}



function ManagementPage({ go }: { go: (p: Page) => void }) {
  const competencies = [
    { icon: PieChart, title: "Operations & Finance", text: "Optimize your bottom line with ROI analysis, data-driven menu engineering, stringent cost control, and accurate budgeting.", color: C_ORANGE, img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80" },
    { icon: Briefcase, title: "Corporate Finance & Structure", text: "Professional oversight to stabilize and scale, including crisis management, legal structuring, and HR/payroll optimization.", color: C_PINK, img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80" },
    { icon: Building, title: "Hotel & Resort Consultancy", text: "Specialized asset management, strict brand standard compliance, and professional management agreements for large-scale properties.", color: C_BLUE, img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80" },
    { icon: Monitor, title: "Integrated Technology", text: "Equipping your team with robust POS system integration, guest-facing digital solutions, and real-time analytical tools.", color: C_GREEN, img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80" },
    { icon: Palette, title: "Marketing & Brand Identity", text: "Elevating your market presence through cohesive identity design, menu aesthetics, and conversion-focused SEO.", color: C_ORANGE, img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80" }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF7F2] text-[#1a1a1a] relative">
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[0%] left-[-10%] w-[50vw] h-[50vw] bg-[#F5841F]/20 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute top-[40%] right-[-10%] w-[60vw] h-[60vw] bg-[#E91E8C]/15 blur-[150px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vw] bg-[#F5841F]/20 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      <div className="relative z-10 pt-24 pb-0">
        
        {/* Section 1: Division Header & Intro */}
        <div className="px-6 mb-32">
          <div className="relative w-full max-w-[1200px] mx-auto min-h-[60vh] rounded-[48px] overflow-hidden flex items-center justify-center shadow-sm border border-black/5 mt-8 group bg-white/40 backdrop-blur-xl">
            {/* Added Hero Image blending gracefully without black borders */}
            <div className="absolute inset-0 w-full h-full p-6">
              <ImageWithFallback src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&q=80" alt="Management & Consultancy" className="w-full h-full object-cover rounded-[32px] opacity-20 transition-transform duration-[2s] group-hover:scale-[1.03]" />
            </div>
            
            <div className="relative z-10 bg-white/90 backdrop-blur-2xl max-w-[900px] w-[90%] p-10 md:p-16 rounded-[40px] text-center border border-white/40 shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
              <div className="inline-flex items-center gap-3 mb-6">
  <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
  <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold uppercase tracking-widest text-[#1a1a1a]/50">Specialized Division</span>
  <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
</div>
              <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[36px] md:text-[52px] leading-[1.1] tracking-tight mb-8 text-[#1a1a1a]">
                Management & Consultancy:<br/>Driving Operational Excellence
              </h1>
              <p className="font-['Plus_Jakarta_Sans'] text-[16px] md:text-[18px] text-[#1a1a1a]/70 leading-[1.8] font-medium max-w-[800px] mx-auto">
                We operate as strategic partners in your business success. Anchored in 13+ years of global experience, we provide end-to-end management solutions that transition F&B and hospitality ventures from operational challenges to sustained profitability. We repair weak spots and elevate strengths through rigorous analysis.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Strategic Core Competencies (The 5 Pillars) */}
        <div className="max-w-[1200px] mx-auto mb-32 px-6">
          <div className="text-center mb-16 md:mb-20">
            <div className="inline-flex items-center gap-3 mb-6">
  <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
  <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold uppercase tracking-widest text-[#1a1a1a]/50">Competencies</span>
  <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
</div>
            <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[32px] md:text-[48px] tracking-tight text-[#1a1a1a]">Strategic Core Competencies</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {competencies.map((item, i) => (
              <div key={i} className="relative overflow-hidden bg-white p-8 md:p-10 rounded-[40px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] border border-white hover:-translate-y-2 transition-transform duration-500 flex flex-col group">

                
                <div className="relative z-10 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-sm bg-white" style={{ color: item.color }}>
                    <item.icon size={28} />
                  </div>
                  <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[18px] text-[#1a1a1a] mb-3 leading-[1.3] tracking-tight">{item.title}</h3>
                  <p className="font-['Plus_Jakarta_Sans'] text-[14px] leading-[1.6] text-[#1a1a1a]/70 font-medium">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Why Partner With Us? (Footer CTA) */}
        <div className="w-full bg-[#111111] py-24 md:py-32 px-6 relative overflow-hidden">
          <div className="absolute top-[-50%] left-[-10%] w-[500px] h-[500px] bg-[#F5841F]/20 blur-[150px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[-50%] right-[-10%] w-[500px] h-[500px] bg-[#E91E8C]/15 blur-[150px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 max-w-[800px] mx-auto text-center">
            <div className="inline-flex items-center gap-3 mb-6">
  <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
  <span className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold uppercase tracking-widest text-white/70">Why Partner With Us?</span>
  <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
</div>
            <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[36px] md:text-[56px] text-white mb-6 tracking-tight leading-[1.1]">
              Practical, Sustainable, and Scalable Solutions
            </h2>
            <p className="font-['Plus_Jakarta_Sans'] text-[16px] md:text-[18px] text-white/70 leading-[1.8] font-medium max-w-[600px] mx-auto mb-10">
              Founded on the 'been there, done that' philosophy, we combine academic rigor with hands-on operational experience. Let us supply the strategic plans necessary to achieve industry-leading results.
            </p>
            <button onClick={() => go("contact")} className="inline-flex items-center gap-3 font-['Plus_Jakarta_Sans'] text-[15px] font-bold text-white px-10 py-5 rounded-full transition-all duration-300 hover:scale-[1.05] shadow-[0_15px_30px_-10px_rgba(245,132,31,0.5)] group" style={{ background: C_ORANGE }}>
              Contact Us <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
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
      <div className="max-w-[1200px] mx-auto px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_500px] gap-16 items-start">
          <div>
            <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[#1a1a1a] mb-6" style={{ fontSize: "clamp(40px, 6vw, 72px)" }}>Let's build something great.</h1>
            <p className="font-['Plus_Jakarta_Sans'] text-[17px] text-[#1a1a1a]/55 leading-[1.8] mb-10 max-w-md">Whether you have a clear brief or just a big ambition — reach out. We'll schedule a free 30-minute discovery call.</p>
            <div className="space-y-5">
              {[{ Icon: Mail, text: "hello@harmonyclubhouse.com" }, { Icon: Phone, text: "+20 100 000 0000" }, { Icon: MapPin, text: "Cairo, Egypt — 4 Continents" }].map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${C_ORANGE}15` }}>
                    <Icon size={16} style={{ color: C_ORANGE }} />
                  </div>
                  <span className="font-['Plus_Jakarta_Sans'] text-[15px] text-[#1a1a1a]/60">{text}</span>
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
                <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[28px] text-[#1a1a1a] mb-3">Message received.</h2>
                <p className="font-['Plus_Jakarta_Sans'] text-[15px] text-[#1a1a1a]/45">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-5">
                <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-[22px] text-[#1a1a1a] mb-6">Tell us about your project.</h2>
                {[
                  { label: "Your name", key: "name" as const, type: "text", placeholder: "Ahmed Hassan", required: true },
                  { label: "Email address", key: "email" as const, type: "email", placeholder: "ahmed@brand.com", required: true },
                  { label: "Company / Brand", key: "company" as const, type: "text", placeholder: "Your brand name", required: false },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold uppercase tracking-[0.1em] text-[#1a1a1a]/35 block mb-2">{f.label}</label>
                    <input type={f.type} required={f.required} value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.placeholder}
                      className="w-full font-['Plus_Jakarta_Sans'] text-[14px] text-[#1a1a1a] bg-[#FAF7F2] border border-black/[0.08] rounded-xl px-4 py-3 outline-none focus:border-black/25 transition-colors placeholder:text-[#1a1a1a]/20" />
                  </div>
                ))}
                <div>
                  <label className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold uppercase tracking-[0.1em] text-[#1a1a1a]/35 block mb-2">Area of interest</label>
                  <div className="relative">
                    <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}
                      className="w-full font-['Plus_Jakarta_Sans'] text-[14px] text-[#1a1a1a] bg-[#FAF7F2] border border-black/[0.08] rounded-xl px-4 py-3 outline-none focus:border-black/25 transition-colors appearance-none cursor-pointer">
                      <option value="">Select a service</option>
                      {["Management & Consultancy", "Events", "Marketing", "Recruitment & Training", "Not sure yet"].map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold uppercase tracking-[0.1em] text-[#1a1a1a]/35 block mb-2">Your message</label>
                  <textarea required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us about your goals..."
                    className="w-full font-['Plus_Jakarta_Sans'] text-[14px] text-[#1a1a1a] bg-[#FAF7F2] border border-black/[0.08] rounded-xl px-4 py-3 outline-none focus:border-black/25 transition-colors resize-none placeholder:text-[#1a1a1a]/20" />
                </div>
                <button type="submit"
                  className="w-full font-['Plus_Jakarta_Sans'] text-[14px] font-semibold text-white py-4 rounded-full flex items-center justify-center gap-2 hover:opacity-90 transition-all duration-200 group"
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
  { id: "events", color: "#E91E8C", label: "Events", features: ["Venue scouting & negotiation", "Bespoke catering design", "AV & décor coordination", "Guest management"] },
  { id: "marketing", color: "#3AADE0", label: "Marketing", features: ["Brand identity & positioning", "Social media strategy", "Influencer & PR campaigns", "Photography direction"] },
  { id: "recruitment", color: "#78BE1F", label: "Recruitment", features: ["Executive placement", "Chef & culinary sourcing", "FOH & BOH recruitment", "Event & seasonal staffing"] }
];

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 w-full mt-24">
      <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #F5841F, #E91E8C, #3AADE0, #78BE1F)' }} />
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid md:grid-cols-5 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-white border border-gray-100 p-1.5 shadow-sm">
                <img src="/imports/friend-logo.png" alt="HCH" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="font-['Plus_Jakarta_Sans'] font-extrabold text-[#1a1a1a] text-[15px] tracking-tight leading-none mb-1.5">HARMONY CLUB HOUSE</div>
                <div className="font-['Plus_Jakarta_Sans'] text-[11px] text-[#1a1a1a]/40 font-bold uppercase tracking-wider">Est. 2012 &middot; Cairo, Egypt</div>
              </div>
            </div>
            <p className="font-['Plus_Jakarta_Sans'] text-[15px] text-[#1a1a1a]/60 font-medium leading-[1.8] max-w-[320px]">
              Premier F&B development and hospitality consultancy with over 13 years of international excellence.
            </p>
          </div>
          {FOOTER_SERVICES.map(s => (
            <div key={s.id}>
              <div className="font-['Plus_Jakarta_Sans'] text-[12px] font-extrabold mb-4 uppercase tracking-[0.1em]" style={{ color: s.color }}>{s.label}</div>
              {s.features.map(f => (
                <div key={f} className="font-['Plus_Jakarta_Sans'] text-[14px] text-[#1a1a1a]/50 mb-3 hover:text-[#1a1a1a] cursor-pointer transition-colors leading-relaxed font-medium">{f}</div>
              ))}
            </div>
          ))}
        </div>
        <div className="pt-8 border-t border-black/[0.04] flex flex-col md:flex-row items-center justify-between gap-6 text-[13px] text-[#1a1a1a]/40 font-['Plus_Jakarta_Sans'] font-medium">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <span>&copy; 2024 Harmony Club House. All rights reserved.</span>
            <div className="flex gap-4">
              {FOOTER_SOCIAL_ICONS.map(({ Icon, label, color }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="w-10 h-10 rounded-full bg-[#FAF7F2] shadow-sm border border-black/5 flex items-center justify-center text-[#1a1a1a]/40 transition-all duration-300 hover:scale-110 hover:bg-white hover:shadow-md"
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
    </footer>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>("home");

  const go = (p: Page) => setPage(p);

  return (
    <div
      className="h-screen overflow-hidden flex flex-col"
      style={{ background: "#FAF7F2", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <Nav current={page} go={go} />

      {page === "home" && <HomePage go={go} />}
      {page === "services" && <ServicesPage go={go} />}
      {page === "stories" && <StoriesPage go={go} />}
      {page === "about" && <AboutPage go={go} />}
      {page === "mission" && <MissionPage go={go} />}
      {page === "fnb" && <FnbPage go={go} />}
      {page === "catering" && <CateringPage go={go} />}
      {page === "recruitment" && <RecruitmentPage go={go} />}
      {page === "marketing" && <MarketingPage go={go} />}
      {page === "events" && <EventsPage go={go} />}
      {page === "management" && <ManagementPage go={go} />}
      {page === "contact" && <ContactPage />}
    </div>
  );
}

