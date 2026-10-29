"use client";

import Link from "next/link";
import { createContext, useContext, useState, type ReactNode } from "react";
import { countries, type CountryCode } from "@/lib/content";

/**
 * The market a page explains (currency, requirements, examples). It sets content context only —
 * it is not proof that a service or application is open there.
 */
const MarketContext = createContext<{ market: CountryCode; setMarket: (m: CountryCode) => void }>({
  market: "NG",
  setMarket: () => {},
});

export function MarketProvider({ children }: { children: ReactNode }) {
  const [market, setMarket] = useState<CountryCode>("NG");
  return <MarketContext value={{ market, setMarket }}>{children}</MarketContext>;
}

export function useMarket() {
  return useContext(MarketContext);
}

/** Segmented Nigeria / United States control. */
export function MarketToggle({ label = "Market", tone = "light" }: { label?: string; tone?: "light" | "dark" }) {
  const { market, setMarket } = useMarket();
  return (
    <div role="group" aria-label={label} className={`inline-flex rounded-full p-1 ${tone === "dark" ? "bg-white/10" : "bg-surface"}`}>
      {(Object.keys(countries) as CountryCode[]).map((code) => {
        const active = code === market;
        return (
          <button
            key={code}
            type="button"
            aria-pressed={active}
            onClick={() => setMarket(code)}
            className={`min-h-11 rounded-full px-3.5 py-1.5 text-[0.78rem] font-semibold transition ${
              active
                ? "bg-brand-600 text-white"
                : tone === "dark"
                  ? "text-white/80 hover:text-white"
                  : "text-muted hover:text-ink"
            }`}
          >
            {countries[code].name}
          </button>
        );
      })}
    </div>
  );
}

/** Link that carries the selected market as `?market=` to an onboarding or enquiry route. */
export function MarketLink({ href, className, children }: { href: string; className: string; children: ReactNode }) {
  const { market } = useMarket();
  return (
    <Link href={`${href}?market=${market}`} className={className}>
      {children}
    </Link>
  );
}
