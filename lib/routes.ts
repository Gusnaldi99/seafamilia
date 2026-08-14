/**
 * Typed URL builders, replacing assets/js/data.js's `href()` (§10) and the
 * ~300 hardcoded `*.html?slug=...` strings scattered across the original
 * markup. Every navigation in the app should go through this module rather
 * than a hand-built template string.
 *
 * Detail routes take a slug/id directly (they're real dynamic segments now,
 * not `?slug=` query params — see the routing map in the migration plan).
 * Listing/funnel routes take an optional filter/entry object serialized as
 * a query string via withQuery, which drops undefined/null/empty values —
 * the same behavior as the original href().
 */
import type { DepartureFilters, TripFilters } from './queries';

type QueryValue = string | number | boolean | undefined | null;
type QueryParams = Record<string, QueryValue>;

function withQuery(path: string, params?: QueryParams): string {
  if (!params) return path;
  const parts: string[] = [];
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === '') continue;
    parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
  }
  return parts.length ? `${path}?${parts.join('&')}` : path;
}

export interface JournalFilters {
  category?: string;
  q?: string;
}

/** `/reserve` entry params — shape owned by the reserve feature (a later
 * phase); kept loose here so this module doesn't need to change when that
 * feature's exact state design lands. */
export interface ReserveEntry {
  dep?: string;
  cabin?: string;
  guests?: number;
  step?: number;
  ref?: string;
}

/** `/charter` entry params — shape owned by the charter feature. */
export interface CharterEntry {
  boat?: string;
  water?: string;
  step?: number;
}

/** `/plan` (guided discovery) entry params — shape owned by the discover
 * feature. `''`/`'any'` vs omitted encodes "no preference" vs "unanswered";
 * see the migration plan's discover.html findings for why this matters. */
export interface PlanEntry {
  step?: number;
  experience?: string;
  water?: string;
  length?: string;
  party?: string;
  guests?: number;
}

export const routes = {
  home: () => '/',

  experiences: (f?: TripFilters) => withQuery('/experiences', f as QueryParams),
  experience: (slug: string) => `/experiences/${slug}`,

  destinations: (f?: TripFilters) => withQuery('/destinations', f as QueryParams),
  /** Screen 8 (journey listing) is the #itineraries section on /destinations
   * today, not a separate screen — see the migration plan's routing map. */
  itineraries: () => '/destinations#itineraries',
  destination: (slug: string) => `/destinations/${slug}`,

  boats: () => '/boats',
  boat: (slug: string) => `/boats/${slug}`,

  trip: (slug: string) => `/itineraries/${slug}`,

  departures: (f?: DepartureFilters) => withQuery('/departures', f as QueryParams),
  departure: (id: string) => `/departures/${id.toUpperCase()}`,

  journal: (f?: JournalFilters) => withQuery('/journal', f as QueryParams),
  article: (slug: string) => `/journal/${slug}`,

  plan: (entry?: PlanEntry) => withQuery('/plan', entry as QueryParams),
  reserve: (entry?: ReserveEntry) => withQuery('/reserve', entry as QueryParams),
  charter: (entry?: CharterEntry) => withQuery('/charter', entry as QueryParams),

  contact: (o?: { ref?: string; topic?: string }) => withQuery('/contact', o as QueryParams),
  ourStory: () => '/our-story',
  faq: (q?: string) => withQuery('/faq', q ? { q } : undefined),
  policies: (anchor?: 'privacy' | 'terms' | 'cancellation' | 'safety' | 'accessibility') =>
    anchor ? `/policies#${anchor}` : '/policies',
  partners: () => '/partners',

  designSystem: () => '/design-system',
  maintenance: () => '/maintenance',
} as const;
