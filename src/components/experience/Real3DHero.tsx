"use client";

import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "/behindbars";
const asset = (name: string) => `${base}/models/${name}`;

const scenes = [
  { title: "Premium Menswear.\nRedefined.", copy: "A cinematic 3D introduction to the collection.", model: "black-white-pent-shirts.glb", cta: "Explore Collection", href: "/collections", accent: "#C9A84C" },
  { title: "Black. White.\nNothing extra.", copy: "Clean contrast. Precise proportions. No distractions.", model: "black-white-pent-shirts.glb", cta: "Shop Essentials", href: "/collections/tops", accent: "#F0E8D8" },
  { title: "Own the\nroom.", copy: "Dark tailoring. Material detail. A closer look.", model: "wesker-body.glb", cta: "View Signature", href: "/collections", accent: "#D9B76C" },
  { title: "Find your\nnext look.", copy: "The cinematic experience resolves into the collection.", model: null, cta: "Shop the Collection", href: "/collections", accent: "#C9A84C" },
] as const;

type Scene = (typeof scenes)[number];

function Garment({ path, progress }: { path: string; progress: number }) {
  const ref = useRef<THREE.Group>(null);
  const { scene } = useGLTF(path);
  const clone = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    clone.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });
  }, [clone]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const targetRotation = (progress - 0.5) * 1.35;
    ref.current.rotation.y = THREE.MathUtils.damp(ref.current.rotation.y, targetRotation, 3.5, delta);
    ref.current.rotation.x = THREE.MathUtils.damp(ref.current.rotation.x, Math.sin(progress * Math.PI) * 0.04, 3, delta);
    ref.current.position.y = THREE.MathUtils.damp(ref.current.position.y, Math.sin(progress * Math.PI) * 0.18, 3, delta);
    const s = THREE.MathUtils.lerp(0.92, 1.16, progress);
    ref.current.scale.lerp(new THREE.Vector3(s, s, s), 1 - Math.pow(0.001, delta));
  });

  return <group ref={ref}><primitive object={clone} /></group>;
}

function Fallback() {
  return <group><mesh position={[0, 1.65, 0]}><sphereGeometry args={[0.24, 24, 24]} /><meshStandardMaterial color="#b9a47a" /></mesh><mesh position={[0, 0.7, 0]}><capsuleGeometry args={[0.5, 1.25, 12, 24]} /><meshStandardMaterial color="#161616" roughness={0.3} /></mesh></group>;
}

function Model({ path, progress }: { path: string | null; progress: number }) {
  if (!path) return <Fallback />;
  return <Suspense fallback={<Fallback />}><Garment path={asset(path)} progress={progress} /></Suspense>;
}

function CameraRig({ progress }: { progress: number }) {
  useFrame(({ camera }, delta) => {
    const zoom = THREE.MathUtils.lerp(5.5, 3.55, progress);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, zoom, 3.2, delta);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, Math.sin(progress * Math.PI) * 0.85, 3, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, 0.15 + progress * 0.3, 3, delta);
    camera.lookAt(0, 1.1, 0);
  });
  return null;
}

function ExperienceScene({ scene, progress }: { scene: Scene; progress: number }) {
  return <>
    <ambientLight intensity={0.52} />
    <spotLight position={[3, 5, 4]} intensity={9} angle={0.5} penumbra={0.9} color="#fff1d0" castShadow />
    <spotLight position={[-4, 2, 2]} intensity={5} color="#6e86a5" />
    <pointLight position={[0, 2, -2]} intensity={3.5} color={scene.accent} />
    <Environment preset="studio" environmentIntensity={0.55} />
    <CameraRig progress={progress} />
    <Float speed={0.65} rotationIntensity={0.06} floatIntensity={0.1}>
      <Model path={scene.model} progress={progress} />
    </Float>
  </>;
}

export function Real3DHero() {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const update = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setScroll(Math.min(1, Math.max(0, window.scrollY / max)));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);

  const position = Math.min(scenes.length - 0.001, scroll * scenes.length);
  const index = Math.floor(position);
  const progress = position - index;
  const scene = scenes[index];

  return <div className="relative h-screen w-full overflow-hidden bg-[#070707] text-white">
    <Canvas shadows camera={{ position: [0, 0.2, 5.5], fov: 35 }} dpr={[1, 1.7]}>
      <ExperienceScene scene={scene} progress={progress} />
    </Canvas>
    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#070707f7_0%,#070707b5_32%,#07070715_70%,transparent_100%)]" />
    <div key={index} className="absolute left-6 top-1/2 z-10 max-w-xl -translate-y-1/2 lg:left-14">
      <p className="mb-5 text-[10px] uppercase tracking-[.42em]" style={{ color: scene.accent }}>BEHINDBARS / {String(index + 1).padStart(2, "0")}</p>
      <h1 className="whitespace-pre-line font-display text-5xl font-light leading-[.92] md:text-7xl lg:text-[6rem]">{scene.title}</h1>
      <p className="mt-7 max-w-sm text-sm leading-7 text-white/50">{scene.copy}</p>
      <Link href={scene.href} className="pointer-events-auto mt-9 inline-flex border px-6 py-4 text-[10px] uppercase tracking-[.25em] transition-transform duration-300 hover:scale-105" style={{ borderColor: scene.accent, color: scene.accent }}>{scene.cta} →</Link>
    </div>
    <div className="absolute bottom-7 left-6 text-[9px] uppercase tracking-[.35em] text-white/40">Scroll to explore the 3D collection</div>
    <div className="absolute bottom-7 right-6 text-[9px] uppercase tracking-[.35em] text-white/40">{String(index + 1).padStart(2, "0")} / {String(scenes.length).padStart(2, "0")}</div>
    <div className="absolute right-4 top-1/2 h-32 w-px -translate-y-1/2 bg-white/10"><div className="w-full bg-[#C9A84C]" style={{ height: `${scroll * 100}%` }} /></div>
  </div>;
}

useGLTF.preload(asset("black-white-pent-shirts.glb"));
useGLTF.preload(asset("wesker-body.glb"));
