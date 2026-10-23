import { ArrowRight, Check, Info } from "lucide-react";
import Image from "next/image";
import { fleetApplyPath, fleetContactPath, fleetSteps, operators } from "@/lib/fleet";
import { MarketLink, MarketToggle } from "../Market";

/** 03: application to active operations. */
export function FleetSteps() {
  return (
    <section id="how-it-works" aria-labelledby="fleet-steps-title" className="scroll-mt-24">
      <div className="container-page">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div>
            <p className="eyebrow text-brand-600">From vehicle to active fleet</p>
            <h2 id="fleet-steps-title" className="heading-lg mt-3">
              A simple, transparent journey.
            </h2>
          </div>
          <p className="max-w-md text-[0.95rem] leading-relaxed text-muted">
            Every application, vehicle and driver is reviewed, so going live takes a few steps — it isn&apos;t instant or
            guaranteed.
          </p>
        </div>

        <ol className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {fleetSteps.map((s, i) => (
            <li key={s.title} className="flex gap-3.5 rounded-[1.5rem] bg-surface p-5 lg:flex-col">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-brand-600 text-[0.85rem] font-bold text-brand-600">
                {i + 1}
              </span>
              <div>
                <h3 className="text-[0.95rem] font-bold">{s.title}</h3>
                <p className="mt-1 text-[0.82rem] leading-relaxed text-muted">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** 05: operator fit — only approved operator types; no bus or coach promises. */
export function OperatorFit() {
  return (
    <section aria-labelledby="operators-title">
      <div className="container-page grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,300px)_1fr] lg:gap-12">
        <div>
          <p className="eyebrow text-brand-600">Built for different operators</p>
          <h2 id="operators-title" className="heading-lg mt-3">
            Flexibility for your operation.
          </h2>
          <p className="mt-4 text-[0.95rem] leading-relaxed text-muted">
            Whether you own one car or run a fleet company, Sanga Fleet adapts to how you&apos;re set up.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_0.8fr]">
          {operators.map((o) => (
            <article key={o.title} className="overflow-hidden rounded-[1.75rem] border border-slate-100 bg-white shadow-card">
              <div className="relative h-44">
                <Image src={o.image} alt={o.alt} fill sizes="(min-width: 1280px) 340px, (min-width: 768px) 50vw, 100vw" className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold">{o.title}</h3>
                <ul className="mt-3 space-y-2">
                  {o.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-[0.85rem] text-muted">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
          <article className="flex flex-col justify-between gap-6 rounded-[1.75rem] bg-surface p-6 md:col-span-2 xl:col-span-1">
            <div>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-600 shadow-card">
                <Info className="h-[18px] w-[18px]" />
              </span>
              <h3 className="mt-4 text-lg font-bold">Other transport operators</h3>
              <p className="mt-2 text-[0.85rem] leading-relaxed text-muted">
                Other vehicle and service types are only supported where they&apos;ve been approved. Check eligibility in
                your market before applying.
              </p>
            </div>
            <MarketLink href={fleetContactPath} className="inline-flex items-center gap-1.5 text-[0.85rem] font-semibold text-brand-600 hover:underline">
              Contact Partnerships <ArrowRight className="h-4 w-4" />
            </MarketLink>
          </article>
        </div>
      </div>
    </section>
  );
}

/** 06: partnership conversion with an eligibility reminder. */
export function FleetCTA() {
  return (
    <section aria-labelledby="fleet-cta-title">
      <div className="container-page">
        <div className="flex flex-col gap-8 rounded-[2rem] bg-navy-950 px-6 py-12 text-white sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-14 lg:py-14">
          <div>
            <h2 id="fleet-cta-title" className="heading-lg max-w-xl">
              Ready to grow your operation?
            </h2>
            <p className="mt-3 max-w-md text-[0.95rem] text-white/75">
              Vehicles, drivers and operator types must be eligible in your market. Choose where you operate to start.
            </p>
            <div className="mt-5">
              <MarketToggle label="Your market" tone="dark" />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <MarketLink
              href={fleetApplyPath}
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-brand-600 px-6 text-sm font-semibold transition hover:bg-brand-700"
            >
              Become a Fleet Partner <ArrowRight className="h-4 w-4" />
            </MarketLink>
            <MarketLink
              href={fleetContactPath}
              className="inline-flex h-12 items-center rounded-xl border border-white/40 px-6 text-sm font-semibold transition hover:border-white hover:bg-white/10"
            >
              Contact Partnerships
            </MarketLink>
          </div>
        </div>
      </div>
    </section>
  );
}
