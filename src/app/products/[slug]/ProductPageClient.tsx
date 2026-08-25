"use client";

import dynamic from "next/dynamic";
import { Suspense, useState } from "react";
import { useCartStore } from "@/stores/useCartStore";
import { formatINR } from "@/lib/utils";

const FabricViewer = dynamic(
  () => import("@/components/experience/FabricViewer").then((m) => m.FabricViewer),
  { ssr: false, loading: () => <div className="aspect-square bg-smoke rounded-2xl animate-pulse" /> }
);

const PLACEHOLDER_PRODUCT = {
  id: "1", name: "Silky Sateen Shirt", slug: "silky-sateen-shirt", category: "Tops", price: 2299,
  description: "Luxurious silky sateen weave — premium sheen with a satin-smooth finish. Crafted from 75% Polyester 25% Viscose for a drape that commands attention.",
  composition: "75% Polyester 25% Viscose", gsm: 110, careInstructions: "Dry clean only. Do not tumble dry.",
  colours: [
    { name: "Jet Black", hex: "#1C1C1C", inStock: true }, { name: "Crisp White", hex: "#F8F8F8", inStock: true },
    { name: "Navy Blue", hex: "#1B2A4A", inStock: true }, { name: "Charcoal Grey", hex: "#3D3D3D", inStock: true },
    { name: "Burgundy", hex: "#6D1A36", inStock: true }, { name: "Olive Green", hex: "#4E5B31", inStock: false },
  ],
  sizes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
  sizeStocks: { XS: 1, S: 2, M: 4, L: 4, XL: 4, XXL: 2, XXXL: 1 },
  images: ["/images/products/silky-sateen-shirt/primary.jpg", "/images/products/silky-sateen-shirt/2.jpg"],
};

const SIZE_CHART = {
  headers: ["Size", "Chest (cm)", "Shoulder (cm)", "Length (cm)"],
  rows: [["XS", "86-91", "42", "67"], ["S", "91-96", "44", "69"], ["M", "96-101", "46", "71"], ["L", "101-106", "48", "73"], ["XL", "106-111", "50", "75"], ["XXL", "111-116", "52", "77"], ["XXXL", "116-121", "54", "79"]],
};

export default function ProductPageClient() {
  const product = PLACEHOLDER_PRODUCT;
  const [selectedColour, setSelectedColour] = useState(product.colours[0]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "size" | "care">("details");
  const [qty, setQty] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addItem({ productId: product.id, productName: product.name, slug: product.slug, imageUrl: product.images[0], variant: {
      variantId: `${product.id}-${selectedColour.hex}-${selectedSize}`, colour: selectedColour.name, colourHex: selectedColour.hex,
      size: selectedSize, sku: `BB-${product.slug.slice(0, 8)}-${selectedSize}`,
      stock: product.sizeStocks[selectedSize as keyof typeof product.sizeStocks] ?? 0,
    }, quantity: qty, unitType: "PIECE", unitPrice: product.price });
    setAddedFeedback(true); setTimeout(() => setAddedFeedback(false), 2000);
  };

  return (
    <div className="min-h-screen bg-obsidian pt-24 pb-20"><div className="container px-4 lg:px-8">
      <nav className="text-white/30 text-xs tracking-wider mb-8"><span>Home</span><span className="mx-2">/</span><span>{product.category}</span><span className="mx-2">/</span><span className="text-white">{product.name}</span></nav>
      <div className="grid lg:grid-cols-2 gap-10 xl:gap-16">
        <div className="space-y-4"><Suspense fallback={<div className="aspect-square bg-smoke rounded-2xl animate-pulse" />}><FabricViewer productSlug={product.slug} colours={product.colours} onColourChange={(hex) => { const c = product.colours.find((colour) => colour.hex === hex); if (c) setSelectedColour(c); }} /></Suspense><p className="text-white/25 text-xs text-center tracking-wider">Real-time 3D preview · Drag to rotate · Scroll to zoom</p></div>
        <div className="space-y-6">
          <div><p className="text-bar-gold text-xs tracking-[0.5em] uppercase mb-2">{product.category}</p><h1 className="font-display text-4xl md:text-5xl font-light text-white leading-tight">{product.name}</h1></div>
          <div className="flex items-baseline gap-3"><span className="font-display text-3xl text-bar-gold font-semibold">{formatINR(product.price)}</span><span className="text-white/30 text-sm">incl. GST</span></div>
          <div><p className="text-white/60 text-xs tracking-[0.3em] uppercase mb-3">Colour — <span className="text-white">{selectedColour.name}</span></p><div className="flex gap-2 flex-wrap">{product.colours.map((c) => <button key={c.hex} onClick={() => c.inStock && setSelectedColour(c)} title={c.name} disabled={!c.inStock} className={`relative w-8 h-8 rounded-full border-2 transition-all ${selectedColour.hex === c.hex ? "border-bar-gold scale-110 shadow-lg shadow-bar-gold/40" : "border-white/20 hover:border-white/60"} ${!c.inStock ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`} style={{ backgroundColor: c.hex }}>{!c.inStock && <span className="absolute inset-0 flex items-center justify-center"><span className="w-[130%] h-px bg-white/50 rotate-45 block" /></span>}</button>)}</div></div>
          <div><div className="flex items-center justify-between mb-3"><p className="text-white/60 text-xs tracking-[0.3em] uppercase">Size{selectedSize ? ` — ${selectedSize}` : ""}</p><button onClick={() => setActiveTab("size")} className="text-bar-gold text-xs tracking-wider underline underline-offset-2">Size Guide</button></div><div className="flex gap-2 flex-wrap">{product.sizes.map((size) => { const stock = product.sizeStocks[size as keyof typeof product.sizeStocks] ?? 0; return <button key={size} onClick={() => stock > 0 && setSelectedSize(size)} disabled={stock === 0} className={`px-4 py-2 border text-sm font-medium transition-all rounded ${selectedSize === size ? "border-bar-gold bg-bar-gold/15 text-bar-gold" : stock === 0 ? "border-white/10 text-white/20 cursor-not-allowed line-through" : "border-white/20 text-white/60 hover:border-white/60 hover:text-white"}`}>{size}</button>; })}</div>{!selectedSize && <p className="text-amber-400 text-xs mt-2">Please select a size</p>}</div>
          <div className="flex items-center gap-4"><div className="flex items-center border border-white/15 rounded-lg overflow-hidden"><button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-10 h-10 text-white/60 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center text-lg">−</button><span className="w-10 text-center text-white text-sm">{qty}</span><button onClick={() => setQty((q) => Math.min(4, q + 1))} className="w-10 h-10 text-white/60 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center text-lg">+</button></div><p className="text-white/30 text-xs">Max 4 per order</p></div>
          <div className="flex gap-3"><button onClick={handleAddToCart} disabled={!selectedSize} className={`flex-1 py-4 text-sm font-bold tracking-[0.2em] uppercase transition-all duration-300 ${addedFeedback ? "bg-green-500 text-white" : selectedSize ? "bg-bar-gold text-obsidian hover:bg-bar-gold-light" : "bg-white/10 text-white/30 cursor-not-allowed"}`}>{addedFeedback ? "✓ Added to Cart" : "Add to Cart"}</button><button aria-label="Add to wishlist" className="w-12 h-14 border border-white/15 text-white/50 hover:border-bar-gold hover:text-bar-gold transition-all rounded flex items-center justify-center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" strokeLinejoin="round"/></svg></button></div>
          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-white/5">{[{ icon: "🚚", label: "Free Shipping", sub: "Orders above ₹1999" }, { icon: "↩️", label: "Easy Returns", sub: "7-day return policy" }, { icon: "🔒", label: "Secure Payment", sub: "Razorpay PCI-DSS" }].map((b) => <div key={b.label} className="text-center"><div className="text-xl mb-1">{b.icon}</div><p className="text-white/70 text-[10px] font-medium">{b.label}</p><p className="text-white/30 text-[9px]">{b.sub}</p></div>)}</div>
          <div className="border-t border-white/5 pt-6"><div className="flex gap-6 border-b border-white/5 mb-5">{(["details", "size", "care"] as const).map((tab) => <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-2 text-xs tracking-[0.3em] uppercase transition-colors border-b-2 -mb-px ${activeTab === tab ? "border-bar-gold text-bar-gold" : "border-transparent text-white/40 hover:text-white"}`}>{tab === "details" ? "Details" : tab === "size" ? "Size Guide" : "Care"}</button>)}</div>
            {activeTab === "details" && <div className="space-y-3"><p className="text-white/60 text-sm leading-relaxed">{product.description}</p><ul className="space-y-1.5"><li className="flex gap-2 text-sm text-white/50"><span className="text-bar-gold">·</span><span>Composition: {product.composition}</span></li><li className="flex gap-2 text-sm text-white/50"><span className="text-bar-gold">·</span><span>GSM: {product.gsm}</span></li><li className="flex gap-2 text-sm text-white/50"><span className="text-bar-gold">·</span><span>Available in {product.colours.filter((c) => c.inStock).length} colourways</span></li></ul></div>}
            {activeTab === "size" && <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr>{SIZE_CHART.headers.map((h) => <th key={h} className="text-bar-gold text-xs tracking-wider text-left pb-2 pr-4">{h}</th>)}</tr></thead><tbody>{SIZE_CHART.rows.map((row) => <tr key={row[0]} className={`border-t border-white/5 ${selectedSize === row[0] ? "bg-bar-gold/5" : ""}`}>{row.map((cell, i) => <td key={i} className={`py-2 pr-4 text-sm ${i === 0 ? "text-bar-gold font-medium" : "text-white/60"}`}>{cell}</td>)}</tr>)}</tbody></table></div>}
            {activeTab === "care" && <p className="text-white/60 text-sm leading-relaxed">{product.careInstructions}</p>}
          </div>
        </div>
      </div>
    </div></div>
  );
}
