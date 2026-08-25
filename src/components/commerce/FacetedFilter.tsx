"use client";
// src/components/commerce/FacetedFilter.tsx
// Sidebar faceted filter — size, colour, price range, availability

import { useState } from "react";

const SIZES_BY_TYPE: Record<string, string[]> = {
  tops:         ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
  bottoms:      ["28", "30", "32", "34", "36", "38", "40", "42", "44", "46"],
  footwear:     ["6", "7", "8", "9", "10", "11", "12"],
  "active-wear":["S", "M", "L", "XL", "XXL", "XXXL"],
  default:      ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
};

const COLOUR_OPTIONS = [
  { name: "Jet Black",     hex: "#1C1C1C" },
  { name: "Crisp White",   hex: "#F8F8F8" },
  { name: "Navy Blue",     hex: "#1B2A4A" },
  { name: "Charcoal Grey", hex: "#3D3D3D" },
  { name: "Olive Green",   hex: "#4E5B31" },
  { name: "Burgundy",      hex: "#6D1A36" },
  { name: "Camel Brown",   hex: "#C19A6B" },
  { name: "Tan",           hex: "#D2691E" },
];

interface FacetedFilterProps {
  category: string;
}

export function FacetedFilter({ category }: FacetedFilterProps) {
  const [selectedSizes, setSelectedSizes]   = useState<string[]>([]);
  const [selectedColours, setSelectedColours] = useState<string[]>([]);
  const [priceRange, setPriceRange]         = useState([0, 15000]);
  const [inStockOnly, setInStockOnly]       = useState(false);

  const sizes = SIZES_BY_TYPE[category] ?? SIZES_BY_TYPE.default;

  const toggleSize = (s: string) =>
    setSelectedSizes((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);

  const toggleColour = (c: string) =>
    setSelectedColours((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);

  const hasFilters = selectedSizes.length > 0 || selectedColours.length > 0 || inStockOnly;

  return (
    <div className="space-y-6">
      {/* Clear all */}
      {hasFilters && (
        <button
          onClick={() => { setSelectedSizes([]); setSelectedColours([]); setInStockOnly(false); }}
          className="text-bar-gold text-xs tracking-widest uppercase hover:text-bar-gold-light transition-colors"
        >
          Clear Filters
        </button>
      )}

      {/* Availability */}
      <div>
        <h4 className="text-white text-xs tracking-[0.3em] uppercase mb-3">Availability</h4>
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="w-4 h-4 accent-bar-gold"
          />
          <span className="text-white/60 text-sm group-hover:text-white transition-colors">
            In Stock Only
          </span>
        </label>
      </div>

      {/* Size */}
      <div>
        <h4 className="text-white text-xs tracking-[0.3em] uppercase mb-3">Size</h4>
        <div className="flex flex-wrap gap-1.5">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={`px-2.5 py-1 border text-xs font-medium transition-all rounded ${
                selectedSizes.includes(size)
                  ? "border-bar-gold bg-bar-gold/10 text-bar-gold"
                  : "border-white/15 text-white/50 hover:border-white/40 hover:text-white"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Colour */}
      <div>
        <h4 className="text-white text-xs tracking-[0.3em] uppercase mb-3">Colour</h4>
        <div className="grid grid-cols-4 gap-2">
          {COLOUR_OPTIONS.map((c) => (
            <button
              key={c.hex}
              onClick={() => toggleColour(c.hex)}
              title={c.name}
              className={`w-7 h-7 rounded-full border-2 transition-all ${
                selectedColours.includes(c.hex)
                  ? "border-bar-gold scale-110 shadow-md shadow-bar-gold/30"
                  : "border-white/10 hover:border-white/40"
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <h4 className="text-white text-xs tracking-[0.3em] uppercase mb-3">
          Price Range — ₹{priceRange[0].toLocaleString("en-IN")} to ₹{priceRange[1].toLocaleString("en-IN")}
        </h4>
        <input
          type="range"
          min={0}
          max={15000}
          step={500}
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
          className="w-full accent-bar-gold"
        />
      </div>

      {/* Apply (mobile) */}
      <button className="w-full py-2.5 bg-bar-gold text-obsidian text-xs font-bold tracking-[0.2em] uppercase rounded-lg hover:bg-bar-gold-light transition-colors">
        Apply Filters
      </button>
    </div>
  );
}
