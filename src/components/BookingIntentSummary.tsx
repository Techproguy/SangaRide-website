"use client";

import { useSearchParams } from "next/navigation";
import { rides } from "@/lib/content";

const journeyLabels: Record<string, string> = { ride: "Ride", airport: "Airport", intercity: "Intercity", hourly: "Hourly" };

/** Shows the intent handed over by the marketing pages. Rider Web will re-validate all of it. */
export function BookingIntentSummary() {
  const params = useSearchParams();
  const service = rides.find((r) => r.id === params.get("service"));
  const when = params.get("when");

  const rows = [
    ["Ride", service?.name],
    ["Journey", journeyLabels[params.get("journey") ?? ""]],
    ["Pickup", params.get("pickup")],
    ["Destination", params.get("destination")],
    ["When", when ? new Date(when).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : params.get("pickup") ? "Ride now" : null],
    ["Passengers", params.get("passengers")],
    ["Duration", params.get("hours") && `${params.get("hours")} hours`],
  ].filter((row): row is [string, string] => !!row[1]);

  if (!rows.length) return null;

  return (
    <div className="mt-10 rounded-[1.5rem] border border-slate-100 bg-white p-6 text-left shadow-card">
      <p className="text-sm font-bold">Your trip details</p>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt className="text-[0.75rem] text-muted">{label}</dt>
            <dd className="text-[0.9rem] font-semibold break-words">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
