/**
 * next/font definitions, bound to the CSS variables app/globals.css's
 * `@theme` block already expects (--font-fraunces/-jost/-inter, wired to
 * font-display/font-mark/font-sans). Self-hosts and subsets automatically —
 * replaces the vendored assets/fonts/*.woff2 + assets/css/fonts.css pair,
 * which required a manual `node tools/vendor.js fonts` rebuild step.
 *
 * fonts.css requested a 300..600 weight window from Google's CSS2 API; the
 * `weight` option here only accepts discrete static weights or the literal
 * 'variable' (the full axis), not an arbitrary range — so this self-hosts
 * the complete variable font instead. A strict superset of the old window,
 * harmless since nothing in the markup asks for a weight outside 300–600.
 */
import { Fraunces, Inter, Jost } from 'next/font/google';

export const fraunces = Fraunces({
  subsets: ['latin', 'latin-ext'],
  axes: ['opsz'],
  style: ['normal', 'italic'],
  weight: 'variable',
  variable: '--font-fraunces',
  display: 'swap',
});

export const jost = Jost({
  subsets: ['latin', 'latin-ext'],
  weight: 'variable',
  variable: '--font-jost',
  display: 'swap',
});

export const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  weight: 'variable',
  variable: '--font-inter',
  display: 'swap',
});
