const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['@fixelo/common', '@fixelo/utils'],
  output: 'standalone',
  eslint: {
    // During builds, we'll allow warnings but not errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // During builds, we'll allow warnings but not errors  
    ignoreBuildErrors: false,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
  images: {
    domains: [
      'localhost',
      'via.placeholder.com',
      'images.unsplash.com',
      'supabase.co',
    ],
    formats: ['image/webp', 'image/avif'],
  },
};

module.exports = withNextIntl(nextConfig); 