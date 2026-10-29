"use client";

import { ArrowDown, ArrowRight, CarFront, FileText, Fingerprint, HeartHandshake, LockKeyhole, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { safetyMarkets, safetyPrivacy } from "@/lib/safety";
import { countries } from "@/lib/content";
import { MarketToggle, useMarket } from "../Market";

export function SafetyHero() {
  return (
    <section aria-labelledby="safety-title" className="relative isolate overflow-hidden bg-navy-950">
      <Image src="/images/safety-hero.webp" alt="Illustrative scene of a woman checking her pickup beside a car and driver" fill preload sizes="100vw" className="-z-20 object-cover object-[64%_center] lg:object-[center_25%]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950/95 via-navy-950/75 to-navy-950/10" />
      <div className="container-page py-10 sm:py-12">
        <div className="max-w-[540px] text-white">
          <p className="eyebrow text-white/75">Sanga safety</p>
          <h1 id="safety-title" className="mt-3 text-[2.5rem] leading-[1.04] font-extrabold tracking-[-0.04em] sm:text-[3.25rem]">
            Every journey<br />deserves <span className="text-brand-400">more<br className="hidden sm:block" /> than a promise.</span>
          </h1>
          <p className="mt-4 max-w-[400px] text-sm leading-relaxed text-white/85 sm:text-[0.95rem]">From checking your pickup to reporting a concern, explore the tools and processes we’re building around your journey.</p>
          <ul className="mt-6 flex max-w-md flex-wrap gap-x-4 gap-y-3 text-[0.7rem] font-medium text-white/90 sm:text-xs">
            {[{ Icon: CarFront, text: "Pickup checks" }, { Icon: MapPin, text: "Trip sharing" }, { Icon: HeartHandshake, text: "Incident guidance" }].map(({ Icon, text }) => (
              <li key={text} className="flex items-center gap-2"><Icon className="h-4 w-4 text-brand-200" />{text}</li>
            ))}
          </ul>
          <div className="action-pair mt-7 flex flex-wrap gap-3">
            <a href="#safety-journey" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-600 px-4 text-xs font-semibold transition hover:bg-brand-700 sm:gap-3 sm:px-5 sm:text-sm">See how it works <ArrowDown className="h-4 w-4" /></a>
            <a href="#safety-resources" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/40 px-4 text-xs font-semibold transition hover:bg-white/10 sm:gap-3 sm:px-5 sm:text-sm">Safety resources <ArrowRight className="h-4 w-4" /></a>
          </div>
          <p className="mt-5 text-[0.65rem] text-white/65">Illustrative imagery. Features depend on launch status and location.</p>
        </div>
      </div>
    </section>
  );
}

export function SafetyPrivacy() {
  const { market } = useMarket();
  const icons = [FileText, MessageCircle, LockKeyhole];
  return (
    <section id="privacy" aria-labelledby="privacy-title" className="scroll-mt-24 bg-navy-950 py-9 text-white sm:py-11">
      <div className="container-page">
        <div className="grid gap-7 lg:grid-cols-[260px_1fr] lg:gap-10">
          <div><p className="eyebrow text-brand-200">Privacy & accountability</p><h2 id="privacy-title" className="mt-2 text-2xl leading-tight font-extrabold tracking-tight">Responsible.<br />People-focused.</h2><p className="mt-3 text-sm leading-relaxed text-white/65">Understand how information supports a safety review.</p></div>
          <div className="grid gap-6 sm:grid-cols-3">
            {safetyPrivacy.map((item, i) => { const Icon = icons[i]; return <div key={item.title}><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10"><Icon className="h-5 w-5 text-brand-200" /></span><h3 className="mt-3 text-sm font-bold">{item.title}</h3><p className="mt-2 text-[0.8rem] leading-relaxed text-white/70">{item.text}</p></div>; })}
          </div>
        </div>
        <details className="mt-7 border-t border-white/15 pt-1 text-[0.8rem]">
          <summary className="min-h-11 cursor-pointer py-3 font-semibold text-white/85">Privacy notices, your rights & audio protection</summary>
          <div className="max-w-3xl space-y-2 pb-3 leading-relaxed text-white/65"><p>{safetyMarkets[market].privacy} Retention periods and rights procedures must follow that notice.</p><p>Trip Audio Protection is proposed, not confirmed as live here. It does not mean continuous listening. Any release needs applicable consent, recording, access and retention rules.</p></div>
        </details>
      </div>
    </section>
  );
}

export function SafetyResources() {
  const { market } = useMarket();
  return (
    <section id="safety-resources" aria-labelledby="resources-title" className="scroll-mt-24 py-9 sm:py-11">
      <div className="container-page grid items-start gap-6 lg:grid-cols-[260px_1fr] lg:gap-10">
        <div><p className="eyebrow text-brand-600">Keep these close</p><h2 id="resources-title" className="mt-2 text-2xl font-extrabold tracking-tight">A clearer next step.</h2></div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link href="/help" className="group flex min-h-24 items-center gap-4 rounded-2xl border border-slate-200 p-5 transition hover:border-brand-400 hover:bg-brand-50"><MessageCircle className="h-6 w-6 shrink-0 text-brand-600" /><span><span className="block text-sm font-bold">Visit the Help Center</span><span className="mt-1 block text-xs leading-relaxed text-muted">Browse the available support overview.</span></span><ArrowRight className="ml-auto h-4 w-4 shrink-0 transition group-hover:translate-x-1" /></Link>
          <div className="flex gap-4 rounded-2xl bg-surface p-5"><ShieldCheck className="h-6 w-6 shrink-0 text-brand-600" /><div><h3 className="text-sm font-bold">Need urgent help?</h3><p className="mt-1 text-xs leading-relaxed text-muted">Contact local emergency services for immediate danger. This website cannot send emergency assistance.</p></div></div>
          <p className="flex items-start gap-2 text-xs leading-relaxed text-muted sm:col-span-2"><Fingerprint className="mt-0.5 h-4 w-4 shrink-0" />Verified {countries[market].name} safety contacts and privacy documents are not published here yet. Use supported channels in the app where available; this page does not accept reports.</p>
        </div>
      </div>
    </section>
  );
}

export function SafetyMarketNote() {
  const { market } = useMarket();
  return <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5 [&_button]:min-h-11"><MarketToggle label="Safety guidance market" /><p role="status" className="max-w-md text-xs leading-relaxed text-muted">{safetyMarkets[market].status}</p></div>;
}
