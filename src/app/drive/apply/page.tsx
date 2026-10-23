import type { Metadata } from "next";
import { NotOpenYet } from "@/components/NotOpenYet";

export const metadata: Metadata = {
  title: "Apply to drive",
  description: "Start your Sanga driver application.",
  robots: { index: false },
};

// Placeholder for the Driver onboarding application, which owns sign-in, documents and verification.
// /drive passes ?market= so onboarding can pick it up once the route is confirmed.
export default function DriveApplyPage() {
  return (
    <NotOpenYet
      title="Driver applications aren't open online yet."
      primary={{ label: "Check requirements", href: "/drive#requirements" }}
      back={{ label: "Back to Drive", href: "/drive" }}
    >
      We&apos;re getting driver onboarding ready. When it opens, you&apos;ll be able to create your account and submit
      your details here.
    </NotOpenYet>
  );
}
