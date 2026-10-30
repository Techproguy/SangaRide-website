"use client";
import Link from "next/link";
import { useState } from "react";
import { Mail, Phone, Pencil, Star, Trash2 } from "lucide-react";
import { people, portalUrl } from "@/lib/fleet-portal";
import {
  Asset,
  Badge,
  Button,
  DataTable,
  DemoForm,
  Dialog,
  Dropdown,
  Field,
  Header,
  Info,
  KeyValues,
  Panel,
  Person,
  Stats,
  Tabs,
  statusLabel,
} from "./ui";
import { FleetMap, Trend, sampleGross } from "./Overview";
import {
  allocation,
  formatMoney,
  marketConfig,
  type PreviewRecord,
} from "@/lib/fleet-preview-domain";
import {
  fixturePerson,
  fixtureVehicle,
  memberEmail,
  perTrip,
  roleLabel,
  samplePhone,
  samplePlaces,
} from "./Directory";
import { usePreview } from "./PreviewProvider";
import { PreviewBanner } from "./WorkflowUI";

const vehicleTabs = [
  ["Overview", "overview"],
  ["Documents", "documents"],
  ["Maintenance", "maintenance"],
  ["Assignments", "assignments"],
  ["Trip History", "trips"],
  ["Earnings", "earnings"],
];
export function VehicleBanner({ record }: { record: PreviewRecord }) {
  const fixture = fixtureVehicle(record.name);
  return (
    <div className="fp-entity-banner">
      <Asset
        screen="922:13308"
        name={fixture?.image ?? "imgFavpng885D290E782F4F3Ce6D77D44Cefe13C81"}
        width={258}
        height={135}
        className="fp-entity-car"
        alt={record.name}
      />
      <div>
        <h1>
          {record.name} <Badge>{record.status}</Badge>
        </h1>
        <p>
          <span className="fp-id">{record.fields.plate ?? "No plate"}</span>{" "}
          2021 | {record.fields.service ?? "Service pending"}
        </p>
        <div className="fp-vehicle-specs">
          <span>
            <Asset
              screen="922:13308"
              name="imgIcOutlineAirlineSeatReclineNormal"
              width={20}
              height={20}
            />
            {record.fields.seats ?? "—"} Seat
          </span>
          <span>
            <Asset
              screen="922:13308"
              name="imgBoxiconsPetrolPumpFilled"
              width={20}
              height={20}
            />
            Petrol
          </span>
          <span>
            <Asset
              screen="922:13308"
              name="imgBoxiconsCarFilled"
              width={20}
              height={20}
            />
            {fixture?.type ?? "—"}
          </span>
        </div>
      </div>
    </div>
  );
}
function EditButton({
  onClick,
  label = "Edit",
}: {
  onClick: () => void;
  label?: string;
}) {
  return (
    <button className="fp-text-link" onClick={onClick}>
      <Pencil size={15} />
      {label}
    </button>
  );
}
export function VehicleDetail({
  tab,
  record,
}: {
  tab: string;
  record: PreviewRecord;
}) {
  const [edit, setEdit] = useState("");
  const [docFilter, setDocFilter] = useState("All Documents (6)");
  const [extraDocs, setExtraDocs] = useState<string[]>([]);
  const [selectedDocument, setSelectedDocument] = useState("");
  const [make, model = ""] = record.name.split(/\s+(.*)/);
  const [vehicleName, setVehicleName] = useState(make);
  const { state } = usePreview();
  const money = (n: number) => formatMoney(n, state.market);
  // Assignments go through the validated workflow; the designed tab only reflects the store.
  const active = state.records.assignments.find(
    (a) => a.status === "active" && a.fields.vehicle === record.id,
  );
  const driverRecord = state.records.drivers.find(
    (d) => d.id === active?.fields.driver,
  );
  const assignedPerson = driverRecord && fixturePerson(driverRecord.name);
  const issues = state.records.issues.filter(
    (i) => i.fields.vehicle === record.id,
  );
  const split = allocation(sampleGross[state.market] / 20, 1500, 2000);
  const documents = [
    "Vehicle Registration",
    "Insurance Certificate",
    "Roadworthiness Certificate",
    "Emission Certificate",
    "Vehicle Photos",
    "Other Document",
    ...extraDocs,
  ];
  return (
    <>
      <Header title="" back={{ label: "Back to Vehicles", path: "vehicles" }} />
      <PreviewBanner />
      <VehicleBanner record={record} />
      <Tabs
        active={vehicleTabs.find((t) => t[1] === tab)?.[0] ?? "Overview"}
        items={vehicleTabs.map(([label, key]) => ({
          label,
          path: `vehicles/${record.id}/${key}`,
        }))}
      />
      <div className="fp-work-links">
        {[
          ["Edit vehicle", "edit"],
          ["Review status", "review"],
          ["Suspend / retire / reactivate", "manage"],
        ].map(([label, key]) => (
          <Link key={key} href={portalUrl(`vehicles/${record.id}/${key}`)}>
            {label} →
          </Link>
        ))}
      </div>
      {tab === "overview" ? (
        <>
          <div className="fp-two">
            <Panel
              title="Vehicle Information"
              action={
                <EditButton onClick={() => setEdit("Vehicle Information")} />
              }
            >
              <KeyValues
                items={[
                  ["Make", vehicleName],
                  ["Model", model],
                  ["Year", "2021"],
                  ["Plate Number", record.fields.plate ?? "—"],
                  ["VIN", "JTNB4MBE9M213456"],
                  ["Vehicle Type", "Economy"],
                  ["Fuel Type", "Petrol"],
                  ["Transmission", "Automatic"],
                  ["Seating Capacity", record.fields.seats ?? "—"],
                  ["Status", <Badge key="s">{record.status}</Badge>],
                  ["Date Added", "12 Jan 2024"],
                ]}
              />
            </Panel>
            <div className="fp-stack">
              <Panel
                title="Current Assignment"
                action={
                  <Link
                    className="fp-text-link"
                    href={portalUrl(`vehicles/${record.id}/assignments`)}
                  >
                    Change
                  </Link>
                }
              >
                {assignedPerson ? (
                  <>
                    <Person large index={assignedPerson.index} />
                    <Badge>Active</Badge>
                  </>
                ) : (
                  <p className="fp-muted">No active driver assignment.</p>
                )}
              </Panel>
              <Panel
                title="Key Dates"
                action={<EditButton onClick={() => setEdit("Key Dates")} />}
              >
                <KeyValues
                  items={[
                    ["Registration Expiry", "12 Jan 2026"],
                    ["Insurance Expiry", "10 Feb 2026"],
                    ["Plate Number Expiry", "05 Mar 2026"],
                    ["Roadworthiness Expiry", "12 Mar 2026"],
                  ]}
                />
              </Panel>
            </div>
          </div>
          <Stats
            items={[
              { label: "Total Trips (Last 30 Days)", value: "150" },
              {
                label: "Total Earning (Last 30 Days)",
                value: money(split.gross),
              },
              { label: "Average Rating", value: "4.8" },
            ]}
          />
        </>
      ) : tab === "documents" ? (
        <>
          <Header
            title="Vehicle Documents"
            description="Upload and manage all documents for this vehicle. Keep them up to date to stay compliant."
          >
            <Button onClick={() => setEdit("Upload Document")}>
              + Upload Document
            </Button>
          </Header>
          <Tabs
            active={docFilter}
            onChange={setDocFilter}
            items={[
              "All Documents (6)",
              "Required (6)",
              "Expiring Soon (2)",
              "Expired (1)",
            ].map((label) => ({ label }))}
          />
          <DataTable
            paginate={false}
            headers={[
              "Document Type",
              "Status",
              "Expiry Date",
              "Uploaded On",
              "Actions",
            ]}
            rows={documents
              .map((d, i) => ({
                key: d,
                cells: [
                  <span className="fp-document" key="d">
                    <Asset
                      name="imgBoxiconsFileReport"
                      width={20}
                      height={20}
                    />
                    <span>
                      {d}
                      <small>{i < 3 ? "Required" : "Optional"}</small>
                    </span>
                  </span>,
                  <Badge key="s">
                    {i === 2 ? "Expiring Soon" : i === 5 ? "Expired" : "Valid"}
                  </Badge>,
                  [
                    "12 Jan 2027",
                    "10 Feb 2027",
                    "05 Mar 2027",
                    "20 Apr 2027",
                    "—",
                    "15 Sep 2027",
                  ][i % 6],
                  "12 Jan 2024",
                  <button
                    key="a"
                    className="fp-text-link"
                    onClick={() => setEdit(`Document: ${d}`)}
                  >
                    View
                  </button>,
                ],
              }))
              .filter(
                (_, i) =>
                  docFilter.startsWith("All") ||
                  (docFilter.startsWith("Required") && i < 3) ||
                  (docFilter.startsWith("Expiring") && i === 2) ||
                  (docFilter.startsWith("Expired") && i === 5),
              )}
          />
        </>
      ) : tab === "assignments" ? (
        <>
          <div className="fp-two">
            <Panel title="Current Assignment">
              {active && assignedPerson ? (
                <>
                  <Person large index={assignedPerson.index} />
                  <p className="fp-contact">
                    <Phone size={14} />
                    {samplePhone(assignedPerson.phone, state.market)}
                  </p>
                  <KeyValues
                    items={[
                      ["Assignment", active.id],
                      ["Status", <Badge key="s">{active.status}</Badge>],
                    ]}
                  />
                  <Button secondary href={`assignments/${active.id}`}>
                    <Trash2 size={15} />
                    Remove Assignment
                  </Button>
                </>
              ) : (
                <p className="fp-muted">No driver assigned.</p>
              )}
            </Panel>
            <Panel title="Assign a Driver">
              <p className="fp-muted">
                Driver licence, vehicle documents, open maintenance holds and
                overlapping assignments are checked before an assignment is
                created.
              </p>
              <Button href="assignments/new">Assign Driver</Button>
            </Panel>
          </div>
          <DataTable
            title="Assignment History"
            paginate={false}
            headers={[
              "Driver",
              "Driver ID",
              "Assigned on",
              "Unassigned on",
              "Duration",
              "Status",
            ]}
            rows={people.slice(0, 3).map((p, i) => ({
              key: p.id,
              cells: [
                <Person index={i} key="p" />,
                p.id,
                "19 Jan 2024",
                "12 Jan 2027",
                "8 Months",
                <Badge key="s">{i ? "Completed assignment" : "Current"}</Badge>,
              ],
            }))}
          />
        </>
      ) : (
        <>
          <Stats
            items={(tab === "maintenance"
              ? [
                  ["Total Issues", String(issues.length)],
                  [
                    "In Progress",
                    String(
                      issues.filter((i) =>
                        ["triaged", "in_progress"].includes(i.status),
                      ).length,
                    ),
                  ],
                  [
                    "Resolved",
                    String(issues.filter((i) => i.status === "resolved").length),
                  ],
                  [
                    "Open",
                    String(
                      issues.filter(
                        (i) =>
                          !["resolved", "cancelled_as_duplicate"].includes(
                            i.status,
                          ),
                      ).length,
                    ),
                  ],
                ]
              : tab === "trips"
                ? [
                    ["Total Trips", "155"],
                    ["In Progress", "1"],
                    ["Completed", "120"],
                    ["Cancelled", "35"],
                  ]
                : [
                    ["Total Earnings", money(split.gross)],
                    ["Your Commission", money(split.fleet)],
                    ["Driver Payouts", money(split.driver)],
                    ["Completed Trips", "120"],
                  ]
            ).map(([label, value]) => ({ label, value }))}
          />
          <DataTable
            title={
              tab === "maintenance"
                ? "Maintenance History"
                : "Active Trips (42)"
            }
            paginate={false}
            headers={
              tab === "maintenance"
                ? [
                    "ID",
                    "Driver",
                    "Issue Type",
                    "Reported date",
                    "Status",
                    "Action",
                  ]
                : [
                    "Driver",
                    "Trip Type",
                    "Pickup",
                    "Drop off",
                    "Date/Time",
                    tab === "earnings" ? "Amount" : "End Time",
                    "Status",
                  ]
            }
            rows={
              tab === "maintenance"
                ? issues.map((issue) => ({
                    key: issue.id,
                    cells: [
                      issue.id.toUpperCase(),
                      issue.fields.owner ?? "—",
                      issue.name,
                      "30 Oct 2026",
                      <Badge key="s">{issue.status}</Badge>,
                      <Button href={`maintenance/${issue.id}`} key="a">
                        View details
                      </Button>,
                    ],
                  }))
                : people.slice(0, 6).map((p, i) => ({
              key: p.id,
              cells: [
                      <Person index={0} key="p" />,
                      [
                        "Drop",
                        "Delivery",
                        "Drop",
                        "Airport Ride",
                        "Drop",
                        "Drop",
                      ][i],
                      samplePlaces[state.market][0],
                      samplePlaces[state.market][i ? 2 : 1],
                      "2 Sep 26 10:00 AM",
                      tab === "earnings" ? money(500_000) : "11:00 AM",
                      <Badge key="s">
                        {i === 0
                          ? "On Trip"
                          : i === 2
                            ? "Cancelled"
                            : "Completed"}
                      </Badge>,
                    ],
            }))
            }
          />
        </>
      )}
      {edit && (
        <Dialog title={edit} onClose={() => setEdit("")}>
          {edit === "Upload Document" ? (
            <DemoForm
              button="Add document preview"
              onSave={() => {
                if (selectedDocument)
                  setExtraDocs((d) => [...d, selectedDocument]);
                setSelectedDocument("");
                setEdit("");
              }}
            >
              <Field label="Document type">
                <Dropdown
                  label="Document type"
                  options={documents.slice(0, 6)}
                />
              </Field>
              <label className="fp-field">
                Choose document
                <input
                  type="file"
                  required
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    setSelectedDocument(file?.name ?? "");
                  }}
                />
              </label>
              <Field label="Expiry date" type="date" />
              <Info>
                Files stay on your device. No document is uploaded in this
                preview.
              </Info>
            </DemoForm>
          ) : edit.startsWith("Document:") ? (
            <Info>
              This is an illustrative document record. No private document is
              attached to this demo.
            </Info>
          ) : (
            <DemoForm onSave={() => setEdit("")}>
              <Field
                label={edit === "Key Dates" ? "Registration Expiry" : "Make"}
                type={edit === "Key Dates" ? "date" : "text"}
                value={edit === "Key Dates" ? undefined : vehicleName}
                onChange={setVehicleName}
              />
              <Field
                label={edit === "Key Dates" ? "Insurance Expiry" : "Model"}
                defaultValue={edit === "Key Dates" ? "2027-02-10" : model}
              />
            </DemoForm>
          )}
        </Dialog>
      )}
    </>
  );
}

export function DriverDetail({
  record,
  person,
}: {
  record: PreviewRecord;
  person: NonNullable<ReturnType<typeof fixturePerson>>;
}) {
  const [tab, setTab] = useState("Overview");
  const [edit, setEdit] = useState(false);
  const { state } = usePreview();
  const money = (n: number) => formatMoney(n, state.market);
  const email = `${person.name.replace(/\s+/g, "").toLowerCase()}@example.invalid`;
  const phone = samplePhone(person.phone, record.market);
  const vehicle = state.records.vehicles.find(
    (v) =>
      v.id ===
      state.records.assignments.find(
        (a) => a.status === "active" && a.fields.driver === record.id,
      )?.fields.vehicle,
  );
  return (
    <>
      <Header title="" back={{ label: "Back to Drivers", path: "drivers" }} />
      <PreviewBanner />
      <div className="fp-profile-header">
        <Person large index={person.index} screen="922:19307" />
        <div>
          <h1>{record.name}</h1>
          <span className="fp-id">{person.id}</span>{" "}
          <Badge>{record.status}</Badge>
          <p className="fp-contact">
            <Phone size={15} />
            {phone} <Mail size={15} />
            {email}{" "}
            <span>
              {marketConfig[record.market].name} · Joined 12 Jun 2024
            </span>
          </p>
        </div>
      </div>
      <div className="fp-work-links">
        {[
          ["Verification", "verification"],
          ["Activation", "activation"],
          ["Suspend / reactivate / remove", "manage"],
          ["Driver split", "split"],
        ].map(([label, key]) => (
          <Link key={key} href={portalUrl(`drivers/${record.id}/${key}`)}>
            {label} →
          </Link>
        ))}
      </div>
      <Tabs
        active={tab}
        onChange={setTab}
        items={[
          "Overview",
          "Documents",
          "Vehicle",
          "Earnings",
          "Trip History",
        ].map((label) => ({ label }))}
      />
      {tab === "Overview" ? (
        <>
          <div className="fp-two">
            <Panel
              title="Driver information"
              action={<EditButton onClick={() => setEdit(true)} />}
            >
              <KeyValues
                items={[
                  ["Full name", record.name],
                  ["Phone number", phone],
                  ["Email address", email],
                  ["Date of birth", "14 May 1990"],
                  ["Market", marketConfig[record.market].name],
                  ["Driver I.D", person.id],
                  ["Presence", record.fields.presence ?? "Unknown"],
                  ["Eligibility", <Badge key="v">{record.status}</Badge>],
                ]}
              />
            </Panel>
            <Panel title="Performance (last 30 days)">
              <Stats
                items={[
                  { label: "Total trips", value: String(person.trips) },
                  { label: "Completion rate", value: "98%" },
                  { label: "Average rating", value: "4.0 ★" },
                ]}
              />
              <Trend />
            </Panel>
          </div>
          <DataTable
            title="Recent trips"
            headers={["Date", "Pickup", "Drop off location", "Fare", "Status"]}
            paginate={false}
            rows={people.slice(0, 3).map((p, i) => ({
              key: p.id,
              cells: [
                "29 Sep 2026 10:24 AM",
                samplePlaces[record.market][0],
                samplePlaces[record.market][1],
                money(380_000),
                <Badge key="s">{i ? "Completed" : "In progress"}</Badge>,
              ],
            }))}
          />
        </>
      ) : tab === "Vehicle" ? (
        <Panel title="Assigned Vehicle">
          {vehicle ? (
            <>
              <VehicleBanner record={vehicle} />
              <Button href={`vehicles/${vehicle.id}/overview`}>
                View vehicle
              </Button>
            </>
          ) : (
            <>
              <p className="fp-muted">No active vehicle assignment.</p>
              <Button href="assignments/new">Assign a vehicle</Button>
            </>
          )}
        </Panel>
      ) : tab === "Documents" ? (
        <DataTable
          headers={["Document", "Status", "Expiry date", "Action"]}
          rows={["Driver’s license", "Identity document", "Profile photo"].map(
            (d, i) => ({
              key: d,
              cells: [
                d,
                <Badge key="s">
                  {i === 0 && record.fields.license === "expired"
                    ? "Expired"
                    : "Valid"}
                </Badge>,
                "12 Jan 2027",
                <Button secondary key="b" onClick={() => setEdit(true)}>
                  View details
                </Button>,
              ],
            }),
          )}
        />
      ) : (
        <>
          <Stats
            items={[
              {
                label: "Total Earnings",
                value: money(person.trips * perTrip[state.market]),
              },
              { label: "Completed trips", value: String(person.trips) },
            ]}
          />
          <Trend />
        </>
      )}
      {edit && (
        <Dialog title="Driver information" onClose={() => setEdit(false)}>
          <DemoForm onSave={() => setEdit(false)}>
            <Field label="Full name" defaultValue={record.name} />
            <Field label="Phone number" defaultValue={phone} />
            <Field label="Email address" defaultValue={email} />
          </DemoForm>
        </Dialog>
      )}
    </>
  );
}

const accessByRole: Record<string, [string, string][]> = {
  Owner: [
    ["Drivers", "Full Access"],
    ["Vehicles", "Full Access"],
    ["Trip & Live Operations", "Full Access"],
    ["Earnings & Payouts", "Full Access"],
    ["Team Management", "Full Access"],
    ["Settings", "Full Access"],
  ],
  Operations: [
    ["Drivers", "Full Access"],
    ["Vehicles", "Full Access"],
    ["Trip & Live Operations", "Full Access"],
    ["Earnings & Payouts", "No Access"],
    ["Team Management", "No Access"],
    ["Settings", "View Only"],
  ],
  "Read-only": [
    ["Drivers", "View Only"],
    ["Vehicles", "View Only"],
    ["Trip & Live Operations", "View Only"],
    ["Earnings & Payouts", "View Only"],
    ["Team Management", "No Access"],
    ["Settings", "No Access"],
  ],
};

/** F06-02 on the FLT 018 layout. Role and access changes go through the reviewed workflow. */
export function TeamDetail({ record }: { record: PreviewRecord }) {
  const [tab, setTab] = useState("Overview");
  const { state } = usePreview();
  const person = fixturePerson(record.name);
  const role = roleLabel[record.fields.role] ?? record.fields.role ?? "—";
  const access = accessByRole[record.fields.role] ?? accessByRole["Read-only"];
  const activity = state.audit.filter(
    (e) => e.fields.collection === "team" && e.fields.target === record.id,
  );
  return (
    <>
      <Header title="" back={{ label: "Back to Team Members", path: "team" }} />
      <PreviewBanner />
      <div className="fp-profile-header">
        {person && <Person large index={person.index} screen="922:17128" />}
        <div>
          <h1>{record.name}</h1>
          <span className="fp-id">{role}</span> <Badge>{record.status}</Badge>
          <p className="fp-contact">
            {memberEmail(record.name)} · {marketConfig[record.market].name} ·
            Joined 12 Jun 2024
          </p>
        </div>
      </div>
      <div className="fp-work-links">
        {[
          ["Change role and scope", `team/${record.id}/permissions`],
          ["Suspend / revoke access", `team/${record.id}/manage`],
          ...(record.fields.role === "Owner"
            ? [["Transfer ownership", "team/ownership-transfer"]]
            : []),
        ].map(([label, href]) => (
          <Link key={href} href={portalUrl(href)}>
            {label} →
          </Link>
        ))}
      </div>
      <Tabs
        active={tab}
        onChange={setTab}
        items={[{ label: "Overview" }, { label: "Activity Log" }]}
      />
      {tab === "Activity Log" ? (
        activity.length ? (
          <DataTable
            headers={["Event", "Change", "Reason", "Correlation"]}
            rows={activity.map((e) => ({
              key: e.id,
              cells: [
                e.id,
                <Badge key="s">{e.status}</Badge>,
                e.fields.reason ?? "—",
                e.fields.correlationId ?? "—",
              ],
            }))}
          />
        ) : (
          <Panel title="No activity yet">
            <p className="fp-muted">
              Role and access changes made in this preview appear here.
            </p>
          </Panel>
        )
      ) : (
        <div className="fp-two">
          <div className="fp-stack">
            <Panel title="Personal Information">
              <KeyValues
                items={[
                  ["Full name", record.name],
                  ["Email address", memberEmail(record.name)],
                  ["Role", role],
                  ["Market scope", record.fields.scope ?? record.market],
                  ["Status", <Badge key="s">{record.status}</Badge>],
                  ["Date Joined", "12 Jun 2024"],
                ]}
              />
            </Panel>
            <Panel title="Access Summary">
              <KeyValues items={access} />
            </Panel>
          </div>
          <Panel title="Role & Permissions">
            <KeyValues items={[["Current Role", role]]} />
            <h3>Permissions</h3>
            {access.map(([area, level]) => (
              <label className="fp-check" key={area}>
                <input
                  type="checkbox"
                  checked={level !== "No Access"}
                  disabled
                />
                {area} · {level}
              </label>
            ))}
            <Info>
              Role changes are reviewed requests and must be enforced by the
              backend. The last active owner cannot be removed or demoted.
            </Info>
            <Button href={`team/${record.id}/permissions`}>
              Request role change
            </Button>
          </Panel>
        </div>
      )}
    </>
  );
}

// Designed timeline steps, one per maintenance state (F05 state model).
const issueStages: [string, string][] = [
  ["reported", "Issue reported by Driver"],
  ["triaged", "Assigned to support"],
  ["in_progress", "Vehicle inspected"],
  ["resolution_submitted", "Vehicle Repaired"],
  ["resolved", "Maintenance complete"],
];

/** F05-02 on the FLT 48 layout. Status moves only through the triage / update / resolve steps. */
export function IssueDetail({ record }: { record: PreviewRecord }) {
  const { state } = usePreview();
  const vehicle = state.records.vehicles.find(
    (v) => v.id === record.fields.vehicle,
  );
  const fixture = vehicle && fixtureVehicle(vehicle.name);
  const reporter = state.records.drivers.find(
    (d) => d.id === record.fields.reportedBy,
  );
  const person = reporter && fixturePerson(reporter.name);
  const stage = issueStages.findIndex(
    ([s]) => s === (record.status === "reopened" ? "triaged" : record.status),
  );
  const open = !["resolved", "cancelled_as_duplicate"].includes(record.status);
  return (
    <>
      <Header
        title="Issue Details"
        description="View full details of this vehicle issue, including updates, resolution and related costs"
        back={{ label: "Back to Vehicle Issues", path: "maintenance" }}
      />
      <PreviewBanner />
      <div className="fp-work-links">
        {[
          ["Triage", "triage"],
          ["Work order update", "update"],
          ["Resolution review", "resolve"],
        ].map(([label, key]) => (
          <Link key={key} href={portalUrl(`maintenance/${record.id}/${key}`)}>
            {label} →
          </Link>
        ))}
      </div>
      <Panel>
        <div className="fp-three">
          <div>
            <Badge>{record.status}</Badge>
            <h2>{record.name}</h2>
            <p>{record.id.toUpperCase()}</p>
            <small>Reported on 30 Oct 2026</small>
          </div>
          {vehicle ? (
            <span className="fp-vehicle-cell">
              {fixture && (
                <Asset
                  screen="922:15642"
                  name={fixture.image}
                  width={150}
                  height={90}
                />
              )}
              <span>
                {vehicle.name}
                <small>{vehicle.fields.plate}</small>
              </span>
            </span>
          ) : (
            <span />
          )}
          {person ? (
            <Person large index={person.index} screen="922:15642" />
          ) : (
            <span />
          )}
        </div>
        <div className="fp-issue-meta">
          <KeyValues
            items={[
              ["Issue type", record.fields.type ?? record.name],
              ["Severity", statusLabel(record.fields.severity ?? "unrated")],
              [
                "Vehicle availability",
                open && record.fields.severity === "critical"
                  ? "Held from new assignments"
                  : "Not held by this issue",
              ],
              ["Reported by", reporter?.name ?? "—"],
              ["Owner", record.fields.owner ?? "Unassigned"],
            ]}
          />
        </div>
      </Panel>
      <div className="fp-two">
        <div className="fp-stack">
          <Panel title="Description">
            <p className="fp-muted">
              {record.fields.description ?? "No description provided."}
            </p>
            {record.id === "iss-2711" && (
              <div className="fp-photo-strip">
                {[
                  "imgIgorConstantinoDczK3XiqdfsUnsplash1",
                  "imgToyota02FrontSeat1",
                  "imgToyota05Trunk1",
                ].map((n) => (
                  <Asset
                    screen="922:15642"
                    name={n}
                    width={64}
                    height={64}
                    key={n}
                  />
                ))}
              </div>
            )}
          </Panel>
          <Panel title="Associated Cost">
            <p className="fp-big-blue">
              {record.fields.cost
                ? formatMoney(Number(record.fields.cost), record.market)
                : "Not recorded"}
            </p>
            <small className="fp-muted">
              Costs are captured in a work order update.
            </small>
          </Panel>
        </div>
        <Panel title="Timeline">
          {record.status === "cancelled_as_duplicate" && (
            <Info>Closed as a duplicate report.</Info>
          )}
          <ol className="fp-timeline">
            {issueStages.map(([, label], i) => (
              <li key={label} className={i <= stage ? "active" : ""}>
                <span>{i + 1}</span>
                <small>{i <= stage ? "Done" : "----"}</small>
                <strong>{label}</strong>
              </li>
            ))}
          </ol>
          <Info>
            A resolved issue does not clear an independent document or
            compliance hold.
          </Info>
        </Panel>
      </div>
    </>
  );
}

export function TripDetail() {
  return (
    <>
      <Header
        title="Trip TRP-99321"
        description="Started 10:24 AM · Last location update 30 Oct 2026 09:00 UTC (sample)"
        back={{ label: "Back to Trips", path: "operations" }}
      />
      <div className="fp-two fp-trip-grid">
        <div className="fp-stack">
          <Panel title="Driver Information">
            <Person large screen="922:15908" />
            <p className="fp-contact">
              <Phone size={15} />
              08022024007 <Star size={15} color="#ffaa00" />
              4.8
            </p>
          </Panel>
          <Panel title="Vehicle Information">
            <span className="fp-vehicle-cell">
              <Asset
                screen="922:15908"
                name="imgFavpng885D290E782F4F3Ce6D77D44Cefe13C81"
                width={150}
                height={90}
              />
              <span>
                <strong>Toyota Rav4</strong>
                <small>LND-204-BD · 4 Seat · Sedan</small>
              </span>
            </span>
          </Panel>
          <Panel title="Trip Information">
            <KeyValues
              items={[
                ["Trip ID", "TRIP-99321"],
                ["Service Type", "Standard Ride"],
                ["Pickup", "Ikeja City Mall, Ikeja"],
                ["Drop-off", "Victoria Island, Lagos"],
                ["Distance", "12.4km"],
                ["Fare", "₦8,300"],
                ["Start Time", "29 Sep 2026, 10:24 AM"],
                ["Est Duration", "28 Minutes"],
                ["Payment Option", "Card (User)"],
                ["Status", <Badge key="s">In Progress</Badge>],
              ]}
            />
          </Panel>
        </div>
        <div className="fp-stack">
          <Panel title="Trip Map">
            <FleetMap trip />
            <h2>Trip Timeline</h2>
            <ol className="fp-timeline">
              {[
                "Driver accepted your request",
                "En route to drop-off",
                "Estimated drop off",
              ].map((s, i) => (
                <li key={s} className={i < 2 ? "active" : ""}>
                  <span>
                    <Asset
                      screen="922:15908"
                      name={
                        ["imgGroup19784", "imgGroup19762", "imgGroup20165"][i]
                      }
                      width={36}
                      height={36}
                    />
                  </span>
                  <small>{["10:24 AM", "10:26 AM", "10:52 AM"][i]}</small>
                  <strong>{s}</strong>
                </li>
              ))}
            </ol>
          </Panel>
          {/* Rider personal data is privacy-restricted for fleet staff (F03). */}
          <Panel title="Passenger Information">
            <p>
              <strong>Sample rider</strong>
            </p>
            <p className="fp-contact">
              Contact details hidden for rider privacy. Reach riders through
              Sanga support.
            </p>
          </Panel>
        </div>
      </div>
    </>
  );
}
