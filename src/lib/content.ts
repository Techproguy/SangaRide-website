// Website copy and configuration in one place so content can later move to a CMS.
// Figures, cities and capacities mirror the design boards and still need operations sign-off.

export type CountryCode = "NG" | "US";

export const countries: Record<CountryCode, { name: string; currency: string }> = {
  NG: { name: "Nigeria", currency: "NGN" },
  US: { name: "United States", currency: "USD" },
};

export const primaryNav = [
  { label: "Drive", href: "/drive" },
  { label: "Business", href: "/business" },
  { label: "Fleet", href: "/fleet" },
  { label: "Safety", href: "/safety" },
  { label: "Cities", href: "/cities" },
  { label: "Support", href: "/help" },
  { label: "About", href: "/about" },
];

export const rideMenu = {
  services: [
    { label: "Sanga Go", href: "/ride?service=go", note: "Everyday rides" },
    { label: "Sanga Plus", href: "/ride?service=plus", note: "More comfort" },
    { label: "Sanga XL", href: "/ride?service=xl", note: "For groups" },
    { label: "Sanga Lux", href: "/ride?service=lux", note: "Premium experience" },
    { label: "Sanga Moto", href: "/ride?service=moto", note: "Beat traffic" },
    { label: "Sanga Assist", href: "/ride?service=assist", note: "Assistance-focused" },
  ],
  journeys: [
    { label: "Airport", href: "/airport" },
    { label: "Intercity", href: "/intercity" },
    { label: "Hourly", href: "/hourly" },
    { label: "All ride options", href: "/ride" },
  ],
};

export type Ride = {
  id: string;
  name: string;
  tagline: string;
  seats: string;
  bags: string | null;
  feature: string;
  image: string;
  /** Ride page showroom copy. */
  description: string;
  highlights: string[];
  /** Ride page comparison rows; availability is indicative until zone data is wired in. */
  compare: { bestFor: string; typicalUse: string; groupSize: string; luggage: string; availability: string };
};

const standardHighlights = ["Clean, well-maintained vehicles", "Verified and trained drivers", "Available in select cities in Nigeria and the United States"];

export const rides: Ride[] = [
  {
    id: "go", name: "Sanga Go", tagline: "Affordable, everyday rides.", seats: "1–4", bags: "2 bags", feature: "A/C", image: "/images/car-go.webp",
    description: "A practical option for everyday journeys around the city.",
    highlights: ["Affordable and reliable", ...standardHighlights],
    compare: { bestFor: "Everyday rides", typicalUse: "City travel", groupSize: "1–4", luggage: "Everyday luggage", availability: "Select cities, NG & US" },
  },
  {
    id: "plus", name: "Sanga Plus", tagline: "More comfort for every trip.", seats: "1–4", bags: "2 bags", feature: "A/C", image: "/images/car-plus.webp",
    description: "Newer, roomier cars for when comfort matters a little more.",
    highlights: ["Extra comfort and space", ...standardHighlights],
    compare: { bestFor: "Extra comfort", typicalUse: "City & special trips", groupSize: "1–4", luggage: "More luggage space", availability: "Select cities, NG & US" },
  },
  {
    id: "xl", name: "Sanga XL", tagline: "Room for the whole group.", seats: "Up to 6", bags: "4 bags", feature: "A/C", image: "/images/car-xl.webp",
    description: "Larger vehicles for groups, families and extra luggage.",
    highlights: ["Room for groups and luggage", ...standardHighlights],
    compare: { bestFor: "Groups", typicalUse: "Group travel", groupSize: "Up to 6", luggage: "Group luggage", availability: "Select cities, NG & US" },
  },
  {
    id: "lux", name: "Sanga Lux", tagline: "A premium experience.", seats: "1–4", bags: "3 bags", feature: "A/C", image: "/images/car-lux.webp",
    description: "High-end vehicles and top-rated drivers for business and special moments.",
    highlights: ["Premium vehicles and service", ...standardHighlights],
    compare: { bestFor: "Premium travel", typicalUse: "Business & special moments", groupSize: "1–4", luggage: "Premium luggage space", availability: "Select cities, NG & US" },
  },
  {
    id: "moto", name: "Sanga Moto", tagline: "Beat the traffic.", seats: "1", bags: null, feature: "Helmet", image: "/images/car-moto.webp",
    description: "Fast, affordable two-wheel trips for solo riders, where supported.",
    highlights: ["Quick through busy streets", "Helmet provided for every trip", "Verified and trained riders", "Available where supported"],
    compare: { bestFor: "Fast, affordable", typicalUse: "City travel", groupSize: "1", luggage: "Light luggage", availability: "Select cities (where supported)" },
  },
  {
    id: "assist", name: "Sanga Assist", tagline: "Assistance-focused rides.", seats: "1–4", bags: "2 bags", feature: "Assistance", image: "/images/car-assist.webp",
    description: "Rides with drivers trained to give extra help getting in, out and on your way.",
    highlights: ["Drivers trained to assist", "Room for mobility equipment, where supported", "Verified and trained drivers", "Available where supported"],
    compare: { bestFor: "Supported travel", typicalUse: "Assistance needs", groupSize: "1–4", luggage: "Mobility equipment (where supported)", availability: "Select cities (where supported)" },
  },
];

export const journeys = [
  { title: "Airport", text: "Reliable pickups and drop-offs.", image: "/images/journey-airport.webp", href: "/airport" },
  { title: "City", text: "Move around your city with ease.", image: "/images/journey-city.webp", href: "/ride" },
  { title: "Intercity", text: "Travel between cities with trusted drivers.", image: "/images/journey-intercity.webp", href: "/intercity" },
];

export const footerGroups = [
  {
    title: "Explore",
    links: [
      { label: "Ride", href: "/ride" },
      { label: "Drive", href: "/drive" },
      { label: "Business", href: "/business" },
      { label: "Fleet", href: "/fleet" },
      { label: "Safety", href: "/safety" },
      { label: "Cities", href: "/cities" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Safety", href: "/safety" },
      { label: "Terms", href: "/legal/terms" },
      { label: "Privacy", href: "/legal/privacy" },
      { label: "Cookies", href: "/legal/cookies" },
      { label: "Accessibility", href: "/accessibility" },
    ],
  },
];
