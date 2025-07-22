import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Only use static export for production builds
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export',
    trailingSlash: true,
    images: {
      unoptimized: true
    },
    env: {
      VERCEL_API_URL: 'https://crm-qp4by219w-arjun-shahs-projects-cc47488b.vercel.app'
    }
  }),
  // For development, don't use static export
  ...(process.env.NODE_ENV !== 'production' && {
    env: {
      VERCEL_API_URL: 'http://localhost:3000'
    }
  })
};

export default nextConfig;
