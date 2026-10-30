"use client";

import { useState, type FormEvent } from "react";
import { Download } from "lucide-react";
import { people, portalUrl } from "@/lib/fleet-portal";
import {
  Asset,
  Badge,
  Button,
  DataTable,
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
import Link from "next/link";
import { RowActions, fixturePerson, perTrip, samplePlaces } from "./Directory";
import { Trend } from "./Overview";
import {
  allocation,
  formatMoney,
  marketConfig,
} from "@/lib/fleet-preview-domain";
import { AllocationBreakdown, FinanceLinks } from "./FinanceWorkflows";
import { usePreview } from "./PreviewProvider";
import { PreviewBanner } from "./WorkflowUI";

export function Finance({ path }: { path: string }) {
  if (path === "payouts") return <Payouts />;
  if (path === "payouts/destination") return <Destination />;
  if (path.startsWith("payouts/destination/")) return <ChangeDestination />;
  if (path.startsWith("payouts/split")) return <Split />;
  return <Settlement confirm={path !== "payouts/settlement"} />;
}
/** Illustrative per-driver payout amounts, in minor units of each market's currency. */
const samplePayout = {
  NG: { paid: 18_640_000, pending: 9_040_000 },
  US: { paid: 248_000, pending: 120_500 },
} as const;
const payoutStatus = (i: number) =>
  i === 2 ? "Pending" : i === 5 ? "Failed" : "Successful";
function Payouts() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All statuses");
  const notice = useNotice();
  const { state } = usePreview();
  const money = (n: number) => formatMoney(n, state.market);
  const amounts = samplePayout[state.market];
  const amount = (i: number) =>
    payoutStatus(i) === "Pending" ? amounts.pending : amounts.paid;
  // Seven sample payouts spread across the selected market's drivers.
  const payees = state.records.drivers
    .filter((d) => d.market === state.market)
    .flatMap((d) => {
      const person = fixturePerson(d.name);
      return person ? [person] : [];
    });
  const payouts = payees.length
    ? Array.from({ length: 7 }, (_, i) => ({ i, payee: payees[i % payees.length] }))
    : [];
  const total = (s?: string) =>
    payouts.reduce(
      (sum, { i }) => (!s || payoutStatus(i) === s ? sum + amount(i) : sum),
      0,
    );
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
      <PreviewBanner />
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
          { label: "Total Payouts", value: money(total()), tone: "green" },
          {
            label: "Successful",
            value: money(total("Successful")),
            tone: "green",
          },
          { label: "Pending", value: money(total("Pending")), tone: "orange" },
          { label: "Failed", value: money(total("Failed")), tone: "red" },
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
        rows={payouts
          .map(({ i, payee }) => ({
            key: String(i),
            status: payoutStatus(i),
            search: payee.name,
            cells: [
              <Person key="p" index={payee.index} />,
              `PAY-${7821 + i * 211}`,
              money(amount(i)),
              `${1 + i}–${12 + i} Oct 2026`,
              payoutStatus(i) === "Successful" ? `${14 + i} Oct 2026` : "—",
              <Badge key="s">{payoutStatus(i)}</Badge>,
              <RowActions
                key="a"
                label={payee.name}
                path="payouts/destination"
              />,
            ],
          }))
          .filter(
            (r) =>
              r.search.toLowerCase().includes(search.toLowerCase()) &&
              (status === "All statuses" || status === r.status),
          )}
      />
      <AllocationBreakdown />
      <FinanceLinks />
    </>
  );
}
function Destination() {
  const notice = useNotice();
  const { state } = usePreview();
  const amounts = samplePayout[state.market];
  // Masked per spec F04-05; no real bank account is connected in the preview.
  const bank = state.market === "NG" ? "Wema Bank" : "Sample US bank";
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
        action={<Badge>Sample · not connected</Badge>}
      >
        <div className="fp-bank-details">
          <div className="fp-bank-icon">▥</div>
          <strong>
            {bank}
            <small>Business Account · {marketConfig[state.market].currency}</small>
          </strong>
          <div>
            <small>Account Name</small>Lagos Move Fleet Ltd
          </div>
          <div>
            <small>Account Number</small>•••• 6789
          </div>
          <div>
            <small>Last Verified</small>Not verified
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
        title="Recent payouts"
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
            formatMoney(i === 2 ? amounts.pending : amounts.paid, state.market),
            `${bank} (•••• 6789)`,
            <Badge key="s">{s}</Badge>,
            <RowActions key="a" label={`Payout ${i + 1}`} path="payouts" />,
          ],
        }))}
      />
    </>
  );
}
const today = () => new Date().toISOString().slice(0, 10);
const stepUpNote = "Unavailable — live identity service required";

/** Pending finance requests of one type for the selected market, linked to their records. */
function RequestList({ type }: { type: string }) {
  const { state } = usePreview();
  const requests = state.records.requests.filter(
    (r) => r.market === state.market && r.fields.type === type,
  );
  return (
    <Panel title="Requests">
      {requests.length ? (
        <ul className="fp-request-list">
          {requests.map((r) => (
            <li key={r.id}>
              <Link
                className="fp-text-link"
                href={portalUrl(`payouts/requests/${r.id}`)}
              >
                {r.id.toUpperCase()}
              </Link>{" "}
              <Badge>{r.status}</Badge>{" "}
              <small className="fp-muted">
                Effective {r.fields.effective ?? "—"}
              </small>
            </li>
          ))}
        </ul>
      ) : (
        <p className="fp-muted">No requests in this market yet.</p>
      )}
    </Panel>
  );
}

/** Shown after a request is created: it is pending review, never applied. */
function RequestSubmitted({ id, what }: { id: string; what: string }) {
  return (
    <Panel title="Request submitted for review">
      <p role="status" className="fp-success">
        Reference {id.toUpperCase()}. Your current {what} is unchanged until the
        request is approved and its effective date arrives.
      </p>
      <div className="fp-work-actions">
        <Button href={`payouts/requests/${id}`}>View request</Button>
        <Button secondary href="payouts">
          Back to payouts
        </Button>
      </div>
    </Panel>
  );
}

/** Reason, future effective date and step-up acknowledgement shared by finance requests. */
function RequestTerms({
  effective,
  setEffective,
  reason,
  setReason,
  stepUp,
  setStepUp,
}: {
  effective: string;
  setEffective: (v: string) => void;
  reason: string;
  setReason: (v: string) => void;
  stepUp: boolean;
  setStepUp: (v: boolean) => void;
}) {
  return (
    <>
      <Field
        label="Requested effective date (future)"
        type="date"
        required
        value={effective}
        onChange={setEffective}
      />
      <label className="fp-field">
        Reason
        <textarea
          required
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </label>
      <label className="fp-check">
        <input
          type="checkbox"
          checked={stepUp}
          onChange={(e) => setStepUp(e.target.checked)}
        />
        I understand a live step-up check and Sanga approval are required
        before any real change
      </label>
    </>
  );
}

const destinationBanks = {
  NG: ["Wema Bank", "Access Bank", "GTBank", "First Bank"],
  US: ["Sample US bank", "Sample credit union"],
} as const;

/** F04-06 on the FLT 37 layout. Creates a pending destination request; nothing is verified or moved. */
function ChangeDestination() {
  const { state, execute } = usePreview();
  const banks = destinationBanks[state.market];
  const [step, setStep] = useState(0);
  const [bank, setBank] = useState<string>(banks[0]);
  const [number, setNumber] = useState("");
  const [name, setName] = useState("Lagos Move Fleet Ltd");
  const [accountType, setAccountType] = useState("Business Account");
  const [effective, setEffective] = useState("");
  const [reason, setReason] = useState("");
  const [stepUp, setStepUp] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState("");
  const masked = `•••• ${number.slice(-4)}`;
  function next(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (step === 0) {
      const valid =
        state.market === "NG"
          ? /^\d{10}$/.test(number)
          : /^\d{4,17}$/.test(number);
      if (!valid)
        return setError(
          state.market === "NG"
            ? "Enter a 10-digit NUBAN account number."
            : "Enter an account number of 4 to 17 digits.",
        );
      return setStep(1);
    }
    if (step === 1) {
      if (!effective || effective <= today())
        return setError("Choose a future effective date.");
      if (!stepUp)
        return setError("Acknowledge the step-up and approval requirement.");
      return setStep(2);
    }
    // Only the masked account is kept; the full number never enters the preview store.
    const result = execute({
      kind: "create",
      collection: "requests",
      name: "destination request",
      fields: {
        type: "destination",
        destination: `${bank} · ${masked}`,
        accountType,
        verification: "Pending verification",
        effective,
        reason,
        currency: marketConfig[state.market].currency,
        stepUp: stepUpNote,
      },
    });
    if (!result.ok) return setError(result.error);
    setCreated(result.id);
  }
  return (
    <>
      <Header
        title="Change Payout Destination"
        description="Enter your bank account details to receive fleet earnings"
        back={{ label: "Back to Payout Destination", path: "payouts/destination" }}
      />
      <PreviewBanner />
      {created ? (
        <RequestSubmitted id={created} what="payout destination" />
      ) : (
        <>
          <Steps
            labels={["Bank Details", "Verification", "Review & Confirm"]}
            current={step}
          />
          <form className="fp-form" onSubmit={next}>
            <div className="fp-two">
              <Panel
                title={
                  ["Bank Account Details", "Verification", "Review & Confirm"][
                    step
                  ]
                }
              >
                {step === 0 ? (
                  <>
                    <Field label="Bank name" required>
                      <Dropdown
                        label="Bank name"
                        value={bank}
                        onChange={setBank}
                        options={[...banks]}
                      />
                    </Field>
                    <Field
                      label="Account number"
                      required
                      placeholder={
                        state.market === "NG" ? "10-digit NUBAN" : "Account number"
                      }
                      value={number}
                      onChange={(v) => setNumber(v.replace(/\D/g, ""))}
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
                        value={accountType}
                        onChange={setAccountType}
                        options={["Business Account", "Corporate Account"]}
                      />
                    </Field>
                  </>
                ) : step === 1 ? (
                  <>
                    <KeyValues
                      items={[
                        ["Bank", bank],
                        ["Account number", masked],
                        ["Account name", name],
                        ["Verification", <Badge key="v">Pending verification</Badge>],
                      ]}
                    />
                    <Info>
                      Bank verification is not connected. The request stays
                      pending verification; the account name is not confirmed.
                    </Info>
                    <RequestTerms
                      {...{ effective, setEffective, reason, setReason, stepUp, setStepUp }}
                    />
                  </>
                ) : (
                  <KeyValues
                    items={[
                      ["Bank", bank],
                      ["Account number", masked],
                      ["Account name", name],
                      ["Account type", accountType],
                      ["Currency", marketConfig[state.market].currency],
                      ["Effective date", effective],
                      ["Reason", reason],
                      ["Step-up", stepUpNote],
                    ]}
                  />
                )}
              </Panel>
              <div className="fp-stack">
                <Panel title="Verification Process">
                  <ol className="fp-timeline">
                    {[
                      ["Enter your bank account details", "Provide a business account in the fleet's registered name"],
                      ["We verify with your bank", "Account name and ownership checks, once banking services are connected"],
                      ["Review & confirm account details", "Sanga reviews and approves before the effective date"],
                    ].map(([s, d], i) => (
                      <li key={s} className={i <= step ? "active" : ""}>
                        <span>{i + 1}</span>
                        <div>
                          <strong>{s}</strong>
                          <p className="fp-muted">{d}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </Panel>
                <Panel title="Important Information">
                  <ul className="fp-plain-list">
                    <li>The account must belong to your registered business.</li>
                    <li>Payouts already in progress continue to the current destination.</li>
                    <li>The change applies only after verification and approval, from the effective date.</li>
                  </ul>
                </Panel>
              </div>
            </div>
            {error && (
              <p role="alert" className="fp-error">
                {error}
              </p>
            )}
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
                {step === 2 ? "Submit request" : "Continue"}
              </Button>
            </div>
          </form>
        </>
      )}
    </>
  );
}

const modes = [
  {
    key: "Sanga-managed / platform",
    title: "Platform Settlement",
    detail: "(Recommended)",
    bullets: [
      "Drivers are paid by Sanga or its payment partners",
      "Your fleet receives its share after Sanga's commission",
      "Ideal for most fleets",
      "Lower operational overhead",
    ],
  },
  {
    key: "Fleet-managed / direct",
    title: "Fleet Direct Settlement",
    detail: "",
    bullets: [
      "Your fleet remits driver earnings under an approved agreement",
      "Sanga's commission is still deducted first",
      "Requires a verified payout destination",
      "Best for large fleets with internal systems",
    ],
  },
];
// Sample snapshot: every sample trip was captured under platform settlement, version 1.
const currentMode = modes[0];

/** F04-07/F04-08 on the FLT 38/40 layouts. Mode changes are reviewed, future-dated requests. */
function Settlement({ confirm }: { confirm: boolean }) {
  const { state, execute } = usePreview();
  const [tab, setTab] = useState("Current Mode");
  const [mode, setMode] = useState(modes[1].key);
  const [effective, setEffective] = useState("");
  const [reason, setReason] = useState("");
  const [stepUp, setStepUp] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState("");
  const requested = modes.find((m) => m.key === mode) ?? modes[1];
  const activity = state.audit.filter(
    (e) =>
      e.market === state.market &&
      e.fields.collection === "requests" &&
      e.name.toLowerCase().includes("settlement"),
  );
  function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (mode === currentMode.key)
      return setError("Choose a mode different from the current one.");
    if (!effective || effective <= today())
      return setError("Choose a future effective date.");
    if (!stepUp)
      return setError("Acknowledge the step-up and approval requirement.");
    const result = execute({
      kind: "create",
      collection: "requests",
      name: "settlement request",
      fields: {
        type: "settlement",
        mode,
        effective,
        reason,
        currency: marketConfig[state.market].currency,
        stepUp: stepUpNote,
      },
    });
    if (!result.ok) return setError(result.error);
    setCreated(result.id);
  }
  const modeCard = (m: (typeof modes)[number], badge: string) => (
    <div key={m.key} className="fp-mode active">
      <div>
        <strong>{m.title}</strong>
        <Badge>{badge}</Badge>
      </div>
      <p className="fp-muted">{m.detail}</p>
      <ul>
        {m.bullets.map((b) => (
          <li key={b}>✓ {b}</li>
        ))}
      </ul>
    </div>
  );
  if (confirm)
    return (
      <>
        <Header
          title="Confirm Settlement Mode Change"
          description="Review your selection and submit it for review"
          back={{ label: "Back to Settlement Mode", path: "payouts/settlement" }}
        />
        <PreviewBanner />
        {created ? (
          <RequestSubmitted id={created} what="settlement mode" />
        ) : (
          <form className="fp-form" onSubmit={submit}>
            <Steps
              labels={["Review Change", "Effective Date", "Confirmation"]}
              current={effective ? (stepUp ? 2 : 1) : 0}
            />
            <Panel title="Requested change">
              <div className="fp-two fp-mode-options">
                {modeCard(currentMode, "Current mode")}
                {modeCard(
                  requested,
                  effective ? `Requested from ${effective}` : "Requested",
                )}
              </div>
              <Field label="New settlement mode" required>
                <Dropdown
                  label="New settlement mode"
                  value={mode}
                  onChange={setMode}
                  options={modes.map((m) => m.key)}
                />
              </Field>
              <RequestTerms
                {...{ effective, setEffective, reason, setReason, stepUp, setStepUp }}
              />
            </Panel>
            <Panel title="Change Summary">
              <KeyValues
                items={[
                  ["Current mode", currentMode.title],
                  ["Requested mode", requested.title],
                  ["Effective date", effective || "Not chosen"],
                  [
                    "In-flight trips",
                    `Settled under the mode captured when they started (${currentMode.title}).`,
                  ],
                  [
                    "Unsettled earnings",
                    "Processed under the current mode. Earnings after the effective date follow the new mode.",
                  ],
                  ["Sanga commission", "Deducted first in both modes."],
                ]}
              />
            </Panel>
            {error && (
              <p role="alert" className="fp-error">
                {error}
              </p>
            )}
            <div className="fp-form-actions">
              <Button secondary href="payouts/settlement">
                Cancel
              </Button>
              <Button type="submit">Submit request</Button>
            </div>
          </form>
        )}
      </>
    );
  return (
    <>
      <Header
        title="Settlement Mode"
        description="Choose how driver earnings are settled for your fleet"
      />
      <PreviewBanner />
      <Tabs
        active={tab}
        onChange={setTab}
        items={["Current Mode", "Permission", "Activity Log"].map((label) => ({
          label,
        }))}
      />
      {tab === "Permission" ? (
        <Panel title="Settlement permissions">
          <Info>
            Only fleet owners can request a settlement mode change, and Sanga
            must approve it. Preview roles do not grant real permissions.
          </Info>
          <KeyValues
            items={[
              ["Your preview role", state.role],
              [
                "Can request a change",
                state.role === "Owner" ? "Yes (preview)" : "No",
              ],
            ]}
          />
        </Panel>
      ) : tab === "Activity Log" ? (
        activity.length ? (
          <DataTable
            headers={["Event", "Change", "Reason"]}
            rows={activity.map((e) => ({
              key: e.id,
              cells: [e.id, <Badge key="s">{e.status}</Badge>, e.fields.reason ?? "—"],
            }))}
          />
        ) : (
          <Panel title="No activity yet">
            <p className="fp-muted">
              Settlement requests made in this preview appear here.
            </p>
          </Panel>
        )
      ) : (
        <>
          <div className="fp-two">
            <Panel
              title="Current Settlement Mode"
              action={<Badge>Sample · version 1</Badge>}
            >
              <h3>
                {currentMode.title}{" "}
                <span className="fp-muted">{currentMode.detail}</span>
              </h3>
              <p className="fp-muted">
                Sanga deducts its commission first. Driver earnings are paid by
                Sanga or its payment partners, and your fleet receives its share
                of the remaining net.
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
                  "Rider pays for the trip",
                  "Sanga deducts its commission first",
                  "Driver share is paid out by Sanga or its partners",
                  "Your fleet receives its share of the net",
                ].map((s, i) => (
                  <li key={s} className="active">
                    <span>{i + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>
            </Panel>
          </div>
          <Panel title="Available Settlement Modes">
            <div className="fp-two fp-mode-options">
              {modes.map((m) =>
                modeCard(m, m === currentMode ? "Current mode" : "Available on request"),
              )}
            </div>
          </Panel>
          <RequestList type="settlement" />
          <div className="fp-info fp-info-action">
            <p>
              You can request a settlement mode change. Requests are reviewed and
              take effect only from a future date; existing trips keep their
              original terms.
            </p>
            <Button href="payouts/settlement/review">Request Change</Button>
          </div>
        </>
      )}
    </>
  );
}

/** F04-10/F04-11 on the FLT 42 layout. Split changes are future-dated requests, never immediate. */
function Split() {
  const { state, execute } = usePreview();
  const [share, setShare] = useState(20);
  const [effective, setEffective] = useState("");
  const [reason, setReason] = useState("");
  const [stepUp, setStepUp] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState("");
  const drivers = state.records.drivers.filter(
    (d) => d.market === state.market,
  ).length;
  const clamp = (v: string) => Math.min(100, Math.max(0, Number(v) || 0));
  function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!effective || effective <= today())
      return setError(
        "Choose a future date. Existing trips keep their original split.",
      );
    if (!stepUp)
      return setError("Acknowledge the step-up and approval requirement.");
    const result = execute({
      kind: "create",
      collection: "requests",
      name: "split request",
      fields: {
        type: "split",
        fleet: String(share),
        driver: String(100 - share),
        effective,
        reason,
        currency: marketConfig[state.market].currency,
        stepUp: stepUpNote,
      },
    });
    if (!result.ok) return setError(result.error);
    setCreated(result.id);
  }
  return (
    <>
      <Header
        title="Default Split"
        description="Set the default earnings split for all drivers in your fleet"
      />
      <PreviewBanner />
      <Info>
        The split applies to the net after Sanga&apos;s commission, for drivers
        without a custom override. Per-driver overrides are unavailable until
        approved (D-08).
      </Info>
      <Panel
        title="Current Default Split"
        action={<Badge>Sample · version 1</Badge>}
      >
        <div className="fp-two">
          <Panel title="Fleet Share">
            <p className="fp-big-number">20%</p>
            <p className="fp-muted">Of the post-Sanga net, to your fleet</p>
          </Panel>
          <Panel title="Driver Share">
            <p className="fp-big-number">80%</p>
            <p className="fp-muted">Of the post-Sanga net, to the driver</p>
          </Panel>
        </div>
        <p className="fp-muted">
          Applies to <strong>{drivers} sample drivers</strong> · Illustrative
          only, no commercial split is approved
        </p>
      </Panel>
      {created ? (
        <RequestSubmitted id={created} what="default split" />
      ) : (
        <Panel title="Update Default Split">
          <form className="fp-form" onSubmit={submit}>
            <div className="fp-two">
              <Field
                label="Fleet Share (%)"
                type="number"
                value={String(share)}
                onChange={(v) => setShare(clamp(v))}
              />
              <Field
                label="Driver Share (%)"
                type="number"
                value={String(100 - share)}
                onChange={(v) => setShare(100 - clamp(v))}
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
            <small>Total must equal 100% · currently {share + (100 - share)}%</small>
            <Info>
              This change applies to new earnings from the effective date. It
              does not affect completed trips, trips in progress or existing
              earnings.
            </Info>
            <RequestTerms
              {...{ effective, setEffective, reason, setReason, stepUp, setStepUp }}
            />
            {error && (
              <p role="alert" className="fp-error">
                {error}
              </p>
            )}
            <div className="fp-form-actions">
              <Button secondary href="payouts">
                Cancel
              </Button>
              <Button type="submit">Submit request</Button>
            </div>
          </form>
        </Panel>
      )}
      <RequestList type="split" />
      <AllocationBreakdown />
    </>
  );
}
export function Reports({ path }: { path: string }) {
  const [type, setType] = useState("Earning report");
  const [group, setGroup] = useState("Daily");
  const [tab, setTab] = useState("Earning by day");
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("2026-10-01");
  const notice = useNotice();
  const { state, execute } = usePreview();
  const money = (n: number) => formatMoney(n, state.market);
  const currency = marketConfig[state.market].currency;
  const drivers = state.records.drivers
    .filter((d) => d.market === state.market)
    .map((d) => ({ record: d, person: fixturePerson(d.name) }))
    .flatMap(({ record, person }) => (person ? [{ record, person }] : []));
  const vehicleNames = state.records.vehicles
    .filter((v) => v.market === state.market)
    .map((v) => v.name);
  const exportRows = [
    ["Driver", "Trips", `Earnings (${currency} minor units)`],
    ...drivers.map(({ person }) => [
      person.name,
      person.trips,
      person.trips * perTrip[state.market],
    ]),
  ];
  if (path === "reports")
    return (
      <>
        <Header
          title="Generate Report"
          description="Create and export detailed reports about your fleet operations and payouts"
        />
        <PreviewBanner />
        <div className="fp-work-links">
          {[
            ["Trip report", "reports/trips"],
            ["Vehicle report", "reports/vehicles"],
            ["Payout / reconciliation", "reports/reconciliation"],
            ["Download history", "reports/history"],
          ].map(([label, href]) => (
            <Link key={href} href={portalUrl(href)}>
              {label} →
            </Link>
          ))}
        </div>
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
            <Field
              label="Date Range"
              type="date"
              value={from}
              onChange={setFrom}
            />
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
              options={[
                "All drivers",
                ...drivers.map(({ record }) => record.name),
              ]}
            />
            <Dropdown
              label="Report vehicles"
              options={["All Vehicles", ...vehicleNames]}
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
                // Report jobs are asynchronous (F07-R08): a new job starts queued, never ready.
                const result = execute({
                  kind: "create",
                  collection: "reports",
                  name: type,
                  fields: {
                    type: type.toLowerCase(),
                    currency,
                    from,
                    to: "2026-10-30",
                    group,
                  },
                });
                notice(
                  result.ok
                    ? `${type} queued in this preview. Open the job to follow its status.`
                    : result.error,
                );
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
            "Currency",
            "Download",
          ]}
          rows={state.records.reports
            .filter((r) => r.market === state.market)
            .map((r) => ({
              key: r.id,
              cells: [
                r.name,
                `${r.fields.from ?? "—"} – ${r.fields.to ?? "—"}`,
                "CSV",
                <Badge key="s">{r.status}</Badge>,
                r.fields.currency ?? currency,
                r.status === "ready" ? (
                  <ExportButton
                    key="d"
                    rows={exportRows}
                    name="sanga-sample-report"
                  />
                ) : (
                  <Link
                    key="d"
                    className="fp-text-link"
                    href={portalUrl(`reports/jobs/${r.id}`)}
                  >
                    View job
                  </Link>
                ),
              ],
            }))}
        />
      </>
    );
  // Illustrative, internally consistent figures: Sanga's fee comes off each row first (LOCK-02).
  const dailyRows = people.map((_, i) => {
    const trips = 52 - i;
    return { trips, split: allocation(trips * perTrip[state.market], 1500, 2000) };
  });
  const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);
  // Totals are the sum of the rows so the report reconciles exactly.
  const total = {
    gross: sum(dailyRows.map((r) => r.split.gross)),
    sanga: sum(dailyRows.map((r) => r.split.sanga)),
    fleet: sum(dailyRows.map((r) => r.split.fleet)),
    driver: sum(dailyRows.map((r) => r.split.driver)),
  };
  const performance = drivers.map(({ record, person }) => ({
    record,
    person,
    trips: person.trips,
    completed: Math.round(person.trips * 0.95),
  }));
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
      <PreviewBanner />
      <Stats
        items={(path.endsWith("performance")
          ? [
              ["Drivers", String(performance.length)],
              ["Total Trips", String(sum(performance.map((p) => p.trips)))],
              [
                "Completed Trips",
                String(sum(performance.map((p) => p.completed))),
              ],
              [
                "Cancelled Trips",
                String(sum(performance.map((p) => p.trips - p.completed))),
              ],
            ]
          : [
              ["Total Earnings", money(total.gross)],
              ["Fleet Commission", money(total.fleet)],
              ["Driver Payout", money(total.driver)],
              ["Sanga fee (first)", money(total.sanga)],
            ]
        ).map(([label, value]) => ({
          label,
          value,
          hint: "Sample period",
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
            rows={performance
              .filter((p) =>
                p.person.name.toLowerCase().includes(search.toLowerCase()),
              )
              .map((p) => ({
                key: p.record.id,
                cells: [
                  <Person key="p" index={p.person.index} />,
                  String(p.trips),
                  String(p.completed),
                  `${Math.round((p.completed / p.trips) * 100)}%`,
                  money(p.trips * perTrip[state.market]),
                  "4.8 ★",
                  <Badge key="s">{p.record.status}</Badge>,
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
              "Sanga fee",
              "Driver payout",
              "Adjustment",
              "Fleet net",
            ]}
            rows={dailyRows.map((row, i) => ({
              key: String(i),
              cells: [
                tab === "By driver"
                  ? (drivers[i % drivers.length]?.record.name ?? "—")
                  : tab === "By Vehicle"
                    ? (vehicleNames[i % vehicleNames.length] ?? "—")
                    : tab === "By location"
                      ? samplePlaces[state.market][i % 3]
                      : tab === "By service type"
                        ? "Standard Ride"
                        : `${i + 1} Oct 2026`,
                row.trips,
                money(row.split.gross),
                money(row.split.sanga),
                money(row.split.driver),
                money(0),
                money(row.split.fleet),
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
