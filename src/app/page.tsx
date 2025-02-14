import { Header } from "@/sections/Header";
import Hero from "@/sections/Hero";
import { Testimonials } from "@/sections/Testimonials";
import { CallToAction } from "@/sections/CallToAction";
import { Footer } from "@/sections/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Testimonials />
      <CallToAction />
      <Footer />
    </>
  );
}
