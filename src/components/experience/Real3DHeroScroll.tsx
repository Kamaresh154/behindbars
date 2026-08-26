"use client";

import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "/behindbars";
const localAsset = (name: string) => `${base}/models/${name}`;
// MIT-licensed men's clothing viewer asset; source repository documents the model and license.
const externalFormal = "https://raw.githubusercontent.com/Siddu7077/3D-model/main/men_suit_short_pant.glb";

const looks = [
  { name: "The Essential", label: "01 / 05", model: localAsset("black-white-pent-shirts.glb"), title: "Precision in\nevery line.", copy: "A clean everyday silhouette built around contrast, proportion and restraint.", price: "₹4,990", accent: "#C9A84C" },
  { name: "The Formal", label: "02 / 05", model: externalFormal, title: "Tailored for\nthe entrance.", copy: "A formal menswear silhouette presented as a cinematic runway reveal.", price: "₹9,990", accent: "#D7C59A" },
  { name: "The Signature", label: "03 / 05", model: localAsset("wesker-body.glb"), title: "Own the\nroom.", copy: "A darker, sharper expression for evenings, entrances and everything after.", price: "₹8,990", accent: "#D9B76C" },
  { name: "The Evening", label: "04 / 05", model: externalFormal, title: "After dark,\nsharper.", copy: "The formal silhouette returns with a tighter camera pass and material-focused light.", price: "₹11,990", accent: "#C9A84C" },
  { name: "The Collection", label: "05 / 05", model: localAsset("black-white-pent-shirts.glb"), title: "Dress like\nyou mean it.", copy: "Discover the complete BehindBars menswear edit.", price: "From ₹4,990", accent: "#C9A84C" },
] as const;

type Look = (typeof looks)[number];

function Garment({ look, progress, pointer }: { look: Look; progress: number; pointer: { x: number; y: number } }) {
  const root = useRef<THREE.Group>(null);
  const { scene } = useGLTF(look.model);
  const clone = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    clone.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => { material.envMapIntensity = 1.35; });
      }
    });
  }, [clone]);

  useFrame((_, delta) => {
    if (!root.current) return;
    const e = progress * progress * (3 - 2 * progress);
    const scale = THREE.MathUtils.lerp(0.92, 1.12, e);
    root.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 1 - Math.pow(0.001, delta));
    root.current.position.y = THREE.MathUtils.damp(root.current.position.y, Math.sin(e * Math.PI) * 0.14, 3, delta);
    root.current.rotation.x = THREE.MathUtils.damp(root.current.rotation.x, -pointer.y * 0.025, 3, delta);
    root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, pointer.x * 0.07, 3, delta);
  });

  return <group ref={root}><primitive object={clone} /></group>;
}

function DroneCamera({ progress, lookIndex }: { progress: number; lookIndex: number }) {
  useFrame(({ camera }, delta) => {
    // Each section is a complete aerial-style 360° camera pass.
    const orbit = progress * Math.PI * 2;
    const radius = THREE.MathUtils.lerp(6.8, 4.0, Math.sin(progress * Math.PI));
    const height = 0.65 + Math.sin(progress * Math.PI * 2) * 0.85 + Math.sin(progress * Math.PI) * 0.5;
    const target = new THREE.Vector3(0, 0.85 + Math.sin(progress * Math.PI) * 0.15, 0);
    const desired = new THREE.Vector3(Math.sin(orbit) * radius, height, Math.cos(orbit) * radius);
    camera.position.lerp(desired, 1 - Math.pow(0.0008, delta));
    camera.lookAt(target);
    camera.fov = THREE.MathUtils.damp(camera.fov, 29 - Math.sin(progress * Math.PI) * 7, 2.5, delta);
    camera.updateProjectionMatrix();
  });
  return null;
}

function Stage({ look, progress, pointer, lookIndex }: { look: Look; progress: number; pointer: { x: number; y: number }; lookIndex: number }) {
  return <>
    <ambientLight intensity={0.38} />
    <spotLight castShadow position={[5, 7, 4]} intensity={12} angle={0.38} penumbra={0.9} color="#fff2d6" shadow-mapSize={[2048, 2048]} />
    <spotLight position={[-5, 3, 0]} intensity={6} angle={0.55} penumbra={1} color="#8397b5" />
    <pointLight position={[0, 3, -3]} intensity={5} color={look.accent} />
    <pointLight position={[0, -1, 3]} intensity={2} color="#ffffff" />
    <Environment preset="studio" environmentIntensity={0.7} />
    <DroneCamera progress={progress} lookIndex={lookIndex} />
    <Suspense fallback={null}><Garment look={look} progress={progress} pointer={pointer} /></Suspense>
  </>;
}

export function Real3DHeroScroll() {
  const [scroll, setScroll] = useState(0);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [selected, setSelected] = useState(0);
  const targetScroll = useRef(0);

  useEffect(() => {
    const onScroll = () => { targetScroll.current = Math.min(1, Math.max(0, window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight))); };
    const onPointer = (event: PointerEvent) => setPointer({ x: event.clientX / Math.max(1, innerWidth) * 2 - 1, y: event.clientY / Math.max(1, innerHeight) * 2 - 1 });
    let raf = 0;
    const tick = () => { setScroll((v) => v + (targetScroll.current - v) * 0.06); raf = requestAnimationFrame(tick); };
    onScroll(); tick(); addEventListener("scroll", onScroll, { passive: true }); addEventListener("pointermove", onPointer, { passive: true });
    return () => { cancelAnimationFrame(raf); removeEventListener("scroll", onScroll); removeEventListener("pointermove", onPointer); };
  }, []);

  const position = Math.min(looks.length - 0.001, scroll * looks.length);
  const index = Math.floor(position);
  const progress = position - index;
  const look = looks[selected];

  useEffect(() => { setSelected(Math.min(looks.length - 1, Math.round(position))); }, [position]);
  useEffect(() => { gsap.fromTo("[data-hero-copy]", { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power4.out" }); }, [selected]);

  return <section className="relative h-[900vh] bg-[#040404] text-white">
    <div className="sticky top-0 h-screen overflow-hidden">
      <Canvas shadows dpr={[1, 1.8]} camera={{ position: [0, 1, 6], fov: 29 }} gl={{ antialias: true, powerPreference: "high-performance" }}>
        <Stage look={look} progress={progress} pointer={pointer} lookIndex={selected} />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_65%_48%,rgba(201,168,76,.16),transparent_28%),linear-gradient(90deg,#040404f5_0%,#040404bd_34%,rgba(4,4,4,.08)_75%,transparent_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/70 to-transparent" />
      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between border-b border-white/10 px-6 py-6 md:px-12">
        <Link href="/" className="text-[11px] tracking-[0.42em]">BEHINDBARS</Link>
        <nav className="hidden gap-9 text-[9px] uppercase tracking-[0.3em] text-white/55 md:flex"><Link href="/collections">Collection</Link><Link href="/collections/tops">Shirts</Link><Link href="/collections/bottoms">Trousers</Link></nav>
        <span className="text-[9px] uppercase tracking-[0.28em] text-white/40">Men&apos;s / 2026</span>
      </header>
      <div data-hero-copy className="absolute left-6 top-1/2 z-10 max-w-[520px] -translate-y-1/2 md:left-12 lg:left-[7vw]">
        <p className="mb-6 text-[9px] uppercase tracking-[0.5em]" style={{ color: look.accent }}>BEHINDBARS / {look.label}</p>
        <h1 className="whitespace-pre-line font-display text-[clamp(4rem,8vw,8rem)] font-light leading-[0.86] tracking-[-0.03em]">{look.title}</h1>
        <p className="mt-8 max-w-[370px] text-sm leading-7 text-white/50">{look.copy}</p>
        <div className="mt-8 flex items-center gap-5"><span className="text-lg tracking-wide">{look.price}</span><Link href="/collections" className="pointer-events-auto inline-flex items-center gap-3 border px-6 py-4 text-[9px] uppercase tracking-[0.28em] transition-all hover:bg-white hover:text-black" style={{ borderColor: look.accent, color: look.accent }}>Shop the look <span>→</span></Link></div>
      </div>
      <div className="absolute bottom-8 left-6 z-10 flex items-center gap-4 text-[9px] uppercase tracking-[0.35em] text-white/40 md:left-12"><span className="h-px w-12 bg-white/30" />Scroll / 360° orbit</div>
      <div className="absolute bottom-8 right-6 z-10 text-right md:right-12"><div className="text-[9px] uppercase tracking-[0.35em] text-white/35">Look {String(selected + 1).padStart(2, "0")} / {String(looks.length).padStart(2, "0")}</div><div className="mt-3 h-px w-28 bg-white/10"><div className="h-full bg-[#C9A84C] transition-[width]" style={{ width: `${((selected + 1) / looks.length) * 100}%` }} /></div></div>
      <div className="absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-2 md:flex">{looks.map((item, i) => <button key={item.name} aria-label={`View ${item.name}`} onClick={() => setSelected(i)} className={`pointer-events-auto h-8 w-1 transition-all ${i === selected ? "bg-[#C9A84C]" : "bg-white/15 hover:bg-white/40"} `} />)}</div>
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-28 w-96 -translate-x-1/2 bg-[radial-gradient(ellipse,rgba(201,168,76,.2),transparent_70%)] blur-2xl" />
    </div>
  </section>;
}

useGLTF.preload(localAsset("black-white-pent-shirts.glb"));
useGLTF.preload(localAsset("wesker-body.glb"));
useGLTF.preload(externalFormal);
