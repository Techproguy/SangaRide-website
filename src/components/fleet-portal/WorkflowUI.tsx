"use client";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { portalUrl } from "@/lib/fleet-portal";
import {
  marketConfig,
  type Collection,
  type PreviewRecord,
} from "@/lib/fleet-preview-domain";
import { usePreview } from "./PreviewProvider";
import {
  Badge,
  Button,
  Dialog,
  Header,
  Info,
  KeyValues,
  Panel,
  Steps,
} from "./ui";

export type InputSpec = {
  key: string;
  label: string;
  required?: boolean;
  type?: string;
  options?: string[];
  hint?: string;
};
export function PreviewBanner() {
  return (
    <Info>
      <strong>Preview only.</strong> Use fictional sample information. No
      account, verification, payment, upload or message is created. Refresh
      resets this preview.
    </Info>
  );
}
export function Input({
  field,
  value,
  onChange,
  error,
}: {
  field: InputSpec;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  const id = `wf-${field.key}`;
  return (
    <label className="fp-field" htmlFor={id}>
      <span>
        {field.label}
        {field.required && <em> *</em>}
      </span>
      {field.options ? (
        <select
          id={id}
          name={field.key}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
        >
          <option value="">Choose an option</option>
          {field.options.map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
      ) : field.type === "textarea" ? (
        <textarea
          id={id}
          name={field.key}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
        />
      ) : (
        <input
          id={id}
          name={field.key}
          type={field.type ?? "text"}
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onInput={(e) => {
            if (field.type === "date" || field.type === "datetime-local")
              onChange(e.currentTarget.value);
          }}
          required={field.required}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      )}{" "}
      {field.hint && <small>{field.hint}</small>}
      {error && (
        <small id={`${id}-error`} role="alert">
          {error}
        </small>
      )}
    </label>
  );
}
export function SampleAttachment() {
  const [files, setFiles] = useState<string[]>([]);
  return (
    <fieldset className="fp-sample-files">
      <legend>Sample attachment states</legend>
      <p>
        Real files are disabled. Choose a built-in filename to preview
        validation and replacement.
      </p>
      <div className="fp-work-actions">
        {["sample-document.pdf", "sample-photo.jpg"].map((name) => (
          <Button
            secondary
            key={name}
            onClick={() => setFiles((f) => [...new Set([...f, name])])}
          >
            Add {name}
          </Button>
        ))}
        <Button
          secondary
          onClick={() => setFiles(["Rejected: unsupported sample.exe"])}
        >
          Show rejected file
        </Button>
      </div>
      <ul>
        {files.map((name) => (
          <li key={name}>
            {name}{" "}
            <button
              type="button"
              onClick={() => setFiles((f) => f.filter((x) => x !== name))}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <small>No upload, scanning or verification service is connected.</small>
    </fieldset>
  );
}
export function WorkflowForm({
  title,
  back,
  fields,
  steps = ["Details", "Review"],
  onSubmit,
  attachments = false,
  initial = {},
  children,
}: {
  title: string;
  back: string;
  fields: InputSpec[];
  steps?: string[];
  onSubmit: (values: Record<string, string>) => {
    ok: boolean;
    error?: string;
    path?: string;
  };
  attachments?: boolean;
  initial?: Record<string, string>;
  children?: ReactNode;
}) {
  const router = useRouter();
  const { setHasDraft } = usePreview();
  const [values, setValues] = useState(initial);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [complete, setComplete] = useState(false);
  const [cancel, setCancel] = useState(false);
  const [leavePath, setLeavePath] = useState(portalUrl(back));
  const [dirty, setDirty] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const submitted = useRef(false);
  useEffect(() => {
    setHasDraft(dirty);
    return () => setHasDraft(false);
  }, [dirty, setHasDraft]);
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    const intercept = (e: MouseEvent) => {
      const link = (e.target as Element).closest?.(
        "a[href]",
      ) as HTMLAnchorElement | null;
      if (
        !link ||
        link.target === "_blank" ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey
      )
        return;
      const url = new URL(link.href);
      if (url.origin !== location.origin) return;
      e.preventDefault();
      e.stopPropagation();
      setLeavePath(url.pathname + url.search);
      setCancel(true);
    };
    window.addEventListener("beforeunload", warn);
    document.addEventListener("click", intercept, true);
    return () => {
      window.removeEventListener("beforeunload", warn);
      document.removeEventListener("click", intercept, true);
    };
  }, [dirty]);
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy || submitted.current) return;
    setError("");
    if (step < steps.length - 1) {
      const entered = Object.fromEntries(
        new FormData(e.currentTarget).entries(),
      ) as Record<string, string>;
      setValues((previous) => ({ ...previous, ...entered }));
      setStep((s) => s + 1);
      heading.current?.focus();
      return;
    }
    setBusy(true);
    const result = onSubmit(values);
    if (!result.ok) {
      setError(result.error ?? "Preview action failed.");
      setBusy(false);
      return;
    }
    submitted.current = true;
    setComplete(true);
    setDirty(false);
    if (result.path) router.push(portalUrl(result.path));
    else {
      setError(
        "Preview only · Recorded locally. No external action was performed.",
      );
      setBusy(false);
    }
  }
  return (
    <>
      <Header title={title} back={{ label: "Back", path: back }} />
      <PreviewBanner />
      <Panel>
        <Steps labels={steps} current={step} />
        <h2 ref={heading} tabIndex={-1}>
          {steps[step]}
        </h2>
        <form className="fp-form fp-work-form" onSubmit={submit}>
          {step === steps.length - 1 ? (
            <>
              <Info>
                Preview only · Review this sample request. Required live
                approval and delivery are not connected.
              </Info>
              <KeyValues
                items={fields.map((f) => [
                  f.label,
                  values[f.key] || "Not provided",
                ])}
              />
              {fields.length === 0 && children}
            </>
          ) : (
            <>
              <div className="fp-two">
                {step === 0 ? (
                  fields.map((field) => (
                    <Input
                      key={field.key}
                      field={field}
                      value={values[field.key] ?? ""}
                      onChange={(v) => {
                        setValues((s) => ({ ...s, [field.key]: v }));
                        setDirty(true);
                      }}
                    />
                  ))
                ) : (
                  <KeyValues
                    items={fields.map((field) => [
                      field.label,
                      values[field.key] || "Not provided",
                    ])}
                  />
                )}
              </div>
              {attachments && <SampleAttachment />}
              {children}
            </>
          )}
          {error && (
            <p role="alert" className="fp-work-error">
              {error}
            </p>
          )}
          <div className="fp-work-actions">
            <Button
              secondary
              onClick={() => {
                setLeavePath(portalUrl(back));
                if (dirty) setCancel(true);
                else router.push(portalUrl(back));
              }}
            >
              Cancel
            </Button>
            {step > 0 && (
              <Button secondary onClick={() => setStep((s) => s - 1)}>
                Previous
              </Button>
            )}
            <Button type="submit" disabled={busy || complete}>
              {busy
                ? "Recording preview…"
                : step === steps.length - 1
                  ? "Submit preview"
                  : "Continue"}
            </Button>
            {complete && (
              <Button
                secondary
                onClick={() => {
                  submitted.current = false;
                  setComplete(false);
                  setBusy(false);
                  setStep(0);
                  setValues(initial);
                  setError("");
                }}
              >
                Start another preview
              </Button>
            )}
          </div>
        </form>
      </Panel>
      {cancel && (
        <Dialog
          title="Discard this preview draft?"
          onClose={() => setCancel(false)}
        >
          <p>Your unsaved entries will be discarded.</p>
          <div className="fp-work-actions">
            <Button secondary onClick={() => setCancel(false)}>
              Keep editing
            </Button>
            <Button
              onClick={() => {
                setDirty(false);
                setCancel(false);
                router.push(leavePath);
              }}
            >
              Discard draft
            </Button>
          </div>
        </Dialog>
      )}
    </>
  );
}
export const recordPrefix: Record<Collection, string> = {
  applications: "onboarding/status",
  drivers: "drivers",
  vehicles: "vehicles",
  invitations: "invitations",
  assignments: "assignments",
  issues: "maintenance",
  requests: "payouts/requests",
  team: "team",
  tickets: "settings/support",
  reports: "reports/jobs",
  notifications: "notifications",
};
export function recordPath(collection: Collection, id: string) {
  return `${recordPrefix[collection]}/${id}${collection === "vehicles" ? "/overview" : ""}`;
}
export function RecordCards({
  collection,
  records,
}: {
  collection: Collection;
  records?: PreviewRecord[];
}) {
  const { state } = usePreview();
  const rows = (records ?? state.records[collection]).filter(
    (r) => r.market === state.market,
  );
  return rows.length ? (
    <div className="fp-record-grid">
      {rows.map((r) => (
        <Link
          key={r.id}
          href={portalUrl(recordPath(collection, r.id))}
          className="fp-record-card"
        >
          <span className="fp-record-initial">{r.name.slice(0, 1)}</span>
          <div>
            <strong>{r.name}</strong>
            <small>
              {r.id} · {r.market}
            </small>
          </div>
          <Badge>{r.status}</Badge>
        </Link>
      ))}
    </div>
  ) : (
    <Panel title="No records">
      <p>
        No records match this market or filter. Try another filter or create a
        sample record.
      </p>
    </Panel>
  );
}
export function PreviewToolbar({ children }: { children?: ReactNode }) {
  const { state, setMarket, setRole, reset, hasDraft } = usePreview();
  const [confirm, setConfirm] = useState(false);
  return (
    <>
      <div className="fp-preview-toolbar">
        <span>
          <strong>Preview only</strong> · {marketConfig[state.market].currency}{" "}
          · {marketConfig[state.market].zone}
        </span>
        <label>
          Market
          <select
            aria-label="Preview market"
            disabled={hasDraft}
            value={state.market}
            onChange={(e) => setMarket(e.target.value as "NG" | "US")}
          >
            <option value="NG">Nigeria</option>
            <option value="US">United States</option>
          </select>
        </label>
        <label>
          Scenario role
          <select
            aria-label="Preview role"
            disabled={hasDraft}
            value={state.role}
            onChange={(e) => setRole(e.target.value as typeof state.role)}
          >
            <option>Owner</option>
            <option>Operations</option>
            <option>Read-only</option>
          </select>
        </label>
        <Link href={portalUrl("workflows")}>All workflows</Link>
        <button disabled={hasDraft} onClick={() => setConfirm(true)}>
          Reset preview
        </button>
        {children}
        {hasDraft && (
          <small>
            Submit or cancel your draft before changing the preview context.
          </small>
        )}
      </div>
      {confirm && (
        <Dialog title="Reset sample changes?" onClose={() => setConfirm(false)}>
          <p>
            This clears only the in-memory preview. No live data exists here.
          </p>
          <div className="fp-work-actions">
            <Button secondary onClick={() => setConfirm(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                reset();
                setConfirm(false);
              }}
            >
              Reset sample data
            </Button>
          </div>
        </Dialog>
      )}
    </>
  );
}
