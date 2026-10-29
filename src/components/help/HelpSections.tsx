import {
  ArrowRight,
  BookOpen,
  Building,
  Car,
  ChartColumn,
  ChevronRight,
  CircleX,
  ClipboardCheck,
  CreditCard,
  Gauge,
  Headset,
  ShieldAlert,
  ShoppingBag,
  Smartphone,
  Truck,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  articlePath,
  guidedSteps,
  helpAreaPath,
  helpAreas,
  helpArticles,
  helpContactPath,
  helpRequestsPath,
  helpSafetyPath,
  type HelpArea,
} from "@/lib/help";
import { HelpSearch } from "./HelpSearch";

const areaIcons: Record<HelpArea, LucideIcon> = { riders: Car, drivers: Gauge, business: Building, fleet: Truck };

const topicIcons: Record<string, { icon: LucideIcon; tone: string }> = {
  "charged-incorrectly": { icon: CreditCard, tone: "bg-brand-50 text-brand-700" },
  "cancel-a-ride": { icon: CircleX, tone: "bg-red-50 text-red-600" },
  "account-verification": { icon: UserRound, tone: "bg-brand-50 text-brand-700" },
  "lost-item": { icon: ShoppingBag, tone: "bg-violet-50 text-violet-700" },
  "driver-earnings-issue": { icon: ChartColumn, tone: "bg-emerald-50 text-emerald-700" },
  "business-ride-approval": { icon: Building, tone: "bg-violet-50 text-violet-700" },
};

/** Homepage-style header row, scaled down for a utility page. */
function SectionHeader({ id, title, text, action }: { id: string; title: string; text: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
      <div>
        <h2 id={id} className="text-[1.75rem] leading-tight font-extrabold tracking-[-0.03em]">
          {title}
        </h2>
        <p className="mt-1.5 text-[0.92rem] text-muted">{text}</p>
      </div>
      {action}
    </div>
  );
}

/** 01–02: compact search hero with the priority actions beside it. No photography. */
export function HelpHero() {
  const actions = [
    { title: "Track a support request", text: "Sign in to view and manage your requests.", href: helpRequestsPath, icon: ClipboardCheck },
    { title: "Contact support", text: "Channels available in your region.", href: helpContactPath, icon: Headset },
  ];

  return (
    <section aria-labelledby="help-title" className="bg-gradient-to-b from-surface to-white">
      <div className="container-page grid grid-cols-1 gap-8 pt-14 pb-6 lg:grid-cols-[1fr_380px] lg:items-center lg:gap-16 lg:pt-20">
        <div>
          <p className="eyebrow text-brand-600">Help Center</p>
          <h1 id="help-title" className="heading-xl mt-4">
            What can we
            <br />
            help you with?
          </h1>
          <p className="mt-4 max-w-lg text-[0.95rem] leading-relaxed text-muted">
            Find answers, manage an issue or get directed to the right support channel.
          </p>
          <HelpSearch />
        </div>

        <div className="flex flex-col gap-3">
          {/* Safety guidance only — this is not an emergency dispatch button. */}
          <Link href={helpSafetyPath} className="group flex items-center gap-4 rounded-[1.5rem] bg-red-50 p-5 transition hover:bg-red-100/70">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-600 text-white">
              <ShieldAlert className="h-5 w-5" />
            </span>
            <span className="flex-1">
              <span className="block text-[0.95rem] font-bold">Safety help</span>
              <span className="block text-[0.8rem] text-muted">Urgent safety concern? Get the right guidance now.</span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-red-600 transition group-hover:translate-x-0.5" />
          </Link>

          <ul className="divide-y divide-slate-100 rounded-[1.5rem] border border-slate-100 bg-white">
            {actions.map(({ title, text, href, icon: Icon }) => (
              <li key={href}>
                <Link href={href} className="group flex items-center gap-4 p-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-[0.95rem] font-bold group-hover:text-brand-600">{title}</span>
                    <span className="block text-[0.8rem] text-muted">{text}</span>
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-brand-600 transition group-hover:translate-x-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/** 03: role-specific entry points — tiles on larger screens, concise rows on mobile. */
export function SupportAreas() {
  return (
    <section aria-labelledby="areas-title">
      <div className="container-page">
        <SectionHeader id="areas-title" title="Browse by support area" text="Choose your role to find relevant topics and resources." />

        <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {helpAreas.map((a) => {
            const Icon = areaIcons[a.id];
            return (
              <li key={a.id}>
                <Link
                  href={helpAreaPath(a.id)}
                  className={`group grid h-full grid-cols-[auto_1fr_auto] items-center gap-x-3 rounded-2xl p-4 transition hover:-translate-y-0.5 sm:grid-cols-[1fr_auto] sm:content-start sm:gap-y-1 sm:rounded-[1.75rem] sm:p-7 ${a.tone}`}
                >
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl sm:col-span-2 sm:mb-8 sm:h-12 sm:w-12 sm:rounded-2xl ${a.iconTone}`}>
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </span>
                  <span className="text-[0.95rem] font-bold sm:text-lg">{a.title}</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-brand-600 transition group-hover:translate-x-0.5">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                  <span className="hidden text-[0.82rem] leading-relaxed text-muted sm:col-span-2 sm:block">{a.text}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/** 04: editorially ordered frequent issues, as a clean divided list rather than a wall of cards. */
export function PopularTopics() {
  return (
    <section id="popular-topics" aria-labelledby="topics-title" className="scroll-mt-24">
      <div className="container-page">
        <SectionHeader
          id="topics-title"
          title="Popular help topics"
          text="Get quick answers to common questions."
          action={
            <Link href="/help/articles" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition-all hover:gap-3">
              View all topics <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />

        <ul className="mt-6 grid grid-cols-1 gap-x-10 md:grid-cols-2 lg:grid-cols-3">
          {helpArticles
            .filter((a) => a.popular)
            .map((a) => {
              const { icon: Icon, tone } = topicIcons[a.slug] ?? { icon: BookOpen, tone: "bg-brand-50 text-brand-700" };
              return (
                <li key={a.slug} className="border-b border-slate-100">
                  <Link href={articlePath(a.slug)} className="group flex items-center gap-4 py-5">
                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tone}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="flex-1">
                      <span className="block text-[0.92rem] font-bold group-hover:text-brand-600">{a.title}</span>
                      <span className="block text-[0.8rem] text-muted">{a.summary}</span>
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-brand-600 transition group-hover:translate-x-0.5" />
                  </Link>
                </li>
              );
            })}
        </ul>
      </div>
    </section>
  );
}

/** 05–06: guided troubleshooting preview beside request tracking. Cases are never shown publicly. */
export function GuidedHelpAndRequests() {
  return (
    <section aria-label="Guided help and support requests">
      <div className="container-page grid grid-cols-1 gap-5 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-[2rem] bg-surface p-7 sm:p-10">
          <p className="eyebrow text-brand-600">Guided help</p>
          <h2 className="mt-3 text-[1.75rem] leading-tight font-extrabold tracking-[-0.03em]">Unexpected charge on my trip?</h2>
          <p className="mt-2 max-w-md text-[0.92rem] leading-relaxed text-muted">
            Review your receipt, check the charges and request a fare review if you still need one.
          </p>
          <ol className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {guidedSteps.map((s, i) => (
              <li key={s} className="flex items-center gap-3 text-[0.85rem] font-medium">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[0.75rem] font-bold text-brand-600">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>
          <Link
            href={articlePath("charged-incorrectly")}
            className="mt-8 inline-flex h-11 items-center gap-2 rounded-full bg-brand-600 px-6 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            View step-by-step guide <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex flex-col rounded-[2rem] border border-slate-100 p-7 sm:p-10">
          <p className="eyebrow text-brand-600">Your support requests</p>
          <h2 className="mt-3 text-[1.75rem] leading-tight font-extrabold tracking-[-0.03em]">Following up on an issue?</h2>
          <p className="mt-2 text-[0.92rem] leading-relaxed text-muted">
            Sign in to see updates, respond to requests and check the outcome. Request details are only shown to you.
          </p>
          <div className="action-pair mt-auto flex flex-wrap gap-3 pt-8">
            <Link
              href={`/sign-in?next=${encodeURIComponent(helpRequestsPath)}`}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-white transition hover:bg-black"
            >
              Sign in to track <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#popular-topics"
              className="inline-flex h-11 items-center rounded-full border border-slate-200 px-6 text-sm font-semibold transition hover:border-ink"
            >
              Continue as guest
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/** 07: closing escalation band — routes only, no invented numbers, emails or hours. */
export function MoreHelp() {
  const options = [
    { title: "Help articles", text: "Search our knowledge base.", href: "/help/articles", icon: BookOpen, safety: false },
    { title: "Contact support", text: "Channels available in your region.", href: helpContactPath, icon: Headset, safety: false },
    { title: "Safety help", text: "For urgent safety concerns.", href: helpSafetyPath, icon: ShieldAlert, safety: true },
    { title: "App support", text: "Help within the Sanga app.", href: "/help/app", icon: Smartphone, safety: false },
  ];

  return (
    <section aria-labelledby="more-help-title">
      <div className="container-page">
        <div className="rounded-[2rem] bg-navy-950 px-7 py-12 text-white sm:px-10 lg:px-14 lg:py-14">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
            <h2 id="more-help-title" className="heading-lg">
              Need more help?
            </h2>
            <p className="max-w-md text-[0.95rem] text-white/75">Choose a support option based on your issue.</p>
          </div>
          <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {options.map(({ title, text, href, icon: Icon, safety }) => (
              <li key={title}>
                <Link href={href} className="group flex h-full items-center gap-4 rounded-2xl bg-white/[0.06] p-5 transition hover:bg-white/[0.12]">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${safety ? "bg-red-600" : "bg-white/10"}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-[0.92rem] font-bold">{title}</span>
                    <span className="block text-[0.78rem] text-white/65">{text}</span>
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-white/60 transition group-hover:translate-x-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
