"use client";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { MoreVertical, Plus } from "lucide-react";
import { people, vehicles, portalUrl } from "@/lib/fleet-portal";
import {
  formatMoney,
  marketConfig,
  type Market,
} from "@/lib/fleet-preview-domain";
import { usePreview } from "./PreviewProvider";
import { PreviewBanner } from "./WorkflowUI";
import {
  statusLabel,
  Asset,
  Badge,
  Button,
  DataTable,
  Dropdown,
  Field,
  Header,
  Info,
  KeyValues,
  Panel,
  Person,
  SearchField,
  Stats,
  Steps,
  useNotice,
  type TableRow,
} from "./ui";

export function RowActions({
  path,
  label,
  invite = false,
}: {
  path: string;
  label: string;
  invite?: boolean;
}) {
  const notice = useNotice();
  return (
    <details className="fp-row-menu">
      <summary aria-label={`Actions for ${label}`}>
        <MoreVertical size={20} />
      </summary>
      <div>
        <Link href={portalUrl(path)}>View details</Link>
        {invite && (
          <button
            onClick={() => notice("This is a preview. No invitation was sent.")}
          >
            Resend invitation
          </button>
        )}
      </div>
    </details>
  );
}

// Preview records carry no photos or contact details; borrow them from the design fixtures by name.
const normalize = (name: string) => name.toLowerCase().replace(/\s+/g, "");
export function fixturePerson(name: string) {
  const index = people.findIndex((p) => normalize(p.name) === normalize(name));
  return index < 0 ? null : { index, ...people[index] };
}
export function fixtureVehicle(name: string) {
  return vehicles.find((v) => normalize(v.name) === normalize(name)) ?? null;
}
const activeStatuses = ["eligible", "active"];
const openIssue = (status: string) =>
  !["resolved", "cancelled_as_duplicate"].includes(status);
/** Illustrative earnings per completed trip, in minor units. */
export const perTrip = { NG: 300_000, US: 2_500 } as const;
/** Sample contact details and places per market; Nigeria keeps the design's local phone format. */
export const samplePhone = (phone: string, market: Market) =>
  market === "NG" ? phone : `+1 555 01${phone.slice(-2)}`;
export const samplePlaces = {
  NG: ["Ikeja City Mall", "Victoria Island", "Banana Island"],
  US: ["Midtown Manhattan", "JFK Airport", "Brooklyn Heights"],
} as const;

/** F02-D01 on the Desktop - 4 layout, fed by the preview store for the selected market. */
export function DriverDirectory() {
  const { state } = usePreview();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All statuses");
  const drivers = state.records.drivers.filter((d) => d.market === state.market);
  const assignments = state.records.assignments.filter(
    (a) => a.status === "active",
  );
  const rows: TableRow[] = drivers.map((d) => {
    const person = fixturePerson(d.name);
    const vehicle = state.records.vehicles.find(
      (v) => v.id === assignments.find((a) => a.fields.driver === d.id)?.fields.vehicle,
    );
    return {
      key: d.id,
      search: `${d.name} ${d.id} ${person ? samplePhone(person.phone, state.market) : ""} ${person?.id ?? ""}`,
      status: statusLabel(d.status),
      cells: [
        person ? (
          <Person key="p" index={person.index} />
        ) : (
          <strong key="p">{d.name}</strong>
        ),
        person ? samplePhone(person.phone, state.market) : "—",
        vehicle ? (
          <span key="v">
            {vehicle.name}
            <small>{vehicle.fields.plate}</small>
          </span>
        ) : (
          "—"
        ),
        <Badge key="s">{d.status}</Badge>,
        person?.trips ?? "—",
        person ? formatMoney(person.trips * perTrip[state.market], state.market) : "—",
        <RowActions key="a" path={`drivers/${d.id}`} label={d.name} />,
      ],
    };
  });
  const filtered = rows.filter(
    (r) =>
      (r.search ?? "").toLowerCase().includes(search.toLowerCase()) &&
      (status === "All statuses" || r.status === status),
  );
  return (
    <>
      <Header
        title="Drivers"
        description="Manage all drivers in your fleet, view details, status and performance"
      >
        <Button href="drivers/invite">
          <Plus size={16} />
          Invite Driver
        </Button>
      </Header>
      <PreviewBanner />
      <Stats
        items={[
          { label: "Total Drivers", value: String(drivers.length), tone: "blue" },
          {
            label: "Active Drivers",
            value: String(drivers.filter((d) => activeStatuses.includes(d.status)).length),
            tone: "green",
          },
          {
            label: "On trip",
            value: String(drivers.filter((d) => d.fields.presence === "On trip").length),
            tone: "orange",
          },
          {
            label: "Offline",
            value: String(drivers.filter((d) => d.fields.presence === "Offline").length),
            tone: "red",
          },
        ]}
      />
      <div className="fp-filters">
        <SearchField
          value={search}
          onChange={setSearch}
          placeholder="Search drivers by name, phone or ID"
        />
        <Dropdown
          label="Filter status"
          value={status}
          onChange={setStatus}
          options={["All statuses", ...new Set(rows.map((r) => r.status ?? ""))]}
        />
      </div>
      <DataTable
        headers={["Driver", "Phone", "Vehicle", "Status", "Trips(7d)", "Earnings", "Actions"]}
        rows={filtered}
      />
    </>
  );
}

/** F02-V01 on the Desktop - 12 layout, fed by the preview store for the selected market. */
export function VehicleDirectory() {
  const { state } = usePreview();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All statuses");
  const list = state.records.vehicles.filter((v) => v.market === state.market);
  const inMaintenance = (id: string) =>
    state.records.issues.some((i) => i.fields.vehicle === id && openIssue(i.status));
  const driverFor = (id: string) =>
    state.records.drivers.find(
      (d) =>
        d.id ===
        state.records.assignments.find(
          (a) => a.status === "active" && a.fields.vehicle === id,
        )?.fields.driver,
    );
  const rows: TableRow[] = list.map((v) => {
    const fixture = fixtureVehicle(v.name);
    const driver = driverFor(v.id);
    const person = driver && fixturePerson(driver.name);
    return {
      key: v.id,
      search: `${v.name} ${v.fields.plate ?? ""} ${fixture?.type ?? ""} ${driver?.name ?? ""}`,
      status: statusLabel(v.status),
      cells: [
        <span className="fp-vehicle-cell" key="v">
          {fixture ? (
            <Asset screen="922:19982" name={fixture.image} width={86} height={48} />
          ) : null}
          <span>
            {v.name}
            <small>{v.fields.service ?? "Service pending"}</small>
          </span>
        </span>,
        v.fields.plate ?? "—",
        fixture?.type ?? "—",
        <Badge key="s">{v.status}</Badge>,
        person ? (
          <Person key="p" index={person.index} />
        ) : (
          driver?.name ?? "—"
        ),
        <Link
          key="a"
          href={portalUrl(`vehicles/${v.id}/overview`)}
          className="fp-text-link"
        >
          See details
        </Link>,
      ],
    };
  });
  const filtered = rows.filter(
    (r) =>
      (r.search ?? "").toLowerCase().includes(search.toLowerCase()) &&
      (status === "All statuses" || r.status === status),
  );
  return (
    <>
      <Header
        title="Vehicles"
        description="Manage all vehicles in your fleet, view status, assignments, documents and maintenance"
      >
        <Button href="vehicles/new">
          <Plus size={16} />
          Add vehicle
        </Button>
      </Header>
      <PreviewBanner />
      <Stats
        items={[
          { label: "Total Vehicles", value: String(list.length), tone: "blue" },
          {
            label: "Active",
            value: String(list.filter((v) => v.status === "active").length),
            tone: "green",
          },
          {
            label: "In maintenance",
            value: String(list.filter((v) => inMaintenance(v.id)).length),
            tone: "orange",
          },
          {
            label: "Inactive",
            value: String(list.filter((v) => !activeStatuses.includes(v.status)).length),
            tone: "red",
          },
        ]}
      />
      <div className="fp-filters">
        <SearchField
          value={search}
          onChange={setSearch}
          placeholder="Search by plate number, driver or model"
        />
        <Dropdown
          label="Filter status"
          value={status}
          onChange={setStatus}
          options={["All statuses", ...new Set(rows.map((r) => r.status ?? ""))]}
        />
      </div>
      <DataTable
        headers={["Vehicle", "Plate Number", "Type", "Status", "Assigned Driver", "Action"]}
        rows={filtered}
      />
    </>
  );
}

const inProgressIssue = ["triaged", "in_progress", "resolution_submitted"];

/** F05-01 on the FLT 44 layout, fed by the preview store for the selected market. */
export function IssueDirectory() {
  const { state } = usePreview();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All statuses");
  const issues = state.records.issues.filter((i) => i.market === state.market);
  const rows: TableRow[] = issues.map((issue) => {
    const vehicle = state.records.vehicles.find(
      (v) => v.id === issue.fields.vehicle,
    );
    const reporter = state.records.drivers.find(
      (d) => d.id === issue.fields.reportedBy,
    );
    const person = reporter && fixturePerson(reporter.name);
    return {
      key: issue.id,
      search: `${issue.name} ${issue.id} ${vehicle?.name ?? ""} ${reporter?.name ?? ""} ${issue.fields.severity ?? ""}`,
      status: statusLabel(issue.status),
      cells: [
        person ? (
          <Person key="p" index={person.index} />
        ) : (
          (reporter?.name ?? issue.fields.owner ?? "—")
        ),
        issue.id.toUpperCase(),
        vehicle ? (
          <span key="v">
            {vehicle.name}
            <small>{vehicle.fields.plate}</small>
          </span>
        ) : (
          "—"
        ),
        issue.fields.type ?? issue.name,
        "30 Oct 2026",
        <Badge key="s">{issue.status}</Badge>,
        <Link
          key="a"
          href={portalUrl(`maintenance/${issue.id}`)}
          className="fp-text-link"
        >
          See details
        </Link>,
      ],
    };
  });
  const filtered = rows.filter(
    (r) =>
      (r.search ?? "").toLowerCase().includes(search.toLowerCase()) &&
      (status === "All statuses" || r.status === status),
  );
  return (
    <>
      <Header
        title="Vehicle Issues"
        description="Track and manage reported vehicle issues across your fleet"
      >
        <Button secondary href="maintenance/compliance">
          Compliance overview
        </Button>
        <Button href="maintenance/new">
          <Plus size={16} />
          Report issue
        </Button>
      </Header>
      <PreviewBanner />
      <Stats
        items={[
          { label: "Total Issues", value: String(issues.length), tone: "blue" },
          {
            label: "In progress",
            value: String(
              issues.filter((i) => inProgressIssue.includes(i.status)).length,
            ),
            tone: "orange",
          },
          {
            label: "Resolved",
            value: String(issues.filter((i) => i.status === "resolved").length),
            tone: "green",
          },
          {
            label: "Open",
            value: String(issues.filter((i) => openIssue(i.status)).length),
            tone: "red",
          },
        ]}
      />
      <div className="fp-filters">
        <SearchField
          value={search}
          onChange={setSearch}
          placeholder="Search by issue, vehicle or driver"
        />
        <Dropdown
          label="Filter status"
          value={status}
          onChange={setStatus}
          options={["All statuses", ...new Set(rows.map((r) => r.status ?? ""))]}
        />
      </div>
      <DataTable
        headers={[
          "Driver",
          "Issue ID",
          "Vehicle",
          "Issue type",
          "Reported date",
          "Status",
          "Action",
        ]}
        rows={filtered}
      />
    </>
  );
}

/** Display names for preview roles; the stored role is what permissions are checked against. */
export const roleLabel: Record<string, string> = {
  Owner: "Fleet Owner",
  Operations: "Operations Manager",
  "Read-only": "Read-only Analyst",
};
export const memberEmail = (name: string) =>
  `${name.replace(/\s+/g, ".").toLowerCase()}@example.invalid`;

/** F06-01 on the FLT 017 layout, fed by the preview store for the selected market. */
export function TeamDirectory() {
  const { state } = usePreview();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All statuses");
  const members = state.records.team.filter((m) => m.market === state.market);
  const rows: TableRow[] = members.map((m) => {
    const person = fixturePerson(m.name);
    const role = roleLabel[m.fields.role] ?? m.fields.role ?? "—";
    return {
      key: m.id,
      search: `${m.name} ${role} ${memberEmail(m.name)}`,
      status: statusLabel(m.status),
      cells: [
        person ? (
          <Person key="p" index={person.index} subtitle={role} />
        ) : (
          <strong key="p">{m.name}</strong>
        ),
        role,
        memberEmail(m.name),
        <Badge key="s">{m.status}</Badge>,
        "Sample · today",
        <Link
          key="a"
          href={portalUrl(`team/${m.id}`)}
          className="fp-text-link"
        >
          See details
        </Link>,
      ],
    };
  });
  const filtered = rows.filter(
    (r) =>
      (r.search ?? "").toLowerCase().includes(search.toLowerCase()) &&
      (status === "All statuses" || r.status === status),
  );
  return (
    <>
      <Header
        title="Team Members"
        description="Manage team members, roles and permissions. Control who can access your fleet operations"
      >
        <Button href="team/invite">
          <Plus size={16} />
          Invite Team Member
        </Button>
      </Header>
      <PreviewBanner />
      <div className="fp-work-links">
        {[
          ["Invitation status", "team/invitations"],
          ["Team activity", "team/activity"],
          ["Transfer ownership", "team/ownership-transfer"],
        ].map(([label, href]) => (
          <Link key={href} href={portalUrl(href)}>
            {label} →
          </Link>
        ))}
      </div>
      <Stats
        items={[
          { label: "All Members", value: String(members.length), tone: "blue" },
          {
            label: "Active",
            value: String(members.filter((m) => m.status === "active").length),
            tone: "green",
          },
          {
            label: "Owners",
            value: String(
              members.filter((m) => m.fields.role === "Owner").length,
            ),
            tone: "orange",
          },
          {
            label: "Inactive",
            value: String(members.filter((m) => m.status !== "active").length),
            tone: "red",
          },
        ]}
      />
      <div className="fp-filters">
        <SearchField
          value={search}
          onChange={setSearch}
          placeholder="Search by name, role or email"
        />
        <Dropdown
          label="Filter status"
          value={status}
          onChange={setStatus}
          options={["All statuses", ...new Set(rows.map((r) => r.status ?? ""))]}
        />
      </div>
      <DataTable
        headers={["Name", "Role", "Email", "Status", "Last Active", "Action"]}
        rows={filtered}
      />
    </>
  );
}

// What an invited driver can do; the invitation role is always Driver (F02-D04).
const driverAccess = [
  "Receive trip requests once verified and eligible",
  "View their assigned vehicle",
  "View their own trip history and earnings",
];

/** F02-D03–D05 on the Desktop - 11 layout. Creates a pending sample invitation; nothing is sent. */
export function InviteDriver() {
  const { state, execute } = usePreview();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [vehicle, setVehicle] = useState("No vehicle yet");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState("");
  const market = marketConfig[state.market];
  const vehicles = state.records.vehicles.filter(
    (v) => v.market === state.market,
  );
  function reset() {
    setStep(0);
    setName("");
    setPhone("");
    setEmail("");
    setMessage("");
    setVehicle("No vehicle yet");
    setConsent(false);
    setCreated("");
  }
  function next(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (step === 0) {
      if (!email.endsWith("@example.invalid"))
        return setError("Use a fictional @example.invalid address only.");
      return setStep(1);
    }
    if (step === 1) {
      if (!consent) return setError("Confirm the invitation disclosure.");
      return setStep(2);
    }
    const result = execute({
      kind: "create",
      collection: "invitations",
      name,
      fields: {
        email,
        phone,
        role: "Driver",
        vehicle: vehicle === "No vehicle yet" ? "" : vehicle,
        message,
        disclosure: "accepted",
        currency: market.currency,
        timezone: market.zone,
        invitationType: "driver",
      },
    });
    if (!result.ok) return setError(result.error);
    setCreated(result.id);
  }
  return (
    <>
      <Header
        title="Invite a Driver"
        description="Send an invitation to join your fleet. The driver will receive a secure link to complete their registration"
        back={{ label: "Back to Drivers", path: "drivers" }}
      />
      <PreviewBanner />
      {created ? (
        <Panel title="Invitation created">
          <p role="status" className="fp-success">
            Reference {created.toUpperCase()} is pending. No email or SMS was
            sent in this preview.
          </p>
          <div className="fp-work-actions">
            <Button href={`invitations/${created}`}>View invitation</Button>
            <Button secondary onClick={reset}>
              Invite another driver
            </Button>
          </div>
        </Panel>
      ) : (
        <>
          <Steps
            labels={["Driver Details", "Invite & permissions", "Review & send"]}
            current={step}
          />
          <form className="fp-form" onSubmit={next}>
            {step === 0 ? (
              <>
                <h2>Driver information</h2>
                <div className="fp-two">
                  <Field
                    label="Full name"
                    required
                    placeholder="Enter driver’s full name"
                    value={name}
                    onChange={setName}
                  />
                  <Field
                    label={`Phone number (${market.phone})`}
                    type="tel"
                    required
                    placeholder="Fictional number"
                    value={phone}
                    onChange={setPhone}
                  />
                  <Field
                    label="Email address"
                    type="email"
                    required
                    placeholder="name@example.invalid"
                    value={email}
                    onChange={setEmail}
                  />
                  <Field
                    label={
                      state.market === "NG"
                        ? "National identity number (optional)"
                        : "Driver licence number (optional)"
                    }
                    placeholder="Not stored in this preview"
                  />
                </div>
                <h2>Invite Message</h2>
                <label className="fp-field">
                  Personalized message (optional)
                  <textarea
                    maxLength={200}
                    placeholder="Type message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <small>{message.length}/200</small>
                </label>
                <h2>Fleet Assignment</h2>
                <Field label="Vehicle (optional)">
                  <Dropdown
                    label="Proposed vehicle"
                    value={vehicle}
                    onChange={setVehicle}
                    options={[
                      "No vehicle yet",
                      ...vehicles.map((v) => `${v.name} · ${v.fields.plate}`),
                    ]}
                  />
                </Field>
                <Info>
                  A proposed vehicle is only assigned after the driver is
                  verified and passes the eligibility check.
                </Info>
              </>
            ) : step === 1 ? (
              <>
                <h2>Invite & permissions</h2>
                <KeyValues
                  items={[
                    ["Organization", "Lagos Move Fleet"],
                    ["Invitation role", "Driver"],
                    ["Market", market.name],
                    ["Expires", "7 days after sending (sample)"],
                  ]}
                />
                <h3>Driver access</h3>
                {driverAccess.map((t) => (
                  <label key={t} className="fp-check">
                    <input type="checkbox" checked disabled />
                    {t}
                  </label>
                ))}
                <label className="fp-check">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                  />
                  I confirm the driver agreed to be contacted, and I reviewed the
                  organization, role and expiry
                </label>
              </>
            ) : (
              <>
                <h2>Review & send</h2>
                <KeyValues
                  items={[
                    ["Name", name],
                    ["Phone", phone],
                    ["Email", email],
                    ["Proposed vehicle", vehicle],
                    ["Message", message || "—"],
                    ["Role", "Driver"],
                  ]}
                />
                <Info>
                  This preview does not send invitations. Live delivery
                  requires the fleet backend.
                </Info>
              </>
            )}
            {error && (
              <p role="alert" className="fp-error">
                {error}
              </p>
            )}
            <div className="fp-form-actions">
              {step > 0 ? (
                <Button secondary onClick={() => setStep(step - 1)}>
                  Back
                </Button>
              ) : (
                <Button secondary href="drivers">
                  Cancel
                </Button>
              )}
              <Button type="submit">
                {step === 2 ? "Create invitation" : "Continue"}
              </Button>
            </div>
          </form>
        </>
      )}
    </>
  );
}

/** F02-D06 on the Desktop - 9 layout, fed by the preview store for the selected market. */
export function InvitationDirectory() {
  const { state } = usePreview();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All statuses");
  const invitations = state.records.invitations.filter(
    (i) => i.market === state.market && i.fields.invitationType !== "team",
  );
  const count = (s: string) => invitations.filter((i) => i.status === s).length;
  const rows: TableRow[] = invitations.map((inv) => ({
    key: inv.id,
    search: `${inv.name} ${inv.fields.email ?? ""} ${inv.id}`,
    status: statusLabel(inv.status),
    cells: [
      <span key="n">
        <strong>{inv.name}</strong>
        <small>{inv.fields.email ?? inv.id}</small>
      </span>,
      "30 Oct 2026",
      <Badge key="s">{inv.status}</Badge>,
      inv.fields.vehicle || "—",
      <RowActions
        key="a"
        path={`invitations/${inv.id}`}
        label={inv.name}
        invite={["pending", "expired", "failed"].includes(inv.status)}
      />,
    ],
  }));
  const filtered = rows.filter(
    (r) =>
      (r.search ?? "").toLowerCase().includes(search.toLowerCase()) &&
      (status === "All statuses" || r.status === status),
  );
  return (
    <>
      <Header
        title="Driver Invitation"
        description="Track and manage invitations sent to join your fleet"
      >
        <Button href="drivers/invite">
          <Plus size={16} />
          Invite Driver
        </Button>
      </Header>
      <PreviewBanner />
      <Stats
        items={[
          { label: "Total Invitations", value: String(invitations.length), tone: "blue" },
          { label: "Pending", value: String(count("pending")), tone: "orange" },
          { label: "Accepted", value: String(count("accepted")), tone: "green" },
          { label: "Expired", value: String(count("expired")), tone: "red" },
        ]}
      />
      <div className="fp-filters">
        <SearchField
          value={search}
          onChange={setSearch}
          placeholder="Search by name, email or reference"
        />
        <Dropdown
          label="Filter status"
          value={status}
          onChange={setStatus}
          options={["All statuses", ...new Set(rows.map((r) => r.status ?? ""))]}
        />
      </div>
      <DataTable
        headers={["Driver", "Invited on", "Status", "Vehicle", "Actions"]}
        rows={filtered}
      />
    </>
  );
}
