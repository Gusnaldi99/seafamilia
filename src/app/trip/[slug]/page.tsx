import { ImageSlot } from "@/components/ui/ImageSlot";
import Link from "next/link";
import { notFound } from "next/navigation";
import { trips, findWater, findBoat, filterDepartures, inclusions, filterTrips, experiences } from "@/lib/api/data";
import { formatMoney, formatNights, formatDateRange } from "@/lib/utils";
import type { Metadata } from "next";
import { TripGallery } from "@/components/trip/TripGallery";
import { TripRouteAccordion } from "@/components/trip/TripRouteAccordion";

export function generateStaticParams() {
  return trips.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const trip = trips.find((t) => t.slug === resolvedParams.slug);
  if (!trip) return { title: "Not Found" };
  return {
    title: `${trip.title} — Sea Familia`,
    description: trip.summary,
  };
}

export default async function TripDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const trip = trips.find((t) => t.slug === resolvedParams.slug);
  if (!trip) notFound();

  const water = findWater(trip.water);
  const boat = findBoat(trip.boat);
  const tripDepartures = filterDepartures({ trip: trip.slug, available: true });

  const exps = trip.experiences.map(eSlug => experiences.find(e => e.slug === eSlug)).filter(Boolean);

  let related = filterTrips({ water: trip.water }).filter(tr => tr.slug !== trip.slug).slice(0, 3);
  if (related.length === 0 && trip.experiences.length > 0) {
    related = filterTrips({ experience: trip.experiences[0] }).filter(tr => tr.slug !== trip.slug).slice(0, 3);
  }

  return (
    <>
      {/* ==================================================================
           HERO
           ================================================================ */}
      <section className="relative isolate flex min-h-[74vh] items-end overflow-hidden bg-ink">
        <div className={`ph ph-${trip.ph} absolute inset-0`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <ImageSlot 
            className="img-slot h-full w-full object-cover" 
            src={`/media/trips/${trip.slug}.jpg`} 
            alt={trip.title} 
            loading="lazy" 
          />
        </div>
        <div className="scrim absolute inset-0" />
        <div className="relative mx-auto w-full max-w-[88rem] px-5 pb-12 pt-28 sm:px-6 lg:px-8 lg:pb-16">
          <nav aria-label="Breadcrumb" className="font-mark text-[11px] uppercase tracking-[0.16em] text-white/60">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="px-2" aria-hidden="true">/</span>
            <Link href="/destinations" className="hover:text-white">Destinations</Link>
            <span className="px-2" aria-hidden="true">/</span>
            <Link href={`/destinations/${water?.slug}`} className="hover:text-white">{water?.short}</Link>
          </nav>

          <div className="mt-8 flex flex-wrap items-center gap-2">
            {trip.editorPick && (
              <span className="inline-flex items-center rounded-full bg-flame px-3 py-1.5 font-mark text-[10px] uppercase tracking-[0.18em] text-white">
                Editor&apos;s pick
              </span>
            )}
            {exps.map((e) => (
              <Link
                key={e?.slug}
                href={`/experiences/${e?.slug}`}
                className="inline-flex items-center rounded-full bg-white/15 px-3 py-1.5 font-mark text-[10px] uppercase tracking-[0.16em] text-white ring-1 ring-inset ring-white/25 backdrop-blur transition hover:bg-white hover:text-ink-700"
              >
                {e?.name}
              </Link>
            ))}
          </div>

          <h1 className="mt-5 max-w-3xl font-display text-4xl font-light leading-[1.04] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {trip.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
            {trip.summary}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a href="#dates" className="inline-flex h-14 items-center gap-2.5 rounded-full bg-flame px-7 font-mark text-[13px] uppercase tracking-[0.16em] text-white transition hover:bg-flame-600">
              <span>Reserve a cabin</span>
              <span className="icon icon-chevron-right h-4 w-4" aria-hidden="true" />
            </a>
            <p className="font-mark text-[11px] uppercase tracking-[0.14em] text-white/80">
              From <span className="tnum text-white">{formatMoney(trip.from)}</span> per person · {tripDepartures.length} dates open
            </p>
          </div>
        </div>
      </section>

      {/* ==================================================================
           QUICK FACTS
           ================================================================ */}
      <section className="border-b border-sand-300 bg-white">
        <div className="mx-auto max-w-[88rem] px-5 sm:px-6 lg:px-8">
          <dl className="grid grid-cols-2 gap-y-6 py-8 sm:grid-cols-3 lg:grid-cols-5 lg:divide-x lg:divide-sand-300">
            <div className="lg:pr-6">
              <dt className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Length</dt>
              <dd className="mt-1.5 font-display text-lg text-ink-700">{formatNights(trip.nights)}</dd>
            </div>
            <div className="lg:px-6">
              <dt className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Water</dt>
              <dd className="mt-1.5 font-display text-lg text-ink-700">{water?.short}</dd>
            </div>
            <div className="lg:px-6">
              <dt className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Boat</dt>
              <dd className="mt-1.5 font-display text-lg text-ink-700">
                <Link href={`/boats/${boat?.slug}`} className="underline decoration-mist-300 decoration-1 underline-offset-4 hover:text-flame-600">
                  {boat?.name}
                </Link>
              </dd>
            </div>
            <div className="lg:px-6">
              <dt className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Starts &amp; ends</dt>
              <dd className="mt-1.5 font-display text-lg text-ink-700">{trip.gateway}</dd>
            </div>
            <div className="lg:pl-6">
              <dt className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Guests on board</dt>
              <dd className="mt-1.5 font-display text-lg text-ink-700">Up to {boat?.guests}</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* ==================================================================
           STORY + HIGHLIGHTS
           ================================================================ */}
      <section className="mx-auto max-w-[88rem] px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
          <div>
            <p className="font-mark text-[11px] uppercase tracking-[0.2em] text-flame">Why this route exists</p>
            <p className="mt-5 font-display text-xl font-light leading-relaxed text-ink-700 sm:text-2xl">
              {trip.story}
            </p>
          </div>
          <aside className="rounded-3xl bg-sand p-6 lg:p-7">
            <h2 className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">What you will remember</h2>
            <ul className="mt-4 space-y-4">
              {trip.highlights?.map((h, i) => (
                <li key={i} className="flex gap-3.5">
                  <span className="mt-0.5 font-display text-lg text-mist">
                    0{i + 1}
                  </span>
                  <span className="text-sm leading-relaxed text-ink/80">{h}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      {/* ==================================================================
           GALLERY
           ================================================================ */}
      <TripGallery tripSlug={trip.slug} tripTitle={trip.title} />

      {/* ==================================================================
           DAY BY DAY — accordion
           ================================================================ */}
      <TripRouteAccordion nights={trip.nights} route={trip.route || []} />

      {/* ==================================================================
           INCLUDED / NOT INCLUDED
           ================================================================ */}
      <section className="border-y border-sand-300 bg-sand">
        <div className="mx-auto max-w-[88rem] px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-xl">
            <p className="font-mark text-[11px] uppercase tracking-[0.2em] text-flame">The fare</p>
            <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">
              What your cabin covers
            </h2>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-16">
            <div>
              <h3 className="font-mark text-[11px] uppercase tracking-[0.18em] text-ink-700">Included</h3>
              <ul className="mt-4 space-y-3">
                {inclusions.included.map((i, idx) => (
                  <li key={idx} className="flex gap-3 text-sm leading-relaxed text-ink/80">
                    <span className="icon icon-check mt-0.5 h-4 w-4 shrink-0 text-mist" aria-hidden="true" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-mark text-[11px] uppercase tracking-[0.18em] text-ink-700">Not included</h3>
              <ul className="mt-4 space-y-3">
                {inclusions.excluded.map((i, idx) => (
                  <li key={idx} className="flex gap-3 text-sm leading-relaxed text-ink/70">
                    <span className="icon icon-minus mt-0.5 h-4 w-4 shrink-0 text-sand-300" aria-hidden="true" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-xs leading-relaxed text-ink/55">
                Deposit is 25% of the cabin total (30% on the twelve-night Banda crossings), balance
                due 60 days before you sail.{" "}
                <Link href="/policies#cancellation" className="text-flame-600 underline underline-offset-4">
                  Cancellation policy
                </Link>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================
           THE BOAT
           ================================================================ */}
      {boat && (
        <section className="mx-auto max-w-[88rem] px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16">
            <Link href={`/boats/${boat.slug}`} className="group relative block aspect-[16/11] overflow-hidden rounded-3xl bg-ink">
              <div className={`ph ph-${boat.ph} absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.03]`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <ImageSlot className="img-slot h-full w-full object-cover" src={`/media/boats/${boat.slug}.jpg`} alt={boat.name} loading="lazy" />
              </div>
              <div className="scrim-soft absolute inset-0" />
              <div className="absolute inset-x-6 bottom-6">
                <p className="font-mark text-[10px] uppercase tracking-[0.18em] text-white/75">{boat.type}</p>
                <p className="mt-1 font-display text-3xl text-white">{boat.name}</p>
              </div>
            </Link>
            <div>
              <p className="font-mark text-[11px] uppercase tracking-[0.2em] text-flame">Your boat</p>
              <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">
                {boat.tagline}
              </h2>
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
              <Link href={`/boats/${boat.slug}`} className="mt-7 inline-flex h-12 items-center gap-2 rounded-full border border-ink/20 px-6 font-mark text-[12px] uppercase tracking-[0.14em] text-ink-700 transition hover:border-ink hover:bg-ink hover:text-white">
                Cabins, specs and facilities
                <span className="icon icon-chevron-right h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ==================================================================
           DATES — the conversion point
           ================================================================ */}
      <section id="dates" className="border-t border-sand-300 bg-ink text-white">
        <div className="mx-auto max-w-[88rem] px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <span className="wave-rule wave-rule-light block" />
              <p className="mt-5 font-mark text-[11px] uppercase tracking-[0.2em] text-mist-300">Dates</p>
              <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight sm:text-4xl">
                When this route sails
              </h2>
            </div>
            <Link href={`/departures?water=${water?.slug}`} className="group inline-flex items-center gap-2 font-mark text-[11px] uppercase tracking-[0.18em] text-white hover:text-mist-300">
              Search all departures
              <span className="icon icon-chevron-right h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>

          {tripDepartures.length > 0 ? (
            <div className="mt-8 space-y-3">
              {tripDepartures.map((d) => (
                <div key={d.id} className="group relative overflow-hidden rounded-2xl bg-white/5 transition hover:bg-white/10">
                  <div className="grid items-center gap-4 p-5 sm:grid-cols-[1fr_auto_auto_auto] sm:gap-8 sm:p-6 lg:p-8">
                    <div>
                      <h3 className="font-display text-xl text-white sm:text-2xl">{formatDateRange(d.start, d.nights)}</h3>
                      <p className="mt-1 font-mark text-[10px] uppercase tracking-[0.16em] text-white/50">{d.nights} nights</p>
                    </div>
                    <div className="hidden sm:block">
                      <p className="font-mark text-[10px] uppercase tracking-[0.16em] text-white/50">Boat</p>
                      <p className="mt-1 text-sm text-white/80">{findBoat(d.boat)?.name}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="font-mark text-[10px] uppercase tracking-[0.16em] text-white/50">From</p>
                      <p className="mt-1 tnum font-display text-xl text-white sm:text-2xl">{formatMoney(d.price)}</p>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <Link href={`/book?dep=${d.id}`} className="flex h-11 w-full items-center justify-center rounded-full bg-flame px-8 font-mark text-[12px] uppercase tracking-[0.16em] text-white transition hover:bg-flame-600 sm:w-auto">
                        Reserve
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-3xl border border-dashed border-white/25 px-6 py-12 text-center">
              <h3 className="font-display text-xl">No dates on sale for this route</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-white/70">
                It runs {water?.season}, and the next season has not been released.
                We can also run it privately on almost any dates.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link href="/charter" className="inline-flex h-11 items-center rounded-full bg-flame px-5 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-flame-600">
                  Charter this route
                </Link>
                <Link href="/contact" className="inline-flex h-11 items-center rounded-full border border-white/30 px-5 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-white hover:text-ink-700">
                  Tell me when it opens
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ==================================================================
           RELATED
           ================================================================ */}
      {related.length > 0 && (
        <section className="mx-auto max-w-[88rem] px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
          <h2 className="font-display text-2xl font-light text-ink-700 sm:text-3xl">If this appeals, so might these</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {related.map((t) => (
              <Link key={t.slug} href={`/trip/${t.slug}`} className="group flex flex-col focus-visible:outline-mist">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink">
                  <div className={`ph ph-${t.ph} absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-105`} />
                  <div className="scrim-soft absolute inset-0" />
                </div>
                <h3 className="mt-5 font-display text-xl text-ink-700 transition-colors group-hover:text-flame-600">
                  {t.title}
                </h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink/70 line-clamp-2">
                  {t.summary}
                </p>
                <p className="mt-4 font-mark text-[11px] uppercase tracking-[0.16em] text-mist-700">
                  {findWater(t.water)?.short} · {formatNights(t.nights)}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
