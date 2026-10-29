import type { CountryCode } from "./content";

// Educational copy only. No market has a confirmed live capability/resource feed yet.
// Change these statuses only after deployment and public copy have been reviewed.
export const safetyMarkets: Record<CountryCode, { status: string; sharing: string; privacy: string }> = {
  NG: {
    status: "Nigeria guidance · feature availability is still being confirmed by city.",
    sharing: "Trip sharing and Guardian tools are planned for supported Nigerian locations. Check the app for availability; this guide does not confirm local coverage.",
    privacy: "Nigeria privacy and data-rights resources will appear here when the applicable notice and support routes are published.",
  },
  US: {
    status: "United States guidance · availability and rules may differ by state and city.",
    sharing: "Trip sharing and Guardian tools are planned for supported US locations. Availability, age requirements and consent rules depend on the state and service.",
    privacy: "US privacy and data-rights resources will appear here when state-specific notices and support routes are published. Recording rules vary by jurisdiction.",
  },
};

export const safetyStages = [
  { title: "Before you get in", short: "Check your pickup", heading: "The right car. The right person.", text: "Compare the arriving vehicle and driver with your assigned trip. Complete Match Check before following the Trip PIN process.", image: "/images/safety-hero.webp", alt: "Illustrative scene of a rider checking her phone beside a parked car", action: "Explore the pickup guide", href: "#pickup-guide" },
  { title: "During your ride", short: "Stay connected", heading: "Keep someone in the loop.", text: "Where enabled, share your trip with someone you trust. A weak connection can delay location updates; an old update is not a live location.", image: "/images/phone-hand.webp", alt: "Illustrative close-up of a phone held inside a car", action: "See sharing guidance", href: "#people" },
  { title: "When something goes wrong", short: "Put safety first", heading: "Know your next step.", text: "Move to safety if you can. For immediate danger, contact local emergency services. Use supported app reporting tools when it is safe to do so.", image: "/images/driver.webp", alt: "Illustrative driver standing beside a parked vehicle", action: "Find situation-specific guidance", href: "#situations" },
  { title: "After the trip", short: "Report and follow up", heading: "Your concern deserves a clear path.", text: "Keep relevant trip details and report through supported channels. Review and follow-up depend on the case; no response time or outcome is guaranteed.", image: "/images/experience.webp", alt: "Illustrative passenger looking through a car window", action: "Find safety resources", href: "#safety-resources" },
] as const;

export const pickupSteps = [
  { title: "Check the vehicle", text: "Compare the vehicle and registration plate with the current assignment in your Rider app.", note: "A familiar car is not enough. Check the actual trip details.", label: "Vehicle details", detail: "Vehicle model + registration plate" },
  { title: "Check the driver", text: "Compare the person at pickup with the assigned driver’s photo in your app.", note: "If the person or vehicle does not match, do not get in.", label: "Driver identity", detail: "Compare the person with the app photo" },
  { title: "Complete Match Check", text: "Only confirm in the app after you have physically checked both the driver and vehicle.", note: "A guardian watching remotely cannot complete this physical check for you.", label: "Two checks, one match", detail: "Driver and vehicle must both match" },
  { title: "Then, the Trip PIN", text: "After Match Check, follow the app’s trip-specific PIN exchange and verification instructions before the journey starts.", note: "This guide does not issue a PIN or authorize a real trip.", label: "Trip-specific PIN", detail: "Follow the instructions in your app" },
] as const;

export const safetyScenarios = [
  { title: "Wrong driver or vehicle", lead: "Don’t get in.", text: "Move somewhere safe. Check your current assignment, then use the app’s available cancellation or reporting options. Do not accept a substitute driver or car outside the app.", urgent: false },
  { title: "Unexpected route or behavior", lead: "Prioritize your safety.", text: "Check the route if it is safe to do so. Use available trip-sharing and safety tools. For threatening behavior or immediate danger, contact local emergency services when you can.", urgent: false },
  { title: "Serious safety incident", lead: "Seek safety and emergency help first.", text: "For a threat, assault or immediate danger, contact local emergency services as soon as you safely can. Report to Sanga through supported channels afterward. This website cannot dispatch help.", urgent: true },
  { title: "Breakdown or roadside hazard", lead: "Stay clear of moving traffic.", text: "Move to a safe place if possible. Follow available in-app breakdown or trip-recovery instructions. For immediate danger, contact local emergency services rather than waiting for a support response.", urgent: false },
  { title: "Payment or trip dispute", lead: "Keep it calm. Keep the records.", text: "Avoid confrontation. Keep your receipt and relevant trip details, then use the app’s available dispute or reporting route. Do not share payment details in public messages.", urgent: false },
] as const;

export const safetyAudiences = [
  { title: "Riders", image: "/images/journey-city.webp", text: "Check your assigned driver and vehicle, complete Match Check, then follow the PIN process. Use sharing and reporting tools where available." },
  { title: "Drivers", image: "/images/drive-hero.webp", text: "Follow the approved PIN flow and use supported channels for unsafe pickups, disputes or roadside incidents. A driver cannot override the rider’s Match Check." },
  { title: "Teens", image: null, text: "Teen rides depend on market and age rules and guardian authorization. The teen rider still checks the actual driver and vehicle; remote monitoring cannot replace that check." },
  { title: "Guardians", image: "/images/business.webp", text: "Only authorized trips may be visible. Check when a location was last updated; connectivity can delay it. Access is scoped, and does not mean continuous monitoring." },
  { title: "Seniors & caregivers", image: "/images/experience.webp", text: "Ask for clear pickup instructions and use assistance where supported. Delegated booking and support require consent; caregivers do not automatically receive all trip data." },
] as const;

export const safetyPrivacy = [
  { title: "Trip information", text: "Trip and safety information may support operations, reviews and disputes, as described in the applicable published privacy notice." },
  { title: "Report review", text: "Supported report → triage → authorized review or escalation → an update where applicable. Each case is considered individually." },
  { title: "Access & evidence", text: "Access must follow the applicable permissions and lawful processes. Keep sensitive evidence in supported channels, rather than public posts." },
] as const;
