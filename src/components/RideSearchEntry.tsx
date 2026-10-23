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
      className="scroll-mt-24 rounded-2xl bg-white p-3 shadow-panel sm:p-4"
    >
      <div role="tablist" aria-label="Journey type" className="mb-3 grid grid-cols-4 gap-1 rounded-xl bg-white">
        {contexts.map(({ id: cid, label, icon: Icon }) => {
          const active = context === cid;
          return (
            <button
              key={cid}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setContext(cid)}
              className={`flex h-10 items-center justify-center gap-1.5 rounded-lg text-[0.78rem] font-semibold transition ${
                active ? "bg-brand-600 text-white shadow-sm" : "text-ink hover:bg-slate-50"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          );
        })}
      </div>

      <div className="space-y-2.5">
        <Field
          id={`${id}-pickup`}
          label="Pickup location"
          icon={<MapPin className="h-5 w-5 fill-brand-600 text-white" strokeWidth={1.5} />}
          error={errors.pickup}
          trailing={
            <button
              type="button"
              onClick={useMyLocation}
              aria-label="Use my current location"
              className={`rounded-full p-1.5 text-ink hover:bg-slate-100 ${locating ? "animate-pulse text-brand-600" : ""}`}
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
            className="w-full bg-transparent text-[0.9rem] text-ink placeholder:text-slate-500 focus:outline-none"
          />
        </Field>

        <Field
          id={`${id}-destination`}
          label={context === "hourly" ? "First stop" : "Destination"}
          icon={<MapPin className="h-5 w-5 fill-red-500 text-white" strokeWidth={1.5} />}
          error={errors.destination}
        >
          <input
            id={`${id}-destination`}
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder={destinationPlaceholder[context]}
            aria-invalid={!!errors.destination}
            aria-describedby={errors.destination ? `${id}-destination-error` : undefined}
            className="w-full bg-transparent text-[0.9rem] text-ink placeholder:text-slate-500 focus:outline-none"
          />
        </Field>

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
            <div className="grid grid-cols-2 gap-2.5">
              <label className="rounded-xl border border-slate-200 px-3 py-2">
                <span className="block text-[0.7rem] font-medium text-muted">Date</span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  aria-invalid={!!errors.schedule}
                  className="w-full bg-transparent text-[0.85rem] font-semibold focus:outline-none"
                />
              </label>
              <label className="rounded-xl border border-slate-200 px-3 py-2">
                <span className="block text-[0.7rem] font-medium text-muted">Time</span>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  aria-invalid={!!errors.schedule}
                  className="w-full bg-transparent text-[0.85rem] font-semibold focus:outline-none"
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
        className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 text-[0.92rem] font-semibold text-white transition hover:bg-brand-700"
      >
        See ride options <ArrowRight className="h-4 w-4" />
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
        className={`flex items-center gap-3 rounded-xl border px-3 py-2 transition focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100 ${
          error ? "border-red-400" : "border-slate-200"
        }`}
      >
        <span className="shrink-0">{icon}</span>
        <span className="min-w-0 flex-1">
          <label htmlFor={id} className="block text-[0.7rem] font-medium text-ink">
            {label}
          </label>
          {children}
        </span>
        {trailing}
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs font-medium text-red-600">
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
      className="flex w-full items-center gap-2.5 rounded-xl border border-slate-200 px-3 py-2 text-left transition hover:border-slate-300 focus-visible:border-brand-500 focus-visible:ring-2 focus-visible:ring-brand-100 focus-visible:outline-none aria-expanded:border-brand-500 aria-expanded:ring-2 aria-expanded:ring-brand-100"
      renderValue={(selected, open) => (
        <>
          <span className="shrink-0 text-ink">{icon}</span>
          <span className="min-w-0 flex-1">
            <span className="block text-[0.7rem] font-medium text-ink">{label}</span>
            <span className="block truncate text-[0.9rem] font-semibold text-ink">{selected}</span>
          </span>
          <ChevronDown className={`h-4 w-4 shrink-0 text-ink transition ${open ? "rotate-180" : ""}`} aria-hidden="true" />
        </>
      )}
    />
  );
}
