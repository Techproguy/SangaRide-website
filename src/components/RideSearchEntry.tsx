"use client";

import {
  ArrowRight,
  CalendarDays,
  Car,
  ChevronDown,
  Clock,
  LocateFixed,
  MapPin,
  Plane,
  Bus,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent, type ReactNode } from "react";
import { Select } from "./Select";

const contexts = [
  { id: "ride", label: "Ride", icon: Car },
  { id: "airport", label: "Airport", icon: Plane },
  { id: "intercity", label: "Intercity", icon: Bus },
  { id: "hourly", label: "Hourly", icon: Clock },
] as const;

type Context = (typeof contexts)[number]["id"];
type Errors = Partial<Record<"pickup" | "destination" | "schedule", string>>;

const destinationPlaceholder: Record<Context, string> = {
  ride: "Where are you going?",
  airport: "Which airport or terminal?",
  intercity: "Which city are you travelling to?",
  hourly: "First stop (optional)",
};

export function RideSearchEntry() {
  const id = useId();
  const [context, setContext] = useState<Context>("ride");
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [when, setWhen] = useState<"now" | "later">("now");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [hours, setHours] = useState("2");
  const [passengers, setPassengers] = useState("1");
  const [errors, setErrors] = useState<Errors>({});
  const [locating, setLocating] = useState(false);
  const router = useRouter();

  function useMyLocation() {
    if (!("geolocation" in navigator)) {
      setErrors((e) => ({ ...e, pickup: "Location isn't available on this device. Enter your pickup address." }));
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      () => {
        setLocating(false);
        setPickup("Current location");
        setErrors((e) => ({ ...e, pickup: undefined }));
      },
      () => {
        setLocating(false);
        setErrors((e) => ({ ...e, pickup: "We couldn't access your location. Enter your pickup address instead." }));
      },
      { timeout: 10000 },
    );
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const next: Errors = {};
    if (!pickup.trim()) next.pickup = "Enter a pickup location.";
    if (context !== "hourly" && !destination.trim()) next.destination = "Enter a destination.";
    if (when === "later" && (!date || !time)) next.schedule = "Choose a date and time for your scheduled ride.";
    setErrors(next);
    if (Object.keys(next).length) return;
    // Hand-off to Rider Web: it re-validates everything and owns quotes, availability, sign-in and booking.
    const intent = new URLSearchParams({ journey: context, pickup: pickup.trim() });
    if (destination.trim()) intent.set("destination", destination.trim());
    if (context === "hourly") intent.set("hours", hours);
    else intent.set("passengers", passengers);
    if (when === "later") intent.set("when", `${date}T${time}`);
    router.push(`/book?${intent}`);
  }

  return (
    <form
      id="book"
      onSubmit={submit}
      noValidate
      aria-label="Book a ride"
      className="relative z-0 -mt-6 scroll-mt-24 rounded-3xl border border-white/65 bg-white/80 p-4 shadow-[0_24px_70px_-24px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.85)] ring-1 ring-white/15 backdrop-blur-2xl backdrop-saturate-150 sm:p-5 lg:mt-0 lg:rounded-[1.75rem]"
    >
      <h2 className="mb-3 text-lg leading-tight font-extrabold tracking-[-0.035em] text-ink lg:mb-4 lg:text-[1.3rem]"><span className="lg:hidden">Plan your ride</span><span className="hidden lg:inline">Where are we headed?</span></h2>
      <div role="tablist" aria-label="Journey type" className="mb-3 grid grid-cols-4 gap-1 rounded-xl bg-white/40 p-1 ring-1 ring-white/35 lg:mb-4 lg:rounded-2xl">
        {contexts.map(({ id: cid, label, icon: Icon }) => {
          const active = context === cid;
          return (
            <button
              key={cid}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => { setContext(cid); setErrors({}); }}
              className={`flex min-h-11 items-center justify-center gap-1 rounded-lg text-[0.7rem] font-semibold transition sm:gap-1.5 sm:text-[0.78rem] ${
                active ? "bg-brand-600 text-white shadow-sm lg:bg-white lg:text-brand-600 lg:ring-1 lg:ring-slate-200/60" : "text-muted hover:bg-white/60 hover:text-ink"
              }`}
            >
              <Icon className="hidden h-3.5 w-3.5 shrink-0 min-[375px]:block lg:h-4 lg:w-4" />
              {label}
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        <div className="relative overflow-hidden rounded-2xl border border-white/80 bg-white/90 transition focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100">
          {!errors.pickup && !errors.destination && <span aria-hidden="true" className="pointer-events-none absolute top-11 bottom-11 left-[21px] border-l border-dashed border-slate-300 lg:top-12 lg:bottom-12 lg:left-[25px]" />}
          <Field
            id={`${id}-pickup`}
            label="Pickup location"
            icon={<span className="h-3.5 w-3.5 rounded-full border-[4px] border-brand-600 bg-white" />}
            error={errors.pickup}
            trailing={
              <button
                type="button"
                onClick={useMyLocation}
                aria-label="Use my current location"
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-muted transition hover:bg-brand-50 hover:text-brand-600 ${locating ? "animate-pulse text-brand-600" : ""}`}
              >
                <LocateFixed className="h-5 w-5" />
              </button>
            }
          >
            <input
              id={`${id}-pickup`}
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              placeholder="Enter pickup location"
              autoComplete="street-address"
              aria-invalid={!!errors.pickup}
              aria-describedby={errors.pickup ? `${id}-pickup-error` : undefined}
              className="mt-0.5 w-full bg-transparent text-[0.9rem] font-medium text-ink placeholder:font-normal placeholder:text-slate-500 focus:outline-none"
            />
          </Field>

          <div aria-hidden="true" className="mr-4 ml-11 h-px bg-slate-200/80 lg:ml-12" />

          <Field
            id={`${id}-destination`}
            label={context === "hourly" ? "First stop" : "Destination"}
            icon={<MapPin className="h-[18px] w-[18px] text-ink" strokeWidth={2} />}
            error={errors.destination}
          >
            <input
              id={`${id}-destination`}
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder={destinationPlaceholder[context]}
              aria-invalid={!!errors.destination}
              aria-describedby={errors.destination ? `${id}-destination-error` : undefined}
              className="mt-0.5 w-full bg-transparent text-[0.9rem] font-medium text-ink placeholder:font-normal placeholder:text-slate-500 focus:outline-none"
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <SelectField
            id={`${id}-when`}
            label="When"
            icon={<CalendarDays className="h-5 w-5" />}
            value={when}
            onChange={(v) => setWhen(v as "now" | "later")}
            options={[
              ["now", "Ride now"],
              ["later", "Schedule"],
            ]}
          />
          {context === "hourly" ? (
            <SelectField
              id={`${id}-hours`}
              label="Duration"
              icon={<Clock className="h-5 w-5" />}
              value={hours}
              onChange={setHours}
              options={["2", "3", "4", "6", "8"].map((h) => [h, `${h} hours`])}
            />
          ) : (
            <SelectField
              id={`${id}-passengers`}
              label="Passengers"
              icon={<Users className="h-5 w-5 fill-ink" />}
              value={passengers}
              onChange={setPassengers}
              options={["1", "2", "3", "4", "5", "6"].map((n) => [n, n])}
            />
          )}
        </div>

        {when === "later" && (
          <div>
            <div className="grid grid-cols-1 gap-2.5 min-[400px]:grid-cols-2">
              <label className="min-w-0 rounded-xl border border-slate-200 px-3 py-2">
                <span className="block text-[0.7rem] font-medium text-muted">Date</span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  aria-invalid={!!errors.schedule}
                  className="min-h-11 min-w-0 w-full bg-transparent text-[0.85rem] font-semibold focus:outline-none"
                />
              </label>
              <label className="min-w-0 rounded-xl border border-slate-200 px-3 py-2">
                <span className="block text-[0.7rem] font-medium text-muted">Time</span>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  aria-invalid={!!errors.schedule}
                  className="min-h-11 min-w-0 w-full bg-transparent text-[0.85rem] font-semibold focus:outline-none"
                />
              </label>
            </div>
            {errors.schedule && (
              <p role="alert" className="mt-1.5 text-xs font-medium text-red-600">
                {errors.schedule}
              </p>
            )}
          </div>
        )}
      </div>

      <button
        type="submit"
        className="group mt-3 flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-brand-600 text-[0.92rem] font-bold text-white transition hover:bg-brand-700 lg:mt-4 lg:rounded-2xl lg:shadow-[0_8px_20px_-8px_rgba(21,80,240,0.55)]"
      >
        See ride options <ArrowRight className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-1" />
      </button>
    </form>
  );
}

function Field({
  id,
  label,
  icon,
  error,
  trailing,
  children,
}: {
  id: string;
  label: string;
  icon: ReactNode;
  error?: string;
  trailing?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <div
        className={`flex min-h-[60px] items-center gap-3 px-3 py-2.5 transition focus-within:bg-white lg:min-h-[66px] lg:px-4 lg:py-3 ${
          error ? "bg-red-50/70" : ""
        }`}
      >
        <span className="relative z-0 flex w-[18px] shrink-0 items-center justify-center">{icon}</span>
        <span className="min-w-0 flex-1">
          <label htmlFor={id} className="block text-[0.68rem] font-semibold text-muted">
            {label}
          </label>
          {children}
        </span>
        {trailing}
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="px-4 pb-3 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function SelectField({
  id,
  label,
  icon,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  icon: ReactNode;
  value: string;
  onChange: (value: string) => void;
  options: string[][];
}) {
  return (
    <Select
      id={id}
      value={value}
      onChange={onChange}
      options={options.map(([v, text]) => ({ value: v, label: text }))}
      chevron={false}
      className="flex min-h-14 w-full items-center gap-2.5 rounded-xl border border-white/80 bg-white/90 px-3 py-2 text-left transition hover:border-slate-300 hover:bg-white focus-visible:border-brand-500 focus-visible:ring-2 focus-visible:ring-brand-100 focus-visible:outline-none aria-expanded:border-brand-500 aria-expanded:bg-white aria-expanded:ring-2 aria-expanded:ring-brand-100 lg:min-h-[62px] lg:rounded-2xl lg:py-2.5"
      renderValue={(selected, open) => (
        <>
          <span className="hidden shrink-0 text-muted min-[400px]:block">{icon}</span>
          <span className="min-w-0 flex-1">
            <span className="block text-[0.68rem] font-semibold text-muted">{label}</span>
            <span className="mt-0.5 block truncate text-[0.85rem] font-bold text-ink">{selected}</span>
          </span>
          <ChevronDown className={`h-3.5 w-3.5 shrink-0 text-muted transition ${open ? "rotate-180" : ""}`} aria-hidden="true" />
        </>
      )}
    />
  );
}
