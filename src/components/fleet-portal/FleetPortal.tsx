"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { portalUrl } from "@/lib/fleet-portal";
import { Asset, DemoContext, Button, Field } from "./ui";
import {
  Dashboard,
  Earnings,
  Operations,
  OperationsUnavailable,
} from "./Overview";
import {
  DriverDirectory,
  InvitationDirectory,
  InviteDriver,
  IssueDirectory,
  TeamDirectory,
  VehicleDirectory,
  fixturePerson,
} from "./Directory";
import type { PreviewState } from "@/lib/fleet-preview-domain";
import {
  VehicleDetail,
  DriverDetail,
  TeamDetail,
  IssueDetail,
  TripDetail,
} from "./Details";
import { Finance, Reports } from "./Finance";
import { WorkflowScreen, handlesWorkflow } from "./Workflows";
import { PreviewToolbar } from "./WorkflowUI";
import { usePreview } from "./PreviewProvider";
import { Settings, SupportTicket } from "./Settings";

const designedVehicleTabs = [
  "overview",
  "documents",
  "maintenance",
  "assignments",
  "trips",
  "earnings",
];
/**
 * Figma-designed screens take precedence over the generic workflow views. Workflow-only
 * steps (review, verification, manage, split) and records without design data fall through.
 */
function designedScreen(path: string, state: PreviewState): ReactNode {
  if (designedFinance.includes(path))
    // Operations staff get the workflow layer's permission-denied view.
    return state.role === "Operations" ? null : path === "earnings" ? (
      <Earnings />
    ) : (
      <Finance key={path} path={path} />
    );
  if (path === "drivers") return <DriverDirectory />;
  if (path === "drivers/invite") return <InviteDriver />;
  if (path === "invitations") return <InvitationDirectory />;
  if (path === "vehicles") return <VehicleDirectory />;
  const [section, id, tab, ...rest] = path.split("/");
  if (section === "drivers" && id && !tab) {
    const record = state.records.drivers.find(
      (d) => d.id === id && d.market === state.market,
    );
    const person = record && fixturePerson(record.name);
    if (record && person)
      return <DriverDetail key={path} record={record} person={person} />;
  }
  if (
    section === "vehicles" &&
    id &&
    designedVehicleTabs.includes(tab) &&
    !rest.length
  ) {
    const record = state.records.vehicles.find(
      (v) => v.id === id && v.market === state.market,
    );
    if (record) return <VehicleDetail key={path} tab={tab} record={record} />;
  }
  if (path === "maintenance") return <IssueDirectory />;
  if (path === "team") return <TeamDirectory />;
  if (designedReports.includes(path)) return <Reports key={path} path={path} />;
  // Integrations stays the workflow empty state: no integration is confirmed (D-10).
  if (designedSettings.includes(path)) return <Settings key={path} path={path} />;
  if (section === "maintenance" && id && !tab) {
    const record = state.records.issues.find(
      (i) => i.id === id && i.market === state.market,
    );
    if (record) return <IssueDetail key={path} record={record} />;
  }
  if (section === "team" && id && !tab) {
    const record = state.records.team.find(
      (m) => m.id === id && m.market === state.market,
    );
    if (record) return <TeamDetail key={path} record={record} />;
  }
  if (path.startsWith("settings/support/")) {
    const [, , ticketId, ticketTab] = path.split("/");
    const record = state.records.tickets.find(
      (t) => t.id === ticketId && t.market === state.market,
    );
    if (record && !ticketTab)
      return <SupportTicket key={path} record={record} />;
  }
  return null;
}
const designedFinance = [
  "earnings",
  "payouts",
  "payouts/destination",
  "payouts/destination/change",
  "payouts/destination/review",
  "payouts/settlement",
  "payouts/settlement/review",
  "payouts/settlement/confirm",
  "payouts/split",
  "payouts/split/review",
];
const designedReports = ["reports", "reports/earnings", "reports/performance"];
const designedSettings = [
  "settings/profile",
  "settings/policies",
  "settings/billing",
  "settings/notifications",
  "settings/support",
  "settings/audit",
  "notifications",
];

const navigation = [
  { name: "Dashboard", path: "", icon: "imgGroup9" },
  { name: "Drivers", path: "drivers", icon: "imgBoxiconsSteeringWheel" },
  { name: "Vehicles", path: "vehicles", icon: "imgBoxiconsCarFilled" },
  { name: "Fleet Operations", path: "operations", icon: "imgBiCarFrontFill" },
  {
    name: "Maintenance",
    path: "maintenance",
    icon: "imgPajamasIssueTypeMaintenance",
  },
  { name: "Earnings", path: "earnings", icon: "imgF7MoneyDollarCircle" },
  {
    name: "Payouts",
    path: "payouts",
    icon: "imgUilMoneybag",
    children: [
      ["Overview", "payouts"],
      ["Destination", "payouts/destination"],
      ["Settlement mode", "payouts/settlement"],
      ["Split", "payouts/split"],
    ],
  },
  {
    name: "Invitations",
    path: "invitations",
    icon: "imgMdiAccountMultiplePlus",
  },
  {
    name: "Reports",
    path: "reports",
    icon: "imgBoxiconsFileReport",
    children: [
      ["Generate report", "reports"],
      ["Earning report", "reports/earnings"],
      ["Performance report", "reports/performance"],
    ],
  },
  { name: "Team", path: "team", icon: "imgFluentPeopleTeam24Filled" },
  {
    name: "Settings",
    path: "settings",
    icon: "imgClaritySettingsLine",
    children: [
      ["Overview", "settings"],
      ["Support Center", "settings/support"],
      ["Audit log", "settings/audit"],
      ["Notifications", "notifications"],
    ],
  },
];

export function FleetPortal({ path }: { path: string }) {
  const { state } = usePreview();
  const [notice, setNotice] = useState("");
  const [menu, setMenu] = useState(false);
  const mobileMenu = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!menu) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menu]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 6500);
    return () => clearTimeout(timer);
  }, [notice]);
  function sidebar() {
    return (
      <>
        <Link
          className="fp-logo"
          href={portalUrl()}
          aria-label="Fleet dashboard"
        >
          <Asset
            name="imgGroup1000003111"
            width={207}
            height={44}
            alt="Sanga Ride"
          />
        </Link>
        <nav aria-label="Fleet portal navigation">
          <Link href={portalUrl("workflows")} className="fp-nav-item">
            <span>All workflows</span>
          </Link>
          <Link href={portalUrl("onboarding/status")} className="fp-nav-item">
            <span>Fleet application</span>
          </Link>
          <Link href="/" className="fp-nav-item">
            <ArrowLeft size={16} />
            <span>Back to home</span>
          </Link>
          {navigation.map((item) => {
            const within = (href: string) =>
              path === href || path.startsWith(`${href}/`);
            const active =
              item.path === ""
                ? path === ""
                : within(item.path) ||
                  !!item.children?.some(([, href]) => within(href));
            // Deepest matching sub-item; sub-pages without their own entry fall back to the first.
            const current = item.children
              ?.map(([, href]) => href)
              .filter(within)
              .sort((a, b) => b.length - a.length)[0] ??
              item.children?.[0][1];
            return (
              <div key={item.name}>
                <Link
                  href={portalUrl(item.path)}
                  onClick={() => {
                    mobileMenu.current?.close();
                    setMenu(false);
                  }}
                  className={`fp-nav-item ${active ? "active" : ""}`}
                  aria-current={active ? "page" : undefined}
                >
                  <Asset name={item.icon} width={16} height={16} />
                  <span>{item.name}</span>
                  {item.children && <ChevronRight size={14} />}
                </Link>
                {item.children && active && (
                  <div className="fp-subnav">
                    {item.children.map(([label, href]) => (
                      <Link
                        href={portalUrl(href)}
                        key={href}
                        aria-current={current === href ? "page" : undefined}
                        onClick={() => {
                          mobileMenu.current?.close();
                          setMenu(false);
                        }}
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        <div className="fp-sidebar-user">
          <span className="fp-initials">SE</span>
          <span>
            Samuel Eze<small>Fleet Operator</small>
          </span>
          <details>
            <summary aria-label="Account menu">
              <ChevronDown size={16} />
            </summary>
            <div className="fp-account-menu">
              <Link href={portalUrl("settings/profile")}>
                Account & profile
              </Link>
              <Link href="/">Back to home</Link>
              <Link href={portalUrl("login")}>Sign out of preview</Link>
            </div>
          </details>
        </div>
      </>
    );
  }
  let screen: ReactNode;
  const designed = designedScreen(path, state);
  if (designed) screen = designed;
  else if (handlesWorkflow(path)) screen = <WorkflowScreen path={path} />;
  else if (path === "") screen = <Dashboard />;
  else if (path === "operations/trp-99321")
    screen = state.market === "NG" ? <TripDetail /> : <OperationsUnavailable trip />;
  else if (path === "operations")
    screen = state.market === "NG" ? <Operations /> : <OperationsUnavailable />;
  else if (path.startsWith("settings") || path === "notifications")
    screen = <Settings key={path} path={path} />;
  else screen = null;

  return (
    <DemoContext.Provider value={setNotice}>
      {path === "login" ? (
        <Login />
      ) : (
        <div className="fp-shell">
          <aside className="fp-sidebar">{sidebar()}</aside>
          <div className="fp-mobile-bar">
            <button
              aria-label="Open fleet navigation"
              aria-expanded={menu}
              onClick={() => {
                mobileMenu.current?.showModal();
                setMenu(true);
              }}
            >
              <Menu size={22} />
            </button>
            <Asset
              name="imgGroup1000003111"
              width={155}
              height={33}
              alt="Sanga Ride"
            />
            <Link href={portalUrl("notifications")} aria-label="Notifications">
              <Bell size={20} />
            </Link>
          </div>
          <dialog
            ref={mobileMenu}
            className="fp-mobile-menu"
            onClose={() => setMenu(false)}
            onClick={(e) => {
              if (e.target === e.currentTarget) mobileMenu.current?.close();
            }}
          >
            <button
              className="fp-menu-close"
              aria-label="Close fleet navigation"
              onClick={() => mobileMenu.current?.close()}
            >
              <X size={22} />
            </button>
            {sidebar()}
          </dialog>
          <main className="fp-main">
            <PreviewToolbar>
              <div className="fp-top-controls">
                <label className="fp-date">
                  <CalendarDays size={17} />
                  <input
                    aria-label="Reporting date"
                    type="date"
                    defaultValue="2026-09-29"
                  />
                </label>
                <Link
                  href={portalUrl("notifications")}
                  className="fp-bell"
                  aria-label="Notifications"
                >
                  <Bell size={18} />
                </Link>
                <Link
                  href={portalUrl("settings/profile")}
                  className="fp-initials"
                  aria-label="Account profile"
                >
                  SE
                </Link>
              </div>
            </PreviewToolbar>
            {screen}
            {path.startsWith("operations") && (
              <div className="fp-work-links">
                {/* Sample trips and map exist only in the Nigeria preview. */}
                {state.market === "NG" && (
                  <p>
                    Illustrative sample map · Last location update: 30 Oct 2026
                    09:00 UTC · No live tracking
                  </p>
                )}
                <Link href={portalUrl("assignments")}>
                  Manage assignments →
                </Link>
                {state.market === "NG" && (
                  <Link href={portalUrl("operations/trp-99321/exceptions")}>
                    Trip exceptions →
                  </Link>
                )}
              </div>
            )}
            <p className="fp-preview-note">
              Design preview · Sample fleet data · Changes are local to this
              preview.
            </p>
          </main>
        </div>
      )}
      {notice && (
        <div role="status" className="fp-toast">
          <span>{notice}</span>
          <button aria-label="Dismiss message" onClick={() => setNotice("")}>
            <X size={18} />
          </button>
        </div>
      )}
    </DemoContext.Provider>
  );
}

function Login() {
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  function submit(e: FormEvent) {
    e.preventDefault();
    setMessage(
      "Live sign-in is not connected yet. You can explore the design preview below without entering credentials.",
    );
  }
  return (
    <main className="fp-login">
      <section className="fp-login-image">
        <Asset
          screen="922:20482"
          name="imgTwilightSuVsByTheCityBridge1"
          className="fp-login-photo"
          width={1563}
          height={1043}
        />
        <Link href="/" className="fp-login-logo" aria-label="Sanga Ride home">
          <Asset
            screen="922:20482"
            name="imgGroup1000003111"
            width={294}
            height={62}
            alt="Sanga Ride"
          />
        </Link>
        <div className="fp-login-pitch">
          <h1>
            Manage your fleet
            <br />
            with confidence
          </h1>
          <p>
            Drivers <span>·</span> Vehicles <span>·</span> Earnings{" "}
            <span>·</span> Growth
          </p>
        </div>
        <p className="fp-login-tagline">
          Reliable rides
          <br />
          Stronger businesses
          <span />
        </p>
      </section>
      <section className="fp-login-content">
        <div>
          <Link href="/" className="fp-back-home">
            <ArrowLeft size={16} /> Back to home
          </Link>
          <h2>
            Welcome to
            <br />
            Sanga Ride Fleet Portal
          </h2>
          <p className="fp-muted">
            Sign in to manage your fleet, drivers and earnings
          </p>
          <form onSubmit={submit} className="fp-login-form">
            <Field
              label="Email address"
              type="text"
              value="operator@example.invalid"
              placeholder="Sample identifier"
            />
            <Field
              label="Password"
              type={showPassword ? "text" : "password"}
              value="Preview-only-password"
              placeholder="Sample password"
            />
            <button
              type="button"
              className="fp-link"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? "Hide" : "Show"} sample password
            </button>
            <p>
              Preview only · Sample credentials are fixed; do not enter real
              credentials.
            </p>
            <div className="fp-login-options">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <Link href={portalUrl("security/recover")}>Forgot Password?</Link>
            </div>
            <Button type="submit">Sign in</Button>
            <div className="fp-or">
              <span />
              Or
              <span />
            </div>
            <button
              type="button"
              className="fp-button fp-secondary fp-google"
              onClick={() =>
                setMessage(
                  "Google sign-in is not connected yet. Use the design preview to explore the portal.",
                )
              }
            >
              <Asset
                screen="922:20482"
                name="imgDeviconGoogle"
                width={16}
                height={16}
              />
              Continue with Google
            </button>
            <p className="fp-login-contact">
              Don’t have an account?{" "}
              <Link href="/fleet/contact">Contact Sanga Ride</Link>
            </p>
            {message && (
              <p role="status" className="fp-info">
                {message}
              </p>
            )}
          </form>
          <div className="fp-work-links">
            <Link href={portalUrl("onboarding/start")}>
              Apply as a fleet partner →
            </Link>
            <Link href={portalUrl("security/verify")}>
              Step-up verification preview →
            </Link>
          </div>
          <div className="fp-login-preview">
            <span>Frontend design preview · No live account required</span>
            <Link href={portalUrl()}>
              Explore the fleet portal <ChevronRight size={15} />
            </Link>
          </div>
          {/* Preview controls sit below the sign-in form so the design's heading and form lead. */}
          <h3 className="fp-login-settings">Preview settings</h3>
          <PreviewToolbar />
        </div>
      </section>
    </main>
  );
}
