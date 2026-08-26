"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

const TOTAL_FRAMES = 300;
const FRAME_DIR = `${process.env.NEXT_PUBLIC_BASE_PATH ?? "/behindbars"}/images`;
const FRAME_NAME = (n: number) => `ezgif-frame-${String(n).padStart(3, "0")}.jpg`;

const copy = [
  {
    start: 0.02,
    end: 0.25,
    eyebrow: "BEHINDBARS / 01",
    title: "Precision in\nevery line.",
    body: "A cinematic 360° reveal of the men's silhouette. Scroll to take the camera around the look.",
  },
  {
    start: 0.37,
    end: 0.63,
    eyebrow: "THE FORMAL EDIT / 02",
    title: "Tailored for\nthe entrance.",
    body: "From the shoulder line to the final turn, every frame is choreographed like a fashion campaign.",
  },
  {
    start: 0.72,
    end: 0.96,
    eyebrow: "BEHINDBARS / 03",
    title: "Own the\nroom.",
    body: "The final orbit pulls back into the complete menswear story. Shop the look when you're ready.",
  },
];

function frameUrl(frame: number) {
  return `${FRAME_DIR}/${FRAME_NAME(frame)}`;
}

export function Real3DHeroScroll() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const idleRef = useRef<number | null>(null);
  const lastDrawnRef = useRef(-1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // The supplied sequence is 848 × 478 (16:9). Keeping the canvas at the
    // source aspect ratio lets CSS object-fit: cover fill the viewport without JS sizing.
    canvas.width = 848;
    canvas.height = 478;

    const drawFrame = (index: number) => {
      const image = framesRef.current[index];
      if (!image || !image.complete || image.naturalWidth === 0) return;
      if (lastDrawnRef.current === index) return;

      // Images are already 16:9. Draw at the canvas's native aspect ratio;
      // CSS object-fit: cover handles viewport cropping.
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      lastDrawnRef.current = index;
    };

    const loadFrame = (index: number) => {
      if (framesRef.current[index]) return;
      const image = new Image();
      image.decoding = "async";
      image.src = frameUrl(index + 1);
      image.onload = () => {
        framesRef.current[index] = image;
        if (index === 0) drawFrame(0);
      };
      image.onerror = () => {
        framesRef.current[index] = null;
      };
    };

    // First frame is requested immediately for the fastest possible hero paint.
    loadFrame(0);

    let nextChunk = 1;
    const loadChunk = () => {
      const end = Math.min(TOTAL_FRAMES, nextChunk + 10);
      for (let i = nextChunk; i < end; i += 1) loadFrame(i);
      nextChunk = end;
      if (nextChunk < TOTAL_FRAMES) scheduleIdle();
    };

    const scheduleIdle = () => {
      if ("requestIdleCallback" in window) {
        idleRef.current = window.requestIdleCallback(loadChunk, { timeout: 1200 });
      } else {
        idleRef.current = window.setTimeout(loadChunk, 80) as unknown as number;
      }
    };

    scheduleIdle();

    const onScroll = () => {
      const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const percentage = Math.min(1, Math.max(0, window.scrollY / scrollable));
      targetFrameRef.current = Math.min(TOTAL_FRAMES - 1, Math.round(percentage * (TOTAL_FRAMES - 1)));
    };

    const animate = () => {
      const current = currentFrameRef.current;
      const target = targetFrameRef.current;
      const next = current + (target - current) * 0.16;
      currentFrameRef.current = Math.abs(target - next) < 0.08 ? target : next;
      drawFrame(Math.round(currentFrameRef.current));
      rafRef.current = requestAnimationFrame(animate);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      if (idleRef.current !== null && "cancelIdleCallback" in window) window.cancelIdleCallback(idleRef.current);
    };
  }, []);

  return (
    <section className="relative h-[800vh] bg-black text-white">
      <div className="sticky top-0 h-screen overflow-hidden">
        <canvas
          ref={canvasRef}
          aria-label="BehindBars men's fashion 360 degree product sequence"
          className="absolute inset-0 h-screen w-screen object-cover"
        />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_65%_48%,rgba(201,168,76,.14),transparent_30%),linear-gradient(90deg,rgba(0,0,0,.92)_0%,rgba(0,0,0,.56)_34%,rgba(0,0,0,.08)_72%,rgba(0,0,0,.22)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/80 to-transparent" />

        <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between border-b border-white/10 px-6 py-6 md:px-12">
          <Link href="/" className="text-[11px] tracking-[0.42em]">BEHINDBARS</Link>
          <nav className="hidden gap-9 text-[9px] uppercase tracking-[0.3em] text-white/55 md:flex">
            <Link href="/collections">Collection</Link>
            <Link href="/collections/tops">Shirts</Link>
            <Link href="/collections/bottoms">Trousers</Link>
          </nav>
          <span className="text-[9px] uppercase tracking-[0.28em] text-white/40">Men&apos;s / 2026</span>
        </header>

        {copy.map((item, index) => (
          <div
            key={item.eyebrow}
            className="hero-copy pointer-events-none absolute left-6 top-1/2 z-10 max-w-[520px] -translate-y-1/2 md:left-12 lg:left-[7vw]"
            style={{ opacity: 0, animation: `heroCopy ${index === 0 ? "1" : index === 1 ? "3" : "5"} 1ms linear both` }}
            data-start={item.start}
            data-end={item.end}
          >
            <p className="mb-6 text-[9px] uppercase tracking-[0.5em] text-[#C9A84C]">{item.eyebrow}</p>
            <h1 className="whitespace-pre-line font-display text-[clamp(4rem,8vw,8rem)] font-light leading-[0.86] tracking-[-0.03em]">{item.title}</h1>
            <p className="mt-8 max-w-[380px] text-sm leading-7 text-white/50">{item.body}</p>
            <Link href="/collections" className="pointer-events-auto mt-8 inline-flex items-center gap-3 border border-[#C9A84C] px-6 py-4 text-[9px] uppercase tracking-[0.28em] text-[#C9A84C] transition-colors hover:bg-[#C9A84C] hover:text-black">Shop the look <span>→</span></Link>
          </div>
        ))}

        <div className="absolute bottom-8 left-6 z-20 flex items-center gap-4 text-[9px] uppercase tracking-[0.35em] text-white/40 md:left-12">
          <span className="h-px w-12 bg-white/30" /> Scroll / 360° sequence
        </div>
        <div className="absolute bottom-8 right-6 z-20 text-[9px] uppercase tracking-[0.35em] text-white/40 md:right-12">
          001 — 300
        </div>
        <div className="absolute right-4 top-1/2 z-20 h-32 w-px -translate-y-1/2 bg-white/10 md:right-6">
          <div className="h-1/3 w-full bg-[#C9A84C]" />
        </div>
      </div>

      <style jsx>{`
        @keyframes heroCopy {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
