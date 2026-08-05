"use client";

import React, { useState } from "react";
import {
  LayoutDashboard, Building2, Settings, Users, Calendar, AlertCircle, TrendingUp,
  ShieldCheck, Power, Briefcase, MessageSquare, CheckCircle2, MapPin, Phone, Mail,
  Search, Plus, LogOut, ClipboardList, ArrowRight, Star, Target,
  Receipt, KanbanSquare, FileText, SlidersHorizontal, LifeBuoy, Clock, MoreHorizontal, Trash2, X, Wallet
} from "lucide-react";

const C_ORANGE = "#F5841F";
const C_PINK = "#E91E8C";
const C_BLUE = "#3AADE0";
const C_GREEN = "#78BE1F";
const GRAD = `linear-gradient(90deg, ${C_ORANGE}, ${C_PINK}, ${C_BLUE}, ${C_GREEN})`;

type Tab = "overview" | "revenue" | "billing" | "payroll" | "projects" | "documents" | "companies" | "services" | "crm" | "inquiries" | "calendar" | "hiring" | "settings";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [role, setRole] = useState<"ADMIN" | "SUPER_ADMIN">("SUPER_ADMIN");

  return (
    <div className="flex h-screen bg-[#FAF7F2] overflow-hidden relative w-full z-50">
      
      {/* Ambient Glows (Preserved exactly as requested) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[20%] w-[40vw] h-[40vw] bg-[#F5841F]/10 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-10%] right-[10%] w-[50vw] h-[50vw] bg-[#3AADE0]/5 blur-[150px] rounded-full mix-blend-multiply" />
      </div>

      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white/70 backdrop-blur-3xl border-r border-white/60 shadow-[10px_0_30px_-15px_rgba(0,0,0,0.05)] flex flex-col z-20 flex-shrink-0 relative">
        <div className="p-6 pb-4 border-b border-white/40 flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#F5841F] to-[#E91E8C] flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-gray-900 leading-tight">Admin Portal</h2>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}</p>
            </div>
          </div>
          <button 
            onClick={() => setRole(r => r === "SUPER_ADMIN" ? "ADMIN" : "SUPER_ADMIN")}
            className="text-xs font-bold bg-black/5 text-gray-600 rounded-full px-2 py-1 hover:bg-black/10 transition whitespace-nowrap"
          >
            Toggle Role
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <span className="block text-xs font-black text-gray-400 uppercase tracking-widest px-4 mb-2 mt-2">Core</span>
          <NavItem icon={LayoutDashboard} label="Overview" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} color={C_ORANGE} />
          
          <span className="block text-xs font-black text-gray-400 uppercase tracking-widest px-4 mb-2 mt-6">Operations</span>
          <NavItem icon={KanbanSquare} label="Projects" active={activeTab === "projects"} onClick={() => setActiveTab("projects")} color={C_PINK} />
          <NavItem icon={LifeBuoy} label="Tickets (SLAs)" active={activeTab === "inquiries"} onClick={() => setActiveTab("inquiries")} color={C_ORANGE} />
          <NavItem icon={Calendar} label="Calendar" active={activeTab === "calendar"} onClick={() => setActiveTab("calendar")} color={C_BLUE} />
          
          <span className="block text-xs font-black text-gray-400 uppercase tracking-widest px-4 mb-2 mt-6">Client Data</span>
          <NavItem icon={Users} label="CRM" active={activeTab === "crm"} onClick={() => setActiveTab("crm")} color={C_GREEN} />
          <NavItem icon={Building2} label="Companies" active={activeTab === "companies"} onClick={() => setActiveTab("companies")} color={C_BLUE} />
          <NavItem icon={FileText} label="Documents" active={activeTab === "documents"} onClick={() => setActiveTab("documents")} color={C_PINK} />
          
          <span className="block text-xs font-black text-gray-400 uppercase tracking-widest px-4 mb-2 mt-6">Financials</span>
          {role === "SUPER_ADMIN" ? (
            <>
              <NavItem icon={TrendingUp} label="Revenue & ROI" active={activeTab === "revenue"} onClick={() => setActiveTab("revenue")} color={C_GREEN} />
              <NavItem icon={Receipt} label="Billing" active={activeTab === "billing"} onClick={() => setActiveTab("billing")} color={C_ORANGE} />
              <NavItem icon={Wallet} label="Payroll" active={activeTab === "payroll"} onClick={() => setActiveTab("payroll")} color={C_PINK} />
            </>
          ) : (
            <div className="px-4 py-2 text-xs text-gray-400 font-bold italic">Restricted</div>
          )}
          
          <span className="block text-xs font-black text-gray-400 uppercase tracking-widest px-4 mb-2 mt-6">System</span>
          <NavItem icon={Settings} label="Services Setup" active={activeTab === "services"} onClick={() => setActiveTab("services")} color={C_PINK} />
          <NavItem icon={Briefcase} label="Hiring" active={activeTab === "hiring"} onClick={() => setActiveTab("hiring")} color={C_PINK} />
          {role === "SUPER_ADMIN" && (
            <NavItem icon={SlidersHorizontal} label="Access Config" active={activeTab === "settings"} onClick={() => setActiveTab("settings")} color={C_BLUE} />
          )}
        </nav>

        <div className="p-4 border-t border-white/40">
          <button onClick={() => window.location.reload()} className="flex items-center w-full px-4 py-3 text-sm font-bold text-red-600 rounded-xl hover:bg-red-50 transition-all">
            <LogOut className="w-4 h-4 mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Flow */}
      <main className="relative z-10 flex-1 p-8 lg:p-12 pb-32 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {activeTab === "overview" && <OverviewTab setActiveTab={setActiveTab} />}
          {activeTab === "revenue" && (role === "SUPER_ADMIN" ? <RevenueTab /> : <AccessDenied />)}
          {activeTab === "billing" && (role === "SUPER_ADMIN" ? <BillingTab /> : <AccessDenied />)}
          {activeTab === "projects" && <ProjectsTab />}
          {activeTab === "documents" && <DocumentsTab />}
          {activeTab === "companies" && <CompaniesTab />}
          {activeTab === "services" && <ServicesTab />}
          {activeTab === "crm" && <CRMTab />}
          {activeTab === "inquiries" && <InquiriesTab />}
          {activeTab === "calendar" && <CalendarTab />}
          {activeTab === "hiring" && <HiringTab />}
          {activeTab === "payroll" && (role === "SUPER_ADMIN" ? <PayrollTab /> : <AccessDenied />)}
          {activeTab === "settings" && (role === "SUPER_ADMIN" ? <SettingsTab /> : <AccessDenied />)}
        </div>
      </main>
    </div>
  );
}

// ─── Sub-Components ──────────────────────────────────────────────────────────

function NavItem({ icon: Icon, label, active, onClick, color }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full px-4 py-3 rounded-xl transition-all duration-300 font-bold text-sm flex items-center gap-3 ${
        active 
          ? "bg-white text-gray-900 shadow-md border border-gray-100 scale-[1.02]" 
          : "text-gray-500 hover:text-gray-900 hover:bg-white/50"
      }`}
    >
      <Icon className={`w-4 h-4 transition-colors ${active ? '' : 'opacity-70'}`} style={{ color: active ? color : "inherit" }} />
      <span>{label}</span>
    </button>
  );
}

// 1. General Dashboard (Asymmetric Layout)
function OverviewTab({ setActiveTab }: any) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
          Good Morning, <br/><span className="text-transparent bg-clip-text" style={{backgroundImage: GRAD}}>Harmony Admin</span>
        </h1>
        <p className="text-gray-500 mt-3 text-lg">Here is what's happening across the ecosystem today.</p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Column (Main Stats & Activity Flowing together) */}
        <div className="flex-1 space-y-8">
          <div className="flex flex-wrap gap-8">
            <StatPill title="Total Revenue" value="$1.2M" color={C_GREEN} onClick={() => setActiveTab("revenue")} />
            <StatPill title="Active Companies" value="48" color={C_BLUE} onClick={() => setActiveTab("companies")} />
            <StatPill title="Pending Verifications" value="12" color={C_ORANGE} onClick={() => setActiveTab("crm")} />
            <StatPill title="Avg Resolution Time" value="2.4 hrs" color={C_PINK} onClick={() => setActiveTab("inquiries")} />
          </div>

          <div className="bg-white/60 backdrop-blur-2xl rounded-[3rem] p-8 md:p-10 border border-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
            <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
              <TrendingUp className="text-[#F5841F]"/> Recent Activity
            </h3>
            <div className="space-y-8 relative before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-gradient-to-b before:from-[#F5841F] before:to-[#E91E8C] before:opacity-20">
              <div className="relative pl-10">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-[3px] border-[#F5841F] shadow-md z-10" />
                <p className="text-base font-bold text-gray-900">Kempinski Hotel requested "Menu Engineering"</p>
                <p className="text-sm text-gray-500 mt-1">Service brief automatically forwarded to the kitchen staff.</p>
                <span className="inline-block mt-2 text-xs font-bold text-[#F5841F] bg-[#F5841F]/10 px-2 py-1 rounded-md">2 hours ago</span>
              </div>
              <div className="relative pl-10">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-[3px] border-[#E91E8C] shadow-md z-10" />
                <p className="text-base font-bold text-gray-900">New Client Onboarding: The Ritz</p>
                <p className="text-sm text-gray-500 mt-1">Contract generated and sent for electronic signature.</p>
                <span className="inline-block mt-2 text-xs font-bold text-[#E91E8C] bg-[#E91E8C]/10 px-2 py-1 rounded-md">5 hours ago</span>
              </div>
              <div className="relative pl-10">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-[3px] border-[#3AADE0] shadow-md z-10" />
                <p className="text-base font-bold text-gray-900">Recruitment Campaign Launched</p>
                <p className="text-sm text-gray-500 mt-1">Hiring brief posted to LinkedIn and Indeed automatically.</p>
                <span className="inline-block mt-2 text-xs font-bold text-[#3AADE0] bg-[#3AADE0]/10 px-2 py-1 rounded-md">Yesterday</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Floating Status Card) */}
        <div className="w-full lg:w-[400px]">
          <div className="bg-[#F5841F]/10 rounded-[3rem] p-10 text-gray-900 border border-[#F5841F]/20 transform rotate-1 hover:rotate-0 transition-transform duration-500">
            <div className="w-16 h-16 bg-[#F5841F]/20 rounded-2xl flex items-center justify-center mb-8 border border-[#F5841F]/30">
              <ShieldCheck className="w-8 h-8 text-[#F5841F]" />
            </div>
            <h3 className="text-3xl font-black mb-3 leading-tight text-gray-900">System<br/>Operational</h3>
            <p className="text-gray-600 font-medium mb-10 text-lg">Your digital storefront is actively accepting new business.</p>
            
            <div className="space-y-8">
              <div className="flex justify-between items-center bg-white/60 border border-[#F5841F]/20 p-4 rounded-2xl">
                <span className="font-bold text-gray-700">Client Booking Engine</span>
                <span className="flex items-center gap-1.5 bg-[#78BE1F]/10 text-[#78BE1F] px-3 py-1 rounded-full text-sm font-black"><CheckCircle2 className="w-4 h-4"/> Online</span>
              </div>
              <div className="flex justify-between items-center bg-white/60 border border-[#F5841F]/20 p-4 rounded-2xl">
                <span className="font-bold text-gray-700">Lead Capture Forms</span>
                <span className="flex items-center gap-1.5 bg-[#78BE1F]/10 text-[#78BE1F] px-3 py-1 rounded-full text-sm font-black"><CheckCircle2 className="w-4 h-4"/> Online</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function StatPill({ title, value, color, onClick }: any) {
  return (
    <button onClick={onClick} className="text-left bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 border border-white shadow-xl shadow-black/5 flex-1 min-w-[200px] hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 cursor-pointer group">
      <h3 className="text-gray-500 font-bold text-sm mb-2 group-hover:text-gray-900 transition-colors">{title}</h3>
      <p className="text-4xl font-black text-gray-900" style={{ color }}>{value}</p>
    </button>
  );
}

// 2. Companies (Business Card Style)
function CompaniesTab() {
  const [companies, setCompanies] = useState([
    { id: 1, name: "Baron Hotels & Resorts", status: "Active", contact: "Amr Hassan", color: C_ORANGE },
    { id: 2, name: "Kempinski", status: "Active", contact: "Yasmine Mostafa", color: C_PINK },
    { id: 3, name: "Marriott", status: "Active", contact: "Tarek El-Din", color: C_BLUE },
    { id: 4, name: "Dunkin'", status: "Active", contact: "Sarah Jenkins", color: C_GREEN },
    { id: 5, name: "Hardee's", status: "Active", contact: "David Chen", color: C_ORANGE },
    { id: 6, name: "Krispy Kreme", status: "Active", contact: "Elena Rodriguez", color: C_PINK },
    { id: 7, name: "Mori Sushi", status: "Inactive", contact: "Michael Scott", color: C_BLUE },
    { id: 8, name: "Tamara", status: "Active", contact: "Jim Halpert", color: C_GREEN },
    { id: 9, name: "Grand Cafe", status: "Active", contact: "Pam Beesly", color: C_ORANGE },
    { id: 10, name: "Butcher's Burger", status: "Inactive", contact: "Dwight Schrute", color: C_PINK },
    { id: 11, name: "TBS", status: "Active", contact: "Stanley Hudson", color: C_BLUE },
    { id: 12, name: "Vodafone", status: "Active", contact: "Phyllis Vance", color: C_GREEN },
    { id: 13, name: "BLOM Bank", status: "Active", contact: "Angela Martin", color: C_ORANGE },
    { id: 14, name: "GUC Cairo", status: "Inactive", contact: "Kevin Malone", color: C_PINK },
  ]);

  const toggle = (id: number) => {
    setCompanies(companies.map(c => c.id === id ? { ...c, status: c.status === "Active" ? "Inactive" : "Active" } : c));
  };

  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Ecosystem Partners</h1>
          <p className="text-gray-500 mt-2 text-lg">Manage integrations and operational status.</p>
        </div>
        <button className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3.5 rounded-full font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
          <Plus className="w-5 h-5"/> Add Partner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {companies.map(c => (
          <div key={c.id} className="relative bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-[0_15px_35px_-10px_rgba(0,0,0,0.06)] group hover:bg-white transition-all">
            <div className={`absolute top-0 right-8 w-16 h-2 rounded-b-full`} style={{ backgroundColor: c.color }} />
            
            <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-6 shadow-inner">
              <Building2 className="w-8 h-8" style={{ color: c.color }} />
            </div>
            
            <h3 className="text-2xl font-black text-gray-900 mb-1">{c.name}</h3>
            <p className="text-gray-500 font-medium flex items-center gap-2 mb-8"><Users className="w-4 h-4"/> {c.contact}</p>
            
            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${c.status === 'Active' ? 'bg-[#78BE1F]/10 text-[#78BE1F]' : 'bg-red-100 text-red-600'}`}>
                {c.status}
              </span>
              <button 
                onClick={() => toggle(c.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${c.status === 'Active' ? 'bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-600' : 'bg-gray-900 text-white hover:scale-105'}`}
              >
                <Power className="w-4 h-4" />
                {c.status === "Active" ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 3. Services (Flowing Blocks)
function ServicesTab() {
  return (
    <div className="animate-in fade-in duration-700 w-full">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Service Architect</h1>
        <p className="text-gray-500 mt-4 text-lg max-w-2xl mx-auto">Design and automate the offerings presented in the front-end intake forms.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Add Service Block (Organic Shape) */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white/80 backdrop-blur-2xl p-8 rounded-[3rem] border border-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] sticky top-32">
            <div className="w-14 h-14 bg-[#E91E8C]/10 rounded-full flex items-center justify-center mb-6">
              <Plus className="w-6 h-6 text-[#E91E8C]"/>
            </div>
            <h3 className="font-black text-2xl text-gray-900 mb-6">Create Offering</h3>
            
            <div className="space-y-5">
              <div>
                <input type="text" className="w-full bg-gray-50/50 border-b-2 border-gray-200 px-2 py-3 text-lg font-bold text-gray-900 focus:outline-none focus:border-[#E91E8C] transition-colors placeholder-gray-400 bg-transparent" placeholder="Name of Service" />
              </div>
              <div>
                <select className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-4 text-gray-600 font-bold focus:outline-none focus:ring-2 focus:ring-[#E91E8C]/20 appearance-none">
                  <option>Select Category...</option>
                  <option>Marketing</option>
                  <option>Events</option>
                  <option>Management</option>
                </select>
              </div>
              <label className="flex items-center gap-3 p-4 bg-[#3AADE0]/5 rounded-2xl cursor-pointer hover:bg-[#3AADE0]/10 transition-colors">
                <input type="checkbox" className="w-5 h-5 rounded text-[#3AADE0] border-gray-300" defaultChecked />
                <span className="text-sm font-bold text-[#3AADE0]">Enable Automation (***)</span>
              </label>
              <button className="w-full py-4 rounded-full font-black text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all text-lg mt-4" style={{background:GRAD}}>
                Publish
              </button>
            </div>
          </div>
        </div>

        {/* Existing Services List */}
        <div className="flex-1 space-y-8 pt-4">
          <h3 className="text-xl font-bold text-gray-400 uppercase tracking-widest pl-4">Active Offerings</h3>
          {["Venue Scouting & Negotiation", "Executive Placement", "Menu Engineering"].map((srv, i) => (
            <div key={i} className="bg-white/60 backdrop-blur-xl p-6 rounded-[2rem] border border-white shadow-lg shadow-black/5 flex items-center justify-between hover:bg-white transition-colors group">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-gray-900 transition-colors">
                  <Star className="w-5 h-5"/>
                </div>
                <div>
                  <h3 className="font-black text-xl text-gray-900 mb-1">{srv}</h3>
                  <span className="text-xs font-bold text-[#F5841F] uppercase tracking-wider">Automated Workflow ***</span>
                </div>
              </div>
              <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all">
                <Settings className="w-5 h-5"/>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 4. CRM (Editorial Brief Layout)
function CRMTab() {
  return (
    <div className="animate-in fade-in duration-700 max-w-4xl mx-auto">
      <div className="mb-12 flex justify-between items-center bg-white/50 backdrop-blur-xl p-4 rounded-full border border-white shadow-sm">
        <h1 className="text-2xl font-black text-gray-900 pl-4 tracking-tight">Active Verifications</h1>
        <div className="relative w-64">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search records..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-full text-sm font-bold focus:outline-none focus:ring-2 focus:ring-gray-200 shadow-inner" />
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-2xl rounded-[3rem] border border-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)] p-8 md:p-12 relative overflow-hidden">
        {/* Decorative corner */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#78BE1F]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Profile */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#78BE1F] to-[#3AADE0] p-1 shadow-lg">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-2xl font-black text-gray-900">AM</div>
            </div>
            <div>
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">Ahmed Mahmoud</h2>
              <div className="flex flex-wrap gap-8 mt-2">
                <span className="flex items-center text-sm text-gray-500 font-bold gap-2"><Phone className="w-4 h-4 text-[#78BE1F]"/> +20 100 123 4567</span>
                <span className="flex items-center text-sm text-gray-500 font-bold gap-2"><Mail className="w-4 h-4 text-[#3AADE0]"/> ahmed@example.com</span>
              </div>
            </div>
          </div>
          <button className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#F5841F] text-white px-8 py-4 rounded-full font-black text-lg shadow-xl shadow-[#F5841F]/30 hover:scale-105 transition-transform">
            <Phone className="w-5 h-5" />
            Verify Details
          </button>
        </div>

        {/* Content Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
          
          <div className="space-y-10">
            <div>
              <h4 className="font-extrabold text-sm uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                <MapPin className="w-4 h-4"/> Logistics Profile
              </h4>
              <div className="space-y-8">
                <div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Exact Location</p>
                  <p className="text-2xl font-black text-[#3AADE0]">Fifth Settlement</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Event Blueprint</p>
                  <p className="text-xl font-bold text-gray-900">Corporate Gala Dinner</p>
                </div>
                <div className="flex gap-8">
                  <div className="bg-yellow-50 px-4 py-3 rounded-2xl border border-yellow-100">
                    <p className="text-xs font-bold text-yellow-600 uppercase tracking-widest mb-1">Venue</p>
                    <p className="font-black text-yellow-900">Needs Sourcing</p>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 rounded-2xl border border-gray-100">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Capacity</p>
                    <p className="font-black text-gray-900">~250 Pax</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-extrabold text-sm uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
              <ClipboardList className="w-4 h-4"/> Intake Ledger
            </h4>
            <div className="relative border-l-2 border-gray-100 pl-6 space-y-8">
              {[
                { section: "Events", item: "Venue Scouting & Negotiation", color: C_PINK },
                { section: "Events", item: "Bespoke Catering Design", color: C_PINK },
                { section: "Marketing", item: "Photography Direction", color: C_BLUE },
                { section: "Recruitment", item: "Event & Seasonal Staffing", color: C_GREEN }
              ].map((entry, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-4 border-white shadow-sm" style={{ backgroundColor: entry.color }} />
                  <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: entry.color }}>{entry.section}</p>
                  <p className="text-lg font-bold text-gray-900">{entry.item}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// 5. Support Ticketing System (SLAs)
function InquiriesTab() {
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  const tickets = [
    { id: "TK-092", client: "Kempinski", title: "Urgent: Head Chef candidate backed out", sla: "30 mins left", status: "Critical", color: "#EF4444" },
    { id: "TK-091", client: "Marriott", title: "Monthly analytics report missing", sla: "2 hrs left", status: "Open", color: C_ORANGE },
    { id: "TK-089", client: "Baron Hotels & Resorts", title: "Update menu design assets", sla: "1 day left", status: "In Progress", color: C_BLUE },
    { id: "TK-088", client: "Mori Sushi", title: "Wine supplier delivery delay", sla: "2 days left", status: "In Progress", color: C_PINK },
    { id: "TK-087", client: "Vodafone", title: "Billing discrepancy for Q2 retainer", sla: "3 days left", status: "Open", color: C_GREEN },
    { id: "TK-086", client: "Grand Cafe", title: "Typo on final cafe menu draft", sla: "4 days left", status: "Open", color: C_ORANGE },
    { id: "TK-085", client: "BLOM Bank", title: "Catering tasting schedule conflict", sla: "1 week left", status: "In Progress", color: C_BLUE },
    { id: "TK-084", client: "TBS", title: "Requesting 5 additional wait staff", sla: "2 weeks left", status: "Open", color: C_GREEN },
  ];

  return (
    <div className="animate-in fade-in duration-700 h-full flex flex-col">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Support <span className="text-transparent bg-clip-text" style={{backgroundImage: GRAD}}>Tickets</span></h1>
          <p className="text-gray-500 mt-3 text-lg">Manage SLAs and client escalations.</p>
        </div>
        <button className="bg-gray-900 text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform shadow-xl shadow-black/10">
          + New Ticket
        </button>
      </div>

      <div className="flex gap-8 mb-8 overflow-x-auto pb-2">
        <div className="bg-white/80 backdrop-blur-xl border border-white p-5 rounded-2xl min-w-[200px] shadow-sm flex-1">
          <p className="text-gray-400 font-bold text-sm uppercase tracking-wider mb-1">Avg Resolution</p>
          <p className="text-3xl font-black text-gray-900">1.4 hrs</p>
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-white p-5 rounded-2xl min-w-[200px] shadow-sm flex-1">
          <p className="text-gray-400 font-bold text-sm uppercase tracking-wider mb-1">Active Tickets</p>
          <p className="text-3xl font-black text-[#3AADE0]">14</p>
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-white p-5 rounded-2xl min-w-[200px] shadow-sm flex-1">
          <p className="text-gray-400 font-bold text-sm uppercase tracking-wider mb-1">SLA Breach Risk</p>
          <p className="text-3xl font-black text-red-500">1</p>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-3xl rounded-[3rem] border border-white shadow-xl shadow-black/5 overflow-hidden flex-1">
        <div className="grid grid-cols-12 gap-8 p-6 border-b border-gray-100 bg-gray-50/50 text-xs font-black text-gray-400 uppercase tracking-widest">
          <div className="col-span-2">Ticket ID</div>
          <div className="col-span-3">Client</div>
          <div className="col-span-4">Issue</div>
          <div className="col-span-2">SLA Timer</div>
          <div className="col-span-1 text-right">Action</div>
        </div>
        <div className="divide-y divide-gray-100/50">
          {tickets.map((t, i) => (
            <div key={i} className="grid grid-cols-12 gap-8 p-6 items-center hover:bg-white transition-colors group cursor-default">
              <div className="col-span-2 font-bold text-gray-500">{t.id}</div>
              <div className="col-span-3 font-bold text-gray-900 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{backgroundColor: t.color}}></div>
                {t.client}
              </div>
              <div className="col-span-4 font-bold text-gray-700">{t.title}</div>
              <div className="col-span-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${t.status === 'Critical' ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-600'}`}>
                  {t.sla}
                </span>
              </div>
              <div className="col-span-1 text-right">
                <button onClick={() => setSelectedTicket(t)} className="text-gray-400 hover:text-gray-900 transition-colors">
                  <ArrowRight className="w-5 h-5 inline" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setSelectedTicket(null)}></div>
          <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl relative z-10 flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h3 className="font-black text-xl text-gray-900">{selectedTicket.client}</h3>
                <p className="text-sm font-bold text-gray-500">{selectedTicket.title}</p>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors shadow-sm">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50/30">
              <div className="flex gap-8">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#EF4444] to-[#F87171] flex-shrink-0 flex items-center justify-center text-white font-bold text-sm">C</div>
                <div className="bg-white border border-gray-100 p-5 rounded-2xl rounded-tl-sm shadow-sm">
                  <p className="text-xs font-bold text-gray-400 mb-2">Client • Today, 10:24 AM</p>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Hi team, we just had our head chef candidate back out last minute. We need a replacement urgently before the soft launch next week. Please advise.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-8 flex-row-reverse">
                <div className="w-10 h-10 rounded-full bg-gray-900 flex-shrink-0 flex items-center justify-center text-white font-bold text-sm">A</div>
                <div className="bg-gray-900 text-white p-5 rounded-2xl rounded-tr-sm shadow-sm">
                  <p className="text-xs font-bold text-gray-400 mb-2">Agency • Today, 10:45 AM</p>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    We are on it. I am looping in the recruitment team now and we will have 3 backup profiles sent over by EOD.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-white border-t border-gray-100">
              <div className="bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-gray-900 focus-within:ring-4 focus-within:ring-gray-100 transition-all p-2 flex flex-col">
                <textarea 
                  className="w-full bg-transparent border-none focus:ring-0 resize-none p-3 text-sm text-gray-900 outline-none" 
                  rows={3} 
                  placeholder="Type your reply to the client..."
                ></textarea>
                <div className="flex justify-between items-center px-3 pb-2 mt-2 border-t border-gray-200 pt-3">
                  <div className="flex gap-2 text-gray-400">
                    <button className="hover:text-gray-900 transition-colors"><FileText className="w-4 h-4"/></button>
                  </div>
                  <button className="bg-gray-900 text-white px-5 py-2 rounded-xl text-xs font-bold hover:scale-105 transition-transform">
                    Send Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 6. Hiring Requests (Elegant Brief Layout)
function HiringTab() {
  return (
    <div className="animate-in fade-in duration-700 max-w-4xl mx-auto pb-20">
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Hiring Brief</h1>
        </div>
        <button className="bg-gray-900 text-white px-8 py-3.5 rounded-full font-black text-sm shadow-xl hover:-translate-y-1 transition-transform">
          Approve Brief
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-3xl p-10 md:p-16 rounded-[3rem] border border-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)]">
        
        {/* Title Flow */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-bold text-[#E91E8C] uppercase tracking-widest mb-4">Request Filed: July 26, 2026</p>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight tracking-tight mb-6">
            We are looking for an <br/>
            <span className="italic font-serif font-light text-5xl md:text-6xl text-gray-600">Executive Sous Chef</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="px-4 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-xs font-bold text-gray-700 uppercase tracking-widest">Full-Time</span>
            <span className="px-4 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-xs font-bold text-gray-700 uppercase tracking-widest">Fifth Settlement</span>
            <span className="px-4 py-1.5 rounded-full bg-[#78BE1F]/10 text-[#78BE1F] text-xs font-bold uppercase tracking-widest">2 Positions</span>
          </div>
        </div>

        <hr className="border-t-2 border-gray-100 mb-16" />

        {/* Content Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
          
          <div className="space-y-12">
            <div>
              <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#3AADE0]/10 flex items-center justify-center text-[#3AADE0]"><Target className="w-4 h-4"/></div>
                The Mission
              </h3>
              <ul className="space-y-8 text-gray-600 font-medium leading-relaxed">
                <li className="flex items-start gap-3"><span className="text-[#3AADE0] font-black mt-0.5">•</span> Oversee daily kitchen operations and staff management.</li>
                <li className="flex items-start gap-3"><span className="text-[#3AADE0] font-black mt-0.5">•</span> Ensure consistency and quality of all dishes served.</li>
                <li className="flex items-start gap-3"><span className="text-[#3AADE0] font-black mt-0.5">•</span> Assist in menu engineering and cost control.</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#F5841F]/10 flex items-center justify-center text-[#F5841F]"><Star className="w-4 h-4"/></div>
                Requirements
              </h3>
              <ul className="space-y-8 text-gray-600 font-medium leading-relaxed">
                <li className="flex items-start gap-3"><span className="text-[#F5841F] font-black mt-0.5">•</span> Minimum 5 years experience in high-volume.</li>
                <li className="flex items-start gap-3"><span className="text-[#F5841F] font-black mt-0.5">•</span> Strong leadership and communication.</li>
                <li className="flex items-start gap-3"><span className="text-gray-300 font-black mt-0.5">•</span> Experience with Mediterranean cuisine (Bonus).</li>
              </ul>
            </div>
          </div>

          <div className="space-y-12 bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Compensation</p>
              <p className="text-3xl font-black text-gray-900">25K - 30K <span className="text-lg text-gray-400 font-bold">EGP/mo</span></p>
              <p className="text-sm font-bold text-[#78BE1F] mt-2 flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Budget Approved</p>
            </div>
            
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Included Benefits</p>
              <div className="flex flex-wrap gap-2">
                {["Medical", "Social", "Transportation", "Meals", "Bonus"].map(b => (
                  <span key={b} className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 shadow-sm">{b}</span>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-gray-200">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Requestor</p>
              <p className="text-lg font-black text-gray-900">Yasmine Mostafa</p>
              <p className="text-sm text-gray-500 font-medium">F&B Director</p>
            </div>
          </div>
          
        </div>

        {/* Signatures */}
        <div className="bg-[#FAF7F2] p-8 rounded-[2rem] flex flex-col md:flex-row justify-between gap-8 border border-white">
          <div className="flex-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Hiring Manager</p>
            <div className="text-3xl font-['Great_Vibes',cursive] text-gray-700 pt-2 pb-2">Y. Mostafa</div>
            <div className="w-full h-0.5 bg-gray-200 mt-2 mb-2"/>
            <p className="text-xs text-gray-400 font-bold">26/07/2026</p>
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">HR Department</p>
            <div className="h-10"></div>
            <div className="w-full h-0.5 bg-gray-200 mt-2 mb-2"/>
            <p className="text-xs text-gray-400 font-bold">Pending</p>
          </div>
        </div>

      </div>
    </div>
  );
}

// 7. Calendar
function CalendarTab() {
  return (
    <div className="animate-in fade-in duration-700 w-full">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Availability</h1>
        <p className="text-gray-500 mt-4 text-lg">Define structural rules for client bookings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="space-y-8">
          <div className="bg-white/80 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
            <h3 className="font-black text-xl text-gray-900 mb-6">Exposed Days</h3>
            <div className="space-y-8">
              {['Thu', 'Sat'].map(d => (
                <div key={d} className="flex justify-between items-center p-4 bg-[#78BE1F]/10 rounded-2xl border border-[#78BE1F]/20">
                  <span className="font-black text-[#78BE1F]">{d}</span>
                  <div className="w-10 h-6 bg-[#78BE1F] rounded-full relative">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>
              ))}
              {['Mon', 'Tue', 'Wed', 'Fri', 'Sun'].map(d => (
                <div key={d} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100 opacity-50">
                  <span className="font-bold text-gray-500">{d}</span>
                  <div className="w-10 h-6 bg-gray-200 rounded-full relative">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white/70 backdrop-blur-3xl p-10 rounded-[3rem] border border-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)]">
          <h2 className="text-3xl font-black text-gray-900 mb-10">July 2026</h2>
          
          <div className="grid grid-cols-7 gap-8 text-center mb-6">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <span key={i} className="text-sm font-black text-gray-400">{d}</span>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-3 md:gap-8">
            {Array.from({length: 31}).map((_, i) => {
              const day = (i % 7) + 1;
              const isAllowed = day === 4 || day === 6;
              return (
                <div key={i} className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-transform hover:scale-105 cursor-pointer ${isAllowed ? 'bg-white shadow-md border border-gray-100 text-gray-900' : 'text-gray-400 hover:bg-white/50'}`}>
                  <span className="font-bold text-lg">{i+1}</span>
                  {isAllowed && i === 10 && <div className="absolute -bottom-2 w-1.5 h-1.5 rounded-full bg-[#3AADE0]" />}
                  {!isAllowed && i === 15 && <div className="absolute -bottom-2 w-1.5 h-1.5 rounded-full bg-[#E91E8C]" />}
                </div>
              )
            })}
          </div>

          <div className="mt-10 flex gap-8 border-t border-gray-100 pt-8">
            <span className="flex items-center gap-2 text-sm font-bold text-gray-500"><div className="w-3 h-3 rounded-full bg-[#3AADE0]"/> Client Call</span>
            <span className="flex items-center gap-2 text-sm font-bold text-gray-500"><div className="w-3 h-3 rounded-full bg-[#E91E8C]"/> Ops Block</span>
          </div>
        </div>

      </div>
    </div>
  );
}

// 8. Revenue (Financial Deep-Dive)
function RevenueTab() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
          Revenue <span className="text-transparent bg-clip-text" style={{backgroundImage: GRAD}}>Analytics</span>
        </h1>
        <p className="text-gray-500 mt-3 text-lg">Financial overview and service breakdowns.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="col-span-1 lg:col-span-2 bg-white/60 backdrop-blur-2xl rounded-[3rem] p-8 border border-white shadow-xl shadow-black/5">
          <h3 className="text-xl font-black text-gray-900 mb-6">Revenue Trajectory</h3>
          {/* Mock Chart Area */}
          <div className="w-full h-[300px] flex items-end justify-between gap-2 border-b-2 border-gray-100 pb-4 relative pl-12 pt-4">
            {/* Y-axis labels mock */}
            <div className="absolute left-0 bottom-4 top-4 flex flex-col justify-between text-xs font-bold text-gray-300">
              <span>$400k</span><span>$200k</span><span>$0</span>
            </div>
            {[
              { m: "Jan", v: 40 }, { m: "Feb", v: 55 }, { m: "Mar", v: 45 }, { m: "Apr", v: 70 },
              { m: "May", v: 65 }, { m: "Jun", v: 85 }, { m: "Jul", v: 100 }
            ].map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end relative">
                <div className="w-full max-w-[40px] bg-gradient-to-t from-[#78BE1F]/20 to-[#78BE1F] rounded-t-xl transition-all duration-500 group-hover:scale-y-105 origin-bottom" style={{ height: `${d.v}%` }}></div>
                <span className="absolute -bottom-6 text-xs font-bold text-gray-400">{d.m}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#F5841F] to-[#E91E8C] rounded-[3rem] p-8 text-white shadow-2xl shadow-[#F5841F]/30 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
          <h3 className="text-white/80 font-bold mb-2">YTD Total Revenue</h3>
          <p className="text-5xl font-black tracking-tight mb-8">$1.2M</p>
          
          <div className="space-y-8">
            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/20">
              <span className="block text-xs font-bold text-white/70 uppercase mb-1">Target Achievement</span>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full w-[85%]"></div>
                </div>
                <span className="font-black text-sm">85%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-2xl rounded-[3rem] p-8 border border-white shadow-xl shadow-black/5 mb-8">
        <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center justify-between">
          <span>Marketing ROI & Client Performance</span>
          <span className="text-sm font-bold text-gray-400 bg-white px-3 py-1 rounded-full shadow-sm">Global Average</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-50 shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-all">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#F5841F]/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2"></div>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-2">Avg Cost Per Lead (CPL)</p>
            <p className="text-3xl font-black text-gray-900">$18.50</p>
            <p className="text-xs font-bold text-[#78BE1F] mt-2 flex items-center gap-1">↓ 12% vs last month</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-50 shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-all">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#E91E8C]/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2"></div>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-2">Client Conversion Rate</p>
            <p className="text-3xl font-black text-gray-900">4.2%</p>
            <p className="text-xs font-bold text-[#78BE1F] mt-2 flex items-center gap-1">↑ 0.8% vs last month</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-50 shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-all">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#3AADE0]/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2"></div>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-2">Attributed Client Revenue</p>
            <p className="text-3xl font-black text-gray-900">$2.4M</p>
            <p className="text-xs font-bold text-gray-400 mt-2 flex items-center gap-1">Across 12 campaigns</p>
          </div>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-2xl rounded-[3rem] p-8 border border-white shadow-xl shadow-black/5">
        <h3 className="text-xl font-black text-gray-900 mb-6">Revenue by Service Segment</h3>
        <div className="space-y-8">
          {[
            { s: "Menu Engineering & F&B Consulting", v: "$450,000", p: "37.5%", c: "#F5841F" },
            { s: "Marketing & Lead Generation", v: "$320,000", p: "26.6%", c: "#E91E8C" },
            { s: "B2B Catering & Events", v: "$280,000", p: "23.3%", c: "#3AADE0" },
            { s: "Recruitment & Training", v: "$150,000", p: "12.5%", c: "#78BE1F" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-gray-50 group hover:-translate-y-1 transition-transform cursor-default">
              <div className="flex items-center gap-8 mb-2 md:mb-0">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.c }}></div>
                <span className="font-bold text-gray-700">{item.s}</span>
              </div>
              <div className="flex items-center gap-8">
                <span className="font-black text-lg text-gray-900">{item.v}</span>
                <span className="text-sm font-bold text-gray-400 w-12 text-right">{item.p}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 9. Billing (Invoicing & Cash Flow)
function BillingTab() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
          Billing & <span className="text-transparent bg-clip-text" style={{backgroundImage: GRAD}}>Accounts</span>
        </h1>
        <p className="text-gray-500 mt-3 text-lg">Manage invoices, retainers, and cash flow.</p>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          <h3 className="text-2xl font-black text-gray-900 ml-2">Outstanding Invoices</h3>
          {[
            { c: "Kempinski Hotel", s: "F&B Consulting (Phase 1)", a: "$12,500", d: "Overdue by 3 days", st: "Overdue" },
            { c: "The Ritz", s: "Q3 Marketing Retainer", a: "$8,000", d: "Due in 14 days", st: "Sent" }
          ].map((inv, i) => (
            <div key={i} className="bg-white/80 backdrop-blur-xl border border-white p-6 rounded-[2rem] shadow-xl shadow-black/5 flex items-center justify-between group hover:-translate-y-1 transition-all cursor-default">
              <div className="flex items-center gap-5">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${inv.st === 'Overdue' ? 'bg-red-100 text-red-500' : 'bg-[#3AADE0]/10 text-[#3AADE0]'}`}>
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">{inv.c}</h4>
                  <p className="text-gray-500 text-sm">{inv.s}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-2xl text-gray-900">{inv.a}</p>
                <p className={`text-sm font-bold ${inv.st === 'Overdue' ? 'text-red-500' : 'text-gray-400'}`}>{inv.d}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="w-full lg:w-[400px]">
          <div className="bg-[#78BE1F]/10 rounded-[3rem] p-10 border border-[#78BE1F]/20 relative overflow-hidden">
            <h3 className="text-2xl font-black mb-2 text-gray-900">Cash Flow</h3>
            <p className="text-gray-600 mb-8 font-medium">Expected incoming this week</p>
            <p className="text-6xl font-black text-[#78BE1F] tracking-tighter mb-4">$34,200</p>
            <button className="mt-4 w-full bg-white text-gray-900 font-bold py-4 rounded-2xl shadow-sm hover:scale-[1.02] transition-transform">
              Send Reminders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 10. Projects (Kanban)
function ProjectsTab() {
  const [columns, setColumns] = useState([
    {
      title: "Discovery",
      color: C_ORANGE,
      tasks: [
        { title: "New Cafe Menu Design", client: "Grand Cafe", tag: "F&B Consulting", img: "/cafe_menu_cover_1785350213475.png", avatars: ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80"] },
        { title: "Brand Identity Workshop", client: "Marriott", tag: "Marketing", img: null, avatars: ["https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80"] }
      ]
    },
    {
      title: "In Progress",
      color: C_BLUE,
      tasks: [
        { title: "Executive Chef Search", client: "Baron Hotels & Resorts", tag: "Recruitment", img: "/chef_search_cover_1785350225889.png", avatars: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"] },
        { title: "Q3 Ad Campaign Setup", client: "Kempinski", tag: "Marketing", img: null, avatars: ["https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80"] },
        { title: "Catering Menu Overhaul", client: "Mori Sushi", tag: "F&B Consulting", img: null, avatars: ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"] }
      ]
    },
    {
      title: "Client Review",
      color: C_PINK,
      tasks: [
        { title: "Wine List Curation", client: "Tamara", tag: "F&B Consulting", img: "/wine_list_cover_1785350236922.png", avatars: ["https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80"] }
      ]
    },
    {
      title: "Completed",
      color: C_GREEN,
      tasks: [
        { title: "Summer Cocktail Menu", client: "TBS", tag: "F&B Consulting", img: "/cocktail_menu_cover_1785350249712.png", avatars: ["https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80"] },
        { title: "Staff Training Manual", client: "Vodafone", tag: "Consulting", img: null, avatars: ["https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80"] }
      ]
    }
  ]);

  const [addingToCol, setAddingToCol] = useState<number | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskClient, setNewTaskClient] = useState("");

  const handleAddTask = (colIndex: number) => {
    if (!newTaskTitle.trim()) return;
    
    const newColumns = [...columns];
    newColumns[colIndex].tasks.push({
      title: newTaskTitle,
      client: newTaskClient || "Internal",
      tag: "New Request",
      img: null,
      avatars: ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80"] // Default avatar
    });
    
    setColumns(newColumns);
    setAddingToCol(null);
    setNewTaskTitle("");
    setNewTaskClient("");
  };

  const handleDeleteTask = (colIndex: number, taskIndex: number) => {
    const newColumns = [...columns];
    newColumns[colIndex].tasks.splice(taskIndex, 1);
    setColumns(newColumns);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
          Active <span className="text-transparent bg-clip-text" style={{backgroundImage: GRAD}}>Projects</span>
        </h1>
        <p className="text-gray-500 mt-3 text-lg">Track client deliverables across milestones.</p>
      </div>
      <div className="flex gap-8 overflow-x-auto pb-8 flex-1 min-h-[500px]">
        {columns.map((col, i) => (
          <div key={i} className="flex-1 min-w-[320px] bg-white/40 backdrop-blur-md rounded-[2rem] border border-white p-4 flex flex-col">
            <div className="flex items-center justify-between px-2 mb-6">
              <h3 className="font-bold text-gray-700">{col.title}</h3>
              <span className="text-xs font-black px-2 py-1 rounded-full text-white" style={{ backgroundColor: col.color }}>{col.tasks.length}</span>
            </div>
            <div className="space-y-8 flex-1">
              {col.tasks.map((task, j) => (
                <div key={j} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1 cursor-grab overflow-hidden group">
                  {task.img && (
                    <div className="h-32 w-full overflow-hidden">
                      <img src={task.img} alt={task.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }}></div>
                      <span className="text-xs font-bold text-gray-400">{task.tag}</span>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1 leading-tight">{task.title}</h4>
                    <p className="text-sm text-gray-500">{task.client}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {task.avatars.map((av, k) => (
                          <img key={k} src={av} alt="Team member" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                        ))}
                      </div>
                      <button onClick={() => handleDeleteTask(i, j)} className="text-gray-300 hover:text-red-500 transition-colors" title="Delete Task">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {addingToCol === i && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 animate-in fade-in zoom-in-95 duration-200">
                  <input 
                    type="text" 
                    placeholder="Task Title..." 
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-xl px-3 py-2 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[#3AADE0] mb-2 outline-none"
                    autoFocus
                  />
                  <input 
                    type="text" 
                    placeholder="Client Name..." 
                    value={newTaskClient}
                    onChange={(e) => setNewTaskClient(e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-xl px-3 py-2 text-sm text-gray-600 focus:ring-2 focus:ring-[#3AADE0] mb-3 outline-none"
                  />
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleAddTask(i)} className="flex-1 bg-gray-900 text-white rounded-xl py-2 text-xs font-bold hover:bg-gray-800 transition-colors">
                      Add Task
                    </button>
                    <button onClick={() => setAddingToCol(null)} className="flex-1 bg-gray-100 text-gray-500 rounded-xl py-2 text-xs font-bold hover:bg-gray-200 transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {addingToCol !== i && (
              <button 
                onClick={() => setAddingToCol(i)}
                className="mt-4 w-full py-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 font-bold text-sm hover:border-gray-300 hover:text-gray-600 transition-colors"
              >
                + Add Task
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// 11. Documents Vault
function DocumentsTab() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
          Document <span className="text-transparent bg-clip-text" style={{backgroundImage: GRAD}}>Vault</span>
        </h1>
        <p className="text-gray-500 mt-3 text-lg">Secure contracts, NDAs, and proposals.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { t: "Service Level Agreement (SLA)", c: "Kempinski Hotel", s: "Signed", color: C_GREEN },
          { t: "Marketing Retainer Q3", c: "The Ritz", s: "Awaiting Signature", color: C_ORANGE },
          { t: "Non-Disclosure Agreement", c: "Four Seasons", s: "Drafting", color: C_BLUE }
        ].map((doc, i) => (
          <div key={i} className="bg-white/80 backdrop-blur-xl border border-white p-6 rounded-[2rem] shadow-xl shadow-black/5 group cursor-pointer hover:-translate-y-2 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-6 group-hover:bg-white transition-colors">
              <FileText className="w-6 h-6 text-gray-400 group-hover:text-gray-900" />
            </div>
            <h4 className="font-bold text-gray-900 mb-1 line-clamp-1">{doc.t}</h4>
            <p className="text-gray-500 text-sm mb-6">{doc.c}</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: doc.color }}></div>
              <span className="text-xs font-bold" style={{ color: doc.color }}>{doc.s}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 12. Settings (Access Management)
function SettingsTab() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
          Access <span className="text-transparent bg-clip-text" style={{backgroundImage: GRAD}}>Control</span>
        </h1>
        <p className="text-gray-500 mt-3 text-lg">Manage team roles and permissions.</p>
      </div>
      <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[3rem] shadow-xl shadow-black/5 overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-xl font-black text-gray-900">Active Team Members</h3>
          <button className="bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:scale-105 transition-transform">
            + Invite User
          </button>
        </div>
        <div className="p-8 space-y-8">
          {[
            { n: "Sarah Jenkins", r: "Super Admin", e: "sarah@harmony.com", full: true },
            { n: "David Chen", r: "Recruitment Manager", e: "david@harmony.com", full: false },
            { n: "Elena Rodriguez", r: "Marketing Lead", e: "elena@harmony.com", full: false }
          ].map((user, i) => (
            <div key={i} className="flex items-center justify-between p-4 hover:bg-white rounded-2xl transition-colors border border-transparent hover:border-gray-100 cursor-default">
              <div className="flex items-center gap-8">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300"></div>
                <div>
                  <h4 className="font-bold text-gray-900">{user.n}</h4>
                  <p className="text-sm text-gray-500">{user.e}</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${user.full ? 'bg-gray-900 text-white' : 'bg-[#3AADE0]/10 text-[#3AADE0]'}`}>
                  {user.r}
                </span>
                <button className="text-gray-400 hover:text-gray-900">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 10. Payroll & Salaries
function PayrollTab() {
  const employees = [
    { name: "Ahmed Mahmoud", role: "Event Logistics Lead", salary: "$4,500/mo", lastPaid: "June 30, 2026", status: "Paid", color: C_GREEN },
    { name: "Yasmine Mostafa", role: "Sr. Account Manager", salary: "$6,200/mo", lastPaid: "June 30, 2026", status: "Paid", color: C_GREEN },
    { name: "Tarek El-Din", role: "Recruitment Specialist", salary: "$3,800/mo", lastPaid: "June 30, 2026", status: "Pending", color: C_ORANGE },
    { name: "Sarah Jenkins", role: "F&B Consultant", salary: "$8,500/mo", lastPaid: "June 30, 2026", status: "Paid", color: C_GREEN },
    { name: "David Chen", role: "Marketing Director", salary: "$7,000/mo", lastPaid: "June 30, 2026", status: "Pending", color: C_ORANGE },
  ];

  return (
    <div className="animate-in fade-in duration-700 h-full flex flex-col">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Team <span className="text-transparent bg-clip-text" style={{backgroundImage: GRAD}}>Payroll</span></h1>
          <p className="text-gray-500 mt-3 text-lg">Manage employee salaries and contractor payouts.</p>
        </div>
        <button className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform shadow-xl shadow-black/10 flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          Run Payroll
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="bg-white/80 backdrop-blur-xl border border-white p-6 rounded-3xl shadow-sm">
          <p className="text-gray-400 font-bold text-sm uppercase tracking-wider mb-2">Total Monthly Payroll</p>
          <p className="text-4xl font-black text-gray-900">$30,000</p>
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-white p-6 rounded-3xl shadow-sm">
          <p className="text-gray-400 font-bold text-sm uppercase tracking-wider mb-2">Next Payout Date</p>
          <p className="text-4xl font-black text-[#F5841F]">July 31</p>
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-white p-6 rounded-3xl shadow-sm">
          <p className="text-gray-400 font-bold text-sm uppercase tracking-wider mb-2">Pending Contractors</p>
          <p className="text-4xl font-black text-[#E91E8C]">12</p>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-3xl rounded-[3rem] border border-white shadow-xl shadow-black/5 overflow-hidden flex-1">
        <div className="grid grid-cols-12 gap-8 p-6 border-b border-gray-100 bg-gray-50/50 text-xs font-black text-gray-400 uppercase tracking-widest">
          <div className="col-span-4">Employee</div>
          <div className="col-span-3">Role</div>
          <div className="col-span-2">Salary</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1 text-right">Action</div>
        </div>
        <div className="divide-y divide-gray-100/50">
          {employees.map((emp, i) => (
            <div key={i} className="grid grid-cols-12 gap-8 p-6 items-center hover:bg-white transition-colors group cursor-default">
              <div className="col-span-4 font-bold text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm" style={{backgroundColor: emp.color}}>
                  {emp.name.split(' ').map(n => n[0]).join('')}
                </div>
                {emp.name}
              </div>
              <div className="col-span-3 font-bold text-gray-500">{emp.role}</div>
              <div className="col-span-2 font-black text-gray-900">{emp.salary}</div>
              <div className="col-span-2">
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${emp.status === 'Paid' ? 'bg-[#78BE1F]/10 text-[#78BE1F]' : 'bg-orange-100 text-orange-600 animate-pulse'}`}>
                  {emp.status}
                </span>
              </div>
              <div className="col-span-1 text-right">
                <button className="text-gray-300 hover:text-gray-900 transition-colors">
                  <MoreHorizontal className="w-5 h-5 inline" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] animate-in fade-in zoom-in duration-500">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <ShieldCheck className="w-10 h-10 text-gray-400" />
      </div>
      <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Access Restricted</h2>
      <p className="text-gray-500 text-center max-w-sm">
        You need <span className="font-bold text-gray-900">Super Admin</span> privileges to view and manage this section.
      </p>
    </div>
  );
}




