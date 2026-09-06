"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const STORAGE_KEY = "crm-notifications";
const MAX_NOTIFICATIONS = 50;

type NotificationType = "info" | "success" | "warning";

interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: number;
}

interface NotificationsContextValue {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (message: string, type?: NotificationType) => void;
  markAsRead: (id: string) => void;
  markAllRead: () => void;
  clearAll: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

function loadNotifications(): Notification[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveNotifications(notifications: Notification[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
}

function formatTimeAgo(ts: number, now: number): string {
  const seconds = Math.floor((now - ts) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function useNotifications(): NotificationsContextValue {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(loadNotifications);
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    saveNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const addNotification = useCallback((message: string, type: NotificationType = "info") => {
    const notification: Notification = {
      id: crypto.randomUUID(),
      message,
      type,
      read: false,
      createdAt: Date.now(),
    };
    setNotifications((prev) => {
      const updated = [notification, ...prev].slice(0, MAX_NOTIFICATIONS);
      return updated;
    });
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllRead,
      clearAll,
      isOpen,
      setIsOpen,
    }),
    [notifications, unreadCount, addNotification, markAsRead, markAllRead, clearAll, isOpen]
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

function NotificationList({
  notifications,
  markAsRead,
  markAllRead,
  clearAll,
  unreadCount,
}: {
  notifications: Notification[];
  markAsRead: (id: string) => void;
  markAllRead: () => void;
  clearAll: () => void;
  unreadCount: number;
}) {
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
        <span className="text-sm font-semibold text-[var(--foreground)]">Notifications</span>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-xs text-[var(--accent)] hover:underline">
              Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button onClick={clearAll} className="text-xs text-[var(--muted)] hover:text-rose-400 transition">
              Clear all
            </button>
          )}
        </div>
      </div>
      <div className="overflow-y-auto max-h-80">
        {notifications.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-[var(--muted)]">
            No notifications yet
          </div>
        ) : (
          notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={`w-full text-left px-4 py-3 border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--soft)] transition ${
                !n.read ? "bg-[var(--accent)]/5" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`mt-0.5 h-2 w-2 flex-shrink-0 rounded-full ${
                    n.type === "success"
                      ? "bg-emerald-400"
                      : n.type === "warning"
                      ? "bg-amber-400"
                      : "bg-sky-400"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm leading-snug ${
                      n.read ? "text-[var(--muted)]" : "text-[var(--foreground)]"
                    }`}
                  >
                    {n.message}
                  </p>
                  <p className="mt-1 text-[10px] text-[var(--muted)]">
                    {formatTimeAgo(n.createdAt, now)}
                  </p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </>
  );
}

export function NotificationBell() {
  const { unreadCount, notifications, markAsRead, markAllRead, clearAll, isOpen, setIsOpen } =
    useNotifications();
  const panelRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--soft)] transition"
        title="Notifications"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[10px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--panel-strong)] shadow-xl z-50">
          <NotificationList
            notifications={notifications}
            markAsRead={markAsRead}
            markAllRead={markAllRead}
            clearAll={clearAll}
            unreadCount={unreadCount}
          />
        </div>
      )}
    </div>
  );
}

export function addNotification(message: string, type: NotificationType = "info") {
  const notifications: Notification[] = loadNotifications();
  const notification: Notification = {
    id: crypto.randomUUID(),
    message,
    type,
    read: false,
    createdAt: Date.now(),
  };
  const updated = [notification, ...notifications].slice(0, MAX_NOTIFICATIONS);
  saveNotifications(updated);
  window.dispatchEvent(new Event("crm-notifications-updated"));
}

export function markAllRead(): void {
  const notifications = loadNotifications();
  saveNotifications(notifications.map((n) => ({ ...n, read: true })));
  window.dispatchEvent(new Event("crm-notifications-updated"));
}

export function getUnreadCount(): number {
  return loadNotifications().filter((n) => !n.read).length;
}
