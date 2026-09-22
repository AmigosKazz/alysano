import type { Metadata } from "next";
import { WorkStage } from "@/components/work/WorkStage";

export const metadata: Metadata = {
  title: "Work — Aly Sanoo",
  description:
    "Selected films, campaigns and music work cut by Aly Sanoo — editing, post-production and sound design.",
};

export default function WorkPage() {
  return (
    <main>
      <div className="page-cover">
        <WorkStage />
      </div>
    </main>
  );
}
