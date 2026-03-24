import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import FeaturedDestinations from "@/components/home/FeaturedDestinations";
import FeaturedTours from "@/components/home/FeaturedTours";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Newsletter from "@/components/home/Newsletter";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeaturedDestinations />
        <FeaturedTours />
        <WhyChooseUs />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}