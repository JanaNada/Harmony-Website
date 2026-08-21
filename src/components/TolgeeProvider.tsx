"use client";

import { TolgeeProvider as TolgeeReactProvider, Tolgee, DevTools, FormatSimple, useTolgee } from "@tolgee/react";
import { ReactNode, useEffect } from "react";
import { arabicTranslations } from "@/content/translations/ar";
import { arabicServiceTranslations } from "@/content/translations/ar-services";

const tolgee = Tolgee()
  .use(DevTools())
  .use(FormatSimple())
  .init({
    apiUrl: process.env.NEXT_PUBLIC_TOLGEE_API_URL,
    apiKey: process.env.NEXT_PUBLIC_TOLGEE_API_KEY,
    defaultLanguage: "en",
    availableLanguages: ["en", "ar"],
    staticData: {
      ar: {
        ...arabicTranslations,
        ...arabicServiceTranslations,
      },
    },
  });

function LanguageDirection() {
  const tolgee = useTolgee(["language"]);
  const language = tolgee.getLanguage() ?? "en";

  useEffect(() => {
    const savedLanguage = localStorage.getItem("harmony-language");
    if (savedLanguage && savedLanguage !== language) {
      tolgee.changeLanguage(savedLanguage);
      return;
    }
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language, tolgee]);

  return null;
}

export function TolgeeProvider({ children }: { children: ReactNode }) {
  return (
    <TolgeeReactProvider tolgee={tolgee}>
      <LanguageDirection />
      {children}
    </TolgeeReactProvider>
  );
}