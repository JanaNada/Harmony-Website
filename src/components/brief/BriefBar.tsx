"use client";

import { useState } from "react";
import { ArrowRight, X, ChevronUp, ChevronDown } from "lucide-react";
import { useTolgee, useTranslate } from "@tolgee/react";
import { useBrief } from "@/state/BriefContext";
import { findModule, findService, SERVICE_BY_ID } from "@/content/services";
import { arabicServiceTranslations } from "@/content/translations/ar-services";

function serviceTranslation(language: string, key: string, fallback: string) {
  return language === "ar"
    ? arabicServiceTranslations[key as keyof typeof arabicServiceTranslations] ?? fallback
    : fallback;
}
import { useAuth, isStaffRole } from "@/app/auth";

/* Sticky bar: the visitor's selection follows them across the whole site.
   Hidden when empty so the site stays calm until they've chosen something. */

export function BriefBar({ onBook }: { onBook: () => void }) {
  const { selected, count, toggle, clear, activeServices, countFor } = useBrief();
  const { user } = useAuth();
  const isStaff = isStaffRole(user?.role);
  const { t } = useTranslate();
  const tolgee = useTolgee(["language"]);
  const language = tolgee.getLanguage() ?? "en";
  const [open, setOpen] = useState(false);

  if (count === 0) return null;

  // The bar wears the colours of whatever they've actually picked.
  const colors = activeServices.map((sid) => findService(sid)?.color).filter(Boolean) as string[];
  const gradient =
    colors.length === 1
      ? `linear-gradient(120deg, ${colors[0]}, ${colors[0]}CC)`
      : colors.length > 1
      ? `linear-gradient(120deg, ${colors.join(", ")})`
      : `linear-gradient(120deg, #F5841F, #F5841F)`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] pointer-events-none">
      <div className="w-full px-4 pb-4 pointer-events-auto">
        {/* Expanded list */}
        {open && (
          <div className="bg-white rounded-t-[28px] border border-b-0 border-black/[0.06] shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.18)] p-6 max-h-[45vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-extrabold text-lg text-[#1a1a1a]">
                {t("brief_title", "Your brief")}
              </h3>
              <button
                onClick={clear}
                className="text-sm font-bold text-[#1a1a1a]/40 hover:text-[#1a1a1a]/70 transition-colors"
              >
                {t("brief_clear_all", "Clear all")}
              </button>
            </div>

            <div className="flex flex-col gap-5">
              {activeServices.map((sid) => {
                const svc = findService(sid);
                if (!svc) return null;
                return (
                  <div key={sid}>
                    <div className="flex items-center gap-2 mb-2.5">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: svc.color }}
                      />
                      <span className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/45">
                        {serviceTranslation(language, `service_${sid}_label`, svc.label)} · {countFor(sid)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selected
                        .filter((id) => findModule(id)?.serviceId === sid)
                        .map((id) => {
                          const mod = findModule(id);
                          if (!mod) return null;
                          return (
                            <button
                              key={id}
                              onClick={() => toggle(id)}
                              className="group inline-flex items-center gap-2 pl-3.5 pr-2.5 py-2 rounded-full border transition-colors"
                              style={{
                                background: svc.dim,
                                borderColor: `${svc.color}30`,
                              }}
                            >
                              <span className="text-sm font-bold text-[#1a1a1a]/80">
                                  {serviceTranslation(language, `mod_${mod.id.replace(/-/g, "_")}_label`, mod.label)}
                              </span>
                              <X
                                size={14}
                                className="text-[#1a1a1a]/30 group-hover:text-[#1a1a1a]/70 transition-colors"
                              />
                            </button>
                          );
                        })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bar */}
        <div
          className={`border border-white/25 shadow-[0_-12px_45px_-12px_rgba(0,0,0,0.3)] px-5 md:px-6 py-4 flex items-center gap-8 transition-all duration-500 ${
            open ? "rounded-b-[28px]" : "rounded-[28px]"
          }`}
          style={{ background: gradient }}
        >
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-3 flex-1 min-w-0 text-left group"
          >
            <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-extrabold text-base text-[#1a1a1a] flex-shrink-0 shadow-sm">
              {count}
            </span>
            <span className="min-w-0">
              <span className="block text-[14.5px] font-extrabold text-white truncate drop-shadow-sm">
                {count === 1
                  ? t("brief_one_selected", "1 service selected")
                  : t("brief_many_selected", `${count} services selected`, { count })}
              </span>
              <span className="hidden sm:flex items-center gap-1 text-[12.5px] font-bold text-white/80 group-hover:text-white transition-colors">
                {open ? t("brief_hide", "Hide") : t("brief_review", "Review")} {t("brief_your", "your brief")}
                {open ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
              </span>
            </span>
          </button>

          {!isStaff && (
            <button
              onClick={onBook}
              className="text-sm font-extrabold text-[#1a1a1a] bg-white px-6 md:px-8 py-3.5 rounded-full transition-transform duration-300 hover:scale-[1.04] shadow-[0_10px_25px_-8px_rgba(0,0,0,0.35)] inline-flex items-center gap-2 flex-shrink-0 group"
            >
              {t("brief_book", "Book appointment")}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}




