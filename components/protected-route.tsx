"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const ready = useMemo(() => isAuthenticated(), []);

  useEffect(() => {
    if (!ready) {
      router.replace("/login");
    }
  }, [ready, router]);

  if (!ready) {
    return null;
  }

  return <>{children}</>;
}
