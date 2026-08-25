// src/app/collections/page.tsx
// All Collections page — category grid with count and featured imagery

import { Metadata } from "next";
import Link from "next/link";
import { CategoryGrid } from "@/components/commerce/CategoryGrid";

export const metadata: Metadata = {
  title: "All Collections",
  description: "Explore all 9 categories of BehindBars Fabrics premium men's fashion — tops, bottoms, outer wear, active wear, footwear and more.",
};

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-obsidian pt-28 pb-24">
      <div className="container px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-bar-gold text-xs tracking-[0.5em] uppercase mb-4">
            The Full Range
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-light text-white">
            All Collections
          </h1>
          <p className="text-white/40 mt-4 text-sm">
            9 categories · 68 premium men&apos;s styles
          </p>
        </div>

        {/* Category Grid */}
        <CategoryGrid />
      </div>
    </div>
  );
}
