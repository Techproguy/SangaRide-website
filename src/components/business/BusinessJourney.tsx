import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { reconciliationSteps, useCases } from "@/lib/business";

/** B03: request to reconciliation, told through one connected example. */
export function Reconciliation() {
  return (
    <section id="how-it-works" aria-labelledby="journey-title" className="scroll-mt-24">
      <div className="container-page">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div>
            <p className="eyebrow text-brand-600">From request to reconciliation</p>
            <h2 id="journey-title" className="heading-lg mt-3">
              A clear and transparent journey.
            </h2>
          </div>
          <p className="max-w-md text-[0.95rem] leading-relaxed text-muted">
            Follow one business ride from the moment it&apos;s requested to when it appears in your reports — including
            the moments it needs a person to decide.
          </p>
        </div>

        <ol className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {reconciliationSteps.map((s, i) => (
            <li key={s.title} className="relative flex flex-col rounded-[1.5rem] bg-surface p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-brand-600 text-[0.85rem] font-bold text-brand-600">
                {i + 1}
              </span>
              <h3 className="mt-4 text-[0.95rem] font-bold">{s.title}</h3>
              <p className="mt-1 flex-1 text-[0.82rem] leading-relaxed text-muted">{s.text}</p>
              <p className="mt-4 rounded-xl bg-white px-3 py-2.5 text-[0.75rem] leading-snug shadow-card">
                <span className="block font-semibold text-brand-700">Example</span>
                {s.example}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** B04: editorial use cases — examples, not guarantees of a ride type or coverage. */
export function UseCases() {
  return (
    <section aria-labelledby="usecases-title">
      <div className="container-page">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div>
            <p className="eyebrow text-brand-600">Built for real business needs</p>
            <h2 id="usecases-title" className="heading-lg mt-3">
              Use cases across your organisation.
            </h2>
          </div>
          <p className="max-w-md text-[0.95rem] leading-relaxed text-muted">
            From daily operations to high-priority moments. Ride options and coverage depend on your city.
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {useCases.map((u, i) => (
            <li
              key={u.title}
              className={`relative isolate flex min-h-[300px] flex-col justify-end overflow-hidden rounded-[1.75rem] bg-navy-900 p-6 text-white lg:min-h-[380px] ${
                i % 2 ? "lg:mt-10" : ""
              }`}
            >
              <Image src={u.image} alt={u.alt} fill sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw" className="-z-10 object-cover" />
              <span className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950/90 via-navy-950/30 to-transparent" />
              <h3 className="flex items-center justify-between gap-3 text-lg font-bold">
                {u.title} <ArrowUpRight className="h-5 w-5 shrink-0 opacity-70" aria-hidden="true" />
              </h3>
              <p className="mt-1 text-[0.85rem] text-white/80">{u.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
