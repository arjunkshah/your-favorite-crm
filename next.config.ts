import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Vercel optimizations
  serverExternalPackages: ['bcryptjs']
};

export default nextConfig;
