import type { Metadata } from "next";
import { BusinessHero } from "@/components/business/BusinessHero";
import { Reconciliation, UseCases } from "@/components/business/BusinessJourney";
import { BusinessCTA, BusinessSetup, Spending } from "@/components/business/BusinessSetup";
import { PolicyControl } from "@/components/business/PolicyControl";
import { MarketProvider } from "@/components/Market";

export const metadata: Metadata = {
  title: "Sanga for Business",
  description:
    "Arrange employee and guest rides, set travel policies and approvals, and see business travel spending in one place with Sanga for Business.",
};

export default function BusinessPage() {
  return (
    <main>
      <MarketProvider>
        <BusinessHero />
        <div className="flex flex-col gap-24 py-20 sm:gap-28 lg:gap-32 lg:py-28">
          <PolicyControl />
          <Reconciliation />
          <UseCases />
          <Spending />
          <BusinessSetup />
          <BusinessCTA />
        </div>
      </MarketProvider>
    </main>
  );
}
