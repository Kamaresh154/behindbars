// src/app/about/page.tsx

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About BehindBars Fabrics",
  description: "The story behind BehindBars Fabrics — premium men's fashion built on the belief that quality should be felt before it's bought.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-obsidian pt-28 pb-24">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="container px-4 lg:px-8 max-w-4xl mx-auto text-center">
          <p className="text-bar-gold text-xs tracking-[0.5em] uppercase mb-6">Our Story</p>
          <h1 className="font-display text-6xl md:text-8xl font-light text-white leading-none mb-8">
            Behind<br />
            <span className="italic text-bar-gold">Bars.</span>
          </h1>
          <p className="text-white/50 text-lg leading-relaxed max-w-2xl mx-auto">
            BehindBars Fabrics was built on a single belief: a man should be able to feel 
            the quality of what he's buying — the drape, the weight, the weave — 
            before it ever arrives at his door.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 border-t border-white/5">
        <div className="container px-4 lg:px-8 grid md:grid-cols-3 gap-10 text-center">
          {[
            { title: "9 Categories",    sub: "Tops · Bottoms · Outer Wear · Active · Lounge · Inner Wear · Footwear · Bags · Accessories" },
            { title: "68 Styles",       sub: "Curated with purpose. Every SKU chosen to earn its place in the wardrobe of a discerning man." },
            { title: "Real-Time 3D",    sub: "The first Indian menswear brand to let you see fabric drape, weave and sheen in real-time 3D — before purchase." },
          ].map((c) => (
            <div key={c.title} className="space-y-3">
              <h3 className="font-display text-3xl text-bar-gold">{c.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{c.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="py-20 border-t border-white/5">
        <div className="container px-4 lg:px-8 max-w-3xl mx-auto">
          <p className="text-bar-gold text-xs tracking-[0.5em] uppercase mb-4 text-center">The Team</p>
          <h2 className="font-display text-4xl text-white text-center mb-12">Built by Saraban Tech</h2>
          <p className="text-white/50 text-base leading-relaxed text-center">
            BehindBars Fabrics is a collaboration between two founders — 
            <strong className="text-white"> Manigandan</strong> and <strong className="text-white">Vimal Raj</strong> — 
            and the engineering team at <strong className="text-white">Saraban Tech</strong>. 
            Together, we bring premium menswear into the digital age with a technology-first approach 
            that puts the customer experience first.
          </p>
        </div>
      </section>
    </div>
  );
}
