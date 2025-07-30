/** @type {import('next').NextConfig} */
const nextConfig = {
  // ❌ Remove this – it's known to break Spline in Vercel builds
  // experimental: {
  //   esmExternals: 'loose',
  // },

  webpack: (config) => {
    // Optional: only apply externals in local builds (not needed in Vercel)
    if (process.env.BUILD_ENV !== 'vercel') {
      config.externals.push({
        '@splinetool/runtime': '@splinetool/runtime',
      });
    }
    return config;
  },

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
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
