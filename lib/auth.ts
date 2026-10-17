import { queryClient } from "./query-client";

export type AuthSession = {
  token: string;
  name: string;
  email: string;
  userId?: number;
};

const AUTH_STORAGE_KEY = "crm-auth";
const AUTH_API_BASE_URL = process.env.NEXT_PUBLIC_AUTH_API_URL ?? "http://localhost:8080/api/auth";

const DEMO_EMAIL = process.env.NEXT_PUBLIC_DEMO_EMAIL ?? "";
const DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_PASSWORD ?? "";

/**
 * Local storage keys that hold data belonging to the signed-in user. Theme and
 * locale keys are deliberately excluded so they survive logout.
 */
export const USER_SCOPED_STORAGE_KEYS = [
  "crm-cache",
  "crm_session",
  "crm-notifications",
  "crm-avatar",
] as const;

export function isDemoConfigured(): boolean {
  return Boolean(DEMO_EMAIL && DEMO_PASSWORD);
}

/**
 * Removes every piece of user-scoped client state: persisted React Query data,
 * the legacy session copy, notifications, avatar and any service-worker cached
 * responses (including old cached API payloads).
 */
export async function clearUserScopedState(): Promise<void> {
  if (typeof window === "undefined") return;

  for (const key of USER_SCOPED_STORAGE_KEYS) {
    window.localStorage.removeItem(key);
  }
  queryClient.clear();

  if (typeof caches !== "undefined") {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
    } catch (error) {
      console.warn("Could not clear service worker caches", error);
    }
  }
}

/**
 * Starts a session for a freshly authenticated user after wiping any state
 * left behind by a previous account (login and logout both funnel through
 * here, so account switching can never show another user's data).
 */
export async function startSession(session: AuthSession): Promise<void> {
  await clearUserScopedState();
  setAuthSession(session);
}

/**
 * Full logout: clears the session token and all user-scoped client state.
 */
export async function endSession(): Promise<void> {
  clearAuthSession();
  await clearUserScopedState();
}

export async function authFetch(url: string, options: RequestInit = {}) {
  const session = getAuthSession();
  const headers = new Headers(options.headers || {});

  if (session?.token) {
    headers.set("Authorization", `Bearer ${session.token}`);
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401 && session?.token) {
    await endSession();
    if (typeof window !== "undefined") {
      window.location.assign("/login");
    }
  }

  return response;
}

export function getAuthSession(): AuthSession | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function setAuthSession(session: AuthSession) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function isAuthenticated() {
  return Boolean(getAuthSession()?.token);
}

export async function registerUser(payload: { name: string; email: string; password: string }) {
  const response = await fetch(`${AUTH_API_BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Registration failed");
  }

  return (await response.json()) as AuthSession;
}

export async function loginUser(payload: { email: string; password: string }) {
  const response = await fetch(`${AUTH_API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Login failed");
  }

  return (await response.json()) as AuthSession;
}

export async function googleLogin(idToken: string): Promise<AuthSession> {
  const response = await fetch(`${AUTH_API_BASE_URL}/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Google login failed");
  }
  return (await response.json()) as AuthSession;
}

/**
 * Signs in with the demo account configured via NEXT_PUBLIC_DEMO_EMAIL /
 * NEXT_PUBLIC_DEMO_PASSWORD. Throws when demo credentials are not configured
 * for this environment or when the backend rejects them. Never fabricates a
 * session client-side.
 */
export async function demoLogin(): Promise<void> {
  if (!isDemoConfigured()) {
    throw new Error("Demo login is not configured in this environment.");
  }

  try {
    const session = await loginUser({ email: DEMO_EMAIL, password: DEMO_PASSWORD });
    await startSession(session);
  } catch (loginError) {
    try {
      const session = await registerUser({
        name: "Demo User",
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
      });
      await startSession(session);
    } catch {
      throw loginError instanceof Error ? loginError : new Error("Demo login failed");
    }
  }
}
