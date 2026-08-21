'use client';

/** Ported from faq.html's `faqPage()` — search across all twelve questions,
 * a group side-nav, and an accordion that auto-opens every match while
 * searching (so search reveals what it found rather than hiding it behind
 * a click). */
import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus } from '@/components/icons';
import { routes } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { faq } from '@/lib/data';

const GROUPS = Array.from(new Set(faq.map((f) => f.group)));

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function FaqBrowser() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [q, setQ] = React.useState(() => searchParams.get('q') ?? '');
  const [open, setOpen] = React.useState<string[]>(() => (faq.length ? [faq[0].q] : []));

  function visible(group: string) {
    const needle = q.trim().toLowerCase();
    return faq.filter((f) => f.group === group && (!needle || `${f.q} ${f.a}`.toLowerCase().includes(needle)));
  }

  const matchCount = GROUPS.reduce((n, g) => n + visible(g).length, 0);

  React.useEffect(() => {
    const handle = setTimeout(() => {
      const target = routes.faq(q);
      if (target !== `${window.location.pathname}${window.location.search}`) {
        router.replace(target, { scroll: false });
      }
    }, 150);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  function updateQuery(next: string) {
    setQ(next);
    if (next.trim()) setOpen(faq.map((f) => f.q));
  }

  function toggle(key: string) {
    setOpen((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }

  return (
    <section className="mx-auto max-w-8xl px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="grid gap-10 lg:grid-cols-[16rem_1fr] lg:gap-16">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <label className="block">
            <span className="sr-only">Search the questions</span>
            <input
              type="search"
              value={q}
              onChange={(e) => updateQuery(e.target.value)}
              placeholder="Deposit, children, wifi…"
              className="h-12 w-full rounded-full border border-sand-300 bg-sand px-5 text-ink-700 placeholder:text-ink/40"
            />
          </label>
          <nav className="mt-6 space-y-1" aria-label="Question groups">
            {GROUPS.map((g) => (
              <a key={g} href={`#${slugify(g)}`} className="block rounded-lg px-3 py-2 font-mark text-[11px] uppercase tracking-[0.14em] text-ink-700 transition hover:bg-sand">
                {g}
              </a>
            ))}
          </nav>
          <div className="mt-8 rounded-2xl bg-sand p-5">
            <p className="font-mark text-[10px] uppercase tracking-[0.16em] text-flame">Still stuck?</p>
            <p className="mt-2 text-sm leading-relaxed text-ink/75">Two people in Labuan Bajo, answering on WhatsApp within a few hours.</p>
            <Link href={routes.contact()} className="mt-4 inline-flex h-11 items-center rounded-full bg-ink px-5 font-mark text-[11px] uppercase tracking-[0.12em] text-white transition hover:bg-ink-600">
              Contact the office
            </Link>
          </div>
        </aside>

        <div>
          {q.trim() ? (
            <p className="mb-6 text-sm text-ink/70" aria-live="polite">
              <strong className="font-display text-lg text-ink-700">{matchCount}</strong> {matchCount === 1 ? 'question matches' : 'questions match'} &ldquo;{q}&rdquo;
            </p>
          ) : null}

          {matchCount === 0 ? (
            <div className="rounded-3xl border border-dashed border-mist-300 bg-sand px-6 py-12 text-center">
              <h2 className="font-display text-xl text-ink-700">Nothing here covers that</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink/70">
                Which makes it a good question. Send it over — if two people ask the same thing it ends up on this page.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => updateQuery('')}
                  className="inline-flex h-11 items-center rounded-full border border-ink/20 px-5 font-mark text-[12px] uppercase tracking-[0.12em] text-ink-700 transition hover:border-ink"
                >
                  Show all twelve
                </button>
                <Link href={routes.contact()} className="inline-flex h-11 items-center rounded-full bg-flame px-5 font-mark text-[12px] uppercase tracking-[0.12em] text-white transition hover:bg-flame-600">
                  Ask us directly
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-12">
              {GROUPS.map((g) => {
                const items = visible(g);
                if (items.length === 0) return null;
                return (
                  <section key={g} id={slugify(g)}>
                    <h2 className="font-display text-2xl font-light text-ink-700 sm:text-3xl">{g}</h2>
                    <dl className="mt-5 divide-y divide-sand-300 border-y border-sand-300">
                      {items.map((item) => {
                        const isOpen = open.includes(item.q);
                        return (
                          <div key={item.q}>
                            <dt>
                              <button type="button" onClick={() => toggle(item.q)} aria-expanded={isOpen} className="group flex w-full items-start justify-between gap-5 py-5 text-left">
                                <span className="font-display text-lg leading-snug text-ink-700 transition-colors group-hover:text-flame-600">{item.q}</span>
                                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-sand-300 text-ink-700 transition group-hover:border-mist">
                                  <Plus className={cn('h-3.5 w-3.5 transition-transform', isOpen && 'rotate-45')} aria-hidden="true" />
                                </span>
                              </button>
                            </dt>
                            {isOpen ? (
                              <dd>
                                <p className="max-w-2xl pb-6 pr-8 text-sm leading-relaxed text-ink/75">{item.a}</p>
                              </dd>
                            ) : null}
                          </div>
                        );
                      })}
                    </dl>
                  </section>
                );
              })}
            </div>
          )}

          <div className="mt-14 rounded-3xl bg-ink p-7 text-white lg:p-10">
            <h2 className="font-display text-2xl font-light sm:text-3xl">One more thing worth saying</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80">
              Every itinerary on this site is a plan rather than a promise. The captain will
              reorder your week for weather, current or simply a better day, and we would rather
              tell you that before you book than apologise for it afterwards. In eight years no
              guest has told us the swap was worse.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={routes.departures()} className="inline-flex h-12 items-center rounded-full bg-flame px-6 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-flame-600">
                Find a departure
              </Link>
              <Link href={routes.policies()} className="inline-flex h-12 items-center rounded-full border border-white/30 px-6 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-white hover:text-ink-700">
                Read the policies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
