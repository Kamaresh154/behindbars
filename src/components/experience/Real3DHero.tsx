"use client";

import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "/behindbars";
const asset = (name: string) => `${base}/models/${name}`;

const scenes = [
  { title: "Premium Menswear.\nRedefined.", copy: "A cinematic introduction to modern men's tailoring.", model: "black-white-pent-shirts.glb", cta: "Explore Collection", href: "/collections", accent: "#C9A84C" },
  { title: "The modern\nsilhouette.", copy: "Sharp lines, restrained contrast, confident proportions.", model: "black-white-pent-shirts.glb", cta: "Shop Essentials", href: "/collections/tops", accent: "#E7DCC5" },
  { title: "Own the\nroom.", copy: "Dark tailoring presented like a campaign film.", model: "wesker-body.glb", cta: "View Signature", href: "/collections", accent: "#D9B76C" },
  { title: "Made for\nmen who lead.", copy: "Discover the complete BehindBars menswear collection.", model: "wesker-body.glb", cta: "Shop Collection", href: "/collections", accent: "#C9A84C" },
] as const;

type Scene = (typeof scenes)[number];

type Props = { path: string; progress: number; active: boolean; direction: number; pointer: { x: number; y: number } };

function setModelOpacity(root: THREE.Object3D, opacity: number) {
  root.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    materials.forEach((material) => {
      material.transparent = opacity < 0.999;
      material.opacity = opacity;
      material.depthWrite = opacity > 0.95;
    });
  });
}

function Garment({ path, progress, active, direction, pointer }: Props) {
  const ref = useRef<THREE.Group>(null);
  const { scene } = useGLTF(path);
  const clone = useMemo(() => scene.clone(true), [scene]);
  const target = useRef({ opacity: active ? 1 : 0, x: active ? 0 : direction * 2.2, scale: active ? 1 : 0.82 });

  useEffect(() => {
    clone.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });
    setModelOpacity(clone, active ? 1 : 0);
  }, [clone, active]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const p = progress;
    const eased = p * p * (3 - 2 * p);
    const targetRotation = (p - 0.5) * 0.72 + pointer.x * 0.12;
    const targetTilt = Math.sin(p * Math.PI) * 0.045 - pointer.y * 0.035;
    const targetY = Math.sin(p * Math.PI) * 0.1;
    const targetScale = active ? 1.0 + eased * 0.22 : 0.78 + eased * 0.04;
    const targetX = active ? pointer.x * 0.08 : direction * (1.9 - eased * 0.45);
    const targetOpacity = active ? 1 : Math.max(0, 1 - eased * 1.7);

    ref.current.rotation.y = THREE.MathUtils.damp(ref.current.rotation.y, targetRotation, 4.2, delta);
    ref.current.rotation.x = THREE.MathUtils.damp(ref.current.rotation.x, targetTilt, 4.2, delta);
    ref.current.position.x = THREE.MathUtils.damp(ref.current.position.x, targetX, 4.5, delta);
    ref.current.position.y = THREE.MathUtils.damp(ref.current.position.y, targetY, 4, delta);
    const s = THREE.MathUtils.damp(ref.current.scale.x, targetScale, 4.2, delta);
    ref.current.scale.setScalar(s);
    setModelOpacity(clone, THREE.MathUtils.damp(1, targetOpacity, 5, delta));
  });

  return <group ref={ref}><primitive object={clone} /></group>;
}

function Fallback() {
  return <group><mesh position={[0, 1.65, 0]}><sphereGeometry args={[0.24, 32, 32]} /><meshStandardMaterial color="#b9a47a" /></mesh><mesh position={[0, 0.72, 0]}><capsuleGeometry args={[0.5, 1.25, 16, 32]} /><meshStandardMaterial color="#111" roughness={0.28} metalness={0.1} /></mesh></group>;
}

function Model({ path, progress, active, direction, pointer }: Props) {
  return <Suspense fallback={<Fallback />}><Garment path={asset(path)} progress={progress} active={active} direction={direction} pointer={pointer} /></Suspense>;
}

function CameraRig({ progress, pointer }: { progress: number; pointer: { x: number; y: number } }) {
  useFrame(({ camera }, delta) => {
    const eased = progress * progress * (3 - 2 * progress);
    const zoom = THREE.MathUtils.lerp(5.7, 3.35, eased);
    const x = Math.sin(progress * Math.PI) * 0.7 + pointer.x * 0.32;
    const y = 0.18 + Math.sin(progress * Math.PI) * 0.24 + pointer.y * 0.12;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, x, 3.8, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, y, 3.8, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, zoom, 3.8, delta);
    camera.lookAt(pointer.x * 0.12, 1.05 + pointer.y * 0.08, 0);
  });
  return null;
}

function ExperienceScene({ current, next, progress, pointer }: { current: Scene; next: Scene; progress: number; pointer: { x: number; y: number } }) {
  const nextProgress = Math.max(0, Math.min(1, (progress - 0.58) / 0.42));
  return <>
    <ambientLight intensity={0.38} />
    <spotLight position={[3.5, 5.5, 3]} intensity={12} angle={0.42} penumbra={0.92} color="#fff0d1" castShadow shadow-mapSize={[1024, 1024]} />
    <spotLight position={[-4, 2.5, 1]} intensity={6} angle={0.6} penumbra={1} color="#8198b0" />
    <pointLight position={[1, 1.8, -2]} intensity={4.5} color={current.accent} />
    <pointLight position={[-2, 0.5, 1]} intensity={1.7} color="#ffffff" />
    <Environment preset="studio" environmentIntensity={0.45} />
    <CameraRig progress={progress} pointer={pointer} />
    <Float speed={0.42} rotationIntensity={0.025} floatIntensity={0.07}>
      <Model path={current.model} progress={progress} active direction={-1} pointer={pointer} />
      <Model path={next.model} progress={nextProgress} active={false} direction={1} pointer={pointer} />
    </Float>
  </>;
}

export function Real3DHero() {
  const [scroll, setScroll] = useState(0);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setScroll(Math.min(1, Math.max(0, window.scrollY / max)));
    };
    const updatePointer = (event: PointerEvent) => {
      setPointer({ x: event.clientX / Math.max(1, window.innerWidth) * 2 - 1, y: event.clientY / Math.max(1, window.innerHeight) * 2 - 1 });
    };
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll);
    window.addEventListener("pointermove", updatePointer, { passive: true });
    return () => { window.removeEventListener("scroll", updateScroll); window.removeEventListener("resize", updateScroll); window.removeEventListener("pointermove", updatePointer); };
  }, []);

  const position = Math.min(scenes.length - 0.001, scroll * scenes.length);
  const index = Math.floor(position);
  const progress = position - index;
  const current = scenes[index];
  const next = scenes[Math.min(index + 1, scenes.length - 1)];

  return <div className="relative h-screen w-full overflow-hidden bg-[#050505] text-white">
    <Canvas shadows gl={{ antialias: true, powerPreference: "high-performance" }} camera={{ position: [0, 0.2, 5.7], fov: 32 }} dpr={[1, 1.8]}>
      <ExperienceScene current={current} next={next} progress={progress} pointer={pointer} />
    </Canvas>
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_65%_48%,rgba(201,168,76,.12),transparent_34%),linear-gradient(90deg,#050505f7_0%,#050505c9_30%,#05050522_70%,transparent_100%)]" />
    <header className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between border-b border-white/10 px-6 py-6 lg:px-12">
      <span className="text-xs font-medium tracking-[0.35em]">BEHINDBARS</span>
      <nav className="hidden gap-8 text-[9px] uppercase tracking-[0.28em] text-white/55 md:flex"><Link href="/collections">Collection</Link><Link href="/about">About</Link><Link href="/contact">Contact</Link></nav>
      <span className="text-[9px] uppercase tracking-[0.28em] text-white/45">Menswear / 2026</span>
    </header>
    <div key={index} className="absolute left-6 top-1/2 z-10 max-w-2xl -translate-y-1/2 lg:left-14">
      <p className="mb-6 text-[10px] uppercase tracking-[.45em]" style={{ color: current.accent }}>BEHINDBARS / {String(index + 1).padStart(2, "0")}</p>
      <h1 className="whitespace-pre-line font-display text-5xl font-light leading-[.88] md:text-7xl lg:text-[6.5rem]">{current.title}</h1>
      <p className="mt-8 max-w-md text-sm leading-7 text-white/50">{current.copy}</p>
      <Link href={current.href} className="pointer-events-auto mt-9 inline-flex border px-7 py-4 text-[10px] uppercase tracking-[.28em] transition-all duration-500 hover:bg-white hover:text-black" style={{ borderColor: current.accent, color: current.accent }}>{current.cta} →</Link>
    </div>
    <div className="absolute bottom-7 left-6 z-10 flex items-center gap-4 text-[9px] uppercase tracking-[.35em] text-white/40"><span className="h-px w-12 bg-white/30" /><span>Scroll to enter</span></div>
    <div className="absolute bottom-7 right-6 z-10 text-[9px] uppercase tracking-[.35em] text-white/40">{String(index + 1).padStart(2, "0")} / {String(scenes.length).padStart(2, "0")}</div>
    <div className="absolute right-5 top-1/2 z-10 h-36 w-px -translate-y-1/2 bg-white/10"><div className="w-full bg-[#C9A84C] transition-[height] duration-200" style={{ height: `${scroll * 100}%` }} /></div>
  </div>;
}

useGLTF.preload(asset("black-white-pent-shirts.glb"));
useGLTF.preload(asset("wesker-body.glb"));
