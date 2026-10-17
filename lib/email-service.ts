import emailjs from "@emailjs/browser";

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "";
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "";
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "";

/**
 * True only when all three EmailJS public configuration values are present.
 * The CRM never claims an email was sent when this is false.
 */
export function isEmailSendingConfigured(): boolean {
  return Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);
}

/**
 * Sends an email through EmailJS. Throws when the provider is not configured
 * or the provider rejects the request — callers must only report success after
 * this resolves. Message contents are never logged.
 */
export async function sendEmail({
  to,
  subject,
  body,
  fromName = "CRM",
}: {
  to: string;
  subject: string;
  body: string;
  fromName?: string;
}): Promise<void> {
  if (!isEmailSendingConfigured()) {
    throw new Error(
      "Email sending is not configured. Set NEXT_PUBLIC_EMAILJS_SERVICE_ID, NEXT_PUBLIC_EMAILJS_TEMPLATE_ID and NEXT_PUBLIC_EMAILJS_PUBLIC_KEY."
    );
  }

  await emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    { to_email: to, from_name: fromName, subject, message: body },
    { publicKey: PUBLIC_KEY }
  );
}
