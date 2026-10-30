"use client";

import Image from "next/image";
import Link from "next/link";
import {
  createContext,
  useContext,
  useId,
  useState,
  useRef,
  useLayoutEffect,
  type ReactNode,
  type FormEvent,
} from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
  X,
} from "lucide-react";
import assetData from "@/lib/fleet-portal-assets.json";
import { people, portalUrl } from "@/lib/fleet-portal";

const assets: Record<string, Record<string, string>> = assetData;
export function Asset({
  name,
  screen = "922:18639",
  className = "",
  alt = "",
  width = 20,
  height = 20,
}: {
  name: string;
  screen?: string;
  className?: string;
  alt?: string;
  width?: number;
  height?: number;
}) {
  // Assets are exported per Figma frame; reused images (avatars, cars) may only exist under another frame.
  const src =
    assets[screen]?.[name] ??
    Object.values(assets).find((frame) => frame[name])?.[name];
  return src ? (
    <Image
      unoptimized
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  ) : null;
}
export const DemoContext = createContext<(message: string) => void>(() => {});
export const useNotice = () => useContext(DemoContext);
/** Readable status text: preview records store raw enums such as "verification_pending". */
export function statusLabel(status: string) {
  const text = status.replace(/_/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}
export function Badge({ children }: { children: ReactNode }) {
  const text = String(children).toLowerCase();
  if (typeof children === "string") children = statusLabel(children);
  const tone =
    /cancel|fail|expire|inactive|overdue|deleted|suspend|reject|revok|blocked/.test(
      text,
    )
      ? "red"
      : /pending|progress|maintenance|soon|processing/.test(text)
        ? "orange"
        : /trip|created|invited|unread/.test(text)
          ? "blue"
          : /offline|completed assignment/.test(text)
            ? "gray"
            : /^(active|eligible|approved|ready|resolved|read|effective|accepted|succeeded|successful|completed)$/.test(
                  text,
                )
              ? "green"
              : "gray";
  return <span className={`fp-badge fp-${tone}`}>{children}</span>;
}
export function Button({
  children,
  href,
  onClick,
  secondary = false,
  type = "button",
  disabled = false,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  secondary?: boolean;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const cls = `fp-button ${secondary ? "fp-secondary" : ""}`;
  return href ? (
    <Link href={portalUrl(href)} className={cls}>
      {children}
    </Link>
  ) : (
    <button type={type} className={cls} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
export function Header({
  title,
  description,
  children,
  back,
  eyebrow,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
  back?: { label: string; path: string };
  eyebrow?: string;
}) {
  return (
    <header className="fp-page-header">
      {back && (
        <Link className="fp-back" href={portalUrl(back.path)}>
          <ArrowLeft size={14} />
          {back.label}
        </Link>
      )}
      <div className="fp-header-row">
        <div>
          {eyebrow && <p className="fp-welcome">{eyebrow}</p>}
          {/* Detail pages pass an empty title and render their own h1. */}
          {title && <h1>{title}</h1>}
          {description && <p>{description}</p>}
        </div>
        {children && <div className="fp-header-actions">{children}</div>}
      </div>
    </header>
  );
}
export function Panel({
  title,
  children,
  action,
  className = "",
}: {
  title?: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <section className={`fp-panel ${className}`}>
      {title && (
        <div className="fp-panel-heading">
          <h2>{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
export function Stats({
  items,
}: {
  items: {
    label: string;
    value: string;
    hint?: string;
    tone?: string;
    icon?: string;
  }[];
}) {
  return (
    <div
      className="fp-stats"
      style={{ "--stat-count": items.length } as React.CSSProperties}
    >
      {items.map((s, i) => (
        <div className="fp-stat" key={`${s.label}-${i}`}>
          <span className={`fp-stat-icon ${s.tone ?? "blue"}`}>
            <Asset
              name={
                s.icon ??
                [
                  "imgFluentPeopleCommunity48Filled",
                  "imgBoxiconsCarFilled",
                  "imgGroup6",
                  "imgF7MoneyDollarCircle",
                ][i % 4]
              }
            />
          </span>
          <span className="fp-muted">{s.label}</span>
          <div className="fp-stat-number">{s.value}</div>
          {s.hint && <small>{s.hint}</small>}
        </div>
      ))}
    </div>
  );
}
export function Person({
  index = 0,
  name,
  large = false,
  subtitle,
  screen = "922:18970",
}: {
  index?: number;
  name?: string;
  large?: boolean;
  subtitle?: string;
  screen?: string;
}) {
  const p = people[index % people.length];
  return (
    <span className={`fp-person ${large ? "fp-person-large" : ""}`}>
      <Asset
        name={p.image}
        screen={screen}
        width={large ? 100 : 36}
        height={large ? 100 : 36}
        className="fp-avatar"
      />
      <span>
        <strong>{name ?? p.name}</strong>
        <small>{subtitle ?? p.id}</small>
      </span>
    </span>
  );
}
export function Tabs({
  items,
  active,
  onChange,
}: {
  items: { label: string; path?: string }[];
  active: string;
  onChange?: (label: string) => void;
}) {
  return (
    <nav className="fp-tabs" aria-label="Section tabs">
      {items.map((t) =>
        t.path !== undefined ? (
          <Link
            key={t.label}
            href={portalUrl(t.path)}
            className={active === t.label ? "active" : ""}
            aria-current={active === t.label ? "page" : undefined}
          >
            {t.label}
          </Link>
        ) : (
          <button
            key={t.label}
            type="button"
            className={active === t.label ? "active" : ""}
            aria-pressed={active === t.label}
            onClick={() => onChange?.(t.label)}
          >
            {t.label}
          </button>
        ),
      )}
    </nav>
  );
}
export function SearchField({
  value,
  onChange,
  placeholder = "Search drivers by name, phone or ID",
}: {
  value: string;
  onChange: (s: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="fp-search">
      <Search size={19} />
      <input
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
export function Dropdown({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value?: string;
  onChange?: (s: string) => void;
}) {
  return (
    <select
      aria-label={label}
      className="fp-select"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
    >
      {options.map((s) => (
        <option key={s}>{s}</option>
      ))}
    </select>
  );
}
export function Field({
  label,
  defaultValue = "",
  type = "text",
  required = false,
  placeholder,
  children,
  value,
  onChange,
}: {
  label: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  children?: ReactNode;
  value?: string;
  onChange?: (value: string) => void;
}) {
  const id = useId();
  return (
    <label className="fp-field" htmlFor={id}>
      <span>
        {label}
        {required && <em>*</em>}
      </span>
      {children ?? (
        <input
          id={id}
          type={type}
          autoComplete={
            type === "password"
              ? "current-password"
              : type === "email"
                ? "email"
                : undefined
          }
          required={required}
          readOnly={value !== undefined && !onChange}
          placeholder={placeholder}
          {...(value === undefined ? { defaultValue } : { value })}
          onChange={(e) => onChange?.(e.target.value)}
        />
      )}
    </label>
  );
}
export function Info({ children }: { children: ReactNode }) {
  return (
    <div className="fp-info">
      <span aria-hidden="true">!</span>
      <div>{children}</div>
    </div>
  );
}
export function KeyValues({ items }: { items: [string, ReactNode][] }) {
  return (
    <dl className="fp-keyvalues">
      {items.map(([k, v]) => (
        <div key={k}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}
export function Steps({
  labels,
  current,
}: {
  labels: string[];
  current: number;
}) {
  return (
    <ol className="fp-steps">
      {labels.map((s, i) => (
        <li key={s} className={i <= current ? "active" : ""}>
          <span>{i < current ? "✓" : i + 1}</span>
          {s}
        </li>
      ))}
    </ol>
  );
}
export type TableRow = {
  key: string;
  cells: ReactNode[];
  search?: string;
  status?: string;
};
export function DataTable({
  headers,
  rows,
  title,
  action,
  pageSize = 5,
  paginate = true,
}: {
  headers: string[];
  rows: TableRow[];
  title?: string;
  action?: ReactNode;
  pageSize?: number;
  paginate?: boolean;
}) {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(pageSize);
  const pages = Math.max(1, Math.ceil(rows.length / size));
  const current = Math.min(page, pages);
  const shown = paginate
    ? rows.slice((current - 1) * size, current * size)
    : rows;
  return (
    <div className="fp-table-block">
      <Panel title={title} action={action} className="fp-table-panel">
        <div
          className="fp-table-scroll"
          tabIndex={0}
          role="region"
          aria-label={title ?? "Fleet records"}
        >
          <table>
            <thead>
              <tr>
                {headers.map((h, i) => (
                  <th key={`${h}-${i}`} scope="col">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shown.map((row) => (
                <tr key={row.key}>
                  {row.cells.map((cell, i) => (
                    <td key={i}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {!shown.length && (
            <p className="fp-empty">
              No matching records. Try a different search or filter.
            </p>
          )}
        </div>
      </Panel>
      {paginate && (
        <div className="fp-pagination">
          <span>
            Showing {rows.length ? (current - 1) * size + 1 : 0}–
            {Math.min(current * size, rows.length)} of {rows.length} records
          </span>
          <div>
            <button
              aria-label="Previous page"
              disabled={current === 1}
              onClick={() => setPage(current - 1)}
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i}
                className={current === i + 1 ? "active" : ""}
                aria-label={`Page ${i + 1}`}
                aria-current={current === i + 1 ? "page" : undefined}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              aria-label="Next page"
              disabled={current === pages}
              onClick={() => setPage(current + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <label>
            Rows per page{" "}
            <select
              value={size}
              onChange={(e) => {
                setSize(Number(e.target.value));
                setPage(1);
              }}
            >
              {[5, 10, 20].map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </label>
        </div>
      )}
    </div>
  );
}
export function ExportButton({
  rows,
  name = "fleet-report",
}: {
  rows: (string | number)[][];
  name?: string;
}) {
  const download = () => {
    const escape = (v: string | number) =>
      `"${String(v).replaceAll('"', '""')}"`;
    const blob = new Blob(
      ["Demo data\r\n" + rows.map((r) => r.map(escape).join(",")).join("\r\n")],
      { type: "text/csv;charset=utf-8" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <Button onClick={download}>
      <Download size={16} />
      Export
    </Button>
  );
}
export function Dialog({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    // Next's cached pages use Activity: their DOM may remain connected while
    // effects are deactivated. A hidden modal must not keep the new page inert.
    return () => {
      if (dialog.open) dialog.close();
    };
  }, []);
  return (
    <dialog
      className="fp-dialog"
      ref={dialogRef}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="fp-panel-heading">
        <h2>{title}</h2>
        <button aria-label="Close dialog" onClick={onClose}>
          <X size={20} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
export function DemoForm({
  children,
  onSave,
  button = "Save Changes",
}: {
  children: ReactNode;
  onSave?: () => void;
  button?: string;
}) {
  const notice = useNotice();
  function submit(e: FormEvent) {
    e.preventDefault();
    onSave?.();
    notice("Changes saved in this preview only. No live account was changed.");
  }
  return (
    <form onSubmit={submit} className="fp-form">
      {children}
      <div className="fp-form-actions">
        <Button type="submit">{button}</Button>
      </div>
    </form>
  );
}
