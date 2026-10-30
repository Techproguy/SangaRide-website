"use client";
import Link from "next/link";
import { useState } from "react";
import { portalUrl } from "@/lib/fleet-portal";
import {
  assignmentErrors,
  marketConfig,
  nextStatuses,
  type Collection,
  type PreviewRecord,
} from "@/lib/fleet-preview-domain";
import { usePreview } from "./PreviewProvider";
import {
  Badge,
  Button,
  Header,
  Info,
  KeyValues,
  Panel,
  SearchField,
  DataTable,
  Stats,
  Person,
  Asset,
} from "./ui";
import {
  Input,
  PreviewBanner,
  RecordCards,
  SampleAttachment,
  WorkflowForm,
  recordPath,
  recordPrefix,
  type InputSpec,
} from "./WorkflowUI";

export const labels: Record<Collection, string> = {
  applications: "Fleet applications",
  drivers: "Drivers",
  vehicles: "Vehicles",
  invitations: "Invitations",
  assignments: "Assignments",
  issues: "Maintenance",
  requests: "Change requests",
  team: "Team",
  tickets: "Support tickets",
  reports: "Report jobs",
  notifications: "Notifications",
};
export function PreviewDirectory({ collection }: { collection: Collection }) {
  const { state } = usePreview();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const all = state.records[collection].filter(
    (r) => r.market === state.market,
  );
  const rows = all.filter(
    (r) =>
      (!status || r.status === status) &&
      `${r.name} ${r.id} ${Object.values(r.fields).join(" ")}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  const create: Partial<Record<Collection, string>> = {
    drivers: "drivers/invite",
    vehicles: "vehicles/new",
    invitations: "drivers/invite",
    assignments: "assignments/new",
    issues: "maintenance/new",
    team: "team/invite",
    tickets: "settings/support/new",
    reports: "reports/configure",
  };
  return (
    <>
      <Header
        title={labels[collection]}
        description={`Sample ${marketConfig[state.market].name} fleet · ${all.length} records`}
      >
        {create[collection] && (
          <Button href={create[collection]}>
            {" "}
            {collection === "drivers" || collection === "invitations"
              ? "Invite driver"
              : collection === "team"
                ? "Invite team member"
                : "Create sample"}
          </Button>
        )}
      </Header>
      <PreviewBanner />
      <Stats
        items={[
          { label: "Total records", value: String(all.length), tone: "blue" },
          {
            label: "Active / eligible",
            value: String(
              all.filter((r) =>
                ["active", "eligible", "accepted", "ready", "open"].includes(
                  r.status,
                ),
              ).length,
            ),
            tone: "green",
          },
          {
            label: "Awaiting review",
            value: String(
              all.filter((r) => /pending|review|reported/.test(r.status))
                .length,
            ),
            tone: "orange",
          },
          {
            label: "Requires attention",
            value: String(
              all.filter((r) =>
                /expired|suspended|rejected|failed/.test(r.status),
              ).length,
            ),
            tone: "red",
          },
        ]}
      />
      <div className="fp-filters">
        <SearchField
          value={search}
          onChange={setSearch}
          placeholder={`Search ${labels[collection].toLowerCase()}`}
        />
        <select
          aria-label="Filter status"
          className="fp-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All statuses</option>
          {[...new Set(all.map((r) => r.status))].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      {collection === "issues" && (
        <div className="fp-work-actions">
          <Button secondary href="maintenance/compliance">
            Compliance overview
          </Button>
        </div>
      )}
      {collection === "team" && (
        <div className="fp-work-actions">
          <Button secondary href="team/ownership-transfer">
            Transfer ownership
          </Button>
          <Button secondary href="team/activity">
            Team activity
          </Button>
          <Button secondary href="team/invitations">
            Invitation status
          </Button>
        </div>
      )}
      {rows.length ? (
        <>
          <div className="fp-record-desktop">
            <DataTable
              headers={[
                "Name / reference",
                "Market",
                "Status",
                "Version",
                "Action",
              ]}
              rows={rows.map((r) => ({
                key: r.id,
                cells: [
                  <strong key="n" className="fp-record-name">
                    {collection === "drivers" &&
                    ["chinedu", "aisha", "daniel"].includes(r.id) ? (
                      <Person
                        index={
                          r.id === "chinedu" ? 0 : r.id === "aisha" ? 1 : 3
                        }
                        name={r.name}
                        subtitle={r.id}
                      />
                    ) : collection === "vehicles" &&
                      ["rav4", "corolla", "us-suv"].includes(r.id) ? (
                      <span className="fp-vehicle-cell">
                        <Asset
                          screen="922:19982"
                          name={
                            r.id === "rav4"
                              ? "imgFavpng885D290E782F4F3Ce6D77D44Cefe13C81"
                              : "imgPngwingCom22"
                          }
                          width={102}
                          height={54}
                        />
                        <span>
                          {r.name}
                          <small>{r.fields.plate}</small>
                        </span>
                      </span>
                    ) : (
                      <>
                        {r.name}
                        <small className="fp-record-id">{r.id}</small>
                      </>
                    )}
                  </strong>,
                  r.market,
                  <Badge key="s">{r.status}</Badge>,
                  String(r.version),
                  <Link
                    key="l"
                    className="fp-link"
                    href={portalUrl(recordPath(collection, r.id))}
                  >
                    View details →
                  </Link>,
                ],
              }))}
            />
          </div>
          <div className="fp-record-mobile">
            <RecordCards collection={collection} records={rows} />
          </div>
        </>
      ) : (
        <Panel title={all.length ? "No matching records" : "No records yet"}>
          <p>
            Change your filters or create a sample record. Data is scoped to the
            selected market.
          </p>
        </Panel>
      )}
    </>
  );
}
export function NewRecord({ collection }: { collection: Collection }) {
  const { state, execute } = usePreview();
  const market = marketConfig[state.market];
  const drivers = state.records.drivers.filter(
    (r) => r.market === state.market,
  );
  const vehicles = state.records.vehicles.filter(
    (r) => r.market === state.market,
  );
  const base: InputSpec = {
    key: "name",
    label:
      collection === "issues" || collection === "tickets"
        ? "Sample issue title"
        : "Sample name",
    required: true,
  };
  const fields: InputSpec[] =
    collection === "vehicles"
      ? [
          { ...base, label: "Make and model" },
          { key: "plate", label: "Sample plate", required: true },
          { key: "vin", label: "Sample VIN", required: true },
          { key: "year", label: "Year", type: "number", required: true },
          {
            key: "seats",
            label: "Seating capacity",
            type: "number",
            required: true,
          },
          {
            key: "fuel",
            label: "Fuel",
            options: ["Petrol", "Diesel", "Electric", "Hybrid"],
            required: true,
          },
          {
            key: "ownership",
            label: "Ownership",
            options: ["Fleet-owned", "Leased"],
            required: true,
          },
          {
            key: "zone",
            label: `Operating zone (${state.market})`,
            required: true,
          },
          {
            key: "service",
            label: "Requested category",
            options: ["Sanga Go", "Sanga Plus", "Sanga XL"],
            required: true,
          },
        ]
      : collection === "assignments"
        ? [
            {
              key: "driver",
              label: "Driver ID",
              options: drivers.map((r) => r.id),
              required: true,
            },
            {
              key: "vehicle",
              label: "Vehicle ID",
              options: vehicles.map((r) => r.id),
              required: true,
            },
            {
              key: "effective",
              label: "Effective sample time",
              type: "datetime-local",
              required: true,
            },
          ]
        : collection === "issues"
          ? [
              base,
              {
                key: "vehicle",
                label: "Vehicle ID",
                options: vehicles.map((r) => r.id),
                required: true,
              },
              {
                key: "severity",
                label: "Severity",
                options: ["low", "medium", "critical"],
                required: true,
              },
              { key: "owner", label: "Assigned owner", required: true },
              {
                key: "occurred",
                label: "Occurrence time",
                type: "datetime-local",
                required: true,
              },
              {
                key: "description",
                label: "Description",
                type: "textarea",
                required: true,
              },
            ]
          : collection === "tickets"
            ? [
                base,
                {
                  key: "category",
                  label: "Category",
                  options: [
                    "Payouts",
                    "Drivers",
                    "Vehicles",
                    "Safety",
                    "Account",
                  ],
                  required: true,
                },
                {
                  key: "related",
                  label: "Related sample record",
                  options: [...drivers, ...vehicles, ...state.records.requests]
                    .filter((r) => r.market === state.market)
                    .map((r) => r.id),
                },
                {
                  key: "message",
                  label: "Description",
                  type: "textarea",
                  required: true,
                },
              ]
            : collection === "reports"
              ? [
                  { ...base, label: "Report name" },
                  {
                    key: "type",
                    label: "Report type",
                    options: [
                      "earnings",
                      "performance",
                      "trips",
                      "vehicles",
                      "reconciliation",
                    ],
                    required: true,
                  },
                  { key: "from", label: "From", type: "date", required: true },
                  { key: "to", label: "To", type: "date", required: true },
                  {
                    key: "format",
                    label: "Format",
                    options: ["CSV"],
                    required: true,
                  },
                  {
                    key: "group",
                    label: "Group by",
                    options: ["Driver", "Vehicle", "Service", "Zone"],
                    required: true,
                  },
                ]
              : [
                  base,
                  {
                    key: "email",
                    label: "Fictional contact",
                    type: "email",
                    required: true,
                    hint: "Use an example.invalid address. Nothing is sent.",
                  },
                  {
                    key: "role",
                    label:
                      collection === "team"
                        ? "Proposed team role"
                        : "Invitation role",
                    options:
                      collection === "team"
                        ? ["Operations", "Finance", "Support", "Read-only"]
                        : ["Driver"],
                    required: true,
                  },
                  {
                    key: "scope",
                    label: "Market scope",
                    options: [state.market],
                    required: true,
                  },
                  {
                    key: "consent",
                    label: "Sample invitation disclosure",
                    options: [
                      "I reviewed the organization, role and 7-day sample expiry",
                    ],
                    required: true,
                  },
                ];
  return (
    <WorkflowForm
      key={`${collection}-${state.market}`}
      title={
        collection === "assignments"
          ? "Assign driver to vehicle"
          : collection === "vehicles"
            ? "Register vehicle"
            : collection === "team"
              ? "Invite team member"
              : collection === "invitations"
                ? "Invite driver"
                : `Create ${labels[collection].toLowerCase()}`
      }
      back={
        collection === "issues"
          ? "maintenance"
          : collection === "tickets"
            ? "settings/support"
            : collection === "reports"
              ? "reports"
              : collection
      }
      fields={fields}
      attachments={["vehicles", "issues", "tickets"].includes(collection)}
      steps={
        collection === "vehicles"
          ? ["Vehicle and documents", "Eligibility review", "Review and submit"]
          : ["Details", "Review and submit"]
      }
      onSubmit={(values) => {
        if (values.email && !values.email.endsWith("@example.invalid"))
          return {
            ok: false,
            error: "Use a fictional @example.invalid address only.",
          };
        if (
          values.year &&
          (Number(values.year) < 1900 || Number(values.year) > 2027)
        )
          return { ok: false, error: "Enter a valid sample year." };
        if (
          values.seats &&
          (!Number.isInteger(Number(values.seats)) ||
            Number(values.seats) < 1 ||
            Number(values.seats) > 20)
        )
          return {
            ok: false,
            error: "Seating capacity must be a whole number from 1 to 20.",
          };
        if (values.from && values.to && values.from > values.to)
          return {
            ok: false,
            error: "The end date must not be before the start date.",
          };
        const result = execute({
          kind: "create",
          collection: collection === "team" ? "invitations" : collection,
          name: values.name || `${values.driver} / ${values.vehicle}`,
          fields: {
            ...values,
            currency: market.currency,
            timezone: market.zone,
            documents: "pending",
            license: "pending",
            invitationType: collection === "team" ? "team" : "driver",
          },
        });
        return result.ok
          ? {
              ok: true,
              path: recordPath(
                collection === "team" ? "invitations" : collection,
                result.id,
              ),
            }
          : result;
      }}
    >
      <Info>
        {market.documents} Eligibility is a preview rule, not Sanga approval.
        Driver and vehicle IDs are shown for explicit sample selection.
      </Info>
    </WorkflowForm>
  );
}
export function RecordDetail({
  collection,
  id,
  tab = "",
}: {
  collection: Collection;
  id: string;
  tab?: string;
}) {
  const { state, execute } = usePreview();
  const record = state.records[collection].find(
    (r) => r.id === id && r.market === state.market,
  );
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [edit, setEdit] = useState<Record<string, string>>({});
  if (!record)
    return (
      <>
        <Header
          title="Record not found"
          back={{
            label: "Back to records",
            path: recordPrefix[collection],
          }}
        />
        <Info>
          This record does not exist in the selected market, or the preview was
          reset. Try the correct market or return to the list.
        </Info>
      </>
    );
  const change = (next: string, fields?: Record<string, string>) => {
    const result = execute({
      kind: "transition",
      collection,
      id,
      status: next,
      version: record.version,
      reason: note,
      fields,
    });
    setError(
      result.ok ? "Preview only · Update recorded locally." : result.error,
    );
    if (result.ok) {
      setNote("");
      setStatus("");
      setEdit({});
    }
  };
  const tabs =
    collection === "vehicles"
      ? [
          "overview",
          "documents",
          "maintenance",
          "assignments",
          "trips",
          "earnings",
          "edit",
          "review",
          "manage",
        ]
      : collection === "drivers"
        ? ["", "verification", "activation", "manage", "split"]
        : collection === "team"
          ? ["", "permissions", "manage"]
          : collection === "issues"
            ? ["", "triage", "update", "resolve"]
            : [];
  const prefix = recordPrefix[collection];
  const title = tab ? `${record.name} · ${tab}` : record.name;
  return (
    <>
      <Header
        title={title}
        description={`${record.id} · ${record.market} · Version ${record.version}`}
        back={{
          label: `Back to ${labels[collection].toLowerCase()}`,
          path: prefix,
        }}
      />
      <PreviewBanner />
      {collection === "drivers" &&
        ["chinedu", "aisha", "daniel"].includes(id) && (
          <Panel>
            <Person
              large
              index={id === "chinedu" ? 0 : id === "aisha" ? 1 : 3}
              name={record.name}
              subtitle={`${record.id} · ${record.status}`}
            />
          </Panel>
        )}
      {collection === "vehicles" && id === "rav4" && (
        <Panel>
          <div className="fp-vehicle-cell fp-vehicle-preview">
            <Asset
              screen="922:13308"
              name="imgFavpng885D290E782F4F3Ce6D77D44Cefe13C81"
              width={258}
              height={135}
            />
            <div className="fp-vehicle-preview-details">
              <strong>{record.name}</strong>
              <div className="fp-vehicle-preview-meta">
                <span>{record.fields.plate}</span>
                <span>{record.fields.service}</span>
              </div>
            </div>
          </div>
        </Panel>
      )}
      {tabs.length > 0 && (
        <nav className="fp-tabs" aria-label="Record sections">
          {tabs.map((t) => (
            <Link
              key={t}
              href={portalUrl(`${prefix}/${id}${t ? `/${t}` : ""}`)}
              aria-current={tab === t ? "page" : undefined}
              className={tab === t ? "active" : ""}
            >
              {t || "Overview"}
            </Link>
          ))}
        </nav>
      )}
      <Panel title="Sample record" action={<Badge>{record.status}</Badge>}>
        <KeyValues
          items={Object.entries(record.fields).map(([k, v]) => [k, v])}
        />
      </Panel>
      {collection === "drivers" && tab === "split" ? (
        <Info>
          Driver-specific split overrides are unavailable until contract policy
          and the approval chain are confirmed (D-08).
        </Info>
      ) : (
        <>
          {collection === "vehicles" && tab === "documents" && (
            <Panel title="Document renewal">
              <Info>
                {marketConfig[state.market].documents} Sample replacement
                returns the vehicle to review; it never proves verification.
              </Info>
              <SampleAttachment />
            </Panel>
          )}
          {collection === "vehicles" && tab === "assignments" && (
            <>
              <Button href="assignments/new">Assign / reassign driver</Button>
              <RecordCards
                collection="assignments"
                records={state.records.assignments.filter(
                  (r) => r.fields.vehicle === id,
                )}
              />
            </>
          )}
          {collection === "vehicles" && tab === "maintenance" && (
            <RecordCards
              collection="issues"
              records={state.records.issues.filter(
                (r) => r.fields.vehicle === id,
              )}
            />
          )}
          {collection === "vehicles" && tab === "trips" && (
            <Panel title="Sample trip history">
              <Button secondary href="operations/trp-99321">
                View illustrative trip
              </Button>
            </Panel>
          )}
          {collection === "vehicles" && tab === "earnings" && (
            <Button secondary href="earnings/trip-001">
              View sample financial breakdown
            </Button>
          )}
          {collection === "drivers" && (
            <Panel title="Eligibility">
              <p>
                {assignmentErrors(state, id, "rav4").join(" ") ||
                  "Sample driver and Rav4 pass the current preview checks."}
              </p>
              <Button secondary href="assignments/new">
                Review assignment
              </Button>
            </Panel>
          )}
          {collection === "assignments" && (
            <Info>
              End the current sample assignment before creating a replacement.
              Active-trip reassignment is unavailable until operational policy
              is connected.
            </Info>
          )}
          {collection === "issues" && (
            <Info>
              Critical unresolved issues block new sample assignments. Resolving
              an issue does not clear expired documents or independent
              compliance holds.
            </Info>
          )}
          {collection === "tickets" && (
            <Panel title="Conversation">
              <p>{record.fields.message}</p>
              <SampleAttachment />
            </Panel>
          )}
          {collection === "invitations" && (
            <Info>
              Acceptance uses a sample invitation ID, never a real token.
              Expired/revoked invitations cannot be accepted. Team invitations
              remain pending until the live identity service is available.
            </Info>
          )}
          <Panel
            title={
              collection === "reports"
                ? "Report job preview"
                : "Review a sample change"
            }
          >
            <p>
              Review the current version and enter a reason. Approval
              transitions simulate a separate reviewer; they do not grant real
              permissions or verification.
            </p>
            <div className="fp-form fp-work-form">
              {((collection === "vehicles" && tab === "edit") ||
                (collection === "team" && tab === "permissions") ||
                (collection === "issues" && tab === "update")) && (
                <div className="fp-two">
                  {(collection === "team"
                    ? [
                        {
                          key: "role",
                          label: "Role",
                          options: [
                            "Owner",
                            "Operations",
                            "Finance",
                            "Support",
                            "Read-only",
                          ],
                        },
                        {
                          key: "scope",
                          label: "Market scope",
                          options: [state.market],
                        },
                      ]
                    : collection === "vehicles"
                      ? [
                          { key: "plate", label: "Sample plate" },
                          { key: "vin", label: "Sample VIN" },
                          { key: "ownership", label: "Ownership" },
                        ]
                      : [
                          { key: "owner", label: "Assigned owner" },
                          {
                            key: "cost",
                            label: `Sample cost (${marketConfig[state.market].currency})`,
                          },
                          { key: "repair", label: "Repair evidence note" },
                        ]
                  ).map((f) => (
                    <Input
                      key={f.key}
                      field={f}
                      value={edit[f.key] ?? record.fields[f.key] ?? ""}
                      onChange={(v) => setEdit((e) => ({ ...e, [f.key]: v }))}
                    />
                  ))}
                </div>
              )}
              <Input
                field={{
                  key: "reason",
                  label:
                    collection === "tickets"
                      ? "Reply / reason"
                      : "Reason / update note",
                  required: true,
                  type: "textarea",
                }}
                value={note}
                onChange={setNote}
              />
              <label className="fp-field">
                Next sample state
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">Choose a state</option>
                  {nextStatuses(collection, record.status)
                    .filter(
                      (s) =>
                        !(
                          collection === "invitations" &&
                          record.fields.invitationType === "team" &&
                          s === "accepted"
                        ),
                    )
                    .map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                </select>
              </label>
              {error && (
                <p role="status" className="fp-work-error">
                  {error}
                </p>
              )}
              <div className="fp-work-actions">
                <Button
                  disabled={!status || !note.trim()}
                  onClick={() => change(status, edit)}
                >
                  Record preview transition
                </Button>
                {["tickets", "team", "vehicles", "issues"].includes(
                  collection,
                ) && (
                  <Button
                    secondary
                    disabled={!note.trim()}
                    onClick={() =>
                      change(
                        collection === "vehicles" &&
                          ["edit", "documents"].includes(tab)
                          ? "under_review"
                          : record.status,
                        {
                          ...edit,
                          ...(collection === "vehicles" &&
                          ["edit", "documents"].includes(tab)
                            ? { documents: "pending" }
                            : {}),
                          ...(collection === "tickets"
                            ? {
                                message: `${record.fields.message}\nPreview reply: ${note}`,
                              }
                            : {}),
                        },
                      )
                    }
                  >
                    {collection === "tickets"
                      ? "Add preview reply"
                      : "Save preview update"}
                  </Button>
                )}
              </div>
            </div>
          </Panel>
        </>
      )}
      <Panel title="Event history">
        <ol className="fp-work-timeline">
          {record.history.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ol>
      </Panel>
      {collection === "reports" && <ReportDownload record={record} />}
    </>
  );
}
export function ReportDownload({ record }: { record: PreviewRecord }) {
  const { state, execute } = usePreview();
  const [message, setMessage] = useState("");
  return (
    <Panel title="Sample download">
      <p>
        Exports are generated from this market’s sample records only. No live
        financial or personal records are exported.
      </p>
      <Button
        disabled={record.status !== "ready" || state.role !== "Owner"}
        onClick={() => {
          const result = execute({
            kind: "transition",
            collection: "reports",
            id: record.id,
            status: record.status,
            version: record.version,
            reason: "Downloaded sample summary CSV",
            fields: {
              downloads: String(Number(record.fields.downloads ?? 0) + 1),
              lastDownload: "Preview only · current browser session",
            },
          });
          if (!result.ok) {
            setMessage(result.error);
            return;
          }
          const csv = `Preview only,Market,Currency,Report\nSample data,${state.market},${marketConfig[state.market].currency},${record.fields.type}\n`;
          const url = URL.createObjectURL(
            new Blob([csv], { type: "text/csv" }),
          );
          const a = document.createElement("a");
          a.href = url;
          a.download = "sanga-preview-report.csv";
          a.click();
          URL.revokeObjectURL(url);
          setMessage(
            "Preview only · Sample CSV downloaded. Live exports and signed expiry require the backend.",
          );
        }}
      >
        Download preview CSV
      </Button>
      {message && <p role="status">{message}</p>}
    </Panel>
  );
}
