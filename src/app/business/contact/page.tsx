import type { Metadata } from "next";
import { NotOpenYet } from "@/components/NotOpenYet";

export const metadata: Metadata = {
  title: "Talk to Sales",
  description: "Talk to the Sanga for Business team.",
  robots: { index: false },
};

// Placeholder for the approved CRM/lead intake, which owns validation, consent and confirmation.
export default function BusinessContactPage() {
  return (
    <NotOpenYet
      title="Online sales enquiries are opening soon."
      primary={{ label: "Explore the platform", href: "/business#platform" }}
      back={{ label: "Back to Business", href: "/business" }}
    >
      We&apos;re connecting our business enquiry form. Until then, nothing you enter here would reach our team, so
      we&apos;ve left the form off.
    </NotOpenYet>
  );
}
