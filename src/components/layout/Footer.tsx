// src/components/layout/Footer.tsx

import Link from "next/link";

const FOOTER_LINKS = {
  Shop: [
    { label: "Tops",        href: "/collections/tops"        },
    { label: "Bottoms",     href: "/collections/bottoms"     },
    { label: "Outer Wear",  href: "/collections/outer-wear"  },
    { label: "Active Wear", href: "/collections/active-wear" },
    { label: "Footwear",    href: "/collections/footwear"    },
    { label: "Accessories", href: "/collections/accessories" },
  ],
  Help: [
    { label: "My Account",      href: "/account"                },
    { label: "Track Order",     href: "/account/orders"         },
    { label: "Returns",         href: "/policies/returns"       },
    { label: "Size Guide",      href: "/size-guide"             },
    { label: "Contact Us",      href: "/contact"                },
    { label: "FAQ",             href: "/faq"                    },
  ],
  Info: [
    { label: "About",           href: "/about"                  },
    { label: "Privacy Policy",  href: "/policies/privacy"       },
    { label: "Terms of Service",href: "/policies/terms"         },
    { label: "Shipping Policy", href: "/policies/shipping"      },
    { label: "Refund Policy",   href: "/policies/refunds"       },
  ],
};

export function Footer() {
  return (
    <footer className="bg-obsidian border-t border-white/5 pt-16 pb-10">
      <div className="container px-4 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-16">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="inline-flex flex-col leading-none mb-6">
              <span className="font-display text-2xl font-bold tracking-[0.15em] text-white uppercase">
                BehindBars
              </span>
              <span className="font-display text-xs tracking-[0.4em] text-bar-gold uppercase">
                Fabrics
              </span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Premium men&apos;s fashion delivered with real-time 3D fabric previews. 
              See the drape, the weave, the sheen — before it arrives.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" aria-label="Instagram" className="text-white/30 hover:text-bar-gold transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="#" aria-label="WhatsApp" className="text-white/30 hover:text-bar-gold transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.096.538 4.066 1.482 5.78L0 24l6.374-1.462A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.655-.502-5.19-1.381l-.373-.22-3.783.866.93-3.695-.24-.38A9.946 9.946 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                </svg>
              </a>
            </div>

            {/* Payment logos */}
            <div className="flex gap-3 mt-6 items-center">
              <span className="text-white/20 text-xs tracking-wider">Accepts:</span>
              <div className="flex gap-2">
                {["UPI", "VISA", "MC"].map((m) => (
                  <span key={m}
                    className="px-2 py-0.5 border border-white/10 text-white/30 text-[9px] tracking-wider rounded">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-white text-xs tracking-[0.3em] uppercase font-medium mb-4">
                {section}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/40 text-sm hover:text-bar-gold transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-xs tracking-wider">
            © 2025 BehindBars Fabrics. All rights reserved.
          </p>
          <p className="text-white/15 text-xs tracking-wider">
            Built by Saraban Tech · Powered by Next.js & Three.js
          </p>
          <div className="flex gap-1 items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-white/20 text-xs">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
