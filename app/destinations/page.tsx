import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { PageBreadcrumb } from '@/components/chrome/page-breadcrumb';
import { TripCard } from '@/components/cards/trip-card';
import { WaterCard } from '@/components/cards/water-card';
import { WaterIndex } from './water-index';
import { TripGrid } from './trip-grid';
import { routes } from '@/lib/routes';
import { tripsInWater } from '@/lib/queries';
import { trips, waters } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Destinations',
  description:
    'Eight waters, eight seasons — Komodo, Raja Ampat, the Banda Sea and beyond. Whichever month you are free, one region is at its best.',
};

const waterCards = Object.fromEntries(waters.map((w) => [w.slug, <WaterCard key={w.slug} water={w} />]));
const tripCards = Object.fromEntries(trips.map((t) => [t.slug, <TripCard key={t.slug} trip={t} />]));

export default function DestinationsPage() {
  return (
    <>
      <section className="border-b border-sand-300 bg-sand">
        <div className="mx-auto max-w-8xl px-5 pb-12 pt-8 sm:px-6 lg:px-8 lg:pb-16 lg:pt-12">
          <PageBreadcrumb label="Destinations" />
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-16">
            <div>
              <p className="font-mark text-eyebrow uppercase text-flame">Destinations</p>
              <h1 className="mt-4 font-display text-4xl font-light leading-[1.06] tracking-tight text-ink-700 sm:text-5xl lg:text-6xl">
                Eight waters,
                <br className="hidden sm:block" /> eight seasons
              </h1>
            </div>
            <p className="text-base leading-relaxed text-ink/70">
              Indonesia is four thousand kilometres wide and the monsoon does not arrive everywhere
              at once. Whichever month you are free, one of these regions is at its best — which is
              the whole reason we sail all eight.
            </p>
          </div>
        </div>
      </section>

      <Suspense fallback={<div className="mx-auto max-w-8xl px-5 py-12 sm:px-6 lg:px-8 lg:py-16" />}>
        <WaterIndex waterCards={waterCards} />
      </Suspense>

      <section className="border-y border-sand-300 bg-sand">
        <div className="mx-auto max-w-8xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-xl">
            <p className="font-mark text-eyebrow uppercase text-flame">When to go where</p>
            <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">
              Pick the month, and the region picks itself
            </h2>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[42rem] border-collapse text-left">
              <caption className="sr-only">Best sailing season by region and gateway port</caption>
              <thead>
                <tr className="border-b border-sand-300">
                  <th scope="col" className="pb-3 pr-4 font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">
                    Water
                  </th>
                  <th scope="col" className="pb-3 pr-4 font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">
                    Season
                  </th>
                  <th scope="col" className="pb-3 pr-4 font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">
                    Gateway
                  </th>
                  <th scope="col" className="pb-3 pr-4 font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">
                    Crossings
                  </th>
                  <th scope="col" className="pb-3 font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">
                    Routes
                  </th>
                </tr>
              </thead>
              <tbody>
                {waters.map((w) => (
                  <tr key={w.slug} className="group border-b border-sand-200 align-top transition hover:bg-white/70">
                    <th scope="row" className="py-4 pr-4 font-normal">
                      <Link href={routes.destination(w.slug)} className="font-display text-lg text-ink-700 transition-colors group-hover:text-flame-600">
                        {w.short}
                      </Link>
                    </th>
                    <td className="py-4 pr-4 text-sm text-ink/75">{w.season}</td>
                    <td className="py-4 pr-4 text-sm text-ink/75">{w.gateway}</td>
                    <td className="py-4 pr-4 text-sm text-ink/60">{w.crossing}</td>
                    <td className="py-4 text-sm text-ink/75">{tripsInWater(w.slug).length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Suspense fallback={<div className="mx-auto max-w-8xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20" />}>
        <TripGrid tripCards={tripCards} />
      </Suspense>
    </>
  );
}
