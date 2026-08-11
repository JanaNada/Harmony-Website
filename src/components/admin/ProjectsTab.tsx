"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  KanbanSquare, Building2, Phone, Mail, User, Clock, MapPin, Wallet,
  X, ExternalLink, Search,
} from "lucide-react";
import {
  api, formatDateTime, SERVICE_COLOR, SERVICE_LABEL,
} from "@/lib/api";

export interface Project {
  id: number;
  title: string;
  description: string;
  serviceType: string;
  status: string;
  budgetRange: string | null;
  location: string | null;
  notes: string | null;
  createdAt: string;
  meetingAt: string | null;
  meetingEndsAt: string | null;
  companyId: number;
  companyName: string;
  contactName: string;
  contactPhone: string | null;
  email: string;
}

const STATUSES = ["PENDING", "IN_REVIEW", "APPROVED", "COMPLETED", "REJECTED"] as const;

const STATUS_COLOR: Record<string, string> = {
  PENDING: "#F5841F",
  IN_REVIEW: "#3AADE0",
  APPROVED: "#78BE1F",
  COMPLETED: "#7C5CFF",
  REJECTED: "#D7263D",
};

const STATUS_LABEL: Record<string, string> = {
  PENDING: "New",
  IN_REVIEW: "In review",
  APPROVED: "Approved",
  COMPLETED: "Completed",
  REJECTED: "Declined",
};

/**
 * Every piece of work on the books, grouped by where it is in the pipeline.
 * Opening one shows who it's for and how to reach them, with a jump straight
 * to that company's profile.
 */
export function ProjectsTab({ onOpenCompany }: { onOpenCompany: (id: number) => void }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await api.get<{ projects: Project[] }>("/scheduling/projects");
      setProjects(data.projects);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load projects");
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter((p) =>
      [p.title, p.companyName, p.contactName, p.email].join(" ").toLowerCase().includes(q)
    );
  }, [projects, query]);

  const columns = useMemo(
    () => STATUSES.map((s) => ({ status: s, items: shown.filter((p) => p.status === s) })),
    [shown]
  );

  const open = projects.find((p) => p.id === openId) ?? null;

  const setStatus = async (id: number, status: string) => {
    setBusy(true);
    try {
      await api.patch(`/scheduling/projects/${id}/status`, { status });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update the project");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Projects</h1>
          <p className="text-gray-500 mt-2 text-lg">
            {projects.length} piece{projects.length === 1 ? "" : "s"} of work. Open one for the full brief.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search project, company or contact"
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-full text-sm font-bold outline-none focus:ring-2 focus:ring-gray-200 shadow-sm"
          />
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl bg-red-50 border border-red-100 px-5 py-3.5 font-bold text-red-700">{error}</div>
      )}

      {projects.length === 0 ? (
        <div className="text-center py-20 bg-white/50 rounded-[2.5rem] border border-white">
          <KanbanSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-bold text-lg">No projects yet.</p>
          <p className="text-gray-400">They appear here as clients book services.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
          {columns.map(({ status, items }) => (
            <div key={status}>
              <div className="flex items-center gap-2 mb-4 px-1">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: STATUS_COLOR[status] }} />
                <h3 className="font-black text-gray-900">{STATUS_LABEL[status]}</h3>
                <span className="text-sm font-bold text-gray-400">{items.length}</span>
              </div>

              <div className="space-y-3">
                {items.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setOpenId(p.id)}
                    className="w-full text-left bg-white/80 backdrop-blur-xl p-5 rounded-[1.75rem] border border-white shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all group"
                    style={{ borderLeft: `5px solid ${STATUS_COLOR[status]}` }}
                  >
                    <span
                      className="inline-block px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider mb-2"
                      style={{
                        background: `${SERVICE_COLOR[p.serviceType] ?? "#888"}18`,
                        color: SERVICE_COLOR[p.serviceType] ?? "#888",
                      }}
                    >
                      {SERVICE_LABEL[p.serviceType] ?? p.serviceType}
                    </span>
                    <p className="font-black text-gray-900 leading-tight mb-1 line-clamp-2">{p.title}</p>
                    <p className="text-sm font-bold text-gray-400 truncate">{p.companyName}</p>
                    {p.meetingAt && (
                      <p className="flex items-center gap-1.5 mt-2 text-xs font-bold text-gray-500">
                        <Clock className="w-3.5 h-3.5" /> {formatDateTime(p.meetingAt)}
                      </p>
                    )}
                  </button>
                ))}

                {items.length === 0 && (
                  <p className="text-sm font-bold text-gray-300 px-1">Nothing here.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail */}
      {open && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setOpenId(null)} />

          <div className="relative w-full max-w-2xl bg-[#FAF7F2] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-8 pb-6 flex-shrink-0 border-b border-black/[0.06]">
              <button
                onClick={() => setOpenId(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>

              <span
                className="inline-block px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider mb-3"
                style={{
                  background: `${SERVICE_COLOR[open.serviceType] ?? "#888"}18`,
                  color: SERVICE_COLOR[open.serviceType] ?? "#888",
                }}
              >
                {SERVICE_LABEL[open.serviceType] ?? open.serviceType}
              </span>
              <h2 className="text-3xl font-black text-gray-900 leading-tight pr-12">{open.title}</h2>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto p-8 space-y-6">
              {/* Who it's for */}
              <div className="bg-white rounded-[2rem] p-6 border border-white shadow-sm">
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-7 h-7 text-[#3AADE0]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-black uppercase tracking-wider text-gray-400">Client</p>
                      <h3 className="text-2xl font-black text-gray-900 truncate">{open.companyName}</h3>
                    </div>
                  </div>

                  {/* Straight to the full company profile */}
                  <button
                    onClick={() => { setOpenId(null); onOpenCompany(open.companyId); }}
                    title="Open the company profile"
                    className="w-11 h-11 rounded-xl bg-gray-900 text-white flex items-center justify-center flex-shrink-0 hover:scale-105 transition-transform"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  <Row icon={User} label="Contact" value={open.contactName} color="#F5841F" />
                  <Row
                    icon={Phone}
                    label="Phone"
                    value={open.contactPhone ?? "Not on file"}
                    color="#78BE1F"
                    href={open.contactPhone ? `tel:${open.contactPhone}` : undefined}
                  />
                  <Row icon={Mail} label="Email" value={open.email} color="#3AADE0" href={`mailto:${open.email}`} />
                </div>
              </div>

              {/* The brief */}
              <div className="bg-white rounded-[2rem] p-6 border border-white shadow-sm">
                <p className="text-[11px] font-black uppercase tracking-wider text-gray-400 mb-3">What they asked for</p>
                <p className="text-gray-700 font-medium leading-relaxed whitespace-pre-wrap">{open.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-5">
                  <Row icon={Clock} label="Meeting" value={open.meetingAt ? formatDateTime(open.meetingAt) : "Not set"} color="#7C5CFF" />
                  {open.location && <Row icon={MapPin} label="Location" value={open.location} color="#E91E8C" />}
                  {open.budgetRange && <Row icon={Wallet} label="Budget" value={open.budgetRange} color="#78BE1F" />}
                  <Row icon={KanbanSquare} label="Requested" value={formatDateTime(open.createdAt)} color="#8A8A8A" />
                </div>
              </div>

              {/* Pipeline */}
              <div className="bg-white rounded-[2rem] p-6 border border-white shadow-sm">
                <p className="text-[11px] font-black uppercase tracking-wider text-gray-400 mb-3">Stage</p>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      disabled={busy || open.status === s}
                      onClick={() => setStatus(open.id, s)}
                      className={`px-4 py-2.5 rounded-full text-sm font-bold transition-all disabled:cursor-default ${
                        open.status === s ? "text-white scale-105" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                      style={open.status === s ? { background: STATUS_COLOR[s] } : undefined}
                    >
                      {STATUS_LABEL[s]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ icon: Icon, label, value, color, href }: any) {
  const content = (
    <>
      <span
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}18`, color }}
      >
        <Icon className="w-4 h-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-[10px] font-black uppercase tracking-wider text-gray-400">{label}</span>
        <span className="block font-bold text-gray-900 truncate">{value}</span>
      </span>
    </>
  );

  const className = "flex items-center gap-3 p-3 rounded-2xl bg-gray-50 transition-colors";

  return href ? (
    <a href={href} className={`${className} hover:bg-gray-100`}>{content}</a>
  ) : (
    <div className={className}>{content}</div>
  );
}
