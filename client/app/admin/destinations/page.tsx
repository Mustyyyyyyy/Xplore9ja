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
  description: string;
  location: string;
  state: string;
  category: string;
  featured: boolean;
  price?: number | null;
  images: string[];
  tags: string[];
};

type DestinationResponse = {
  success: boolean;
  destinations: Destination[];
};

const initialForm = {
  id: "",
  name: "",
  description: "",
  location: "",
  state: "",
  category: "HISTORICAL",
  price: "",
  tags: "",
  images: [] as string[],
  featured: false,
};

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState(initialForm);

  async function loadDestinations() {
    try {
      const response = await apiFetch<DestinationResponse>("/destinations", {
        method: "GET",
        auth: true,
      });
      setDestinations(response.destinations || []);
    } catch (error) {
      console.error("Failed to load destinations:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDestinations();
  }, []);

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
  }

  function startEdit(item: Destination) {
    setEditingId(item.id);
    setForm({
      id: item.id,
      name: item.name,
      description: item.description,
      location: item.location,
      state: item.state,
      category: item.category,
      price: item.price ? String(item.price) : "",
      tags: item.tags?.join(", ") || "",
      images: item.images || [],
      featured: item.featured,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name: form.name,
      description: form.description,
      location: form.location,
      state: form.state,
      category: form.category,
      price: form.price ? Number(form.price) : null,
      images: form.images,
      tags: form.tags ? form.tags.split(",").map((item) => item.trim()) : [],
      featured: form.featured,
    };

    try {
      if (editingId) {
        await apiFetch(`/destinations/${editingId}`, {
          method: "PATCH",
          auth: true,
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch("/destinations", {
          method: "POST",
          auth: true,
          body: JSON.stringify(payload),
        });
      }

      resetForm();
      loadDestinations();
    } catch (error) {
      console.error("Failed to save destination:", error);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await apiFetch(`/destinations/${id}`, {
        method: "DELETE",
        auth: true,
      });
      loadDestinations();
    } catch (error) {
      console.error("Failed to delete destination:", error);
    }
  }

  return (
    <main className="space-y-6">
      <Card>
        <h1 className="text-2xl font-semibold text-neutral-950">Manage Destinations</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Create, edit, and manage destination listings.
        </p>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-neutral-950">
          {editingId ? "Edit destination" : "Add destination"}
        </h2>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
            <Input
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
              required
            />
            <Input
              placeholder="State"
              value={form.state}
              onChange={(e) => setForm((prev) => ({ ...prev, state: e.target.value }))}
              required
            />
            <Input
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
            />
            <Input
              className="md:col-span-2"
              placeholder="Tags (comma separated)"
              value={form.tags}
              onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))}
            />

            <select
              className="h-12 rounded-2xl border border-black/10 px-4 outline-none"
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
            >
              <option value="HISTORICAL">Historical</option>
              <option value="NATURE">Nature</option>
              <option value="ADVENTURE">Adventure</option>
              <option value="RESORT">Resort</option>
              <option value="WILDLIFE">Wildlife</option>
              <option value="CITY">City</option>
            </select>

            <label className="flex items-center gap-3 rounded-2xl border border-black/10 px-4 text-sm text-neutral-700">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm((prev) => ({ ...prev, featured: e.target.checked }))}
              />
              Featured
            </label>
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
              {saving ? "Saving..." : editingId ? "Update destination" : "Create destination"}
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
        <h2 className="text-lg font-semibold text-neutral-950">All destinations</h2>

        <div className="mt-5 space-y-4">
          {loading ? (
            <p className="text-sm text-neutral-500">Loading destinations...</p>
          ) : destinations.length === 0 ? (
            <p className="text-sm text-neutral-500">No destinations yet.</p>
          ) : (
            destinations.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-[1.5rem] border border-black/5 bg-neutral-50 p-5 md:flex-row md:items-center md:justify-between"
              >
                <div className="min-w-0">
                  <p className="text-base font-semibold text-neutral-950">{item.name}</p>
                  <p className="mt-1 text-sm text-neutral-600">
                    {item.location}, {item.state}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.12em] text-neutral-500">
                    {item.category} {item.featured ? "• Featured" : ""}
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