"use client";

import { ArrowRight, Car, ReceiptText, ShieldCheck, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { fleetApplyPath, fleetDemo } from "@/lib/fleet";
import { MarketLink, useMarket } from "../Market";

const highlights = [
  { icon: Car, label: "Vehicle management" },
  { icon: Users, label: "Driver relationships" },
  { icon: ReceiptText, label: "Earnings and settlements" },
  { icon: ShieldCheck, label: "Safety and accountability" },
];

/** 01: panoramic fleet photography with a compact, non-live operations overlay. */
export function FleetHero() {
  const { market } = useMarket();
  const s = fleetDemo[market].summary;
  const vehicleStates = [
    { label: "Eligible", value: s.eligible, cls: "bg-emerald-500" },
    { label: "Pending documents", value: s.pendingDocs, cls: "bg-amber-400" },
    { label: "Not eligible", value: s.notEligible, cls: "bg-slate-400" },
  ];

  return (
    <section aria-labelledby="fleet-hero-title" className="relative isolate overflow-hidden bg-white lg:bg-navy-950">
      <div className="container-page relative lg:static grid grid-cols-1 items-center gap-x-12 gap-y-10 pt-0 pb-10 lg:min-h-[620px] lg:grid-cols-[1fr_360px] lg:py-14">
        <div className="relative isolate -mx-4 px-4 pt-10 pb-8 text-white sm:-mx-6 sm:px-6 sm:py-12 lg:static lg:isolation-auto lg:mx-0 lg:max-w-xl lg:p-0">
          <div className="absolute inset-0 -z-10">
            <Image
              src="/images/fleet-hero.webp"
              alt="A fleet manager checking a tablet beside rows of parked cars"
              fill
              preload
              sizes="100vw"
              className="object-cover object-[45%_center] lg:object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/65 to-navy-950/25" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy-950/80 to-transparent" />
          </div>
          <p className="eyebrow text-white/80">Sanga Fleet</p>
          <h1 id="fleet-hero-title" className="heading-xl mt-4">
            Your vehicles.
            <br />
            Your drivers.
            <br />
            <span className="text-brand-400">A stronger operation.</span>
          </h1>
          <p className="mt-5 max-w-md text-[0.95rem] leading-relaxed text-white/90 sm:text-lg">
            Bring your eligible vehicles and drivers onto Sanga Ride and manage assignments, activity and settlement
            records from a connected workspace.
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
              href={fleetApplyPath}
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-brand-600 px-6 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Become a Fleet Partner <ArrowRight className="h-4 w-4" />
            </MarketLink>
            <Link
              href="#how-it-works"
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/50 px-6 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
            >
              See how it works
            </Link>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-white/15 bg-white p-5 text-ink shadow-panel lg:bg-white/95 lg:backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[0.95rem] font-bold">Fleet overview</p>
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[0.62rem] font-bold tracking-wide text-amber-900 uppercase">Demo data</span>
          </div>
          <p className="mt-0.5 text-[0.72rem] text-muted">Illustrative preview — not a live fleet.</p>

          <dl className="mt-4 grid grid-cols-3 gap-2">
            {[
              ["Vehicles", s.vehicles],
              ["Drivers", s.drivers],
              ["Assigned", s.assignments],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-surface p-3">
                <dt className="text-[0.68rem] text-muted">{k}</dt>
                <dd className="text-xl font-extrabold">{v}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-4 text-[0.75rem] font-bold">Vehicle eligibility</p>
          <div className="mt-2 flex h-2 overflow-hidden rounded-full" aria-hidden="true">
            {vehicleStates.map((v) => (
              <span key={v.label} className={v.cls} style={{ width: `${(v.value / s.vehicles) * 100}%` }} />
            ))}
          </div>
          <ul className="mt-3 space-y-1.5 text-[0.75rem]">
            {vehicleStates.map((v) => (
              <li key={v.label} className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${v.cls}`} aria-hidden="true" />
                  {v.label}
                </span>
                <span className="font-semibold">{v.value}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t border-slate-100 pt-3 text-[0.72rem] text-muted">
            Drivers: {s.accepted} accepted · {s.invited} invited
          </p>
        </div>
      </div>
    </section>
  );
}
