/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Keep Prisma and pg outside the Turbopack/Webpack bundle
  // so they resolve correctly as native Node.js modules server-side
  serverExternalPackages: ['@prisma/client', '.prisma/client', '@prisma/adapter-pg', 'pg'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;
