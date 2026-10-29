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
  Bell,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { portalUrl } from "@/lib/fleet-portal";
import { Asset, DemoContext, Button, Field } from "./ui";
import { Dashboard, Operations, Earnings } from "./Overview";
import { Directory, InviteDriver } from "./Directory";
import {
  VehicleDetail,
  DriverDetail,
  TeamDetail,
  IssueDetail,
  TripDetail,
} from "./Details";
import { Finance, Reports } from "./Finance";
import { Settings, SupportTicket } from "./Settings";

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
    ],
  },
];

export function FleetPortal({ path }: { path: string }) {
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
          {navigation.map((item) => {
            const active =
              item.path === ""
                ? path === ""
                : path === item.path || path.startsWith(`${item.path}/`);
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
                        aria-current={path === href ? "page" : undefined}
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
              <Link href="/fleet">Back to website</Link>
              <Link href={portalUrl("login")}>Sign out of preview</Link>
            </div>
          </details>
        </div>
      </>
    );
  }
  let screen: ReactNode;
  if (path === "") screen = <Dashboard />;
  else if (path === "drivers/invite") screen = <InviteDriver />;
  else if (path === "drivers/chinedu") screen = <DriverDetail />;
  else if (path.startsWith("vehicles/rav4/"))
    screen = <VehicleDetail key={path} tab={path.split("/")[2]} />;
  else if (path === "operations/trp-99321") screen = <TripDetail />;
  else if (path === "operations") screen = <Operations />;
  else if (path === "maintenance/iss-2711") screen = <IssueDetail />;
  else if (path === "earnings") screen = <Earnings />;
  else if (path.startsWith("payouts"))
    screen = <Finance key={path} path={path} />;
  else if (path.startsWith("reports"))
    screen = <Reports key={path} path={path} />;
  else if (path === "team/aisha") screen = <TeamDetail />;
  else if (path === "settings/support/sr-202612") screen = <SupportTicket />;
  else if (path.startsWith("settings") || path === "notifications")
    screen = <Settings key={path} path={path} />;
  else screen = <Directory key={path} kind={path} />;

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
            {screen}
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
        <Link
          href="/fleet"
          className="fp-login-logo"
          aria-label="Back to Sanga Fleet"
        >
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
              type="email"
              placeholder="Enter your work email"
            />
            <Field
              label="Password"
              type="password"
              placeholder="Enter your password"
            />
            <div className="fp-login-options">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <button
                type="button"
                onClick={() =>
                  setMessage(
                    "Password recovery will be available when live sign-in is connected. Please contact Sanga Ride for account help.",
                  )
                }
              >
                Forgot Password?
              </button>
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
          <div className="fp-login-preview">
            <span>Frontend design preview · No live account required</span>
            <Link href={portalUrl()}>
              Explore the fleet portal <ChevronRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
