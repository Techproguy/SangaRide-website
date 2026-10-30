"use client";
import { useState } from "react";
import { marketConfig } from "@/lib/fleet-preview-domain";
import { usePreview } from "./PreviewProvider";
import { Button, Header, Info, Panel } from "./ui";
import { PreviewBanner, WorkflowForm } from "./WorkflowUI";

export function ConfigurationWorkflow({ path }: { path: string }) {
  const { state, execute } = usePreview();
  const [message, setMessage] = useState("");
  const config = marketConfig[state.market];
  const preferences = state.records.requests.find(
    (r) =>
      r.market === state.market && r.fields.type === "notification-preferences",
  );
  function preference(key: string, value: boolean) {
    const result = preferences
      ? execute({
          kind: "transition",
          collection: "requests",
          id: preferences.id,
          status: preferences.status,
          version: preferences.version,
          reason: "Preview notification preferences",
          fields: { [key]: String(value) },
        })
      : execute({
          kind: "create",
          collection: "requests",
          name: "Sample notification preferences",
          fields: { type: "notification-preferences", [key]: String(value) },
        });
    setMessage(
      result.ok
        ? "Preview only · Preferences stored in memory. No delivery settings changed."
        : result.error,
    );
  }
  if (path === "settings/notifications")
    return (
      <>
        <Header title="Notification preferences" />
        <PreviewBanner />
        <Panel title={`${config.name} event preferences`}>
          <Info>
            Security and compliance notices remain required. Delivery service
            and market-specific channel eligibility are not connected.
          </Info>
          {["Trip updates", "Payout updates", "Support replies"].map(
            (event) => (
              <div className="fp-preference-row" key={event}>
                <strong>{event}</strong>
                {["email", "SMS", "in-app"].map((channel) => (
                  <label key={channel}>
                    <input
                      type="checkbox"
                      checked={
                        preferences?.fields[`${event}-${channel}`] === "true"
                      }
                      onChange={(e) =>
                        preference(`${event}-${channel}`, e.target.checked)
                      }
                    />
                    {channel}
                  </label>
                ))}
              </div>
            ),
          )}
          <label className="fp-check">
            <input type="checkbox" checked disabled />
            Required security and compliance notices
          </label>
          {message && <p role="status">{message}</p>}
        </Panel>
      </>
    );
  if (path === "settings/billing" || path === "settings/integrations")
    return (
      <>
        <Header title={path.endsWith("billing") ? "Billing" : "Integrations"} />
        <PreviewBanner />
        <Panel title="Not connected">
          <Info>
            {path.endsWith("billing")
              ? "Subscription plans, prices, limits and billing actions are unavailable until approved (D-09). No charges can be created."
              : "No integration is confirmed or connected (D-10). No provider permissions, credentials or financial access can be granted."}
          </Info>
          <Button secondary href="settings/support/new">
            Contact support
          </Button>
        </Panel>
      </>
    );
  return (
    <WorkflowForm
      key={`${path}-${state.market}`}
      title={
        path.endsWith("profile")
          ? "Organization profile"
          : "Operational policies"
      }
      back="settings"
      fields={
        path.endsWith("profile")
          ? [
              { key: "name", label: "Fictional trading name", required: true },
              {
                key: "address",
                label: "Fictional business address",
                required: true,
              },
              { key: "region", label: config.region, required: true },
              { key: "postal", label: config.postal, required: true },
              {
                key: "phone",
                label: `Sample E.164 phone (${config.phone})`,
                required: true,
              },
            ]
          : [
              { key: "name", label: "Policy title", required: true },
              {
                key: "policy",
                label: "Sample policy text",
                type: "textarea",
                required: true,
              },
            ]
      }
      onSubmit={(values) => {
        const result = execute({
          kind: "create",
          collection: "requests",
          name: values.name,
          fields: { ...values, type: path.split("/")[1], market: state.market },
        });
        return result.ok
          ? { ok: true, path: `payouts/requests/${result.id}` }
          : result;
      }}
    >
      <Info>
        Changes are local review requests. They do not amend legal terms,
        identity verification, trip rules or Sanga policies.
      </Info>
    </WorkflowForm>
  );
}
