/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@react-three/drei', 
    '@react-three/fiber', 
    'three', 
    'react-spring'
  ],
  // Disable server side rendering for pages that use localStorage or other browser APIs
  images: {
    domains: ['spoonacular.com'],
  },
  // Experimental feature for better build optimizations
  experimental: {
    optimizeCss: true,
    legacyBrowsers: false,
  },
  // Disable source maps in production to reduce memory usage
  productionBrowserSourceMaps: false,
  // Allow all domains for image loading
  eslint: {
    // Run lint on build in production only
    ignoreDuringBuilds: process.env.NODE_ENV !== 'production',
  },
}

module.exports = nextConfig 