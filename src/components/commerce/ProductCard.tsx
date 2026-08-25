"use client";
// src/components/commerce/ProductCard.tsx

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCartStore } from "@/stores/useCartStore";
import { formatINR } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    category: string;
    price: number;
    salePrice?: number;
    imageUrl: string;
    colours?: { hex: string; name: string }[];
    isNew?: boolean;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [hoveredColour, setHoveredColour] = useState(product.colours?.[0]?.hex);
  const addItem = useCartStore((s) => s.addItem);

  const discount = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : null;

  return (
    <article
      className="group relative flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image container */}
      <Link href={`/products/${product.slug}`} className="block overflow-hidden rounded-xl">
        <div className="relative aspect-[3/4] bg-smoke overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover transition-transform duration-700 ${
              hovered ? "scale-105" : "scale-100"
            }`}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="bg-bar-gold text-obsidian text-[10px] font-bold px-2 py-0.5 tracking-widest uppercase">
                New
              </span>
            )}
            {discount && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 tracking-widest uppercase">
                −{discount}%
              </span>
            )}
          </div>

          {/* Quick-add overlay */}
          <div className={`absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent
            transition-all duration-300 ${hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
            <button
              onClick={(e) => {
                e.preventDefault();
                // Quick add with first available variant (full add handled on PDP)
                addItem({
                  productId: product.id,
                  productName: product.name,
                  slug: product.slug,
                  imageUrl: product.imageUrl,
                  variant: {
                    variantId: `${product.id}-default`,
                    colour: product.colours?.[0]?.name ?? "Default",
                    colourHex: product.colours?.[0]?.hex,
                    size: "M",
                    sku: `${product.slug}-m`,
                    stock: 10,
                  },
                  quantity: 1,
                  unitType: "PIECE",
                  unitPrice: product.salePrice ?? product.price,
                });
              }}
              className="w-full py-2.5 bg-bar-gold text-obsidian text-xs font-bold tracking-[0.2em] 
                uppercase hover:bg-bar-gold-light transition-colors"
            >
              Quick Add
            </button>
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="mt-3 flex flex-col gap-1.5 px-1">
        <p className="text-white/40 text-[10px] tracking-[0.3em] uppercase">{product.category}</p>
        <Link
          href={`/products/${product.slug}`}
          className="text-white text-sm font-medium hover:text-bar-gold transition-colors line-clamp-2"
        >
          {product.name}
        </Link>

        {/* Colour dots */}
        {product.colours && product.colours.length > 0 && (
          <div className="flex gap-1.5 mt-0.5">
            {product.colours.slice(0, 8).map((c) => (
              <button
                key={c.hex}
                title={c.name}
                onMouseEnter={() => setHoveredColour(c.hex)}
                className={`w-4 h-4 rounded-full border transition-all ${
                  hoveredColour === c.hex ? "border-bar-gold scale-110" : "border-white/20"
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
            {product.colours.length > 8 && (
              <span className="text-white/30 text-[10px] self-center">+{product.colours.length - 8}</span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-bar-gold font-semibold text-sm">
            {formatINR(product.salePrice ?? product.price)}
          </span>
          {product.salePrice && (
            <span className="text-white/30 text-xs line-through">
              {formatINR(product.price)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
