'use client';

/** Ported from departures.html's `departureSearch()` — the biggest filter
 * component on the site: 6 filters, a sort, and results grouped by month
 * (or one flat group when sorting by something other than date). */
import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CardSkeleton } from '@/components/states/card-skeleton';
import { EmptyState } from '@/components/states/empty-state';
import { ErrorState } from '@/components/states/error-state';
import { useListingLoad } from '@/hooks/use-listing-load';
import { departureMonthOptions, filterDepartures, type DepartureFilters } from '@/lib/queries';
import { formatMonthLabel } from '@/lib/format';
import { forcedStateFrom, emptied } from '@/lib/qa';
import { routes } from '@/lib/routes';
import { boats, departures, lengths, waters, type LengthSlug } from '@/lib/data';

type Filters = {
  water: string;
  month: string;
  length: LengthSlug | '';
  boat: string;
  /** Deep-link-only, same as the original: filterable via ?experience= but
   * with no visible control in the search panel below. */
  experience: string;
  guests: string;
  available: boolean;
};
const EMPTY_FILTERS: Filters = { water: '', month: '', length: '', boat: '', experience: '', guests: '', available: false };
type Sort = 'date' | 'price' | 'length';

const GUEST_COUNTS = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20];

const SORTERS: Record<Sort, (a: (typeof departures)[number], b: (typeof departures)[number]) => number> = {
  date: (a, b) => (a.start < b.start ? -1 : 1),
  price: (a, b) => a.price - b.price,
  length: (a, b) => a.nights - b.nights,
};

export function DepartureSearch({ departureCards }: { departureCards: Record<string, React.ReactNode> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const forced = forcedStateFrom(searchParams.get('state'));
  const { state, reload } = useListingLoad(forced, 560);
  const months = React.useMemo(() => departureMonthOptions(), []);

  const [f, setF] = React.useState<Filters>(() => ({
    water: searchParams.get('water') ?? '',
    month: searchParams.get('month') ?? '',
    length: (searchParams.get('length') as LengthSlug | null) ?? '',
    boat: searchParams.get('boat') ?? '',
    experience: searchParams.get('experience') ?? '',
    guests: searchParams.get('guests') ?? '',
    available: searchParams.get('available') === '1' || searchParams.get('available') === 'true',
  }));
  const [sort, setSort] = React.useState<Sort>((searchParams.get('sort') as Sort | null) ?? 'date');

  const isFiltered = Object.entries(f).some(([, v]) => v !== '' && v !== false);

  const rows = React.useMemo(() => {
    const query: DepartureFilters = {
      water: f.water || undefined,
      month: f.month || undefined,
      length: f.length || undefined,
      boat: f.boat || undefined,
      experience: f.experience || undefined,
      guests: f.guests ? Number(f.guests) : undefined,
      available: f.available || undefined,
    };
    const filtered = emptied(filterDepartures(query), forced);
    return filtered.slice().sort(SORTERS[sort]);
  }, [f, sort, forced]);

  const groups = React.useMemo(() => {
    if (sort !== 'date') return [{ key: 'all', label: 'Matching departures', items: rows }];
    const out: { key: string; label: string; items: typeof rows }[] = [];
    for (const d of rows) {
      const key = d.start.slice(0, 7);
      let g = out.find((x) => x.key === key);
      if (!g) {
        g = { key, label: formatMonthLabel(`${key}-01`), items: [] };
        out.push(g);
      }
      g.items.push(d);
    }
    return out;
  }, [rows, sort]);

  React.useEffect(() => {
    // `available` is serialized as '1' (not 'true'), matching the original's
    // URL format exactly — routes.departures()'s param type doesn't cover
    // `sort`/this string form, so this builds the query object directly
    // rather than fighting DepartureFilters' declared (boolean) shape.
    const params = {
      water: f.water || undefined,
      month: f.month || undefined,
      length: f.length || undefined,
      boat: f.boat || undefined,
      experience: f.experience || undefined,
      guests: f.guests ? Number(f.guests) : undefined,
      sort,
      available: f.available ? '1' : undefined,
    };
    const target = routes.departures(params as unknown as DepartureFilters);
    if (target !== `${window.location.pathname}${window.location.search}`) {
      router.replace(target, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [f, sort]);

  function reset() {
    setF(EMPTY_FILTERS);
    setSort('date');
  }

  return (
    <>
      <section className="border-b border-sand-300 bg-white lg:sticky lg:top-20 lg:z-20">
        <div className="mx-auto max-w-8xl px-5 py-5 sm:px-6 lg:px-8">
          <form onSubmit={(e) => e.preventDefault()} className="grid gap-3 lg:grid-cols-12 lg:items-end">
            <label className="block lg:col-span-3">
              <span className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Water</span>
              <select
                value={f.water}
                onChange={(e) => setF((p) => ({ ...p, water: e.target.value }))}
                className="mt-1.5 h-12 w-full rounded-xl border border-sand-300 bg-sand text-ink-700"
              >
                <option value="">Anywhere we sail</option>
                {waters.map((w) => (
                  <option key={w.slug} value={w.slug}>
                    {w.short}
                  </option>
                ))}
              </select>
            </label>

            <label className="block lg:col-span-3">
              <span className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Month</span>
              <select
                value={f.month}
                onChange={(e) => setF((p) => ({ ...p, month: e.target.value }))}
                className="mt-1.5 h-12 w-full rounded-xl border border-sand-300 bg-sand text-ink-700"
              >
                <option value="">Any month</option>
                {months.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block lg:col-span-2">
              <span className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Length</span>
              <select
                value={f.length}
                onChange={(e) => setF((p) => ({ ...p, length: e.target.value as LengthSlug | '' }))}
                className="mt-1.5 h-12 w-full rounded-xl border border-sand-300 bg-sand text-ink-700"
              >
                <option value="">Any</option>
                {lengths.map((l) => (
                  <option key={l.slug} value={l.slug}>
                    {l.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block lg:col-span-2">
              <span className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Boat</span>
              <select
                value={f.boat}
                onChange={(e) => setF((p) => ({ ...p, boat: e.target.value }))}
                className="mt-1.5 h-12 w-full rounded-xl border border-sand-300 bg-sand text-ink-700"
              >
                <option value="">Either boat</option>
                {boats.map((b) => (
                  <option key={b.slug} value={b.slug}>
                    {b.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block lg:col-span-2">
              <span className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Guests</span>
              <select
                value={f.guests}
                onChange={(e) => setF((p) => ({ ...p, guests: e.target.value }))}
                className="mt-1.5 h-12 w-full rounded-xl border border-sand-300 bg-sand text-ink-700"
              >
                <option value="">Any number</option>
                {GUEST_COUNTS.map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'guest' : 'guests'}
                  </option>
                ))}
              </select>
            </label>
          </form>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-sand-200 pt-4">
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={f.available}
                  onChange={(e) => setF((p) => ({ ...p, available: e.target.checked }))}
                  className="h-5 w-5 rounded border-sand-300 text-flame"
                />
                <span className="text-sm text-ink/80">Only dates with cabins left</span>
              </label>
              <label className="flex items-center gap-2">
                <span className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Sort</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as Sort)}
                  className="h-10 rounded-full border border-sand-300 bg-white pl-3.5 pr-9 font-mark text-[11px] uppercase tracking-[0.1em] text-ink-700"
                >
                  <option value="date">Soonest first</option>
                  <option value="price">Lowest price</option>
                  <option value="length">Shortest first</option>
                </select>
              </label>
            </div>

            <div className="flex items-center gap-4">
              <p className="text-sm text-ink/70" aria-live="polite">
                {state === 'loading' ? (
                  <span className="text-mist-700">Checking the schedule…</span>
                ) : (
                  <span>
                    <strong className="font-display text-lg text-ink-700">{rows.length}</strong>{' '}
                    {rows.length === 1 ? 'departure' : 'departures'}
                  </span>
                )}
              </p>
              {isFiltered ? (
                <button type="button" onClick={reset} className="font-mark text-[11px] uppercase tracking-[0.16em] text-flame-600 underline underline-offset-4">
                  Clear
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-8xl px-5 py-10 sm:px-6 lg:px-8 lg:py-14">
        {state === 'loading' ? (
          <div className="space-y-3">
            <CardSkeleton kind="departure" count={5} />
          </div>
        ) : state === 'error' ? (
          <ErrorState onRetry={reload} />
        ) : rows.length === 0 ? (
          <EmptyState
            title="No departure matches that search"
            body="Seasons are regional, so a month and a water can rule each other out. Try clearing the month first — or let us know what you want and we will tell you when it opens."
            onReset={reset}
            resetLabel="Clear the search"
            altHref={routes.charter()}
            altLabel="Charter your own dates"
          />
        ) : (
          <div className="space-y-10">
            {groups.map((g) => (
              <div key={g.key}>
                <div className="mb-4 flex items-baseline gap-4">
                  <h2 className="font-display text-2xl font-light text-ink-700">{g.label}</h2>
                  <span className="h-px flex-1 bg-sand-300" />
                  <span className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">
                    {g.items.length} {g.items.length === 1 ? 'date' : 'dates'}
                  </span>
                </div>
                <div className="space-y-3">
                  {g.items.map((d) => (
                    <React.Fragment key={d.id}>{departureCards[d.id]}</React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
