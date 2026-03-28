"use client";

import Link from "next/link";
import { useState } from "react";
import { apiFetch } from "@/lib/api";
import type { BasicMessageResponse } from "@/lib/types";

type Props = {
  token: string;
};

export default function ResetPasswordClient({ token }: Props) {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    if (!token) {
      setError("Reset token is missing.");
      setLoading(false);
      return;
    }

    try {
      const response = await apiFetch<BasicMessageResponse>("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          token,
          password,
        }),
      });

      setMessage(response.message);
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-10">
      <div className="w-full max-w-md rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-8 space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-neutral-500">
            Set new password
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">
            Reset password
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="h-12 w-full rounded-2xl border border-black/10 px-4 outline-none"
            placeholder="New password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {message ? <p className="text-sm text-green-600">{message}</p> : null}
          {error ? <p className="text-sm text-red-500">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-full bg-neutral-950 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update password"}
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