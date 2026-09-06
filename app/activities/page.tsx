"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { useToast } from "@/components/toast";
import { getActivities, createActivity, deleteActivity } from "@/lib/activities";
import { Activity } from "@/types/activity";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { activitySchema, ActivityFormData } from "@/lib/schemas";

const activityIcons: Record<string, string> = {
  CALL: "☎️",
  EMAIL: "📧",
  MEETING: "👥",
  NOTE: "📝",
};

const typeBadge: Record<string, string> = {
  CALL: "bg-blue-500/10 text-blue-300",
  EMAIL: "bg-purple-500/10 text-purple-300",
  MEETING: "bg-amber-500/10 text-amber-300",
  NOTE: "bg-slate-500/10 text-slate-300",
};

export default function ActivitiesPage() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { data: activities = [], isLoading } = useQuery<Activity[]>({
    queryKey: ["activities"],
    queryFn: getActivities,
  });

  const createMutation = useMutation({
    mutationFn: (data: ActivityFormData) => createActivity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      showToast("Activity logged");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteActivity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      showToast("Activity deleted");
    },
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ActivityFormData>({
    resolver: zodResolver(activitySchema),
    defaultValues: { title: "", description: "", type: "CALL", customerId: "" },
  });

  function onSubmit(data: ActivityFormData) {
    createMutation.mutate(data);
    reset({ title: "", description: "", type: "CALL", customerId: "" });
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <header className="mb-8 rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[0_10px_25px_var(--shadow)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--button)]">Activity Feed</p>
            <h1 className="mt-2 text-3xl font-bold text-[var(--foreground)]">Timeline</h1>
          </header>

          <section className="mb-8 rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[0_10px_25px_var(--shadow)]">
            <h2 className="text-xl font-semibold text-[var(--foreground)]">Log activity</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
              <div>
                <input {...register("title")} className="w-full rounded-xl border border-[var(--border)] bg-[var(--soft)] px-3 py-2.5 text-[var(--foreground)]" placeholder="Title" />
                {errors.title && <p className="mt-1 text-xs text-rose-400">{errors.title.message}</p>}
              </div>
              <textarea {...register("description")} className="min-h-20 w-full rounded-xl border border-[var(--border)] bg-[var(--soft)] px-3 py-2.5 text-[var(--foreground)]" placeholder="Description" />
              <div className="grid gap-4 sm:grid-cols-2">
                <select {...register("type")} className="rounded-xl border border-[var(--border)] bg-[var(--soft)] px-3 py-2.5 text-[var(--foreground)]">
                  <option value="CALL">Call</option>
                  <option value="EMAIL">Email</option>
                  <option value="MEETING">Meeting</option>
                  <option value="NOTE">Note</option>
                </select>
                <div>
                  <input {...register("customerId")} className="w-full rounded-xl border border-[var(--border)] bg-[var(--soft)] px-3 py-2.5 text-[var(--foreground)]" placeholder="Customer ID" />
                  {errors.customerId && <p className="mt-1 text-xs text-rose-400">{errors.customerId.message}</p>}
                </div>
              </div>
              <button type="submit" disabled={createMutation.isPending} className="rounded-xl bg-[var(--button)] px-4 py-2.5 text-sm font-semibold text-[var(--button-text)] active:scale-[0.98] disabled:opacity-50">
                {createMutation.isPending ? "..." : "Log activity"}
              </button>
            </form>
          </section>

          <div className="space-y-4">
            {isLoading ? (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-12 text-center text-[var(--muted)]">
                Loading activities...
              </div>
            ) : activities.length === 0 ? (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-12 text-center">
                <p className="text-[var(--muted)]">No activities yet. Start by creating a new interaction.</p>
              </div>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-6 transition hover:border-[var(--button)]/40">
                  <div className="flex gap-4">
                    <div className="text-3xl">{activityIcons[activity.type]}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-[var(--foreground)]">{activity.title}</h3>
                          <p className="mt-1 text-sm text-[var(--muted)]">{activity.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] whitespace-nowrap ${typeBadge[activity.type] ?? ""}`}>
                            {activity.type}
                          </span>
                          <button onClick={() => deleteMutation.mutate(Number(activity.id))} disabled={deleteMutation.isPending} className="rounded-lg border border-rose-500/25 bg-rose-500/10 px-3 py-1.5 text-sm font-medium text-rose-300 transition hover:bg-rose-500/20 active:scale-[0.98] disabled:opacity-50">
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="mt-3 text-xs text-[var(--muted)]">
                        {new Date(activity.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--soft)]/30 p-6">
            <h3 className="mb-4 font-semibold text-[var(--foreground)]">Quick Stats</h3>
            <div className="grid gap-4 md:grid-cols-4">
              {[
                { label: "Total Activities", value: activities.length.toString(), icon: "📊" },
                { label: "Calls", value: activities.filter((a) => a.type === "CALL").length.toString(), icon: "☎️" },
                { label: "Emails", value: activities.filter((a) => a.type === "EMAIL").length.toString(), icon: "📧" },
                { label: "Meetings", value: activities.filter((a) => a.type === "MEETING").length.toString(), icon: "👥" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-4">
                  <p className="text-2xl">{stat.icon}</p>
                  <p className="mt-2 text-sm text-[var(--muted)]">{stat.label}</p>
                  <p className="mt-1 text-2xl font-bold text-[var(--foreground)]">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
