import type { Metadata } from "next";
import { PrivacyContent } from "./privacy-content";
import { absoluteUrl } from "../site-config";

export const metadata: Metadata = {
  title: "Privacy Policy | Pixkit",
  description: "Pixkit privacy policy — your images are processed entirely on your device. No uploads, no accounts, no tracking of your files.",
  alternates: { canonical: absoluteUrl("/privacy") },
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
