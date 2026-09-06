import { authFetch } from "@/lib/auth";
import { Activity } from "@/types/activity";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

async function getJson<T>(url: string): Promise<T> {
  const response = await authFetch(url, { method: "GET" });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed");
  }
  return response.json() as Promise<T>;
}

export async function getActivities(): Promise<Activity[]> {
  return getJson<Activity[]>(`${API_BASE_URL}/activities`);
}

export async function getActivitiesByCustomer(customerId: string): Promise<Activity[]> {
  return getJson<Activity[]>(`${API_BASE_URL}/activities/customer/${customerId}`);
}

export async function createActivity(payload: {
  customerId: string;
  title: string;
  description?: string;
  type: string;
}): Promise<Activity> {
  const response = await authFetch(`${API_BASE_URL}/activities`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to create activity");
  }
  return response.json();
}

export async function deleteActivity(id: number): Promise<void> {
  const response = await authFetch(`${API_BASE_URL}/activities/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to delete activity");
  }
}
