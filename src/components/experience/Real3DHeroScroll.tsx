"use client";

import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "/behindbars";
const modelUrl = (name: string) => `${base}/models/${name}`;

const scenes = [
  { title: "Premium Menswear.\nRedefined.", copy: "A cinematic introduction to the collection.", model: "black-white-pent-shirts.glb", accent: "#C9A84C", cta: "Explore Collection", href: "/collections" },
  { title: "Black. White.\nNothing extra.", copy: "Clean contrast. Precise proportions.", model: "black-white-pent-shirts.glb", accent: "#F0E8D8", cta: "Shop Essentials", href: "/collections/tops" },
  { title: "Own the\nroom.", copy: "Dark tailoring. Material detail.", model: "wesker-body.glb", accent: "#D9B76C", cta: "View Signature", href: "/collections" },
  { title: "Find your\nnext look.", copy: "The collection awaits.", model: null, accent: "#C9A84C", cta: "Shop Collection", href: "/collections" },
] as const;

function Model({ path, progress }: { path: string | null; progress: number }) {
  const ref = useRef<THREE.Group>(null);
  const gltf = path ? useGLTF(modelUrl(path)) : null;
  const scene = useMemo(() => gltf?.scene.clone(true), [gltf]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y = THREE.MathUtils.damp(ref.current.rotation.y, (progress - 0.5) * 1.15, 3.5, delta);
    const scale = THREE.MathUtils.lerp(1, 1.22, progress);
    ref.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 1 - Math.pow(0.001, delta));
    ref.current.position.y = THREE.MathUtils.damp(ref.current.position.y, Math.sin(progress * Math.PI) * 0.12, 3, delta);
  });

  if (!scene) return null;
  return <group ref={ref}><primitive object={scene} /></group>;
}

function CameraRig({ progress }: { progress: number }) {
  useFrame(({ camera }, delta) => {
    const zoom = THREE.MathUtils.lerp(5.5, 3.55, progress);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, zoom, 3.2, delta);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, Math.sin(progress * Math.PI) * 0.8, 3, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, 0.25 + progress * 0.28, 3, delta);
    camera.lookAt(0, 1.05, 0);
  });
  return null;
}

export function Real3DHeroScroll() {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setScroll(Math.min(1, Math.max(0, window.scrollY / max)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const position = Math.min(scenes.length - 0.001, scroll * scenes.length);
  const index = Math.floor(position);
  const localProgress = position - index;
  const current = scenes[index];

  return (
    <section className="relative h-[400vh] bg-[#070707] text-white">
      <div className="sticky top-0 h-screen overflow-hidden">
        <Canvas camera={{ position: [0, 0.25, 5.5], fov: 35 }} dpr={[1, 1.7]}>
          <ambientLight intensity={0.6} />
          <spotLight position={[3, 5, 4]} intensity={9} angle={0.5} penumbra={0.9} color="#fff1d0" />
          <spotLight position={[-4, 2, 2]} intensity={5} color="#6e86a5" />
          <pointLight position={[0, 2, -2]} intensity={3.5} color={current.accent} />
          <Environment preset="studio" environmentIntensity={0.55} />
          <CameraRig progress={localProgress} />
          <Suspense fallback={null}>
            <Float speed={0.65} rotationIntensity={0.08} floatIntensity={0.1}>
              <Model path={current.model} progress={localProgress} />
            </Float>
          </Suspense>
        </Canvas>

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#070707f7_0%,#070707b5_32%,transparent_72%)]" />
        <div className="absolute left-6 top-1/2 z-10 max-w-xl -translate-y-1/2 md:left-12 lg:left-16">
          <p className="mb-5 text-[10px] uppercase tracking-[0.42em]" style={{ color: current.accent }}>BEHINDBARS / {String(index + 1).padStart(2, "0")}</p>
          <h1 className="whitespace-pre-line text-5xl font-light leading-[0.92] md:text-7xl lg:text-[6rem]">{current.title}</h1>
          <p className="mt-7 max-w-sm text-sm leading-7 text-white/50">{current.copy}</p>
          <Link href={current.href} className="pointer-events-auto mt-9 inline-flex border px-6 py-4 text-[10px] uppercase tracking-[0.25em] transition-transform hover:scale-105" style={{ borderColor: current.accent, color: current.accent }}>
            {current.cta} →
          </Link>
        </div>

        <div className="absolute bottom-7 left-6 text-[9px] uppercase tracking-[0.35em] text-white/40">Scroll to explore</div>
        <div className="absolute bottom-7 right-6 text-[9px] uppercase tracking-[0.35em] text-white/40">{String(index + 1).padStart(2, "0")} / {String(scenes.length).padStart(2, "0")}</div>
        <div className="absolute right-4 top-1/2 h-32 w-px -translate-y-1/2 bg-white/10"><div className="w-full bg-[#C9A84C] transition-all" style={{ height: `${scroll * 100}%` }} /></div>
      </div>
    </section>
  );
}

useGLTF.preload(modelUrl("black-white-pent-shirts.glb"));
useGLTF.preload(modelUrl("wesker-body.glb"));
