"use client";

import { ArrowRight, ChevronRight, ChevronDown, Check } from "lucide-react";
import { ImageWithFallback } from "@/components";
import { useBrief } from "@/state/BriefContext";
import { useTranslate } from "@tolgee/react";
import {
  SERVICES, SERVICE_BY_ID, C_ORANGE, C_PINK, C_BLUE, C_GREEN,
  type ServiceId,
} from "@/content/services";
import { arabicServiceTranslations } from "@/content/translations/ar-services";

const GRAD_FRIEND = `linear-gradient(90deg, ${C_ORANGE}, ${C_PINK}, ${C_BLUE}, ${C_GREEN})`;

export function ServicesOverview({
  onOpen,
  onBook,
  hiddenServices,
  isStaff,
}: {
  onOpen: (id: ServiceId) => void;
  onBook: () => void;
  hiddenServices: string[];
  isStaff?: boolean;
}) {
  const { t } = useTranslate();
  const serviceText = (key: string, fallback: string) =>
    typeof document !== "undefined" && document.documentElement.lang === "ar"
      ? arabicServiceTranslations[key as keyof typeof arabicServiceTranslations] ?? fallback
      : t(key, fallback);
  const { countFor } = useBrief();
  const tech = SERVICE_BY_ID.technology;
  const pillars = SERVICES.filter((s) => s.id !== "technology" && !hiddenServices.includes(s.id));

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF7F2] text-[#1a1a1a] relative scroll-smooth">
      {/* Soft Colorful Ambient Backgrounds */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] bg-[#F5841F]/15 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] bg-[#3AADE0]/10 blur-[150px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vw] bg-[#E91E8C]/15 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      <div className="relative z-10">
        {/* --- 1. FEATURED DIVISION: F&B TECHNOLOGY --- */}
        <div className="min-h-[70vh] pt-12 pb-8 flex flex-col justify-center px-6 w-full relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 items-center flex-1">
            <div className="order-2 lg:order-1 lg:col-span-5 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#F5841F]/30 to-[#E91E8C]/20 blur-[40px] rounded-[40px] opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
              <div className="relative w-full aspect-[4/3] rounded-[32px] overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-white/60 bg-white">
                <ImageWithFallback
                  src={tech.image}
                  alt={tech.label}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />
              </div>
            </div>

            <div className="order-1 lg:order-2 lg:col-span-7">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="h-px w-8 md:w-12" style={{ background: GRAD_FRIEND }} />
                <span className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/50">
                  {t('division_label', 'Division')}
                </span>
                <div className="h-px w-8 md:w-12" style={{ background: GRAD_FRIEND }} />
              </div>

              <h2 className="font-extrabold text-5xl md:text-6xl text-[#1a1a1a] mb-5 leading-[1.1] tracking-tight">
                {t(`service_${tech.id}_label`, tech.label)}
              </h2>

              <p className="text-xl md:text-2xl leading-[1.8] text-[#1a1a1a]/70 font-medium">
                {t(`service_${tech.id}_intro`, tech.intro)}
              </p>

              {!hiddenServices.includes("technology") && (
                <button
                  onClick={() => onOpen("technology")}
                  className="mt-8 inline-flex items-center gap-2 text-lg font-bold text-white px-6 py-3 rounded-full transition-all duration-300 hover:scale-[1.05] shadow-[0_10px_20px_-10px_rgba(245,132,31,0.5)] group"
                  style={{ background: C_ORANGE }}
                >
                  {t('explore_fb_tech', 'Explore F&B Technology')}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
          </div>

          {/* Scroll Down Indicator */}
          <div
            className="w-full flex justify-center mt-12 cursor-pointer opacity-70 hover:opacity-100 transition-opacity animate-bounce"
            onClick={() =>
              document.getElementById("services-grid")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60">
                {t('explore_more_services', 'Explore More Services')}
              </span>
              <ChevronDown size={24} className="text-[#F5841F]" />
            </div>
          </div>
        </div>

        {/* --- 2. THE 4 PILLARS OF EXPERTISE --- */}
        <div id="services-grid" className="pt-16 pb-12">
          <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="h-px w-8 md:w-12" style={{ background: GRAD_FRIEND }} />
              <span className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/50">
                {t('what_we_do', 'WHAT WE DO')}
              </span>
              <div className="h-px w-8 md:w-12" style={{ background: GRAD_FRIEND }} />
            </div>
            <h1 className="font-extrabold text-4xl md:text-5xl leading-[1.15] tracking-tight mb-4 text-[#1a1a1a]">
              {t('four_pillars_title', 'Four Pillars of Expertise')}
            </h1>
          </div>

          <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-8">
              {pillars.map((s) => {
                const picked = countFor(s.id);
                return (
                  <div
                    key={s.id}
                    className="group flex flex-col bg-white rounded-[32px] overflow-hidden shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2"
                  >
                    <div className="h-1.5 w-full" style={{ background: s.color }} />

                    <div className="relative h-56 overflow-hidden bg-[#FAF7F2]">
                      <img
                        src={s.image}
                        alt={s.label}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent opacity-80" />
                      {picked > 0 && (
                        <span
                          className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-[11.5px] font-extrabold shadow-lg"
                          style={{ background: s.color }}
                        >
                          <Check size={12} strokeWidth={3} />
                          {picked} {t('items_added', 'added')}
                        </span>
                      )}
                    </div>

                    <div className="p-8 flex flex-col flex-1 bg-white relative">
                      <div className="flex items-center gap-8 mb-6">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform duration-500 group-hover:scale-110"
                          style={{ background: s.dim }}
                        >
                          <s.icon size={22} style={{ color: s.color }} />
                        </div>
                        <div>
                          <p
                            className="text-xs font-bold uppercase tracking-widest mb-1"
                            style={{ color: s.color }}
                          >
                            {serviceText(`service_${s.id}_tagline`, s.tagline)}
                          </p>
                          <h3 className="text-2xl font-bold leading-[1.3] text-[#1a1a1a]">
                            {serviceText(`service_${s.id}_label`, s.label)}
                          </h3>
                        </div>
                      </div>

                      <p className="text-lg text-[#1a1a1a]/70 leading-[1.7] mb-8 flex-1 font-medium">
                        {serviceText(`service_${s.id}_promise`, s.promise)}
                      </p>

                      <button
                        onClick={() => onOpen(s.id)}
                        className="inline-flex items-center gap-2 text-lg font-bold hover:gap-3 transition-all mt-auto"
                        style={{ color: s.color }}
                      >
                        {t('request_service', 'Request Service')} <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* --- 3. THE BRIDGE / INTRO TEXT --- */}
        <div className="max-w-[900px] mx-auto px-6 mt-8 mb-12 text-center">
          <p className="text-xl md:text-2xl leading-[1.8] text-[#1a1a1a]/80 font-medium">
            {t('services_overview_bridge_desc', "Nothing here is a fixed package. Open any service, add the specific pieces that apply to you — one, several, or all of them — and book a single appointment that covers everything you picked.")}
          </p>
        </div>

        {/* --- 4. BOTTOM CALL-TO-ACTION --- */}
        {!isStaff && (
          <div className="w-full py-16 md:py-24 px-4 md:px-8 relative overflow-hidden">
            <div className="absolute top-[-50%] left-[0%] w-[500px] h-[500px] bg-[#F5841F]/15 blur-[150px] rounded-full pointer-events-none mix-blend-multiply" />
            <div className="absolute bottom-[-50%] right-[0%] w-[500px] h-[500px] bg-[#E91E8C]/15 blur-[150px] rounded-full pointer-events-none mix-blend-multiply" />

            <div className="relative z-10 w-full text-center bg-white/60 backdrop-blur-xl p-10 md:p-16 rounded-[48px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.05)] border border-white">
              <h2 className="font-extrabold text-4xl md:text-5xl text-[#1a1a1a] mb-8 tracking-tight leading-[1.15]">
                {t('ready_to_unlock', 'Ready to unlock your full potential?')}
              </h2>
              <button
                onClick={onBook}
                className="inline-flex items-center gap-3 text-lg font-bold text-white px-10 py-5 rounded-full transition-all duration-300 hover:scale-[1.05] shadow-[0_15px_30px_-10px_rgba(245,132,31,0.5)] group"
                style={{ background: `linear-gradient(135deg, ${C_ORANGE}, ${C_PINK})` }}
              >
                {t('book_an_appointment', 'Book an appointment')}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}