/** @type {import('next').NextConfig} */
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: new URL(process.env.API_URL).hostname,
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        // eslint-disable-next-line turbo/no-undeclared-env-vars
        destination: `${process.env.API_URL}/:path*`,
        basePath: false,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
