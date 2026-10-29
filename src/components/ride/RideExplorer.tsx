"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { rides } from "@/lib/content";
import { FareExplainer } from "./FareExplainer";
import { RideBookingCTA } from "./RideBookingCTA";
import { RideComparison } from "./RideComparison";
import { RideShowroom } from "./RideShowroom";

/**
 * The whole Ride page body. The selected service lives in `?service=` so it can be deep-linked
 * and shared; an unknown value falls back to the default.
 */
export function RideExplorer({ serviceId }: { serviceId?: string }) {
  const selected = rides.find((r) => r.id === serviceId) ?? rides[0];
  return <RidePageBody selected={selected} />;
}

export function RideExplorerFromUrl() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const selected = rides.find((r) => r.id === params.get("service")) ?? rides[0];

  function onSelect(id: string) {
    router.replace(`${pathname}?service=${id}`, { scroll: false });
  }

  return <RidePageBody selected={selected} onSelect={onSelect} />;
}

function RidePageBody({ selected, onSelect }: { selected: (typeof rides)[number]; onSelect?: (id: string) => void }) {
  return (
    <>
      <RideShowroom rides={rides} selected={selected} onSelect={onSelect} />
      <div className="flex flex-col gap-14 pt-10 pb-12 sm:gap-28 sm:pt-16 sm:pb-20 lg:gap-32 lg:pt-20 lg:pb-28">
        <RideComparison
          rides={rides}
          selected={selected}
          onSelect={
            onSelect &&
            ((id) => {
              onSelect(id);
              window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
            })
          }
        />
        <FareExplainer serviceId={selected.id} />
        <RideBookingCTA serviceId={selected.id} />
      </div>
    </>
  );
}
