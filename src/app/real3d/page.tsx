import { Real3DHero } from "@/components/experience/Real3DHero";

export default function Real3DPrototypePage() {
  return (
    <main>
      <section style={{ height: "1000vh" }}>
        <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
          <Real3DHero />
        </div>
      </section>
      <section className="min-h-screen bg-obsidian px-6 py-24 text-white">
        <div className="mx-auto max-w-5xl">
          <p className="text-bar-gold text-xs uppercase tracking-[0.4em]">BehindBars / Prototype</p>
          <h2 className="mt-4 font-display text-5xl font-light">The collection continues.</h2>
          <p className="mt-6 max-w-2xl text-white/50">This route is an isolated preview of the new WebGL hero. The main storefront is unchanged until the 3D experience is approved.</p>
        </div>
      </section>
    </main>
  );
}
