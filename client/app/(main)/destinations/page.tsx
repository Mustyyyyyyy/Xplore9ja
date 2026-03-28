"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { apiFetch } from "@/lib/api";

type Destination = {
  id: string;
  name: string;
  slug: string;
  location: string;
  state: string;
  category: string;
  images: string[];
  price?: number | null;
};

type DestinationResponse = {
  success: boolean;
  destinations: Destination[];
};

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDestinations() {
      try {
        const response = await apiFetch<DestinationResponse>("/destinations", {
          method: "GET",
        });

        setDestinations(response.destinations || []);
      } catch (error) {
        console.error("Failed to load destinations:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDestinations();
  }, []);

  return (
    <main className="pb-20 pt-10 sm:pb-24">
      <Container>
        <Reveal>
          <div className="space-y-4">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-neutral-500">
              Explore destinations
            </p>
            <SectionHeading
              title="Discover standout places across Nigeria"
              />
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <p className="text-sm text-neutral-500">Loading destinations...</p>
          ) : destinations.length === 0 ? (
            <p className="text-sm text-neutral-500">No destinations found.</p>
          ) : (
            destinations.map((item, index) => (
              <Reveal key={item.id} delay={index * 0.06}>
                <Link
                  href={`/destinations/${item.slug}`}
                  className="group block overflow-hidden rounded-[1.75rem] border border-black/5 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="overflow-hidden">
                    <img
                      src={
                        item.images?.[0] ||
                        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop"
                      }
                      alt={item.name}
                      className="h-80 w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>

                  <div className="space-y-3 p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                        {item.category}
                      </span>

                      {item.price ? (
                        <span className="text-sm font-medium text-neutral-900">
                          From ₦{Number(item.price).toLocaleString()}
                        </span>
                      ) : null}
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-neutral-950">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-sm text-neutral-600">
                        {item.location}, {item.state}
                      </p>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))
          )}
        </div>
      </Container>
    </main>
  );
}