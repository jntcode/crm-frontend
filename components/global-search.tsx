"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getCustomers } from "@/lib/customers";
import { getLeads } from "@/lib/leads";
import { getCompanies } from "@/lib/companies";
import { getTasks } from "@/lib/tasks";
import { Customer } from "@/types/customer";
import { Lead } from "@/types/lead";
import { Company } from "@/types/company";
import { Task } from "@/types/activity";

type ResultItem = {
  id: string;
  title: string;
  subtitle: string;
  type: string;
  href: string;
  icon: string;
};

const typeColors: Record<string, string> = {
  Contact: "bg-sky-500/15 text-sky-300",
  Lead: "bg-violet-500/15 text-violet-300",
  Company: "bg-emerald-500/15 text-emerald-300",
  Task: "bg-amber-500/15 text-amber-300",
};

export function GlobalSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: customers = [] } = useQuery<Customer[]>({
    queryKey: ["customers"],
    queryFn: getCustomers,
    enabled: open,
  });

  const { data: leads = [] } = useQuery<Lead[]>({
    queryKey: ["leads"],
    queryFn: getLeads,
    enabled: open,
  });

  const { data: companies = [] } = useQuery<Company[]>({
    queryKey: ["companies"],
    queryFn: getCompanies,
    enabled: open,
  });

  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: getTasks,
    enabled: open,
  });

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const q = query.toLowerCase();
  const results: ResultItem[] = [];

  if (q.length > 0) {
    customers.filter((c) => [c.name, c.email, c.companyName ?? ""].join(" ").toLowerCase().includes(q)).slice(0, 3).forEach((c) => {
      results.push({ id: `c-${c.id}`, title: c.name, subtitle: c.email, type: "Contact", href: "/contacts", icon: "👥" });
    });
    leads.filter((l) => [l.name, l.company].join(" ").toLowerCase().includes(q)).slice(0, 3).forEach((l) => {
      results.push({ id: `l-${l.id}`, title: l.name, subtitle: `${l.company} — $${l.value.toLocaleString()}`, type: "Lead", href: "/leads", icon: "🎯" });
    });
    companies.filter((c) => [c.name, c.industry].join(" ").toLowerCase().includes(q)).slice(0, 3).forEach((c) => {
      results.push({ id: `co-${c.id}`, title: c.name, subtitle: c.industry, type: "Company", href: "/companies", icon: "🏢" });
    });
    tasks.filter((tk) => tk.title.toLowerCase().includes(q)).slice(0, 3).forEach((tk) => {
      results.push({ id: `t-${tk.id}`, title: tk.title, subtitle: tk.status.replace(/_/g, " "), type: "Task", href: "/tasks", icon: "✅" });
    });
  }

  function handleSelect(href: string) {
    setOpen(false);
    router.push(href);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center pt-[15vh] p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--panel)] shadow-2xl animate-slide-in overflow-hidden">
        <div className="flex items-center gap-3 border-b border-[var(--border)] px-4 py-3">
          <svg className="w-5 h-5 text-[var(--muted)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-[var(--foreground)] placeholder:text-[var(--muted)] outline-none text-sm"
            placeholder={`Search contacts, leads, companies, tasks...`}
          />
          <kbd className="hidden sm:inline-flex items-center rounded-md border border-[var(--border)] bg-[var(--soft)] px-1.5 py-0.5 text-[10px] text-[var(--muted)]">ESC</kbd>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {query.length === 0 ? (
            <div className="p-8 text-center text-sm text-[var(--muted)]">
              <p>Type to search across all data</p>
              <p className="mt-1 text-[10px]">
                <kbd className="rounded border border-[var(--border)] bg-[var(--soft)] px-1 py-0.5">Ctrl+K</kbd> to toggle
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-sm text-[var(--muted)]">No results found</div>
          ) : (
            <div className="p-2">
              {results.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.href)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-[var(--soft)]"
                >
                  <span className="text-lg">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--foreground)] truncate">{item.title}</p>
                    <p className="text-xs text-[var(--muted)] truncate">{item.subtitle}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${typeColors[item.type]}`}>
                    {item.type}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
