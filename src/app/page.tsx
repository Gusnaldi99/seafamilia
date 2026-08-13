import Link from "next/link";
import { trips, waters, boats, departures, articles, findWater, findBoat } from "@/lib/api/data";
import { formatMoney, formatNights, formatDateRange } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sea Familia — Liveaboard voyages in eastern Indonesia",
  description:
    "Four hand-built phinisi sailing Komodo, Raja Ampat, the Banda Sea and beyond. Reserve a cabin on an open trip, or take the whole boat.",
};

export default function HomePage() {
  const editorPicks = trips.filter((t) => t.editorPick).slice(0, 2);
  const nextDepartures = departures.filter((d) => d.status !== "closed" && d.status !== "waitlist").slice(0, 4);
  const featuredWaters = waters.slice(0, 4);
  const recentArticles = articles.slice(0, 3);

  return (
    <>
      {/* ================================================================
           HERO
           ================================================================ */}
      <section className="relative isolate flex min-h-[88vh] items-end overflow-hidden bg-ink lg:min-h-[94vh]">
        {/* Video background */}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          aria-label="Familia Satu under sail at sunset in the Flores Sea"
        >
          <source src="https://assets.mixkit.co/videos/13000/13000-720.mp4" type="video/mp4" />
        </video>
        <div className="scrim absolute inset-0" />

        <div className="relative mx-auto w-full max-w-[88rem] px-5 pb-14 pt-28 sm:px-6 lg:px-8 lg:pb-20">
          <div className="max-w-2xl">
            <span className="wave-rule wave-rule-light block" />
            <p className="mt-5 font-mark text-[0.6875rem] uppercase leading-none tracking-[0.22em] text-white/75">
              Liveaboard voyages · Eastern Indonesia
            </p>
            <h1 className="mt-4 font-display text-[2.6rem] font-light leading-[1.04] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Come sailing with<br className="hidden sm:block" /> the familia
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
              Four hand-built phinisi, a crew who mostly grew up on these reefs, and eleven years
              of finding the anchorage nobody else is in. Reserve a single cabin — or take the whole boat.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/departures"
                className="inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-flame px-7 font-mark text-[13px] uppercase tracking-[0.16em] text-white transition hover:bg-flame-600"
              >
                Find a departure
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link
                href="/experiences"
                className="inline-flex h-14 items-center justify-center rounded-full border border-white/35 bg-white/5 px-7 font-mark text-[13px] uppercase tracking-[0.16em] text-white backdrop-blur transition hover:border-white hover:bg-white hover:text-ink-700"
              >
                Answer 5 questions instead
              </Link>
            </div>
          </div>

          {/* Proof strip */}
          <dl className="mt-12 grid max-w-3xl grid-cols-2 gap-x-6 gap-y-6 border-t border-white/15 pt-8 sm:grid-cols-4 lg:mt-16">
            {[
              { label: "The fleet", value: "4 boats" },
              { label: "Waters we sail", value: "8 regions" },
              { label: "Crew to guest", value: "Nearly 1:1" },
              { label: "Sailing since", value: "2015" },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="font-mark text-[10px] uppercase tracking-[0.18em] text-white/55">{stat.label}</dt>
                <dd className="mt-1.5 font-display text-2xl text-white">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ================================================================
           THREE PATHS
           ================================================================ */}
      <section className="border-b border-sand-300 bg-sand">
        <div className="mx-auto max-w-[88rem] px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <p className="font-mark text-[0.6875rem] uppercase leading-none tracking-[0.22em] text-flame">
              Where would you like to start?
            </p>
            <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl lg:text-5xl">
              Inspire first. Clarify the choice.<br className="hidden sm:block" /> Guide the next step.
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3 lg:gap-6">
            {/* Path 1 */}
            <Link href="/destinations" className="group flex flex-col rounded-3xl border border-sand-300 bg-white p-6 transition hover:border-mist-300 hover:shadow-card lg:p-8">
              <span className="font-mark text-[11px] uppercase tracking-[0.2em] text-mist-700">Path one</span>
              <h3 className="mt-5 font-display text-2xl text-ink-700">Browse and be inspired</h3>
              <p className="mt-2.5 flex-1 text-sm leading-relaxed text-ink/70">
                No form, no funnel. Eight waters, twelve itineraries, four boats — wander through in any
                order and see what catches.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 font-mark text-[11px] uppercase tracking-[0.18em] text-flame-600">
                Destinations
                <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>

            {/* Path 2 — featured */}
            <Link href="/experiences" className="group flex flex-col rounded-3xl border border-ink bg-ink p-6 text-white transition hover:bg-ink-600 lg:p-8">
              <span className="font-mark text-[11px] uppercase tracking-[0.2em] text-mist-300">Path two · most popular</span>
              <h3 className="mt-5 font-display text-2xl">Let us narrow it down</h3>
              <p className="mt-2.5 flex-1 text-sm leading-relaxed text-white/75">
                Five questions — what you want to do, which water, how long, and who is coming.
                We show the departures that actually fit.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 font-mark text-[11px] uppercase tracking-[0.18em] text-white">
                Plan your trip
                <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>

            {/* Path 3 */}
            <Link href="/charter" className="group flex flex-col rounded-3xl border border-sand-300 bg-white p-6 transition hover:border-mist-300 hover:shadow-card lg:p-8">
              <span className="font-mark text-[11px] uppercase tracking-[0.2em] text-mist-700">Path three</span>
              <h3 className="mt-5 font-display text-2xl text-ink-700">Take the whole boat</h3>
              <p className="mt-2.5 flex-1 text-sm leading-relaxed text-ink/70">
                Your dates, your group, an itinerary we build together. Eight to twenty guests,
                and no strangers at dinner.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 font-mark text-[11px] uppercase tracking-[0.18em] text-flame-600">
                Private charter
                <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================
           EDITOR'S PICK
           ================================================================ */}
      <section className="mx-auto max-w-[88rem] px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="font-mark text-[0.6875rem] uppercase leading-none tracking-[0.22em] text-flame">Editor&apos;s pick</p>
            <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl lg:text-5xl">
              The two the crew argue about
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink/70">
              Chosen at the end of last season by the people who sailed them. Nobody consulted the
              bookings spreadsheet.
            </p>
          </div>
          <Link href="/destinations" className="group inline-flex items-center gap-2 font-mark text-[11px] uppercase tracking-[0.18em] text-ink-700 hover:text-flame-600">
            All twelve itineraries
            <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-6">
          {editorPicks.map((t, i) => {
            const water = findWater(t.water);
            const boat = findBoat(t.boat);
            return i === 0 ? (
              /* Lead pick */
              <Link key={t.slug} href={`/trip/${t.slug}`} className="group block focus-visible:outline-mist lg:col-span-7">
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-ink lg:aspect-[16/11]">
                  <div className={`ph ph-${t.ph} absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.03]`} />
                  <div className="scrim absolute inset-0" />
                  <div className="absolute inset-x-5 bottom-5 lg:inset-x-8 lg:bottom-8">
                    <span className="inline-flex items-center rounded-full bg-flame px-3 py-1.5 font-mark text-[10px] uppercase tracking-[0.18em] text-white">
                      Crew&apos;s first choice
                    </span>
                    <h3 className="mt-4 font-display text-3xl leading-tight text-white lg:text-4xl">{t.title}</h3>
                    <p className="mt-2.5 max-w-md text-sm leading-relaxed text-white/85">{t.summary}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mark text-[11px] uppercase tracking-[0.14em] text-white/80">
                      <span>{water?.short}</span>
                      <span aria-hidden="true">·</span>
                      <span>{formatNights(t.nights)}</span>
                      <span aria-hidden="true">·</span>
                      <span>{boat?.name}</span>
                      <span aria-hidden="true">·</span>
                      <span>from <span className="tnum">{formatMoney(t.from)}</span></span>
                    </div>
                  </div>
                </div>
              </Link>
            ) : (
              /* Second pick - card */
              <Link key={t.slug} href={`/trip/${t.slug}`} className="group block lg:col-span-5">
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-ink">
                  <div className={`ph ph-${t.ph} absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.03]`} />
                  <div className="scrim absolute inset-0" />
                  <div className="absolute inset-x-5 bottom-5 lg:inset-x-6 lg:bottom-6">
                    <h3 className="font-display text-2xl leading-tight text-white lg:text-3xl">{t.title}</h3>
                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mark text-[11px] uppercase tracking-[0.14em] text-white/80">
                      <span>{water?.short}</span>
                      <span aria-hidden="true">·</span>
                      <span>{formatNights(t.nights)}</span>
                      <span aria-hidden="true">·</span>
                      <span>from <span className="tnum">{formatMoney(t.from)}</span></span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ================================================================
           NEXT DEPARTURES
           ================================================================ */}
      <section className="mx-auto max-w-[88rem] px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="font-mark text-[0.6875rem] uppercase leading-none tracking-[0.22em] text-flame">Sailing next</p>
            <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl lg:text-5xl">
              Cabins open in the next few months
            </h2>
          </div>
          <Link href="/departures" className="group inline-flex items-center gap-2 font-mark text-[11px] uppercase tracking-[0.18em] text-ink-700 hover:text-flame-600">
            Full departure calendar
            <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        <div className="mt-8 space-y-3">
          {nextDepartures.map((d) => {
            const trip = trips.find((t) => t.slug === d.trip);
            const boat = findBoat(d.boat);
            const water = trip ? findWater(trip.water) : null;
            if (!trip) return null;
            return (
              <Link
                key={d.id}
                href={`/trip/${trip.slug}`}
                className="group grid grid-cols-[4.5rem_1fr] items-center gap-4 rounded-2xl border border-sand-300 bg-white p-4 transition hover:shadow-card sm:grid-cols-[6rem_1fr_auto] sm:gap-6"
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
                </div>
                <div className="hidden items-center gap-6 sm:flex">
                  <div className="text-right">
                    <div className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">From</div>
                    <div className="tnum font-display text-lg text-deep-700">{formatMoney(d.price)}</div>
                  </div>
                  <span className="grid h-10 w-10 place-items-center rounded-full border border-sand-300 text-ink-700 transition group-hover:border-flame group-hover:bg-flame group-hover:text-white">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ================================================================
           WATERS
           ================================================================ */}
      <section className="overflow-hidden border-y border-sand-300 bg-ink py-16 lg:py-24">
        <div className="mx-auto max-w-[88rem] px-5 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <span className="wave-rule wave-rule-light block" />
              <p className="mt-5 font-mark text-[0.6875rem] uppercase leading-none tracking-[0.22em] text-mist-300">Waters</p>
              <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                Eight regions, each with its own season
              </h2>
            </div>
            <Link href="/destinations" className="group inline-flex items-center gap-2 font-mark text-[11px] uppercase tracking-[0.18em] text-white hover:text-mist-300">
              All destinations
              <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="mt-10 -mx-5 px-5 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
          <div className="rail mx-auto max-w-[88rem] pb-2 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:px-8">
            {featuredWaters.map((w) => (
              <Link key={w.slug} href={`/destinations/${w.slug}`} className="group w-[68vw] max-w-xs lg:w-auto lg:max-w-none">
                <div className="arch relative aspect-[3/4] overflow-hidden">
                  <div className={`ph ph-${w.ph} absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-105`} />
                  <div className="scrim absolute inset-0" />
                  <div className="absolute inset-x-5 bottom-5">
                    <h3 className="font-display text-2xl text-white">{w.short}</h3>
                    <p className="mt-1 font-mark text-[11px] uppercase tracking-[0.14em] text-white/70">
                      {w.season}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
           FLEET
           ================================================================ */}
      <section className="mx-auto max-w-[88rem] px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="font-mark text-[0.6875rem] uppercase leading-none tracking-[0.22em] text-flame">The fleet</p>
            <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl lg:text-5xl">
              Four boats, built in Bira
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink/70">
              Every hull came out of the same yard in South Sulawesi, from the same family of
              Konjo shipwrights. They differ in size, not in how they were made.
            </p>
          </div>
          <Link href="/boats" className="group inline-flex items-center gap-2 font-mark text-[11px] uppercase tracking-[0.18em] text-ink-700 hover:text-flame-600">
            Compare the fleet
            <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {boats.map((b) => (
            <Link key={b.slug} href={`/boats/${b.slug}`} className="group block">
              <div className={`ph ph-${b.ph} relative aspect-[4/3] overflow-hidden rounded-2xl`}>
                <div className="scrim absolute inset-0" />
                <div className="absolute inset-x-4 bottom-4">
                  <h3 className="font-display text-xl text-white">{b.name}</h3>
                  <p className="mt-0.5 font-mark text-[11px] uppercase tracking-[0.14em] text-white/70">{b.type}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-mist-700">
                <span>{b.length}</span>
                <span aria-hidden="true">·</span>
                <span>{b.guests} guests</span>
                <span aria-hidden="true">·</span>
                <span>{b.cabins} cabins</span>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-ink/70 line-clamp-2">{b.tagline}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ================================================================
           OPEN TRIP vs CHARTER
           ================================================================ */}
      <section className="bg-sand">
        <div className="mx-auto max-w-[88rem] px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <span className="wave-rule wave-rule-flame mx-auto block" />
            <h2 className="mt-5 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">
              By the cabin, or the whole boat
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink/70">
              Two ways to sail with us, and the only real difference is who else is at dinner.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl gap-4 md:grid-cols-2 lg:gap-6">
            {/* Open trip */}
            <div className="rounded-3xl border border-sand-300 bg-white p-6 lg:p-8">
              <h3 className="font-display text-2xl text-ink-700">Open trip</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                A scheduled departure. You reserve one cabin and share the boat with eight to twenty others.
              </p>
              <ul className="mt-5 space-y-2.5 text-sm text-ink/80">
                {["Priced per person, per cabin grade", "Fixed dates and a published route", "25% deposit, balance 60 days out", "No single supplement on solo berths"].map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-flame" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/departures" className="mt-6 inline-flex h-12 items-center rounded-full bg-flame px-6 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-flame-600">
                See departures
              </Link>
            </div>

            {/* Private charter */}
            <div className="rounded-3xl border border-ink bg-ink p-6 text-white lg:p-8">
              <h3 className="font-display text-2xl">Private charter</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/75">
                The whole boat, your dates, and an itinerary we draw with you rather than hand to you.
              </p>
              <ul className="mt-5 space-y-2.5 text-sm text-white/85">
                {["Priced per boat, per day", "Any dates the boat is free", "Route built around your group", "A quote from a human within one working day"].map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-mist-300" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/charter" className="mt-6 inline-flex h-12 items-center rounded-full bg-white px-6 font-mark text-[12px] uppercase tracking-[0.14em] text-ink-700 transition hover:bg-sand">
                How charter works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
           JOURNAL
           ================================================================ */}
      <section className="mx-auto max-w-[88rem] px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="font-mark text-[0.6875rem] uppercase leading-none tracking-[0.22em] text-flame">Journal</p>
            <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl lg:text-5xl">
              Written on the boat, mostly
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink/70">
              By the crew, the cook, the captain and the biologist who joins four crossings a season.
              Nobody here is a content producer.
            </p>
          </div>
          <Link href="/journal" className="group inline-flex items-center gap-2 font-mark text-[11px] uppercase tracking-[0.18em] text-ink-700 hover:text-flame-600">
            Read the journal
            <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-3 lg:gap-6">
          {recentArticles.map((a) => (
            <Link key={a.slug} href={`/journal/${a.slug}`} className="group block">
              <div className={`ph ph-${a.ph} relative aspect-[4/3] overflow-hidden rounded-2xl`}>
                <div className="scrim absolute inset-0" />
                <div className="absolute inset-x-4 bottom-4">
                  <span className="font-mark text-[10px] uppercase tracking-[0.18em] text-white/70">{a.category}</span>
                  <h3 className="mt-1 font-display text-xl text-white transition-colors group-hover:text-white/90">{a.title}</h3>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink/70 line-clamp-2">{a.dek}</p>
              <p className="mt-2 font-mark text-[11px] uppercase tracking-[0.14em] text-mist-700">
                {a.author} · {a.read} min read
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ================================================================
           TRUST / TESTIMONIAL
           ================================================================ */}
      <section className="border-t border-sand-300 bg-white">
        <div className="mx-auto max-w-[88rem] px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
            <figure className="max-w-md">
              <blockquote className="pull-quote">
                &ldquo;We booked one cabin and left feeling like we had been adopted. The crew remembered
                our daughter&apos;s name before we remembered theirs.&rdquo;
              </blockquote>
              <figcaption className="mt-4 text-sm text-mist-700">
                Marieke &amp; Tom V. · Lagoons &amp; Little Explorers · October 2025
              </figcaption>
            </figure>

            <dl className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
              {[
                { label: "Safety", text: "Oxygen and first-response kits on every deck, two liferafts, EPIRB and satellite phone. Crew drilled monthly, not annually." },
                { label: "Diving cover", text: "DAN-affiliated evacuation cover on all four boats. We ask for your policy number with the joining form, and we do check it." },
                { label: "Booking terms", text: "Deposit fully refundable to 90 days. One free move to another departure in the same season, whatever the notice." },
                { label: "A person, not a bot", text: "The office is two people in Labuan Bajo. They answer on WhatsApp within a few hours, and it is genuinely them." },
              ].map((item) => (
                <div key={item.label}>
                  <dt className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">{item.label}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-ink/75">{item.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* WhatsApp floating button */}
      <div className="no-print fixed bottom-5 right-5 z-40 hidden lg:block">
        <a
          href="https://wa.me/6281100000000"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 rounded-full bg-ink py-3 pl-4 pr-5 text-white shadow-lift transition hover:bg-ink-600"
        >
          <span className="font-mark text-[11px] uppercase tracking-[0.16em]">Talk to the familia</span>
        </a>
      </div>
    </>
  );
}
