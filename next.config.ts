/** @type {import('next').NextConfig} */
import type { Configuration as WebpackConfig } from "webpack"

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
        ],
      },
    ]
  },

  webpack: (config: WebpackConfig) => {
    // Remove problematic externals configuration for Spline
    return config
  },
}

export default nextConfig
