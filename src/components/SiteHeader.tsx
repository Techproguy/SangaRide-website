"use client";

import { ArrowRight, ChevronDown, Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
    document.body.style.overflow = mobileOpen ? "hidden" : "";
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
          type="button"
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(true)}
          className="ml-auto lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {mobileOpen && (
        <div role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-50 flex flex-col bg-white lg:hidden">
          <div className="container-page flex h-16 items-center justify-between border-b border-slate-100">
            <Logo />
            <button type="button" aria-label="Close menu" onClick={() => setMobileOpen(false)}>
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav aria-label="Mobile" className="container-page flex-1 overflow-y-auto py-6">
            <p className="eyebrow mb-2 text-muted">Ride types & journeys</p>
            <ul className="mb-6 grid grid-cols-2 gap-1">
              {[...rideMenu.services, ...rideMenu.journeys].map((s) => (
                <li key={s.href}>
                  <Link href={s.href} onClick={() => setMobileOpen(false)} className="block rounded-lg py-2 text-[0.95rem] font-semibold">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="space-y-1 border-t border-slate-100 pt-4">
              {[{ label: "Ride", href: "/ride" }, ...primaryNav].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`block py-2.5 text-lg font-bold ${isActive(item.href) ? "text-brand-600" : ""}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <CountrySwitcher align="left" />
            </div>
          </nav>
          <div className="container-page grid grid-cols-2 gap-3 border-t border-slate-100 py-4">
            <Link href="/sign-in" className="flex h-12 items-center justify-center rounded-xl border border-slate-200 font-semibold">
              Sign in
            </Link>
            <Link
              href={cta.href}
              onClick={() => setMobileOpen(false)}
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-600 font-semibold text-white"
            >
              {cta.label} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
