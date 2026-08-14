"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { waters, lengths, filterTrips, findWater, findBoat } from "@/lib/api/data";
import { formatMoney, formatNights } from "@/lib/utils";

type SortOption = "water" | "short" | "long" | "price";

export function ItineraryIndex() {
  const [filterWater, setFilterWater] = useState<string>("");
  const [filterLength, setFilterLength] = useState<string>("");
  const [sort, setSort] = useState<SortOption>("water");

  const filteredTrips = useMemo(() => {
    const result = filterTrips({ water: filterWater, length: filterLength });
    
    result.sort((a, b) => {
      if (sort === "short") return a.nights - b.nights;
      if (sort === "long") return b.nights - a.nights;
      if (sort === "price") return a.from - b.from;
      // default "water"
      const wA = findWater(a.water)?.name || "";
      const wB = findWater(b.water)?.name || "";
      return wA.localeCompare(wB);
    });

    return result;
  }, [filterWater, filterLength, sort]);

  const totalTrips = filterTrips({}).length;

  return (
    <section id="itineraries" className="border-y border-sand-300 bg-sand">
      <div className="mx-auto max-w-[88rem] px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="font-mark text-[0.6875rem] uppercase leading-none tracking-[0.22em] text-flame">Itineraries index</p>
            <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl lg:text-5xl">
              Everything we sail, on one page
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink/70">
              Twelve routes across eight waters. Filter it down, or read the whole list —
              it is short on purpose.
            </p>
          </div>
          <p className="font-mark text-[11px] uppercase tracking-[0.16em] text-mist-700">
            <span>{filteredTrips.length}</span> of <span>{totalTrips}</span> shown
          </p>
        </div>

        {/* filters */}
        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 no-scrollbar lg:mx-0 lg:flex-wrap lg:px-0" role="group" aria-label="Filter by water">
            <button
              type="button"
              onClick={() => setFilterWater("")}
              className={`shrink-0 rounded-full border px-4 py-2 font-mark text-[11px] uppercase tracking-[0.14em] transition ${
                filterWater === ""
                  ? "border-ink bg-ink text-white"
                  : "border-sand-300 bg-white text-ink-700 hover:border-mist"
              }`}
            >
              All waters
            </button>
            {waters.map((w) => (
              <button
                key={w.slug}
                type="button"
                onClick={() => setFilterWater(w.slug)}
                className={`shrink-0 rounded-full border px-4 py-2 font-mark text-[11px] uppercase tracking-[0.14em] transition ${
                  filterWater === w.slug
                    ? "border-ink bg-ink text-white"
                    : "border-sand-300 bg-white text-ink-700 hover:border-mist"
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
                value={filterLength}
                onChange={(e) => setFilterLength(e.target.value)}
                className="h-11 rounded-full border-sand-300 bg-white pl-4 pr-9 font-mark text-[12px] uppercase tracking-[0.1em] text-ink-700 focus:border-mist focus:ring-mist/40"
              >
                <option value="">Any</option>
                {lengths.map((l) => (
                  <option key={l.slug} value={l.slug}>
                    {l.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2">
              <span className="w-12 shrink-0 font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Sort</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="h-11 rounded-full border-sand-300 bg-white pl-4 pr-9 font-mark text-[12px] uppercase tracking-[0.1em] text-ink-700 focus:border-mist focus:ring-mist/40"
              >
                <option value="water">By water</option>
                <option value="short">Shortest first</option>
                <option value="long">Longest first</option>
                <option value="price">Lowest price</option>
              </select>
            </label>
          </div>
        </div>

        {/* empty */}
        {filteredTrips.length === 0 && (
          <div className="mt-8 py-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
              <span className="icon icon-empty-state h-8 w-8 text-mist-700" aria-hidden="true" />
            </div>
            <h3 className="mt-6 font-display text-2xl text-ink-700">No itinerary matches both filters</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink/70">
              Try one filter at a time — or ask us. Some of our best weeks are the ones that never fit a dropdown.
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <button
                type="button"
                onClick={() => {
                  setFilterWater("");
                  setFilterLength("");
                }}
                className="inline-flex h-11 items-center justify-center rounded-full bg-ink px-6 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-ink-600"
              >
                Clear filters
              </button>
              <Link
                href="/experiences"
                className="inline-flex h-11 items-center justify-center rounded-full border border-sand-300 bg-white px-6 font-mark text-[12px] uppercase tracking-[0.14em] text-ink-700 transition hover:border-mist hover:bg-sand"
              >
                Plan your trip
              </Link>
            </div>
          </div>
        )}

        {/* index rows */}
        {filteredTrips.length > 0 && (
          <ol className="mt-8 divide-y divide-sand-300 border-y border-sand-300">
            {filteredTrips.map((t) => {
              const water = findWater(t.water);
              const boat = findBoat(t.boat);
              return (
                <li key={t.slug}>
                  <Link
                    href={`/trip/${t.slug}`}
                    className="group grid grid-cols-[4.5rem_1fr] items-center gap-4 py-4 transition sm:grid-cols-[6rem_1fr_auto] sm:gap-6 sm:py-5 hover:bg-white/70"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-ink">
                      <div className={`ph ph-${t.ph} absolute inset-0`} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h3 className="font-display text-lg text-ink-700 transition-colors group-hover:text-flame-600 sm:text-xl">
                          {t.title}
                        </h3>
                        {t.editorPick && (
                          <span className="font-mark text-[10px] uppercase tracking-[0.16em] text-flame">Editor&apos;s pick</span>
                        )}
                      </div>
                      <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-mist-700 sm:text-sm">
                        <span>{water?.short}</span>
                        <span aria-hidden="true">·</span>
                        <span>{formatNights(t.nights)}</span>
                        <span aria-hidden="true">·</span>
                        <span>{boat?.name}</span>
                      </p>
                      <p className="mt-1.5 line-clamp-1 text-xs text-ink/55 sm:hidden">
                        from <span className="tnum">{formatMoney(t.from)}</span>
                      </p>
                    </div>

                    <div className="hidden items-center gap-6 sm:flex">
                      <div className="text-right">
                        <div className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">From</div>
                        <div className="tnum font-display text-lg text-deep-700">{formatMoney(t.from)}</div>
                      </div>
                      <span className="grid h-10 w-10 place-items-center rounded-full border border-sand-300 text-ink-700 transition group-hover:border-flame group-hover:bg-flame group-hover:text-white">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
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
