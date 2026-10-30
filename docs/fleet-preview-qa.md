# Fleet F01–F08 frontend QA

Delivery boundary: frontend preview only. Domain tests exercise sample rules; they are not production authorization, compliance, provider, ledger or security tests. No backend is introduced. No push or deployment is included.

## Review batches

| Batch | Delivered frontend | Review entry |
| --- | --- | --- |
| 0 | Screen coverage, reconciled Figma inventory, route/fixture separation, shared memory store, read-only Sanga service eligibility | /fleet/portal/workflows |
| 1 | Onboarding steps/status/review, recovery/reset/step-up dependency views, NG/US enrollment, shared state gallery | /fleet/portal/onboarding/start |
| 2 | Driver/invitation and vehicle lifecycle, assignment validation/conflicts, trip exception view | /fleet/portal/drivers |
| 3 | Commission-first illustrative breakdowns, future-term requests, destination dependency states, cash/remittance/reconciliation examples | /fleet/portal/payouts |
| 4 | Maintenance triage/resolution/holds, team role/scope and ownership protection | /fleet/portal/maintenance |
| 5 | Tickets/replies, sample attachments, report jobs/download counts, preferences, notifications, audit details | /fleet/portal/settings/support |

## Specification acceptance mapping

“Frontend-verifiable” covers rendering, input behavior and disclosure only. “Preview-only” covers local state rules. “Blocked by backend integration” must not be marked passed by a rendered route or sample transition.

| Test | Classification | Delivered evidence / remaining dependency |
| --- | --- | --- |
| T-001 | Frontend-verifiable | No editable service fares. Direct-API rejection/audit is blocked by backend integration. |
| T-002 | Preview-only | NGN commission-first allocation and reconciliation unit assertions; actual finance rules unconfigured. |
| T-003 | Preview-only | USD formatting/allocation assertions; no FX aggregation. |
| T-004 | Preview-only | Fleet-direct responsibility explanation; live remittance/ledger blocked. |
| T-005 | Preview-only | Platform responsibility explanation; real disbursement blocked. |
| T-006 | Preview-only | Cash collector, fee liability and retained-cash disclosure; no second payout action. |
| T-007 | Preview-only | Partial remittance reduces sample outstanding amount; overpayment rejected. |
| T-008 | Blocked by backend integration | Dispute request screen exists; compensating ledger entries require authoritative service. |
| T-009 | Preview-only | Change request never changes the illustrative historical allocation. |
| T-010 | Preview-only | Mode request/history is separate from existing trip snapshot; live cutover blocked. |
| T-011 | Blocked by backend integration | Only built-in masked destinations; live verification, step-up and holds unavailable. |
| T-012 | Blocked by backend integration | No webhook endpoint, provider callback or real ledger exists. |
| T-013 | Preview-only | Expired/revoked invitations cannot accept; explicit sample resend transition. |
| T-014 | Preview-only | Assignment eligibility rejects pending/expired driver evidence. |
| T-015 | Preview-only | Expired vehicle documents block sample assignments. |
| T-016 | Preview-only | Critical issue blocks assignment; resolution does not clear independent document holds. |
| T-017 | Preview-only | Operations cannot manage team/finance; team invitation protection. Real RBAC blocked. |
| T-018 | Preview-only | Last-owner demotion/removal rejected; sample transfer keeps an active owner. |
| T-019 | Blocked by backend integration | No real tenants/sessions. Unknown named record routes return 404; sample market scoping tested. |
| T-020 | Frontend-verifiable | US address/ZIP/phone labels and US-specific policy dependency; no mandatory Nigerian identity field. |
| T-021 | Frontend-verifiable | Selected currency/market visible; NGN/USD amounts formatted independently. |
| T-022 | Preview-only | Duplicate-submit lock, cancel warning and conflict handling; real lost-network/idempotency behavior blocked. |
| T-023 | Blocked by backend integration | Owner-only sample summary CSV; real scoped exports and signed download expiry unavailable. |
| T-024 | Blocked by backend integration | Built-in attachment states only. No file input, upload or scanning claim. |
| T-025 | Frontend-verifiable | Sample map/timeline explicitly stale/illustrative, with last-update time. |
| T-026 | Frontend-verifiable | Read-only Sanga service categories; participation unavailable pending D-06. |
| T-027 | Blocked by backend integration | Session-expired and verification views demonstrate dependencies; no fake session. |
| T-028 | Preview-only | Local mutations append audit references, versions and reasons; durable immutable server audit unavailable. |
| T-029 | Preview-only | Market-filtered lists/details and mutation checks; real cross-market permissions blocked. |
| T-030 | Frontend-verifiable | Fixed sample credentials, memory reset, built-in attachments; no production write adapters. |

## Validation commands

From `web`: `npm run test:preview`, `npm run lint`, `npm run build`, `npm run test:smoke`.

The preview tests cover allocation/rounding, cash partial remittance, invitation transitions, maintenance and document holds, assignment overlap, stale versions, ownership protection, role/market boundaries, adapter read copies, record routing and fresh-store reset.

The production smoke check exercises the built server, original Fleet handoff, unknown-page HTTP status and the existing 251 local Figma assets. Browser walkthrough results and responsive screenshots are recorded below after verification.

## Production dependencies / migration notes

- No database migration, auth cookie, token or external endpoint is added. The store exists only in the portal layout's memory; a reload starts over.
- Existing sample URLs remain valid. New generated record IDs are valid only within the active preview, and show a clear not-found view after reset. Unknown named IDs and invalid tabs are rejected by the route matcher.
- NG and US are independent sample scopes. US timezone is an illustrative New York default, not a national policy.
- Billing, providers, service opt-in, driver split overrides, dispatch overrides, real verification/upload/export and live financial actions remain feature-disabled with dependencies explained in the UI.
- See `fleet-coverage.md` for all 117 screen IDs and `fleet-figma-inventory.md` for exact design references. No new Figma frames have been authored.

## Rollback

Changes are isolated to portal components, its routing guard and shared portal fixtures. Revert the workflow-delivery change set to return to the original preview. Do not enable production adapters until server authorization and the blocked acceptance tests pass.

## Final validation — 30 October 2026

- `npm run lint`: passed.
- `npm run build`: passed with TypeScript checking and 170 generated pages (including framework entries).
- `npm run test:preview`: 15 tests passed on Node 24.5.0. Node emits a harmless module-format inference warning when loading TypeScript test modules; no package module mode was changed.
- `npm run test:smoke`: 165 production page routes, including 152 portal routes; original Fleet CTA/redirect, all rendered portal link targets, unknown-path/unknown-record/invalid-tab HTTP 404, removal of fare controls, and 251 existing local assets passed.
- Responsive browser checks: 48 cases (12 representative pages at 320, 390, 768 and 1430px), with no page overflow or broken loaded images after correcting the narrow vehicle hero. See [layout results](qa/fleet-preview/layout-results.json).

### Browser journeys verified

| Journey | Observed result |
| --- | --- |
| Five-step onboarding | Organization, representative and sample evidence values persisted; date retained through final review; submission ended pending with case history, not auto-approved |
| Driver invitation | New sample invitation resolved at its generated record URL; acceptance created a verification-pending driver visible after navigation |
| Assignment hold | Chinedu / Rav4 was rejected while the critical maintenance issue remained open; no assignment was created |
| Cancel and navigate | Discard confirmation closed; subsequent Payouts navigation worked with zero open native modals |
| Split request | 40/70 rejected; 40/60 with future effective date created a pending-review request; original sample allocation remained separate |
| Market / role | US selection hid an NG request; Operations saw finance permission denied; switching back restored the local record |
| Support | Sample ticket and follow-up reply persisted; corrected Back link returned to the support directory |
| Reset | Confirmation cleared generated ticket and cached local form state; zero open modals; subsequent Reports navigation worked |
| Report download | Sample CSV action recorded a download event in local history; Back returned to report jobs |
| Mobile menu | Escape closed the menu and restored body scrolling; browser Back left no open modal |

### Screenshots

| Review batch / supplement | Desktop | Mobile |
| --- | --- | --- |
| Foundation / hub | [Desktop](qa/fleet-preview/batch-0-desktop.png) | [Mobile](qa/fleet-preview/batch-0-mobile.png) |
| Onboarding | [Desktop](qa/fleet-preview/batch-1-desktop.png) | [Mobile](qa/fleet-preview/batch-1-mobile.png) |
| Supply registration | [Desktop](qa/fleet-preview/batch-2-desktop.png) | [Mobile](qa/fleet-preview/batch-2-mobile.png) |
| Finance / cash | [Desktop](qa/fleet-preview/batch-3-desktop.png) | [Mobile](qa/fleet-preview/batch-3-mobile.png) |
| Team governance | [Desktop](qa/fleet-preview/batch-4-desktop.png) | [Mobile](qa/fleet-preview/batch-4-mobile.png) |
| Reports | [Desktop](qa/fleet-preview/batch-5-desktop.png) | [Mobile](qa/fleet-preview/batch-5-mobile.png) |
| Shared system states | [Desktop](qa/fleet-preview/batch-6-desktop.png) | [Mobile](qa/fleet-preview/batch-6-mobile.png) |
| Read-only service eligibility | [Desktop](qa/fleet-preview/batch-7-desktop.png) | [Mobile](qa/fleet-preview/batch-7-mobile.png) |

Additional proof: [320px vehicle detail](qa/fleet-preview/vehicle-detail-320.png). These are browser viewport checks, not physical-device certification. No production backend, provider integration, account access, payment, message delivery or deployment was tested or claimed.

### Regression fixes made during verification

- Native dialogs now close in layout-effect cleanup when Next.js Activity hides a cached page; discarded forms cannot leave the new route inert.
- Reset remounts cached preview views; a completed create form also offers Start another preview.
- Form review captures date values and retains the application summary on its final step.
- Ticket/request/report detail Back links use canonical collection prefixes; smoke tests now audit all rendered portal links.
- Account controls share the toolbar layout instead of overlapping its reset control.
- Vehicle hero wraps and scales within a narrow card without cropping.
