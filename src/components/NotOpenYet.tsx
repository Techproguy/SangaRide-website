import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { MarketNote } from "./MarketNote";

/**
 * Truthful stand-in for a flow that isn't connected yet (onboarding, lead intake), so CTAs never
 * land on a dead button or a fake success message.
 */
export function NotOpenYet({
  title,
  children,
  primary,
  back,
}: {
  title: string;
  children: ReactNode;
  primary: { label: string; href: string };
  back: { label: string; href: string };
}) {
  return (
    <main className="bg-gradient-to-b from-surface to-white">
      <div className="container-page flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
        <div className="w-full max-w-xl">
          <h1 className="heading-lg">{title}</h1>
          <p className="mx-auto mt-4 max-w-md text-[0.95rem] leading-relaxed text-muted">{children}</p>

          <Suspense>
            <MarketNote />
          </Suspense>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href={primary.href}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-600 px-6 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              {primary.label} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={back.href}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-200 px-6 text-sm font-semibold transition hover:border-ink"
            >
              <ArrowLeft className="h-4 w-4" /> {back.label}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
