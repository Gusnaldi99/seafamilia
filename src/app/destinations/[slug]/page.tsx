import Link from "next/link";
import { notFound } from "next/navigation";
import { waters, filterTrips, findBoat } from "@/lib/api/data";
import { formatMoney, formatNights } from "@/lib/utils";
import type { Metadata } from "next";

export function generateStaticParams() {
  return waters.map((w) => ({ slug: w.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const water = waters.find((w) => w.slug === params.slug);
  if (!water) return { title: "Not Found" };
  return {
    title: `${water.name} — Destinations — Sea Familia`,
    description: water.blurb,
  };
}

export default function DestinationDetailPage({ params }: { params: { slug: string } }) {
  const water = waters.find((w) => w.slug === params.slug);
  if (!water) notFound();

  const destinationTrips = filterTrips({ water: water.slug });

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative isolate overflow-hidden bg-ink">
        <div className={`ph ph-${water.ph} absolute inset-0 opacity-50`} />
        <div className="scrim absolute inset-0" />
        <div className="relative mx-auto max-w-[88rem] px-5 pb-14 pt-32 sm:px-6 lg:px-8 lg:pb-20 lg:pt-40">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 font-mark text-[10px] uppercase tracking-[0.18em] text-white/55">
            <Link href="/destinations" className="transition hover:text-white">Destinations</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white/90">{water.name}</span>
          </nav>
          
          <span className="wave-rule wave-rule-light block" />
          <h1 className="mt-5 font-display text-4xl font-light leading-[1.04] tracking-tight text-white sm:text-5xl lg:text-7xl">
            {water.name}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85 sm:text-xl">
            {water.blurb}
          </p>
          
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/15 pt-6 font-mark text-[11px] uppercase tracking-[0.14em] text-white/80">
            <div>
              <span className="text-white/40">Season</span>
              <div className="mt-1 text-white">{water.season}</div>
            </div>
            <div>
              <span className="text-white/40">Gateway</span>
              <div className="mt-1 text-white">{water.gateway}</div>
            </div>
            <div>
              <span className="text-white/40">Crossings</span>
              <div className="mt-1 text-white">{water.crossing}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Story & Highlights ---------- */}
      <section className="border-b border-sand-300 bg-white">
        <div className="mx-auto max-w-[88rem] px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
            <div>
              <p className="font-mark text-[0.6875rem] uppercase leading-none tracking-[0.22em] text-flame">
                The Waters
              </p>
              <h2 className="mt-4 font-display text-3xl leading-tight text-ink-700 sm:text-4xl">
                What to expect
              </h2>
              <div className="mt-6 space-y-5 text-base leading-relaxed text-ink/75">
                {water.story.split("\n\n").map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
            
            <div className="rounded-3xl border border-sand-300 bg-sand p-6 lg:p-10">
              <h3 className="font-display text-2xl text-ink-700">Highlights</h3>
              <ul className="mt-6 space-y-4">
                {water.highlights.map((h, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink/80">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-flame" />
                    {h}
                  </li>
                ))}
              </ul>
              
              <h3 className="mt-10 font-display text-2xl text-ink-700">Anchorages</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {water.stops.map((stop, i) => (
                  <li key={i} className="inline-flex rounded-full border border-sand-300 bg-white px-3 py-1 font-mark text-[11px] uppercase tracking-[0.14em] text-mist-700">
                    {stop}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Trips in this region ---------- */}
      <section className="bg-sand pb-16 pt-16 sm:pb-24 sm:pt-20 lg:px-8">
        <div className="mx-auto max-w-[88rem] px-5 sm:px-6 lg:px-0">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">
              Itineraries in {water.short}
            </h2>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {destinationTrips.map((t) => {
              const boat = findBoat(t.boat);
              return (
                <Link
                  key={t.slug}
                  href={`/trip/${t.slug}`}
                  className="group flex flex-col rounded-3xl border border-sand-300 bg-white transition hover:shadow-card"
                >
                  <div
                    className={`ph ph-${t.ph} relative aspect-[16/10] overflow-hidden rounded-t-3xl`}
                  >
                    <div className="scrim absolute inset-0" />
                    <div className="absolute inset-x-5 bottom-4">
                      <h3 className="font-display text-xl text-white transition-colors group-hover:text-white/90">
                        {t.title}
                      </h3>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mark text-[11px] uppercase tracking-[0.14em] text-mist-700">
                      <span>{formatNights(t.nights)}</span>
                      <span aria-hidden="true">·</span>
                      <span>{boat?.name}</span>
                    </div>
                    <p className="mt-2.5 flex-1 text-sm leading-relaxed text-ink/70 line-clamp-3">
                      {t.summary}
                    </p>
                    <div className="mt-4 flex items-center justify-between border-t border-sand-200 pt-4">
                      <div>
                        <span className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">
                          From
                        </span>
                        <span className="ml-1.5 tnum font-display text-lg text-deep-700">
                          {formatMoney(t.from)}
                        </span>
                      </div>
                      <span className="font-mark text-[11px] uppercase tracking-[0.14em] text-flame-600 transition-colors group-hover:text-flame">
                        View itinerary →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
