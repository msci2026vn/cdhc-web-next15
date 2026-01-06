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
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self'",
          },
        ],
      },
    ];
  },
};

export default withSerwist(nextConfig);
