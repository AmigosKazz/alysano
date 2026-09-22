import type { Metadata } from "next";
import { AboutStage } from "@/components/about/AboutStage";

export const metadata: Metadata = {
  title: "About — Aly Sanoo",
  description:
    "Aly Sanoo — direction, post-production and production design. Editing, colour and sound design for film, music and commercial work, out of Madagascar.",
};

export default function AboutPage() {
  return (
    <main>
      <div className="page-cover">
        <AboutStage />
      </div>
    </main>
  );
}
