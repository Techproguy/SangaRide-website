// Help Center copy (Help Center spec v1.0). Articles here stand in for the CMS: search only ever
// returns these published entries, and no support channel, hour or case is invented.

export type HelpArea = "riders" | "drivers" | "business" | "fleet";

export const helpAreas: { id: HelpArea; title: string; text: string; tone: string; iconTone: string }[] = [
  {
    id: "riders",
    title: "Rider support",
    text: "Bookings, fares, payments, cancellations, lost items, accessibility and more.",
    tone: "bg-brand-50",
    iconTone: "bg-brand-100 text-brand-700",
  },
  {
    id: "drivers",
    title: "Driver support",
    text: "Verification, trip offers, earnings, payouts, vehicle requirements and more.",
    tone: "bg-emerald-50",
    iconTone: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "business",
    title: "Business support",
    text: "Employee access, approvals, billing, organization settings and more.",
    tone: "bg-violet-50",
    iconTone: "bg-violet-100 text-violet-700",
  },
  {
    id: "fleet",
    title: "Fleet support",
    text: "Partner verification, driver and vehicle management, settlements and more.",
    tone: "bg-amber-50",
    iconTone: "bg-amber-100 text-amber-800",
  },
];

export type HelpArticle = {
  slug: string;
  title: string;
  summary: string;
  area: HelpArea;
  /** Extra search terms and synonyms. */
  keywords: string[];
  popular?: boolean;
};

export const helpArticles: HelpArticle[] = [
  {
    slug: "charged-incorrectly",
    title: "I was charged incorrectly",
    summary: "Check your receipt, understand charges and request a fare review.",
    area: "riders",
    keywords: ["refund", "fare", "receipt", "overcharged", "payment", "charge"],
    popular: true,
  },
  {
    slug: "cancel-a-ride",
    title: "I need to cancel a ride",
    summary: "Cancellation policy and refund eligibility.",
    area: "riders",
    keywords: ["cancel", "cancellation", "fee", "refund"],
    popular: true,
  },
  {
    slug: "account-verification",
    title: "My account or verification is under review",
    summary: "Steps to complete or resolve verification issues.",
    area: "drivers",
    keywords: ["verification", "account", "documents", "identity", "review"],
    popular: true,
  },
  {
    slug: "lost-item",
    title: "I left something in a vehicle",
    summary: "Report a lost item and learn about the recovery process.",
    area: "riders",
    keywords: ["lost", "item", "forgot", "left", "phone", "bag"],
    popular: true,
  },
  {
    slug: "driver-earnings-issue",
    title: "I have a driver earnings issue",
    summary: "Review payouts and report missing or incorrect earnings.",
    area: "drivers",
    keywords: ["earnings", "payout", "missing", "driver", "settlement", "pay"],
    popular: true,
  },
  {
    slug: "business-ride-approval",
    title: "A business ride needs approval",
    summary: "Request status and approval settings.",
    area: "business",
    keywords: ["approval", "business", "policy", "employee", "manager"],
    popular: true,
  },
  {
    slug: "payment-methods",
    title: "Managing payment methods",
    summary: "Add, remove or update the ways you pay for rides.",
    area: "riders",
    keywords: ["payment", "card", "wallet", "pay"],
  },
  {
    slug: "invite-employees",
    title: "Inviting employees to your organization",
    summary: "Send invitations and manage who can ride on your account.",
    area: "business",
    keywords: ["invite", "employee", "organization", "access", "permissions"],
  },
  {
    slug: "vehicle-documents",
    title: "Vehicle documents and eligibility",
    summary: "What a vehicle needs before it can be assigned to trips.",
    area: "fleet",
    keywords: ["vehicle", "documents", "eligibility", "inspection", "fleet"],
  },
  {
    slug: "settlement-disputes",
    title: "Questions about a fleet settlement",
    summary: "Understand settlement records and raise a dispute.",
    area: "fleet",
    keywords: ["settlement", "dispute", "fleet", "payout", "earnings"],
  },
];

export const popularSearches = ["Refund", "Lost item", "Driver earnings", "Account verification", "Cancel a ride"];

export const articlePath = (slug: string) => `/help/articles/${slug}`;
export const helpAreaPath = (area: HelpArea) => `/help/${area}`;
export const helpContactPath = "/help/contact";
export const helpSafetyPath = "/help/safety";
export const helpRequestsPath = "/help/requests";

/** Case-insensitive match on title, summary and keywords; every query word must match somewhere. */
export function searchArticles(query: string) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  return helpArticles.filter((a) => {
    const haystack = [a.title, a.summary, ...a.keywords].join(" ").toLowerCase();
    return words.every((w) => haystack.includes(w));
  });
}

/** Guided-help preview for the reference flow; the full guide lives on the article. */
export const guidedSteps = ["Check your trip receipt", "Review the charge details", "Confirm expected vs. final fare", "Submit a fare review request (if needed)"];
