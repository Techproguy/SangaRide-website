import type { Metadata } from "next";
import { NotOpenYet } from "@/components/NotOpenYet";

export const metadata: Metadata = {
  title: "Become a Fleet Partner",
  description: "Apply to bring your vehicles and drivers to Sanga Ride.",
  robots: { index: false },
};

// Placeholder for the fleet partner application, which owns identity, documents and review states.
export default function FleetApplyPage() {
  return (
    <NotOpenYet
      title="Fleet applications aren't open online yet."
      primary={{ label: "See how it works", href: "/fleet#how-it-works" }}
      back={{ label: "Back to Fleet", href: "/fleet" }}
    >
      We&apos;re getting the fleet partner application ready. When it opens, you&apos;ll be able to choose your market,
      tell us about your vehicles and start verification here.
    </NotOpenYet>
  );
}
