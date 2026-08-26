"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const FIRST_FRAME = 2;
const TOTAL_FRAMES = 299;
const LAST_FRAME = 300;
const FRAME_DIR = `${process.env.NEXT_PUBLIC_BASE_PATH ?? "/behindbars"}/images`;
const FRAME_NAME = (n: number) => `ezgif-frame-${String(n).padStart(3, "0")}.jpg`;
const frameUrl = (n: number) => `${FRAME_DIR}/${FRAME_NAME(n)}`;

const copy = [
  { start: 0.02, end: 0.25, eyebrow: "BEHINDBARS / 01", title: "Precision in\nevery line.", body: "A cinematic 360° reveal of the men's silhouette. Scroll to take the camera around the look." },
  { start: 0.37, end: 0.63, eyebrow: "THE FORMAL EDIT / 02", title: "Tailored for\nthe entrance.", body: "From the shoulder line to the final turn, every frame is choreographed like a fashion campaign." },
  { start: 0.72, end: 0.96, eyebrow: "BEHINDBARS / 03", title: "Own the\nroom.", body: "The final orbit pulls back into the complete menswear story. Shop the look when you're ready." },
];

type IdleHandle = number;

export function Real3DHeroScroll() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const idleRef = useRef<IdleHandle | null>(null);
  const lastDrawnRef = useRef(-1);
  const resizeRef = useRef<(() => void) | null>(null);
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const drawFrame = (index: number) => {
      const image = framesRef.current[index];
      if (!image || !image.complete || image.naturalWidth === 0 || lastDrawnRef.current === index) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cw = window.innerWidth;
      const ch = window.innerHeight;
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const scale = Math.max(cw / image.naturalWidth, ch / image.naturalHeight);
      const w = image.naturalWidth * scale;
      const h = image.naturalHeight * scale;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(image, (cw - w) / 2, (ch - h) / 2, w, h);
      lastDrawnRef.current = index;
    };

    const loadFrame = (index: number) => {
      if (framesRef.current[index]) return;
      const image = new Image();
      image.decoding = "async";
      image.src = frameUrl(FIRST_FRAME + index);
      image.onload = () => {
        framesRef.current[index] = image;
        if (index === 0 || index === Math.round(currentFrameRef.current)) drawFrame(index);
      };
    };

    loadFrame(0);
    let nextChunk = 1;
    let idleScheduled = false;
    const loadChunk = () => {
      idleScheduled = false;
      const end = Math.min(TOTAL_FRAMES, nextChunk + 10);
      for (let i = nextChunk; i < end; i += 1) loadFrame(i);
      nextChunk = end;
      if (nextChunk < TOTAL_FRAMES) scheduleIdle();
    };
    const scheduleIdle = () => {
      if (idleScheduled) return;
      idleScheduled = true;
      const win = window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number };
      idleRef.current = typeof win.requestIdleCallback === "function"
        ? win.requestIdleCallback(loadChunk, { timeout: 1200 })
        : window.setTimeout(loadChunk, 80);
    };
    scheduleIdle();

    const onScroll = () => {
      const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const percentage = Math.min(1, Math.max(0, window.scrollY / scrollable));
      targetFrameRef.current = Math.round(percentage * (TOTAL_FRAMES - 1));
      setScrollPercent(percentage);
    };
    const onResize = () => drawFrame(Math.round(currentFrameRef.current));
    resizeRef.current = onResize;

    const animate = () => {
      const next = currentFrameRef.current + (targetFrameRef.current - currentFrameRef.current) * 0.16;
      currentFrameRef.current = Math.abs(targetFrameRef.current - next) < 0.08 ? targetFrameRef.current : next;
      drawFrame(Math.round(currentFrameRef.current));
      rafRef.current = requestAnimationFrame(animate);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      if (idleRef.current !== null) {
        const win = window as Window & { cancelIdleCallback?: (id: number) => void };
        if (typeof win.cancelIdleCallback === "function") win.cancelIdleCallback(idleRef.current);
        else window.clearTimeout(idleRef.current);
      }
    };
  }, []);

  const textStyle = (start: number, end: number) => {
    const fade = 0.055;
    const opacity = Math.max(0, Math.min(1, (scrollPercent - start) / fade, (end - scrollPercent) / fade));
    return { opacity, transform: `translate3d(0, ${18 * (1 - opacity)}px, 0)` };
  };

  const visibleFrame = FIRST_FRAME + Math.round(scrollPercent * (TOTAL_FRAMES - 1));

  return (
    <section className="relative h-[800vh] bg-black text-white">
      <div className="sticky top-0 h-screen overflow-hidden">
        <canvas ref={canvasRef} aria-label="BehindBars men's fashion 360 degree product sequence" className="absolute inset-0 h-screen w-screen object-cover" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_65%_48%,rgba(201,168,76,.14),transparent_30%),linear-gradient(90deg,rgba(0,0,0,.92)_0%,rgba(0,0,0,.56)_34%,rgba(0,0,0,.08)_72%,rgba(0,0,0,.22)_100%)]" />
        <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between border-b border-white/10 px-6 py-6 md:px-12">
          <Link href="/" className="text-[11px] tracking-[0.42em]">BEHINDBARS</Link>
          <nav className="hidden gap-9 text-[9px] uppercase tracking-[0.3em] text-white/55 md:flex"><Link href="/collections">Collection</Link><Link href="/collections/tops">Shirts</Link><Link href="/collections/bottoms">Trousers</Link></nav>
          <span className="text-[9px] uppercase tracking-[0.28em] text-white/40">Men&apos;s / 2026</span>
        </header>
        {copy.map((item) => (
          <div key={item.eyebrow} className="pointer-events-none absolute left-6 top-1/2 z-10 max-w-[520px] -translate-y-1/2 md:left-12 lg:left-[7vw]" style={textStyle(item.start, item.end)}>
            <p className="mb-6 text-[9px] uppercase tracking-[0.5em] text-[#C9A84C]">{item.eyebrow}</p>
            <h1 className="whitespace-pre-line font-display text-[clamp(4rem,8vw,8rem)] font-light leading-[0.86] tracking-[-0.03em]">{item.title}</h1>
            <p className="mt-8 max-w-[380px] text-sm leading-7 text-white/50">{item.body}</p>
            <Link href="/collections" className="pointer-events-auto mt-8 inline-flex items-center gap-3 border border-[#C9A84C] px-6 py-4 text-[9px] uppercase tracking-[0.28em] text-[#C9A84C] transition-colors hover:bg-[#C9A84C] hover:text-black">Shop the look <span>→</span></Link>
          </div>
        ))}
        <div className="absolute bottom-8 left-6 z-20 flex items-center gap-4 text-[9px] uppercase tracking-[0.35em] text-white/40 md:left-12"><span className="h-px w-12 bg-white/30" /> Scroll / 360° sequence</div>
        <div className="absolute bottom-8 right-6 z-20 text-[9px] uppercase tracking-[0.35em] text-white/40 md:right-12">{String(visibleFrame).padStart(3, "0")} / {LAST_FRAME}</div>
        <div className="absolute right-4 top-1/2 z-20 h-32 w-px -translate-y-1/2 bg-white/10 md:right-6"><div className="h-full w-full origin-top bg-[#C9A84C]" style={{ transform: `scaleY(${scrollPercent})` }} /></div>
      </div>
    </section>
  );
}
