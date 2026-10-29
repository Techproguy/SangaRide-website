import { ArrowDown, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { aboutIntro, journeyLinks, principles } from "@/lib/about";

/** 01: editorial manifesto hero — no booking widget, and the CTA is an anchor, never a video. */
export function AboutHero() {
  return (
    <section aria-labelledby="about-hero-title" className="relative isolate overflow-hidden bg-navy-950">
      <Image
        src="/images/about-hero.webp"
        alt=""
        fill
        preload
        sizes="100vw"
        className="-z-10 object-cover object-[60%_center] lg:object-center"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950/95 via-navy-950/60 to-navy-950/5" />

      <div className="container-page grid grid-cols-1 items-center gap-10 py-20 lg:min-h-[600px] lg:grid-cols-[1fr_auto] lg:py-24">
        <div className="max-w-xl text-white">
          <p className="eyebrow text-white/80">About Sanga Ride</p>
          <h1 id="about-hero-title" className="heading-xl mt-4">
            Movement builds
            <br />
            <span className="text-brand-400">possibilities.</span>
          </h1>
          <p className="mt-5 max-w-md text-[0.95rem] leading-relaxed text-white/85 sm:text-lg">
            A mobility platform being built for people, communities and businesses — making transportation more
            understandable, accountable and responsive to the places we serve.
          </p>
          <div className="action-pair mt-8 flex flex-wrap gap-3">
            <Link
              href="#why-we-exist"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-ink transition hover:bg-brand-50"
            >
              Explore our story <ArrowDown className="h-4 w-4" />
            </Link>
            <Link
              href="#our-principles"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-white/40 px-7 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Learn more about Sanga
            </Link>
          </div>
        </div>

        <p aria-hidden="true" className="hidden -rotate-6 self-end pb-4 text-right font-script text-[2.4rem] leading-[1.05] font-medium text-white/90 xl:block">
          Real people.
          <br />
          Real places.
          <br />A brighter tomorrow.
        </p>
      </div>
    </section>
  );
}

// Varied widths give the photo essay an editorial rhythm instead of an equal card grid.
const essayLayout = ["md:col-span-6", "md:col-span-3", "md:col-span-3"];

/** 02: why we exist — one short statement, one photo essay. */
export function WhyWeExist() {
  return (
    <section id="why-we-exist" aria-labelledby="why-title" className="scroll-mt-24">
      <div className="container-page grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,330px)_1fr] lg:items-center lg:gap-14">
        <div>
          <h2 id="why-title" className="heading-lg">
            A better journey must work for everyone.
          </h2>
          <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-muted">
            Riders need clarity, drivers need visibility into their work, vehicle owners need accountability and
            businesses need transportation they can manage. We&apos;re building Sanga Ride to work for all of them.
          </p>
        </div>

        {/* Mobile keeps one image so the narrative isn't buried under the photo essay. */}
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-12">
          {aboutIntro.map((item, i) => (
            <li key={item.title} className={`relative h-[340px] overflow-hidden rounded-[2rem] bg-navy-900 lg:h-[420px] ${essayLayout[i]} ${i > 0 ? "hidden md:block" : ""}`}>
              <Image
                src={item.image}
                alt={item.alt}
                fill
                sizes={i === 0 ? "(min-width: 1024px) 430px, 100vw" : "(min-width: 1024px) 215px, 25vw"}
                className="object-cover"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
              <p className={`absolute inset-x-0 bottom-0 p-6 leading-snug font-extrabold tracking-tight text-white ${i === 0 ? "text-[1.6rem]" : "text-lg"}`}>
                {item.title}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** 03: numbered typographic principles — deliberately not feature cards. */
export function Principles() {
  return (
    <section id="our-principles" aria-labelledby="principles-title" className="scroll-mt-24">
      <div className="container-page">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <h2 id="principles-title" className="heading-lg max-w-xl">
            The values that
            <br />
            guide how we build.
          </h2>
          <p className="max-w-md text-[0.95rem] leading-relaxed text-muted">
            These principles shape our decisions, our products and the way we work with the people and partners around
            us.
          </p>
        </div>

        <ol className="mt-12 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((p, i) => (
            <li key={p.title} className="border-t border-slate-200 pt-6">
              <span className="text-[0.8rem] font-bold text-brand-600">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 text-xl leading-tight font-extrabold tracking-[-0.02em]">{p.title}</h3>
              <p className="mt-3 text-[0.88rem] leading-relaxed text-muted">{p.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** 05–06: one cinematic direction statement, then the four ways in. No roadmap, dates or coverage promises. */
export function DirectionAndJoin() {
  return (
    <section id="our-direction" aria-labelledby="direction-title" className="scroll-mt-24">
      <div className="container-page">
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-navy-950">
          <Image src="/images/final.webp" alt="" fill sizes="(min-width: 1280px) 1216px, 100vw" className="-z-10 object-cover object-[60%_center]" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950/95 via-navy-950/65 to-navy-950/20" />
          <div className="grid min-h-[440px] grid-cols-1 gap-8 px-7 py-12 text-white sm:px-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:px-14 lg:py-14">
            <div className="max-w-lg self-center">
              <h2 id="direction-title" className="heading-lg">
                Built for today.
                <br />
                Thinking beyond the next journey.
              </h2>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-white/80">
                We&apos;re designing Sanga Ride as a connected, market-aware platform, starting with foundations for
                Nigeria and the United States. Where each service runs depends on local readiness, eligibility and
                operating configuration.
              </p>
            </div>
            <p className="max-w-[15rem] text-xl leading-snug font-extrabold tracking-tight text-white/95">More connected communities ahead.</p>
          </div>
        </div>

        <div id="join-the-journey" className="mt-24 scroll-mt-24 sm:mt-28 lg:mt-36">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
            <h2 className="heading-lg max-w-xl">
              There&apos;s more than one
              <br />
              way to move forward.
            </h2>
            <p className="max-w-md text-[0.95rem] leading-relaxed text-muted">
              Planning a journey, driving, managing a business or growing a fleet — discover where you fit in.
            </p>
          </div>

          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {journeyLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`group flex min-h-[112px] items-end justify-between gap-4 rounded-[1.5rem] border-t-4 bg-surface p-6 transition hover:bg-brand-50 ${l.accent}`}
                >
                  <span>
                    <span className="block text-[1.6rem] leading-none font-extrabold tracking-[-0.03em]">{l.label}</span>
                    <span className="mt-2 block text-[0.82rem] text-muted">{l.note}</span>
                  </span>
                  <ArrowRight className="h-5 w-5 shrink-0 text-brand-600 transition group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
