import { notFound } from "next/navigation";
import Link from "next/link";
import { departures, trips, boats, waters } from "@/lib/api/data";
import { formatMoney, formatNights, formatDate } from "@/lib/utils";
import { format } from "date-fns";
import { ImageSlot } from "@/components/shared/ImageSlot";
import { CabinCard, DepartureCard } from "@/components/ui/Cards";
import type { Metadata } from "next";

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const d = departures.find((d) => d.id === params.id);
  if (!d) return { title: "Not Found" };
  const t = trips.find((t) => t.slug === d.trip);
  return {
    title: `Departure ${d.id} — Sea Familia`,
    description: `Dates, route, boat, pickup point, cabin availability and what the fare covers for ${t?.title}.`,
  };
}

export default function DeparturePage({ params }: { params: { id: string } }) {
  const d = departures.find((d) => d.id === params.id);
  if (!d) notFound();

  const t = trips.find((t) => t.slug === d.trip);
  const b = boats.find((b) => b.slug === d.boat);
  const w = t ? waters.find((w) => w.slug === t.water) : undefined;

  if (!t || !b || !w) notFound();

  const endDate = new Date(d.start);
  endDate.setDate(endDate.getDate() + d.nights);

  const bookable = d.status === "open" || d.status === "limited";
  
  const gatewayParts = t.gateway.split(' to ');
  const boardsAt = gatewayParts[0];

  // Inclusions matching legacy HTML
  const included = [
    "All meals, snacks, water, tea and coffee",
    "Three dives a day plus a night dive when conditions allow",
    "Tanks, weights and weight belts",
    "A dive guide for every four divers",
    "Shore excursions and tender runs",
    "Transfers from the local airport on arrival and departure days",
    "Harbour clearance and local taxes"
  ];

  // Route matches
  const route = t.route;

  // Cabins matching this departure
  const cabinTypes = b.cabins.map(c => ({
    ...c,
    left: bookable ? Math.max(1, Math.floor(d.cabinsLeft / b.cabins.length)) : 0
  }));

  // Siblings
  const siblings = departures.filter(dep => dep.trip === t.slug && dep.id !== d.id && new Date(dep.start) >= new Date());

  return (
    <main id="main" className="pb-20 lg:pb-0">
      {/* HERO */}
      <section className="relative isolate flex min-h-[64vh] items-end overflow-hidden bg-ink">
        <div className={`ph ph-${t.ph} absolute inset-0`}>
          <ImageSlot className="img-slot h-full w-full object-cover" src={`/media/photos/trips/${t.slug}.jpg`} alt={t.title} loading="lazy" />
        </div>
        <div className="scrim absolute inset-0"></div>
        <div className="relative mx-auto w-full max-w-[88rem] px-5 pb-12 pt-28 sm:px-6 lg:px-8 lg:pb-14">
          <nav aria-label="Breadcrumb" className="font-mark text-[11px] uppercase tracking-[0.16em] text-white/60">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="px-2" aria-hidden="true">/</span>
            <Link href="/departures" className="hover:text-white">Departures</Link>
            <span className="px-2" aria-hidden="true">/</span>
            <span className="text-white">{d.id}</span>
          </nav>

          <div className="mt-8 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-mark font-medium uppercase tracking-[0.12em] text-white ${
                d.status === 'open' ? 'bg-flame' : 
                d.status === 'limited' ? 'bg-flame' : 
                d.status === 'waitlist' ? 'bg-ink border border-white/20' : 
                'bg-ink-700'
              }`}>
                {d.status === 'waitlist' ? 'Waitlist Open' : d.status === 'closed' ? 'Sold Out' : 'Shared Trip'}
              </span>
              {d.cabinsLeft > 0 && (
                <span className="font-mark text-[11px] uppercase tracking-[0.14em] text-white/80">
                  {d.cabinsLeft} {d.cabinsLeft === 1 ? 'cabin' : 'cabins'} left
                </span>
              )}
            </div>
            <p className="mt-5 font-display text-2xl font-light text-white/90 sm:text-3xl">
              {format(new Date(d.start), 'd')} – {format(endDate, 'd MMM yyyy')}
            </p>
            <h1 className="mt-2 font-display text-4xl font-light leading-[1.04] tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t.title}
            </h1>
            <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mark text-[11px] uppercase tracking-[0.14em] text-white/80">
              <span>{formatNights(d.nights)}</span>
              <span aria-hidden="true">·</span>
              <Link href={`/destinations/${w.slug}`} className="hover:text-white">{w.short}</Link>
              <span aria-hidden="true">·</span>
              <Link href={`/boats/${b.slug}`} className="hover:text-white">{b.name}</Link>
              <span aria-hidden="true">·</span>
              <span>{t.gateway}</span>
            </p>
          </div>
        </div>
      </section>

      {/* TRIP SUMMARY BAR */}
      <section className="border-b border-sand-300 bg-white">
        <div className="mx-auto max-w-[88rem] px-5 sm:px-6 lg:px-8">
          <div className="grid gap-6 py-7 lg:grid-cols-[1fr_auto] lg:items-center">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
              <div>
                <dt className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Boards</dt>
                <dd className="mt-1.5 font-display text-lg text-ink-700">{formatDate(d.start)}</dd>
                <dd className="text-xs text-ink/55">By 2pm, {boardsAt}</dd>
              </div>
              <div>
                <dt className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Disembarks</dt>
                <dd className="mt-1.5 font-display text-lg text-ink-700">{formatDate(endDate.toISOString())}</dd>
                <dd className="text-xs text-ink/55">Alongside by 9am</dd>
              </div>
              <div>
                <dt className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Cabins left</dt>
                <dd className={`mt-1.5 font-display text-lg ${d.cabinsLeft <= 1 ? 'text-flame-600' : 'text-ink-700'}`}>
                  {d.cabinsLeft} of {b.cabins.length}
                </dd>
                <dd className="text-xs text-ink/55">
                  {Math.max(0, b.guests - d.cabinsLeft * 2)} guests confirmed
                </dd>
              </div>
              <div>
                <dt className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">From</dt>
                <dd className="mt-1.5 tnum font-display text-lg text-deep-700">
                  {formatMoney(d.price)}
                </dd>
                <dd className="text-xs text-ink/55">
                  per person · {Math.round(d.deposit * 100)}% deposit
                </dd>
              </div>
            </dl>

            <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
              {bookable ? (
                <Link href={`/book?dep=${d.id}&step=3`} className="inline-flex items-center justify-center gap-2.5 rounded-full bg-flame px-7 py-4 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-flame-600">
                  <span>Reserve a cabin</span>
                  <span className="icon icon-chevron-right h-4 w-4" aria-hidden="true"></span>
                </Link>
              ) : (
                <Link href={`/contact?ref=${d.id}&topic=waitlist`} className="inline-flex items-center justify-center rounded-full bg-ink px-7 py-4 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-ink-600">
                  Join the waitlist
                </Link>
              )}
              <Link href={`/trip/${t.slug}`} className="inline-flex items-center justify-center rounded-full border border-ink/20 px-7 py-4 font-mark text-[12px] uppercase tracking-[0.14em] text-ink-700 transition hover:border-ink">
                Full itinerary
              </Link>
            </div>
          </div>
        </div>
      </section>

      {d.status === 'limited' && (
        <div className="border-b border-flame/20 bg-flame/5">
          <div className="mx-auto flex max-w-[88rem] items-start gap-3 px-5 py-3.5 sm:px-6 lg:px-8">
            <span className="icon icon-warning-triangle mt-0.5 h-5 w-5 shrink-0 text-flame" aria-hidden="true"></span>
            <p className="text-sm leading-relaxed text-ink/80">
              <strong className="text-ink-700">Nearly full.</strong>{" "}
              {d.cabinsLeft === 1 ? 'One cabin left on this date.' : `${d.cabinsLeft} cabins left on this date.`}{" "}
              Reserving holds it for 72 hours before any payment is taken.
            </p>
          </div>
        </div>
      )}

      {/* ROUTE RECAP + INCLUSIONS */}
      <section className="mx-auto max-w-[88rem] px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          <div>
            <p className="font-mark text-eyebrow uppercase text-flame">This departure</p>
            <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">
              How the {d.nights} nights run
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink/70">{t.summary}</p>

            <ol className="mt-8 space-y-5 border-l border-sand-300 pl-6">
              {route.map((r, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[1.72rem] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-mist"></span>
                  <p className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Day {r.day}</p>
                  <p className="mt-1 font-display text-lg text-ink-700">{r.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink/70">{r.text}</p>
                </li>
              ))}
            </ol>

            <Link href={`/trip/${t.slug}`} className="mt-8 inline-flex h-12 items-center gap-2 rounded-full border border-ink/20 px-6 font-mark text-[12px] uppercase tracking-[0.14em] text-ink-700 transition hover:border-ink hover:bg-ink hover:text-white">
              Route in full, with gallery
              <span className="icon icon-chevron-right h-4 w-4" aria-hidden="true"></span>
            </Link>
          </div>

          <aside className="space-y-4">
            <div className="rounded-3xl bg-sand p-6 lg:p-7">
              <h2 className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">In the fare</h2>
              <ul className="mt-4 space-y-2.5">
                {included.map((i, idx) => (
                  <li key={idx} className="flex gap-3 text-sm leading-relaxed text-ink/80">
                    <span className="icon icon-check mt-0.5 h-4 w-4 shrink-0 text-mist" aria-hidden="true"></span>
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
              <Link href={`/trip/${t.slug}#dates`} className="mt-5 inline-block font-mark text-[11px] uppercase tracking-[0.16em] text-flame-600 underline underline-offset-4">
                And what is not
              </Link>
            </div>

            <div className="rounded-3xl border border-sand-300 p-6 lg:p-7">
              <h2 className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">Getting there</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-ink/60">Pickup point</dt>
                  <dd className="mt-0.5 text-ink-700">{t.gateway}</dd>
                </div>
                <div>
                  <dt className="text-ink/60">Transfers</dt>
                  <dd className="mt-0.5 text-ink-700">Included on both days, airport to boat</dd>
                </div>
                <div>
                  <dt className="text-ink/60">Arrive by</dt>
                  <dd className="mt-0.5 text-ink-700">The night before is safest — flights inland get cancelled</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </section>

      {/* CABINS */}
      <section id="cabins" className="border-y border-sand-300 bg-sand">
        <div className="mx-auto max-w-[88rem] px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <p className="font-mark text-eyebrow uppercase text-flame">Cabins on this date</p>
              <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">
                What is still free
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink/70">
                Prices are per person for this departure, all meals and diving included.
                Choosing one holds it for 72 hours — no card details until a human confirms.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {cabinTypes.map((c) => (
              <div key={c.code} className="relative">
                <CabinCard cabin={c} boatSlug={b.slug} />
                {c.left > 0 && (
                  <Link href={`/book?dep=${d.id}&cabin=${c.code}&step=3`} className="absolute bottom-4 right-4 inline-flex h-11 items-center rounded-full bg-flame px-5 font-mark text-[11px] uppercase tracking-[0.12em] text-white transition hover:bg-flame-600">
                    Select
                  </Link>
                )}
              </div>
            ))}
          </div>

          <p className="mt-6 text-xs leading-relaxed text-ink/55">
            Solo travellers: the single berths carry no supplement, and we will never put you in a
            twin with a stranger unless you ask us to.
          </p>
        </div>
      </section>

      {/* OTHER DATES */}
      {siblings.length > 0 && (
        <section className="mx-auto max-w-[88rem] px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-xl">
            <p className="font-mark text-eyebrow uppercase text-flame">Other dates</p>
            <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">
              The same route, different weeks
            </h2>
          </div>
          <div className="mt-8 space-y-3">
            {siblings.map((s) => (
              <DepartureCard key={s.id} departure={s} />
            ))}
          </div>
        </section>
      )}

      {/* REASSURANCE */}
      <section className="border-t border-sand-300 bg-white">
        <div className="mx-auto max-w-[88rem] px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <h3 className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">Held, not charged</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/75">
                Reserving holds the cabin for 72 hours. The payment link comes after someone has
                confirmed availability by hand.
              </p>
            </div>
            <div>
              <h3 className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">Move it once, free</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/75">
                One change to another departure in the same season at no charge, whatever the notice.{" "}
                <Link href="/policies#cancellation" className="text-flame-600 underline underline-offset-4">Policy</Link>.
              </p>
            </div>
            <div>
              <h3 className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">Questions first?</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/75">
                The office answers on WhatsApp within a few hours, and it is genuinely them.{" "}
                <Link href="/contact" className="text-flame-600 underline underline-offset-4">Contact</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STICKY MOBILE CTA */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-sand-300 bg-white/95 shadow-rail backdrop-blur lg:hidden no-print">
        <div className="flex items-center gap-3 px-5 py-3">
          <div className="min-w-0 flex-1">
            <p className="truncate font-mark text-[10px] uppercase tracking-[0.14em] text-mist-700">
              {format(new Date(d.start), 'd')} – {format(endDate, 'd MMM yyyy')}
            </p>
            <p className="text-sm text-ink-700">
              From <span className="tnum font-display text-base">{formatMoney(d.price)}</span>
              <span className="text-xs text-ink/55"> per person</span>
            </p>
          </div>
          {bookable ? (
            <Link href={`/book?dep=${d.id}&step=3`} className="inline-flex h-12 shrink-0 items-center rounded-full bg-flame px-5 font-mark text-[12px] uppercase tracking-[0.14em] text-white">
              Reserve
            </Link>
          ) : (
            <Link href={`/contact?ref=${d.id}&topic=waitlist`} className="inline-flex h-12 shrink-0 items-center rounded-full bg-ink px-5 font-mark text-[12px] uppercase tracking-[0.14em] text-white">
              Waitlist
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
