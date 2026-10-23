"use client";

import { Briefcase, MapPin, Route, Star, Users } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { Ride } from "@/lib/content";
import { Select } from "../Select";

type Field = keyof Ride["compare"];

const fields: { key: Field; label: string; icon: typeof Star }[] = [
  { key: "bestFor", label: "Best for", icon: Star },
  { key: "typicalUse", label: "Typical use", icon: Route },
  { key: "groupSize", label: "Group size", icon: Users },
  { key: "luggage", label: "Luggage suitability", icon: Briefcase },
  { key: "availability", label: "Availability", icon: MapPin },
];

export function RideComparison({
  rides,
  selected,
  onSelect,
}: {
  rides: Ride[];
  selected: Ride;
  onSelect?: (id: string) => void;
}) {
  return (
    <section id="compare" aria-labelledby="compare-title" className="scroll-mt-24">
      <div className="container-page">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <h2 id="compare-title" className="heading-lg">
            Compare Sanga rides
          </h2>
          <p className="max-w-md text-[0.95rem] leading-relaxed text-muted">
            See the key differences to help you choose the right option. Pick a ride to see it above.
          </p>
        </div>

        {/* Desktop and tablet: a real table with row and column headers. */}
        <div className="mt-10 hidden overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-card md:block">
          <table className="w-full table-fixed border-collapse text-left text-[0.85rem]">
            <caption className="sr-only">Comparison of Sanga ride types</caption>
            <thead>
              <tr>
                <td className="w-[15%] p-4" />
                {rides.map((r) => {
                  const active = r.id === selected.id;
                  return (
                    <th key={r.id} scope="col" className={`p-2 align-bottom font-normal ${active ? "bg-brand-50/60" : ""}`}>
                      <button
                        type="button"
                        onClick={() => onSelect?.(r.id)}
                        aria-pressed={active}
                        aria-label={`Show ${r.name} in the showroom`}
                        className="w-full rounded-2xl px-2 pt-3 pb-2 text-center transition hover:bg-surface"
                      >
                        <span className="relative mx-auto block h-12 w-full max-w-[110px]">
                          <Image src={r.image} alt="" fill sizes="110px" className="object-contain mix-blend-multiply" />
                        </span>
                        <span className={`mt-2 block text-[0.9rem] font-bold ${active ? "text-brand-700" : ""}`}>{r.name}</span>
                        <span className="block text-[0.75rem] text-muted">{r.tagline}</span>
                      </button>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {fields.map(({ key, label, icon: Icon }) => (
                <tr key={key} className="border-t border-slate-100">
                  <th scope="row" className="p-4 font-semibold">
                    <span className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 shrink-0 text-brand-600" />
                      {label}
                    </span>
                  </th>
                  {rides.map((r) => (
                    <td key={r.id} className={`p-4 text-center text-muted ${r.id === selected.id ? "bg-brand-50/60 font-medium text-ink" : ""}`}>
                      {r.compare[key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <MobileComparison key={selected.id} rides={rides} selected={selected} />

        <p className="mt-5 text-[0.8rem] text-muted">
          Availability depends on your pickup location. Options and fares are confirmed when you enter your route.
        </p>
      </div>
    </section>
  );
}

/** Mobile: two rides side by side instead of a squeezed six-column table. */
function MobileComparison({ rides, selected }: { rides: Ride[]; selected: Ride }) {
  const [left, setLeft] = useState(selected.id);
  const [right, setRight] = useState(rides.find((r) => r.id !== selected.id)!.id);
  const pair = [left, right].map((id) => rides.find((r) => r.id === id)!);

  return (
    <div className="mt-8 rounded-[2rem] border border-slate-100 bg-white p-4 shadow-card md:hidden">
      <div className="grid grid-cols-2 gap-3">
        {[
          [left, setLeft, "First ride to compare"],
          [right, setRight, "Second ride to compare"],
        ].map(([value, set, label], i) => (
          <Select
            key={label as string}
            label={label as string}
            value={value as string}
            onChange={set as (v: string) => void}
            options={rides.map((r) => ({ value: r.id, label: r.name, disabled: r.id === (i === 0 ? right : left) }))}
            className="flex h-11 w-full items-center justify-between gap-2 rounded-full border border-slate-200 bg-white px-4 text-[0.85rem] font-semibold transition hover:border-slate-300 aria-expanded:border-brand-500"
          />
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {pair.map((r) => (
          <div key={r.id} className="relative h-16">
            <Image src={r.image} alt={r.name} fill sizes="45vw" className="object-contain mix-blend-multiply" />
          </div>
        ))}
      </div>

      <dl className="mt-2">
        {fields.map(({ key, label }) => (
          <div key={key} className="border-t border-slate-100 py-3">
            <dt className="text-[0.75rem] font-semibold text-muted">{label}</dt>
            <dd className="mt-1 grid grid-cols-2 gap-3 text-[0.85rem]">
              {pair.map((r) => (
                <span key={r.id}>{r.compare[key]}</span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
