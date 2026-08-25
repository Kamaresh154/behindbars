// src/stores/useSceneStore.ts
// Controls the WebGL home-page scroll narrative state
import { create } from "zustand";

export type SceneId =
  | "brand-reveal"
  | "casual"
  | "formal"
  | "outerwear"
  | "activewear"
  | "loungewear"
  | "footwear"
  | "accessories"
  | "fabric-detail"
  | "cta";

interface SceneStore {
  activeScene: SceneId;
  scrollProgress: number; // 0–1 global scroll progress
  sceneProgress: number;  // 0–1 within current scene
  isReady: boolean;       // canvas loaded
  reducedMotion: boolean;

  setActiveScene: (scene: SceneId) => void;
  setScrollProgress: (p: number) => void;
  setSceneProgress: (p: number) => void;
  setReady: (v: boolean) => void;
  setReducedMotion: (v: boolean) => void;
}

export const useSceneStore = create<SceneStore>((set) => ({
  activeScene: "brand-reveal",
  scrollProgress: 0,
  sceneProgress: 0,
  isReady: false,
  reducedMotion: false,

  setActiveScene: (scene) => set({ activeScene: scene }),
  setScrollProgress: (p) => set({ scrollProgress: p }),
  setSceneProgress: (p) => set({ sceneProgress: p }),
  setReady: (v) => set({ isReady: v }),
  setReducedMotion: (v) => set({ reducedMotion: v }),
}));
