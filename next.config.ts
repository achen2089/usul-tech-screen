import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      // Increase the body size limit to 10MB (10 * 1024 * 1024 bytes)
      bodySizeLimit: 10 * 1024 * 1024,
    },
  },
};

export default nextConfig;
