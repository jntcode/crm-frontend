"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { useToast } from "@/components/toast";
import { getEmails } from "@/lib/emails";
import { createEmail, deleteEmail } from "@/lib/email-actions";
import { Email } from "@/types/email";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailSchema, EmailFormData } from "@/lib/schemas";
import { useState } from "react";

const statusColors: Record<string, { bg: string; text: string; icon: string }> = {
  SENT: { bg: "bg-blue-500/10", text: "text-blue-300", icon: "📤" },
  RECEIVED: { bg: "bg-slate-500/10", text: "text-slate-300", icon: "📥" },
  OPENED: { bg: "bg-amber-500/10", text: "text-amber-300", icon: "👁️" },
  REPLIED: { bg: "bg-emerald-500/10", text: "text-emerald-300", icon: "↩️" },
};

export default function EmailsPage() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [showCompose, setShowCompose] = useState(false);

  const { data: emails = [], isLoading } = useQuery<Email[]>({
    queryKey: ["emails"],
    queryFn: getEmails,
  });

  const sendMutation = useMutation({
    mutationFn: (data: EmailFormData) =>
      createEmail({ customerId: "", ...data, fromAddress: "user@crm.app", status: "SENT" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emails"] });
      showToast("Email sent");
      setShowCompose(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteEmail(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emails"] });
      showToast("Email deleted");
    },
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: { toAddress: "", subject: "", body: "" },
  });

  function onSubmit(data: EmailFormData) {
    sendMutation.mutate(data);
    reset();
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <header className="mb-8 rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[0_10px_25px_var(--shadow)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--button)]">Email Integration</p>
                <h1 className="mt-2 text-3xl font-bold text-[var(--foreground)]">Emails</h1>
              </div>
              <button onClick={() => setShowCompose(!showCompose)} className="rounded-xl bg-[var(--button)] px-4 py-2.5 text-sm font-semibold text-[var(--button-text)] active:scale-[0.98]">
                {showCompose ? "Cancel" : "Compose"}
              </button>
            </div>
          </header>

          {showCompose && (
            <section className="mb-8 rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[0_10px_25px_var(--shadow)]">
              <h2 className="text-xl font-semibold text-[var(--foreground)]">Compose email</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
                <div>
                  <input {...register("toAddress")} type="email" className="w-full rounded-xl border border-[var(--border)] bg-[var(--soft)] px-3 py-2.5 text-[var(--foreground)]" placeholder="To address" />
                  {errors.toAddress && <p className="mt-1 text-xs text-rose-400">{errors.toAddress.message}</p>}
                </div>
                <div>
                  <input {...register("subject")} className="w-full rounded-xl border border-[var(--border)] bg-[var(--soft)] px-3 py-2.5 text-[var(--foreground)]" placeholder="Subject" />
                  {errors.subject && <p className="mt-1 text-xs text-rose-400">{errors.subject.message}</p>}
                </div>
                <div>
                  <textarea {...register("body")} className="min-h-32 w-full rounded-xl border border-[var(--border)] bg-[var(--soft)] px-3 py-2.5 text-[var(--foreground)]" placeholder="Body" />
                  {errors.body && <p className="mt-1 text-xs text-rose-400">{errors.body.message}</p>}
                </div>
                <button type="submit" disabled={sendMutation.isPending} className="rounded-xl bg-[var(--button)] px-4 py-2.5 text-sm font-semibold text-[var(--button-text)] active:scale-[0.98] disabled:opacity-50">
                  {sendMutation.isPending ? "..." : "Send"}
                </button>
              </form>
            </section>
          )}

          {isLoading ? (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-12 text-center text-[var(--muted)]">
              Loading emails...
            </div>
          ) : (
            <>
              <div className="mb-6 grid gap-4 md:grid-cols-4">
                {[
                  { label: "Total Emails", value: emails.length.toString(), icon: "📧" },
                  { label: "Sent", value: emails.filter((e) => e.status === "SENT").length.toString(), icon: "📤" },
                  { label: "Opened", value: emails.filter((e) => e.status === "OPENED").length.toString(), icon: "👁️" },
                  { label: "Replied", value: emails.filter((e) => e.status === "REPLIED").length.toString(), icon: "↩️" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-4">
                    <p className="text-2xl">{stat.icon}</p>
                    <p className="mt-2 text-sm text-[var(--muted)]">{stat.label}</p>
                    <p className="mt-1 text-2xl font-bold text-[var(--foreground)]">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                {emails.length === 0 ? (
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-12 text-center">
                    <p className="text-[var(--muted)]">No emails synced yet.</p>
                  </div>
                ) : (
                  emails.map((email) => {
                    const color = statusColors[email.status] ?? statusColors.RECEIVED;
                    return (
                      <div key={email.id} className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-4 transition hover:border-[var(--button)]/40">
                        <div className="flex items-start gap-4">
                          <div className="text-2xl">{color.icon}</div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h3 className="truncate font-semibold text-[var(--foreground)]">{email.subject}</h3>
                                <p className="mt-1 line-clamp-2 text-sm text-[var(--muted)]">{email.body}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`whitespace-nowrap rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${color.bg} ${color.text}`}>
                                  {email.status}
                                </span>
                                <button onClick={() => deleteMutation.mutate(Number(email.id))} disabled={deleteMutation.isPending} className="rounded-lg border border-rose-500/25 bg-rose-500/10 px-2 py-1 text-xs font-medium text-rose-300 transition hover:bg-rose-500/20 active:scale-[0.98] disabled:opacity-50">
                                  Delete
                                </button>
                              </div>
                            </div>
                            <div className="mt-3 flex items-center justify-between text-xs text-[var(--muted)]">
                              <div>
                                <span className="font-medium">{email.fromAddress}</span> → {email.toAddress}
                              </div>
                              <time>
                                {new Date(email.sentAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </time>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
