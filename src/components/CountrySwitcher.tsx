"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { countries, type CountryCode } from "@/lib/content";
import { FlagNigeria, FlagUnitedStates } from "./icons";

const flags = { NG: FlagNigeria, US: FlagUnitedStates };

export function CountrySwitcher({ align = "right", up = false, compact = false }: { align?: "left" | "right"; up?: boolean; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState<CountryCode>("NG");
  const ref = useRef<HTMLDivElement>(null);
  const Flag = flags[country];

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  return (
    <div ref={ref} className={`relative ${compact ? "w-full min-w-0" : ""}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Country: ${countries[country].name}`}
        onClick={() => setOpen((o) => !o)}
        className={`flex min-h-11 items-center rounded-full border border-slate-200 bg-white font-semibold text-ink transition hover:border-slate-300 lg:min-h-9 ${compact ? "w-full gap-1.5 px-2.5 text-xs" : "gap-2 px-3 text-[0.8rem]"}`}
      >
        <Flag className="h-4 w-4 shrink-0" />
        <span className={compact ? "min-w-0 flex-1 truncate text-left" : ""}>
          {compact ? country === "US" ? "USA" : countries[country].name : `${countries[country].name} (${countries[country].currency})`}
        </span>
        <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label="Choose country"
          className={`absolute z-50 w-56 rounded-xl border border-slate-100 bg-white p-1.5 shadow-panel ${
            align === "right" ? "right-0" : "left-0"
          } ${up ? "bottom-full mb-2" : "top-full mt-2"}`}
        >
          {(Object.keys(countries) as CountryCode[]).map((code) => {
            const ItemFlag = flags[code];
            return (
              <li key={code} role="option" aria-selected={code === country}>
                <button
                  type="button"
                  onClick={() => {
                    setCountry(code);
                    setOpen(false);
                  }}
                  className="flex min-h-11 w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium hover:bg-brand-50"
                >
                  <ItemFlag className="h-4 w-4" />
                  <span className="flex-1">
                    {countries[code].name} ({countries[code].currency})
                  </span>
                  {code === country && <Check className="h-4 w-4 text-brand-600" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
