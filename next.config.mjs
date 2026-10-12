

/** @type {import("next").NextConfig} */
const config = {
  experimental: { serverActions: { bodySizeLimit: "12mb" } },
  serverExternalPackages: ["pg"],
  poweredByHeader: false,
  async headers() {
    return [{
      source: "/(.*)",
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      ],
    }];
  },
};
export default config;
