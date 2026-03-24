"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import MobileMenu from "./MobileMenu";
import { cn } from "@/lib/utils";
import useAuth from "@/hooks/useAuth";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, isHydrated } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 transition-all duration-300",
          scrolled ? "py-3" : "py-5"
        )}
      >
        <Container>
          <div
            className={cn(
              "glass-panel flex items-center justify-between rounded-full border px-4 py-3 transition-all duration-300",
              scrolled
                ? "border-black/10 bg-white/85 shadow-lg"
                : "border-white/30 bg-white/60"
            )}
          >
            <Link href="/" className="text-lg font-semibold tracking-tight text-neutral-950">
              Xplore9ja
            </Link>

            <nav className="hidden items-center gap-8 md:flex">
              {siteConfig.navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-neutral-700 transition hover:text-neutral-950"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="hidden md:block">
              {isHydrated && isAuthenticated ? (
                <Button
                  href={
                    user?.role === "ADMIN" || user?.role === "SUPERADMIN"
                      ? "/admin"
                      : "/dashboard"
                  }
                >
                  Dashboard
                </Button>
              ) : (
                <Button href="/auth/login">Get started</Button>
              )}
            </div>

            <button
              onClick={() => setOpen(true)}
              className="rounded-full p-2 hover:bg-black/5 md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </Container>
      </header>

      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}