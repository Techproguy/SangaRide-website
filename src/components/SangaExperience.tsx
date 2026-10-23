import { ArrowRight, Globe2, Users, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const pillars = [
  { icon: Globe2, title: "Built for real life", text: "From daily commutes to big moments, in Nigeria, the US and beyond." },
  { icon: Zap, title: "Technology with purpose", text: "Smart tools, clear processes and human support." },
  { icon: Users, title: "People at the center", text: "Riders, drivers, businesses and communities — all move forward together." },
];

export function SangaExperience() {
  return (
    <section aria-labelledby="story-title">
      <div className="container-page grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,330px)_1fr] lg:items-center lg:gap-14">
        <div>
          <h2 id="story-title" className="heading-lg">
            People move
            <br />
            the world.
          </h2>
          <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-muted">
            At Sanga, we believe movement creates opportunity — for people, for communities and for a more connected world.
          </p>
          <Link
            href="/about"
            className="mt-7 inline-flex h-11 items-center gap-2 rounded-full border border-slate-200 px-6 text-sm font-semibold transition hover:border-ink"
          >
            About Sanga <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="relative isolate overflow-hidden rounded-[2rem] bg-navy-950">
          <Image
            src="/images/experience.webp"
            alt="A rider looking out of a car window at city towers"
            fill
            sizes="(min-width: 1024px) 860px, 100vw"
            className="-z-10 object-cover object-[30%_center]"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-navy-950/40 to-navy-950/95 md:bg-gradient-to-r md:from-transparent md:via-navy-950/45 md:to-navy-950/90" />

          <div className="grid min-h-[420px] gap-8 p-6 sm:p-8 md:grid-cols-[1fr_minmax(0,300px)] md:items-center">
            <p
              aria-hidden="true"
              className="hidden -rotate-6 self-center justify-self-end font-script text-[2.4rem] leading-[1.05] font-medium text-white/90 xl:block"
            >
              Different
              <br />
              journeys.
              <br />A more
              <br />
              connected you.
            </p>

            <ul className="self-end space-y-5 md:col-start-2 md:self-center">
              {pillars.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-4 text-white">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 backdrop-blur-md">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span>
                    <span className="block text-[0.92rem] font-bold">{title}</span>
                    <span className="mt-1 block text-[0.8rem] leading-relaxed text-white/75">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
