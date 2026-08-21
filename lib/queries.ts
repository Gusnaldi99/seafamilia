/**
 * Lookups, filters and derived views, ported from assets/js/data.js §9.
 * Pure functions over the static arrays in lib/data — safe to call from
 * Server Components. `T | undefined` instead of the original's `T | null`
 * (plays better with TypeScript narrowing and Next's notFound()).
 */
import { articles, boats, departures, experiences, team, trips, waters } from './data';
import type { Article, ArticleBlock, Boat, CabinType, Departure, Experience, LengthSlug, PartySlug, RouteDay, Trip, Water } from './data/types';
import { lengths } from './data/taxonomy';
import { formatMonthLabel } from './format';

export const waterBySlug = (slug: string): Water | undefined => waters.find((w) => w.slug === slug);
export const boatBySlug = (slug: string): Boat | undefined => boats.find((b) => b.slug === slug);
export const tripBySlug = (slug: string): Trip | undefined => trips.find((tr) => tr.slug === slug);
export const experienceBySlug = (slug: string): Experience | undefined => experiences.find((e) => e.slug === slug);
export const articleBySlug = (slug: string): Article | undefined => articles.find((a) => a.slug === slug);
export const departureById = (id: string): Departure | undefined => departures.find((d) => d.id === id.toUpperCase());
/** Articles store the byline as a plain name string (`author:`), not a
 * slug — this is the only way to get from that name back to the person's
 * own record (and their photo path, keyed on their slug like everyone
 * else's content). */
export const teamMemberByName = (name: string) => team.find((p) => p.name === name);

export function lengthOf(nights: number): LengthSlug {
  const b = lengths.find((l) => nights >= l.min && nights <= l.max);
  return b ? b.slug : 'classic';
}

/** A trip's gateway is either a single round-trip port ("Labuan Bajo") or a
 * point-to-point route ("Ambon to Saumlaki") — split once, here, rather
 * than teaching every caller the same parsing (data.js's cards.departure
 * did this inline). */
export function gatewayParts(trip: Pick<Trip, 'gateway'>): { boards: string | null; disembarks: string | null } {
  const parts = trip.gateway ? trip.gateway.split(' to ') : [];
  const boards = parts[0] || null;
  const disembarks = parts[1] || boards;
  return { boards, disembarks };
}

export interface TripFilters {
  water?: string;
  boat?: string;
  experience?: string;
  length?: LengthSlug;
  party?: PartySlug;
  /** Free-text search across title, summary and water name. */
  q?: string;
}

/** Central trip filter. Every unset key is ignored, so it doubles as "all". */
export function filterTrips(f?: TripFilters): Trip[] {
  const q = f ?? {};
  const needle = (q.q ?? '').trim().toLowerCase();
  return trips.filter((tr) => {
    if (q.water && tr.water !== q.water) return false;
    if (q.boat && tr.boat !== q.boat) return false;
    if (q.experience && !tr.experiences.includes(q.experience)) return false;
    if (q.experience === 'diving' && !boatBySlug(tr.boat)?.offersDiving) return false;
    if (q.length && lengthOf(tr.nights) !== q.length) return false;
    if (q.party && !tr.party.includes(q.party)) return false;
    if (needle) {
      const hay = `${tr.title} ${tr.summary} ${waterBySlug(tr.water)?.name ?? ''}`.toLowerCase();
      if (!hay.includes(needle)) return false;
    }
    return true;
  });
}

export interface DepartureFilters {
  water?: string;
  boat?: string;
  experience?: string;
  length?: LengthSlug;
  /** YYYY-MM. */
  month?: string;
  guests?: number;
  /** Excludes closed/waitlist when true. */
  available?: boolean;
}

export function filterDepartures(f?: DepartureFilters): Departure[] {
  const q = f ?? {};
  return departures
    .filter((d) => {
      const tr = tripBySlug(d.trip);
      if (!tr) return false;
      if (q.water && tr.water !== q.water) return false;
      if (q.boat && d.boat !== q.boat) return false;
      if (q.experience && !tr.experiences.includes(q.experience)) return false;
      if (q.length && lengthOf(d.nights) !== q.length) return false;
      if (q.month && d.start.slice(0, 7) !== q.month) return false;
      if (q.guests && d.cabinsLeft * 2 < Number(q.guests)) return false;
      if (q.available && (d.status === 'closed' || d.status === 'waitlist')) return false;
      return true;
    })
    .sort((a, b) => (a.start < b.start ? -1 : 1));
}

export function departuresFor(tripSlug: string): Departure[] {
  return departures.filter((d) => d.trip === tripSlug && d.status !== 'closed').sort((a, b) => (a.start < b.start ? -1 : 1));
}
export function departuresOnBoat(boatSlug: string): Departure[] {
  return departures.filter((d) => d.boat === boatSlug && d.status !== 'closed').sort((a, b) => (a.start < b.start ? -1 : 1));
}
export function tripsOnBoat(boatSlug: string): Trip[] {
  return trips.filter((tr) => tr.boat === boatSlug);
}
export function tripsInWater(waterSlug: string): Trip[] {
  return trips.filter((tr) => tr.water === waterSlug);
}

/** Distinct YYYY-MM keys present in the departure set, sorted — feeds the
 * month filter. Deliberately returns bare keys, not {value,label} pairs:
 * the original's `label` was pre-formatted via a language-dependent
 * formatter, which can't run at module-eval time here. Format at render
 * with formatMonthLabel(key + '-01', {lang}). */
export function departureMonthKeys(): string[] {
  const seen = new Set<string>();
  departures.forEach((d) => seen.add(d.start.slice(0, 7)));
  return [...seen].sort();
}

/** Convenience: pre-formatted month options in a given language, for
 * components that don't need to defer formatting themselves. */
export function departureMonthOptions(lang: 'en' | 'id' = 'en'): { value: string; label: string }[] {
  return departureMonthKeys().map((key) => ({ value: key, label: formatMonthLabel(`${key}-01`, { lang }) }));
}

/** Day-by-day route. Hand-written where we have it, otherwise built from the
 * destination's anchorage list so an itinerary page is never blank. */
export function routeFor(trip: Trip | undefined): RouteDay[] {
  if (!trip) return [];
  if (trip.route && trip.route.length) return trip.route;
  const water = waterBySlug(trip.water);
  if (!water) return [];
  const stops = water.stops ?? [];
  const out: RouteDay[] = [];
  const n = Math.min(trip.nights, stops.length);
  for (let i = 0; i < n; i++) {
    const first = i === 0;
    const last = i === n - 1;
    out.push({
      day: String(i + 1),
      title: stops[i] + (first ? ' — board and go' : last ? ' — alongside' : ''),
      text: first
        ? 'Aboard by early afternoon, check dive, then a short sail to the first anchorage.'
        : last
          ? 'A last shallow reef at dawn, alongside mid-morning, transfers to the airport.'
          : `Diving and shore time around ${stops[i]}, with the day’s order set by the water.`,
      provisional: true,
    });
  }
  return out;
}

/** Fallback body for articles whose long-form copy has not been written yet
 * — stands in for a CMS field that has not been filled. */
export function bodyFor(article: Article | undefined): ArticleBlock[] {
  if (article?.body?.length) return article.body;
  if (!article) return [];
  return [
    { t: 'p', v: article.dek },
    { t: 'h2', v: 'From the boat' },
    {
      t: 'p',
      v: 'This piece is part of the Sea Familia journal, written by the people who are actually on the water — crew, cooks, captains and the biologists who join us as guest lecturers. We publish about twice a month, in between seasons and whenever somebody has something worth saying.',
    },
    { t: 'quote', v: 'Nobody on this boat is a content producer. That is rather the point.' },
    {
      t: 'p',
      v: 'If you would like the full piece as soon as it is edited, the familia letter goes out monthly and contains no marketing beyond the occasional note that a departure has opened up.',
    },
  ];
}

export interface SearchResults {
  trips: Trip[];
  waters: Water[];
  boats: Boat[];
  articles: Article[];
  total: number;
}

/** Global search across every content type — powers the header search panel. */
export function search(term: string): SearchResults {
  const n = (term ?? '').trim().toLowerCase();
  if (n.length < 2) return { trips: [], waters: [], boats: [], articles: [], total: 0 };
  const hit = (s: string | null | undefined) => (s ?? '').toLowerCase().includes(n);
  const r: SearchResults = {
    trips: trips.filter((x) => hit(x.title) || hit(x.summary) || hit(waterBySlug(x.water)?.name)).slice(0, 4),
    waters: waters.filter((x) => hit(x.name) || hit(x.blurb)).slice(0, 3),
    boats: boats.filter((x) => hit(x.name) || hit(x.type) || hit(x.tagline)).slice(0, 3),
    articles: articles.filter((x) => hit(x.title) || hit(x.dek) || hit(x.category)).slice(0, 3),
    total: 0,
  };
  r.total = r.trips.length + r.waters.length + r.boats.length + r.articles.length;
  return r;
}

export interface DerivedCabin extends CabinType {
  price: number;
}

/**
 * Per-date cabin availability + fare, derived from the boat's catalogue
 * grades capped by the departure's total `cabinsLeft`. This is the open
 * item HANDOFF §5 flags — production should send real per-date inventory
 * (`Departure.cabins`) — isolated behind this one function so switching to
 * that later is a one-function change.
 */
export function deriveCabinInventory(departure: Departure, boat: Boat): DerivedCabin[] {
  const base = Math.min(...boat.cabinTypes.map((c) => c.price));
  let remaining = departure.cabinsLeft;
  return boat.cabinTypes.map((c, i) => {
    const isLast = i === boat.cabinTypes.length - 1;
    const take = isLast ? remaining : Math.min(c.left, Math.max(0, remaining - 1));
    remaining -= take;
    const price = Math.round((departure.price + (c.price - base)) / 10) * 10;
    return { ...c, left: Math.max(0, take), price };
  });
}
