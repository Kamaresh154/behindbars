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

type GarmentProps = { look: Look; progress: number; pointer: { x: number; y: number } };

function Garment({ look, progress, pointer }: GarmentProps) {
  const root = useRef<THREE.Group>(null);
  const { scene } = useGLTF(asset(look.model));
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
    const eased = progress * progress * (3 - 2 * progress);

    // Scroll choreography: the garment makes a full cinematic turn while the
    // camera rises/falls around it. Pointer input adds a subtle second layer.
    const targetRotY = eased * Math.PI * 2.15 + pointer.x * 0.10;
    const targetRotX = Math.sin(eased * Math.PI * 2) * 0.055 - pointer.y * 0.025;
    const targetY = Math.sin(eased * Math.PI * 2) * 0.16;
    const targetX = Math.sin(eased * Math.PI) * 0.12;
    const targetScale = 1.04 + Math.sin(eased * Math.PI) * 0.13;

    root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, targetRotY, 5.5, delta);
    root.current.rotation.x = THREE.MathUtils.damp(root.current.rotation.x, targetRotX, 4.5, delta);
    root.current.position.y = THREE.MathUtils.damp(root.current.position.y, targetY, 4.5, delta);
    root.current.position.x = THREE.MathUtils.damp(root.current.position.x, targetX, 4, delta);
    const scale = THREE.MathUtils.damp(root.current.scale.x, targetScale, 4, delta);
    root.current.scale.setScalar(scale);
  });

  return <group ref={root}><primitive object={clone} /></group>;
}

function DroneCamera({ progress }: { progress: number }) {
  useFrame(({ camera }, delta) => {
    // A drone-like circular orbit: approach, rise above the shoulders,
    // sweep around the back, then descend for a hero front view.
    const p = progress * Math.PI * 2;
    const radius = 5.15 - Math.sin(progress * Math.PI) * 1.45;
    const x = Math.sin(p) * radius;
    const z = Math.cos(p) * radius;
    const y = 0.18 + Math.sin(progress * Math.PI * 2) * 0.62 + progress * 0.18;

    camera.position.x = THREE.MathUtils.damp(camera.position.x, x, 2.8, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, z, 2.8, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, y, 2.8, delta);

    const lookAt = new THREE.Vector3(0, 0.75 + Math.sin(progress * Math.PI) * 0.15, 0);
    camera.lookAt(lookAt);
  });
  return null;
}

function Stage({ look, progress, pointer }: { look: Look; progress: number; pointer: { x: number; y: number } }) {
  const controls = useRef<any>(null);

  return (
    <>
      <ambientLight intensity={0.42} />
      <spotLight castShadow position={[4, 6, 4]} intensity={11} angle={0.42} penumbra={0.9} color="#fff1d2" shadow-mapSize={[1024, 1024]} />
      <spotLight position={[-4, 3, 1]} intensity={5.5} angle={0.65} penumbra={1} color="#8298b8" />
      <pointLight position={[1, 2, -3]} intensity={4.5} color={look.accent} />
      <Environment preset="studio" environmentIntensity={0.72} />
      <DroneCamera progress={progress} />
      <group position={[0, -1.1, 0]}>
        <Suspense fallback={null}>
          <Garment look={look} progress={progress} pointer={pointer} />
        </Suspense>
      </group>
      <OrbitControls
        ref={controls}
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.08}
        minPolarAngle={Math.PI * 0.25}
        maxPolarAngle={Math.PI * 0.72}
      />
    </>
  );
}

export function Real3DHeroScroll() {
  const [scroll, setScroll] = useState(0);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [selected, setSelected] = useState(0);
  const targetScroll = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      targetScroll.current = Math.min(1, Math.max(0, window.scrollY / max));
    };
    const onPointer = (event: PointerEvent) => {
      setPointer({
        x: event.clientX / Math.max(1, innerWidth) * 2 - 1,
        y: event.clientY / Math.max(1, innerHeight) * 2 - 1,
      });
    };

    let raf = 0;
    const tick = () => {
      setScroll((value) => value + (targetScroll.current - value) * 0.055);
      raf = requestAnimationFrame(tick);
    };
    onScroll();
    tick();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", onScroll);
      removeEventListener("pointermove", onPointer);
    };
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
    gsap.fromTo("[data-hero-copy]", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" });
  }, [selected]);

  return (
    <section className="relative h-[900vh] bg-[#050505] text-white">
      <div className="sticky top-0 h-screen overflow-hidden">
        <Canvas shadows dpr={[1, 1.8]} camera={{ position: [0, 0.1, 5.2], fov: 30 }} gl={{ antialias: true, powerPreference: "high-performance" }}>
          <Stage look={look} progress={progress} pointer={pointer} />
        </Canvas>

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_65%_45%,rgba(201,168,76,.14),transparent_30%),linear-gradient(90deg,#050505f5_0%,#050505b5_34%,rgba(5,5,5,.10)_72%,transparent_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/70 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black via-black/25 to-transparent" />

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

        <div className="absolute bottom-8 left-6 z-10 flex items-center gap-4 text-[9px] uppercase tracking-[0.35em] text-white/40 md:left-12"><span className="h-px w-12 bg-white/30" />Scroll / 360° journey</div>
        <div className="absolute bottom-8 right-6 z-10 text-right md:right-12"><div className="text-[9px] uppercase tracking-[0.35em] text-white/35">Look {String(selected + 1).padStart(2, "0")} / {String(looks.length).padStart(2, "0")}</div><div className="mt-3 h-px w-28 bg-white/10"><div className="h-full bg-[#C9A84C] transition-[width]" style={{ width: `${((selected + 1) / looks.length) * 100}%` }} /></div></div>

        <div className="absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-2 md:flex">{looks.map((item, i) => <button key={item.name} aria-label={`View ${item.name}`} onClick={() => setSelected(i)} className={`pointer-events-auto h-8 w-1 transition-all ${i === selected ? "bg-[#C9A84C]" : "bg-white/15 hover:bg-white/40"}`} />)}</div>

        <div className="pointer-events-none absolute bottom-0 left-1/2 h-28 w-96 -translate-x-1/2 bg-[radial-gradient(ellipse,rgba(201,168,76,.20),transparent_70%)] blur-xl" />
      </div>
    </section>
  );
}

useGLTF.preload(asset("black-white-pent-shirts.glb"));
useGLTF.preload(asset("wesker-body.glb"));
