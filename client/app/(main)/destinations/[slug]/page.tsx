"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import WishlistButton from "@/components/destinations/WishlistButton";
import { apiFetch } from "@/lib/api";

type Destination = {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string | null;
  description: string;
  location: string;
  state: string;
  country: string;
  address?: string | null;
  price?: number | null;
  featured: boolean;
  isPublished: boolean;
  category: string;
  images: string[];
  tags: string[];
  bestTime?: string | null;
  mapLink?: string | null;
};

type DestinationResponse = {
  success: boolean;
  destination: Destination;
};

export default function DestinationDetailsPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    async function loadDestination() {
      try {
        const response = await apiFetch<DestinationResponse>(`/destinations/${slug}`, {
          method: "GET",
        });

        setDestination(response.destination);
      } catch (error) {
        console.error("Failed to load destination:", error);
        setFailed(true);
      } finally {
        setLoading(false);
      }
    }

    if (slug) loadDestination();
  }, [slug]);

  if (!loading && failed) {
    notFound();
  }

  if (loading) {
    return (
      <main className="pb-20 pt-8 sm:pb-24">
        <Container>
          <p className="text-sm text-neutral-500">Loading destination...</p>
        </Container>
      </main>
    );
  }

  if (!destination) return null;

  return (
    <main className="pb-20 pt-8 sm:pb-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-sm">
              <img
                src={
                  destination.images?.[0] ||
                  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop"
                }
                alt={destination.name}
                className="h-[460px] w-full object-cover"
              />
            </div>

            {destination.images?.length > 1 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {destination.images.slice(1, 4).map((img) => (
                  <div
                    key={img}
                    className="overflow-hidden rounded-2xl border border-black/5 bg-white"
                  >
                    <img
                      src={img}
                      alt={destination.name}
                      className="h-40 w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="space-y-6">
            <Badge>{destination.category}</Badge>

            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl">
                {destination.name}
              </h1>
              <p className="mt-3 text-base text-neutral-600">
                {destination.location}, {destination.state}, {destination.country}
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500">Starting price</span>
                <span className="text-lg font-semibold text-neutral-950">
                  {destination.price
                    ? `₦${Number(destination.price).toLocaleString()}`
                    : "Contact for price"}
                </span>
              </div>

              <p className="mt-5 text-sm leading-7 text-neutral-600">
                {destination.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button href="/dashboard/book-trip">Book this destination</Button>
                <WishlistButton destinationId={destination.id} />
                <Button href="/destinations" variant="secondary">
                  Back to destinations
                </Button>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-black/5 bg-neutral-50 p-6">
              <h2 className="text-lg font-semibold text-neutral-950">
                Details
              </h2>

              <div className="mt-4 space-y-3 text-sm text-neutral-600">
                {destination.bestTime ? (
                  <p>
                    <span className="font-medium text-neutral-950">Best time:</span>{" "}
                    {destination.bestTime}
                  </p>
                ) : null}

                {destination.address ? (
                  <p>
                    <span className="font-medium text-neutral-950">Address:</span>{" "}
                    {destination.address}
                  </p>
                ) : null}

                {destination.tags?.length ? (
                  <div>
                    <p className="font-medium text-neutral-950">Tags</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {destination.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {destination.mapLink ? (
                  <a
                    href={destination.mapLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block text-sm font-medium text-neutral-950 underline"
                  >
                    Open map
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}