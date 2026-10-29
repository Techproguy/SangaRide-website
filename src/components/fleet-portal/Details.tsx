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
  useNotice,
} from "./ui";
import { FleetMap, Trend } from "./Overview";

const vehicleTabs = [
  ["Overview", "overview"],
  ["Documents", "documents"],
  ["Maintenance", "maintenance"],
  ["Assignments", "assignments"],
  ["Trip History", "trips"],
  ["Earnings", "earnings"],
];
export function VehicleBanner() {
  return (
    <div className="fp-entity-banner">
      <Asset
        screen="922:13308"
        name="imgFavpng885D290E782F4F3Ce6D77D44Cefe13C81"
        width={258}
        height={135}
        className="fp-entity-car"
        alt="Toyota Rav4"
      />
      <div>
        <h1>
          Toyota Rav4 <Badge>Active</Badge>
        </h1>
        <p>
          <span className="fp-id">LND-204-BD</span> 2021 | Sanga Plus
        </p>
        <div className="fp-vehicle-specs">
          <span>
            <Asset
              screen="922:13308"
              name="imgIcOutlineAirlineSeatReclineNormal"
              width={20}
              height={20}
            />
            4 Seat
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
            Sedan
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
export function VehicleDetail({ tab }: { tab: string }) {
  const [edit, setEdit] = useState("");
  const [assignment, setAssignment] = useState("Chinedu Okafor");
  const [driver, setDriver] = useState("Chinedu Okafor");
  const [docFilter, setDocFilter] = useState("All Documents (6)");
  const [extraDocs, setExtraDocs] = useState<string[]>([]);
  const [selectedDocument, setSelectedDocument] = useState("");
  const [vehicleName, setVehicleName] = useState("Toyota");
  const notice = useNotice();
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
      <VehicleBanner />
      <Tabs
        active={vehicleTabs.find((t) => t[1] === tab)?.[0] ?? "Overview"}
        items={vehicleTabs.map(([label, key]) => ({
          label,
          path: `vehicles/rav4/${key}`,
        }))}
      />
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
                  ["Model", "Rav4"],
                  ["Year", "2021"],
                  ["Plate Number", "LND-204-BD"],
                  ["VIN", "JTNB4MBE9M213456"],
                  ["Vehicle Type", "Economy"],
                  ["Fuel Type", "Petrol"],
                  ["Transmission", "Automatic"],
                  ["Seating Capacity", "5"],
                  ["Status", <Badge key="s">Active</Badge>],
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
                    href={portalUrl("vehicles/rav4/assignments")}
                  >
                    Change
                  </Link>
                }
              >
                <Person large name={assignment || "Unassigned"} />
                <p className="fp-muted">Assigned since 15 Jan 2024</p>
                <Badge>Active</Badge>
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
              { label: "Total Earning (Last 30 Days)", value: "₦142,500" },
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
              <Person large name={assignment || "No driver assigned"} />
              <p className="fp-contact">
                <Phone size={14} />
                0803 123 4567
              </p>
              <p className="fp-contact">
                <Mail size={14} />
                chinedu.okafor@gmail.com
              </p>
              <KeyValues
                items={[
                  ["Assigned since", "15 Jan 2024"],
                  ["Duration", "8 Months"],
                ]}
              />
              <Button
                secondary
                onClick={() => {
                  setAssignment("");
                  notice("Assignment removed from this preview only.");
                }}
              >
                <Trash2 size={15} />
                Remove Assignment
              </Button>
            </Panel>
            <Panel title="Assign a Driver">
              <p className="fp-muted">
                Search and select driver to assign to this vehicle
              </p>
              <Dropdown
                label="Select driver to assign"
                options={people.map((p) => p.name)}
                value={driver}
                onChange={setDriver}
              />
              <Person name={driver} />
              <Button
                onClick={() => {
                  setAssignment(driver);
                  notice(`${driver} assigned in this preview only.`);
                }}
              >
                Assign Driver
              </Button>
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
                  ["Total Issues", "24"],
                  ["In Progress", "2"],
                  ["Resolved", "24"],
                  ["Overdue", "24"],
                ]
              : tab === "trips"
                ? [
                    ["Total Trips", "155"],
                    ["In Progress", "1"],
                    ["Completed", "120"],
                    ["Cancelled", "35"],
                  ]
                : [
                    ["Total Earnings", "₦3,425,600"],
                    ["Your Commission", "₦342,560"],
                    ["Driver Payouts", "₦2,980,400"],
                    ["Completed Trips", "1,842"],
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
            rows={people.slice(0, 6).map((p, i) => ({
              key: p.id,
              cells:
                tab === "maintenance"
                  ? [
                      "ISS-20212-024",
                      <Person index={i} key="p" />,
                      [
                        "Engine",
                        "Brakes",
                        "Tyre",
                        "Battery",
                        "Suspension",
                        "AC",
                      ][i],
                      "30 Sep 2026",
                      <Badge key="s">In Progress</Badge>,
                      <Button href="maintenance/iss-2711" key="a">
                        View details
                      </Button>,
                    ]
                  : [
                      <Person index={0} key="p" />,
                      [
                        "Drop",
                        "Delivery",
                        "Drop",
                        "Airport Ride",
                        "Drop",
                        "Drop",
                      ][i],
                      "Ikeja City Mall",
                      i ? "Banana Island" : "Victoria Island",
                      "2 Sep 26 10:00 AM",
                      tab === "earnings" ? "₦5,000" : "11:00 AM",
                      <Badge key="s">
                        {i === 0
                          ? "On Trip"
                          : i === 2
                            ? "Cancelled"
                            : "Completed"}
                      </Badge>,
                    ],
            }))}
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
                defaultValue={edit === "Key Dates" ? "2027-02-10" : "Rav4"}
              />
            </DemoForm>
          )}
        </Dialog>
      )}
    </>
  );
}

export function DriverDetail() {
  const [tab, setTab] = useState("Overview");
  const [edit, setEdit] = useState(false);
  return (
    <>
      <Header title="" back={{ label: "Back to Drivers", path: "drivers" }} />
      <div className="fp-profile-header">
        <Person large screen="922:19307" />
        <div>
          <h1>Chinedu Okafor</h1>
          <span className="fp-id">DRV-7821</span> <Badge>Verified</Badge>
          <p className="fp-contact">
            <Phone size={15} />
            08022024007 <Mail size={15} />
            Chineduokafor@gmail.com{" "}
            <span>Lagos, Nigeria · Joined 12 Jun 2024</span>
          </p>
        </div>
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
                  ["Full name", "Chinedu Okafor"],
                  ["Phone number", "08022024007"],
                  ["Email address", "Chineduokafor@gmail.com"],
                  ["Date of birth", "14 May 1990"],
                  ["Address", "Ikeja, Lagos Nigeria"],
                  ["Driver I.D", "DRV-7821"],
                  ["Status", "Active"],
                  ["Verification", <Badge key="v">Verified</Badge>],
                ]}
              />
            </Panel>
            <Panel title="Performance (last 30 days)">
              <Stats
                items={[
                  { label: "Total trips", value: "152" },
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
                "Ikeja City Mall",
                "Victoria Island",
                "₦3,800",
                <Badge key="s">{i ? "Completed" : "In progress"}</Badge>,
              ],
            }))}
          />
        </>
      ) : tab === "Vehicle" ? (
        <Panel title="Assigned Vehicle">
          <VehicleBanner />
          <Button href="vehicles/rav4/overview">View vehicle</Button>
        </Panel>
      ) : tab === "Documents" ? (
        <DataTable
          headers={["Document", "Status", "Expiry date", "Action"]}
          rows={["Driver’s license", "Identity document", "Profile photo"].map(
            (d) => ({
              key: d,
              cells: [
                d,
                <Badge key="s">Valid</Badge>,
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
              { label: "Total Earnings", value: "₦142,500" },
              { label: "Completed trips", value: "152" },
            ]}
          />
          <Trend />
        </>
      )}
      {edit && (
        <Dialog title="Driver information" onClose={() => setEdit(false)}>
          <DemoForm onSave={() => setEdit(false)}>
            <Field label="Full name" defaultValue="Chinedu Okafor" />
            <Field label="Phone number" defaultValue="08022024007" />
            <Field
              label="Email address"
              defaultValue="Chineduokafor@gmail.com"
            />
          </DemoForm>
        </Dialog>
      )}
    </>
  );
}

export function TeamDetail() {
  const [tab, setTab] = useState("Overview");
  const [role, setRole] = useState("Fleet Manager");
  const [edit, setEdit] = useState(false);
  return (
    <>
      <Header title="" back={{ label: "Back to Team Members", path: "team" }} />
      <div className="fp-profile-header">
        <Person large name="Aisha Bello" screen="922:17128" />
        <div>
          <h1>Aisha Bello</h1>
          <span className="fp-id">{role}</span> <Badge>Active</Badge>
          <p className="fp-contact">
            08022024007 · Aishasanga@gmail.com · Joined 12 Jun 2024 · Last
            active Today, 09:15 AM
          </p>
        </div>
      </div>
      <Tabs
        active={tab}
        onChange={setTab}
        items={[{ label: "Overview" }, { label: "Activity Log" }]}
      />
      {tab === "Activity Log" ? (
        <DataTable
          headers={["Date", "Action", "Module"]}
          rows={["Signed in", "Viewed dashboard", "Updated driver profile"].map(
            (a, i) => ({
              key: a,
              cells: [`30 Sep 2026 ${9 + i}:15 AM`, a, "Fleet"],
            }),
          )}
        />
      ) : (
        <div className="fp-two">
          <div className="fp-stack">
            <Panel
              title="Personal Information"
              action={<EditButton onClick={() => setEdit(true)} />}
            >
              <KeyValues
                items={[
                  ["Full name", "Aisha Bello"],
                  ["Phone number", "08022024007"],
                  ["Email address", "aishasanga@gmail.com"],
                  ["Role", role],
                  ["Status", <Badge key="s">Active</Badge>],
                  ["Date Joined", "12 Jan 2024"],
                ]}
              />
            </Panel>
            <Panel title="Access Summary">
              <KeyValues
                items={[
                  ["Drivers", "Full Access"],
                  ["Vehicles", "Full Access"],
                  ["Trip & Live Operations", "View Only"],
                  ["Earnings & Payouts", "View Only"],
                  ["Team Management", "No Access"],
                  ["Settings", "No Access"],
                ]}
              />
            </Panel>
          </div>
          <Panel title="Role & Permissions">
            <DemoForm>
              <Field label="Current Role">
                <Dropdown
                  label="Current Role"
                  value={role}
                  onChange={setRole}
                  options={[
                    "Fleet Manager",
                    "Fleet Owner",
                    "Finance Manager",
                    "Support Agent",
                  ]}
                />
              </Field>
              <h3>Permissions</h3>
              {[
                "View dashboard and analytics",
                "Manage drivers (add, edit, deactivate)",
                "Manage vehicles (add, edit, deactivate)",
                "View live operations and active work",
                "View earnings and payouts",
                "Manage team members",
                "Manage settings",
                "Access reports",
              ].map((p, i) => (
                <label className="fp-check" key={p}>
                  <input type="checkbox" defaultChecked={![5, 6].includes(i)} />
                  {p}
                </label>
              ))}
              <Info>
                Role changes affect this preview only; live permissions require
                server enforcement.
              </Info>
            </DemoForm>
          </Panel>
        </div>
      )}
      {edit && (
        <Dialog title="Personal Information" onClose={() => setEdit(false)}>
          <DemoForm onSave={() => setEdit(false)}>
            <Field label="Full name" defaultValue="Aisha Bello" />
            <Field label="Email address" defaultValue="aishasanga@gmail.com" />
          </DemoForm>
        </Dialog>
      )}
    </>
  );
}

export function IssueDetail() {
  const [stage, setStage] = useState("Assigned to support");
  const [cost, setCost] = useState("85000");
  const [edit, setEdit] = useState(false);
  const stages = [
    "Issue reported by Driver",
    "Assigned to support",
    "Vehicle inspected",
    "Vehicle Repaired",
    "Maintenance complete",
  ];
  return (
    <>
      <Header
        title="Issue Details"
        description="View full details of this vehicle issue, including updates, resolution and related costs"
        back={{ label: "Back to Vehicle Issues", path: "maintenance" }}
      />
      <Panel>
        <div className="fp-three">
          <div>
            <Badge>
              {stage === "Maintenance complete" ? "Resolved" : "In progress"}
            </Badge>
            <h2>Engine Overheating</h2>
            <p>ISS-2711</p>
            <small>Reported on 30 Sep 2026 10:24 AM</small>
          </div>
          <span className="fp-vehicle-cell">
            <Asset
              screen="922:15642"
              name="imgFavpng885D290E782F4F3Ce6D77D44Cefe13C81"
              width={150}
              height={90}
            />
            <span>
              Toyota Rav4<small>LND-204-BD</small>
            </span>
          </span>
          <Person large screen="922:15642" />
        </div>
        <div className="fp-issue-meta">
          <KeyValues
            items={[
              ["Issue type", "Engine"],
              ["Severity", "High"],
              [
                "Vehicle availability",
                stage === "Maintenance complete" ? "Available" : "Unavailable",
              ],
              ["Reported by", "Chinedu Okafor"],
              ["Target resolution", "2 Oct 2026"],
            ]}
          />
        </div>
      </Panel>
      <div className="fp-two">
        <div className="fp-stack">
          <Panel title="Description">
            <p className="fp-muted">
              Vehicle is overheating after 15–20 minutes of driving especially
              in traffic. This has been noticed consistently for two weeks now.
            </p>
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
          </Panel>
          <Panel
            title="Associated Cost"
            action={<EditButton onClick={() => setEdit(true)} />}
          >
            <p className="fp-big-blue">
              ₦
              {Number(cost).toLocaleString("en-NG", {
                minimumFractionDigits: 2,
              })}
            </p>
          </Panel>
        </div>
        <Panel
          title="Timeline"
          action={
            <Dropdown
              label="Update issue status"
              value={stage}
              onChange={setStage}
              options={stages}
            />
          }
        >
          <ol className="fp-timeline">
            {stages.map((s, i) => (
              <li
                key={s}
                className={i <= stages.indexOf(stage) ? "active" : ""}
              >
                <span>{i + 1}</span>
                <small>
                  {i <= stages.indexOf(stage) ? `${i + 2}/4/26` : "----"}
                </small>
                <strong>{s}</strong>
              </li>
            ))}
          </ol>
        </Panel>
      </div>
      {edit && (
        <Dialog title="Associated Cost" onClose={() => setEdit(false)}>
          <DemoForm onSave={() => setEdit(false)}>
            <Field
              label="Amount (₦)"
              type="number"
              value={cost}
              onChange={setCost}
            />
          </DemoForm>
        </Dialog>
      )}
    </>
  );
}

export function TripDetail() {
  return (
    <>
      <Header
        title="Trip TRP-99321"
        description="Started 10:24 AM · 12 min to drop off"
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
          <Panel title="Live Tracking">
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
          <Panel title="Passenger Information">
            <Person name="Chinedu Okafor" />
            <p className="fp-contact">08022024007 · 4.8 (27 trips)</p>
          </Panel>
        </div>
      </div>
    </>
  );
}
