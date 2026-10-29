"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { people } from "@/lib/fleet-portal";
import {
  Asset,
  Badge,
  Button,
  DataTable,
  DemoForm,
  Dropdown,
  ExportButton,
  Field,
  Header,
  Info,
  KeyValues,
  Panel,
  Person,
  SearchField,
  Stats,
  Steps,
  Tabs,
  useNotice,
} from "./ui";
import { RowActions } from "./Directory";
import { Trend } from "./Overview";

export function Finance({ path }: { path: string }) {
  if (path === "payouts") return <Payouts />;
  if (path === "payouts/destination") return <Destination />;
  if (path === "payouts/destination/change") return <ChangeDestination />;
  if (path === "payouts/split") return <Split />;
  return <Settlement confirm={path.endsWith("confirm")} />;
}
function Payouts() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All statuses");
  const notice = useNotice();
  return (
    <>
      <Header
        title="Driver Payouts"
        description="Track driver payouts, view transaction status and manage payout history"
      >
        <Button
          onClick={() =>
            notice(
              "Payouts are not connected in this preview. No money can be moved.",
            )
          }
        >
          + Initiate driver’s Payout
        </Button>
      </Header>
      <div className="fp-filters">
        <SearchField value={search} onChange={setSearch} />
        <Dropdown
          label="Payout status"
          options={["All statuses", "Successful", "Pending", "Failed"]}
          value={status}
          onChange={setStatus}
        />
        <label className="fp-date-range">
          Payout date
          <input
            aria-label="Payout date"
            type="date"
            defaultValue="2026-09-30"
          />
        </label>
      </div>
      <Stats
        items={[
          { label: "Total Payouts", value: "₦3,425,600", tone: "green" },
          { label: "Successful", value: "₦3,200,600", tone: "green" },
          { label: "Pending", value: "₦90,400", tone: "orange" },
          { label: "Failed", value: "₦10,000", tone: "red" },
        ]}
      />
      <DataTable
        headers={[
          "Driver",
          "Payout ID",
          "Amount",
          "Period",
          "Paid on",
          "Status",
          "Action",
        ]}
        pageSize={10}
        rows={people
          .map((p, i) => ({
            key: p.id,
            status: i === 2 ? "Pending" : i === 5 ? "Failed" : "Successful",
            search: p.name,
            cells: [
              <Person key="p" index={i} />,
              ["PAY-7821", "PAY-9866", "PAY-5467"][i % 3],
              i === 2 ? "₦90,400" : "₦186,400",
              "1–12 Jan 2027",
              "14 Jan 2027",
              <Badge key="s">
                {i === 2 ? "Pending" : i === 5 ? "Failed" : "Successful"}
              </Badge>,
              <RowActions key="a" label={p.name} path="payouts/destination" />,
            ],
          }))
          .filter(
            (r) =>
              r.search.toLowerCase().includes(search.toLowerCase()) &&
              (status === "All statuses" || status === r.status),
          )}
      />
    </>
  );
}
function Destination() {
  const notice = useNotice();
  return (
    <>
      <Header
        title="Payout Destination"
        description="Manage the bank account where your fleet earnings are paid."
      >
        <Button href="payouts/destination/change">
          Change Payout Destination
        </Button>
      </Header>
      <Panel
        title="Current Payout Destination"
        action={<Badge>Verified</Badge>}
      >
        <div className="fp-bank-details">
          <div className="fp-bank-icon">▥</div>
          <strong>
            Wema Bank<small>Business Account</small>
          </strong>
          <div>
            <small>Account Name</small>Lagos Move Fleet Ltd
          </div>
          <div>
            <small>Account Number</small>0123456789
          </div>
          <div>
            <small>Last Verified</small>12 Sep 2026
          </div>
        </div>
      </Panel>
      <Info>
        Sample payout destination from the design. No bank account is connected.
      </Info>
      <Panel title="Request Payout">
        <form
          className="fp-inline-form"
          onSubmit={(e) => {
            e.preventDefault();
            notice("Payout request preview only. No money was moved.");
          }}
        >
          <input
            aria-label="Payout amount"
            type="number"
            min="1"
            placeholder="Enter Amount"
            required
          />
          <Button type="submit">Request Payout</Button>
        </form>
      </Panel>
      <DataTable
        title="Request Payout"
        paginate={false}
        headers={[
          "Date",
          "Reference",
          "Amount",
          "Bank Account",
          "Status",
          "Action",
        ]}
        rows={["Successful", "Successful", "Pending", "Failed"].map((s, i) => ({
          key: String(i),
          cells: [
            `${29 - i} Sep 2026`,
            "PAYOUT-70568890-821",
            i === 2 ? "₦90,400" : "₦186,400",
            "Wema Bank (0121)",
            <Badge key="s">{s}</Badge>,
            <RowActions key="a" label={`Payout ${i + 1}`} path="payouts" />,
          ],
        }))}
      />
    </>
  );
}
function ChangeDestination() {
  const [step, setStep] = useState(0);
  const [bank, setBank] = useState("Wema Bank");
  const [number, setNumber] = useState("0123456789");
  const [name, setName] = useState("Lagos Move Fleet Ltd");
  const [done, setDone] = useState(false);
  return (
    <>
      <Header
        title="Change Payout Destination"
        description="Enter your bank account details to receive fleet earnings"
      />
      <Steps
        labels={["Bank Details", "Verification", "Review & Confirm"]}
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
        <div className="fp-two">
          <Panel
            title={
              step === 0
                ? "Bank Account Details"
                : step === 1
                  ? "Verification preview"
                  : "Review & Confirm"
            }
          >
            {step === 0 ? (
              <>
                <Field label="Bank name" required>
                  <Dropdown
                    label="Bank name"
                    value={bank}
                    onChange={setBank}
                    options={[
                      "Wema Bank",
                      "Access Bank",
                      "GTBank",
                      "First Bank",
                    ]}
                  />
                </Field>
                <Field
                  label="Account number"
                  required
                  value={number}
                  onChange={setNumber}
                />
                <Field
                  label="Account name"
                  required
                  value={name}
                  onChange={setName}
                />
                <Field label="Account type">
                  <Dropdown
                    label="Account type"
                    options={["Business Account", "Corporate Account"]}
                  />
                </Field>
              </>
            ) : (
              <>
                <KeyValues
                  items={[
                    ["Bank", bank],
                    ["Account number", number],
                    ["Account name", name],
                    ["Account type", "Business Account"],
                  ]}
                />
                <Info>
                  Bank verification is not connected. This is a review of sample
                  details, not a verified account.
                </Info>
                {done && (
                  <p role="status" className="fp-success">
                    Preview complete. Your live payout destination has not
                    changed.
                  </p>
                )}
              </>
            )}
          </Panel>
          <Panel title="Verification Process">
            <ol className="fp-timeline">
              {[
                "Enter your bank account details",
                "We verify with your bank",
                "Review & confirm account details",
              ].map((s, i) => (
                <li key={s} className={i <= step ? "active" : ""}>
                  <span>{i + 1}</span>
                  <div>
                    <strong>{s}</strong>
                    <p className="fp-muted">
                      {i === 1
                        ? "Available when live banking services are connected"
                        : "Provide a valid business bank account"}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Panel>
        </div>
        <Info>
          Use sample details in this frontend preview. No bank verification or
          account change is submitted.
        </Info>
        <div className="fp-form-actions">
          {step > 0 ? (
            <Button secondary onClick={() => setStep(step - 1)}>
              Back
            </Button>
          ) : (
            <Button secondary href="payouts/destination">
              Cancel
            </Button>
          )}
          <Button type="submit">
            {step === 2 ? "Confirm preview" : "Continue"}
          </Button>
        </div>
      </form>
    </>
  );
}
const modes = [
  {
    title: "Platform Settlement",
    detail: "(Recommended)",
    bullets: [
      "Driver are paid directly by Sanga ride",
      "Your fleet receives service fees/commission",
      "Ideal for most fleets",
      "Lower operational overhead",
    ],
  },
  {
    title: "Fleet Direct Settlement",
    detail: "",
    bullets: [
      "Driver earnings are settled by your fleet",
      "Full control over driver payouts",
      "Required verified payout destination",
      "Best for large fleets with internal systems",
    ],
  },
];
function Settlement({ confirm }: { confirm: boolean }) {
  const [mode, setMode] = useState(0);
  const [tab, setTab] = useState("Current Mode");
  const notice = useNotice();
  return (
    <>
      <Header
        title={confirm ? "Confirm Settlement Mode Change" : "Settlement Mode"}
        description={
          confirm
            ? "Review your selection and confirm to proceed"
            : "Choose how driver earnings are settled for your fleet"
        }
      />
      {confirm ? (
        <Steps
          labels={["Review Change", "Effective Date", "Confirmation"]}
          current={2}
        />
      ) : (
        <Tabs
          active={tab}
          onChange={setTab}
          items={["Current Mode", "Permission", "Activity Log"].map(
            (label) => ({ label }),
          )}
        />
      )}{" "}
      {tab === "Permission" && !confirm ? (
        <Panel title="Settlement permissions">
          <Info>
            Only authorized fleet owners can request a settlement mode change.
            Preview controls do not grant real permissions.
          </Info>
          <label className="fp-check">
            <input type="checkbox" defaultChecked />
            Fleet owner approval required
          </label>
        </Panel>
      ) : tab === "Activity Log" && !confirm ? (
        <DataTable
          headers={["Date", "User", "Action"]}
          rows={[
            {
              key: "mode",
              cells: [
                "12 Sep 2026",
                "Samuel Eze",
                "Platform Settlement activated",
              ],
            },
          ]}
        />
      ) : (
        <>
          {!confirm && (
            <div className="fp-two">
              <Panel
                title="Current Settlement Mode"
                action={<Badge>Verified</Badge>}
              >
                <h3>
                  Platform Settlement{" "}
                  <span className="fp-muted">(Recommended)</span>
                </h3>
                <p className="fp-muted">
                  Driver earnings are automatically paid out by Sanga ride to
                  drivers, and your fleet receives the service fees/commission
                </p>
                <Info>
                  <ul>
                    {[
                      "Automatic driver payouts",
                      "Reduced financial risk",
                      "Transparent reporting",
                      "Recommended for most fleets",
                    ].map((s) => (
                      <li key={s}>✓ {s}</li>
                    ))}
                  </ul>
                </Info>
              </Panel>
              <Panel title="How it works" className="fp-soft-panel">
                <ol className="fp-timeline">
                  {[
                    "Customer pays for trips via the platform",
                    "Sanga Ride deducts service fees",
                    "Driver earnings are paid out automatically",
                    "Your fleet receives commission/fees",
                  ].map((s, i) => (
                    <li key={s} className="active">
                      <span>{i + 1}</span>
                      {s}
                    </li>
                  ))}
                </ol>
              </Panel>
            </div>
          )}
          <Panel title="Available Settlement Modes">
            <div className="fp-two fp-mode-options">
              {modes.map((m, i) => (
                <label
                  key={m.title}
                  className={`fp-mode ${mode === i ? "active" : ""}`}
                >
                  <div>
                    <strong>{m.title}</strong>
                    {confirm ? (
                      <Badge>
                        {i ? "Effective 1 Nov 2026" : "Current mode"}
                      </Badge>
                    ) : (
                      <input
                        type="radio"
                        name="settlement-mode"
                        checked={mode === i}
                        onChange={() => setMode(i)}
                      />
                    )}
                  </div>
                  <p className="fp-muted">{m.detail}</p>
                  <ul>
                    {m.bullets.map((b) => (
                      <li key={b}>✓ {b}</li>
                    ))}
                  </ul>
                </label>
              ))}
            </div>
          </Panel>
          {confirm && (
            <Panel title="Change Summary">
              <KeyValues
                items={[
                  ["New Settlement Mode", "Fleet Direct Settlement"],
                  ["Effective Date", "1 Nov 2026"],
                  [
                    "In-flight Trips",
                    "Will be settled using current mode (Platform Settlement)",
                  ],
                  [
                    "Unsettled Earnings",
                    "Will be processed using current mode. New earnings after the effective date will follow the new mode.",
                  ],
                ]}
              />
            </Panel>
          )}
          <div className="fp-info fp-info-action">
            <p>
              {confirm
                ? "Review how in-flight trips and unsettled earnings will be handled. This frontend preview cannot change live settlement terms."
                : "You can request to change your settlement mode. Changes are subject to review and may have effective date restrictions."}
            </p>
            {confirm ? (
              <>
                <Button secondary href="payouts/settlement">
                  Cancel
                </Button>
                <Button
                  onClick={() =>
                    notice(
                      "Settlement change preview recorded. No live settlement setting or agreement was changed.",
                    )
                  }
                >
                  Confirm Change
                </Button>
              </>
            ) : (
              <Button href="payouts/settlement/confirm">Request Change</Button>
            )}
          </div>
        </>
      )}
    </>
  );
}
function Split() {
  const [share, setShare] = useState(20);
  const [saved, setSaved] = useState(20);
  const [when, setWhen] = useState("now");
  return (
    <>
      <Header
        title="Default Split"
        description="Set the default earnings split for all drivers in your fleet"
      />
      <Info>
        The split applies to all drivers without a custom override. You can set
        per-driver splits if needed.
      </Info>
      <Panel title="Current Default Split" action={<Badge>Active</Badge>}>
        <div className="fp-two">
          <Panel title="Fleet Share">
            <p className="fp-big-number">{saved}%</p>
            <p className="fp-muted">Goes to your fleet account</p>
          </Panel>
          <Panel title="Driver Share">
            <p className="fp-big-number">{100 - saved}%</p>
            <p className="fp-muted">Goes to driver payout</p>
          </Panel>
        </div>
        <p className="fp-muted">
          Applies to <strong>156 drivers</strong>
        </p>
      </Panel>
      <Panel title="Update Default Split">
        <DemoForm onSave={() => setSaved(share)} button="Confirm Change">
          <div className="fp-two">
            <Field
              label="Fleet Share (%)"
              type="number"
              value={String(share)}
              onChange={(v) => setShare(Math.min(100, Math.max(0, Number(v))))}
            />
            <Field
              label="Driver Share (%)"
              type="number"
              value={String(100 - share)}
              onChange={(v) =>
                setShare(100 - Math.min(100, Math.max(0, Number(v))))
              }
            />
          </div>
          <input
            className="fp-range"
            aria-label="Fleet share percentage"
            type="range"
            min="0"
            max="100"
            value={share}
            onChange={(e) => setShare(Number(e.target.value))}
          />
          <small>Total must equal 100%</small>
          <Info>
            This change will apply to all new earnings from the effective date.
            It will not affect completed trips or existing earnings.
          </Info>
          <h3>Effective Date</h3>
          <div className="fp-radio-row">
            <label>
              <input
                type="radio"
                name="effective"
                checked={when === "now"}
                onChange={() => setWhen("now")}
              />
              Apply immediately
            </label>
            <label>
              <input
                type="radio"
                name="effective"
                checked={when === "later"}
                onChange={() => setWhen("later")}
              />
              Schedule for later
            </label>
          </div>
          {when === "later" && (
            <Field label="Effective date" type="date" required />
          )}
        </DemoForm>
      </Panel>
    </>
  );
}

export function Reports({ path }: { path: string }) {
  const [type, setType] = useState("Earning report");
  const [group, setGroup] = useState("Daily");
  const [tab, setTab] = useState("Earning by day");
  const [search, setSearch] = useState("");
  const [generated, setGenerated] = useState(false);
  const notice = useNotice();
  const exportRows = [
    ["Driver", "Trips", "Earnings"],
    ...people.map((p) => [p.name, p.trips, 142500]),
  ];
  if (path === "reports")
    return (
      <>
        <Header
          title="Generate Report"
          description="Create and export detailed reports about your fleet operations and payouts"
        />
        <div className="fp-report-types">
          {[
            "Earning report",
            "Trip Report",
            "Driver Report",
            "Vehicle report",
            "Payout Report",
          ].map((t, i) => (
            <button
              key={t}
              aria-pressed={type === t}
              className={type === t ? "active" : ""}
              onClick={() => setType(t)}
            >
              <AssetForReport i={i} />
              <strong>{t}</strong>
              <small>
                {
                  [
                    "Fleet earnings, driver splits and other deductions",
                    "Complete, cancelled and ongoing trips",
                    "Driver activity and performance",
                    "Vehicle usage and maintenance",
                    "Settlements and payout transactions",
                  ][i]
                }
              </small>
            </button>
          ))}
        </div>
        <Panel>
          <div className="fp-three">
            <Field label="Date Range" type="date" defaultValue="2026-09-01" />
            <Field label="Group by">
              <Dropdown
                label="Report grouping"
                options={["Daily", "Weekly", "Monthly"]}
                value={group}
                onChange={setGroup}
              />
            </Field>
            <Field label="Data Format">
              <Dropdown label="Data format" options={["CSV (Excel)"]} />
            </Field>
          </div>
          <h3>Additional filters</h3>
          <div className="fp-filters">
            <Dropdown
              label="Report drivers"
              options={["All drivers", ...people.map((p) => p.name)]}
            />
            <Dropdown
              label="Report vehicles"
              options={["All Vehicles", "Toyota Rav4", "Toyota Corolla"]}
            />
            <Dropdown
              label="Trip types"
              options={["All trip types", "Standard Ride", "Airport Ride"]}
            />
            <Dropdown
              label="Payment methods"
              options={["All payment methods", "Card", "Cash"]}
            />
          </div>
          <div className="fp-form-actions">
            <Button
              onClick={() => {
                setGenerated(true);
                notice(`${type} generated from sample data only.`);
              }}
            >
              <Download size={16} />
              Generate report
            </Button>
          </div>
        </Panel>
        <DataTable
          title="Recent Exports"
          paginate={false}
          headers={[
            "Report type",
            "Data range",
            "Format",
            "Status",
            "Requested at",
            "Download",
          ]}
          rows={[
            ...(generated ? [type] : []),
            "Earning report",
            "Trip report",
            "Driver report",
            "Trip report",
          ].map((t, i) => ({
            key: `${t}-${i}`,
            cells: [
              t,
              "1–30 Sep 2026",
              "CSV",
              <Badge key="s">
                {generated && i === 0
                  ? "Ready"
                  : ["Ready", "Processing", "Failed", "Processing"][i % 4]}
              </Badge>,
              "30 Sep 2026, 11:02 AM",
              <ExportButton
                key="d"
                rows={exportRows}
                name="sanga-sample-report"
              />,
            ],
          }))}
        />
      </>
    );
  return (
    <>
      <Header
        title={
          path.endsWith("performance")
            ? "Driver performance report"
            : "Earnings report"
        }
        description={
          path.endsWith("performance")
            ? "Analyze driver’s activities, earnings and key performance metrics"
            : "View detailed earning and commissions and payout for your fleet"
        }
      >
        <ExportButton rows={exportRows} />
      </Header>
      <Stats
        items={(path.endsWith("performance")
          ? [
              ["Active drivers", "48"],
              ["Total Trips", "1842"],
              ["Completed Trips", "1,712"],
              ["Cancelled Trips", "130"],
            ]
          : [
              ["Total Earnings", "₦3,425,600"],
              ["Fleet Commission", "₦342,560"],
              ["Driver Payout", "₦2,980,400"],
              ["Completed Trips", "1842"],
            ]
        ).map(([label, value]) => ({
          label,
          value,
          hint: "vs previous month",
        }))}
      />
      {path.endsWith("performance") ? (
        <>
          <div className="fp-filters">
            <SearchField value={search} onChange={setSearch} />
          </div>
          <DataTable
            headers={[
              "Driver",
              "Trips",
              "Completed",
              "Completion rate",
              "Earnings",
              "Rating",
              "Status",
            ]}
            rows={people
              .filter((p) =>
                p.name.toLowerCase().includes(search.toLowerCase()),
              )
              .map((p, i) => ({
                key: p.id,
                cells: [
                  <Person key="p" index={i} />,
                  "245",
                  "238",
                  "98%",
                  "₦486,200",
                  "4.8 ★",
                  <Badge key="s">{p.status}</Badge>,
                ],
              }))}
          />
        </>
      ) : (
        <>
          <Tabs
            active={tab}
            onChange={setTab}
            items={[
              "Earning by day",
              "By driver",
              "By Vehicle",
              "By service type",
              "By location",
            ].map((label) => ({ label }))}
          />
          <Trend large report />
          <DataTable
            title={`${tab === "Earning by day" ? "Daily" : tab} Earnings Breakdown`}
            headers={[
              tab === "Earning by day" ? "Date" : tab.replace("By ", ""),
              "Trips",
              "Gross earning",
              "Commission",
              "Driver payout",
              "Adjustment",
              "Net earning",
            ]}
            rows={people.map((p, i) => ({
              key: p.id,
              cells: [
                tab === "By driver"
                  ? p.name
                  : tab === "By Vehicle"
                    ? "Toyota Rav4"
                    : tab === "By location"
                      ? "Ikeja"
                      : tab === "By service type"
                        ? "Standard Ride"
                        : `${i + 1} Sep 2026`,
                52 - i,
                "₦98,000",
                "₦9,840",
                "₦86,000",
                "₦0",
                "₦86,000",
              ],
            }))}
          />
        </>
      )}
    </>
  );
}
function AssetForReport({ i }: { i: number }) {
  return (
    <span className="fp-report-icon">
      <Asset
        screen="922:17367"
        name={
          ["imgGroup1", "imgGroup2", "imgGroup3", "imgGroup4", "imgGroup5"][i]
        }
        width={24}
        height={24}
      />
    </span>
  );
}
