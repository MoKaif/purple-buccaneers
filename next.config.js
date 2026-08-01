/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // Avatars and banners are arbitrary admin-supplied URLs. Nothing uses
    // next/image yet, but this keeps the door open without a domain allowlist.
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
};

module.exports = nextConfig;
