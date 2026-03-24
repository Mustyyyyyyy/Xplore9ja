import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

export default function AboutPage() {
  return (
    <main className="pb-20 pt-10 sm:pb-24">
      <Container>
        <div className="max-w-3xl space-y-8">
          <SectionHeading
            eyebrow="About Xplore9ja"
            title="A modern way to discover and experience Nigeria"
            text="Xplore9ja is designed to make local travel feel more premium, more trustworthy, and more exciting."
          />

          <div className="space-y-5 text-base leading-8 text-neutral-600">
            <p>
              We want travel discovery in Nigeria to feel polished, smooth, and
              inspiring. From standout destinations to carefully presented tour
              packages, every part of the experience is designed to feel modern.
            </p>
            <p>
              The goal is simple: make travel planning cleaner, more beautiful,
              and easier for users who want something beyond basic listings.
            </p>
          </div>
        </div>
      </Container>
    </main>
  );
}