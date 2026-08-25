"use client";
// src/components/layout/MobileMenu.tsx

import Link from "next/link";
import { useEffect } from "react";
import { useUIStore } from "@/stores/useUIStore";

interface NavLink { label: string; href: string }

export function MobileMenu({ links }: { links: NavLink[] }) {
  const { menuOpen, closeMenu } = useUIStore();

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/70 z-40 transition-opacity duration-300 lg:hidden ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMenu}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-72 bg-obsidian border-l border-white/5 z-50 
          flex flex-col transition-transform duration-500 ease-out lg:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <span className="font-display text-lg tracking-widest text-bar-gold uppercase">
            Menu
          </span>
          <button
            onClick={closeMenu}
            className="text-white/50 hover:text-white p-1"
            aria-label="Close menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round"/>
              <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 flex flex-col gap-1 p-4 overflow-y-auto">
          {links.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className="px-4 py-3 rounded-lg text-white/70 hover:text-white hover:bg-white/5 
                tracking-widest text-sm uppercase font-medium transition-all duration-200"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {link.label}
            </Link>
          ))}

          <div className="mt-4 border-t border-white/5 pt-4 flex flex-col gap-1">
            <Link href="/account" onClick={closeMenu}
              className="px-4 py-3 rounded-lg text-white/50 hover:text-white hover:bg-white/5 tracking-widest text-sm uppercase">
              Account
            </Link>
            <Link href="/account/orders" onClick={closeMenu}
              className="px-4 py-3 rounded-lg text-white/50 hover:text-white hover:bg-white/5 tracking-widest text-sm uppercase">
              Orders
            </Link>
            <Link href="/about" onClick={closeMenu}
              className="px-4 py-3 rounded-lg text-white/50 hover:text-white hover:bg-white/5 tracking-widest text-sm uppercase">
              About
            </Link>
            <Link href="/contact" onClick={closeMenu}
              className="px-4 py-3 rounded-lg text-white/50 hover:text-white hover:bg-white/5 tracking-widest text-sm uppercase">
              Contact
            </Link>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-white/5">
          <p className="text-white/25 text-xs tracking-wider">
            © 2025 BehindBars Fabrics
          </p>
        </div>
      </aside>
    </>
  );
}
