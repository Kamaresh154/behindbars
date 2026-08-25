"use client";
// src/components/layout/Navbar.tsx
// Transparent-to-solid Navbar with cart badge, search, and animated hamburger.

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCartStore } from "@/stores/useCartStore";
import { useUIStore } from "@/stores/useUIStore";
import { CartDrawer } from "@/components/commerce/CartDrawer";
import { MobileMenu } from "@/components/layout/MobileMenu";

const NAV_LINKS = [
  { label: "Tops",       href: "/collections/tops"       },
  { label: "Bottoms",    href: "/collections/bottoms"    },
  { label: "Outer Wear", href: "/collections/outer-wear" },
  { label: "Active",     href: "/collections/active-wear"},
  { label: "Lounge",     href: "/collections/lounge-wear"},
  { label: "Footwear",   href: "/collections/footwear"   },
  { label: "Bags",       href: "/collections/bags"       },
  { label: "Accessories",href: "/collections/accessories"},
];

export function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const itemCount                  = useCartStore((s) => s.itemCount());
  const toggleCart                 = useCartStore((s) => s.toggleCart);
  const { toggleMenu, openSearch } = useUIStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-obsidian/95 backdrop-blur-md border-b border-white/5 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex flex-col leading-none">
            <span className="font-display text-xl font-bold tracking-[0.15em] text-white uppercase">
              BehindBars
            </span>
            <span className="font-display text-xs tracking-[0.4em] text-bar-gold uppercase">
              Fabrics
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm tracking-widest text-white/70 hover:text-bar-gold transition-colors duration-200 uppercase font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <button
              onClick={openSearch}
              className="text-white/70 hover:text-white transition-colors p-1"
              aria-label="Search"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" strokeLinecap="round" />
              </svg>
            </button>

            {/* Account */}
            <Link
              href="/account"
              className="text-white/70 hover:text-white transition-colors p-1 hidden sm:block"
              aria-label="Account"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </Link>

            {/* Cart */}
            <button
              onClick={toggleCart}
              className="relative text-white/70 hover:text-white transition-colors p-1"
              aria-label={`Cart — ${itemCount} items`}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-bar-gold text-obsidian text-[10px] font-bold flex items-center justify-center leading-none">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </button>

            {/* Hamburger (mobile) */}
            <button
              onClick={toggleMenu}
              className="lg:hidden text-white/70 hover:text-white transition-colors p-1"
              aria-label="Menu"
            >
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round"/>
                <line x1="3" y1="12" x2="21" y2="12" strokeLinecap="round"/>
                <line x1="3" y1="18" x2="15" y2="18" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      <CartDrawer />
      <MobileMenu links={NAV_LINKS} />
    </>
  );
}
