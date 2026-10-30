import { notFound } from "next/navigation";
import { FleetPortal } from "@/components/fleet-portal/FleetPortal";
import { portalPaths, isPortalPath } from "@/lib/fleet-portal-routes";
export function generateStaticParams() {
  return portalPaths.map((path) => ({ path: path ? path.split("/") : [] }));
}
export default async function PortalPage({
  params,
}: {
  params: Promise<{ path?: string[] }>;
}) {
  const path = (await params).path?.join("/") ?? "";
  if (!isPortalPath(path)) notFound();
  return <FleetPortal path={path} />;
}
