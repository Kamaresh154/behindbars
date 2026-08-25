// src/hooks/useLenisGSAP.ts
// Syncs Lenis smooth-scroll with GSAP's ticker for perfectly timed animations.
"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "@/lib/gsapConfig";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSceneStore } from "@/stores/useSceneStore";

export function useLenisGSAP() {
  const lenisRef = useRef<Lenis | null>(null);
  const setScrollProgress = useSceneStore((s) => s.setScrollProgress);
  const reducedMotion = useSceneStore((s) => s.reducedMotion);

  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({
      duration: 1.0, // even speed: reduced from 1.2 for consistent scrub
      easing: (t) => t, // linear easing for even speed (was easeInOut cubic causing slow/fast)
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.85, // tuned for even distance per wheel tick
      touchMultiplier: 1.4,
    });

    lenisRef.current = lenis;

    // Sync Lenis scroll position to GSAP ticker
    const ticker = gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Feed Lenis scroll events to ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);
    lenis.on("scroll", ({ progress }: { progress: number }) => {
      setScrollProgress(progress);
    });

    // Tell ScrollTrigger to use Lenis for scroll queries
    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (value !== undefined) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    ScrollTrigger.addEventListener("refresh", () => lenis.resize());
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(ticker);
      lenis.destroy();
      ScrollTrigger.removeEventListener("refresh", () => lenis.resize());
    };
  }, [reducedMotion, setScrollProgress]);

  return lenisRef;
}
