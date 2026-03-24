import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { featuredDestinations } from "@/lib/constants";

export default function FeaturedDestinations() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Destinations"
            title="Places that deserve more than a quick scroll"
            text="A selection of standout locations presented with a cleaner, more premium travel feel."
          />
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredDestinations.slice(0, 3).map((item, index) => (
            <Reveal key={item.id} delay={index * 0.08}>
              <Link
                href={`/destinations/${item.slug}`}
                className="group block overflow-hidden rounded-[1.75rem] border border-black/5 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-72 w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="space-y-3 p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                      {item.category}
                    </span>
                    <span className="text-sm font-medium text-neutral-900">{item.price}</span>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-neutral-950">{item.name}</h3>
                    <p className="mt-1 text-sm text-neutral-600">{item.location}</p>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}