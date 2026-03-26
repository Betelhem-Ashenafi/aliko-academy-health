/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // For simplicity during migration if assets are local
  },
};

export default nextConfig;
