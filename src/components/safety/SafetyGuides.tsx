"use client";

import { ArrowLeft, ArrowRight, ChevronDown, CircleAlert, CarFront, CreditCard, KeyRound, RotateCcw, Route, ShieldCheck, TriangleAlert, UserRound, Users, Wrench } from "lucide-react";
import Image from "next/image";
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { pickupSteps, safetyAudiences, safetyMarkets, safetyScenarios, safetyStages } from "@/lib/safety";
import { useMarket } from "../Market";
import { SafetyMarketNote } from "./SafetySections";

const headingClass = "mt-2 text-[1.65rem] leading-[1.12] font-extrabold tracking-[-0.03em] sm:text-[1.85rem]";
const actionClass = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-xs font-semibold transition";

function SectionIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return <div><p className="eyebrow text-brand-600">{eyebrow}</p><h2 className={headingClass}>{title}</h2><p className="mt-3 max-w-md text-sm leading-relaxed text-muted">{text}</p></div>;
}

/** Roving keyboard focus: Left/Right wrap; Home/End jump. Tabs activate on focus. */
function TabStrip({ labels, active, onChange, id, children }: { labels: string[]; active: number; onChange: (i: number) => void; id: string; children?: (i: number) => ReactNode }) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  function keyDown(e: KeyboardEvent) {
    const next = { ArrowRight: (active + 1) % labels.length, ArrowLeft: (active + labels.length - 1) % labels.length, Home: 0, End: labels.length - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault(); onChange(next); refs.current[next]?.focus();
  }
  return <div role="tablist" aria-label="Trip safety stages" onKeyDown={keyDown} className="grid grid-cols-2 gap-2 md:grid-cols-4">{labels.map((label, i) => <button key={label} ref={(el) => { refs.current[i] = el; }} id={`${id}-tab-${i}`} role="tab" aria-selected={active === i} aria-controls={`${id}-panel-${i}`} tabIndex={active === i ? 0 : -1} onClick={() => onChange(i)} className={`flex min-h-[76px] items-start gap-2.5 rounded-xl border p-3 text-left transition ${active === i ? "border-brand-600 bg-brand-50" : "border-slate-200 bg-white hover:border-brand-200"}`}><span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[0.65rem] font-bold ${active === i ? "bg-brand-600 text-white" : "bg-surface text-brand-600"}`}>{i + 1}</span><span><span className="block text-xs leading-snug font-bold">{label}</span>{children?.(i)}</span></button>)}</div>;
}

export function SafetyJourney() {
  const [active, setActive] = useState(0);
  const { market } = useMarket();
  const id = useId();
  const stage = safetyStages[active];
  return (
    <section id="safety-journey" aria-label="Your safety journey" className="scroll-mt-24 py-8 sm:py-10">
      <div className="container-page">
        <SafetyMarketNote />
        <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr] lg:gap-10">
          <SectionIntro eyebrow="Your safety journey" title="Protection at every stage." text="A journey has different moments. Explore the checks, choices and guidance for each one." />
          <div className="min-w-0">
            <TabStrip labels={safetyStages.map(s => s.title)} active={active} onChange={setActive} id={id}>{i => <span className="mt-1 hidden text-[0.65rem] text-muted sm:block">{safetyStages[i].short}</span>}</TabStrip>
            <div id={`${id}-panel-${active}`} role="tabpanel" aria-labelledby={`${id}-tab-${active}`} tabIndex={0} className="mt-3 grid overflow-hidden rounded-2xl bg-surface sm:grid-cols-[140px_1fr]">
              <div className="relative hidden min-h-[155px] sm:block"><Image src={stage.image} alt={stage.alt} fill sizes="140px" className="object-cover" /></div>
              <div className="p-5"><h3 aria-live="polite" className="text-base font-bold tracking-tight">{stage.heading}</h3><p className="mt-2 text-[0.8rem] leading-relaxed text-muted">{active === 1 ? safetyMarkets[market].sharing + " Location updates may be delayed when connectivity is weak." : stage.text}</p><a href={stage.href} className="mt-1 inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-brand-600 hover:underline">{stage.action}<ArrowRight className="h-3.5 w-3.5" /></a></div>
            </div>
            <p className="mt-2 text-[0.65rem] text-muted">Educational overview · no live tracking, reporting or emergency connection.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PickupGuide() {
  const [step, setStep] = useState(0);
  const [mismatch, setMismatch] = useState(false);
  const [reassigned, setReassigned] = useState(false);
  const current = pickupSteps[step];
  const icons = [CarFront, UserRound, ShieldCheck, KeyRound];
  const Icon = icons[step];
  function restart(reassignment = false) { setStep(0); setMismatch(false); setReassigned(reassignment); }
  return (
    <section id="pickup-guide" aria-label="Match Check and Trip PIN guide" className="scroll-mt-24 bg-surface py-8 sm:py-10">
      <div className="container-page grid items-start gap-6 lg:grid-cols-[260px_1fr] lg:gap-10">
        <div><SectionIntro eyebrow="Match Check → Trip PIN" title="A few checks. A clearer start." text="First the vehicle. Then the driver. Only after Match Check comes the Trip PIN." /><p className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-brand-200 px-2.5 py-1.5 text-[0.65rem] font-semibold text-brand-700"><CircleAlert className="h-3.5 w-3.5" />Illustrative guide — not a live trip</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          <ol aria-label="Pickup verification order" className="grid grid-cols-4 gap-2">
            {pickupSteps.map((item, i) => <li key={item.title} aria-current={!mismatch && i === step ? "step" : undefined} className={`border-t-[3px] pt-2 ${!mismatch && i <= step ? "border-brand-600" : "border-slate-200"}`}><span className="text-[0.65rem] font-bold text-brand-600">0{i + 1}</span><span className={`mt-1 hidden text-[0.7rem] leading-snug font-semibold sm:block ${i === step ? "text-ink" : "text-muted"}`}>{item.title}</span></li>)}
          </ol>
          <div aria-live="polite" aria-atomic="true" className="mt-5">
            {mismatch ? (
              <div className="rounded-xl bg-amber-50 p-5"><TriangleAlert className="h-6 w-6 text-amber-700" /><h3 className="mt-3 text-lg font-bold">Something doesn’t match? Don’t get in.</h3><p className="mt-2 max-w-xl text-sm leading-relaxed text-amber-950">Move somewhere safe and check your current trip assignment. Use available app reporting or cancellation controls. For immediate danger, contact local emergency services.</p><a href="#safety-resources" className="mt-2 inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-amber-900 hover:underline">See safety resources <ArrowRight className="h-4 w-4" /></a></div>
            ) : (
              <div className="grid items-center gap-4 sm:grid-cols-[180px_1fr]">
                <div className="flex min-h-[100px] flex-col items-center justify-center rounded-xl bg-brand-50 px-3 py-3 text-center sm:min-h-[115px]">
                  {step === 0 ? <Image src="/images/car-go.webp" alt="Illustrative vehicle, not an assigned trip" width={170} height={100} className="h-[60px] w-full object-contain mix-blend-multiply" /> : step === 1 ? <div className="relative h-[60px] w-[60px] overflow-hidden rounded-full"><Image src="/images/avatar-daniel.webp" alt="Illustrative driver portrait, not a real assignment" fill sizes="60px" className="object-cover" /></div> : <Icon className="h-10 w-10 text-brand-600" strokeWidth={1.5} />}
                  <p className="mt-2 hidden text-[0.7rem] font-bold sm:block">{current.label}</p>
                  {step === 3 && <p aria-label="Illustrative PIN placeholder" className="mt-1 text-xl tracking-[0.35em] text-brand-600">••••</p>}
                  <p className="sr-only">{current.detail}</p>
                </div>
                <div><p className="text-[0.65rem] font-semibold text-brand-600">Step {step + 1} of 4</p><h3 className="mt-1 text-xl font-extrabold tracking-tight">{current.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted">{current.text}</p><p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-muted"><CircleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />{current.note}</p></div>
              </div>
            )}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
            <button type="button" onClick={() => mismatch ? restart() : setStep(s => Math.max(0, s - 1))} disabled={!mismatch && step === 0} className={`${actionClass} text-muted hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40`}><ArrowLeft className="h-3.5 w-3.5" />Back</button>
            <button type="button" onClick={() => mismatch || step === 3 ? restart() : setStep(s => s + 1)} className={`${actionClass} bg-brand-600 text-white hover:bg-brand-700`}>{mismatch || step === 3 ? "Restart guide" : step === 2 ? "Show Match Check example" : "Next step"}{mismatch || step === 3 ? <RotateCcw className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}</button>
          </div>
          {!mismatch && step < 3 && <button type="button" onClick={() => setMismatch(true)} className="mt-1 inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-amber-800 hover:underline"><TriangleAlert className="h-3.5 w-3.5" />Something doesn’t match</button>}
          <details className="mt-2 border-t border-slate-100 text-[0.7rem] leading-relaxed text-muted"><summary className="min-h-11 cursor-pointer py-3 font-semibold">What if my driver or car changes?</summary><p>Previous checks and PIN no longer apply. Start again with the new assignment.</p><button type="button" onClick={() => restart(true)} className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-brand-600 hover:underline"><RotateCcw className="h-3.5 w-3.5" />Try reassignment</button></details>
          <p role="status" className="sr-only">{reassigned ? "Reassignment example: previous Match Check and PIN invalidated. Start again at vehicle review." : ""}</p>
        </div>
      </div>
    </section>
  );
}

export function SafetyScenarios() {
  const [active, setActive] = useState(0);
  const id = useId();
  const scenario = safetyScenarios[active];
  const icons = [CarFront, Route, TriangleAlert, Wrench, CreditCard];
  return (
    <section id="situations" aria-label="Situation-specific safety guidance" className="scroll-mt-24 py-8 sm:py-10">
      <div className="container-page grid gap-6 lg:grid-cols-[260px_1fr] lg:gap-10">
        <SectionIntro eyebrow="What if something goes wrong?" title="The right help. At the right moment." text="Choose a situation for a practical next step. In immediate danger, seek emergency help first." />
        <div>
          <div aria-label="Choose a safety situation" className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">{safetyScenarios.map((item, i) => { const Icon = icons[i]; return <button type="button" key={item.title} aria-pressed={active === i} aria-controls={`${id}-guidance`} onClick={() => setActive(i)} className={`flex min-h-[52px] items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-xs font-semibold transition ${active === i ? "border-brand-600 bg-brand-50 text-brand-700" : "border-slate-200 hover:border-brand-200"}`}><Icon className={`h-4 w-4 shrink-0 ${item.urgent ? "text-red-600" : "text-brand-600"}`} />{item.title}<ArrowRight className="ml-auto h-3.5 w-3.5 shrink-0" /></button>; })}</div>
          <div id={`${id}-guidance`} aria-live="polite" aria-atomic="true" className={`mt-3 rounded-2xl p-5 ${scenario.urgent ? "bg-red-50" : "bg-surface"}`}><h3 className="text-base font-bold">{scenario.lead}</h3><p className="mt-2 text-[0.8rem] leading-relaxed text-muted">{scenario.text}</p><a href="#safety-resources" className="mt-1 inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-brand-600 hover:underline">Help & resources <ArrowRight className="h-3.5 w-3.5" /></a></div>
        </div>
      </div>
    </section>
  );
}

export function SafetyPeople() {
  const [active, setActive] = useState(0);
  const id = useId();
  const audience = safetyAudiences[active];
  return (
    <section id="people" aria-label="Safety for different people" className="scroll-mt-24 border-t border-slate-100 py-8 sm:py-10">
      <div className="container-page grid gap-6 lg:grid-cols-[260px_1fr] lg:gap-10">
        <SectionIntro eyebrow="Safety for different people" title="Different needs. The same care." text="Guidance for the part you play in a journey. Access always depends on consent and permissions." />
        <div>
          <div className="hidden sm:block">
            <div className="flex flex-wrap gap-2" aria-label="Choose an audience">{safetyAudiences.map((item, i) => <button key={item.title} type="button" aria-pressed={active === i} aria-controls={`${id}-audience`} onClick={() => setActive(i)} className={`min-h-11 rounded-full border px-4 text-xs font-semibold transition ${active === i ? "border-brand-600 bg-brand-600 text-white" : "border-slate-200 hover:border-brand-200"}`}>{item.title}</button>)}</div>
            <div id={`${id}-audience`} className="mt-4 flex items-center gap-5 rounded-2xl bg-surface p-4">
              {audience.image ? <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl"><Image src={audience.image} alt={`Conceptual photograph for ${audience.title.toLowerCase()} guidance`} fill sizes="96px" className="object-cover" /></div> : <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-brand-100"><Users className="h-9 w-9 text-brand-600" strokeWidth={1.5} /></span>}
              <div aria-live="polite"><h3 className="text-base font-bold">{audience.title}</h3><p className="mt-2 max-w-2xl text-[0.8rem] leading-relaxed text-muted">{audience.text}</p></div>
            </div>
          </div>
          <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 px-4 sm:hidden">{safetyAudiences.map((item, i) => <details key={item.title} name="safety-audience" open={i === 0 ? true : undefined} className="group"><summary className="flex min-h-12 cursor-pointer list-none items-center justify-between text-sm font-bold [&::-webkit-details-marker]:hidden">{item.title}<ChevronDown className="h-4 w-4 text-brand-600 transition group-open:rotate-180" /></summary><p className="pb-4 text-[0.8rem] leading-relaxed text-muted">{item.text}</p></details>)}</div>
          <p className="mt-3 text-[0.65rem] leading-relaxed text-muted">Educational guidance only. Selecting an audience does not grant account access or confirm a service is available.</p>
        </div>
      </div>
    </section>
  );
}
