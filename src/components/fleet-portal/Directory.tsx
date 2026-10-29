"use client";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { MoreVertical, Plus } from "lucide-react";
import { people, vehicles, portalUrl } from "@/lib/fleet-portal";
import {
  Asset,
  Badge,
  Button,
  DataTable,
  Dialog,
  Dropdown,
  Field,
  Header,
  Info,
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

export function Directory({ kind }: { kind: string }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [type, setType] = useState("All vehicle types");
  const [dialog, setDialog] = useState(false);
  const [added, setAdded] = useState<TableRow[]>([]);
  const isVehicles = kind === "vehicles",
    isTeam = kind === "team",
    isInvites = kind === "invitations",
    isMaintenance = kind === "maintenance";
  const title = isVehicles
    ? "Vehicles"
    : isTeam
      ? "Team Members"
      : isInvites
        ? "Driver Invitation"
        : isMaintenance
          ? "Vehicle Issues"
          : "Drivers";
  const descriptions = isVehicles
    ? "Manage all vehicles in your fleet, view status, assignments, documents and maintenance"
    : isTeam
      ? "Manage team members, roles and permissions. Control who can access your fleet operations"
      : isInvites
        ? "Track and manage invitations sent to join your fleet"
        : isMaintenance
          ? "Track and manage reported vehicle issues across your fleet"
          : "Manage all drivers in your fleet, view details, status and performance";
  const stats = isVehicles
    ? [
        ["Total Vehicles", "180"],
        ["Active", "148"],
        ["In maintenance", "18"],
        ["Inactive", "14"],
      ]
    : isTeam
      ? [
          ["All Members", "200"],
          ["Active", "10"],
          ["Pending", "5"],
          ["Inactive", "2"],
        ]
      : isInvites
        ? [
            ["Total Invitations", "48"],
            ["Pending", "18"],
            ["Accepted", "24"],
            ["Expired", "6"],
          ]
        : isMaintenance
          ? [
              ["Total Issues", "24"],
              ["In progress", "7"],
              ["Resolved", "24"],
              ["Overdue", "3"],
            ]
          : [
              ["Total Drivers", "200"],
              ["Active Drivers", "152"],
              ["On trip", "28"],
              ["Offline", "48"],
            ];
  let headers: string[], rows: TableRow[];
  if (isVehicles) {
    headers = [
      "Vehicle",
      "Plate Number",
      "Type",
      "Status",
      "Assigned Driver",
      "Action",
    ];
    rows = vehicles.map((v, i) => ({
      key: String(i),
      search: `${v.name} BDJ-822-FQ ${v.type} ${v.driver >= 0 ? people[v.driver].name : ""}`,
      status: v.status,
      cells: [
        <span className="fp-vehicle-cell" key="v">
          <Asset screen="922:19982" name={v.image} width={86} height={48} />
          <span>
            {v.name}
            <small>2021 Economy</small>
          </span>
        </span>,
        "BDJ-822-FQ",
        v.type,
        <Badge key="s">{v.status}</Badge>,
        v.driver >= 0 ? <Person key="p" index={v.driver} /> : "—",
        <Link
          key="a"
          href={portalUrl("vehicles/rav4/overview")}
          className="fp-text-link"
        >
          See details
        </Link>,
      ],
    }));
  } else if (isTeam) {
    headers = ["Name", "Role", "Email", "Status", "Last Active", "Action"];
    rows = people.map((p, i) => ({
      key: p.id,
      search: `${p.name} ${p.name.split(" ")[0]}@sangaride.com ${["Fleet Owner", "Fleet Manager", "Operation Manager", "Support Agent", "Finance Manager", "Operation Agent", "Operation Manager"][i]}`,
      status: i === 3 ? "Inactive" : i === 5 ? "Pending" : "Active",
      cells: [
        <Person key="p" index={i} />,
        [
          "Fleet Owner",
          "Fleet Manager",
          "Operation Manager",
          "Support Agent",
          "Finance Manager",
          "Operation Agent",
          "Operation Manager",
        ][i],
        `${p.name.split(" ")[0].toLowerCase()}@sangaride.com`,
        <Badge key="s">
          {i === 3 ? "Inactive" : i === 5 ? "Pending" : "Active"}
        </Badge>,
        "Today, 10:24 AM",
        <Link key="a" href={portalUrl("team/aisha")} className="fp-text-link">
          See details
        </Link>,
      ],
    }));
  } else if (isMaintenance) {
    headers = [
      "Driver",
      "Issue ID",
      "Vehicle",
      "Issue type",
      "Reported date",
      "Status",
      "Action",
    ];
    rows = people.map((p, i) => ({
      key: p.id,
      search: `${p.name} ISS-2711 Toyota Corolla Sedan ${["Engine", "Brakes", "Tyres", "Battery", "Suspension", "AC", "Electrical"][i]}`,
      status: i === 2 ? "In progress" : i === 5 ? "Overdue" : "Resolved",
      cells: [
        <Person key="p" index={i} />,
        "ISS-2711",
        "Toyota Corolla",
        [
          "Engine",
          "Brakes",
          "Tyres",
          "Battery",
          "Suspension",
          "AC",
          "Electrical",
        ][i],
        "14 Jan 2027",
        <Badge key="s">
          {i === 2 ? "In progress" : i === 5 ? "Overdue" : "Resolved"}
        </Badge>,
        <Link
          key="a"
          href={portalUrl("maintenance/iss-2711")}
          className="fp-text-link"
        >
          See details
        </Link>,
      ],
    }));
  } else if (isInvites) {
    headers = ["Driver", "Invited on", "Status", "Vehicle", "Actions"];
    rows = people.map((p, i) => ({
      key: p.id,
      search: `${p.name} ${p.phone} ${p.id} Toyota Corolla Sedan`,
      status: [
        "Pending",
        "Accepted",
        "Pending",
        "Expired",
        "Accepted",
        "Pending",
        "Accepted",
      ][i],
      cells: [
        <Person key="p" index={i} subtitle={p.phone} />,
        "29 Sep 2026",
        <Badge key="s">
          {
            [
              "Pending",
              "Accepted",
              "Pending",
              "Expired",
              "Accepted",
              "Pending",
              "Accepted",
            ][i]
          }
        </Badge>,
        i % 2 ? "Toyota Corolla" : "—",
        <RowActions key="a" path="drivers/chinedu" label={p.name} invite />,
      ],
    }));
  } else {
    headers = [
      "Driver",
      "Phone",
      "Vehicle",
      "Status",
      "Trips(7d)",
      "Earnings",
      "Actions",
    ];
    rows = people.map((p, i) => ({
      key: p.id,
      search: `${p.name} ${p.phone} ${p.id} Toyota Corolla Sedan`,
      status: p.status,
      cells: [
        <Person key="p" index={i} />,
        p.phone,
        <span key="v">
          Toyota Corolla<small>BDJ-822-FQ</small>
        </span>,
        <Badge key="s">{p.status}</Badge>,
        p.trips,
        "₦142,500",
        <RowActions key="a" path="drivers/chinedu" label={p.name} />,
      ],
    }));
  }
  const filtered = [...rows, ...added].filter(
    (r) =>
      (r.search ?? "").toLowerCase().includes(search.toLowerCase()) &&
      (status === "All statuses" ||
        status === "All Statuses" ||
        r.status === status) &&
      (type === "All vehicle types" ||
        type === "All Roles" ||
        (r.search ?? "").includes(type)),
  );
  function add(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "");
    setAdded((a) => [
      ...a,
      {
        key: `new-${a.length}`,
        search: name,
        status: "Pending",
        cells: headers.map((_, i) =>
          i === 0 ? (
            name
          ) : i === headers.length - 1 ? (
            <span key="demo" className="fp-muted">
              Preview
            </span>
          ) : i === headers.length - 2 ? (
            <Badge key="pending">Pending</Badge>
          ) : (
            "—"
          ),
        ),
      },
    ]);
    setDialog(false);
  }
  return (
    <>
      <Header title={title} description={descriptions}>
        {!isMaintenance &&
          (isVehicles || isTeam ? (
            <Button onClick={() => setDialog(true)}>
              <Plus size={16} />
              {isTeam ? "Invite Team Member" : "Add vehicle"}
            </Button>
          ) : (
            <Button href="drivers/invite">
              <Plus size={16} />
              Invite Driver
            </Button>
          ))}
      </Header>
      <Stats
        items={stats.map(([label, value], i) => ({
          label,
          value,
          tone: ["blue", "green", "orange", "red"][i],
        }))}
      />
      <div className="fp-filters">
        <SearchField
          value={search}
          onChange={setSearch}
          placeholder={
            isVehicles
              ? "Search by plate number, driver or model"
              : isTeam
                ? "Search by name, phone or ID"
                : "Search drivers by name, phone or ID"
          }
        />
        <Dropdown
          label="Filter status"
          value={status}
          onChange={setStatus}
          options={[
            "All statuses",
            ...new Set(rows.map((r) => r.status ?? "")),
          ]}
        />
        {!isInvites && (
          <Dropdown
            label={isTeam ? "Filter role" : "Filter vehicle type"}
            value={type}
            onChange={setType}
            options={
              isTeam
                ? ["All Roles", "Fleet Owner", "Fleet Manager"]
                : ["All vehicle types", "Sedan", "SUV"]
            }
          />
        )}
      </div>
      <DataTable headers={headers} rows={filtered} />
      {dialog && (
        <Dialog
          title={isTeam ? "Invite Team Member" : "Add vehicle"}
          onClose={() => setDialog(false)}
        >
          <form className="fp-form" onSubmit={add}>
            <Info>
              Preview only. This will add a sample row; no invitation or vehicle
              registration is submitted.
            </Info>
            <label className="fp-field">
              {isTeam ? "Full name" : "Vehicle name"}
              <input
                name="name"
                required
                placeholder={isTeam ? "Full name" : "Make and model"}
              />
            </label>
            <Field label={isTeam ? "Email address" : "Plate number"} required />
            <Dropdown
              label={isTeam ? "Role" : "Vehicle type"}
              options={
                isTeam
                  ? ["Fleet Manager", "Finance Manager", "Support Agent"]
                  : ["Sedan", "SUV"]
              }
            />
            <Button type="submit">
              {isTeam ? "Add preview member" : "Add preview vehicle"}
            </Button>
          </form>
        </Dialog>
      )}
    </>
  );
}

export function InviteDriver() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);
  return (
    <>
      <Header
        title="Invite a Driver"
        description="Send an invitation to join your fleet. The driver will receive a secure link to complete their registration"
        back={{ label: "Back to Home", path: "" }}
      />
      <Steps
        labels={["Driver Details", "Invite & permissions", "Review & send"]}
        current={step}
      />
      <form
        className="fp-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (step < 2) setStep(step + 1);
          else setDone(true);
        }}
      >
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
                label="Phone number"
                type="tel"
                required
                placeholder="Enter phone number"
              />
              <Field
                label="Email address"
                type="email"
                required
                placeholder="Enter driver’s email address"
                value={email}
                onChange={setEmail}
              />
              <Field
                label="National identity number (optional)"
                placeholder="Enter NIN or ID number"
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
                label="Assign vehicle"
                options={[
                  "Select vehicle",
                  "Toyota Rav4 · LND-204-BD",
                  "Toyota Corolla · BDJ-822-FQ",
                ]}
              />
            </Field>
          </>
        ) : step === 1 ? (
          <>
            <h2>Invite & permissions</h2>
            <Info>Choose what the driver can access in your fleet.</Info>
            {[
              "Receive trip requests",
              "View assigned vehicle",
              "View own trip history and earnings",
            ].map((t) => (
              <label key={t} className="fp-check">
                <input type="checkbox" defaultChecked />
                {t}
              </label>
            ))}
          </>
        ) : (
          <>
            <h2>Review & send</h2>
            <p>
              Invite <strong>{name}</strong> at <strong>{email}</strong> to join
              Lagos Move Fleet.
            </p>
            <p>{message}</p>
            <Info>
              This preview does not send invitations. Live delivery requires the
              fleet backend.
            </Info>
            {done && (
              <p role="status" className="fp-success">
                Invitation preview prepared. No email or SMS was sent.
              </p>
            )}
          </>
        )}
        <div className="fp-form-actions">
          {step > 0 && (
            <Button secondary onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          <Button type="submit">
            {step === 2 ? "Prepare invitation preview" : "Continue"}
          </Button>
        </div>
      </form>
    </>
  );
}
