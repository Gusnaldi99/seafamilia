'use client';

/** Ported from journal.html's `journalIndex()` — search + category filter,
 * a featured pair that hides while searching, and a bespoke empty-search
 * state (not the shared EmptyState: this one names the actual query and
 * offers the featured pieces as a way back in). */
import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { CardSkeleton } from '@/components/states/card-skeleton';
import { ErrorState } from '@/components/states/error-state';
import { EmptyStateIcon, Magnifier } from '@/components/icons';
import { useListingLoad } from '@/hooks/use-listing-load';
import { forcedStateFrom, emptied } from '@/lib/qa';
import { routes } from '@/lib/routes';
import { articles, type Article } from '@/lib/data';

const CATEGORIES = Array.from(new Set(articles.map((a) => a.category))).sort();
const FEATURED = articles.filter((a) => a.featured).slice(0, 2);

function matches(a: Article, needle: string): boolean {
  if (!needle) return true;
  const hay = [a.title, a.dek, a.category, a.author, (a.tags ?? []).join(' ')].join(' ').toLowerCase();
  return hay.includes(needle);
}

export function JournalIndex({
  featuredCards,
  articleCards,
}: {
  featuredCards: Record<string, React.ReactNode>;
  articleCards: Record<string, React.ReactNode>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const forced = forcedStateFrom(searchParams.get('state'));
  const { state, reload } = useListingLoad(forced, 460);

  const [q, setQ] = React.useState(() => searchParams.get('q') ?? '');
  const [cat, setCat] = React.useState(() => searchParams.get('category') ?? '');

  const isSearching = q.trim().length > 0 || cat !== '';

  const rows = React.useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = articles
      .filter((a) => (cat ? a.category === cat : true))
      .filter((a) => matches(a, needle))
      .sort((a, b) => (a.date < b.date ? 1 : -1));
    return emptied(list, forced);
  }, [q, cat, forced]);

  React.useEffect(() => {
    const handle = setTimeout(() => {
      const target = routes.journal({ q: q || undefined, category: cat || undefined });
      if (target !== `${window.location.pathname}${window.location.search}`) {
        router.replace(target, { scroll: false });
      }
    }, 200);
    return () => clearTimeout(handle);
  }, [q, cat, router]);

  function reset() {
    setQ('');
    setCat('');
  }

  return (
    <>
      {!isSearching ? (
        <section className="mx-auto max-w-8xl px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-6">
            {FEATURED.map((a) => (
              <React.Fragment key={a.slug}>{featuredCards[a.slug]}</React.Fragment>
            ))}
          </div>
        </section>
      ) : null}

      <section className="border-y border-sand-300 bg-sand">
        <div className="mx-auto max-w-8xl px-5 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative lg:w-80">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-mist-700">
                <Magnifier className="h-5 w-5" aria-hidden="true" />
              </span>
              <label>
                <span className="sr-only">Search the journal</span>
                <input
                  type="search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Reefs, weaving, hammerheads, Pak Rudi…"
                  className="h-12 w-full rounded-full border border-sand-300 bg-white pl-11 pr-4 text-ink-700 placeholder:text-ink/40"
                />
              </label>
            </div>

            <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-wrap lg:px-0" role="group" aria-label="Filter by category">
              <button
                type="button"
                onClick={() => setCat('')}
                className={`shrink-0 rounded-full border px-4 py-2 font-mark text-[11px] uppercase tracking-[0.14em] transition ${
                  cat === '' ? 'border-ink bg-ink text-white' : 'border-sand-300 bg-white text-ink-700 hover:border-mist'
                }`}
              >
                Everything
              </button>
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCat(c)}
                  className={`shrink-0 rounded-full border px-4 py-2 font-mark text-[11px] uppercase tracking-[0.14em] transition ${
                    cat === c ? 'border-ink bg-ink text-white' : 'border-sand-300 bg-white text-ink-700 hover:border-mist'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-8xl px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="font-display text-2xl font-light text-ink-700 sm:text-3xl">{isSearching ? 'Search results' : 'All pieces'}</h2>
          <p className="font-mark text-[11px] uppercase tracking-[0.16em] text-mist-700" aria-live="polite">
            {state === 'ready' ? `${rows.length} ${rows.length === 1 ? 'piece' : 'pieces'}` : null}
          </p>
        </div>

        {state === 'loading' ? (
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            <CardSkeleton kind="article" count={6} />
          </div>
        ) : state === 'error' ? (
          <div className="mt-8">
            <ErrorState onRetry={reload} />
          </div>
        ) : rows.length === 0 ? (
          <div className="mt-8">
            <div className="rounded-3xl border border-dashed border-mist-300 bg-sand px-6 py-14 text-center">
              <EmptyStateIcon className="mx-auto h-12 w-12 text-mist-400" aria-hidden="true" />
              <h3 className="mt-5 font-display text-xl text-ink-700">
                Nothing on <span className="text-flame-600">&ldquo;{q || cat}&rdquo;</span> — yet
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink/70">
                The archive is small and honest: eight pieces, all written by people who were there.
                Try a broader word, or read what the crew wrote most recently.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex h-11 items-center rounded-full bg-ink px-5 font-mark text-[12px] uppercase tracking-[0.12em] text-white transition hover:bg-ink-600"
                >
                  Clear the search
                </button>
                <Link
                  href={routes.contact()}
                  className="inline-flex h-11 items-center rounded-full border border-ink/20 px-5 font-mark text-[12px] uppercase tracking-[0.12em] text-ink-700 transition hover:border-ink"
                >
                  Suggest something to write about
                </Link>
              </div>

              <div className="mt-9 border-t border-sand-300 pt-7">
                <p className="font-mark text-[11px] uppercase tracking-[0.16em] text-mist-700">Most read instead</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {FEATURED.map((a) => (
                    <Link
                      key={a.slug}
                      href={routes.article(a.slug)}
                      className="rounded-full border border-sand-300 bg-white px-4 py-2 text-sm text-ink-700 transition hover:border-mist"
                    >
                      {a.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {rows.map((a) => (
              <React.Fragment key={a.slug}>{articleCards[a.slug]}</React.Fragment>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
