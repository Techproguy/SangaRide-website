import type { Metadata } from "next";
import { FleetHero } from "@/components/fleet/FleetHero";
import { FleetPreview } from "@/components/fleet/FleetPreview";
import { FleetCTA, FleetSteps, OperatorFit } from "@/components/fleet/FleetSections";
import { SettlementDemo } from "@/components/fleet/SettlementDemo";
import { MarketProvider } from "@/components/Market";

export const metadata: Metadata = {
  title: "Sanga Fleet",
  description:
    "Bring your eligible vehicles and drivers onto Sanga Ride and manage assignments, trip activity and settlement records in one workspace.",
};

export default function FleetPage() {
  return (
    <main>
      <MarketProvider>
        <FleetHero />
        <div className="flex flex-col gap-24 py-20 sm:gap-28 lg:gap-32 lg:py-28">
          <FleetPreview />
          <FleetSteps />
          <SettlementDemo />
          <OperatorFit />
          <FleetCTA />
        </div>
      </MarketProvider>
    </main>
  );
}
