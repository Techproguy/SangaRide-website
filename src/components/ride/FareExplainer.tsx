import { ArrowRight, Calculator, Check, Layers, SlidersHorizontal } from "lucide-react";
import Link from "next/link";

const factors = ["Distance and time", "Demand at the time of travel", "Tolls, airport fees and other charges (where applicable)"];

export function FareExplainer({ serviceId }: { serviceId: string }) {
  return (
    <section id="fares" aria-labelledby="fares-title" className="scroll-mt-24">
      <div className="container-page">
        <div className="grid grid-cols-1 gap-8 rounded-[2rem] bg-surface p-7 sm:p-10 lg:grid-cols-[minmax(0,280px)_1fr] lg:gap-12">
          <div>
            <h2 id="fares-title" className="heading-lg">
              Understand
              <br />
              your fare
            </h2>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-muted">
              See how fares are estimated and what affects the final price.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_1.15fr_1.1fr]">
            <div className="flex gap-3.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-brand-600 shadow-card">
                <Calculator className="h-[18px] w-[18px]" />
              </span>
              <div>
                <h3 className="text-[0.95rem] font-bold">Estimated fare</h3>
                <p className="mt-1 text-[0.85rem] leading-relaxed text-muted">
                  Get an estimated price based on your pickup and destination before you book.
                </p>
              </div>
            </div>

            <div className="flex gap-3.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-brand-600 shadow-card">
                <Layers className="h-[18px] w-[18px]" />
              </span>
              <div>
                <h3 className="text-[0.95rem] font-bold">Pricing options</h3>
                <p className="mt-1 text-[0.85rem] leading-relaxed text-muted">
                  Choose from options like FairFare, Saver or Priority, where available in your area.
                </p>
              </div>
            </div>

            <div className="flex gap-3.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-brand-600 shadow-card">
                <SlidersHorizontal className="h-[18px] w-[18px]" />
              </span>
              <div>
                <h3 className="text-[0.95rem] font-bold">What affects the fare?</h3>
                <ul className="mt-2 space-y-1.5">
                  {factors.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[0.85rem] text-muted">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Link
              href={`/book?service=${serviceId}`}
              className="group flex flex-col justify-between gap-4 rounded-[1.5rem] bg-white p-6 shadow-card transition hover:shadow-panel"
            >
              <span>
                <span className="block text-[0.95rem] font-bold">See an estimate for your route</span>
                <span className="mt-1.5 block text-[0.82rem] leading-relaxed text-muted">
                  Enter your pickup and destination to see available rides and estimated fares.
                </span>
              </span>
              <span className="flex h-10 w-10 items-center justify-center self-end rounded-full bg-brand-600 text-white transition group-hover:bg-brand-700">
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
