"use client";

import { createContext, useCallback, useContext, useState } from "react";

type ConfirmOptions = {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "default";
};

type ConfirmContextValue = {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
};

const ConfirmContext = createContext<ConfirmContextValue>({ confirm: async () => false });

export function useConfirm() {
  return useContext(ConfirmContext);
}

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ConfirmOptions & { open: boolean; resolve?: (v: boolean) => void }>({
    open: false,
    title: "",
    message: "",
  });

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setState({ ...options, open: true, resolve });
    });
  }, []);

  function handleConfirm() {
    state.resolve?.(true);
    setState((prev) => ({ ...prev, open: false }));
  }

  function handleCancel() {
    state.resolve?.(false);
    setState((prev) => ({ ...prev, open: false }));
  }

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {state.open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleCancel} />
          <div className="relative w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-2xl animate-slide-in">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">{state.title}</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">{state.message}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleCancel}
                className="rounded-xl border border-[var(--border)] bg-[var(--soft)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--soft-strong)] active:scale-[0.98]"
              >
                {state.cancelLabel ?? "Cancel"}
              </button>
              <button
                onClick={handleConfirm}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition active:scale-[0.98] ${
                  state.variant === "danger"
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30"
                    : "bg-[var(--button)] text-[var(--button-text)] hover:brightness-110"
                }`}
              >
                {state.confirmLabel ?? "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}
