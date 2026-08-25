"use client";
// src/app/page.tsx
// Home page — scroll-choreographed fashion hero + content sections.

import Link from "next/link";
import { Suspense } from "react";
import { ProductCard } from "@/components/commerce/ProductCard";
import { CategoryGrid } from "@/components/commerce/CategoryGrid";
import { OutfitHero } from "@/components/experience/OutfitHero";

export default function HomePage() {

  return (
    <>
      {/* ══════════════════════════════════════════
          SECTION 1 — Scroll-driven outfit hero
          10 × 100vh = 1000vh total scroll height
      ══════════════════════════════════════════ */}
      <section
        className="relative"
        style={{ height: "1000vh" }}
        aria-label="Immersive brand experience"
      >
        {/* Sticky container — stays in view while user scrolls */}
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-obsidian">
          <OutfitHero />
        </div>
      </section>


      {/* ══════════════════════════════════════════
          SECTION 2 — Categories Grid
      ══════════════════════════════════════════ */}
      <section className="py-24 px-4 lg:px-8 bg-obsidian">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-bar-gold text-xs tracking-[0.5em] uppercase mb-4">
              9 Categories · 68 Styles
            </p>
            <h2 className="font-display text-5xl md:text-6xl font-light text-white">
              The Full Collection
            </h2>
          </div>
          <Suspense fallback={<CategoryGridSkeleton />}>
            <CategoryGrid />
          </Suspense>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 3 — Featured Products
      ══════════════════════════════════════════ */}
      <section className="py-24 px-4 lg:px-8 bg-charcoal">
        <div className="container">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-bar-gold text-xs tracking-[0.5em] uppercase mb-3">
                Curated Selection
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-light text-white">
                Best Sellers
              </h2>
            </div>
            <Link
              href="/collections"
              className="text-bar-gold text-sm tracking-[0.2em] uppercase hover:text-bar-gold-light 
                transition-colors border-b border-bar-gold pb-0.5 hidden sm:block"
            >
              View All
            </Link>
          </div>
          <Suspense fallback={<FeaturedSkeleton />}>
            <FeaturedProducts />
          </Suspense>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 4 — Brand Story Banner
      ══════════════════════════════════════════ */}
      <section className="relative py-32 overflow-hidden bg-obsidian">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "url(/images/fabric-texture-bg.jpg)", backgroundSize: "cover" }}
        />
        <div className="container px-4 lg:px-8 relative z-10 text-center max-w-3xl mx-auto">
          <p className="text-bar-gold text-xs tracking-[0.5em] uppercase mb-6">Our Philosophy</p>
          <h2 className="font-display text-4xl md:text-6xl font-light text-white leading-tight mb-8">
            Crafted for the man who
            <em className="text-gradient-gold not-italic block mt-2">wears his standards.</em>
          </h2>
          <p className="text-white/50 text-base leading-relaxed mb-10">
            BehindBars Fabrics brings premium menswear to your screen in real-time 3D — 
            so you see the drape, the weave, the sheen, before it ever arrives at your door. 
            Nine categories. 68 styles. Zero compromise.
          </p>
          <Link
            href="/about"
            className="inline-block px-8 py-3 border border-bar-gold/50 text-bar-gold 
              text-sm tracking-[0.3em] uppercase hover:border-bar-gold hover:bg-bar-gold/10 
              transition-all duration-300"
          >
            Our Story
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 5 — Active Wear Highlight
      ══════════════════════════════════════════ */}
      <section className="py-24 px-4 lg:px-8 bg-charcoal">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-bar-gold text-xs tracking-[0.5em] uppercase mb-4">
                Vansen Active Wear
              </p>
              <h2 className="font-display text-5xl md:text-6xl font-light text-white mb-6">
                Move without<br />
                <span className="text-gradient-gold italic">limits.</span>
              </h2>
              <p className="text-white/50 text-base leading-relaxed mb-8">
                9 active wear styles engineered for performance. Tank tops, 
                half-sleeve tees, track joggers, tights — all in 14 colourways 
                designed to outlast your hardest sessions.
              </p>
              <Link
                href="/collections/active-wear"
                className="inline-block px-8 py-4 bg-bar-gold text-obsidian text-sm 
                  tracking-[0.3em] uppercase font-semibold hover:bg-bar-gold-light transition-all"
              >
                Shop Active Wear
              </Link>
            </div>
            <div className="aspect-[4/5] bg-smoke rounded-2xl overflow-hidden relative">
              {/* Placeholder — replace with actual imagery */}
              <div className="absolute inset-0 flex items-center justify-center text-white/10 font-display text-3xl">
                Active Wear Visual
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 6 — Newsletter / WhatsApp CTA
      ══════════════════════════════════════════ */}
      <section className="py-20 px-4 lg:px-8 bg-obsidian border-t border-white/5">
        <div className="container text-center max-w-2xl mx-auto">
          <p className="text-bar-gold text-xs tracking-[0.5em] uppercase mb-4">Stay Connected</p>
          <h2 className="font-display text-4xl font-light text-white mb-4">
            Drop updates, first.
          </h2>
          <p className="text-white/40 text-sm mb-8">
            New arrivals, exclusive drops and member-only offers — straight to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-white/5 border border-white/10 text-white placeholder:text-white/30 
                px-4 py-3 text-sm outline-none focus:border-bar-gold transition-colors"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-bar-gold text-obsidian text-sm tracking-[0.2em] 
                uppercase font-semibold hover:bg-bar-gold-light transition-all whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

// ── Skeleton loaders ──────────────────────────────

function CategoryGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="aspect-square bg-white/5 rounded-xl animate-pulse" />
      ))}
    </div>
  );
}

function FeaturedSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="aspect-[3/4] bg-white/5 rounded-xl animate-pulse" />
      ))}
    </div>
  );
}

// ── Featured products — synchronous (static data for client component) ──
// In production: replace with SWR/React-Query fetching from /api/products?featured=true

const FEATURED_PRODUCTS = [
  { id: "1", name: "Silky Sateen Shirt",   slug: "silky-sateen-shirt",  category: "Tops",      price: 2299,  imageUrl: "/images/products/placeholder.jpg" },
  { id: "2", name: "Italian Pants",         slug: "italian-pants",       category: "Bottoms",   price: 3499,  imageUrl: "/images/products/placeholder.jpg" },
  { id: "3", name: "Leather Jacket",        slug: "leather-jacket",      category: "Outer Wear",price: 12999, imageUrl: "/images/products/placeholder.jpg" },
  { id: "4", name: "Leather Boots",         slug: "leather-boots",       category: "Footwear",  price: 6499,  imageUrl: "/images/products/placeholder.jpg" },
];

function FeaturedProducts() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
      {FEATURED_PRODUCTS.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
