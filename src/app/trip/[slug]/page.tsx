import Link from "next/link";
import { notFound } from "next/navigation";
import { trips, findWater, findBoat, filterDepartures, inclusions } from "@/lib/api/data";
import { formatMoney, formatNights, formatDateRange } from "@/lib/utils";
import type { Metadata } from "next";

export function generateStaticParams() {
  return trips.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const trip = trips.find((t) => t.slug === params.slug);
  if (!trip) return { title: "Not Found" };
  return {
    title: `${trip.title} — Sea Familia`,
    description: trip.summary,
  };
}

export default function TripDetailPage({ params }: { params: { slug: string } }) {
  const trip = trips.find((t) => t.slug === params.slug);
  if (!trip) notFound();

  const water = findWater(trip.water);
  const boat = findBoat(trip.boat);
  const tripDepartures = filterDepartures({ trip: trip.slug, available: true });

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative isolate overflow-hidden bg-ink">
        <div className={`ph ph-${trip.ph} absolute inset-0 opacity-60`} />
        <div className="scrim absolute inset-0" />
        <div className="relative mx-auto max-w-[88rem] px-5 pb-14 pt-32 sm:px-6 lg:px-8 lg:pb-20 lg:pt-40">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 font-mark text-[10px] uppercase tracking-[0.18em] text-white/55">
            <Link href="/destinations" className="transition hover:text-white">Destinations</Link>
            <span aria-hidden="true">/</span>
            <Link href={`/destinations/${water?.slug}`} className="transition hover:text-white">{water?.short}</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white/90">Itinerary</span>
          </nav>
          
          {trip.editorPick && (
            <span className="mb-4 inline-flex items-center rounded-full bg-flame px-3 py-1.5 font-mark text-[10px] uppercase tracking-[0.18em] text-white">
              Crew&apos;s first choice
            </span>
          )}
          
          <h1 className="font-display text-4xl font-light leading-[1.04] tracking-tight text-white sm:text-5xl lg:text-7xl">
            {trip.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85 sm:text-xl">
            {trip.summary}
          </p>
          
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/15 pt-6 font-mark text-[11px] uppercase tracking-[0.14em] text-white/80">
            <div>
              <span className="text-white/40">Duration</span>
              <div className="mt-1 text-white">{formatNights(trip.nights)}</div>
            </div>
            <div>
              <span className="text-white/40">Boat</span>
              <div className="mt-1 text-white">{boat?.name}</div>
            </div>
            <div>
              <span className="text-white/40">Gateway</span>
              <div className="mt-1 text-white">{trip.gateway}</div>
            </div>
            <div>
              <span className="text-white/40">From</span>
              <div className="mt-1 tnum text-white">{formatMoney(trip.from)}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Content Split ---------- */}
      <section className="bg-white">
        <div className="mx-auto max-w-[88rem] px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_24rem] xl:grid-cols-[1fr_28rem] lg:gap-16">
            
            {/* Left: Story & Route */}
            <div className="space-y-16">
              {/* Story */}
              {trip.story && (
                <div>
                  <h2 className="font-display text-3xl text-ink-700">The itinerary</h2>
                  <div className="mt-6 space-y-5 text-base leading-relaxed text-ink/75">
                    {trip.story.split("\n\n").map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Highlights */}
              {trip.highlights && trip.highlights.length > 0 && (
                <div>
                  <h3 className="font-mark text-[11px] uppercase tracking-[0.2em] text-mist-700">
                    Highlights
                  </h3>
                  <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                    {trip.highlights.map((h, i) => (
                      <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink/80">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-flame" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Route */}
              {trip.route && trip.route.length > 0 && (
                <div>
                  <h3 className="font-display text-2xl text-ink-700">Day by day</h3>
                  <p className="mt-2 text-sm text-ink/60">
                    A plan, not a promise. Anchorages will change for weather or a better day.
                  </p>
                  <div className="mt-8 space-y-8 border-l border-sand-300 pl-6 sm:pl-8">
                    {trip.route.map((day, i) => (
                      <div key={i} className="relative">
                        <span className="absolute -left-[1.8125rem] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-sand text-[10px] font-bold text-mist-700 sm:-left-[2.3125rem]">
                          {day.day}
                        </span>
                        <h4 className="font-display text-lg text-ink-700">{day.title}</h4>
                        <p className="mt-2 text-sm leading-relaxed text-ink/75">{day.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Right: Departures & Inclusions sidebar */}
            <div className="space-y-8">
              {/* Departures Box */}
              <div className="rounded-3xl border border-sand-300 bg-sand p-6 sm:p-8">
                <h3 className="font-display text-2xl text-ink-700">Open departures</h3>
                
                {tripDepartures.length > 0 ? (
                  <div className="mt-6 space-y-4">
                    {tripDepartures.map((d) => (
                      <div key={d.id} className="rounded-2xl border border-sand-300 bg-white p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="text-sm font-medium text-ink-700">
                              {formatDateRange(d.start, d.nights)}
                            </div>
                            <div className="mt-1 font-mark text-[10px] uppercase tracking-[0.14em] text-mist-700">
                              {d.status === "limited" ? (
                                <span className="text-flame">{d.cabinsLeft} cabins left</span>
                              ) : (
                                "Cabins available"
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="tnum font-display text-lg text-deep-700">{formatMoney(d.price)}</div>
                          </div>
                        </div>
                        <Link href={`/book/${d.id}`} className="mt-4 flex w-full justify-center rounded-full bg-flame py-2.5 font-mark text-[11px] uppercase tracking-[0.16em] text-white transition hover:bg-flame-600">
                          Reserve
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-6 rounded-2xl border border-sand-300 bg-white p-6 text-center">
                    <p className="text-sm text-ink/70">
                      No scheduled departures currently open for this route.
                    </p>
                    <Link href="/charter" className="mt-4 inline-block font-mark text-[11px] uppercase tracking-[0.14em] text-flame hover:text-flame-600">
                      Enquire about private charter →
                    </Link>
                  </div>
                )}
              </div>
              
              {/* Inclusions Box */}
              <div className="rounded-3xl border border-sand-300 bg-white p-6 sm:p-8">
                <h3 className="font-display text-xl text-ink-700">What is included</h3>
                <ul className="mt-5 space-y-3">
                  {inclusions.included.slice(0, 5).map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm text-ink/75">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-mist-300" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 border-t border-sand-200 pt-5">
                  <h4 className="font-mark text-[10px] uppercase tracking-[0.18em] text-mist-700">Excluded</h4>
                  <ul className="mt-4 space-y-2.5">
                    {inclusions.excluded.slice(0, 3).map((item, i) => (
                      <li key={i} className="flex gap-3 text-xs text-ink/60">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-sand-300" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>
    </>
  );
}
