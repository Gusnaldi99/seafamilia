import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DepartureCard } from '@/components/cards/departure-card';
import { TripCard } from '@/components/cards/trip-card';
import { PhotoSlot } from '@/components/media/photo-slot';
import { Money, Nights } from '@/components/providers/locale-provider';
import { Check, ChevronRight, Minus } from '@/components/icons';
import { RouteSection } from './route-section';
import { TripGallery, type GalleryItem } from './trip-gallery';
import { PHOTO_SIZES, photoPath } from '@/lib/photo-paths';
import { photoIfExists } from '@/lib/photo';
import {
  boatBySlug,
  departuresFor,
  experienceBySlug,
  filterTrips,
  routeFor,
  tripBySlug,
  tripsInWater,
  waterBySlug,
} from '@/lib/queries';
import { routes } from '@/lib/routes';
import { inclusions, trips } from '@/lib/data';

export function generateStaticParams() {
  return trips.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps<'/itineraries/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const trip = tripBySlug(slug);
  if (!trip) return {};
  const water = waterBySlug(trip.water);
  return { title: `${trip.title} · ${water?.short ?? ''}`, description: trip.summary };
}

export default async function TripDetailPage({ params }: PageProps<'/itineraries/[slug]'>) {
  const { slug } = await params;
  const trip = tripBySlug(slug);
  if (!trip) notFound();

  const water = waterBySlug(trip.water);
  const boat = boatBySlug(trip.boat);
  if (!water || !boat) notFound();

  const exps = trip.experiences.map((s) => experienceBySlug(s)).filter((e) => e !== undefined);
  const deps = departuresFor(trip.slug);
  const route = routeFor(trip);
  const routeIsProvisional = route.some((d) => d.provisional);
  const included = trip.included ?? inclusions.included;
  const excluded = trip.excluded ?? inclusions.excluded;

  const sameWater = tripsInWater(trip.water).filter((x) => x.slug !== trip.slug);
  const sameExp = filterTrips({ experience: trip.experiences[0] }).filter(
    (x) => x.slug !== trip.slug && !sameWater.some((s) => s.slug === x.slug)
  );
  const related = [...sameWater, ...sameExp].slice(0, 3);

  const galleryItems: GalleryItem[] = [
    { ph: trip.ph, caption: trip.title, src: photoIfExists(photoPath.trip(trip.slug)) },
    { ph: water.ph, caption: water.short, src: photoIfExists(photoPath.water(water.slug)) },
    { ph: boat.ph, caption: `${boat.name} under sail`, src: photoIfExists(photoPath.boat(boat.slug)) },
    { ph: 'cabin', caption: `Cabins on ${boat.name}`, src: photoIfExists(photoPath.cabin(boat.slug, boat.cabinTypes[0].code)) },
  ];

  return (
    <div className="pb-20 lg:pb-0">
      <section className="relative isolate flex min-h-[74vh] items-end overflow-hidden bg-ink">
        <PhotoSlot ph={trip.ph} src={photoPath.trip(trip.slug)} alt={trip.title} sizes={PHOTO_SIZES.hero} />
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
            <Link href={routes.destination(water.slug)} className="hover:text-white">
              {water.short}
            </Link>
          </nav>

          <div className="mt-8 flex flex-wrap items-center gap-2">
            {trip.editorPick ? (
              <span className="inline-flex items-center rounded-full bg-flame px-3 py-1.5 font-mark text-[10px] uppercase tracking-[0.18em] text-white">
                Editor&rsquo;s pick
              </span>
            ) : null}
            {exps.map((e) => (
              <Link
                key={e.slug}
                href={routes.experience(e.slug)}
                className="inline-flex items-center rounded-full bg-white/15 px-3 py-1.5 font-mark text-[10px] uppercase tracking-[0.16em] text-white ring-1 ring-inset ring-white/25 backdrop-blur transition hover:bg-white hover:text-ink-700"
              >
                {e.name}
              </Link>
            ))}
          </div>

          <h1 className="mt-5 max-w-3xl font-display text-4xl font-light leading-[1.04] tracking-tight text-white sm:text-5xl lg:text-6xl">{trip.title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">{trip.summary}</p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href="#dates"
              className="inline-flex h-14 items-center gap-2.5 rounded-full bg-flame px-7 font-mark text-[13px] uppercase tracking-[0.16em] text-white transition hover:bg-flame-600"
            >
              Reserve a cabin
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <p className="font-mark text-[11px] uppercase tracking-[0.14em] text-white/80">
              From <Money usd={trip.from} /> per person · {deps.length} dates open
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-sand-300 bg-white">
        <div className="mx-auto max-w-8xl px-5 sm:px-6 lg:px-8">
          <dl className="grid grid-cols-2 gap-y-6 py-8 sm:grid-cols-3 lg:grid-cols-5 lg:divide-x lg:divide-sand-300">
            <div className="lg:pr-6">
              <dt className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Length</dt>
              <dd className="mt-1.5 font-display text-lg text-ink-700">
                <Nights n={trip.nights} />
              </dd>
            </div>
            <div className="lg:px-6">
              <dt className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Water</dt>
              <dd className="mt-1.5 font-display text-lg text-ink-700">{water.short}</dd>
            </div>
            <div className="lg:px-6">
              <dt className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Boat</dt>
              <dd className="mt-1.5 font-display text-lg text-ink-700">
                <Link href={routes.boat(boat.slug)} className="underline decoration-mist-300 decoration-1 underline-offset-4 hover:text-flame-600">
                  {boat.name}
                </Link>
              </dd>
            </div>
            <div className="lg:px-6">
              <dt className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Starts &amp; ends</dt>
              <dd className="mt-1.5 font-display text-lg text-ink-700">{trip.gateway}</dd>
            </div>
            <div className="lg:pl-6">
              <dt className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Guests on board</dt>
              <dd className="mt-1.5 font-display text-lg text-ink-700">Up to {boat.guests}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-8xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
          <div>
            <p className="font-mark text-eyebrow uppercase text-flame">Why this route exists</p>
            <p className="mt-5 font-display text-xl font-light leading-relaxed text-ink-700 sm:text-2xl">{trip.story}</p>
          </div>
          <aside className="rounded-3xl bg-sand p-6 lg:p-7">
            <h2 className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">What you will remember</h2>
            <ul className="mt-4 space-y-4">
              {trip.highlights.map((h, i) => (
                <li key={h} className="flex gap-3.5">
                  <span className="mt-0.5 font-display text-lg text-mist">0{i + 1}</span>
                  <span className="text-sm leading-relaxed text-ink/80">{h}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="border-y border-sand-300 bg-sand">
        <div className="mx-auto max-w-8xl px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="flex items-end justify-between gap-6">
            <h2 className="font-display text-2xl font-light text-ink-700 sm:text-3xl">On this route</h2>
            <p className="font-mark text-[11px] uppercase tracking-[0.16em] text-mist-700">{galleryItems.length} images</p>
          </div>
          <TripGallery items={galleryItems} />
        </div>
      </section>

      <RouteSection nights={trip.nights} route={route} provisional={routeIsProvisional} />

      <section className="border-y border-sand-300 bg-sand">
        <div className="mx-auto max-w-8xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-xl">
            <p className="font-mark text-eyebrow uppercase text-flame">The fare</p>
            <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">What your cabin covers</h2>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-16">
            <div>
              <h3 className="font-mark text-[11px] uppercase tracking-[0.18em] text-ink-700">Included</h3>
              <ul className="mt-4 space-y-3">
                {included.map((i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink/80">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-mist" aria-hidden="true" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-mark text-[11px] uppercase tracking-[0.18em] text-ink-700">Not included</h3>
              <ul className="mt-4 space-y-3">
                {excluded.map((i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink/70">
                    <Minus className="mt-0.5 h-4 w-4 shrink-0 text-sand-300" aria-hidden="true" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-xs leading-relaxed text-ink/70">
                Deposit is 25% of the cabin total (30% on the twelve-night Banda crossings), balance due 60 days
                before you sail.{' '}
                <Link href={routes.policies('cancellation')} className="text-flame-600 underline underline-offset-4">
                  Cancellation policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-8xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16">
          <Link href={routes.boat(boat.slug)} className="group relative block aspect-[16/11] overflow-hidden rounded-3xl bg-ink">
            <PhotoSlot
              ph={boat.ph}
              src={photoPath.boat(boat.slug)}
              alt={boat.name}
              sizes={PHOTO_SIZES.boatCard}
              className="transition-transform duration-700 ease-swell group-hover:scale-[1.03]"
            />
            <div className="scrim-soft absolute inset-0" aria-hidden="true" />
            <div className="absolute inset-x-6 bottom-6">
              <p className="font-mark text-[10px] uppercase tracking-[0.18em] text-white/75">{boat.type}</p>
              <p className="mt-1 font-display text-3xl text-white">{boat.name}</p>
            </div>
          </Link>
          <div>
            <p className="font-mark text-eyebrow uppercase text-flame">Your boat</p>
            <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">{boat.tagline}</h2>
            <p className="mt-4 text-base leading-relaxed text-ink/70">{boat.blurb}</p>
            <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-sand-300 pt-6 sm:grid-cols-4">
              <div>
                <dt className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Length</dt>
                <dd className="mt-1 font-display text-lg text-ink-700">{boat.length}</dd>
              </div>
              <div>
                <dt className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Cabins</dt>
                <dd className="mt-1 font-display text-lg text-ink-700">{boat.cabins}</dd>
              </div>
              <div>
                <dt className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Guests</dt>
                <dd className="mt-1 font-display text-lg text-ink-700">{boat.guests}</dd>
              </div>
              <div>
                <dt className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Crew</dt>
                <dd className="mt-1 font-display text-lg text-ink-700">{boat.crew}</dd>
              </div>
            </dl>
            <Link
              href={routes.boat(boat.slug)}
              className="mt-7 inline-flex h-12 items-center gap-2 rounded-full border border-ink/20 px-6 font-mark text-[12px] uppercase tracking-[0.14em] text-ink-700 transition hover:border-ink hover:bg-ink hover:text-white"
            >
              Cabins, specs and facilities
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section id="dates" className="border-t border-sand-300 bg-ink text-white">
        <div className="mx-auto max-w-8xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <span className="wave-rule wave-rule-light block" aria-hidden="true" />
              <p className="mt-5 font-mark text-eyebrow uppercase text-mist-300">Dates</p>
              <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight sm:text-4xl">When this route sails</h2>
            </div>
            <Link
              href={routes.departures({ water: water.slug })}
              className="group inline-flex items-center gap-2 font-mark text-[11px] uppercase tracking-[0.18em] text-white hover:text-mist-300"
            >
              Search all departures
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
            <div className="mt-8 rounded-3xl border border-dashed border-white/25 px-6 py-12 text-center">
              <h3 className="font-display text-xl">No dates on sale for this route</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-white/70">
                It runs {water.season}, and the next season has not been released. We can also run it privately on
                almost any dates.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href={routes.charter()}
                  className="inline-flex h-11 items-center rounded-full bg-flame px-5 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-flame-600"
                >
                  Charter this route
                </Link>
                <Link
                  href={routes.contact()}
                  className="inline-flex h-11 items-center rounded-full border border-white/30 px-5 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-white hover:text-ink-700"
                >
                  Tell me when it opens
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {related.length > 0 ? (
        <section className="mx-auto max-w-8xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
          <h2 className="font-display text-2xl font-light text-ink-700 sm:text-3xl">If this appeals, so might these</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {related.map((r) => (
              <TripCard key={r.slug} trip={r} />
            ))}
          </div>
        </section>
      ) : null}

      <div className="no-print fixed inset-x-0 bottom-0 z-30 border-t border-sand-300 bg-white/95 shadow-rail backdrop-blur lg:hidden">
        <div className="flex items-center gap-3 px-5 py-3">
          <div className="min-w-0 flex-1">
            <p className="truncate font-mark text-[10px] uppercase tracking-[0.14em] text-mist-700">{trip.title}</p>
            <p className="text-sm text-ink-700">
              From <Money usd={trip.from} /> <span className="text-xs text-ink/70">per person</span>
            </p>
          </div>
          <a href="#dates" className="inline-flex h-12 shrink-0 items-center rounded-full bg-flame px-5 font-mark text-[12px] uppercase tracking-[0.14em] text-white">
            See dates
          </a>
        </div>
      </div>
    </div>
  );
}
