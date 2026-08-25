"use client";
// src/components/experience/CameraRig.tsx
// Smooth camera rig driven by scroll progress and mouse parallax.

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useSceneStore } from "@/stores/useSceneStore";

export function CameraRig() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const scrollProgress = useSceneStore((s) => s.scrollProgress);

  // Subtle mouse parallax
  if (typeof window !== "undefined") {
    window.addEventListener(
      "mousemove",
      (e) => {
        mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
        mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
      },
      { passive: true }
    );
  }

  useFrame(() => {
    // Mouse parallax offset (subtle ±0.15 units)
    const targetX = mouse.current.x * 0.15;
    const targetY = -mouse.current.y * 0.08;

    camera.position.x += (targetX - camera.position.x) * 0.03;
    camera.position.y += (targetY + 1.2 - camera.position.y) * 0.03;

    // Roll slight camera tilt for cinematic feel at scene transitions
    const sceneIndex = Math.floor(scrollProgress * 10);
    const targetRoll = sceneIndex % 2 === 0 ? 0 : 0.015;
    (camera as any).rotation.z += (targetRoll - (camera as any).rotation.z) * 0.02;
  });

  return null;
}
