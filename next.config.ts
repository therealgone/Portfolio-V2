/** @type {import('next').NextConfig} */
const nextConfig = {
  // ❌ Remove this line for Vercel compatibility
  // experimental: {
  //   esmExternals: 'loose',
  // },

  webpack: (config: any) => {
    // Only add externals in local/dev, skip for Vercel/Prod
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
