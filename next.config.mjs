/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "seller.tracking.my",
      },
      {
        protocol: "https",
        hostname: "nextjs-ecom-admin.s3.ap-southeast-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
