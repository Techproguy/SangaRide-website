"use client";

import { ArrowRight, MapPin } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent } from "react";

/** Compact route entry that hands intent to Rider Web; not a second booking form. */
export function RideBookingCTA({ serviceId }: { serviceId: string }) {
  const id = useId();
  const router = useRouter();
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!pickup.trim()) {
      setError("Enter a pickup location to see rides near you.");
      return;
    }
    setError(null);
    const intent = new URLSearchParams({ service: serviceId, pickup: pickup.trim() });
    if (destination.trim()) intent.set("destination", destination.trim());
    router.push(`/book?${intent}`);
  }

  return (
    <section aria-labelledby="ready-title">
      <div className="container-page">
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-navy-950">
          <Image src="/images/journey-airport.webp" alt="" fill sizes="(min-width: 1280px) 1216px, 100vw" className="-z-10 object-cover object-[center_60%]" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950/95 via-navy-950/75 to-navy-950/30" />

          <div className="flex flex-col gap-8 px-6 py-12 sm:px-10 lg:flex-row lg:items-end lg:justify-between lg:px-14 lg:py-14">
            <div className="w-full max-w-2xl text-white">
              <h2 id="ready-title" className="heading-lg">
                Ready to ride?
              </h2>
              <p className="mt-3 text-[0.95rem] text-white/80">See the options available for your journey.</p>

              <form onSubmit={submit} noValidate className="mt-7 flex flex-col gap-3 sm:flex-row">
                <div className="flex flex-1 flex-col overflow-hidden rounded-[1.5rem] bg-white text-ink sm:flex-row">
                  <label htmlFor={`${id}-pickup`} className="flex flex-1 items-center gap-3 px-4 py-2.5">
                    <MapPin className="h-5 w-5 shrink-0 fill-brand-600 text-white" strokeWidth={1.5} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.7rem] font-medium">Pickup location</span>
                      <input
                        id={`${id}-pickup`}
                        value={pickup}
                        onChange={(e) => setPickup(e.target.value)}
                        placeholder="Enter pickup location"
                        aria-invalid={!!error}
                        aria-describedby={error ? `${id}-error` : undefined}
                        className="w-full bg-transparent text-[0.9rem] placeholder:text-slate-500 focus:outline-none"
                      />
                    </span>
                  </label>
                  <span className="mx-4 h-px bg-slate-100 sm:mx-0 sm:my-3 sm:h-auto sm:w-px" aria-hidden="true" />
                  <label htmlFor={`${id}-destination`} className="flex flex-1 items-center gap-3 px-4 py-2.5">
                    <MapPin className="h-5 w-5 shrink-0 fill-red-500 text-white" strokeWidth={1.5} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.7rem] font-medium">Destination</span>
                      <input
                        id={`${id}-destination`}
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="Where are you going?"
                        className="w-full bg-transparent text-[0.9rem] placeholder:text-slate-500 focus:outline-none"
                      />
                    </span>
                  </label>
                </div>
                <button
                  type="submit"
                  className="inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-[1.5rem] bg-brand-600 px-6 text-sm font-semibold text-white transition hover:bg-brand-700"
                >
                  See available rides <ArrowRight className="h-4 w-4" />
                </button>
              </form>
              {error && (
                <p id={`${id}-error`} role="alert" className="mt-2 text-xs font-medium text-red-300">
                  {error}
                </p>
              )}
            </div>

            <p className="hidden text-right text-2xl leading-tight font-extrabold tracking-tight text-white lg:block">
              Same journeys.
              <br />
              More possibilities.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
