'use client';

/**
 * The homepage's one stateful section, ported from index.html's
 * `itineraryIndex()`. No URL-synced filters here (the original never wired
 * any either) — only the `?state=` QA override is read, since
 * `forcedState()` was always a global read of the current page's query
 * string regardless of which component called `SEA.load()`.
 *
 * Reads that override via `window.location.search` in an effect rather
 * than `useSearchParams()` on purpose: this is the only listing island with
 * no real URL-synced filters, so `useSearchParams()` would exist solely to
 * satisfy Next's Suspense-boundary requirement for that hook — and this
 * component's own `<section>` sitting inside that boundary raced
 * RevealSections' DOM mutation (components/reveal-sections.tsx) against
 * the boundary's own hydration, throwing a real (if cosmetic) hydration-
 * mismatch warning on every load of `/`. Reading the query string
 * post-mount avoids needing Suspense at all, which removes the boundary
 * this raced against.
 */
import * as React from 'react';
import Link from 'next/link';
import { PhotoPlate } from '@/components/media/photo-plate';
import { EmptyState } from '@/components/states/empty-state';
import { ErrorState } from '@/components/states/error-state';
import { Money, Nights } from '@/components/providers/locale-provider';
import { ChevronRight } from '@/components/icons';
import { useListingLoad } from '@/hooks/use-listing-load';
import { boatBySlug, filterTrips, waterBySlug } from '@/lib/queries';
import { forcedStateFrom, emptied, type ForcedState } from '@/lib/qa';
import { PHOTO_SIZES } from '@/lib/photo-paths';
import { routes } from '@/lib/routes';
import { trips, waters, type LengthSlug } from '@/lib/data';

type Sort = 'water' | 'short' | 'long' | 'price';

const SORTERS: Record<Sort, (a: (typeof trips)[number], b: (typeof trips)[number]) => number> = {
  water: (a, b) => {
    const order = waters.map((w) => w.slug);
    return order.indexOf(a.water) - order.indexOf(b.water) || a.nights - b.nights;
  },
  short: (a, b) => a.nights - b.nights,
  long: (a, b) => b.nights - a.nights,
  price: (a, b) => a.from - b.from,
};

export function HomeItineraryIndex({ tripPhotos }: { tripPhotos: Record<string, string | null> }) {
  const [forced, setForced] = React.useState<ForcedState | null>(null);
  React.useEffect(() => {
    // Reads an external source (the URL) on mount, same as LocaleProvider's
    // localStorage read — not a value derivable from props/state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForced(forcedStateFrom(new URLSearchParams(window.location.search).get('state')));
  }, []);
  const { state, reload } = useListingLoad(forced);

  const [water, setWater] = React.useState('');
  const [length, setLength] = React.useState<LengthSlug | ''>('');
  const [sort, setSort] = React.useState<Sort>('water');

  const rows = React.useMemo(() => {
    const filtered = emptied(filterTrips({ water: water || undefined, length: length || undefined }), forced);
    return filtered.slice().sort(SORTERS[sort]);
  }, [water, length, sort, forced]);

  function reset() {
    setWater('');
    setLength('');
    setSort('water');
  }

  return (
    <section id="itineraries" className="border-y border-sand-300 bg-sand">
      <div className="mx-auto max-w-8xl px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="font-mark text-eyebrow uppercase text-flame">Itineraries index</p>
            <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl lg:text-5xl">
              Everything we sail, on one page
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink/70">
              Twelve routes across eight waters. Filter it down, or read the whole list — it is
              short on purpose.
            </p>
          </div>
          <p className="font-mark text-[11px] uppercase tracking-[0.16em] text-mist-700">
            {rows.length} of {trips.length} shown
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div
            className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-wrap lg:px-0"
            role="group"
            aria-label="Filter by water"
          >
            <button
              type="button"
              onClick={() => setWater('')}
              className={`shrink-0 rounded-full border px-4 py-2 font-mark text-[11px] uppercase tracking-[0.14em] transition ${
                water === '' ? 'border-ink bg-ink text-white' : 'border-sand-300 bg-white text-ink-700 hover:border-mist'
              }`}
            >
              All waters
            </button>
            {waters.map((w) => (
              <button
                key={w.slug}
                type="button"
                onClick={() => setWater(w.slug)}
                className={`shrink-0 rounded-full border px-4 py-2 font-mark text-[11px] uppercase tracking-[0.14em] transition ${
                  water === w.slug ? 'border-ink bg-ink text-white' : 'border-sand-300 bg-white text-ink-700 hover:border-mist'
                }`}
              >
                {w.short}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2">
              <span className="w-12 shrink-0 font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Length</span>
              <select
                value={length}
                onChange={(e) => setLength(e.target.value as LengthSlug | '')}
                className="h-11 rounded-full border border-sand-300 bg-white pl-4 pr-9 font-mark text-[12px] uppercase tracking-[0.1em] text-ink-700"
              >
                <option value="">Any</option>
                <option value="short">3 – 5 nights</option>
                <option value="classic">6 – 8 nights</option>
                <option value="long">9 – 14 nights</option>
              </select>
            </label>
            <label className="flex items-center gap-2">
              <span className="w-12 shrink-0 font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Sort</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="h-11 rounded-full border border-sand-300 bg-white pl-4 pr-9 font-mark text-[12px] uppercase tracking-[0.1em] text-ink-700"
              >
                <option value="water">By water</option>
                <option value="short">Shortest first</option>
                <option value="long">Longest first</option>
                <option value="price">Lowest price</option>
              </select>
            </label>
          </div>
        </div>

        {state === 'loading' ? (
          <div className="mt-8 space-y-3">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="flex items-center gap-4 rounded-2xl border border-sand-300 bg-white p-4">
                <div className="skeleton h-16 w-24 rounded-xl" />
                <div className="flex-1">
                  <div className="skeleton h-5 w-1/3" />
                  <div className="skeleton mt-2.5 h-3.5 w-1/2" />
                </div>
                <div className="skeleton hidden h-5 w-20 sm:block" />
              </div>
            ))}
          </div>
        ) : state === 'error' ? (
          <div className="mt-8">
            <ErrorState onRetry={reload} />
          </div>
        ) : rows.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="No itinerary matches both filters"
              body="Try one filter at a time — or ask us. Some of our best weeks are the ones that never fit a dropdown."
              onReset={reset}
              altHref={routes.plan()}
              altLabel="Plan your trip"
            />
          </div>
        ) : (
          <ol className="mt-8 divide-y divide-sand-300 border-y border-sand-300">
            {rows.map((t) => {
              const w = waterBySlug(t.water);
              const b = boatBySlug(t.boat);
              return (
                <li key={t.slug}>
                  <Link
                    href={routes.trip(t.slug)}
                    className="group grid grid-cols-[4.5rem_1fr] items-center gap-4 py-4 transition hover:bg-white/70 sm:grid-cols-[6rem_1fr_auto] sm:gap-6 sm:py-5"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-ink">
                      <PhotoPlate ph={t.ph} src={tripPhotos[t.slug] ?? null} alt={t.title} sizes={PHOTO_SIZES.searchRow} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h3 className="font-display text-lg text-ink-700 transition-colors group-hover:text-flame-600 sm:text-xl">
                          {t.title}
                        </h3>
                        {t.editorPick ? (
                          <span className="font-mark text-[10px] uppercase tracking-[0.16em] text-flame">Editor&rsquo;s pick</span>
                        ) : null}
                      </div>
                      <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-mist-700 sm:text-sm">
                        <span>{w?.short ?? '—'}</span>
                        <span aria-hidden="true">·</span>
                        <Nights n={t.nights} />
                        <span aria-hidden="true">·</span>
                        <span>{b?.name ?? '—'}</span>
                      </p>
                      <p className="mt-1.5 line-clamp-1 text-xs text-ink/70 sm:hidden">
                        from <Money usd={t.from} />
                      </p>
                    </div>
                    <div className="hidden items-center gap-6 sm:flex">
                      <div className="text-right">
                        <div className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">From</div>
                        <div className="tnum font-display text-lg text-deep-700">
                          <Money usd={t.from} />
                        </div>
                      </div>
                      <span className="grid h-10 w-10 place-items-center rounded-full border border-sand-300 text-ink-700 transition group-hover:border-flame group-hover:bg-flame group-hover:text-white">
                        <ChevronRight className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </section>
  );
}
