"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { apiFetch } from "@/lib/api";

type Tour = {
  id: string;
  title: string;
  slug: string;
  duration: string;
  price: number;
  images: string[];
  type: string;
  destination?: {
    id: string;
    name: string;
    slug: string;
  };
};

type ToursResponse = {
  success: boolean;
  tours: Tour[];
};

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTours() {
      try {
        const response = await apiFetch<ToursResponse>("/tours", {
          method: "GET",
        });

        setTours(response.tours || []);
      } catch (error) {
        console.error("Failed to load tours:", error);
      } finally {
        setLoading(false);
      }
    }

    loadTours();
  }, []);

  return (
    <main className="pb-20 pt-10 sm:pb-24">
      <Container>
        <Reveal>
          <div className="space-y-4">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-neutral-500">
              Curated tours
            </p>
            <SectionHeading
              title="Travel packages with a more polished feel"
              text="Explore real tours from your backend."
            />
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {loading ? (
            <p className="text-sm text-neutral-500">Loading tours...</p>
          ) : tours.length === 0 ? (
            <p className="text-sm text-neutral-500">No tours found.</p>
          ) : (
            tours.map((tour, index) => (
              <Reveal key={tour.id} delay={index * 0.08}>
                <Link
                  href={`/tours/${tour.slug}`}
                  className="group block overflow-hidden rounded-[1.75rem] border border-black/5 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="overflow-hidden">
                    <img
                      src={
                        tour.images?.[0] ||
                        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1400&auto=format&fit=crop"
                      }
                      alt={tour.title}
                      className="h-72 w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-5">
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                      {tour.duration}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-neutral-950">
                      {tour.title}
                    </h3>

                    <p className="mt-2 text-sm text-neutral-600">
                      {tour.destination?.name || "No destination"}
                    </p>

                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-sm text-neutral-500">From</span>
                      <span className="text-base font-semibold text-neutral-950">
                        ₦{Number(tour.price || 0).toLocaleString()}
                      </span>
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