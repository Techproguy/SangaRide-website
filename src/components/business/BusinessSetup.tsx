"use client";

import { ArrowRight, Check, FileText, Layers, ReceiptText, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { applicationStates, businessContactPath, businessDemo, businessRequirements, businessSetupSteps } from "@/lib/business";
import { countries } from "@/lib/content";
import { moneyFormatter } from "@/lib/format";
import { MarketLink, MarketToggle, useMarket } from "../Market";
import { StatusPill } from "../StatusPill";

const accountability = [
  { icon: Layers, title: "Cost centres", text: "Every ride is attributed to a team or cost centre you define." },
  { icon: ShieldCheck, title: "Policy exceptions", text: "See which rides needed approval, and who approved them." },
  { icon: FileText, title: "Trip records", text: "Route, time, ride and charges kept together for each trip." },
  { icon: ReceiptText, title: "Billing status", text: "Charges, adjustments and failed payments stay visible." },
];

/** B05: spending and accountability, shown as one trip record rather than another dashboard. */
export function Spending() {
  const { market } = useMarket();
  const demo = businessDemo[market];
  const money = moneyFormatter(demo.locale, demo.currency).format;
  const trip = demo.approvals[0];

  const record = [
    ["Traveller", trip.traveller],
    ["Booked by", `${demo.people[1].name} (Booking admin)`],
    ["Ride", `Sanga ${trip.ride} · Airport pickup`],
    ["Cost centre", trip.team],
    ["Policy", "Outside guest policy — approved"],
    ["Approved by", `${demo.people[2].name} (Approver)`],
  ];

  return (
    <section aria-labelledby="spending-title">
      <div className="container-page">
        <div className="grid grid-cols-1 items-center gap-10 rounded-[2rem] bg-surface p-7 sm:p-10 lg:grid-cols-[1fr_minmax(0,420px)] lg:gap-16 lg:p-14">
          <div>
            <p className="eyebrow text-brand-600">Spending and accountability</p>
            <h2 id="spending-title" className="heading-lg mt-3">
              Know where every ride went.
            </h2>
            <p className="mt-4 max-w-lg text-[0.95rem] leading-relaxed text-muted">
              Finance and admins see the records they&apos;re permitted to see. Billing options, invoicing and payment
              methods depend on your market and agreement.
            </p>
            <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {accountability.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-brand-600 shadow-card">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span>
                    <span className="block text-[0.95rem] font-bold">{title}</span>
                    <span className="mt-1 block text-[0.85rem] leading-relaxed text-muted">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[1.5rem] bg-white p-6 shadow-panel">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[0.95rem] font-bold">Trip record</p>
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[0.66rem] font-bold tracking-wide text-amber-900 uppercase">Demo</span>
            </div>
            <dl className="mt-4 space-y-2.5 text-[0.82rem]">
              {record.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <dt className="text-muted">{k}</dt>
                  <dd className="text-right font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
            <dl className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-[0.82rem]">
              <div className="flex justify-between">
                <dt className="text-muted">Fare</dt>
                <dd className="font-semibold tabular-nums">{money(trip.cost)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Airport toll (adjustment)</dt>
                <dd className="font-semibold tabular-nums">{money(demo.tollAdjustment)}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 pt-2 font-bold">
                <dt>Charged to organisation</dt>
                <dd className="tabular-nums">{money(trip.cost + demo.tollAdjustment)}</dd>
              </div>
            </dl>
            <div className="mt-4 flex items-center justify-between rounded-xl bg-surface px-3 py-2.5 text-[0.78rem]">
              <span className="text-muted">Billing status</span>
              <StatusPill status="Charged" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** B06: market-aware set-up steps, review states and requirement categories. */
export function BusinessSetup() {
  const { market } = useMarket();
  return (
    <section id="get-started" aria-labelledby="setup-title" className="scroll-mt-24">
      <div className="container-page">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div>
            <p className="eyebrow text-brand-600">Getting started</p>
            <h2 id="setup-title" className="heading-lg mt-3">
              Setting up your organisation.
            </h2>
          </div>
          <p className="max-w-md text-[0.95rem] leading-relaxed text-muted">
            Every organisation is verified before it goes live, so activation takes a few steps — it isn&apos;t instant.
          </p>
        </div>

        <ol className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {businessSetupSteps.map((s, i) => (
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

        <div className="mt-5 grid grid-cols-1 gap-8 rounded-[2rem] border border-slate-100 p-7 shadow-card sm:p-10 lg:grid-cols-[1fr_1fr_300px] lg:gap-12">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-extrabold tracking-[-0.02em]">What you&apos;ll need</h3>
              <MarketToggle label="Requirements for" />
            </div>
            <ul className="mt-4 space-y-2.5">
              {businessRequirements[market].map((item) => (
                <li key={item} className="flex items-start gap-2 text-[0.88rem]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[0.75rem] leading-relaxed text-muted">
              The exact checks for {countries[market].name} are confirmed during set-up.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-extrabold tracking-[-0.02em]">Application status</h3>
            <p className="mt-2 text-[0.85rem] leading-relaxed text-muted">You&apos;ll always see where your application is:</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {applicationStates.map((s) => (
                <li key={s} className="rounded-full border border-slate-200 px-3 py-1 text-[0.78rem] font-semibold">
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col justify-center gap-4 rounded-[1.5rem] bg-brand-50 p-6">
            <p className="text-[0.95rem] font-bold">Ready to start?</p>
            <MarketLink
              href={businessContactPath}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Talk to Sales <ArrowRight className="h-4 w-4" />
            </MarketLink>
          </div>
        </div>
      </div>
    </section>
  );
}

/** B07: closing conversion. */
export function BusinessCTA() {
  return (
    <section aria-labelledby="business-cta-title">
      <div className="container-page">
        <div className="flex flex-col gap-8 rounded-[2rem] bg-navy-950 px-6 py-12 text-white sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-14 lg:py-14">
          <div>
            <h2 id="business-cta-title" className="heading-lg max-w-xl">
              Ready to move your business forward?
            </h2>
            <p className="mt-3 max-w-md text-[0.95rem] text-white/75">
              Talk to our team about how your organisation moves, and what&apos;s available in your market.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <MarketLink
              href={businessContactPath}
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-brand-600 px-6 text-sm font-semibold transition hover:bg-brand-700"
            >
              Talk to Sales <ArrowRight className="h-4 w-4" />
            </MarketLink>
            <Link
              href="#platform"
              className="inline-flex h-12 items-center rounded-xl border border-white/40 px-6 text-sm font-semibold transition hover:border-white hover:bg-white/10"
            >
              Explore the platform
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
