import { Real3DHeroScroll } from "@/components/experience/Real3DHeroScroll";

export default function Real3DPrototypePage() {
  return (
    <main className="bg-obsidian">
      <Real3DHeroScroll />
      <section className="min-h-screen bg-obsidian px-6 py-28 text-white md:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="text-bar-gold text-[10px] uppercase tracking-[0.45em]">BehindBars / Menswear</p>
          <h2 className="mt-5 font-display text-5xl font-light md:text-7xl">The collection continues.</h2>
          <p className="mt-7 max-w-2xl text-sm leading-8 text-white/45">A real-time 3D product experience for the men&apos;s collection. Drag the model, use the scroll choreography, and enter the collection when a look catches your eye.</p>
        </div>
      </section>
    </main>
  );
}
