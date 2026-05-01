import type { NextConfig } from "next";
import { cities } from "./lib/data/cities";

// 301 redirects for renamed service slugs.
// Add an entry when a service slug changes — preserves SEO and external links.
const SERVICE_SLUG_REDIRECTS: Array<{ from: string; to: string }> = [
  { from: "post-emergency", to: "restorative-cleaning" },
];

function buildServiceRedirects() {
  const redirects: Array<{ source: string; destination: string; permanent: boolean }> = [];
  for (const { from, to } of SERVICE_SLUG_REDIRECTS) {
    // /services/[old] -> /services/[new]
    redirects.push({
      source: `/services/${from}`,
      destination: `/services/${to}`,
      permanent: true,
    });
    // /[city]/[old] -> /[city]/[new] for every city
    for (const city of cities) {
      redirects.push({
        source: `/${city.slug}/${from}`,
        destination: `/${city.slug}/${to}`,
        permanent: true,
      });
    }
  }
  return redirects;
}

const nextConfig: NextConfig = {
  async redirects() {
    return buildServiceRedirects();
  },
};

export default nextConfig;
