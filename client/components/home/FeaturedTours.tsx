import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { featuredTours } from "@/lib/constants";

export default function FeaturedTours() {
  return (
    <section className="bg-neutral-50 py-20 sm:py-24">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Tours"
            title="Built for travelers who want more than a basic booking flow"
            text="Packages with a more polished feel, designed to help users move from interest to decision smoothly."
          />
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {featuredTours.map((tour, index) => (
            <Reveal key={tour.id} delay={index * 0.08}>
              <Link
                href={`/tours/${tour.slug}`}
                className="group flex overflow-hidden rounded-[1.75rem] border border-black/5 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="w-[42%] overflow-hidden">
                  <img
                    src={tour.image}
                    alt={tour.title}
                    className="h-full min-h-[220px] w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                      {tour.duration}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold leading-snug text-neutral-950">
                      {tour.title}
                    </h3>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-sm text-neutral-500">Starting from</span>
                    <span className="text-base font-semibold text-neutral-950">{tour.price}</span>
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