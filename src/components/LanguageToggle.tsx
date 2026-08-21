"use client";

import { useTolgee } from "@tolgee/react";

export default function LanguageToggle() {
  const tolgee = useTolgee(['language']);
  const currentLang = tolgee.getLanguage() ?? 'en';

  const toggleLang = () => {
    const nextLang = currentLang === 'en' ? 'ar' : 'en';
    localStorage.setItem('harmony-language', nextLang);
    tolgee.changeLanguage(nextLang);
  };

  return (
    <button 
      onClick={toggleLang}
      className="flex items-center justify-center w-11 h-11 rounded-full border border-black/10 bg-white/50 backdrop-blur-sm shadow-sm hover:scale-105 transition-all text-[#1a1a1a] font-extrabold text-[13px] cursor-pointer"
    >
      {currentLang === 'en' ? 'AR' : 'EN'}
    </button>
  );
}