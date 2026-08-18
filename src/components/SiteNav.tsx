"use client";

import { useState, useEffect } from "react";
import { useState, useEffect } from "react";
import { ChevronDown, Menu, X, User } from "lucide-react";
import { ImageWithFallback } from "@/components";
import { SERVICES } from "@/content/services";
import { isStaffRole, useAuth } from "@/app/auth";
import { api } from "@/lib/api";
import { Sparkles } from "lucide-react";
import type { Page } from "@/app/routes";
import { api } from "@/lib/api";
import * as LucideIcons from "lucide-react";

const C_ORANGE = "#F5841F";
const C_PINK = "#E91E8C";

/**
 * The public site header. Lives in the shell rather than the page so it
 * survives navigation along with the visitor's brief.
 */
export function SiteNav({ current, go }: { current: Page; go: (p: Page) => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, loading } = useAuth();
  const [extraServices, setExtraServices] = useState<any[]>([]);
  const [activeStaticTitles, setActiveStaticTitles] = useState<Set<string> | null>(null);

  useEffect(() => {
    api.get<{ services: any[] }>("/catalog").then((res) => {
      // Only keep active services
      const active = res.services.filter((es) => es.isActive);
      // Extra = DB-only services not in the hardcoded list
      const dbOnly = active.filter((es) => !SERVICES.some((s) => s.label === es.title));
      setExtraServices(dbOnly);
      // Determine which static services are active in DB
      const activeTitles = new Set(active.map((es: any) => es.title));
      setActiveStaticTitles(activeTitles);
    }).catch(console.error);
  }, []);

  const isStaff = isStaffRole(user?.role);
  /** Where "your area" lives depends on who you are. */
  const accountPage: Page = isStaff ? "admin" : "dashboard";

  const goToAccount = () => {
    if (user) return go(accountPage);
    // Remember where they were so signing in returns them here.
    if (typeof window !== "undefined" && current !== "login") {
      sessionStorage.setItem("returnTo", current);
    }
    go("login");
  };

  const tabs: { label: string; page: Page }[] = [
    { label: "About Us", page: "about" },
    { label: "Mission & Vision", page: "mission" },
    { label: "Service", page: "services" },
    { label: "Portfolio", page: "stories" },
  ];

  const isActive = (page: Page) => current === page && current !== "contact";

  return (
    <header className="bg-[#FAF7F2] border-b border-black/[0.07] flex-shrink-0 z-50 relative">
      <div className="h-[80px] md:h-[90px] flex items-center px-6 md:px-12 gap-8 relative">
        {/* Brand */}
        <button
          onClick={() => { go("about"); }}
          className="flex-shrink-0 flex items-center gap-2.5 transition-opacity hover:opacity-80 text-left"
        >
          <ImageWithFallback src="/imports/friend-logo.png" alt="Harmony Club House" className="h-9 w-9 object-contain rounded-full"/>
          <div className="hidden sm:block">
            <div className="text-base font-black leading-none tracking-widest text-gray-900" style={{fontFamily:"'Montserrat',sans-serif"}}>HARMONY</div>
            <div className="text-[10px] font-semibold tracking-[0.22em] text-gray-400 leading-none mt-0.5" style={{fontFamily:"'Montserrat',sans-serif"}}>CLUB HOUSE</div>
          </div>
        </button>

        {/* Tab links - desktop */}
        <nav className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
          {tabs.map(({ label, page }) =>
            page === "services" ? (
              // Services opens a menu so all of them are one click away
              <div key={label} className="relative group/svc">
                <button
                  onClick={() => go("services")}
                  className={`relative text-[14.5px] font-bold px-4 py-2.5 rounded-full transition-all duration-300 inline-flex items-center gap-1.5 ${
                    isActive(page) || SERVICES.some((s) => s.id === current)
                      ? "text-[#1a1a1a] bg-black/[0.04]"
                      : "text-[#1a1a1a]/50 hover:text-[#1a1a1a] hover:bg-black/[0.02]"
                  }`}
                >
                  {label}
                  <ChevronDown size={13} className="transition-transform duration-300 group-hover/svc:rotate-180" />
                </button>

                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 invisible group-hover/svc:opacity-100 group-hover/svc:visible transition-all duration-200 z-50">
                  <div className="bg-white rounded-[22px] shadow-[0_25px_50px_-15px_rgba(0,0,0,0.18)] border border-black/[0.05] p-2.5 w-[290px]">
                    {/* Hardcoded static services — only show if active in DB (or DB not yet loaded) */}
                    {SERVICES.filter((s) => activeStaticTitles === null || activeStaticTitles.has(s.label)).map((s) => (
                      <button
                        key={s.id}
                        onClick={() => go(s.id)}
                        className="w-full text-left flex items-start gap-3 p-3 rounded-2xl hover:bg-black/[0.03] transition-colors group/item"
                      >
                        <span
                          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover/item:scale-110"
                          style={{ background: s.dim, color: s.color }}
                        >
                          <s.icon size={16} />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-lg font-extrabold text-[#1a1a1a] leading-tight mb-0.5">
                            {s.label}
                          </span>
                          <span className="block text-[11.5px] font-semibold text-[#1a1a1a]/45 leading-snug">
                            {s.tagline}
                          </span>
                        </span>
                      </button>
                    ))}
                    {extraServices.map((es) => {
                      let IconComponent = LucideIcons.Box as any;
                      if (es.icon && (LucideIcons as any)[es.icon]) {
                        IconComponent = (LucideIcons as any)[es.icon];
                      }
                      return (
                        <button
                          key={`catalog-${es.id}`}
                          onClick={() => go(`catalog:${es.id}` as any)}
                          className="w-full text-left flex items-start gap-3 p-3 rounded-2xl hover:bg-black/[0.03] transition-colors group/item"
                        >
                          <span
                            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover/item:scale-110"
                            style={{ background: `${es.accentColor || C_ORANGE}15`, color: es.accentColor || C_ORANGE }}
                          >
                            <IconComponent size={16} />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-lg font-extrabold text-[#1a1a1a] leading-tight mb-0.5">
                              {es.title}
                            </span>
                            <span className="block text-[11.5px] font-semibold text-[#1a1a1a]/45 leading-snug">
                              {es.tagline}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <button
                key={label}
                onClick={() => go(page)}
                className={`relative text-[14.5px] font-bold px-4 py-2.5 rounded-full transition-all duration-300 ${
                  isActive(page)
                    ? "text-[#1a1a1a] bg-black/[0.04]"
                    : "text-[#1a1a1a]/50 hover:text-[#1a1a1a] hover:bg-black/[0.02]"
                }`}
              >
                {label}
                {isActive(page) && (
                  <span
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full"
                    style={{ background: C_ORANGE }}
                  />
                )}
              </button>
            ),
          )}
        </nav>

        <div className="hidden md:block flex-1" />

        <div className="flex-1 md:hidden" />

        {/* Primary CTA - the whole site points here. Hidden for staff. */}
        {!isStaff && (
          <button
            onClick={() => go("booking")}
            className="hidden md:inline-flex text-lg font-bold text-white px-7 py-3 rounded-full transition-all duration-300 hover:scale-[1.05] shadow-[0_10px_20px_-10px_rgba(233,30,140,0.5)] flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${C_ORANGE}, ${C_PINK})` }}
          >
            Book Appointment
          </button>
        )}

        {/* Signed out this signs you in; signed in it takes you to your own
            area - the staff portal for staff, the client profile for companies. */}
        {!loading && (
          <button
            onClick={goToAccount}
            className="text-lg font-bold text-[#1a1a1a] px-5 py-2.5 rounded-full hover:bg-black/5 transition-all inline-flex items-center gap-2 flex-shrink-0"
          >
            {user && <User size={17} />}
            {user ? "Profile" : "Sign In"}
          </button>
        )}

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-[#1a1a1a]/60 p-2"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-black/[0.07] bg-[#FAF7F2] px-6 py-6 flex flex-col gap-8 absolute w-full shadow-xl">
          {tabs.map(({ label, page }) => (
            <button
              key={label}
              onClick={() => { go(page); setMobileOpen(false); }}
              className="text-left text-xl font-bold text-[#1a1a1a]/70 hover:text-[#1a1a1a] transition-colors"
            >
              {label}
            </button>
          ))}
          <div className="pl-3 flex flex-col gap-3 border-l-2 border-black/[0.06]">
            {SERVICES.filter((s) => activeStaticTitles === null || activeStaticTitles.has(s.label)).map((s) => (
              <button
                key={s.id}
                onClick={() => { go(s.id); setMobileOpen(false); }}
                className="text-left text-[14.5px] font-bold text-[#1a1a1a]/55 hover:text-[#1a1a1a] transition-colors inline-flex items-center gap-2.5"
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
                {s.label}
              </button>
            ))}
            {extraServices.map((es) => (
              <button
                key={`mob-catalog-${es.id}`}
                onClick={() => { go(`catalog:${es.id}` as any); setMobileOpen(false); }}
                className="text-left text-[14.5px] font-bold text-[#1a1a1a]/55 hover:text-[#1a1a1a] transition-colors inline-flex items-center gap-2.5"
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: es.accentColor || C_ORANGE }} />
                {es.title}
              </button>
            ))}
          </div>
          {!isStaff && (
            <button
              onClick={() => { go("booking"); setMobileOpen(false); }}
              className="mt-4 text-lg font-bold text-white py-3.5 rounded-full shadow-[0_10px_20px_-10px_rgba(233,30,140,0.5)]"
              style={{ background: `linear-gradient(135deg, ${C_ORANGE}, ${C_PINK})` }}
            >
              Book Appointment
            </button>
          )}
          {!loading && (
            <button
              onClick={() => { goToAccount(); setMobileOpen(false); }}
              className="text-lg font-bold text-[#1a1a1a] py-3 rounded-full border border-black/10 inline-flex items-center justify-center gap-2"
            >
              {user && <User size={17} />}
              {user ? "Profile" : "Sign In"}
            </button>
          )}
        </div>
      )}
    </header>
  );
}
