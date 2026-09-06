"use client";

import { Suspense, lazy } from "react";

const ReportsContent = lazy(() => import("./reports-content"));

export default function ReportsPageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--background)]">
        <div className="px-6 py-8 max-w-6xl mx-auto">
          <div className="h-10 w-48 rounded bg-[var(--panel)] animate-pulse mb-8" />
          <div className="grid gap-6 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-80 rounded-2xl bg-[var(--panel)] animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    }>
      <ReportsContent />
    </Suspense>
  );
}
