"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { useToast } from "@/components/toast";
import { getTasks, createTask, updateTask, deleteTask } from "@/lib/tasks";
import { Task } from "@/types/activity";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, TaskFormData } from "@/lib/schemas";

const priorityColors: Record<string, { bg: string; text: string }> = {
  LOW: { bg: "bg-slate-500/10", text: "text-slate-300" },
  MEDIUM: { bg: "bg-blue-500/10", text: "text-blue-300" },
  HIGH: { bg: "bg-amber-500/10", text: "text-amber-300" },
  URGENT: { bg: "bg-rose-500/10", text: "text-rose-300" },
};

const statusIcons: Record<string, string> = {
  TODO: "⭕",
  IN_PROGRESS: "🔄",
  DONE: "✅",
};

const statusOrder: Task["status"][] = ["TODO", "IN_PROGRESS", "DONE"];

export default function TasksPage() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<string | null>(null);

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const createMutation = useMutation({
    mutationFn: (data: TaskFormData) => createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      showToast("Task created");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Task> }) => updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      showToast("Status updated");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      showToast("Task deleted");
    },
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: { title: "", description: "", priority: "MEDIUM", assignedTo: "", dueDate: "" },
  });

  function onSubmit(data: TaskFormData) {
    createMutation.mutate(data);
    reset({ title: "", description: "", priority: "MEDIUM", assignedTo: "", dueDate: "" });
  }

  function cycleStatus(task: Task) {
    const idx = statusOrder.indexOf(task.status);
    const next = statusOrder[(idx + 1) % statusOrder.length];
    updateMutation.mutate({ id: Number(task.id), data: { ...task, status: next } });
  }

  const counts = {
    TODO: tasks.filter((t) => t.status === "TODO").length,
    IN_PROGRESS: tasks.filter((t) => t.status === "IN_PROGRESS").length,
    DONE: tasks.filter((t) => t.status === "DONE").length,
  };

  const displayedTasks = filter ? tasks.filter((t) => t.status === filter) : tasks;

  return (
    <ProtectedRoute>
      <main className="min-h-screen px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <header className="mb-8 rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[0_10px_25px_var(--shadow)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--button)]">Task Management</p>
            <h1 className="mt-2 text-3xl font-bold text-[var(--foreground)]">Tasks</h1>
          </header>

          <div className="mb-6 grid gap-4 md:grid-cols-3">
            {(["TODO", "IN_PROGRESS", "DONE"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(filter === status ? null : status)}
                className={`rounded-xl border bg-[var(--panel)] p-4 text-left transition cursor-pointer active:scale-[0.98] ${
                  filter === status ? "border-[var(--button)]" : "border-[var(--border)] hover:border-[var(--button)]/40"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{statusIcons[status]}</span>
                  <div>
                    <p className="text-xs text-[var(--muted)] uppercase tracking-widest">{status.replace(/_/g, " ")}</p>
                    <p className="text-2xl font-bold text-[var(--foreground)]">{counts[status]}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <section className="mb-8 rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[0_10px_25px_var(--shadow)]">
            <h2 className="text-xl font-semibold text-[var(--foreground)]">Create task</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
              <div>
                <input {...register("title")} className="w-full rounded-xl border border-[var(--border)] bg-[var(--soft)] px-3 py-2.5 text-[var(--foreground)]" placeholder="Title" />
                {errors.title && <p className="mt-1 text-xs text-rose-400">{errors.title.message}</p>}
              </div>
              <textarea {...register("description")} className="min-h-20 w-full rounded-xl border border-[var(--border)] bg-[var(--soft)] px-3 py-2.5 text-[var(--foreground)]" placeholder="Description" />
              <div className="grid gap-4 sm:grid-cols-3">
                <select {...register("priority")} className="rounded-xl border border-[var(--border)] bg-[var(--soft)] px-3 py-2.5 text-[var(--foreground)]">
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
                <input {...register("assignedTo")} className="rounded-xl border border-[var(--border)] bg-[var(--soft)] px-3 py-2.5 text-[var(--foreground)]" placeholder="Assigned to" />
                <input type="date" {...register("dueDate")} className="rounded-xl border border-[var(--border)] bg-[var(--soft)] px-3 py-2.5 text-[var(--foreground)]" />
              </div>
              <button type="submit" disabled={createMutation.isPending} className="rounded-xl bg-[var(--button)] px-4 py-2.5 text-sm font-semibold text-[var(--button-text)] active:scale-[0.98] disabled:opacity-50">
                {createMutation.isPending ? "..." : "Create task"}
              </button>
            </form>
          </section>

          <div className="space-y-3">
            {isLoading ? (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-12 text-center text-[var(--muted)]">
                Loading tasks...
              </div>
            ) : displayedTasks.length === 0 ? (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-12 text-center">
                <p className="text-[var(--muted)]">No tasks{filter ? ` with status ${filter.replace(/_/g, " ").toLowerCase()}` : ""}.</p>
              </div>
            ) : (
              displayedTasks.map((task) => (
                <div key={task.id} className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-4 transition hover:border-[var(--button)]/40">
                  <div className="flex items-center gap-4">
                    <button onClick={() => cycleStatus(task)} className="w-5 h-5 rounded cursor-pointer active:scale-[0.98]" title={`Current: ${task.status.replace(/_/g, " ")}. Click to cycle.`}>
                      <span className="text-xl">{statusIcons[task.status]}</span>
                    </button>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${task.status === "DONE" ? "line-through text-[var(--muted)]" : "text-[var(--foreground)]"}`}>
                        {task.title}
                      </h3>
                      {task.description && <p className="mt-1 text-sm text-[var(--muted)]">{task.description}</p>}
                      {task.assignedTo && (
                        <p className="mt-2 text-xs text-[var(--muted)]">
                          <span className="font-medium">{task.assignedTo}</span>
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {task.dueDate && (
                        <span className="text-xs text-[var(--muted)]">
                          {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      )}
                      <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${priorityColors[task.priority]?.bg ?? ""} ${priorityColors[task.priority]?.text ?? ""}`}>
                        {task.priority}
                      </span>
                      <button onClick={() => deleteMutation.mutate(Number(task.id))} disabled={deleteMutation.isPending} className="rounded-lg border border-rose-500/25 bg-rose-500/10 px-3 py-1.5 text-sm font-medium text-rose-300 transition hover:bg-rose-500/20 active:scale-[0.98] disabled:opacity-50">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
