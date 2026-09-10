"use client";

import { Mail } from "lucide-react";
import { useBrief } from "@/state/BriefContext";

export function ContactButton() {
  const { count } = useBrief();
  const launcherOffset = count > 0 ? "bottom-28" : "bottom-6";

  return (
    <div className={`fixed ${launcherOffset} left-6 z-[80] flex flex-col items-start gap-4 transition-all duration-300`}>
      <a
        href="mailto:hello@harmonyclubhouse.com"
        className="w-14 h-14 rounded-full text-white shadow-[0_16px_32px_-12px_rgba(245,132,31,0.6)] flex items-center justify-center transition-transform hover:scale-110 bg-[#F5841F]"
        aria-label="Email Us"
      >
        <Mail className="w-6 h-6 animate-in zoom-in" />
      </a>
    </div>
  );
}
