"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import useAuth from "@/hooks/useAuth";

type Booking = {
  id: string;
  bookingReference: string;
  bookingDate: string;
  guests: number;
  totalPrice: number;
  discountAmount: number;
  finalPrice: number;
  status: string;
  destination?: {
    id: string;
    name: string;
    location: string;
  } | null;
  tour?: {
    id: string;
    title: string;
    duration: string;
  } | null;
};

type MyBookingsResponse = {
  success: boolean;
  bookings: Booking[];
};

export default function DashboardBookingsPage() {
  const { isHydrated } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBookings() {
      try {
        const response = await apiFetch<MyBookingsResponse>("/bookings/mine", {
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

    if (isHydrated) {
      loadBookings();
    }
  }, [isHydrated]);

  return (
    <main className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-neutral-950">My Bookings</h1>
      <p className="mt-2 text-sm text-neutral-500">
        Track your destination and tour bookings here.
      </p>

      <div className="mt-6 space-y-4">
        {loading ? (
          <p className="text-sm text-neutral-500">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="text-sm text-neutral-500">No bookings yet.</p>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-[1.5rem] border border-black/5 bg-neutral-50 p-5"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <p className="text-base font-semibold text-neutral-950">
                    {booking.destination?.name || booking.tour?.title || "Booking"}
                  </p>

                  <p className="text-sm text-neutral-600">
                    Ref: {booking.bookingReference}
                  </p>

                  <p className="text-sm text-neutral-600">
                    Status:{" "}
                    <span className="font-medium text-neutral-950">
                      {booking.status}
                    </span>
                  </p>

                  <p className="text-sm text-neutral-600">
                    Guests: {booking.guests}
                  </p>

                  <p className="text-sm text-neutral-600">
                    Date: {new Date(booking.bookingDate).toLocaleDateString()}
                  </p>

                  {booking.destination?.location ? (
                    <p className="text-sm text-neutral-600">
                      Location: {booking.destination.location}
                    </p>
                  ) : null}

                  {booking.tour?.duration ? (
                    <p className="text-sm text-neutral-600">
                      Duration: {booking.tour.duration}
                    </p>
                  ) : null}
                </div>

                <div className="rounded-2xl border border-black/5 bg-white px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">
                    Final price
                  </p>
                  <p className="mt-1 text-lg font-semibold text-neutral-950">
                    ₦{Number(booking.finalPrice || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}