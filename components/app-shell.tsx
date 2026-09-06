"use client";

import { useMemo, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { isAuthenticated } from "@/lib/auth";
import { ToastProvider } from "@/components/toast";
import { ScrollToTop } from "@/components/scroll-to-top";
import { ConfirmProvider } from "@/components/confirm-modal";
import { GlobalSearch } from "@/components/global-search";
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts";

const publicPaths = ["/login", "/register", "/", "/about"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showSidebar = useMemo(() => !publicPaths.includes(pathname) && isAuthenticated(), [pathname]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  if (!showSidebar) {
    return (
      <ToastProvider>
        <ConfirmProvider>
          <ScrollToTop />
          {children}
        </ConfirmProvider>
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <ConfirmProvider>
        <ScrollToTop />
        <GlobalSearch />
        <KeyboardShortcuts />
        <div className="flex min-h-screen">
          <Sidebar mobileOpen={mobileOpen} onCloseMobile={closeMobile} />
          <div className="flex-1 lg:pl-60">
            {/* Desktop search bar */}
            <div className="hidden lg:flex sticky top-0 z-30 items-center gap-3 border-b border-[var(--border)] bg-[var(--panel-strong)]/80 backdrop-blur-xl px-6 py-2">
              <button
                onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }))}
                className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--soft)] px-3 py-1.5 text-sm text-[var(--muted)] hover:border-[var(--accent)]/40 transition w-72"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                Search...
                <kbd className="ml-auto rounded border border-[var(--border)] bg-[var(--panel)] px-1 py-0.5 text-[10px]">Ctrl K</kbd>
              </button>
            </div>
            {/* Mobile header */}
            <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-[var(--border)] bg-[var(--panel-strong)]/80 backdrop-blur-xl px-4 py-3 lg:hidden">
              <button
                onClick={() => setMobileOpen(true)}
                className="p-2 rounded-lg text-[var(--foreground)] hover:bg-[var(--soft)] transition"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
              <span className="text-lg font-bold text-[var(--foreground)]">◇ CRM</span>
            </div>
            <div key={pathname} className="animate-page-in">
              {children}
            </div>
          </div>
        </div>
      </ConfirmProvider>
    </ToastProvider>
  );
}
