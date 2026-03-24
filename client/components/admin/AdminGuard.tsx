"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isHydrated, isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated) {
      router.replace("/auth/login");
      return;
    }

    if (user?.role !== "ADMIN" && user?.role !== "SUPERADMIN") {
      router.replace("/dashboard");
    }
  }, [isHydrated, isAuthenticated, user, router]);

  if (!isHydrated) return null;
  if (!isAuthenticated) return null;
  if (user?.role !== "ADMIN" && user?.role !== "SUPERADMIN") return null;

  return <>{children}</>;
}