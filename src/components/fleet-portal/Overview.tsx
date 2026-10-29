"use client";
import Link from "next/link";
import { useState } from "react";
import { ChevronRight, LocateFixed, Minus, Plus } from "lucide-react";
import { people, portalUrl } from "@/lib/fleet-portal";
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
          {["₦400k", "₦300k", "₦200k", "₦100k", "0"].map((t) => (
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
export function Breakdown({ earnings = false }: { earnings?: boolean }) {
  return (
    <Panel title={earnings ? "Earnings Breakdown" : "Earnings Trend"}>
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
            <strong>{earnings ? "₦3.4M" : "1,842"}</strong>
            <small>{earnings ? "Total Earnings" : "Total trips"}</small>
          </span>
        </div>
        <ul className="fp-legend">
          {(earnings
            ? [
                ["Standard Ride", "₦1,940,200", "83%"],
                ["Airport Ride", "₦684,120", "10%"],
                ["Deliveries", "₦410,880", "5%"],
                ["Scheduled Rides", "₦116,800", "8%"],
              ]
            : [
                ["Completed", "1,520", "83%"],
                ["In progress", "180", "10%"],
                ["Cancelled", "92", "5%"],
                ["No show", "50", "8%"],
              ]
          ).map(([name, n, p], i) => (
            <li key={name}>
              <i
                style={{
                  background: ["#00b578", "#006cff", "#ff122d", "#c8b8c6"][i],
                }}
              />
              <span>{name}</span>
              <small>
                {n} ({p})
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
      title={full ? "Active Trips (42)" : "Earnings Trend"}
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
  return (
    <>
      <Header
        title="Lagos Move Fleet"
        eyebrow="Welcome back,"
        description="Here’s what is happening with your fleet today"
      />
      <Stats
        items={[
          { label: "Active Drivers", value: "150", hint: "Out of 200 drivers" },
          {
            label: "Active Vehicles",
            value: "148",
            hint: "Out of 200 vehicles",
          },
          { label: "Total trips", value: "150", hint: "Out of 200 trips" },
          {
            label: "Active Drivers",
            value: "150",
            hint: "Out of 200 drivers",
            tone: "green",
          },
        ]}
      />
      <div className="fp-two fp-chart-grid">
        <Trend />
        <Breakdown />
      </div>
      <div className="fp-two fp-dashboard-bottom">
        <RecentTrips />
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
              ["Driver’s online", "152", "drivers", "imgGroup"],
              ["Driver’s offline", "48", "drivers", "imgGroup1"],
              ["Vehicles active", "152", "vehicles", "imgGroup1000003124"],
              [
                "Vehicles due for service",
                "152",
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
export function Operations() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [vehicle, setVehicle] = useState("All vehicle types");
  const [zone, setZone] = useState("All zones");
  return (
    <>
      <Header
        title="Fleet Operations"
        description="Monitor your fleet in real time. Track active drivers, vehicle locations and ongoing trips"
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
  return (
    <>
      <Header
        title="Earning Overview"
        description="Track your fleet’s earnings, commissions and driver payouts. View performance trends and transaction breakdowns"
      />
      <Stats
        items={[
          {
            label: "Total Earnings",
            value: "₦3,425,600",
            hint: "vs. previous month",
            tone: "green",
          },
          {
            label: "Your Commission",
            value: "₦342,560",
            hint: "vs. previous month",
            tone: "orange",
          },
          {
            label: "Driver Payouts",
            value: "₦2,980,400",
            hint: "vs. previous month",
          },
          {
            label: "Completed Trips",
            value: "1,842",
            hint: "vs. previous month",
          },
        ]}
      />
      <Trend large />
      <Breakdown earnings />
    </>
  );
}
