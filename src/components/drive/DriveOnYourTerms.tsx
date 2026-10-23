import { BarChart3, Layers, Power, Wallet } from "lucide-react";
import { GoOnlineScreen, PhoneFrame } from "./PhoneScreens";

// Verified capabilities only; service classes depend on market, zone, driver and vehicle (spec DR-04).
const features = [
  { icon: Power, title: "Choose when you go online", text: "Go online and offline from the Driver app when it suits you." },
  { icon: Layers, title: "Trips you're eligible for", text: "You receive offers for the trip categories your account and vehicle are set up for." },
  { icon: BarChart3, title: "Track your earnings", text: "See completed trips and the earnings history for each one." },
  { icon: Wallet, title: "See your payout status", text: "Follow payouts and any settlement balance where supported." },
];

/** DR-04 "Drive on your terms". */
export function DriveOnYourTerms() {
  return (
    <section id="your-terms" aria-labelledby="terms-title" className="scroll-mt-24">
      <div className="container-page">
        <div className="grid grid-cols-1 items-center gap-10 overflow-hidden rounded-[2rem] bg-surface p-7 sm:p-10 lg:grid-cols-[1fr_260px_1fr] lg:gap-12 lg:p-12">
          <div>
            <h2 id="terms-title" className="heading-lg">
              Drive on your terms.
            </h2>
            <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-muted">
              The Driver app puts the controls in your hands. Which trips and services you can offer depends on your
              market, zone and vehicle.
            </p>
            <p className="mt-6 text-[0.72rem] text-muted">Illustrative interface — final app screens to follow.</p>
          </div>

          <div className="mx-auto w-full max-w-[240px]" aria-hidden="true">
            <PhoneFrame>
              <GoOnlineScreen />
            </PhoneFrame>
          </div>

          <ul className="space-y-6">
            {features.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-3.5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-brand-600 shadow-card">
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <div>
                  <h3 className="text-[0.95rem] font-bold">{title}</h3>
                  <p className="mt-1 text-[0.85rem] leading-relaxed text-muted">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
