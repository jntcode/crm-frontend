"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { useToast } from "@/components/toast";
import { exportToCSV } from "@/lib/csv";
import { getLeads, createLead, updateLead, leadStatusOrder } from "@/lib/leads";
import { Lead, LeadStatus } from "@/types/lead";
import { useI18n } from "@/lib/i18n/context";
import { TranslationKey } from "@/lib/i18n/translations";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leadSchema, LeadFormData } from "@/lib/schemas";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const statusStyles: Record<string, string> = {
  NEW: "bg-slate-500/10 text-slate-200 border-slate-500/20",
  CONTACTED: "bg-sky-500/10 text-sky-200 border-sky-500/20",
  QUALIFIED: "bg-violet-500/10 text-violet-200 border-violet-500/20",
  PROPOSAL: "bg-amber-500/10 text-amber-200 border-amber-500/20",
  WON: "bg-emerald-500/10 text-emerald-200 border-emerald-500/20",
  LOST: "bg-rose-500/10 text-rose-200 border-rose-500/20",
};

const statusTranslationKey: Record<string, "new" | "contacted" | "qualified" | "proposal" | "won" | "lost"> = {
  NEW: "new",
  CONTACTED: "contacted",
  QUALIFIED: "qualified",
  PROPOSAL: "proposal",
  WON: "won",
  LOST: "lost",
};

function LeadCard({ lead, t }: { lead: Lead; t: (key: TranslationKey) => string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `lead-${lead.id}`,
    data: { lead },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="rounded-xl border border-[var(--border)] bg-[var(--soft-strong)] p-4 shadow-sm cursor-grab active:cursor-grabbing"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h2 className="text-base font-semibold text-[var(--foreground)]">{lead.name}</h2>
      </div>
      <p className="text-sm text-[var(--muted)]">{lead.company}</p>
      <div className="mt-3 border-t border-[var(--border)] pt-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">{t("value")}</p>
        <p className="mt-1 text-lg font-bold text-[var(--foreground)]">${lead.value.toLocaleString()}</p>
      </div>
    </article>
  );

}

function LeadCardOverlay({ lead }: { lead: Lead }) {
  return (
    <article className="rounded-xl border border-[var(--accent)] bg-[var(--soft-strong)] p-4 shadow-xl rotate-2">
      <h2 className="text-base font-semibold text-[var(--foreground)]">{lead.name}</h2>
      <p className="text-sm text-[var(--muted)]">{lead.company}</p>
      <p className="mt-1 text-lg font-bold text-[var(--foreground)]">${lead.value.toLocaleString()}</p>
    </article>
  );
}

export default function LeadsPage() {
  const { showToast } = useToast();
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [localLeads, setLocalLeads] = useState<Lead[]>([]);

  const { data: serverLeads = [], isLoading } = useQuery<Lead[]>({
    queryKey: ["leads"],
    queryFn: getLeads,
  });

  const leads = localLeads.length > 0 ? localLeads : serverLeads;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const createMutation = useMutation({
    mutationFn: (data: LeadFormData) => createLead(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      showToast(t("create") + "!");
      setShowForm(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: LeadFormData & { status: LeadStatus } }) =>
      updateLead(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      showToast(t("status") + " updated");
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema) as never,
    defaultValues: { name: "", company: "", value: 0 },
  });

  function onSubmit(data: LeadFormData) {
    createMutation.mutate(data);
    reset();
  }

  function handleDragStart(event: DragStartEvent) {
    const lead = event.active.data.current?.lead as Lead;
    setActiveLead(lead);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeLeadData = active.data.current?.lead as Lead;
    const overId = over.id as string;

    if (overId.startsWith("column-")) {
      const newStatus = overId.replace("column-", "") as LeadStatus;
      if (activeLeadData.status !== newStatus) {
        const optimistic = leads.map((l) =>
          l.id === activeLeadData.id ? { ...l, status: newStatus } : l
        );
        setLocalLeads(optimistic);
      }
      return;
    }

    const overLeadData = over.data.current?.lead as Lead;
    if (!overLeadData) return;

    if (activeLeadData.status !== overLeadData.status) {
      const optimistic = leads.map((l) =>
        l.id === activeLeadData.id ? { ...l, status: overLeadData.status } : l
      );
      setLocalLeads(optimistic);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveLead(null);
    setLocalLeads([]);

    const { active, over } = event;
    if (!over) return;

    const activeLeadData = active.data.current?.lead as Lead;
    const overId = over.id as string;

    let newStatus: LeadStatus;
    if (overId.startsWith("column-")) {
      newStatus = overId.replace("column-", "") as LeadStatus;
    } else {
      const overLeadData = over.data.current?.lead as Lead;
      if (!overLeadData) return;
      newStatus = overLeadData.status;
    }

    if (activeLeadData.status !== newStatus) {
      updateMutation.mutate({
        id: activeLeadData.id,
        data: { name: activeLeadData.name, company: activeLeadData.company, value: activeLeadData.value, status: newStatus },
      });
    }
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <header className="mb-8 rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[0_10px_25px_var(--shadow)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--button)]">{t("salesPipeline")}</p>
                <h1 className="mt-2 text-3xl font-bold text-[var(--foreground)]">{t("leadsTitle")}</h1>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => {
                  const csvData = leads.map((l) => ({
                    name: l.name, company: l.company, value: l.value, status: l.status,
                  }));
                  exportToCSV(csvData, "leads");
                  showToast("Exported leads");
                }} className="rounded-xl border border-[var(--border)] bg-[var(--soft)] px-3 py-2.5 text-xs font-medium text-[var(--foreground)] hover:bg-[var(--soft-strong)] transition">
                  Export CSV
                </button>
                <button onClick={() => setShowForm(!showForm)} className="rounded-xl bg-[var(--button)] px-4 py-2.5 text-sm font-semibold text-[var(--button-text)] active:scale-[0.98]">
                  {showForm ? t("cancel") : t("newLead")}
                </button>
              </div>
            </div>
          </header>

          {showForm && (
            <section className="mb-8 rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[0_10px_25px_var(--shadow)]">
              <h2 className="text-xl font-semibold text-[var(--foreground)]">{t("createLead")}</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="mt-5 flex flex-wrap items-end gap-4">
                <div className="min-w-[200px] flex-1">
                  <input {...register("name")} className="w-full rounded-xl border border-[var(--border)] bg-[var(--soft)] px-3 py-2.5 text-[var(--foreground)]" placeholder={t("leadName")} />
                  {errors.name && <p className="mt-1 text-xs text-rose-400">{errors.name.message}</p>}
                </div>
                <div className="min-w-[160px] flex-1">
                  <input {...register("company")} className="w-full rounded-xl border border-[var(--border)] bg-[var(--soft)] px-3 py-2.5 text-[var(--foreground)]" placeholder={t("company")} />
                  {errors.company && <p className="mt-1 text-xs text-rose-400">{errors.company.message}</p>}
                </div>
                <div className="min-w-[120px] flex-1">
                  <input type="number" step="0.01" {...register("value")} className="w-full rounded-xl border border-[var(--border)] bg-[var(--soft)] px-3 py-2.5 text-[var(--foreground)]" placeholder={t("value")} />
                  {errors.value && <p className="mt-1 text-xs text-rose-400">{errors.value.message}</p>}
                </div>
                <button type="submit" disabled={createMutation.isPending} className="rounded-xl bg-[var(--button)] px-4 py-2.5 text-sm font-semibold text-[var(--button-text)] active:scale-[0.98] disabled:opacity-50">
                  {createMutation.isPending ? "..." : t("create")}
                </button>
              </form>
            </section>
          )}

          {isLoading ? (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-12 text-center text-[var(--muted)]">
              {t("loading")}
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
            >
              <section className="grid grid-cols-1 gap-4 xl:grid-cols-6">
                {leadStatusOrder.map((status) => {
                  const filteredLeads = leads.filter((lead) => lead.status === status);
                  return (
                    <div key={status} className="min-h-[420px] rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-3 shadow-[0_10px_25px_var(--shadow)]">
                      <div className="mb-4 flex items-center justify-between px-2">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${statusStyles[status]}`}>
                            {t(statusTranslationKey[status])}
                          </span>
                          <span className="text-xs text-[var(--muted)]">{filteredLeads.length}</span>
                        </div>
                      </div>
                      <SortableContext items={filteredLeads.map((l) => `lead-${l.id}`)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-3" id={`column-${status}`}>
                          {filteredLeads.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-[var(--border)] p-4 text-center text-sm text-[var(--muted)]">
                              {t("noLeads")}
                            </div>
                          ) : (
                            filteredLeads.map((lead) => (
                              <LeadCard key={lead.id} lead={lead} t={t} />
                            ))
                          )}
                        </div>
                      </SortableContext>
                    </div>
                  );
                })}
              </section>

              <DragOverlay>
                {activeLead ? <LeadCardOverlay lead={activeLead} /> : null}
              </DragOverlay>
            </DndContext>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
