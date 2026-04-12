import { Hero } from "@/components/landing/hero";
import { TrustBar } from "@/components/landing/trust-bar";
import { Features } from "@/components/landing/features";
import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { HowItWorks } from "@/components/landing/how-it-works";
import { VoiceShowcase } from "@/components/landing/voice-showcase";
import { Stats } from "@/components/landing/stats";
import { ApiDemo } from "@/components/landing/api-demo";
import { Ecosystem } from "@/components/landing/ecosystem";
import { Pricing } from "@/components/landing/pricing";
import { Testimonials } from "@/components/landing/testimonials";
import { CtaSection } from "@/components/landing/cta-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <Features />
      <DashboardPreview />
      <HowItWorks />
      <VoiceShowcase />
      <Stats />
      <ApiDemo />
      <Ecosystem />
      <Pricing />
      <Testimonials />
      <CtaSection />
    </>
  );
}
