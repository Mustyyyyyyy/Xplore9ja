"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";

type Destination = {
  id: string;
  name: string;
  slug: string;
  location: string;
  state: string;
  shortDescription?: string | null;
  description?: string;
  images?: string[];
  price?: number | null;
  category?: string;
};

type Tour = {
  id: string;
  title: string;
  slug: string;
  duration: string;
  shortDescription?: string | null;
  description?: string;
  images?: string[];
  price: number;
  type?: string;
  destination?: {
    id: string;
    name: string;
    slug: string;
  } | null;
};

type DestinationResponse = {
  success: boolean;
  destinations: Destination[];
};

type ToursResponse = {
  success: boolean;
  tours: Tour[];
};

type BookingResponse = {
  success: boolean;
  message: string;
  booking: {
    id: string;
    bookingReference: string;
    status: string;
  };
};

export default function BookTripPage() {
  const [bookingType, setBookingType] = useState<"destination" | "tour">("destination");
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    destinationId: "",
    tourId: "",
    bookingDate: "",
    startDate: "",
    endDate: "",
    guests: 1,
    specialRequests: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadOptions() {
      try {
        const [destRes, toursRes] = await Promise.all([
          apiFetch<DestinationResponse>("/destinations", {
            method: "GET",
            auth: true,
          }),
          apiFetch<ToursResponse>("/tours", {
            method: "GET",
            auth: true,
          }),
        ]);

        setDestinations(destRes.destinations || []);
        setTours(toursRes.tours || []);
      } catch (error) {
        console.error("Failed to load booking options:", error);
      } finally {
        setLoading(false);
      }
    }

    loadOptions();
  }, []);

  const selectedDestination = useMemo(
    () => destinations.find((item) => item.id === form.destinationId),
    [destinations, form.destinationId]
  );

  const selectedTour = useMemo(
    () => tours.find((item) => item.id === form.tourId),
    [tours, form.tourId]
  );

  const selectedImage = useMemo(() => {
    if (bookingType === "destination") {
      return (
        selectedDestination?.images?.[0] ||
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop"
      );
    }

    return (
      selectedTour?.images?.[0] ||
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1400&auto=format&fit=crop"
    );
  }, [bookingType, selectedDestination, selectedTour]);

  const selectedTitle = useMemo(() => {
    return bookingType === "destination"
      ? selectedDestination?.name || "No destination selected"
      : selectedTour?.title || "No tour selected";
  }, [bookingType, selectedDestination, selectedTour]);

  const selectedSubtitle = useMemo(() => {
    if (bookingType === "destination") {
      return selectedDestination
        ? `${selectedDestination.location}, ${selectedDestination.state}`
        : "Choose a destination to see details";
    }

    return selectedTour
      ? `${selectedTour.duration}${selectedTour.destination?.name ? ` • ${selectedTour.destination.name}` : ""}`
      : "Choose a tour to see details";
  }, [bookingType, selectedDestination, selectedTour]);

  const selectedDescription = useMemo(() => {
    if (bookingType === "destination") {
      return (
        selectedDestination?.shortDescription ||
        selectedDestination?.description ||
        "No destination description yet."
      );
    }

    return (
      selectedTour?.shortDescription ||
      selectedTour?.description ||
      "No tour description yet."
    );
  }, [bookingType, selectedDestination, selectedTour]);

  const estimatedPrice = useMemo(() => {
    if (bookingType === "destination") {
      return (selectedDestination?.price || 0) * Number(form.guests || 1);
    }

    return (selectedTour?.price || 0) * Number(form.guests || 1);
  }, [bookingType, selectedDestination, selectedTour, form.guests]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const payload =
        bookingType === "destination"
          ? {
              destinationId: form.destinationId,
              bookingDate: form.bookingDate || new Date().toISOString(),
              startDate: form.startDate || null,
              endDate: form.endDate || null,
              guests: Number(form.guests),
              totalPrice: estimatedPrice,
              finalPrice: estimatedPrice,
              specialRequests: form.specialRequests,
            }
          : {
              tourId: form.tourId,
              bookingDate: form.bookingDate || new Date().toISOString(),
              startDate: form.startDate || null,
              endDate: form.endDate || null,
              guests: Number(form.guests),
              totalPrice: estimatedPrice,
              finalPrice: estimatedPrice,
              specialRequests: form.specialRequests,
            };

      const response = await apiFetch<BookingResponse>("/bookings", {
        method: "POST",
        auth: true,
        body: JSON.stringify(payload),
      });

      setMessage(
        response.message || `Booking created successfully. Ref: ${response.booking.bookingReference}`
      );

      setForm({
        destinationId: "",
        tourId: "",
        bookingDate: "",
        startDate: "",
        endDate: "",
        guests: 1,
        specialRequests: "",
      });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Booking failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="space-y-6">
      <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-neutral-950">Book Trip</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Choose a destination or tour, set your dates, and create a booking.
        </p>

        {!loading && destinations.length === 0 && tours.length === 0 ? (
          <p className="mt-4 text-sm text-red-500">
            No destinations or tours found yet. Seed your database or add them from admin.
          </p>
        ) : null}
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"
      >
        <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                setBookingType("destination");
                setForm((prev) => ({ ...prev, tourId: "" }));
              }}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                bookingType === "destination"
                  ? "bg-neutral-950 text-white"
                  : "border border-black/10 bg-white text-neutral-700"
              }`}
            >
              Destination Booking
            </button>

            <button
              type="button"
              onClick={() => {
                setBookingType("tour");
                setForm((prev) => ({ ...prev, destinationId: "" }));
              }}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                bookingType === "tour"
                  ? "bg-neutral-950 text-white"
                  : "border border-black/10 bg-white text-neutral-700"
              }`}
            >
              Tour Booking
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {bookingType === "destination" ? (
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Choose destination
                </label>
                <select
                  className="h-12 w-full rounded-2xl border border-black/10 px-4 outline-none"
                  value={form.destinationId}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, destinationId: e.target.value }))
                  }
                  required
                >
                  <option value="">
                    {loading ? "Loading destinations..." : "Select destination"}
                  </option>
                  {destinations.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} — {item.location}, {item.state}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Choose tour
                </label>
                <select
                  className="h-12 w-full rounded-2xl border border-black/10 px-4 outline-none"
                  value={form.tourId}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, tourId: e.target.value }))
                  }
                  required
                >
                  <option value="">
                    {loading ? "Loading tours..." : "Select tour"}
                  </option>
                  {tours.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title} — {item.duration}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">
                Start date
              </label>
              <input
                type="date"
                className="h-12 w-full rounded-2xl border border-black/10 px-4 outline-none"
                value={form.startDate}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, startDate: e.target.value }))
                }
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">
                End date
              </label>
              <input
                type="date"
                className="h-12 w-full rounded-2xl border border-black/10 px-4 outline-none"
                value={form.endDate}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, endDate: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">
                Number of guests
              </label>
              <input
                type="number"
                min={1}
                className="h-12 w-full rounded-2xl border border-black/10 px-4 outline-none"
                placeholder="Enter number of guests"
                value={form.guests}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, guests: Number(e.target.value) }))
                }
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">
                Booking date and time
              </label>
              <input
                type="datetime-local"
                className="h-12 w-full rounded-2xl border border-black/10 px-4 outline-none"
                value={form.bookingDate}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, bookingDate: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-neutral-700">
              Special requests
            </label>
            <textarea
              className="min-h-[140px] w-full rounded-2xl border border-black/10 px-4 py-4 outline-none"
              placeholder="Add any extra notes or requests"
              value={form.specialRequests}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, specialRequests: e.target.value }))
              }
            />
          </div>

          {message ? (
            <p className="mt-4 text-sm text-neutral-600">{message}</p>
          ) : null}

          <button
            type="submit"
            disabled={
              submitting ||
              loading ||
              (bookingType === "destination" && !form.destinationId) ||
              (bookingType === "tour" && !form.tourId)
            }
            className="mt-5 rounded-full bg-neutral-950 px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Create Booking"}
          </button>
        </div>

        <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-950">Booking Summary</h2>

          <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-black/5 bg-neutral-50">
            <img
              src={selectedImage}
              alt={selectedTitle}
              className="h-56 w-full object-cover"
            />

            <div className="p-5">
              <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">
                {bookingType}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-neutral-950">
                {selectedTitle}
              </h3>
              <p className="mt-1 text-sm text-neutral-600">{selectedSubtitle}</p>
              <p className="mt-4 text-sm leading-7 text-neutral-600">
                {selectedDescription}
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-4 text-sm text-neutral-600">
            <div>
              <p className="font-medium text-neutral-950">Selected booking type</p>
              <p className="mt-1 capitalize">{bookingType}</p>
            </div>

            <div>
              <p className="font-medium text-neutral-950">Selected option</p>
              <p className="mt-1">{selectedTitle}</p>
            </div>

            <div>
              <p className="font-medium text-neutral-950">Guests</p>
              <p className="mt-1">{form.guests}</p>
            </div>

            <div>
              <p className="font-medium text-neutral-950">Travel dates</p>
              <p className="mt-1">
                {form.startDate || "Not selected"}
                {form.endDate ? ` → ${form.endDate}` : ""}
              </p>
            </div>

            <div>
              <p className="font-medium text-neutral-950">Booking date and time</p>
              <p className="mt-1">{form.bookingDate || "Not specified"}</p>
            </div>

            <div>
              <p className="font-medium text-neutral-950">Estimated total</p>
              <p className="mt-1 text-lg font-semibold text-neutral-950">
                ₦{Number(estimatedPrice || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}