import { ArrowRight, BadgeCheck, CircleAlert, CreditCard, KeyRound, LifeBuoy, ShieldAlert, Wrench } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

const issueTypes = [
  { icon: CircleAlert, label: "Safety concern" },
  { icon: CreditCard, label: "Payment question" },
  { icon: Wrench, label: "Vehicle breakdown" },
];

// Scenario-led and deliberately careful: no 24/7, response-time or monitoring promises (spec DR-05).
const scenarios: { icon: typeof BadgeCheck; title: string; scenario: string; text: string; visual: ReactNode }[] = [
  {
    icon: BadgeCheck,
    title: "Match Check",
    scenario: "Is this the right car?",
    text: "Riders confirm the assigned driver and vehicle before the Trip PIN. You see when it's done.",
    visual: (
      <span className="flex flex-col items-center gap-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white">
          <BadgeCheck className="h-5 w-5" />
        </span>
        <span className="text-[0.72rem] font-semibold">Match confirmed</span>
      </span>
    ),
  },
  {
    icon: KeyRound,
    title: "Trip PIN",
    scenario: "Who's getting in?",
    text: "A trip starts only after Sanga verifies the Trip PIN, with set recovery steps if you're offline.",
    visual: (
      <span className="grid grid-cols-4 gap-1.5">
        {["4", "1", "8", "7"].map((d, i) => (
          <span key={i} className="flex h-10 w-8 items-center justify-center rounded-lg bg-white/10 text-lg font-extrabold">
            {d}
          </span>
        ))}
      </span>
    ),
  },
  {
    icon: ShieldAlert,
    title: "SOS and emergency tools",
    scenario: "Something feels unsafe.",
    text: "Where SOS is enabled, get help quickly from the app. How emergencies are escalated depends on your location.",
    visual: (
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-sm font-extrabold ring-8 ring-red-600/25">SOS</span>
    ),
  },
  {
    icon: LifeBuoy,
    title: "Report an issue",
    scenario: "A dispute, breakdown or incident.",
    text: "Open a structured report from the app so the details are kept together and the case can be followed up.",
    visual: (
      <ul className="w-full max-w-[11rem] space-y-1.5 text-[0.7rem] font-semibold">
        {issueTypes.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-2 rounded-lg bg-white/10 px-2.5 py-1.5">
            <Icon className="h-3.5 w-3.5 text-brand-200" /> {label}
          </li>
        ))}
      </ul>
    ),
  },
];

/** DR-05 "Protection on the road"; policy detail lives on /safety. */
export function DriveProtection() {
  return (
    <section aria-labelledby="protection-title">
      <div className="container-page grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,280px)_1fr] lg:gap-12">
        <div>
          <p className="eyebrow text-brand-600">Protection on the road</p>
          <h2 id="protection-title" className="heading-lg mt-3">
            Drive with greater confidence.
          </h2>
          <p className="mt-4 text-[0.95rem] leading-relaxed text-muted">
            Safety tools and support designed for real situations on the road. Some features vary by market.
          </p>
          <Link
            href="/safety"
            className="mt-7 inline-flex h-11 items-center gap-2 rounded-xl border border-brand-600 px-5 text-sm font-semibold text-brand-600 transition hover:bg-brand-50"
          >
            Learn about safety <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {scenarios.map(({ icon: Icon, title, scenario, text, visual }) => (
            <li key={title} className="flex flex-col overflow-hidden rounded-[1.5rem] border border-slate-100 bg-white shadow-card">
              <div className="flex-1 p-5">
                <span className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <h3 className="text-[0.95rem] leading-tight font-bold">{title}</h3>
                </span>
                <p className="mt-3 text-[0.82rem] font-semibold">{scenario}</p>
                <p className="mt-1 text-[0.82rem] leading-relaxed text-muted">{text}</p>
              </div>
              <div aria-hidden="true" className="flex h-32 items-center justify-center bg-navy-900 text-white">
                {visual}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
