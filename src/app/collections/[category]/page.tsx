// src/app/collections/[category]/page.tsx
// Category product listing page with faceted filters

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/commerce/ProductCard";
import { FacetedFilter } from "@/components/commerce/FacetedFilter";

const CATEGORY_META: Record<string, { title: string; description: string }> = {
  tops:         { title: "Tops",         description: "Premium men's T-shirts, casual shirts, formal shirts and silky sateen shirts." },
  bottoms:      { title: "Bottoms",      description: "Chinos, denim jeans, formal pants, cargo trousers, shorts and Italian pants." },
  "outer-wear": { title: "Outer Wear",   description: "Leather jackets, bomber jackets, hoodies, sweaters and blazer coats." },
  "lounge-wear":{ title: "Lounge & Sleep Wear", description: "Joggers, sweatpants, lounge shorts, coord sets and bath robes." },
  "active-wear":{ title: "Vansen Active Wear", description: "Performance tank tops, tees, shorts, track pants, joggers and compression tights." },
  "inner-wear": { title: "Inner Wear",   description: "Boxers, trunks, vests, shapewear and all types of premium socks." },
  footwear:     { title: "Footwear",     description: "Leather boots, sneakers, loafers, formal shoes and gloss shoes." },
  bags:         { title: "Bags",         description: "Full-grain leather backpacks, messenger bags, business briefcases and duffel bags." },
  accessories:  { title: "Accessories",  description: "Leather belts, wallets, ties, pocket squares, bandanas, keychains and more." },
};

interface Props {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const meta = CATEGORY_META[category];
  if (!meta) return { title: "Collection Not Found" };
  return {
    title: meta.title,
    description: meta.description,
  };
}

export async function generateStaticParams() {
  return Object.keys(CATEGORY_META).map((category) => ({ category }));
}

// Placeholder products for UI — replace with DB fetch
const PLACEHOLDER_PRODUCTS = Array.from({ length: 12 }, (_, i) => ({
  id: String(i + 1),
  name: `Premium Item ${i + 1}`,
  slug: `premium-item-${i + 1}`,
  category: "Collection",
  price: 999 + i * 500,
  salePrice: i % 3 === 0 ? 799 + i * 400 : undefined,
  imageUrl: "/images/products/placeholder.jpg",
  isNew: i < 3,
  colours: [
    { hex: "#1C1C1C", name: "Jet Black" },
    { hex: "#F8F8F8", name: "Crisp White" },
    { hex: "#1B2A4A", name: "Navy Blue" },
  ],
}));

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const meta = CATEGORY_META[category];

  if (!meta) notFound();

  return (
    <div className="min-h-screen bg-obsidian pt-28 pb-24">
      <div className="container px-4 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <nav className="text-white/30 text-xs tracking-wider mb-4">
            <span className="hover:text-bar-gold cursor-pointer">Home</span>
            <span className="mx-2">/</span>
            <span className="hover:text-bar-gold cursor-pointer">Collections</span>
            <span className="mx-2">/</span>
            <span className="text-white">{meta.title}</span>
          </nav>
          <h1 className="font-display text-5xl md:text-6xl font-light text-white">
            {meta.title}
          </h1>
          <p className="text-white/40 mt-2 text-sm max-w-xl">{meta.description}</p>
        </div>

        {/* Filter + Product Grid Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters sidebar */}
          <aside className="lg:w-56 flex-shrink-0">
            <FacetedFilter category={category} />
          </aside>

          {/* Products grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-white/40 text-sm">
                {PLACEHOLDER_PRODUCTS.length} products
              </p>
              <select className="bg-smoke border border-white/10 text-white/70 text-sm px-3 py-1.5 rounded-lg outline-none focus:border-bar-gold">
                <option>Sort: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
              </select>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
              {PLACEHOLDER_PRODUCTS.map((p) => (
                <ProductCard key={p.id} product={{ ...p, category: meta.title }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
