"use client";

import Link from "next/link";
import { useState } from "react";
import { apiFetch } from "@/lib/api";
import type { BasicMessageResponse } from "@/lib/types";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await apiFetch<BasicMessageResponse>("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      setMessage(response.message);
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-10">
      <div className="w-full max-w-md rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-8 space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-neutral-500">
            Password reset
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">
            Forgot your password?
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="h-12 w-full rounded-2xl border border-black/10 px-4 outline-none"
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {message ? <p className="text-sm text-green-600">{message}</p> : null}
          {error ? <p className="text-sm text-red-500">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-full bg-neutral-950 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <div className="mt-5 text-sm text-neutral-600">
          Back to{" "}
          <Link href="/auth/login" className="text-neutral-950">
            login
          </Link>
        </div>
      </div>
    </main>
  );
}