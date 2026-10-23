import type { Metadata } from "next";
import { NotOpenYet } from "@/components/NotOpenYet";

export const metadata: Metadata = {
  title: "Contact Partnerships",
  description: "Talk to the Sanga Fleet partnerships team.",
  robots: { index: false },
};

// Placeholder for the partnerships lead form, which owns validation, consent and confirmation.
export default function FleetContactPage() {
  return (
    <NotOpenYet
      title="Partnership enquiries are opening soon."
      primary={{ label: "Explore the platform", href: "/fleet#platform" }}
      back={{ label: "Back to Fleet", href: "/fleet" }}
    >
      We&apos;re connecting our partnerships enquiry form. Until then, nothing you enter here would reach our team, so
      we&apos;ve left the form off.
    </NotOpenYet>
  );
}
