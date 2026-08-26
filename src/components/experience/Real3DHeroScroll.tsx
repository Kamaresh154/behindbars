"use client";

import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "/behindbars";
const asset = (name: string) => `${base}/models/${name}`;

const looks = [
  { name: "The Essential", label: "01 / 04", model: "black-white-pent-shirts.glb", title: "Precision in\nevery line.", copy: "A clean everyday silhouette built around contrast, proportion and restraint.", price: "₹4,990", accent: "#C9A84C" },
  { name: "The Contrast", label: "02 / 04", model: "black-white-pent-shirts.glb", title: "Black. White.\nNothing extra.", copy: "Minimal pieces designed to work together without asking for attention.", price: "₹5,490", accent: "#E7DCC5" },
  { name: "The Signature", label: "03 / 04", model: "wesker-body.glb", title: "Own the\nroom.", copy: "A darker, sharper expression for evenings, entrances and everything after.", price: "₹8,990", accent: "#D9B76C" },
  { name: "The Collection", label: "04 / 04", model: "wesker-body.glb", title: "Dress like\nyou mean it.", copy: "Discover the complete BehindBars menswear edit.", price: "From ₹4,990", accent: "#C9A84C" },
] as const;

type Look = (typeof looks)[number];

type GarmentProps = { look: Look; progress: number; pointer: { x: number; y: number }; active: boolean };

function Garment({ look, progress, pointer, active }: GarmentProps) {
  const root = useRef<THREE.Group>(null);
  const { scene } = useGLTF(asset(look.model));
  const clone = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    clone.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => {
          material.envMapIntensity = 1.15;
        });
      }
    });
  }, [clone]);

  useFrame((_, delta) => {
    if (!root.current) return;
    const eased = progress * progress * (3 - 2 * progress);
    const targetY = Math.sin(eased * Math.PI) * 0.08;
    const targetRot = active ? pointer.x * 0.16 + (eased - 0.5) * 0.18 : pointer.x * 0.08;
    const targetX = active ? pointer.x * 0.12 : (1 - eased) * 0.35;
    const targetScale = active ? 1.04 + eased * 0.16 : 0.88 + eased * 0.12;

    root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, targetRot, 3.5, delta);
    root.current.rotation.x = THREE.MathUtils.damp(root.current.rotation.x, -pointer.y * 0.035, 3.5, delta);
    root.current.position.x = THREE.MathUtils.damp(root.current.position.x, targetX, 3.8, delta);
    root.current.position.y = THREE.MathUtils.damp(root.current.position.y, targetY, 3.5, delta);
    const scale = THREE.MathUtils.damp(root.current.scale.x, targetScale, 3.2, delta);
    root.current.scale.setScalar(scale);
  });

  return <group ref={root} visible={active}><primitive object={clone} /></group>;
}

function Stage({ look, progress, pointer, onDrag }: { look: Look; progress: number; pointer: { x: number; y: number }; onDrag: (v: number) => void }) {
  const controls = useRef<any>(null);
  useFrame(() => {
    if (!controls.current) return;
    controls.current.autoRotate = true;
    controls.current.autoRotateSpeed = 0.35;
  });
  return (
    <>
      <ambientLight intensity={0.45} />
      <spotLight castShadow position={[4, 6, 4]} intensity={10} angle={0.45} penumbra={0.85} color="#fff1d2" shadow-mapSize={[1024, 1024]} />
      <spotLight position={[-4, 3, 1]} intensity={5} angle={0.65} penumbra={1} color="#8b9db7" />
      <pointLight position={[1, 2, -3]} intensity={4} color={look.accent} />
      <Environment preset="studio" environmentIntensity={0.65} />
      <group position={[0, -1.1, 0]}>
        <Suspense fallback={null}>
          <Garment look={look} progress={progress} pointer={pointer} active />
        </Suspense>
      </group>
      <OrbitControls ref={controls} enablePan={false} minDistance={3.2} maxDistance={6.4} minPolarAngle={Math.PI * 0.38} maxPolarAngle={Math.PI * 0.62} dampingFactor={0.06} enableDamping onChange={(event) => { if (event?.target) onDrag(event.target.getAzimuthalAngle?.() ?? 0); }} />
    </>
  );
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
    const tick = () => { setScroll((value) => value + (targetScroll.current - value) * 0.075); raf = requestAnimationFrame(tick); };
    onScroll(); tick();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("pointermove", onPointer, { passive: true });
    return () => { cancelAnimationFrame(raf); removeEventListener("scroll", onScroll); removeEventListener("pointermove", onPointer); };
  }, []);

  const position = Math.min(looks.length - 0.001, scroll * looks.length);
  const index = Math.floor(position);
  const progress = position - index;
  const look = looks[selected];

  useEffect(() => {
    const next = Math.min(looks.length - 1, Math.round(position));
    setSelected(next);
  }, [position]);

  useEffect(() => {
    gsap.fromTo("[data-hero-copy]", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, ease: "power3.out" });
  }, [selected]);

  return (
    <section className="relative h-[700vh] bg-[#050505] text-white">
      <div className="sticky top-0 h-screen overflow-hidden">
        <Canvas shadows dpr={[1, 1.8]} camera={{ position: [0, 0.1, 5.2], fov: 30 }} gl={{ antialias: true, powerPreference: "high-performance" }}>
          <Stage look={look} progress={progress} pointer={pointer} onDrag={() => undefined} />
        </Canvas>

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_68%_45%,rgba(201,168,76,.12),transparent_32%),linear-gradient(90deg,#050505f5_0%,#050505bd_34%,rgba(5,5,5,.18)_72%,transparent_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />

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

        <div className="absolute bottom-8 left-6 z-10 flex items-center gap-4 text-[9px] uppercase tracking-[0.35em] text-white/40 md:left-12"><span className="h-px w-12 bg-white/30" />Drag / Scroll</div>
        <div className="absolute bottom-8 right-6 z-10 text-right md:right-12"><div className="text-[9px] uppercase tracking-[0.35em] text-white/35">Look {String(selected + 1).padStart(2, "0")} / {String(looks.length).padStart(2, "0")}</div><div className="mt-3 h-px w-28 bg-white/10"><div className="h-full bg-[#C9A84C] transition-[width]" style={{ width: `${((selected + 1) / looks.length) * 100}%` }} /></div></div>

        <div className="absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-2 md:flex">{looks.map((item, i) => <button key={item.name} aria-label={`View ${item.name}`} onClick={() => setSelected(i)} className={`pointer-events-auto h-8 w-1 transition-all ${i === selected ? "bg-[#C9A84C]" : "bg-white/15 hover:bg-white/40"}`} />)}</div>

        <div className="pointer-events-none absolute bottom-0 left-1/2 h-20 w-72 -translate-x-1/2 bg-[radial-gradient(ellipse,rgba(201,168,76,.16),transparent_70%)] blur-xl" />
      </div>
    </section>
  );
}

useGLTF.preload(asset("black-white-pent-shirts.glb"));
useGLTF.preload(asset("wesker-body.glb"));
