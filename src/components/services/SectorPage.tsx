"use client";

import { useState } from "react";
import { Check, Plus, ArrowRight, ChevronDown } from "lucide-react";
import { ImageWithFallback } from "@/components";
import { useBrief } from "@/state/BriefContext";
import { useAuth, isStaffRole } from "@/app/auth";
import type { Service, ServiceModule } from "@/content/services";

/* ── A single selectable module ─────────────────────────────────────────────
   The whole card toggles selection; the arrow in the corner opens the detail
   instead, so learning more never costs you an accidental add.
   ────────────────────────────────────────────────────────────────────────── */

export function ModuleCard({
  module: m,
  color,
  dim,
  disabled,
}: {
  module: ServiceModule;
  color: string;
  dim: string;
  /** When true, the card can be inspected but not added/removed from the brief. */
  disabled?: boolean;
}) {
  const { has, toggle } = useBrief();
  const [open, setOpen] = useState(false);
  const on = has(m.id);

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      onClick={disabled ? undefined : () => toggle(m.id)}
      onKeyDown={
        disabled
          ? undefined
          : (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggle(m.id);
              }
            }
      }
      aria-pressed={on}
      className={`group relative text-left rounded-[26px] border transition-all duration-300 flex flex-col overflow-hidden ${
        disabled
          ? "cursor-not-allowed opacity-75"
          : "cursor-pointer"
      } ${
        on
          ? "bg-white shadow-[0_18px_40px_-18px_rgba(0,0,0,0.16)] -translate-y-0.5"
          : "bg-white/60 border-white/70 hover:bg-white hover:shadow-[0_14px_30px_-16px_rgba(0,0,0,0.12)] hover:-translate-y-0.5"
      }`}
      style={on ? { borderColor: color, boxShadow: `0 0 0 1px ${color}` } : undefined}
    >
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3 mb-4">
          <span
            className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
            style={{ background: dim, color }}
          >
            <m.icon size={20} />
          </span>

          <span
            className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
              on
                ? "text-white scale-100"
                : "text-[#1a1a1a]/25 bg-black/[0.04] group-hover:bg-black/[0.07]"
            }`}
            style={on ? { background: color } : undefined}
          >
            {on ? <Check size={15} strokeWidth={3} /> : <Plus size={15} strokeWidth={2.5} />}
          </span>
        </div>

        <h4 className="font-bold text-2xl text-[#1a1a1a] mb-2 leading-[1.3]">
          {m.label}
        </h4>
        <p className="text-base leading-[1.65] text-[#1a1a1a]/55 font-medium flex-1">
          {m.desc}
        </p>

        {/* Status + the expand control */}
        <div className="flex items-end justify-between gap-3 mt-4">
          <span
            className={`text-sm font-bold uppercase tracking-widest transition-colors ${
              on ? "" : "text-[#1a1a1a]/30 group-hover:text-[#1a1a1a]/50"
            }`}
            style={on ? { color } : undefined}
          >
            {on ? "Added to your brief" : "Add to brief"}
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((v) => !v);
            }}
            aria-expanded={open}
            aria-label={open ? `Hide details about ${m.label}` : `More about ${m.label}`}
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:scale-110"
            style={{ background: open ? color : dim, color: open ? "#fff" : color }}
          >
            <ChevronDown
              size={16}
              strokeWidth={2.5}
              className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Detail drawer */}
      <div
        className={`grid transition-all duration-500 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className={`overflow-hidden ${open ? "" : "invisible"}`}>
          <div className="px-6 pb-6">
            <div className="relative w-full aspect-[16/10] rounded-[18px] overflow-hidden mb-4 bg-black/[0.04]">
              <ImageWithFallback
                src={m.image}
                alt={m.label}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm leading-[1.75] text-[#1a1a1a]/65 font-medium">
              {m.long}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── The page ───────────────────────────────────────────────────────────── */

export function SectorPage({
  service,
  onBook,
  story,
}: {
  service: Service;
  onBook: () => void;
  /** Optional editorial block shown under the intro (e.g. the ice-cream story). */
  story?: React.ReactNode;
}) {
  const { addMany, removeMany, countFor, has } = useBrief();
  const { user } = useAuth();
  const isStaff = isStaffRole(user?.role);
  const chosen = countFor(service.id);
  const allIds = service.groups.flatMap((g) => g.modules.map((m) => m.id));
  const allOn = allIds.every((id) => has(id));

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF7F2] text-[#1a1a1a] relative">
      {/* Ambient wash, tinted to the service */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div
          className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] blur-[130px] rounded-full mix-blend-multiply opacity-[0.18]"
          style={{ background: service.color }}
        />
        <div className="absolute top-[45%] -right-[10%] w-[55vw] h-[55vw] bg-[#3AADE0]/10 blur-[150px] rounded-full mix-blend-multiply" />
      </div>

      <div className="relative z-10 pt-16 md:pt-20 pb-40 px-6">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <div className="w-full w-full max-w-[1600px] mx-auto mb-24 md:mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-3 mb-6">
                <span
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: service.dim, color: service.color }}
                >
                  <service.icon size={17} />
                </span>
                <span
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: service.color }}
                >
                  {service.tagline}
                </span>
              </div>

              <h1 className="font-extrabold text-5xl md:text-6xl leading-[1.1] tracking-tight mb-6 text-[#1a1a1a]">
                {service.label}
              </h1>

              <p className="text-2xl md:text-3xl leading-[1.8] font-medium text-[#1a1a1a]/85 mb-6">
                {service.promise}
              </p>

              <p className="text-xl font-medium leading-[1.7] text-[#1a1a1a]/60 max-w-4xl">
                {service.intro}
              </p>
            </div>

            <div className="lg:col-span-5 relative group">
              <div
                className="absolute -inset-3 blur-[45px] rounded-[44px] opacity-30 group-hover:opacity-50 transition-opacity duration-700"
                style={{ background: service.color }}
              />
              <div className="relative w-full aspect-[4/3] max-w-3xl mx-auto rounded-[34px] overflow-hidden shadow-[0_25px_55px_-20px_rgba(0,0,0,0.22)] border border-white/60">
                <img
                  src={service.image}
                  alt={service.label}
                  className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-[1.04]"
                />
              </div>
            </div>
          </div>
        </div>

        {story && <div className="w-full w-full max-w-[1600px] mx-auto mb-24 md:mb-32">{story}</div>}

        {/* Explore More Indicator */}
        <div 
          onClick={() => document.getElementById('modules-grid')?.scrollIntoView({ behavior: 'smooth' })}
          className="w-full flex flex-col items-center justify-center mt-12 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
        >
          <span className="uppercase tracking-[0.2em] font-bold text-sm text-[#1a1a1a]/60 mb-2">Explore More Services</span>
          <ChevronDown className="animate-bounce text-[#F5841F]" size={24} />
        </div>

        {/* ── Pick what you need ───────────────────────────────────────── */}
        <div id="modules-grid" className="w-full max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10 md:mb-14">
            <div className="max-w-4xl">
              <h2 className="font-extrabold text-4xl md:text-5xl tracking-tight text-[#1a1a1a] mb-4 leading-[1.15]">
                Pick what you need
              </h2>
              <p className="text-2xl text-[#1a1a1a]/55 leading-[1.75] font-medium">
                Take one, take several, or take everything — you're not buying a package.
                Add what's relevant and we'll build the meeting around it.
              </p>
            </div>

            {!isStaff && (
              <button
                type="button"
                onClick={() => (allOn ? removeMany(allIds) : addMany(allIds))}
                className="text-[13.5px] font-bold px-6 py-3.5 rounded-full border transition-all duration-300 hover:scale-[1.03] flex-shrink-0 self-start"
                style={{
                  borderColor: `${service.color}45`,
                  color: service.color,
                  background: allOn ? service.dim : "transparent",
                }}
              >
                {allOn ? "Deselect everything" : "I want the full service"}
              </button>
            )}
          </div>

          <div className="flex flex-col gap-14 md:gap-16">
            {service.groups.map((group) => (
              <div key={group.title}>
                <div className="mb-6 md:mb-8 max-w-4xl">
                  <div className="flex items-center gap-3 mb-2.5">
                    <span className="h-px w-7" style={{ background: service.color }} />
                    <h3 className="font-extrabold text-2xl md:text-3xl text-[#1a1a1a] tracking-tight">
                      {group.title}
                    </h3>
                  </div>
                  <p className="text-xl text-[#1a1a1a]/55 leading-[1.7] font-medium pl-10">
                    {group.blurb}
                  </p>
                </div>

                {/* items-start so expanding one card doesn't stretch its neighbours */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-5 items-start">
                  {group.modules.map((m) => (
                    <ModuleCard key={m.id} module={m} color={service.color} dim={service.dim} disabled={isStaff} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Close ──────────────────────────────────────────────────── */}
        <div className="w-full px-4 md:px-8 mt-20 md:mt-24 mb-24 md:mb-32">
          <div className="w-full rounded-[40px] p-10 md:p-14 text-center relative overflow-hidden border border-white/60 bg-white/70 backdrop-blur-xl shadow-[0_25px_60px_-25px_rgba(0,0,0,0.1)]">
            <div
              className="absolute -top-1/2 left-1/4 w-[420px] h-[420px] blur-[130px] rounded-full pointer-events-none mix-blend-multiply opacity-20"
              style={{ background: service.color }}
            />
            <div className="relative z-10">
              <h3 className="font-extrabold text-4xl md:text-5xl text-[#1a1a1a] mb-4 tracking-tight leading-[1.15]">
                {chosen > 0
                  ? chosen === 1
                    ? "One thing picked. Let's talk about it."
                    : `${chosen} things picked. Let's talk about them.`
                  : "Not sure what you need?"}
              </h3>
              <p className="text-lg font-medium leading-[1.7] text-[#1a1a1a]/60 max-w-3xl mx-auto mb-8">
                {chosen > 0
                  ? "A few quick questions and we'll put the right person in the room."
                  : "Book anyway. Tell us the problem and we'll work out which parts apply."}
              </p>
              {!isStaff && (
                <button
                  onClick={onBook}
                  className="inline-flex items-center gap-2.5 text-lg font-bold text-white px-9 py-4 rounded-full transition-transform duration-300 hover:scale-[1.05] shadow-[0_15px_30px_-12px_rgba(0,0,0,0.35)] group"
                  style={{ background: service.color }}
                >
                  Book an appointment
                  <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}






