/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allows all subdomains and domains
      },
      {
        protocol: 'http',
        hostname: '**', // Allows all subdomains and domains
      },
    ],
  },
};

export default nextConfig;
