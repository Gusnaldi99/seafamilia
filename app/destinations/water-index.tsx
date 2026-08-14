'use client';

/**
 * Ported from destinations.html's `waterIndex()`. Reads the initial
 * `?experience=` filter from the URL but — unlike tripGrid below it on the
 * same page — never writes back to the URL either, matching the original
 * exactly (its `apply()` has no `history.replaceState` call).
 */
import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { CardSkeleton } from '@/components/states/card-skeleton';
import { EmptyState } from '@/components/states/empty-state';
import { ErrorState } from '@/components/states/error-state';
import { useListingLoad } from '@/hooks/use-listing-load';
import { forcedStateFrom, emptied } from '@/lib/qa';
import { experiences, waters } from '@/lib/data';

export function WaterIndex({ waterCards }: { waterCards: Record<string, React.ReactNode> }) {
  const searchParams = useSearchParams();
  const forced = forcedStateFrom(searchParams.get('state'));
  const { state, reload } = useListingLoad(forced);

  const [experience, setExperience] = React.useState(() => searchParams.get('experience') ?? '');

  const rows = React.useMemo(() => {
    const filtered = experience ? waters.filter((w) => w.bestFor.includes(experience)) : waters.slice();
    return emptied(filtered, forced);
  }, [experience, forced]);

  return (
    <section className="mx-auto max-w-8xl px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
      <h2 className="sr-only">The eight waters</h2>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-wrap lg:px-0" role="group" aria-label="Filter waters by experience">
          <button
            type="button"
            onClick={() => setExperience('')}
            className={`shrink-0 rounded-full border px-4 py-2 font-mark text-[11px] uppercase tracking-[0.14em] transition ${
              experience === '' ? 'border-ink bg-ink text-white' : 'border-sand-300 text-ink-700 hover:border-mist'
            }`}
          >
            All eight
          </button>
          {experiences.map((e) => (
            <button
              key={e.slug}
              type="button"
              onClick={() => setExperience(e.slug)}
              className={`shrink-0 rounded-full border px-4 py-2 font-mark text-[11px] uppercase tracking-[0.14em] transition ${
                experience === e.slug ? 'border-ink bg-ink text-white' : 'border-sand-300 text-ink-700 hover:border-mist'
              }`}
            >
              Best for {e.name.toLowerCase()}
            </button>
          ))}
        </div>
        <p className="font-mark text-[11px] uppercase tracking-[0.16em] text-mist-700" aria-live="polite">
          {rows.length} of 8 waters
        </p>
      </div>

      {state === 'loading' ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <CardSkeleton kind="water" count={4} />
        </div>
      ) : state === 'error' ? (
        <div className="mt-10">
          <ErrorState onRetry={reload} />
        </div>
      ) : rows.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No water is built for that, yet"
            body="We only claim a region is right for something when it genuinely is. Clear the filter to see all eight, or tell us what you are after."
            onReset={() => setExperience('')}
            resetLabel="Show all eight"
          />
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {rows.map((w) => (
            <React.Fragment key={w.slug}>{waterCards[w.slug]}</React.Fragment>
          ))}
        </div>
      )}
    </section>
  );
}
