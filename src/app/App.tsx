"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslate } from "@tolgee/react";
import { motion } from "motion/react";
import { ImageWithFallback } from "@/components";
import { api } from "@/lib/api";
import AdminDashboard from "./AdminDashboard";
import CompanyDashboard from "./CompanyDashboard";
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

import { SERVICES, SERVICE_BY_ID, setDynamicServicesCatalog, findService, type ServiceId } from "@/content/services";
import { type Page, isKnownPage, pageToPath, pathToPage } from "./routes";
import { isStaffRole, useAuth } from "./auth";
import { BookingPage } from "@/components/brief/BookingPage";
import { CatalogServicePage } from "@/components/services/CatalogServicePage";
import { api, type CatalogService } from "@/lib/api";
import { ServicesOverview } from "@/components/services/ServicesOverview";
import { SectorPage } from "@/components/services/SectorPage";
import { MarketingStory } from "@/components/services/MarketingStory";

// Image paths - move images from src/imports to public/imports
const logoImg = "/imports/image-10.png";
const welcomeImg = "/imports/image-11.png";
const missionTopImg = "/imports/image-7.png";

const C_ORANGE = "#F5841F";
const C_PINK = "#E91E8C";
const C_BLUE = "#3AADE0";
const C_GREEN = "#78BE1F";

// ── Brand ──────────────────────────────────────────────────────────────────────────────────────────
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

function HeroCircle({ go, hidden }: { go: (p: Page) => void, hidden: string[] }) {
  return (
    <div className="flex justify-center">
      <div className="relative w-80 h-80 rounded-full border-4 border-white shadow-2xl flex items-center justify-center overflow-hidden">
        {/* Central HCH Circle */}
        <div className="absolute z-10 bg-white w-28 h-28 rounded-full flex flex-col items-center justify-center font-bold text-lg shadow-lg">
          HCH <span className="text-[10px] text-gray-400 font-normal tracking-widest">HARMONY</span>
        </div>
        
        {/* Quadrant Buttons - Passing 'go' correctly to each */}
        <div className="grid grid-cols-2 w-full h-full">
          {!hidden.includes("business") ? (
            <button onClick={() => go("business")} className="bg-[#FFB343] flex items-center justify-center text-white font-bold text-xs hover:opacity-90 transition-opacity">BUSINESS DEV</button>
          ) : <div className="bg-gray-100/50" />}
          
          {!hidden.includes("events") ? (
            <button onClick={() => go("events")} className="bg-[#E91E8C] flex items-center justify-center text-white font-bold text-xs hover:opacity-90 transition-opacity">EVENTS</button>
          ) : <div className="bg-gray-100/50" />}
          
          {!hidden.includes("recruitment") ? (
            <button onClick={() => go("recruitment")} className="bg-[#3DAA68] flex items-center justify-center text-white font-bold text-xs hover:opacity-90 transition-opacity">RECRUITMENT</button>
          ) : <div className="bg-gray-100/50" />}
          
          {!hidden.includes("marketing") ? (
            <button onClick={() => go("marketing")} className="bg-[#2AAEDE] flex items-center justify-center text-white font-bold text-xs hover:opacity-90 transition-opacity">MARKETING</button>
          ) : <div className="bg-gray-100/50" />}
        </div>
      </div>
    </div>
  );
}


function LoginPage({ go }: { go: (p: Page) => void }) {
  const { t } = useTranslate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const { login, register } = useAuth();
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [userType, setUserType] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;

 setBusy(true);
    setError(null);

    try {
      if (mode === "signup") {
        if (!companyName.trim() || !contactName.trim() || !contactPhone.trim() || !email.trim() || !password.trim()) {
          setError(t('signup_fields_required_err', "Company name, contact name, contact phone, email and password are required."));
          setBusy(false);
          return;
        }

        await api.post<{ success: boolean; message?: string }>("/auth/register", {
          companyName: companyName.trim(),
          contactName: contactName.trim(),
          contactPhone: contactPhone.trim(),
          email: email.trim(),
          password: password.trim(),
        });

        const loginResult = await login(email.trim(), password.trim());
        if (!loginResult.ok) {
          setError(loginResult.message ?? t('reg_login_failed_err', "Registration succeeded but login failed."));
          setBusy(false);
          return;
        }
      } else {
        const result = await login(email.trim(), password.trim());
        if (!result.ok) {
          setError(result.message ?? t('signin_failed_err', "Sign in failed."));
          setBusy(false);
          return;
        }
      }

      const returnTo = typeof window !== "undefined" ? sessionStorage.getItem("returnTo") : null;
      if (returnTo) sessionStorage.removeItem("returnTo");
      go(isKnownPage(returnTo) ? (returnTo as Page) : "about");
      
    } catch (err: any) {
      setError(err?.message ?? t('api_error_err', "An error occurred. Is the API running?"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto flex items-center justify-center bg-[#FAF7F2] relative p-6 py-12">
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] left-[20%] w-[40vw] h-[40vw] bg-[#F5841F]/15 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[10%] right-[20%] w-[40vw] h-[40vw] bg-[#E91E8C]/15 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white shadow-sm border border-gray-100 mb-4 cursor-pointer" onClick={() => go("about")}>
             <img src="/imports/friend-logo.png" alt="HCH" className="w-8 h-8 object-contain" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight text-[#1a1a1a]">
            {mode === "login" ? t('login_welcome', "Welcome Back") : t('login_create_acc', "Create an Account")}
          </h1>
          <p className="text-xl md:text-2xl text-[#1a1a1a]/70 font-medium leading-[1.8] mt-2">
            {mode === "login" ? t('login_subtitle_log', "Sign in to access your dashboard") : t('login_subtitle_sign', "Join the Harmony ecosystem")}
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-2xl p-8 md:p-10 rounded-[40px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] border border-white">
          <form onSubmit={handleSignIn} className="space-y-8">
            
            {/* Sign Up Only: Company Name */}
            {mode === "signup" && (
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5" style={{fontFamily:"'Montserrat',sans-serif"}}>{t('form_company_name', 'Company Name')}</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Building size={16} /></div>
                  <input type="text" placeholder={t('placeholder_company', 'Acme Restaurant')} required
                    value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl text-base border border-gray-200 outline-none transition-all placeholder-gray-300 text-gray-800 focus:border-[#F5841F] bg-white/50" />
                </div>
              </div>
            )}

            {/* Sign Up Only: Contact Name */}
            {mode === "signup" && (
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5" style={{fontFamily:"'Montserrat',sans-serif"}}>{t('form_contact_name', 'Contact Name')}</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><User size={16} /></div>
                  <input type="text" placeholder={t('placeholder_name', 'Ahmed Hassan')} required
                    value={contactName} onChange={(e) => setContactName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl text-base border border-gray-200 outline-none transition-all placeholder-gray-300 text-gray-800 focus:border-[#F5841F] bg-white/50" />
                </div>
              </div>
            )}

            {/* Sign Up Only: Contact Phone */}
            {mode === "signup" && (
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5" style={{fontFamily:"'Montserrat',sans-serif"}}>{t('form_contact_phone', 'Contact Phone')}</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Phone size={16} /></div>
                  <input type="tel" placeholder={t('placeholder_phone', '+20 100 000 0000')} required
                    value={contactPhone} onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl text-base border border-gray-200 outline-none transition-all placeholder-gray-300 text-gray-800 focus:border-[#F5841F] bg-white/50" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5" style={{fontFamily:"'Montserrat',sans-serif"}}>{t('form_email', 'Email Address')}</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Mail size={16} /></div>
                <input type="email" placeholder={t('placeholder_email', 'hello@example.com')} required
                  value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email"
                  autoCapitalize="none" autoCorrect="off" spellCheck={false}
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-base border border-gray-200 outline-none transition-all placeholder-gray-300 text-gray-800 focus:border-[#F5841F] bg-white/50" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5" style={{fontFamily:"'Montserrat',sans-serif"}}>{t('form_password', 'Password')}</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Lock size={16} /></div>
                <input type="password" placeholder="••••••••" required
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-base border border-gray-200 outline-none transition-all placeholder-gray-300 text-gray-800 focus:border-[#F5841F] bg-white/50" />
              </div>
            </div>

            {mode === "signup" && (
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5" style={{fontFamily:"'Montserrat',sans-serif"}}>{t('form_iam', 'I am a...')}</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Briefcase size={16} /></div>
                  <select required value={userType} onChange={(e) => setUserType(e.target.value)} className="w-full pl-11 pr-10 py-3 rounded-xl text-base border border-gray-200 outline-none transition-all text-gray-700 focus:border-[#F5841F] bg-white/50 appearance-none cursor-pointer">
                    <option value="" disabled>{t('select_objective', 'Select your objective')}</option>
                    <option value="restaurant">{t('opt_restaurant', 'Restaurant / F&B Owner')}</option>
                    <option value="recruiter">{t('opt_recruiter', 'Recruiter / Seeking Talent')}</option>
                    <option value="event">{t('opt_event', 'Client (Planning an Event)')}</option>
                    <option value="marketing">{t('opt_marketing', 'Client (Seeking Marketing)')}</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            )}

            {error && (
              <div role="alert" className="rounded-2xl bg-red-50 border border-red-100 px-5 py-3.5 text-base font-semibold text-red-700">
                {error}
              </div>
            )}

            <button type="submit" disabled={busy}
              className="w-full py-3.5 mt-2 rounded-full text-lg font-bold text-white transition-all hover:shadow-lg hover:-translate-y-0.5 group flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              style={{ background: `linear-gradient(135deg, #F5841F, #E91E8C)`, fontFamily:"'Montserrat',sans-serif" }}>
              {busy ? t('btn_signing', 'Signing in…') : mode === "login" ? t('btn_signin', 'Sign In') : t('btn_create_acc', 'Create Account')}
              {!busy && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-gray-100">
            <p className="text-base text-[#1a1a1a]/55 font-medium">
              {mode === "login" ? t('prompt_no_acc', "Don't have an account? ") : t('prompt_have_acc', "Already have an account? ")}
              <button 
                onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); }}
                className="font-bold text-[#E91E8C] hover:text-[#F5841F] transition-colors"
              >
                {mode === "login" ? t('action_signup', 'Sign up') : t('action_login', 'Log in')}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


function StoriesPage({ go }: { go: (p: Page) => void }) {
  const { t } = useTranslate();
  const placeholderCards = [1, 2, 3];

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF7F2] text-[#1a1a1a] relative">
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] bg-[#F5841F]/15 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] bg-[#3AADE0]/10 blur-[150px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vw] bg-[#E91E8C]/15 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      <div className="relative z-10 pt-24 pb-32">
        <div className="max-w-[800px] mx-auto px-6 text-center mb-24 md:mb-32">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
            <span className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/50">{t('portfolio_label', 'Portfolio')}</span>
            <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
          </div>
          <h1 className="font-extrabold text-5xl md:text-6xl leading-[1.1] tracking-tight mb-8 text-[#1a1a1a]">
            {t('stories_heading_prefix', 'Our ')} <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(135deg, #E91E8C, #3AADE0)` }}>{t('stories_heading_suffix', 'Stories.')}</span>
          </h1>
          <p className="text-xl md:text-2xl leading-[1.8] text-[#1a1a1a]/70 font-medium">
            {t('stories_subtext', '30+ projects across 4 continents. Real challenges, real results.')}
          </p>
        </div>

        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {placeholderCards.map((_, i) => (
              <div key={i} className="group bg-white/60 backdrop-blur-xl rounded-[40px] p-4 border border-white shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] transition-all duration-500">
                <div className="relative overflow-hidden bg-[#E0DCD5] rounded-[32px] aspect-[4/3] mb-6 flex items-center justify-center border border-black/5">
                  <div className="font-bold text-[#1a1a1a]/20 text-lg uppercase tracking-widest">
                    {t('image_placeholder', 'Image')}
                  </div>
                </div>
                <div className="px-4 pb-4">
                  <div className="w-3/4 h-6 bg-black/5 rounded-md mb-3" />
                  <div className="w-1/2 h-4 bg-black/5 rounded-md mb-6" />
                  <div className="pt-5 border-t border-black/[0.05]">
                    <div className="text-xs font-bold uppercase tracking-[0.1em] text-[#1a1a1a]/40 mb-3">{t('the_result', 'The Result')}</div>
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
             <h2 className="font-extrabold text-4xl md:text-5xl leading-[1.15] tracking-tight text-[#1a1a1a] mb-8">{t('success_story_starts', 'Your success story starts here.')}</h2>
             <button onClick={() => go("contact")} className="inline-flex items-center gap-3 text-lg font-bold text-white px-8 py-4 rounded-full transition-all duration-300 hover:scale-[1.05] shadow-[0_15px_30px_-10px_rgba(245,132,31,0.5)] group" style={{ background: `linear-gradient(135deg, ${C_ORANGE}, ${C_PINK})` }}>
               {t('start_conversation', 'Start a Conversation')} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
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
  { year:"2024", label:"4 Continents",     desc:"Active across MENA, Europe, Asia, and the Americas - 30+ projects and growing.", color:C_FRIEND.events },
];

function TimelineSection() {
  const { t } = useTranslate();
  const TIMELINE_FRIEND = [
    { year:"2012", label:t('timeline_2012_lbl',"Founded"), desc:t('timeline_2012_desc',"Harmony Club House established in Cairo with a bold vision to redefine F&B consulting."), color:C_FRIEND.management },
    { year:"2015", label:t('timeline_2015_lbl',"First Expansion"), desc:t('timeline_2015_desc',"Expanded operations across MENA, partnering with Kempinski, Marriott, and Baron Hotels."), color:C_FRIEND.events },
    { year:"2017", label:t('timeline_2017_lbl',"Events Division"), desc:t('timeline_2017_desc',"Launched dedicated events arm, delivering 50+ large-scale corporate and private events."), color:C_FRIEND.marketing },
    { year:"2019", label:t('timeline_2019_lbl',"Digital & Marketing"), desc:t('timeline_2019_desc',"Introduced full-stack marketing services as brands demanded stronger digital presence."), color:C_FRIEND.recruitment },
    { year:"2021", label:t('timeline_2021_lbl',"2,500 Trained"), desc:t('timeline_2021_desc',"Milestone: trained over 2,500 hospitality professionals across the region."), color:C_FRIEND.management },
    { year:"2024", label:t('timeline_2024_lbl',"4 Continents"), desc:t('timeline_2024_desc',"Active across MENA, Europe, Asia, and the Americas — 30+ projects and growing."), color:C_FRIEND.events },
  ];

  return (
    <section id="timeline" className="mb-24 md:mb-32 overflow-x-hidden">
      <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-14 md:mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-px w-8" style={{background:GRAD_FRIEND}}/>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{t('our_journey', 'Our Journey')}</span>
            <div className="h-px w-8" style={{background:GRAD_FRIEND}}/>
          </div>
          <h2 className="font-extrabold text-4xl md:text-5xl leading-[1.15] tracking-tight text-[#1a1a1a]">
            {t('timeline_title_prefix', '13 Years of ')} <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(135deg, #F5841F, #E91E8C)` }}>{t('timeline_title_suffix', 'Excellence')}</span>
          </h2>
        </div>

        {/* Desktop flowing SVG timeline */}
        <div className="hidden md:block relative" style={{height:"400px", marginTop: "120px"}}>
          <svg viewBox="0 0 1100 200" className="absolute inset-0 w-full" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="tl-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor={C_FRIEND.management}/>
                <stop offset="33%"  stopColor={C_FRIEND.events}/>
                <stop offset="66%"  stopColor={C_FRIEND.marketing}/>
                <stop offset="100%" stopColor={C_FRIEND.recruitment}/>
              </linearGradient>
            </defs>
            <path d="M 60 120 C 160 40, 260 160, 400 100 C 540 40, 640 160, 780 100 C 880 60, 960 140, 1040 100"
              stroke="url(#tl-grad)" strokeWidth="3" fill="none" strokeLinecap="round"/>
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

          <div className="absolute inset-0 flex items-stretch">
            {TIMELINE_FRIEND.map(({year,label,desc,color},i)=>{
              const xPercents=[5.5,20,36.4,54.5,71,94.5];
              const above=[true,false,true,false,true,false];
              return (
                <div key={year} className="absolute flex flex-col" style={{
                  left: `${xPercents[i]}%`, 
                  top: above[i] ? "-30%" : "65%", 
                  width: "200px", 
                  transform: "translateX(-50%)"
                }}>
                  <div className={`${above[i] ? "pb-4" : "pt-4"}`}>
                    <div className="text-base md:text-lg font-black mb-0.5" style={{color}}>{year}</div>
                    <div className="text-lg md:text-xl font-bold text-gray-900 mb-1">{label}</div>
                    <div className="text-base text-gray-500 leading-tight">{desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

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
  { name:"Kempinski",             cat:"Hospitality", domain:"kempinski.com" },
  { name:"Marriott",              cat:"Hospitality", domain:"marriott.com" },
  { name:"Dunkin'",               cat:"F&B",         domain:"dunkindonuts.com" },
  { name:"Hardee's",              cat:"F&B",         domain:"hardees.com" },
  { name:"Krispy Kreme",          cat:"F&B",         domain:"krispykreme.com", logo:"/krispy_kreme_logo.jpg" },
  { name:"Mori Sushi",            cat:"F&B",         domain:"mori-intl.net" },
  { name:"Tamara",                cat:"F&B",         domain:"tamarabistro.com", logo:"/tamara_logo.jpg" },
  { name:"Grand Cafe",            cat:"F&B",         domain:"grandcafe-eg.com", logo:"/grand_cafe_logo.jpg" },
  { name:"Butcher's Burger",      cat:"F&B",         domain:"butchersburger.com" },
  { name:"TBS",                   cat:"Retail",      domain:"tbsfresh.com", logo:"/tbs_logo.jpg" },
  { name:"Vodafone",              cat:"Corporate",   domain:"vodafone.com.eg" },
  { name:"BLOM Bank",             cat:"Finance",     domain:"blombank.com" },
  { name:"GUC Cairo",             cat:"Education",   domain:"guc.edu.eg" },
];
const CAT_COLOR_FRIEND: Record<string,string> = {
  Hospitality:C_FRIEND.management, "F&B":C_FRIEND.events, Retail:C_FRIEND.marketing, Corporate:C_FRIEND.recruitment, Finance:C_FRIEND.recruitment, Education:C_FRIEND.marketing,
};

function PartnersSection() {
  const { t } = useTranslate();
  const [cat, setCat] = useState("All");
  const cats = ["All", ...Array.from(new Set(PARTNERS_FRIEND.map(p=>p.cat)))];
  const shown = cat==="All" ? PARTNERS_FRIEND : PARTNERS_FRIEND.filter(p=>p.cat===cat);
  return (
    <section id="partners">
      <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-14 md:mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-px w-8" style={{background:GRAD_FRIEND}}/>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{t('success_partners_label', 'Success Partners')}</span>
            <div className="h-px w-8" style={{background:GRAD_FRIEND}}/>
          </div>
          <h2 className="font-extrabold text-4xl md:text-5xl leading-[1.15] tracking-tight text-[#1a1a1a] mb-6">
            {t('partners_title_prefix', 'Trusted by ')} <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(135deg, #F5841F, #E91E8C)` }}>{t('partners_title_suffix', 'Industry Giants')}</span>
          </h2>
          <p className="text-xl md:text-2xl leading-[1.8] text-[#1a1a1a]/70 font-medium max-w-4xl mx-auto">
            {t('partners_subtext', 'From global hospitality leaders and banking institutions to iconic F&B brands — 14 trusted partners across the industry.')}
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
          {shown.map(({name,cat:c, domain, logo})=>(
            <div key={name}
              className="group relative overflow-hidden bg-white rounded-2xl px-4 py-5 text-center border border-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-default"
            >
              <div className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-100 transition-opacity duration-300" 
                   style={{ backgroundImage: logo ? `url(${logo})` : `url(https://unavatar.io/${domain}?fallback=false), url(https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${domain}&size=256)`, backgroundSize: '50%', backgroundPosition: 'center' }} />
              <div className="relative z-10 bg-white/70 backdrop-blur-sm py-2 px-1 rounded-xl mt-8">
                <div className="w-8 h-0.5 rounded-full mx-auto mb-3 transition-all duration-300"
                  style={{background:"#d1d5db"}}
                  onMouseEnter={e=>(e.currentTarget.style.background=CAT_COLOR_FRIEND[c]||C_FRIEND.management)}
                  onMouseLeave={e=>(e.currentTarget.style.background="#d1d5db")}
                />
                <div className="text-2xl font-extrabold text-gray-900 leading-tight transition-all duration-300">
                  {name}
                </div>
                <div className="text-xs mt-1.5 font-bold text-gray-800 uppercase tracking-wider transition-all duration-300">{c}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutPage({ go }: { go: (p: Page) => void }) {
  const { t } = useTranslate();
  const whyPartnerReasons = [
    { title: t('about_r1_t', "End-to-End Expertise"), text: t('about_r1_d', "We expertly navigate the complexities of business setup, managing legal structures, financial planning, and facility logistics so you can focus entirely on scaling your core business."), color: "#F5841F", bgImage: "/imports/bg_expertise.png" },
    { title: t('about_r2_t', "Data-Driven Results"), text: t('about_r2_d', "We identify weak spots and elevate your strengths through rigorous analysis, ensuring your business is structurally built for long-term profitability."), color: "#E91E8C", bgImage: "/imports/bg_data.png" },
    { title: t('about_r3_t', "Global Standards"), text: t('about_r3_d', "We seamlessly blend elite international hospitality benchmarks with our deep, localized knowledge of the Egyptian market to deliver highly creative and practical solutions."), color: "#3AADE0", bgImage: "/imports/bg_standards.png" }
  ];

  const coreValues = [
    { icon: Lightbulb, title: t('v1_title', "Practical Wisdom"), text: t('v1_desc', "Our consultancy goes beyond theory; it is deeply anchored in the reality of navigating the global hospitality industry."), color: "#F5841F", bgImage: "/imports/bg_wisdom.png" },
    { icon: Heart, title: t('v2_title', "Harmonious Partnership"), text: t('v2_desc', "By fully understanding your brand's unique character, we act as a true extension of your team to create customized, perfectly aligned solutions."), color: "#E91E8C", bgImage: "/imports/bg_partnership.png" },
    { icon: BarChart, title: t('v3_title', "Operational Integrity"), text: t('v3_desc', "We commit to absolute transparency, using data-driven precision to repair operations and ensure your business transitions to profitability."), color: "#3AADE0", bgImage: "/imports/bg_integrity.png" },
    { icon: Users, title: t('v4_title', "Human-Centric Growth"), text: t('v4_desc', "We recognize that a business relies on its people, heavily investing in high-qualification teams through expert recruitment and rigorous training."), color: "#78BE1F", bgImage: "/imports/bg_growth.png" },
    { icon: ShieldCheck, title: t('v5_title', "Quality Without Compromise"), text: t('v5_desc', "We strictly adhere to the highest international safety and efficiency standards across all food, kitchen, and event logistics."), color: "#F5841F", bgImage: "/imports/bg_quality.png" },
    { icon: Zap, title: t('v6_title', "Innovation & Agility"), text: t('v6_desc', "We keep your brand relevant in a dynamic market by blending creative concept development with cutting-edge digital tools."), color: "#E91E8C", bgImage: "/imports/bg_innovation.png" }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF7F2] text-[#1a1a1a] relative">
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] bg-[#F5841F]/15 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] bg-[#3AADE0]/10 blur-[150px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vw] bg-[#E91E8C]/15 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      <div className="relative z-10 pb-32 pt-24 w-full px-0">
        <div className="w-full mb-24 md:mb-32 relative px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-10 relative z-20">
              <div>
                <h1 className="font-extrabold text-5xl md:text-6xl leading-[1.1] tracking-tight text-[#1a1a1a]">
                  {t('about_headline_1', "We don't just consult,")}<br/>
                  <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(135deg, ${C_ORANGE}, ${C_PINK})` }}>
                    {t('about_headline_2', "We partner.")}
                  </span>
                </h1>
              </div>
              
              <p className="text-xl md:text-2xl leading-[1.8] text-[#1a1a1a]/70 font-medium max-w-4xl">
                {t('about_subtext', "Harmony Club House is a premier platform for F&B development and hospitality consultancy, empowering investors and operators to unlock the full potential of their ventures. Established in 2012, we bring over 13 years of hands-on international experience to build your success.")}
              </p>

              <div className="bg-white/80 backdrop-blur-2xl p-6 md:p-8 rounded-[32px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] border border-white max-w-4xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-8">
                  {[
                    { icon: Clock, val: "13+", label: t('stat_years', "Years Exp."), color: C_ORANGE },
                    { icon: Globe, val: "4", label: t('stat_continents', "Continents"), color: C_PINK },
                    { icon: Rocket, val: "30+", label: t('stat_projects', "Projects"), color: C_BLUE },
                    { icon: GraduationCap, val: "2,500+", label: t('stat_trained', "Trained"), color: C_GREEN }
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

            <div className="lg:col-span-5 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#F5841F]/20 via-[#E91E8C]/20 to-[#3AADE0]/20 blur-[60px] rounded-full" />
              
              <div className="grid grid-cols-2 gap-8 relative z-10">
                <div className="space-y-8 pt-12">
                  <div className="relative h-64 rounded-[32px] overflow-hidden group shadow-lg">
                    <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&q=80" alt="Management" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#F5841F] via-[#F5841F]/40 to-transparent opacity-90" />
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <Building2 size={24} className="mb-2 opacity-80" />
                      <h4 className="font-bold text-3xl">{t('pillar_mgmt', 'Management')}</h4>
                    </div>
                  </div>
                  <div className="relative h-56 rounded-[32px] overflow-hidden group shadow-lg">
                    <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500&q=80" alt="Marketing" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#3AADE0] via-[#3AADE0]/40 to-transparent opacity-90" />
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <Megaphone size={24} className="mb-2 opacity-80" />
                      <h4 className="font-bold text-3xl">{t('pillar_mktg', 'Marketing')}</h4>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="relative h-56 rounded-[32px] overflow-hidden group shadow-lg">
                    <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500&q=80" alt="Events" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#E91E8C] via-[#E91E8C]/40 to-transparent opacity-90" />
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <Calendar size={24} className="mb-2 opacity-80" />
                      <h4 className="font-bold text-3xl">{t('pillar_evts', 'Events')}</h4>
                    </div>
                  </div>
                  <div className="relative h-64 rounded-[32px] overflow-hidden group shadow-lg">
                    <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=500&q=80" alt="Recruitment" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#78BE1F] via-[#78BE1F]/40 to-transparent opacity-90" />
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <UserCheck size={24} className="mb-2 opacity-80" />
                      <h4 className="font-bold text-3xl">{t('pillar_rect', 'Recruitment')}</h4>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-12 -right-4 md:right-4 text-right">
                 <div className="italic font-bold text-3xl md:text-3xl text-[#1a1a1a]/40">{t('bridge_1', 'Bridging Challenges.')}</div>
                 <div className="italic font-bold text-3xl md:text-3xl text-[#E91E8C]">{t('bridge_2', 'Building Success.')}</div>
              </div>
            </div>

          </div>
          
          <div 
            onClick={() => document.getElementById("why-partner")?.scrollIntoView({ behavior: "smooth" })}
            className="w-full flex flex-col items-center justify-center mt-12 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
          >
            <span className="uppercase tracking-[0.2em] font-bold text-sm text-[#1a1a1a]/60 mb-2">{t('explore_journey', 'Explore Our Journey')}</span>
            <ChevronDown className="animate-bounce text-[#F5841F]" size={24} />
          </div>
        </div>

        <TimelineSection />

        <div id="why-partner" className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 mb-24 md:mb-32">
          <div className="text-center mb-14 md:mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-px w-8" style={{background:GRAD_FRIEND}}/>
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{t('why_choose_us', 'Why Choose Us')}</span>
              <div className="h-px w-8" style={{background:GRAD_FRIEND}}/>
            </div>
            <h2 className="font-extrabold text-4xl md:text-5xl leading-[1.15] tracking-tight text-[#1a1a1a] mb-6">
              {t('why_partner_prefix', 'Why Partner With ')} <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(135deg, #F5841F, #E91E8C)` }}>{t('why_partner_suffix', 'Us?')}</span>
            </h2>
            <p className="text-xl md:text-2xl leading-[1.8] text-[#1a1a1a]/70 font-medium max-w-4xl mx-auto">
              {t('why_partner_sub', 'We believe every brand has a unique story, and we help you tell it through operational excellence anchored in first-hand experience.')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 mb-24 md:mb-32">
          <div className="text-center mb-14 md:mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="h-px w-8" style={{background:GRAD_FRIEND}}/>
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{t('our_principles', 'Our Principles')}</span>
              <div className="h-px w-8" style={{background:GRAD_FRIEND}}/>
            </div>
            <h2 className="font-extrabold text-4xl md:text-5xl leading-[1.15] tracking-tight text-[#1a1a1a]">
              {t('core_values_prefix', 'Our Core ')} <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(135deg, #F5841F, #E91E8C)` }}>{t('core_values_suffix', 'Values')}</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
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

        <PartnersSection />
      </div>
      <Footer />
    </div>
  );
}

function MissionPage({ go }: { go: (p: Page) => void }) {
  const { t } = useTranslate();
  const pillars = [
    { icon: Settings, title: t('c1_title', "Operational Excellence"), text: t('c1_desc', "We repair weak spots and elevate strengths through strategic planning and precise analysis."), color: "#F5841F", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop&auto=format" },
    { icon: Users, title: t('c2_title', "Human Capital Development"), text: t('c2_desc', "We build high-performing teams through expert recruitment and hands-on training for long-term stability."), color: "#E91E8C", image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop&auto=format" },
    { icon: ShieldCheck, title: t('c3_title', "Quality & Safety"), text: t('c3_desc', "We deliver world-class F&B and facility services, strictly adhering to the highest international safety and hygiene standards."), color: "#3AADE0", image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&h=600&fit=crop&auto=format" },
    { icon: Lightbulb, title: t('c4_title', "Creative Innovation"), text: t('c4_desc', "We blend concept creation with artistic execution—from menu engineering to digital marketing—to deliver memorable customer experiences."), color: "#78BE1F", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop&auto=format" },
    { icon: Handshake, title: t('c5_title', "Client-Centric Approach"), text: t('c5_desc', "We handle the complex operations and logistics so you can focus on your core business. We build long-term partnerships by understanding your unique brand story."), color: "#F5841F", image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&fit=crop&auto=format" }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF7F2] text-[#1a1a1a] relative">
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] bg-[#F5841F]/15 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] bg-[#3AADE0]/10 blur-[150px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vw] bg-[#E91E8C]/15 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      <div className="relative z-10 pb-16">
        <div className="w-full flex justify-center mb-16 px-0 mt-8">
          <div className="relative w-full overflow-hidden border-y border-white/60 group bg-white/40 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 z-10 pointer-events-none transition-opacity duration-700 group-hover:opacity-0" />
            <ImageWithFallback 
              src={missionTopImg} 
              alt="Mission and Vision" 
              className="w-full h-auto object-contain transition-transform duration-[2s] group-hover:scale-[1.02]" 
            />
          </div>
        </div>

        <div className="w-full mb-24 md:mb-32 px-4 md:px-8">
          <div className="relative w-full overflow-hidden bg-white/80 backdrop-blur-2xl p-12 md:p-24 rounded-[40px] border border-white/60 shadow-[0_25px_60px_-25px_rgba(0,0,0,0.06)] text-center">
            <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] bg-[#F5841F]/15 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-[#E91E8C]/15 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 max-w-[900px] mx-auto">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
                <span className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/50">{t('mission_tag', 'Mission')}</span>
                <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
              </div>
              <h1 className="font-extrabold text-5xl md:text-6xl leading-[1.1] tracking-tight mb-8 text-[#1a1a1a]">
                {t('mission_title_prefix', 'Our ')} <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(135deg, #F5841F, #E91E8C)` }}>{t('mission_title_suffix', 'Mission.')}</span>
              </h1>
              <p className="text-xl md:text-2xl leading-[1.8] text-[#1a1a1a]/70 font-medium">
                {t('mission_sub', 'Our mission is to bridge the gap between operational excellence and sustainable growth. We offer end-to-end, integrated solutions tailored to your unique brand.')}
              </p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 mb-16">
          <div className="text-center mb-24 md:mb-32">
            <h2 className="font-extrabold text-4xl md:text-5xl leading-[1.15] tracking-tight text-[#1a1a1a]">{t('we_are_committed', 'We are committed to:')}</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-8 md:gap-8">
            {pillars.map((p, i) => (
              <div key={p.title} className="relative group w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] bg-white/60 backdrop-blur-xl rounded-[40px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] border border-white hover:-translate-y-2 transition-transform duration-500 overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-[0.12] transition-opacity duration-500 group-hover:opacity-20">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover mix-blend-luminosity" />
                </div>
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

        <div className="w-full mb-24 px-4 md:px-8">
          <div className="relative w-full overflow-hidden bg-white/80 backdrop-blur-2xl p-12 md:p-24 rounded-[40px] border border-white/60 shadow-[0_25px_60px_-25px_rgba(0,0,0,0.06)] text-center">
            <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] bg-[#E91E8C]/15 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-[#3AADE0]/15 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 max-w-[900px] mx-auto">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
                <span className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/50">{t('vision_tag', 'Vision')}</span>
                <div className="h-px w-8 md:w-12" style={{background:GRAD_FRIEND}}/>
              </div>
              <h2 className="font-extrabold text-5xl md:text-6xl tracking-tight text-[#1a1a1a] mb-8">
                {t('vision_title_prefix', 'Our ')} <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(135deg, #3AADE0, #E91E8C)` }}>{t('vision_title_suffix', 'Vision.')}</span>
              </h2>
              <p className="text-xl md:text-2xl text-[#1a1a1a]/70 leading-[1.8] font-medium">
                {t('vision_sub', 'To become a leading force in the hospitality industry by providing services beyond expectations. We implement flawless operational and event experiences that exceed client goals and unlock every project\'s highest potential.')}
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
  const { t } = useTranslate();
  const [form, setForm] = useState({ name: "", email: "", company: "", service: "", message: "" });
  const [sent, setSent] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF7F2]">
      <div className="w-full px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_500px] gap-16 items-start">
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight text-[#1a1a1a] mb-6">{t('contact_headline', "Let's build something great.")}</h1>
            <p className="text-xl md:text-2xl text-[#1a1a1a]/70 font-medium leading-[1.8] mb-10 max-w-2xl">{t('contact_sub', "Whether you have a clear brief or just a big ambition — reach out.")}</p>
            <div className="space-y-5">
              {[{ Icon: Mail, text: "hello@harmonyclubhouse.com" }, { Icon: Phone, text: "+20 100 000 0000" }, { Icon: MapPin, text: t('contact_location', "Cairo, Egypt — 4 Continents") }].map(({ Icon, text }) => (
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
                <h2 className="font-extrabold text-4xl md:text-5xl leading-[1.15] text-[#1a1a1a] mb-3">{t('msg_received', 'Message received.')}</h2>
                <p className="text-lg text-[#1a1a1a]/60 font-medium leading-[1.7]">{t('msg_response_time', "We'll get back to you within 24 hours.")}</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-5">
                <h2 className="font-extrabold text-4xl md:text-5xl leading-[1.15] tracking-tight text-[#1a1a1a] mb-6">{t('tell_us_project', 'Tell us about your project.')}</h2>
                {[
                  { label: t('form_name_label', 'Your name'), key: "name" as const, type: "text", placeholder: t('placeholder_name', 'Ahmed Hassan'), required: true },
                  { label: t('form_email_label', 'Email address'), key: "email" as const, type: "email", placeholder: t('placeholder_email_brand', 'ahmed@brand.com'), required: true },
                  { label: t('form_company_label', 'Company / Brand'), key: "company" as const, type: "text", placeholder: t('placeholder_brand', 'Your brand name'), required: false },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#1a1a1a]/35 block mb-2">{f.label}</label>
                    <input type={f.type} required={f.required} value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.placeholder}
                      className="w-full text-base text-[#1a1a1a] bg-[#FAF7F2] border border-black/[0.08] rounded-xl px-4 py-3 outline-none focus:border-black/25 transition-colors placeholder:text-[#1a1a1a]/20" />
                  </div>
                ))}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#1a1a1a]/35 block mb-2">{t('form_area_interest', 'Area of interest')}</label>
                  <div className="relative">
                    <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}
                      className="w-full text-base text-[#1a1a1a] bg-[#FAF7F2] border border-black/[0.08] rounded-xl px-4 py-3 outline-none focus:border-black/25 transition-colors appearance-none cursor-pointer">
                      <option value="">{t('select_service', 'Select a service')}</option>
                      {[t('s_dev', "Business Developement"), t('s_events', "Events & Catering"), t('s_mktg', "Marketing"), t('s_rec', "Recruitment & Training"), t('s_unsure', "Not sure yet")].map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#1a1a1a]/35 block mb-2">{t('form_msg_label', 'Your message')}</label>
                  <textarea required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder={t('placeholder_goals', 'Tell us about your goals...')}
                    className="w-full text-base text-[#1a1a1a] bg-[#FAF7F2] border border-black/[0.08] rounded-xl px-4 py-3 outline-none focus:border-black/25 transition-colors resize-none placeholder:text-[#1a1a1a]/20" />
                </div>
                <button type="submit"
                  className="w-full text-lg font-bold text-white py-4 rounded-full flex items-center justify-center gap-2 hover:opacity-90 transition-all duration-200 group"
                  style={{ background: `linear-gradient(135deg, ${C_ORANGE}, ${C_PINK})` }}>
                  {t('send_message_btn', 'Send Message')} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
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

// --- Root App ------------------------


const FOOTER_SOCIAL_ICONS = [
  { Icon: Instagram, label: "Instagram", color: C_PINK },
  { Icon: Facebook, label: "Facebook", color: C_BLUE },
  { Icon: Linkedin, label: "LinkedIn", color: C_BLUE },
  { Icon: Twitter, label: "Twitter / X", color: C_BLUE },
  { Icon: Youtube, label: "YouTube", color: C_ORANGE },
];

const FOOTER_SERVICES = [
  { id: "management", color: "#F5841F", label: "Management", features: ["Pre-opening planning & setup", "Operations audit & restructuring", "Menu engineering", "P&L optimization"] },
  { id: "events", color: "#E91E8C", label: "Events & Catering", features: ["Venue scouting & negotiation", "Bespoke catering design", "AV & decor coordination", "Guest management"] },
  { id: "marketing", color: "#3AADE0", label: "Marketing", features: ["Brand identity & positioning", "Social media strategy", "Influencer & PR campaigns", "Photography direction"] },
  { id: "recruitment", color: "#78BE1F", label: "Recruitment", features: ["Executive placement", "Chef & culinary sourcing", "FOH & BOH recruitment", "Event & seasonal staffing"] }
];

function Footer() {
  const { t } = useTranslate();
  const [hiddenServices, setHiddenServices] = useState<string[]>([]);
  
  const FOOTER_SERVICES = [
    { id: "management", color: "#F5841F", label: t('footer_mgmt', "Management"), features: [t('f1', "Pre-opening planning & setup"), t('f2', "Operations audit & restructuring"), t('f3', "Menu engineering"), t('f4', "P&L optimization")] },
    { id: "events", color: "#E91E8C", label: t('footer_events', "Events & Catering"), features: [t('f5', "Venue scouting & negotiation"), t('f6', "Bespoke catering design"), t('f7', "AV & décor coordination"), t('f8', "Guest management")] },
    { id: "marketing", color: "#3AADE0", label: t('footer_mktg', "Marketing"), features: [t('f9', "Brand identity & positioning"), t('f10', "Social media strategy"), t('f11', "Influencer & PR campaigns"), t('f12', "Photography direction")] },
    { id: "recruitment", color: "#78BE1F", label: t('footer_rect', "Recruitment"), features: [t('f13', "Executive placement"), t('f14', "Chef & culinary sourcing"), t('f15', "FOH & BOH recruitment"), t('f16', "Event & seasonal staffing")] }
  ];

  useEffect(() => {
    api.get<{ hidden: string[] }>("/catalog/hidden")
      .then(d => setHiddenServices(d.hidden || []))
      .catch(() => {});
  }, []);

  return (
    <footer className="relative bg-[#FAF7F2] border-t border-gray-100 w-full overflow-hidden shrink-0">
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[5%] w-[50vw] h-[50vw] bg-[#F5841F]/10 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-10%] right-[10%] w-[40vw] h-[40vw] bg-[#3AADE0]/10 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute top-[20%] left-[40%] w-[40vw] h-[40vw] bg-[#E91E8C]/10 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      <div className="relative z-10">
        <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #F5841F, #E91E8C, #3AADE0, #78BE1F)' }} />
        
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-16">
          <div className="grid md:grid-cols-5 gap-12 mb-16">
            <div className="md:col-span-2">
              <div className="flex items-center gap-8 mb-6">
                <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-white border border-gray-100 p-1.5 shadow-sm">
                  <img src="/imports/friend-logo.png" alt="HCH" className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="font-extrabold text-[#1a1a1a] text-lg tracking-tight leading-none mb-1.5">HARMONY CLUB HOUSE</div>
                  <div className="text-xs text-[#1a1a1a]/40 font-bold uppercase tracking-wider">{t('footer_est', 'Est. 2012 · Cairo, Egypt')}</div>
                </div>
              </div>
              <p className="text-lg text-[#1a1a1a]/60 font-medium leading-[1.8] max-w-[320px]">
                {t('footer_desc', 'Premier F&B development and hospitality consultancy with over 13 years of international excellence.')}
              </p>
            </div>
            
            {FOOTER_SERVICES.filter(s => !hiddenServices.includes(s.id)).map(s => (
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
              <span>{t('footer_rights', '© 2026 Harmony Club House. All rights reserved.')}</span>
              <div className="flex gap-8">
                {FOOTER_SOCIAL_ICONS.map(({ Icon, label, color }) => (
                  <a
                    key={label}
                    href={`https://${label.toLowerCase().replace(/[^a-z]/g, '')}.com/harmonyclubhouse`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="w-10 h-10 rounded-full bg-white/50 backdrop-blur-sm shadow-sm border border-black/5 flex items-center justify-center text-[#1a1a1a]/40 transition-all duration-300 hover:scale-110 hover:bg-white hover:shadow-md"
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = color; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = ""; }}
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
            <div className="flex gap-8">
              {[t('footer_privacy', 'Privacy'), t('footer_terms', 'Terms'), t('footer_cookies', 'Cookies')].map(l => (
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
const isServicePage = (p: Page | string): p is ServiceId =>
  ["business", "events", "marketing", "recruitment", "technology"].includes(p as string);

const isCatalogPage = (p: Page): p is `catalog:${number}` => /^catalog:\d+$/.test(p);

/** Full-screen status message, used while the session is being resolved. */
function SessionNotice({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex items-center justify-center bg-[#FAF7F2]">
      <p className="text-lg font-bold text-[#1a1a1a]/50">{children}</p>
    </div>
  );
}

/**
 * The dashboard is only rendered for a signed-in ADMIN. Anyone else is sent to
 * the sign-in page. The server enforces this too — every /api/admin route sits
 * behind the JWT cookie — so this guard is about UX, not about being the lock.
 */
function AdminRoute() {
  const { t } = useTranslate();
  const { user, loading } = useAuth();
  const router = useRouter();
  const allowed = isStaffRole(user?.role);

  useEffect(() => {
    if (!loading && !allowed) router.replace(pageToPath("login"));
  }, [loading, allowed, router]);

  if (loading) return <SessionNotice>{t('checking_session', 'Checking your session…')}</SessionNotice>;
  if (!allowed) return <SessionNotice>{t('taking_to_signin', 'Taking you to sign in…')}</SessionNotice>;
  return <AdminDashboard />;
}

function CompanyRoute() {
  const { t } = useTranslate();
  const { user, loading } = useAuth();
  const router = useRouter();
  const allowed = user?.role === "COMPANY";

  useEffect(() => {
    if (!loading && !allowed) router.replace(pageToPath("login"));
  }, [loading, allowed, router]);

  if (loading) return <SessionNotice>{t('checking_session', 'Checking your session…')}</SessionNotice>;
  if (!allowed) return <SessionNotice>{t('taking_to_signin', 'Taking you to sign in…')}</SessionNotice>;
  return <CompanyDashboard />;
}

export default function App() {
  const router = useRouter();
  const pathname = usePathname();
  const [catalogServices, setCatalogServices] = useState<CatalogService[]>([]);

  // The URL is the source of truth, so Back/Forward and refresh all work.
  const page = pathToPage(pathname);
  const [hiddenServices, setHiddenServices] = useState<string[]>([]);
  const [customServices, setCustomServices] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchCatalog = () => {
      Promise.all([
        api.get<{ hidden: string[] }>("/catalog/hidden").catch(() => ({ hidden: [] })),
        api.get<{ services: any[] }>("/catalog").catch(() => ({ services: [] }))
      ]).then(([hiddenRes, catalogRes]) => {
        setHiddenServices(hiddenRes.hidden || []);
        
        const titleMap: Record<string, string> = {
          "Business Development": "business",
          "Events": "events",
          "Marketing": "marketing",
          "Recruitment & Training": "recruitment",
          "Technology": "technology"
        };

        const custom = (catalogRes.services || []).filter(s => !titleMap[s.title]);
        setCustomServices(custom);
      });
    };

    fetchCatalog();
    window.addEventListener("catalogChanged", fetchCatalog);
    return () => window.removeEventListener("catalogChanged", fetchCatalog);
  }, []);

  const go = (p: Page) => router.push(pageToPath(p));

  const fetchCatalog = () => {
    api
      .get<{ services: CatalogService[] }>("/catalog")
      .then((d) => {
        setDynamicServicesCatalog(d.services);
        setCatalogServices(d.services);
      })
      .catch(() => {
        setCatalogServices([]);
      });
  };

  useEffect(() => { fetchCatalog(); }, []);

  // Active DB services — single source of truth for public service pages
  const activeCatalogServices = catalogServices.filter((s) => s.isActive);

  const dbServiceForPage =
  isServicePage(page)
    ? activeCatalogServices.find(
        (s) => s.title.toLowerCase() === SERVICE_BY_ID[page].label.toLowerCase()
      )
    : null;

  const resolvedService = isServicePage(page)
    ? (dbServiceForPage ? findService(dbServiceForPage.id) : null)
    : isCatalogPage(page)
    ? (() => {
        const s = catalogServices.find((s) => s.id === Number(page.slice("catalog:".length)));
        return s && s.isActive ? findService(s.id) : null;
      })()
    : null;

  const openCatalogBooking = (service: CatalogService) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "bookingCatalogService",
        JSON.stringify({
          id: service.id,
          title: service.title,
          subservices: service.subservices.filter((s) => s.isActive).map((s) => s.title),
        })
      );
    }
    go("booking");
  };

  return (
    <>
      {page === "home" && (
        <div className="flex-1 overflow-y-auto bg-[#FAF7F2]">
          <div className="min-h-screen pt-24 pb-16 px-6 relative flex flex-col justify-center items-center">
            <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <div className="absolute top-[20%] left-[10%] w-[40vw] h-[40vw] bg-[#E91E8C]/15 blur-[120px] rounded-full mix-blend-multiply" />
              <div className="absolute bottom-[10%] right-[10%] w-[50vw] h-[50vw] bg-[#F5841F]/15 blur-[150px] rounded-full mix-blend-multiply" />
            </div>
            <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
              <div className="mb-10 text-center w-full max-w-2xl">
                <img src={welcomeImg} alt="Welcome to Harmony" className="w-full h-auto drop-shadow-2xl hover:scale-105 transition-transform duration-700" />
              </div>
              <HeroCircle go={go} hidden={hiddenServices} />
            </div>
          </div>
        </div>
      )}
      {page === "services" && (
        <ServicesOverview
          onOpen={(pageKey) => go(pageKey as Page)}
          catalogServices={activeCatalogServices.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))}
          onBook={() => go("booking")}
        />
      )}
      {isServicePage(page) && (
        resolvedService ? (
          <SectorPage
            key={page}
            service={resolvedService as any}
            onBook={() => go("booking")}
            story={page === "marketing" ? <MarketingStory /> : undefined}
          />
        ) : (
          <SessionNotice>Service not found.</SessionNotice>
        )
      )}
      {isCatalogPage(page) && (
        resolvedService ? (
          <SectorPage
            key={page}
            service={resolvedService as any}
            onBook={() => go("booking")}
          />
        ) : (
          <SessionNotice>Service not found.</SessionNotice>
        )
      )}
      {page === "booking" && (
        <BookingPage onBrowse={() => go("services")} onSignIn={() => go("login")} />
      )}
      {page === "stories" && <StoriesPage go={go} />}
      {page === "about" && <AboutPage go={go} />}
      {page === "mission" && <MissionPage go={go} />}
      {page === "login" && <LoginPage go={go} />}
      {page === "contact" && <ContactPage />}
      {page === "admin" && <AdminRoute />}
      {page === "dashboard" && <CompanyRoute />}
    </>
  );
}