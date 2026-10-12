// @ts-check
/// <reference types="node" />
import { defineConfig } from 'astro/config';
import { staticRedirects, prefixRedirects, redirectStatus } from './src/content/redirects.mjs';

// Project Pages serve under https://<user>.github.io/<repo>/ .
// Once forward.one is attached as a custom domain, set BASE_PATH="/" and
// SITE_URL="https://forward.one" in .github/workflows/deploy.yml.
const SITE_URL = process.env.SITE_URL ?? 'https://tekka2026.github.io';
const BASE_PATH = process.env.BASE_PATH ?? '/forwardone';

// Astro does not prefix redirect destinations with `base`, so do it here.
const prefix = BASE_PATH === '/' ? '' : BASE_PATH.replace(/\/+$/, '');
const dest = (to) => `${prefix}${to}/`;

/** @type {Record<string, { status: 301, destination: string }>} */
const redirects = {};
for (const [from, to] of Object.entries(staticRedirects)) {
  redirects[from] = { status: redirectStatus, destination: dest(to) };
}
// Dynamic prefixes (/news/:slug, /portfolio-companies/:slug) are not handled
// here: Astro's dynamic redirects cannot carry the base path. Known slugs get
// a redirect page from src/pages/news/[slug].astro and
// src/pages/portfolio-companies/[slug].astro; unknown slugs fall through to
// src/pages/404.astro, which applies the same prefix map client-side.
void prefixRedirects;

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  trailingSlash: 'ignore',
  output: 'static',
  redirects,
  build: {
    format: 'directory',
    inlineStylesheets: 'never',
  },
});
