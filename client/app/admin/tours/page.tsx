"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import ImageUploadField from "@/components/admin/ImageUploadField";

type Destination = {
  id: string;
  name: string;
};

type Tour = {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: string;
  price: number;
  availableSlots: number;
  destinationId: string;
  images: string[];
  included: string[];
  excluded: string[];
  destination?: {
    name: string;
  };
};

type ToursResponse = {
  success: boolean;
  tours: Tour[];
};

type DestinationsResponse = {
  success: boolean;
  destinations: Destination[];
};

const initialForm = {
  id: "",
  title: "",
  description: "",
  price: "",
  duration: "",
  availableSlots: "",
  type: "GROUP",
  destinationId: "",
  images: [] as string[],
  included: "",
  excluded: "",
};

export default function AdminToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);

  async function loadTours() {
    try {
      const [toursRes, destinationsRes] = await Promise.all([
        apiFetch<ToursResponse>("/tours", { method: "GET", auth: true }),
        apiFetch<DestinationsResponse>("/destinations", { method: "GET", auth: true }),
      ]);

      setTours(toursRes.tours || []);
      setDestinations(destinationsRes.destinations || []);
    } catch (error) {
      console.error("Failed to load tours:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTours();
  }, []);

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
  }

  function startEdit(item: Tour) {
    setEditingId(item.id);
    setForm({
      id: item.id,
      title: item.title,
      description: item.description,
      price: String(item.price || ""),
      duration: item.duration,
      availableSlots: String(item.availableSlots || ""),
      type: item.type,
      destinationId: item.destinationId,
      images: item.images || [],
      included: item.included?.join(", ") || "",
      excluded: item.excluded?.join(", ") || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title: form.title,
      description: form.description,
      price: Number(form.price),
      duration: form.duration,
      availableSlots: Number(form.availableSlots || 0),
      type: form.type,
      destinationId: form.destinationId,
      images: form.images,
      included: form.included ? form.included.split(",").map((i) => i.trim()) : [],
      excluded: form.excluded ? form.excluded.split(",").map((i) => i.trim()) : [],
    };

    try {
      if (editingId) {
        await apiFetch(`/tours/${editingId}`, {
          method: "PATCH",
          auth: true,
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch("/tours", {
          method: "POST",
          auth: true,
          body: JSON.stringify(payload),
        });
      }

      resetForm();
      loadTours();
    } catch (error) {
      console.error("Failed to save tour:", error);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await apiFetch(`/tours/${id}`, {
        method: "DELETE",
        auth: true,
      });
      loadTours();
    } catch (error) {
      console.error("Failed to delete tour:", error);
    }
  }

  return (
    <main className="space-y-6">
      <Card>
        <h1 className="text-2xl font-semibold text-neutral-950">Manage Tours</h1>
        <p className="mt-2 text-sm text-neutral-500">Create, edit, and manage tour packages.</p>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-neutral-950">
          {editingId ? "Edit tour" : "Add tour"}
        </h2>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              required
            />
            <Input
              placeholder="Duration"
              value={form.duration}
              onChange={(e) => setForm((prev) => ({ ...prev, duration: e.target.value }))}
              required
            />
            <Input
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
              required
            />
            <Input
              placeholder="Available slots"
              value={form.availableSlots}
              onChange={(e) => setForm((prev) => ({ ...prev, availableSlots: e.target.value }))}
            />

            <select
              className="h-12 rounded-2xl border border-black/10 px-4 outline-none"
              value={form.type}
              onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
            >
              <option value="GROUP">Group</option>
              <option value="SOLO">Solo</option>
              <option value="FAMILY">Family</option>
              <option value="COUPLE">Couple</option>
              <option value="LUXURY">Luxury</option>
            </select>

            <select
              className="h-12 rounded-2xl border border-black/10 px-4 outline-none"
              value={form.destinationId}
              onChange={(e) => setForm((prev) => ({ ...prev, destinationId: e.target.value }))}
              required
            >
              <option value="">Select destination</option>
              {destinations.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>

            <Input
              placeholder="Included (comma separated)"
              value={form.included}
              onChange={(e) => setForm((prev) => ({ ...prev, included: e.target.value }))}
            />

            <Input
              placeholder="Excluded (comma separated)"
              value={form.excluded}
              onChange={(e) => setForm((prev) => ({ ...prev, excluded: e.target.value }))}
            />
          </div>

          <Textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            required
          />

          <ImageUploadField
            value={form.images}
            onChange={(urls) => setForm((prev) => ({ ...prev, images: urls }))}
          />

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-neutral-950 px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
            >
              {saving ? "Saving..." : editingId ? "Update tour" : "Create tour"}
            </button>

            {editingId ? (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full border border-black/10 px-5 py-3 text-sm font-medium text-neutral-700"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-neutral-950">All tours</h2>

        <div className="mt-5 space-y-4">
          {loading ? (
            <p className="text-sm text-neutral-500">Loading tours...</p>
          ) : tours.length === 0 ? (
            <p className="text-sm text-neutral-500">No tours yet.</p>
          ) : (
            tours.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-[1.5rem] border border-black/5 bg-neutral-50 p-5 md:flex-row md:items-center md:justify-between"
              >
                <div className="min-w-0">
                  <p className="text-base font-semibold text-neutral-950">{item.title}</p>
                  <p className="mt-1 text-sm text-neutral-600">
                    {item.destination?.name || "No destination"} • {item.duration}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.12em] text-neutral-500">
                    {item.type} • ₦{Number(item.price || 0).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => startEdit(item)}
                    className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-neutral-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </main>
  );
}