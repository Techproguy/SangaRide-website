"use client";

import { ArrowRight, CircleCheck, CircleX, Clock } from "lucide-react";
import Link from "next/link";
import { useId, useState } from "react";
import { businessDemo, policyExample, roles } from "@/lib/business";
import { moneyFormatter } from "@/lib/format";
import { MarketToggle, useMarket } from "../Market";
import { Select } from "../Select";

const rideClasses = ["Go", "Plus", "XL", "Lux"] as const;
type RideClass = (typeof rideClasses)[number];

/** B02: roles on the left, a local policy-decision simulator on the right. Nothing is saved. */
export function PolicyControl() {
  const { market } = useMarket();
  return (
    <section id="control" aria-labelledby="control-title" className="scroll-mt-24">
      <div className="container-page grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-14">
        <div>
          <p className="eyebrow text-brand-600">People · Policies · Approvals</p>
          <h2 id="control-title" className="heading-lg mt-3">
            Control how your organisation moves.
          </h2>
          <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-muted">
            Set up your organisation, decide who can book what, and route the exceptions to the right approver. Every
            permission is enforced by Sanga, not just hidden in the interface.
          </p>
          <ul className="mt-8 space-y-4">
            {roles.map((r) => (
              <li key={r.title} className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500" aria-hidden="true" />
                <span>
                  <span className="block text-[0.92rem] font-bold">{r.title}</span>
                  <span className="block text-[0.85rem] leading-relaxed text-muted">{r.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <PolicySimulator key={market} />
      </div>
    </section>
  );
}

function PolicySimulator() {
  const id = useId();
  const { market } = useMarket();
  const example = policyExample[market];
  const { locale, currency } = businessDemo[market];
  const money = moneyFormatter(locale, currency).format;

  const [allowed, setAllowed] = useState<Record<RideClass, boolean>>({ Go: true, Plus: true, XL: true, Lux: false });
  const [limit, setLimit] = useState(example.limit);
  const [traveller, setTraveller] = useState<"Employee" | "Guest">("Employee");
  const [ride, setRide] = useState<RideClass>("Plus");
  const fare = example.fares[ride];

  const guestBlocked = traveller === "Guest" && (ride === "XL" || ride === "Lux");
  const outcome = !allowed[ride]
    ? { kind: "denied" as const, text: `${ride} isn't allowed by this policy.` }
    : guestBlocked
      ? { kind: "approval" as const, text: `Guests are limited to Go and Plus, so ${ride} needs an approver.` }
      : fare > limit
        ? { kind: "approval" as const, text: `The estimated ${money(fare)} is above the ${money(limit)} per-trip limit.` }
        : { kind: "allowed" as const, text: "Within policy, so it can be booked straight away." };

  const look = {
    allowed: { Icon: CircleCheck, label: "Can be booked", cls: "bg-emerald-50 text-emerald-800" },
    approval: { Icon: Clock, label: "Needs approval", cls: "bg-amber-50 text-amber-900" },
    denied: { Icon: CircleX, label: "Not allowed", cls: "bg-red-50 text-red-800" },
  }[outcome.kind];

  return (
    <div className="rounded-[2rem] bg-surface p-5 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[1.05rem] font-extrabold tracking-[-0.01em]">Try a travel policy</p>
        <MarketToggle label="Example market" />
      </div>
      <p className="mt-1 text-[0.8rem] text-muted">Demo settings — change them to see the example outcome. Nothing is saved.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <fieldset className="rounded-2xl bg-white p-4 shadow-card">
          <legend className="sr-only">Policy</legend>
          <p className="text-[0.75rem] font-bold tracking-wide text-muted uppercase">Policy</p>
          <p className="mt-3 text-[0.8rem] font-semibold">Allowed rides</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {rideClasses.map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={allowed[c]}
                onClick={() => setAllowed((a) => ({ ...a, [c]: !a[c] }))}
                className={`rounded-full border px-3 py-1 text-[0.75rem] font-semibold transition ${
                  allowed[c] ? "border-brand-600 bg-brand-600 text-white" : "border-slate-200 text-muted hover:border-ink"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <label htmlFor={`${id}-limit`} className="mt-4 block text-[0.8rem] font-semibold">
            Per-trip limit before approval ({currency})
          </label>
          <input
            id={`${id}-limit`}
            type="number"
            inputMode="numeric"
            min={0}
            step={example.step}
            value={limit}
            onChange={(e) => setLimit(Number.isFinite(e.target.valueAsNumber) ? Math.max(0, e.target.valueAsNumber) : 0)}
            className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 px-3 text-[0.85rem] font-semibold tabular-nums focus:border-brand-500 focus:outline-none"
          />
          <p className="mt-3 text-[0.72rem] text-muted">Guests: Go and Plus only.</p>
        </fieldset>

        <fieldset className="rounded-2xl bg-white p-4 shadow-card">
          <legend className="sr-only">Example request</legend>
          <p className="text-[0.75rem] font-bold tracking-wide text-muted uppercase">Example request</p>
          <p className="mt-3 text-[0.8rem] font-semibold">Who&apos;s travelling</p>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            {(["Employee", "Guest"] as const).map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={traveller === t}
                onClick={() => setTraveller(t)}
                className={`rounded-lg border py-1.5 text-[0.78rem] font-semibold transition ${
                  traveller === t ? "border-brand-600 bg-brand-50 text-brand-700" : "border-slate-200 text-muted hover:border-ink"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <label htmlFor={`${id}-ride`} className="mt-4 block text-[0.8rem] font-semibold">
            Ride requested
          </label>
          <div className="mt-1.5">
            <Select
              id={`${id}-ride`}
              value={ride}
              onChange={(v) => setRide(v as RideClass)}
              options={rideClasses.map((c) => ({ value: c, label: `Sanga ${c} — est. ${money(example.fares[c])}` }))}
              className="flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 text-left text-[0.85rem] font-semibold transition hover:border-slate-300 aria-expanded:border-brand-500"
            />
          </div>
          <p className="mt-3 text-[0.72rem] text-muted">Example fares, not quotes.</p>
        </fieldset>
      </div>

      <div className={`mt-4 flex items-start gap-3 rounded-2xl p-4 ${look.cls}`} aria-live="polite" aria-atomic="true">
        <look.Icon className="mt-0.5 h-5 w-5 shrink-0" />
        <p className="text-[0.85rem]">
          <span className="block font-bold">{look.label}</span>
          {outcome.text}
        </p>
      </div>

      <Link href="#platform" className="mt-5 inline-flex items-center gap-1.5 text-[0.82rem] font-semibold text-brand-600 hover:underline">
        See approvals in the demo console <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
