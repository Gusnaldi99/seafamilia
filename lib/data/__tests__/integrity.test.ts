/**
 * Ported from tools/check-data.js — the content-model smoke test that ran
 * against window.SEA. Covers everything buildable at this phase (data +
 * queries + format). The original also rendered every `SEA.cards.*` string
 * renderer against every record and grepped for leaked undefined/NaN/null;
 * that check now lives in components/cards/__tests__/cards.test.tsx, since
 * it needs jsdom + @testing-library/react rendering rather than the plain
 * function calls this file makes.
 */
import { describe, expect, it } from 'vitest';
import { articles, boats, departures, experiences, faq, team, trips, waters } from '..';
import type { PhVariant } from '../types';
import { CURRENCIES, type CurrencyCode } from '../../i18n/currencies';
import { DICTIONARIES, type Lang } from '../../i18n/dictionaries';
import {
  articleBySlug,
  boatBySlug,
  bodyFor,
  departureById,
  experienceBySlug,
  filterDepartures,
  filterTrips,
  routeFor,
  teamMemberByName,
  tripBySlug,
  waterBySlug,
} from '../../queries';
import { formatDate, formatDateRange, formatGuests, formatMoney, formatMonthLabel, formatNights, formatReference } from '../../format';

const PH_VARIANTS: readonly PhVariant[] = [
  'reef', 'deep', 'lagoon', 'volcano', 'sunset', 'village', 'jungle', 'boat', 'cabin', 'market', 'night', 'portrait',
];
const CURRENCY_CODES = Object.keys(CURRENCIES) as CurrencyCode[];
const LANGS = Object.keys(DICTIONARIES) as Lang[];

describe('content counts (transcription tripwire)', () => {
  it('matches the verified source counts', () => {
    expect(experiences).toHaveLength(6);
    expect(waters).toHaveLength(8);
    expect(boats).toHaveLength(4);
    expect(trips).toHaveLength(12);
    expect(departures).toHaveLength(16);
    expect(articles).toHaveLength(8);
    expect(team).toHaveLength(6);
    expect(faq).toHaveLength(12);
    expect(boats.flatMap((b) => b.cabinTypes)).toHaveLength(16);
  });
});

describe('referential integrity', () => {
  it('every trip.water resolves', () => {
    for (const tr of trips) expect(waterBySlug(tr.water), `trip ${tr.slug} → water ${tr.water}`).toBeDefined();
  });
  it('every trip.boat resolves', () => {
    for (const tr of trips) expect(boatBySlug(tr.boat), `trip ${tr.slug} → boat ${tr.boat}`).toBeDefined();
  });
  it('every trip.experiences[] resolves', () => {
    for (const tr of trips) {
      for (const slug of tr.experiences) {
        expect(experienceBySlug(slug), `trip ${tr.slug} → experience ${slug}`).toBeDefined();
      }
    }
  });
  it('every departure.trip and departure.boat resolves', () => {
    for (const d of departures) {
      expect(tripBySlug(d.trip), `departure ${d.id} → trip ${d.trip}`).toBeDefined();
      expect(boatBySlug(d.boat), `departure ${d.id} → boat ${d.boat}`).toBeDefined();
    }
  });
  it('every water.bestFor[] resolves (or the discovery filter would silently drop it)', () => {
    for (const w of waters) {
      for (const slug of w.bestFor) {
        expect(experienceBySlug(slug), `water ${w.slug} → experience ${slug}`).toBeDefined();
      }
    }
  });
  it('every article.author matches a team member', () => {
    for (const a of articles) {
      expect(teamMemberByName(a.author), `article ${a.slug} → author "${a.author}"`).toBeDefined();
    }
  });
  it('every ph value is a real placeholder variant', () => {
    const all = [
      ...experiences.map((e) => e.ph),
      ...waters.map((w) => w.ph),
      ...boats.map((b) => b.ph),
      ...boats.flatMap((b) => b.gallery),
      ...boats.flatMap((b) => b.cabinTypes.map((c) => c.ph)),
      ...trips.map((t) => t.ph),
      ...articles.map((a) => a.ph),
      ...team.map((m) => m.ph),
    ];
    for (const ph of all) expect(PH_VARIANTS, `unknown ph variant "${ph}"`).toContain(ph);
  });
  it('highlights are exactly 3 entries (trips and waters)', () => {
    for (const tr of trips) expect(tr.highlights, `trip ${tr.slug}`).toHaveLength(3);
    for (const w of waters) expect(w.highlights, `water ${w.slug}`).toHaveLength(3);
  });
});

describe('lookups return undefined for an unknown slug', () => {
  it.each([
    ['waterBySlug', waterBySlug],
    ['boatBySlug', boatBySlug],
    ['tripBySlug', tripBySlug],
    ['experienceBySlug', experienceBySlug],
    ['articleBySlug', articleBySlug],
  ] as const)('%s', (_name, fn) => {
    expect(fn('does-not-exist')).toBeUndefined();
  });
  it('departureById', () => {
    expect(departureById('NOPE-0000-XXX')).toBeUndefined();
  });
});

describe('routeFor / bodyFor never render blank', () => {
  it('every trip has a non-empty route (hand-written or synthesized)', () => {
    for (const tr of trips) {
      const route = routeFor(tr);
      expect(route.length, `trip ${tr.slug}`).toBeGreaterThan(0);
    }
  });
  it('synthesized routes are flagged provisional; hand-written ones are not', () => {
    const withRoute = tripBySlug('manta-passage')!;
    expect(routeFor(withRoute).some((d) => d.provisional)).toBe(false);
    const withoutRoute = tripBySlug('misool-slowly')!;
    expect(routeFor(withoutRoute).every((d) => d.provisional)).toBe(true);
  });
  it('every article has a non-empty body (hand-written or synthesized from the dek)', () => {
    for (const a of articles) expect(bodyFor(a).length, `article ${a.slug}`).toBeGreaterThan(0);
  });
});

describe('filters', () => {
  it('filterTrips narrows by water', () => {
    const komodo = filterTrips({ water: 'komodo' });
    expect(komodo.length).toBeGreaterThan(0);
    expect(komodo.every((t) => t.water === 'komodo')).toBe(true);
  });
  it('filterDepartures excludes closed/waitlist when available=true', () => {
    const open = filterDepartures({ available: true });
    expect(open.every((d) => d.status !== 'closed' && d.status !== 'waitlist')).toBe(true);
  });
  it('filterDepartures sorts by start date ascending', () => {
    const all = filterDepartures();
    for (let i = 1; i < all.length; i++) expect(all[i].start >= all[i - 1].start).toBe(true);
  });
});

describe('formatters never leak undefined/NaN/null across every currency and language', () => {
  const BAD = /undefined|NaN|null|\[object/i;

  it.each(CURRENCY_CODES)('formatMoney — %s', (currency) => {
    for (const lang of LANGS) {
      expect(formatMoney(3450, { currency, lang })).not.toMatch(BAD);
      expect(formatMoney(null, { currency, lang })).not.toMatch(BAD);
      expect(formatMoney(undefined, { currency, lang })).not.toMatch(BAD);
    }
  });

  it.each(LANGS)('formatDate / formatDateRange / formatMonthLabel — %s', (lang) => {
    expect(formatDate('2026-08-22', { lang })).not.toMatch(BAD);
    expect(formatDateRange('2026-08-22', 7, { lang })).not.toMatch(BAD);
    expect(formatMonthLabel('2026-08-01', { lang })).not.toMatch(BAD);
    // invalid input must fall back cleanly, never crash or leak
    expect(formatDate('not-a-date', { lang })).not.toMatch(BAD);
  });

  it.each(LANGS)('formatNights / formatGuests — %s', (lang) => {
    for (const n of [0, 1, 2, 7]) {
      expect(formatNights(n, { lang })).not.toMatch(BAD);
      expect(formatGuests(n, { lang })).not.toMatch(BAD);
    }
    expect(formatNights(null, { lang })).not.toMatch(BAD);
    expect(formatGuests(null, { lang })).not.toMatch(BAD);
  });

  it('formatReference is deterministic for a given seed and always SF-prefixed', () => {
    expect(formatReference(12345)).toBe(formatReference(12345));
    expect(formatReference(12345)).toMatch(/^SF-[ACDEFGHJKLMNPQRTUVWXY3479]{6}$/);
  });
});

describe('i18n dictionary parity', () => {
  it('en and id define exactly the same keys', () => {
    const [en, id] = LANGS.map((l) => Object.keys(DICTIONARIES[l]).sort());
    expect(id).toEqual(en);
  });
});
