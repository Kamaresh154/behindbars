// src/components/commerce/CategoryGrid.tsx

import Link from "next/link";
import Image from "next/image";
import { assetPath } from "@/lib/assetPath";

const CATEGORIES = [
  { id: "tops", name: "Tops", slug: "tops", count: 11, imageUrl: "/images/categories/tops.jpg", description: "T-shirts, shirts & more" },
  { id: "bottoms", name: "Bottoms", slug: "bottoms", count: 6, imageUrl: "/images/categories/bottoms.jpg", description: "Chinos, jeans, trousers" },
  { id: "outer-wear", name: "Outer Wear", slug: "outer-wear", count: 8, imageUrl: "/images/categories/outer-wear.jpg", description: "Jackets, hoodies & blazers" },
  { id: "lounge-wear", name: "Lounge & Sleep", slug: "lounge-wear", count: 5, imageUrl: "/images/categories/lounge-wear.jpg", description: "Joggers, coords & robes" },
  { id: "active-wear", name: "Active Wear", slug: "active-wear", count: 9, imageUrl: "/images/categories/active-wear.jpg", description: "Vansen performance range", featured: true },
  { id: "inner-wear", name: "Inner Wear", slug: "inner-wear", count: 9, imageUrl: "/images/categories/inner-wear.jpg", description: "Boxers, trunks & socks" },
  { id: "footwear", name: "Footwear", slug: "footwear", count: 6, imageUrl: "/images/categories/footwear.jpg", description: "Leather boots, sneakers & more", featured: true },
  { id: "bags", name: "Bags", slug: "bags", count: 4, imageUrl: "/images/categories/bags.jpg", description: "Leather bags for every occasion" },
  { id: "accessories", name: "Accessories", slug: "accessories", count: 10, imageUrl: "/images/categories/accessories.jpg", description: "Belts, wallets, ties & more" },
];

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
      {CATEGORIES.map((cat, i) => (
        <Link key={cat.id} href={`/collections/${cat.slug}`} className={`group relative rounded-xl overflow-hidden ${cat.featured ? "ring-1 ring-bar-gold/30" : ""} ${i === 0 ? "sm:col-span-2 sm:row-span-2" : ""}`}>
          <div className={`relative bg-smoke ${i === 0 ? "aspect-square sm:aspect-auto sm:h-full" : "aspect-square"}`}>
            <Image src={assetPath(cat.imageUrl)} alt={cat.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/20 to-transparent" />
            {cat.featured && <div className="absolute top-2.5 right-2.5"><span className="bg-bar-gold text-obsidian text-[9px] font-bold px-1.5 py-0.5 tracking-widest uppercase">Featured</span></div>}
            <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-4">
              <p className="text-white/40 text-[10px] tracking-[0.3em] uppercase mb-0.5">{cat.count} styles</p>
              <h3 className={`font-display text-white font-light leading-tight ${i === 0 ? "text-2xl md:text-3xl" : "text-lg"}`}>{cat.name}</h3>
              <p className={`text-white/50 text-xs mt-0.5 transition-all duration-300 ${i === 0 ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>{cat.description}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
