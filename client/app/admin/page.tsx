"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type DestinationListResponse = {
  success: boolean;
  destinations: Array<{ id: string }>;
};

type ToursListResponse = {
  success: boolean;
  tours: Array<{ id: string }>;
};

type BookingsListResponse = {
  success: boolean;
  bookings: Array<{ id: string; status: string; finalPrice: number }>;
};

type UsersListResponse = {
  success: boolean;
  users: Array<{ id: string }>;
};

type PromoListResponse = {
  success: boolean;
  promos: Array<{ id: string }>;
};

export default function AdminOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    destinations: 0,
    tours: 0,
    bookings: 0,
    users: 0,
    promos: 0,
    revenue: 0,
  });

  useEffect(() => {
    async function loadAdminData() {
      try {
        const [destinationsRes, toursRes, bookingsRes, usersRes, promosRes] =
          await Promise.all([
            apiFetch<DestinationListResponse>("/destinations", {
              method: "GET",
              auth: true,
            }),
            apiFetch<ToursListResponse>("/tours", {
              method: "GET",
              auth: true,
            }),
            apiFetch<BookingsListResponse>("/bookings", {
              method: "GET",
              auth: true,
            }),
            apiFetch<UsersListResponse>("/users", {
              method: "GET",
              auth: true,
            }),
            apiFetch<PromoListResponse>("/promos", {
              method: "GET",
              auth: true,
            }),
          ]);

        const bookings = bookingsRes.bookings || [];
        const revenue = bookings.reduce((sum, item) => {
          if (item.status === "CONFIRMED" || item.status === "COMPLETED") {
            return sum + Number(item.finalPrice || 0);
          }
          return sum;
        }, 0);

        setStats({
          destinations: destinationsRes.destinations?.length || 0,
          tours: toursRes.tours?.length || 0,
          bookings: bookings.length,
          users: usersRes.users?.length || 0,
          promos: promosRes.promos?.length || 0,
          revenue,
        });
      } catch (error) {
        console.error("Failed to load admin overview:", error);
      } finally {
        setLoading(false);
      }
    }

    loadAdminData();
  }, []);

  const cards = [
    ["Destinations", stats.destinations],
    ["Tours", stats.tours],
    ["Bookings", stats.bookings],
    ["Users", stats.users],
    ["Promos", stats.promos],
    ["Revenue", `₦${stats.revenue.toLocaleString()}`],
  ];

  return (
    <main className="space-y-6">
      <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Manage destinations, tours, bookings, users, and promo codes.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {cards.map(([label, value]) => (
          <div
            key={label}
            className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-neutral-500">{label}</p>
            <p className="mt-4 text-3xl font-semibold text-neutral-950">
              {loading ? "..." : value}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}