import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root to THIS folder. Without this, Next.js walks up the
  // tree and wrongly selects C:\Users\smigu as root (it has a stray
  // package-lock.json + loose project files), then tries to build files that
  // don't belong to this app. See the same stray-files issue that broke the
  // Sanity dev server (a leftover postcss.config.mjs in the home directory).
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
