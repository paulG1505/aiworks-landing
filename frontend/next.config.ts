import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "export",
  experimental: {
    // The on-disk Turbopack cache served a stale globals.css twice in `next dev`.
    turbopackFileSystemCacheForDev: false,
  },
  turbopack: {
    root: path.resolve(process.cwd()),
  },
};

export default nextConfig;
