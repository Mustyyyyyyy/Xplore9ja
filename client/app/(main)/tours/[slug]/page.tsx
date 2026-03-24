"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { apiFetch } from "@/lib/api";

type Tour = {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string | null;
  description: string;
  price: number;
  discountPrice?: number | null;
  duration: string;
  availableSlots: number;
  minGroupSize: number;
  maxGroupSize?: number | null;
  type: string;
  images: string[];
  itinerary?: string | null;
  included: string[];
  excluded: string[];
  destination?: {
    id: string;
    name: string;
    slug: string;
    location: string;
    state: string;
  };
};

type TourResponse = {
  success: boolean;
  tour: Tour;
};

export default function TourDetailsPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    async function loadTour() {
      try {
        const response = await apiFetch<TourResponse>(`/tours/${slug}`, {
          method: "GET",
        });

        setTour(response.tour);
      } catch (error) {
        console.error("Failed to load tour:", error);
        setFailed(true);
      } finally {
        setLoading(false);
      }
    }

    if (slug) loadTour();
  }, [slug]);

  if (!loading && failed) {
    notFound();
  }

  if (loading) {
    return (
      <main className="pb-20 pt-8 sm:pb-24">
        <Container>
          <p className="text-sm text-neutral-500">Loading tour...</p>
        </Container>
      </main>
    );
  }

  if (!tour) return null;

  return (
    <main className="pb-20 pt-8 sm:pb-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-sm">
              <img
                src={
                  tour.images?.[0] ||
                  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1400&auto=format&fit=crop"
                }
                alt={tour.title}
                className="h-[480px] w-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-6">
            <Badge>{tour.duration}</Badge>

            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl">
                {tour.title}
              </h1>
              <p className="mt-4 text-base leading-7 text-neutral-600">
                {tour.description}
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500">Starting price</span>
                <span className="text-lg font-semibold text-neutral-950">
                  ₦{Number(tour.discountPrice || tour.price || 0).toLocaleString()}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-sm text-neutral-600">
                <p>
                  <span className="font-medium text-neutral-950">Type:</span> {tour.type}
                </p>
                <p>
                  <span className="font-medium text-neutral-950">Slots:</span>{" "}
                  {tour.availableSlots}
                </p>
                <p>
                  <span className="font-medium text-neutral-950">Group size:</span>{" "}
                  {tour.minGroupSize}
                  {tour.maxGroupSize ? ` - ${tour.maxGroupSize}` : "+"}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button href="/dashboard/book-trip">Book this tour</Button>
                <Button href="/tours" variant="secondary">
                  View all tours
                </Button>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-black/5 bg-neutral-50 p-6">
              <h2 className="text-lg font-semibold text-neutral-950">
                Tour details
              </h2>

              {tour.included?.length ? (
                <div className="mt-4">
                  <p className="font-medium text-neutral-950">Included</p>
                  <ul className="mt-2 space-y-2 text-sm text-neutral-600">
                    {tour.included.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {tour.excluded?.length ? (
                <div className="mt-4">
                  <p className="font-medium text-neutral-950">Excluded</p>
                  <ul className="mt-2 space-y-2 text-sm text-neutral-600">
                    {tour.excluded.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {tour.destination ? (
                <div className="mt-4 text-sm text-neutral-600">
                  <span className="font-medium text-neutral-950">Destination:</span>{" "}
                  {tour.destination.name}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}