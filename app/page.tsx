import { Behind } from "@/components/behind/Behind";
import { Hero } from "@/components/hero/Hero";

export default function Home() {
  return (
    <main>
      <Hero />

      <Behind />

      {/*
        03 — Selected Work is not built yet. This stub only marks where the
        curated projects will sit.
      */}
      <section
        id="work"
        aria-label="Selected work"
        className="relative z-0 min-h-svh bg-black px-5 pb-[30svh] pt-[46svh] md:px-10"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
          <span>03</span>
          <span className="ml-6">Selected work</span>
        </p>
      </section>
    </main>
  );
}
