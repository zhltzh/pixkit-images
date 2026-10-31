import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The site is published as static files on GitHub Pages: there is no Node
  // runtime, Worker, or image optimizer available there.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
