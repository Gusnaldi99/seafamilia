import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { PhotoSlot } from '@/components/media/photo-slot';
import { WaterCard } from '@/components/cards/water-card';
import { NotFoundSearch } from './not-found-search';
import { LITERAL_PHOTOS, PHOTO_SIZES } from '@/lib/photo-paths';
import { routes } from '@/lib/routes';
import { waters } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Off the Chart',
  description: 'That page is not here. Search, or start from one of the waters we sail.',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink">
        <PhotoSlot ph="night" src={LITERAL_PHOTOS.notFound} alt="" sizes={PHOTO_SIZES.hero} />
        <div className="scrim absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-3xl px-5 pb-16 pt-32 text-center sm:px-6 lg:pb-24 lg:pt-40">
          <span className="wave-rule wave-rule-light mx-auto block" aria-hidden="true" />
          <p className="mt-6 font-display text-6xl font-light text-white/40 sm:text-7xl">404</p>
          <h1 className="mt-2 font-display text-4xl font-light leading-[1.06] tracking-tight text-white sm:text-5xl">
            This one is off the chart
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            The page you were after is not here. It may have sailed, been renamed, or never existed — our routes
            get folded into each other between seasons and links do go stale.
          </p>

          <Suspense fallback={<div className="mt-9 h-14" />}>
            <NotFoundSearch />
          </Suspense>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={routes.home()}
              className="inline-flex items-center rounded-full bg-flame px-6 py-4 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-flame-600"
            >
              Back to the harbour
            </Link>
            <Link
              href={routes.departures()}
              className="inline-flex items-center rounded-full border border-white/30 px-6 py-4 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-white hover:text-ink-700"
            >
              Find a departure
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-8xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-xl">
          <p className="font-mark text-eyebrow uppercase text-flame">Or start here</p>
          <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">
            The waters people ask about most
          </h2>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {waters.slice(0, 4).map((w) => (
            <WaterCard key={w.slug} water={w} />
          ))}
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-3">
          <Link href={routes.experiences()} className="group rounded-2xl border border-sand-300 p-5 transition hover:border-mist hover:bg-sand">
            <h3 className="font-display text-lg text-ink-700 group-hover:text-flame-600">Six experiences</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink/65">Diving, family, remote, culture, slow sailing, photography.</p>
          </Link>
          <Link href={routes.boats()} className="group rounded-2xl border border-sand-300 p-5 transition hover:border-mist hover:bg-sand">
            <h3 className="font-display text-lg text-ink-700 group-hover:text-flame-600">Two boats</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink/65">Sea Familia and Sea Familia 2, both built in Bira.</p>
          </Link>
          <Link href={routes.journal()} className="group rounded-2xl border border-sand-300 p-5 transition hover:border-mist hover:bg-sand">
            <h3 className="font-display text-lg text-ink-700 group-hover:text-flame-600">The journal</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink/65">Written on the boat by the people who were there.</p>
          </Link>
        </div>
      </section>
    </>
  );
}
