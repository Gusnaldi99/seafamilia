"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { Article, TeamMember } from "@/lib/api/types";
import { ImageSlot } from "@/components/shared/ImageSlot";

export function JournalClient({ 
  articles, 
  featured, 
  team 
}: { 
  articles: Article[], 
  featured: Article[], 
  team: TeamMember[] 
}) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");

  const categories = useMemo(() => {
    return Array.from(new Set(articles.map(a => a.category))).sort();
  }, [articles]);

  const rows = useMemo(() => {
    return articles.filter(a => {
      const matchCat = cat ? a.category === cat : true;
      const matchQ = q ? (a.title + " " + a.dek + " " + a.author + " " + a.category).toLowerCase().includes(q.toLowerCase()) : true;
      return matchCat && matchQ;
    });
  }, [articles, q, cat]);

  const isSearching = q.length > 0 || cat !== "";

  const writers = useMemo(() => {
    const names = ['Ayu Prasetya', 'Captain Yos Tanuwijaya', 'Rudi Hartawan', 'Dr. Lila Moerdani'];
    return team.filter(p => names.includes(p.name));
  }, [team]);

  const reset = () => {
    setQ("");
    setCat("");
  };

  return (
    <>
      {/* SEARCH + CATEGORIES */}
      <section className="border-y border-sand-300 bg-sand">
        <div className="mx-auto max-w-[88rem] px-5 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative lg:w-80">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-mist-700">
                <span className="icon icon-magnifier h-5 w-5" aria-hidden="true"></span>
              </span>
              <label>
                <span className="sr-only">Search the journal</span>
                <input 
                  type="search" 
                  value={q} 
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Reefs, weaving, hammerheads, Pak Rudi…"
                  className="h-12 w-full rounded-full border-sand-300 bg-white pl-11 pr-4 text-ink-700 placeholder:text-ink/40 focus:border-mist focus:ring-2 focus:ring-mist/40"
                />
              </label>
            </div>

            <div className="-mx-5 flex gap-2 overflow-x-auto px-5 no-scrollbar lg:mx-0 lg:flex-wrap lg:px-0"
                 role="group" aria-label="Filter by category">
              <button 
                type="button" 
                onClick={() => setCat('')}
                className={`shrink-0 rounded-full border px-4 py-2 font-mark text-[11px] uppercase tracking-[0.14em] transition ${cat === '' ? 'border-ink bg-ink text-white' : 'border-sand-300 bg-white text-ink-700 hover:border-mist'}`}
              >
                Everything
              </button>
              {categories.map(c => (
                <button 
                  key={c}
                  type="button" 
                  onClick={() => setCat(c)}
                  className={`shrink-0 rounded-full border px-4 py-2 font-mark text-[11px] uppercase tracking-[0.14em] transition ${cat === c ? 'border-ink bg-ink text-white' : 'border-sand-300 bg-white text-ink-700 hover:border-mist'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ARTICLE GRID */}
      <section className="mx-auto max-w-[88rem] px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="font-display text-2xl font-light text-ink-700 sm:text-3xl">
            {isSearching ? 'Search results' : 'All pieces'}
          </h2>
          <p className="font-mark text-[11px] uppercase tracking-[0.16em] text-mist-700" aria-live="polite">
            {rows.length} {rows.length === 1 ? 'piece' : 'pieces'}
          </p>
        </div>

        {/* empty search result */}
        {rows.length === 0 && (
          <div className="mt-8">
            <div className="rounded-3xl border border-dashed border-mist-300 bg-sand px-6 py-14 text-center">
              <span className="icon icon-empty-state mx-auto h-12 w-12 text-mist-400" aria-hidden="true"></span>
              <h3 className="mt-5 font-display text-xl text-ink-700">
                Nothing on <span className="text-flame-600">“{q || cat}”</span> — yet
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
                <Link href="/contact" className="inline-flex h-11 items-center rounded-full border border-ink/20 px-5 font-mark text-[12px] uppercase tracking-[0.12em] text-ink-700 transition hover:border-ink">
                  Suggest something to write about
                </Link>
              </div>

              <div className="mt-9 border-t border-sand-300 pt-7">
                <p className="font-mark text-[11px] uppercase tracking-[0.16em] text-mist-700">Most read instead</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {featured.map(a => (
                    <Link 
                      key={a.slug}
                      href={`/journal/${a.slug}`}
                      className="rounded-full border border-sand-300 bg-white px-4 py-2 text-sm text-ink-700 transition hover:border-mist"
                    >
                      {a.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {rows.length > 0 && (
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-6">
            {rows.map((a) => (
              <Link key={a.slug} href={`/journal/${a.slug}`} className="group block">
                <div className={`ph ph-${a.ph} relative aspect-[4/3] overflow-hidden rounded-2xl`}>
                  <ImageSlot className="img-slot w-full h-full object-cover transition-transform duration-700 ease-swell group-hover:scale-[1.04]" src={`/media/photos/articles/${a.slug}.jpg`} alt={a.title} loading="lazy" />
                  <div className="scrim absolute inset-0" />
                  <div className="absolute inset-x-4 bottom-4">
                    <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1.5 font-mark text-[10px] uppercase tracking-[0.16em] text-white ring-1 ring-inset ring-white/25 backdrop-blur">
                      {a.category}
                    </span>
                  </div>
                </div>
                <h3 className="mt-5 font-display text-xl text-ink-700 transition-colors group-hover:text-flame-600">
                  {a.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70 line-clamp-2">
                  {a.dek}
                </p>
                <p className="mt-3 font-mark text-[10px] uppercase tracking-[0.14em] text-mist-700">
                  {a.author} · {formatDate(a.date)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* WHO WRITES THIS */}
      <section className="border-t border-sand-300 bg-sand">
        <div className="mx-auto max-w-[88rem] px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
            <div>
              <span className="wave-rule wave-rule-flame block"></span>
              <h2 className="mt-5 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">
                Who writes this
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink/70">
                Four regular contributors, none of whom were hired to write. Ayu reads currents, Yos
                crosses the Banda Sea, Rudi feeds sixteen people off a market stall, and Lila counts
                coral.
              </p>
              <Link href="/our-story#familia" className="mt-6 inline-flex items-center gap-2 font-mark text-[11px] uppercase tracking-[0.16em] text-flame-600 underline underline-offset-4">
                Meet the familia
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {writers.map(p => (
                <div key={p.name} className="flex gap-4 rounded-2xl bg-white p-4">
                  <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-ink arch">
                    <div className={`ph ph-${p.ph} absolute inset-0`}>
                      <ImageSlot className="img-slot h-full w-full object-cover" src={`/media/photos/team/${p.slug}.jpg`} alt={p.name} loading="lazy" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-base leading-tight text-ink-700">{p.name}</p>
                    <p className="mt-0.5 font-mark text-[10px] uppercase tracking-[0.12em] text-flame">{p.role}</p>
                    <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-ink/65">{p.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
