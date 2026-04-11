import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Ecosystem } from "@/components/landing/ecosystem";
import { Pricing } from "@/components/landing/pricing";
import { CtaSection } from "@/components/landing/cta-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <Ecosystem />
      <Pricing />
      <CtaSection />
    </>
  );
}
