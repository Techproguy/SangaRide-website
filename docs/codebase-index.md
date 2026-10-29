# Sanga Ride codebase index

Reviewed: 2026-10-29. Paths in this document are relative to `web/` unless stated otherwise.

## Scope and current state

This repository implements the public Sanga Ride marketing website for riders, drivers, businesses and fleet partners, plus a Figma-based fleet portal frontend at `/fleet/portal`. It includes interactive previews, but does not implement a production ride-hailing service. There are no API route handlers, authentication service, database integration or payment integration. Fleet portal records and actions are explicitly sample data and local preview state.

The Git repository is `SANGA-RIDE/web`, rather than the parent `SANGA-RIDE` folder. The parent contains design specifications, reference JPEGs and a local environment file. Do not expose or commit credentials.

## Stack and execution

- Next.js 16.4.2 App Router, React 19.3.0, strict TypeScript.
- Tailwind CSS 4 with a Turbopack CSS loader; Lucide React icons and local SVG helpers.
- `@/*` resolves to `src/*`.
- Run commands from `web/`: `npm run dev`, `npm run lint`, `npm run build`, `npm start` (after building).
- There is no dedicated automated test script configured.
- `AGENTS.md` requires reading relevant installed Next.js guides in `node_modules/next/dist/docs/` before code changes because this version has changed conventions.
- `next.config.ts` enables Cache Components and Partial Prefetching, pins the Turbopack root to this checkout and applies Tailwind to project CSS only, avoiding generated font CSS.

## Route map

| Route | Entry file under `src/app/` | Current behavior |
| --- | --- | --- |
| `/` | `page.tsx` | Marketing homepage, ride intent form, service discovery, journeys, partner opportunities and trust/download sections. |
| `/ride` | `ride/page.tsx` | Six service options, comparison, fare explanation and booking intent form. Selection is shareable through `?service=`. |
| `/drive` | `drive/page.tsx` | Driver pitch, request-to-payout walkthrough, earnings example, protection, requirements and FAQ. |
| `/business` | `business/page.tsx` | Business console demo, travel-policy simulator, reconciliation, use cases, spending and onboarding explanation. |
| `/fleet` | `fleet/page.tsx` | Vehicle/driver/assignment/settlement preview, onboarding explanation, settlement calculator and partner CTAs. |
| `/about` | `about/page.tsx` | Editorial brand story, principles, conceptual people gallery and future direction. |
| `/help` | `help/page.tsx` | Local article-summary search, support categories, popular topics and support/request links. |
| `/safety` | `safety/page.tsx` | Compact educational safety guide: lifecycle stages, sequential pickup walkthrough, incident scenarios, audience guidance, privacy and resources. |
| `/book` | `book/page.tsx` | Coming-soon page displaying supplied trip details; no quotes or booking submission. |
| `/drive/apply` | `drive/apply/page.tsx` | Applications-not-open page. |
| `/business/contact` | `business/contact/page.tsx` | Sales enquiries-not-open page. |
| `/fleet/apply` | `fleet/apply/page.tsx` | Redirect to the fleet portal login. |
| `/fleet/portal/[[...path]]` | `fleet/portal/[[...path]]/page.tsx` | Fleet portal login and 39 management routes; see `docs/fleet-portal.md`. |
| `/fleet/contact` | `fleet/contact/page.tsx` | Partnerships enquiries-not-open page. |

## Shared structure and styling

`src/app/layout.tsx` provides metadata, Plus Jakarta Sans and Caveat fonts. `MarketingChrome` renders the public header/footer outside `/fleet/portal`; the portal layout provides Work Sans and its own scoped shell. Individual page files compose section components and supply page metadata.

`src/app/globals.css` owns Tailwind theme colors, typography, shadows, common utilities, focus styles, animations and reduced-motion behavior. The visual system uses blue brand accents, dark navy panels, white/pale backgrounds, rounded cards and a 1280px page container.

| Component | Responsibility |
| --- | --- |
| `src/components/SiteHeader.tsx` | Sticky desktop navigation, ride flyout, mobile menu and route-specific primary CTA. |
| `src/components/SiteFooter.tsx` | Grouped navigation, social placeholders, newsletter and country selector. |
| `src/components/Select.tsx` | Shared controlled listbox with keyboard navigation, type-ahead and focus handling. |
| `src/components/SliderField.tsx` | Shared numeric/range controls for calculators. |
| `src/components/StatusPill.tsx` | Shared status styling for demo records. |
| `src/components/Market.tsx` | Page-scoped Nigeria/United States context, market toggle and CTA links carrying `?market=`. |
| `src/components/CountrySwitcher.tsx` | Independent local country selection; does not update page market context. |
| `src/components/NotOpenYet.tsx` | Shared unavailable-flow page with selected-market note and return links. |
| `src/components/icons.tsx` | Brand mark, flags, platform/social icons and QR graphic. |

## Content and demo data

`src/lib/` holds typed, local content rather than fetching a CMS or operational API:

- `content.ts`: market names/currencies, main navigation, ride menu, six service definitions (Go, Plus, XL, Lux, Moto, Assist), journeys and footer links.
- `drive.ts`: application route, educational earnings inputs, onboarding steps, market requirements and FAQ.
- `business.ts`: fictional console records, policy examples, roles, reconciliation/use cases, setup steps and requirements.
- `fleet.ts`: fictional fleet records, operator descriptions, onboarding steps, settlement examples and allocation function.
- `about.ts`: brand narrative, principles, people perspectives and audience links.
- `help.ts`: four support areas, ten article metadata entries, popular terms, route helpers and local search.
- `safety.ts`: educational journey stages, ordered pickup checks, incident scenarios, audience guidance, privacy copy and independent Nigeria/US availability explanations. Live capability deployment is not confirmed.
- `format.ts`: currency formatting helper.

Copy and figures contain explicit pending-approval or illustrative-data caveats. Treat these as implementation content, not evidence of live service coverage or approved operational policy.

## Main interaction paths

### Rider discovery and booking intent

`Hero` renders `RideSearchEntry`. The form supports ride, airport, intercity and hourly contexts, optional scheduling, and client-side required-field validation. It constructs query parameters and routes to `/book`. `BookingIntentSummary` reads those parameters inside a Suspense boundary and displays them.

The geolocation control requests browser permission but discards returned coordinates and inserts the text `Current location`. No geocoding, address autocomplete, route calculation, fare lookup or dispatch occurs.

`ride/RideExplorer.tsx` resolves `?service=`, falls back to Go for invalid selections, and updates the URL without scrolling when choosing a service. It composes `RideShowroom`, `RideComparison`, `FareExplainer` and `RideBookingCTA`. The CTA also passes intent to `/book`.

### Driver education

`drive/RequestToPayout.tsx` switches between four illustrative phone screens from `PhoneScreens.tsx`. `DriveOnYourTerms` includes `EarningsCalculator`, whose adjustable fares, percentage fee, operating costs and trip count stay in client state. Nigeria has an educational example; the US shows an unavailable state rather than converting Nigerian figures. Negative calculated outcomes are retained.

`GettingStarted`, `DriveProtection` and `DriveFAQ` provide explanatory content. `drive/DriveMarket.tsx` wraps application links so they carry the selected market.

### Business preview

`business/BusinessHero.tsx` embeds `BusinessConsole`. Its modules cover overview, rides, people, policies, approvals, billing and reports using local sample records. Demo interactions do not persist or enforce real organization permissions.

`business/PolicyControl.tsx` evaluates a local example policy: disallowed ride classes are denied; guest XL/Lux requests need approval; fares above the configured limit need approval; otherwise the example is allowed. Changing market resets the simulator. Export is explicitly unavailable in the demo.

### Fleet preview

`fleet/FleetPreview.tsx` provides keyboard-accessible tabs for vehicles, drivers, assignments and settlements. Eligibility, invitation, verification and assignment states are modeled separately in local records.

`fleet/SettlementDemo.tsx` uses `allocate()` from `lib/fleet.ts`: calculate the platform share from the fare, then apply the fleet percentage to the remaining amount; the driver receives the remainder. Nigeria has illustrative inputs; the US calculator example is unavailable. These are educational allocations, not payment processing or accounting records.

### Help and newsletter

`help/HelpSearch.tsx` searches article metadata locally on submit or popular-chip selection. `searchArticles()` requires every query word to appear somewhere in the title, summary or keywords. Article bodies and destination routes are not implemented.

`NewsletterForm.tsx` validates email syntax and displays a sign-ups-opening-soon message. It stores and submits nothing.

### Safety education

`safety/SafetyGuides.tsx` contains a keyboard-operated lifecycle timeline, sequential Match Check-before-PIN guide, mismatch branch, reassignment reset, scenario selection and audience guidance (accordions on mobile). `safety/SafetySections.tsx` owns the generated-photo hero, local market controls, privacy disclosures and resources. The page accesses no private trip data and cannot create incidents or dispatch emergency help. Missing verified safety contacts and privacy notices use explanatory text; the working Help Center link points to `/help`.

## Assets and design references

- `public/images/`: existing WebP campaign imagery, vehicle images, cities/maps and a PNG logo mark.
- `src/app/icon.png` and `apple-icon.png`: app icons.
- `docs/design/`: About, Help Center and Safety v1.0 specifications plus About/Help reference JPEGs; About/Help copies also exist in the parent folder.
- `public/images/safety-hero.webp`: conceptual AI-generated pickup photograph, created for the Safety page and converted to WebP. It does not depict a real assignment or certify live operations.
- The About specification distinguishes conceptual imagery from real people/operations and requires approval for brand/operational claims.
- The Help specification describes a larger support product, including articles, role-specific help, authenticated requests and verified support channels. The current implementation covers its landing page and local metadata search only.
- `scripts/generate-images.mjs`: optional external OpenAI image generation with retries/model fallback, resizing and WebP conversion through `sharp`. It reads `OPENAI_API_KEY` from the environment; it is outside the runtime website and must not be run casually because it calls a paid external service. `sharp` is imported but not declared directly in `package.json`.

## Known gaps and likely next work

1. **Route coverage:** navigation links point to absent routes including `/cities`, `/airport`, `/intercity`, `/hourly`, `/sign-in`, `/careers`, `/press`, `/contact`, `/accessibility` and `/legal/*`. Help category, article, contact, `/help/safety` and request destinations are also absent. No redirect configuration supplies these routes.
2. **Conversion integrations:** booking, driver/fleet applications, sales/partnership enquiries and newsletter capture need real services and approved contracts.
3. **Market consistency:** header/footer country switchers each own independent local state; `/drive`, `/business`, `/fleet` and `/safety` each start their own `MarketProvider` at Nigeria. Country choice is not persisted or synchronized globally. Header CTAs do not carry the page market, unlike `MarketLink` CTAs.
4. **Incomplete controls:** header search has no action; social and app-store links use `#`; geolocation is only a UI stub.
5. **Content readiness:** service availability, safety promises, capacities, pricing/fee examples and images need review against actual operations before production claims are made.
6. **Documentation and QA:** README remains the create-next-app starter. No dedicated test suite, sitemap or robots source file was found. Keyboard and reduced-motion accommodations exist, but this index is not a browser accessibility or visual audit.

## Validation for this review

- Initial Git working tree was clean.
- `npm run lint`: passed.
- `npm run build`: passed, including TypeScript and static page generation. The route output confirms the implemented page inventory above.
- Review did not call external image APIs or read environment-file values.

## Where to start for future changes

- Copy/navigation/service definitions: start in `src/lib/`.
- Layout/theme/spacing: `src/app/globals.css`, shared header/footer, then the relevant section component.
- New page: add `src/app/<route>/page.tsx` and reuse the established shell/components.
- Ride handoff: `RideSearchEntry`, `ride/RideBookingCTA`, `/book` and `BookingIntentSummary`.
- Market handling: reconcile `CountrySwitcher`, `MarketProvider`, `MarketLink` and `MarketNote`.
- Help completion: start with `docs/design/` and `lib/help.ts`, then implement destinations before expanding search promises.
