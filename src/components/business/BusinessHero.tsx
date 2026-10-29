import { ArrowRight, BarChart3, ClipboardCheck, MapPin, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { businessContactPath } from "@/lib/business";
import { MarketLink } from "../Market";
import { BusinessConsole } from "./BusinessConsole";

// No customer counts, on-time rates or coverage claims until approved (spec B01).
const highlights = [
  { icon: Users, label: "Employee and guest travel" },
  { icon: ClipboardCheck, label: "Policy and approval controls" },
  { icon: BarChart3, label: "Spending visibility and reporting" },
  { icon: MapPin, label: "Nigeria and US, where available" },
];

/** B01: editorial hero with the interactive demo console as its focal point. */
export function BusinessHero() {
  return (
    <section aria-labelledby="business-hero-title" className="relative isolate overflow-hidden bg-white lg:bg-navy-950">
      <div className="container-page relative lg:static grid grid-cols-1 items-center gap-x-10 gap-y-10 pt-0 pb-10 lg:min-h-[640px] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:py-14">
        <div className="relative isolate -mx-4 px-4 pt-10 pb-8 text-white sm:-mx-6 sm:px-6 sm:py-12 lg:static lg:isolation-auto lg:mx-0 lg:max-w-xl lg:p-0">
          <div className="absolute inset-0 -z-10 lg:right-auto lg:w-[62%] lg:[mask-image:linear-gradient(to_right,black_60%,transparent)]">
            <Image
              src="/images/business-hero.webp"
              alt="A businesswoman working on a laptop in a high-rise office"
              fill
              preload
              sizes="(min-width: 1024px) 62vw, 100vw"
              className="object-cover object-[75%_center]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/70 to-navy-950/20" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy-950/80 to-transparent" />
          </div>
          <p className="eyebrow text-white/80">Sanga for Business</p>
          <h1 id="business-hero-title" className="heading-xl mt-4">
            Your people move.
            <br />
            Your <span className="text-brand-400">business</span>
            <br />
            moves forward.
          </h1>
          <p className="mt-5 max-w-md text-[0.95rem] leading-relaxed text-white/90 sm:text-lg">
            One place to arrange employee and guest rides, manage travel permissions, oversee spending and bring greater
            visibility to business mobility.
          </p>

          <ul className="mt-7 grid grid-cols-2 gap-x-4 gap-y-3 text-[0.78rem] leading-snug font-medium sm:max-w-md">
            {highlights.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                {label}
              </li>
            ))}
          </ul>

          <div className="action-pair mt-8 flex flex-wrap gap-3">
            <MarketLink
              href={businessContactPath}
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-brand-600 px-6 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Talk to Sales <ArrowRight className="h-4 w-4" />
            </MarketLink>
            <Link
              href="#platform"
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/50 px-6 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
            >
              Explore the platform
            </Link>
          </div>
        </div>

        <BusinessConsole />
      </div>
    </section>
  );
}
