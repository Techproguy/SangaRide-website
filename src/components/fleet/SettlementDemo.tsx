"use client";

import { RotateCcw } from "lucide-react";
import { useId, useState } from "react";
import { countries, type CountryCode } from "@/lib/content";
import { allocate, settlementExamples, type SettlementExample } from "@/lib/fleet";
import { moneyFormatter } from "@/lib/format";
import { MarketToggle, useMarket } from "../Market";
import { SliderField } from "../SliderField";

/**
 * 04: educational allocation waterfall — platform commission first, then the fleet/driver split.
 * Final obligations always come from the ledger, never from this calculation.
 */
export function SettlementDemo() {
  const { market, setMarket } = useMarket();
  const example = settlementExamples[market];

  return (
    <section id="settlements" aria-labelledby="settlement-title" className="scroll-mt-24">
      <div className="container-page">
        <div className="grid grid-cols-1 gap-10 rounded-[2rem] bg-surface p-7 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-14 lg:p-14">
          <div>
            <p className="eyebrow text-brand-600">Settlement transparency</p>
            <h2 id="settlement-title" className="heading-lg mt-3">
              See how a trip&apos;s fare is allocated.
            </h2>
            <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-muted">
              Sanga&apos;s platform commission comes off first. What&apos;s left is split between the fleet and the
              driver under the terms that applied to that trip.
            </p>
            <dl className="mt-8 space-y-4 text-[0.88rem]">
              {[
                ["Gross trip value", "The fare and any adjustments for a completed trip."],
                ["Allocation", "How that value is divided between Sanga, the fleet and the driver."],
                ["Payout", "What's actually paid, after cash collected, adjustments and disputes — on your agreed schedule."],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="font-bold">{k}</dt>
                  <dd className="mt-0.5 leading-relaxed text-muted">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-[0.8rem] leading-relaxed text-muted">
              Changes to a fleet/driver split only apply to future trips, and every change is recorded.
            </p>
          </div>

          <div className="rounded-[1.5rem] bg-white p-5 shadow-panel sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[1.05rem] font-extrabold tracking-[-0.01em]">Illustrative settlement breakdown</p>
              <MarketToggle label="Example market" />
            </div>
            {example ? (
              <Breakdown key={market} market={market} example={example} />
            ) : (
              <div role="status" className="mt-6 rounded-2xl bg-surface p-6 text-center">
                <p className="text-[0.95rem] font-bold">A {countries[market].name} example isn&apos;t available yet.</p>
                <p className="mx-auto mt-1.5 max-w-xs text-[0.82rem] leading-relaxed text-muted">
                  We don&apos;t convert another market&apos;s figures. Check eligibility and terms in your market.
                </p>
                <button
                  type="button"
                  onClick={() => setMarket("NG")}
                  className="mt-4 inline-flex h-10 items-center rounded-full border border-slate-200 bg-white px-5 text-[0.82rem] font-semibold transition hover:border-ink"
                >
                  View the Nigeria example
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Breakdown({ market, example }: { market: CountryCode; example: SettlementExample }) {
  const id = useId();
  const initial = { fare: example.fare, platformRate: example.platformRate, fleetRate: example.fleetRate };
  const [v, setV] = useState(initial);
  const money = moneyFormatter(example.locale, example.currency).format;
  const a = allocate(v.fare, v.platformRate, v.fleetRate);
  const set = (k: keyof typeof v) => (n: number) => setV((s) => ({ ...s, [k]: n }));
  const pct = (n: number) => (v.fare > 0 ? `${(n / v.fare) * 100}%` : "0%");

  const lines = [
    { label: "Example fare", value: a.platform + a.post, bar: "bg-navy-800", width: "100%" },
    { label: `Platform commission (${v.platformRate}%)`, value: a.platform, bar: "bg-slate-400", width: pct(a.platform) },
    { label: "Post-platform amount", value: a.post, bar: "bg-brand-200", width: pct(a.post) },
    { label: `Fleet share (${v.fleetRate}% of post-platform)`, value: a.fleet, bar: "bg-brand-600", width: pct(a.fleet) },
    { label: "Driver share", value: a.driver, bar: "bg-emerald-500", width: pct(a.driver) },
  ];

  return (
    <>
      <p className="mt-1 text-[0.8rem] text-muted">
        {countries[market].name} · {example.currency}. Educational example — not Sanga&apos;s rates or live
        terms.
      </p>
      <div className="mt-5 space-y-4">
        <SliderField id={`${id}-fare`} label="Example fare" value={v.fare} max={example.max.fare} step={example.step} unit={example.currency} display={money(v.fare)} onChange={set("fare")} />
        <SliderField id={`${id}-platform`} label="Platform commission (example)" value={v.platformRate} max={example.max.platformRate} step={1} unit="%" display={`${v.platformRate}%`} onChange={(n) => set("platformRate")(Math.min(n, 100))} />
        <SliderField id={`${id}-fleet`} label="Fleet share of post-platform (example)" value={v.fleetRate} max={example.max.fleetRate} step={1} unit="%" display={`${v.fleetRate}%`} onChange={(n) => set("fleetRate")(Math.min(n, 100))} />
      </div>

      <dl className="mt-6 space-y-3" aria-live="polite">
        {lines.map((l) => (
          <div key={l.label}>
            <div className="flex justify-between gap-4 text-[0.82rem]">
              <dt className="text-muted">{l.label}</dt>
              <dd className="font-bold tabular-nums">{money(l.value)}</dd>
            </div>
            <span className="mt-1 block h-2 rounded-full bg-surface" aria-hidden="true">
              <span className={`block h-full rounded-full ${l.bar}`} style={{ width: l.width }} />
            </span>
          </div>
        ))}
      </dl>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <p className="text-[0.82rem] font-bold">
          Total allocated <span className="tabular-nums">{money(a.platform + a.fleet + a.driver)}</span>
        </p>
        <button type="button" onClick={() => setV(initial)} className="inline-flex items-center gap-1.5 rounded text-[0.8rem] font-semibold text-muted hover:text-ink">
          <RotateCcw className="h-3.5 w-3.5" /> Reset to example
        </button>
      </div>
      <p className="mt-3 text-[0.72rem] leading-relaxed text-muted">
        Rounding, cash liabilities and payout timing are set by your agreement and Sanga&apos;s ledger.
      </p>
    </>
  );
}
