"use client";

import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import { apiFetch } from "@/lib/api";

type ProfileResponse = {
  success: boolean;
  user: {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    avatar?: string;
    role: "USER" | "ADMIN" | "SUPERADMIN";
    updatedAt?: string;
  };
};

export default function DashboardProfilePage() {
  const { user, login, accessToken, refreshToken, isHydrated } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isHydrated && user) {
      setForm({
        fullName: user.fullName || "",
        phone: user.phone || "",
        avatar: user.avatar || "",
      });
    }
  }, [isHydrated, user]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await apiFetch<ProfileResponse>("/users/profile", {
        method: "PATCH",
        auth: true,
        body: JSON.stringify(form),
      });

      login(accessToken || "", response.user, refreshToken || undefined);
      setMessage("Profile updated successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Update failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-neutral-950">Profile</h1>
      <p className="mt-2 text-sm text-neutral-500">
        Update your account details here.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 max-w-2xl space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-700">
            Full name
          </label>
          <input
            className="h-12 w-full rounded-2xl border border-black/10 px-4 outline-none"
            value={form.fullName}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, fullName: e.target.value }))
            }
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-700">
            Phone
          </label>
          <input
            className="h-12 w-full rounded-2xl border border-black/10 px-4 outline-none"
            value={form.phone}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, phone: e.target.value }))
            }
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-700">
            Avatar URL
          </label>
          <input
            className="h-12 w-full rounded-2xl border border-black/10 px-4 outline-none"
            value={form.avatar}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, avatar: e.target.value }))
            }
          />
        </div>

        <div className="rounded-2xl bg-neutral-50 p-4 text-sm text-neutral-600">
          <p>
            <span className="font-medium text-neutral-950">Email:</span>{" "}
            {user?.email || "-"}
          </p>
          <p className="mt-2">
            <span className="font-medium text-neutral-950">Role:</span>{" "}
            {user?.role || "-"}
          </p>
        </div>

        {message ? <p className="text-sm text-neutral-600">{message}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-neutral-950 px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save changes"}
        </button>
      </form>
    </main>
  );
}