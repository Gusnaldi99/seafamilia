import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { PageBreadcrumb } from '@/components/chrome/page-breadcrumb';
import { ExperienceCard } from '@/components/cards/experience-card';
import { TripCard } from '@/components/cards/trip-card';
import { ChevronRight } from '@/components/icons';
import { MatchingTrips } from './matching-trips';
import { routes } from '@/lib/routes';
import { experiences, trips } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Experiences',
  description:
    'Six reasons people get on the boat — diving, family time, remote water, culture, wellness and the light. Start from what you want, and the route picks itself.',
};

const tripCards = Object.fromEntries(trips.map((t) => [t.slug, <TripCard key={t.slug} trip={t} />]));

export default function ExperiencesPage() {
  return (
    <>
      <section className="border-b border-sand-300 bg-sand">
        <div className="mx-auto max-w-8xl px-5 pb-12 pt-8 sm:px-6 lg:px-8 lg:pb-16 lg:pt-12">
          <PageBreadcrumb label="Experiences" />
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-16">
            <div>
              <p className="font-mark text-eyebrow uppercase text-flame">Experiences</p>
              <h1 className="mt-4 font-display text-4xl font-light leading-[1.06] tracking-tight text-ink-700 sm:text-5xl lg:text-6xl">
                Six reasons people
                <br className="hidden sm:block" /> get on the boat
              </h1>
            </div>
            <p className="text-base leading-relaxed text-ink/70">
              Most guests arrive knowing roughly what they want out of a week at sea — the reef, the
              crossing, the children being tired in a good way. Start from that, and the route more
              or less picks itself.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-8xl px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <h2 className="sr-only">The six experiences</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {experiences.map((e) => (
            <ExperienceCard key={e.slug} experience={e} />
          ))}
        </div>
      </section>

      <Suspense fallback={<div className="border-t border-sand-300 bg-sand py-14 lg:py-20" />}>
        <MatchingTrips tripCards={tripCards} />
      </Suspense>

      <section className="mx-auto max-w-8xl px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-8 rounded-4xl bg-ink p-8 text-white lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-16 lg:p-14">
          <div>
            <span className="wave-rule wave-rule-light block" aria-hidden="true" />
            <h2 className="mt-5 font-display text-3xl font-light leading-tight tracking-tight sm:text-4xl">
              Still not sure which of the six you are?
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-white/75">
              Most people are two of them. Answer five questions and we will show you the departures
              where those two overlap — and tell you honestly when they do not.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <Link
              href={routes.plan()}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-flame px-7 font-mark text-[13px] uppercase tracking-[0.16em] text-white transition hover:bg-flame-600"
            >
              Plan your trip
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href={routes.contact()}
              className="inline-flex h-14 items-center justify-center rounded-full border border-white/30 px-7 font-mark text-[13px] uppercase tracking-[0.16em] text-white transition hover:bg-white hover:text-ink-700"
            >
              Ask a person
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
