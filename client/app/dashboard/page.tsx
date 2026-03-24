"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Heart, MapPinned, ReceiptText } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { ApiError, apiFetch } from "@/lib/api";

type Booking = {
  id: string;
  bookingReference: string;
  status: string;
  finalPrice: number;
  createdAt: string;
};

type WishlistItem = {
  id: string;
};

type NotificationItem = {
  id: string;
  isRead: boolean;
};

type MyBookingsResponse = {
  success: boolean;
  bookings: Booking[];
};

type WishlistResponse = {
  success: boolean;
  wishlist: WishlistItem[];
};

type NotificationsResponse = {
  success: boolean;
  notifications: NotificationItem[];
};

export default function DashboardOverviewPage() {
  const { user, isHydrated, logout } = useAuth();
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [bookingsRes, wishlistRes, notificationsRes] = await Promise.all([
          apiFetch<MyBookingsResponse>("/bookings/mine", {
            method: "GET",
            auth: true,
          }),
          apiFetch<WishlistResponse>("/wishlist/mine", {
            method: "GET",
            auth: true,
          }),
          apiFetch<NotificationsResponse>("/notifications/mine", {
            method: "GET",
            auth: true,
          }),
        ]);

        setBookings(bookingsRes.bookings || []);
        setWishlist(wishlistRes.wishlist || []);
        setNotifications(notificationsRes.notifications || []);
      } catch (error) {
        console.error("Failed to load dashboard:", error);

        if (
          error instanceof ApiError &&
          (error.status === 401 || error.status === 403)
        ) {
          logout();
          router.push("/auth/login");
          return;
        }

        if (
          error instanceof Error &&
          /invalid|expired|unauthorized/i.test(error.message)
        ) {
          logout();
          router.push("/auth/login");
          return;
        }
      } finally {
        setLoading(false);
      }
    }

    if (isHydrated) {
      loadDashboard();
    }
  }, [isHydrated]);

  const unreadNotifications = useMemo(
    () => notifications.filter((item) => !item.isRead).length,
    [notifications]
  );

  const totalSpent = useMemo(
    () =>
      bookings.reduce((sum, booking) => {
        if (booking.status === "CONFIRMED" || booking.status === "COMPLETED") {
          return sum + Number(booking.finalPrice || 0);
        }
        return sum;
      }, 0),
    [bookings]
  );

  const stats = [
    {
      label: "My bookings",
      value: bookings.length,
      icon: MapPinned,
    },
    {
      label: "Wishlist items",
      value: wishlist.length,
      icon: Heart,
    },
    {
      label: "Unread alerts",
      value: unreadNotifications,
      icon: Bell,
    },
    {
      label: "Total spent",
      value: `₦${totalSpent.toLocaleString()}`,
      icon: ReceiptText,
    },
  ];

  return (
    <main className="space-y-6">
      <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">
          Welcome back, {user?.fullName || "Traveler"}
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Here’s a quick view of your activity on Xplore9ja.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-neutral-500">{item.label}</p>
                <span className="rounded-full bg-neutral-100 p-2">
                  <Icon className="h-4 w-4 text-neutral-700" />
                </span>
              </div>
              <p className="mt-4 text-3xl font-semibold text-neutral-950">
                {loading ? "..." : item.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-950">Recent bookings</h2>

          <div className="mt-5 space-y-4">
            {loading ? (
              <p className="text-sm text-neutral-500">Loading bookings...</p>
            ) : bookings.length === 0 ? (
              <p className="text-sm text-neutral-500">No bookings yet.</p>
            ) : (
              bookings.slice(0, 4).map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-2xl border border-black/5 bg-neutral-50 p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-neutral-950">
                        {booking.bookingReference}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-[0.12em] text-neutral-500">
                        {booking.status}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-neutral-950">
                      ₦{Number(booking.finalPrice || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-950">Quick profile info</h2>

          <div className="mt-5 space-y-3 text-sm text-neutral-600">
            <p>
              <span className="font-medium text-neutral-950">Full name:</span>{" "}
              {user?.fullName || "-"}
            </p>
            <p>
              <span className="font-medium text-neutral-950">Email:</span>{" "}
              {user?.email || "-"}
            </p>
            <p>
              <span className="font-medium text-neutral-950">Role:</span>{" "}
              {user?.role || "-"}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}