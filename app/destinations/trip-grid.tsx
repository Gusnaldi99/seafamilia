'use client';

/** Ported from destinations.html's `tripGrid()` — deep-linkable from the
 * footer (destinations.html?length=short) and kept shareable via
 * replaceState as filters change. */
import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CardSkeleton } from '@/components/states/card-skeleton';
import { EmptyState } from '@/components/states/empty-state';
import { ErrorState } from '@/components/states/error-state';
import { useListingLoad } from '@/hooks/use-listing-load';
import { filterTrips, type TripFilters } from '@/lib/queries';
import { forcedStateFrom, emptied } from '@/lib/qa';
import { routes } from '@/lib/routes';
import { boats, experiences, lengths, waters, type LengthSlug } from '@/lib/data';

type Filters = { water: string; experience: string; length: LengthSlug | ''; boat: string };
const EMPTY_FILTERS: Filters = { water: '', experience: '', length: '', boat: '' };

export function TripGrid({ tripCards }: { tripCards: Record<string, React.ReactNode> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const forced = forcedStateFrom(searchParams.get('state'));
  const { state, reload } = useListingLoad(forced);

  const [f, setF] = React.useState<Filters>(() => ({
    water: searchParams.get('water') ?? '',
    experience: searchParams.get('experience') ?? '',
    length: (searchParams.get('length') as LengthSlug | null) ?? '',
    boat: searchParams.get('boat') ?? '',
  }));

  const isFiltered = f.water !== '' || f.experience !== '' || f.length !== '' || f.boat !== '';

  const rows = React.useMemo(() => {
    const query: TripFilters = {
      water: f.water || undefined,
      experience: f.experience || undefined,
      length: f.length || undefined,
      boat: f.boat || undefined,
    };
    return emptied(filterTrips(query), forced);
  }, [f, forced]);

  React.useEffect(() => {
    const target = `${routes.destinations(f as TripFilters)}#itineraries`;
    if (target !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
      router.replace(target, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [f]);

  function reset() {
    setF(EMPTY_FILTERS);
  }

  return (
    <section id="itineraries" className="mx-auto max-w-8xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-xl">
          <p className="font-mark text-eyebrow uppercase text-flame">Itineraries</p>
          <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl lg:text-5xl">
            Every route we sail
          </h2>
        </div>
        <a href={routes.plan()} className="group inline-flex items-center gap-2 font-mark text-[11px] uppercase tracking-[0.18em] text-ink-700 hover:text-flame-600">
          Let us narrow it down instead
        </a>
      </div>

      <div className="mt-8 grid gap-4 rounded-3xl border border-sand-300 bg-sand p-5 sm:grid-cols-2 lg:grid-cols-4 lg:p-6">
        <label className="block">
          <span className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Water</span>
          <select
            value={f.water}
            onChange={(e) => setF((p) => ({ ...p, water: e.target.value }))}
            className="mt-1.5 h-12 w-full rounded-xl border border-sand-300 bg-white text-ink-700"
          >
            <option value="">Anywhere</option>
            {waters.map((w) => (
              <option key={w.slug} value={w.slug}>
                {w.short}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Experience</span>
          <select
            value={f.experience}
            onChange={(e) => setF((p) => ({ ...p, experience: e.target.value }))}
            className="mt-1.5 h-12 w-full rounded-xl border border-sand-300 bg-white text-ink-700"
          >
            <option value="">Any</option>
            {experiences.map((e) => (
              <option key={e.slug} value={e.slug}>
                {e.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Length</span>
          <select
            value={f.length}
            onChange={(e) => setF((p) => ({ ...p, length: e.target.value as LengthSlug | '' }))}
            className="mt-1.5 h-12 w-full rounded-xl border border-sand-300 bg-white text-ink-700"
          >
            <option value="">Any</option>
            {lengths.map((l) => (
              <option key={l.slug} value={l.slug}>
                {l.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Boat</span>
          <select
            value={f.boat}
            onChange={(e) => setF((p) => ({ ...p, boat: e.target.value }))}
            className="mt-1.5 h-12 w-full rounded-xl border border-sand-300 bg-white text-ink-700"
          >
            <option value="">Any of the four</option>
            {boats.map((b) => (
              <option key={b.slug} value={b.slug}>
                {b.name}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-center justify-between gap-4 sm:col-span-2 lg:col-span-4">
          <p className="text-sm text-ink/70" aria-live="polite">
            <strong className="font-display text-lg text-ink-700">{rows.length}</strong>{' '}
            {rows.length === 1 ? 'itinerary' : 'itineraries'}
          </p>
          {isFiltered ? (
            <button type="button" onClick={reset} className="font-mark text-[11px] uppercase tracking-[0.16em] text-flame-600 underline underline-offset-4">
              Clear filters
            </button>
          ) : null}
        </div>
      </div>

      {state === 'loading' ? (
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          <CardSkeleton kind="trip" count={6} />
        </div>
      ) : state === 'error' ? (
        <div className="mt-10">
          <ErrorState onRetry={reload} />
        </div>
      ) : rows.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="That combination is not in this season"
            body="Seasons move, and so does the fleet. Clear a filter to see what is close — or ask us; a fair number of guests end up on a route that was never published."
            onReset={reset}
            altHref={routes.charter()}
            altLabel="Build it as a charter"
          />
        </div>
      ) : (
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {rows.map((t) => (
            <React.Fragment key={t.slug}>{tripCards[t.slug]}</React.Fragment>
          ))}
        </div>
      )}
    </section>
  );
}
