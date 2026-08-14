import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CabinCard } from '@/components/cards/cabin-card';
import { DepartureCard } from '@/components/cards/departure-card';
import { StatusBadge } from '@/components/cards/status-badge';
import { PhotoSlot } from '@/components/media/photo-slot';
import { DateLabel, DateRangeLabel, Money, Nights } from '@/components/providers/locale-provider';
import { Check, WarningTriangle } from '@/components/icons';
import { PHOTO_SIZES, photoPath } from '@/lib/photo-paths';
import { addDays, formatDateRange } from '@/lib/format';
import { boatBySlug, departureById, departuresFor, deriveCabinInventory, gatewayParts, routeFor, tripBySlug, waterBySlug } from '@/lib/queries';
import { routes } from '@/lib/routes';
import { departures, inclusions } from '@/lib/data';

export function generateStaticParams() {
  return departures.map((d) => ({ id: d.id }));
}

export async function generateMetadata({ params }: PageProps<'/departures/[id]'>): Promise<Metadata> {
  const { id } = await params;
  const departure = departureById(id);
  if (!departure) return {};
  const trip = tripBySlug(departure.trip);
  return {
    title: `${trip?.title ?? departure.id} · ${formatDateRange(departure.start, departure.nights)}`,
    description: trip?.summary,
  };
}

export default async function DepartureDetailPage({ params }: PageProps<'/departures/[id]'>) {
  const { id } = await params;
  const departure = departureById(id);
  if (!departure) notFound();

  const trip = tripBySlug(departure.trip);
  const boat = boatBySlug(departure.boat);
  if (!trip || !boat) notFound();
  const water = waterBySlug(trip.water);
  if (!water) notFound();

  const endDate = addDays(departure.start, departure.nights) ?? departure.start;
  const route = routeFor(trip).slice(0, 5);
  const cabins = deriveCabinInventory(departure, boat);
  const siblings = departuresFor(departure.trip)
    .filter((x) => x.id !== departure.id)
    .slice(0, 3);
  const { boards } = gatewayParts(trip);
  const bookable = (departure.status === 'open' || departure.status === 'limited') && departure.cabinsLeft > 0;
  const included = trip.included ?? inclusions.included;

  return (
    <div className="pb-20 lg:pb-0">
      <section className="relative isolate flex min-h-[64vh] items-end overflow-hidden bg-ink">
        <PhotoSlot ph={trip.ph} src={photoPath.trip(trip.slug)} alt={trip.title} sizes={PHOTO_SIZES.hero} />
        <div className="scrim absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto w-full max-w-8xl px-5 pb-12 pt-28 sm:px-6 lg:px-8 lg:pb-14">
          <nav aria-label="Breadcrumb" className="font-mark text-[11px] uppercase tracking-[0.16em] text-white/60">
            <Link href={routes.home()} className="hover:text-white">
              Home
            </Link>
            <span className="px-2" aria-hidden="true">
              /
            </span>
            <Link href={routes.departures()} className="hover:text-white">
              Departures
            </Link>
            <span className="px-2" aria-hidden="true">
              /
            </span>
            <span className="text-white">{departure.id}</span>
          </nav>

          <div className="mt-8 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={departure.status} extra={departure.cabinsLeft > 0 ? `${departure.cabinsLeft} cabins left` : undefined} />
            </div>
            <p className="mt-5 font-display text-2xl font-light text-white/90 sm:text-3xl">
              <DateRangeLabel iso={departure.start} nights={departure.nights} />
            </p>
            <h1 className="mt-2 font-display text-4xl font-light leading-[1.04] tracking-tight text-white sm:text-5xl lg:text-6xl">{trip.title}</h1>
            <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mark text-[11px] uppercase tracking-[0.14em] text-white/80">
              <Nights n={departure.nights} />
              <span aria-hidden="true">·</span>
              <Link href={routes.destination(water.slug)} className="hover:text-white">
                {water.short}
              </Link>
              <span aria-hidden="true">·</span>
              <Link href={routes.boat(boat.slug)} className="hover:text-white">
                {boat.name}
              </Link>
              <span aria-hidden="true">·</span>
              <span>{trip.gateway}</span>
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-sand-300 bg-white">
        <div className="mx-auto max-w-8xl px-5 sm:px-6 lg:px-8">
          <div className="grid gap-6 py-7 lg:grid-cols-[1fr_auto] lg:items-center">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
              <div>
                <dt className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Boards</dt>
                <dd className="mt-1.5 font-display text-lg text-ink-700">
                  <DateLabel iso={departure.start} />
                </dd>
                <dd className="text-xs text-ink/55">By 2pm, {boards}</dd>
              </div>
              <div>
                <dt className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Disembarks</dt>
                <dd className="mt-1.5 font-display text-lg text-ink-700">
                  <DateLabel iso={endDate} />
                </dd>
                <dd className="text-xs text-ink/55">Alongside by 9am</dd>
              </div>
              <div>
                <dt className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Cabins left</dt>
                <dd className={`mt-1.5 font-display text-lg ${departure.cabinsLeft <= 1 ? 'text-flame-600' : 'text-ink-700'}`}>
                  {departure.cabinsLeft} of {boat.cabins}
                </dd>
                <dd className="text-xs text-ink/55">{Math.max(0, boat.guests - departure.cabinsLeft * 2)} guests confirmed</dd>
              </div>
              <div>
                <dt className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">From</dt>
                <dd className="mt-1.5 tnum font-display text-lg text-deep-700">
                  <Money usd={departure.price} />
                </dd>
                <dd className="text-xs text-ink/55">per person · {Math.round(departure.deposit * 100)}% deposit</dd>
              </div>
            </dl>

            <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
              {bookable ? (
                <Link
                  href={routes.reserve({ dep: departure.id, step: 3 })}
                  className="inline-flex items-center justify-center gap-2.5 rounded-full bg-flame px-7 py-4 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-flame-600"
                >
                  Reserve a cabin
                </Link>
              ) : (
                <Link
                  href={routes.contact({ ref: departure.id, topic: 'waitlist' })}
                  className="inline-flex items-center justify-center rounded-full bg-ink px-7 py-4 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-ink-600"
                >
                  Join the waitlist
                </Link>
              )}
              <Link
                href={routes.trip(trip.slug)}
                className="inline-flex items-center justify-center rounded-full border border-ink/20 px-7 py-4 font-mark text-[12px] uppercase tracking-[0.14em] text-ink-700 transition hover:border-ink"
              >
                Full itinerary
              </Link>
            </div>
          </div>
        </div>
      </section>

      {departure.status === 'limited' ? (
        <div className="border-b border-flame/20 bg-flame/5">
          <div className="mx-auto flex max-w-8xl items-start gap-3 px-5 py-3.5 sm:px-6 lg:px-8">
            <WarningTriangle className="mt-0.5 h-5 w-5 shrink-0 text-flame" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-ink/80">
              <strong className="text-ink-700">Nearly full.</strong>{' '}
              {departure.cabinsLeft === 1 ? 'One cabin left on this date.' : `${departure.cabinsLeft} cabins left on this date.`} Reserving
              holds it for 72 hours before any payment is taken.
            </p>
          </div>
        </div>
      ) : null}

      <section className="mx-auto max-w-8xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          <div>
            <p className="font-mark text-eyebrow uppercase text-flame">This departure</p>
            <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">
              How the {departure.nights} nights run
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink/70">{trip.summary}</p>

            <ol className="mt-8 space-y-5 border-l border-sand-300 pl-6">
              {route.map((r, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[1.72rem] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-mist" />
                  <p className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Day {r.day}</p>
                  <p className="mt-1 font-display text-lg text-ink-700">{r.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink/70">{r.text}</p>
                </li>
              ))}
            </ol>

            <Link
              href={routes.trip(trip.slug)}
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-full border border-ink/20 px-6 font-mark text-[12px] uppercase tracking-[0.14em] text-ink-700 transition hover:border-ink hover:bg-ink hover:text-white"
            >
              Route in full, with gallery
            </Link>
          </div>

          <aside className="space-y-4">
            <div className="rounded-3xl bg-sand p-6 lg:p-7">
              <h2 className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">In the fare</h2>
              <ul className="mt-4 space-y-2.5">
                {included.slice(0, 7).map((i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink/80">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-mist" aria-hidden="true" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
              <Link href={`${routes.trip(trip.slug)}#dates`} className="mt-5 inline-block font-mark text-[11px] uppercase tracking-[0.16em] text-flame-600 underline underline-offset-4">
                And what is not
              </Link>
            </div>

            <div className="rounded-3xl border border-sand-300 p-6 lg:p-7">
              <h2 className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">Getting there</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-ink/60">Pickup point</dt>
                  <dd className="mt-0.5 text-ink-700">{trip.gateway}</dd>
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

      <section id="cabins" className="border-y border-sand-300 bg-sand">
        <div className="mx-auto max-w-8xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <p className="font-mark text-eyebrow uppercase text-flame">Cabins on this date</p>
              <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">What is still free</h2>
              <p className="mt-4 text-base leading-relaxed text-ink/70">
                Prices are per person for this departure, all meals and diving included. Choosing one holds it for 72
                hours — no card details until a human confirms.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {cabins.map((c) => (
              <div key={c.code} className="relative">
                <CabinCard cabin={c} boatSlug={boat.slug} />
                {c.left > 0 ? (
                  <Link
                    href={routes.reserve({ dep: departure.id, cabin: c.code, step: 3 })}
                    className="absolute bottom-4 right-4 inline-flex h-11 items-center rounded-full bg-flame px-5 font-mark text-[11px] uppercase tracking-[0.12em] text-white transition hover:bg-flame-600"
                  >
                    Select
                  </Link>
                ) : null}
              </div>
            ))}
          </div>

          <p className="mt-6 text-xs leading-relaxed text-ink/55">
            Solo travellers: the single berths carry no supplement, and we will never put you in a twin with a
            stranger unless you ask us to.
          </p>
        </div>
      </section>

      {siblings.length > 0 ? (
        <section className="mx-auto max-w-8xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-xl">
            <p className="font-mark text-eyebrow uppercase text-flame">Other dates</p>
            <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">The same route, different weeks</h2>
          </div>
          <div className="mt-8 space-y-3">
            {siblings.map((s) => (
              <DepartureCard key={s.id} departure={s} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="border-t border-sand-300 bg-white">
        <div className="mx-auto max-w-8xl px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <h3 className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">Held, not charged</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/75">
                Reserving holds the cabin for 72 hours. The payment link comes after someone has confirmed
                availability by hand.
              </p>
            </div>
            <div>
              <h3 className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">Move it once, free</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/75">
                One change to another departure in the same season at no charge, whatever the notice.{' '}
                <Link href={routes.policies('cancellation')} className="text-flame-600 underline underline-offset-4">
                  Policy
                </Link>
                .
              </p>
            </div>
            <div>
              <h3 className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">Questions first?</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/75">
                The office answers on WhatsApp within a few hours, and it is genuinely them.{' '}
                <Link href={routes.contact()} className="text-flame-600 underline underline-offset-4">
                  Contact
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="no-print fixed inset-x-0 bottom-0 z-30 border-t border-sand-300 bg-white/95 shadow-rail backdrop-blur lg:hidden">
        <div className="flex items-center gap-3 px-5 py-3">
          <div className="min-w-0 flex-1">
            <p className="truncate font-mark text-[10px] uppercase tracking-[0.14em] text-mist-700">
              <DateRangeLabel iso={departure.start} nights={departure.nights} />
            </p>
            <p className="text-sm text-ink-700">
              From <Money usd={departure.price} /> <span className="text-xs text-ink/55">per person</span>
            </p>
          </div>
          {bookable ? (
            <Link href={routes.reserve({ dep: departure.id, step: 3 })} className="inline-flex h-12 shrink-0 items-center rounded-full bg-flame px-5 font-mark text-[12px] uppercase tracking-[0.14em] text-white">
              Reserve
            </Link>
          ) : (
            <Link
              href={routes.contact({ ref: departure.id, topic: 'waitlist' })}
              className="inline-flex h-12 shrink-0 items-center rounded-full bg-ink px-5 font-mark text-[12px] uppercase tracking-[0.14em] text-white"
            >
              Waitlist
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
