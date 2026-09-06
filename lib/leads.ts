import { authFetch } from "@/lib/auth";
import { Lead, LeadStatus } from "@/types/lead";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

async function getJson<T>(url: string): Promise<T> {
  const response = await authFetch(url, { method: "GET" });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed");
  }
  return response.json() as Promise<T>;
}

export const leadStatusOrder: LeadStatus[] = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "PROPOSAL",
  "WON",
  "LOST",
];

export async function getLeads(): Promise<Lead[]> {
  return getJson<Lead[]>(`${API_BASE_URL}/leads`);
}

export async function createLead(payload: { name: string; company: string; value: number; status?: LeadStatus }): Promise<Lead> {
  const response = await authFetch(`${API_BASE_URL}/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to create lead");
  }
  return response.json();
}

export async function updateLead(id: number, payload: { name: string; company: string; value: number; status: LeadStatus }): Promise<Lead> {
  const response = await authFetch(`${API_BASE_URL}/leads/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to update lead");
  }
  return response.json();
}

export async function deleteLead(id: number): Promise<void> {
  const response = await authFetch(`${API_BASE_URL}/leads/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to delete lead");
  }
}
