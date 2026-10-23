"use client";

import type { ReactNode } from "react";
import { driverApplyPath } from "@/lib/drive";
import { MarketLink } from "../Market";

/** Apply CTA that carries the selected market into driver onboarding. */
export function ApplyLink({ className, children }: { className: string; children: ReactNode }) {
  return (
    <MarketLink href={driverApplyPath} className={className}>
      {children}
    </MarketLink>
  );
}
