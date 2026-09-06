export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-6xl mx-auto">
        {/* Hero skeleton */}
        <div className="mb-8 h-40 rounded-2xl bg-[var(--panel)] animate-pulse" />

        {/* Stats skeleton */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-[var(--panel)] animate-pulse" />
          ))}
        </div>

        {/* Charts skeleton */}
        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-[var(--panel)] animate-pulse" />
          ))}
        </div>

        {/* Table skeleton */}
        <div className="h-48 rounded-2xl bg-[var(--panel)] animate-pulse" />
      </div>
    </div>
  );
}
