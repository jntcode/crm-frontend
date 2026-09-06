"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { registerUser, setAuthSession } from "@/lib/auth";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n/context";
import { LanguageSwitcher } from "@/components/language-switcher";

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [name, setName] = useState("Alicia Johnson");
  const [email, setEmail] = useState("alicia@crm.com");
  const [password, setPassword] = useState("secret123");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const session = await registerUser({ name, email, password });
      setAuthSession({
        token: session.token,
        name: session.name,
        email: session.email,
      });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create account");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1497215842964-222b430dc094?w=1400&q=80"
          alt=""
          className="w-full h-full object-cover opacity-[0.1]"
        />
        <div className="absolute inset-0 hero-gradient" />
      </div>
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl animate-float-reverse pointer-events-none" />

      {/* Language switcher top-right */}
      <div className="absolute top-6 right-6 z-20 w-36">
        <LanguageSwitcher />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md rounded-3xl border border-[var(--border)] bg-[var(--panel)] p-8 shadow-[0_24px_60px_var(--shadow)] backdrop-blur-xl"
      >
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition mb-6">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to home
        </Link>
        <div className="mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
            CRM
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[var(--foreground)]">{t("registerTitle")}</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">{t("registerSubtitle")}</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">{t("name")}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--soft)] px-3 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]/60"
              placeholder="Jane Smith"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">{t("email")}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--soft)] px-3 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]/60"
              placeholder="you@company.com"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">{t("password")}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--soft)] px-3 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]/60"
              placeholder="At least 6 characters"
              required
            />
          </div>

          {error ? (
            <div className="rounded-xl border border-rose-500/25 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-[var(--button)] px-4 py-3.5 text-sm font-bold text-[var(--button-text)] shadow-[0_8px_30px_var(--accent-glow)] transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "..." : t("register")}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[var(--muted)]">
          {t("alreadyHaveAccount")}{" "}
          <Link href="/login" className="font-semibold text-[var(--accent)]">
            {t("login")}
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
