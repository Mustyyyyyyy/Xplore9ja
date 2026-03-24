import Link from "next/link";
import Container from "@/components/ui/Container";
import { siteConfig } from "@/config/site";

export default function Footer() {
  return (
    <footer className="border-t border-black/5 bg-white py-14">
      <Container>
        <div className="grid gap-10 md:grid-cols-3">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">{siteConfig.name}</h3>
            <p className="max-w-sm text-sm leading-6 text-neutral-600">
              Discover destinations, tours, and memorable experiences across Nigeria in a modern, premium way.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-neutral-500">
              Explore
            </h4>
            <div className="flex flex-col gap-2 text-sm text-neutral-700">
              {siteConfig.navLinks.map((item) => (
                <Link key={item.href} href={item.href} className="hover:text-neutral-950">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-neutral-500">
              Connect
            </h4>
            <div className="flex flex-col gap-2 text-sm text-neutral-700">
              {siteConfig.socials.map((item) => (
                <Link key={item.label} href={item.href} className="hover:text-neutral-950">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-black/5 pt-6 text-sm text-neutral-500">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}