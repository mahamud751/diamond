import type { Metadata, Viewport } from "next";
import { Fraunces, Noto_Sans_Bengali, Outfit } from "next/font/google";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  style: ["italic"],
  weight: ["500", "600"],
  variable: "--font-fraunces",
});

const sans = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const bangla = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: ["400", "500", "600"],
  variable: "--font-bangla",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Asian Top 10 Family — Agency Team",
    template: "%s · Asian Top 10 Family",
  },
  description:
    "Asian Top 10 Family is a Chamet agency team. Join as a host or agent, buy diamonds at open prices and get withdrawal support from people you can reach.",
  applicationName: "Asian Top 10 Family",
};

export const viewport: Viewport = {
  themeColor: "#0c0519",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${bangla.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
