"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { EarningsScreen, NavigateScreen, PhoneFrame, RequestScreen, VerifyScreen } from "./PhoneScreens";

const steps = [
  {
    title: "Receive a trip request",
    short: "See trip details and the estimated fare, then accept or decline.",
    Screen: RequestScreen,
    details: [
      "Offers show the pickup area, distance and estimated fare information available for that trip.",
      "Accept or decline before the offer expires. How offers are sent follows Sanga's dispatch rules.",
    ],
  },
  {
    title: "Verify the pickup",
    short: "The rider runs Match Check, then the Trip PIN is verified.",
    Screen: VerifyScreen,
    details: [
      "The rider checks that you and your vehicle match the app (Match Check). You'll see when they've done it.",
      "The Trip PIN is then exchanged and verified by Sanga before the trip can start.",
      "If a trip is reassigned, earlier verification and PINs no longer apply.",
    ],
  },
  {
    title: "Complete the journey",
    short: "Follow navigation, keep the trip safe and update its status.",
    Screen: NavigateScreen,
    details: [
      "Navigation, trip status and safety tools stay on screen during the trip.",
      "If you lose connection, the app recovers the trip when you're back online. A trip only counts as complete once Sanga confirms it.",
    ],
  },
  {
    title: "Review your earnings",
    short: "See the fare breakdown and track your payout status.",
    Screen: EarningsScreen,
    details: [
      "Each trip shows the fare, any applicable commission and adjustments, and any cash or settlement balance.",
      "Trip earnings aren't the same as your payout, or your profit after running costs.",
    ],
  },
];

/** DR-03: four selectable steps; choosing one changes the screen and description. */
export function RequestToPayout() {
  const id = useId();
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const step = steps[active];

  function onKeyDown(e: KeyboardEvent) {
    const next = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: steps.length - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    const i = (next + steps.length) % steps.length;
    setActive(i);
    tabs.current[i]?.focus();
  }

  return (
    <section id="how-it-works" aria-labelledby="payout-title" className="scroll-mt-24">
      <div className="container-page grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,280px)_1fr] lg:gap-12">
        <div>
          <p className="eyebrow text-brand-600">From request to payout</p>
          <h2 id="payout-title" className="heading-lg mt-3">
            A simple, transparent driving experience.
          </h2>
          <p className="mt-4 text-[0.95rem] leading-relaxed text-muted">
            See how a typical trip works on Sanga — from the moment you receive a request to when your earnings are
            settled.
          </p>
          <Link
            href="#your-terms"
            className="mt-7 inline-flex h-11 items-center gap-2 rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Explore the driver app <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div>
          <div role="tablist" aria-label="Trip steps" onKeyDown={onKeyDown} className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {steps.map((s, i) => {
              const selected = i === active;
              return (
                <button
                  key={s.title}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  id={`${id}-tab-${i}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`${id}-panel`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(i)}
                  className={`group flex flex-col rounded-[1.5rem] p-3 text-left transition ${
                    selected ? "bg-brand-50 ring-2 ring-brand-500" : "bg-surface hover:bg-brand-50/60"
                  }`}
                >
                  <span aria-hidden="true" className="mb-4 hidden px-3 pt-2 lg:block">
                    <PhoneFrame className={`transition ${selected ? "" : "opacity-60 group-hover:opacity-90"}`}>
                      <s.Screen />
                    </PhoneFrame>
                  </span>
                  <span className="flex items-start gap-2.5">
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[0.72rem] font-bold ${
                        selected ? "bg-brand-600 text-white" : "bg-white text-brand-600"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span>
                      <span className="block text-[0.85rem] leading-tight font-bold">{s.title}</span>
                      <span className="mt-1 hidden text-[0.75rem] leading-snug text-muted sm:block">{s.short}</span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div
            id={`${id}-panel`}
            role="tabpanel"
            aria-labelledby={`${id}-tab-${active}`}
            className="mt-5 grid grid-cols-1 items-center gap-6 rounded-[1.5rem] border border-slate-100 p-5 sm:grid-cols-[200px_1fr] sm:p-6 lg:grid-cols-1"
          >
            <div className="mx-auto w-full max-w-[220px] lg:hidden" aria-hidden="true">
              <PhoneFrame>
                <step.Screen />
              </PhoneFrame>
            </div>
            <div>
              <p className="text-[0.75rem] font-semibold text-muted">
                Step {active + 1} of {steps.length}
              </p>
              <h3 className="mt-1 text-lg font-bold">{step.title}</h3>
              <ul className="mt-3 space-y-2 text-[0.88rem] leading-relaxed text-muted">
                {step.details.map((d) => (
                  <li key={d} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden="true" />
                    {d}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[0.72rem] text-muted">Illustrative interface with sample data — not a real trip.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
