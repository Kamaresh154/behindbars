"use client";
// src/components/layout/Providers.tsx
// Wraps the app with all required client-side providers.

import { useEffect } from "react";
import { useSceneStore } from "@/stores/useSceneStore";
import { useLenisGSAP } from "@/hooks/useLenisGSAP";

// Import GSAP config to register plugins globally
import "@/lib/gsapConfig";

function MotionDetector() {
  const setReducedMotion = useSceneStore((s) => s.setReducedMotion);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [setReducedMotion]);
  return null;
}

function LenisProvider() {
  useLenisGSAP();
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MotionDetector />
      <LenisProvider />
      {children}
    </>
  );
}
