import Reveal from "@/components/ui/Reveal";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { whyChooseUs } from "@/lib/constants";

export default function WhyChooseUs() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Why Xplore9ja"
            title="Simple choices, polished experience"
            text="The product is shaped to feel modern and premium while still being practical for everyday users."
          />
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {whyChooseUs.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.08}>
              <div className="rounded-[1.75rem] border border-black/5 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-neutral-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-neutral-600">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}