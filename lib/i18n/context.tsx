"use client";

import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";
import { Locale, translations, TranslationKey } from "./translations";

type I18nContextType = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: TranslationKey) => string;
};

const I18nContext = createContext<I18nContextType | null>(null);

const STORAGE_KEY = "crm-locale";

function getInitialLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "en" || saved === "pt-BR") return saved;
  return "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem(STORAGE_KEY, l);
  }, []);

  const ctx = useMemo(() => {
    function t(key: TranslationKey): string {
      return translations[locale][key] ?? translations.en[key] ?? key;
    }
    return { locale, setLocale, t };
  }, [locale, setLocale]);

  return (
    <I18nContext.Provider value={ctx}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
