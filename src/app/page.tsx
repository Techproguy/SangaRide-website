import { Hero } from "@/components/Hero";
import { JourneyStoryRail } from "@/components/JourneyStoryRail";
import { OpportunitySplit } from "@/components/OpportunitySplit";
import { RideDiscoveryShowcase } from "@/components/RideDiscoveryShowcase";
import { SangaExperience } from "@/components/SangaExperience";
import { TrustNextSteps } from "@/components/TrustNextSteps";

export default function Home() {
  return (
    <main>
        <Hero />
        {/* One shared rhythm between sections so the page reads as a single story. */}
        <div className="flex flex-col gap-24 py-20 sm:gap-28 lg:gap-36 lg:py-28">
          <SangaExperience />
          <RideDiscoveryShowcase />
          <JourneyStoryRail />
          <OpportunitySplit />
          <TrustNextSteps />
        </div>
    </main>
  );
}
