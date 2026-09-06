"use client";

import { useState } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/protected-route";
import { useToast } from "@/components/toast";
import { getAuthSession, authFetch } from "@/lib/auth";
import { AvatarUpload } from "@/components/avatar-upload";
import { useI18n } from "@/lib/i18n/context";
import { motion } from "framer-motion";

function SettingsContent() {
  const session = getAuthSession();
  const { t } = useI18n();
  const { showToast } = useToast();

  const [name, setName] = useState(session?.name ?? "");
  const [email, setEmail] = useState(session?.email ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await authFetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const updated = { ...session, name, email };
      localStorage.setItem("crm_session", JSON.stringify(updated));
      showToast("Profile updated successfully");
    } catch {
      showToast("Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      showToast("Password must be at least 6 characters");
      return;
    }
    setChangingPassword(true);
    try {
      await authFetch("/api/auth/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showToast("Password changed successfully");
    } catch {
      showToast("Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="border-b border-[var(--border)] bg-[var(--panel)]">
        <div className="px-6 py-8 max-w-3xl mx-auto">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">{t("settings")}</p>
          <h1 className="mt-2 text-3xl font-bold text-[var(--foreground)]">Account Settings</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">Manage your profile and security preferences</p>
        </div>
      </div>

      <div className="px-6 py-8 max-w-3xl mx-auto space-y-8">
        {/* Profile Section */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[0_10px_25px_var(--shadow)]"
        >
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Profile Information</h2>
          <div className="flex items-center gap-4 mb-6">
            <AvatarUpload name={name} size="lg" />
            <div>
              <p className="text-sm font-medium text-[var(--foreground)]">{name || "Your Name"}</p>
              <p className="text-xs text-[var(--muted)]">Click avatar to change photo</p>
            </div>
          </div>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--muted)]">Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--soft)] px-4 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--muted)]">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--soft)] px-4 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-[var(--button)] px-5 py-2.5 text-sm font-semibold text-[var(--button-text)] disabled:opacity-50 hover:opacity-90 transition"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </motion.section>

        {/* Password Section */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[0_10px_25px_var(--shadow)]"
        >
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Change Password</h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--muted)]">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--soft)] px-4 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--muted)]">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--soft)] px-4 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--muted)]">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--soft)] px-4 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition"
                required
                minLength={6}
              />
              {newPassword && confirmPassword && newPassword !== confirmPassword && (
                <p className="mt-1 text-xs text-rose-400">Passwords do not match</p>
              )}
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={changingPassword}
                className="rounded-xl bg-[var(--button)] px-5 py-2.5 text-sm font-semibold text-[var(--button-text)] disabled:opacity-50 hover:opacity-90 transition"
              >
                {changingPassword ? "Changing..." : "Change Password"}
              </button>
            </div>
          </form>
        </motion.section>

        {/* Google OAuth */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[0_10px_25px_var(--shadow)]"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">Google OAuth</h2>
              <p className="text-sm text-[var(--muted)] mt-1">Enable Google sign-in for your workspace</p>
            </div>
            <Link href="/settings/google-oauth" className="rounded-xl border border-[var(--border)] bg-[var(--soft)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--soft-strong)] transition">
              Configure
            </Link>
          </div>
        </motion.section>

        {/* Account Info */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[0_10px_25px_var(--shadow)]"
        >
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Account Information</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-[var(--muted)]">Account ID</dt>
              <dd className="font-mono text-[var(--foreground)]">{session?.userId ?? "N/A"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--muted)]">Role</dt>
              <dd className="text-[var(--foreground)]">Administrator</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--muted)]">Member Since</dt>
              <dd className="text-[var(--foreground)]">2026</dd>
            </div>
          </dl>
        </motion.section>

        {/* Danger Zone */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6"
        >
          <h2 className="text-lg font-semibold text-rose-400 mb-2">Danger Zone</h2>
          <p className="text-sm text-[var(--muted)] mb-4">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <button className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-400 hover:bg-rose-500/20 transition">
            Delete Account
          </button>
        </motion.section>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}
