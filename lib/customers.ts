import { authFetch } from "@/lib/auth";
import { Customer } from "@/types/customer";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

async function getJson<T>(url: string): Promise<T> {
  const response = await authFetch(url, { method: "GET" });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed");
  }

  return response.json() as Promise<T>;
}

export async function getCustomers(): Promise<Customer[]> {
  return getJson<Customer[]>(`${API_BASE_URL}/customers`);
}

export async function createCustomer(payload: Partial<Customer>): Promise<Customer> {
  const response = await authFetch(`${API_BASE_URL}/customers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to create contact");
  }

  return response.json();
}

export async function updateCustomer(id: number, payload: Partial<Customer>): Promise<Customer> {
  const response = await authFetch(`${API_BASE_URL}/customers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to update contact");
  }

  return response.json();
}

export async function deleteCustomer(id: number): Promise<void> {
  const response = await authFetch(`${API_BASE_URL}/customers/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to delete contact");
  }
}
