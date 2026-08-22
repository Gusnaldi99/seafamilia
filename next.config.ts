import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The legacy static site's package-lock.json one level up makes Turbopack
  // guess the wrong workspace root; pin it to this app explicitly.
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    // familia-satu/layar-kecil were renamed to sea-familia/sea-familia-2 in
    // the Aug 2026 client revision — same boats, corrected names.
    return [
      { source: '/boats/familia-satu', destination: '/boats/sea-familia', permanent: true },
      { source: '/boats/layar-kecil', destination: '/boats/sea-familia-2', permanent: true },
    ];
  },
};

export default nextConfig;
