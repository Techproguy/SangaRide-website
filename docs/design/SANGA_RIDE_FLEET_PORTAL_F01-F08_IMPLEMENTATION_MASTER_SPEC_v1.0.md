# SANGA RIDE — FLEET WEB PORTAL
## F01–F08 Comprehensive Product, UX, Engineering & QA Implementation Specification
**Version:** 1.0 — Developer handoff / implementation baseline  
**Date:** 30 October 2026  
**Status:** Implementation specification; product decisions explicitly marked **LOCKED**, unresolved policy points marked **REQUIRES APPROVAL**  
**Scope:** **Fleet Web Portal only**. This document intentionally excludes corrections to the public Sanga Ride marketing website.  
**Markets:** Nigeria (NG) and United States (US) **from Day 1**.  
**Reference Figma:** https://www.figma.com/design/PzgrwrII0hGTJgfejMoJdU/Sanga-Ride?node-id=922-13307  
**Current codebase:** https://github.com/Techproguy/SangaRide-website  
**Current route namespace:** `/fleet/portal`

> **How to use this file:** This is the implementation source of truth for completing the Fleet Portal experience. Use the existing Figma frames and code as the visual and navigational foundation, then add the missing states, workflows, backend integrations, permissions, market adapters and tests below. Do not interpret a designed screen or an existing route as proof of a complete flow. No invented prices, fees, service availability, licensing status, banking details, SLA, subscription plan, or production data may be shipped.

---

# 0. EXECUTIVE IMPLEMENTATION DIRECTIVE

Build an **operational fleet-management product**, not merely a navigable Figma preview. Fleet owners and their authorized staff must be able to onboard a verified fleet, manage drivers and vehicles, perform eligible assignments, monitor trips, handle maintenance, view immutable earnings and settlement records, manage payout destinations and permissions, request reports, open support tickets, and inspect audit history.

## 0.1 Non-negotiable product decisions — LOCKED

**LOCK-01 — Sanga alone controls rider pricing.** Fleet partners, fleet owners, fleet managers, drivers and fleet staff **must not** set, edit, override or publish rider fares, base prices, per-mile/per-kilometre rates, multipliers, surcharges, service-type prices, promotional discounts or platform fees. All pricing comes from Sanga-controlled pricing services and market/zone configuration. The existing Figma **Service Types** frame (`FLT 51`, node `922:21592`) includes editable “Base Price” and “Price Type” controls: **remove/replace these** with a read-only display of Sanga-defined service categories and eligibility/participation controls only where authorized. Fleet service opt-in must not imply independent ability to activate an unapproved service.

**LOCK-02 — Commission-first settlement.** For every eligible trip, Sanga's commission/fees are calculated and deducted **before** the remaining distributable amount is split between fleet and driver. Fleet/driver percentages operate on the **post-Sanga amount**, never on the gross fare. The calculation must be versioned, traceable and visible to authorized users. Never silently change historical results when configuration changes.

**LOCK-03 — Two supported settlement operating models.** Maintain a country-aware, controlled distinction between **Sanga-managed/platform settlement** and **fleet-managed/direct settlement**. Both use the same commission-first ledger and split basis. The settlement mode determines *who is responsible for remitting the driver share and through which payment rail*, not who owns pricing or whether Sanga's commission is optional. Switching modes is an approval-controlled, future-effective operation; it must not rewrite completed or in-flight trips.

**LOCK-04 — Cash handling and liability.** Where cash is enabled by Sanga for a market/zone, cash collected by a driver or fleet must generate a **receivable/obligation to Sanga for Sanga's commission**, plus the applicable driver/fleet internal allocation and a reconciliation trail. No cash transaction may be presented as fully settled merely because the passenger paid cash. Track collection, remittance, offsets, overdue liability, disputes and resolution without double-counting revenue or payouts. Cash may be disabled by market, zone, service, driver or fleet configuration.

**LOCK-05 — Nigeria and United States from Day 1.** Implement genuine market-aware data models, APIs, compliance hooks, money, addresses, dates, phone numbers, tax/identity/vehicle-document requirements, payout rails, units and permissions. NGN and USD are separate currencies; **never add them together** in a single amount or convert them using a fabricated exchange rate.

**LOCK-06 — Permissions and auditability.** All financial, identity, vehicle-eligibility and team-access changes require server-side authorization; sensitive actions require step-up verification/approval according to Sanga policy. Record append-only audit events with actor, target, before/after references, reason, timestamp, market and correlation ID.

**LOCK-07 — Truthful status.** Do not imply that a fleet, driver, vehicle, payout destination, service or zone is approved/available until the authoritative backend says so. UI demos and placeholder numbers must be clearly labelled as non-production and never leak into production dashboards.

**LOCK-08 — Historical integrity.** The terms applied to each trip (pricing version, commission version, settlement mode, split version, payment method, market/currency) are captured at the relevant transaction boundary and retained. Corrections occur through compensating ledger entries, not destructive edits.

## 0.2 Source-backed baseline (as inspected)

The Figma page `922:13307` contains **45 top-level frames and one rectangle**, including: `Desktop - 2` login; `Desktop - 3` dashboard; `Desktop - 4` drivers; `Desktop - 7` driver performance; `Desktop - 9` invitations; `Desktop - 12` vehicles; `Desktop - 11` invite driver; `FLT 011/012/45/46/47` vehicle details tabs; `FLT 013/014` operations; `FLT 44/48` maintenance; `FLT 015` earnings; `FLT 016/35/37/38/40/42` payouts and settlement; `FLT 017/018` team; `FLT 019/021/22` reports; `FLT 32/33/51/50/52/39/41/43/55/56/53/54` settings, help, audit, notifications and tickets. Names are Figma labels, **not** completeness certifications.

The GitHub route registry `src/lib/fleet-portal.ts` already lists preview routes for dashboard, login, drivers, vehicles and six vehicle detail tabs, operations, maintenance, earnings, payouts/destination/settlement/split, invitations, reports, team, settings, notifications and a support-ticket detail. The main UI entry is `src/components/fleet-portal/FleetPortal.tsx`; routing is in `src/app/fleet/portal/[[...path]]/page.tsx`. Current sample people/vehicles are hard-coded in `src/lib/fleet-portal.ts`. **Replace fixture-backed operational behavior with authenticated APIs; preserve an explicitly separated preview mode only if needed.**

## 0.3 Definitions

- **Gross trip fare:** Rider-facing fare components and adjustments, in trip currency, before allocation.
- **Sanga fee:** Applicable Sanga platform commission and other expressly configured platform charges; record each component separately.
- **Distributable net:** Ledger-defined amount remaining after Sanga deductions and any specifically authorized trip-level adjustments; not automatically the same as cash on hand.
- **Fleet share / Driver share:** Percentages or approved contract allocations applied to distributable net.
- **Cash liability:** Amount a cash-collecting party owes another party (including Sanga commission) pending reconciliation.
- **Platform settlement:** Sanga/payment partners perform disbursements to eligible recipients.
- **Fleet-direct settlement:** Fleet is responsible for eligible driver remittance under a controlled, verified agreement; Sanga commission remains owed and accounted for first.
- **Effective-dated:** Change applies only from a server-confirmed timestamp, subject to trip snapshot rules.
- **Verified:** Verified by Sanga's authoritative verification/compliance workflow; a UI selection is not verification.

---

# 1. DELIVERY ARCHITECTURE, CONVENTIONS AND GUARDRAILS

## 1.1 Build strategy

1. Inventory and reuse the existing Figma screens, portal layout, components and assets. Do **not** rewrite working pages for stylistic reasons.
2. Introduce a proper domain/API layer, authentication and authorization. Keep UI components presentation-oriented.
3. Implement F01–F08 in dependency order, with real loading/error/empty/permission states and route guards.
4. Run all finance calculations in a tested server-side domain service or trusted backend; client-side examples are non-authoritative.
5. Keep a **preview/demo namespace or mode** clearly segregated from production records, with no production write access.
6. Use server-provided statuses, permissions, feature flags, available services and available actions rather than hard-coded assumptions.
7. Treat the Figma as visual reference; where a design conflicts with locked product policy, **product policy wins** and the frame must be corrected.

## 1.2 Required shared UX patterns

For every list/detail/form/workflow: initial loading/skeleton; empty state; search-no-results; network error with safe retry; 401 session expired; 403 insufficient permission; 404 not found or inaccessible; 409 stale version/conflict; validation errors adjacent to fields; pending/submitting; success confirmation with reference ID; cancellation/back behavior; duplicate-submit protection; unsaved-change warning; server-authoritative timestamps and amounts; accessible keyboard/focus/ARIA behavior.

Responsive target: desktop-first operational console, tablet usable, narrow/mobile with deliberate simplified tables and safe action menus; no horizontal overflow for critical actions. No destructive action hidden behind hover only.

## 1.3 Canonical state and money rules

- Store money in **integer minor units** plus ISO currency (`NGN`, `USD`), with explicit market/zone, calculation precision and rounding rule. Never use JS floating point as the ledger source of truth.
- Do not mix currencies in totals. If a fleet operates across countries, show currency-specific totals and explicit breakdowns; FX reporting requires an approved rate source, timestamp and policy.
- Use IANA timezone for market/zone and UTC timestamps in persistence. Display timezone on financial and compliance screens.
- Driver, vehicle, organization, settlement and document statuses must be modeled as finite-state machines with explicit permitted transitions.
- Apply idempotency keys to financial writes, invitations, onboarding submissions, assignments, payout changes and ticket creation.
- Use optimistic concurrency/version checks on mutable configurations. A stale browser must not overwrite a newer approval or split.

## 1.4 Required primary entities

`FleetOrganization`, `FleetMarketEnrollment`, `FleetVerificationCase`, `FleetUser`, `FleetMembership`, `Role`, `PermissionGrant`, `Driver`, `DriverInvitation`, `DriverFleetMembership`, `Vehicle`, `VehicleDocument`, `VehicleInspection`, `DriverVehicleAssignment`, `Trip`, `TripSnapshot`, `MaintenanceIssue`, `MaintenanceEvent`, `ServiceEligibility`, `PricingVersion` (Sanga-owned/read-only), `CommissionVersion` (Sanga-owned), `SettlementAgreement`, `SettlementModeChangeRequest`, `SplitRuleVersion`, `DriverSplitOverride`, `PayoutDestination`, `PayoutDestinationVerification`, `LedgerAccount`, `LedgerEntry`, `Payout`, `CashCollection`, `CashLiability`, `Remittance`, `Reconciliation`, `Adjustment`, `Dispute`, `ReportJob`, `SupportTicket`, `SupportMessage`, `Notification`, `AuditEvent`, `FileAttachment`.

All operational records require stable IDs; scope by organization and market where appropriate. Never trust a client-provided `fleet_id` without membership/permission validation.

## 1.5 Role and permission baseline

Proposed roles (exact names configurable): **Fleet Owner**, **Fleet Admin/Manager**, **Operations Manager**, **Driver Manager**, **Finance Manager**, **Maintenance Manager**, **Support/Read-only Analyst**. Sanga internal **Compliance/Finance/Support/Admin** roles are separate platform identities and must not inherit fleet permissions automatically.

Server-enforced granular permissions include `fleet.read`, `fleet.manage`, `driver.read/invite/manage`, `vehicle.read/create/manage/approve-request`, `assignment.manage`, `trip.read`, `maintenance.manage`, `finance.read`, `payout.destination.request`, `settlement.mode.request`, `split.request`, `finance.export`, `team.invite/manage`, `support.create/read`, `audit.read/export`, `settings.manage`. Only Sanga-authorized roles can `pricing.manage`, `commission.manage`, `market.approve`, `verification.approve`, `financial.change.approve`. The portal must not expose or honor pricing mutation APIs for fleet roles.

For each permission: enforce on API and action level; hide or disable unauthorized UI with explanatory copy; do not reveal other fleets' records via search, exports, notifications or attachments.

## 1.6 Data and integration boundaries

**Sanga-controlled services:** Identity/OTP or approved authentication provider; organization verification; driver verification; vehicle eligibility; market/zone configuration; ride category and pricing catalog; trips; payment orchestration; ledger/settlement; payout providers; notifications; file storage; audit; support; analytics.

Do not implement a new shadow payment ledger in frontend code. Where a service is not available, show a clearly labelled **not connected / unavailable** state and preserve a typed integration boundary; do not simulate financial success.

## 1.7 API conventions (illustrative contracts, not existing endpoints)

`GET /fleet/me`, `/fleet/{id}/overview`, `/drivers`, `/vehicles`, `/trips`, `/maintenance`, `/earnings`, `/settlements`, `/payouts`, `/cash-liabilities`, `/reports`, `/team`, `/audit`, `/notifications`; `POST /fleet/onboarding`, `/drivers/invitations`, `/vehicles`, `/assignments`, `/maintenance/issues`, `/payout-destination/change-requests`, `/settlement-mode/change-requests`, `/split/change-requests`, `/support/tickets`; corresponding scoped detail, approve, cancel and retry endpoints.

Use the backend team's established versioned API conventions. The route names here define **capabilities**, not mandated URL spelling. For mutations return `{id, status, version, createdAt, correlationId}` plus a typed error; for financial reads return currency, components, calculation/snapshot versions and settlement responsibility.

---

# 2. F01 — FLEET IDENTITY, REGISTRATION & ONBOARDING

**Objective:** No fleet reaches operational status without authorized identity, organization setup, market enrollment and required verification.

## F01.1 Design screen inventory to create/complete

| Screen ID | Screen / state | Required content and behavior |
|---|---|---|
| F01-01 | Sign in | Work email or approved identifier, password/SSO if supported, show/hide password, validation, remember-device policy, accessible errors. Existing `Desktop - 2` is starting point. |
| F01-02 | Forgot password | Request recovery with neutral anti-enumeration response; rate limits. |
| F01-03 | Reset password | Time-limited token, password policy, expired/used token, success and forced session rotation. |
| F01-04 | Step-up verification | OTP/passkey/MFA or configured challenge before sensitive changes; timeout, retry limits. |
| F01-05 | Session expired / locked | Reauthentication, safe redirect back to intended page; preserve only non-sensitive draft where allowed. |
| F01-06 | Fleet application entry | Organization type, intended market(s), operating model, privacy/consent notices. |
| F01-07 | Organization profile | Legal and trading names, registration data, business address, contact, authorized representative, market-specific fields. |
| F01-08 | Owner/representative verification | Identity and authority evidence; NG/US requirements supplied by compliance policy, not hard-coded one-country assumptions. |
| F01-09 | Document upload | Allowed types/size, secure upload, virus scanning, progress, replacement, expiry and privacy notice. |
| F01-10 | Review & submit | Full summary, acknowledgements, corrections, submission idempotency. |
| F01-11 | Application pending | Case/reference ID, current stage, no invented SLA; read-only access to status. |
| F01-12 | More information requested | Specific reason, requested evidence, resubmit and event history. |
| F01-13 | Rejected / appeal | Reason category, permitted appeal/resubmission, support path. |
| F01-14 | Approved / first-run setup | Authorized welcome, configure profile, verify payout destination, invite first driver, add vehicle, set permissions. |
| F01-15 | Market enrollment | One fleet may have distinct NG and US enrollment statuses; switching market must not silently switch data ownership. |
| F01-16 | Sign-out / security | Session termination, sign-out-all where supported, login history/security events. |

**Workflow:** start application → choose market → capture organization/owner → upload documents → review → submit → pending → approved / information requested / rejected → eligible first-run checklist. Access to operational writes is blocked until requisite approvals. Additional market enrollment is a new case, not a free toggle.

**Validation:** duplicate company, duplicate account, invalid document, unsupported market/zone, expired evidence, representative mismatch, denied permission, upload failure, offline, interrupted submission.

**Acceptance:** unauthenticated user cannot access fleet records; applicant cannot operate before approval; approval is server-sourced; a rejected case cannot self-approve; every decision and document change audited; US enrollment does not demand Nigeria-only fields.

---

# 3. F02 — DRIVER & VEHICLE LIFECYCLE

**Objective:** End-to-end supply onboarding and compliance, not merely list and detail views.

## F02.1 Driver screens

| Screen ID | Screen / state | Required content and behavior |
|---|---|---|
| F02-D01 | Drivers directory | Search/filter by name, ID, status, service, zone; pagination, counts, scoped exports. Existing `Desktop - 4`. |
| F02-D02 | Driver profile | Identity-safe profile, contact (permission-aware), verification, eligibility, assignments, trip/performance history. Existing `Desktop - 7` partially. |
| F02-D03 | Invite driver — details | Name, verified contact method, market/zone, optional proposed vehicle. Existing `Desktop - 11`. |
| F02-D04 | Invite — permissions/terms | Invitation role is driver, not a fleet-admin role; consent, organization and expiry disclosure. |
| F02-D05 | Invite — review/send | Review, send, loading, success/reference, send failure. |
| F02-D06 | Invitations directory | Pending, accepted, expired, revoked, failed; search, resend/revoke where permitted. Existing `Desktop - 9`. |
| F02-D07 | Invitation acceptance | Secure token validation, existing-account linking, consent, conflict checks. |
| F02-D08 | Driver verification | Market-specific license/identity/vehicle-class checks, document expiry, approval pending, rejection and resubmission. |
| F02-D09 | Driver activation | Eligibility summary and reasons blocked; no fleet self-approval of Sanga-required checks. |
| F02-D10 | Suspend/reactivate/remove | Confirmation, reason, operational impact, effective time, in-flight trip handling, audit. |
| F02-D11 | Driver-specific split | Only if contract/policy permits; effective-dated override, approval, 100% validation, historical snapshots. |
| F02-D12 | Driver states | No drivers, no results, already invited, invitation expired, duplicate, blocked, unavailable, network error. |

**Driver status model (suggested):** `invited → accepted → verification_pending → eligible → active`; exception states `information_required`, `rejected`, `suspended`, `inactive`, `removed`. **Do not conflate online/offline presence with legal/operational eligibility.**

## F02.2 Vehicle screens

| Screen ID | Screen / state | Required content and behavior |
|---|---|---|
| F02-V01 | Vehicles directory | Search/filter by plate/VIN/model/driver, status, service, zone; existing `Desktop - 12`. |
| F02-V02 | Add vehicle wizard | Market, VIN/plate, make/model/year/type, seating, fuel, ownership, zone, service class; duplicates/validation. |
| F02-V03 | Documents upload | Registration, insurance, inspection and local compliance requirements from market policy; progress and expiry. |
| F02-V04 | Vehicle review | Submitted/pending/information required/rejected/approved; reviewer reasons and resubmission. |
| F02-V05 | Vehicle overview | Existing `Vehicle Details(Status )`, edit history, eligibility, assigned driver. |
| F02-V06 | Vehicle documents tab | Existing `FLT 011`; view/download, status, expiry, replacement, evidence history. |
| F02-V07 | Maintenance tab | Existing `FLT 45`; active/previous issues and service blocking. |
| F02-V08 | Assignments tab | Existing `FLT 012`; assignment timeline and change action. |
| F02-V09 | Trips tab | Existing `FLT 46`; linked trips and statuses. |
| F02-V10 | Earnings tab | Existing `FLT 47`; money by currency and reconciliation status. |
| F02-V11 | Edit vehicle | Editable vs immutable fields, approval reset when compliance-critical fields change. |
| F02-V12 | Suspend/retire/reactivate | Reason, active trip/assignment conflict, warning, confirmation, audit. |
| F02-V13 | Expiry alerts | Document expiry windows, blocked-service consequence, renewal workflow. |
| F02-V14 | Vehicle states | Empty, duplicate VIN/plate, incomplete documents, rejected, expired, in maintenance, conflict, upload failure. |

**Vehicle status model (suggested):** `draft → submitted → under_review → approved → active`; exceptions `information_required`, `rejected`, `suspended`, `maintenance_blocked`, `expired`, `retired`. “Active” requires Sanga approval, valid documents, allowed service and no blocking maintenance condition.

**Acceptance:** a fleet cannot assign an unverified driver or ineligible vehicle; editing VIN/ownership/critical documents triggers appropriate review; expiry enforcement occurs server-side; every driver/vehicle state transition has a reason and actor.

---

# 4. F03 — ASSIGNMENT & FLEET OPERATIONS

**Objective:** Manage eligible assignments and live operational exceptions safely.

## F03.1 Screens

| Screen ID | Screen / state | Required content and behavior |
|---|---|---|
| F03-01 | Operations overview | Active, completed, cancelled, exception trips; existing `FLT 013`. |
| F03-02 | Trip detail | Driver, vehicle, trip state, pickup/dropoff visibility, last update and timeline; existing `FLT 014`. |
| F03-03 | Assign driver to vehicle | Select driver and vehicle, show compatibility and current assignment. |
| F03-04 | Eligibility validation | Driver license/status, vehicle documents, service/zone, capacity, existing assignments, maintenance and shift/rest constraints. |
| F03-05 | Assignment review/confirm | Effective timestamp, impact and confirmation; duplicate-submit prevention. |
| F03-06 | Reassignment/unassignment | Reason, replacement, conflict, audit and notification. |
| F03-07 | Trip exception detail | Cancelled, no-show, disputed, SOS/escalation, stalled/stale telemetry, offline driver; only permitted actions. |
| F03-08 | Operational action confirmation | Approval/step-up where necessary, no unsupported trip manipulation. |
| F03-09 | Trip timeline | Events with actor/source, timestamps, market timezone, stale-data indicator. |
| F03-10 | Operations empty/error states | No trips, filters empty, telemetry unavailable, delayed events, permission denied. |

**Hard constraints:** Fleet operators cannot impersonate riders or override the Sanga dispatch/trip-state engine. They may perform only backend-authorized operational actions. Show **“last location updated at …”** and distinguish stale from live data; never imply live tracking when updates have stopped. Trip guardian/SOS information is access-controlled, privacy-sensitive and not broadly visible to fleet staff.

**Assignment rules:** one active vehicle assignment per driver and one active driver per vehicle unless a formally supported shift/rotation model exists; enforce time windows and overlapping conflicts server-side. Reassignment during an active trip must be blocked or routed to an explicitly approved operational exception process.

**Acceptance:** invalid assignments fail with actionable reasons; changes propagate to driver and fleet views; conflict and race conditions do not create double assignments; trip event timeline is append-only.

---

# 5. F04 — EARNINGS, SETTLEMENT, SPLITS, PAYOUTS & CASH LIABILITY

**Objective:** Correct, auditable financial controls and complete exception handling. This is the highest-risk module.

## F04.1 Pricing authority — mandatory Figma correction

**Existing Figma:** `FLT 51` / `922:21592` currently displays editable “Base Price”, “Price Type” and “Save Changes” for service types.

**Replace with:** `Service Types & Eligibility` view showing Sanga-controlled service name, description, eligibility status, market/zone, approved fleet participation and last Sanga policy update. Fleet users may **request** a service category or toggle participation **only if** authorized and eligible; this is not a price change. Show read-only fare policy summary if approved for disclosure; never expose Sanga internal rate editor to fleet users. Remove editable price fields, rate sliders, price save mutations and any fake “saved” success. Server must reject fleet-origin pricing writes even if called directly.

## F04.2 Settlement calculation specification

For each trip in one currency:

1. Capture final fare components, refunds, taxes and adjustments per approved market accounting policy.
2. Determine Sanga commission and any authorized platform deductions from the **versioned applicable rule**.
3. Compute **distributable net = approved allocation basis − Sanga deductions**. Define the precise allocation basis, tax treatment and rounding policy with Finance before production.
4. Compute **fleet share** and **driver share** on distributable net using the effective versioned split. Sum of shares must equal the distributable net after approved rounding.
5. Determine **collection party** and **settlement responsibility** based on payment method and effective settlement mode.
6. Post balanced ledger entries; record payout/receivable obligations and reconciliation status.
7. Handle refunds, chargebacks, cancellations and adjustments with linked reversal/compensating entries, never overwrite original postings.

**Illustrative only, not a commercial rate:** Gross allocation basis ₦10,000; example Sanga commission 15% = ₦1,500; distributable net ₦8,500; example fleet share 20% of net = ₦1,700; driver share 80% of net = ₦6,800. These percentages are **examples only**; no actual commission or split rate is approved by this document. Do not hard-code them. Example accounting must also separately account for applicable taxes, provider fees and refunds per approved policy.

### Cash example and invariant

If the same example trip is paid in cash and **the driver physically receives ₦10,000**, cash received does **not** mean Sanga received ₦1,500. Record an obligation to remit Sanga's commission, and separately reconcile the fleet's share and driver share according to the contractual collection and settlement model. If the fleet collects instead, attribute the liability to the fleet. **Do not pay out the driver a second time for cash already retained.** Any permitted offset must be explicitly posted and visible, not silently netted in the UI.

**Invariant:** Sanga's fee entitlement is computed first in both card/digital and cash flows; cash remittance state is independent of rider trip payment completion.

## F04.3 Financial screen inventory

| Screen ID | Screen / state | Required content and behavior |
|---|---|---|
| F04-01 | Earnings overview | Existing `FLT 015`; gross, Sanga fee, net, fleet share, driver share, adjustments, currency, date range and drilldown. |
| F04-02 | Trip financial detail | Fare breakdown, pricing/commission/split snapshots, payment method, collection party, ledger events, refunds. |
| F04-03 | Payout overview | Existing `FLT 016`; totals by status, destination, method, amount/currency, provider reference. |
| F04-04 | Payout detail | Created/processing/succeeded/failed/reversed; timeline, trace, retry eligibility, support escalation. |
| F04-05 | Payout destination | Existing `FLT 35`; masked bank details, owner/verification status, country/currency, effective date. |
| F04-06 | Change destination | Existing `FLT 37`; new details, bank verification, step-up, review, approval/pending and failure. |
| F04-07 | Settlement mode overview | Existing `FLT 38`; Sanga-managed vs fleet-direct, responsibilities, constraints, pending requests. |
| F04-08 | Settlement mode review | Existing `FLT 40`; current/new mode, requested effective date, in-flight/unsettled treatment. |
| F04-09 | Settlement mode request states | Submitted, under review, approved, rejected, cancelled, effective, failed; reason and audit. |
| F04-10 | Default split | Existing `FLT 42`; fleet/driver percentages of **post-Sanga net**, effective date, version, overrides count. |
| F04-11 | Split change review | Validate total 100%, bounds/policy, authorization, effect on future trips only, step-up and approval. |
| F04-12 | Driver split override | If allowed: specific driver, effective date, reason, policy constraints, approval and history. |
| F04-13 | Cash liability dashboard | Sanga commission receivable, collection party, aging, due/overdue, remittance, offsets, disputes. |
| F04-14 | Cash trip detail | Cash collected by whom, amount, Sanga fee, fleet/driver allocation, outstanding liability and events. |
| F04-15 | Remittance initiation | Approved methods, amount, reference, pending/failed/success and duplicate protection. |
| F04-16 | Cash reconciliation | Match collection, remittance and ledger; partial, unmatched, excess, shortfall and dispute. |
| F04-17 | Payout exceptions | Failed/returned/reversed, retry eligibility, new destination, error classification, support route. |
| F04-18 | Dispute/adjustment request | Evidence, reason, amount/currency, review status, final resolution and compensating entries. |
| F04-19 | Financial export | Scoped by permission, market/currency/date, asynchronous generation, download expiry and audit. |
| F04-20 | Financial states | No transactions, pending settlement, stale provider, 409 conflict, verification failure, timeout, denied. |

## F04.4 Settlement modes — exact responsibilities

| Rule | Sanga-managed / platform | Fleet-managed / direct |
|---|---|---|
| Rider fare authority | Sanga only | Sanga only |
| Sanga commission | Deducted/accounted **first** | Deducted/accounted **first** |
| Driver/fleet split basis | Post-Sanga distributable net | Post-Sanga distributable net |
| Driver remittance | Sanga/payment partner as configured | Fleet responsibility as approved |
| Fleet remittance | Sanga/payment partner as configured | Based on contract/collection setup |
| Cash commission liability | Tracked to actual collector | Tracked to actual collector |
| Mode change | Review + future effective | Review + future effective |
| Historical ledger | Immutable | Immutable |

**Important:** “Fleet Direct Settlement” is **not** permission to bypass Sanga's commission, set prices, or claim that gross cash receipts are fleet revenue.

## F04.5 Financial controls and acceptance

- Require step-up and/or dual control for payout destination, settlement mode and split changes per Finance policy.
- Destination changes may trigger payout hold/review; do not automatically redirect already-initiated transfers.
- Only one effective split version for a given driver/period; default plus override precedence must be deterministic.
- Every trip carries immutable `pricingVersion`, `commissionVersion`, `splitVersion`, `settlementModeVersion`, `collectionMethod`, `currency`, `market`, `calculationId`.
- Payouts use idempotent provider requests and webhook deduplication; callbacks are verified.
- Ledger reconciles across trip, collection, commission, driver/fleet allocation, cash liability, payout and refund.
- Failures surface actionable state and reference ID; never show success before backend confirmation.
- NG/US payment adapters must use permitted local rails; no unverified bank/provider claim in UI.
- Exports mask sensitive identifiers and respect row-level permissions.

**Required automated finance tests:** commission-first for NGN and USD; rounding; fleet-managed and Sanga-managed; card vs cash; partial cash remittance; duplicate webhook; payout retry; chargeback; partial refund; split change during trip; settlement-mode change during trip; concurrent destination change; blocked unauthorized pricing update; cross-currency reporting isolation.

---

# 6. F05 — MAINTENANCE, VEHICLE HEALTH & COMPLIANCE

**Objective:** Track issues from report to resolution and ensure unsafe/ineligible vehicles cannot accept new trips.

## F05.1 Screens

| Screen ID | Screen / state | Required content and behavior |
|---|---|---|
| F05-01 | Maintenance directory | Existing `FLT 44`; filters for status, severity, vehicle, assigned owner, overdue. |
| F05-02 | Issue detail | Existing `FLT 48`; timeline, photos, reporter, vehicle, driver, severity, actions. |
| F05-03 | Create issue | Vehicle, category, description, severity, occurrence time, attachments, source. |
| F05-04 | Triage | Review safety impact, assign owner, priority, block/unblock eligibility under policy. |
| F05-05 | Work order / update | Assigned party, status, planned/actual service dates, notes, costs if permitted. |
| F05-06 | Resolution review | Evidence of repair, inspection where required, approve/decline resolution. |
| F05-07 | Reopen issue | Reason, history, re-block vehicle if safety relevant. |
| F05-08 | Document expiry | Registration/insurance/inspection alerts and replacement/reverification. |
| F05-09 | Compliance dashboard | Market-specific document/inspection health, expiring/expired, blocked assets. |
| F05-10 | States | Missing evidence, duplicate report, severe safety issue, overdue, upload failure, conflicting closure. |

**State model:** `reported → triaged → in_progress → resolution_submitted → resolved`; exception `reopened`, `cancelled_as_duplicate`. “Resolved” must not automatically override an independent compliance block.

**Acceptance:** safety-critical issue can block assignment and new-trip eligibility; only authorized reviewer can clear required holds; all status changes are audited; compliance requirements are market/zone-specific.

---

# 7. F06 — TEAM, ROLES, ACCESS & GOVERNANCE

**Objective:** Secure multi-user fleet administration.

## F06.1 Screens

| Screen ID | Screen / state | Required content and behavior |
|---|---|---|
| F06-01 | Team directory | Existing `FLT 017`; role, status, last activity, filters. |
| F06-02 | Team member detail | Existing `FLT 018`; memberships, assigned roles, activity log and safe contact. |
| F06-03 | Invite team member | Email/phone, role, market scope, expiry, consent, review/send. |
| F06-04 | Invitation states | Pending, accepted, expired, revoked, failed, resend. |
| F06-05 | Edit role and scope | Explicit permissions summary, before/after, confirmation, audit. |
| F06-06 | Suspend/revoke member | Immediate token/session revocation, reason, confirmation, notification. |
| F06-07 | Transfer ownership | Verified recipient, multi-step authorization, no orphaned fleet. |
| F06-08 | Permission denied | Action-specific explanation and route to owner/admin, without leaking data. |
| F06-09 | Team activity log | Actor, change, affected module, time, filter/export permissions. |
| F06-10 | States | Last-owner protection, self-demotion conflict, duplicate invite, stale permission, inactive user. |

**Rules:** RBAC plus market/organization scope. Finance access does not imply driver identity export. An Operations Manager cannot alter payout destinations unless separately granted. A user removed from the fleet loses access immediately; revocation must be enforced by backend, not only by hiding links.

**Acceptance:** cannot remove last active owner; no self-granted permissions; role changes take effect across open sessions; exports and attachments obey scope.

---

# 8. F07 — SUPPORT, REPORTS, NOTIFICATIONS & AUDIT

## F07.1 Support

| Screen ID | Screen / state | Required content and behavior |
|---|---|---|
| F07-S01 | Support home | Existing `FLT 43`; searchable published help and ticket list. |
| F07-S02 | Create ticket | Category, issue, description, related trip/payout/vehicle/driver, attachments, privacy. |
| F07-S03 | Review/submit | Summary, validation, duplicate prevention, reference ID. |
| F07-S04 | Ticket detail | Existing `FLT 53/54`; status, thread, files, timeline, permitted replies. |
| F07-S05 | Reply/attach | Progress, secure upload, redaction, send failure/retry. |
| F07-S06 | Resolve/reopen/escalate | Controlled state transitions, reason, no invented response-time promises. |
| F07-S07 | Support states | No tickets, offline, attachment rejected, ticket closed, forbidden, stale status. |

## F07.2 Reports

| Screen ID | Screen / state | Required content and behavior |
|---|---|---|
| F07-R01 | Report hub | Existing `FLT 019`; types and permissions. |
| F07-R02 | Earnings report | Existing `FLT 021`; by driver/vehicle/service/zone/currency. |
| F07-R03 | Driver performance | Existing `FLT 22`; trips, cancellations, completion, service/zone. |
| F07-R04 | Trip report | Complete/cancelled/in-progress, dates, location scope and export. |
| F07-R05 | Vehicle report | Utilization, maintenance, eligibility, assignment history. |
| F07-R06 | Payout/reconciliation report | Commission-first breakdown, payout states, cash liabilities, exceptions. |
| F07-R07 | Configure report | Date range, timezone, market, currency, fields, grouping, output format. |
| F07-R08 | Report job states | Queued, generating, ready, empty, failed, expired, cancelled. |
| F07-R09 | Download history | Authorized user, expiry, audit, regenerate if allowed. |

Exports must not imply completed payouts where only a liability exists. Currency must be explicit in every financial grouping.

## F07.3 Notifications

| Screen ID | Screen / state | Required content and behavior |
|---|---|---|
| F07-N01 | Notification inbox | Existing `FLT 56`; all/unread and type filters. |
| F07-N02 | Notification detail/navigation | Link to permitted source record; fallback if deleted/inaccessible. |
| F07-N03 | Mark read/unread | Bulk action, optimistic rollback on failure. |
| F07-N04 | Preferences | Existing `FLT 39`; email/SMS/in-app by event type and market eligibility. |
| F07-N05 | Delivery state | Sent, queued, failed where user-facing; avoid false “delivered” claims. |

Critical security and compliance notices cannot be disabled if policy requires delivery.

## F07.4 Audit

| Screen ID | Screen / state | Required content and behavior |
|---|---|---|
| F07-A01 | Audit directory | Existing `FLT 55`; actor, action, module, market, time. |
| F07-A02 | Event detail | Before/after safe diff, target, request/correlation ID, reason and approval chain. |
| F07-A03 | Audit export | Permission-controlled, time-scoped, signed/expiring download and access event. |
| F07-A04 | Integrity/failure states | Restricted detail, partial data, retention notice, no unauthorized edits. |

Audit must include pricing-change attempts by fleet users (rejected), split changes, settlement-mode requests, payout destination changes, verification decisions, team permission changes, vehicle eligibility, remittance adjustments and exports.

---

# 9. F08 — CROSS-MARKET, SYSTEM STATES, SECURITY & QUALITY

## F08.1 Market configuration matrix

| Concern | Nigeria | United States | Implementation rule |
|---|---|---|---|
| Currency | NGN | USD | Persist ISO currency per transaction; no mixed totals |
| Bank/payout | Approved NG rails and bank verification | Approved US rails and verification | Provider abstraction; do not invent integrations |
| Identity | Approved NG documents/identifiers as applicable | Approved US documents/identifiers as applicable | Policy-driven requirements; avoid mandatory NIN in US |
| Driver license | NG jurisdiction-specific | US state-specific | Jurisdiction/expiry verification |
| Vehicle eligibility | NG market/zone requirements | US state/zone requirements | Configurable document/inspection schema |
| Phone | International E.164 | International E.164 | Country-aware input/validation |
| Address | NG state/LGA/locality as needed | US state/city/ZIP as needed | Country-specific structured address |
| Distance | Configured km | Configured mi | Store canonical units and convert for display |
| Time | IANA zone for trip/organization | IANA zone for trip/organization | UTC persistence + timezone display |
| Cash | Market/zone policy | Market/zone policy | Feature-gated, never presumed enabled |
| Service types | Sanga-approved per zone | Sanga-approved per zone | No blanket national availability claim |
| Tax/receipts | Approved NG policy | Approved US state/local policy | Finance/legal configuration, not frontend constants |

If an organization operates in both countries, make the selected market and currency obvious. Enforce authorization for each market independently; cross-market reports must segregate currencies and compliance status.

## F08.2 Shared state catalogue — required for every module

`loading`, `empty`, `filtered_empty`, `ready`, `draft`, `validation_error`, `submitting`, `pending_review`, `action_success`, `action_failure`, `offline`, `timeout`, `unauthenticated`, `unauthorized`, `not_found`, `conflict`, `rate_limited`, `maintenance_mode`, `feature_unavailable`, `data_stale`, `expired_document`, `verification_blocked`, `read_only`, `session_expired`.

Each screen spec must identify which states are applicable. Provide designed patterns for full-page error, inline error, toast/banner, confirmation modal, progress, skeleton and safe retry. Never replace a failed financial write with a success toast.

## F08.3 Security baseline

- Authentication via approved identity service; secure session cookies/token rotation and CSRF protection as appropriate to architecture.
- Mandatory server-side RBAC/ABAC and organization scoping on every endpoint and export.
- Step-up authentication for financial changes, owner transfer and sensitive identity changes.
- Rate limiting and anti-enumeration for login, recovery, invitations and support.
- Sensitive document uploads: malware scan, signed access, size/type restrictions, retention and redaction.
- No secrets, bank account numbers, identity document images or tokens in analytics, URLs or console logs.
- Verify payment provider webhooks and deduplicate; never accept browser “payout success” as ledger truth.
- Immutable audit/financial records with correction entries.
- Accessible WCAG-oriented semantics, focus management, keyboard navigation, form labels and contrast.
- Privacy-aware driver location and personal data; least privilege and purpose limitation.
- Operational observability: correlation IDs, structured logs, metrics, alerts for reconciliation failures and auth anomalies.

## F08.4 Performance and reliability

Paginate/filter server-side; avoid fetching entire fleet datasets. Use cached aggregates with freshness labels and invalidation. Handle provider outages and stale telemetry explicitly. Async reports and uploads must survive navigation. Test race conditions, retries, flaky networks and duplicate clicks.

## F08.5 Design system requirements

Reuse current portal visual identity (Work Sans and portal-specific components where appropriate), consistent spacing, typography, tables, cards, modals, steppers, status chips and forms. Design responsive tables with accessible mobile equivalents. Use real Sanga brand assets already in repository. Add dark/light modes only if product scope explicitly requires them; do not expand scope for decoration.

---

# 10. COMPLETE FLOW MAPS & STATE TRANSITIONS

## 10.1 Fleet onboarding
`visitor → register/apply → organization details → market details → document upload → review → submit → pending → [approved | information_required | rejected] → first-run setup → operational`

## 10.2 Driver
`invite → sent → [accepted | expired | revoked] → verification → [approved | information_required | rejected] → eligible → assigned → active`; suspension/reinstatement must be authorized.

## 10.3 Vehicle
`draft → document submission → review → [approved | information_required | rejected] → eligible → assigned → active`; maintenance/expiry blocks eligibility; retirement is a distinct end state.

## 10.4 Maintenance
`reported → triaged → in_progress → resolution_submitted → reviewed → resolved`; `reopened` may return to triage/in progress.

## 10.5 Settlement mode change
`request → step_up → review → submitted → [approved | rejected | cancelled] → scheduled → effective`; retain prior mode for existing snapshots.

## 10.6 Split change
`draft → validate 100% → review/step_up → [approved | rejected] → scheduled → effective`; retain previous versions and per-driver override precedence.

## 10.7 Cash liability
`cash_collected → commission_receivable_open → [partial_remittance | offset_authorized | disputed] → reconciled/closed`; overdue state based on approved due date, not arbitrary UI timer.

## 10.8 Payout
`created → pending_verification → queued → processing → [succeeded | failed | returned]`; retry creates linked attempt and idempotency trail, not a duplicate obligation.

## 10.9 Support
`draft → submitted → open → in_progress → awaiting_fleet/awaiting_support → resolved → [closed | reopened]`.

**Note:** Exact enum names may follow backend conventions; behavior and audit semantics must remain intact.

---

# 11. ROUTING & COMPONENT IMPLEMENTATION PLAN

## 11.1 Existing code to preserve/extend

- `src/app/fleet/portal/[[...path]]/page.tsx`: current route dispatcher; add route protection, loaders, error handling and safe not-found.
- `src/app/fleet/portal/layout.tsx` and `portal.css`: portal-specific layout/styling.
- `src/components/fleet-portal/FleetPortal.tsx`: sidebar/nav/shell; add authenticated identity, permission-aware navigation and session handling.
- `src/components/fleet-portal/Overview.tsx`: dashboard/operations/earnings; connect real queries and freshness.
- `src/components/fleet-portal/Directory.tsx`: driver/vehicle/invitation list and forms; add full lifecycles.
- `src/components/fleet-portal/Details.tsx`: driver, vehicle, issue and trip details; add states/actions.
- `src/components/fleet-portal/Finance.tsx`: finance/reports; replace fixtures with audited finance APIs.
- `src/components/fleet-portal/Settings.tsx`: profile, service eligibility, permissions, support, audit; **remove fleet fare editing**.
- `src/lib/fleet-portal.ts`: route list and demo data; separate route config from fixture data; never use fixtures as production records.
- `src/lib/fleet-portal-assets.json`: reuse exact design assets as applicable.

## 11.2 Suggested new route families (names illustrative)

- `onboarding/*`, `security/recover`, `security/reset`, `security/verify`
- `drivers/invitations/:id`, `drivers/:id/verification`, `drivers/:id/split`
- `vehicles/new`, `vehicles/:id/edit`, `vehicles/:id/documents/new`
- `assignments/new`, `assignments/:id`, `operations/:tripId/exceptions`
- `maintenance/new`, `maintenance/:id/resolve`
- `payouts/:id`, `payouts/cash`, `payouts/cash/:id`, `payouts/reconciliation`
- `payouts/destination/requests/:id`, `payouts/settlement/requests/:id`, `payouts/split/requests/:id`
- `team/invite`, `team/:id/permissions`, `team/ownership-transfer`
- `reports/jobs/:id`, `settings/support/new`, `settings/support/:ticketId`
- `settings/audit/:eventId`, `notifications/:id`

Do not mechanically create empty pages for every path. Create them when the corresponding workflow and backend contract are implemented. For small state variants, modal/drawer may be appropriate; routes must remain deep-linkable for important records.

## 11.3 Feature flags

At minimum: `fleet.market.NG`, `fleet.market.US`, `fleet.cash.enabled`, `fleet.settlement.platform`, `fleet.settlement.direct`, `fleet.driverSplitOverride`, `fleet.service.<type>`, `fleet.reports.<type>`, `fleet.integrations.<provider>`. Flags are server-owned and scoped by market/zone/fleet/role as applicable. Disabled means disabled in API too.

---

# 12. SCREEN DESIGN DELIVERABLE CONTRACT

For **every** F01–F08 screen/state, the designer/agent must deliver:

1. **Screen ID + Figma frame link** and title.
2. **Purpose, persona and entry points** (navigation, notification, deep link).
3. **Preconditions and permission checks** (market, fleet status, role, verification).
4. **Primary data fields** with source, format, default, editable/read-only, sensitivity.
5. **User actions** and exact next state/route; include cancel/back.
6. **Form validation** (client assistance plus authoritative server validation).
7. **Success, loading, empty, error, denied, stale and conflict states** where applicable.
8. **Confirmation and irreversible-action warnings**.
9. **Notifications and audit events** triggered.
10. **Responsive and accessibility behavior**.
11. **API contract reference**, including error handling and idempotency.
12. **Acceptance criteria and test case IDs**.

Do not consider a screen “designed” merely because a default happy-path frame exists. Every high-risk action must show its review, pending, approved/rejected and recovery states.

---

# 13. ACCEPTANCE TEST MATRIX (MINIMUM)

| Test ID | Scenario | Pass condition |
|---|---|---|
| T-001 | Fleet user attempts to change Sanga Go base price via UI or API | No editable fare control; API rejects mutation and audits attempt |
| T-002 | Commission-first calculation, NGN | Sanga fee allocated first; remaining fleet/driver shares reconcile exactly |
| T-003 | Commission-first calculation, USD | Same invariant; currency and rounding correct |
| T-004 | Fleet-direct settlement | Fleet assumes driver remittance responsibility; Sanga commission remains first |
| T-005 | Platform settlement | Driver/fleet payout obligations posted correctly; no double disbursement |
| T-006 | Driver receives cash | Sanga receivable recorded; no duplicate driver payout |
| T-007 | Partial cash remittance | Liability reduces correctly; remains open until reconciled |
| T-008 | Cash refund/dispute | Linked adjustment/compensating ledger; no destructive overwrite |
| T-009 | Split changes while trip active | Existing trip retains captured split version |
| T-010 | Settlement mode changes while trip active | In-flight trip retains agreed mode; new trips use effective mode |
| T-011 | Payout destination update | Requires permitted actor, step-up/approval and verified account |
| T-012 | Duplicate payout webhook | Single financial effect, traceable duplicate event |
| T-013 | Driver invitation expired | Cannot accept; authorized resend generates new valid token |
| T-014 | Unverified driver assigned | Server rejects with eligibility reasons |
| T-015 | Expired vehicle insurance | Server blocks new eligible assignments/trips |
| T-016 | Critical maintenance issue | Vehicle held from service until approved clearance |
| T-017 | Fleet staff tries to grant self finance permissions | Rejected, audited |
| T-018 | Last owner removal | Rejected unless completed ownership transfer |
| T-019 | User accesses another fleet's URL | 403/404 with no record leakage |
| T-020 | US enrollment | US-specific forms; no forced Nigerian NIN/bank format |
| T-021 | NG and US aggregate | NGN/USD not combined as one unlabeled amount |
| T-022 | Lost connection during submission | No false success; safe retry without duplicate |
| T-023 | Report export permission | Only authorized scoped rows, currency and date filters |
| T-024 | Support ticket attachment | Secure access, file restrictions and audit |
| T-025 | Stale trip location | Clearly labelled last-update timestamp, not “live” |
| T-026 | Service eligibility change | No change to Sanga fare or unauthorized service activation |
| T-027 | Session expiry during sensitive action | Reauthentication; no partial unauthorized write |
| T-028 | Audit history | All finance/access/compliance actions traceable by correlation ID |
| T-029 | Cross-market permission | NG-only staff cannot access US data without authorization |
| T-030 | Preview mode | No production records mutated; obvious demo labeling |

**Testing layers:** unit tests for domain/state rules; integration tests for backend contracts/provider adapters; E2E tests for critical F01–F08 journeys; accessibility checks; mobile/tablet/desktop smoke tests; security authorization tests; reconciliation tests; regression against existing portal routes.

---

# 14. DELIVERY MILESTONES AND DEFINITION OF DONE

## Milestone M0 — Baseline & policy correction
- Map Figma frame IDs to implemented routes/components; annotate `implemented / partial / missing`.
- Remove editable fleet pricing controls and any corresponding fleet pricing mutation API.
- Freeze Sanga-owned pricing, commission-first, cash liability and NG/US invariants in tests.
- Separate demo data from production mode; create permission and market config scaffolding.

## Milestone M1 — F01 + foundations
- Authentication/session/recovery; fleet application and verification states; market enrollment; role/permission enforcement; common UX states.

## Milestone M2 — F02 + F03
- Driver and vehicle lifecycle; invitations; eligibility; assignments; trip operations and exception handling.

## Milestone M3 — F04
- Authoritative finance/ledger integration, commission-first splits, payout destination/mode changes, cash liability and reconciliation; all financial tests green.

## Milestone M4 — F05 + F06
- Maintenance lifecycle, compliance holds, team invitations, role management, owner protection and audit.

## Milestone M5 — F07 + F08
- Support tickets, async reports, notifications, audit explorer, full NG/US market adaptation, exception states, accessibility/security/performance testing.

## Milestone M6 — Release readiness
- Staging walkthrough with founder/product, finance, compliance, operations and QA.
- Resolve all P0 defects; no fake success states; no unauthorized pricing controls.
- Reconcile financial fixtures against independent expected calculations.
- Verify each acceptance test with screenshots, API traces or test logs.
- Approve production configuration per market/zone; feature-flag unsupported capabilities.

### Definition of done — per workflow

A workflow is **done** only when: (a) screen and all required states are designed; (b) API and persistence exist; (c) authorization and market rules are enforced server-side; (d) loading/errors/retries are implemented; (e) audit/notification/financial events are correct; (f) responsive/accessibility checks pass; (g) tests and QA evidence are attached; (h) owner accepts it.

### Required handoff artifacts

1. Updated Figma frames, annotated flow arrows and screen IDs.
2. F01–F08 screen inventory with status and Figma links.
3. API schemas, event contracts and state diagrams.
4. RBAC permission matrix and NG/US market config matrix.
5. Finance calculation and ledger invariants with tested examples.
6. QA test report mapped to T-001–T-030 plus new tests.
7. Open issues, dependencies, decisions and known limitations.
8. Release checklist and rollback/feature-disable plan.

---

# 15. DECISION REGISTER — DO NOT GUESS

The following are **not** authorized by this document and require explicit owner/Finance/Compliance confirmation before production:

| ID | Decision required | Safe interim behavior |
|---|---|---|
| D-01 | Actual Sanga commission rates and whether fee base includes taxes/adjustments | No hard-coded rate; versioned configuration only |
| D-02 | Actual default fleet/driver split and allowed override ranges | Configurable; no assumed commercial split |
| D-03 | Exact cash availability, remittance deadlines, limits and offset policy per market | Disable cash actions unless configured |
| D-04 | Exact payment/payout providers, bank verification and dispute timelines | Provider abstraction; no simulated payout |
| D-05 | Legal/KYC/KYB and vehicle/driver requirements by NG jurisdiction and US state | Compliance-provided schemas and verification holds |
| D-06 | Whether fleet operators may request service opt-in and who approves it | Read-only service eligibility until policy approved |
| D-07 | Settlement-mode change eligibility, approval roles, cutover rules and pending earnings treatment | Request-only; no instant switching |
| D-08 | Whether driver-specific split overrides are allowed and approval chain | Feature-flagged off |
| D-09 | Exact fleet subscription plans, billing, prices and limits (Figma `FLT 52` shows examples) | Mark demo/non-live; no charges |
| D-10 | Which third-party integrations (Figma `FLT 41`) are commercially supported | Display only confirmed integrations |
| D-11 | Operational staff permissions for dispatch/reassignment and emergency access | Least privilege; no unapproved override |
| D-12 | Report retention, PII export rules, support SLAs and notification policies | Restrictive defaults; no invented promises |

**Clarification of approved vs proposed:** The eight F01–F08 workstreams and locked product rules are the requested implementation scope. The particular route names, roles, enum spellings, example figures and API shapes above are **engineering proposals** to be adapted to the existing Sanga architecture and confirmed backend contracts. They are not claims about current production functionality.

---

# 16. AGENT EXECUTION PROMPT (COPY INTO DEVELOPMENT TASK)

> Work only on Sanga Ride's Fleet Web Portal (`/fleet/portal`) and its necessary shared backend contracts. Read this entire specification before editing. Inspect the existing Figma fleet-management page and repository. First produce a route-to-Figma-to-flow gap matrix and a dependency-ordered implementation plan. Preserve existing functional UI; do not rewrite the portal from scratch. Implement F01 through F08, including all lifecycle transitions, non-happy-path screens, NG/US configuration, RBAC, secure file uploads, audit, reports and financial integrations. **Fleet users cannot control prices. Sanga commission is always accounted for before fleet/driver splits. Cash collections create trackable liabilities and reconciliation obligations.** No fictitious production data or successful payment simulation. For unresolved D-01–D-12, use safe feature flags and request approval instead of guessing. Deliver incremental PRs with tests, screenshots, migration notes and an updated coverage matrix. Do not mark a module complete based on a static screen or route alone. Stop and report blockers for missing authoritative financial/compliance integrations; never silently invent them.

---

# 17. TRACEABILITY: FIGMA → WORKSTREAM

| Existing Figma frame | Node | Workstream |
|---|---|---|
| `Desktop - 2` login | `922:20482` | F01 |
| `Desktop - 3` dashboard | `922:18639` | F03 / F08 |
| `Desktop - 4`, `Desktop - 7`, `Desktop - 9`, `Desktop - 11` | `922:18970`, `922:19307`, `922:19655`, `922:20302` | F02 |
| `Desktop - 12`, `Vehicle Details(Status )`, `FLT 011/012/45/46/47` | `922:19982`, `922:13308`, `922:13588`, `922:14182`, `922:13879`, `922:14460`, `922:14747` | F02 / F03 / F05 / F04 |
| `FLT 013`, `FLT 014` | `922:15039`, `922:15908` | F03 |
| `FLT 44`, `FLT 48` | `922:15341`, `922:15642` | F05 |
| `FLT 015`, `FLT 016`, `FLT 35`, `FLT 37`, `FLT 38`, `FLT 40`, `FLT 42` | `922:16161`, `922:16453`, `922:17630`, `922:17841`, `922:18029`, `922:18255`, `922:18474` | F04 |
| `FLT 017`, `FLT 018` | `922:16808`, `922:17128` | F06 |
| `FLT 019`, `FLT 021`, `FLT 22` | `922:17367`, `922:20548`, `922:20885` | F07 |
| `FLT 32`, `FLT 33`, `FLT 51`, `FLT 50`, `FLT 52` | `922:21210`, `922:21414`, `922:21592`, `922:21814`, `922:21970` | F04 / F06 / F08 |
| `FLT 39`, `FLT 41`, `FLT 43`, `FLT 55`, `FLT 56`, `FLT 53`, `FLT 54` | `922:22231`, `922:22454`, `922:22671`, `924:574`, `924:1262`, `923:8748`, `924:302` | F07 / F08 |

**Final release gate:** The portal is not “flow-complete” until all required F01–F08 workflows have verified design states, connected behavior or explicitly approved feature-disabled states, role/market enforcement, and QA evidence. In particular, pricing mutation by fleets, non-commission-first calculations, fabricated cash settlement and NG-only assumptions are release blockers.

*End of specification.*
