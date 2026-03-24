"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Promo = {
  id: string;
  code: string;
  description?: string;
  discountPercent?: number | null;
  discountAmount?: number | null;
  isActive: boolean;
  usedCount: number;
};

type PromosResponse = {
  success: boolean;
  promos: Promo[];
};

export default function AdminPromosPage() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    code: "",
    description: "",
    discountPercent: "",
    discountAmount: "",
    maxUses: "",
    minBookingAmount: "",
  });

  async function loadPromos() {
    try {
      const response = await apiFetch<PromosResponse>("/promos", {
        method: "GET",
        auth: true,
      });
      setPromos(response.promos || []);
    } catch (error) {
      console.error("Failed to load promos:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPromos();
  }, []);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      await apiFetch("/promos", {
        method: "POST",
        auth: true,
        body: JSON.stringify({
          code: form.code,
          description: form.description,
          discountPercent: form.discountPercent ? Number(form.discountPercent) : null,
          discountAmount: form.discountAmount ? Number(form.discountAmount) : null,
          maxUses: form.maxUses ? Number(form.maxUses) : null,
          minBookingAmount: form.minBookingAmount
            ? Number(form.minBookingAmount)
            : null,
        }),
      });

      setForm({
        code: "",
        description: "",
        discountPercent: "",
        discountAmount: "",
        maxUses: "",
        minBookingAmount: "",
      });

      loadPromos();
    } catch (error) {
      console.error("Failed to create promo:", error);
    }
  }

  return (
    <main className="space-y-6">
      <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-neutral-950">Manage Promos</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Create and review promo codes.
        </p>
      </div>

      <form
        onSubmit={handleCreate}
        className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-neutral-950">Create promo</h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <input
            className="h-12 rounded-2xl border border-black/10 px-4 outline-none"
            placeholder="Code"
            value={form.code}
            onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value }))}
            required
          />
          <input
            className="h-12 rounded-2xl border border-black/10 px-4 outline-none"
            placeholder="Discount percent"
            value={form.discountPercent}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, discountPercent: e.target.value }))
            }
          />
          <input
            className="h-12 rounded-2xl border border-black/10 px-4 outline-none"
            placeholder="Discount amount"
            value={form.discountAmount}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, discountAmount: e.target.value }))
            }
          />
          <input
            className="h-12 rounded-2xl border border-black/10 px-4 outline-none"
            placeholder="Max uses"
            value={form.maxUses}
            onChange={(e) => setForm((prev) => ({ ...prev, maxUses: e.target.value }))}
          />
          <input
            className="h-12 rounded-2xl border border-black/10 px-4 outline-none md:col-span-2"
            placeholder="Minimum booking amount"
            value={form.minBookingAmount}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, minBookingAmount: e.target.value }))
            }
          />
        </div>

        <textarea
          className="mt-4 min-h-[120px] w-full rounded-2xl border border-black/10 px-4 py-4 outline-none"
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, description: e.target.value }))
          }
        />

        <button className="mt-5 rounded-full bg-neutral-950 px-5 py-3 text-sm font-medium text-white">
          Create promo
        </button>
      </form>

      <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-neutral-950">All promos</h2>

        <div className="mt-5 space-y-4">
          {loading ? (
            <p className="text-sm text-neutral-500">Loading promos...</p>
          ) : promos.length === 0 ? (
            <p className="text-sm text-neutral-500">No promos yet.</p>
          ) : (
            promos.map((item) => (
              <div
                key={item.id}
                className="rounded-[1.5rem] border border-black/5 bg-neutral-50 p-5"
              >
                <p className="text-base font-semibold text-neutral-950">{item.code}</p>
                <p className="mt-1 text-sm text-neutral-600">
                  {item.description || "No description"}
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.12em] text-neutral-500">
                  {item.discountPercent
                    ? `${item.discountPercent}% off`
                    : item.discountAmount
                    ? `₦${Number(item.discountAmount).toLocaleString()} off`
                    : "No discount"}{" "}
                  • Used {item.usedCount} times • {item.isActive ? "Active" : "Inactive"}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}