/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  transpilePackages: ['@fixelo/common', '@fixelo/utils'],
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  images: {
    domains: [
      'localhost',
      'via.placeholder.com',
      'images.unsplash.com',
      'supabase.co', // For Supabase storage
    ],
    formats: ['image/webp', 'image/avif'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/dashboard/overview',
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig; 