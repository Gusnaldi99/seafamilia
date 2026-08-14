import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DepartureCard } from '@/components/cards/departure-card';
import { TripCard } from '@/components/cards/trip-card';
import { WaterCard } from '@/components/cards/water-card';
import { PhotoSlot } from '@/components/media/photo-slot';
import { Money } from '@/components/providers/locale-provider';
import { ChevronRight, EXPERIENCE_ICONS } from '@/components/icons';
import { PHOTO_SIZES, photoPath } from '@/lib/photo-paths';
import { experienceBySlug, filterDepartures, tripsInWater, waterBySlug } from '@/lib/queries';
import { routes } from '@/lib/routes';
import { waters } from '@/lib/data';

export function generateStaticParams() {
  return waters.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: PageProps<'/destinations/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const water = waterBySlug(slug);
  if (!water) return {};
  return { title: water.name, description: water.blurb };
}

export default async function DestinationDetailPage({ params }: PageProps<'/destinations/[slug]'>) {
  const { slug } = await params;
  const water = waterBySlug(slug);
  if (!water) notFound();

  const trips = tripsInWater(water.slug);
  const deps = filterDepartures({ water: water.slug, available: true }).slice(0, 4);
  const others = waters.filter((x) => x.slug !== water.slug).slice(0, 4);
  const bestFor = water.bestFor.map((s) => experienceBySlug(s)).filter((e) => e !== undefined);
  const cheapest = trips.length ? Math.min(...trips.map((t) => t.from)) : null;

  return (
    <>
      <section className="relative isolate flex min-h-[70vh] items-end overflow-hidden bg-ink">
        <PhotoSlot ph={water.ph} src={photoPath.water(water.slug)} alt={water.name} sizes={PHOTO_SIZES.hero} />
        <div className="scrim absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto w-full max-w-8xl px-5 pb-12 pt-28 sm:px-6 lg:px-8 lg:pb-16">
          <nav aria-label="Breadcrumb" className="font-mark text-[11px] uppercase tracking-[0.16em] text-white/60">
            <Link href={routes.home()} className="hover:text-white">
              Home
            </Link>
            <span className="px-2" aria-hidden="true">
              /
            </span>
            <Link href={routes.destinations()} className="hover:text-white">
              Destinations
            </Link>
            <span className="px-2" aria-hidden="true">
              /
            </span>
            <span className="text-white">{water.short}</span>
          </nav>
          <div className="mt-8 max-w-3xl">
            <span className="wave-rule wave-rule-light block" aria-hidden="true" />
            <h1 className="mt-5 font-display text-4xl font-light leading-[1.04] tracking-tight text-white sm:text-5xl lg:text-6xl">{water.name}</h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">{water.blurb}</p>
          </div>
        </div>
      </section>

      <section className="border-b border-sand-300 bg-white">
        <div className="mx-auto max-w-8xl px-5 sm:px-6 lg:px-8">
          <dl className="grid grid-cols-2 divide-sand-300 py-8 sm:grid-cols-4 sm:divide-x">
            <div className="pb-4 sm:pb-0 sm:pr-6">
              <dt className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Best season</dt>
              <dd className="mt-1.5 font-display text-lg text-ink-700">{water.season}</dd>
            </div>
            <div className="pb-4 sm:px-6 sm:pb-0">
              <dt className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Gateway port</dt>
              <dd className="mt-1.5 font-display text-lg text-ink-700">{water.gateway}</dd>
            </div>
            <div className="border-t border-sand-300 pt-4 sm:border-0 sm:px-6 sm:pt-0">
              <dt className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Crossings</dt>
              <dd className="mt-1.5 font-display text-lg text-ink-700">{water.crossing}</dd>
            </div>
            <div className="border-t border-sand-300 pt-4 sm:border-0 sm:pl-6 sm:pt-0">
              <dt className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Itineraries</dt>
              <dd className="mt-1.5 font-display text-lg text-ink-700">
                {trips.length} · from <Money usd={cheapest} />
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-8xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
          <div>
            <p className="font-mark text-eyebrow uppercase text-flame">What it is like</p>
            <p className="mt-5 font-display text-xl font-light leading-relaxed text-ink-700 sm:text-2xl">{water.story}</p>

            <h2 className="mt-10 font-mark text-[11px] uppercase tracking-[0.18em] text-flame">Anchorages we use</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {water.stops.map((s) => (
                <li key={s} className="rounded-full border border-sand-300 px-3.5 py-1.5 font-mark text-[11px] uppercase tracking-[0.12em] text-ink-700">
                  {s}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs leading-relaxed text-ink/50">
              A list of intentions, not a promise. The captain swaps anchorages freely for weather, current or a better
              day — and we have never had a guest tell us the swap was worse.
            </p>
          </div>

          <aside className="lg:pt-14">
            <div className="rounded-3xl bg-sand p-6 lg:p-7">
              <h2 className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">Three things you will remember</h2>
              <ul className="mt-4 space-y-4">
                {water.highlights.map((h, i) => (
                  <li key={h} className="flex gap-3.5">
                    <span className="mt-0.5 font-display text-lg text-mist">0{i + 1}</span>
                    <span className="text-sm leading-relaxed text-ink/80">{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 rounded-3xl border border-sand-300 p-6 lg:p-7">
              <h2 className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">Best suited to</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {bestFor.map((e) => {
                  const Icon = EXPERIENCE_ICONS[e.slug as keyof typeof EXPERIENCE_ICONS];
                  return (
                    <Link
                      key={e.slug}
                      href={routes.experience(e.slug)}
                      className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 font-mark text-[11px] uppercase tracking-[0.12em] text-ink-700 ring-1 ring-inset ring-sand-300 transition hover:ring-mist"
                    >
                      {Icon ? <Icon className="h-4 w-4 text-mist-700" aria-hidden="true" /> : null}
                      <span>{e.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-t border-sand-300 bg-sand">
        <div className="mx-auto max-w-8xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-xl">
            <p className="font-mark text-eyebrow uppercase text-flame">Itineraries</p>
            <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">
              Routes through {water.short}
            </h2>
          </div>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {trips.map((t) => (
              <TripCard key={t.slug} trip={t} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-8xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="font-mark text-eyebrow uppercase text-flame">Dates</p>
            <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">Sailing here next</h2>
          </div>
          <Link
            href={routes.departures({ water: water.slug })}
            className="group inline-flex items-center gap-2 font-mark text-[11px] uppercase tracking-[0.18em] text-ink-700 hover:text-flame-600"
          >
            Search every date
            <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>

        {deps.length > 0 ? (
          <div className="mt-8 space-y-3">
            {deps.map((d) => (
              <DepartureCard key={d.id} departure={d} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-dashed border-mist-300 bg-sand px-6 py-12 text-center">
            <h3 className="font-display text-xl text-ink-700">Nothing scheduled here right now</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink/70">
              This region runs <span className="text-ink-700">{water.season}</span>, and the next season is not on sale
              yet. Leave your email and you will hear before the dates go public.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={routes.contact()}
                className="inline-flex h-11 items-center rounded-full bg-ink px-5 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-ink-600"
              >
                Tell me when it opens
              </Link>
              <Link
                href={routes.charter()}
                className="inline-flex h-11 items-center rounded-full border border-ink/20 px-5 font-mark text-[12px] uppercase tracking-[0.14em] text-ink-700 transition hover:border-ink"
              >
                Charter it privately
              </Link>
            </div>
          </div>
        )}
      </section>

      <section className="border-t border-sand-300 bg-white">
        <div className="mx-auto max-w-8xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
          <h2 className="font-display text-2xl font-light text-ink-700 sm:text-3xl">Other waters</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((o) => (
              <WaterCard key={o.slug} water={o} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
