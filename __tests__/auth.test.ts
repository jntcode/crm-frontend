/**
 * @jest-environment jsdom
 */
import {
  authFetch,
  clearAuthSession,
  endSession,
  getAuthSession,
  setAuthSession,
  startSession,
  USER_SCOPED_STORAGE_KEYS,
  AuthSession,
} from "@/lib/auth";
import { queryClient } from "@/lib/query-client";

const userA: AuthSession = { token: "token-a", name: "Alice", email: "alice@example.com" };
const userB: AuthSession = { token: "token-b", name: "Bob", email: "bob@example.com" };

function seedUserScopedState(data: string) {
  for (const key of USER_SCOPED_STORAGE_KEYS) {
    window.localStorage.setItem(key, data);
  }
}

describe("session lifecycle", () => {
  beforeEach(() => {
    window.localStorage.clear();
    queryClient.clear();
    jest.restoreAllMocks();
    Reflect.deleteProperty(globalThis, "caches");
  });

  test("endSession removes the token and every user-scoped key but keeps theme and locale", async () => {
    setAuthSession(userA);
    seedUserScopedState("user-a-data");
    window.localStorage.setItem("theme", "dark");
    window.localStorage.setItem("locale", "pt");
    queryClient.setQueryData(["leads"], [{ id: 1 }]);

    const cacheDelete = jest.fn().mockResolvedValue(true);
    Object.defineProperty(globalThis, "caches", {
      configurable: true,
      writable: true,
      value: {
        keys: jest.fn().mockResolvedValue(["crm-v1", "crm-v2"]),
        delete: cacheDelete,
      },
    });

    await endSession();

    expect(getAuthSession()).toBeNull();
    for (const key of USER_SCOPED_STORAGE_KEYS) {
      expect(window.localStorage.getItem(key)).toBeNull();
    }
    expect(window.localStorage.getItem("theme")).toBe("dark");
    expect(window.localStorage.getItem("locale")).toBe("pt");
    expect(queryClient.getQueryData(["leads"])).toBeUndefined();
    expect(cacheDelete).toHaveBeenCalledTimes(2);
  });

  test("startSession wipes the previous account's state before storing the new session", async () => {
    setAuthSession(userA);
    seedUserScopedState("belongs-to-alice");
    queryClient.setQueryData(["dashboard-stats"], { totalDeals: 12 });

    await startSession(userB);

    expect(getAuthSession()).toEqual(userB);
    expect(window.localStorage.getItem("crm-cache")).toBeNull();
    expect(window.localStorage.getItem("crm_session")).toBeNull();
    expect(window.localStorage.getItem("crm-notifications")).toBeNull();
    expect(window.localStorage.getItem("crm-avatar")).toBeNull();
    expect(queryClient.getQueryData(["dashboard-stats"])).toBeUndefined();
  });

  test("authFetch clears the session and user-scoped state on 401", async () => {
    setAuthSession(userA);
    seedUserScopedState("stale-user-data");

    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({}),
      text: async () => "",
    } as unknown as Response);

    // jsdom's location.assign logs a "Not implemented: navigation" error but
    // does not throw, so the redirect call inside authFetch is harmless here.
    await authFetch("http://localhost:8080/api/customers");

    expect(getAuthSession()).toBeNull();
    expect(window.localStorage.getItem("crm-cache")).toBeNull();
    expect(window.localStorage.getItem("crm_session")).toBeNull();
  });

  test("authFetch attaches the Authorization header for a signed-in user", async () => {
    setAuthSession(userA);
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [],
      text: async () => "[]",
    } as unknown as Response);

    await authFetch("http://localhost:8080/api/customers");

    const [, options] = (global.fetch as jest.Mock).mock.calls[0];
    expect((options.headers as Headers).get("Authorization")).toBe("Bearer token-a");
  });

  test("corrupt session JSON is treated as signed out", () => {
    window.localStorage.setItem("crm-auth", "{not-json");
    expect(getAuthSession()).toBeNull();
  });

  test("clearAuthSession only removes the token key", () => {
    setAuthSession(userA);
    seedUserScopedState("keep-me");

    clearAuthSession();

    expect(getAuthSession()).toBeNull();
    expect(window.localStorage.getItem("crm-cache")).toBe("keep-me");
  });
});
