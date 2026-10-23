"use client";

import { Check, X } from "lucide-react";
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { countries, type CountryCode } from "@/lib/content";
import { allocate, fleetDemo, settlementExamples, type FleetDemo } from "@/lib/fleet";
import { moneyFormatter } from "@/lib/format";
import { MarketToggle, useMarket } from "../Market";
import { StatusPill } from "../StatusPill";

// Static demo of the Fleet Portal. It never fetches private records or writes to Fleet APIs (spec §4).

const tabs: { id: string; label: string; intro: string }[] = [
  { id: "vehicles", label: "Vehicles", intro: "Documents, eligibility and assignment are tracked separately — an eligible vehicle isn't necessarily on the road." },
  { id: "drivers", label: "Drivers", intro: "Drivers join with their own Sanga account and must accept your invitation. You can't attach them silently." },
  { id: "assignments", label: "Assignments", intro: "A pairing goes live only when every check passes. Assigned doesn't mean on a trip." },
  { id: "settlements", label: "Settlements", intro: "Each trip's allocation, and whether it's an estimate or finalised. Payouts follow your agreement." },
];

/** 02: operational control, shown as one tabbed preview with real status semantics. */
export function FleetPreview() {
  const id = useId();
  const { market } = useMarket();
  const demo = fleetDemo[market];
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const tab = tabs[active];

  function onKeyDown(e: KeyboardEvent) {
    const next = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: tabs.length - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    const i = (next + tabs.length) % tabs.length;
    setActive(i);
    refs.current[i]?.focus();
  }

  return (
    <section id="platform" aria-labelledby="ops-title" className="scroll-mt-24">
      <div className="container-page grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,300px)_1fr] lg:gap-12">
        <div>
          <p className="eyebrow text-brand-600">Run your fleet with confidence</p>
          <h2 id="ops-title" className="heading-lg mt-3">
            Everything you need in one place.
          </h2>
          <p className="mt-4 text-[0.95rem] leading-relaxed text-muted">
            Manage vehicles, driver relationships, assignments and settlements with tools built for real fleet
            operations.
          </p>
          <div className="mt-6">
            <MarketToggle label="Demo market" />
          </div>
        </div>

        <div className="overflow-hidden rounded-[1.75rem] border border-slate-100 bg-white shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-5 pt-4">
            <div role="tablist" aria-label="Fleet preview" onKeyDown={onKeyDown} className="scrollbar-none -mb-px flex gap-1 overflow-x-auto">
              {tabs.map((t, i) => {
                const selected = i === active;
                return (
                  <button
                    key={t.id}
                    ref={(el) => {
                      refs.current[i] = el;
                    }}
                    id={`${id}-tab-${t.id}`}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls={`${id}-panel`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActive(i)}
                    className={`min-h-11 shrink-0 border-b-2 px-3 text-[0.85rem] font-semibold transition ${
                      selected ? "border-brand-600 text-brand-700" : "border-transparent text-muted hover:text-ink"
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
            <span className="mb-3 rounded-full bg-amber-100 px-2.5 py-1 text-[0.62rem] font-bold tracking-wide text-amber-900 uppercase">
              Illustrative preview — demo data
            </span>
          </div>

          <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${tab.id}`} className="min-h-[340px] p-5">
            <p className="mb-4 text-[0.82rem] leading-relaxed text-muted">{tab.intro}</p>
            {tab.id === "vehicles" && <Vehicles demo={demo} />}
            {tab.id === "drivers" && <Drivers demo={demo} />}
            {tab.id === "assignments" && <Assignments demo={demo} />}
            {tab.id === "settlements" && <Settlements demo={demo} market={market} />}
          </div>
        </div>
      </div>
    </section>
  );
}

function Rows({ children }: { children: ReactNode }) {
  return <ul className="divide-y divide-slate-100 rounded-xl border border-slate-100 text-[0.82rem]">{children}</ul>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span className="flex flex-col gap-1">
      <span className="text-[0.66rem] text-muted">{label}</span>
      {children}
    </span>
  );
}

function Vehicles({ demo }: { demo: FleetDemo }) {
  return (
    <Rows>
      {demo.vehicles.map((v) => (
        <li key={v.plate} className="grid grid-cols-2 gap-3 px-4 py-3 sm:grid-cols-[1.2fr_1fr_1fr_1.2fr] sm:items-center">
          <span className="col-span-2 sm:col-span-1">
            <span className="block font-semibold">{v.plate}</span>
            <span className="block text-[0.72rem] text-muted">{v.model}</span>
          </span>
          <Field label="Documents">
            <StatusPill status={v.documents} />
          </Field>
          <Field label="Eligibility">
            <StatusPill status={v.eligible ? "Eligible" : "Not eligible"} />
          </Field>
          <Field label="Assignment">
            <span className="flex flex-wrap items-center gap-1.5">
              <StatusPill status={v.assignment ? "Assigned" : "Unassigned"} />
              {v.assignment && <span className="text-[0.72rem]">{v.assignment}</span>}
            </span>
          </Field>
        </li>
      ))}
    </Rows>
  );
}

function Drivers({ demo }: { demo: FleetDemo }) {
  return (
    <Rows>
      {demo.drivers.map((d) => (
        <li key={d.name} className="grid grid-cols-2 gap-3 px-4 py-3 sm:grid-cols-[1.2fr_1fr_1fr_1fr] sm:items-center">
          <span className="col-span-2 flex items-center gap-2.5 font-semibold sm:col-span-1">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-[0.68rem] font-bold text-brand-700" aria-hidden="true">
              {d.name[0]}
            </span>
            {d.name}
          </span>
          <Field label="Invitation">
            <StatusPill status={d.invitation} />
          </Field>
          <Field label="Verification">
            <StatusPill status={d.verification} />
          </Field>
          <Field label="Dispatch eligibility">
            <StatusPill status={d.eligible ? "Eligible" : "Not eligible"} />
          </Field>
        </li>
      ))}
    </Rows>
  );
}

function Assignments({ demo }: { demo: FleetDemo }) {
  return (
    <ul className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {demo.assignments.map((a) => (
        <li key={a.vehicle} className="flex flex-col rounded-xl border border-slate-100 p-4 text-[0.8rem]">
          <span className="flex items-start justify-between gap-2">
            <span>
              <span className="block font-semibold">{a.vehicle}</span>
              <span className="block text-[0.72rem] text-muted">with {a.driver}</span>
            </span>
            <StatusPill status={a.state} />
          </span>
          <ul className="mt-3 space-y-1.5">
            {a.checks.map((c) => (
              <li key={c.label} className="flex items-center gap-2 text-[0.75rem]">
                {c.ok ? <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600" /> : <X className="h-3.5 w-3.5 shrink-0 text-red-600" />}
                <span className={c.ok ? "" : "font-semibold"}>
                  {c.label}
                  <span className="sr-only">{c.ok ? " — passed" : " — not yet"}</span>
                </span>
              </li>
            ))}
          </ul>
          {a.reason && <p className="mt-3 rounded-lg bg-surface px-2.5 py-2 text-[0.72rem] text-muted">{a.reason}</p>}
        </li>
      ))}
    </ul>
  );
}

function Settlements({ demo, market }: { demo: FleetDemo; market: CountryCode }) {
  const example = settlementExamples[market];
  if (!example || !demo.trips.length) {
    return (
      <p role="status" className="rounded-xl bg-surface p-6 text-center text-[0.85rem] text-muted">
        Settlement examples for {countries[market].name} aren&apos;t available yet.
      </p>
    );
  }
  const money = moneyFormatter(example.locale, example.currency).format;
  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-slate-100">
        <table className="w-full min-w-[520px] text-left text-[0.8rem]">
          <caption className="sr-only">Example trip allocations, demo data</caption>
          <thead className="bg-surface text-[0.7rem] text-muted">
            <tr>
              {["Trip", "Fare", `Platform (${example.platformRate}%)`, `Fleet (${example.fleetRate}%)`, "Driver", "State"].map((h) => (
                <th key={h} scope="col" className="px-3 py-2 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {demo.trips.map((t) => {
              const a = allocate(t.fare, example.platformRate, example.fleetRate);
              return (
                <tr key={t.ref}>
                  <th scope="row" className="px-3 py-2.5 font-semibold">
                    {t.ref}
                    <span className="block text-[0.7rem] font-normal text-muted">{t.driver}</span>
                  </th>
                  <td className="px-3 py-2.5 tabular-nums">{money(t.fare)}</td>
                  <td className="px-3 py-2.5 tabular-nums">{money(a.platform)}</td>
                  <td className="px-3 py-2.5 tabular-nums">{money(a.fleet)}</td>
                  <td className="px-3 py-2.5 tabular-nums">{money(a.driver)}</td>
                  <td className="px-3 py-2.5">
                    <StatusPill status={t.state} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[0.72rem] text-muted">Example rates, not Sanga&apos;s terms. Allocations aren&apos;t payouts until finalised.</p>
    </>
  );
}
