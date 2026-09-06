import { authFetch } from "@/lib/auth";
import { Email } from "@/types/email";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

async function getJson<T>(url: string): Promise<T> {
  const response = await authFetch(url);

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed");
  }

  return response.json() as Promise<T>;
}

export async function getEmails(): Promise<Email[]> {
  return getJson<Email[]>(`${API_BASE_URL}/emails`);
}

export async function getEmailsByCustomer(customerId: string): Promise<Email[]> {
  return getJson<Email[]>(`${API_BASE_URL}/emails/customer/${customerId}`);
}

export async function getEmailsByStatus(status: string): Promise<Email[]> {
  return getJson<Email[]>(`${API_BASE_URL}/emails/status/${status}`);
}
