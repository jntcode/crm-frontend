import emailjs from "@emailjs/browser";

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "";
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "";
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "";

function isConfigured(): boolean {
  return !!(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);
}

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
  if (!isConfigured()) {
    console.log("[EmailJS not configured] Sending email:", { to, subject, body, fromName });
    return;
  }

  await emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    { to_email: to, from_name: fromName, subject, message: body },
    { publicKey: PUBLIC_KEY }
  );
}
