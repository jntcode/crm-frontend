"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { useToast } from "@/components/toast";
import { getCompanies, createCompany, updateCompany, deleteCompany } from "@/lib/companies";
import { Company } from "@/types/company";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { companySchema, CompanyFormData } from "@/lib/schemas";
import { useState } from "react";

export default function CompaniesPage() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);

  const { data: companies = [], isLoading } = useQuery<Company[]>({
    queryKey: ["companies"],
    queryFn: getCompanies,
  });

  const createMutation = useMutation({
    mutationFn: (data: CompanyFormData) => createCompany(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      showToast("Company created");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CompanyFormData }) => updateCompany(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      showToast("Company updated");
      setEditingId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteCompany(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      showToast("Company deleted");
    },
  });

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: { name: "", industry: "" },
  });

  function onSubmit(data: CompanyFormData) {
    if (editingId !== null) {
      updateMutation.mutate({ id: editingId, data });
    } else {
      createMutation.mutate(data);
    }
    reset({ name: "", industry: "" });
    setEditingId(null);
  }

  function handleEdit(company: Company) {
    setEditingId(company.id);
    setValue("name", company.name);
    setValue("industry", company.industry);
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <header className="mb-8 rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[0_10px_25px_var(--shadow)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--button)]">CRM Companies</p>
            <h1 className="mt-2 text-3xl font-bold text-[var(--foreground)]">Companies</h1>
          </header>

          <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[0_10px_25px_var(--shadow)]">
              <h2 className="text-xl font-semibold text-[var(--foreground)]">{editingId ? "Edit company" : "Add company"}</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
                <div>
                  <input {...register("name")} className="w-full rounded-xl border border-[var(--border)] bg-[var(--soft)] px-3 py-2.5 text-[var(--foreground)]" placeholder="Company name" />
                  {errors.name && <p className="mt-1 text-xs text-rose-400">{errors.name.message}</p>}
                </div>
                <div>
                  <input {...register("industry")} className="w-full rounded-xl border border-[var(--border)] bg-[var(--soft)] px-3 py-2.5 text-[var(--foreground)]" placeholder="Industry" />
                  {errors.industry && <p className="mt-1 text-xs text-rose-400">{errors.industry.message}</p>}
                </div>
                <div className="flex gap-3">
                  <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="flex-1 rounded-xl bg-[var(--button)] px-4 py-2.5 text-sm font-semibold text-[var(--button-text)] active:scale-[0.98] disabled:opacity-50">
                    {editingId ? "Update company" : "Save company"}
                  </button>
                  {editingId !== null && (
                    <button type="button" onClick={() => { setEditingId(null); reset({ name: "", industry: "" }); }} className="rounded-xl border border-[var(--border)] bg-[var(--soft)] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] active:scale-[0.98]">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </section>

            <section className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[0_10px_25px_var(--shadow)]">
              <h2 className="mb-5 text-xl font-semibold text-[var(--foreground)]">Company list</h2>
              {isLoading ? (
                <div className="text-[var(--muted)]">Loading companies...</div>
              ) : companies.length === 0 ? (
                <div className="rounded-xl border border-[var(--border)] bg-[var(--soft)] p-10 text-center text-[var(--muted)]">
                  No companies yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-[var(--border)] text-left">
                    <thead className="bg-[var(--soft)]">
                      <tr>
                        <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Name</th>
                        <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Industry</th>
                        <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                      {companies.map((company) => (
                        <tr key={company.id} className="hover:bg-[var(--soft)]/70">
                          <td className="px-6 py-4 font-medium text-[var(--foreground)]">{company.name}</td>
                          <td className="px-6 py-4 text-[var(--muted)]">{company.industry}</td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button onClick={() => handleEdit(company)} className="rounded-lg border border-[var(--border)] bg-[var(--panel-strong)] px-3 py-1.5 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--button)]/60 hover:text-[var(--button)] active:scale-[0.98]">Edit</button>
                              <button onClick={() => deleteMutation.mutate(company.id)} disabled={deleteMutation.isPending} className="rounded-lg border border-rose-500/25 bg-rose-500/10 px-3 py-1.5 text-sm font-medium text-rose-300 transition hover:bg-rose-500/20 active:scale-[0.98] disabled:opacity-50">Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
