import { Hero } from "@/components/marketing/hero";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Services } from "@/components/marketing/services";
import { WhyUs } from "@/components/marketing/why-us";
import { FAQ } from "@/components/marketing/faq";
import { CTA } from "@/components/marketing/cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Services />
      <WhyUs />
      <FAQ />
      <CTA />
    </>
  );
}
