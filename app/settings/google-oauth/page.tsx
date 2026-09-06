"use client";

import { useState } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/protected-route";
import { motion } from "framer-motion";

const CLIENT_ID_KEY = "crm-google-client-id";

function getInitialClientId(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(CLIENT_ID_KEY) || "";
}

function GoogleOAuthContent() {
  const [clientId, setClientId] = useState(getInitialClientId);
  const [saved, setSaved] = useState(() => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem(CLIENT_ID_KEY);
  });
  const [testStatus, setTestStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const redirectUri =
    typeof window !== "undefined"
      ? `${window.location.origin}/api/auth/google/callback`
      : "";

  const isConfigured = clientId.trim().length > 0;

  function handleSave() {
    localStorage.setItem(CLIENT_ID_KEY, clientId.trim());
    setSaved(true);
  }

  function handleClear() {
    localStorage.removeItem(CLIENT_ID_KEY);
    setClientId("");
    setSaved(false);
  }

  async function handleTest() {
    setTestStatus("loading");
    try {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.onload = () => {
          const w = window as unknown as Record<string, unknown>;
          const google = w.google as Record<string, unknown> | undefined;
          if (google && google.accounts) {
            resolve();
          } else {
            reject(new Error("Google SDK loaded but not available"));
          }
        };
        script.onerror = () => reject(new Error("Failed to load Google SDK"));
        document.head.appendChild(script);
      });
      setTestStatus("success");
    } catch {
      setTestStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="border-b border-[var(--border)] bg-[var(--panel)]">
        <div className="px-6 py-8 max-w-3xl mx-auto">
          <Link
            href="/settings"
            className="text-xs font-medium text-[var(--accent)] hover:underline mb-3 inline-block"
          >
            ← Back to Settings
          </Link>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
            Integrations
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[var(--foreground)]">
            Google OAuth
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Configure Google sign-in for your CRM
          </p>
        </div>
      </div>

      <div className="px-6 py-8 max-w-3xl mx-auto space-y-8">
        {/* Status Card */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[0_10px_25px_var(--shadow)]"
        >
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">
            Connection Status
          </h2>
          <div className="flex items-center gap-3">
            <span
              className={`inline-block w-3 h-3 rounded-full ${
                isConfigured ? "bg-emerald-400" : "bg-[var(--muted)]"
              }`}
            />
            <span className="text-sm text-[var(--foreground)]">
              {isConfigured ? "Google OAuth is configured" : "Not configured"}
            </span>
          </div>
        </motion.section>

        {/* Setup Instructions */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[0_10px_25px_var(--shadow)]"
        >
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">
            Setup Instructions
          </h2>
          <ol className="space-y-3 text-sm text-[var(--muted)] list-decimal list-inside">
            <li>
              Go to{" "}
              <a
                href="https://console.cloud.google.com/apis/credentials"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent)] hover:underline"
              >
                Google Cloud Console
              </a>
            </li>
            <li>Create a new project or select an existing one</li>
            <li>
              Navigate to <strong className="text-[var(--foreground)]">APIs &amp; Services → Credentials</strong>
            </li>
            <li>
              Click <strong className="text-[var(--foreground)]">Create Credentials → OAuth 2.0 Client ID</strong>
            </li>
            <li>
              Set Application type to{" "}
              <strong className="text-[var(--foreground)]">Web application</strong>
            </li>
            <li>
              Under <strong className="text-[var(--foreground)]">Authorized redirect URIs</strong>, add:
              <div className="mt-2 rounded-xl border border-[var(--border)] bg-[var(--soft)] px-4 py-2 font-mono text-xs text-[var(--foreground)] break-all">
                {redirectUri || "Loading..."}
              </div>
            </li>
            <li>Copy the generated Client ID and paste it below</li>
          </ol>
        </motion.section>

        {/* Client ID Form */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[0_10px_25px_var(--shadow)]"
        >
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">
            Configuration
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--muted)]">
                GOOGLE_CLIENT_ID
              </label>
              <input
                value={clientId}
                onChange={(e) => {
                  setClientId(e.target.value);
                  setSaved(false);
                }}
                placeholder="xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxx.apps.googleusercontent.com"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--soft)] px-4 py-2.5 text-sm text-[var(--foreground)] font-mono outline-none focus:border-[var(--accent)] transition"
              />
            </div>

            {saved && (
              <p className="text-xs text-emerald-400">✓ Saved to localStorage</p>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={handleClear}
                disabled={!isConfigured}
                className="rounded-xl border border-[var(--border)] bg-[var(--soft)] px-5 py-2.5 text-sm font-semibold text-[var(--muted)] disabled:opacity-40 hover:text-[var(--foreground)] transition"
              >
                Clear
              </button>
              <button
                onClick={handleSave}
                disabled={!clientId.trim()}
                className="rounded-xl bg-[var(--button)] px-5 py-2.5 text-sm font-semibold text-[var(--button-text)] disabled:opacity-50 hover:opacity-90 transition"
              >
                Save
              </button>
            </div>
          </div>
        </motion.section>

        {/* Test Connection */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[0_10px_25px_var(--shadow)]"
        >
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">
            Test Connection
          </h2>
          <p className="text-sm text-[var(--muted)] mb-4">
            Attempts to load the Google Identity Services SDK to verify network
            connectivity.
          </p>

          <button
            onClick={handleTest}
            disabled={testStatus === "loading"}
            className="rounded-xl bg-[var(--button)] px-5 py-2.5 text-sm font-semibold text-[var(--button-text)] disabled:opacity-50 hover:opacity-90 transition"
          >
            {testStatus === "loading" ? "Testing..." : "Test Connection"}
          </button>

          {testStatus === "success" && (
            <p className="mt-3 text-xs text-emerald-400">
              ✓ Google SDK loaded successfully
            </p>
          )}
          {testStatus === "error" && (
            <p className="mt-3 text-xs text-rose-400">
              ✗ Failed to load Google SDK — check your network or ad blocker
            </p>
          )}
        </motion.section>
      </div>
    </div>
  );
}

export default function GoogleOAuthPage() {
  return (
    <ProtectedRoute>
      <GoogleOAuthContent />
    </ProtectedRoute>
  );
}
