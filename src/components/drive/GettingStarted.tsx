"use client";

import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { countries } from "@/lib/content";
import { gettingStartedSteps, requirementsByMarket } from "@/lib/drive";
import { MarketToggle, useMarket } from "../Market";
import { ApplyLink } from "./DriveMarket";

/** DR-06: market-aware application steps and requirement categories. */
export function GettingStarted() {
  const { market } = useMarket();
  const requirements = requirementsByMarket[market];

  return (
    <section id="get-started" aria-labelledby="start-title" className="scroll-mt-24">
      <div className="container-page">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div>
            <p className="eyebrow text-brand-600">Getting started</p>
            <h2 id="start-title" className="heading-lg mt-3">
              A clear path to driving.
            </h2>
          </div>
          <p className="max-w-md text-[0.95rem] leading-relaxed text-muted">
            The application is straightforward. Requirements differ by country and location, and every application is
            reviewed.
          </p>
        </div>

        <ol className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {gettingStartedSteps.map((s, i) => (
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

        <div
          id="requirements"
          className="mt-5 grid scroll-mt-24 grid-cols-1 gap-8 rounded-[2rem] border border-slate-100 p-7 shadow-card sm:p-10 lg:grid-cols-[1fr_320px] lg:gap-14"
        >
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-xl font-extrabold tracking-[-0.02em]">Requirements by market</h3>
              <MarketToggle label="Requirements for" />
            </div>
            <p className="mt-2 text-[0.88rem] leading-relaxed text-muted">{requirements.summary}</p>
            <p className="mt-5 text-[0.8rem] font-semibold">What you&apos;ll usually be asked for in {countries[market].name}</p>
            <ul className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {requirements.items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-[0.88rem]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[0.75rem] leading-relaxed text-muted">
              The exact documents for your city are confirmed when you apply. Choosing a country here doesn&apos;t mean
              applications are open there.
            </p>
          </div>

          <div className="flex flex-col justify-center gap-4 rounded-[1.5rem] bg-brand-50 p-6">
            <p className="text-[0.95rem] font-bold">Ready to apply?</p>
            <ApplyLink className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 text-sm font-semibold text-white transition hover:bg-brand-700">
              Apply to drive <ArrowRight className="h-4 w-4" />
            </ApplyLink>
            <p className="text-[0.8rem] leading-relaxed text-muted">
              Driving a fleet vehicle? You may also need to be linked to your fleet.{" "}
              <Link href="/fleet" className="font-semibold text-brand-600 underline-offset-2 hover:underline">
                Visit Fleet
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
