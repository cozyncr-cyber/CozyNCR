/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cloud.appwrite.io", // General Appwrite Cloud
        port: "",
      },
      {
        protocol: "https",
        hostname: "fra.cloud.appwrite.io", // Specific to your error (Frankfurt region)
        port: "",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // You used Unsplash in your mock data earlier
        port: "",
      },
    ],
  },
};

export default nextConfig;
