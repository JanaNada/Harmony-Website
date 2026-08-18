"use client";

import * as LucideIcons from "lucide-react";
import { ArrowRight, ChevronRight, ChevronDown, Check, Box } from "lucide-react";
import { ImageWithFallback } from "@/components";
import { useBrief } from "@/state/BriefContext";
import { useAuth, isStaffRole } from "@/app/auth";
import {
  SERVICES, SERVICE_BY_ID, C_ORANGE, C_PINK, C_BLUE, C_GREEN,
  type ServiceId,
} from "@/content/services";

interface CatalogSummary {
  id: number;
  title: string;
  tagline: string | null;
  description: string | null;
  imageUrl: string | null;
  accentColor: string | null;
  icon?: string | null;
}

const GRAD_FRIEND = `linear-gradient(90deg, ${C_ORANGE}, ${C_PINK}, ${C_BLUE}, ${C_GREEN})`;

/* The four pillars sit together as four boxes. F&B Technology is featured
   above them, the way the division banner has always been presented. */

export function ServicesOverview({
  onOpen,
  onOpenCatalog,
  extraServices,
  activeStaticTitles,
  onBook,
}: {
  onOpen: (id: ServiceId) => void;
  onOpenCatalog: (id: number) => void;
  extraServices: CatalogSummary[];
  /** When null, catalog hasn't loaded yet — show all static services. Once set, only show active ones. */
  activeStaticTitles: Set<string> | null;
  onBook: () => void;
}) {
  const { countFor } = useBrief();
  const { user } = useAuth();
  const isStaff = isStaffRole(user?.role);
  const tech = SERVICE_BY_ID.technology;

  // Filter static pillar services: if DB has loaded, only show ones that are active in DB.
  // If DB hasn't loaded yet (activeStaticTitles is null), show all to avoid flash of empty content.
  const pillars = SERVICES.filter((s) => {
    if (s.id === "technology") return false;
    if (activeStaticTitles === null) return true;
    return activeStaticTitles.has(s.label.toLowerCase());
  });

  // Show F&B Technology hero only if it's active in DB (or catalog hasn't loaded yet)
  const showTechHero = activeStaticTitles === null || activeStaticTitles.has(tech.label.toLowerCase());

  const dbOnlyServices = extraServices.filter(
    (es) => !SERVICES.some((s) => s.label === es.title)
  );

  const combined = [...pillars, ...dbOnlyServices];

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF7F2] text-[#1a1a1a] relative scroll-smooth">
      {/* Soft Colorful Ambient Backgrounds */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] bg-[#F5841F]/15 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] bg-[#3AADE0]/10 blur-[150px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vw] bg-[#E91E8C]/15 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      <div className="relative z-10">
        {showTechHero && (
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
                  Division
                </span>
                <div className="h-px w-8 md:w-12" style={{ background: GRAD_FRIEND }} />
              </div>

              <h2 className="font-extrabold text-5xl md:text-6xl text-[#1a1a1a] mb-5 leading-[1.1] tracking-tight">
                {tech.label}
              </h2>

              <p className="text-xl md:text-2xl leading-[1.8] text-[#1a1a1a]/70 font-medium">
                {tech.intro}
              </p>

              <button
                onClick={() => onOpen("technology")}
                className="mt-8 inline-flex items-center gap-2 text-lg font-bold text-white px-6 py-3 rounded-full transition-all duration-300 hover:scale-[1.05] shadow-[0_10px_20px_-10px_rgba(245,132,31,0.5)] group"
                style={{ background: C_ORANGE }}
              >
                Explore F&B Technology
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
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
                Explore More Services
              </span>
              <ChevronDown size={24} className="text-[#F5841F]" />
            </div>
          </div>
        </div>
        )}

        {/* --- 2. THE 4 PILLARS OF EXPERTISE --- */}
        <div id="services-grid" className="pt-16 pb-12">
          <div className="w-full w-full max-w-[1600px] mx-auto px-6 lg:px-12 text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="h-px w-8 md:w-12" style={{ background: GRAD_FRIEND }} />
              <span className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/50">
                WHAT WE DO
              </span>
              <div className="h-px w-8 md:w-12" style={{ background: GRAD_FRIEND }} />
            </div>
            <h1 className="font-extrabold text-4xl md:text-5xl leading-[1.15] tracking-tight mb-4 text-[#1a1a1a]">
              Pillars of Expertise
            </h1>
          </div>

          <div className="w-full w-full max-w-[1600px] mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-8">
              {combined.map((s) => {
                const isHardcoded = typeof s.id === "string";
                const picked = isHardcoded ? countFor(s.id as ServiceId) : 0;
                
                const label = isHardcoded ? (s as any).label : (s as any).title;
                const tagline = s.tagline;
                const color = isHardcoded ? (s as any).color : ((s as any).accentColor || C_ORANGE);
                const dim = isHardcoded ? (s as any).dim : `${color}15`;
                const image = isHardcoded ? (s as any).image : ((s as any).imageUrl || "/imports/image-11.png");
                const promise = isHardcoded ? (s as any).promise : (s as any).description;
                
                let IconComponent = Box;
                if (isHardcoded) {
                  IconComponent = (s as any).icon;
                } else {
                  const iconName = (s as any).icon;
                  if (iconName && (LucideIcons as any)[iconName]) {
                    IconComponent = (LucideIcons as any)[iconName];
                  }
                }

                return (
                  <div
                    key={s.id}
                    className="group flex flex-col bg-white rounded-[32px] overflow-hidden shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2"
                  >
                    <div className="h-1.5 w-full" style={{ background: color }} />

                    <div className="relative h-56 overflow-hidden bg-[#FAF7F2]">
                      <img
                        src={image}
                        alt={label}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent opacity-80" />
                      {picked > 0 && (
                        <span
                          className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-[11.5px] font-extrabold shadow-lg"
                          style={{ background: color }}
                        >
                          <Check size={12} strokeWidth={3} />
                          {picked} added
                        </span>
                      )}
                    </div>

                    <div className="p-8 flex flex-col flex-1 bg-white relative">
                      <div className="flex items-center gap-8 mb-6">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform duration-500 group-hover:scale-110"
                          style={{ background: dim }}
                        >
                          <IconComponent size={22} style={{ color: color }} />
                        </div>
                        <div>
                          <p
                            className="text-xs font-bold uppercase tracking-widest mb-1"
                            style={{ color: color }}
                          >
                            {tagline}
                          </p>
                          <h3 className="text-2xl font-bold leading-[1.3] text-[#1a1a1a]">
                            {label}
                          </h3>
                        </div>
                      </div>

                      <p className="text-lg text-[#1a1a1a]/70 leading-[1.7] mb-8 flex-1 font-medium">
                        {promise}
                      </p>

                      <button
                        onClick={() => isHardcoded ? onOpen(s.id as ServiceId) : onOpenCatalog(s.id as number)}
                        className="inline-flex items-center gap-2 text-lg font-bold hover:gap-3 transition-all mt-auto"
                        style={{ color: color }}
                      >
                        Request Service <ChevronRight size={18} />
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
            Nothing here is a fixed package. Open any service, add the specific pieces that
            apply to you — one, several, or all of them — and book a single appointment
            that covers everything you picked.
          </p>
        </div>


        {/* --- 4. BOTTOM CALL-TO-ACTION --- */}
        <div className="w-full py-16 md:py-24 px-4 md:px-8 relative overflow-hidden">
          <div className="absolute top-[-50%] left-[0%] w-[500px] h-[500px] bg-[#F5841F]/15 blur-[150px] rounded-full pointer-events-none mix-blend-multiply" />
          <div className="absolute bottom-[-50%] right-[0%] w-[500px] h-[500px] bg-[#E91E8C]/15 blur-[150px] rounded-full pointer-events-none mix-blend-multiply" />

          <div className="relative z-10 w-full text-center bg-white/60 backdrop-blur-xl p-10 md:p-16 rounded-[48px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.05)] border border-white">
            <h2 className="font-extrabold text-4xl md:text-5xl text-[#1a1a1a] mb-8 tracking-tight leading-[1.15]">
              Ready to unlock your full potential?
            </h2>
            {!isStaff && (
              <button
                onClick={onBook}
                className="inline-flex items-center gap-3 text-lg font-bold text-white px-10 py-5 rounded-full transition-all duration-300 hover:scale-[1.05] shadow-[0_15px_30px_-10px_rgba(245,132,31,0.5)] group"
                style={{ background: `linear-gradient(135deg, ${C_ORANGE}, ${C_PINK})` }}
              >
                Book an Appointment
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
