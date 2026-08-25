// src/lib/gsapConfig.ts
// Singleton GSAP plugin registration — import this ONCE in the root layout.
// Never import plugins individually in components to avoid duplicate registration.
"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { Observer } from "gsap/Observer";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, Flip, Observer);

  // Smooth default ease for brand feel
  gsap.defaults({ ease: "power3.out" });

  // Improve ScrollTrigger accuracy
  ScrollTrigger.config({ limitCallbacks: true });
}

export { gsap, ScrollTrigger, Flip, Observer };
