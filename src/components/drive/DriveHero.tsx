import { ArrowDown, ArrowRight, ClipboardList, Clock, ReceiptText, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ApplyLink } from "./DriveMarket";
import { EarningsCalculator } from "./EarningsCalculator";

// No driver counts, avatars or quotes here until they can be substantiated (spec DR-01).
const highlights = [
  { icon: ReceiptText, label: "Transparent earnings info" },
  { icon: Clock, label: "Flexible work on your terms" },
  { icon: ShieldCheck, label: "Safety tools on every trip" },
  { icon: ClipboardList, label: "Requirements by market" },
];

/** DR-01 hero, with the DR-02 calculator beside it on desktop and below it on mobile. */
export function DriveHero() {
  return (
    <div className="relative overflow-hidden bg-white lg:bg-navy-950">
      <div className="absolute inset-x-0 top-0 h-[460px] sm:h-[500px] lg:h-full">
        <Image
          src="/images/drive-hero.webp"
          alt="A smiling driver behind the wheel of his car"
          fill
          preload
          sizes="100vw"
          className="object-cover object-[62%_center] lg:object-[center_30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/85 via-navy-950/40 to-transparent lg:from-navy-950/95 lg:via-navy-950/55 lg:to-navy-950/40" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy-950/70 to-transparent" />
      </div>

      <div className="container-page relative grid grid-cols-1 items-center gap-x-12 gap-y-8 pt-12 pb-10 lg:min-h-[640px] lg:grid-cols-[1fr_410px] lg:py-14">
        <section aria-labelledby="drive-hero-title" className="min-h-[400px] max-w-xl text-white sm:min-h-[440px] lg:min-h-0">
          <p className="eyebrow text-white/80">Drive with Sanga</p>
          <h1 id="drive-hero-title" className="heading-xl mt-4">
            Your drive.
            <br />
            Your <span className="text-brand-400">livelihood.</span>
            <br />
            Your future.
          </h1>
          <p className="mt-5 max-w-md text-[0.95rem] leading-relaxed text-white/90 sm:text-lg">
            More than trips. Explore the tools, information and opportunities designed to support your work on the
            road.
          </p>

          <ul className="mt-8 hidden grid-cols-4 gap-4 text-[0.75rem] leading-snug font-medium lg:grid">
            {highlights.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-start gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                {label}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <ApplyLink className="inline-flex h-12 items-center gap-2 rounded-xl bg-brand-600 px-6 text-sm font-semibold text-white transition hover:bg-brand-700">
              Apply to drive <ArrowRight className="h-4 w-4" />
            </ApplyLink>
            <Link
              href="#requirements"
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/50 px-6 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
            >
              See requirements <ArrowDown className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <EarningsCalculator />
      </div>
    </div>
  );
}
