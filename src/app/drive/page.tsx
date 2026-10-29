import type { Metadata } from "next";
import { DriveFAQ } from "@/components/drive/DriveFAQ";
import { DriveHero } from "@/components/drive/DriveHero";
import { MarketProvider } from "@/components/Market";
import { DriveOnYourTerms } from "@/components/drive/DriveOnYourTerms";
import { DriveProtection } from "@/components/drive/DriveProtection";
import { GettingStarted } from "@/components/drive/GettingStarted";
import { RequestToPayout } from "@/components/drive/RequestToPayout";

export const metadata: Metadata = {
  title: "Drive with Sanga",
  description:
    "Understand the work, the numbers, safety tools and requirements for driving with Sanga, then start your driver application.",
};

export default function DrivePage() {
  return (
    <main>
      <MarketProvider>
        <DriveHero />
        <div className="flex flex-col gap-14 py-12 sm:gap-28 sm:py-20 lg:gap-32 lg:py-28">
          <RequestToPayout />
          <DriveOnYourTerms />
          <DriveProtection />
          <GettingStarted />
          <DriveFAQ />
        </div>
      </MarketProvider>
    </main>
  );
}
