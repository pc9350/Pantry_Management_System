/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        domains: ['img.spoonacular.com'],
        unoptimized: true,
      },
};

export default nextConfig;
