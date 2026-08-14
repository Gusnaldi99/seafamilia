import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The legacy static site's package-lock.json one level up makes Turbopack
  // guess the wrong workspace root; pin it to this app explicitly.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
