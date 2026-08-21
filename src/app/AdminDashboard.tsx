"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth";
import { AvailabilityCalendar } from "@/components/admin/AvailabilityCalendar";
import { CompanyProfilePanel } from "@/components/admin/CompanyProfilePanel";
import { ServiceBuilder } from "@/components/admin/ServiceBuilder";
import { StaffAccess } from "@/components/admin/StaffAccess";
import { ClientsTab } from "@/components/admin/ClientsTab";
import { ProjectsTab } from "@/components/admin/ProjectsTab";
import {
  api, formatDateTime, SERVICE_COLOR, SERVICE_LABEL, type PendingRequest,
} from "@/lib/api";
import {
  LayoutDashboard, Settings, Users, Calendar, TrendingUp,
  ShieldCheck, CheckCircle2, Phone, Mail, LogOut, ClipboardList,
  ArrowRight, KanbanSquare, SlidersHorizontal, Clock, Headset,
  Eye, BarChart3
} from "lucide-react";

const C_ORANGE = "#F5841F";
const C_PINK = "#E91E8C";
const C_BLUE = "#3AADE0";
const C_GREEN = "#78BE1F";
const GRAD = `linear-gradient(90deg, ${C_ORANGE}, ${C_PINK}, ${C_BLUE}, ${C_GREEN})`;

type Tab = "overview" | "projects" | "clients" | "services" | "calendar" | "settings";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const { user, logout } = useAuth();

  /* The role is whatever the signed-in account actually is — no toggle. A
     coordinator handles clients but can't publish availability, edit the
     catalogue, or manage staff. */
  const isAdmin = user?.role === "ADMIN";
  const router = useRouter();
  const [stats, setStats] = useState({ companies: 0, upcomingMeetings: 0, pendingRequests: 0 });

  React.useEffect(() => {
    api.get<{ companies: number; upcomingMeetings: number; pendingRequests: number }>("/scheduling/stats")
      .then((d) => setStats({ companies: d.companies, upcomingMeetings: d.upcomingMeetings, pendingRequests: d.pendingRequests }))
      .catch(() => {});
  }, []);

  // Which company's profile is open in the slide-over, if any.
  const [openCompanyId, setOpenCompanyId] = useState<number | null>(null);
  const [openRequestId, setOpenRequestId] = useState<number | null>(null);
  const openCompany = (companyId: number) => { setOpenRequestId(null); setOpenCompanyId(companyId); };
  const openAppointment = (companyId: number, requestId: number) => { setOpenRequestId(requestId); setOpenCompanyId(companyId); };

  const handleSignOut = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    // flex-1 rather than h-screen: this sits below the site nav, not instead of it.
    <div className="flex flex-1 min-h-0 bg-[#FAF7F2] overflow-hidden relative w-full">
      
      {/* Ambient Glows (Preserved exactly as requested) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[20%] w-[40vw] h-[40vw] bg-[#F5841F]/10 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-10%] right-[10%] w-[50vw] h-[50vw] bg-[#3AADE0]/5 blur-[150px] rounded-full mix-blend-multiply" />
      </div>

      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white/70 backdrop-blur-3xl border-r border-white/60 shadow-[10px_0_30px_-15px_rgba(0,0,0,0.05)] flex flex-col z-20 flex-shrink-0 relative">
        <div className="p-6 pb-4 border-b border-white/40">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
              style={{ background: isAdmin ? `linear-gradient(135deg, ${C_ORANGE}, ${C_PINK})` : `linear-gradient(135deg, ${C_BLUE}, ${C_GREEN})` }}
            >
              {isAdmin ? <ShieldCheck className="w-5 h-5 text-white" /> : <Headset className="w-5 h-5 text-white" />}
            </div>
            <div className="min-w-0">
              <h2 className="font-extrabold text-base text-gray-900 leading-tight">Staff Portal</h2>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                {isAdmin ? "Admin" : "Coordinator"}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <span className="block text-xs font-black text-gray-400 uppercase tracking-widest px-4 mb-2 mt-2">Core</span>
          <NavItem icon={LayoutDashboard} label="Overview" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} color={C_ORANGE} />
          
          <span className="block text-xs font-black text-gray-400 uppercase tracking-widest px-4 mb-2 mt-6">Operations</span>
          <NavItem icon={KanbanSquare} label="Projects" active={activeTab === "projects"} onClick={() => setActiveTab("projects")} color={C_PINK} />
          <NavItem icon={Calendar} label="Calendar" active={activeTab === "calendar"} onClick={() => setActiveTab("calendar")} color={C_BLUE} />
          
          <span className="block text-xs font-black text-gray-400 uppercase tracking-widest px-4 mb-2 mt-6">Client Data</span>
          {/* Companies and CRM were two halves of the same thing — one list now. */}
          <NavItem icon={Users} label="Clients" active={activeTab === "clients"} onClick={() => setActiveTab("clients")} color={C_GREEN} />

          {/* Catalogue and staff management are admin-only. */}
          {isAdmin && (
            <>
              <span className="block text-xs font-black text-gray-400 uppercase tracking-widest px-4 mb-2 mt-6">System</span>
              <NavItem icon={Settings} label="Services Setup" active={activeTab === "services"} onClick={() => setActiveTab("services")} color={C_PINK} />
              <NavItem icon={SlidersHorizontal} label="Access Config" active={activeTab === "settings"} onClick={() => setActiveTab("settings")} color={C_BLUE} />
            </>
          )}
        </nav>

        <div className="p-4 border-t border-white/40">
          {user && (
            <p className="px-4 pb-2 text-xs font-bold text-gray-400 truncate" title={user.email}>
              {user.email}
            </p>
          )}
          <button onClick={handleSignOut} className="flex items-center w-full px-4 py-3 text-sm font-bold text-red-600 rounded-xl hover:bg-red-50 transition-all">
            <LogOut className="w-4 h-4 mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Flow */}
      <main className="relative z-10 flex-1 p-8 lg:p-12 pb-32 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {activeTab === "overview" && (
            <OverviewTab
              setActiveTab={setActiveTab}
              pendingCount={stats.pendingRequests}
              companyCount={stats.companies}
              meetingCount={stats.upcomingMeetings}
              onOpenCompany={openCompany}
            />
          )}
          {activeTab === "projects" && <ProjectsTab onOpenCompany={openCompany} />}
          {activeTab === "clients" && <ClientsTab onOpenCompany={openCompany} />}
          {activeTab === "services" && (isAdmin ? <ServiceBuilder /> : <AccessDenied />)}
          {activeTab === "calendar" && (
            <AvailabilityCalendar onOpenAppointment={openAppointment} canEdit={isAdmin} />
          )}
          {activeTab === "settings" && (isAdmin ? <StaffAccess /> : <AccessDenied />)}
        </div>
      </main>

      {openCompanyId !== null && (
        <CompanyProfilePanel
          companyId={openCompanyId}
          requestId={openRequestId ?? undefined}
          onClose={() => setOpenCompanyId(null)}
          onChanged={() => {}}
        />
      )}
    </div>
  );
}

// â”€â”€â”€ Sub-Components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
function OverviewTab({ setActiveTab, pendingCount, companyCount, meetingCount, onOpenCompany }: any) {
  // The five most recent requests, straight from the database.
  const [recent, setRecent] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<Record<string, number>>({});

  React.useEffect(() => {
    api.get<{ projects: any[] }>("/scheduling/projects")
      .then((d) => setRecent(d.projects.slice(0, 5)))
      .catch(() => setRecent([]));

    api.get<{ metrics: Record<string, number> }>("/metrics/views")
      .then((d) => setMetrics(d.metrics || {}))
      .catch(() => setMetrics({}));
  }, []);

  const totalViews = Object.values(metrics).reduce((a, b) => a + b, 0);

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
            <StatPill title="Total Site Views" value={String(totalViews)} color={C_PINK} onClick={() => {}} />
            <StatPill title="Active Companies" value={String(companyCount ?? 0)} color={C_BLUE} onClick={() => setActiveTab("clients")} />
            <StatPill title="Pending Requests" value={String(pendingCount ?? 0)} color={C_ORANGE} onClick={() => setActiveTab("projects")} />
            <StatPill title="Upcoming Meetings" value={String(meetingCount ?? 0)} color={C_GREEN} onClick={() => setActiveTab("calendar")} />
          </div>

          <div className="bg-white/60 backdrop-blur-2xl rounded-[3rem] p-8 md:p-10 border border-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
            <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
              <TrendingUp className="text-[#F5841F]"/> Recent Activity
            </h3>
            {recent.length === 0 ? (
              <p className="text-gray-400 font-bold">Nothing has come in yet.</p>
            ) : (
              <div className="space-y-8 relative before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-gradient-to-b before:from-[#F5841F] before:to-[#E91E8C] before:opacity-20">
                {recent.map((r: any) => {
                  const color = SERVICE_COLOR[r.serviceType] ?? C_ORANGE;
                  return (
                    <button
                      key={r.id}
                      onClick={() => onOpenCompany?.(r.companyId)}
                      className="relative pl-10 block text-left w-full group"
                    >
                      <span
                        className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-[3px] shadow-md z-10"
                        style={{ borderColor: color }}
                      />
                      <p className="text-base font-bold text-gray-900 group-hover:underline">
                        {r.companyName} requested &ldquo;{r.title}&rdquo;
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {r.meetingAt ? `Meeting ${formatDateTime(r.meetingAt)}` : "No meeting time chosen yet"}
                      </p>
                      <span
                        className="inline-block mt-2 text-xs font-bold px-2 py-1 rounded-md"
                        style={{ background: `${color}18`, color }}
                      >
                        {SERVICE_LABEL[r.serviceType] ?? r.serviceType}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
            {/* Right Column (Service Traffic) */}
        <div className="lg:w-[380px] flex-shrink-0">
          <div className="bg-white/60 backdrop-blur-2xl rounded-[3rem] p-8 md:p-10 border border-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] sticky top-8">
            <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
              <BarChart3 className="text-[#3AADE0]" /> Service Traffic
            </h3>

        {/* Right Column (Service Traffic) */}
        <div className="lg:w-[380px] flex-shrink-0">
          <div className="bg-white/60 backdrop-blur-2xl rounded-[3rem] p-8 md:p-10 border border-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] sticky top-8">
            <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
              <BarChart3 className="text-[#3AADE0]" /> Service Traffic
            </h3>

            {Object.keys(metrics).length === 0 ? (
              <p className="text-gray-400 font-bold">No views recorded yet.</p>
            ) : (
              <div className="space-y-5">
                {Object.entries(metrics)
                  .sort(([, a], [, b]) => b - a)
                  .map(([serviceId, count]) => {
                    const color = SERVICE_COLOR[serviceId] || "#888";
                    const max = Math.max(...Object.values(metrics));
                    const width = max > 0 ? `${(count / max) * 100}%` : "0%";

                    return (
                      <div key={serviceId} className="relative">
                        <div className="flex justify-between items-end mb-2">
                          <span className="text-sm font-bold text-gray-700 capitalize">
                            {SERVICE_LABEL[serviceId] || serviceId}
                          </span>
                          <span className="text-sm font-black text-gray-900 flex items-center gap-1.5">
                            <Eye className="w-3.5 h-3.5 text-gray-400" />
                            {count}
                          </span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-1000"
                            style={{ width, background: color }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
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

/**
 * Companies that asked for a meeting and are still waiting. Each card opens
 * that company's profile.
 */
function PendingVerificationsTab({
  requests,
  onOpenCompany,
}: {
  requests: PendingRequest[];
  onOpenCompany: (id: number) => void;
}) {
  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Pending Meetings</h1>
        <p className="text-gray-500 mt-2 text-lg">
          Companies who requested a meeting and are waiting to hear back.
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-20 bg-white/50 rounded-[2.5rem] border border-white">
          <CheckCircle2 className="w-12 h-12 text-[#78BE1F] mx-auto mb-4" />
          <p className="text-gray-500 font-bold text-lg">Nothing pending.</p>
          <p className="text-gray-400">Every meeting request has been handled.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {requests.map((r) => {
            const overdue = !!r.meetingAt && new Date(r.meetingAt).getTime() < Date.now();

            return (
            <button
              key={r.id}
              onClick={() => onOpenCompany(r.companyId)}
              className={`text-left bg-white/70 backdrop-blur-xl p-7 rounded-[2.5rem] border shadow-[0_15px_35px_-10px_rgba(0,0,0,0.06)] hover:bg-white hover:-translate-y-1 transition-all group ${
                overdue ? "border-red-200" : "border-white"
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="min-w-0">
                  <span
                    className="inline-block px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider mb-2"
                    style={{
                      background: `${SERVICE_COLOR[r.serviceType] ?? "#888"}18`,
                      color: SERVICE_COLOR[r.serviceType] ?? "#888",
                    }}
                  >
                    {SERVICE_LABEL[r.serviceType] ?? r.serviceType}
                  </span>
                  <h3 className="text-2xl font-black text-gray-900 truncate">{r.companyName}</h3>
                  <p className="text-gray-500 font-bold truncate">{r.title}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[#F5841F] group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
              </div>

              <div className={`flex items-center gap-2 p-3 rounded-xl mb-4 ${overdue ? "bg-red-50" : "bg-gray-50"}`}>
                <Clock className={`w-4 h-4 flex-shrink-0 ${overdue ? "text-red-500" : "text-gray-400"}`} />
                <span className={`text-sm font-bold ${overdue ? "text-red-700" : "text-gray-900"}`}>
                  {r.meetingAt ? formatDateTime(r.meetingAt) : "No meeting time chosen"}
                </span>
                {overdue && (
                  <span className="ml-auto text-[10px] font-black uppercase tracking-wider text-red-600">
                    Overdue
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-4 text-sm font-bold text-gray-500">
                <span className="flex items-center gap-1.5 min-w-0">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{r.contactPhone ?? "No phone"}</span>
                </span>
                <span className="flex items-center gap-1.5 min-w-0">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{r.email}</span>
                </span>
              </div>
            </button>
            );
          })}
        </div>
      )}
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

