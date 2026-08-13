"use client";

import { useEffect, useRef, useState } from "react";
import {
  MessageCircle, X, ArrowLeft, RotateCcw, ChevronRight,
  CalendarDays, Phone, Building2, Target, Images, User, LogIn,
} from "lucide-react";
import { SERVICES, SERVICE_BY_ID, type ServiceId } from "@/content/services";
import { useBrief } from "@/state/BriefContext";
import { useAuth } from "@/app/auth";
import type { Page } from "@/app/routes";

const C_ORANGE = "#F5841F";
const C_PINK = "#E91E8C";

interface Option {
  label: string;
  /** Where clicking takes them, if anywhere. */
  go?: Page;
  /** Which menu to show next, if it stays in the chat. */
  next?: string;
  color?: string;
  icon?: any;
  hint?: string;
}

interface Node {
  text: string;
  options: Option[];
}

interface Entry {
  from: "bot" | "user";
  text: string;
  options?: Option[];
}

/**
 * A button-driven guide to the site.
 *
 * Menus are generated from the same SERVICES data the pages render from, so a
 * service added there shows up here without anyone remembering to update a
 * second list.
 */
function buildNode(key: string, signedIn: boolean, isStaff: boolean, briefCount: number): Node {
  if (key === "root") {
    return {
      text: "Hi. I can take you anywhere on the site — what are you after?",
      options: [
        { label: "Explore the services", next: "services", icon: Target, color: C_ORANGE },
        ...(isStaff ? [] : [{ label: "Book an appointment", go: "booking" as Page, icon: CalendarDays, color: C_PINK }]),
        { label: "Who is Harmony?", next: "company", icon: Building2, color: "#3AADE0" },
        { label: "See our work", go: "stories" as Page, icon: Images, color: "#78BE1F" },
        { label: "Talk to a person", go: "contact" as Page, icon: Phone, color: C_ORANGE },
        signedIn
          ? { label: "My profile", go: "dashboard" as Page, icon: User, color: "#7C5CFF" }
          : { label: "Sign in", go: "login" as Page, icon: LogIn, color: "#7C5CFF" },
      ],
    };
  }

  if (key === "services") {
    return {
      text: "We work across four areas plus our technology arm. Which one fits?",
      options: [
        ...SERVICES.map((s) => ({
          label: s.label,
          hint: s.tagline,
          next: `service:${s.id}`,
          color: s.color,
        })),
        { label: "Show me all of them side by side", go: "services", color: "#666" },
      ],
    };
  }

  if (key.startsWith("service:")) {
    const id = key.slice("service:".length) as ServiceId;
    const svc = SERVICE_BY_ID[id];

    if (!svc) return buildNode("services", signedIn, isStaff, briefCount);

    return {
      text: `${svc.label} — ${svc.promise}`,
      options: [
        { label: `Open the ${svc.label} page`, go: id, color: svc.color },
        // The groups tell them what's inside before they commit to a click.
        ...svc.groups.map((g) => ({
          label: g.title,
          hint: `${g.modules.length} option${g.modules.length === 1 ? "" : "s"}`,
          go: id,
          color: svc.color,
        })),
        ...(isStaff ? [] : [{ label: "Book this service", go: "booking" as Page, color: C_PINK, icon: CalendarDays }]),
        { label: "Back to all services", next: "services", color: "#666" },
      ],
    };
  }

  if (key === "company") {
    return {
      text: "Harmony Club House has been building and fixing hospitality businesses since 2012.",
      options: [
        { label: "About us", go: "about", color: C_ORANGE },
        { label: "Mission & vision", go: "mission", color: C_PINK },
        { label: "Our portfolio", go: "stories", color: "#78BE1F" },
        { label: "Back", next: "root", color: "#666" },
      ],
    };
  }

  return buildNode("root", signedIn, isStaff, briefCount);
}

export function ChatNavigator({ go }: { go: (p: Page) => void }) {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<string[]>(["root"]);
  const [entries, setEntries] = useState<Entry[]>([]);

  const { user } = useAuth();
  const { count } = useBrief();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const signedIn = !!user;
  const isStaff = user?.role === "ADMIN" || user?.role === "COORDINATOR";

  // Seed the opening message the first time it's opened.
  useEffect(() => {
    if (open && entries.length === 0) {
      const node = buildNode("root", signedIn, isStaff, count);
      setEntries([{ from: "bot", text: node.text, options: node.options }]);
    }
  }, [open, entries.length, signedIn, isStaff, count]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries.length]);

  const pushNode = (key: string, chosenLabel: string) => {
    const node = buildNode(key, signedIn, isStaff, count);
    setHistory((h) => [...h, key]);
    setEntries((e) => [
      ...e,
      { from: "user", text: chosenLabel },
      { from: "bot", text: node.text, options: node.options },
    ]);
  };

  const choose = (opt: Option) => {
    if (opt.next) {
      pushNode(opt.next, opt.label);
      return;
    }

    if (opt.go) {
      go(opt.go);
      setEntries((e) => [
        ...e,
        { from: "user", text: opt.label },
        {
          from: "bot",
          text: "Taking you there now. Anything else?",
          options: buildNode("root", signedIn, isStaff, count).options,
        },
      ]);
      setHistory((h) => [...h, "root"]);
    }
  };

  const goBack = () => {
    if (history.length < 2) return;
    const previous = history[history.length - 2];
    const node = buildNode(previous, signedIn, isStaff, count);
    setHistory((h) => h.slice(0, -1));
    setEntries((e) => [...e, { from: "bot", text: node.text, options: node.options }]);
  };

  const restart = () => {
    setHistory(["root"]);
    const node = buildNode("root", signedIn, isStaff, count);
    setEntries([{ from: "bot", text: node.text, options: node.options }]);
  };

  // Sit above the brief bar when it's on screen.
  const launcherOffset = count > 0 ? "bottom-28" : "bottom-6";

  // Only the newest bot message keeps its buttons live.
  const lastBotIndex = entries.map((e) => e.from).lastIndexOf("bot");

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close the guide" : "Open the guide"}
        className={`fixed ${launcherOffset} right-6 z-[80] w-14 h-14 rounded-full text-white shadow-[0_16px_32px_-12px_rgba(233,30,140,0.6)] flex items-center justify-center transition-transform hover:scale-110`}
        style={{ background: `linear-gradient(135deg, ${C_ORANGE}, ${C_PINK})` }}
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Panel */}
      {open && (
        <div
          className={`fixed ${count > 0 ? "bottom-44" : "bottom-24"} right-6 z-[80] w-[min(370px,calc(100vw-3rem))] max-h-[min(560px,calc(100vh-10rem))] bg-white rounded-[28px] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.3)] border border-black/[0.06] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-200`}
        >
          {/* Header */}
          <div
            className="px-5 py-4 flex items-center justify-between flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${C_ORANGE}, ${C_PINK})` }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-4.5 h-4.5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="font-black text-white leading-tight">Harmony guide</p>
                <p className="text-[11px] font-bold text-white/70 leading-tight">Tap to get around</p>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              {history.length > 1 && (
                <button onClick={goBack} aria-label="Back" className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <button onClick={restart} aria-label="Start over" className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Conversation */}
          <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-3 bg-[#FAF7F2]">
            {entries.map((entry, i) => (
              <div key={i}>
                {entry.from === "user" ? (
                  <div className="flex justify-end">
                    <span className="max-w-[80%] rounded-2xl rounded-br-md px-4 py-2.5 bg-gray-900 text-white text-sm font-bold">
                      {entry.text}
                    </span>
                  </div>
                ) : (
                  <div className="flex justify-start">
                    <span className="max-w-[85%] rounded-2xl rounded-bl-md px-4 py-3 bg-white text-[#1a1a1a] text-sm font-medium leading-relaxed shadow-sm border border-black/[0.04]">
                      {entry.text}
                    </span>
                  </div>
                )}

                {entry.options && i === lastBotIndex && (
                  <div className="flex flex-col gap-2 mt-3">
                    {entry.options.map((opt) => (
                      <button
                        key={opt.label}
                        onClick={() => choose(opt)}
                        className="group w-full text-left bg-white border border-black/[0.07] rounded-2xl px-4 py-3 hover:border-transparent hover:shadow-md transition-all flex items-center gap-3"
                        style={{ borderLeft: `4px solid ${opt.color ?? "#ddd"}` }}
                      >
                        {opt.icon && (
                          <opt.icon className="w-4 h-4 flex-shrink-0" style={{ color: opt.color ?? "#666" }} />
                        )}
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-bold text-[#1a1a1a] truncate">{opt.label}</span>
                          {opt.hint && (
                            <span className="block text-[11.5px] font-semibold text-[#1a1a1a]/40 truncate">
                              {opt.hint}
                            </span>
                          )}
                        </span>
                        <ChevronRight className="w-4 h-4 text-[#1a1a1a]/20 group-hover:text-[#1a1a1a]/50 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        </div>
      )}
    </>
  );
}
