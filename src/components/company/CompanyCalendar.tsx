"use client";

import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import {
  formatTime,
  SERVICE_COLOR,
  SERVICE_LABEL,
} from "@/lib/api";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Local YYYY-MM-DD — never toISOString, which would shift across timezones. */
const dayKey = (d: Date | string) => {
  const date = d instanceof Date ? d : new Date(d);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

export interface CalendarEvent {
  id: number;
  title: string;
  serviceType: string;
  status: string;
  meetingAt: string | null;
}

/**
 * Read-only month calendar for the company portal.
 *
 * Shows every service request that has a confirmed meeting time, bucketed by
 * day. The company can flip through months and click a day to see its meetings,
 * but they can't create, move, or delete anything — that's staff-only.
 */
export function CompanyCalendar({ events }: { events: CalendarEvent[] }) {
  const [cursor, setCursor] = useState(() => new Date());
  const [selected, setSelected] = useState(() => new Date());

// Any request with a confirmed meeting time belongs on the calendar.
  // A time can exist before the request reaches APPROVED, so filtering by
  // status here hides real meetings.
  const upcomingEvents = useMemo(
    () => events.filter((e) => e.meetingAt),
    [events]
  );

  /** Events bucketed by local day, so lookups per cell are cheap. */
  const byDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const event of upcomingEvents) {
      if (!event.meetingAt) continue;
      const key = dayKey(new Date(event.meetingAt));
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(event);
    }
    for (const list of map.values()) {
      list.sort((a, b) => (a.meetingAt ?? "").localeCompare(b.meetingAt ?? ""));
    }
    return map;
  }, [upcomingEvents]);

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

  const selectedEvents = byDay.get(dayKey(selected)) ?? [];
  const today = new Date();

  const monthLabel = cursor.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
  const moveMonth = (delta: number) =>
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + delta, 1));

  return (
    <div className="animate-in fade-in duration-700">
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
              <div
                key={d}
                className="text-center text-[11px] font-black uppercase tracking-wider text-gray-400 py-1"
              >
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {grid.map((date) => {
              const key = dayKey(date);
              const dayEvents = byDay.get(key) ?? [];
              const inMonth = date.getMonth() === cursor.getMonth();
              const isSelected = dayKey(date) === dayKey(selected);
              const isToday = dayKey(date) === dayKey(today);

              // At most three dots — enough to read the day at a glance.
              const dots = dayEvents.slice(0, 3);

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
                  <span
                    className={`text-sm font-black ${isToday && !isSelected ? "text-[#F5841F]" : ""}`}
                  >
                    {date.getDate()}
                  </span>

                  <span className="flex items-center gap-0.5 h-1.5">
                    {dots.map((e) => (
                      <span
                        key={e.id}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background:
                            isSelected ? "#fff" : SERVICE_COLOR[e.serviceType] ?? "#888",
                        }}
                      />
                    ))}
                    {dayEvents.length > 3 && (
                      <span
                        className={`text-[8px] font-black ml-0.5 ${isSelected ? "text-white" : "text-gray-400"}`}
                      >
                        +{dayEvents.length - 3}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected day */}
        <div className="w-full xl:w-[420px] flex-shrink-0 space-y-5">
          <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-lg p-6 md:p-8">
            <h3 className="text-xl font-black text-gray-900 mb-1">
              {selected.toLocaleDateString(undefined, { weekday: "long" })}
            </h3>
            <p className="text-gray-400 font-bold mb-6">
              {selected.toLocaleDateString(undefined, {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>

            {selectedEvents.length === 0 ? (
              <div className="text-center py-10">
                <CalendarDays className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-bold">No meetings on this day.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedEvents.map((event) => (
                  <div
                    key={event.id}
                    className="rounded-2xl border-2 border-gray-100 p-4 transition-all"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-black text-gray-900">
                        {formatTime(event.meetingAt!)}
                      </span>
                      <span
                        className="inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider"
                        style={{
                          background: `${SERVICE_COLOR[event.serviceType] ?? "#888"}18`,
                          color: SERVICE_COLOR[event.serviceType] ?? "#888",
                        }}
                      >
                        {SERVICE_LABEL[event.serviceType] ?? event.serviceType}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {event.title}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}