import type { Metadata } from "next";
import { Suspense } from "react";
import { RideExplorer, RideExplorerFromUrl } from "@/components/ride/RideExplorer";

export const metadata: Metadata = {
  title: "Ride options",
  description: "Explore and compare Sanga Go, Plus, XL, Lux, Moto and Assist, and see how fares are estimated.",
};

export default function RidePage() {
  return (
    <main>
      {/* The static shell shows the default ride; the URL's ?service= takes over once it is read. */}
      <Suspense fallback={<RideExplorer />}>
        <RideExplorerFromUrl />
      </Suspense>
    </main>
  );
}
