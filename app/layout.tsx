import type { Metadata, Viewport } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";

const display = Poppins({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Touch the Grass",
  description: "Meet people through real-world events.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#070b09",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        {/* Phone frame: centers a mobile-width column on any screen */}
        <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col overflow-hidden bg-ink-900 shadow-2xl">
          <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
          <div className="relative z-10 flex min-h-screen flex-col">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
