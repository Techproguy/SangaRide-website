"use client";
import Link from "next/link";
import { usePreview } from "./PreviewProvider";
import { useState } from "react";
import { ChevronRight, LocateFixed, Minus, Plus } from "lucide-react";
import { people, portalUrl } from "@/lib/fleet-portal";
import {
  allocation,
  formatMoney,
  marketConfig,
} from "@/lib/fleet-preview-domain";
import { AllocationBreakdown, FinanceLinks } from "./FinanceWorkflows";
import { fixturePerson, perTrip } from "./Directory";
import { PreviewBanner } from "./WorkflowUI";
import {
  Asset,
  Badge,
  Button,
  DataTable,
  Dropdown,
  Header,
  Panel,
  Person,
  SearchField,
  Stats,
} from "./ui";

export function Trend({
  large = false,
  report = false,
}: {
  large?: boolean;
  report?: boolean;
}) {
  const { state } = usePreview();
  const symbol = state.market === "NG" ? "₦" : "$";
  const [period, setPeriod] = useState("Last 7 days");
  return (
    <Panel
      title="Earnings Trend"
      action={
        <Dropdown
          label="Chart interval"
          options={["Last 7 days", "Last 30 days"]}
          value={period}
          onChange={setPeriod}
        />
      }
    >
      <div
        className={`fp-trend ${large ? "fp-trend-large" : ""}`}
        aria-label={`Illustrative earnings trend, ${period}`}
        role="img"
      >
        <div className="fp-chart-y">
          {[
            `${symbol}400k`,
            `${symbol}300k`,
            `${symbol}200k`,
            `${symbol}100k`,
            "0",
          ].map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <div className="fp-chart-plot">
          <div className="fp-chart-lines">
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} />
            ))}
          </div>
          {large ? (
            <div className="fp-multi-lines">
              <Asset
                screen={report ? "922:20548" : "922:16161"}
                name={report ? "imgGroup1000003250" : "imgVector18"}
                width={928}
                height={113}
                className="fp-series-blue"
              />
              <Asset
                screen={report ? "922:20548" : "922:16161"}
                name={report ? "imgGroup1000003249" : "imgVector20"}
                width={913}
                height={55}
                className="fp-series-green"
              />
              {report && (
                <Asset
                  screen="922:20548"
                  name="imgGroup1000003248"
                  width={913}
                  height={49}
                  className="fp-series-orange"
                />
              )}
            </div>
          ) : (
            <Asset
              name="imgVector17"
              width={416}
              height={143}
              className="fp-chart-line"
            />
          )}
          <div className="fp-chart-x">
            {(period === "Last 7 days"
              ? [
                  "23 Sep",
                  "24 Sep",
                  "25 Sep",
                  "26 Sep",
                  "27 Sep",
                  "28 Sep",
                  "29 Sep",
                ]
              : [
                  "1 Sep",
                  "5 Sep",
                  "10 Sep",
                  "15 Sep",
                  "20 Sep",
                  "25 Sep",
                  "30 Sep",
                ]
            ).map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>
      </div>
      {large && (
        <div className="fp-series-legend">
          <span>● {report ? "Total earnings" : "Earnings"}</span>
          <span>● {report ? "Fleet commission" : "Commission"}</span>
          {report && <span>● Driver payout</span>}
        </div>
      )}
    </Panel>
  );
}
const serviceShares = [
  ["Standard Ride", 5660],
  ["Airport Ride", 2000],
  ["Deliveries", 1200],
  ["Scheduled Rides", 1140],
] as const;
/**
 * Sample trips for the selected market, derived from its drivers so the dashboard, earnings
 * and driver pages agree. Gross fares are completed trips at the illustrative per-trip rate.
 */
export function useSampleTrips() {
  const { state } = usePreview();
  const total = state.records.drivers
    .filter((d) => d.market === state.market)
    .reduce((sum, d) => sum + (fixturePerson(d.name)?.trips ?? 0), 0);
  const inProgress = Math.round(total * 0.1);
  const cancelled = Math.round(total * 0.05);
  const noShow = Math.round(total * 0.03);
  const completed = total - inProgress - cancelled - noShow;
  return {
    total,
    completed,
    gross: completed * perTrip[state.market],
    counts: [
      ["Completed", completed],
      ["In progress", inProgress],
      ["Cancelled", cancelled],
      ["No show", noShow],
    ] as [string, number][],
  };
}
/** Whole percentages that always total 100 (largest remainder). */
function percentages(values: number[]) {
  const total = values.reduce((a, b) => a + b, 0);
  const exact = values.map((v) => (v * 100) / total);
  const result = exact.map(Math.floor);
  const order = exact
    .map((v, i) => [v - Math.floor(v), i])
    .sort((a, b) => b[0] - a[0]);
  for (let k = 0; k < 100 - result.reduce((a, b) => a + b, 0); k++)
    result[order[k][1]]++;
  return result;
}
export function Breakdown({ earnings = false }: { earnings?: boolean }) {
  const { state } = usePreview();
  const trips = useSampleTrips();
  const gross = trips.gross;
  // Whole currency units; the last share takes the remainder so the parts sum to the total.
  const amounts = serviceShares.map(
    ([, bps]) => Math.round((gross * bps) / 1_000_000) * 100,
  );
  amounts[amounts.length - 1] =
    gross - amounts.slice(0, -1).reduce((a, b) => a + b, 0);
  const rows: [string, string][] = earnings
    ? serviceShares.map(([name], i) => [name, formatMoney(amounts[i], state.market)])
    : trips.counts.map(([name, n]) => [name, n.toLocaleString("en-US")]);
  const shares = percentages(
    earnings ? amounts : trips.counts.map(([, n]) => n),
  );
  return (
    <Panel title={earnings ? "Earnings Breakdown" : "Trip Status"}>
      <div className="fp-breakdown">
        <div
          className="fp-donut"
          role="img"
          aria-label="Illustrative trip distribution"
        >
          <Asset
            name="imgGroup2"
            className="fp-donut-red"
            width={53}
            height={73}
          />
          <Asset
            name="imgGroup3"
            className="fp-donut-blue"
            width={71}
            height={18}
          />
          <Asset
            name="imgGroup4"
            className="fp-donut-green"
            width={162}
            height={151}
          />
          <Asset
            name="imgGroup5"
            className="fp-donut-gray"
            width={15}
            height={25}
          />
          <span>
            <strong>
              {earnings
                ? new Intl.NumberFormat(
                    state.market === "NG" ? "en-NG" : "en-US",
                    {
                      style: "currency",
                      currency: marketConfig[state.market].currency,
                      notation: "compact",
                    },
                  ).format(gross / 100)
                : trips.total.toLocaleString("en-US")}
            </strong>
            <small>{earnings ? "Total Earnings" : "Total trips"}</small>
          </span>
        </div>
        <ul className="fp-legend">
          {rows.map(([name, n], i) => (
            <li key={name}>
              <i
                style={{
                  background: ["#00b578", "#006cff", "#ff122d", "#c8b8c6"][i],
                }}
              />
              <span>{name}</span>
              <small>
                {n} ({shares[i]}%)
              </small>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  );
}
export function RecentTrips({ full = false }: { full?: boolean }) {
  return (
    <DataTable
      title={full ? "Active Trips (42)" : "Recent Trips"}
      action={
        <Link href={portalUrl("operations")} className="fp-text-link">
          View all
        </Link>
      }
      paginate={false}
      headers={
        full
          ? [
              "Driver",
              "Vehicle",
              "Pickup",
              "Drop off",
              "Start Time",
              "Status",
              "Action",
            ]
          : [
              "Driver",
              "Pickup Location",
              "Drop off location",
              "Fare",
              "Status",
              "Time",
            ]
      }
      rows={people.slice(0, full ? 6 : 3).map((p, i) => ({
        key: p.id,
        cells: full
          ? [
              <Person key="p" index={i} />,
              <span key="v">
                Toyota Rav4<small>LND-204-BD</small>
              </span>,
              "Ikeja City Mall",
              i ? "Banana Island" : "Victoria Island",
              "10:24 AM",
              <Badge key="b">On Trip</Badge>,
              <Button key="a" href="operations/trp-99321">
                View details
              </Button>,
            ]
          : [
              p.name,
              ["Ikeja City Mall", "Yaba", "Surulere"][i],
              ["Victoria Island", "Lekki Phase 1", "Ikeja GRA"][i],
              ["₦3,800", "₦4,200", "₦2,500"][i],
              <Badge key="s">
                {["Completed", "In progress", "Cancelled"][i]}
              </Badge>,
              "10:24 AM",
            ],
      }))}
    />
  );
}
export function Dashboard() {
  const { state } = usePreview();
  const drivers = state.records.drivers.filter(
    (r) => r.market === state.market,
  );
  const vehicles = state.records.vehicles.filter(
    (r) => r.market === state.market,
  );
  const issues = state.records.issues.filter(
    (r) => r.market === state.market && r.status !== "resolved",
  );
  return (
    <>
      <Header
        title={state.market === "NG" ? "Lagos Move Fleet" : "Sample US Fleet"}
        eyebrow="Welcome back,"
        description="Shared sample records · Charts and trip history are illustrative fixtures"
      />
      <Stats
        items={[
          {
            label: "Eligible Drivers",
            value: String(
              drivers.filter((r) => ["active", "eligible"].includes(r.status))
                .length,
            ),
            hint: `${drivers.length} sample drivers`,
          },
          {
            label: "Active Vehicles",
            value: String(vehicles.filter((r) => r.status === "active").length),
            hint: `${vehicles.length} sample vehicles`,
          },
          {
            label: "Assignments",
            value: String(
              state.records.assignments.filter(
                (r) => r.market === state.market && r.status === "active",
              ).length,
            ),
            hint: "Active sample assignments",
          },
          {
            label: "Open Issues",
            value: String(issues.length),
            hint: "Sample maintenance cases",
            tone: "green",
          },
        ]}
      />
      <div className="fp-two fp-chart-grid">
        <Trend />
        <Breakdown />
      </div>
      <div className="fp-two fp-dashboard-bottom">
        {state.market === "NG" ? (
          <RecentTrips />
        ) : (
          <Panel title="Trip history">
            <p>No sample US trip records. No live trip service is connected.</p>
          </Panel>
        )}
        <Panel
          title="Fleet Health"
          action={
            <Link className="fp-text-link" href={portalUrl("maintenance")}>
              View all
            </Link>
          }
        >
          <ul className="fp-health">
            {[
              [
                "Eligible drivers",
                String(
                  drivers.filter((r) =>
                    ["active", "eligible"].includes(r.status),
                  ).length,
                ),
                "drivers",
                "imgGroup",
              ],
              [
                "Verification pending",
                String(
                  drivers.filter((r) => r.status === "verification_pending")
                    .length,
                ),
                "drivers",
                "imgGroup1",
              ],
              [
                "Vehicles active",
                String(vehicles.filter((r) => r.status === "active").length),
                "vehicles",
                "imgGroup1000003124",
              ],
              [
                "Open maintenance cases",
                String(issues.length),
                "maintenance",
                "imgGroup1000003125",
              ],
            ].map(([label, n, path, icon]) => (
              <li key={label}>
                <Link href={portalUrl(path)}>
                  <Asset name={icon} width={24} height={24} />
                  <span>{label}</span>
                  {n}
                  <ChevronRight size={14} />
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}
export function FleetMap({ trip = false }: { trip?: boolean }) {
  const [zoom, setZoom] = useState(1);
  const [focused, setFocused] = useState<number | null>(null);
  return (
    <div className={`fp-map ${trip ? "fp-map-trip" : ""}`}>
      <div className="fp-map-layer" style={{ transform: `scale(${zoom})` }}>
        <Asset
          screen={trip ? "922:15908" : "922:15039"}
          name="imgGoogleMaps1"
          width={1089}
          height={407}
          className="fp-map-image"
        />
        {trip && (
          <Asset
            screen="922:15908"
            name="imgGroup1000003324"
            width={162}
            height={270}
            className="fp-trip-route"
          />
        )}
        {!trip &&
          [0, 1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              className="fp-map-pin"
              style={{
                left: `${15 + ((n * 17) % 65)}%`,
                top: `${30 + ((n * 23) % 45)}%`,
              }}
              aria-label={`View ${people[n].name} on map`}
              onClick={() => setFocused(n)}
            >
              <Asset
                screen="922:15039"
                name="imgBoxiconsCarFilled1"
                width={24}
                height={24}
              />
            </button>
          ))}
      </div>
      {focused !== null && (
        <div className="fp-map-tooltip">
          <Person index={focused} />
          <Link href={portalUrl("operations/trp-99321")}>View trip</Link>
          <button
            onClick={() => setFocused(null)}
            aria-label="Close driver popup"
          >
            ×
          </button>
        </div>
      )}
      <div className="fp-map-controls">
        <button
          aria-label="Zoom in"
          onClick={() => setZoom(Math.min(zoom + 0.2, 2))}
        >
          <Plus size={19} />
        </button>
        <button
          aria-label="Zoom out"
          onClick={() => setZoom(Math.max(zoom - 0.2, 1))}
        >
          <Minus size={19} />
        </button>
        <button aria-label="Reset map" onClick={() => setZoom(1)}>
          <LocateFixed size={19} />
        </button>
      </div>
      <span className="fp-map-caption">
        Illustrative map · No live location data
      </span>
    </div>
  );
}
/** Operations sample data is Nigeria-only; other markets get an honest empty state, not NG trips. */
export function OperationsUnavailable({ trip = false }: { trip?: boolean }) {
  const { state } = usePreview();
  return (
    <>
      <Header
        title={trip ? "Trip not in this market" : "Fleet Operations"}
        description="Monitor active drivers, vehicle locations and ongoing trips. Locations show their last update time; no live telemetry is connected."
        back={trip ? { label: "Back to Trips", path: "operations" } : undefined}
      />
      <PreviewBanner />
      <Panel title="No sample trips">
        <p className="fp-muted">
          The {marketConfig[state.market].name} preview has no sample trips.
          Switch the market to Nigeria to explore the illustrative operations
          view.
        </p>
      </Panel>
    </>
  );
}
export function Operations() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [vehicle, setVehicle] = useState("All vehicle types");
  const [zone, setZone] = useState("All zones");
  return (
    <>
      <Header
        title="Fleet Operations"
        description="Monitor active drivers, vehicle locations and ongoing trips. Locations show their last update time; no live telemetry is connected."
      />
      <Stats
        items={[
          { label: "Active Drivers", value: "200" },
          { label: "On Trip", value: "42" },
          { label: "Available", value: "6", tone: "orange" },
          { label: "Total Vehicle", value: "148" },
          { label: "Need Attention", value: "3", tone: "red" },
        ]}
      />
      <div className="fp-map-section">
        <div className="fp-filters">
          <SearchField value={search} onChange={setSearch} />
          <Dropdown
            label="Trip status"
            options={["All statuses", "On Trip", "Completed"]}
            value={status}
            onChange={setStatus}
          />
          <Dropdown
            label="Vehicle type"
            options={["All vehicle types", "Sedan", "SUV"]}
            value={vehicle}
            onChange={setVehicle}
          />
          <Dropdown
            label="Zone"
            options={["All zones", "Ikeja", "Victoria Island"]}
            value={zone}
            onChange={setZone}
          />
        </div>
        <FleetMap />
      </div>
      {search ||
      status !== "All statuses" ||
      vehicle !== "All vehicle types" ||
      zone !== "All zones" ? (
        <DataTable
          title="Matching active trips"
          headers={["Driver", "Vehicle", "Status", "Action"]}
          rows={people
            .filter(
              (p) =>
                `${p.name} ${p.phone} ${p.id}`
                  .toLowerCase()
                  .includes(search.toLowerCase()) &&
                status !== "Completed" &&
                vehicle !== "SUV",
            )
            .map((p) => ({
              key: p.id,
              cells: [
                p.name,
                "Toyota Rav4",
                <Badge key="s">On Trip</Badge>,
                <Button key="a" href="operations/trp-99321">
                  View details
                </Button>,
              ],
            }))}
        />
      ) : (
        <RecentTrips full />
      )}
    </>
  );
}
export function Earnings() {
  const { state } = usePreview();
  const money = (n: number) => formatMoney(n, state.market);
  // Same illustrative rates as the breakdown panel: Sanga's fee comes off first (LOCK-02).
  const trips = useSampleTrips();
  const split = allocation(trips.gross, 1500, 2000);
  return (
    <>
      <Header
        title="Earning Overview"
        description="Track your fleet’s earnings, commissions and driver payouts. View performance trends and transaction breakdowns"
      />
      <PreviewBanner />
      <Stats
        items={[
          {
            label: "Total Earnings",
            value: money(split.gross),
            hint: "Gross sample fares",
            tone: "green",
          },
          {
            label: "Your Commission",
            value: money(split.fleet),
            hint: `Fleet share after ${money(split.sanga)} Sanga fee`,
            tone: "orange",
          },
          {
            label: "Driver Payouts",
            value: money(split.driver),
            hint: "Driver share after Sanga fee",
          },
          {
            label: "Completed Trips",
            value: trips.completed.toLocaleString("en-US"),
            hint: "Sample period",
          },
        ]}
      />
      <Trend large />
      <Breakdown earnings />
      <AllocationBreakdown />
      <FinanceLinks />
    </>
  );
}
