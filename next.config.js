/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "platven.ke",
        pathname: "/media/**",
      },
    ],
  },
};

module.exports = nextConfig;
