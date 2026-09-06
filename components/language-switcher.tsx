"use client";

import { useI18n } from "@/lib/i18n/context";
import { locales, localeLabels, Locale } from "@/lib/i18n/translations";

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <select
      value={locale}
      onChange={(e) => setLocale(e.target.value as Locale)}
      className="w-full rounded-xl border border-[var(--border)] bg-[var(--soft)] px-3 py-2 text-xs font-medium text-[var(--foreground)] cursor-pointer focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--button)]"
      style={{ colorScheme: "dark" }}
    >
      {locales.map((l) => (
        <option key={l} value={l} className="bg-[#1e2030] text-gray-100">
          {localeLabels[l]}
        </option>
      ))}
    </select>
  );
}
