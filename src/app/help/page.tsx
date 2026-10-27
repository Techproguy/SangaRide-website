import type { Metadata } from "next";
import { GuidedHelpAndRequests, HelpHero, MoreHelp, PopularTopics, SupportAreas } from "@/components/help/HelpSections";

export const metadata: Metadata = {
  title: "Help Center",
  description:
    "Find answers, manage an issue or get directed to the right Sanga Ride support channel for riders, drivers, businesses and fleet partners.",
};

export default function HelpPage() {
  return (
    <main>
      <HelpHero />
      <div className="flex flex-col gap-20 py-16 sm:gap-24 lg:gap-28 lg:py-20">
        <SupportAreas />
        <PopularTopics />
        <GuidedHelpAndRequests />
        <MoreHelp />
      </div>
    </main>
  );
}
