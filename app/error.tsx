"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
      <div className="text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-4xl mb-4">
          ⚠
        </div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Something went wrong</h1>
        <p className="mt-2 max-w-md text-[var(--muted)]">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="mt-6 rounded-xl bg-[var(--button)] px-5 py-2.5 text-sm font-semibold text-[var(--button-text)] hover:opacity-90 transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
