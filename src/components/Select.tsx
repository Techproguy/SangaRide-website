"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";

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
    list.current?.focus({ preventScroll: true });
    const close = (e: globalThis.PointerEvent) => {
      const target = e.target as Node;
      if (!root.current?.contains(target) && !list.current?.contains(target)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  // Render outside cards/sections so overflow and backdrop-filter cannot clip
  // the menu. Keep it anchored while the page or mobile viewport moves.
  useLayoutEffect(() => {
    if (!open) return;
    const trigger = button.current;
    const popup = list.current;
    if (!trigger || !popup) return;

    const position = () => {
      const rect = trigger.getBoundingClientRect();
      const viewport = window.visualViewport;
      const viewportTop = viewport?.offsetTop ?? 0;
      const viewportLeft = viewport?.offsetLeft ?? 0;
      const viewportWidth = viewport?.width ?? document.documentElement.clientWidth;
      const viewportBottom = viewportTop + (viewport?.height ?? window.innerHeight);
      const gap = 8;
      const below = Math.max(0, viewportBottom - rect.bottom - gap * 2);
      const above = Math.max(0, rect.top - viewportTop - gap * 2);
      const width = Math.min(rect.width, viewportWidth - gap * 2);
      popup.style.width = `${width}px`;
      const desiredHeight = Math.min(popup.scrollHeight + 2, 256);
      const opensAbove = below < Math.min(desiredHeight, 132) && above > below;
      popup.style.maxHeight = `${Math.min(256, opensAbove ? above : below)}px`;
      popup.style.left = `${Math.max(viewportLeft + gap, Math.min(rect.left, viewportLeft + viewportWidth - width - gap))}px`;
      popup.style.top = `${opensAbove ? rect.top - gap - popup.getBoundingClientRect().height : rect.bottom + gap}px`;
      popup.style.visibility = "visible";
    };

    position();
    window.addEventListener("scroll", position, { capture: true, passive: true });
    window.addEventListener("resize", position);
    window.visualViewport?.addEventListener("resize", position);
    window.visualViewport?.addEventListener("scroll", position);
    const observer = new ResizeObserver(position);
    observer.observe(trigger);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", position, true);
      window.removeEventListener("resize", position);
      window.visualViewport?.removeEventListener("resize", position);
      window.visualViewport?.removeEventListener("scroll", position);
    };
  }, [open, options.length]);

  useEffect(() => {
    if (open) list.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  function show() {
    setActive(selectedIndex);
    setOpen(true);
  }

  function hide(refocus = true) {
    setOpen(false);
    if (refocus) button.current?.focus({ preventScroll: true });
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
      hide();
    } else if (e.key.length === 1) {
      const now = e.timeStamp;
      typed.current = { text: (now - typed.current.at < 600 ? typed.current.text : "") + e.key.toLowerCase(), at: now };
      const match = options.findIndex((o) => !o.disabled && o.label.toLowerCase().startsWith(typed.current.text));
      if (match >= 0) setActive(match);
    }
  }

  return (
    <div ref={root} className="relative min-w-0">
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

      {open && createPortal(
        <ul
          ref={list}
          id={listId}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={buttonId}
          aria-activedescendant={`${listId}-${active}`}
          onKeyDown={onListKey}
          className="fixed z-[60] overflow-y-auto overscroll-contain rounded-2xl border border-slate-100 bg-white p-1.5 shadow-panel focus:outline-none"
          style={{ visibility: "hidden", animation: "dropdown 140ms ease-out" }}
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
                className={`flex min-h-11 cursor-pointer items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-[0.88rem] transition-colors ${
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
        </ul>, document.body
      )}
    </div>
  );
}
