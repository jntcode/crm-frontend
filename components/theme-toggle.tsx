"use client";

import { useEffect, useRef, useState } from "react";

type ThemeMode = "dark" | "slate" | "light";

const themeOptions: Array<{ value: ThemeMode; label: string }> = [
  { value: "dark", label: "Dark" },
  { value: "slate", label: "Slate" },
  { value: "light", label: "Light" },
];

function getInitialTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";
  const savedTheme = localStorage.getItem("crm-theme");
  if (savedTheme === "dark" || savedTheme === "slate" || savedTheme === "light") return savedTheme;
  return "light";
}

interface ThemeToggleProps {
  position?: "up" | "down";
}

export function ThemeToggle({ position = "down" }: ThemeToggleProps) {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("crm-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dropdownPosition = position === "up"
    ? "absolute right-0 bottom-full mb-2 z-20"
    : "absolute right-0 mt-2 z-20";

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--soft)] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] shadow-[0_8px_18px_var(--shadow)] transition hover:border-[var(--button)]/60 hover:text-[var(--button)]"
        aria-label="Open theme selector"
      >
        Theme
        <span className="text-xs text-[var(--muted)]">▾</span>
      </button>

      {isOpen && (
        <div className={`${dropdownPosition} min-w-36 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--panel-strong)] shadow-[0_20px_40px_var(--shadow)] backdrop-blur-xl`}>
          {themeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setTheme(option.value);
                setIsOpen(false);
              }}
              className={[
                "flex w-full items-center justify-between px-3 py-2 text-left text-sm transition",
                theme === option.value
                  ? "bg-[var(--soft)] text-[var(--foreground)]"
                  : "text-[var(--muted)] hover:bg-[var(--soft)] hover:text-[var(--foreground)]",
              ].join(" ")}
            >
              <span>{option.label}</span>
              {theme === option.value && <span className="text-[var(--button)]">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
