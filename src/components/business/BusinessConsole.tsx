"use client";

import {
  BarChart3,
  Car,
  ClipboardCheck,
  CreditCard,
  Download,
  LayoutDashboard,
  ScrollText,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { businessDemo, policyExample, type BusinessDemo } from "@/lib/business";
import type { CountryCode } from "@/lib/content";
import { moneyFormatter } from "@/lib/format";
import { useMarket } from "../Market";
import { Logo } from "../icons";
import { StatusPill } from "../StatusPill";

// Static, fictional demo of the Business Console. Nothing here reads or writes real data (spec §4, §5).

type Money = (n: number) => string;
type ModuleProps = { demo: BusinessDemo; money: Money; market: CountryCode };

const modules: { id: string; label: string; icon: LucideIcon; Panel: (p: ModuleProps) => ReactNode }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, Panel: OverviewPanel },
  { id: "rides", label: "Rides", icon: Car, Panel: RidesPanel },
  { id: "people", label: "People", icon: Users, Panel: PeoplePanel },
  { id: "policies", label: "Policies", icon: ScrollText, Panel: PoliciesPanel },
  { id: "approvals", label: "Approvals", icon: ClipboardCheck, Panel: ApprovalsPanel },
  { id: "billing", label: "Billing", icon: CreditCard, Panel: BillingPanel },
  { id: "reports", label: "Reports", icon: BarChart3, Panel: ReportsPanel },
];


export function BusinessConsole() {
  const id = useId();
  const { market } = useMarket();
  const demo = businessDemo[market];
  const money = moneyFormatter(demo.locale, demo.currency).format;
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const { Panel } = modules[active];

  function onKeyDown(e: KeyboardEvent) {
    const keys: Record<string, number> = { ArrowDown: active + 1, ArrowRight: active + 1, ArrowUp: active - 1, ArrowLeft: active - 1, Home: 0, End: modules.length - 1 };
    if (!(e.key in keys)) return;
    e.preventDefault();
    const i = (keys[e.key] + modules.length) % modules.length;
    setActive(i);
    tabs.current[i]?.focus();
  }

  return (
    <div id="platform" className="scroll-mt-24 overflow-hidden rounded-[1.25rem] bg-white text-ink shadow-panel ring-1 ring-slate-200/70">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
        <Logo className="origin-left scale-75" />
        <span className="flex items-center gap-2">
          <span className="hidden text-[0.72rem] text-muted sm:inline">{demo.company}</span>
          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[0.66rem] font-bold tracking-wide text-amber-900 uppercase">Demo preview</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[150px_1fr]">
        <div
          role="tablist"
          aria-label="Console modules"
          onKeyDown={onKeyDown}
          className="scrollbar-none flex gap-1 overflow-x-auto border-b border-slate-100 p-2 lg:flex-col lg:overflow-visible lg:border-r lg:border-b-0"
        >
          {modules.map((m, i) => {
            const selected = i === active;
            return (
              <button
                key={m.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                id={`${id}-tab-${m.id}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`${id}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(i)}
                className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-[0.78rem] font-semibold transition ${
                  selected ? "bg-brand-600 text-white" : "text-muted hover:bg-surface hover:text-ink"
                }`}
              >
                <m.icon className="h-4 w-4" />
                {m.label}
              </button>
            );
          })}
        </div>

        <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${modules[active].id}`} className="min-h-[360px] p-4 sm:p-5">
          {/* Keyed so per-module demo state (e.g. approvals) resets when the market changes. */}
          <Panel key={market} demo={demo} money={money} market={market} />
          <p className="mt-4 text-[0.68rem] text-muted">Fictional organisation and data. Changes here are not saved.</p>
        </div>
      </div>
    </div>
  );
}

function PanelTitle({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
      <h3 className="text-[0.95rem] font-bold">{children}</h3>
      {aside && <span className="text-[0.72rem] text-muted">{aside}</span>}
    </div>
  );
}

function Rows({ children }: { children: ReactNode }) {
  return <ul className="divide-y divide-slate-100 rounded-xl border border-slate-100 text-[0.78rem]">{children}</ul>;
}

function OverviewPanel({ demo, money }: ModuleProps) {
  const total = demo.costCentres.reduce((s, c) => s + c.amount, 0);
  const tiles = [
    ["Total rides", demo.totals.rides.toLocaleString(demo.locale)],
    ["Pending approvals", String(demo.approvals.length)],
    ["Total spend", money(total)],
    ["Policy exceptions", String(demo.totals.exceptions)],
  ];
  return (
    <>
      <PanelTitle aside={demo.period}>Overview</PanelTitle>
      <dl className="grid grid-cols-2 gap-2.5 xl:grid-cols-4">
        {tiles.map(([k, v]) => (
          <div key={k} className="rounded-xl border border-slate-100 p-3">
            <dt className="text-[0.7rem] text-muted">{k}</dt>
            <dd className="mt-1 text-lg font-extrabold tracking-tight">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1.4fr]">
        <div className="rounded-xl border border-slate-100 p-3">
          <p className="text-[0.75rem] font-bold">Spend by cost centre</p>
          <ul className="mt-3 space-y-2.5">
            {demo.costCentres.map((c) => (
              <li key={c.name} className="text-[0.72rem]">
                <span className="flex justify-between">
                  <span>{c.name}</span>
                  <span className="font-semibold tabular-nums">{money(c.amount)}</span>
                </span>
                <span className="mt-1 block h-1.5 rounded-full bg-brand-50">
                  <span className="block h-full rounded-full bg-brand-500" style={{ width: `${(c.amount / total) * 100}%` }} />
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-2 text-[0.75rem] font-bold">Recent ride requests</p>
          <Rows>
            {demo.requests.map((r) => (
              <li key={r.traveller} className="flex items-center justify-between gap-3 px-3 py-2">
                <span className="min-w-0">
                  <span className="block truncate font-semibold">{r.traveller}</span>
                  <span className="block truncate text-[0.7rem] text-muted">
                    {r.ride} · {r.from} → {r.to}
                  </span>
                </span>
                <span className="flex shrink-0 flex-col items-end gap-1">
                  <span className="font-semibold tabular-nums">{money(r.cost)}</span>
                  <StatusPill status={r.status} />
                </span>
              </li>
            ))}
          </Rows>
        </div>
      </div>
    </>
  );
}

function RidesPanel({ demo, money }: ModuleProps) {
  return (
    <>
      <PanelTitle aside="Only authorised roles see trip details">Rides</PanelTitle>
      <Rows>
        {demo.rides.map((r) => (
          <li key={r.traveller} className="flex items-center justify-between gap-3 px-3 py-2.5">
            <span className="min-w-0">
              <span className="block truncate font-semibold">
                {r.traveller} · {r.ride}
              </span>
              <span className="block truncate text-[0.7rem] text-muted">
                {r.route} · {r.when}
              </span>
            </span>
            <span className="flex shrink-0 flex-col items-end gap-1">
              <span className="font-semibold tabular-nums">{r.status === "Cancelled" ? "—" : money(r.cost)}</span>
              <StatusPill status={r.status} />
            </span>
          </li>
        ))}
      </Rows>
    </>
  );
}

function PeoplePanel({ demo }: ModuleProps) {
  return (
    <>
      <PanelTitle aside="Members join with their own Sanga account">People and roles</PanelTitle>
      <Rows>
        {demo.people.map((p) => (
          <li key={p.name} className="flex items-center justify-between gap-3 px-3 py-2.5">
            <span className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-[0.68rem] font-bold text-brand-700" aria-hidden="true">
                {p.name[0]}
              </span>
              <span className="min-w-0">
                <span className="block truncate font-semibold">{p.name}</span>
                <span className="block truncate text-[0.7rem] text-muted">
                  {p.role} · {p.team}
                </span>
              </span>
            </span>
            <StatusPill status={p.status} />
          </li>
        ))}
      </Rows>
      <p className="mt-3 rounded-xl bg-surface px-3 py-2.5 text-[0.72rem] text-muted">
        Guests aren&apos;t members. They get a ride and a tracking link for that trip only.
      </p>
    </>
  );
}

function PoliciesPanel({ money, market }: ModuleProps) {
  const { limit } = policyExample[market];
  const rules = [
    ["Allowed rides (employees)", "Go, Plus, XL"],
    ["Allowed rides (guests)", "Go, Plus"],
    ["Per-trip limit", `${money(limit)} — above this needs approval`],
    ["Working hours", "06:00–22:00 — outside needs approval"],
    ["Cost centre", "Required on every ride"],
  ];
  return (
    <>
      <PanelTitle aside="Example policy — not a default">Travel policy</PanelTitle>
      <dl className="divide-y divide-slate-100 rounded-xl border border-slate-100 text-[0.78rem]">
        {rules.map(([k, v]) => (
          <div key={k} className="flex flex-col gap-0.5 px-3 py-2.5 sm:flex-row sm:justify-between sm:gap-4">
            <dt className="text-muted">{k}</dt>
            <dd className="font-semibold sm:text-right">{v}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}

function ApprovalsPanel({ demo, money }: ModuleProps) {
  const [decisions, setDecisions] = useState<Record<string, "Approved" | "Declined">>({});
  return (
    <>
      <PanelTitle aside="Demo decisions — nothing is sent">Approvals</PanelTitle>
      <Rows>
        {demo.approvals.map((a) => {
          const decision = decisions[a.id];
          return (
            <li key={a.id} className="flex flex-col gap-2 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
              <span className="min-w-0">
                <span className="block font-semibold">
                  {a.traveller} · {a.ride} · {money(a.cost)}
                </span>
                <span className="block text-[0.7rem] text-muted">
                  {a.reason} · {a.team}
                </span>
              </span>
              {decision ? (
                <span className="flex items-center gap-2">
                  <StatusPill status={decision} />
                  <button
                    type="button"
                    onClick={() => setDecisions((d) => Object.fromEntries(Object.entries(d).filter(([k]) => k !== a.id)))}
                    className="text-[0.7rem] font-semibold text-brand-600 hover:underline"
                  >
                    Undo
                  </button>
                </span>
              ) : (
                <span className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setDecisions((d) => ({ ...d, [a.id]: "Declined" }))}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-[0.72rem] font-semibold hover:border-ink"
                  >
                    Decline
                  </button>
                  <button
                    type="button"
                    onClick={() => setDecisions((d) => ({ ...d, [a.id]: "Approved" }))}
                    className="rounded-lg bg-brand-600 px-3 py-1.5 text-[0.72rem] font-semibold text-white hover:bg-brand-700"
                  >
                    Approve
                  </button>
                </span>
              )}
            </li>
          );
        })}
      </Rows>
    </>
  );
}

function BillingPanel({ demo, money }: ModuleProps) {
  return (
    <>
      <PanelTitle aside="Billing options depend on market and agreement">Billing</PanelTitle>
      <Rows>
        {demo.billing.map((b) => (
          <li key={b.ref} className="flex items-center justify-between gap-3 px-3 py-2.5">
            <span className="min-w-0">
              <span className="block truncate font-semibold">{b.label}</span>
              <span className="block text-[0.7rem] text-muted">{b.ref}</span>
            </span>
            <span className="flex shrink-0 flex-col items-end gap-1">
              <span className="font-semibold tabular-nums">{money(b.amount)}</span>
              <StatusPill status={b.status} />
            </span>
          </li>
        ))}
      </Rows>
      <p className="mt-3 rounded-xl bg-surface px-3 py-2.5 text-[0.72rem] text-muted">
        Failed payments and adjustments stay visible until they&apos;re resolved.
      </p>
    </>
  );
}

function ReportsPanel({ demo, money }: ModuleProps) {
  const max = Math.max(...demo.monthly.map((m) => m.amount));
  return (
    <>
      <PanelTitle aside="Finance and admin roles only">Reports</PanelTitle>
      <div className="rounded-xl border border-slate-100 p-4">
        <p className="text-[0.75rem] font-bold">Monthly spend</p>
        <ul className="mt-4 flex h-36 items-end gap-6" aria-label="Monthly spend, demo data">
          {demo.monthly.map((m) => (
            <li key={m.month} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
              <span className="text-[0.68rem] font-semibold tabular-nums">{money(m.amount)}</span>
              <span className="w-full max-w-12 rounded-t-md bg-brand-500" style={{ height: `${(m.amount / max) * 70}%` }} aria-hidden="true" />
              <span className="text-[0.7rem] text-muted">{m.month}</span>
            </li>
          ))}
        </ul>
      </div>
      <button
        type="button"
        disabled
        className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-[0.72rem] font-semibold text-muted disabled:cursor-not-allowed"
      >
        <Download className="h-3.5 w-3.5" /> Export (not available in demo)
      </button>
    </>
  );
}
