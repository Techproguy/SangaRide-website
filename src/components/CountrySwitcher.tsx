"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { countries, type CountryCode } from "@/lib/content";
import { FlagNigeria, FlagUnitedStates } from "./icons";

const flags = { NG: FlagNigeria, US: FlagUnitedStates };

export function CountrySwitcher({ align = "right", up = false }: { align?: "left" | "right"; up?: boolean }) {
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
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Country: ${countries[country].name}`}
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-[0.8rem] font-semibold text-ink transition hover:border-slate-300"
      >
        <Flag className="h-4 w-4" />
        {countries[country].name} ({countries[country].currency})
        <ChevronDown className={`h-3.5 w-3.5 transition ${open ? "rotate-180" : ""}`} />
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
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium hover:bg-brand-50"
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
