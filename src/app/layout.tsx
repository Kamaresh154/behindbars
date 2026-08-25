// src/app/layout.tsx
import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://behindbars.in"),
  title: {
    default: "BehindBars Fabrics — Premium Men's Fashion",
    template: "%s | BehindBars Fabrics",
  },
  description:
    "Discover premium men's apparel — tops, bottoms, outer wear, active wear, footwear and accessories. Experience fabric in real-time 3D before you buy.",
  keywords: [
    "men's fashion", "premium menswear", "fabric store India",
    "BehindBars Fabrics", "men's clothing online", "buy fabric online",
    "Vansen active wear", "leather shoes India",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://behindbars.in",
    siteName: "BehindBars Fabrics",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="bg-obsidian text-white antialiased">
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
