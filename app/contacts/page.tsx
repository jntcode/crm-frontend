"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/protected-route";
import { useToast } from "@/components/toast";
import { createCustomer, deleteCustomer, getCustomers, updateCustomer } from "@/lib/customers";
import { Customer } from "@/types/customer";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerSchema, CustomerFormData } from "@/lib/schemas";
import { useState, useRef } from "react";
import { useConfirm } from "@/components/confirm-modal";
import { exportToCSV, parseCSV } from "@/lib/csv";

const emptyForm: CustomerFormData = {
  name: "",
  email: "",
  phone: "",
  companyName: "",
  position: "",
  status: "Active",
  notes: "",
};

export default function ContactsPage() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { confirm } = useConfirm();

  const { data: customers = [], isLoading } = useQuery<Customer[]>({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  const createMutation = useMutation({
    mutationFn: (data: CustomerFormData) => createCustomer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      showToast("Contact created");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CustomerFormData }) => updateCustomer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      showToast("Contact updated");
      setEditingId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      showToast("Contact deleted");
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      for (const id of ids) {
        await deleteCustomer(id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      setSelectedIds(new Set());
      showToast(`${selectedIds.size} contacts deleted`);
    },
  });

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: emptyForm,
  });

  const filteredCustomers = useMemo(() => {
    const q = search.toLowerCase();
    return customers.filter((customer) =>
      [customer.name, customer.email, customer.companyName ?? "", customer.position ?? "", customer.status ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [customers, search]);

  function onSubmit(data: CustomerFormData) {
    if (editingId !== null) {
      updateMutation.mutate({ id: editingId, data });
    } else {
      createMutation.mutate(data);
    }
    reset(emptyForm);
    setEditingId(null);
  }

  function handleEdit(customer: Customer) {
    setEditingId(customer.id);
    setValue("name", customer.name);
    setValue("email", customer.email);
    setValue("phone", customer.phone);
    setValue("companyName", customer.companyName ?? "");
    setValue("position", customer.position ?? "");
    setValue("status", customer.status ?? "Active");
    setValue("notes", customer.notes ?? "");
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <header className="mb-8 rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[0_10px_25px_var(--shadow)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--button)]">CRM</p>
            <h1 className="mt-2 text-3xl font-bold text-[var(--foreground)]">Contacts</h1>
          </header>

          <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[0_10px_25px_var(--shadow)]">
              <h2 className="text-xl font-semibold text-[var(--foreground)]">{editingId ? "Edit contact" : "Add contact"}</h2>

              <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
                <div>
                  <input {...register("name")} className="w-full rounded-xl border border-[var(--border)] bg-[var(--soft)] px-3 py-2.5 text-[var(--foreground)]" placeholder="Full name" />
                  {errors.name && <p className="mt-1 text-xs text-rose-400">{errors.name.message}</p>}
                </div>
                <div>
                  <input {...register("email")} type="email" className="w-full rounded-xl border border-[var(--border)] bg-[var(--soft)] px-3 py-2.5 text-[var(--foreground)]" placeholder="Email" />
                  {errors.email && <p className="mt-1 text-xs text-rose-400">{errors.email.message}</p>}
                </div>
                <div>
                  <input {...register("phone")} className="w-full rounded-xl border border-[var(--border)] bg-[var(--soft)] px-3 py-2.5 text-[var(--foreground)]" placeholder="Phone" />
                  {errors.phone && <p className="mt-1 text-xs text-rose-400">{errors.phone.message}</p>}
                </div>
                <input {...register("companyName")} className="w-full rounded-xl border border-[var(--border)] bg-[var(--soft)] px-3 py-2.5 text-[var(--foreground)]" placeholder="Company" />
                <input {...register("position")} className="w-full rounded-xl border border-[var(--border)] bg-[var(--soft)] px-3 py-2.5 text-[var(--foreground)]" placeholder="Position" />
                <select {...register("status")} className="w-full rounded-xl border border-[var(--border)] bg-[var(--soft)] px-3 py-2.5 text-[var(--foreground)]">
                  <option>Active</option>
                  <option>Lead</option>
                  <option>Qualified</option>
                  <option>Customer</option>
                  <option>Inactive</option>
                </select>
                <textarea {...register("notes")} className="min-h-24 w-full rounded-xl border border-[var(--border)] bg-[var(--soft)] px-3 py-2.5 text-[var(--foreground)]" placeholder="Notes" />

                <div className="flex gap-3">
                  <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="flex-1 rounded-xl bg-[var(--button)] px-4 py-2.5 text-sm font-semibold text-[var(--button-text)] disabled:opacity-50">
                    {editingId ? "Update contact" : "Save contact"}
                  </button>
                  {editingId !== null && (
                    <button type="button" onClick={() => { setEditingId(null); reset(emptyForm); }} className="rounded-xl border border-[var(--border)] bg-[var(--soft)] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)]">Cancel</button>
                  )}
                </div>
              </form>
            </section>

            <section className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[0_10px_25px_var(--shadow)]">
              <div className="mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-[var(--foreground)]">Contact list</h2>
                <div className="flex items-center gap-2">
                  <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const text = await file.text();
                    const rows = parseCSV(text);
                    let imported = 0;
                    for (const row of rows) {
                      try {
                        await createCustomer({
                          name: row.name || row.Name || "",
                          email: row.email || row.Email || "",
                          phone: row.phone || row.Phone || "",
                          companyName: row.company || row.Company || row.companyName || "",
                          position: row.position || row.Position || "",
                          status: row.status || row.Status || "Active",
                          notes: row.notes || row.Notes || "",
                        });
                        imported++;
                      } catch {}
                    }
                    queryClient.invalidateQueries({ queryKey: ["customers"] });
                    showToast(`Imported ${imported} contacts`);
                    e.target.value = "";
                  }} />
                  <button onClick={() => fileInputRef.current?.click()} className="rounded-lg border border-[var(--border)] bg-[var(--soft)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] hover:bg-[var(--soft-strong)] transition">
                    Import CSV
                  </button>
                  <button onClick={() => {
                    const csvData = filteredCustomers.map((c) => ({
                      name: c.name, email: c.email, phone: c.phone,
                      company: c.companyName ?? "", position: c.position ?? "",
                      status: c.status ?? "Active", notes: c.notes ?? "",
                    }));
                    exportToCSV(csvData, "contacts");
                    showToast("Exported contacts");
                  }} className="rounded-lg border border-[var(--border)] bg-[var(--soft)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] hover:bg-[var(--soft-strong)] transition">
                    Export CSV
                  </button>
                  {selectedIds.size > 0 && (
                    <button onClick={async () => {
                      const ok = await confirm({
                        title: `Delete ${selectedIds.size} contacts?`,
                        message: "This action cannot be undone.",
                        variant: "danger",
                        confirmLabel: "Delete All",
                      });
                      if (ok) bulkDeleteMutation.mutate(Array.from(selectedIds));
                    }} className="rounded-lg border border-rose-500/25 bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-300 hover:bg-rose-500/20 transition">
                      Delete ({selectedIds.size})
                    </button>
                  )}
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-48 rounded-xl border border-[var(--border)] bg-[var(--soft)] px-3 py-2 text-sm text-[var(--foreground)]"
                    placeholder="Search contacts"
                  />
                </div>
              </div>

              {isLoading ? (
                <div className="text-[var(--muted)]">Loading contacts...</div>
              ) : filteredCustomers.length === 0 ? (
                <div className="rounded-xl border border-[var(--border)] bg-[var(--soft)] p-10 text-center text-[var(--muted)]">
                  No contacts found.
                </div>
              ) : (
                <>
                  <div className="mb-3 flex items-center gap-2 text-xs text-[var(--muted)]">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === filteredCustomers.length && filteredCustomers.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds(new Set(filteredCustomers.map((c) => c.id)));
                        } else {
                          setSelectedIds(new Set());
                        }
                      }}
                      className="rounded border-[var(--border)] accent-[var(--accent)]"
                    />
                    <span>Select all ({filteredCustomers.length})</span>
                  </div>
                  <div className="space-y-3">
                  {filteredCustomers.map((customer) => (
                    <div key={customer.id} className={`rounded-xl border p-4 transition ${selectedIds.has(customer.id) ? "border-[var(--accent)]/50 bg-[var(--accent)]/5" : "border-[var(--border)] bg-[var(--soft)] hover:border-[var(--accent)]/30"}`}>
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(customer.id)}
                          onChange={(e) => {
                            const next = new Set(selectedIds);
                            if (e.target.checked) next.add(customer.id);
                            else next.delete(customer.id);
                            setSelectedIds(next);
                          }}
                          className="mt-1 rounded border-[var(--border)] accent-[var(--accent)]"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <Link href={`/contacts/${customer.id}`} className="text-lg font-semibold text-[var(--foreground)] hover:text-[var(--accent)] transition">{customer.name}</Link>
                              <p className="text-sm text-[var(--muted)]">{customer.position ?? "No position"}</p>
                            </div>
                            <span className="rounded-full bg-[var(--panel)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--button)]">{customer.status ?? "Active"}</span>
                          </div>

                          <div className="mt-3 grid gap-2 text-sm text-[var(--muted)] md:grid-cols-2">
                            <p><span className="font-medium text-[var(--foreground)]">Email:</span> {customer.email}</p>
                            <p><span className="font-medium text-[var(--foreground)]">Phone:</span> {customer.phone}</p>
                            <p><span className="font-medium text-[var(--foreground)]">Company:</span> {customer.companyName ?? "Not assigned"}</p>
                            <p><span className="font-medium text-[var(--foreground)]">Created:</span> {new Date(customer.createdAt).toLocaleDateString()}</p>
                          </div>

                          {customer.notes ? (
                            <p className="mt-3 text-sm text-[var(--muted)]"><span className="font-medium text-[var(--foreground)]">Notes:</span> {customer.notes}</p>
                          ) : null}

                          <div className="mt-4 flex gap-2">
                            <button onClick={() => handleEdit(customer)} className="rounded-lg border border-[var(--border)] bg-[var(--panel)] px-3 py-1.5 text-sm font-medium text-[var(--foreground)]">Edit</button>
                            <button onClick={async () => {
                              const ok = await confirm({ title: "Delete contact?", message: "This action cannot be undone.", variant: "danger", confirmLabel: "Delete" });
                              if (ok) deleteMutation.mutate(customer.id);
                            }} disabled={deleteMutation.isPending} className="rounded-lg border border-rose-500/25 bg-rose-500/10 px-3 py-1.5 text-sm font-medium text-rose-300 disabled:opacity-50">Delete</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  </div>
                </>
              )}
            </section>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
