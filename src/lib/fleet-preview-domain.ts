// Pure preview domain. No persistence, network, authentication or authoritative ledger.
export type Market = "NG" | "US";
export type Collection =
  | "applications"
  | "drivers"
  | "vehicles"
  | "invitations"
  | "assignments"
  | "issues"
  | "requests"
  | "team"
  | "tickets"
  | "reports"
  | "notifications";
export type PreviewRecord = {
  id: string;
  name: string;
  market: Market;
  status: string;
  version: number;
  fields: Record<string, string>;
  history: string[];
};
export type PreviewState = {
  market: Market;
  role: "Owner" | "Operations" | "Read-only";
  records: Record<Collection, PreviewRecord[]>;
  audit: PreviewRecord[];
  sequence: number;
};
export const collections: Collection[] = [
  "applications",
  "drivers",
  "vehicles",
  "invitations",
  "assignments",
  "issues",
  "requests",
  "team",
  "tickets",
  "reports",
  "notifications",
];
export type PreviewCommand =
  | {
      kind: "create";
      collection: Collection;
      name: string;
      fields: Record<string, string>;
    }
  | {
      kind: "transition";
      collection: Collection;
      id: string;
      status: string;
      reason: string;
      version: number;
      fields?: Record<string, string>;
    };
export type CommandResult =
  | { ok: true; state: PreviewState; id: string }
  | { ok: false; error: string };
export const marketConfig = {
  NG: {
    name: "Nigeria",
    currency: "NGN",
    zone: "Africa/Lagos",
    distance: "km",
    region: "State / LGA",
    postal: "Postal code",
    phone: "+234",
    documents:
      "Nigeria document requirements await approved compliance policy.",
  },
  US: {
    name: "United States",
    currency: "USD",
    zone: "America/New_York",
    distance: "mi",
    region: "State",
    postal: "ZIP code",
    phone: "+1",
    documents:
      "US state-specific document requirements await approved compliance policy.",
  },
} as const;
function record(
  id: string,
  name: string,
  status: string,
  fields: Record<string, string> = {},
  market: Market = "NG",
): PreviewRecord {
  return {
    id,
    name,
    status,
    fields,
    market,
    version: 1,
    history: ["Sample baseline · 30 Oct 2026 · Preview only"],
  };
}
export function initialPreview(): PreviewState {
  return {
    market: "NG",
    role: "Owner",
    sequence: 1,
    audit: [],
    records: {
      applications: [
        record("app-001", "Lagos Move Fleet", "draft"),
        record("app-us", "US market enrollment", "pending", {}, "US"),
      ],
      drivers: [
        record("chinedu", "Chinedu Okafor", "eligible", {
          license: "valid",
          presence: "Online",
        }),
        record("aisha", "Aisha Bello", "verification_pending", {
          license: "expired",
          presence: "Offline",
        }),
        record(
          "daniel",
          "Daniel Okafor",
          "eligible",
          { license: "valid" },
          "US",
        ),
      ],
      vehicles: [
        record("rav4", "Toyota Rav4", "active", {
          plate: "LND-204-BD",
          documents: "valid",
          service: "Sanga Plus",
          seats: "4",
        }),
        record("corolla", "Toyota Corolla", "expired", {
          plate: "ABC-203",
          documents: "expired",
        }),
        record(
          "us-suv",
          "Sample US SUV",
          "active",
          {
            plate: "DEMO-US",
            documents: "valid",
            service: "Sanga XL",
            seats: "6",
          },
          "US",
        ),
      ],
      invitations: [
        record("inv-001", "Sample driver invitation", "pending", {
          email: "driver@example.invalid",
          role: "Driver",
        }),
        record("inv-expired", "Expired invitation", "expired"),
      ],
      assignments: [
        record("asg-001", "Chinedu / Rav4", "completed", {
          driver: "chinedu",
          vehicle: "rav4",
        }),
      ],
      issues: [
        record("iss-2711", "Engine overheating", "reported", {
          vehicle: "rav4",
          severity: "critical",
          owner: "Maintenance team",
          type: "Engine",
          reportedBy: "chinedu",
          description:
            "Vehicle overheats after 15–20 minutes of driving, especially in traffic. Sample report.",
        }),
      ],
      requests: [
        record("req-001", "Settlement mode request", "pending_review", {
          type: "settlement",
          mode: "platform",
          effective: "2026-11-15",
        }),
      ],
      team: [
        record("samuel", "Samuel Eze", "active", {
          role: "Owner",
          scope: "NG",
        }),
        record("aisha", "Aisha Bello", "active", {
          role: "Operations",
          scope: "NG",
        }),
        record(
          "us-manager",
          "Sample US manager",
          "active",
          { role: "Owner", scope: "US" },
          "US",
        ),
      ],
      tickets: [
        record("sr-202612", "Payout not received", "open", {
          category: "Payouts",
          message: "Sample ticket. No message has been sent.",
        }),
      ],
      reports: [
        record("job-001", "Earnings report", "ready", {
          type: "earnings",
          currency: "NGN",
          from: "2026-10-01",
          to: "2026-10-30",
        }),
      ],
      notifications: [
        record("ntf-001", "Document expiry reminder", "unread", {
          source: "vehicles/corolla/documents",
        }),
        record("ntf-002", "Support update", "unread", {
          source: "settings/support/sr-202612",
        }),
      ],
    },
  };
}
const transitions: Partial<Record<Collection, Record<string, string[]>>> = {
  applications: {
    draft: ["pending"],
    pending: ["information_required", "approved", "rejected"],
    information_required: ["pending"],
    rejected: ["appeal_requested"],
    appeal_requested: ["pending"],
    approved: [],
  },
  drivers: {
    verification_pending: ["information_required", "rejected", "eligible"],
    information_required: ["verification_pending"],
    rejected: ["verification_pending"],
    eligible: ["active", "suspended", "removed"],
    active: ["suspended", "removed"],
    suspended: ["verification_pending", "removed"],
    removed: [],
  },
  vehicles: {
    draft: ["under_review"],
    under_review: ["information_required", "rejected", "approved"],
    information_required: ["under_review"],
    rejected: ["under_review"],
    approved: ["active"],
    active: ["suspended", "retired", "under_review"],
    expired: ["under_review"],
    suspended: ["under_review", "retired"],
    retired: [],
  },
  invitations: {
    pending: ["accepted", "revoked", "expired", "failed"],
    expired: ["pending"],
    failed: ["pending", "revoked"],
    accepted: [],
    revoked: [],
  },
  assignments: { active: ["completed"], completed: [] },
  issues: {
    reported: ["triaged", "cancelled_as_duplicate"],
    triaged: ["in_progress"],
    in_progress: ["resolution_submitted"],
    resolution_submitted: ["resolved", "in_progress"],
    resolved: ["reopened"],
    reopened: ["triaged"],
    cancelled_as_duplicate: [],
  },
  requests: {
    pending_review: ["approved", "rejected", "cancelled"],
    approved: ["scheduled"],
    scheduled: ["effective"],
    rejected: [],
    cancelled: [],
    effective: [],
  },
  team: {
    active: ["suspended", "revoked"],
    suspended: ["active", "revoked"],
    revoked: [],
  },
  tickets: {
    open: ["in_progress", "resolved"],
    in_progress: ["awaiting_fleet", "awaiting_support", "resolved"],
    awaiting_fleet: ["in_progress"],
    awaiting_support: ["in_progress"],
    resolved: ["closed", "reopened"],
    closed: ["reopened"],
    reopened: ["in_progress"],
  },
  reports: {
    queued: ["generating", "cancelled"],
    generating: ["ready", "empty", "failed"],
    failed: ["queued"],
    ready: ["expired"],
    expired: ["queued"],
    empty: ["queued"],
    cancelled: [],
  },
  notifications: { unread: ["read"], read: ["unread"] },
};
export function nextStatuses(collection: Collection, status: string) {
  return transitions[collection]?.[status] ?? [];
}
export function assignmentErrors(
  state: PreviewState,
  driverId: string,
  vehicleId: string,
  exclude?: string,
): string[] {
  const driver = state.records.drivers.find(
    (r) => r.id === driverId && r.market === state.market,
  );
  const vehicle = state.records.vehicles.find(
    (r) => r.id === vehicleId && r.market === state.market,
  );
  const errors: string[] = [];
  if (
    !driver ||
    !["eligible", "active"].includes(driver.status) ||
    driver.fields.license !== "valid"
  )
    errors.push(
      "Driver must be verified, eligible and hold a valid sample license.",
    );
  if (
    !vehicle ||
    vehicle.status !== "active" ||
    vehicle.fields.documents !== "valid"
  )
    errors.push("Vehicle must be active with valid documents.");
  if (
    state.records.issues.some(
      (r) =>
        r.market === state.market &&
        r.fields.vehicle === vehicleId &&
        r.fields.severity === "critical" &&
        !["resolved", "cancelled_as_duplicate"].includes(r.status),
    )
  )
    errors.push("A critical maintenance issue blocks this vehicle.");
  if (
    state.records.assignments.some(
      (r) =>
        r.market === state.market &&
        r.id !== exclude &&
        r.status === "active" &&
        (r.fields.driver === driverId || r.fields.vehicle === vehicleId),
    )
  )
    errors.push("Driver or vehicle already has an active assignment.");
  return errors;
}
export function runCommand(
  state: PreviewState,
  command: PreviewCommand,
): CommandResult {
  if (
    state.role === "Read-only" ||
    (state.role !== "Owner" &&
      ["team", "requests", "applications"].includes(command.collection))
  )
    return {
      ok: false,
      error:
        "Permission denied in this preview role. Production authorization requires the backend.",
    };
  const next = structuredClone(state);
  const invitation =
    command.collection === "invitations" && command.kind === "transition"
      ? state.records.invitations.find((r) => r.id === command.id)
      : undefined;
  if (
    state.role !== "Owner" &&
    command.collection === "invitations" &&
    ((command.kind === "create" && command.fields.invitationType === "team") ||
      invitation?.fields.invitationType === "team")
  )
    return {
      ok: false,
      error: "Team invitations require the Owner preview role.",
    };
  let target: PreviewRecord;
  if (command.kind === "create") {
    if (!command.name.trim())
      return { ok: false, error: "Enter a name or title." };
    if (command.collection === "assignments") {
      const errors = assignmentErrors(
        state,
        command.fields.driver,
        command.fields.vehicle,
      );
      if (errors.length) return { ok: false, error: errors.join(" ") };
    }
    if (
      command.collection === "vehicles" &&
      state.records.vehicles.some(
        (r) =>
          r.market === state.market &&
          ((command.fields.plate && r.fields.plate === command.fields.plate) ||
            (command.fields.vin && r.fields.vin === command.fields.vin)),
      )
    )
      return { ok: false, error: "Duplicate plate or VIN in this market." };
    if (
      command.collection === "invitations" &&
      state.records.invitations.some(
        (r) =>
          r.status === "pending" && r.fields.email === command.fields.email,
      )
    )
      return {
        ok: false,
        error: "This contact already has a pending invitation.",
      };
    target = record(
      `preview-${state.sequence}`,
      command.name,
      (
        {
          vehicles: "under_review",
          drivers: "verification_pending",
          invitations: "pending",
          assignments: "active",
          issues: "reported",
          requests: "pending_review",
          team: "active",
          tickets: "open",
          reports: "queued",
          applications: "pending",
          notifications: "unread",
        } as const
      )[command.collection],
      command.fields,
      state.market,
    );
    next.sequence++;
    next.records[command.collection].push(target);
  } else {
    const found = next.records[command.collection].find(
      (r) => r.id === command.id && r.market === state.market,
    );
    if (!found)
      return { ok: false, error: "Record not found or outside this market." };
    target = found;
    if (target.version !== command.version)
      return {
        ok: false,
        error:
          "Conflict: this record changed. Review the latest version and retry.",
      };
    if (!command.reason.trim())
      return { ok: false, error: "A reason or update note is required." };
    if (
      command.status !== target.status &&
      !nextStatuses(command.collection, target.status).includes(command.status)
    )
      return { ok: false, error: "This transition is not available." };
    if (command.collection === "team") {
      const isOwner = target.fields.role === "Owner";
      const removing =
        command.status !== "active" ||
        (command.fields?.role && command.fields.role !== "Owner");
      if (
        isOwner &&
        removing &&
        next.records.team.filter(
          (r) =>
            r.market === target.market &&
            r.status === "active" &&
            r.fields.role === "Owner",
        ).length <= 1
      )
        return {
          ok: false,
          error:
            "The last active owner cannot be removed or demoted. Transfer ownership first.",
        };
      if (
        target.id === "aisha" &&
        state.role !== "Owner" &&
        command.fields?.role === "Owner"
      )
        return { ok: false, error: "You cannot grant yourself ownership." };
    }
    if (
      command.collection === "drivers" &&
      ["removed", "suspended"].includes(command.status) &&
      next.records.assignments.some(
        (r) => r.status === "active" && r.fields.driver === target.id,
      )
    )
      return {
        ok: false,
        error: "End the active assignment before changing driver eligibility.",
      };
    if (
      command.collection === "vehicles" &&
      ["retired", "suspended", "under_review"].includes(command.status) &&
      next.records.assignments.some(
        (r) => r.status === "active" && r.fields.vehicle === target.id,
      )
    )
      return {
        ok: false,
        error: "End the active assignment before changing vehicle eligibility.",
      };
    if (
      command.collection === "invitations" &&
      target.fields.invitationType === "team" &&
      command.status === "accepted"
    )
      return {
        ok: false,
        error:
          "Team acceptance requires a connected identity service. This preview cannot create an authenticated membership.",
      };
    target.status = command.status;
    target.version++;
    Object.assign(target.fields, command.fields);
    if (command.collection === "drivers" && command.status === "eligible")
      target.fields.license = "valid";
    if (command.collection === "vehicles" && command.status === "approved")
      target.fields.documents = "valid";
    target.history.push(`Preview only · ${command.status} · ${command.reason}`);
    if (command.collection === "invitations" && command.status === "accepted")
      next.records.drivers.push(
        record(
          `driver-${target.id}`,
          target.name,
          "verification_pending",
          { license: "pending" },
          target.market,
        ),
      );
  }
  const event = record(
    `evt-${next.sequence++}`,
    `${command.collection}: ${target.name}`,
    target.status,
    {
      target: target.id,
      collection: command.collection,
      actor: state.role,
      reason: command.kind === "create" ? "Preview submission" : command.reason,
      before: command.kind === "create" ? "none" : String(command.version),
      after: String(target.version),
      correlationId: `preview-${next.sequence}`,
    },
    state.market,
  );
  next.audit.unshift(event);
  return { ok: true, state: next, id: target.id };
}
export function allocation(
  gross: number,
  commissionBps: number,
  fleetBps: number,
) {
  if (
    !Number.isSafeInteger(gross) ||
    gross < 0 ||
    ![commissionBps, fleetBps].every(
      (n) => Number.isInteger(n) && n >= 0 && n <= 10000,
    )
  )
    throw new Error("Invalid sample allocation inputs");
  const sanga = Math.round((gross * commissionBps) / 10000);
  const net = gross - sanga;
  const fleet = Math.round((net * fleetBps) / 10000);
  return { gross, sanga, net, fleet, driver: net - fleet };
}
export function formatMoney(minor: number, market: Market) {
  return new Intl.NumberFormat(market === "NG" ? "en-NG" : "en-US", {
    style: "currency",
    currency: marketConfig[market].currency,
  }).format(minor / 100);
}
export function remittance(outstanding: number, amount: number) {
  if (!Number.isSafeInteger(amount) || amount <= 0 || amount > outstanding)
    throw new Error(
      "Remittance must be positive and cannot exceed the outstanding sample liability.",
    );
  return outstanding - amount;
}
