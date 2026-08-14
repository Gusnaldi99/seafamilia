'use client';

/**
 * Ported from 404.html's `notFound()` — search, right there in the hero.
 * `init()`'s "guess from the broken URL" behaviour (a dead
 * trip.html?slug=manta-passage should still turn up something) becomes
 * reading the same query string via useSearchParams, since the browser
 * keeps the original URL when Next renders this not-found boundary.
 */
import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Magnifier } from '@/components/icons';
import { Input } from '@/components/ui/input';
import { useLocale } from '@/components/providers/locale-provider';
import { search, waterBySlug, type SearchResults } from '@/lib/queries';
import { routes } from '@/lib/routes';
import { cn } from '@/lib/utils';

const EMPTY_RESULTS: SearchResults = { trips: [], waters: [], boats: [], articles: [], total: 0 };

interface ResultRow {
  key: string;
  href: string;
  ph: string;
  title: string;
  meta: string;
}

export function NotFoundSearch() {
  const searchParams = useSearchParams();
  const { nights } = useLocale();
  const [q, setQ] = React.useState(() => {
    const guess = searchParams.get('slug') ?? searchParams.get('id') ?? searchParams.get('q') ?? '';
    return guess.replace(/[-_]+/g, ' ');
  });
  const [results, setResults] = React.useState<SearchResults>(EMPTY_RESULTS);

  React.useEffect(() => {
    const handle = setTimeout(() => setResults(search(q)), 180);
    return () => clearTimeout(handle);
  }, [q]);

  const tripRows: ResultRow[] = results.trips.map((x) => ({
    key: x.slug,
    href: routes.trip(x.slug),
    ph: x.ph,
    title: x.title,
    meta: `${waterBySlug(x.water)?.short ?? ''} · ${nights(x.nights)}`,
  }));
  const waterRows: ResultRow[] = results.waters.map((x) => ({
    key: x.slug,
    href: routes.destination(x.slug),
    ph: x.ph,
    title: x.name,
    meta: x.season,
  }));
  const boatRows: ResultRow[] = results.boats.map((x) => ({
    key: x.slug,
    href: routes.boat(x.slug),
    ph: x.ph,
    title: x.name,
    meta: x.type,
  }));
  const articleRows: ResultRow[] = results.articles.map((x) => ({
    key: x.slug,
    href: routes.article(x.slug),
    ph: x.ph,
    title: x.title,
    meta: x.category,
  }));

  return (
    <div className="mx-auto mt-9 max-w-lg">
      <label className="relative block">
        <span className="sr-only">Search the site</span>
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-mist-700">
          <Magnifier className="h-5 w-5" aria-hidden="true" />
        </span>
        <Input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="An island, a boat, a month…"
          className="h-14 rounded-full border-0 bg-white pl-12 pr-4 text-base text-ink-700 placeholder:text-ink/40"
        />
      </label>

      {q.trim().length >= 2 ? (
        <div className="mt-4 overflow-hidden rounded-2xl bg-white text-left shadow-lift">
          {results.total > 0 ? (
            <>
              <ResultSection label="Itineraries" items={tripRows} />
              <ResultSection label="Waters" items={waterRows} />
              <ResultSection label="Boats" items={boatRows} />
              <ResultSection label="Journal" items={articleRows} />
            </>
          ) : (
            <p className="px-5 py-8 text-center text-sm text-ink/70">
              Nothing matched &ldquo;{q}&rdquo;. Try an island name, or ask the office —{' '}
              <Link href={routes.contact()} className="text-flame-600 underline underline-offset-4">
                they answer on WhatsApp
              </Link>
              .
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}

function ResultSection({ label, items }: { label: string; items: ResultRow[] }) {
  if (!items.length) return null;
  return (
    <div className="border-b border-sand-200 py-2 last:border-0">
      <p className="px-5 pb-1 pt-1 font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">{label}</p>
      <ul>
        {items.map((item) => (
          <li key={item.key}>
            <Link href={item.href} className="flex items-center gap-4 px-5 py-3 transition hover:bg-sand">
              <span className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg">
                <span className={cn('ph absolute inset-0 block', `ph-${item.ph}`)} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-base text-ink-700">{item.title}</span>
                <span className="block truncate text-xs text-mist-700">{item.meta}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
