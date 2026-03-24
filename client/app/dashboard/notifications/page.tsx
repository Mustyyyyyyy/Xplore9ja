"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import useAuth from "@/hooks/useAuth";

type Notification = {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
};

type NotificationsResponse = {
  success: boolean;
  notifications: Notification[];
};

export default function DashboardNotificationsPage() {
  const { isHydrated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const response = await apiFetch<NotificationsResponse>("/notifications/mine", {
          method: "GET",
          auth: true,
        });

        setNotifications(response.notifications || []);
      } catch (error) {
        console.error("Failed to load notifications:", error);
      } finally {
        setLoading(false);
      }
    }

    if (isHydrated) {
      loadNotifications();
    }
  }, [isHydrated]);

  async function markAsRead(id: string) {
    try {
      await apiFetch(`/notifications/${id}/read`, {
        method: "PATCH",
        auth: true,
      });

      setNotifications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  }

  return (
    <main className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-neutral-950">Notifications</h1>
      <p className="mt-2 text-sm text-neutral-500">
        Booking, review, and payment updates show here.
      </p>

      <div className="mt-6 space-y-4">
        {loading ? (
          <p className="text-sm text-neutral-500">Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <p className="text-sm text-neutral-500">No notifications yet.</p>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              className="rounded-[1.5rem] border border-black/5 bg-neutral-50 p-5"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-base font-semibold text-neutral-950">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-neutral-600">
                    {item.message}
                  </p>
                  <p className="mt-3 text-xs uppercase tracking-[0.12em] text-neutral-500">
                    {item.type} • {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>

                {!item.isRead ? (
                  <button
                    onClick={() => markAsRead(item.id)}
                    className="rounded-full bg-neutral-950 px-4 py-2 text-xs font-medium text-white"
                  >
                    Mark as read
                  </button>
                ) : (
                  <span className="text-xs font-medium text-neutral-500">Read</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}