import { authFetch } from "@/lib/auth";
import { Company } from "@/types/company";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

async function getJson<T>(url: string): Promise<T> {
  const response = await authFetch(url, { method: "GET" });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed");
  }
  return response.json() as Promise<T>;
}

export async function getCompanies(): Promise<Company[]> {
  return getJson<Company[]>(`${API_BASE_URL}/companies`);
}

export async function createCompany(payload: { name: string; industry: string }): Promise<Company> {
  const response = await authFetch(`${API_BASE_URL}/companies`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to create company");
  }
  return response.json();
}

export async function updateCompany(id: number, payload: { name: string; industry: string }): Promise<Company> {
  const response = await authFetch(`${API_BASE_URL}/companies/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to update company");
  }
  return response.json();
}

export async function deleteCompany(id: number): Promise<void> {
  const response = await authFetch(`${API_BASE_URL}/companies/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to delete company");
  }
}
