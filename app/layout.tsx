import type { Metadata, Viewport } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";

export const metadata: Metadata = {
  title: "Touch the Grass",
  description: "Meet people through real-world events.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#284a0c",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Phone frame: centers a mobile-width column on any screen */}
        <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-neutral-950 shadow-2xl">
          {children}
        </div>
      </body>
    </html>
  );
}
