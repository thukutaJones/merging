import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  i18n: {
    locales: ["en", "ny", "tum"],
    defaultLocale: "en",
  },
};

export default nextConfig;
