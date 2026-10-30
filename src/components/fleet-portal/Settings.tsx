"use client";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ChevronRight, Mail, Pencil, Trash2 } from "lucide-react";
import { portalUrl } from "@/lib/fleet-portal";
import { formatMoney, type PreviewRecord } from "@/lib/fleet-preview-domain";
import { usePreview } from "./PreviewProvider";
import { PreviewBanner } from "./WorkflowUI";
import {
  Asset,
  Badge,
  Button,
  DataTable,
  DemoForm,
  Dialog,
  Dropdown,
  ExportButton,
  Field,
  Header,
  Info,
  KeyValues,
  Panel,
  SearchField,
  Tabs,
  statusLabel,
  useNotice,
} from "./ui";

export function Settings({ path }: { path: string }) {
  switch (path) {
    case "settings":
      return <SettingsOverview />;
    case "settings/profile":
      return <Profile />;
    case "settings/services":
      return <Services />;
    case "settings/policies":
      return <Policies />;
    case "settings/billing":
      return <Billing />;
    case "settings/notifications":
      return <NotificationSettings />;
    case "settings/integrations":
      return <Integrations />;
    case "settings/support":
      return <Support />;
    case "settings/audit":
      return <Audit />;
    default:
      return <Notifications />;
  }
}
const settingCards = [
  {
    title: "Fleet Profile",
    desc: "Manage your fleet basic information",
    path: "profile",
    icon: "imgIconamoonProfileFill",
  },
  {
    title: "Service Types",
    desc: "Configure the service you operate",
    path: "services",
    icon: "imgBiCarFrontFill1",
  },
  {
    title: "Billing & subscriptions",
    desc: "Manage your subscription plans",
    path: "billing",
    icon: "imgGroup1",
  },
  {
    title: "Policies & Rules",
    desc: "Manage your fleet basic information",
    path: "policies",
    icon: "imgCarbonSecurity",
  },
  {
    title: "Notifications",
    desc: "Manage your fleet basic information",
    path: "notifications",
    icon: "imgFamiconsNotifications",
  },
  {
    title: "Integrations",
    desc: "Manage your fleet basic information",
    path: "integrations",
    icon: "imgCarbonIbmWebmethodsHybridIntegration",
  },
];
function SettingsOverview() {
  return (
    <>
      <Header
        title="Settings"
        description="Configure your fleet, manage policies and set operational preferences"
      />
      <div className="fp-two fp-settings-cards">
        {settingCards.map((s) => (
          <Link
            key={s.path}
            href={portalUrl(`settings/${s.path}`)}
            className="fp-setting-card"
          >
            <span className="fp-setting-symbol">
              <Asset screen="922:21210" name={s.icon} width={34} height={34} />
            </span>
            <span>
              <strong>{s.title}</strong>
              <small>{s.desc}</small>
            </span>
            <ChevronRight size={18} />
          </Link>
        ))}
      </div>
      <Panel title="Fleet Information">
        <div className="fp-two">
          <KeyValues
            items={[
              ["Fleet name", "Lagos Move fleet"],
              ["Business type", "Fleet Operator"],
              ["Contact email", "ops@lagosmove.ng"],
              ["Contact phone", "0812 987 2817"],
              ["Address", "123 Ikeja, Lagos Nigeria"],
              ["Time zone", "(GMT +1) West Africa Time"],
              ["Currency", "NGN - Nigeria Naira"],
              ["Date created", "12 Jan 2024"],
            ]}
          />
          <div className="fp-fleet-logo">
            <Asset
              screen="922:21210"
              name="imgImage1"
              width={337}
              height={285}
              alt="Fleet logo"
            />
            <Link href={portalUrl("settings/profile")}>Fleet Logo</Link>
          </div>
        </div>
      </Panel>
    </>
  );
}
function Profile() {
  const notice = useNotice();
  return (
    <>
      <Header
        title="Account & Profile"
        description="Manage your fleet account, information and security settings"
      />
      <PreviewBanner />
      <Info>
        Legal name, registration and representative changes go through review
        before they take effect.
      </Info>
      <DemoForm>
        <div className="fp-two">
          <Panel title="Fleet Profile">
            <div className="fp-logo-upload">
              <Asset
                screen="922:21414"
                name="imgImage1"
                width={100}
                height={85}
              />
              <button
                type="button"
                className="fp-text-link"
                onClick={() =>
                  notice(
                    "Logo uploads are unavailable in this preview. No file is uploaded.",
                  )
                }
              >
                Change Logo
              </button>
            </div>
            <Field
              label="Fleet Name"
              required
              defaultValue="Lagos move fleet"
            />
            <Field label="Business type" required>
              <Dropdown
                label="Business type"
                options={["Fleet Operator", "Business"]}
              />
            </Field>
            <Field
              label="Address"
              required
              defaultValue="123 Ikeja, Lagos Nigeria"
            />
            <Field
              label="Email Address"
              type="email"
              required
              defaultValue="ops@lagosmove.ng"
            />
            <Field
              label="Phone number"
              type="tel"
              required
              defaultValue="+234826151271"
            />
          </Panel>
          <Panel title="Fleet Profile">
            <Field label="Default Market" required>
              <Dropdown
                label="Default Market"
                options={["Nigeria", "United States"]}
              />
            </Field>
            <Field label="Time zone" required>
              <Dropdown
                label="Time zone"
                options={[
                  "Africa/Lagos (West Africa Time)",
                  "America/New_York (Eastern Time)",
                ]}
              />
            </Field>
            <Field label="Currency" required>
              <Dropdown
                label="Currency"
                options={["Nigerian Naira (₦)", "US Dollar ($)"]}
              />
            </Field>
            <div className="fp-two">
              <fieldset>
                <legend>Default Service types</legend>
                {/* Service eligibility is Sanga-controlled (LOCK-01, D-06). */}
                {["Rides", "Delivery", "Airport rides"].map((t) => (
                  <label className="fp-check" key={t}>
                    <input type="checkbox" defaultChecked disabled />
                    {t}
                  </label>
                ))}
                <Link className="fp-text-link" href={portalUrl("settings/services")}>
                  Set by Sanga · view eligibility
                </Link>
              </fieldset>
              <fieldset>
                <legend>Distance unit</legend>
                {["Kilometers (Km)", "Miles (m)"].map((t, i) => (
                  <label className="fp-check" key={t}>
                    <input name="distance" type="radio" defaultChecked={!i} />
                    {t}
                  </label>
                ))}
              </fieldset>
            </div>
          </Panel>
        </div>
      </DemoForm>
    </>
  );
}
const serviceRows = [
  {
    name: "Sanga Go",
    image: "imgPngwingCom22",
    desc: "Economical everyday ride",
  },
  {
    name: "Comfort Ride",
    image: "imgFavpng885D290E782F4F3Ce6D77D44Cefe13C81",
    desc: "Comfortable reliable ride",
  },
  {
    name: "Sanga XL",
    image: "imgFavpng111Cf00Afbe7Bc2Cdfda9E51953652261",
    desc: "Spacious rides for groups",
  },
  {
    name: "Sanga Lux",
    image: "imgPngwingCom261",
    desc: "Luxurious rides for luxurious experience",
  },
  {
    name: "Sanga Motor",
    image: "imgPngwingCom71",
    desc: "Beat traffic with motorcycle rides",
  },
  {
    name: "Sanga Assist",
    image: "imgPngwingCom271",
    desc: "Vehicle with extra help and accessibility",
  },
];
function Services() {
  return (
    <>
      <Header
        title="Service Types & Eligibility"
        description="Sanga controls rider fares and service approval."
      />
      <Info>
        Preview only · Pricing and commission configuration are Sanga-owned.
        Service participation requests are unavailable until eligibility policy
        is approved (D-06).
      </Info>
      <DataTable
        paginate={false}
        headers={[
          "Service type",
          "Description",
          "Eligibility",
          "Policy source",
        ]}
        rows={serviceRows.map((s) => ({
          key: s.name,
          cells: [
            <span key="v" className="fp-vehicle-cell">
              <Asset screen="922:21592" name={s.image} width={86} height={48} />
              <strong>{s.name}</strong>
            </span>,
            s.desc,
            <Badge key="status">Not connected</Badge>,
            "Sanga market / zone policy",
          ],
        }))}
      />
    </>
  );
}
function Policies() {
  const [rules, setRules] = useState(
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      text: "Maintain Vehicle in good condition",
    })),
  );
  const [text, setText] = useState("");
  const [editing, setEditing] = useState<number | null>(null);
  const notice = useNotice();
  function add(e: FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setRules((r) =>
      editing === null
        ? [
            ...r,
            { id: Math.max(0, ...r.map((i) => i.id)) + 1, text: text.trim() },
          ]
        : r.map((i) => (i.id === editing ? { ...i, text: text.trim() } : i)),
    );
    setText("");
    setEditing(null);
  }
  return (
    <>
      <Header
        title="Policies and rules"
        description="Set, edit and manage fleet rules"
      >
        <Button onClick={() => notice("Rules saved in this preview only.")}>
          Save Changes
        </Button>
      </Header>
      <PreviewBanner />
      <Info>
        Fleet rules apply to your own operation. They cannot change Sanga
        platform, pricing or safety policy.
      </Info>
      <Panel title="Add Policy/rules">
        <form className="fp-inline-form" onSubmit={add}>
          <input
            aria-label="Policy detail"
            placeholder="Type Detail"
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button type="submit">{editing === null ? "Add" : "Update"}</Button>
        </form>
      </Panel>
      <Panel title="Existing rules">
        <ul className="fp-policies">
          {rules.map((r) => (
            <li key={r.id}>
              <span>{r.text}</span>
              <button
                aria-label={`Edit rule ${r.id + 1}`}
                onClick={() => {
                  setEditing(r.id);
                  setText(r.text);
                }}
              >
                <Pencil size={16} />
              </button>
              <button
                aria-label={`Delete rule ${r.id + 1}`}
                onClick={() =>
                  setRules((all) => all.filter((i) => i.id !== r.id))
                }
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
        {!rules.length && <p className="fp-muted">No rules added yet.</p>}
      </Panel>
    </>
  );
}
function Billing() {
  const notice = useNotice();
  const { state } = usePreview();
  const count = (records: PreviewRecord[]) =>
    records.filter((r) => r.market === state.market).length;
  // Example monthly price in the market's currency (minor units); not an approved plan.
  const price = formatMoney(
    state.market === "NG" ? 5_000_000 : 9_900,
    state.market,
  );
  // Monthly sample invoices counting back from September 2026.
  const period = (i: number) => {
    const start = new Date(Date.UTC(2026, 8 - i, 1));
    const end = new Date(Date.UTC(2026, 9 - i, 0));
    const fmt = (d: Date) =>
      d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      });
    return { range: `${fmt(start)} – ${fmt(end)}`, issued: fmt(end) };
  };
  return (
    <>
      <Header
        title="Billings & Subscriptions"
        description="Manage your plan, billing details, invoices and payment methods"
      >
        <Button
          onClick={() =>
            notice(
              "Plan changes are not connected in this preview. No subscription or payment was created.",
            )
          }
        >
          Change Plan
        </Button>
      </Header>
      <PreviewBanner />
      <Info>
        Demo only (D-09). Fleet plans, prices and limits are not approved. No
        subscription exists and nothing is charged.
      </Info>
      <div className="fp-two">
        <Panel title="Current Plan" action={<Badge>Demo · not live</Badge>}>
          <p className="fp-big-blue">Growth</p>
          <p>
            Ideal for expanding fleets with advanced features and higher limits
          </p>
          <h3>
            {price} <small>/month · example price</small>
          </h3>
          <KeyValues items={[["Renewal date", "No live subscription"]]} />
        </Panel>
        <Panel
          title="Plan Limits"
          action={<span className="fp-text-link">Usage</span>}
        >
          {[
            ["Drivers", count(state.records.drivers), 100],
            ["Vehicles", count(state.records.vehicles), 100],
            ["Team Members", count(state.records.team), 20],
            // No integration is confirmed (D-10).
            ["Active Integrations", 0, 10],
          ].map(([label, n, max]) => (
            <div className="fp-usage" key={label}>
              <span>{label}</span>
              <div>
                <small>
                  {n}/{max}
                </small>
                <progress
                  aria-label={`${label} usage`}
                  value={Number(n)}
                  max={Number(max)}
                />
              </div>
            </div>
          ))}
        </Panel>
      </div>
      <DataTable
        title="Sample invoices"
        headers={[
          "Invoice #",
          "Billing Period",
          "Amount",
          "Status",
          "Date issued",
          "Action",
        ]}
        rows={Array.from({ length: 7 }, (_, i) => ({
          key: String(i),
          cells: [
            `INV-2026-${String(9 - i).padStart(3, "0")}`,
            period(i).range,
            price,
            <Badge key="p">Sample · not charged</Badge>,
            period(i).issued,
            <ExportButton
              key="e"
              name="sample-invoice"
              rows={[
                ["Sample invoice", "Amount"],
                ["Growth plan (example, not charged)", price],
              ]}
            />,
          ],
        }))}
      />
    </>
  );
}
function Toggle({
  label,
  initial = true,
  locked = false,
}: {
  label: string;
  initial?: boolean;
  /** Required notices (F07-N04) stay on and cannot be switched off. */
  locked?: boolean;
}) {
  const [on, setOn] = useState(initial || locked);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={locked ? `${label} (required)` : label}
      disabled={locked}
      className={`fp-toggle ${on ? "on" : ""}`}
      onClick={() => setOn(!on)}
    >
      <span />
    </button>
  );
}
function NotificationSettings() {
  return (
    <>
      <Header
        title="Notification Settings"
        description="Configure how and when you receive notifications and alerts"
      />
      <PreviewBanner />
      <DemoForm>
        <Panel title="Notification Channels">
          <p className="fp-muted">
            Choose how you want to receive notifications
          </p>
          <div className="fp-three">
            {[
              "Email Notifications",
              "SMS Notification",
              "In App Notifications",
            ].map((s, i) => (
              <div className="fp-notification-channel" key={s}>
                <Mail size={24} />
                <strong>{s}</strong>
                <p className="fp-muted">
                  {i === 2
                    ? "Get updates inside the portal"
                    : "Receive important updates via " + (i ? "SMS" : "email")}
                </p>
                <Toggle label={s} initial={i !== 1} />
              </div>
            ))}
          </div>
        </Panel>
        <DataTable
          title="Notification Preferences"
          paginate={false}
          headers={["Notification", "Email", "SMS", "In-App"]}
          rows={[
            "Trip Updates",
            "Driver Activity",
            "Vehicle alerts",
            "Payout Updates",
            "Security Alerts",
            "Weekly Summary",
          ].map((s, i) => ({
            key: s,
            cells: [
              <span className="fp-document" key="t">
                <Mail size={22} />
                <span>
                  {s}
                  <small>
                    {
                      [
                        "New trips, trip status changes and completions",
                        "Driver online/offline, trip start/end, location updates",
                        "Maintenance due, document expiry, vehicle issues",
                        "Payout processed, failed payout, payout summaries",
                        "New team members, role changes, suspicious activity",
                        "Weekly performance and earning summary",
                      ][i]
                    }
                  </small>
                </span>
              </span>,
              ...["Email", "SMS", "In-App"].map((c, n) => (
                <Toggle
                  key={c}
                  label={`${s} ${c}`}
                  initial={n === 0 || ![0, 3, 5].includes(i)}
                  locked={s === "Security Alerts" && c !== "SMS"}
                />
              )),
            ],
          }))}
        />
        <Info>
          Security alerts by email and in-app are required and cannot be turned
          off. Delivery depends on approved channels per market.
        </Info>
      </DemoForm>
    </>
  );
}
const integrations = [
  {
    name: "Paystack",
    image: "imgPngwingCom411",
    connected: true,
    desc: "Accept payment, manage settlements and automate payouts",
  },
  {
    name: "QuickBooks",
    image: "imgPngwingCom421",
    connected: true,
    desc: "Sync earnings, expenses and invoices with quickbooks",
  },
  {
    name: "Xero",
    image: "imgPngwingCom431",
    connected: false,
    desc: "Accept payment, manage settlements and automate payouts",
  },
  {
    name: "Slack",
    image: "imgPngwingCom441",
    connected: false,
    desc: "Accept payment, manage settlements and automate payouts",
  },
  {
    name: "Google Drive",
    image: "imgPngwingCom451",
    connected: true,
    desc: "Accept payment, manage settlements and automate payouts",
  },
  {
    name: "Webhook (API)",
    image: "imgPngwingCom461",
    connected: true,
    desc: "Accept payment, manage settlements and automate payouts",
  },
  {
    name: "Zapier",
    image: "imgPngwingCom471",
    connected: false,
    desc: "Automate work flows with 5,000+ apps via Zapier",
  },
  {
    name: "Custom API",
    image: "imgPngwingCom481",
    connected: true,
    desc: "Use our API to build custom integrations for your business",
  },
];
function Integrations() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("All Integrations");
  const [detail, setDetail] = useState("");
  return (
    <>
      <Header
        title="Integrations"
        description="Connect Sanga ride with third tools and services to streamline your operations"
      />
      <SearchField
        placeholder="Search integrations"
        value={search}
        onChange={setSearch}
      />
      <Tabs
        items={["All Integrations", "Connected (5)", "Available (8)"].map(
          (label) => ({ label }),
        )}
        active={tab}
        onChange={setTab}
      />
      <div className="fp-two fp-integrations">
        {integrations
          .filter(
            (i) =>
              i.name.toLowerCase().includes(search.toLowerCase()) &&
              (tab.startsWith("Connected")
                ? i.connected
                : tab.startsWith("Available")
                  ? !i.connected
                  : true),
          )
          .map((i) => (
            <Panel key={i.name}>
              <div className="fp-integration">
                <Asset
                  screen="922:22454"
                  name={i.image}
                  width={57}
                  height={57}
                  alt={i.name}
                />
                <div>
                  <div className="fp-panel-heading">
                    <h3>{i.name}</h3>
                    <Badge>{i.connected ? "Connected" : "Not connected"}</Badge>
                  </div>
                  <p className="fp-muted">{i.desc}</p>
                  <div className="fp-paired-buttons">
                    <Button
                      secondary={i.connected}
                      onClick={() => setDetail(i.name)}
                    >
                      {i.connected ? "Configure" : "Connect"}
                    </Button>
                    <Button secondary onClick={() => setDetail(i.name)}>
                      {i.connected ? "View details" : "Learn More"}
                    </Button>
                  </div>
                </div>
              </div>
            </Panel>
          ))}
      </div>
      {detail && (
        <Dialog title={detail} onClose={() => setDetail("")}>
          <Info>
            The connection status shown is sample design data. No external
            service is connected to this portal preview.
          </Info>
          <p>
            Live configuration requires provider authorization and a secure
            backend. No API keys or credentials are needed to review this
            design.
          </p>
          <Button secondary onClick={() => setDetail("")}>
            Close
          </Button>
        </Dialog>
      )}
    </>
  );
}
const topics = [
  {
    title: "Getting Started",
    desc: "Learn how to set up and manage your fleet",
    body: "Start with your fleet profile, add vehicles and invite drivers. Eligible vehicles and verified drivers can then be assigned in the Vehicles section.",
  },
  {
    title: "Driver Management",
    desc: "Add, verify and manage drivers",
    body: "Use Drivers to review driver records and Invitations to prepare an invitation. Open a driver’s profile for documents, vehicle assignments and trip history.",
  },
  {
    title: "Vehicle Management",
    desc: "Add vehicle and manage documents",
    body: "Open Vehicles, select a vehicle, and use the Documents and Maintenance tabs to review its records. Keep required documents up to date.",
  },
  {
    title: "Earnings and payout",
    desc: "Understand earnings, fees and payment schedules",
    body: "Earnings shows sample fleet totals. Payouts contains the destination, settlement mode and driver split. This preview does not process payments.",
  },
  {
    title: "Account and security",
    desc: "Manage access and keep your account secure",
    body: "Use Team to review roles and permissions. Production access must be verified by the backend. No live account or permission changes are made in the preview.",
  },
  {
    title: "Integrations",
    desc: "Connect with third party tools and services",
    body: "The Integrations screen shows the services in the design. Provider authorization and secure backend configuration will be needed before connecting live services.",
  },
];
function Support() {
  const { state } = usePreview();
  const [search, setSearch] = useState("");
  const [article, setArticle] = useState<number | null>(null);
  const tickets = state.records.tickets.filter((t) => t.market === state.market);
  return (
    <>
      <Header
        title="Support Center"
        description="Find answers, raise a ticket, or contact our support team"
      >
        <Button href="settings/support/new">+ New Support Ticket</Button>
      </Header>
      <PreviewBanner />
      <SearchField
        placeholder="Search for help topics, guides or keywords"
        value={search}
        onChange={setSearch}
      />
      <h2>Popular Help Topics</h2>
      <div className="fp-three">
        {topics
          .map((t, i) => ({ t, i }))
          .filter(({ t }) =>
            (t.title + t.desc).toLowerCase().includes(search.toLowerCase()),
          )
          .map(({ t, i }) => (
            <button
              key={t.title}
              className="fp-setting-card"
              onClick={() => setArticle(i)}
            >
              <span className="fp-setting-symbol">
                <Asset
                  screen="922:22671"
                  name={
                    [
                      "imgIconamoonProfileFill",
                      "imgGroup1",
                      "imgBiCarFrontFill1",
                      "imgGroup2",
                      "imgCarbonIbmSecurity",
                      "imgCarbonIbmWebmethodsHybridIntegration",
                    ][i]
                  }
                  width={34}
                  height={34}
                />
              </span>
              <span>
                <strong>{t.title}</strong>
                <small>{t.desc}</small>
              </span>
              <ChevronRight size={17} />
            </button>
          ))}
      </div>
      <DataTable
        title="Support Tickets"
        paginate={false}
        headers={[
          "Ticket I.D",
          "Subject",
          "Category",
          "Status",
          "Last Updated",
          "Action",
        ]}
        rows={tickets.map((t) => ({
          key: t.id,
          cells: [
            t.id.toUpperCase(),
            t.name,
            t.fields.category ?? "General",
            <Badge key="s">{t.status}</Badge>,
            `Version ${t.version}`,
            <Link
              key="a"
              className="fp-text-link"
              href={portalUrl(`settings/support/${t.id}`)}
            >
              View details
            </Link>,
          ],
        }))}
      />
      {!tickets.length && (
        <p className="fp-muted">No support tickets in this market yet.</p>
      )}
      {article !== null && (
        <Dialog title={topics[article].title} onClose={() => setArticle(null)}>
          <p>{topics[article].body}</p>
          <Button secondary onClick={() => setArticle(null)}>
            Close
          </Button>
        </Dialog>
      )}
    </>
  );
}
/** F07-A01: only events recorded by this preview; no invented history (LOCK-06). */
function Audit() {
  const { state } = usePreview();
  const notice = useNotice();
  const [search, setSearch] = useState("");
  const [module, setModule] = useState("All Modules");
  const events = state.audit.filter((e) => e.market === state.market);
  const modules = [
    "All Modules",
    ...new Set(events.map((e) => statusLabel(e.fields.collection ?? "other"))),
  ];
  const rows = events.filter(
    (e) =>
      [e.name, e.fields.reason, e.fields.actor]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (module === "All Modules" ||
        statusLabel(e.fields.collection ?? "other") === module),
  );
  return (
    <>
      <Header
        title="Audit Log"
        description="Track important actions and changes within your fleet portal"
      >
        <Button
          secondary
          onClick={() =>
            notice(
              "Audit export is unavailable in this preview (D-12). No file was created.",
            )
          }
        >
          Export
        </Button>
      </Header>
      <PreviewBanner />
      <Info>
        Local preview events only. This is not the production append-only audit
        service.
      </Info>
      <div className="fp-filters">
        <SearchField
          value={search}
          onChange={setSearch}
          placeholder="Search by user, action or details"
        />
        <Dropdown
          label="Audit module"
          value={module}
          onChange={setModule}
          options={modules}
        />
      </div>
      {events.length ? (
        <DataTable
          pageSize={10}
          headers={[
            "Event",
            "User",
            "Module",
            "Details",
            "Action",
            "Correlation ID",
          ]}
          rows={rows.map((e) => ({
            key: e.id,
            cells: [
              <Link
                key="d"
                className="fp-text-link"
                href={portalUrl(`settings/audit/${e.id}`)}
              >
                {e.id}
              </Link>,
              e.fields.actor ?? "—",
              statusLabel(e.fields.collection ?? "other"),
              `${e.name} · ${e.fields.reason ?? ""}`,
              <Badge key="a">{e.status}</Badge>,
              e.fields.correlationId ?? "—",
            ],
          }))}
        />
      ) : (
        <Panel title="No events yet">
          <p className="fp-muted">
            Actions taken in this preview, such as invitations, assignments and
            requests, are recorded here.
          </p>
        </Panel>
      )}
    </>
  );
}
const notificationCategory = (source = "") =>
  source.startsWith("vehicles") || source.startsWith("maintenance")
    ? "Vehicles"
    : source.startsWith("drivers")
      ? "Driver"
      : source.startsWith("payouts") || source.startsWith("earnings")
        ? "Earning"
        : source.startsWith("settings/support")
          ? "Support"
          : "General";
/** F07-N01 on the FLT 56 layout. Read state is managed on each notification's detail. */
function Notifications() {
  const { state, execute } = usePreview();
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const all = state.records.notifications.filter(
    (n) => n.market === state.market,
  );
  const unread = all.filter((n) => n.status === "unread");
  const tabs = [
    `All (${all.length})`,
    `Unread (${unread.length})`,
    "Driver",
    "Vehicles",
    "Earning",
    "Support",
  ];
  const active = tabs.find((t) => t.startsWith(tab)) ?? tabs[0];
  const rows = all.filter(
    (n) =>
      n.name.toLowerCase().includes(search.toLowerCase()) &&
      (tab === "All" ||
        (tab === "Unread" && n.status === "unread") ||
        notificationCategory(n.fields.source) === tab),
  );
  return (
    <>
      <Header
        title="Notifications"
        description="Stay updated with important information"
      >
        <Button href="settings/notifications" secondary>
          Preferences
        </Button>
        <Button
          onClick={() => {
            for (const n of unread) {
              const result = execute({
                kind: "transition",
                collection: "notifications",
                id: n.id,
                version: n.version,
                status: "read",
                reason: "Bulk mark read preview",
              });
              if (!result.ok) setError(result.error);
            }
          }}
        >
          Mark all read
        </Button>
      </Header>
      <PreviewBanner />
      <SearchField
        value={search}
        onChange={setSearch}
        placeholder="Search notifications"
      />
      <Tabs
        active={active}
        onChange={(label) => setTab(label.split(" (")[0])}
        items={tabs.map((label) => ({ label }))}
      />
      <ul className="fp-notifications">
        {rows.map((n) => (
          <li key={n.id} className={n.status === "read" ? "read" : ""}>
            <Link href={portalUrl(`notifications/${n.id}`)}>
              <span className="fp-setting-symbol">!</span>
              <span>
                <strong>{n.name}</strong>
                <small>
                  {notificationCategory(n.fields.source)} · Queued for preview ·
                  not sent
                </small>
              </span>
              <small>{statusLabel(n.status)}</small>
              <ChevronRight size={17} />
            </Link>
          </li>
        ))}
      </ul>
      {!rows.length && (
        <p className="fp-muted">No notifications match this view.</p>
      )}
      {error && <p role="alert">{error}</p>}
    </>
  );
}
// Design conversation for the sample ticket; other tickets show their own stored message.
const sampleThread = [
  {
    from: "You (Fleet Operator)",
    text: "Hi, the payout for driver Ibrahim Sule (DRV-3456) for 23–29 September has not been received. Please assist.",
    time: "11:42 AM",
  },
  {
    from: "Sanga Support team",
    text: "Hello, thanks for reaching out. We are checking the payout status and will get back to you.",
    time: "11:45 AM",
  },
  {
    from: "You (Fleet Operator)",
    text: "Noted. Please confirm once this has been resolved.",
    time: "11:47 AM",
  },
];
/** F07-S04/S05 on the FLT 53/54 layout. Replies persist in the preview store; nothing is sent. */
export function SupportTicket({ record }: { record: PreviewRecord }) {
  const { execute } = usePreview();
  const [reply, setReply] = useState("");
  const [article, setArticle] = useState("");
  const [error, setError] = useState("");
  const notice = useNotice();
  const [original, ...replies] = (record.fields.message ?? "").split("\n");
  const thread = [
    ...(record.id === "sr-202612"
      ? sampleThread
      : [{ from: "You (Fleet Operator)", text: original, time: "Preview" }]),
    ...replies.map((text) => ({
      from: "You (Preview)",
      text: text.replace(/^Preview reply: /, ""),
      time: "Not sent",
    })),
  ];
  const closed = record.status === "closed";
  return (
    <>
      <Header
        title=""
        back={{ label: "Back to Tickets", path: "settings/support" }}
      />
      <PreviewBanner />
      <div className="fp-two fp-ticket-grid">
        <div className="fp-stack">
          <Panel
            title={`Ticket #${record.id.toUpperCase()}`}
            action={<Badge>{record.status}</Badge>}
          >
            <p>{record.name}</p>
            <div className="fp-ticket-meta">
              <small>{record.fields.category ?? "General"}</small>
              <small>
                Created
                <br />
                30 Oct 2026
              </small>
              <small>
                Version
                <br />
                {record.version}
              </small>
            </div>
          </Panel>
          {thread.map((r, i) => (
            <Panel key={i}>
              <div className="fp-message-heading">
                <span className="fp-id">
                  {r.from.startsWith("Sanga") ? "S" : "FO"}
                </span>
                <strong>{r.from}</strong>
                <small>{r.time}</small>
              </div>
              <p className="fp-muted">{r.text}</p>
              {i === 0 && record.id === "sr-202612" && (
                <div className="fp-ticket-attachments">
                  {[
                    ["Payout-screenshot.png", "234kb"],
                    ["Statement.pdf", "1.5mb"],
                  ].map(([name, size]) => (
                    <button
                      key={name}
                      onClick={() =>
                        notice(
                          "Sample attachment only. No file is stored in this preview.",
                        )
                      }
                    >
                      {name}
                      <small>{size}</small>
                    </button>
                  ))}
                </div>
              )}
            </Panel>
          ))}
          <Panel>
            {closed ? (
              <Info>This ticket is closed. Reopen it to reply.</Info>
            ) : (
              <form
                className="fp-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!reply.trim()) return;
                  const result = execute({
                    kind: "transition",
                    collection: "tickets",
                    id: record.id,
                    version: record.version,
                    status: record.status,
                    reason: "Ticket reply preview",
                    fields: {
                      message: `${record.fields.message ?? ""}\nPreview reply: ${reply.trim()}`,
                    },
                  });
                  if (!result.ok) return setError(result.error);
                  setError("");
                  setReply("");
                  notice(
                    "Reply added to this preview only. Nothing was sent to support.",
                  );
                }}
              >
                <textarea
                  aria-label="Support reply"
                  placeholder="Type your message here"
                  required
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                />
                <div className="fp-paired-buttons">
                  <Button
                    secondary
                    onClick={() =>
                      notice(
                        "Attachments are unavailable in this preview. No file is uploaded.",
                      )
                    }
                  >
                    Attach File
                  </Button>
                  <Button type="submit">Send reply</Button>
                </div>
                {error && <p role="alert">{error}</p>}
              </form>
            )}
          </Panel>
        </div>
        <div className="fp-stack">
          <Panel
            title="Ticket Information"
            action={
              <Link
                className="fp-text-link"
                href={portalUrl(`settings/support/${record.id}/status`)}
              >
                Update status
              </Link>
            }
          >
            <KeyValues
              items={[
                ["Status", <Badge key="s">{record.status}</Badge>],
                ["Category", record.fields.category ?? "General"],
                ["Created", "30 Oct 2026"],
                ["Created by", "Fleet Operator (Lagos Move Fleet)"],
                ["Response time", "No commitment in preview"],
              ]}
            />
          </Panel>
          <Panel title="Related Information">
            {record.id === "sr-202612" ? (
              <KeyValues
                items={[
                  ["Driver", "Ibrahim Sule (DRV-3456)"],
                  ["Payout Period", "23–29 Sep 2026"],
                  ["Reference", "PO-35621-1912-29102"],
                  ["Payout Method", "Bank transfer (•••• 6789)"],
                ]}
              />
            ) : (
              <p className="fp-muted">No related record linked.</p>
            )}
          </Panel>
          <Panel title="Helpful Articles">
            {[
              "Understanding driver payouts",
              "Payout timelines and delays",
              "How to update bank details",
            ].map((t) => (
              <button
                className="fp-article"
                key={t}
                onClick={() => setArticle(t)}
              >
                {t}
                <ChevronRight size={16} />
              </button>
            ))}
          </Panel>
        </div>
      </div>
      {article && (
        <Dialog title={article} onClose={() => setArticle("")}>
          <p>
            Payout information is available in Payouts. Check the destination
            and settlement mode, and review the transaction status. This design
            preview does not connect to banking services.
          </p>
          <Button href="payouts">Go to Payouts</Button>
        </Dialog>
      )}
    </>
  );
}
