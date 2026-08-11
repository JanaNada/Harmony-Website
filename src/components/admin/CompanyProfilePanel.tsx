"use client";

import { useCallback, useEffect, useState } from "react";
import {
  X, Phone, Mail, Building2, CalendarClock, MessageSquare, Check, Clock, AlertCircle,
} from "lucide-react";
import {
  api, formatDateTime, SERVICE_COLOR, SERVICE_LABEL,
  type CompanyProfile, type Slot,
} from "@/lib/api";
import { ChatPanel } from "@/components/chat/ChatPanel";

/**
 * Everything about one company in a slide-over: how to reach them, what they
 * asked for, when the meeting is, and a way to propose a different time.
 *
 * Chat lives inside each appointment rather than at company level, because a
 * conversation only makes sense once there is a booking to talk about.
 */
export function CompanyProfilePanel({
  companyId,
  onClose,
  onChanged,
}: {
  companyId: number;
  onClose: () => void;
  onChanged?: () => void;
}) {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  /** Which appointment's chat is expanded, if any. */
  const [chatFor, setChatFor] = useState<number | null>(null);

  // Reschedule composer state
  const [openSlots, setOpenSlots] = useState<Slot[]>([]);
  const [reschedulingFor, setReschedulingFor] = useState<number | null>(null);
  const [chosenSlot, setChosenSlot] = useState<string>("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await api.get<CompanyProfile>(`/scheduling/companies/${companyId}`);
      setProfile(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load company");
    }
  }, [companyId]);

  useEffect(() => { load(); }, [load]);

  const startReschedule = async (requestId: number) => {
    setReschedulingFor(requestId);
    setChosenSlot("");
    setNote("");
    try {
      const data = await api.get<{ slots: Slot[] }>("/scheduling/slots");
      setOpenSlots(data.slots.filter((s) => s.status === "OPEN"));
    } catch {
      setOpenSlots([]);
    }
  };

  const submitReschedule = async () => {
    if (!chosenSlot || !reschedulingFor) return;
    setBusy(true);
    try {
      await api.post(`/scheduling/requests/${reschedulingFor}/reschedule`, {
        slotId: Number(chosenSlot),
        message: note.trim() || undefined,
      });
      setReschedulingFor(null);
      await load();
      onChanged?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not propose a new time");
    } finally {
      setBusy(false);
    }
  };

  const company = profile?.company;
  const pendingReschedules = profile?.reschedules.filter((r) => r.status === "PENDING") ?? [];

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-[#FAF7F2] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-8 pb-0 flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          {error && (
            <div className="mb-4 rounded-2xl bg-red-50 border border-red-100 px-5 py-3 text-sm font-bold text-red-700">
              {error}
            </div>
          )}

          {company && (
            <>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                  <Building2 className="w-8 h-8 text-[#F5841F]" />
                </div>
                <div className="min-w-0 pt-1">
                  <h2 className="text-3xl font-black text-gray-900 leading-tight truncate">
                    {company.companyName}
                  </h2>
                  <p className="text-gray-500 font-bold">{company.contactName}</p>
                </div>
              </div>

              {/* The two contact actions */}
              <div className="flex gap-3 mb-6">
                <a
                  href={company.contactPhone ? `tel:${company.contactPhone}` : undefined}
                  aria-disabled={!company.contactPhone}
                  title={company.contactPhone ?? "No phone number on file"}
                  className={`flex items-center gap-2.5 px-5 py-3 rounded-full font-bold text-sm transition-all ${
                    company.contactPhone
                      ? "bg-[#78BE1F]/10 text-[#78BE1F] hover:bg-[#78BE1F]/20 hover:-translate-y-0.5"
                      : "bg-gray-100 text-gray-400 pointer-events-none"
                  }`}
                >
                  <Phone className="w-4 h-4" />
                  {company.contactPhone ?? "No phone"}
                </a>
                <a
                  href={`mailto:${company.email}`}
                  title={company.email}
                  className="flex items-center gap-2.5 px-5 py-3 rounded-full font-bold text-sm bg-[#3AADE0]/10 text-[#3AADE0] hover:bg-[#3AADE0]/20 hover:-translate-y-0.5 transition-all min-w-0"
                >
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{company.email}</span>
                </a>
              </div>

              <div className="flex items-center gap-2 pb-3 border-b border-gray-200 text-sm font-bold text-gray-400">
                <CalendarClock className="w-4 h-4" />
                Requested appointments
              </div>
            </>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 p-8 pt-6">
          {profile && (
            <div className="h-full overflow-y-auto space-y-6 pr-1">
              {pendingReschedules.length > 0 && (
                <div className="rounded-2xl bg-[#F5841F]/10 border border-[#F5841F]/20 p-5">
                  <p className="font-black text-gray-900 flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-[#F5841F]" />
                    Waiting on the company
                  </p>
                  {pendingReschedules.map((r) => (
                    <p key={r.id} className="text-sm text-gray-600 font-medium">
                      You proposed {formatDateTime(r.proposedAt)} — not answered yet.
                    </p>
                  ))}
                </div>
              )}

              {profile.requests.length === 0 && (
                <p className="text-gray-400 font-medium text-center py-10">
                  This company hasn't requested anything yet.
                </p>
              )}

              {profile.requests.map((r) => (
                <div key={r.id} className="bg-white rounded-[2rem] p-6 border border-white shadow-sm">
                  <div className="flex items-start justify-between gap-4 mb-3">
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
                      <h4 className="text-xl font-black text-gray-900 leading-tight">{r.title}</h4>
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-gray-400 flex-shrink-0">
                      {r.status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 font-medium leading-relaxed mb-4">{r.description}</p>

                  <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 mb-4">
                    <CalendarClock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm font-bold text-gray-900">
                      {r.meetingAt ? formatDateTime(r.meetingAt) : "No meeting time chosen"}
                    </span>
                  </div>

                  {reschedulingFor === r.id ? (
                    <div className="space-y-3 border-t border-gray-100 pt-4">
                      {openSlots.length === 0 ? (
                        <p className="text-sm font-bold text-amber-700 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          No free slots. Add availability in the Calendar tab first.
                        </p>
                      ) : (
                        <>
                          <select
                            value={chosenSlot}
                            onChange={(e) => setChosenSlot(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-bold outline-none focus:border-[#F5841F] bg-white"
                          >
                            <option value="">Choose a new time…</option>
                            {openSlots.map((s) => (
                              <option key={s.id} value={s.id}>{formatDateTime(s.startsAt)}</option>
                            ))}
                          </select>
                          <input
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Optional note to the company"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium outline-none focus:border-[#F5841F] bg-white"
                          />
                        </>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={submitReschedule}
                          disabled={!chosenSlot || busy}
                          className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-full font-bold text-sm disabled:opacity-40 hover:scale-105 transition-transform"
                        >
                          <Check className="w-4 h-4" />
                          {busy ? "Sending…" : "Send proposal"}
                        </button>
                        <button
                          onClick={() => setReschedulingFor(null)}
                          className="px-5 py-2.5 rounded-full font-bold text-sm text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-5">
                      <button
                        onClick={() => startReschedule(r.id)}
                        className="flex items-center gap-2 text-sm font-bold text-[#F5841F] hover:gap-3 transition-all"
                      >
                        <CalendarClock className="w-4 h-4" />
                        Request a different meeting time
                      </button>

                      {/* Chat belongs to this appointment. */}
                      <button
                        onClick={() => setChatFor(chatFor === r.id ? null : r.id)}
                        className={`flex items-center gap-2 text-sm font-bold transition-all ${
                          chatFor === r.id ? "text-gray-900" : "text-[#E91E8C] hover:gap-3"
                        }`}
                      >
                        <MessageSquare className="w-4 h-4" />
                        {chatFor === r.id ? "Hide chat" : "Open chat"}
                      </button>
                    </div>
                  )}

                  {chatFor === r.id && (
                    <div className="mt-5 h-[420px]">
                      <ChatPanel requestId={r.id} title={`Chat about "${r.title}"`} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
