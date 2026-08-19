"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search, Building2, Phone, Mail, Clock, ArrowRight, CheckCircle2, Users, MessageCircle,
} from "lucide-react";
import {
  api, formatDateTime, SERVICE_COLOR, SERVICE_LABEL,
} from "@/lib/api";

export interface ClientRow {
  id: number;
  companyName: string;
  contactName: string;
  contactPhone: string | null;
  email: string;
  isActive: boolean;
  createdAt: string;
  requestCount: number;
  openCount: number;
  bookedMeetingAt: string | null;
  services: string[];
}

/**
 * Companies and CRM, merged.
 *
 * The old CRM tab was a single hand-written contact record; the Companies tab
 * was a grid of names. They were two halves of the same thing, so this is one
 * searchable client list where every row opens the full profile — contacts,
 * requests, meeting, reschedule and chat all in one place.
 */
export function ClientsTab({ onOpenCompany }: { onOpenCompany: (id: number) => void }) {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "open" | "upcoming">("all");

  const load = useCallback(async () => {
    try {
      const clientData = await api.get<{ companies: ClientRow[] }>("/scheduling/companies");
      setClients(clientData.companies);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load clients");
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return clients.filter((c) => {
      if (filter === "open" && c.openCount === 0) return false;
      if (filter === "upcoming" && !c.bookedMeetingAt) return false;
      if (!q) return true;
      // Search everything staff would actually type.
      return [c.companyName, c.contactName, c.email, c.contactPhone ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [clients, query, filter]);

  const totalOpen = clients.reduce((sum, c) => sum + c.openCount, 0);

  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Clients</h1>
          <p className="text-gray-500 mt-2 text-lg">
            {clients.length} compan{clients.length === 1 ? "y" : "ies"}
            {totalOpen > 0 && ` · ${totalOpen} request${totalOpen === 1 ? "" : "s"} waiting`}
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, contact, email or phone"
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-full text-sm font-bold outline-none focus:ring-2 focus:ring-gray-200 shadow-sm"
          />
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl bg-red-50 border border-red-100 px-5 py-3.5 font-bold text-red-700">{error}</div>
      )}

      <div className="flex flex-wrap gap-2 mb-8">
        {([
          ["all", `Everyone (${clients.length})`],
          ["open", `Waiting on us (${clients.filter((c) => c.openCount > 0).length})`],
          ["upcoming", `Meeting booked (${clients.filter((c) => c.bookedMeetingAt).length})`],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
              filter === key ? "bg-gray-900 text-white" : "bg-white/70 text-gray-500 hover:bg-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="text-center py-20 bg-white/50 rounded-[2.5rem] border border-white">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-bold text-lg">
            {clients.length === 0 ? "No clients yet." : "Nothing matches that."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {shown.map((c) => (
            <div
              key={c.id}
              className="bg-white/70 backdrop-blur-xl p-7 rounded-[2.5rem] border border-white shadow-[0_15px_35px_-10px_rgba(0,0,0,0.06)] hover:bg-white transition-all group"
            >
              <div className="flex items-start justify-between gap-4 mb-5">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center flex-shrink-0 shadow-inner">
                    <Building2 className="w-7 h-7 text-[#3AADE0]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-2xl font-black text-gray-900 truncate">{c.companyName}</h3>
                    <p className="text-gray-500 font-bold truncate">{c.contactName}</p>
                  </div>
                </div>

                <span
                  className={`px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider flex-shrink-0 ${
                    c.isActive ? "bg-[#78BE1F]/10 text-[#78BE1F]" : "bg-red-100 text-red-600"
                  }`}
                >
                  {c.isActive ? "Active" : "Disabled"}
                </span>
              </div>

              {/* Contact routes, straight from the card */}
              <div className="flex flex-wrap gap-2 mb-5">
                <a
                  href={c.contactPhone ? `tel:${c.contactPhone}` : undefined}
                  onClick={(e) => e.stopPropagation()}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm transition-all ${
                    c.contactPhone
                      ? "bg-[#78BE1F]/10 text-[#78BE1F] hover:bg-[#78BE1F]/20"
                      : "bg-gray-100 text-gray-400 pointer-events-none"
                  }`}
                >
                  <Phone className="w-4 h-4" />
                  {c.contactPhone ?? "No phone"}
                </a>
                {c.contactPhone && (
                  <a
                    href={`https://wa.me/${c.contactPhone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </a>
                )}
                <a
                  href={`mailto:${c.email}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm bg-[#3AADE0]/10 text-[#3AADE0] hover:bg-[#3AADE0]/20 transition-all min-w-0 max-w-full"
                >
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{c.email}</span>
                </a>
              </div>

              {c.services.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {c.services.map((s) => (
                    <span
                      key={s}
                      className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md"
                      style={{ background: `${SERVICE_COLOR[s] ?? "#888"}18`, color: SERVICE_COLOR[s] ?? "#888" }}
                    >
                      {SERVICE_LABEL[s] ?? s}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 mb-5">
                {c.bookedMeetingAt ? (
                  <>
                    <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm font-bold text-gray-900">{formatDateTime(c.bookedMeetingAt)}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-gray-300 flex-shrink-0" />
                    <span className="text-sm font-bold text-gray-400">No meeting booked</span>
                  </>
                )}
              </div>

              <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                <span className="text-sm font-bold text-gray-400">
                  {c.requestCount} request{c.requestCount === 1 ? "" : "s"}
                  {c.openCount > 0 && (
                    <span className="ml-2 text-[#F5841F]">{c.openCount} waiting</span>
                  )}
                </span>
                <button
                  onClick={() => onOpenCompany(c.id)}
                  className="flex items-center gap-2 text-sm font-bold text-gray-900 hover:gap-3 transition-all"
                >
                  Open profile
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
