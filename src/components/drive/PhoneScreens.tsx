import { Check, CornerUpRight, Navigation, ShieldCheck, Star, Wallet } from "lucide-react";
import type { ReactNode } from "react";

// Conceptual Driver app states for the walkthrough, built in code rather than generated images.
// Replace with approved, redacted Driver app screenshots before publication (spec §4, §14.4).
// One consistent sample: ₦6,000 fare, 15% example fee (₦900), ₦5,100 trip earnings.

export function PhoneFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-[1.9rem] bg-navy-950 p-1.5 shadow-panel ${className}`}>
      <div className="relative flex aspect-[9/18] flex-col overflow-hidden rounded-[1.5rem] bg-white text-ink">
        <span className="absolute top-1.5 left-1/2 z-10 h-3.5 w-14 -translate-x-1/2 rounded-full bg-navy-950" aria-hidden="true" />
        {children}
      </div>
    </div>
  );
}

function MiniMap({ dark = false, className = "" }: { dark?: boolean; className?: string }) {
  const road = dark ? "#1e3a6b" : "#ffffff";
  return (
    <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" className={`h-full w-full ${className}`} aria-hidden="true">
      <rect width="200" height="200" fill={dark ? "#0d1b38" : "#e6edf8"} />
      <g stroke={road} strokeWidth="9" fill="none">
        <path d="M-10 60 H210" />
        <path d="M-10 140 H210" />
        <path d="M60 -10 V210" />
        <path d="M150 -10 V210" />
      </g>
      <g stroke={road} strokeWidth="4" fill="none" opacity=".8">
        <path d="M-10 100 L210 30" />
        <path d="M100 -10 V210" />
      </g>
      <path d="M60 180 V140 H150 V60 H118" stroke="#1d5fff" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="60" cy="180" r="7" fill="#1d5fff" stroke="#fff" strokeWidth="3" />
      <circle cx="118" cy="60" r="7" fill="#ef4444" stroke="#fff" strokeWidth="3" />
    </svg>
  );
}

function StatusBar({ light = false }: { light?: boolean }) {
  return <div className={`h-6 shrink-0 px-4 pt-1.5 text-[0.55rem] font-bold ${light ? "text-white" : ""}`}>9:41</div>;
}

export function RequestScreen() {
  return (
    <>
      <div className="relative flex-1">
        <MiniMap className="absolute inset-0" />
        <div className="relative">
          <StatusBar />
        </div>
      </div>
      <div className="-mt-6 space-y-2 rounded-t-2xl bg-white p-3 shadow-[0_-8px_24px_-12px_rgb(13_27_56/0.3)]">
        <p className="text-[0.6rem] font-bold text-brand-600">New trip request</p>
        <p className="text-[0.62rem] text-muted">1.2 km · 6 min to pickup</p>
        <p className="text-[0.66rem] font-semibold">Victoria Island, Lagos</p>
        <div className="flex items-end justify-between">
          <p className="text-[1.05rem] leading-none font-extrabold">₦6,000</p>
          <span className="flex items-center gap-0.5 text-[0.55rem] font-semibold text-muted">
            <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" /> 4.9 rider
          </span>
        </div>
        <p className="text-[0.55rem] text-muted">Estimated fare · Sanga Go</p>
        <div className="h-1 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full w-2/3 rounded-full bg-brand-500" />
        </div>
        <p className="text-[0.52rem] text-muted">Offer expires in 12s</p>
        <div className="grid grid-cols-2 gap-1.5 pt-0.5">
          <span className="rounded-lg border border-slate-200 py-1.5 text-center text-[0.6rem] font-semibold">Decline</span>
          <span className="rounded-lg bg-brand-600 py-1.5 text-center text-[0.6rem] font-semibold text-white">Accept</span>
        </div>
      </div>
    </>
  );
}

export function VerifyScreen() {
  return (
    <>
      <StatusBar />
      <div className="flex flex-1 flex-col px-3 pb-3">
        <p className="text-center text-[0.7rem] font-bold">Verify pickup</p>
        <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2 py-1.5 text-[0.55rem] font-semibold text-emerald-800">
          <Check className="h-3 w-3 shrink-0" /> Rider completed Match Check
        </div>
        <p className="mt-3 text-[0.6rem] font-semibold">Enter the rider&apos;s Trip PIN</p>
        <div className="mt-1.5 grid grid-cols-4 gap-1.5">
          {["4", "1", "8", "7"].map((d, i) => (
            <span key={i} className="rounded-lg border border-slate-200 py-1.5 text-center text-[0.85rem] font-extrabold">
              {d}
            </span>
          ))}
        </div>
        <p className="mt-1.5 text-[0.52rem] leading-snug text-muted">Sanga checks the PIN before the trip can start.</p>
        <div className="mt-auto rounded-xl bg-surface p-2">
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 shrink-0 rounded-full bg-brand-200" aria-hidden="true" />
            <div>
              <p className="text-[0.6rem] font-bold">Rider</p>
              <p className="text-[0.5rem] text-muted">Pickup · Victoria Island</p>
            </div>
          </div>
        </div>
        <span className="mt-2 rounded-lg bg-brand-600 py-1.5 text-center text-[0.6rem] font-semibold text-white">Start trip</span>
      </div>
    </>
  );
}

export function NavigateScreen() {
  return (
    <>
      <div className="bg-navy-900 text-white">
        <StatusBar light />
        <div className="flex items-center gap-2 px-3 pb-2.5">
          <CornerUpRight className="h-5 w-5" />
          <div>
            <p className="text-[0.85rem] leading-none font-extrabold">800 m</p>
            <p className="text-[0.55rem] text-white/75">Turn right</p>
          </div>
        </div>
      </div>
      <div className="relative flex-1">
        <MiniMap className="absolute inset-0" />
        <span className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow">
          <ShieldCheck className="h-3.5 w-3.5 text-brand-600" />
        </span>
        <span className="absolute bottom-2 left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full bg-brand-600 text-white shadow">
          <Navigation className="h-3.5 w-3.5" />
        </span>
      </div>
      <div className="space-y-1.5 p-3">
        <p className="text-[0.55rem] font-semibold text-brand-600">Trip in progress</p>
        <p className="text-[0.62rem] font-semibold">Drop-off · Lekki Phase 1</p>
        <span className="block rounded-lg bg-brand-600 py-1.5 text-center text-[0.6rem] font-semibold text-white">End trip</span>
      </div>
    </>
  );
}

export function EarningsScreen() {
  const rows = [
    ["Trip fare", "₦6,000"],
    ["Platform fee (example)", "−₦900"],
    ["Adjustments", "₦0"],
  ];
  return (
    <>
      <StatusBar />
      <div className="flex flex-1 flex-col px-3 pb-3">
        <p className="text-center text-[0.7rem] font-bold">Trip completed</p>
        <div className="mt-3 text-center">
          <p className="text-[1.15rem] leading-none font-extrabold">₦6,000</p>
          <p className="mt-0.5 text-[0.52rem] text-muted">Total fare</p>
        </div>
        <dl className="mt-3 space-y-1.5 text-[0.56rem]">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <dt className="text-muted">{k}</dt>
              <dd className="font-semibold">{v}</dd>
            </div>
          ))}
          <div className="flex justify-between border-t border-slate-100 pt-1.5 font-bold">
            <dt>Trip earnings</dt>
            <dd>₦5,100</dd>
          </div>
        </dl>
        <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-amber-50 px-2 py-1.5 text-[0.55rem] font-semibold text-amber-800">
          <Wallet className="h-3 w-3 shrink-0" /> Payout: pending settlement
        </div>
        <span className="mt-auto rounded-lg bg-brand-600 py-1.5 text-center text-[0.6rem] font-semibold text-white">View earnings</span>
      </div>
    </>
  );
}

export function GoOnlineScreen() {
  const categories = ["Sanga Go", "Sanga Plus"];
  return (
    <>
      <StatusBar />
      <div className="flex flex-1 flex-col px-3 pb-3">
        <div className="flex items-center justify-between rounded-xl bg-brand-600 px-3 py-2.5 text-white">
          <span>
            <span className="block text-[0.7rem] font-bold">You&apos;re online</span>
            <span className="block text-[0.52rem] text-white/80">Receiving eligible trip offers</span>
          </span>
          <span className="flex h-4 w-7 items-center justify-end rounded-full bg-white/90 p-0.5" aria-hidden="true">
            <span className="h-3 w-3 rounded-full bg-brand-600" />
          </span>
        </div>
        <p className="mt-3 text-[0.6rem] font-semibold">Trip categories</p>
        <ul className="mt-1.5 space-y-1.5">
          {categories.map((c) => (
            <li key={c} className="flex items-center justify-between rounded-lg border border-slate-100 px-2 py-1.5 text-[0.58rem] font-semibold">
              {c} <Check className="h-3 w-3 text-brand-600" />
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[0.6rem] font-semibold">This week</p>
        <div className="mt-1.5 flex h-14 items-end gap-1" aria-hidden="true">
          {[40, 65, 30, 80, 55, 20, 45].map((h, i) => (
            <span key={i} style={{ height: `${h}%` }} className="flex-1 rounded-sm bg-brand-200" />
          ))}
        </div>
        <span className="mt-auto rounded-lg border border-slate-200 py-1.5 text-center text-[0.6rem] font-semibold">Go offline</span>
      </div>
    </>
  );
}
