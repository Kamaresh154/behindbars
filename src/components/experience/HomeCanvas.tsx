"use client";
// src/components/experience/HomeCanvas.tsx
// Full-viewport WebGL canvas for the scroll-choreographed home page narrative.
// Renders 10 scenes tied to scroll position via GSAP ScrollTrigger + Lenis.
// NOTE: No <Environment> here — lighting is handled by SceneManager's
//       ambientLight / pointLight / directionalLight nodes so we have no
//       dependency on external HDR files.

import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
  PerspectiveCamera,
  AdaptiveDpr,
  AdaptiveEvents,
  Preload,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Vector2 } from "three";
import { SceneManager } from "./SceneManager";
import { CameraRig } from "./CameraRig";
import { useSceneStore } from "@/stores/useSceneStore";

export function HomeCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useSceneStore((s) => s.reducedMotion);

  // Graceful fallback for prefers-reduced-motion
  if (reducedMotion) {
    return (
      <div className="absolute inset-0 bg-obsidian">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero-static-fallback.jpg"
          alt="BehindBars Fabrics — premium men's fashion"
          className="w-full h-full object-cover opacity-60"
        />
      </div>
    );
  }

  return (
    <div ref={canvasRef} className="absolute inset-0 w-full h-full">
      <Canvas
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        dpr={[1, 2]}
        shadows="soft"
        frameloop="always"
        style={{ background: "#0A0A0A" }}
      >
        {/* Adaptive quality — drops DPR when framerate dips below 30fps */}
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />

        <Suspense fallback={null}>
          {/* Primary camera — CameraRig animates its position each frame */}
          <PerspectiveCamera makeDefault fov={45} near={0.1} far={100} />
          <CameraRig />

          {/* 10-scene scroll narrative + all manual lighting */}
          <SceneManager />

          {/* Post-processing: Bloom → Chromatic Aberration → Vignette */}
          <EffectComposer multisampling={4}>
            <Bloom
              intensity={0.4}
              luminanceThreshold={0.85}
              luminanceSmoothing={0.3}
              mipmapBlur
            />
            <ChromaticAberration
              blendFunction={BlendFunction.NORMAL}
              offset={new Vector2(0.0005, 0.0005)}
              radialModulation={false}
              modulationOffset={0}
            />
            <Vignette eskil={false} offset={0.15} darkness={0.7} />
          </EffectComposer>

          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
