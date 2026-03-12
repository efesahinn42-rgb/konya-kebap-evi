/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    minimumCacheTTL: 31536000, // 1 yıl — optimize edilen görseller disk cache'de kalır, Supabase'e tekrar sorulmaz
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.in',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [75],
  },
  async redirects() {
    return [
      {
        source: '/tr/menu',
        destination: '/menu',
        permanent: true,
      },
      {
        source: '/public/tr/menu',
        destination: '/menu',
        permanent: true,
      },
      {
        source: '/tr/:path*',
        destination: '/',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
