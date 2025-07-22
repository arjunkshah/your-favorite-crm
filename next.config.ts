import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  env: {
    VERCEL_API_URL: 'https://crm-qp4by219w-arjun-shahs-projects-cc47488b.vercel.app'
  },
  // Exclude API routes from static export
  distDir: 'out',
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true
};

export default nextConfig;
