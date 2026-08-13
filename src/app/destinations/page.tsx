import Link from "next/link";
import { waters, trips, findWater } from "@/lib/api/data";
import { formatMoney, formatNights } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Destinations — Sea Familia",
  description:
    "Eight sailing regions across eastern Indonesia: Komodo, Raja Ampat, Banda Sea, Alor & Solor, Triton Bay, Wakatobi, Cenderawasih Bay, and Halmahera.",
};

export default function DestinationsPage() {
  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative isolate overflow-hidden bg-ink">
        <div className="ph ph-lagoon absolute inset-0 opacity-40" />
        <div className="scrim absolute inset-0" />
        <div className="relative mx-auto max-w-[88rem] px-5 pb-14 pt-32 sm:px-6 lg:px-8 lg:pb-20 lg:pt-40">
          <span className="wave-rule wave-rule-light block" />
          <p className="mt-5 font-mark text-[0.6875rem] uppercase leading-none tracking-[0.22em] text-white/75">
            Destinations
          </p>
          <h1 className="mt-4 font-display text-4xl font-light leading-[1.04] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Eight waters, each with<br className="hidden sm:block" /> its own season
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
            Every region has a different character and a different best month. The short version:
            west is best April to November, east from October to April, and the Banda Sea has
            two narrow windows.
          </p>
        </div>
      </section>

      {/* ---------- Waters grid ---------- */}
      <section className="mx-auto max-w-[88rem] px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {waters.map((w) => (
            <Link
              key={w.slug}
              href={`/destinations/${w.slug}`}
              className="group block"
            >
              <div className="arch relative aspect-[3/4] overflow-hidden">
                <div
                  className={`ph ph-${w.ph} absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-105`}
                />
                <div className="scrim absolute inset-0" />
                <div className="absolute inset-x-5 bottom-5">
                  <h2 className="font-display text-2xl text-white">{w.name}</h2>
                  <p className="mt-1 font-mark text-[11px] uppercase tracking-[0.14em] text-white/70">
                    {w.season}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink/70 line-clamp-2">
                {w.blurb}
              </p>
              <p className="mt-2 font-mark text-[11px] uppercase tracking-[0.14em] text-mist-700">
                Gateway: {w.gateway}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- All trips ---------- */}
      <section className="border-t border-sand-300 bg-sand">
        <div className="mx-auto max-w-[88rem] px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-xl">
            <p className="font-mark text-[0.6875rem] uppercase leading-none tracking-[0.22em] text-flame">
              All itineraries
            </p>
            <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">
              Twelve published routes
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink/70">
              Each one sails at least twice a season, and any of them can be taken as a private
              charter on different dates.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trips.map((t) => {
              const water = findWater(t.water);
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
                    {t.editorPick && (
                      <span className="absolute right-4 top-4 inline-flex items-center rounded-full bg-flame px-2.5 py-1 font-mark text-[9px] uppercase tracking-[0.16em] text-white">
                        Crew pick
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mark text-[11px] uppercase tracking-[0.14em] text-mist-700">
                      <span>{water?.short}</span>
                      <span aria-hidden="true">·</span>
                      <span>{formatNights(t.nights)}</span>
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
