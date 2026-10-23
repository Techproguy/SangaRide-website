import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BookingIntentSummary } from "@/components/BookingIntentSummary";

export const metadata: Metadata = {
  title: "Book a ride",
  description: "Book a Sanga ride.",
  robots: { index: false },
};

// Placeholder for the Rider Web booking app, which owns quotes, sign-in, payment and trip creation.
export default function BookPage() {
  return (
    <main className="bg-gradient-to-b from-surface to-white">
      <div className="container-page flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
        <div className="w-full max-w-xl">
          <h1 className="heading-lg">Online booking is coming soon.</h1>
          <p className="mx-auto mt-4 max-w-md text-[0.95rem] leading-relaxed text-muted">
            We&apos;re getting Sanga Ride ready on the web. When it launches, you&apos;ll see available rides and fares for
            your route here.
          </p>

          <Suspense>
            <BookingIntentSummary />
          </Suspense>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/ride"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-600 px-6 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Explore ride options <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-200 px-6 text-sm font-semibold transition hover:border-ink"
            >
              <ArrowLeft className="h-4 w-4" /> Back to home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
