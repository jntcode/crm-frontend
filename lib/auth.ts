export type AuthSession = {
  token: string;
  name: string;
  email: string;
  userId?: number;
};

const AUTH_STORAGE_KEY = "crm-auth";
const AUTH_API_BASE_URL = process.env.NEXT_PUBLIC_AUTH_API_URL ?? "http://localhost:8080/api/auth";

export async function authFetch(url: string, options: RequestInit = {}) {
  const session = getAuthSession();
  const headers = new Headers(options.headers || {});

  if (session?.token) {
    headers.set("Authorization", `Bearer ${session.token}`);
  }

  return fetch(url, { ...options, headers });
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

export async function setDemoSession(): Promise<void> {
  const demoEmail = "admin@crm.com";
  const demoPassword = "secret123";

  try {
    const session = await loginUser({ email: demoEmail, password: demoPassword });
    setAuthSession(session);
  } catch {
    try {
      const session = await registerUser({
        name: "Demo User",
        email: demoEmail,
        password: demoPassword,
      });
      setAuthSession(session);
    } catch {
      setAuthSession({
        token: "demo-token-fallback",
        name: "Demo User",
        email: demoEmail,
      });
    }
  }
}
