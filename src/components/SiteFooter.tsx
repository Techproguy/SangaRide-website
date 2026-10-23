import Link from "next/link";
import { footerGroups } from "@/lib/content";
import { CountrySwitcher } from "./CountrySwitcher";
import { InstagramIcon, LinkedInIcon, Logo, XIcon, YouTubeIcon } from "./icons";
import { NewsletterForm } from "./NewsletterForm";

const socials = [
  { label: "Sanga Ride on X", icon: XIcon },
  { label: "Sanga Ride on Instagram", icon: InstagramIcon },
  { label: "Sanga Ride on LinkedIn", icon: LinkedInIcon },
  { label: "Sanga Ride on YouTube", icon: YouTubeIcon },
];

export function SiteFooter() {
  return (
    <footer className="bg-navy-950 text-white">
      <div className="container-page grid grid-cols-1 gap-12 py-16 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-16">
        <div>
          <Link href="/" aria-label="Sanga Ride home">
            <Logo inverted />
          </Link>
          <p className="mt-3 text-sm text-white/60">People. Places. Possibilities.</p>
          <ul className="mt-6 flex items-center gap-5">
            {socials.map(({ label, icon: Icon }) => (
              <li key={label}>
                {/* Social destinations pending verification. */}
                <a href="#" aria-label={label} className="text-white/70 transition hover:text-white">
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-14">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <p className="text-sm font-bold">{group.title}</p>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((l) => (
                  <li key={`${group.title}-${l.href}`}>
                    <Link href={l.href} className="text-sm text-white/60 transition hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="lg:justify-self-end">
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-4 py-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Sanga Ride. All rights reserved.</p>
          <CountrySwitcher up align="left" />
        </div>
      </div>
    </footer>
  );
}
