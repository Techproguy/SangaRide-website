"use client";

import { ChevronDown, Info, RotateCcw } from "lucide-react";
import { useId, useState } from "react";
import { countries } from "@/lib/content";
import { calculatorExamples, type CalculatorExample } from "@/lib/drive";
import { MarketToggle, useMarket } from "../Market";
import { SliderField } from "../SliderField";

type Field = "fare" | "feeRate" | "fuel" | "other";
type Values = Record<Field, number> & { trips: number };

const MAX_TRIPS = 30;

function exampleValues(ex: CalculatorExample): Values {
  return { fare: ex.fare, feeRate: ex.feeRate, fuel: ex.fuel, other: ex.other, trips: 1 };
}

/**
 * DR-02 "Know your numbers": an educational example, not a quote. Values stay client-side and
 * are never sent anywhere. Negative outcomes are shown as-is rather than clamped to zero.
 */
export function EarningsCalculator() {
  const { market, setMarket } = useMarket();
  const example = calculatorExamples[market];

  return (
    <section
      id="numbers"
      aria-labelledby="numbers-title"
      className="scroll-mt-24 rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-panel sm:p-7"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2 id="numbers-title" className="text-[1.35rem] font-extrabold tracking-[-0.02em]">
          Know your numbers
        </h2>
        <MarketToggle label="Example market" />
      </div>
      <p className="mt-1.5 text-[0.85rem] leading-relaxed text-muted">
        See how trip fare, a platform fee and running costs can affect what&apos;s left from a trip.
      </p>

      {example ? (
        // Keyed by market so switching resets to that market's example.
        <CalculatorBody key={market} example={example} />
      ) : (
        <div role="status" className="mt-6 rounded-2xl bg-surface p-6 text-center">
          <p className="text-[0.95rem] font-bold">A {countries[market].name} example isn&apos;t available yet.</p>
          <p className="mx-auto mt-1.5 max-w-xs text-[0.82rem] leading-relaxed text-muted">
            We only show examples that have been prepared for each market. We won&apos;t convert another
            country&apos;s figures.
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
    </section>
  );
}

function CalculatorBody({ example }: { example: CalculatorExample }) {
  const id = useId();
  const [mode, setMode] = useState<"trip" | "trips">("trip");
  const [values, setValues] = useState<Values>(() => exampleValues(example));
  const [showBreakdown, setShowBreakdown] = useState(false);

  const money = new Intl.NumberFormat(example.locale, {
    style: "currency",
    currency: example.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const trips = mode === "trips" ? values.trips : 1;
  const fee = values.fare * (values.feeRate / 100);
  const perTrip = values.fare - fee - values.fuel - values.other;
  const remainder = perTrip * trips;
  const isLoss = remainder < 0;

  const set = (field: keyof Values) => (n: number) => setValues((v) => ({ ...v, [field]: n }));

  const sliders: { field: Field; label: string; max: number; step: number; format: (n: number) => string }[] = [
    { field: "fare", label: "Trip fare (example)", max: example.max.fare, step: example.step, format: money.format },
    { field: "feeRate", label: "Platform fee (example)", max: example.max.feeRate, step: 1, format: (n) => `${n}%` },
    { field: "fuel", label: "Estimated fuel cost", max: example.max.fuel, step: example.step, format: money.format },
    { field: "other", label: "Other operating costs", max: example.max.other, step: example.step, format: money.format },
  ];

  const breakdown = [
    ["Trip fare (example)", values.fare],
    [`Platform fee (${values.feeRate}%, example)`, -fee],
    ["Estimated fuel cost", -values.fuel],
    ["Other operating costs", -values.other],
  ] as const;

  return (
    <>
      <div role="group" aria-label="Calculate for" className="mt-5 grid grid-cols-2 rounded-xl bg-surface p-1 text-[0.8rem] font-semibold">
        {(
          [
            ["trip", "Per trip"],
            ["trips", "Several trips"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={mode === value}
            onClick={() => setMode(value)}
            className={`rounded-lg py-2 transition ${mode === value ? "bg-brand-600 text-white shadow-sm" : "text-muted hover:text-ink"}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-4">
        {sliders.map((s) => (
          <SliderField
            key={s.field}
            id={`${id}-${s.field}`}
            label={s.label}
            value={values[s.field]}
            max={s.max}
            step={s.step}
            unit={s.field === "feeRate" ? "%" : example.currency}
            display={s.format(values[s.field])}
            onChange={set(s.field)}
          />
        ))}
        {mode === "trips" && (
          <SliderField
            id={`${id}-trips`}
            label="Number of trips (your assumption)"
            value={values.trips}
            min={1}
            max={MAX_TRIPS}
            step={1}
            unit="trips"
            display={`${values.trips}`}
            onChange={set("trips")}
          />
        )}
      </div>

      <div
        className={`mt-6 rounded-2xl p-4 sm:p-5 ${isLoss ? "bg-red-50" : "bg-brand-50"}`}
        aria-live="polite"
        aria-atomic="true"
      >
        <p className="flex items-center gap-1.5 text-[0.8rem] font-semibold text-muted">
          Estimated amount remaining{mode === "trips" ? ` from ${trips} ${trips === 1 ? "trip" : "trips"}` : ""}
          <span title="Before taxes and any costs not listed here" className="text-brand-600">
            <Info className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        </p>
        <p className={`mt-1 text-[2.1rem] leading-none font-extrabold tracking-[-0.03em] ${isLoss ? "text-red-700" : "text-brand-700"}`}>
          {money.format(remainder)}
        </p>
        {isLoss && <p className="mt-1.5 text-[0.8rem] font-semibold text-red-700">With these costs, this example is a potential loss.</p>}
        <p className="mt-2 text-[0.75rem] leading-relaxed text-muted">
          Before taxes, depreciation, insurance, financing, idle time and other costs not listed. This is an example, not
          a guarantee or Sanga&apos;s actual fees.
        </p>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          aria-expanded={showBreakdown}
          aria-controls={`${id}-breakdown`}
          onClick={() => setShowBreakdown((o) => !o)}
          className="inline-flex items-center gap-1 rounded text-[0.8rem] font-semibold text-brand-600 hover:text-brand-700"
        >
          {showBreakdown ? "Hide" : "See"} breakdown
          <ChevronDown className={`h-4 w-4 transition ${showBreakdown ? "rotate-180" : ""}`} />
        </button>
        <button
          type="button"
          onClick={() => setValues(exampleValues(example))}
          className="inline-flex items-center gap-1.5 rounded text-[0.8rem] font-semibold text-muted hover:text-ink"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset to example
        </button>
      </div>

      {showBreakdown && (
        <dl id={`${id}-breakdown`} className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-100 text-[0.82rem]">
          {breakdown.map(([label, amount]) => (
            <div key={label} className="flex justify-between gap-4 px-4 py-2.5">
              <dt className="text-muted">{label}</dt>
              <dd className="font-semibold tabular-nums">{money.format(amount)}</dd>
            </div>
          ))}
          <div className="flex justify-between gap-4 px-4 py-2.5 font-bold">
            <dt>Remaining per trip</dt>
            <dd className={`tabular-nums ${perTrip < 0 ? "text-red-700" : ""}`}>{money.format(perTrip)}</dd>
          </div>
          {mode === "trips" && (
            <div className="flex justify-between gap-4 px-4 py-2.5 font-bold">
              <dt>× {trips} trips</dt>
              <dd className={`tabular-nums ${isLoss ? "text-red-700" : ""}`}>{money.format(remainder)}</dd>
            </div>
          )}
        </dl>
      )}
    </>
  );
}
