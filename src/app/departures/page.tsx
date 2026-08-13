import Link from "next/link";
import { departures, trips, findWater, findBoat } from "@/lib/api/data";
import { formatMoney, formatDateRange, formatMonth } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Departures — Sea Familia",
  description: "Schedule of upcoming open trips across our four boats.",
};

export default function DeparturesPage() {
  // Group departures by month (YYYY-MM)
  const groupedDepartures = departures.reduce((acc, dep) => {
    const monthKey = dep.start.substring(0, 7); // "2026-08"
    if (!acc[monthKey]) acc[monthKey] = [];
    acc[monthKey].push(dep);
    return acc;
  }, {} as Record<string, typeof departures>);

  const sortedMonths = Object.keys(groupedDepartures).sort();

  return (
    <>
      <section className="border-b border-sand-300 bg-sand">
        <div className="mx-auto max-w-[88rem] px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <span className="wave-rule wave-rule-flame block" />
            <p className="mt-5 font-mark text-[0.6875rem] uppercase leading-none tracking-[0.22em] text-flame">
              Departure Calendar
            </p>
            <h1 className="mt-4 font-display text-4xl font-light leading-tight tracking-tight text-ink-700 sm:text-5xl lg:text-6xl">
              Sailing schedule
            </h1>
            <p className="mt-6 text-base leading-relaxed text-ink/70 sm:text-lg">
              Our open trips for the next 12 months. If you don&apos;t see dates that work, or want the whole boat, check our private charter options.
            </p>
            
            <div className="mt-8 flex items-center gap-6 border-t border-sand-300 pt-6 font-mark text-[11px] uppercase tracking-[0.14em]">
              <div className="flex items-center gap-2 text-ink-700">
                <span className="h-2 w-2 rounded-full bg-mist-300" />
                Available
              </div>
              <div className="flex items-center gap-2 text-flame">
                <span className="h-2 w-2 rounded-full bg-flame" />
                Almost full
              </div>
              <div className="flex items-center gap-2 text-ink/40">
                <span className="h-2 w-2 rounded-full bg-sand-300" />
                Waitlist / Closed
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white pb-24 pt-10 lg:pt-16">
        <div className="mx-auto max-w-[88rem] px-5 sm:px-6 lg:px-8">
          
          <div className="mx-auto max-w-4xl space-y-16 lg:space-y-24">
            {sortedMonths.map((monthStr) => (
              <div key={monthStr}>
                <h2 className="border-b border-sand-300 pb-4 font-display text-2xl text-ink-700 sm:text-3xl">
                  {formatMonth(`${monthStr}-01`)}
                </h2>
                <div className="mt-6 space-y-3 sm:space-y-4">
                  {groupedDepartures[monthStr].map((d) => {
                    const trip = trips.find((t) => t.slug === d.trip);
                    const boat = findBoat(d.boat);
                    const water = trip ? findWater(trip.water) : null;
                    if (!trip) return null;
                    
                    const isAvailable = d.status === "open" || d.status === "limited";

                    return (
                      <Link
                        key={d.id}
                        href={`/trip/${trip.slug}`}
                        className={`group grid grid-cols-[4.5rem_1fr] items-center gap-4 rounded-2xl border p-4 sm:grid-cols-[6rem_1fr_auto] sm:gap-6 ${
                          isAvailable 
                            ? "border-sand-300 bg-white transition hover:shadow-card" 
                            : "border-transparent bg-sand opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0"
                        }`}
                      >
                        <div className={`ph ph-${trip.ph} relative aspect-[4/3] overflow-hidden rounded-xl`} />
                        <div className="min-w-0">
                          <h3 className="font-display text-lg text-ink-700 transition-colors group-hover:text-flame-600 sm:text-xl">
                            {trip.title}
                          </h3>
                          <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-mist-700 sm:text-sm">
                            <span>{water?.short}</span>
                            <span aria-hidden="true">·</span>
                            <span>{formatDateRange(d.start, d.nights)}</span>
                            <span aria-hidden="true">·</span>
                            <span>{boat?.name}</span>
                          </p>
                          {d.status === "limited" && (
                            <p className="mt-1 text-xs font-medium text-flame">
                              {d.cabinsLeft} {d.cabinsLeft === 1 ? "cabin" : "cabins"} left
                            </p>
                          )}
                          {d.status === "waitlist" && (
                            <p className="mt-1 text-xs font-medium text-ink-700">Waitlist open</p>
                          )}
                          {d.status === "closed" && (
                            <p className="mt-1 text-xs font-medium text-ink/50">Fully booked</p>
                          )}
                        </div>
                        <div className="hidden items-center gap-6 sm:flex">
                          <div className="text-right">
                            <div className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">From</div>
                            <div className="tnum font-display text-lg text-deep-700">{formatMoney(d.price)}</div>
                          </div>
                          {isAvailable && (
                            <span className="grid h-10 w-10 place-items-center rounded-full border border-sand-300 text-ink-700 transition group-hover:border-flame group-hover:bg-flame group-hover:text-white">
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </span>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </section>
    </>
  );
}
