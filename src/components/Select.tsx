"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export type SelectOption = { value: string; label: string; disabled?: boolean };

/**
 * Styled replacement for a native <select>: a button that opens a listbox popover.
 * Keyboard: Enter/Space/arrows open; arrows, Home/End and type-ahead move; Enter selects; Escape closes.
 */
export function Select({
  id,
  value,
  onChange,
  options,
  label,
  className,
  renderValue,
  chevron = true,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  /** Accessible name when there's no visible label pointing at `id`. */
  label?: string;
  className: string;
  /** Custom trigger contents; defaults to the selected label. */
  renderValue?: (label: string, open: boolean) => ReactNode;
  chevron?: boolean;
}) {
  const autoId = useId();
  const buttonId = id ?? `${autoId}-button`;
  const listId = `${autoId}-list`;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const typed = useRef({ text: "", at: 0 });

  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value));
  const selected = options[selectedIndex];

  useEffect(() => {
    if (!open) return;
    list.current?.focus();
    const close = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  useEffect(() => {
    if (open) list.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  function show() {
    setActive(selectedIndex);
    setOpen(true);
  }

  function hide(refocus = true) {
    setOpen(false);
    if (refocus) button.current?.focus();
  }

  function choose(i: number) {
    const o = options[i];
    if (!o || o.disabled) return;
    onChange(o.value);
    hide();
  }

  /** Next enabled option from `from` in direction `dir`, staying put at the ends. */
  function step(from: number, dir: 1 | -1) {
    for (let i = from + dir; i >= 0 && i < options.length; i += dir) if (!options[i].disabled) return i;
    return from;
  }

  function onButtonKey(e: KeyboardEvent) {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      show();
    }
  }

  function onListKey(e: KeyboardEvent) {
    const moves: Record<string, () => number> = {
      ArrowDown: () => step(active, 1),
      ArrowUp: () => step(active, -1),
      Home: () => step(-1, 1),
      End: () => step(options.length, -1),
    };
    if (moves[e.key]) {
      e.preventDefault();
      setActive(moves[e.key]());
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      choose(active);
    } else if (e.key === "Escape") {
      e.preventDefault();
      hide();
    } else if (e.key === "Tab") {
      hide(false);
    } else if (e.key.length === 1) {
      const now = e.timeStamp;
      typed.current = { text: (now - typed.current.at < 600 ? typed.current.text : "") + e.key.toLowerCase(), at: now };
      const match = options.findIndex((o) => !o.disabled && o.label.toLowerCase().startsWith(typed.current.text));
      if (match >= 0) setActive(match);
    }
  }

  return (
    <div ref={root} className="relative">
      <button
        ref={button}
        id={buttonId}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={label ? `${label}: ${selected?.label}` : undefined}
        onClick={() => (open ? hide() : show())}
        onKeyDown={onButtonKey}
        className={className}
      >
        {renderValue ? renderValue(selected?.label ?? "", open) : <span className="truncate">{selected?.label}</span>}
        {chevron && <ChevronDown className={`h-4 w-4 shrink-0 transition ${open ? "rotate-180" : ""}`} aria-hidden="true" />}
      </button>

      {open && (
        <ul
          ref={list}
          id={listId}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={buttonId}
          aria-activedescendant={`${listId}-${active}`}
          onKeyDown={onListKey}
          className="absolute top-full left-0 z-50 mt-2 max-h-64 w-max min-w-full overflow-y-auto rounded-2xl border border-slate-100 bg-white p-1.5 shadow-panel focus:outline-none"
          style={{ animation: "dropdown 140ms ease-out" }}
        >
          {options.map((o, i) => {
            const isSelected = i === selectedIndex;
            return (
              <li
                key={o.value}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={isSelected}
                aria-disabled={o.disabled || undefined}
                onMouseEnter={() => !o.disabled && setActive(i)}
                onClick={() => choose(i)}
                className={`flex cursor-pointer items-center justify-between gap-6 rounded-xl px-3 py-2.5 text-[0.88rem] transition-colors ${
                  o.disabled
                    ? "cursor-not-allowed text-slate-400"
                    : i === active
                      ? "bg-brand-50 text-brand-700"
                      : "text-ink"
                } ${isSelected ? "font-semibold" : "font-medium"}`}
              >
                {o.label}
                <Check className={`h-4 w-4 shrink-0 text-brand-600 ${isSelected ? "" : "invisible"}`} aria-hidden="true" />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
