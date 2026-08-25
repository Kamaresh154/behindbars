"use client";
// src/components/experience/SceneManager.tsx
// Orchestrates all 10 scroll scenes. Maps global scrollProgress (0-1)
// to scene boundaries and animates scene-level uniforms / camera positions.

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { gsap } from "@/lib/gsapConfig";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSceneStore, SceneId } from "@/stores/useSceneStore";
import { FabricMesh } from "./FabricMesh";
import { Group } from "three";

// Each scene occupies an equal 10% of total scroll height
const SCENES: { id: SceneId; label: string }[] = [
  { id: "brand-reveal",  label: "Brand Reveal"   },
  { id: "casual",        label: "Casual"          },
  { id: "formal",        label: "Formal"          },
  { id: "outerwear",     label: "Outer Wear"      },
  { id: "activewear",    label: "Active Wear"     },
  { id: "loungewear",    label: "Lounge Wear"     },
  { id: "footwear",      label: "Footwear"        },
  { id: "accessories",   label: "Accessories"     },
  { id: "fabric-detail", label: "Fabric Detail"   },
  { id: "cta",           label: "Shop Now"        },
];

// Camera waypoints for each scene [x, y, z, lookAtX, lookAtY, lookAtZ]
const CAMERA_WAYPOINTS: [number, number, number, number, number, number][] = [
  [0,    1.5, 5,    0,   0,   0  ],  // brand-reveal  — straight on
  [1.2,  1.2, 4.5, 0,   0.8, 0  ],  // casual        — arc right
  [0,    1.5, 3.8, 0,   1.2, 0  ],  // formal        — push in to collar
  [-1,   1,   4,   0,   0.5, 0  ],  // outerwear     — left side
  [0,    0.8, 5.5, 0,   0.5, 0  ],  // activewear    — wider tracking
  [0.5,  1.8, 4,   0,   1,   0  ],  // loungewear    — warm high angle
  [0,    0.2, 3,   0,   0.2, 0  ],  // footwear      — floor level
  [0.3,  2.2, 3.5, 0,   1.5, 0  ],  // accessories   — table top
  [0,    0.8, 1.8, 0,   0.6, 0  ],  // fabric-detail — macro
  [0,    1.2, 6,   0,   0.8, 0  ],  // cta           — wide establishing
];

export function SceneManager() {
  const groupRef = useRef<Group>(null);
  const { camera } = useThree();
  const scrollProgress = useSceneStore((s) => s.scrollProgress);
  const setActiveScene = useSceneStore((s) => s.setActiveScene);
  const setSceneProgress = useSceneStore((s) => s.setSceneProgress);

  useFrame(() => {
    // Determine active scene from global scroll progress
    const sceneIndex = Math.min(
      Math.floor(scrollProgress * SCENES.length),
      SCENES.length - 1
    );
    const sceneLocal = (scrollProgress * SCENES.length) % 1;

    setActiveScene(SCENES[sceneIndex].id);
    setSceneProgress(sceneLocal);

    // Lerp camera position to current waypoint
    const wp = CAMERA_WAYPOINTS[sceneIndex];
    const nextWp = CAMERA_WAYPOINTS[Math.min(sceneIndex + 1, SCENES.length - 1)];

    // Smooth interpolation between waypoints - even speed (was 0.04 lag causing slow/fast)
    const t = sceneLocal;
    camera.position.x += ([wp[0] + (nextWp[0] - wp[0]) * t][0] - camera.position.x) * 0.08;
    camera.position.y += ([wp[1] + (nextWp[1] - wp[1]) * t][0] - camera.position.y) * 0.08;
    camera.position.z += ([wp[2] + (nextWp[2] - wp[2]) * t][0] - camera.position.z) * 0.08;

    // Camera look-at
    const lx = wp[3] + (nextWp[3] - wp[3]) * t;
    const ly = wp[4] + (nextWp[4] - wp[4]) * t;
    const lz = wp[5] + (nextWp[5] - wp[5]) * t;
    camera.lookAt(lx, ly, lz);
  });

  return (
    <group ref={groupRef}>
      {/* Central fabric drape — primary hero object across all scenes */}
      <FabricMesh
        position={[0, 0.5, 0]}
        scale={[2.2, 3.5, 1]}
        scrollProgress={scrollProgress}
      />

      {/* Ambient point lights — positioned for depth */}
      <ambientLight intensity={0.15} color="#c9a84c" />
      <pointLight position={[3, 4, 3]}  intensity={1.2} color="#fff8f0" castShadow />
      <pointLight position={[-3, 2, 2]} intensity={0.6} color="#c9a84c" />
      <pointLight position={[0, -1, 3]} intensity={0.3} color="#1a1a2e" />

      {/* Scene-specific accent lights */}
      <directionalLight
        position={[0, 8, 5]}
        intensity={0.8}
        color="#ffffff"
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
    </group>
  );
}
