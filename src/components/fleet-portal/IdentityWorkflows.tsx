"use client";
import Link from "next/link";
import { useState } from "react";
import { portalUrl } from "@/lib/fleet-portal";
import { marketConfig, nextStatuses } from "@/lib/fleet-preview-domain";
import { usePreview } from "./PreviewProvider";
import { Badge, Button, Header, Info, KeyValues, Panel } from "./ui";
import {
  Input,
  PreviewBanner,
  WorkflowForm,
  type InputSpec,
} from "./WorkflowUI";

export function IdentityWorkflow({ path }: { path: string }) {
  const { state, execute } = usePreview();
  const config = marketConfig[state.market];
  const application = state.records.applications.find(
    (r) => r.market === state.market,
  )!;
  const [message, setMessage] = useState("");
  const [reason, setReason] = useState("");
  if (path.startsWith("security/")) return <SecurityWorkflow path={path} />;
  if (path === "onboarding/status")
    return (
      <>
        <Header
          title="Application status"
          back={{ label: "Back to onboarding", path: "onboarding/start" }}
        />
        <PreviewBanner />
        <Panel
          title={application.name}
          action={<Badge>{application.status}</Badge>}
        >
          <KeyValues
            items={[
              ["Case reference", application.id],
              ["Market", config.name],
              ["Version", String(application.version)],
              [
                "Status source",
                "Local preview scenario; not Sanga verification",
              ],
            ]}
          />
          <p>
            No response-time promise is available. Only an authoritative service
            can approve a real fleet.
          </p>
        </Panel>
        <Panel title="Application scenario">
          <Input
            field={{
              key: "application-reason",
              label: "Reviewer reason / requested evidence",
              required: true,
            }}
            value={reason}
            onChange={setReason}
          />
          <div className="fp-work-actions">
            {nextStatuses("applications", application.status).map((status) => (
              <Button
                key={status}
                secondary
                disabled={!reason.trim()}
                onClick={() => {
                  const result = execute({
                    kind: "transition",
                    collection: "applications",
                    id: application.id,
                    version: application.version,
                    status,
                    reason,
                  });
                  setMessage(
                    result.ok
                      ? `Preview only · Application ${status}`
                      : result.error,
                  );
                }}
              >
                {status.replaceAll("_", " ")}
              </Button>
            ))}
          </div>
          {message && <p role="status">{message}</p>}
          {application.status === "information_required" && (
            <Button href="onboarding/documents">Provide sample evidence</Button>
          )}
          {application.status === "approved" && (
            <Button href="onboarding/setup">First-run setup</Button>
          )}
          {application.status === "rejected" && (
            <Info>
              Record a sample appeal request above, or contact support. Rejected
              fleets cannot self-approve.
            </Info>
          )}
        </Panel>
        <Panel title="Case history">
          <ol className="fp-work-timeline">
            {application.history.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ol>
        </Panel>
      </>
    );
  if (path === "onboarding/setup")
    return (
      <>
        <Header title="First-run checklist" />
        <PreviewBanner />
        {application.status !== "approved" ? (
          <Info>
            Fleet approval is required. View the application status before
            continuing.
          </Info>
        ) : (
          <Panel title="Prepare your sample fleet">
            <div className="fp-work-links">
              {[
                ["Organization profile", "settings/profile"],
                ["Review payout destination", "payouts/destination"],
                ["Invite first driver", "drivers/invite"],
                ["Add vehicle", "vehicles/new"],
                ["Review team access", "team"],
              ].map(([label, href]) => (
                <Link key={href} href={portalUrl(href)}>
                  {label} →
                </Link>
              ))}
            </div>
          </Panel>
        )}
        <Button secondary href="onboarding/status">
          Application status
        </Button>
      </>
    );
  if (path === "onboarding/markets")
    return (
      <>
        <Header title="Market enrollment" />
        <PreviewBanner />
        <Panel title="Separate enrollment per market">
          <p>
            Switching market changes sample data scope; it never approves
            another market or transfers ownership.
          </p>
          {state.records.applications.map((r) => (
            <p key={r.id}>
              {marketConfig[r.market].name} <Badge>{r.status}</Badge>
            </p>
          ))}
          <Button href="onboarding/start">
            Start / continue selected market
          </Button>
        </Panel>
      </>
    );
  const stages = [
    "start",
    "organization",
    "representative",
    "documents",
    "review",
  ];
  const step = path.split("/")[1];
  const index = stages.indexOf(step);
  const definitions: Record<string, InputSpec[]> = {
    start: [
      {
        key: "type",
        label: "Organization type",
        options: ["Company", "Partnership", "Sole proprietor"],
        required: true,
      },
      {
        key: "model",
        label: "Intended settlement model",
        options: ["Sanga-managed", "Fleet-direct (approval required)"],
        required: true,
      },
      {
        key: "consent",
        label: "Sample privacy acknowledgement",
        options: [
          "I understand this is a preview and will use fictional information",
        ],
        required: true,
      },
    ],
    organization: [
      { key: "legalName", label: "Fictional legal name", required: true },
      { key: "tradingName", label: "Trading name", required: true },
      {
        key: "registration",
        label: "Sample registration reference",
        required: true,
      },
      { key: "address", label: "Sample business address", required: true },
      { key: "region", label: config.region, required: true },
      { key: "postal", label: config.postal, required: true },
      {
        key: "phone",
        label: `Sample international phone (${config.phone})`,
        required: true,
      },
    ],
    representative: [
      {
        key: "representative",
        label: "Fictional representative name",
        required: true,
      },
      {
        key: "authority",
        label: "Authority evidence",
        options: ["Sample board authorization", "Sample ownership record"],
        required: true,
      },
      {
        key: "identity",
        label: "Identity evidence scenario",
        options: [
          "Sample evidence selected",
          "Information required",
          "Evidence expired",
        ],
        required: true,
      },
    ],
    documents: [
      {
        key: "document",
        label: "Built-in sample evidence",
        options: ["sample-registration.pdf", "sample-authority.pdf"],
        required: true,
      },
      {
        key: "expiry",
        label: "Sample evidence expiry",
        type: "date",
        required: true,
      },
    ],
    review: [],
  };
  const fields = definitions[step] ?? [];
  return (
    <WorkflowForm
      key={`${state.market}-${step}`}
      title={`Fleet application · ${step}`}
      back={index > 0 ? `onboarding/${stages[index - 1]}` : "login"}
      fields={fields}
      steps={[
        step === "review" ? "Application summary" : "Enter sample details",
        "Review and continue",
      ]}
      initial={application.fields}
      attachments={step === "documents"}
      onSubmit={(values) => {
        if (
          step === "review" &&
          !["type", "legalName", "representative", "document"].every(
            (k) => application.fields[k],
          )
        )
          return {
            ok: false,
            error:
              "Complete organization, representative and sample document steps before submission.",
          };
        if (
          values.phone &&
          !/^\+[1-9]\d{7,14}$/.test(values.phone.replaceAll(" ", ""))
        )
          return {
            ok: false,
            error: "Use an international sample phone number beginning with +.",
          };
        if (values.identity === "Evidence expired")
          return {
            ok: false,
            error:
              "Expired sample evidence cannot proceed. Choose a valid scenario.",
          };
        const result = execute({
          kind: "transition",
          collection: "applications",
          id: application.id,
          version: application.version,
          status: step === "review" ? "pending" : application.status,
          reason: `Preview ${step} updated`,
          fields: values,
        });
        return result.ok
          ? {
              ok: true,
              path:
                step === "review"
                  ? "onboarding/status"
                  : `onboarding/${stages[index + 1]}`,
            }
          : result;
      }}
    >
      <Info>
        {config.name} · {config.documents} A real application requires approved
        compliance schemas and secure upload services.
      </Info>
      {step === "review" && (
        <KeyValues items={Object.entries(application.fields)} />
      )}
    </WorkflowForm>
  );
}
function SecurityWorkflow({ path }: { path: string }) {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const kind = path.split("/")[1];
  const titles: Record<string, string> = {
    recover: "Recover access",
    reset: "Reset password",
    verify: "Step-up verification",
    expired: "Session expired",
    locked: "Account locked",
    history: "Security history",
    "sign-out": "Sign out / security",
  };
  return (
    <>
      <Header
        title={titles[kind] ?? "Security"}
        back={{ label: "Back to sign in", path: "login" }}
      />
      <PreviewBanner />
      <Panel title="Identity service not connected">
        <p>
          This screen demonstrates the recovery and security states. Real
          credentials, OTPs, passkeys and reset tokens are disabled.
        </p>
        {["recover", "reset", "verify"].includes(kind) && (
          <div className="fp-form fp-work-form">
            <label className="fp-field">
              {kind === "recover"
                ? "Sample identifier"
                : kind === "reset"
                  ? "Sample password"
                  : "Sample challenge"}
              <input
                readOnly
                autoComplete="off"
                type={kind === "reset" && !visible ? "password" : "text"}
                value={
                  kind === "recover"
                    ? "operator@example.invalid"
                    : kind === "reset"
                      ? "Sample-only-password"
                      : "000000"
                }
              />
            </label>
            {kind === "reset" && (
              <Button secondary onClick={() => setVisible((v) => !v)}>
                {visible ? "Hide" : "Show"} sample password
              </Button>
            )}
            <div className="fp-work-actions">
              <Button
                onClick={() =>
                  setMessage(
                    kind === "recover"
                      ? "Preview only · If an eligible account existed, recovery instructions would be requested. No message was sent."
                      : "Unavailable · No identity service is connected. No password or challenge was submitted.",
                  )
                }
              >
                Preview {kind}
              </Button>
              <Button
                secondary
                onClick={() =>
                  setMessage(
                    "Preview only · Token / challenge expired or already used. Request a new challenge.",
                  )
                }
              >
                Show expired state
              </Button>
              <Button
                secondary
                onClick={() =>
                  setMessage(
                    "Preview only · Retry limit reached. Rate limiting requires the identity service.",
                  )
                }
              >
                Show retry limit
              </Button>
            </div>
          </div>
        )}
        {["expired", "locked"].includes(kind) && (
          <Info>
            {kind === "expired"
              ? "Reauthentication is required. No sensitive draft is retained."
              : "Access is locked in this sample scenario. Contact support; do not bypass the lock."}
          </Info>
        )}
        {kind === "sign-out" && (
          <Info>
            No authenticated session exists. Sign-out-all, session rotation and
            security history require the identity service.
          </Info>
        )}
        {kind === "history" && (
          <p>
            There are no real security events. Local workflow changes appear in
            the preview audit log.
          </p>
        )}
        {message && <p role="status">{message}</p>}
        <div className="fp-work-actions">
          {[
            ["Recovery", "security/recover"],
            ["Reset password preview", "security/reset"],
            ["Step-up preview", "security/verify"],
            ["Session expired", "security/expired"],
            ["Locked account", "security/locked"],
            ["Sign out / security", "security/sign-out"],
          ]
            .filter(([, href]) => href !== path)
            .map(([label, href]) => (
              <Button key={href} secondary href={href}>
                {label}
              </Button>
            ))}
          <Button secondary href="login">
            Return to sign in
          </Button>
          <Button secondary href="settings/support">
            Get support
          </Button>
        </div>
      </Panel>
    </>
  );
}
