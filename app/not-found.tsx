import type { Metadata } from "next";
import { NotFoundContent } from "./not-found-content";

export const metadata: Metadata = {
  title: "页面未找到 - Pixkit",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <NotFoundContent />;
}
