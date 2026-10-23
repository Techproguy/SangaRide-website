"use client";

import { ArrowLeft, ArrowRight, Briefcase, Snowflake, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { rides } from "@/lib/content";

export function RideDiscoveryShowcase() {
  const [index, setIndex] = useState(0);
  const ride = rides[index];
  const select = (i: number) => setIndex((i + rides.length) % rides.length);

  return (
    <section aria-labelledby="rides-title">
      <div className="container-page grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,330px)_1fr] lg:items-center lg:gap-14">
        <div>
          <h2 id="rides-title" className="heading-lg">
            Choose how
            <br />
            you move.
          </h2>
          <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-muted">
            From everyday rides to premium experiences, find the right option for your journey.
          </p>
          <Link
            href="/ride"
            className="mt-7 inline-flex h-11 items-center gap-2 rounded-full bg-brand-600 px-6 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Explore all ride options <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div
          role="group"
          aria-roledescription="carousel"
          aria-label="Sanga ride options"
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-surface via-white to-brand-50"
        >
          <div className="relative mx-auto aspect-[16/8] w-full max-w-[640px] px-14 pt-8 sm:px-20">
            <div className="relative h-full w-full">
              <Image
                key={ride.id}
                src={ride.image}
                alt={ride.name}
                fill
                sizes="(min-width: 1024px) 560px, 80vw"
                className="animate-[fadein_.35s_ease] object-contain mix-blend-multiply"
              />
            </div>
          </div>

          <button
            type="button"
            aria-label="Previous ride"
            onClick={() => select(index - 1)}
            className="absolute top-[42%] left-4 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-card transition hover:text-brand-600 sm:left-6"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next ride"
            onClick={() => select(index + 1)}
            className="absolute top-[42%] right-4 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-card transition hover:text-brand-600 sm:right-6"
          >
            <ArrowRight className="h-4 w-4" />
          </button>

          <div className="flex flex-wrap items-end justify-between gap-4 px-6 pb-6 sm:px-8 sm:pb-8">
            <div aria-live="polite">
              <h3 className="text-2xl font-extrabold tracking-tight sm:text-[1.75rem]">{ride.name}</h3>
              <p className="mt-0.5 text-sm text-muted">{ride.tagline}</p>
            </div>
            <ul className="flex items-center gap-5 text-sm font-medium text-ink">
              <li className="flex items-center gap-1.5">
                <User className="h-4 w-4 fill-ink" /> {ride.seats}
              </li>
              {ride.bags && (
                <li className="flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4" /> {ride.bags}
                </li>
              )}
              <li className="flex items-center gap-1.5">
                <Snowflake className="h-4 w-4" /> {ride.feature}
              </li>
            </ul>
          </div>

          <div className="flex justify-center gap-1.5 pb-5" role="tablist" aria-label="Choose a ride">
            {rides.map((r, i) => (
              <button
                key={r.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={r.name}
                onClick={() => select(i)}
                className="flex h-6 items-center"
              >
                <span className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-brand-600" : "w-1.5 bg-slate-300"}`} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
