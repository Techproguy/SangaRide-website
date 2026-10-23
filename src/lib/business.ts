// Business page copy and demo data. Every name, company, amount and status below is fictional
// and shown only inside surfaces labelled "Demo preview" (Business page spec v1.0, §8).

import type { CountryCode } from "./content";

/** Sales enquiry route; the CRM/lead integration isn't connected yet, so it shows an honest state. */
export const businessContactPath = "/business/contact";

export type RideStatus = "Completed" | "In progress" | "Scheduled" | "Cancelled";
export type ApprovalStatus = "Approved" | "Pending" | "Declined";

export type BusinessDemo = {
  locale: string;
  currency: string;
  company: string;
  period: string;
  totals: { rides: number; exceptions: number };
  people: { name: string; role: string; team: string; status: "Accepted" | "Invited" }[];
  /** Spend by cost centre; the total shown is always their sum. */
  costCentres: { name: string; amount: number }[];
  requests: { traveller: string; type: "Employee" | "Guest"; ride: string; from: string; to: string; status: ApprovalStatus; cost: number }[];
  rides: { traveller: string; ride: string; route: string; when: string; status: RideStatus; cost: number }[];
  approvals: { id: string; traveller: string; reason: string; ride: string; cost: number; team: string }[];
  billing: { ref: string; label: string; amount: number; status: "Charged" | "Adjusted" | "Payment failed" }[];
  monthly: { month: string; amount: number }[];
  /** Toll added to the example trip record in the Spending section. */
  tollAdjustment: number;
};

export const businessDemo: Record<CountryCode, BusinessDemo> = {
  NG: {
    locale: "en-NG",
    currency: "NGN",
    company: "Northwind Logistics (demo)",
    period: "1–31 Oct",
    totals: { rides: 248, exceptions: 4 },
    people: [
      { name: "Tolu A.", role: "Organisation admin", team: "Operations", status: "Accepted" },
      { name: "Ada O.", role: "Booking admin", team: "Sales", status: "Accepted" },
      { name: "Kemi L.", role: "Approver", team: "Finance", status: "Accepted" },
      { name: "Chidi A.", role: "Employee", team: "Operations", status: "Accepted" },
      { name: "Femi J.", role: "Employee", team: "Operations", status: "Invited" },
    ],
    costCentres: [
      { name: "Operations", amount: 520000 },
      { name: "Sales", amount: 380000 },
      { name: "Executive", amount: 320000 },
      { name: "Other", amount: 200000 },
    ],
    requests: [
      { traveller: "Ada O.", type: "Employee", ride: "Plus", from: "Victoria Island", to: "Lagos Airport", status: "Approved", cost: 12500 },
      { traveller: "Guest — D. Smith", type: "Guest", ride: "Lux", from: "Lagos Airport", to: "Ikoyi", status: "Pending", cost: 18300 },
      { traveller: "Chidi A.", type: "Employee", ride: "Go", from: "Yaba", to: "Victoria Island", status: "Approved", cost: 6000 },
      { traveller: "Bola K.", type: "Employee", ride: "XL", from: "Lekki", to: "Ikeja", status: "Declined", cost: 21000 },
    ],
    rides: [
      { traveller: "Ada O.", ride: "Plus", route: "Victoria Island → Lagos Airport", when: "Today, 09:10", status: "Completed", cost: 12500 },
      { traveller: "Chidi A.", ride: "Go", route: "Yaba → Victoria Island", when: "Today, 11:45", status: "In progress", cost: 6000 },
      { traveller: "Ngozi E.", ride: "Go", route: "Ikeja → Maryland", when: "Tomorrow, 08:00", status: "Scheduled", cost: 4800 },
      { traveller: "Tunde B.", ride: "Plus", route: "Lekki → Ikoyi", when: "Yesterday, 17:20", status: "Cancelled", cost: 0 },
    ],
    approvals: [
      { id: "a1", traveller: "Guest — D. Smith", reason: "Lux is outside the guest policy", ride: "Lux", cost: 18300, team: "Sales" },
      { id: "a2", traveller: "Femi J.", reason: "Above the ₦15,000 per-trip limit", ride: "Plus", cost: 16200, team: "Operations" },
      { id: "a3", traveller: "Halima S.", reason: "Outside working hours", ride: "Go", cost: 5400, team: "Executive" },
    ],
    billing: [
      { ref: "TRP-1042", label: "Ada O. · Airport", amount: 12500, status: "Charged" },
      { ref: "TRP-1039", label: "Chidi A. · City", amount: 6000, status: "Charged" },
      { ref: "TRP-1031", label: "Toll adjustment", amount: -800, status: "Adjusted" },
      { ref: "TRP-1028", label: "Ngozi E. · City", amount: 4800, status: "Payment failed" },
    ],
    monthly: [
      { month: "Aug", amount: 1080000 },
      { month: "Sep", amount: 1260000 },
      { month: "Oct", amount: 1420000 },
    ],
    tollAdjustment: 800,
  },
  US: {
    locale: "en-US",
    currency: "USD",
    company: "Northwind Logistics (demo)",
    period: "Oct 1–31",
    totals: { rides: 186, exceptions: 2 },
    people: [
      { name: "Jordan K.", role: "Organisation admin", team: "Operations", status: "Accepted" },
      { name: "Maya R.", role: "Booking admin", team: "Sales", status: "Accepted" },
      { name: "Elena V.", role: "Approver", team: "Finance", status: "Accepted" },
      { name: "Leo T.", role: "Employee", team: "Operations", status: "Accepted" },
      { name: "Ana G.", role: "Employee", team: "Operations", status: "Invited" },
    ],
    costCentres: [
      { name: "Operations", amount: 3120 },
      { name: "Sales", amount: 2280 },
      { name: "Executive", amount: 1920 },
      { name: "Other", amount: 1200 },
    ],
    requests: [
      { traveller: "Maya R.", type: "Employee", ride: "Plus", from: "Downtown", to: "Airport", status: "Approved", cost: 42 },
      { traveller: "Guest — J. Park", type: "Guest", ride: "Lux", from: "Airport", to: "Midtown", status: "Pending", cost: 78 },
      { traveller: "Leo T.", type: "Employee", ride: "Go", from: "Uptown", to: "Downtown", status: "Approved", cost: 19 },
      { traveller: "Sam W.", type: "Employee", ride: "XL", from: "Eastside", to: "Convention Ctr", status: "Declined", cost: 64 },
    ],
    rides: [
      { traveller: "Maya R.", ride: "Plus", route: "Downtown → Airport", when: "Today, 9:10 AM", status: "Completed", cost: 42 },
      { traveller: "Leo T.", ride: "Go", route: "Uptown → Downtown", when: "Today, 11:45 AM", status: "In progress", cost: 19 },
      { traveller: "Priya N.", ride: "Go", route: "Midtown → Eastside", when: "Tomorrow, 8:00 AM", status: "Scheduled", cost: 16 },
      { traveller: "Chris D.", ride: "Plus", route: "Westside → Downtown", when: "Yesterday, 5:20 PM", status: "Cancelled", cost: 0 },
    ],
    approvals: [
      { id: "a1", traveller: "Guest — J. Park", reason: "Lux is outside the guest policy", ride: "Lux", cost: 78, team: "Sales" },
      { id: "a2", traveller: "Ana G.", reason: "Above the $60 per-trip limit", ride: "Plus", cost: 66, team: "Operations" },
      { id: "a3", traveller: "Omar F.", reason: "Outside working hours", ride: "Go", cost: 21, team: "Executive" },
    ],
    billing: [
      { ref: "TRP-1042", label: "Maya R. · Airport", amount: 42, status: "Charged" },
      { ref: "TRP-1039", label: "Leo T. · City", amount: 19, status: "Charged" },
      { ref: "TRP-1031", label: "Toll adjustment", amount: -3, status: "Adjusted" },
      { ref: "TRP-1028", label: "Priya N. · City", amount: 16, status: "Payment failed" },
    ],
    monthly: [
      { month: "Aug", amount: 6840 },
      { month: "Sep", amount: 7710 },
      { month: "Oct", amount: 8520 },
    ],
    tollAdjustment: 3,
  },
};

/** Illustrative policy-simulator settings — not product defaults (spec §8). */
export const policyExample: Record<CountryCode, { limit: number; limitMax: number; step: number; fares: Record<string, number> }> = {
  NG: { limit: 15000, limitMax: 50000, step: 500, fares: { Go: 6000, Plus: 9500, XL: 14000, Lux: 18300 } },
  US: { limit: 60, limitMax: 200, step: 5, fares: { Go: 19, Plus: 32, XL: 48, Lux: 78 } },
};

export const roles = [
  { title: "Organisation admin", text: "Sets up the organisation, billing, people and policies." },
  { title: "Booking admin", text: "Books rides for employees or guests, where policy allows." },
  { title: "Approver", text: "Reviews rides that need approval under your policies." },
  { title: "Employee", text: "Joins with their own Sanga account after accepting an invitation." },
  { title: "Guest", text: "Gets a ride and a tracking link for that trip only — not a member, with no console access." },
];

export const reconciliationSteps = [
  { title: "Request a ride", text: "An employee, or an admin on their behalf or for a guest, requests a business ride.", example: "Booking admin requests an airport pickup for a visiting guest." },
  { title: "Policy check", text: "Eligibility, allowed rides, spending limits and approval rules are applied.", example: "Lux is outside the guest policy, so it goes to an approver." },
  { title: "Ride fulfilled", text: "Once approved, it's booked through Sanga's dispatch. Assignment isn't instant or guaranteed.", example: "Approved, matched with a driver, guest tracks the trip." },
  { title: "Charged to the organisation", text: "Charges go to the approved payer and billing arrangement, including failures and adjustments.", example: "Fare charged to Sales; a toll adjustment is added." },
  { title: "Reporting", text: "Authorised finance and admin roles see trip records and reconcile spending.", example: "Finance exports October's Sales cost-centre records." },
];

export const useCases = [
  { title: "Employee travel", text: "Daily commutes and work trips within your policies.", image: "/images/journey-city.webp", alt: "An employee travelling in the back of a car" },
  { title: "Guest travel", text: "Arrange rides for clients, partners and visitors.", image: "/images/business.webp", alt: "A guest being driven past office towers" },
  { title: "Airport transfers", text: "Pickups and drop-offs for business trips.", image: "/images/journey-airport.webp", alt: "A passenger jet at an airport terminal" },
  { title: "Events and conferences", text: "Get attendees and teams to the venue.", image: "/images/business-events.webp", alt: "Professionals arriving at a conference venue" },
];

export const businessSetupSteps = [
  { title: "Talk to our team", text: "Tell us about your organisation and how your people travel." },
  { title: "Organisation verification", text: "We verify your organisation and the admin acting on its behalf." },
  { title: "Billing set-up", text: "Agree the billing arrangement available in your market." },
  { title: "Invite people and set policies", text: "Invite employees, assign roles and set travel rules." },
  { title: "Activation", text: "Your account goes live once checks are complete — it isn't automatic." },
];

export const applicationStates = ["Submitted", "Under review", "More information needed", "Approved", "Rejected"];

export const businessRequirements: Record<CountryCode, string[]> = {
  NG: ["Registered business details", "Identity of the admin applying", "Authorisation to act for the organisation", "Billing contact and details"],
  US: ["Legal business name and registration", "Identity of the admin applying", "Authorisation to act for the organisation", "Billing contact and details"],
};
