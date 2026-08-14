"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { waters, trips, findWater, experiences, lengths, boats, filterTrips } from "@/lib/api/data";
import { formatMoney, formatNights } from "@/lib/utils";
import { TripCard } from "@/components/ui/Cards";
import { ImageSlot } from "@/components/ui/ImageSlot";

export function DestinationsClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Water Index state
  const [waterExp, setWaterExp] = useState(searchParams.get("experience") || "");

  // Trip Grid state
  const [fWater, setFWater] = useState(searchParams.get("water") || "");
  const [fExp, setFExp] = useState(searchParams.get("experience") || "");
  const [fLen, setFLen] = useState(searchParams.get("length") || "");
  const [fBoat, setFBoat] = useState(searchParams.get("boat") || "");

  // Derived state
  const filteredWaters = useMemo(() => {
    if (!waterExp) return waters;
    return waters.filter((w) => w.bestFor.includes(waterExp as any));
  }, [waterExp]);

  const filteredTrips = useMemo(() => {
    return filterTrips({
      water: fWater,
      experience: fExp,
      length: fLen,
      boat: fBoat,
    });
  }, [fWater, fExp, fLen, fBoat]);

  const isTripsFiltered = fWater !== "" || fExp !== "" || fLen !== "" || fBoat !== "";

  // Functions
  const applyTripsFilter = (newFilters: any) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v as string);
      else params.delete(k);
    });
    router.replace(`${pathname}?${params.toString()}#itineraries`, { scroll: false });
  };

  const handleWaterExpClick = (val: string) => {
    setWaterExp(val);
  };

  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink">
        <div className="ph ph-lagoon absolute inset-0 opacity-40"></div>
        <div className="scrim absolute inset-0" />
        <div className="relative mx-auto max-w-[88rem] px-5 pb-14 pt-32 sm:px-6 lg:px-8 lg:pb-20 lg:pt-40">
          <span className="wave-rule wave-rule-light block" />
          <p className="mt-5 font-mark text-[0.6875rem] uppercase leading-none tracking-[0.22em] text-white/75">
            Destinations
          </p>
          <h1 className="mt-4 font-display text-4xl font-light leading-[1.04] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Eight waters,<br className="hidden sm:block" /> eight seasons
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
            Indonesia is four thousand kilometres wide and the monsoon does not arrive everywhere at
            once. Whichever month you are free, one of these regions is at its best — which is the
            whole reason we sail all eight.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[88rem] px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 no-scrollbar lg:mx-0 lg:flex-wrap lg:px-0"
               role="group" aria-label="Filter waters by experience">
            <button type="button" onClick={() => handleWaterExpClick('')}
                    className={`shrink-0 rounded-full border px-4 py-2 font-mark text-[11px] uppercase tracking-[0.14em] transition ${waterExp === '' ? 'border-ink bg-ink text-white' : 'border-sand-300 text-ink-700 hover:border-mist'}`}>
              All eight
            </button>
            {experiences.map((e) => (
              <button key={e.slug} type="button" onClick={() => handleWaterExpClick(e.slug)}
                      className={`shrink-0 rounded-full border px-4 py-2 font-mark text-[11px] uppercase tracking-[0.14em] transition ${waterExp === e.slug ? 'border-ink bg-ink text-white' : 'border-sand-300 text-ink-700 hover:border-mist'}`}>
                Best for {e.name.toLowerCase()}
              </button>
            ))}
          </div>
          <p className="font-mark text-[11px] uppercase tracking-[0.16em] text-mist-700" aria-live="polite">
            <span>{filteredWaters.length}</span> of 8 waters
          </p>
        </div>

        {filteredWaters.length === 0 ? (
          <div className="mt-10 py-10 text-center">
            <h3 className="font-display text-2xl text-ink-700">No water is built for that, yet</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink/70">
              We only claim a region is right for something when it genuinely is. Clear the filter to see all eight, or tell us what you are after.
            </p>
            <button onClick={() => setWaterExp("")} className="mt-6 inline-flex h-11 items-center rounded-full bg-ink px-5 font-mark text-[11px] uppercase tracking-[0.16em] text-white transition hover:bg-ink-600">
              Show all eight
            </button>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredWaters.map((w) => (
              <Link key={w.slug} href={`/destinations/${w.slug}`} className="group block focus:outline-none focus:ring-2 focus:ring-mist focus:ring-offset-2">
                <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-ink">
                  <div className={`ph ph-${w.ph} absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.03]`}>
                    <ImageSlot src={`/media/photos/destinations/${w.slug}.jpg`} alt={w.name} />
                  </div>
                  <div className="scrim-soft absolute inset-0"></div>
                  <div className="absolute inset-x-5 bottom-6">
                    <h3 className="font-display text-[1.75rem] leading-none text-white">{w.name}</h3>
                    <p className="mt-1.5 font-mark text-[11px] uppercase tracking-[0.16em] text-white/80">{w.season}</p>
                  </div>
                </div>
                <div className="px-1 pt-4">
                  <p className="line-clamp-2 text-sm leading-relaxed text-ink/75">{w.blurb}</p>
                  <p className="mt-2.5 font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">
                    Gateway: {w.gateway}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="border-y border-sand-300 bg-sand">
        <div className="mx-auto max-w-[88rem] px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-xl">
            <p className="font-mark text-[11px] uppercase tracking-[0.2em] text-flame">When to go where</p>
            <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">
              Pick the month, and the region picks itself
            </h2>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[42rem] border-collapse text-left">
              <caption className="sr-only">Best sailing season by region and gateway port</caption>
              <thead>
                <tr className="border-b border-sand-300">
                  <th scope="col" className="pb-3 pr-4 font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Water</th>
                  <th scope="col" className="pb-3 pr-4 font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Season</th>
                  <th scope="col" className="pb-3 pr-4 font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Gateway</th>
                  <th scope="col" className="pb-3 pr-4 font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Crossings</th>
                  <th scope="col" className="pb-3 font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Routes</th>
                </tr>
              </thead>
              <tbody>
                {waters.map((w) => (
                  <tr key={w.slug} className="group border-b border-sand-200 align-top transition hover:bg-white/70">
                    <th scope="row" className="py-4 pr-4 font-normal">
                      <Link href={`/destinations/${w.slug}`} className="font-display text-lg text-ink-700 transition-colors group-hover:text-flame-600">
                        {w.short}
                      </Link>
                    </th>
                    <td className="py-4 pr-4 text-sm text-ink/75">{w.season}</td>
                    <td className="py-4 pr-4 text-sm text-ink/75">{w.gateway}</td>
                    <td className="py-4 pr-4 text-sm text-ink/60">{w.crossing}</td>
                    <td className="py-4 text-sm text-ink/75">{trips.filter(t => t.water === w.slug).length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="itineraries" className="mx-auto max-w-[88rem] px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="font-mark text-[11px] uppercase tracking-[0.2em] text-flame">Itineraries</p>
            <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl lg:text-5xl">
              Every route we sail
            </h2>
          </div>
          <Link href="/discover" className="group inline-flex items-center gap-2 font-mark text-[11px] uppercase tracking-[0.18em] text-ink-700 hover:text-flame-600">
            Let us narrow it down instead
            <span className="icon icon-chevron-right h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true"></span>
          </Link>
        </div>

        <div className="mt-8 grid gap-4 rounded-3xl border border-sand-300 bg-sand p-5 sm:grid-cols-2 lg:grid-cols-4 lg:p-6">
          <label className="block">
            <span className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Water</span>
            <select value={fWater} onChange={(e) => { setFWater(e.target.value); applyTripsFilter({ water: e.target.value }); }}
                    className="mt-1.5 h-12 w-full rounded-xl border-sand-300 bg-white text-ink-700 focus:border-mist focus:ring-2 focus:ring-mist/40">
              <option value="">Anywhere</option>
              {waters.map((w) => <option key={w.slug} value={w.slug}>{w.short}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Experience</span>
            <select value={fExp} onChange={(e) => { setFExp(e.target.value); applyTripsFilter({ experience: e.target.value }); }}
                    className="mt-1.5 h-12 w-full rounded-xl border-sand-300 bg-white text-ink-700 focus:border-mist focus:ring-2 focus:ring-mist/40">
              <option value="">Any</option>
              {experiences.map((e) => <option key={e.slug} value={e.slug}>{e.name}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Length</span>
            <select value={fLen} onChange={(e) => { setFLen(e.target.value); applyTripsFilter({ length: e.target.value }); }}
                    className="mt-1.5 h-12 w-full rounded-xl border-sand-300 bg-white text-ink-700 focus:border-mist focus:ring-2 focus:ring-mist/40">
              <option value="">Any</option>
              {lengths.map((l) => <option key={l.slug} value={l.slug}>{l.label}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Boat</span>
            <select value={fBoat} onChange={(e) => { setFBoat(e.target.value); applyTripsFilter({ boat: e.target.value }); }}
                    className="mt-1.5 h-12 w-full rounded-xl border-sand-300 bg-white text-ink-700 focus:border-mist focus:ring-2 focus:ring-mist/40">
              <option value="">Any of the four</option>
              {boats.map((b) => <option key={b.slug} value={b.slug}>{b.name}</option>)}
            </select>
          </label>

          <div className="flex items-center justify-between gap-4 sm:col-span-2 lg:col-span-4">
            <p className="text-sm text-ink/70" aria-live="polite">
              <strong className="font-display text-lg text-ink-700">{filteredTrips.length}</strong>
              {' '}{filteredTrips.length === 1 ? 'itinerary' : 'itineraries'}
            </p>
            {isTripsFiltered && (
              <button type="button" onClick={() => {
                setFWater(""); setFExp(""); setFLen(""); setFBoat("");
                applyTripsFilter({ water: "", experience: "", length: "", boat: "" });
              }} className="font-mark text-[11px] uppercase tracking-[0.16em] text-flame-600 underline underline-offset-4">
                Clear filters
              </button>
            )}
          </div>
        </div>

        {filteredTrips.length === 0 ? (
          <div className="mt-10 py-10 text-center">
            <h3 className="font-display text-2xl text-ink-700">That combination is not in this season</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink/70">
              Seasons move, and so does the fleet. Clear a filter to see what is close — or ask us; a fair number of guests end up on a route that was never published.
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <button onClick={() => {
                setFWater(""); setFExp(""); setFLen(""); setFBoat("");
                applyTripsFilter({ water: "", experience: "", length: "", boat: "" });
              }} className="inline-flex h-11 items-center rounded-full bg-ink px-5 font-mark text-[11px] uppercase tracking-[0.16em] text-white transition hover:bg-ink-600">
                Clear filters
              </button>
              <Link href="/charter" className="inline-flex h-11 items-center rounded-full border border-ink/20 px-5 font-mark text-[11px] uppercase tracking-[0.16em] text-ink-700 transition hover:bg-sand">
                Build it as a charter
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {filteredTrips.map((t) => (
              <TripCard key={t.slug} trip={t} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
