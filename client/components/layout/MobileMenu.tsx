"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { siteConfig } from "@/config/site";

export default function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="ml-auto flex h-full w-[84%] max-w-sm flex-col bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">{siteConfig.name}</span>
              <button onClick={onClose} className="rounded-full p-2 hover:bg-neutral-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-10 flex flex-col gap-5">
              {siteConfig.navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="text-base font-medium text-neutral-800"
                >
                  {item.label}
                </Link>
              ))}

              <Link
                href="/auth/login"
                onClick={onClose}
                className="mt-4 rounded-full border border-black/10 px-4 py-3 text-center text-sm font-medium"
              >
                Sign in
              </Link>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}