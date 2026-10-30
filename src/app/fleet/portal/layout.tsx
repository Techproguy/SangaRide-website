import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./portal.css";
import { PreviewProvider } from "@/components/fleet-portal/PreviewProvider";
const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-fleet",
  weight: ["400", "500", "600", "700"],
});
export const metadata: Metadata = {
  title: "Fleet Portal",
  robots: { index: false, follow: false },
};
export default function FleetPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`fp ${workSans.variable}`}>
      <PreviewProvider>{children}</PreviewProvider>
    </div>
  );
}
