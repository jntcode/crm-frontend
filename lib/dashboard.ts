import { authFetch } from "@/lib/auth";
import { DashboardStats, PipelineBreakdown } from "@/types/email";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

export async function apiFetch<T>(url: string, retries = 2): Promise<T> {
  let lastError: Error | null = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await authFetch(url);
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Request failed (${response.status})`);
      }
      return response.json() as Promise<T>;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      }
    }
  }
  throw lastError ?? new Error("Request failed");
}

export async function getDashboardStats(): Promise<DashboardStats> {
  return apiFetch<DashboardStats>(`${API_BASE_URL}/dashboard/stats`);
}

export async function getPipelineBreakdown(): Promise<PipelineBreakdown> {
  return apiFetch<PipelineBreakdown>(`${API_BASE_URL}/dashboard/pipeline-breakdown`);
}
