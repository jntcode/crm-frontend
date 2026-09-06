"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="relative inline-block">
          <span className="text-[120px] sm:text-[160px] font-bold bg-gradient-to-r from-[var(--accent)] to-violet-500 bg-clip-text text-transparent leading-none select-none">
            404
          </span>
          <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-[var(--accent)]/10 blur-2xl animate-float" />
          <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-violet-500/10 blur-2xl animate-float-reverse" />
        </div>

        <h1 className="mt-4 text-2xl font-bold text-[var(--foreground)]">Page Not Found</h1>
        <p className="mt-2 max-w-md text-[var(--muted)]">
          The page you are looking for does not exist or has been moved.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-xl bg-[var(--button)] px-5 py-2.5 text-sm font-semibold text-[var(--button-text)] hover:opacity-90 transition"
          >
            Back to Home
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl border border-[var(--border)] bg-[var(--soft)] px-5 py-2.5 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--soft-strong)] transition"
          >
            Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
