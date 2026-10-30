export { portalPaths } from "./fleet-portal-routes";
export { people, vehicles } from "./fleet-portal-fixtures";
export const portalUrl = (path = "") =>
  `/fleet/portal${path ? `/${path}` : ""}`;
