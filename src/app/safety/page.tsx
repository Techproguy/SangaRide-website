import type { Metadata } from "next";
import { MarketProvider } from "@/components/Market";
import { SafetyHero, SafetyPrivacy, SafetyResources } from "@/components/safety/SafetySections";
import { SafetyJourney, SafetyPeople, SafetyScenarios, PickupGuide } from "@/components/safety/SafetyGuides";

export const metadata: Metadata = {
  title: "Safety",
  description: "Learn about Sanga’s approach to pickup checks, trip safety, reporting concerns and privacy. Explore the safety guide before you travel.",
};

export default function SafetyPage() {
  return (
    <main>
      <MarketProvider>
        <SafetyHero />
        <SafetyJourney />
        <PickupGuide />
        <SafetyScenarios />
        <SafetyPeople />
        <SafetyPrivacy />
        <SafetyResources />
      </MarketProvider>
    </main>
  );
}
