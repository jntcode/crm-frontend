export default function ContactsLoading() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="px-6 py-8 max-w-5xl mx-auto">
        <div className="h-10 w-48 rounded bg-[var(--panel)] animate-pulse mb-8" />

        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          {/* Form skeleton */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6">
            <div className="h-6 w-32 rounded bg-[var(--soft)] animate-pulse mb-5" />
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-10 rounded-xl bg-[var(--soft)] animate-pulse" />
              ))}
            </div>
          </div>

          {/* List skeleton */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6">
            <div className="flex justify-between mb-5">
              <div className="h-6 w-32 rounded bg-[var(--soft)] animate-pulse" />
              <div className="flex gap-2">
                <div className="h-8 w-24 rounded-lg bg-[var(--soft)] animate-pulse" />
                <div className="h-8 w-24 rounded-lg bg-[var(--soft)] animate-pulse" />
              </div>
            </div>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-28 rounded-xl bg-[var(--soft)] animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
