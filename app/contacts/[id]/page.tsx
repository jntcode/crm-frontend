"use client";

import { use } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/protected-route";
import { useToast } from "@/components/toast";
import { useConfirm } from "@/components/confirm-modal";
import { getCustomers, deleteCustomer } from "@/lib/customers";
import { getActivities } from "@/lib/activities";
import { getEmails } from "@/lib/emails";
import { motion } from "framer-motion";
import { Customer } from "@/types/customer";
import { Activity } from "@/types/activity";
import { Email } from "@/types/email";
import Link from "next/link";

const statusColors: Record<string, string> = {
  Active: "bg-emerald-500/15 text-emerald-300",
  Inactive: "bg-zinc-500/15 text-zinc-400",
  Lead: "bg-violet-500/15 text-violet-300",
  Customer: "bg-sky-500/15 text-sky-300",
};

const activityIcons: Record<string, string> = {
  CALL: "📞",
  EMAIL: "📧",
  MEETING: "📅",
  NOTE: "📝",
  TASK: "✅",
};

function ContactContent({ id }: { id: string }) {
  const { showToast } = useToast();
  const { confirm } = useConfirm();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: customers = [], isLoading } = useQuery<Customer[]>({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  const { data: activities = [] } = useQuery<Activity[]>({
    queryKey: ["activities"],
    queryFn: getActivities,
  });

  const { data: emails = [] } = useQuery<Email[]>({
    queryKey: ["emails"],
    queryFn: getEmails,
  });

  const customer = customers.find((c) => c.id === Number(id));
  const customerActivities = activities.filter((a) => a.customerId === id);
  const customerEmails = emails.filter((e) => e.customerId === id);

  const deleteMutation = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      showToast("Contact deleted successfully");
      router.push("/contacts");
    },
  });

  async function handleDelete() {
    const ok = await confirm({
      title: "Delete contact?",
      message: "This will permanently remove this contact and cannot be undone.",
      variant: "danger",
      confirmLabel: "Delete",
    });
    if (ok) deleteMutation.mutate(Number(id));
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        <div className="px-6 py-8 max-w-4xl mx-auto">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 rounded-2xl bg-[var(--panel)] animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--muted)]">Contact not found</p>
          <Link href="/contacts" className="mt-4 inline-block text-sm text-[var(--accent)] hover:underline">
            Back to Contacts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="border-b border-[var(--border)] bg-[var(--panel)]">
        <div className="px-6 py-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-[var(--muted)] mb-4">
            <Link href="/contacts" className="hover:text-[var(--foreground)] transition">Contacts</Link>
            <span>/</span>
            <span className="text-[var(--foreground)]">{customer.name}</span>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--accent)]/20 to-violet-500/20 text-xl font-bold text-[var(--accent)]">
                {customer.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[var(--foreground)]">{customer.name}</h1>
                <p className="text-sm text-[var(--muted)]">{customer.position ?? "No position"} {customer.companyName ? `at ${customer.companyName}` : ""}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[customer.status ?? "Active"] ?? statusColors.Active}`}>
                {customer.status ?? "Active"}
              </span>
              <button
                onClick={handleDelete}
                className="rounded-lg border border-rose-500/25 bg-rose-500/10 px-3 py-1.5 text-sm font-medium text-rose-300 hover:bg-rose-500/20 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 max-w-4xl mx-auto">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1 rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6"
          >
            <h2 className="text-sm font-semibold text-[var(--foreground)] mb-4">Contact Details</h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-[var(--muted)]">Email</dt>
                <dd className="text-[var(--foreground)] mt-0.5">
                  {customer.email ? (
                    <a href={`mailto:${customer.email}`} className="hover:underline">{customer.email}</a>
                  ) : (
                    <span className="text-[var(--muted)]">Not provided</span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">Phone</dt>
                <dd className="text-[var(--foreground)] mt-0.5">
                  {customer.phone ? (
                    <a href={`tel:${customer.phone}`} className="hover:underline">{customer.phone}</a>
                  ) : (
                    <span className="text-[var(--muted)]">Not provided</span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">Company</dt>
                <dd className="text-[var(--foreground)] mt-0.5">{customer.companyName ?? "Not assigned"}</dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">Position</dt>
                <dd className="text-[var(--foreground)] mt-0.5">{customer.position ?? "Not specified"}</dd>
              </div>
              {customer.notes && (
                <div>
                  <dt className="text-[var(--muted)]">Notes</dt>
                  <dd className="text-[var(--foreground)] mt-0.5 whitespace-pre-wrap">{customer.notes}</dd>
                </div>
              )}
            </dl>
          </motion.div>

          {/* Activity Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-[var(--foreground)]">Activity Timeline</h2>
              <span className="text-xs text-[var(--muted)]">{customerActivities.length} activities</span>
            </div>

            {customerActivities.length === 0 ? (
              <p className="text-sm text-[var(--muted)] py-8 text-center">No activities recorded yet.</p>
            ) : (
              <div className="space-y-4">
                {customerActivities.map((activity, i) => (
                  <div key={activity.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className="text-lg">{activityIcons[activity.type] ?? "📋"}</span>
                      {i < customerActivities.length - 1 && <div className="mt-1 w-px flex-1 bg-[var(--border)]" />}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[var(--foreground)]">{activity.type}</span>
                        {activity.description && (
                          <span className="text-xs text-[var(--muted)] truncate max-w-[200px]">{activity.description}</span>
                        )}
                      </div>
                      {activity.createdAt && (
                        <p className="text-xs text-[var(--muted)] mt-0.5">
                          {new Date(activity.createdAt).toLocaleDateString("en-US", {
                            month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Emails */}
            {customerEmails.length > 0 && (
              <>
                <div className="border-t border-[var(--border)] mt-4 pt-4">
                  <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Email History</h3>
                  <div className="space-y-2">
                    {customerEmails.map((email) => (
                      <div key={email.id} className="rounded-lg border border-[var(--border)] bg-[var(--soft)] p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-[var(--foreground)]">{email.subject}</span>
                          <span className="text-xs text-[var(--muted)]">
                            {email.sentAt ? new Date(email.sentAt).toLocaleDateString() : "No date"}
                          </span>
                        </div>
                        {email.body && (
                          <p className="text-xs text-[var(--muted)] mt-1 line-clamp-2">{email.body}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <ProtectedRoute>
      <ContactContent id={id} />
    </ProtectedRoute>
  );
}
