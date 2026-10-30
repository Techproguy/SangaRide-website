import {
  workflowRoutes,
  recordSamples,
  isRecordPath,
} from "./fleet-preview-routes";
const legacyPortalPaths = [
  "",
  "login",
  "drivers",
  "drivers/chinedu",
  "drivers/invite",
  "vehicles",
  ...[
    "overview",
    "documents",
    "maintenance",
    "assignments",
    "trips",
    "earnings",
  ].map((t) => `vehicles/rav4/${t}`),
  "operations",
  "operations/trp-99321",
  "maintenance",
  "maintenance/iss-2711",
  "earnings",
  "payouts",
  "payouts/destination",
  "payouts/destination/change",
  "payouts/settlement",
  "payouts/settlement/confirm",
  "payouts/split",
  "invitations",
  "reports",
  "reports/earnings",
  "reports/performance",
  "team",
  "team/aisha",
  "settings",
  ...[
    "profile",
    "services",
    "policies",
    "billing",
    "notifications",
    "integrations",
    "support",
    "audit",
  ].map((t) => `settings/${t}`),
  "notifications",
  "settings/support/sr-202612",
];

export const portalPaths = [
  ...new Set([...legacyPortalPaths, ...workflowRoutes, ...recordSamples]),
];
export const isPortalPath = (path: string) =>
  portalPaths.includes(path) || isRecordPath(path);
