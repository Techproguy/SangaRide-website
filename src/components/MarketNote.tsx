"use client";

import { useSearchParams } from "next/navigation";
import { countries, type CountryCode } from "@/lib/content";

/** Names the market handed over in `?market=`; the receiving flow re-checks eligibility itself. */
export function MarketNote() {
  const market = useSearchParams().get("market");
  if (!market || !(market in countries)) return null;
  return (
    <p className="mt-6 inline-flex rounded-full bg-white px-4 py-2 text-[0.8rem] font-semibold shadow-card">
      Selected market: {countries[market as CountryCode].name}
    </p>
  );
}
