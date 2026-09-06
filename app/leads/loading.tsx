export default function LeadsLoading() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="px-6 py-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="h-10 w-48 rounded bg-[var(--panel)] animate-pulse" />
          <div className="h-10 w-32 rounded-xl bg-[var(--panel)] animate-pulse" />
        </div>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-8 rounded-lg bg-[var(--panel)] animate-pulse" />
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="h-24 rounded-xl bg-[var(--panel)] animate-pulse" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
