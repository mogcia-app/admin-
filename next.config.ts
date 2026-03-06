import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow dev asset requests from your LAN client.
  allowedDevOrigins: ["192.168.179.25"]
};

export default nextConfig;
