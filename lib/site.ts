/** Canonical origin for absolute URLs (sitemap, robots) — overridable per
 * environment since the production domain isn't fixed at build time. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.seafamilia.com';
