"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Booking = {
  id: string;
  bookingReference: string;
  finalPrice: number;
  status: string;
  guests: number;
  user?: {
    fullName: string;
    email: string;
  };
  destination?: {
    name: string;
  } | null;
  tour?: {
    title: string;
  } | null;
};

type BookingsResponse = {
  success: boolean;
  bookings: Booking[];
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadBookings() {
    try {
      const response = await apiFetch<BookingsResponse>("/bookings", {
        method: "GET",
        auth: true,
      });
      setBookings(response.bookings || []);
    } catch (error) {
      console.error("Failed to load bookings:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  async function updateStatus(id: string, status: string) {
    try {
      await apiFetch(`/bookings/${id}/status`, {
        method: "PATCH",
        auth: true,
        body: JSON.stringify({ status }),
      });
      loadBookings();
    } catch (error) {
      console.error("Failed to update booking status:", error);
    }
  }

  return (
    <main className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-neutral-950">Manage Bookings</h1>
      <p className="mt-2 text-sm text-neutral-500">
        View and update booking statuses.
      </p>

      <div className="mt-6 space-y-4">
        {loading ? (
          <p className="text-sm text-neutral-500">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="text-sm text-neutral-500">No bookings yet.</p>
        ) : (
          bookings.map((item) => (
            <div
              key={item.id}
              className="rounded-[1.5rem] border border-black/5 bg-neutral-50 p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                  <p className="text-base font-semibold text-neutral-950">
                    {item.destination?.name || item.tour?.title || "Booking"}
                  </p>
                  <p className="text-sm text-neutral-600">{item.bookingReference}</p>
                  <p className="text-sm text-neutral-600">
                    {item.user?.fullName} • {item.user?.email}
                  </p>
                  <p className="text-sm text-neutral-600">
                    Guests: {item.guests} • ₦{Number(item.finalPrice || 0).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateStatus(item.id, status)}
                      className={`rounded-full px-4 py-2 text-xs font-medium ${
                        item.status === status
                          ? "bg-neutral-950 text-white"
                          : "border border-black/10 bg-white text-neutral-700"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}