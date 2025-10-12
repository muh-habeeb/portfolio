import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow images from any domain for maximum flexibility
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      }
    ],
  },
};

export default nextConfig;
