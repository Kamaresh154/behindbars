"use client";
// src/components/commerce/CartDrawer.tsx
// Slide-in cart with cut-length support, coupon field, and order summary.

import Link from "next/link";
import { useCartStore } from "@/stores/useCartStore";
import { formatINR } from "@/lib/utils";

export function CartDrawer() {
  const { isOpen, closeCart, items, removeItem, updateQuantity, subtotal, itemCount, couponCode, discountAmount } =
    useCartStore();

  const total = subtotal() - discountAmount;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-charcoal border-l border-white/5 
          z-50 flex flex-col transition-transform duration-500 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <div>
            <h2 className="font-display text-xl text-white">Your Cart</h2>
            <p className="text-white/40 text-xs mt-0.5">{itemCount()} items</p>
          </div>
          <button
            onClick={closeCart}
            className="text-white/40 hover:text-white transition-colors p-1"
            aria-label="Close cart"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round"/>
              <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center pb-16">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="1" className="text-white/20 mb-4">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              <p className="text-white/30 font-display text-lg">Your cart is empty</p>
              <button
                onClick={closeCart}
                className="mt-6 text-bar-gold text-sm tracking-widest uppercase hover:text-bar-gold-light"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id}
                className="flex gap-3 p-3 bg-smoke rounded-xl border border-white/5">
                {/* Image */}
                <div className="w-16 h-20 bg-obsidian rounded-lg overflow-hidden flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.imageUrl} alt={item.productName}
                    className="w-full h-full object-cover" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white text-sm font-medium truncate">{item.productName}</h3>
                  <p className="text-white/40 text-xs mt-0.5">
                    {item.variant.colour} · {item.variant.size}
                  </p>
                  <p className="text-bar-gold text-sm font-semibold mt-1">
                    {formatINR(item.unitPrice)}
                    {item.unitType === "METRE" && " /m"}
                  </p>

                  {/* Quantity control */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - (item.unitType === "METRE" ? 0.5 : 1))}
                      className="w-6 h-6 rounded border border-white/20 text-white/60 hover:border-bar-gold hover:text-bar-gold transition-all text-sm"
                    >−</button>
                    <span className="text-white text-sm w-8 text-center">
                      {item.unitType === "METRE" ? item.quantity.toFixed(1) : item.quantity}
                      {item.unitType === "METRE" ? "m" : ""}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + (item.unitType === "METRE" ? 0.5 : 1))}
                      className="w-6 h-6 rounded border border-white/20 text-white/60 hover:border-bar-gold hover:text-bar-gold transition-all text-sm"
                    >+</button>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-auto text-white/25 hover:text-red-400 transition-colors p-0.5"
                      aria-label="Remove item"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <polyline points="3,6 5,6 21,6"/>
                        <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1v2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Line total */}
                <p className="text-white/70 text-sm font-medium self-start pt-0.5">
                  {formatINR(item.unitPrice * item.quantity)}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-white/5 px-6 py-5 space-y-4">
            {/* Coupon display */}
            {couponCode && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-bar-gold">🎫 {couponCode}</span>
                <span className="text-green-400">−{formatINR(discountAmount)}</span>
              </div>
            )}

            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-sm">Subtotal</span>
              <span className="text-white font-semibold">{formatINR(subtotal())}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Discount</span>
                <span className="text-green-400 font-semibold">−{formatINR(discountAmount)}</span>
              </div>
            )}
            <div className="flex items-center justify-between border-t border-white/5 pt-3">
              <span className="text-white text-sm font-medium">Total</span>
              <span className="text-bar-gold text-lg font-bold">{formatINR(total)}</span>
            </div>
            <p className="text-white/30 text-xs">Shipping calculated at checkout</p>

            {/* CTA */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full py-4 bg-bar-gold text-obsidian text-sm tracking-[0.2em] 
                uppercase font-bold text-center hover:bg-bar-gold-light transition-all duration-300"
            >
              Proceed to Checkout
            </Link>
            <button
              onClick={closeCart}
              className="w-full py-2 text-white/40 text-xs tracking-widest uppercase hover:text-white transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
