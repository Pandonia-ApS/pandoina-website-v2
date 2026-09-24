/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Phase 5 performance budget: AVIF first, WebP fallback, four widths.
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [390, 780, 1200, 1800],
    imageSizes: [96, 160, 320],
  },

  // The clinical gate is enforced by `prebuild` (scripts/validate-clinical.ts).
  // Type and lint errors must also block a production build.
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
