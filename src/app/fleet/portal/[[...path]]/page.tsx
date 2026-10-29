import { notFound } from "next/navigation";
import { FleetPortal } from "@/components/fleet-portal/FleetPortal";
import { portalPaths } from "@/lib/fleet-portal";
export function generateStaticParams() {
  return portalPaths.map((path) => ({ path: path ? path.split("/") : [] }));
}
export default async function PortalPage({
  params,
}: {
  params: Promise<{ path?: string[] }>;
}) {
  const path = (await params).path?.join("/") ?? "";
  if (!portalPaths.includes(path)) notFound();
  return <FleetPortal path={path} />;
}
