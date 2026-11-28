import type { Metadata } from "next";
import { TermsContent } from "./terms-content";
import { absoluteUrl } from "../site-config";

export const metadata: Metadata = {
  title: "Terms of Service | Pixkit",
  description: "Pixkit terms of service — free, local-first image processing provided as-is.",
  alternates: { canonical: absoluteUrl("/terms") },
};

export default function TermsPage() {
  return <TermsContent />;
}
