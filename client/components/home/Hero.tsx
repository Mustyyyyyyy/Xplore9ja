"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, Sparkles, X } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

export default function Hero() {
  const [openPreview, setOpenPreview] = useState(false);

  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-8 sm:pb-24 sm:pt-10">
        <div className="absolute inset-0 -z-10">
          <div className="pulse-soft absolute left-10 top-14 h-40 w-40 rounded-full bg-orange-200/50 blur-3xl" />
          <div className="pulse-soft absolute right-10 top-24 h-56 w-56 rounded-full bg-emerald-200/50 blur-3xl" />
          <div className="pulse-soft absolute bottom-10 left-1/3 h-52 w-52 rounded-full bg-sky-200/40 blur-3xl" />
        </div>

        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="space-y-8">
              {/* <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65 }}
              >
                <Badge>
                  <span className="inline-flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5" />
                    Curated travel experiences across Nigeria
                  </span>
                </Badge>
              </motion.div> */}

              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.72, delay: 0.08 }}
                className="space-y-5"
              >
                <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-neutral-950 sm:text-6xl lg:text-7xl">
                  See Nigeria in a way that feels refined, easy, and unforgettable.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-neutral-600 sm:text-lg">
                  Xplore9ja helps you discover standout destinations, book polished experiences,
                  and plan trips with a cleaner, more premium travel experience.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.72, delay: 0.16 }}
                className="flex flex-wrap items-center gap-4"
              >
                <Button href="/destinations" className="gap-2">
                  Explore destinations
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <button
                  type="button"
                  onClick={() => setOpenPreview(true)}
                  className="inline-flex items-center gap-3 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-neutral-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-950 text-white">
                    <Play className="h-4 w-4 fill-white" />
                  </span>
                  Watch preview
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.72, delay: 0.24 }}
                className="grid max-w-2xl grid-cols-3 gap-4 pt-4"
              >
                {[
                  ["50+", "Curated places"],
                  ["12+", "States covered"],
                  ["100%", "Modern booking flow"],
                ].map(([num, label]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-black/5 bg-white/70 p-4 shadow-sm backdrop-blur"
                  >
                    <p className="text-2xl font-semibold text-neutral-950">{num}</p>
                    <p className="mt-1 text-sm text-neutral-600">{label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.18 }}
              className="relative"
            >
              <div className="float-slow relative overflow-hidden rounded-[2rem] border border-white/40 bg-white/70 p-3 shadow-[0_24px_80px_rgba(0,0,0,0.14)] backdrop-blur">
                <div className="relative overflow-hidden rounded-[1.5rem]">
                  <img
                    src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1400&auto=format&fit=crop"
                    alt="Scenic travel view"
                    className="h-[520px] w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                </div>

                <div className="absolute bottom-8 left-8 right-8 rounded-2xl border border-white/20 bg-white/15 p-4 text-white backdrop-blur-md">
                  <p className="text-sm font-medium text-white/80">Featured experience</p>
                  <h3 className="mt-1 text-xl font-semibold">Weekend by the water</h3>
                  <p className="mt-1 text-sm text-white/80">
                    Smooth travel moments, curated stays, and a premium discovery flow.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      <AnimatePresence>
        {openPreview ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
            onClick={() => setOpenPreview(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-4xl overflow-hidden rounded-[2rem] bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setOpenPreview(false)}
                className="absolute right-4 top-4 z-10 rounded-full bg-black/70 p-2 text-white transition hover:bg-black"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="aspect-video w-full bg-black">
                <iframe
                  className="h-full w-full"
                  src="https://www.youtube.com/embed/ZZH-wnR3JJk"
                  title="Xplore9ja Preview"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}