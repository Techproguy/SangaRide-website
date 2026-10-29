"use client";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ChevronRight, Mail, Pencil, Trash2 } from "lucide-react";
import { people, portalUrl } from "@/lib/fleet-portal";
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
  const [logo, setLogo] = useState("");
  return (
    <>
      <Header
        title="Account & Profile"
        description="Manage your fleet account, information and security settings"
      />
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
              <label className="fp-text-link">
                Change Logo
                <input
                  aria-label="Change fleet logo"
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={(e) => setLogo(e.target.files?.[0]?.name ?? "")}
                />
              </label>
              {logo && <small>{logo}</small>}
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
              <Dropdown label="Default Market" options={["Lagos", "Abuja"]} />
            </Field>
            <Field label="Time zone" required>
              <Dropdown
                label="Time zone"
                options={["GMT +1 West Africa Time", "UTC"]}
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
                {["Rides", "Delivery", "Airport rides"].map((t) => (
                  <label className="fp-check" key={t}>
                    <input type="checkbox" defaultChecked />
                    {t}
                  </label>
                ))}
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
    price: 1200,
  },
  {
    name: "Comfort Ride",
    image: "imgFavpng885D290E782F4F3Ce6D77D44Cefe13C81",
    desc: "Comfortable reliable ride",
    price: 1800,
  },
  {
    name: "Sanga XL",
    image: "imgFavpng111Cf00Afbe7Bc2Cdfda9E51953652261",
    desc: "Spacious rides for groups",
    price: 3000,
  },
  {
    name: "Sanga Lux",
    image: "imgPngwingCom261",
    desc: "Luxurious rides for luxurious experience",
    price: 5000,
  },
  {
    name: "Sanga Motor",
    image: "imgPngwingCom71",
    desc: "Beat traffic with motorcycle rides",
    price: 700,
  },
  {
    name: "Sanga Assist",
    image: "imgPngwingCom271",
    desc: "Vehicle with extra help and accessibility",
    price: 3000,
  },
];
function Services() {
  const [selected, setSelected] = useState("Sanga Go");
  const [price, setPrice] = useState("1200");
  const [active, setActive] = useState("Active");
  const [saved, setSaved] = useState<
    Record<string, { price: string; active: string }>
  >({});
  const current = serviceRows.find((s) => s.name === selected)!;
  return (
    <>
      <Header
        title="Service Types"
        description="Configure the service you operate and set their parameters, pricing and availability"
      />
      <Panel title="Change Service Details">
        <DemoForm
          onSave={() =>
            setSaved((s) => ({ ...s, [selected]: { price, active } }))
          }
        >
          <div className="fp-three">
            <div>
              <Field label="Choose service type">
                <Dropdown
                  label="Choose service type"
                  value={selected}
                  onChange={(v) => {
                    setSelected(v);
                    setPrice(
                      String(serviceRows.find((s) => s.name === v)!.price),
                    );
                  }}
                  options={serviceRows.map((s) => s.name)}
                />
              </Field>
              <span className="fp-vehicle-cell">
                <Asset
                  screen="922:21592"
                  name={current.image}
                  width={150}
                  height={80}
                />
                <span>
                  {current.name}
                  <small>Standard ride</small>
                </span>
              </span>
            </div>
            <div>
              <Field
                label="Base Price (₦)"
                type="number"
                value={price}
                onChange={setPrice}
              />
              <Field label="Status">
                <Dropdown
                  label="Service status"
                  options={["Active", "Inactive"]}
                  value={active}
                  onChange={setActive}
                />
              </Field>
            </div>
            <div>
              <Field label="Price Type">
                <Dropdown
                  label="Price Type"
                  options={["Fixed price", "Estimated"]}
                />
              </Field>
              <label className="fp-check">
                <input type="checkbox" defaultChecked />
                Show to customer in app
              </label>
            </div>
          </div>
        </DemoForm>
      </Panel>
      <DataTable
        paginate={false}
        headers={["Service type", "Description", "Base Price", "Status"]}
        rows={serviceRows.map((s, i) => ({
          key: s.name,
          cells: [
            <span key="v" className="fp-vehicle-cell">
              <Asset screen="922:21592" name={s.image} width={86} height={48} />
              <span>
                {s.name}
                <small>{i > 3 ? "extra help" : "Standard ride"}</small>
              </span>
            </span>,
            s.desc,
            `₦${saved[s.name]?.price ?? s.price}`,
            <Badge key="s">
              {saved[s.name]?.active ?? (i < 4 ? "Active" : "Inactive")}
            </Badge>,
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
      <div className="fp-two">
        <Panel title="Current Plan" action={<Badge>Active</Badge>}>
          <p className="fp-big-blue">Growth</p>
          <p>
            Ideal for expanding fleets with advanced features and higher limits
          </p>
          <h3>
            ₦50,000 <small>/month</small>
          </h3>
          <KeyValues items={[["Renewal date", "30 Oct 2026"]]} />
        </Panel>
        <Panel
          title="Plan Limits"
          action={<span className="fp-text-link">Usage</span>}
        >
          {[
            ["Drivers", 50, 100],
            ["Vehicles", 20, 100],
            ["Team Members", 6, 20],
            ["Active Integrations", 5, 10],
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
            "1 Sep 2026 – 30 Sep 2026",
            "₦50,000.00",
            <Badge key="p">Paid</Badge>,
            "30 Sep 2026",
            <ExportButton
              key="e"
              name="sample-invoice"
              rows={[
                ["Sample invoice", "Amount"],
                ["Growth plan", 50000],
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
}: {
  label: string;
  initial?: boolean;
}) {
  const [on, setOn] = useState(initial);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
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
                    ? "Get real time updates in the portal"
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
          headers={["Driver", "Email", "SMS", "In-App"]}
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
                />
              )),
            ],
          }))}
        />
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
  const [search, setSearch] = useState("");
  const [article, setArticle] = useState<number | null>(null);
  const [ticket, setTicket] = useState(false);
  const [subject, setSubject] = useState("");
  const [localTickets, setLocalTickets] = useState<string[]>([]);
  return (
    <>
      <Header
        title="Support Center"
        description="Find answers, raise a ticket, or contact our support team"
      >
        <Button onClick={() => setTicket(true)}>+ New Support Ticket</Button>
      </Header>
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
        rows={[
          ...localTickets,
          "Payout not received",
          "Vehicle document rejected",
          "Driver verification issue",
          "Driver verification issue",
          "Vehicle document rejected",
        ].map((s, i) => ({
          key: String(i),
          cells: [
            `SR-${202612 + i}`,
            s,
            ["Payouts", "Vehicles", "Drivers"][i % 3],
            <Badge key="s">
              {i < localTickets.length
                ? "Pending"
                : ["Resolved", "Processing", "Overdue"][i % 3]}
            </Badge>,
            "30 Sep 2026, 11:02 AM",
            <Link
              key="a"
              className="fp-text-link"
              href={portalUrl("settings/support/sr-202612")}
            >
              View details
            </Link>,
          ],
        }))}
      />
      {article !== null && (
        <Dialog title={topics[article].title} onClose={() => setArticle(null)}>
          <p>{topics[article].body}</p>
          <Button secondary onClick={() => setArticle(null)}>
            Close
          </Button>
        </Dialog>
      )}
      {ticket && (
        <Dialog title="New Support Ticket" onClose={() => setTicket(false)}>
          <DemoForm
            button="Create preview ticket"
            onSave={() => {
              setLocalTickets((t) => [subject, ...t]);
              setTicket(false);
            }}
          >
            <Field
              label="Subject"
              required
              value={subject}
              onChange={setSubject}
            />
            <Dropdown
              label="Ticket category"
              options={["Payouts", "Vehicles", "Drivers", "Account"]}
            />
            <label className="fp-field">
              Description
              <textarea required />
            </label>
            <Info>Preview only. No support request is sent.</Info>
          </DemoForm>
        </Dialog>
      )}
    </>
  );
}
function Audit() {
  const [search, setSearch] = useState("");
  const [action, setAction] = useState("All Actions");
  const [user, setUser] = useState("All Users");
  const [module, setModule] = useState("All Modules");
  const rows = Array.from({ length: 12 }, (_, i) => ({
    date: "30 Sep 2026",
    user: people[i % 3].name,
    module: ["Driver", "Fleet Operator", "Assignment"][i % 3],
    detail: [
      "Updated driver profile John Doe (DRV-7821)",
      "Added new vehicle Toyota Corolla BDJ 822 FQ",
      "Assigned driver to vehicle (DRV-6612 → KSF-21AAA)",
    ][i % 3],
    action: i === 1 ? "Created" : i === 3 ? "Deleted" : "Updated",
  })).filter(
    (r) =>
      Object.values(r).join(" ").toLowerCase().includes(search.toLowerCase()) &&
      (action === "All Actions" || action === r.action) &&
      (user === "All Users" || user === r.user) &&
      (module === "All Modules" || module === r.module),
  );
  return (
    <>
      <Header
        title="Audit Log"
        description="Track important actions and changes within your fleet portal"
      >
        <ExportButton
          rows={[
            ["Date", "User", "Module", "Details", "Action"],
            ...rows.map((r) => Object.values(r)),
          ]}
        />
      </Header>
      <div className="fp-filters">
        <SearchField
          value={search}
          onChange={setSearch}
          placeholder="Search by username, action or details"
        />
        <Dropdown
          label="Audit action"
          value={action}
          onChange={setAction}
          options={["All Actions", "Created", "Updated", "Deleted"]}
        />
        <Dropdown
          label="Audit user"
          value={user}
          onChange={setUser}
          options={["All Users", ...people.slice(0, 3).map((p) => p.name)]}
        />
        <Dropdown
          label="Audit module"
          value={module}
          onChange={setModule}
          options={["All Modules", "Driver", "Fleet Operator", "Assignment"]}
        />
      </div>
      <DataTable
        pageSize={10}
        headers={[
          "Date and Time",
          "User",
          "Module",
          "Details",
          "Action",
          "IP Address",
        ]}
        rows={rows.map((r, i) => ({
          key: String(i),
          cells: [
            <span key="d">
              {r.date}
              <small>14:22</small>
            </span>,
            r.user,
            r.module,
            r.detail,
            <Badge key="a">{r.action}</Badge>,
            "197.210.12.45",
          ],
        }))}
      />
    </>
  );
}
function Notifications() {
  const [tab, setTab] = useState("All (24)");
  const [search, setSearch] = useState("");
  const [read, setRead] = useState<number[]>([]);
  const rows = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    title:
      i % 3 === 0
        ? "Vehicle issue reported"
        : i % 3 === 1
          ? "Driver activity update"
          : "Payout update",
    category: i % 3 === 0 ? "Vehicles" : i % 3 === 1 ? "Driver" : "Earning",
  }));
  return (
    <>
      <Header
        title="Notifications"
        description="Stay updated with important information"
      >
        <ExportButton
          rows={[["Notification"], ...rows.map((r) => [r.title])]}
        />
      </Header>
      <SearchField
        value={search}
        onChange={setSearch}
        placeholder="Search by username, action or details"
      />
      <Tabs
        active={tab}
        onChange={setTab}
        items={[
          "All (24)",
          "Unread",
          "Driver",
          "Vehicles",
          "Earning",
          "Maintenance",
        ].map((label) => ({ label }))}
      />
      <ul className="fp-notifications">
        {rows
          .filter(
            (r) =>
              r.title.toLowerCase().includes(search.toLowerCase()) &&
              (tab.startsWith("All") ||
                (tab === "Unread" && !read.includes(r.id)) ||
                tab === r.category ||
                (tab === "Maintenance" && r.category === "Vehicles")),
          )
          .map((r) => (
            <li key={r.id} className={read.includes(r.id) ? "read" : ""}>
              <Link
                href={portalUrl(
                  r.category === "Vehicles"
                    ? "maintenance/iss-2711"
                    : r.category === "Driver"
                      ? "drivers/chinedu"
                      : "payouts",
                )}
                onClick={() => setRead((a) => [...a, r.id])}
              >
                <span className="fp-setting-symbol">!</span>
                <span>
                  <strong>{r.title}</strong>
                  <small>Chinedu Okafor · Sample fleet update</small>
                </span>
                <small>30 Sep 2026, 10:24 AM</small>
                <ChevronRight size={17} />
              </Link>
            </li>
          ))}
      </ul>
    </>
  );
}
export function SupportTicket() {
  const [reply, setReply] = useState("");
  const [replies, setReplies] = useState<string[]>([]);
  const [attachment, setAttachment] = useState("");
  const [article, setArticle] = useState("");
  const notice = useNotice();
  return (
    <>
      <Header
        title=""
        back={{ label: "Back to Tickets", path: "settings/support" }}
      />
      <div className="fp-two fp-ticket-grid">
        <div className="fp-stack">
          <Panel title="Ticket #SR 202612">
            <p>Payout not received</p>
            <div className="fp-ticket-meta">
              <small>Payouts</small>
              <small>
                Created
                <br />
                30 Sep 2026 11:42 AM
              </small>
              <small>
                Last updated
                <br />
                30 Sep 2026 12:00 PM
              </small>
            </div>
          </Panel>
          {[
            {
              from: "You (Fleet Operator)",
              text: "Hi the payout for driver Ibrahim Sule (DRV-9910) for the period of 23–29 September has not been received, please assist",
              time: "11:42 AM",
            },
            {
              from: "Sanga Support team",
              text: "Hello, thanks for reaching out, we are checking the payout status and we will get back to you shortly",
              time: "11:45 AM",
            },
            {
              from: "You (Fleet Operator)",
              text: "Noted. Please confirm once this has been resolved",
              time: "11:47 AM",
            },
            ...replies.map((text) => ({
              from: "You (Preview)",
              text,
              time: "Draft preview",
            })),
          ].map((r, i) => (
            <Panel key={i}>
              <div className="fp-message-heading">
                <span className="fp-id">
                  {r.from.startsWith("Sanga") ? "S" : "FO"}
                </span>
                <strong>{r.from}</strong>
                <small>{r.time}</small>
              </div>
              <p className="fp-muted">{r.text}</p>
              {i === 0 && (
                <div className="fp-ticket-attachments">
                  <button
                    onClick={() =>
                      notice(
                        "No actual screenshot is attached to this sample ticket.",
                      )
                    }
                  >
                    Payout-screenshot.png<small>234kb</small>
                  </button>
                  <button
                    onClick={() =>
                      notice(
                        "No actual statement is attached to this sample ticket.",
                      )
                    }
                  >
                    Statement.pdf<small>1.5mb</small>
                  </button>
                </div>
              )}
            </Panel>
          ))}
          <Panel>
            <form
              className="fp-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (!reply.trim()) return;
                setReplies((a) => [...a, reply]);
                setReply("");
                setAttachment("");
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
                <label className="fp-button fp-secondary fp-attach">
                  Attach File
                  <input
                    type="file"
                    onChange={(e) =>
                      setAttachment(e.target.files?.[0]?.name ?? "")
                    }
                  />
                </label>
                <Button type="submit">Send reply</Button>
              </div>
              {attachment && <small>Selected locally: {attachment}</small>}
            </form>
          </Panel>
        </div>
        <div className="fp-stack">
          <Panel title="Ticket Information">
            <KeyValues
              items={[
                ["Status", "Processing"],
                ["Category", "Payouts"],
                ["Priority", "High"],
                ["Created", "30 Sep 2026 11:42"],
                ["Last Updated", "30 Sep 2026 11:45"],
                ["Created by", "Fleet Operator (Lagos move fleet)"],
              ]}
            />
          </Panel>
          <Panel title="Related Information">
            <KeyValues
              items={[
                ["Drivers", "Chioma Okafor (DRV-1621)"],
                ["Payout Period", "23–29 Sep 2026"],
                ["Reference", "PO-35621-1912-29102"],
                ["Payout Method", "Bank Transfer (Wema Bank)"],
              ]}
            />
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
