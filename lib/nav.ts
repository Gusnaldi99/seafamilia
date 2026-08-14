/**
 * Active-nav section mapping, ported from tools/sync-partials.js's
 * ROUTE_NAV (the build-time filename→section map that used to drive
 * `aria-current="page"`). Verified directly against the source, including
 * the one entry ROUTE_NAV itself doesn't cover: policies.html carries an
 * explicit `<body data-page="story">` override rather than appearing in
 * the map, so `/policies` is listed under 'story' below too.
 *
 * Unlike the original (a single flat table keyed by filename, since every
 * screen was exactly one file), this is keyed by pathname *prefix* — several
 * old filenames now correspond to multiple new routes (e.g. `boat.html` and
 * `boats.html` both become /boats*).
 */
import type { TranslationKey } from './i18n/dictionaries';
import { routes } from './routes';

export type NavKey = 'home' | 'experiences' | 'destinations' | 'boats' | 'departures' | 'story' | 'journal';

export const PRIMARY_NAV: readonly { key: NavKey; href: string; i18n: TranslationKey; fallback: string }[] = [
  { key: 'experiences', href: routes.experiences(), i18n: 'nav.experiences', fallback: 'Experiences' },
  { key: 'destinations', href: routes.destinations(), i18n: 'nav.destinations', fallback: 'Destinations' },
  { key: 'boats', href: routes.boats(), i18n: 'nav.boats', fallback: 'Boats' },
  { key: 'departures', href: routes.departures(), i18n: 'nav.departures', fallback: 'Departures' },
  { key: 'story', href: routes.ourStory(), i18n: 'nav.story', fallback: 'Our Story' },
  { key: 'journal', href: routes.journal(), i18n: 'nav.journal', fallback: 'Journal' },
];

/** Ordered — first match wins. Mirrors ROUTE_NAV exactly:
 *  index→home, experiences/experience/discover→experiences,
 *  destinations/destination/trip→destinations, boats/boat/charter→boats,
 *  departures/departure/reserve→departures,
 *  our-story/faq/contact/partners(+policies override)→story,
 *  journal/article→journal. 404/error/components intentionally match
 *  nothing — "by design" per the original's own comment. */
const SECTIONS: readonly [RegExp, NavKey][] = [
  [/^\/$/, 'home'],
  [/^\/experiences/, 'experiences'],
  [/^\/plan/, 'experiences'], // discover.html → Experiences
  [/^\/destinations/, 'destinations'],
  [/^\/itineraries/, 'destinations'], // trip.html → Destinations
  [/^\/boats/, 'boats'],
  [/^\/charter/, 'boats'], // charter.html → Boats
  [/^\/departures/, 'departures'],
  [/^\/reserve/, 'departures'], // reserve.html → Departures
  [/^\/our-story/, 'story'],
  [/^\/faq/, 'story'],
  [/^\/contact/, 'story'],
  [/^\/partners/, 'story'],
  [/^\/policies/, 'story'], // no ROUTE_NAV entry originally — data-page="story" override
  [/^\/journal/, 'journal'],
];

export function navSection(pathname: string): NavKey | null {
  for (const [re, key] of SECTIONS) {
    if (re.test(pathname)) return key;
  }
  return null;
}
