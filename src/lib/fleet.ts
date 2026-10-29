// Fleet page copy and demo data. Plates, names and counts are fictional and only appear on
// surfaces labelled "Illustrative preview — demo data" (Fleet page spec v1.0, §3).

import type { CountryCode } from "./content";

/** Fleet portal entry and partnerships enquiry; live services remain unconnected. */
export const fleetApplyPath = "/fleet/portal/login";
export const fleetContactPath = "/fleet/contact";

export type SettlementExample = {
  locale: string;
  currency: string;
  fare: number;
  /** Whole percents. Fleet share is a percent of the post-platform amount. */
  platformRate: number;
  fleetRate: number;
  max: { fare: number; platformRate: number; fleetRate: number };
  step: number;
};

/** Educational only — not approved rates. Markets without an example show an unavailable state. */
export const settlementExamples: Record<CountryCode, SettlementExample | null> = {
  NG: {
    locale: "en-NG",
    currency: "NGN",
    fare: 10000,
    platformRate: 15,
    fleetRate: 30,
    max: { fare: 50000, platformRate: 40, fleetRate: 80 },
    step: 100,
  },
  US: null,
};

/** Platform first, then the post-platform amount is split between fleet and driver. */
export function allocate(fare: number, platformRate: number, fleetRate: number) {
  const platform = fare * (platformRate / 100);
  const post = fare - platform;
  const fleet = post * (fleetRate / 100);
  return { platform, post, fleet, driver: post - fleet };
}

export type VehicleRow = { plate: string; model: string; documents: "Approved" | "Under review" | "Expired"; eligible: boolean; assignment: string | null };
export type DriverRow = { name: string; invitation: "Accepted" | "Invited" | "Declined" | "Expired"; verification: "Verified" | "Pending" | "Not started"; eligible: boolean };
export type AssignmentRow = { vehicle: string; driver: string; checks: { label: string; ok: boolean }[]; state: "Active" | "Pending" | "Blocked"; reason?: string };

export type FleetDemo = {
  summary: { vehicles: number; eligible: number; pendingDocs: number; notEligible: number; drivers: number; accepted: number; invited: number; assignments: number };
  vehicles: VehicleRow[];
  drivers: DriverRow[];
  assignments: AssignmentRow[];
  /** Completed-trip fares for the Settlements tab; allocation uses the market's settlement example. */
  trips: { ref: string; driver: string; fare: number; state: "Estimated" | "Finalised" | "Adjusted" }[];
};

const checks = (failing?: string) =>
  ["Vehicle eligible", "Driver eligible", "Fleet relationship accepted", "Service compatible", "No conflicting assignment"].map((label) => ({
    label,
    ok: label !== failing,
  }));

export const fleetDemo: Record<CountryCode, FleetDemo> = {
  NG: {
    summary: { vehicles: 24, eligible: 18, pendingDocs: 4, notEligible: 2, drivers: 18, accepted: 15, invited: 3, assignments: 14 },
    vehicles: [
      { plate: "KJA-•••-AB", model: "Sedan · 2021", documents: "Approved", eligible: true, assignment: "Tunde M." },
      { plate: "LSD-•••-XY", model: "Sedan · 2020", documents: "Approved", eligible: true, assignment: null },
      { plate: "APP-•••-QZ", model: "SUV · 2019", documents: "Under review", eligible: false, assignment: null },
      { plate: "EPE-•••-KD", model: "Sedan · 2016", documents: "Expired", eligible: false, assignment: null },
    ],
    drivers: [
      { name: "Tunde M.", invitation: "Accepted", verification: "Verified", eligible: true },
      { name: "Aisha R.", invitation: "Accepted", verification: "Verified", eligible: true },
      { name: "Femi J.", invitation: "Invited", verification: "Verified", eligible: true },
      { name: "Grace O.", invitation: "Accepted", verification: "Pending", eligible: false },
      { name: "Kunle B.", invitation: "Expired", verification: "Not started", eligible: false },
    ],
    assignments: [
      { vehicle: "KJA-•••-AB", driver: "Tunde M.", checks: checks(), state: "Active" },
      { vehicle: "LSD-•••-XY", driver: "Femi J.", checks: checks("Fleet relationship accepted"), state: "Blocked", reason: "Femi hasn't accepted the fleet invitation yet." },
      { vehicle: "APP-•••-QZ", driver: "Aisha R.", checks: checks("Vehicle eligible"), state: "Pending", reason: "Vehicle documents are under review." },
    ],
    trips: [
      { ref: "TRP-2207", driver: "Tunde M.", fare: 10000, state: "Finalised" },
      { ref: "TRP-2211", driver: "Aisha R.", fare: 12000, state: "Estimated" },
      { ref: "TRP-2214", driver: "Tunde M.", fare: 8000, state: "Adjusted" },
    ],
  },
  US: {
    summary: { vehicles: 12, eligible: 9, pendingDocs: 2, notEligible: 1, drivers: 10, accepted: 8, invited: 2, assignments: 7 },
    vehicles: [
      { plate: "8••-•••4", model: "Sedan · 2022", documents: "Approved", eligible: true, assignment: "Marcus L." },
      { plate: "7••-•••1", model: "Sedan · 2021", documents: "Approved", eligible: true, assignment: null },
      { plate: "9••-•••6", model: "SUV · 2020", documents: "Under review", eligible: false, assignment: null },
      { plate: "6••-•••2", model: "Sedan · 2014", documents: "Expired", eligible: false, assignment: null },
    ],
    drivers: [
      { name: "Marcus L.", invitation: "Accepted", verification: "Verified", eligible: true },
      { name: "Rosa P.", invitation: "Accepted", verification: "Verified", eligible: true },
      { name: "Devon C.", invitation: "Invited", verification: "Verified", eligible: true },
      { name: "Hannah W.", invitation: "Accepted", verification: "Pending", eligible: false },
      { name: "Eli S.", invitation: "Declined", verification: "Not started", eligible: false },
    ],
    assignments: [
      { vehicle: "8••-•••4", driver: "Marcus L.", checks: checks(), state: "Active" },
      { vehicle: "7••-•••1", driver: "Devon C.", checks: checks("Fleet relationship accepted"), state: "Blocked", reason: "Devon hasn't accepted the fleet invitation yet." },
      { vehicle: "9••-•••6", driver: "Rosa P.", checks: checks("Vehicle eligible"), state: "Pending", reason: "Vehicle documents are under review." },
    ],
    trips: [],
  },
};

export const fleetSteps = [
  { title: "Apply", text: "Choose your market and tell us whether you're an individual owner or a company." },
  { title: "Verify", text: "Confirm identity, ownership or right to operate, and your documents." },
  { title: "Add vehicles, invite drivers", text: "Vehicles are reviewed; drivers accept your invitation with their own Sanga account." },
  { title: "Assign eligible pairs", text: "Pair vehicles and drivers once both are eligible and the relationship is accepted." },
  { title: "Operate and settle", text: "Track trip activity, allocations and payouts under your agreement." },
];

export const operators = [
  {
    title: "Individual vehicle owners",
    image: "/images/driver.webp",
    alt: "A vehicle owner standing by his car",
    points: ["Add one or more eligible vehicles", "Drive yourself or invite drivers", "See earnings allocations and settlements"],
  },
  {
    title: "Fleet companies",
    image: "/images/fleet.webp",
    alt: "A row of fleet vehicles outside an office building",
    points: ["Manage many vehicles and drivers", "Assign eligible drivers at scale", "Operational and settlement reporting"],
  },
];
