import type { NextConfig } from "next";
import { cities } from "./lib/data/cities";

// 301 redirects for renamed service slugs.
// Add an entry when a service slug changes — preserves SEO and external links.
const SERVICE_SLUG_REDIRECTS: Array<{ from: string; to: string }> = [
  { from: "post-emergency", to: "restorative-cleaning" },
  // 2026-08-02: the jobsite version of this service was never something the
  // crew could deliver. Reframed to what they actually do — make-ready turns
  // for renovated multifamily units — so the slug had to follow the content.
  { from: "post-construction", to: "make-ready-cleaning" },
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
