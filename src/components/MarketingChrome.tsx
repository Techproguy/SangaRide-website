"use client";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
export function MarketingChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return pathname === "/fleet/portal" || pathname.startsWith("/fleet/portal/")
    ? null
    : children;
}
