# Fleet portal frontend

Source: [Sanga Ride Figma, fleet management web app](https://www.figma.com/design/PzgrwrII0hGTJgfejMoJdU/Sanga-Ride?node-id=922-13307).

The public Fleet hero, closing CTA, and route-specific header action use `fleetApplyPath`, now `/fleet/portal/login`. `/fleet/apply` redirects there for older links. The portal has its own navy sidebar, Work Sans typography, white panels, and mobile navigation; marketing navigation and the public footer are excluded.

## Original design baseline

The original 41 full-page desktop frames were represented by 40 portal routes. The two support-ticket layout variants share the same conversation route. Additional local states (search results, forms, dialogs, mobile menu) use the same visual system. The source file supplies desktop layouts; mobile layouts adapt them with two-column statistic cards, stacked panels, and contained table scrolling.

| Routes beneath `/fleet/portal` | Figma node(s) |
| --- | --- |
| `/login` | `922:20482` |
| `/` | `922:18639` |
| `/drivers`, `/drivers/chinedu`, `/drivers/invite` | `922:18970`, `922:19307`, `922:20302` |
| `/vehicles` | `922:19982` |
| `/vehicles/rav4/overview`, `/documents`, `/maintenance`, `/assignments`, `/trips`, `/earnings` | `922:13308`, `922:13588`, `922:13879`, `922:14182`, `922:14460`, `922:14747` |
| `/operations`, `/operations/trp-99321` | `922:15039`, `922:15908` |
| `/maintenance`, `/maintenance/iss-2711` | `922:15341`, `922:15642` |
| `/earnings` | `922:16161` |
| `/payouts`, `/payouts/destination`, `/payouts/destination/change` | `922:16453`, `922:17630`, `922:17841` |
| `/payouts/settlement`, `/payouts/settlement/confirm`, `/payouts/split` | `922:18029`, `922:18255`, `922:18474` |
| `/invitations` | `922:19655` |
| `/reports`, `/reports/earnings`, `/reports/performance` | `922:17367`, `922:20548`, `922:20885` |
| `/team`, `/team/aisha` | `922:16808`, `922:17128` |
| `/settings`, `/settings/profile`, `/settings/services`, `/settings/policies` | `922:21210`, `922:21414`, `922:21592`, `922:21814` |
| `/settings/billing`, `/settings/notifications`, `/settings/integrations` | `922:21970`, `922:22231`, `922:22454` |
| `/settings/support`, `/settings/support/sr-202612` | `922:22671`, `923:8748`, `924:302` |
| `/settings/audit`, `/notifications` | `924:574`, `924:1262` |

## Implementation

- `src/app/fleet/portal/[[...path]]/page.tsx`: statically enumerated routes. `src/proxy.ts` rejects unknown portal paths with HTTP 404 before streamed rendering begins.
- `src/components/fleet-portal/FleetPortal.tsx`: independent shell, login, navigation, mobile dialog, and preview notices.
- `ui.tsx`: shared semantic forms, panels, tables, pagination, switches, dialogs, local CSV downloads, and original Figma assets.
- `Overview.tsx`, `Directory.tsx`, `Details.tsx`, `Finance.tsx`, `Settings.tsx`: page families and local interactive states.
- `src/app/fleet/portal/portal.css`: scoped layout and responsive styling.
- `src/lib/fleet-portal.ts`: route list and sample records.
- `src/lib/fleet-portal-assets.json`: local asset aliases. Original SVGs are preserved; raster assets are optimized to WebP without cropping. No temporary Figma URLs are used at runtime.

## F01–F08 workflow completion

The portal now extends the original baseline with record-based routes, a shared layout-owned in-memory store, a visible reset control, market/role scenarios, and the F01–F08 workflow hub at `/fleet/portal/workflows`. See [screen coverage](fleet-coverage.md), [Figma inventory reconciliation](fleet-figma-inventory.md), and [QA boundaries](fleet-preview-qa.md). Fleet-editable fares have been removed. Financial changes are requests; sample allocation snapshots remain separate.

## Preview boundaries

This is a frontend implementation, not a connected fleet service. The login form and Google/recovery actions explain that authentication is unavailable. An explicit preview link opens sample fleet data. No fake session, token, or authentication bypass is created.

Search, status filters, pagination, tabs, map zoom/driver popups, editable rules, split calculations, notification switches, CSV downloads, and support-message drafts work locally. New workflow records persist while navigating and reset on refresh or explicit reset; chart/view controls remain local. New attachment controls use built-in filenames and never accept real files. Invitations, banking verification, payouts, subscription changes, integrations, and support delivery do not call external services or claim successful live actions.

Before production: connect real authentication and server authorization; tenant-scoped fleet APIs and storage; secure document handling; invitation delivery; provider-backed maps; banking/payout verification; permissions enforcement; and support/integration services. Replace all Figma sample records and dates with authorized live data.

## Original browser verification (baseline)

- Verified the Fleet CTA → portal login → explicit preview handoff.
- Checked all 40 portal routes at a 390px viewport for rendering, page overflow, and broken loaded images. Retested the driver profile after fonts/layout settled.
- Checked login, dashboard, driver profile, operations, settlement confirmation, integrations, and support conversation at 320px. Tables/tabs scroll inside their containers.
- Verified mobile navigation opens/closes, locks/restores background scrolling, and follows links.
- Verified driver search/status filtering, default split updates (30%/70%), adding a local rule, and adding a local support reply with truthful preview notices.
- Compared desktop login/dashboard against the Figma reference at 1430px. Physical phones and live backend integrations have not been tested.

Run `npm run test:preview`, `npm run lint`, `npm run build`, then `npm run test:smoke` from `web/` for validation. The smoke check starts and stops its own production server on a free localhost port, checks all built page routes, verifies the Fleet handoff/legacy redirect and an unknown-route HTTP 404, and checks every portal asset is local and non-empty.
