import { LandingHero } from "@/components/landing/hero";
import { LandingFeatures } from "@/components/landing/features";
import { LandingPricing } from "@/components/landing/pricing";
import { LandingFooter } from "@/components/landing/footer";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <LandingHero />
      <LandingFeatures />
      <LandingPricing />
      <LandingFooter />
    </main>
  );
}
