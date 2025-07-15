import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

const pwaConfig = withPWA({
  dest: "public",
  register: true,
});

const nextConfig: NextConfig = {
  /* config options here */
};

export default pwaConfig(nextConfig);
