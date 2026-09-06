export default function TasksLoading() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="px-6 py-8 max-w-5xl mx-auto">
        <div className="h-10 w-48 rounded bg-[var(--panel)] animate-pulse mb-8" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-[var(--panel)] animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
