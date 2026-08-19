"use client";

import { useState } from "react";
import { Phone, Mail, MessageCircle, X } from "lucide-react";
import { useBrief } from "@/state/BriefContext";

export function ContactButton() {
  const { count } = useBrief();
  const [open, setOpen] = useState(false);
  const launcherOffset = count > 0 ? "bottom-28" : "bottom-6";

  return (
    <div className={`fixed ${launcherOffset} left-6 z-[80] flex flex-col items-start gap-4 transition-all duration-300`}>
      {open && (
        <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <a
            href="https://wa.me/201000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-white px-4 py-3 rounded-full shadow-lg hover:scale-105 transition-transform border border-black/[0.04] group"
          >
            <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <MessageCircle className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-gray-900 pr-2">WhatsApp Us</span>
          </a>
          
          <a
            href="tel:+201000000000"
            className="flex items-center gap-3 bg-white px-4 py-3 rounded-full shadow-lg hover:scale-105 transition-transform border border-black/[0.04] group"
          >
            <div className="w-8 h-8 rounded-full bg-[#3AADE0] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <Phone className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-gray-900 pr-2">Call Us</span>
          </a>

          <a
            href="mailto:hello@harmonyclubhouse.com"
            className="flex items-center gap-3 bg-white px-4 py-3 rounded-full shadow-lg hover:scale-105 transition-transform border border-black/[0.04] group"
          >
            <div className="w-8 h-8 rounded-full bg-[#F5841F] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <Mail className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-gray-900 pr-2">Email Us</span>
          </a>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full text-white shadow-[0_16px_32px_-12px_rgba(37,211,102,0.6)] flex items-center justify-center transition-transform hover:scale-110 bg-[#25D366]"
        aria-label="Contact Options"
      >
        {open ? <X className="w-6 h-6 animate-in spin-in-90" /> : <Phone className="w-6 h-6 animate-in zoom-in" />}
      </button>
    </div>
  );
}