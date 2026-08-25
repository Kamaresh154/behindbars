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
      duration: 1.2,
      easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, // smooth cubic ease-in-out
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
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
