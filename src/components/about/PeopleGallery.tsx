"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { perspectives } from "@/lib/about";

/** 04: four perspectives. A grid on desktop; a scroll-snap rail with real buttons below it. No autoplay. */
export function PeopleGallery() {
  const rail = useRef<HTMLUListElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: reduce ? "auto" : "smooth" });
  };
  const navButton = "flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 transition hover:border-ink";

  return (
    <section id="built-around-people" aria-labelledby="people-title" className="scroll-mt-24">
      <div className="container-page">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <h2 id="people-title" className="heading-lg max-w-xl">
            Real journeys.
            <br />
            Real people.
          </h2>
          <div className="max-w-md">
            <p className="text-[0.95rem] leading-relaxed text-muted">
              Sanga Ride exists because of the people who move our world — and the partners building better mobility
              with them.
            </p>
            <div className="mt-4 flex items-center justify-between gap-4">
              <Link href="#our-direction" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition-all hover:gap-3">
                See the bigger picture <ArrowRight className="h-4 w-4" />
              </Link>
              <div className="flex gap-2 lg:hidden">
                <button type="button" aria-label="Previous perspective" onClick={() => scroll(-1)} className={navButton}>
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button type="button" aria-label="Next perspective" onClick={() => scroll(1)} className={navButton}>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <ul
          ref={rail}
          aria-label="Perspectives"
          className="scrollbar-none -mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0 lg:pb-0"
        >
          {perspectives.map((p) => (
            <li key={p.title} className="w-[80%] shrink-0 snap-start sm:w-[45%] lg:w-auto">
              <article className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-navy-900 text-white lg:aspect-auto lg:h-[420px]">
                <Image src={p.image} alt={p.alt} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 80vw" className="object-cover" />
                <span className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="text-xl font-extrabold tracking-tight">{p.title}</h3>
                  <p className="mt-1 text-[0.85rem] leading-snug text-white/80">{p.text}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[0.72rem] text-muted">Photography is illustrative and does not depict real Sanga riders, drivers or partners.</p>
      </div>
    </section>
  );
}
