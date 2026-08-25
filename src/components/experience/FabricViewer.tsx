"use client";
// src/components/experience/FabricViewer.tsx
// Product Detail Page 3D interactive viewer.
// Orbit, pinch-zoom to weave level, drape preset, colourway + lighting switcher.
// NOTE: No <Environment> — uses manual three-point lighting rigs per preset
//       to avoid any HDR file dependency.

import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  ContactShadows,
  Center,
  useGLTF,
  AdaptiveDpr,
} from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { FabricMesh } from "./FabricMesh";

// ── Lighting rigs per mood ────────────────────────────────────────────────────
// Each rig is a three-point light setup (key + fill + rim) tuned to the mood.

interface LightRig {
  ambient:     { intensity: number; color: string };
  key:         { position: [number,number,number]; intensity: number; color: string };
  fill:        { position: [number,number,number]; intensity: number; color: string };
  rim:         { position: [number,number,number]; intensity: number; color: string };
}

const LIGHT_RIGS: LightRig[] = [
  // 0 — Daylight (cool, bright)
  {
    ambient: { intensity: 0.35, color: "#e8f0ff" },
    key:     { position: [4, 6, 4],   intensity: 2.2, color: "#fff8f0" },
    fill:    { position: [-3, 2, 3],  intensity: 0.6, color: "#ddeeff" },
    rim:     { position: [0, -2, -4], intensity: 0.4, color: "#aaccff" },
  },
  // 1 — Indoor (neutral, soft)
  {
    ambient: { intensity: 0.5,  color: "#fffaf0" },
    key:     { position: [2, 5, 2],   intensity: 1.4, color: "#fff5e0" },
    fill:    { position: [-2, 1, 4],  intensity: 0.7, color: "#ffe8c8" },
    rim:     { position: [1, -1, -3], intensity: 0.3, color: "#ffddaa" },
  },
  // 2 — Warm (golden hour / candlelight)
  {
    ambient: { intensity: 0.25, color: "#3a1a00" },
    key:     { position: [3, 4, 2],   intensity: 1.8, color: "#ffa040" },
    fill:    { position: [-2, 1, 3],  intensity: 0.5, color: "#c9a84c" },
    rim:     { position: [0, -1, -3], intensity: 0.6, color: "#ff6010" },
  },
];

const PRESET_META = [
  { id: 0, label: "Daylight", icon: "☀️" },
  { id: 1, label: "Indoor",   icon: "💡" },
  { id: 2, label: "Warm",     icon: "🕯️" },
] as const;

interface FabricViewerProps {
  productSlug: string;
  gltfUrl?: string;
  colours: { name: string; hex: string; inStock: boolean }[];
  onColourChange?: (hex: string) => void;
}

export function FabricViewer({
  productSlug: _productSlug,
  gltfUrl,
  colours,
  onColourChange,
}: FabricViewerProps) {
  const [selectedColour, setSelectedColour] = useState(colours[0]?.hex ?? "#c9a84c");
  const [lightPreset, setLightPreset]       = useState<0 | 1 | 2>(0);
  const [isDrapeMode, setIsDrapeMode]       = useState(false);

  const rig = LIGHT_RIGS[lightPreset];

  const handleColour = (hex: string) => {
    setSelectedColour(hex);
    onColourChange?.(hex);
  };

  return (
    <div className="relative w-full aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden bg-obsidian border border-white/5">
      {/* 3D Canvas */}
      <Canvas
        dpr={[1, 2]}
        shadows
        camera={{ position: [0, 0.5, 3.5], fov: 42 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: "#0A0A0A" }}
      >
        <AdaptiveDpr pixelated />
        <Suspense fallback={null}>
          {/* ── Manual three-point lighting (no HDRI needed) ── */}
          <ambientLight
            intensity={rig.ambient.intensity}
            color={rig.ambient.color}
          />
          <directionalLight
            position={rig.key.position}
            intensity={rig.key.intensity}
            color={rig.key.color}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <pointLight
            position={rig.fill.position}
            intensity={rig.fill.intensity}
            color={rig.fill.color}
          />
          <pointLight
            position={rig.rim.position}
            intensity={rig.rim.intensity}
            color={rig.rim.color}
          />

          <Center>
            {gltfUrl ? (
              <GltfModel url={gltfUrl} colourHex={selectedColour} />
            ) : (
              <FabricMesh
                scale={isDrapeMode ? [1.8, 2.8, 1] : [2, 1.5, 1]}
                scrollProgress={1}
                colourHex={selectedColour}
                lightPreset={lightPreset}
                position={[0, isDrapeMode ? 0.5 : 0, 0]}
              />
            )}
          </Center>

          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={0.4}
            scale={6}
            blur={2.5}
            far={3}
          />

          <OrbitControls
            enablePan={false}
            enableDamping
            dampingFactor={0.08}
            minDistance={1.2}
            maxDistance={8}
            maxPolarAngle={Math.PI * 0.85}
            autoRotate={false}
          />

          <EffectComposer>
            <Bloom intensity={0.2} luminanceThreshold={0.9} mipmapBlur />
            <Vignette offset={0.2} darkness={0.5} />
          </EffectComposer>
        </Suspense>
      </Canvas>

      {/* Viewer UI Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        {/* Colourway switcher */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {colours.map((c) => (
            <button
              key={c.hex}
              onClick={() => handleColour(c.hex)}
              disabled={!c.inStock}
              title={c.name}
              className={`w-7 h-7 rounded-full border-2 transition-all duration-200 ${
                selectedColour === c.hex
                  ? "border-bar-gold scale-110 shadow-lg shadow-bar-gold/40"
                  : "border-white/20 hover:border-white/60"
              } ${!c.inStock ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>

        {/* Controls row */}
        <div className="flex items-center justify-between gap-3">
          {/* Lighting presets */}
          <div className="flex gap-1">
            {PRESET_META.map((p) => (
              <button
                key={p.id}
                onClick={() => setLightPreset(p.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  lightPreset === p.id
                    ? "bg-bar-gold text-obsidian"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {p.icon} {p.label}
              </button>
            ))}
          </div>

          {/* Drape toggle */}
          <button
            onClick={() => setIsDrapeMode((d) => !d)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              isDrapeMode
                ? "bg-bar-gold text-obsidian"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {isDrapeMode ? "📐 Drape" : "📐 Flat"}
          </button>
        </div>

        <p className="text-white/40 text-xs mt-2">
          Drag to rotate · Scroll to zoom · Tap coloured dots to switch colourway
        </p>
      </div>
    </div>
  );
}

// Sub-component for loaded glTF models
function GltfModel({ url, colourHex: _colourHex }: { url: string; colourHex: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}
