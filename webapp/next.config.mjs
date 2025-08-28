/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BASE_URL: process.env.NEXT_BASE_URL,
  },
};

export default nextConfig;
