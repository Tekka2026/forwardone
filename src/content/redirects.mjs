/**
 * Redirect map: old URL → new URL.
 *
 * Plain JS (not TS) because astro.config.mjs imports it at config time.
 * Also consumed by public/404.html for the dynamic ones GitHub Pages cannot
 * serve as real redirects.
 *
 * NOTE: GitHub Pages cannot send HTTP 301s. Astro emits a meta-refresh page
 * for each static entry; the 404 page handles the dynamic ones client-side.
 * On a host with server redirects (Netlify, Vercel, Cloudflare) this same map
 * can be exported to its redirect format and the status codes below apply.
 */

/** Static, one-to-one. Key = old path, value = new path. */
export const staticRedirects = {
  '/about-us': '/about',
  '/investor': '/investors',
  '/news': '/insights/news',
  '/media-kit': '/insights/media-kit',
  '/sfdr': '/investors/sfdr',
};

/**
 * Dynamic: a prefix that maps onto a new prefix, keeping the slug.
 * `/news/:slug` → `/insights/news/:slug`
 * `/portfolio-companies/:slug` → `/portfolio/:slug`
 */
export const prefixRedirects = {
  '/news/': '/insights/news/',
  '/portfolio-companies/': '/portfolio/',
};

export const redirectStatus = 301;
