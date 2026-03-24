"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmail("");
  }

  return (
    <section className="pb-20 pt-8 sm:pb-24">
      <Container>
        <Reveal>
          <div className="overflow-hidden rounded-[2rem] bg-neutral-950 px-6 py-10 text-white sm:px-10 sm:py-14">
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
              <div className="max-w-2xl space-y-3">
                <p className="text-sm font-medium uppercase tracking-[0.14em] text-white/60">
                  Stay updated
                </p>
                <h3 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Get destination drops, curated picks, and travel inspiration.
                </h3>
                <p className="text-sm leading-7 text-white/70 sm:text-base">
                  Stay close to what’s new on Xplore9ja as we expand the discovery experience.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex w-full max-w-xl flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 flex-1 rounded-full border border-white/10 bg-white/10 px-5 text-sm text-white placeholder:text-white/50 outline-none"
                />
                <Button type="submit" className="h-12 bg-white text-neutral-950 hover:bg-white">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}