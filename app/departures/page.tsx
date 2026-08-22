import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { PageBreadcrumb } from '@/components/chrome/page-breadcrumb';
import { DepartureCard } from '@/components/cards/departure-card';
import { DepartureSearch } from './departure-search';
import { routes } from '@/lib/routes';
import { departures } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Departures',
  description:
    'Every scheduled date across both boats. Reserve one cabin and share the boat — availability updates as cabins go.',
};

const departureCards = Object.fromEntries(departures.map((d) => [d.id, <DepartureCard key={d.id} departure={d} />]));

export default function DeparturesPage() {
  return (
    <>
      <section className="border-b border-sand-300 bg-sand">
        <div className="mx-auto max-w-8xl px-5 pb-10 pt-8 sm:px-6 lg:px-8 lg:pb-12 lg:pt-12">
          <PageBreadcrumb label="Departures" />
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-16">
            <div>
              <p className="font-mark text-eyebrow uppercase text-flame">Departures</p>
              <h1 className="mt-4 font-display text-4xl font-light leading-[1.06] tracking-tight text-ink-700 sm:text-5xl lg:text-6xl">
                Every date,
                <br className="hidden sm:block" /> across both boats
              </h1>
            </div>
            <p className="text-base leading-relaxed text-ink/70">
              Scheduled open trips — reserve one cabin and share the boat. Availability updates as
              cabins go, so what you see here is what is genuinely left.
            </p>
          </div>
        </div>
      </section>

      <Suspense fallback={<div className="border-b border-sand-300 bg-white py-5" />}>
        <DepartureSearch departureCards={departureCards} />
      </Suspense>

      <section className="border-t border-sand-300 bg-sand">
        <div className="mx-auto max-w-8xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-3 lg:gap-10">
            <div>
              <h2 className="font-display text-2xl font-light text-ink-700">Nothing quite right?</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                Three other ways in — and a fair number of guests end up on a route that was never
                on this page.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:col-span-2">
              <Link href={routes.plan()} className="group rounded-2xl border border-sand-300 bg-white p-5 transition hover:border-mist">
                <h3 className="font-display text-lg text-ink-700 group-hover:text-flame-600">Answer 5 questions</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/65">We match the departures to you rather than the reverse.</p>
              </Link>
              <Link href={routes.charter()} className="group rounded-2xl border border-sand-300 bg-white p-5 transition hover:border-mist">
                <h3 className="font-display text-lg text-ink-700 group-hover:text-flame-600">Take a whole boat</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/65">Your dates, your group, a route drawn with you.</p>
              </Link>
              <Link href={routes.contact()} className="group rounded-2xl border border-sand-300 bg-white p-5 transition hover:border-mist">
                <h3 className="font-display text-lg text-ink-700 group-hover:text-flame-600">Ask the office</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/65">Two people in Labuan Bajo, answering on WhatsApp.</p>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
