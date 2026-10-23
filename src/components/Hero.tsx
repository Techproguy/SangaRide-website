import { Car, ShieldCheck, UserCheck } from "lucide-react";
import Image from "next/image";
import { RideSearchEntry } from "./RideSearchEntry";

const trust = [
  { icon: ShieldCheck, label: "Safe rides" },
  { icon: UserCheck, label: "Verified drivers" },
  { icon: Car, label: "Multiple options" },
];

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden bg-white lg:bg-navy-950">
      {/* On mobile the photo only backs the headline so the booking form is never pushed below it. */}
      <div className="absolute inset-x-0 top-0 h-[400px] sm:h-[440px] lg:right-auto lg:left-[calc(50%-665px)] lg:h-full lg:w-[980px] lg:[mask-image:linear-gradient(to_right,transparent,black_30%,black_85%,transparent)]">
        <Image
          src="/images/hero.webp"
          alt="A rider with her phone beside a black sedan at sunset"
          fill
          preload
          sizes="100vw"
          className="object-cover object-[72%_center] lg:object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-950/55 to-navy-950/5" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy-950/70 to-transparent" />
      </div>

      <div className="container-page relative grid grid-cols-1 items-center gap-x-10 pt-10 pb-6 lg:min-h-[600px] lg:grid-cols-[1fr_410px] lg:py-16">
        <div className="min-h-[340px] max-w-xl pb-10 text-white sm:min-h-[380px] lg:min-h-0 lg:pb-0">
          <h1 id="hero-title" className="heading-xl">
            Wherever
            <br />
            life takes you,
            <br />
            <span className="text-brand-400">move with Sanga.</span>
          </h1>
          <p className="mt-5 max-w-md text-[0.95rem] leading-relaxed text-white/90 sm:text-lg">
            Reliable rides across your city, to the airport, between cities and beyond — with comfort, choice and
            confidence.
          </p>
          <ul className="mt-8 hidden flex-wrap items-center gap-x-5 gap-y-3 text-sm font-medium lg:flex">
            {trust.map(({ icon: Icon, label }, i) => (
              <li key={label} className="flex items-center gap-2">
                {i > 0 && <span className="mr-3 h-4 w-px bg-white/30" aria-hidden="true" />}
                <Icon className="h-5 w-5" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <RideSearchEntry />

        <ul className="mt-4 flex flex-wrap justify-between gap-y-2 px-1 text-[0.72rem] font-medium text-ink lg:hidden">
          {trust.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-1.5">
              <Icon className="h-4 w-4" />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
