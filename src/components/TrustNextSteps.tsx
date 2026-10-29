import { ArrowRight, Phone, Search, ShieldCheck, Star, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AppleIcon, GooglePlayIcon, QrGraphic } from "./icons";

const sampleRides = [
  { name: "Sanga Go", price: "₦2,800", eta: "4 min", image: "/images/car-go.webp" },
  { name: "Sanga Plus", price: "₦4,200", eta: "5 min", image: "/images/car-plus.webp" },
  { name: "Sanga XL", price: "₦6,500", eta: "7 min", image: "/images/car-xl.webp" },
];

/** Safety moment, app discovery and the closing booking action — one logical section. */
export function TrustNextSteps() {
  return (
    <section aria-labelledby="safety-title">
      <div className="container-page">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Safety */}
          <div className="flex flex-col overflow-hidden rounded-[2rem] border border-slate-100 bg-white">
            <div className="p-7 sm:p-10">
              <h2 id="safety-title" className="heading-lg">
                Safety built into
                <br />
                every trip.
              </h2>
              <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-muted">
                From verified drivers to real-time trip protection, Sanga uses technology and human support to help keep
                you safe on every journey.
              </p>
              <Link href="/safety" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition-all hover:gap-3">
                Learn about safety <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Illustrative trip moment — not a live trip, driver or vehicle. */}
            <div className="relative mx-3 mb-3 min-h-[300px] flex-1 overflow-hidden rounded-[1.6rem] bg-navy-900" aria-hidden="true">
              <Image src="/images/phone-hand.webp" alt="" fill sizes="(min-width: 1024px) 600px, 100vw" className="object-cover object-[center_40%]" />
              <span className="absolute inset-0 bg-gradient-to-t from-navy-950/50 to-transparent" />
              <span className="absolute top-5 right-5 flex items-center gap-2.5 rounded-2xl bg-white px-3 py-2.5 shadow-lg">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Phone className="h-4 w-4" />
                </span>
                <span className="text-[0.75rem] leading-tight">
                  <span className="block font-bold">Driver on the way</span>
                  <span className="text-muted">2 min · 0.6 km</span>
                </span>
              </span>
              <span className="absolute right-5 bottom-5 left-5 flex items-center gap-3 rounded-2xl bg-white p-3 shadow-lg sm:right-auto sm:w-[290px]">
                <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl">
                  <Image src="/images/avatar-daniel.webp" alt="" fill sizes="44px" className="object-cover" />
                </span>
                <span className="min-w-0 flex-1 text-[0.75rem] leading-tight">
                  <span className="flex items-center gap-1 text-[0.95rem] font-bold">
                    Daniel <span className="text-xs font-semibold">4.9</span>
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  </span>
                  <span className="text-muted">Toyota Camry · ABC 123 XY</span>
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-white">
                  <ShieldCheck className="h-5 w-5" />
                </span>
              </span>
            </div>
          </div>

          {/* App */}
          <div className="relative flex flex-col overflow-hidden rounded-[2rem] bg-surface">
            <div className="p-7 sm:p-10">
              <h2 className="heading-lg">
                Book, track and
                <br />
                manage on the go.
              </h2>
              <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-muted">
                Download the Sanga Ride app for a seamless experience — anytime, anywhere.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
                <a href="#" aria-label="Download on the App Store" className="flex h-11 min-w-0 items-center justify-center gap-1.5 rounded-xl bg-ink px-2 text-white transition hover:bg-black sm:gap-2 sm:px-3.5">
                  <AppleIcon className="h-4 w-4 shrink-0 sm:h-6 sm:w-6" />
                  <span className="leading-none">
                    <span className="block text-[0.55rem]">Download on the</span>
                    <span className="block text-xs font-semibold sm:text-[0.95rem]">App Store</span>
                  </span>
                </a>
                <a href="#" aria-label="Get it on Google Play" className="flex h-11 min-w-0 items-center justify-center gap-1.5 rounded-xl bg-ink px-2 text-white transition hover:bg-black sm:gap-2 sm:px-3.5">
                  <GooglePlayIcon className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
                  <span className="leading-none">
                    <span className="block text-[0.55rem] uppercase">Get it on</span>
                    <span className="block text-xs font-semibold sm:text-[0.95rem]">Google Play</span>
                  </span>
                </a>
              </div>
            </div>

            <div className="relative mt-auto flex items-end justify-between gap-6 px-7 pb-3 sm:px-10">
              <PhoneMockups />
              <div className="hidden shrink-0 items-center gap-3 pb-10 sm:flex sm:flex-col sm:text-center">
                <span className="rounded-2xl bg-white p-2.5 shadow-card">
                  <QrGraphic className="h-20 w-20 text-ink" />
                </span>
                <p className="max-w-[8rem] text-[0.75rem] leading-snug text-muted">Scan to download the Sanga Ride app</p>
              </div>
            </div>
          </div>
        </div>

        {/* Closing action */}
        <div className="relative isolate mt-5 overflow-hidden rounded-[2rem] bg-navy-950">
          <Image src="/images/final.webp" alt="" fill sizes="(min-width: 1280px) 1216px, 100vw" className="-z-10 object-cover object-[60%_center]" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950/95 via-navy-950/65 to-navy-950/20" />
          <div className="flex flex-col gap-8 px-7 py-12 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-14 lg:py-14">
            <div className="text-white">
              <h2 className="heading-lg">Let&apos;s move together.</h2>
              <p className="mt-3 text-[0.95rem] text-white/80">For everyday journeys, for people and businesses, for the cities ahead.</p>
            </div>
            <div className="action-pair flex flex-wrap gap-3">
              <Link
                href="/book"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-ink transition hover:bg-brand-50"
              >
                Book a Ride <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/cities"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/40 px-7 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                See where we operate <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Illustrative app screens built in HTML; replace with approved Rider app screenshots. */
function PhoneMockups() {
  return (
    <div className="relative mx-auto h-[370px] w-full min-w-0 max-w-[310px]" aria-hidden="true">
      <div className="absolute top-12 left-[6%] h-[300px] w-[48%] max-w-[140px] -rotate-4 rounded-[1.8rem] border-[5px] border-navy-950 bg-[#eef3fb] shadow-panel">
        <div className="mx-auto mt-1.5 h-3 w-12 rounded-full bg-navy-950" />
        <svg viewBox="0 0 140 270" className="absolute inset-0 h-full w-full rounded-[1.5rem]">
          <g stroke="#d4deee" strokeWidth="6" fill="none">
            <path d="M0 60 H140 M0 140 H140 M0 210 H140 M35 0 V270 M95 0 V270" />
          </g>
          <g stroke="#e3eaf5" strokeWidth="3" fill="none">
            <path d="M0 100 H140 M0 175 H140 M65 0 V270 M120 0 V270" />
          </g>
          <path d="M35 210 V140 H95 V60" stroke="#1d5fff" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="35" cy="210" r="6" fill="#fff" stroke="#1d5fff" strokeWidth="3" />
          <circle cx="95" cy="60" r="6" fill="#1d5fff" />
        </svg>
      </div>

      <div className="absolute top-4 right-[6%] h-[310px] w-[52%] max-w-[150px] rotate-2 rounded-[1.9rem] border-[5px] border-navy-950 bg-white shadow-panel">
        <div className="mx-auto mt-1.5 h-3 w-12 rounded-full bg-navy-950" />
        <div className="px-3 pt-2">
          <p className="text-[0.6rem] font-bold">Good evening, Mercy</p>
          <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-surface px-2 py-1.5 text-[0.48rem] text-muted">
            <Search className="h-2.5 w-2.5" /> Where to?
          </div>
          <p className="mt-3 text-[0.55rem] font-bold">Choose a ride</p>
          <ul className="mt-1.5 space-y-1.5">
            {sampleRides.map((r, i) => (
              <li key={r.name} className={`flex items-center gap-1.5 rounded-lg border p-1 ${i === 0 ? "border-brand-500" : "border-slate-100"}`}>
                <span className="relative h-5 w-9 shrink-0">
                  <Image src={r.image} alt="" fill sizes="36px" className="object-contain mix-blend-multiply" />
                </span>
                <span className="flex-1 leading-tight">
                  <span className="block text-[0.48rem] font-bold">{r.name}</span>
                  <span className="block text-[0.45rem] text-muted">{r.price}</span>
                </span>
                <span className="text-[0.42rem] text-muted">{r.eta}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center justify-center gap-1 rounded-lg bg-brand-600 py-1.5 text-[0.5rem] font-semibold text-white">
            <Zap className="h-2.5 w-2.5" /> Book Sanga Go
          </div>
        </div>
      </div>
    </div>
  );
}
