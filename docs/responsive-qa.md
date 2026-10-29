# Responsive review — 2026-10-29

## Changes

- Removed Cities from the shared desktop/mobile primary navigation.
- Portaled the mobile menu outside the blurred header so it fills the viewport. Added independent scrolling, safe-area padding, focus containment, Escape, focus restoration and automatic close at the desktop breakpoint.
- Made Home, Drive, Business and Fleet hero imagery grow with the copy on mobile, keeping every headline and CTA over its background.
- Reduced small-screen heading sizes and section spacing while retaining larger-screen layouts.
- Improved mobile touch targets, sliders, dropdown sizing, country controls, footer links and newsletter layout.
- Kept input text at 16px on mobile/tablet to avoid automatic focus zoom in Safari. Scheduled date/time fields stack on narrow phones.
- Added a visible swipe hint and keyboard focus to the fleet allocation table's scrolling region.

## Browser verification

All 13 routes passed checks for page overflow and unintended text/control clipping at 320px and 768px:

`/`, `/ride`, `/drive`, `/business`, `/fleet`, `/about`, `/help`, `/safety`, `/book`, `/drive/apply`, `/business/contact`, `/fleet/apply`, `/fleet/contact`.

The eight main pages also passed at the 640px breakpoint and at 1280px. Desktop navigation has no overlapping actions, and Cities is absent. The Fleet page was visually checked at 1024px.

Interaction checks:

- Mobile menu fills the screen at both 390×844 and 320×568; long Fleet CTA fits.
- Menu scroll is independent, background scrolling is locked, reverse Tab wraps, Escape closes and focus returns to the menu button.
- Switching to 1024px closes the open menu and restores background scrolling.
- Booking dropdowns, scheduled fields and empty-submit validation remain usable at 320px; input text computes to 16px.
- All seven Business console modules and all four Fleet preview panels fit at 320px. Fleet's wider table stays inside its own scrolling region.
- Phone and desktop hero screenshots were visually inspected after background changes.

Checks use the local browser at controlled viewport sizes. Physical iOS/Android device testing was not performed.
