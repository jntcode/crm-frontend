"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const navShortcuts: Record<string, string> = {
  d: "/dashboard",
  l: "/leads",
  c: "/contacts",
  o: "/companies",
  t: "/tasks",
  a: "/activities",
  e: "/emails",
  r: "/reports",
};

export function KeyboardShortcuts() {
  const router = useRouter();
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return;

      if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setShowHelp((prev) => !prev);
        return;
      }

      if (e.key === "Escape") {
        setShowHelp(false);
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key === "k") return;

      if (!e.metaKey && !e.ctrlKey && !e.altKey && navShortcuts[e.key]) {
        e.preventDefault();
        router.push(navShortcuts[e.key]);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);

  if (!showHelp) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowHelp(false)} />
      <div className="relative w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--panel)] shadow-2xl animate-slide-in p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[var(--foreground)]">Keyboard Shortcuts</h2>
          <button onClick={() => setShowHelp(false)} className="text-[var(--muted)] hover:text-[var(--foreground)]">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-2 text-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)] mb-2">Navigation</p>
          {Object.entries(navShortcuts).map(([key, path]) => (
            <div key={key} className="flex items-center justify-between py-1.5">
              <span className="text-[var(--foreground)] capitalize">{path.slice(1)}</span>
              <kbd className="rounded border border-[var(--border)] bg-[var(--soft)] px-2 py-0.5 text-xs text-[var(--muted)]">{key.toUpperCase()}</kbd>
            </div>
          ))}
          <div className="border-t border-[var(--border)] my-3" />
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)] mb-2">Actions</p>
          <div className="flex items-center justify-between py-1.5">
            <span className="text-[var(--foreground)]">Global search</span>
            <kbd className="rounded border border-[var(--border)] bg-[var(--soft)] px-2 py-0.5 text-xs text-[var(--muted)]">Ctrl K</kbd>
          </div>
          <div className="flex items-center justify-between py-1.5">
            <span className="text-[var(--foreground)]">Show shortcuts</span>
            <kbd className="rounded border border-[var(--border)] bg-[var(--soft)] px-2 py-0.5 text-xs text-[var(--muted)]">?</kbd>
          </div>
        </div>
      </div>
    </div>
  );
}
