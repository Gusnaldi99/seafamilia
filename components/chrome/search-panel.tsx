'use client';

/**
 * Ported from partials/header.html's search panel + layout.js's
 * `resultsHTML()`. `search()` (lib/queries.ts) is the same pure lookup the
 * original called via SEA.search() — only the rendering moved from an
 * innerHTML string to JSX.
 */
import * as React from 'react';
import Link from 'next/link';
import { ChevronRight, Magnifier } from '@/components/icons';
import { Input } from '@/components/ui/input';
import { useLocale } from '@/components/providers/locale-provider';
import { search, waterBySlug, type SearchResults } from '@/lib/queries';
import { routes } from '@/lib/routes';
import { cn } from '@/lib/utils';

const SUGGESTIONS = ['Komodo', 'Raja Ampat', 'Banda Sea', 'family', 'whale shark', 'private charter'];
const EMPTY_RESULTS: SearchResults = { trips: [], waters: [], boats: [], articles: [], total: 0 };

interface ResultRow {
  key: string;
  href: string;
  ph: string;
  title: string;
  meta: string;
}

export function SearchPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [term, setTerm] = React.useState('');
  const [results, setResults] = React.useState<SearchResults>(EMPTY_RESULTS);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { money, nights } = useLocale();

  React.useEffect(() => {
    // Matches the original: `term` isn't cleared on close, so reopening the
    // panel picks up right where it left off.
    if (open) inputRef.current?.focus();
  }, [open]);

  React.useEffect(() => {
    const handle = setTimeout(() => setResults(search(term)), 180);
    return () => clearTimeout(handle);
  }, [term]);

  if (!open) return null;

  const tripRows: ResultRow[] = results.trips.map((x) => ({
    key: x.slug,
    href: routes.trip(x.slug),
    ph: x.ph,
    title: x.title,
    meta: `${waterBySlug(x.water)?.short ?? ''} · ${nights(x.nights)} · from ${money(x.from)}`,
  }));
  const waterRows: ResultRow[] = results.waters.map((x) => ({
    key: x.slug,
    href: routes.destination(x.slug),
    ph: x.ph,
    title: x.name,
    meta: `${x.season} · from ${x.gateway}`,
  }));
  const boatRows: ResultRow[] = results.boats.map((x) => ({
    key: x.slug,
    href: routes.boat(x.slug),
    ph: x.ph,
    title: x.name,
    meta: `${x.type} · ${x.guests} guests · ${x.cabins} cabins`,
  }));
  const articleRows: ResultRow[] = results.articles.map((x) => ({
    key: x.slug,
    href: routes.article(x.slug),
    ph: x.ph,
    title: x.title,
    meta: `${x.category} · ${x.read} min read`,
  }));

  return (
    <div id="sf-search-panel" className="absolute inset-x-0 top-full border-b border-ink/10 bg-white shadow-lift">
      <div className="mx-auto max-w-3xl px-5 py-6 sm:px-6">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-mist-700">
            <Magnifier className="h-5 w-5" aria-hidden="true" />
          </span>
          <Input
            ref={inputRef}
            type="search"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Reefs, boats, an island, a month…"
            aria-label="Search"
            className="h-14 rounded-full border-sand-300 bg-sand pl-12 pr-4 font-sans text-base text-ink-700 placeholder:text-ink/40"
          />
        </div>

        {term.trim().length < 2 ? (
          <div className="mt-5">
            <p className="font-mark text-[11px] uppercase tracking-[0.18em] text-mist-700">Try</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setTerm(s)}
                  className="rounded-full border border-sand-300 px-3 py-1.5 font-mark text-[11px] uppercase tracking-[0.14em] text-ink-700 transition hover:border-mist hover:bg-sand"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-5 max-h-[60vh] overflow-y-auto">
            {results.total > 0 ? (
              <>
                <ResultSection label="Itineraries" items={tripRows} onNavigate={onClose} />
                <ResultSection label="Waters" items={waterRows} onNavigate={onClose} />
                <ResultSection label="Boats" items={boatRows} onNavigate={onClose} />
                <ResultSection label="Journal" items={articleRows} onNavigate={onClose} />
              </>
            ) : (
              <div className="py-10 text-center">
                <p className="font-display text-xl text-ink-700">Nothing matched &ldquo;{term}&rdquo;</p>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink/70">
                  Try an island, a boat name or a month. Or tell us what you are after — half of what we run
                  never makes it onto a search page.
                </p>
                <Link
                  href={routes.contact()}
                  onClick={onClose}
                  className="mt-5 inline-flex h-11 items-center rounded-full bg-ink px-5 font-mark text-sm uppercase tracking-[0.12em] text-white transition hover:bg-ink-600"
                >
                  Talk to the familia
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ResultSection({
  label,
  items,
  onNavigate,
}: {
  label: string;
  items: ResultRow[];
  onNavigate: () => void;
}) {
  if (!items.length) return null;
  return (
    <div className="mb-6">
      <p className="font-mark text-[11px] uppercase tracking-[0.18em] text-mist-700">{label}</p>
      <ul className="mt-2 divide-y divide-sand-200">
        {items.map((item) => (
          <li key={item.key}>
            <Link href={item.href} onClick={onNavigate} className="flex items-center gap-4 py-3 transition hover:bg-sand/60">
              <span className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg">
                <span className={cn('ph absolute inset-0 block', `ph-${item.ph}`)} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-base text-ink-700">{item.title}</span>
                <span className="block truncate text-xs text-mist-700">{item.meta}</span>
              </span>
              <span className="text-mist-400">
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
