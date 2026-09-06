"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface KeyboardNavContextValue {
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
  registerItem: (el: HTMLElement | null) => void;
  unregisterItem: (el: HTMLElement | null) => void;
  activateItem: () => void;
}

const KeyboardNavContext = createContext<KeyboardNavContextValue | null>(null);

export function useKeyboardNav() {
  return useContext(KeyboardNavContext);
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function isInputFocused() {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  return tag === "input" || tag === "textarea" || tag === "select" || (el as HTMLElement).isContentEditable;
}

export function KeyboardNavProvider({ children }: { children: ReactNode }) {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const itemsRef = useRef<HTMLElement[]>([]);

  const registerItem = useCallback((el: HTMLElement | null) => {
    if (!el) return;
    itemsRef.current.push(el);
  }, []);

  const unregisterItem = useCallback((el: HTMLElement | null) => {
    itemsRef.current = itemsRef.current.filter((item) => item !== el);
  }, []);

  const activateItem = useCallback(() => {
    const idx = focusedIndex;
    if (idx >= 0 && idx < itemsRef.current.length) {
      const el = itemsRef.current[idx];
      if (el instanceof HTMLAnchorElement) {
        el.click();
      } else {
        el.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
        el.click();
      }
    }
  }, [focusedIndex]);

  const focusItem = useCallback(
    (index: number) => {
      const items = itemsRef.current;
      if (items.length === 0) return;
      const clamped = Math.max(0, Math.min(index, items.length - 1));
      setFocusedIndex(clamped);
      items[clamped]?.focus();
    },
    []
  );

  const closeModal = useCallback(() => {
    const open = document.querySelector("[data-modal-open='true']") as HTMLElement | null;
    if (open) {
      open.setAttribute("data-modal-open", "false");
      open.click();
    }
    document.querySelectorAll("[role='dialog']").forEach((d) => {
      const closeBtn = d.querySelector("[data-modal-close]") as HTMLElement | null;
      closeBtn?.click();
    });
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (isInputFocused()) return;

      const items = itemsRef.current;

      switch (e.key) {
        case "ArrowDown":
        case "ArrowRight": {
          e.preventDefault();
          const next = focusedIndex + 1;
          focusItem(next >= items.length ? 0 : next);
          break;
        }
        case "ArrowUp":
        case "ArrowLeft": {
          e.preventDefault();
          const prev = focusedIndex - 1;
          focusItem(prev < 0 ? items.length - 1 : prev);
          break;
        }
        case "Enter":
        case " ": {
          if (focusedIndex >= 0) {
            e.preventDefault();
            activateItem();
          }
          break;
        }
        case "Escape": {
          e.preventDefault();
          closeModal();
          setFocusedIndex(-1);
          break;
        }
        case "/": {
          e.preventDefault();
          const searchInput = document.querySelector(
            "input[type='search'], input[name='search'], input[placeholder*='earch']"
          ) as HTMLElement | null;
          searchInput?.focus();
          break;
        }
        case "Tab": {
          const dialog = document.querySelector("[role='dialog']") as HTMLElement | null;
          if (!dialog) break;
          const focusableInDialog = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE));
          if (focusableInDialog.length === 0) break;
          const first = focusableInDialog[0];
          const last = focusableInDialog[focusableInDialog.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
          break;
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [focusedIndex, focusItem, activateItem, closeModal]);

  return (
    <KeyboardNavContext.Provider
      value={{ focusedIndex, setFocusedIndex, registerItem, unregisterItem, activateItem }}
    >
      {children}
    </KeyboardNavContext.Provider>
  );
}

export function KeyboardNavItem({
  children,
  className,
  ...props
}: {
  children: ReactNode;
  className?: string;
} & Record<string, unknown>) {
  const ctx = useKeyboardNav();
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    ctx?.registerItem(el);
    return () => ctx?.unregisterItem(el);
  }, [ctx]);

  return (
    <div
      ref={ref}
      tabIndex={0}
      className={className}
      role="menuitem"
      {...props}
    >
      {children}
    </div>
  );
}
