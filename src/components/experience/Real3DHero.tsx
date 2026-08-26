"use client";

import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const scenes = [
  { title: "Premium Menswear.\nRedefined.", copy: "A cinematic 3D introduction to the collection.", model: "/models/sport-outfit.glb", cta: "Explore Collection", href: "/collections", accent: "#C9A84C" },
  { title: "Move in\nconfidence.", copy: "Performance silhouettes, presented in motion.", model: "/models/sport-outfit.glb", cta: "Shop Active", href: "/collections/active-wear", accent: "#D2B46A" },
  { title: "Black. White.\nNothing extra.", copy: "Clean contrast. Precise proportions. No distractions.", model: "/models/black-white-pent-shirts.glb", cta: "Shop Essentials", href: "/collections/tops", accent: "#F0E8D8" },
  { title: "Tailored for\nthe occasion.", copy: "A formal silhouette with an editorial camera orbit.", model: "/models/formal-suit.glb", cta: "Shop Formal", href: "/collections/formals", accent: "#C9A84C" },
  { title: "Own the\nroom.", copy: "Dark tailoring. Material detail. A closer look.", model: "/models/wesker-body.glb", cta: "View Signature", href: "/collections", accent: "#D9B76C" },
  { title: "Find your\nnext look.", copy: "The cinematic experience resolves into the collection.", model: null, cta: "Shop the Collection", href: "/collections", accent: "#C9A84C" },
] as const;

function Garment({ path, progress }: { path: string; progress: number }) {
  const ref = useRef<THREE.Group>(null);
  const { scene } = useGLTF(path);
  const clone = useMemo(() => scene.clone(true), [scene]);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y = THREE.MathUtils.damp(ref.current.rotation.y, (progress - 0.5) * 0.9, 3, delta);
    ref.current.position.y = THREE.MathUtils.damp(ref.current.position.y, THREE.MathUtils.lerp(0, -0.25, progress), 3, delta);
    const s = THREE.MathUtils.lerp(1, 1.18, progress);
    ref.current.scale.lerp(new THREE.Vector3(s, s, s), 1 - Math.pow(0.001, delta));
  });
  return <group ref={ref}><primitive object={clone} /></group>;
}

function Fallback() {
  return <group><mesh position={[0, 1.65, 0]}><sphereGeometry args={[0.24, 24, 24]} /><meshStandardMaterial color="#b9a47a" /></mesh><mesh position={[0, 0.7, 0]}><capsuleGeometry args={[0.5, 1.25, 12, 24]} /><meshStandardMaterial color="#161616" roughness={0.3} /></mesh></group>;
}

function Model({ path, progress }: { path: string | null; progress: number }) {
  if (!path) return <Fallback />;
  return <Suspense fallback={<Fallback />}><Garment path={path} progress={progress} /></Suspense>;
}

export function Real3DHero() {
  const scroll = useRef(0);
  useEffect(() => {
    const update = () => { const max = Math.max(1, document.documentElement.scrollHeight - innerHeight); scroll.current = Math.min(1, Math.max(0, scrollY / max)); };
    update(); addEventListener("scroll", update, { passive: true }); addEventListener("resize", update);
    return () => { removeEventListener("scroll", update); removeEventListener("resize", update); };
  }, []);
  const Scene = () => {
    useFrame(({ camera }, delta) => {
      const raw = Math.min(scenes.length - 0.001, scroll.current * scenes.length);
      const index = Math.floor(raw); const progress = raw - index;
      const zoom = THREE.MathUtils.lerp(5.4, 3.7, progress);
      camera.position.x = THREE.MathUtils.damp(camera.position.x, Math.sin(progress * Math.PI) * 0.8, 3, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, zoom, 3, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, THREE.MathUtils.lerp(0.1, 0.5, progress), 3, delta);
      camera.lookAt(0, 1.15, 0);
    });
    const raw = Math.min(scenes.length - 0.001, scroll.current * scenes.length); const index = Math.floor(raw); const progress = raw - index; const scene = scenes[index];
    return <><ambientLight intensity={0.55} /><spotLight position={[3,5,4]} intensity={8} angle={0.5} penumbra={0.9} color="#f5e6c3" /><spotLight position={[-4,2,2]} intensity={5} color="#7892a6" /><pointLight position={[0,2,-2]} intensity={3} color={scene.accent} /><Environment preset="studio" environmentIntensity={0.5} /><Float speed={0.55} rotationIntensity={0.08} floatIntensity={0.12}><Model path={scene.model} progress={progress} /></Float></>;
  };
  const initial = scenes[0];
  return <div className="relative h-screen w-full overflow-hidden bg-[#070707] text-white"><Canvas camera={{ position: [0,0.2,5.4], fov: 35 }} dpr={[1,1.8]}><Scene /></Canvas><div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#070707f5_0%,#070707b8_30%,#07070715_70%,transparent_100%)]" /><div className="absolute left-6 top-1/2 z-10 -translate-y-1/2 lg:left-14"><p className="mb-5 text-[10px] uppercase tracking-[.42em]" style={{color:initial.accent}}>BEHINDBARS / 3D</p><h1 className="whitespace-pre-line font-display text-5xl font-light leading-[.92] md:text-7xl lg:text-[6rem]">{initial.title}</h1><p className="mt-7 max-w-sm text-sm leading-7 text-white/50">{initial.copy}</p><Link href={initial.href} className="pointer-events-auto mt-9 inline-flex border px-6 py-4 text-[10px] uppercase tracking-[.25em]" style={{borderColor:initial.accent,color:initial.accent}}>{initial.cta} →</Link></div><div className="absolute bottom-7 left-6 text-[9px] uppercase tracking-[.35em] text-white/40">Scroll to explore the 3D collection</div></div>;
}
