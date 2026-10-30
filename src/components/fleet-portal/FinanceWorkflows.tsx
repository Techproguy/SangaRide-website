"use client";
import Link from "next/link";
import { useState } from "react";
import {
  allocation,
  formatMoney,
  marketConfig,
  remittance,
} from "@/lib/fleet-preview-domain";
import { portalUrl } from "@/lib/fleet-portal";
import { usePreview } from "./PreviewProvider";
import { Badge, Button, Header, Info, KeyValues, Panel } from "./ui";
import {
  PreviewBanner,
  RecordCards,
  WorkflowForm,
  recordPath,
  type InputSpec,
} from "./WorkflowUI";
import { PreviewDirectory, RecordDetail } from "./SupplyWorkflows";

export function AllocationBreakdown() {
  const { state } = usePreview();
  const money = (n: number) => formatMoney(n, state.market);
  const split = allocation(1000000, 1500, 2000);
  return (
    <Panel title="Illustrative commission-first breakdown">
      <Info>
        Example only: 15% Sanga deduction, then a 20% fleet share of net. These
        are not approved commercial rates. Values are minor-unit calculations in
        one currency.
      </Info>
      <KeyValues
        items={[
          ["Allocation basis", money(split.gross)],
          ["Sanga deduction (first)", money(split.sanga)],
          ["Distributable net", money(split.net)],
          ["Fleet share of net", money(split.fleet)],
          ["Driver share of net", money(split.driver)],
          [
            "Snapshot",
            "Sample pricing v1 · commission v1 · split v1 · mode v1",
          ],
          ["Timezone", marketConfig[state.market].zone],
        ]}
      />
    </Panel>
  );
}

/** Entry points into the finance workflows, shared by the designed Earnings and Payouts pages. */
export function FinanceLinks() {
  return (
    <div className="fp-work-links">
      {[
        ["Trip financial breakdown", "earnings/trip-001"],
        ["Processing payout", "payouts/po-001"],
        ["Failed payout", "payouts/po-failed"],
        ["Payout destination", "payouts/destination"],
        ["Settlement models", "payouts/settlement"],
        ["Default split", "payouts/split"],
        ["Cash liabilities", "payouts/cash"],
        ["Reconciliation", "payouts/reconciliation"],
        ["Request history", "payouts/requests"],
        ["Financial export", "reports/configure"],
      ].map(([label, href]) => (
        <Link key={href} href={portalUrl(href)}>
          {label} →
        </Link>
      ))}
    </div>
  );
}

export function FinanceWorkflow({ path }: { path: string }) {
  const { state, execute } = usePreview();
  const [message, setMessage] = useState("");
  const breakdown = <AllocationBreakdown />;
  if (path === "payouts/requests")
    return <PreviewDirectory collection="requests" />;
  if (path.startsWith("payouts/requests/"))
    return <RecordDetail collection="requests" id={path.split("/")[2]} />;
  if (
    path === "payouts/cash/remit" ||
    path === "payouts/dispute" ||
    /payouts\/(destination|settlement|split)\/(change|confirm|review)$/.test(
      path,
    )
  ) {
    const type = path.includes("destination")
      ? "destination"
      : path.includes("settlement")
        ? "settlement"
        : path.includes("split")
          ? "split"
          : path.includes("dispute")
            ? "dispute"
            : "remittance";
    const fields: InputSpec[] =
      type === "destination"
        ? [
            {
              key: "destination",
              label: "Built-in destination scenario",
              options: [
                "Sample NG destination · •••• 0000",
                "Sample US destination · •••• 0000",
              ],
              required: true,
            },
            {
              key: "verification",
              label: "Verification scenario",
              options: ["Pending verification", "Verification failed"],
              required: true,
            },
          ]
        : type === "settlement"
          ? [
              {
                key: "mode",
                label: "Requested mode",
                options: ["Sanga-managed / platform", "Fleet-managed / direct"],
                required: true,
              },
            ]
          : type === "split"
            ? [
                {
                  key: "fleet",
                  label: "Illustrative fleet share of post-Sanga net (%)",
                  type: "number",
                  required: true,
                },
                {
                  key: "driver",
                  label: "Illustrative driver share of post-Sanga net (%)",
                  type: "number",
                  required: true,
                },
              ]
            : type === "remittance"
              ? [
                  {
                    key: "amount",
                    label: `Sample remittance (${marketConfig[state.market].currency})`,
                    type: "number",
                    required: true,
                  },
                  {
                    key: "reference",
                    label: "Fictional remittance reference",
                    required: true,
                  },
                ]
              : [
                  {
                    key: "reference",
                    label: "Related sample trip / payout",
                    required: true,
                  },
                  {
                    key: "amount",
                    label: `Sample disputed amount (${marketConfig[state.market].currency})`,
                    type: "number",
                    required: true,
                  },
                ];
    fields.push({
      key: "reason",
      label: "Reason",
      type: "textarea",
      required: true,
    });
    if (["destination", "settlement", "split"].includes(type))
      fields.push(
        {
          key: "effective",
          label: "Requested future effective date",
          type: "date",
          required: true,
        },
        {
          key: "challenge",
          label: "Step-up dependency",
          options: [
            "Preview only — live step-up is required before any real change",
          ],
          required: true,
        },
      );
    return (
      <WorkflowForm
        key={`${path}-${state.market}`}
        title={`Review ${type} request`}
        back={type === "remittance" ? "payouts/cash" : "payouts"}
        fields={fields}
        attachments={type === "dispute"}
        onSubmit={(values) => {
          if (
            type === "split" &&
            (![Number(values.fleet), Number(values.driver)].every(
              (n) => Number.isFinite(n) && n >= 0 && n <= 100,
            ) ||
              Number(values.fleet) + Number(values.driver) !== 100)
          )
            return {
              ok: false,
              error:
                "Fleet and driver shares must each be 0–100 and total exactly 100%.",
            };
          if (
            values.effective &&
            values.effective <= new Date().toISOString().slice(0, 10)
          )
            return {
              ok: false,
              error:
                "Choose a future date. Existing sample trips keep their original terms.",
            };
          if (
            values.amount &&
            (!Number.isFinite(Number(values.amount)) ||
              Number(values.amount) <= 0)
          )
            return { ok: false, error: "Enter a positive sample amount." };
          const result = execute({
            kind: "create",
            collection: "requests",
            name: `${type} request`,
            fields: {
              ...values,
              type,
              currency: marketConfig[state.market].currency,
              stepUp: "Unavailable — live identity service required",
            },
          });
          return result.ok
            ? { ok: true, path: recordPath("requests", result.id) }
            : result;
        }}
      >
        <Info>
          No live verification, remittance or approval occurs. Submitted samples
          remain requests. Current trip snapshots and bank destinations are
          never rewritten.
        </Info>
      </WorkflowForm>
    );
  }
  if (path.startsWith("payouts/cash") || path === "payouts/reconciliation")
    return <CashWorkflow />;
  if (path.startsWith("earnings/") || /^payouts\/po-/.test(path))
    return (
      <>
        <Header
          title={
            path.startsWith("earnings")
              ? "Trip financial detail"
              : "Payout detail"
          }
          back={{ label: "Back to finance", path: "payouts" }}
        />
        <PreviewBanner />
        {breakdown}
        <Panel title="Collection and settlement">
          <KeyValues
            items={[
              ["Sample reference", path.split("/").at(-1)!],
              ["Collection party", "Sanga payment provider (illustrative)"],
              ["Payment method", "Digital · no real transaction"],
              ["Settlement responsibility", "Platform, sample version 1"],
              ["Provider reference", "Not connected"],
              [
                "Status",
                path.includes("failed")
                  ? "Failed sample scenario"
                  : "Processing sample scenario",
              ],
            ]}
          />
          <ol className="fp-work-timeline">
            <li>Sample trip finalized · immutable allocation snapshot</li>
            <li>Sample fee and allocation calculated</li>
            <li>No ledger entry or transfer created</li>
          </ol>
          <Info>
            Retries, refunds, reversals and provider timelines are unavailable
            until financial services are connected. Corrections require
            compensating entries.
          </Info>
          <div className="fp-work-actions">
            <Button href="payouts/dispute">Preview adjustment / dispute</Button>
            <Button secondary href="settings/support/new">
              Contact support
            </Button>
          </div>
        </Panel>
      </>
    );
  if (path === "payouts/destination")
    return (
      <>
        <Header
          title="Payout destination"
          back={{ label: "Back to payouts", path: "payouts" }}
        />
        <PreviewBanner />
        <Panel title="Destination not connected">
          <KeyValues
            items={[
              ["Country", marketConfig[state.market].name],
              ["Currency", marketConfig[state.market].currency],
              ["Account", "Sample only · •••• 0000"],
              ["Owner verification", "Unavailable"],
              ["Effective destination", "No production destination"],
            ]}
          />
          <Button href="payouts/destination/change">
            Preview change request
          </Button>
        </Panel>
        <Button secondary href="payouts/requests">
          Request history
        </Button>
      </>
    );
  if (path === "payouts/settlement")
    return (
      <>
        <Header title="Settlement operating model" />
        <PreviewBanner />
        <div className="fp-two">
          {["Sanga-managed / platform", "Fleet-managed / direct"].map(
            (mode) => (
              <Panel key={mode} title={mode}>
                <p>
                  Sanga commission is accounted for first. Fleet and driver
                  allocations use the post-Sanga distributable net.
                </p>
                <p>
                  {mode.startsWith("Sanga")
                    ? "Sanga / approved payment partners handle eligible disbursements."
                    : "Fleet is responsible for eligible driver remittance under an approved agreement."}
                </p>
                <Info>
                  Cash commission liability remains attributable to the actual
                  collector in either model.
                </Info>
              </Panel>
            ),
          )}
        </div>
        <Button href="payouts/settlement/review">
          Preview mode-change request
        </Button>
        <Button secondary href="payouts/requests">
          Request history
        </Button>
      </>
    );
  if (path === "payouts/split")
    return (
      <>
        <Header title="Default split" />
        <PreviewBanner />
        {breakdown}
        <Panel title="Versioned changes">
          <p>
            Actual default percentages are not configured. Driver overrides are
            unavailable until D-08 is approved. Sample requests apply only to
            future terms; no existing sample allocation changes.
          </p>
          <Button href="payouts/split/review">Preview split request</Button>
          <Button secondary href="payouts/requests">
            Version / request history
          </Button>
        </Panel>
      </>
    );
  return (
    <>
      <Header
        title={path === "earnings" ? "Earnings and allocation" : "Payouts"}
        description={`Illustrative ${marketConfig[state.market].currency} amounts only; currencies are never combined.`}
      />
      <PreviewBanner />
      {breakdown}
      <FinanceLinks />
      <Panel title="Financial integrations">
        <Badge>Not connected</Badge>
        <p>
          Ledger, bank verification, payout rails, provider webhooks, actual
          commission rules and reconciliation services are unavailable.
        </p>
        <Button
          secondary
          onClick={() =>
            setMessage(
              "Unavailable · No live payout service is configured. No money moved.",
            )
          }
        >
          Check payout availability
        </Button>
        {message && <p role="status">{message}</p>}
      </Panel>
    </>
  );
}
function CashWorkflow() {
  const { state, execute } = usePreview();
  const [message, setMessage] = useState("");
  const row = state.records.requests.find(
    (r) => r.fields.type === "cash-scenario" && r.market === state.market,
  );
  const sample = allocation(1000000, 1500, 2000);
  const remaining = row ? Number(row.fields.remaining) : sample.sanga;
  function partial() {
    try {
      const next = remittance(remaining, Math.min(50000, remaining));
      const result = row
        ? execute({
            kind: "transition",
            collection: "requests",
            id: row.id,
            status: row.status,
            version: row.version,
            reason: "Illustrative partial remittance. No money moved.",
            fields: { remaining: String(next) },
          })
        : execute({
            kind: "create",
            collection: "requests",
            name: "Sample cash reconciliation",
            fields: { type: "cash-scenario", remaining: String(next) },
          });
      setMessage(
        result.ok
          ? "Preview only · Partial remittance scenario recorded. No money moved."
          : result.error,
      );
    } catch (e) {
      setMessage((e as Error).message);
    }
  }
  return (
    <>
      <Header
        title="Cash liabilities and reconciliation"
        back={{ label: "Back to payouts", path: "payouts" }}
      />
      <PreviewBanner />
      <Info>
        Cash actions are disabled for production until market policy and rails
        are approved (D-03/D-04). The controls below change an illustrative
        reconciliation scenario only.
      </Info>
      <Panel title="Sample cash trip · cash-001">
        <KeyValues
          items={[
            ["Collected by", "Sample driver"],
            ["Cash received", formatMoney(sample.gross, state.market)],
            ["Sanga fee entitlement", formatMoney(sample.sanga, state.market)],
            ["Fleet allocation", formatMoney(sample.fleet, state.market)],
            ["Driver allocation", formatMoney(sample.driver, state.market)],
            [
              "Outstanding Sanga liability",
              formatMoney(remaining, state.market),
            ],
            [
              "Reconciliation status",
              remaining
                ? "Open / partially reconciled sample"
                : "Reconciled sample",
            ],
            ["Due date / overdue policy", "Not configured"],
            ["Currency", marketConfig[state.market].currency],
          ]}
        />
        <p>
          Driver cash retention must not generate a second payout. Approved
          offsets and refunds require linked ledger entries.
        </p>
        <div className="fp-work-actions">
          <Button disabled={remaining === 0} onClick={partial}>
            Preview partial remittance
          </Button>
          <Button secondary href="payouts/cash/remit">
            Review remittance request
          </Button>
          <Button secondary href="payouts/cash/cash-001">
            View cash trip detail
          </Button>
          <Button secondary href="payouts/dispute">
            Dispute sample liability
          </Button>
        </div>
        {message && <p role="status">{message}</p>}
      </Panel>
      <Panel title="Reconciliation exceptions">
        <p>
          Unmatched, shortfall, excess, disputed and stale-provider scenarios
          require authoritative ledger matching. No real collection, transfer or
          cash settlement is claimed.
        </p>
        <RecordCards
          collection="requests"
          records={state.records.requests.filter(
            (r) => r.fields.type === "cash-scenario",
          )}
        />
      </Panel>
    </>
  );
}
