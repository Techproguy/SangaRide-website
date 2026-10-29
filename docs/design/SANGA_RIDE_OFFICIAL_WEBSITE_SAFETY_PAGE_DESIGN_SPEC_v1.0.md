# Sanga Ride — Official Website Safety Page Design Specification v1.0

**Route:** `/safety`  
**Status:** Design and engineering handoff candidate; safety, legal, and operations review required before publication  
**Primary visual reference:** W-S04 — Final Integrated Safety Page (desktop and mobile)  
**Supporting references:** W-S03 (interactive journey and scenarios), W-S02 (human-centered art direction)  
**Markets:** Nigeria and United States, with jurisdiction- and zone-aware capability gating  
**Date:** 2026-10-23

## 1. Page mission and scope

The public Safety page is an **educational trust center**: show how Sanga's trip protections are intended to work, teach users safe actions, disclose meaningful limitations, and direct them to verified support. It is not a live trip interface, emergency dispatch tool, authenticated Safety Console, or a substitute for local emergency services.

**Primary audiences:** Riders, Drivers, Teen riders and authorized Guardians, Seniors and authorized Caregivers, and prospective users assessing the platform.

**Primary outcomes:** Understand the pickup verification sequence; find relevant guidance before/during/after trips; recognize emergency versus non-emergency reporting; find privacy and support resources. **Secondary CTA:** `Book a Ride` → Rider Web booking; does not interrupt reading the guide.

## 2. Approved content architecture

| Order | Section | User goal | UX treatment |
|---|---|---|---|
| 01 | Safety introduction | Understand Sanga's approach | Human-centered photo, concise copy, `See how it works` and `Safety resources` |
| 02 | Protection at every stage | Discover tools by moment | Four-stage interactive timeline: Before pickup, During ride, Incident, After trip |
| 03 | Match Check → Trip PIN | Know what to do at pickup | Four-step walkthrough with separate verification states |
| 04 | When something goes wrong | Get situation-specific guidance | Scenario selector and clear emergency boundaries |
| 05 | Safety for different people | Find relevant role guidance | Rider, Driver, Teen, Guardian, Senior; permission-aware copy |
| 06 | Privacy & accountability | Understand handling of reports and data | Clear information lifecycle, evidence restrictions, market disclosures |
| 07 | Safety resources and footer | Reach actual help | Verified local help routes, policy links, contact/support navigation |

W-S04 imagery is **illustrative**. Remove duplicate pickup-verification mockups: the hero introduces human context, while section 03 owns the complete procedure. Do not reproduce generated text errors, fictional driver details, sample PINs, license plates, ratings, or unsupported feature claims as live product content.

### Suggested public copy

**Eyebrow:** SANGA SAFETY  
**Headline:** Every journey deserves more than a promise.  
**Body:** From checking your assigned driver and vehicle to reporting concerns, learn about the tools and processes designed to support safer Sanga journeys.  
**CTAs:** `See how it works` (anchor to timeline); `Safety resources` (anchor to verified resources).

Use careful present-tense language only for deployed features; for features not live in a selected market, omit, disable with an explicit status, or label accurately as planned. Never claim trips are guaranteed safe.

## 3. Visual and responsive system

- **Identity:** Calm, credible, human-centered editorial imagery; Sanga blue, navy, white, restrained neutrals. Avoid alarming accident photos, excessive red, decorative shields, or generic icon walls.
- **Desktop:** Split hero (copy + photo, with *one* conceptual ride-detail accent at most); horizontally navigable timeline; focused walkthrough; scenario area; role guidance; substantial privacy section.
- **Tablet:** Stack hero content, use scrollable timeline with visible step labels, 2-column scenarios where space allows.
- **Mobile:** Compact hero, single active timeline panel, one walkthrough step per view, single-column scenario choices, role accordions, accessible resources. No 4-column tables or tiny controls.
- **Interaction:** Minimum 44 × 44 CSS-pixel targets, visible focus, semantic headings, reduced-motion mode, no auto-advancing safety guidance, no information conveyed solely by color.
- **Assets:** Use approved, licensed imagery and accurate app UI; generated people, plates, phone screens and sample records are placeholders only.

## 4. Interactive trip lifecycle

Four stages: `Before you get in`, `During your ride`, `When something goes wrong`, `After the trip`.

- Selecting a stage updates the content panel and its illustration, while preserving focus and announcing the stage heading to assistive technologies.
- **Before:** Physical Match Check of assigned driver and vehicle, then trip-specific PIN process.
- **During:** Authorized sharing, Trip Guardian where enabled, relevant safety controls and trip status. Explain connectivity limitations.
- **Incident:** Immediate safety first; emergency services for urgent danger; supported in-app SOS/reporting and escalation where available.
- **After:** Incident submission, follow-up, case handling and support resources; do not guarantee outcomes or response times.
- Timeline is an **educational demonstration** only; no real tracking, SOS, incident creation or identity lookup on the public page.

## 5. Pickup verification walkthrough — normative flow

**Canonical order:**

1. **Check the vehicle:** Compare the arriving vehicle and registration plate with the current assigned trip details in the Rider app.
2. **Check the driver:** Physically compare the arriving person with the assigned driver identity/photo shown in the app.
3. **Complete Match Check:** Rider confirms the actual driver **and** vehicle match. If not, do not enter; use supported safety/cancellation/reporting flows.
4. **Verify Trip PIN:** Only after Match Check, follow the trip-specific PIN exchange/verification flow to authorize start.

**Rules:**

- A reassignment invalidates the previous driver/vehicle Match Check and PIN; verification restarts against the new assignment.
- Guardian remote monitoring **never** substitutes for the Teen rider's physical verification.
- Do not display a `Verified` state before user action, or combine `Confirm Match Check` and `Enter PIN` into one button.
- A mock PIN such as `••••` may illustrate a state; never publish a working PIN or imply a demo input authenticates a real trip.
- The public walkthrough uses local UI state only and includes a persistent `Illustrative guide — not a live trip` label.

**Demo states:** `vehicle_review` → `driver_review` → `match_confirmed_demo` → `pin_explanation`; alternate `mismatch` branches to advice, not to a fake successful verification. Provide Back/Next/Restart and keyboard operation.

## 6. Scenario-based incident guidance

| Scenario | Immediate guidance | Website action |
|---|---|---|
| Wrong driver/vehicle | Do not enter; move somewhere safe and use the app's available reporting/cancellation controls | Open guidance and verified help resources |
| Unexpected route or unsafe behavior | Prioritize safety; use appropriate in-trip tools; contact local emergency services for immediate danger | Explain tools and reporting channels |
| Threat, assault, serious incident | Seek immediate safety and emergency help; report to Sanga when safe | Distinguish emergency from post-incident support |
| Breakdown or roadside hazard | Avoid standing in moving traffic; move to safety if possible; use supported trip-recovery flow | Explain breakdown and assistance process |
| Payment or trip dispute | Avoid confrontation; use in-app dispute/reporting path and preserve available records | Link to support guidance |

**Never render a decorative SOS control that appears to call emergency services.** If the website displays emergency numbers, they must come from a verified, location-specific resource registry with explicit country/jurisdiction and maintenance owner; no invented phone numbers or unsupported 24/7 promise. If market cannot be determined, ask the visitor to choose a country or show general guidance to contact local emergency services.

## 7. Audience-specific content and permissions

- **Rider:** Match Check, PIN, authorized trip sharing, safety tools and incident reporting.
- **Driver:** Confirm trip PIN via approved flow, unsafe pickup and roadside incident guidance, dispute/evidence reporting. Driver cannot override rider Match Check.
- **Teen:** Guardian authorization and age/market rules; rider performs physical verification. Do not imply unlimited guardian surveillance.
- **Guardian:** Only explicitly authorized, scoped trip visibility, notifications and escalation. Show `last updated` for location; never describe stale telemetry as live.
- **Senior / Caregiver:** Accessible instructions and delegated booking/support within consent and permission boundaries; caregiver is not automatically entitled to all trip data.

Role selector changes educational copy only, not account privileges. Actual role permissions are enforced by authenticated backend systems.

## 8. Privacy, incident evidence and accountability

Explain in accessible language:

1. **What is collected:** Trip and safety information as defined in the applicable published privacy notice; do not claim universal data minimization or encryption without engineering confirmation.
2. **Why:** Trip operations, safety review, dispute handling, compliance and fraud prevention as permitted by policy and law.
3. **Who can access:** Authorized, role-limited personnel and lawful recipients, with controlled evidence access and auditable case actions where implemented.
4. **How reports work:** User submits a report in supported app/help channels → case triage → authorized review/escalation → outcome communication as applicable. No guarantee of a particular resolution.
5. **Retention and rights:** Link to the current market-appropriate privacy notice and retention/right-request procedures; do not invent durations.
6. **Audio:** Trip Audio Protection is a **proposed, gated capability** unless deployment is confirmed. Never imply continuous live listening. Any recording feature needs applicable consent, encryption, submission/access and retention rules, particularly across US jurisdictions.

Security-sensitive internal processes should not be publicly disclosed in a way that undermines safeguards.

## 9. Market and availability controls

- Nigeria and US support must be configured independently, with subnational rules where necessary (especially recording consent and emergency resources).
- `market` selection affects published feature availability, emergency guidance, privacy links, support entry points and localized language/currency where relevant.
- Market choice is not evidence that a particular city/zone is live. Safety capability claims require a feature deployment/operations status source.
- Never show fictional support hours, response guarantees, real-time tracking or verified city coverage.
- If a feature is not available, prefer a truthful explanation and an appropriate alternative rather than a disabled control with no explanation.

## 10. Navigation and interaction contracts

| UI element | Behavior | Dependency |
|---|---|---|
| `See how it works` | Scroll/focus timeline heading | Local |
| `Safety resources` | Scroll/focus resources | Local |
| Lifecycle stage tabs | Update educational panel | Local static content |
| Pickup guide controls | Change demo step; reset on reassignment example | Local static content |
| Incident scenario selection | Display situation-specific guidance | Local static content |
| Audience selector | Display role-specific content | Local static content |
| `Book a Ride` | Navigate to `/book` | Rider Web |
| `Get help` | Navigate to verified market-specific help entry | Configured help destination |
| Privacy/legal links | Open approved documents | Legal content registry |

All public interactions must work without login except actions explicitly transferring into authenticated products. The site must not collect incident evidence or emergency details into unapproved generic marketing forms.

## 11. Engineering architecture and content model

Recommended typed content entities:

- `SafetyPageContent { locale, market, hero, stages[], verificationSteps[], scenarios[], audiences[], privacyBlocks[], resourceLinks[] }`
- `SafetyCapability { key, market, jurisdiction?, availability: live|limited|planned|unavailable, publicCopyApproved, updatedAt }`
- `SafetyResource { market, jurisdiction?, label, kind, urlOrVerifiedNumber, owner, reviewedAt }`

**Public content source:** versioned CMS/static content and reviewed configuration. No live user trips, driver profiles, incident cases, telematics or guardian relationships should be queried for public previews.

**Security:** Avoid exposing private Safety Console endpoints, internal risk signals, personal data or private evidence URLs. Sanitize CMS content, use safe external-link handling, and apply appropriate security headers.

**Analytics:** Aggregate, consent-aware events such as `safety_stage_viewed`, `verification_step_viewed`, `scenario_selected`, `help_link_opened`, `market_changed`. Do not include user-entered incident details, real trip identifiers, private locations or sensitive evidence in analytics payloads.

## 12. Required states and accessibility

- Responsive navigation; expanded/collapsed accordions; selected stage; active verification step; mismatch guidance; selected scenario; selected audience; market changed; resource unavailable.
- Semantic tab/tabpanel or equivalent accessible patterns; proper labels and ARIA state, keyboard focus management, no keyboard traps.
- Text contrast meeting WCAG AA; meaningful alternative text; readable copy at 200% zoom; motion reduction; screen-reader announcements for step changes.
- Graceful offline/slow network behavior for static guidance; if external support cannot load, show a truthful fallback without claiming submission.
- Safety instructions must remain understandable without animation or imagery.

## 13. Content/legal/operations approval checklist

Before publishing, confirm:

- [ ] Match Check and PIN copy matches implemented Rider/Driver workflows and reassignment invalidation.
- [ ] Teen, Guardian, Senior and Caregiver permissions match actual market policies.
- [ ] SOS, Guardian, tracking, reporting and support capabilities are accurately marked by market and zone.
- [ ] Any emergency numbers, help URLs, and support hours are verified and assigned maintenance owners.
- [ ] Privacy, evidence handling, retention, audio recording and consent claims receive legal/security approval.
- [ ] All fictional names, plates, ratings, UI records and illustrative data are removed or clearly marked demo.
- [ ] No claim of guaranteed protection, response time or 24/7 coverage without verified operations.
- [ ] Content owners and review cadence are assigned for safety and emergency guidance.

## 14. Developer QA acceptance criteria

1. `/safety` loads on desktop, tablet and mobile, with correct hierarchy and no duplicated pickup mockup.
2. Timeline, walkthrough, scenarios and audience controls operate by mouse, touch and keyboard.
3. The walkthrough cannot visually show PIN verification before Match Check and explains reset after reassignment.
4. A simulated mismatch branches to safe guidance, never to `Verified`.
5. The public page never triggers real SOS, creates an incident, accesses private trips, or exposes user records.
6. Market switch changes relevant copy/resources without inventing city availability.
7. No stale telemetry is labeled live in any illustrative screen; public preview uses synthetic data only.
8. All support and privacy links resolve to reviewed destinations; missing destinations fail safely with explanatory text.
9. Automated accessibility checks and manual screen-reader/keyboard QA pass agreed WCAG AA criteria.
10. Marketing, Product Safety, Legal/Privacy, and Engineering sign off on production claims and implementation.

## 15. Deliverables and handoff

**Design:** W-S04 reference, responsive final Figma frames, interaction prototypes, asset licenses, content states and accessible component specs.  
**Frontend:** `/safety` page, reusable interaction components, market-aware content integration, tests and analytics.  
**Backend/config:** Public approved capability/resource registry as needed; no direct access to private safety case services.  
**Review:** Staging screenshots at mobile/tablet/desktop breakpoints, interaction QA, content audit and final release approval.

### Decision register

**Selected:** Educational trust-center concept; six core sections plus resources; human-led hero; four-stage journey; Match Check before PIN; scenario guidance; audience-aware content; privacy/accountability; Nigeria/US gating.  
**Pending:** Exact live feature availability, emergency/support links, audio capability release, approved public privacy/security claims, final responsive Figma measurements, and operations/legal sign-off.

---

**Next design phase:** Finish remaining official-site supporting pages (Cities, About, Help, and booking entry integration) or prioritize them according to launch needs. This document alone does not certify `/safety` as production-ready.
