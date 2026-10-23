import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    // A lockfile higher up the tree otherwise makes Next guess the wrong workspace root.
    root: __dirname,
    rules: {
      "*.css": {
        // Only our own stylesheets: next/font's generated CSS breaks if Tailwind rewrites its font URLs.
        condition: { path: /^src\// },
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
