"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "@/lib/api";
import type { AuthResponse } from "@/lib/types";
import useAuth from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await apiFetch<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });

      login(response.accessToken, response.user, response.refreshToken);

      if (response.user.role === "ADMIN" || response.user.role === "SUPERADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-10">
      <div className="w-full max-w-md rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-8 space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-neutral-500">
            Welcome back
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">
            Login to Xplore9ja
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="h-12 w-full rounded-2xl border border-black/10 px-4 outline-none"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            required
          />

          <input
            className="h-12 w-full rounded-2xl border border-black/10 px-4 outline-none"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            required
          />

          {error ? <p className="text-sm text-red-500">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-full bg-neutral-950 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="mt-5 flex items-center justify-between text-sm">
          <Link href="/auth/forgot-password" className="text-neutral-600 hover:text-neutral-950">
            Forgot password?
          </Link>
          <Link href="/auth/register" className="text-neutral-600 hover:text-neutral-950">
            Create account
          </Link>
        </div>
      </div>
    </main>
  );
}