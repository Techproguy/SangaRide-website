import type { Metadata } from "next";
import { Caveat, Plus_Jakarta_Sans } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { MarketingChrome } from "@/components/MarketingChrome";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: { default: "Sanga Ride — Wherever life takes you, move with Sanga", template: "%s — Sanga Ride" },
  description:
    "Book rides across your city, to the airport, between cities and beyond with Sanga Ride.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jakarta.variable} ${caveat.variable}`}>
      <body>
        <MarketingChrome><SiteHeader /></MarketingChrome>
        {children}
        <MarketingChrome><SiteFooter /></MarketingChrome>
      </body>
    </html>
  );
}
