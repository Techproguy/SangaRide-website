"use client";

import { ArrowRight, ChevronDown, Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { primaryNav, rideMenu } from "@/lib/content";
import { businessContactPath } from "@/lib/business";
import { driverApplyPath } from "@/lib/drive";
import { fleetApplyPath } from "@/lib/fleet";
import { CountrySwitcher } from "./CountrySwitcher";
import { Logo } from "./icons";

export function SiteHeader() {
  const [rideOpen, setRideOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const rideRef = useRef<HTMLLIElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);
  const mobileTrigger = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  // Short delay so the menu survives brief pointer exits between link and panel.
  const openRide = () => {
    clearTimeout(closeTimer.current);
    setRideOpen(true);
  };
  const closeRide = () => {
    closeTimer.current = setTimeout(() => setRideOpen(false), 150);
  };
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  // Audience pages swap the rider CTA for their own conversion.
  const cta = isActive("/drive")
    ? { label: "Apply to drive", href: driverApplyPath }
    : isActive("/business")
      ? { label: "Talk to Sales", href: businessContactPath }
      : isActive("/fleet")
        ? { label: "Become a Fleet Partner", href: fleetApplyPath }
        : { label: "Book a Ride", href: "/book" };
  const linkClass = (href: string) => (isActive(href) ? "text-brand-600" : "hover:text-brand-600");

  useEffect(() => {
    if (!rideOpen) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !rideRef.current?.contains(e.target as Node)) {
        setRideOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [rideOpen]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    const trigger = mobileTrigger.current;
    document.body.style.overflow = "hidden";
    const dialog = mobileRef.current;
    const focusable = () => Array.from(dialog?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex="0"]') ?? []).filter((el) => el.getClientRects().length > 0);
    focusable()[0]?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
      if (event.key !== "Tab") return;
      const elements = focusable();
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first?.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => { if (desktop.matches) setMobileOpen(false); };
    closeOnDesktop();
    desktop.addEventListener("change", closeOnDesktop);
    document.addEventListener("keydown", keydown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", keydown);
      desktop.removeEventListener("change", closeOnDesktop);
      trigger?.focus();
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="container-page flex h-16 items-center gap-6 whitespace-nowrap">
        <Link href="/" aria-label="Sanga Ride home">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden lg:ml-2 lg:block xl:ml-6">
          <ul className="flex items-center gap-5 text-[0.82rem] font-semibold text-ink xl:gap-7">
            <li ref={rideRef} className="relative" onMouseEnter={openRide} onMouseLeave={closeRide}>
              <span className="flex items-center gap-0.5">
                <Link href="/ride" aria-current={isActive("/ride") ? "page" : undefined} className={linkClass("/ride")}>
                  Ride
                </Link>
                <button
                  type="button"
                  aria-label="Ride menu"
                  aria-expanded={rideOpen}
                  onClick={() => setRideOpen((o) => !o)}
                  className="rounded p-0.5 hover:text-brand-600"
                >
                  <ChevronDown className={`h-3.5 w-3.5 transition ${rideOpen ? "rotate-180" : ""}`} />
                </button>
              </span>
              {rideOpen && (
                // pt-4 (not mt-4) keeps the gap inside the hover area.
                <div className="absolute top-full left-0 pt-4">
                  <div className="grid w-[30rem] grid-cols-2 gap-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-panel">
                    <div>
                      <p className="eyebrow mb-3 text-muted">Ride types</p>
                      <ul className="space-y-1">
                        {rideMenu.services.map((s) => (
                          <li key={s.href}>
                            <Link href={s.href} onClick={() => setRideOpen(false)} className="block rounded-lg px-2 py-1.5 hover:bg-brand-50">
                              <span className="block text-sm font-semibold">{s.label}</span>
                              <span className="block text-xs font-normal text-muted">{s.note}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="eyebrow mb-3 text-muted">Journeys</p>
                      <ul className="space-y-1">
                        {rideMenu.journeys.map((j) => (
                          <li key={j.href}>
                            <Link href={j.href} onClick={() => setRideOpen(false)} className="block rounded-lg px-2 py-2 text-sm font-semibold hover:bg-brand-50">
                              {j.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </li>
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={isActive(item.href) ? "page" : undefined} className={linkClass(item.href)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto hidden items-center gap-5 lg:flex">
          <div className="hidden xl:block">
            <CountrySwitcher />
          </div>
          <button type="button" aria-label="Search" className="hidden text-ink hover:text-brand-600 xl:block">
            <Search className="h-[18px] w-[18px]" />
          </button>
          <Link href="/sign-in" className="text-[0.82rem] font-semibold hover:text-brand-600">
            Sign in
          </Link>
          <Link
            href={cta.href}
            className="flex h-9 items-center gap-2 rounded-lg bg-brand-600 px-4 text-[0.82rem] font-semibold text-white transition hover:bg-brand-700"
          >
            {cta.label} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <button
          ref={mobileTrigger}
          type="button"
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(true)}
          className="ml-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-lg lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {mobileOpen && createPortal(
        <div ref={mobileRef} role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-50 flex h-dvh flex-col bg-white lg:hidden">
          <div className="container-page flex h-16 shrink-0 items-center justify-between border-b border-slate-100">
            <Logo />
            <button type="button" aria-label="Close menu" onClick={() => setMobileOpen(false)} className="flex h-11 w-11 items-center justify-center rounded-lg">
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav aria-label="Mobile" className="container-page min-h-0 flex-1 overscroll-contain overflow-y-auto py-5">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
              {[{ label: "Ride", href: "/ride" }, ...primaryNav].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`flex min-h-14 items-center rounded-lg py-3 text-lg font-semibold transition hover:text-brand-600 ${isActive(item.href) ? "text-brand-600" : ""}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="flex min-w-0 items-center">
                <CountrySwitcher align="right" up compact />
              </li>
            </ul>
          </nav>
          <div className="container-page grid shrink-0 grid-cols-[80px_minmax(0,1fr)] gap-3 border-t border-slate-100 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <Link href="/sign-in" onClick={() => setMobileOpen(false)} className="flex min-h-12 items-center justify-center rounded-xl border border-slate-200 text-sm font-semibold">
              Sign in
            </Link>
            <Link
              href={cta.href}
              onClick={() => setMobileOpen(false)}
              className="flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-xl bg-brand-600 px-3 py-2 text-center text-xs font-semibold text-white sm:text-sm"
            >
              {cta.label} <ArrowRight className="h-4 w-4 shrink-0" />
            </Link>
          </div>
        </div>, document.body
      )}
    </header>
  );
}
