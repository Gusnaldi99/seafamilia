'use client';

/**
 * Ported from experiences.html's `matchingTrips()`. Deep-linkable:
 * /experiences?experience=diving&water=banda&party=solo — filters
 * initialize from the URL and keep it in sync (replaceState, not push, so
 * filtering never grows browser history) exactly like the original.
 */
import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CardSkeleton } from '@/components/states/card-skeleton';
import { EmptyState } from '@/components/states/empty-state';
import { ErrorState } from '@/components/states/error-state';
import { useListingLoad } from '@/hooks/use-listing-load';
import { filterTrips, type TripFilters } from '@/lib/queries';
import { forcedStateFrom, emptied } from '@/lib/qa';
import { routes } from '@/lib/routes';
import { experiences, parties, lengths, waters, type LengthSlug, type PartySlug } from '@/lib/data';

type Filters = { experience: string; water: string; length: LengthSlug | ''; party: PartySlug | '' };
const EMPTY_FILTERS: Filters = { experience: '', water: '', length: '', party: '' };

export function MatchingTrips({ tripCards }: { tripCards: Record<string, React.ReactNode> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const forced = forcedStateFrom(searchParams.get('state'));
  const { state, reload } = useListingLoad(forced);

  const [f, setF] = React.useState<Filters>(() => ({
    experience: searchParams.get('experience') ?? '',
    water: searchParams.get('water') ?? '',
    length: (searchParams.get('length') as LengthSlug | null) ?? '',
    party: (searchParams.get('party') as PartySlug | null) ?? '',
  }));

  const isFiltered = f.experience !== '' || f.water !== '' || f.length !== '' || f.party !== '';

  const rows = React.useMemo(() => {
    const query: TripFilters = {
      experience: f.experience || undefined,
      water: f.water || undefined,
      length: f.length || undefined,
      party: f.party || undefined,
    };
    return emptied(filterTrips(query), forced);
  }, [f, forced]);

  React.useEffect(() => {
    const target = `${routes.experiences(f as TripFilters)}#matching`;
    if (target !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
      router.replace(target, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [f]);

  function reset() {
    setF(EMPTY_FILTERS);
  }

  return (
    <section id="matching" className="border-t border-sand-300 bg-sand">
      <div className="mx-auto max-w-8xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mt-8 rounded-3xl border border-sand-300 bg-white p-5 lg:p-7">
          <fieldset>
            <legend className="font-mark text-[11px] uppercase tracking-[0.18em] text-mist-700">Experience</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              <PillButton active={f.experience === ''} onClick={() => setF((p) => ({ ...p, experience: '' }))}>
                Any
              </PillButton>
              {experiences.map((e) => (
                <PillButton key={e.slug} active={f.experience === e.slug} onClick={() => setF((p) => ({ ...p, experience: e.slug }))}>
                  {e.name}
                </PillButton>
              ))}
            </div>
          </fieldset>

          <div className="mt-6 grid gap-6 border-t border-sand-200 pt-6 sm:grid-cols-3">
            <fieldset>
              <legend className="font-mark text-[11px] uppercase tracking-[0.18em] text-mist-700">Waters</legend>
              <label className="mt-3 block">
                <span className="sr-only">Choose a region</span>
                <select
                  value={f.water}
                  onChange={(e) => setF((p) => ({ ...p, water: e.target.value }))}
                  className="h-12 w-full rounded-xl border border-sand-300 bg-sand text-ink-700"
                >
                  <option value="">Anywhere we sail</option>
                  {waters.map((w) => (
                    <option key={w.slug} value={w.slug}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </label>
            </fieldset>

            <fieldset>
              <legend className="font-mark text-[11px] uppercase tracking-[0.18em] text-mist-700">Length</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                <PillButton small active={f.length === ''} onClick={() => setF((p) => ({ ...p, length: '' }))}>
                  Any
                </PillButton>
                {lengths.map((l) => (
                  <PillButton key={l.slug} small active={f.length === l.slug} onClick={() => setF((p) => ({ ...p, length: l.slug }))}>
                    {l.label}
                  </PillButton>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="font-mark text-[11px] uppercase tracking-[0.18em] text-mist-700">Who is coming</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                <PillButton small active={f.party === ''} onClick={() => setF((p) => ({ ...p, party: '' }))}>
                  Any
                </PillButton>
                {parties.map((p) => (
                  <PillButton key={p.slug} small active={f.party === p.slug} onClick={() => setF((prev) => ({ ...prev, party: p.slug }))}>
                    {p.label}
                  </PillButton>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-sand-200 pt-5">
            <p className="text-sm text-ink/70" aria-live="polite">
              {state === 'loading' ? (
                <span className="text-mist-700">Checking availability…</span>
              ) : (
                <span>
                  <strong className="font-display text-lg text-ink-700">{rows.length}</strong>{' '}
                  {rows.length === 1 ? 'itinerary matches' : 'itineraries match'}
                </span>
              )}
            </p>
            {isFiltered ? (
              <button
                type="button"
                onClick={reset}
                className="font-mark text-[11px] uppercase tracking-[0.16em] text-flame-600 underline underline-offset-4"
              >
                Clear all filters
              </button>
            ) : null}
          </div>
        </div>

        <div className="mt-8">
          {state === 'loading' ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              <CardSkeleton kind="trip" count={3} />
            </div>
          ) : state === 'error' ? (
            <ErrorState onRetry={reload} />
          ) : rows.length === 0 ? (
            <EmptyState
              title="Nothing fits all three filters"
              body="That combination does not exist in this season — but it might next one, and half of what we run is unpublished anyway. Loosen a filter, or tell us what you had in mind."
              onReset={reset}
              altHref={routes.contact()}
              altLabel="Tell us what you want"
            />
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {rows.map((t) => (
                <React.Fragment key={t.slug}>{tripCards[t.slug]}</React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function PillButton({
  active,
  small,
  onClick,
  children,
}: {
  active: boolean;
  small?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border font-mark uppercase tracking-[0.14em] transition ${
        small ? 'px-3.5 py-2 text-[11px]' : 'px-4 py-2 text-[11px]'
      } ${active ? 'border-ink bg-ink text-white' : 'border-sand-300 text-ink-700 hover:border-mist'}`}
    >
      {children}
    </button>
  );
}
