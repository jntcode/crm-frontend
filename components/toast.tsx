"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

type Toast = {
  id: number;
  message: string;
  type: "success" | "error";
  onUndo?: () => void;
};

type ToastContextValue = {
  showToast: (message: string, type?: "success" | "error", onUndo?: () => void) => void;
};

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const showToast = useCallback((message: string, type: "success" | "error" = "success", onUndo?: () => void) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, onUndo }]);
  }, []);

  const dismissToast = useCallback((id: number) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    toasts.forEach((toast) => {
      if (!timersRef.current.has(toast.id)) {
        const timer = setTimeout(() => {
          dismissToast(toast.id);
          timersRef.current.delete(toast.id);
        }, toast.onUndo ? 6000 : 3000);
        timersRef.current.set(toast.id, timer);
      }
    });
  }, [toasts, dismissToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`animate-slide-in flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg backdrop-blur-xl ${
              toast.type === "success"
                ? "border-emerald-500/25 bg-emerald-500/15 text-emerald-300"
                : "border-rose-500/25 bg-rose-500/15 text-rose-300"
            }`}
          >
            <span className="flex-1">{toast.message}</span>
            {toast.onUndo && (
              <button
                onClick={() => {
                  toast.onUndo!();
                  dismissToast(toast.id);
                }}
                className="rounded-lg bg-white/10 px-2 py-1 text-xs font-semibold hover:bg-white/20 transition"
              >
                Undo
              </button>
            )}
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-[var(--muted)] hover:text-[var(--foreground)] transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
