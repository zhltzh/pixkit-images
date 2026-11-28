import type { Metadata } from "next";
import { AboutContent } from "./about-content";
import { absoluteUrl } from "../site-config";

export const metadata: Metadata = {
  title: "About Pixkit | Free local-first image tools",
  description: "About Pixkit — a free, local-first image tool that runs entirely in your browser. Part of the Aixuno tool ecosystem.",
  alternates: { canonical: absoluteUrl("/about") },
};

export default function AboutPage() {
  return <AboutContent />;
}
