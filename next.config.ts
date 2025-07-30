import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals.push({
      "@splinetool/runtime": "@splinetool/runtime",
    });
    return config;
  },
};

export default nextConfig;
