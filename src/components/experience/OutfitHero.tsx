"use client";
// src/components/experience/OutfitHero.tsx
// Scroll-driven fashion hero — pure CSS/React, no WebGL dependency.
// Reads scrollProgress from Lenis (via useSceneStore) and drives
// scene changes + smooth fade/slide transitions entirely in CSS.

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSceneStore, SceneId } from "@/stores/useSceneStore";

// ── Scene data ─────────────────────────────────────────────────────────────
interface Scene {
  id: SceneId;
  label: string;
  sub: string;
  tagline: string;
  accent: string;
  bg: string;
  image?: string;
  objectPosition?: string;
  cta?: { label: string; href: string };
  entrance: "top" | "bottom" | "left" | "right" | "scale";
}

const SCENES: Scene[] = [
  {
    id: "brand-reveal",
    label: "Behind",
    sub: "Bars",
    tagline: "Premium Menswear. Redefined.",
    accent: "#C9A84C",
    bg: "#0A0A0A",
    entrance: "scale",
    cta: { label: "Explore Collection", href: "/collections" },
  },
  {
    id: "casual",
    label: "Casual",
    sub: "Tops",
    tagline: "Relaxed. Refined. Ready.",
    accent: "#A0C4D8",
    bg: "#060e12",
    image: "/images/outfits/casual.jpg",
    objectPosition: "50% 15%",
    entrance: "bottom",
    cta: { label: "Shop Casuals", href: "/collections/tops" },
  },
  {
    id: "formal",
    label: "Formal",
    sub: "Shirts",
    tagline: "Dress like you mean it.",
    accent: "#E8E0D0",
    bg: "#0d0d0d",
    image: "/images/outfits/formal.jpg",
    objectPosition: "50% 12%",
    entrance: "top",
    cta: { label: "Shop Formals", href: "/collections/formals" },
  },
  {
    id: "outerwear",
    label: "Outer",
    sub: "Wear",
    tagline: "Layer up. Stand out.",
    accent: "#C8A06A",
    bg: "#0c0701",
    image: "/images/outfits/outerwear.jpg",
    objectPosition: "50% 10%",
    entrance: "right",
    cta: { label: "Shop Jackets", href: "/collections/outer-wear" },
  },
  {
    id: "activewear",
    label: "Active",
    sub: "Wear",
    tagline: "Move without limits.",
    accent: "#00D4AA",
    bg: "#001008",
    image: "/images/outfits/activewear.jpg",
    objectPosition: "50% 12%",
    entrance: "left",
    cta: { label: "Shop Active", href: "/collections/active-wear" },
  },
  {
    id: "loungewear",
    label: "Lounge",
    sub: "Wear",
    tagline: "Comfort is luxury.",
    accent: "#C890D8",
    bg: "#0d0514",
    image: "/images/outfits/loungewear.jpg",
    objectPosition: "50% 10%",
    entrance: "bottom",
    cta: { label: "Shop Lounge", href: "/collections/lounge-wear" },
  },
  {
    id: "footwear",
    label: "Foot",
    sub: "Wear",
    tagline: "Every step, elevated.",
    accent: "#B8905A",
    bg: "#0d0803",
    image: "/images/outfits/footwear.jpg",
    objectPosition: "50% 8%",
    entrance: "top",
    cta: { label: "Shop Footwear", href: "/collections/footwear" },
  },
  {
    id: "accessories",
    label: "Acces-",
    sub: "sories",
    tagline: "Details that define you.",
    accent: "#E8C96A",
    bg: "#0d0c00",
    image: "/images/outfits/accessories.jpg",
    objectPosition: "50% 8%",
    entrance: "scale",
    cta: { label: "Shop Accessories", href: "/collections/accessories" },
  },
  {
    id: "fabric-detail",
    label: "Fabric",
    sub: "Detail",
    tagline: "Feel the weave. Own the texture.",
    accent: "#C9A84C",
    bg: "#0d0a04",
    image: "/images/outfits/suit.jpg",
    objectPosition: "50% 8%",
    entrance: "right",
  },
  {
    id: "cta",
    label: "The",
    sub: "Collection",
    tagline: "Nine categories. Zero compromise.",
    accent: "#C9A84C",
    bg: "#110e00",
    entrance: "scale",
    cta: { label: "Shop All", href: "/collections" },
  },
];

const SCENE_IDS = SCENES.map((s) => s.id);

// Collage images for scene 0
const COLLAGE = [
  { src: "/images/outfits/casual.jpg",      pos: "50% 15%", label: "Casual"     },
  { src: "/images/outfits/formal.jpg",      pos: "50% 12%", label: "Formal"     },
  { src: "/images/outfits/outerwear.jpg",   pos: "50% 10%", label: "Outer Wear" },
  { src: "/images/outfits/activewear.jpg",  pos: "50% 12%", label: "Active"     },
  { src: "/images/outfits/loungewear.jpg",  pos: "50% 10%", label: "Lounge"     },
  { src: "/images/outfits/footwear.jpg",    pos: "50%  8%", label: "Footwear"   },
  { src: "/images/outfits/accessories.jpg", pos: "50%  8%", label: "Access."    },
  { src: "/images/outfits/suit.jpg",        pos: "50%  8%", label: "Signature"  },
];

// ── Scroll → Scene driver (pure JS, no Three.js) ───────────────────────────
function useScrollScenes() {
  const scrollProgress  = useSceneStore((s) => s.scrollProgress);
  const setActiveScene  = useSceneStore((s) => s.setActiveScene);
  const setSceneProgress = useSceneStore((s) => s.setSceneProgress);

  useEffect(() => {
    const total   = SCENE_IDS.length;          // 10
    const raw     = scrollProgress * total;    // 0–10
    const idx     = Math.min(Math.floor(raw), total - 1);
    const within  = raw - idx;                 // 0–1 within scene
    setActiveScene(SCENE_IDS[idx] as SceneId);
    setSceneProgress(within);
  }, [scrollProgress, setActiveScene, setSceneProgress]);
}

// ── Collage (scene 0) ────────────────────────────────────────────────────
function BrandCollage() {
  return (
    <div className="oh2-collage">
      {COLLAGE.map((img, i) => (
        <div key={i} className="oh2-collage-cell" style={{ animationDelay: `${i * 0.07}s` }}>
          <Image src={img.src} alt={img.label} fill
            className="oh2-collage-img"
            style={{ objectFit: "cover", objectPosition: img.pos }}
          />
          <div className="oh2-collage-veil" />
          <span className="oh2-collage-label">{img.label}</span>
        </div>
      ))}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export function OutfitHero() {
  // Drive scene changes from scroll — pure JS, no WebGL
  useScrollScenes();

  const activeScene = useSceneStore((s) => s.activeScene);
  const idx         = Math.max(0, SCENE_IDS.indexOf(activeScene));
  const prevIdxRef  = useRef(idx);
  const [prevIdx, setPrevIdx] = useState(idx);
  const [key, setKey]         = useState(0);     // forces text re-animation

  useEffect(() => {
    if (prevIdxRef.current !== idx) {
      setPrevIdx(prevIdxRef.current);
      prevIdxRef.current = idx;
      setKey((k) => k + 1);
    }
  }, [idx]);

  const scene  = SCENES[idx];
  const isFirst = idx === 0;
  const isLast  = idx === 9;

  return (
    <div className="oh2-root">

      {/* ── All scene backgrounds ───────────────────────── */}
      {SCENES.map((s, i) => {
        const state =
          i === idx     ? "active" :
          i === prevIdx ? "prev"   : "hidden";

        return (
          <div
            key={s.id}
            className={`oh2-scene oh2-scene--${state}`}
            style={{ backgroundColor: s.bg }}
          >
            {/* Collage for scene 0, real photo for rest */}
            {i === 0 ? (
              <>
                <BrandCollage />
                <div className="oh2-grade"
                  style={{ background: "linear-gradient(105deg,#0A0A0A 0%,#0A0A0A 20%,rgba(10,10,10,0.65) 42%,transparent 65%)" }} />
              </>
            ) : s.image ? (
              <>
                <Image
                  src={s.image}
                  alt={`${s.label} ${s.sub}`}
                  fill
                  priority={i === idx}
                  className={`oh2-photo ${state === "active" ? "oh2-photo--active" : ""}`}
                  style={{ objectFit: "cover", objectPosition: s.objectPosition ?? "50% 10%" }}
                />
                <div className="oh2-grade"
                  style={{ background: "linear-gradient(105deg,#0A0A0A 0%,#0A0A0A 26%,rgba(10,10,10,0.72) 50%,transparent 72%)" }} />
                <div className="oh2-glow"
                  style={{ background: `radial-gradient(ellipse 55% 70% at 75% 50%,${s.accent}1a 0%,transparent 70%)` }} />
              </>
            ) : (
              <div style={{ position:"absolute", inset:0, background: s.bg }} />
            )}
          </div>
        );
      })}

      {/* ── Text panel ─────────────────────────────────── */}
      {!isLast && (
        <div className="oh2-text" key={`text-${key}`}>
          <span className="oh2-counter">
            {String(idx + 1).padStart(2, "0")}
            <span className="oh2-counter-of"> / {SCENES.length}</span>
          </span>

          <div className="oh2-title-block">
            <div className="oh2-title-clip">
              <h2 className="oh2-title-line">{scene.label}</h2>
            </div>
            <div className="oh2-title-clip oh2-title-clip-d2">
              <h2 className="oh2-title-line oh2-title-italic" style={{ color: scene.accent }}>
                {scene.sub}
              </h2>
            </div>
          </div>

          <p className="oh2-tagline">{scene.tagline}</p>

          {scene.cta && (
            <div className="oh2-cta-wrap pointer-events-auto">
              <Link href={scene.cta.href} className="oh2-cta"
                style={{ "--cta-accent": scene.accent } as React.CSSProperties}>
                <span>{scene.cta.label}</span>
                <span className="oh2-arrow">&#8594;</span>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* ── Final CTA ──────────────────────────────────── */}
      {isLast && (
        <div className="oh2-final pointer-events-auto" key="final">
          <p className="oh2-final-eyebrow">The Full Range</p>
          <h1 className="oh2-final-title">
            The Collection<br />
            <em style={{ color: scene.accent }}>Awaits.</em>
          </h1>
          <div className="oh2-final-btns">
            <Link href="/collections" className="oh2-final-btn-primary">Shop All Categories</Link>
            <Link href="/collections/tops" className="oh2-final-btn-outline">Explore Tops</Link>
          </div>
        </div>
      )}

      {/* ── Dot nav ─────────────────────────────────────── */}
      <div className="oh2-dots">
        {SCENES.map((_, i) => (
          <div key={i}
            className={`oh2-dot ${i === idx ? "oh2-dot-active" : i < idx ? "oh2-dot-done" : ""}`}
            style={i === idx ? { background: scene.accent } : {}}
          />
        ))}
      </div>

      {/* ── Bottom label strip ─────────────────────────── */}
      {!isFirst && !isLast && (
        <div className="oh2-label-strip" key={`label-${key}`}>
          <span className="oh2-label-line" style={{ background: scene.accent }} />
          <span className="oh2-label-text">{scene.label} {scene.sub}</span>
        </div>
      )}

      {/* ── Scroll hint — first scene only ─────────────── */}
      {isFirst && (
        <div className="oh2-scroll-hint">
          <div className="oh2-scroll-bar" />
          <p className="oh2-scroll-txt">Scroll</p>
        </div>
      )}
    </div>
  );
}