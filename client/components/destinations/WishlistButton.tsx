"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { apiFetch } from "@/lib/api";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

type Props = {
  destinationId: string;
};

export default function WishlistButton({ destinationId }: Props) {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuth();

  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkStatus() {
      if (!isHydrated || !isAuthenticated) {
        setChecking(false);
        return;
      }

      try {
        const response = await apiFetch<{ success: boolean; isSaved: boolean }>(
          `/wishlist/check/${destinationId}`,
          {
            method: "GET",
            auth: true,
          }
        );

        setIsSaved(response.isSaved);
      } catch (error) {
        console.error("Wishlist check failed:", error);
      } finally {
        setChecking(false);
      }
    }

    checkStatus();
  }, [destinationId, isAuthenticated, isHydrated]);

  async function handleToggle() {
    if (!isHydrated) return;

    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    setLoading(true);

    try {
      if (isSaved) {
        await apiFetch(`/wishlist/${destinationId}`, {
          method: "DELETE",
          auth: true,
        });
        setIsSaved(false);
      } else {
        await apiFetch(`/wishlist`, {
          method: "POST",
          auth: true,
          body: JSON.stringify({ destinationId }),
        });
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Wishlist toggle failed:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading || checking}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-medium transition ${
        isSaved
          ? "bg-neutral-950 text-white"
          : "border border-black/10 bg-white text-neutral-900"
      } disabled:opacity-60`}
    >
      <Heart className={`h-4 w-4 ${isSaved ? "fill-white" : ""}`} />
      {checking ? "Checking..." : loading ? "Please wait..." : isSaved ? "Saved" : "Save"}
    </button>
  );
}