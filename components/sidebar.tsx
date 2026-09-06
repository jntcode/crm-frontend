"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearAuthSession, getAuthSession } from "@/lib/auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { NotificationBell } from "@/components/notifications";
import { useI18n } from "@/lib/i18n/context";

const navItems = [
  { href: "/dashboard", key: "dashboard" as const, icon: "📊" },
  { href: "/contacts", key: "contacts" as const, icon: "👥" },
  { href: "/companies", key: "companies" as const, icon: "🏢" },
  { href: "/leads", key: "leadsNav" as const, icon: "🎯" },
  { href: "/tasks", key: "tasks" as const, icon: "✅" },
  { href: "/activities", key: "activities" as const, icon: "📋" },
  { href: "/emails", key: "emails" as const, icon: "📧" },
  { href: "/reports", key: "reports" as const, icon: "📈" },
  { href: "/settings", key: "settings" as const, icon: "⚙️" },
];

type SidebarProps = {
  mobileOpen: boolean;
  onCloseMobile: () => void;
};

export function Sidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const session = getAuthSession();
  const { t } = useI18n();

  function handleLogout() {
    clearAuthSession();
    router.push("/login");
  }

  function handleNavClick() {
    onCloseMobile();
  }

  const sidebarContent = (
    <>
      <div className="px-5 py-5">
        <Link href="/" className="flex items-center gap-2 transition hover:opacity-80" onClick={handleNavClick}>
          <div className="text-xl font-bold text-[var(--foreground)]">◇ CRM</div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        <Link
          href="/"
          onClick={handleNavClick}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition text-[var(--accent)] hover:bg-[var(--accent)]/10 mb-1"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          {t("home")}
        </Link>

        <div className="border-t border-[var(--border)] my-2" />

        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleNavClick}
              className={[
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                isActive
                  ? "bg-[var(--soft)] text-[var(--foreground)]"
                  : "text-[var(--muted)] hover:bg-[var(--soft)] hover:text-[var(--foreground)]",
              ].join(" ")}
            >
              <span className="text-base">{item.icon}</span>
              {t(item.key)}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[var(--border)] px-3 py-4 space-y-2">
        <div className="flex items-center gap-2 px-3 mb-2">
          <LanguageSwitcher />
          <NotificationBell />
        </div>
        <div className="px-3">
          <ThemeToggle position="up" />
        </div>
        <Link href="/about" className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--soft)] transition">
          <span>📋</span> About this project
        </Link>
        <div className="flex items-center gap-2 px-3 py-1">
          <a href="https://github.com/jntcode" target="_blank" rel="noopener noreferrer" className="text-[var(--muted)] hover:text-[var(--foreground)] transition" title="GitHub">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          </a>
          <a href="https://www.linkedin.com/in/jhonata-silva-181675373/" target="_blank" rel="noopener noreferrer" className="text-[var(--muted)] hover:text-[var(--foreground)] transition" title="LinkedIn">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
          <span className="text-[10px] text-[var(--muted)] ml-1">by Jhonata Rusaffa</span>
        </div>
        {session && (
          <p className="px-3 text-xs text-[var(--muted)] truncate">{session.name}</p>
        )}
        <button
          onClick={() => { handleLogout(); handleNavClick(); }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--muted)] transition hover:bg-[var(--soft)] hover:text-[var(--foreground)]"
        >
          <span className="text-base">🚪</span>
          {t("logout")}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-40 w-60 flex-col border-r border-[var(--border)] bg-[var(--panel-strong)] backdrop-blur-xl">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onCloseMobile} />
          <aside className="fixed inset-y-0 left-0 z-50 w-72 flex flex-col border-r border-[var(--border)] bg-[var(--panel-strong)] backdrop-blur-xl animate-slide-in-left">
            <button
              onClick={onCloseMobile}
              className="absolute top-4 right-4 p-2 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--soft)] transition"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
