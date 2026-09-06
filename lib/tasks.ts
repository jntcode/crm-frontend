import { authFetch } from "@/lib/auth";
import { Task } from "@/types/activity";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

async function getJson<T>(url: string): Promise<T> {
  const response = await authFetch(url, { method: "GET" });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed");
  }
  return response.json() as Promise<T>;
}

export async function getTasks(): Promise<Task[]> {
  return getJson<Task[]>(`${API_BASE_URL}/tasks`);
}

export async function getTasksByCustomer(customerId: string): Promise<Task[]> {
  return getJson<Task[]>(`${API_BASE_URL}/tasks/customer/${customerId}`);
}

export async function getTasksByStatus(status: string): Promise<Task[]> {
  return getJson<Task[]>(`${API_BASE_URL}/tasks/status/${status}`);
}

export async function createTask(payload: {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  customerId?: string;
  dueDate?: string;
  assignedTo?: string;
}): Promise<Task> {
  const response = await authFetch(`${API_BASE_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to create task");
  }
  return response.json();
}

export async function updateTask(id: number, payload: Partial<Task>): Promise<Task> {
  const response = await authFetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to update task");
  }
  return response.json();
}

export async function deleteTask(id: number): Promise<void> {
  const response = await authFetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to delete task");
  }
}
