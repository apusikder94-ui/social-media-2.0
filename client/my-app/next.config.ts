import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },

  allowedDevOrigins: ["https://vagrom-kimbra-oversimply.ngrok-free.dev"],
};

export default nextConfig;