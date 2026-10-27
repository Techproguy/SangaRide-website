import type { Metadata } from "next";
import { AboutHero, DirectionAndJoin, Principles, WhyWeExist } from "@/components/about/AboutSections";
import { PeopleGallery } from "@/components/about/PeopleGallery";

export const metadata: Metadata = {
  title: "About",
  description:
    "Sanga Ride is a mobility platform being built for people, communities and businesses — why we exist, the principles we build by and where we're going.",
};

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      {/* Same section rhythm as the homepage. */}
      <div className="flex flex-col gap-24 py-20 sm:gap-28 lg:gap-36 lg:py-28">
        <WhyWeExist />
        <Principles />
        <PeopleGallery />
        <DirectionAndJoin />
      </div>
    </main>
  );
}
