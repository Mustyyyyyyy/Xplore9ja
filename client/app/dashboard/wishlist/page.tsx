"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import useAuth from "@/hooks/useAuth";

type WishlistItem = {
  id: string;
  destination: {
    id: string;
    name: string;
    slug: string;
    location: string;
    state: string;
    images: string[];
    category: string;
    price?: number | null;
  };
};

type WishlistResponse = {
  success: boolean;
  wishlist: WishlistItem[];
};

export default function WishlistPage() {
  const { isHydrated } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWishlist() {
      try {
        const response = await apiFetch<WishlistResponse>("/wishlist/mine", {
          method: "GET",
          auth: true,
        });

        setWishlist(response.wishlist || []);
      } catch (error) {
        console.error("Failed to load wishlist:", error);
      } finally {
        setLoading(false);
      }
    }

    if (isHydrated) {
      loadWishlist();
    }
  }, [isHydrated]);

  return (
    <main className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-neutral-950">Wishlist</h1>
      <p className="mt-2 text-sm text-neutral-500">
        Your saved destinations appear here.
      </p>

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <p className="text-sm text-neutral-500">Loading wishlist...</p>
        ) : wishlist.length === 0 ? (
          <p className="text-sm text-neutral-500">No saved destinations yet.</p>
        ) : (
          wishlist.map((item) => (
            <Link
              key={item.id}
              href={`/destinations/${item.destination.slug}`}
              className="overflow-hidden rounded-[1.5rem] border border-black/5 bg-neutral-50 transition hover:-translate-y-1 hover:shadow-md"
            >
              <img
                src={
                  item.destination.images?.[0] ||
                  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop"
                }
                alt={item.destination.name}
                className="h-52 w-full object-cover"
              />

              <div className="p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">
                  {item.destination.category}
                </p>
                <h2 className="mt-2 text-lg font-semibold text-neutral-950">
                  {item.destination.name}
                </h2>
                <p className="mt-1 text-sm text-neutral-600">
                  {item.destination.location}, {item.destination.state}
                </p>

                {item.destination.price ? (
                  <p className="mt-3 text-sm font-medium text-neutral-950">
                    From ₦{Number(item.destination.price).toLocaleString()}
                  </p>
                ) : null}
              </div>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}