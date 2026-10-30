export const workflowRoutes = [
  "workflows",
  "onboarding/start",
  "onboarding/organization",
  "onboarding/representative",
  "onboarding/documents",
  "onboarding/review",
  "onboarding/status",
  "onboarding/setup",
  "onboarding/markets",
  "security/recover",
  "security/reset",
  "security/verify",
  "security/expired",
  "security/locked",
  "security/history",
  "security/sign-out",
  "system/states",
  "system/denied",
  "vehicles/new",
  "assignments",
  "assignments/new",
  "operations/trp-99321/exceptions",
  "maintenance/new",
  "maintenance/compliance",
  "team/invite",
  "team/ownership-transfer",
  "team/activity",
  "payouts/requests",
  "payouts/destination/review",
  "payouts/settlement/review",
  "payouts/split/review",
  "payouts/cash",
  "payouts/cash/cash-001",
  "payouts/cash/remit",
  "payouts/reconciliation",
  "payouts/dispute",
  "payouts/po-001",
  "payouts/po-failed",
  "earnings/trip-001",
  "reports/trips",
  "reports/vehicles",
  "reports/reconciliation",
  "reports/configure",
  "reports/jobs",
  "reports/history",
  "settings/support/new",
  "team/invitations",
  "invitations/inv-001",
  "invitations/inv-expired",
];
export const recordRoutes: Record<string, { ids: string[]; tabs: string[] }> = {
  drivers: {
    ids: ["chinedu", "aisha", "daniel", "driver-inv-001", "driver-inv-expired"],
    tabs: ["", "verification", "activation", "manage", "split"],
  },
  vehicles: {
    ids: ["rav4", "corolla", "us-suv"],
    tabs: [
      "overview",
      "documents",
      "maintenance",
      "assignments",
      "trips",
      "earnings",
      "edit",
      "review",
      "manage",
    ],
  },
  assignments: { ids: ["asg-001"], tabs: [""] },
  maintenance: { ids: ["iss-2711"], tabs: ["", "triage", "update", "resolve"] },
  team: {
    ids: ["samuel", "aisha", "us-manager"],
    tabs: ["", "permissions", "manage"],
  },
  invitations: { ids: ["inv-001", "inv-expired"], tabs: ["", "accept"] },
  "payouts/requests": { ids: ["req-001"], tabs: [""] },
  // "" is the designed ticket thread; "status" keeps the workflow's state transitions.
  "settings/support": { ids: ["sr-202612"], tabs: ["", "status"] },
  "reports/jobs": { ids: ["job-001"], tabs: [""] },
  notifications: { ids: ["ntf-001", "ntf-002"], tabs: [""] },
};
export const recordSamples = Object.entries(recordRoutes).flatMap(
  ([prefix, { ids, tabs }]) =>
    ids.flatMap((id) =>
      tabs.map((tab) => `${prefix}/${id}${tab ? `/${tab}` : ""}`),
    ),
);
export function isRecordPath(path: string) {
  return (
    Object.entries(recordRoutes).some(([prefix, { ids, tabs }]) => {
      if (!path.startsWith(`${prefix}/`)) return false;
      const rest = path.slice(prefix.length + 1).split("/");
      return (
        (ids.includes(rest[0]) ||
          /^(?:preview|driver-preview)-[1-9]\d{0,5}$/.test(rest[0])) &&
        tabs.includes(rest.slice(1).join("/"))
      );
    }) || /^settings\/audit\/evt-[1-9]\d{0,5}$/.test(path)
  );
}
