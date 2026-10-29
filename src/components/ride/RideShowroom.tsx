"use client";

import { ArrowLeft, ArrowRight, ChevronDown, MapPin, ShieldCheck, Sparkles, Tag, UserCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Ride } from "@/lib/content";

const highlightIcons = [Tag, Sparkles, UserCheck, MapPin];

const trust = [
  { icon: ShieldCheck, label: "Reliable rides" },
  { icon: UserCheck, label: "Verified drivers" },
  { icon: MapPin, label: "Select cities in Nigeria and the US" },
];

export function RideShowroom({
  rides,
  selected,
  onSelect,
}: {
  rides: Ride[];
  selected: Ride;
  onSelect?: (id: string) => void;
}) {
  const index = rides.findIndex((r) => r.id === selected.id);
  const step = (delta: number) => onSelect?.(rides[(index + delta + rides.length) % rides.length].id);

  return (
    <section aria-labelledby="ride-title" className="relative overflow-hidden bg-gradient-to-b from-surface via-white to-white">
      <div
        className="pointer-events-none absolute top-24 left-1/2 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-brand-100/50 blur-3xl"
        aria-hidden="true"
      />

      <div className="container-page relative pt-12 pb-4 lg:pt-16">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,330px)_1fr_330px] xl:items-center xl:gap-6">
          <div>
            <h1 id="ride-title" className="heading-xl">
              Choose the ride
              <br />
              that <span className="text-brand-600">fits your journey.</span>
            </h1>
            <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-muted">
              Six ride options. Different needs. One reliable way to move across your city, to the airport, between cities
              and beyond.
            </p>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2.5 text-[0.8rem] font-medium">
              {trust.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-brand-600" />
                  {label}
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile and tablet: the selector comes before the stage so it is reachable without scrolling. */}
          <RideSelector rides={rides} selected={selected} onSelect={onSelect} className="xl:hidden" compact />

          <div className="relative">
            <div className="relative mx-auto aspect-[3/2] w-full max-w-[620px]">
              <span className="absolute inset-x-[12%] bottom-[14%] h-[12%] rounded-[50%] bg-navy-900/15 blur-2xl" aria-hidden="true" />
              <Image
                key={selected.id}
                src={selected.image}
                alt={`${selected.name} — illustrative vehicle; the exact make and model may vary`}
                fill
                preload
                sizes="(min-width: 1280px) 560px, 90vw"
                className="animate-[fadein_.35s_ease] object-contain mix-blend-multiply"
              />
            </div>
            <button
              type="button"
              aria-label="Previous ride"
              onClick={() => step(-1)}
              className="absolute top-1/2 left-0 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-card transition hover:text-brand-600"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next ride"
              onClick={() => step(1)}
              className="absolute top-1/2 right-0 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-card transition hover:text-brand-600"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="rounded-[2rem] border border-slate-100 bg-white p-7 shadow-card">
            <div aria-live="polite">
              <h2 className="text-[1.75rem] leading-tight font-extrabold tracking-tight">{selected.name}</h2>
              <p className="mt-2 text-[0.92rem] leading-relaxed text-muted">{selected.description}</p>
            </div>
            <ul className="mt-5 space-y-3">
              {selected.highlights.map((h, i) => {
                const Icon = highlightIcons[i % highlightIcons.length];
                return (
                  <li key={h} className="flex items-start gap-3 text-[0.85rem]">
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                    {h}
                  </li>
                );
              })}
            </ul>
            <Link
              href={`/book?service=${selected.id}`}
              className="mt-7 flex h-12 items-center justify-center gap-2 rounded-full bg-brand-600 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Book {selected.name} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#compare"
              className="mt-3 flex h-10 items-center justify-center gap-1.5 text-[0.85rem] font-semibold text-brand-600 transition-all hover:gap-2.5"
            >
              Compare rides <ArrowRight className="h-4 w-4" />
            </Link>

            {/* Mobile: extra detail folds away instead of lengthening the page. */}
            <details className="group mt-4 border-t border-slate-100 pt-4 lg:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between text-[0.9rem] font-semibold">
                Why choose {selected.name}?
                <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
              </summary>
              <dl className="mt-3 grid grid-cols-2 gap-3 text-[0.8rem]">
                {(
                  [
                    ["Best for", selected.compare.bestFor],
                    ["Typical use", selected.compare.typicalUse],
                    ["Group size", selected.compare.groupSize],
                    ["Luggage", selected.compare.luggage],
                  ] as const
                ).map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-muted">{label}</dt>
                    <dd className="font-semibold">{value}</dd>
                  </div>
                ))}
              </dl>
            </details>
          </div>
        </div>

        <RideSelector rides={rides} selected={selected} onSelect={onSelect} className="mt-8 hidden xl:grid" />
      </div>
    </section>
  );
}

function RideSelector({
  rides,
  selected,
  onSelect,
  className = "",
  compact = false,
}: {
  rides: Ride[];
  selected: Ride;
  onSelect?: (id: string) => void;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Choose a ride type"
      className={
        compact
          ? `grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3 ${className}`
          : `grid-cols-6 gap-2 rounded-[2rem] border border-slate-100 bg-white p-2 shadow-card ${className}`
      }
    >
      {rides.map((r) => {
        const active = r.id === selected.id;
        return (
          <button
            key={r.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onSelect?.(r.id)}
            className={`group relative min-w-0 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 ${
              compact
                ? `rounded-2xl border px-2 pt-2.5 pb-3 text-center ${active ? "border-brand-200 bg-white shadow-[0_5px_16px_-8px_rgba(29,95,255,0.35)]" : "border-white/80 bg-white/60 hover:border-brand-200 hover:bg-white"}`
                : `rounded-[1.5rem] border-2 p-3 text-left ${active ? "border-brand-600 bg-brand-50/50" : "border-transparent hover:bg-surface"}`
            }`}
          >
            <span className={`relative block ${compact ? "mx-auto h-9 w-full max-w-20" : "h-16 w-full"}`}>
              <Image src={r.image} alt="" fill sizes="160px" className="object-contain mix-blend-multiply" />
            </span>
            <span className={`block font-bold ${compact ? "mt-1 text-xs" : "mt-2 text-[0.9rem]"} ${active ? "text-brand-700" : ""}`}>
              {compact ? r.name.replace("Sanga ", "") : r.name}
            </span>
            {compact && active && <span aria-hidden="true" className="absolute inset-x-[35%] bottom-0 h-0.5 rounded-t-full bg-brand-600" />}
            {!compact && <span className="block text-[0.75rem] text-muted">{r.tagline}</span>}
          </button>
        );
      })}
    </div>
  );
}
