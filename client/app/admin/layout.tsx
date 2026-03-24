"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import AdminGuard from "@/components/admin/AdminGuard";
import {
  BookOpen,
  LayoutGrid,
  LogOut,
  MapPinned,
  Tags,
  Users,
} from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/admin",
    label: "Overview",
    icon: LayoutGrid,
  },
  {
    href: "/admin/destinations",
    label: "Destinations",
    icon: MapPinned,
  },
  {
    href: "/admin/tours",
    label: "Tours",
    icon: BookOpen,
  },
  {
    href: "/admin/bookings",
    label: "Bookings",
    icon: BookOpen,
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: Users,
  },
  {
    href: "/admin/promos",
    label: "Promos",
    icon: Tags,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, refreshToken, logout } = useAuth();

  async function handleLogout() {
    try {
      if (refreshToken) {
        await apiFetch("/auth/logout", {
          method: "POST",
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      logout();
      router.push("/auth/login");
    }
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#f7f7f4]">
        <div className="mx-auto flex max-w-7xl gap-6 px-5 py-8 sm:px-6 lg:px-8">
          <aside className="hidden w-72 shrink-0 rounded-[2rem] border border-black/5 bg-white p-5 shadow-sm lg:block">
            <div className="border-b border-black/5 pb-5">
              <Link
                href="/"
                className="text-xl font-semibold tracking-tight text-neutral-950"
              >
                Xplore9ja Admin
              </Link>
              <p className="mt-3 text-sm font-medium text-neutral-950">
                {user?.fullName || "Admin"}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.14em] text-neutral-500">
                {user?.role || "ADMIN"}
              </p>
            </div>

            <nav className="mt-5 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                      active
                        ? "bg-neutral-950 text-white"
                        : "text-neutral-700 hover:bg-neutral-50 hover:text-neutral-950"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <button
              onClick={handleLogout}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-neutral-950 px-4 py-3 text-sm font-medium text-white"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </aside>

          <div className="min-w-0 flex-1">
            <div className="mb-5 rounded-[1.5rem] border border-black/5 bg-white p-4 shadow-sm lg:hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-semibold text-neutral-950">
                    {user?.fullName || "Admin"}
                  </p>
                  <p className="text-xs uppercase tracking-[0.14em] text-neutral-500">
                    {user?.role || "ADMIN"}
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="rounded-full bg-neutral-950 px-4 py-2 text-xs font-medium text-white"
                >
                  Logout
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {navItems.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "rounded-full px-4 py-2 text-xs font-medium transition",
                        active
                          ? "bg-neutral-950 text-white"
                          : "border border-black/10 bg-white text-neutral-700"
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {children}
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}