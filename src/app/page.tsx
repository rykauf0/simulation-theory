import { Hero } from "@/components/sections/hero";
import { Capabilities } from "@/components/sections/capabilities";
import { Process } from "@/components/sections/process";
import { SelectedWork } from "@/components/sections/selected-work";
import { CTA } from "@/components/sections/cta";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Capabilities />
      <Process />
      <SelectedWork />
      <CTA />
    </main>
  );
}
