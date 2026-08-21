"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useTranslate } from "@tolgee/react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, CalendarClock, Building2, MessageSquare, Check, X, LogOut,
  Clock, ArrowRight, Phone, Mail, User, Pencil, CheckCircle2, AlertCircle,
} from "lucide-react";
import { useAuth } from "./auth";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { CompanyCalendar } from "@/components/company/CompanyCalendar";
import { api, formatDateTime, formatDay, SERVICE_COLOR, SERVICE_LABEL, type RescheduleRequest } from "@/lib/api";

const C_ORANGE = "#F5841F";
const C_PINK = "#E91E8C";
const C_BLUE = "#3AADE0";
const C_GREEN = "#78BE1F";
const GRAD = `linear-gradient(90deg, ${C_ORANGE}, ${C_PINK}, ${C_BLUE}, ${C_GREEN})`;

type Tab = "overview" | "appointments" | "profile" | "calendar";

interface MyRequest {
  id: number;
  title: string;
  serviceType: string;
  status: string;
  meetingAt?: string | null;
}

interface Profile {
  user: { id: number; email: string; role: string; createdAt: string };
  company: {
    id: number;
    companyName: string;
    contactName: string;
    contactPhone: string | null;
    createdAt: string;
  } | null;
  stats: {
    total: number; pending: number; approved: number; completed: number;
    nextMeetingAt: string | null;
  } | null;
}

export default function CompanyDashboard() {
  const { t } = useTranslate();
  const { user, logout } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [requests, setRequests] = useState<MyRequest[]>([]);
  const [reschedules, setReschedules] = useState<RescheduleRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [chatFor, setChatFor] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      const [me, mine, resched] = await Promise.all([
        api.get<Profile>("/company-dashboard/profile"),
        api.get<{ serviceRequests?: MyRequest[]; requests?: MyRequest[] }>("/service-requests/my"),
        api.get<{ reschedules: RescheduleRequest[] }>("/scheduling/my-reschedules"),
      ]);

      setProfile(me);
      setRequests(mine.serviceRequests ?? mine.requests ?? []);
      setReschedules(resched.reschedules);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("company_load_error", "Failed to load your dashboard"));
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const respond = async (id: number, decision: "APPROVE" | "DECLINE") => {
    setBusyId(id);
    try {
      await api.post(`/scheduling/reschedules/${id}/respond`, { decision });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("company_answer_error", "Could not send your answer"));
    } finally {
      setBusyId(null);
    }
  };

  const handleSignOut = async () => {
    await logout();
    router.replace("/login");
  };

  const pending = reschedules.filter((r) => r.status === "PENDING");
  const company = profile?.company;
  const displayName = company?.companyName ?? t("company_profile_fallback", "Your profile");

  return (
    <div className="flex flex-1 min-h-0 bg-[#FAF7F2] overflow-hidden relative w-full">
      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[20%] w-[40vw] h-[40vw] bg-[#3AADE0]/10 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-10%] right-[10%] w-[50vw] h-[50vw] bg-[#E91E8C]/6 blur-[150px] rounded-full mix-blend-multiply" />
      </div>

      {/* Sidebar */}
      <aside className="w-64 bg-white/70 backdrop-blur-3xl border-r border-white/60 shadow-[10px_0_30px_-15px_rgba(0,0,0,0.05)] flex flex-col z-20 flex-shrink-0 relative">
        <div className="p-6 pb-4 border-b border-white/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#3AADE0] to-[#E91E8C] flex items-center justify-center shadow-lg flex-shrink-0">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="font-extrabold text-base text-gray-900 leading-tight truncate" title={displayName}>
                {displayName}
              </h2>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{t("company_client_portal", "Client Portal")}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <span className="block text-xs font-black text-gray-400 uppercase tracking-widest px-4 mb-2 mt-2">{t("company_core", "Core")}</span>
          <NavItem icon={LayoutDashboard} label={t("company_overview", "Overview")} active={activeTab === "overview"} onClick={() => setActiveTab("overview")} color={C_ORANGE} />

          <span className="block text-xs font-black text-gray-400 uppercase tracking-widest px-4 mb-2 mt-6">{t("company_bookings", "Bookings")}</span>
          <NavItem
            icon={CalendarClock}
            label={`${t("company_appointments", "Appointments")}${requests.length ? ` (${requests.length})` : ""}`}
            active={activeTab === "appointments"}
            onClick={() => setActiveTab("appointments")}
            color={C_BLUE}
            badge={pending.length || undefined}
          />
          <NavItem
            icon={CalendarClock}
            label="Calendar"
            active={activeTab === "calendar"}
            onClick={() => setActiveTab("calendar")}
            color={C_BLUE}
          />

          <span className="block text-xs font-black text-gray-400 uppercase tracking-widest px-4 mb-2 mt-6">{t("company_account", "Account")}</span>
          <NavItem icon={User} label={t("company_profile", "Profile")} active={activeTab === "profile"} onClick={() => setActiveTab("profile")} color={C_PINK} />
        </nav>

        <div className="p-4 border-t border-white/40">
          {user && (
            <p className="px-4 pb-2 text-xs font-bold text-gray-400 truncate" title={user.email}>
              {user.email}
            </p>
          )}
          <button onClick={handleSignOut} className="flex items-center w-full px-4 py-3 text-sm font-bold text-red-600 rounded-xl hover:bg-red-50 transition-all">
            <LogOut className="w-4 h-4 mr-3" />
            {t("company_sign_out", "Sign Out")}
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="relative z-10 flex-1 p-8 lg:p-12 pb-32 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {error && (
            <div className="mb-8 rounded-2xl bg-red-50 border border-red-100 px-5 py-3.5 font-bold text-red-700">
              {error}
            </div>
          )}

          {activeTab === "overview" && (
            <OverviewTab
              profile={profile}
              pendingReschedules={pending}
              onGoToAppointments={() => setActiveTab("appointments")}
              onRespond={respond}
              busyId={busyId}
            />
          )}

          {activeTab === "appointments" && (
            <AppointmentsTab
              requests={requests}
              pendingReschedules={pending}
              chatFor={chatFor}
              setChatFor={setChatFor}
              onRespond={respond}
              busyId={busyId}
            />
          )}

          {activeTab === "profile" && (
            <ProfileTab profile={profile} onSaved={load} />
          )}

          {activeTab === "calendar" && (
            <CalendarTab requests={requests} />
          )}
        </div>
      </main>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function NavItem({ icon: Icon, label, active, onClick, color, badge }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full px-4 py-3 rounded-xl transition-all duration-300 font-bold text-sm flex items-center gap-3 ${
        active
          ? "bg-white text-gray-900 shadow-md border border-gray-100 scale-[1.02]"
          : "text-gray-500 hover:text-gray-900 hover:bg-white/50"
      }`}
    >
      <Icon className={`w-4 h-4 transition-colors ${active ? "" : "opacity-70"}`} style={{ color: active ? color : "inherit" }} />
      <span className="flex-1 text-left">{label}</span>
      {badge ? (
        <span className="w-5 h-5 rounded-full bg-[#F5841F] text-white text-[10px] font-black flex items-center justify-center flex-shrink-0">
          {badge}
        </span>
      ) : null}
    </button>
  );
}

function StatPill({ title, value, color, onClick, small }: any) {
  const Wrapper: any = onClick ? "button" : "div";
  return (
    <Wrapper
      onClick={onClick}
      className={`text-left bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 border border-white shadow-xl shadow-black/5 flex-1 min-w-[200px] transition-all duration-500 group ${
        onClick ? "hover:-translate-y-2 hover:shadow-2xl cursor-pointer" : "cursor-default"
      }`}
    >
      <h3 className="text-gray-500 font-bold text-sm mb-2 group-hover:text-gray-900 transition-colors">{title}</h3>
      <p className={`font-black ${small ? "text-2xl" : "text-4xl"}`} style={{ color }}>{value}</p>
    </Wrapper>
  );
}

function RescheduleCard({ r, onRespond, busyId }: any) {
  const { t } = useTranslate();
  return (
    <div className="bg-white rounded-[2.5rem] p-8 border-2 border-[#F5841F]/30 shadow-lg">
      <p className="text-gray-500 font-bold mb-1">{r.title}</p>

      <div className="flex flex-wrap items-center gap-4 my-5">
        <div className="px-5 py-3 rounded-2xl bg-gray-100">
          <p className="text-[11px] font-black uppercase tracking-wider text-gray-400 mb-0.5">{t("company_currently", "Currently")}</p>
          <p className="font-black text-gray-500 line-through">
            {r.currentAt ? formatDateTime(r.currentAt) : t("company_not_set", "Not set")}
          </p>
        </div>
        <ArrowRight className="w-5 h-5 text-gray-300" />
        <div className="px-5 py-3 rounded-2xl bg-[#78BE1F]/10">
          <p className="text-[11px] font-black uppercase tracking-wider text-[#78BE1F] mb-0.5">{t("company_proposed", "Proposed")}</p>
          <p className="font-black text-gray-900">{formatDateTime(r.proposedAt)}</p>
        </div>
      </div>

      {r.message && (
        <p className="text-gray-600 font-medium italic mb-5 p-4 rounded-xl bg-gray-50">"{r.message}"</p>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => onRespond(r.id, "APPROVE")}
          disabled={busyId === r.id}
          className="flex items-center gap-2 bg-[#78BE1F] text-white px-6 py-3 rounded-full font-black shadow-lg disabled:opacity-40 hover:scale-105 transition-transform"
        >
          <Check className="w-4 h-4" /> {t("company_approve_time", "Approve new time")}
        </button>
        <button
          onClick={() => onRespond(r.id, "DECLINE")}
          disabled={busyId === r.id}
          className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-gray-500 hover:bg-gray-100 disabled:opacity-40 transition-colors"
        >
          <X className="w-4 h-4" /> {t("company_decline", "Decline")}
        </button>
      </div>
    </div>
  );
}

function OverviewTab({ profile, pendingReschedules, onGoToAppointments, onRespond, busyId }: any) {
  const { t } = useTranslate();
  const stats = profile?.stats;
  const name = profile?.company?.contactName?.split(" ")[0];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
          Welcome{name ? "," : ""} <br />
          <span className="text-transparent bg-clip-text" style={{ backgroundImage: GRAD }}>
            {profile?.company?.companyName ?? t("company_to_harmony", "to Harmony")}
          </span>
        </h1>
        <p className="text-gray-500 mt-3 text-lg">{t("company_overview_intro", "Here's where your work with us stands.")}</p>
      </div>

      <div className="flex flex-wrap gap-8 mb-10">
        <StatPill title={t("company_appointments", "Appointments")} value={String(stats?.total ?? 0)} color={C_BLUE} onClick={onGoToAppointments} />
        <StatPill title={t("company_awaiting_us", "Awaiting Us")} value={String(stats?.pending ?? 0)} color={C_ORANGE} onClick={onGoToAppointments} />
        <StatPill
          title={t("company_next_meeting", "Next Meeting")}
          value={stats?.nextMeetingAt ? formatDay(stats.nextMeetingAt) : t("company_none", "None")}
          color={C_GREEN}
          small={!!stats?.nextMeetingAt}
          onClick={onGoToAppointments}
        />
      </div>

      {pendingReschedules.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <CalendarClock className="w-6 h-6 text-[#F5841F]" />
            {t("company_needs_answer", "Needs your answer")}
          </h2>
          {pendingReschedules.map((r: any) => (
            <RescheduleCard key={r.id} r={r} onRespond={onRespond} busyId={busyId} />
          ))}
        </div>
      )}

      {pendingReschedules.length === 0 && (
        <div className="bg-white/60 backdrop-blur-2xl rounded-[3rem] p-10 border border-white flex items-center gap-4">
          <CheckCircle2 className="w-8 h-8 text-[#78BE1F] flex-shrink-0" />
          <div>
            <p className="font-black text-gray-900 text-lg">{t("company_nothing_attention", "Nothing needs your attention.")}</p>
            <p className="text-gray-500 font-medium">{t("company_no_changes", "We'll let you know here if a meeting time changes.")}</p>
          </div>
        </div>
      )}
    </div>
  );
}

const fixEnquirySpelling = (text: string) => text.replace(/\binquiry\b/gi, "enquiry");

function AppointmentsTab({ requests, pendingReschedules, chatFor, setChatFor, onRespond, busyId }: any) {
  const { t } = useTranslate();
  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">{t("company_appointments", "Appointments")}</h1>
        <p className="text-gray-500 mt-2 text-lg">
          {t("company_appointments_intro", "Everything you've booked with us, and the conversation for each one.")}
        </p>
      </div>

      {pendingReschedules.length > 0 && (
        <div className="space-y-4 mb-10">
          {pendingReschedules.map((r: any) => (
            <RescheduleCard key={r.id} r={r} onRespond={onRespond} busyId={busyId} />
          ))}
        </div>
      )}

      {requests.length === 0 ? (
        <div className="text-center py-20 bg-white/50 rounded-[2.5rem] border border-white">
          <CalendarClock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-bold text-lg">{t("company_no_appointments", "No appointments yet.")}</p>
          <p className="text-gray-400">{t("company_book_to_chat", "Book a service and you'll be able to chat with us here.")}</p>
        </div>
      ) : (
        <div className="space-y-5">
          {requests.map((r: MyRequest) => (
            <div key={r.id} className="relative bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-5 md:p-6 border border-white shadow-lg">
              <div className="min-w-0 pr-0 md:pr-56">
                {(SERVICE_LABEL[r.serviceType] ?? r.serviceType) ? (
                  <span
                    className="inline-block px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider mb-1"
                    style={{
                      background: `${SERVICE_COLOR[r.serviceType] ?? "#888"}18`,
                      color: SERVICE_COLOR[r.serviceType] ?? "#888",
                    }}
                  >
                    {t(
                      `service_type_${(r.serviceType ?? "OTHER").toLowerCase()}`,
                      SERVICE_LABEL[r.serviceType ?? "OTHER"] ?? r.serviceType ?? t("company_unknown", "Unknown"),
                    )}
                  </span>
                  <h3 className="text-2xl font-black text-gray-900">{r.title}</h3>
                  <p className="text-sm font-bold text-gray-400 mt-1">
                    {t(`request_status_${(r.status ?? "UNKNOWN").toLowerCase()}`, r.status ?? t("company_unknown", "Unknown"))}
                  </p>
                  {r.meetingAt && (
                    <p className="flex items-center gap-2 mt-3 text-sm font-bold text-gray-700">
                      <Clock className="w-4 h-4 text-gray-400" /> {formatDateTime(r.meetingAt)}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => setChatFor(chatFor === r.id ? null : r.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-full font-bold text-sm transition-all flex-shrink-0 ${
                    chatFor === r.id
                      ? "bg-gray-900 text-white"
                      : "bg-[#E91E8C]/10 text-[#E91E8C] hover:-translate-y-0.5"
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  {chatFor === r.id ? t("company_hide_chat", "Hide chat") : t("company_chat_harmony", "Chat with Harmony")}
                </button>
              </div>

              <button
                onClick={() => setChatFor(chatFor === r.id ? null : r.id)}
                className={`absolute top-5 right-5 md:top-6 md:right-6 flex items-center gap-2 px-5 py-3 rounded-full font-bold text-sm transition-all ${
                  chatFor === r.id
                    ? "bg-gray-900 text-white"
                    : "bg-[#E91E8C]/10 text-[#E91E8C] hover:-translate-y-0.5"
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                {chatFor === r.id ? "Hide chat" : "Chat with Harmony"}
              </button>

              {chatFor === r.id && (
                <div className="mt-6 h-[420px]">
                  <ChatPanel requestId={r.id} title={`Chat about "${fixEnquirySpelling(r.title)}"`} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProfileTab({ profile, onSaved }: { profile: Profile | null; onSaved: () => void }) {
  const { t } = useTranslate();
  const company = profile?.company;
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ companyName: "", contactName: "", contactPhone: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    setForm({
      companyName: company?.companyName ?? "",
      contactName: company?.contactName ?? "",
      contactPhone: company?.contactPhone ?? "",
    });
    if (!company) setEditing(true);
  }, [profile, company]);

  const save = async () => {
    setBusy(true);
    setError(null);
    try {
      await api.put("/company-dashboard/profile", form);
      setEditing(false);
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("company_save_profile_error", "Could not save your profile"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">{t("company_profile", "Profile")}</h1>
        <p className="text-gray-500 mt-2 text-lg">{t("company_profile_intro", "How Harmony reaches you.")}</p>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl bg-red-50 border border-red-100 px-5 py-3.5 font-bold text-red-700">
          {error}
        </div>
      )}

      {!company && (
        <div className="mb-6 rounded-2xl bg-[#F5841F]/10 border border-[#F5841F]/20 px-5 py-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-[#F5841F] flex-shrink-0" />
          <p className="font-bold text-gray-700">
            {t("company_profile_prompt", "Tell us who you are so we can reach you about your bookings.")}
          </p>
        </div>
      )}

      <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-10 border border-white shadow-xl max-w-3xl">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#3AADE0] to-[#E91E8C] flex items-center justify-center shadow-lg flex-shrink-0">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="text-3xl font-black text-gray-900 truncate">
                {company?.companyName ?? t("company_your_company", "Your company")}
              </h2>
              <p className="text-gray-500 font-bold">
                {t("company_member_since", "Member since")} {profile ? new Date(profile.user.createdAt).getFullYear() : "—"}
              </p>
            </div>
          </div>

          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm bg-gray-900 text-white hover:scale-105 transition-transform flex-shrink-0"
            >
              <Pencil className="w-4 h-4" /> {t("company_edit", "Edit")}
            </button>
          )}
        </div>

        {editing ? (
          <div className="space-y-5">
            <Field label={t("company_name", "Company name")}>
              <input
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                placeholder="Test Bistro"
                className="w-full bg-gray-50 rounded-2xl px-4 py-3 font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#3AADE0]/30"
              />
            </Field>
            <Field label={t("company_contact_name", "Contact name")}>
              <input
                value={form.contactName}
                onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                placeholder="Omar Hatem"
                className="w-full bg-gray-50 rounded-2xl px-4 py-3 font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#3AADE0]/30"
              />
            </Field>
            <Field label={t("company_phone", "Phone")}>
              <input
                value={form.contactPhone}
                onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                placeholder="+20 100 000 0000"
                className="w-full bg-gray-50 rounded-2xl px-4 py-3 font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#3AADE0]/30"
              />
            </Field>

            <div className="flex gap-3 pt-2">
              <button
                onClick={save}
                disabled={busy || !form.companyName.trim() || !form.contactName.trim()}
                className="flex items-center gap-2 bg-[#78BE1F] text-white px-6 py-3 rounded-full font-black shadow-lg disabled:opacity-40 hover:scale-105 transition-transform"
              >
                <Check className="w-4 h-4" /> {busy ? t("company_saving", "Saving...") : t("company_save", "Save")}
              </button>
              {company && (
                <button
                  onClick={() => setEditing(false)}
                  className="px-6 py-3 rounded-full font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  {t("company_cancel", "Cancel")}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <ReadRow icon={User} label={t("company_contact", "Contact")} value={company?.contactName ?? t("company_not_set", "Not set")} color={C_ORANGE} />
            <ReadRow icon={Phone} label={t("company_phone", "Phone")} value={company?.contactPhone ?? t("company_not_set", "Not set")} color={C_GREEN}
              href={company?.contactPhone ? `tel:${company.contactPhone}` : undefined} />
            <ReadRow icon={Mail} label={t("company_email", "Email")} value={profile?.user.email ?? ""} color={C_BLUE}
              href={profile ? `mailto:${profile.user.email}` : undefined} />
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{label}</label>
      {children}
    </div>
  );
}

function ReadRow({ icon: Icon, label, value, color, href }: any) {
  const content = (
    <>
      <span
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}18`, color }}
      >
        <Icon className="w-5 h-5" />
      </span>
      <span className="min-w-0">
        <span className="block text-[11px] font-black uppercase tracking-wider text-gray-400">{label}</span>
        <span className="block font-bold text-gray-900 truncate">{value}</span>
      </span>
    </>
  );

  const className = "flex items-center gap-4 p-4 rounded-2xl bg-gray-50 transition-colors";

  return href ? (
    <a href={href} className={`${className} hover:bg-gray-100`}>{content}</a>
  ) : (
    <div className={className}>{content}</div>
  );
}

function CalendarTab({ requests }: { requests: MyRequest[] }) {
  const events = requests
    .filter((r) => r.meetingAt)
    .map((r: any) => ({
      id: r.id,
      title: r.title,
      serviceType: r.serviceType,
      status: r.status,
      meetingAt: r.meetingAt,
    }));

  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Calendar</h1>
        <p className="text-gray-500 mt-2 text-lg">
          Your upcoming meetings at a glance
        </p>
      </div>

      <CompanyCalendar events={events} />
    </div>
  );
}
