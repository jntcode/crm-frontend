"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { loginUser, setAuthSession, setDemoSession, googleLogin } from "@/lib/auth";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n/context";
import { LanguageSwitcher } from "@/components/language-switcher";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [email, setEmail] = useState("admin@crm.com");
  const [password, setPassword] = useState("secret123");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const session = await loginUser({ email, password });
      setAuthSession({
        token: session.token,
        name: session.name,
        email: session.email,
      });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDemoLogin() {
    await setDemoSession();
    router.push("/dashboard");
  }

  useEffect(() => {
    if (googleClientId && typeof window !== "undefined") {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      return () => { document.body.removeChild(script); };
    }
  }, [googleClientId]);

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80"
          alt=""
          className="w-full h-full object-cover opacity-[0.1]"
        />
        <div className="absolute inset-0 hero-gradient" />
      </div>
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[var(--accent)]/10 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float-reverse pointer-events-none" />

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
          <h1 className="mt-2 text-3xl font-bold text-[var(--foreground)]">{t("loginTitle")}</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">{t("loginSubtitle")}</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
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
              placeholder="••••••••"
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
            {isSubmitting ? "..." : t("login")}
          </button>

          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full rounded-xl border-2 border-[var(--border)] bg-[var(--soft)] px-4 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)]/40 hover:bg-[var(--soft-strong)] active:scale-[0.98]"
          >
            {t("tryDemo")}
          </button>

          {googleClientId && (
            <>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[var(--border)]" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-[var(--panel)] px-2 text-[var(--muted)]">or</span>
                </div>
              </div>
              <button
                type="button"
                onClick={async () => {
                  const w = window as unknown as Record<string, unknown> & { google?: Record<string, unknown> };
                  if (typeof window === "undefined" || !w.google) {
                    alert("Google SDK not loaded. Set NEXT_PUBLIC_GOOGLE_CLIENT_ID.");
                    return;
                  }
                  try {
                    const google = w.google as Record<string, unknown>;
                    const accounts = google.accounts as Record<string, unknown>;
                    const id = accounts.id as Record<string, (cb: unknown) => void>;
                    const { credential } = await new Promise<{ credential: string }>((resolve, reject) => {
                      id.initialize({
                        client_id: googleClientId,
                        callback: resolve,
                        onError: reject,
                      });
                      id.prompt((notification: { isNotDisplayed?: () => boolean }) => {
                        if (notification.isNotDisplayed?.()) reject(new Error("Google prompt not displayed"));
                      });
                    });
                    if (credential) {
                      const session = await googleLogin(credential);
                      setAuthSession(session);
                      router.push("/dashboard");
                    }
                  } catch {
                    // User cancelled or error
                  }
                }}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--soft)] px-4 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)]/40 hover:bg-[var(--soft-strong)] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign in with Google
              </button>
            </>
          )}
        </form>

        <div className="mt-6 text-center text-sm text-[var(--muted)]">
          {t("noAccount")}{" "}
          <Link href="/register" className="font-semibold text-[var(--accent)]">
            {t("register")}
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
