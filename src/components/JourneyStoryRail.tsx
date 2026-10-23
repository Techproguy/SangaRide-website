import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { journeys } from "@/lib/content";

// Varied widths give each journey its own crop instead of an equal card grid.
const layout = ["lg:col-span-6", "lg:col-span-3", "lg:col-span-3"];

export function JourneyStoryRail() {
  return (
    <section aria-labelledby="journeys-title">
      <div className="container-page">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <h2 id="journeys-title" className="heading-lg max-w-xl">
            Journeys that
            <br />
            fit your life.
          </h2>
          <div className="max-w-md">
            <p className="text-[0.95rem] leading-relaxed text-muted">
              Airport, city, intercity and more — for the moments that matter.
            </p>
            <Link href="/ride" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition-all hover:gap-3">
              Explore journey options <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <ul className="scrollbar-none -mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-12 lg:overflow-visible lg:px-0 lg:pb-0">
          {journeys.map((j, i) => (
            <li key={j.title} className={`w-[80%] shrink-0 snap-start sm:w-[45%] lg:w-auto ${layout[i]}`}>
              <Link
                href={j.href}
                className="group relative block aspect-[4/5] overflow-hidden rounded-[2rem] bg-navy-900 lg:aspect-auto lg:h-[440px]"
              >
                <Image
                  src={j.image}
                  alt=""
                  fill
                  sizes={i === 0 ? "(min-width: 1024px) 50vw, 80vw" : "(min-width: 1024px) 25vw, 80vw"}
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/15 to-transparent" />
                <span className="absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition group-hover:bg-white group-hover:text-brand-600">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
                <span className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <span className={`block font-extrabold tracking-tight ${i === 0 ? "text-[1.75rem]" : "text-xl"}`}>{j.title}</span>
                  <span className="mt-1 block text-[0.85rem] leading-snug text-white/80">{j.text}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
