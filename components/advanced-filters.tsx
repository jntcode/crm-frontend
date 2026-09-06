"use client";

export interface FilterConfig {
  key: string;
  label: string;
  type: "text" | "select";
  options?: { value: string; label: string }[];
}

interface AdvancedFiltersProps {
  filters: FilterConfig[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onClear: () => void;
}

export function AdvancedFilters({ filters, values, onChange, onClear }: AdvancedFiltersProps) {
  const hasActive = Object.values(values).some((v) => v !== "");

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((filter) => {
        const active = values[filter.key] !== "";
        if (filter.type === "select") {
          return (
            <select
              key={filter.key}
              value={values[filter.key] ?? ""}
              onChange={(e) => onChange(filter.key, e.target.value)}
              className={[
                "rounded-xl border border-[var(--border)] bg-[var(--panel)] px-3 py-1.5 text-sm text-[var(--foreground)] outline-none transition",
                active ? "border-[var(--accent)] ring-1 ring-[var(--accent)]/30" : "",
              ].join(" ")}
            >
              <option value="">{filter.label}</option>
              {filter.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          );
        }

        return (
          <input
            key={filter.key}
            type="text"
            value={values[filter.key] ?? ""}
            onChange={(e) => onChange(filter.key, e.target.value)}
            placeholder={filter.label}
            className={[
              "rounded-xl border border-[var(--border)] bg-[var(--panel)] px-3 py-1.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] outline-none transition",
              active ? "border-[var(--accent)] ring-1 ring-[var(--accent)]/30" : "",
            ].join(" ")}
          />
        );
      })}

      {hasActive && (
        <button
          type="button"
          onClick={onClear}
          className="rounded-xl border border-[var(--border)] bg-[var(--soft)] px-3 py-1.5 text-sm font-medium text-[var(--muted)] transition hover:text-[var(--foreground)]"
        >
          Clear all
        </button>
      )}

      {hasActive && (
        <div className="flex flex-wrap gap-1.5">
          {filters
            .filter((f) => values[f.key] !== "")
            .map((filter) => (
              <span
                key={filter.key}
                className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--soft)] px-2.5 py-0.5 text-xs font-medium text-[var(--foreground)]"
              >
                {filter.label}: {values[filter.key]}
                <button
                  type="button"
                  onClick={() => onChange(filter.key, "")}
                  className="ml-0.5 text-[var(--muted)] transition hover:text-[var(--foreground)]"
                  aria-label={`Remove ${filter.label} filter`}
                >
                  &times;
                </button>
              </span>
            ))}
        </div>
      )}
    </div>
  );
}
