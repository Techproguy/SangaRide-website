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
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-navy-950">
      {/* The mobile photo grows with the headline; the form follows in its own row. */}
      <div className="container-page relative lg:static grid grid-cols-1 items-center gap-x-10 pt-0 pb-8 lg:min-h-[600px] lg:grid-cols-[1fr_410px] lg:py-16">
        <div className="relative isolate -mx-4 bg-navy-950 px-4 pt-8 pb-12 text-white sm:-mx-6 sm:px-6 sm:pt-10 sm:pb-14 lg:static lg:isolation-auto lg:mx-0 lg:max-w-xl lg:bg-transparent lg:p-0">
          <div className="absolute inset-y-0 right-0 -z-10 w-3/4 lg:inset-0 lg:right-auto lg:left-[calc(50%-665px)] lg:w-[980px] lg:[mask-image:linear-gradient(to_right,transparent,black_30%,black_85%,transparent)]">
            <Image
              src="/images/hero.webp"
              alt="A rider with her phone beside a black sedan at sunset"
              fill
              preload
              sizes="100vw"
              className="object-cover object-[72%_center] lg:object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/55 to-navy-950/5 lg:from-navy-950/90" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy-950/70 to-transparent" />
          </div>
          <h1 id="hero-title" className="max-w-[15rem] text-[clamp(1.75rem,7.5vw,2.25rem)] leading-[1.08] font-extrabold tracking-[-0.035em] sm:max-w-[20rem] lg:heading-xl lg:max-w-none">
            <span className="lg:hidden">Wherever life<br />takes you.<br /><span className="text-brand-400">Move with Sanga.</span></span>
            <span className="hidden lg:inline">Wherever<br />life takes you,<br /><span className="text-brand-400">move with Sanga.</span></span>
          </h1>
          <p className="mt-3 max-w-[16rem] text-[0.83rem] leading-relaxed text-white/80 lg:mt-5 lg:max-w-md lg:text-lg lg:text-white/90">
            <span className="lg:hidden">City rides, airport trips and everything in between.</span>
            <span className="hidden lg:inline">Reliable rides across your city, to the airport, between cities and beyond — with comfort, choice and confidence.</span>
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

      </div>
    </section>
  );
}
