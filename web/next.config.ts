import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turborepo 모노레포 루트 지정 (다중 lockfile 경고 방지)
  turbopack: { root: ".." },
};

export default nextConfig;
