"use client";

import { ArrowLeft, ArrowRight, Briefcase, Pause, Play, Snowflake, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent, type PointerEvent } from "react";
import { rides } from "@/lib/content";

const slides = [rides[rides.length - 1], ...rides, rides[0]];
const motionQuery = "(prefers-reduced-motion: reduce)";

function subscribeMotion(onChange: () => void) {
  const query = window.matchMedia(motionQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function subscribeVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

export function RideDiscoveryShowcase() {
  const [slide, setSlide] = useState({ position: 1, animate: true });
  const index = (slide.position - 1 + rides.length) % rides.length;
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const dots = useRef<(HTMLButtonElement | null)[]>([]);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const reducedMotion = useSyncExternalStore(subscribeMotion, () => window.matchMedia(motionQuery).matches, () => true);
  const pageVisible = useSyncExternalStore(subscribeVisibility, () => document.visibilityState === "visible", () => true);
  const playing = !paused && !hovered && !focused && inView && pageVisible && !reducedMotion;
  const ride = rides[index];
  const select = (i: number) => setSlide({ position: ((i + rides.length) % rides.length) + 1, animate: true });

  useEffect(() => {
    if (!root.current) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.intersectionRatio >= 0.25), { threshold: 0.25 });
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      setSlide((previous) => ({ position: ((previous.position - 1 + rides.length) % rides.length) + 2, animate: true }));
    }, 3000);
    return () => window.clearTimeout(timer);
  }, [playing, slide.position]);

  function step(delta: number) {
    if (reducedMotion) { select(index + delta); return; }
    setSlide((previous) => {
      const current = ((previous.position - 1 + rides.length) % rides.length) + 1;
      return { position: current + delta, animate: !reducedMotion };
    });
  }

  function onDotKeyDown(event: KeyboardEvent) {
    const next = { ArrowRight: (index + 1) % rides.length, ArrowLeft: (index + rides.length - 1) % rides.length, Home: 0, End: rides.length - 1 }[event.key];
    if (next === undefined) return;
    event.preventDefault(); select(next); dots.current[next]?.focus();
  }

  function onPointerUp(event: PointerEvent) {
    const start = pointer.current;
    pointer.current = null;
    if (!start || event.pointerType === "mouse") return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) step(dx < 0 ? 1 : -1);
  }

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
          ref={root}
          role="region"
          aria-roledescription="carousel"
          aria-label="Sanga ride options"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocusCapture={() => setFocused(true)}
          onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
          onPointerDown={(event) => { pointer.current = { x: event.clientX, y: event.clientY }; }}
          onPointerUp={onPointerUp}
          onPointerCancel={() => { pointer.current = null; }}
          className="relative isolate touch-pan-y overflow-hidden rounded-[2rem] bg-surface"
        >
          <div className="overflow-hidden">
            <div
              className={`flex ${slide.animate && !reducedMotion ? "transition-transform duration-500 ease-in-out" : ""}`}
              style={{ transform: `translateX(-${slide.position * 100}%)` }}
              onTransitionEnd={(event) => {
                if (event.target !== event.currentTarget || event.propertyName !== "transform") return;
                if (slide.position === 0) setSlide({ position: rides.length, animate: false });
                else if (slide.position === rides.length + 1) setSlide({ position: 1, animate: false });
              }}
            >
              {slides.map((item, position) => (
                <div key={`${item.id}-${position}`} aria-hidden={position !== slide.position} className="w-full min-w-0 shrink-0 bg-surface">
                  <div className="relative mx-auto aspect-[16/8] w-full max-w-[640px] px-14 pt-8 sm:px-20">
                    <div className="relative h-full w-full">
                      <Image src={item.image} alt={item.name} fill sizes="(min-width: 1024px) 560px, 80vw" draggable={false} className="object-contain mix-blend-multiply" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            aria-label="Previous ride"
            onClick={() => step(-1)}
            className="absolute top-[42%] left-4 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-card transition hover:text-brand-600 sm:left-6"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next ride"
            onClick={() => step(1)}
            className="absolute top-[42%] right-4 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-card transition hover:text-brand-600 sm:right-6"
          >
            <ArrowRight className="h-4 w-4" />
          </button>

          <div className="flex flex-wrap items-end justify-between gap-4 px-6 pb-6 sm:px-8 sm:pb-8">
            <div aria-live={playing ? "off" : "polite"}>
              <h3 className="text-2xl font-extrabold tracking-tight sm:text-[1.75rem]">{ride.name}</h3>
              <p className="mt-0.5 text-sm text-muted">{ride.tagline}</p>
            </div>
            <ul className="flex min-h-12 flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-ink sm:min-h-0">
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

          <div className="flex items-center justify-center gap-2 pb-3">
            <div className="flex" role="group" aria-label="Choose a ride" onKeyDown={onDotKeyDown}>
              {rides.map((r, i) => (
                <button
                  key={r.id}
                  ref={(element) => { dots.current[i] = element; }}
                  type="button"
                  aria-pressed={i === index}
                  aria-label={r.name}
                  onClick={() => select(i)}
                  className="flex h-11 w-8 items-center justify-center rounded-full"
                >
                  <span className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-brand-600" : "w-1.5 bg-slate-300"}`} />
                </button>
              ))}
            </div>
            {!reducedMotion && (
              <button type="button" aria-label={paused ? "Play automatic rotation" : "Pause automatic rotation"} onClick={() => setPaused((value) => !value)} className="flex h-11 w-11 items-center justify-center rounded-full text-muted transition hover:bg-white hover:text-brand-600">
                {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
