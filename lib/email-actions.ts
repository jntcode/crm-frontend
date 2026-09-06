import { authFetch } from "@/lib/auth";
import { Email } from "@/types/email";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

export async function createEmail(payload: {
  customerId: string;
  subject: string;
  body: string;
  fromAddress: string;
  toAddress: string;
  status?: string;
}): Promise<Email> {
  const response = await authFetch(`${API_BASE_URL}/emails`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to send email");
  }
  return response.json();
}

export async function deleteEmail(id: number): Promise<void> {
  const response = await authFetch(`${API_BASE_URL}/emails/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to delete email");
  }
}
