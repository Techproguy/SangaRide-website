"use client";
import Link from "next/link";
import { useState } from "react";
import { portalUrl } from "@/lib/fleet-portal";
import { marketConfig, type Collection } from "@/lib/fleet-preview-domain";
import { usePreview } from "./PreviewProvider";
import { Badge, Button, Header, Info, KeyValues, Panel } from "./ui";
import { PreviewBanner, RecordCards, WorkflowForm } from "./WorkflowUI";
import { NewRecord, PreviewDirectory, RecordDetail } from "./SupplyWorkflows";
import { IdentityWorkflow } from "./IdentityWorkflows";
import { FinanceWorkflow } from "./FinanceWorkflows";
import { ConfigurationWorkflow } from "./ConfigurationWorkflows";

export const workstreamLinks = [
  {
    name: "F01 · Fleet identity",
    note: "Application, evidence, review and enrollment",
    links: [
      ["Start application", "onboarding/start"],
      ["Application status", "onboarding/status"],
      ["Market enrollment", "onboarding/markets"],
      ["Recovery", "security/recover"],
      ["Session / security", "security/history"],
    ],
  },
  {
    name: "F02 · Drivers and vehicles",
    note: "Invitations, verification and vehicle lifecycle",
    links: [
      ["Drivers", "drivers"],
      ["Invite driver", "drivers/invite"],
      ["Invitations", "invitations"],
      ["Vehicles", "vehicles"],
      ["Register vehicle", "vehicles/new"],
    ],
  },
  {
    name: "F03 · Assignments and operations",
    note: "Eligibility, conflicts and trip exceptions",
    links: [
      ["Assignments", "assignments"],
      ["New assignment", "assignments/new"],
      ["Operations", "operations"],
      ["Trip exceptions", "operations/trp-99321"],
    ],
  },
  {
    name: "F04 · Finance",
    note: "Commission-first examples, requests and liabilities",
    links: [
      ["Earnings", "earnings"],
      ["Payouts", "payouts"],
      ["Cash liabilities", "payouts/cash"],
      ["Requests", "payouts/requests"],
    ],
  },
  {
    name: "F05 · Maintenance",
    note: "Triage, repairs, review and compliance",
    links: [
      ["Issues", "maintenance"],
      ["Report issue", "maintenance/new"],
      ["Compliance", "maintenance/compliance"],
    ],
  },
  {
    name: "F06 · Team governance",
    note: "Invitations, role scope and ownership protection",
    links: [
      ["Team", "team"],
      ["Invite member", "team/invite"],
      ["Transfer ownership", "team/ownership-transfer"],
      ["Activity", "team/activity"],
    ],
  },
  {
    name: "F07 · Support and records",
    note: "Tickets, report jobs, notifications and audit",
    links: [
      ["Support", "settings/support"],
      ["New ticket", "settings/support/new"],
      ["Reports", "reports"],
      ["Notifications", "notifications"],
      ["Audit", "settings/audit"],
    ],
  },
  {
    name: "F08 · Market and system states",
    note: "NG / US scope, error recovery and unavailable services",
    links: [
      ["System states", "system/states"],
      ["Permissions", "system/denied"],
      ["Service eligibility", "settings/services"],
    ],
  },
];
export function WorkflowHub() {
  return (
    <>
      <Header
        title="Fleet workflows"
        description="Complete sample journeys, organized by workstream"
      />
      <PreviewBanner />
      <div className="fp-work-hub">
        {workstreamLinks.map((group) => (
          <Panel key={group.name} title={group.name}>
            <p>{group.note}</p>
            <div className="fp-work-links">
              {group.links.map(([label, path]) => (
                <Link key={path} href={portalUrl(path)}>
                  {label} →
                </Link>
              ))}
            </div>
          </Panel>
        ))}
      </div>
    </>
  );
}
export function WorkflowScreen({ path }: { path: string }) {
  const { state } = usePreview();
  if (
    state.role === "Operations" &&
    (path.startsWith("payouts") ||
      path.startsWith("earnings") ||
      path === "team/ownership-transfer" ||
      path === "team/invite")
  )
    return (
      <>
        <Header title="Permission denied" />
        <PreviewBanner />
        <Info>
          The Operations preview role cannot access financial controls or team
          governance. Ask an owner for access. Production permissions must be
          enforced by the backend.
        </Info>
        <Button secondary href="workflows">
          Back to workflows
        </Button>
      </>
    );
  const directories: Record<string, Collection> = {
    drivers: "drivers",
    vehicles: "vehicles",
    invitations: "invitations",
    assignments: "assignments",
    maintenance: "issues",
    team: "team",
    "settings/support": "tickets",
    "reports/jobs": "reports",
  };
  if (path === "workflows") return <WorkflowHub />;
  if (
    [
      "settings/profile",
      "settings/policies",
      "settings/billing",
      "settings/notifications",
      "settings/integrations",
    ].includes(path)
  )
    return <ConfigurationWorkflow key={path} path={path} />;
  if (path === "operations/trp-99321/exceptions")
    return (
      <>
        <Header
          title="Trip exceptions"
          back={{ label: "Back to trip", path: "operations/trp-99321" }}
        />
        <PreviewBanner />
        <Panel title="Illustrative exception timeline">
          <p>
            Sample location last updated 30 Oct 2026 09:00 UTC. No live
            telemetry is connected.
          </p>
          <ul className="fp-work-timeline">
            <li>Driver offline / delayed event</li>
            <li>No-show / cancelled / disputed scenarios</li>
            <li>
              Restricted SOS details — unavailable without scoped operational
              authorization
            </li>
          </ul>
          <Info>
            Dispatch overrides, active-trip reassignment and emergency access
            are unavailable until D-11 and authoritative operations services are
            configured.
          </Info>
          <Button href="settings/support/new">Create sample escalation</Button>
        </Panel>
      </>
    );
  if (path.startsWith("onboarding/") || path.startsWith("security/"))
    return <IdentityWorkflow key={path} path={path} />;
  if (path.startsWith("system/"))
    return <SystemStates key={path} denied={path.endsWith("denied")} />;
  if (path === "maintenance/compliance") return <Compliance />;
  if (path === "team/ownership-transfer") return <Ownership />;
  if (path === "team/activity" || path.startsWith("settings/audit"))
    return <Audit path={path} />;
  if (path === "team/invitations") return <TeamInvitations />;
  if (path === "notifications" || path.startsWith("notifications/"))
    return <Notifications path={path} />;
  if (
    path === "reports" ||
    [
      "reports/trips",
      "reports/vehicles",
      "reports/reconciliation",
      "reports/earnings",
      "reports/performance",
      "reports/history",
    ].includes(path)
  )
    return <Reports path={path} />;
  const newRecords: Record<string, Collection> = {
    "vehicles/new": "vehicles",
    "drivers/invite": "invitations",
    "assignments/new": "assignments",
    "maintenance/new": "issues",
    "team/invite": "team",
    "settings/support/new": "tickets",
    "reports/configure": "reports",
  };
  if (newRecords[path])
    return <NewRecord key={path} collection={newRecords[path]} />;
  if (directories[path])
    return <PreviewDirectory key={path} collection={directories[path]} />;
  if (
    path.startsWith("payouts") ||
    path === "earnings" ||
    path.startsWith("earnings/")
  )
    return <FinanceWorkflow key={path} path={path} />;
  const patterns: [string, Collection][] = [
    ["settings/support/", "tickets"],
    ["reports/jobs/", "reports"],
    ["drivers/", "drivers"],
    ["vehicles/", "vehicles"],
    ["assignments/", "assignments"],
    ["maintenance/", "issues"],
    ["team/", "team"],
    ["invitations/", "invitations"],
  ];
  for (const [prefix, collection] of patterns)
    if (path.startsWith(prefix)) {
      const [id, ...tabs] = path.slice(prefix.length).split("/");
      return (
        <RecordDetail
          key={path}
          collection={collection}
          id={id}
          tab={tabs.join("/")}
        />
      );
    }
  return null;
}
export function handlesWorkflow(path: string) {
  return (
    [
      "workflows",
      "settings/profile",
      "settings/policies",
      "settings/billing",
      "settings/notifications",
      "settings/integrations",
      "operations/trp-99321/exceptions",
    ].includes(path) ||
    [
      "onboarding/",
      "security/",
      "system/",
      "drivers",
      "vehicles",
      "invitations",
      "assignments",
      "maintenance",
      "team",
      "payouts",
      "earnings",
      "reports",
      "notifications",
      "settings/support",
      "settings/audit",
    ].some(
      (prefix) =>
        path === prefix || path.startsWith(`${prefix.replace(/\/$/, "")}/`),
    )
  );
}
function Compliance() {
  const { state } = usePreview();
  return (
    <>
      <Header
        title="Compliance overview"
        back={{ label: "Back to maintenance", path: "maintenance" }}
      />
      <PreviewBanner />
      <Info>
        {marketConfig[state.market].documents} Preview status is not compliance
        approval.
      </Info>
      <Panel title="Expired / blocked vehicles">
        <RecordCards
          collection="vehicles"
          records={state.records.vehicles.filter(
            (r) => r.status !== "active" || r.fields.documents !== "valid",
          )}
        />
      </Panel>
      <Panel title="Safety holds">
        <RecordCards
          collection="issues"
          records={state.records.issues.filter(
            (r) => r.fields.severity === "critical" && r.status !== "resolved",
          )}
        />
      </Panel>
    </>
  );
}
function Ownership() {
  const { state, execute } = usePreview();
  const owner = state.records.team.find(
    (r) =>
      r.market === state.market &&
      r.status === "active" &&
      r.fields.role === "Owner",
  );
  return (
    <WorkflowForm
      title="Transfer sample ownership"
      back="team"
      fields={[
        {
          key: "recipient",
          label: "Active recipient ID",
          options: state.records.team
            .filter(
              (r) =>
                r.market === state.market &&
                r.status === "active" &&
                r.id !== owner?.id,
            )
            .map((r) => r.id),
          required: true,
        },
        { key: "reason", label: "Reason", required: true },
        {
          key: "verification",
          label: "Verification dependency",
          options: [
            "Preview only — verified recipient and step-up required for live transfer",
          ],
          required: true,
        },
      ]}
      onSubmit={(v) => {
        const recipient = state.records.team.find(
          (r) =>
            r.id === v.recipient &&
            r.market === state.market &&
            r.status === "active",
        );
        if (!owner || !recipient)
          return {
            ok: false,
            error: "An active owner and eligible recipient are required.",
          };
        const promoted = execute({
          kind: "transition",
          collection: "team",
          id: recipient.id,
          version: recipient.version,
          status: "active",
          reason: v.reason,
          fields: { role: "Owner" },
        });
        if (!promoted.ok) return promoted;
        const demoted = execute({
          kind: "transition",
          collection: "team",
          id: owner.id,
          version: owner.version,
          status: "active",
          reason: v.reason,
          fields: { role: "Operations" },
        });
        return demoted.ok ? { ok: true, path: "team" } : demoted;
      }}
    >
      <Info>
        Preview-only governance demonstration. Real ownership transfer is
        unavailable without secure identity verification, step-up and backend
        authorization.
      </Info>
    </WorkflowForm>
  );
}
function TeamInvitations() {
  const { state } = usePreview();
  return (
    <>
      <Header
        title="Team invitations"
        back={{ label: "Back to team", path: "team" }}
      />
      <PreviewBanner />
      <RecordCards
        collection="invitations"
        records={state.records.invitations.filter(
          (r) => r.fields.invitationType === "team",
        )}
      />
      <Button href="team/invite">Invite sample member</Button>
    </>
  );
}
function Reports({ path }: { path: string }) {
  const { state } = usePreview();
  return (
    <>
      <Header
        title={
          path === "reports/history"
            ? "Download history and report jobs"
            : "Reports"
        }
        description={`Sample ${marketConfig[state.market].currency} reports · ${marketConfig[state.market].zone}`}
      >
        <Button href="reports/configure">Configure report</Button>
      </Header>
      <PreviewBanner />
      <div className="fp-work-links">
        {["earnings", "performance", "trips", "vehicles", "reconciliation"].map(
          (type) => (
            <Link key={type} href={portalUrl(`reports/${type}`)}>
              {type} report →
            </Link>
          ),
        )}
        <Link href={portalUrl("reports/jobs")}>Background jobs →</Link>
        <Link href={portalUrl("reports/history")}>Download history →</Link>
      </div>
      <Panel title="Report jobs">
        <Info>
          Job transitions are explicit sample scenarios, not real background
          processing. Downloads contain only a labelled sample summary.
        </Info>
        <RecordCards
          collection="reports"
          records={state.records.reports.filter((r) =>
            path === "reports/history"
              ? Number(r.fields.downloads ?? 0) > 0
              : path === "reports" || r.fields.type === path.split("/")[1],
          )}
        />
      </Panel>
    </>
  );
}
function Notifications({ path }: { path: string }) {
  const { state, execute } = usePreview();
  const [filter, setFilter] = useState("all");
  const [message, setMessage] = useState("");
  const id = path.split("/")[1];
  const records = state.records.notifications.filter(
    (r) =>
      r.market === state.market &&
      (!id || r.id === id) &&
      (filter === "all" || r.status === "unread"),
  );
  return (
    <>
      <Header title="Notifications" />
      <PreviewBanner />
      <div className="fp-work-actions">
        <Button
          secondary
          onClick={() => setFilter((f) => (f === "all" ? "unread" : "all"))}
        >
          {filter === "all" ? "Show unread" : "Show all"}
        </Button>
        <Button secondary href="settings/notifications">
          Preferences
        </Button>
        <Button
          secondary
          onClick={() => {
            for (const r of records.filter((n) => n.status === "unread")) {
              const result = execute({
                kind: "transition",
                collection: "notifications",
                id: r.id,
                version: r.version,
                status: "read",
                reason: "Bulk mark read preview",
              });
              if (!result.ok) setMessage(result.error);
            }
          }}
        >
          Mark visible read
        </Button>
      </div>
      {!records.length && (
        <Panel title="No notifications">
          <p>No matching notification exists in this market.</p>
        </Panel>
      )}
      {records.map((r) => (
        <Panel title={r.name} key={r.id} action={<Badge>{r.status}</Badge>}>
          <p>
            Sample delivery state: queued for preview · no notification sent.
          </p>
          <div className="fp-work-actions">
            <Button
              secondary
              onClick={() => {
                const result = execute({
                  kind: "transition",
                  collection: "notifications",
                  id: r.id,
                  version: r.version,
                  status: r.status === "read" ? "unread" : "read",
                  reason: "Notification read state preview",
                });
                if (!result.ok) setMessage(result.error);
              }}
            >
              Mark {r.status === "read" ? "unread" : "read"}
            </Button>
            <Button href={r.fields.source ?? "workflows"}>
              Open source record
            </Button>
          </div>
        </Panel>
      ))}
      {message && <p role="alert">{message}</p>}
    </>
  );
}
function Audit({ path }: { path: string }) {
  const { state } = usePreview();
  const id = path.split("/")[2];
  const events = state.audit.filter(
    (r) => r.market === state.market && (!id || r.id === id),
  );
  return (
    <>
      <Header
        title="Preview audit history"
        description="Local actions only · not a production append-only audit service"
      />
      <PreviewBanner />
      {!events.length && (
        <Panel title="No local events">
          <p>
            Complete a preview workflow to create an audit entry. An unknown or
            reset event has no detail to disclose.
          </p>
        </Panel>
      )}
      {events.map((r) => (
        <Panel key={r.id} title={r.name} action={<Badge>{r.status}</Badge>}>
          <KeyValues items={Object.entries(r.fields)} />
          {!id && (
            <Link
              className="fp-link"
              href={portalUrl(`settings/audit/${r.id}`)}
            >
              Event details →
            </Link>
          )}
        </Panel>
      ))}
      <Info>
        Immutable server audit storage, retention policy, signed downloads and
        export authorization are not connected. Audit export is unavailable.
      </Info>
    </>
  );
}
function SystemStates({ denied }: { denied: boolean }) {
  const [scenario, setScenario] = useState(denied ? "unauthorized" : "ready");
  return (
    <>
      <Header title="System state scenarios" />
      <PreviewBanner />
      <Panel title="Choose a frontend state">
        <label className="fp-field">
          State
          <select
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
          >
            {[
              "ready",
              "loading",
              "empty",
              "filtered_empty",
              "validation_error",
              "submitting",
              "pending_review",
              "action_failure",
              "offline",
              "timeout",
              "unauthenticated",
              "unauthorized",
              "not_found",
              "conflict",
              "rate_limited",
              "maintenance_mode",
              "feature_unavailable",
              "data_stale",
              "expired_document",
              "verification_blocked",
              "read_only",
              "session_expired",
            ].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <div className="fp-state-demo" role="status" aria-live="polite">
          {scenario === "loading" ? (
            <>
              <div className="fp-skeleton" />
              <div className="fp-skeleton" />
            </>
          ) : (
            <>
              <Badge>{scenario}</Badge>
              <h2>{scenario.replaceAll("_", " ")}</h2>
              <p>
                {scenario === "conflict"
                  ? "This sample was changed elsewhere. Refresh and review before retrying."
                  : scenario === "unauthorized"
                    ? "Your selected preview role cannot perform this action. Contact the fleet owner."
                    : scenario === "data_stale"
                      ? "Last sample location update: 30 Oct 2026 09:00 UTC. This is not live tracking."
                      : "Illustrative frontend state. No real service request is in progress."}
              </p>
            </>
          )}
        </div>
        <div className="fp-work-actions">
          <Button secondary onClick={() => setScenario("ready")}>
            Retry preview / reset state
          </Button>
          <Button secondary href="login">
            Reauthenticate
          </Button>
          <Button secondary href="workflows">
            Back to workflows
          </Button>
        </div>
      </Panel>
    </>
  );
}
