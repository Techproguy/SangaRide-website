import Link from "next/link";
import { ChevronDown } from "lucide-react";
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
    <footer className="bg-navy-950 bg-[radial-gradient(ellipse_at_top_left,rgba(29,95,255,0.14),transparent_60%)] text-white lg:bg-none">
      <div className="container-page grid grid-cols-1 gap-7 py-10 sm:py-12 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-16 lg:py-16">
        <div className="contents lg:block">
          <div className="order-1 lg:order-none">
          <Link href="/" aria-label="Sanga Ride home" className="inline-flex rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-400">
            <Logo inverted />
          </Link>
          <p className="mt-3 text-sm leading-relaxed text-white/60">People. Places. Possibilities.</p>
          </div>
          <ul aria-label="Social media" className="order-4 flex items-center gap-3 lg:order-none lg:mt-6 lg:gap-5">
            {socials.map(({ label, icon: Icon }) => (
              <li key={label}>
                {/* Social destinations pending verification. */}
                <a href="#" aria-label={label} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/75 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-400 lg:h-auto lg:w-auto lg:border-0 lg:bg-transparent">
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Footer" className="order-3 border-y border-white/10 lg:order-none lg:grid lg:grid-cols-3 lg:gap-14 lg:border-0">
          {footerGroups.map((group) => (
            <div key={group.title} className="border-b border-white/10 last:border-b-0 lg:border-0">
              <details className="group lg:hidden">
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 text-[0.95rem] font-semibold marker:content-none [&::-webkit-details-marker]:hidden">
                  {group.title}
                  <ChevronDown className="h-4 w-4 text-white/50 transition-transform group-open:rotate-180" />
                </summary>
                <ul className="grid grid-cols-2 gap-x-4 pb-4">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="flex min-h-11 items-center rounded-md text-sm text-white/65 transition hover:text-white focus-visible:outline-2 focus-visible:outline-brand-400">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
              <div className="hidden lg:block">
              <p className="text-sm font-bold">{group.title}</p>
              <ul className="mt-2 lg:mt-4 lg:space-y-2.5">
                {group.links.map((l) => (
                  <li key={`${group.title}-${l.href}`}>
                    <Link href={l.href} className="inline-flex min-h-11 items-center text-sm text-white/60 transition hover:text-white lg:min-h-0">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
              </div>
            </div>
          ))}
        </nav>

        <div className="order-2 rounded-2xl border border-white/10 bg-white/[0.04] p-5 lg:order-none lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:justify-self-end">
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-start gap-5 py-6 text-xs text-white/40 lg:flex-row lg:items-center lg:justify-between lg:text-white/50">
          <p className="order-2 lg:order-none">© 2026 Sanga Ride. All rights reserved.</p>
          <div className="hidden lg:block">
            <CountrySwitcher up align="left" />
          </div>
        </div>
      </div>
    </footer>
  );
}
