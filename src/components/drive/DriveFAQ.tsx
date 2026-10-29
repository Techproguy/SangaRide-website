import { ArrowRight, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { driveFaqs } from "@/lib/drive";
import { ApplyLink } from "./DriveMarket";

/** DR-07: a modest FAQ (native disclosure widgets) and the closing CTA. */
export function DriveFAQ() {
  return (
    <>
      <section aria-labelledby="faq-title">
        <div className="container-page grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,280px)_1fr] lg:gap-12">
          <div>
            <h2 id="faq-title" className="heading-lg">
              Driver questions
            </h2>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-muted">
              Can&apos;t find what you need?{" "}
              <Link href="/help" className="font-semibold text-brand-600 underline-offset-2 hover:underline">
                Visit Support
              </Link>
              .
            </p>
          </div>
          <ul className="divide-y divide-slate-100 border-y border-slate-100">
            {driveFaqs.map(({ q, a }) => (
              <li key={q}>
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[0.95rem] font-bold [&::-webkit-details-marker]:hidden">
                    {q}
                    <ChevronDown className="h-5 w-5 shrink-0 text-muted transition group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <p className="max-w-2xl pb-5 text-[0.9rem] leading-relaxed text-muted">{a}</p>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="drive-cta-title">
        <div className="container-page">
          <div className="relative isolate overflow-hidden rounded-[2rem] bg-navy-950">
            <Image src="/images/driver.webp" alt="" fill sizes="(min-width: 1280px) 1216px, 100vw" className="-z-10 object-cover object-[75%_center]" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950/95 via-navy-950/80 to-navy-950/30" />
            <div className="flex flex-col gap-6 px-6 py-12 text-white sm:px-10 lg:px-14 lg:py-16">
              <h2 id="drive-cta-title" className="heading-lg max-w-lg">
                Ready to drive with Sanga?
              </h2>
              <p className="max-w-md text-[0.95rem] text-white/80">
                Start your application and we&apos;ll show you what&apos;s needed where you are.
              </p>
              <div className="action-pair flex flex-wrap gap-3">
                <ApplyLink className="inline-flex h-12 items-center gap-2 rounded-xl bg-brand-600 px-6 text-sm font-semibold text-white transition hover:bg-brand-700">
                  Start application <ArrowRight className="h-4 w-4" />
                </ApplyLink>
                <Link
                  href="#requirements"
                  className="inline-flex h-12 items-center rounded-xl border border-white/50 px-6 text-sm font-semibold transition hover:border-white hover:bg-white/10"
                >
                  Check requirements
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
