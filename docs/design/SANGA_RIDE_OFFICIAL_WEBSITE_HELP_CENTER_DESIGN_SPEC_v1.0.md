# Sanga Ride — Official Website Help Center Design Specification v1.0

**Route:** `/help` and supporting help routes  
**Status:** Selected W-H04 design direction; implementation handoff candidate, subject to operations, content, security and legal validation  
**Primary visual reference:** W-H04 — Final Integrated Help Center (desktop and four mobile views)  
**Supporting references:** W-H01 architecture, W-H02 initial exploration, W-H03 search and mobile article refinement  
**Markets:** Nigeria and United States, with country-, region-, role- and service-aware content and support availability  
**Date:** 2026-10-23

## 1. Purpose and product boundaries

The Help Center is a **task-oriented support product**, not a promotional landing page. Its primary goals are to help visitors **find an answer, resolve a problem, follow an existing request, or reach an appropriate verified support channel**. It must work for Riders, Drivers, Business users and Fleet partners, including people with more than one role on the same Sanga identity.

**Public content:** Searchable help articles, public troubleshooting guidance, role categories, verified contact options and safety guidance.  
**Protected content:** Trip receipts, driver earnings, identity verification documents, organization data, fleet records, support case contents, attachments and personal information. These require appropriate authentication, authorization and scope checks.  
**Not in scope:** Public SOS dispatch, public case-detail lookup by reference alone, a promise of live support, or exposing internal risk/fraud logic.

## 2. W-H04 page content architecture

| Order | Section | User job | Visual/interaction treatment |
|---|---|---|---|
| 01 | Compact search hero | Describe an issue quickly | Typographic heading, wide search, suggested query chips; no promotional hero photo |
| 02 | High-priority actions | Reach safety, requests or contact | Separate Safety Help, Track a Request, Contact Support surfaces |
| 03 | Browse by support area | Find role-specific help | Rider, Driver, Business, Fleet categories; compact responsive tiles |
| 04 | Popular help topics | Resolve frequent issues | Contextual article links, short descriptions, editorially managed ordering |
| 05 | Guided help | Work through a problem | Step-by-step troubleshooting preview and article handoff |
| 06 | Your support requests | Follow up on a case | Sign-in entry and authorized request list; guest access only to public content |
| 07 | Need more help? | Escalate when unresolved | Only enabled/verified channels, market-aware routing and availability |

**Persistent behavior:** Safety Help must remain easy to find in header/menu and within relevant articles. It must not masquerade as a website emergency dispatch function.

### Suggested page copy

- Eyebrow: `HELP CENTER`
- H1: `What can we help you with?`
- Intro: `Find answers, manage an issue or get directed to the right support channel.`
- Search placeholder: `Describe your issue (e.g. refund, lost item, driver verification)...`
- Popular searches: `Refund`, `Lost item`, `Driver earnings`, `Account verification`, `Cancel a ride` — editorial examples, subject to content availability.
- Secondary actions: `Safety help`, `Track a support request`, `Contact support`.

## 3. Responsive visual direction

**Visual language:** Light neutral background, deep navy type, restrained Sanga blue, subtle role-identifying accents, simple icons, clean cards, generous whitespace. This is a **utility interface**, not a cinematic brand page. Avoid repetitive dashboard motifs and decorative photography.

**Desktop:** Search dominates upper left; high-priority support actions grouped alongside it; four role tiles; popular topics in readable rows; guided-help and request-tracking sections side by side where space permits; clear final escalation band.

**Tablet:** Search remains prominent; role tiles become two columns; guided-help and request-tracking stack or use balanced columns depending on width.

**Mobile:** Single-column compact search header; suggested searches wrap or scroll with visible overflow; Safety Help immediately accessible; role navigation becomes concise list items; popular articles are tappable rows. Do not merely shrink desktop cards. Article, Requests and Contact screens are separate responsive experiences, not homepage sections.

**Accessibility:** WCAG 2.2 AA target; semantic landmarks, one H1 per page, keyboard-operable search and accordions, visible focus, screen-reader labels, accessible status announcements, minimum 44×44 CSS-pixel touch targets, contrast-tested text and controls, reduced motion, no color-only meaning.

## 4. Search and content discovery

- Submit search by Enter or explicit Search button; suggested query chips populate and/or execute the same search flow consistently.
- Search published, approved help articles only; filter or rank by selected market, service and applicable user role. Public search must not index private support cases or unpublished content.
- Support typo tolerance and synonyms where feasible; avoid inventing answers. Search results include article title, short excerpt, category and relevant audience.
- Zero results: explain that no matching published articles were found; suggest changing query, browsing role topics or using an available contact channel.
- Loading, partial failure, offline and empty states must be distinct. No fabricated results or false success messages.
- Search analytics should minimize personal data collection; do not log sensitive free-text queries indiscriminately.

## 5. Role-based help taxonomy

| Area | Initial article families |
|---|---|
| Rider | Booking, cancellations, pricing/receipts, payment and refunds, lost items, identity, accessibility, safety |
| Driver | Onboarding, eligibility, vehicle records, offers and trips, earnings/settlements, payment issues, safety |
| Business | Organization invitations, employee permissions, travel policies, approvals, guest rides, billing |
| Fleet | Partner verification, driver invitations/acceptance, vehicle eligibility, assignments, commercial models, settlement disputes |

Users may hold multiple roles. On authenticated routes, select the **current support context** explicitly or infer it from the linked trip, organization or fleet relationship; never expose another organization's or partner's information by role alone.

## 6. Article page specification

**Proposed route:** `/help/articles/[slug]` (final route subject to engineering).  
**Desktop structure:** Breadcrumbs, article title, concise summary, step-by-step body, contextual diagrams, related articles, escalation action and feedback control.  
**Mobile structure:** Readable title, compact breadcrumbs, optional Overview / Steps / FAQs / Related navigation, expandable steps, clear bottom-of-article assistance. Tabs must not conceal critical safety instructions.

Article metadata: stable ID, slug, title, summary, role(s), category, market/jurisdiction, applicable service(s), language, content version, review owner, reviewed date, publish status, and effective dates where necessary. Editorial workflows must support draft, review, publication, update and retirement with redirects where appropriate.

**Illustrative receipt examples:** Label sample trip details, dates, amounts and maps `Illustrative example`. Do not hard-code a Nigerian naira receipt into US-market guidance or imply that generated sample records belong to real customers.

## 7. Guided troubleshooting flow

**Reference flow:** `I was charged incorrectly`.

1. Explain how to find the relevant completed trip and final receipt in an authenticated context.
2. Explain quote versus final fare and possible adjustments using only approved fare policy.
3. Ask whether the user still believes the charge is incorrect; provide an exit if resolved.
4. If unresolved, offer an authenticated trip-linked fare review request where the workflow is supported.
5. After successful server confirmation, show a real case reference and next steps; never display a fictitious submitted state.

The guide must support Back, Resume where feasible, Restart, explicit branching, and keyboard/screen-reader use. A failure to load a receipt must not be interpreted as a zero charge. When escalating, preserve safe context such as article ID, issue category and authorized trip reference; do not pass private trip information in public URL query parameters.

Additional candidate flows: lost item, cancellation, driver earnings discrepancy, failed verification, vehicle/driver assignment blocked and business ride approval. Each requires approved policy and canonical backend state mappings before publication.

## 8. Authenticated support requests

**Proposed route:** `/help/requests` (protected handoff; may resolve to an authenticated app or portal).  
**W-H04 mobile companion screen:** Active/Resolved tabs, request summary, status, next action and request detail link. All displayed sample case numbers, dates and statuses in the mockup are fictional.

**Security requirements:**
- Require a valid session and per-case authorization, including correct person, organization or fleet scope.
- Case reference alone is not an access credential. Protect attachments and all case history with server-side access checks.
- Avoid revealing case existence through unauthorized error messages.
- Support safe sign-in return navigation; restore the user's intended destination after authentication.
- Do not expose case contents in public search, indexing, analytics or notification previews.

**Illustrative case lifecycle:** Submitted → Under review → Information required → Resolved/Closed. Final statuses, reopening rules, notifications, SLAs and escalation paths must be defined by the support backend and operations team; the website cannot invent them.

## 9. Contact, escalation and safety

**Proposed route:** `/help/contact`. Display channels from verified configuration by country, region, user role, issue type and operating hours. In-app support, email, chat and phone are **possible channels**, not confirmed launch promises. Hide or clearly mark unavailable options; never fabricate phone numbers, email addresses, office hours or response-time guarantees.

**Escalation logic:** Public article → contextual troubleshooting → available support method or authenticated request. Preserve user context when safely possible and require consent before sharing additional information. Distinguish ordinary support from a safety incident and from immediate danger.

**Safety Help:** `/help/safety` or a validated route into `/safety` plus market-specific emergency resources. For immediate danger, direct users to locally verified emergency services. The public website must not show a simulated SOS button as though it contacts dispatch. Nigeria and US emergency information must be independently reviewed and kept current.

## 10. Suggested route inventory

| Route | Purpose | Access |
|---|---|---|
| `/help` | Search-first Help Center landing | Public |
| `/help/riders` | Rider articles and topics | Public |
| `/help/drivers` | Driver articles and topics | Public |
| `/help/business` | Business articles and topics | Public |
| `/help/fleet` | Fleet articles and topics | Public |
| `/help/articles/[slug]` | Published article detail | Public, except intentionally restricted content |
| `/help/contact` | Configured support contact options | Public; actions may require auth |
| `/help/safety` | Safety guidance entry | Public |
| `/help/requests` | Case list and tracking handoff | Authenticated and authorized |

All paths are proposed and must be reconciled with the official website information architecture and canonical app/portal routing. Use stable canonical links and redirects for renamed articles.

## 11. Backend, CMS and integration contracts

Required capabilities, with exact API paths to be defined by engineering:

- Published help article list/search/detail with role, market, language and category filters.
- Support channel configuration and availability, without exposing internal staffing information.
- Authenticated case list/detail, case creation, updates and attachments with server-side authorization.
- Contextual dispute/incident submission tied to an authorized trip or relationship when applicable.
- Market and service availability configuration shared with the wider Sanga platform.
- Editorial publishing controls, audit trail, versioning and cache invalidation.

**Important:** The marketing frontend must not be the source of truth for refunds, eligibility, payments, case state or emergency operations. Backend and approved policy own those decisions.

## 12. Required states and failure handling

Design and implement: initial loading, empty search, no search results, service unavailable, stale article, missing/retired article, offline, unauthorized request, expired session, failed submission, pending submission, successful confirmed submission, attachment upload failure, channel unavailable and unsupported market. Preserve entered content safely where appropriate, but do not persist sensitive data in insecure browser storage.

## 13. Content and legal controls

- No fictional customer stories, fabricated support outcomes or unverified operational claims.
- No promise of 24/7 support, specific response times or availability unless confirmed for that market and issue type.
- No guarantee of refunds, lost-item recovery, driver earnings or safety outcomes.
- Distinguish published policy from illustrative guidance; link to relevant current terms, privacy and safety information.
- Review jurisdiction-specific privacy, consumer protection, accessibility and emergency guidance before launch.
- Keep generated screenshots and receipt examples clearly labeled and replace with accurate approved product captures where available.

## 14. QA and acceptance criteria

1. Search returns only published and relevant articles; keyboard and mobile search both work.
2. Each role category leads to genuinely role-specific content and not a duplicated generic page.
3. Guided troubleshooting branches correctly, allows restart, and never claims a case was created without backend confirmation.
4. Unauthenticated visitors cannot access private cases, receipts or attachments; unauthorized users cannot access another party's cases.
5. Contact methods, support hours and emergency resources come from approved market configuration; unavailable channels do not falsely appear active.
6. Safety guidance clearly distinguishes urgent danger, active-trip concern and non-emergency reporting.
7. Mobile article, request and contact screens work independently, with accessible navigation and readable content.
8. Nigeria/US locale, currency and policy examples are correct for selected market; unsupported features are gated.
9. Loading, empty, offline, expired-session and failure states are understandable and actionable.
10. No generated sample case number, person, receipt, figure or channel detail is treated as real production data.
11. All links resolve to correct destinations; authenticated deep links restore safe intended context.
12. Accessibility checks cover screen readers, keyboard navigation, focus management, touch targets, reduced motion and contrast.

## 15. Open decisions and implementation dependencies

**Must confirm before publication:** Actual support channels and hours by market; case-management system and canonical statuses; help article ownership and CMS; approved dispute, refund and safety policies; emergency resources; escalation SLAs; language/localization coverage; exact authenticated support handoff routes; user consent and data retention policies.

**Design handoff:** W-H04 is the selected visual direction, not a pixel-perfect production asset or proof that depicted backend functions exist. Build reusable Help Center components consistent with the Sanga design system, while preserving this page's distinctive utility-first structure.

**Next cross-site task:** Audit global navigation, footer, route ownership, CTA handoffs, country selection, shared components, accessibility and content claims across Homepage, Ride, Drive, Business, Fleet, Safety, About and Help.
