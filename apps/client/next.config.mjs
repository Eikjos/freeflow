/** @type {import('next').NextConfig} */
import createNextIntlPlugin from "next-intl/plugin";
import { hostname } from "os";

const withNextIntl = createNextIntlPlugin(
  // Specify a custom path here
  "./i18n/request.ts"
);

const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: new URL(process.env.API_URL).hostname,
      },
    ],
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
