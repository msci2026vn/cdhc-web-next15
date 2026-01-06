import { execSync } from "node:child_process";
import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";

// Generate revision hash for cache busting
const revision = (() => {
  try {
    return execSync("git rev-parse HEAD", { encoding: "utf8" })
      .trim()
      .slice(0, 7);
  } catch {
    return Date.now().toString();
  }
})();

// Serwist configuration
const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
  cacheOnNavigation: true,
  reloadOnOnline: false,
  additionalPrecacheEntries: [{ url: "/~offline", revision }],
});

// Next.js configuration
const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default withSerwist(nextConfig);
