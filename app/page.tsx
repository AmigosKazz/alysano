import { About } from "@/components/about/About";
import { Behind } from "@/components/behind/Behind";
import { Built } from "@/components/built/Built";
import { Contact } from "@/components/contact/Contact";
import { Figures } from "@/components/figures/Figures";
import { Hero } from "@/components/hero/Hero";
import { Services } from "@/components/services/Services";
import { Work } from "@/components/work/Work";

export default function Home() {
  return (
    <main>
      <Hero />

      {/* Everything past the opening shot rides up over it — the hero stays put underneath. */}
      <div className="page-cover">
        <Behind />
        <Work />
        <Figures />
        <Services />
        <About />
        <Contact />
        <Built />
      </div>
    </main>
  );
}
