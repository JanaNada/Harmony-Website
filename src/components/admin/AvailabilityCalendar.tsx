"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Plus, Trash2, X, Check, CalendarDays, ChevronLeft, ChevronRight, Lock,
} from "lucide-react";
import {
  api, formatTime, SERVICE_COLOR, SERVICE_LABEL,
  type Slot, type SlotStatus,
} from "@/lib/api";

const BOOKABLE_SERVICES = ["MANAGEMENT", "EVENTS", "MARKETING", "RECRUITMENT", "TECHNOLOGY"];

/** Hours the admin can open up, 08:00 -> 20:00. */
const HOURS = Array.from({ length: 13 }, (_, i) => `${String(i + 8).padStart(2, "0")}:00`);

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const STATUS_STYLE: Record<SlotStatus, { bg: string; border: string; text: string; dot: string; label: string }> = {
  OPEN:      { bg: "bg-white",        border: "border-gray-200",     text: "text-gray-500",  dot: "#9CA3AF", label: "Available" },
  REQUESTED: { bg: "bg-[#F5841F]/12", border: "border-[#F5841F]/40", text: "text-[#B45F0B]", dot: "#F5841F", label: "Requested" },
  BOOKED:    { bg: "bg-[#3AADE0]/12", border: "border-[#3AADE0]/40", text: "text-[#1B6E92]", dot: "#3AADE0", label: "Booked" },
  CLOSED:    { bg: "bg-gray-100",     border: "border-gray-200",     text: "text-gray-400",  dot: "#D1D5DB", label: "Closed" },
};

/** Local YYYY-MM-DD — never toISOString, which would shift across timezones. */
const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const isSameDay = (a: Date, b: Date) => dayKey(a) === dayKey(b);

/**
 * Month calendar. Every day of the month is shown with dots for what's on it;
 * clicking a day opens that day's schedule beside the grid.
 */
export function AvailabilityCalendar({
  onOpenCompany,
  canEdit = true,
}: {
  onOpenCompany: (companyId: number) => void;
  /** Coordinators can read the calendar but not publish or remove times. */
  canEdit?: boolean;
}) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);

  const [cursor, setCursor] = useState(() => new Date());
  const [selected, setSelected] = useState<Date>(() => new Date());

  const [times, setTimes] = useState<string[]>([]);
  const [services, setServices] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await api.get<{ slots: Slot[] }>("/scheduling/slots");
      setSlots(data.slots);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load the calendar");
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  /** Slots bucketed by local day, so lookups per cell are cheap. */
  const byDay = useMemo(() => {
    const map = new Map<string, Slot[]>();
    for (const slot of slots) {
      const key = dayKey(new Date(slot.startsAt));
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(slot);
    }
    for (const list of map.values()) {
      list.sort((a, b) => a.startsAt.localeCompare(b.startsAt));
    }
    return map;
  }, [slots]);

  /** Six weeks starting on the Monday on or before the 1st. */
  const grid = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const offset = (first.getDay() + 6) % 7; // Sunday(0) -> 6
    const start = new Date(first);
    start.setDate(first.getDate() - offset);

    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [cursor]);

  const selectedSlots = byDay.get(dayKey(selected)) ?? [];
  const today = new Date();

  const toggle = (list: string[], value: string, set: (v: string[]) => void) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const publish = async () => {
    if (times.length === 0 || services.length === 0) return;
    setBusy(true);
    try {
      await api.post("/scheduling/slots", {
        starts: times.map((t) => `${dayKey(selected)} ${t}:00`),
        services,
        durationMinutes: 60,
      });
      setComposerOpen(false);
      setTimes([]);
      setServices([]);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save availability");
    } finally {
      setBusy(false);
    }
  };

  const removeSlot = async (id: number) => {
    try {
      await api.del(`/scheduling/slots/${id}`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not remove that slot");
    }
  };

  const monthLabel = cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const moveMonth = (delta: number) =>
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + delta, 1));

  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Calendar</h1>
          <p className="text-gray-500 mt-2 text-lg">
            {canEdit
              ? "Pick a day to see its schedule, or open up new times."
              : "Pick a day to see its schedule."}
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => setComposerOpen((v) => !v)}
            className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3.5 rounded-full font-bold shadow-xl hover:-translate-y-1 transition-all flex-shrink-0"
          >
            {composerOpen ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {composerOpen ? "Cancel" : "Add availability"}
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 rounded-2xl bg-red-50 border border-red-100 px-5 py-3.5 font-bold text-red-700">
          {error}
        </div>
      )}

      {!canEdit && (
        <div className="mb-6 rounded-2xl bg-gray-100 border border-gray-200 px-5 py-3.5 font-bold text-gray-500 flex items-center gap-2.5">
          <Lock className="w-4 h-4 flex-shrink-0" />
          Publishing meeting times is an admin task. You can still open any booking from here.
        </div>
      )}

      <div className="flex flex-col xl:flex-row gap-8 items-start">
        {/* Month grid */}
        <div className="w-full xl:flex-1 bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-lg p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => moveMonth(-1)}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-black text-gray-900">{monthLabel}</h2>
            <button
              onClick={() => moveMonth(1)}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1.5 mb-2">
            {WEEKDAYS.map((d) => (
              <div key={d} className="text-center text-[11px] font-black uppercase tracking-wider text-gray-400 py-1">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {grid.map((date) => {
              const key = dayKey(date);
              const daySlots = byDay.get(key) ?? [];
              const inMonth = date.getMonth() === cursor.getMonth();
              const isSelected = isSameDay(date, selected);
              const isToday = isSameDay(date, today);

              // At most three dots — enough to read the day at a glance.
              const dots = daySlots.slice(0, 3);

              return (
                <button
                  key={key}
                  onClick={() => setSelected(new Date(date))}
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border-2 ${
                    isSelected
                      ? "bg-gray-900 text-white border-gray-900 scale-105 shadow-lg"
                      : inMonth
                        ? "bg-white/80 border-transparent hover:border-gray-300 text-gray-900"
                        : "bg-transparent border-transparent text-gray-300 hover:bg-white/50"
                  }`}
                >
                  <span className={`text-sm font-black ${isToday && !isSelected ? "text-[#F5841F]" : ""}`}>
                    {date.getDate()}
                  </span>

                  <span className="flex items-center gap-0.5 h-1.5">
                    {dots.map((s) => (
                      <span
                        key={s.id}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: isSelected ? "#fff" : STATUS_STYLE[s.status].dot }}
                      />
                    ))}
                    {daySlots.length > 3 && (
                      <span className={`text-[8px] font-black ml-0.5 ${isSelected ? "text-white" : "text-gray-400"}`}>
                        +{daySlots.length - 3}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-gray-100">
            {(["OPEN", "REQUESTED", "BOOKED"] as SlotStatus[]).map((s) => (
              <span key={s} className="flex items-center gap-2 text-xs font-bold text-gray-500">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: STATUS_STYLE[s].dot }} />
                {STATUS_STYLE[s].label}
              </span>
            ))}
          </div>
        </div>

        {/* Selected day */}
        <div className="w-full xl:w-[420px] flex-shrink-0 space-y-5">
          <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-lg p-6 md:p-8">
            <h3 className="text-xl font-black text-gray-900 mb-1">
              {selected.toLocaleDateString(undefined, { weekday: "long" })}
            </h3>
            <p className="text-gray-400 font-bold mb-6">
              {selected.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}
            </p>

            {selectedSlots.length === 0 ? (
              <div className="text-center py-10">
                <CalendarDays className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-bold">Nothing on this day.</p>
                {canEdit && <p className="text-gray-400 text-sm">Use "Add availability" to open some times.</p>}
              </div>
            ) : (
              <div className="space-y-3">
                {selectedSlots.map((slot) => {
                  const style = STATUS_STYLE[slot.status];
                  const clickable = slot.companyId !== null;

                  return (
                    <div
                      key={slot.id}
                      onClick={() => clickable && onOpenCompany(slot.companyId!)}
                      role={clickable ? "button" : undefined}
                      tabIndex={clickable ? 0 : undefined}
                      onKeyDown={(e) => {
                        if (clickable && (e.key === "Enter" || e.key === " ")) {
                          e.preventDefault();
                          onOpenCompany(slot.companyId!);
                        }
                      }}
                      className={`rounded-2xl border-2 p-4 transition-all ${style.bg} ${style.border} ${
                        clickable ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-md" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-black text-gray-900">
                          {formatTime(slot.startsAt)} – {formatTime(slot.endsAt)}
                        </span>
                        <span className={`text-[10px] font-black uppercase tracking-wider ${style.text}`}>
                          {style.label}
                        </span>
                      </div>

                      {slot.companyName ? (
                        <p className="text-sm font-bold text-gray-700 truncate">{slot.companyName}</p>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {slot.services.map((s) => (
                            <span
                              key={s}
                              className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md"
                              style={{ background: `${SERVICE_COLOR[s] ?? "#888"}18`, color: SERVICE_COLOR[s] ?? "#888" }}
                            >
                              {SERVICE_LABEL[s] ?? s}
                            </span>
                          ))}
                        </div>
                      )}

                      {slot.status === "OPEN" && canEdit && (
                        <button
                          onClick={(e) => { e.stopPropagation(); removeSlot(slot.id); }}
                          className="mt-2.5 flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Composer, scoped to the selected day */}
          {composerOpen && canEdit && (
            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-xl p-6 md:p-8 space-y-6">
              <div>
                <h4 className="font-black text-gray-900 text-lg">Open up times</h4>
                <p className="text-sm font-bold text-gray-400">
                  on {selected.toLocaleDateString(undefined, { day: "numeric", month: "long" })}
                </p>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                  Times you're free
                </label>
                <div className="flex flex-wrap gap-2">
                  {HOURS.map((h) => {
                    const taken = selectedSlots.some((s) => formatTime(s.startsAt) === formatTime(`${dayKey(selected)}T${h}:00`));
                    return (
                      <button
                        key={h}
                        disabled={taken}
                        onClick={() => toggle(times, h, setTimes)}
                        title={taken ? "Already on the calendar" : undefined}
                        className={`px-3.5 py-2 rounded-full text-sm font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                          times.includes(h) ? "bg-gray-900 text-white scale-105" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {h}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                  Available for which services
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setServices(services.length === BOOKABLE_SERVICES.length ? [] : [...BOOKABLE_SERVICES])}
                    className="px-3.5 py-2 rounded-full text-sm font-black bg-gray-900 text-white hover:scale-105 transition-transform"
                  >
                    {services.length === BOOKABLE_SERVICES.length ? "Clear all" : "All services"}
                  </button>
                  {BOOKABLE_SERVICES.map((s) => (
                    <button
                      key={s}
                      onClick={() => toggle(services, s, setServices)}
                      className={`px-3.5 py-2 rounded-full text-sm font-bold transition-all border-2 ${
                        services.includes(s) ? "scale-105" : "border-transparent bg-gray-100 text-gray-500"
                      }`}
                      style={services.includes(s) ? {
                        background: `${SERVICE_COLOR[s]}18`,
                        color: SERVICE_COLOR[s],
                        borderColor: SERVICE_COLOR[s],
                      } : undefined}
                    >
                      {SERVICE_LABEL[s]}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={publish}
                disabled={times.length === 0 || services.length === 0 || busy}
                className="w-full flex items-center justify-center gap-2 bg-[#F5841F] text-white px-7 py-3.5 rounded-full font-black shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] transition-transform"
              >
                <Check className="w-5 h-5" />
                {busy ? "Publishing…" : `Publish ${times.length || ""} slot${times.length === 1 ? "" : "s"}`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
