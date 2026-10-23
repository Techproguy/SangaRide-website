// Drive page copy and configuration. Everything here is illustrative or pending approval
// (Drive page spec v1.0, §14): no fee, requirement or support promise below is Sanga policy yet.

import type { CountryCode } from "./content";

/**
 * Driver onboarding entry point. Engineering has not confirmed the route yet, so CTAs go to
 * /drive/apply, which shows an honest "not open yet" state instead of a dead button.
 */
export const driverApplyPath = "/drive/apply";

export type CalculatorExample = {
  locale: string;
  currency: string;
  fare: number;
  /** Whole percent, e.g. 15 for 15%. */
  feeRate: number;
  fuel: number;
  other: number;
  /** Slider ranges; the paired number inputs accept values beyond the slider max. */
  max: { fare: number; feeRate: number; fuel: number; other: number };
  step: number;
};

/**
 * Educational examples only. A market without an approved example shows an unavailable state —
 * never convert the Nigerian figures into another currency.
 */
export const calculatorExamples: Record<CountryCode, CalculatorExample | null> = {
  NG: {
    locale: "en-NG",
    currency: "NGN",
    fare: 6000,
    feeRate: 15,
    fuel: 1800,
    other: 500,
    max: { fare: 30000, feeRate: 40, fuel: 15000, other: 10000 },
    step: 100,
  },
  US: null,
};

export type GettingStartedStep = { title: string; text: string };

export const gettingStartedSteps: GettingStartedStep[] = [
  { title: "Choose your location", text: "Pick your country and city to see whether applications are open there." },
  { title: "Create your account", text: "Sign in or register with Sanga. Driver verification is a separate step." },
  { title: "Submit your details", text: "Add driver, vehicle, licence and insurance information for your market." },
  { title: "Verification", text: "We review your documents and any vehicle inspection your location needs." },
  { title: "Get your status", text: "You'll see the outcome and next steps. Approval isn't automatic." },
];

/** Categories only — the exact documents come from the onboarding service for each location. */
export const requirementsByMarket: Record<CountryCode, { summary: string; items: string[] }> = {
  NG: {
    summary: "Requirements are set for Nigeria and can differ by state and city.",
    items: ["Proof of identity", "Valid driver's licence", "Vehicle registration and roadworthiness documents", "Insurance cover for your vehicle", "Any checks or inspection your city requires"],
  },
  US: {
    summary: "Requirements in the United States are set by state and city, separately from Nigeria.",
    items: ["Proof of identity and eligibility to work", "Valid driver's licence for your state", "Vehicle registration and inspection, where required", "Insurance that meets your state's rules", "Any background or record checks your location requires"],
  },
};

export const driveFaqs = [
  {
    q: "What documents do I need?",
    a: "It depends on your country, state and city. You'll see the exact list for your location when you start an application, and the requirements section above shows what's usually involved.",
  },
  {
    q: "Can I drive with a fleet vehicle?",
    a: "Fleet-affiliated drivers may need an authorised relationship with the fleet and a vehicle assignment. Fleet owners and their drivers can start from the Fleet page.",
  },
  {
    q: "How are fees and payouts calculated?",
    a: "Your trip summary in the Driver app shows the fare, any applicable commission, adjustments and payout status. The calculator on this page is an example only and doesn't reflect Sanga's fees.",
  },
  {
    q: "How do I see trip details before accepting?",
    a: "Trip requests show the details available for that offer, such as pickup area and estimated fare information, before you accept or decline.",
  },
  {
    q: "What if fuel prices rise?",
    a: "Fuel and other running costs are yours to manage. Use the calculator to try different fuel costs and see how they change the example.",
  },
  {
    q: "How do I report an incident?",
    a: "Use the safety and support tools in the Driver app during or after a trip. The Safety page explains how reports are handled.",
  },
  {
    q: "Where is driver onboarding available?",
    a: "Availability depends on country and city. Choose your location when you apply to see whether applications are open there.",
  },
  {
    q: "How long does review take?",
    a: "It varies with your location and the checks involved. You'll see your application status and any next steps in your account.",
  },
];
