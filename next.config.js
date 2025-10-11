/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' to enable middleware and API routes for Vercel
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
