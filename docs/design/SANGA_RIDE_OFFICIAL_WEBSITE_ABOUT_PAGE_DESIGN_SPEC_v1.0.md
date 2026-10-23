# Sanga Ride — Official Website About Page Design Specification

**Version:** 1.0  
**Route:** `/about`  
**Reference board:** W-A04 — Final Integrated About Page (desktop and mobile)  
**Status:** Selected design direction; production content, imagery, and operational claims pending validation  
**Audience:** Product, brand, design, frontend, content, QA

## 1. Purpose and boundaries

The About page establishes Sanga Ride's point of view, purpose, principles, human context, and long-term direction. It is an editorial brand experience—not a ride-booking funnel, vehicle catalogue, driver earnings calculator, corporate dashboard, or Fleet Portal preview. The page should be recognizably different from `/`, `/ride`, `/drive`, `/business`, `/fleet`, and `/safety`.

**Primary user outcome:** Understand why Sanga Ride exists and identify a relevant next step.  
**Secondary outcome:** Build credible confidence in the brand without relying on fabricated statistics or endorsements.

### Non-negotiable constraints
- Nigeria and United States are Day 1 implementation markets, but do not equate market architecture with universal live city/service coverage.
- Never invent founding dates, executive identities, investor relationships, partnerships, operating statistics, driver counts, testimonials, or launch dates.
- All photos in W-A04 are **conceptual visual references**, not evidence of real Sanga riders, drivers, employees, partners, or operational coverage.
- Claims about safety, pricing, or platform outcomes must align with approved product policy and actual deployment.
- Any unapproved brand copy below is **proposed**, not a formally approved mission statement.

## 2. Content and information architecture

### 01 — Manifesto hero
**Eyebrow:** ABOUT SANGA RIDE  
**Proposed H1:** Movement builds possibilities.  
**Proposed body:** Sanga Ride is a mobility platform being built for people, communities and businesses. Our ambition is to make transportation more understandable, accountable and responsive to the realities of the places we serve.  
**Primary action:** Explore our story → scroll to `#why-we-exist` (ordinary in-page anchor; **not** a video).  
**Optional secondary action:** Learn more about Sanga → scroll to `#our-principles`.

**Visual:** Cinematic panoramic urban movement/cityscape with readable dark overlay, restrained vivid-blue emphasis on “possibilities.” No booking widget. If a city is recognizable, ensure the visual is not misrepresented as a currently active Sanga service area. Avoid gratuitous decorative handwritten text if it reduces clarity.

### 02 — Why We Exist (`#why-we-exist`)
**Proposed H2:** A better journey must work for everyone.  
**Narrative:** Riders need clarity and confidence; drivers need visibility into the work and costs of each journey; vehicle owners need accountability; businesses need manageable transportation. Sanga's approach considers all these stakeholders together.

**Visual:** Asymmetric editorial photo essay: everyday traveler, driver, and wider community/city. These are conceptual archetypes, not testimonials. The text must remain readable independent of the imagery.

### 03 — Our Principles (`#our-principles`)
**Proposed H2:** The values that guide how we build.

Use **numbered typographic statements**, not a grid of feature cards:

01. **Clarity over complexity.** People should understand choices, costs and responsibilities associated with their journeys.
02. **Protection by design.** Trust should be supported by verification, practical safeguards and accountable processes.
03. **Opportunity on both sides.** Mobility decisions should consider riders, drivers and operating partners.
04. **Built for real markets.** Local conditions matter; technology and operating rules should reflect Nigeria/US differences.

**Interaction:** Static content by default; no unnecessary animations or clickable affordances. On mobile, stack in a readable vertical sequence with clear numbering.

### 04 — Built Around People (`#built-around-people`)
**Proposed H2:** Real journeys. Real people.

Show four stakeholder perspectives: **Riders**, **Drivers**, **Vehicle Owners**, **Businesses**. Use an editorial image sequence or accessible horizontally navigable gallery. Each perspective receives one concise explanation of why mobility matters to them; do not label imagery as a real Sanga story without documented consent and provenance.

**Gallery requirements:** Prev/next controls, keyboard support, visible focus, semantic buttons, alt text, touch swipe as enhancement only; content accessible without swiping. On narrow screens use a vertical editorial layout or accessible scroll-snap with visible controls. Avoid autoplay.

### 05 — Where We're Going (`#our-direction`)
**Proposed H2:** Built for today. Thinking beyond the next journey.  
**Narrative:** Sanga Ride is being designed as a connected, market-aware mobility platform serving different participants and operating contexts. Service availability will depend on local readiness, eligibility, and operational configuration.

**Visual:** One cinematic city/roadway composition with a single short editorial statement, **not** three repetitive roadmap cards. Do not promise future features, partnerships, geographic coverage, or dates.

### 06 — Be Part of the Journey (`#join-the-journey`)
**Proposed H2:** There's more than one way to move forward.

Use **large typographic links** with arrows and accessible hit areas, not repeated photographic cards:
- Ride with Sanga → `/ride`
- Drive with Sanga → `/drive`
- Sanga for Business → `/business`
- Partner with Sanga → `/fleet`

Each link is real navigation. No artificial modal or chat handoff. Footer provides Safety, Help, legal/privacy, country/locale, and standard company navigation as defined in the global site shell.

## 3. Layout and responsive system

### Desktop (≥1024px)
- Editorial panoramic hero with large left-aligned H1; keep text within a safe width and maintain contrast over all image crops.
- Why We Exist uses asymmetrical text/photo columns; imagery should not dominate the body copy.
- Principles use four numbered typographic columns or a responsive 2×2 layout if necessary for readability.
- People section uses an intentional full-bleed or dark editorial break with gallery navigation.
- Direction section uses one visual and one strong statement.
- Closing links are minimalist, typographic, and clearly interactive.

### Tablet (768–1023px)
- Reduce hero headline scale, preserve image subject, collapse photo essays to two columns as appropriate.
- Principles become 2×2 or stacked based on measured content widths.
- Gallery shows 1–2 items, with accessible navigation.

### Mobile (<768px)
- Prioritize legible hero copy and safe photo cropping; no tiny text over busy imagery.
- One-column narrative with generous spacing and alternating image rhythm.
- Principles stack vertically; do not simply shrink desktop four-column typography.
- People gallery must expose labels and context without hover.
- Direction statement must not be buried under overlay cards.
- Destination links are full-width rows with at least 44×44px interactive targets.

### General
- Respect site-wide design tokens and global navigation/footer; do not introduce page-only font or color systems.
- Avoid fixed heights that crop meaningful copy on small screens or when text scales.
- Use responsive image sources, lazy-load below-fold imagery, and reserve image dimensions to minimize layout shift.

## 4. Interaction and motion

| Element | Trigger | Result | Failure/edge handling |
|---|---|---|---|
| Explore our story | Click / Enter | Smooth-scroll to `#why-we-exist` | Honor reduced-motion preference; native anchor fallback |
| Learn more about Sanga | Click / Enter | Scroll to `#our-principles` | Native anchor fallback |
| People gallery | Arrow, swipe, keyboard | Change active editorial story | Focus visible; no autoplay; full content reachable without gesture |
| Closing destination links | Click / Enter | Navigate to appropriate public route | Preserve site-level locale; show standard error state if route fails |
| Country selector in global nav | Select country | Update site-level market context | Do not imply city availability or force unrelated content to change |

No fictitious “Watch our story — 2 min” player unless a real licensed film and accessible player are commissioned.

## 5. Content, asset, and legal review

**Copy review:** Brand/product owners approve manifesto and principle wording; legal/operations review any claims about reliability, safety, market availability, and service outcomes.  
**Asset review:** Record license/usage rights, attribution requirements, and model releases where needed. Avoid identifiable customers/partners without permission.  
**Geography:** Nigeria and US references describe platform architecture/operating intent, not blanket city coverage.  
**Localization:** Country-aware spelling/copy where needed, locale-ready content structure, no currency display required on this page.  
**Fallbacks:** If commissioned imagery is unavailable, use approved licensed editorial photos or an art-directed text-first layout rather than unverified brand photos.

## 6. Accessibility and performance

- Semantic page structure: one H1, logical H2s, landmarks (`main`, `nav`, `footer`), meaningful link names.
- WCAG 2.2 AA target for color contrast, focus visibility, keyboard operation, and text scaling.
- Decorative images use empty alt text; informative images use concise meaningful alternatives.
- No essential information appears solely in images, hover, color, or motion.
- Respect `prefers-reduced-motion`; no forced parallax or autoplay media.
- Optimize hero LCP and responsive imagery; defer below-fold assets; avoid CLS from galleries and overlays.
- Include metadata: page title, description, canonical URL, social preview; only use factual structured data.

## 7. Suggested component map

```text
AboutPage
 ├─ GlobalSiteHeader
 ├─ ManifestoHero
 ├─ WhyWeExistEditorial
 ├─ PrinciplesTypography
 ├─ PeopleStoryGallery
 ├─ FutureDirectionEditorial
 ├─ JourneyDestinationLinks
 └─ GlobalSiteFooter
```

Components should be driven by reviewed content records, with imagery and link destinations configurable through the site's existing content architecture. Do not add backend dependencies just to animate editorial content.

## 8. Developer acceptance criteria

- [ ] All six sections appear in the specified order and use approved copy.
- [ ] `/about` has a distinct editorial visual language from the five product-focused pages.
- [ ] Hero CTA scrolls to content and never launches a non-existent video.
- [ ] People photography is properly licensed and does not imply unverified testimonials.
- [ ] Principles are typographic, not repeated feature-card components.
- [ ] Future direction contains no fabricated roadmap or coverage guarantees.
- [ ] Gallery, if used, is accessible by keyboard and touch, with reduced-motion support.
- [ ] Closing links navigate correctly to `/ride`, `/drive`, `/business`, and `/fleet`.
- [ ] Nigeria/US context does not assert unverified active coverage.
- [ ] Mobile layout is independently composed and legible at narrow widths and enlarged text sizes.
- [ ] WCAG 2.2 AA review, image optimization, and metadata QA are completed.
- [ ] Content/brand/legal sign-off is recorded before production release.

## 9. Handoff status and open approvals

**Selected reference:** W-A04, with corrections recorded in design review.  
**Ready for:** Frontend structure, component planning, asset procurement, responsive implementation.  
**Not yet approved:** Final corporate brand statements, licensed production imagery, operational claims, and any brand film.  
**Next website design phase:** Help Center and Support (`/help`), then global navigation and cross-page consistency review.
