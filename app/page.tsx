import Link from 'next/link';
import { ArticleCard } from '@/components/cards/article-card';
import { BoatCard } from '@/components/cards/boat-card';
import { DepartureCard } from '@/components/cards/departure-card';
import { TripCard } from '@/components/cards/trip-card';
import { WaterCard } from '@/components/cards/water-card';
import { PhotoSlot } from '@/components/media/photo-slot';
import { Money, Nights } from '@/components/providers/locale-provider';
import { ChevronRight, Compass, HullMast, PathWavesMast } from '@/components/icons';
import { HomeItineraryIndex } from './home-itinerary-index';
import { boatBySlug, filterDepartures, waterBySlug } from '@/lib/queries';
import { resolvePhotoMap } from '@/lib/photo';
import { photoPath, PHOTO_SIZES } from '@/lib/photo-paths';
import { routes } from '@/lib/routes';
import { articles, boats, trips, waters } from '@/lib/data';

const editorPicks = trips.filter((t) => t.editorPick).slice(0, 2);
const nextDepartures = filterDepartures({ available: true }).slice(0, 4);
const railWaters = waters.slice(0, 4);
const journalPicks = articles.slice(0, 3);
const tripPhotos = resolvePhotoMap(trips, (t) => t.slug, (t) => photoPath.trip(t.slug));

export default function Home() {
  const lead = editorPicks[0];
  const secondPick = editorPicks[1];
  const leadWater = lead ? waterBySlug(lead.water) : undefined;
  const leadBoat = lead ? boatBySlug(lead.boat) : undefined;

  return (
    <>
      {/* ================= HERO =================
          The original's <video> pointed at a stock mixkit URL and a
          never-committed assets/media/hero.webm — neither is real footage,
          so this uses the same .ph gradient plate every other media slot
          falls back to rather than porting a broken/external video
          reference. A HeroVideo component is one drop-in swap away once
          real footage exists. */}
      <section className="relative isolate flex min-h-[88vh] items-end overflow-hidden bg-ink lg:min-h-[94vh]">
        <div className="ph ph-reef absolute inset-0" aria-hidden="true" />
        <div className="scrim absolute inset-0" aria-hidden="true" />

        <div className="relative mx-auto w-full max-w-8xl px-5 pb-14 pt-28 sm:px-6 lg:px-8 lg:pb-20">
          <div className="max-w-2xl">
            <span className="wave-rule wave-rule-light block" aria-hidden="true" />
            <p className="mt-5 font-mark text-eyebrow uppercase text-white/75">Liveaboard voyages · Eastern Indonesia</p>
            <h1 className="mt-4 font-display text-[2.6rem] font-light leading-[1.04] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Come sailing with
              <br className="hidden sm:block" /> the familia
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
              Four hand-built phinisi, a crew who mostly grew up on these reefs, and eleven years of
              finding the anchorage nobody else is in. Reserve a single cabin — or take the whole
              boat.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href={routes.departures()}
                className="inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-flame px-7 font-mark text-[13px] uppercase tracking-[0.16em] text-white transition hover:bg-flame-600"
              >
                Find a departure
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href={routes.plan()}
                className="inline-flex h-14 items-center justify-center rounded-full border border-white/35 bg-white/5 px-7 font-mark text-[13px] uppercase tracking-[0.16em] text-white backdrop-blur transition hover:border-white hover:bg-white hover:text-ink-700"
              >
                Answer 5 questions instead
              </Link>
            </div>
          </div>

          <dl className="mt-12 grid max-w-3xl grid-cols-2 gap-x-6 gap-y-6 border-t border-white/15 pt-8 sm:grid-cols-4 lg:mt-16">
            <div>
              <dt className="font-mark text-[10px] uppercase tracking-[0.18em] text-white/55">The fleet</dt>
              <dd className="mt-1.5 font-display text-2xl text-white">4 boats</dd>
            </div>
            <div>
              <dt className="font-mark text-[10px] uppercase tracking-[0.18em] text-white/55">Waters we sail</dt>
              <dd className="mt-1.5 font-display text-2xl text-white">8 regions</dd>
            </div>
            <div>
              <dt className="font-mark text-[10px] uppercase tracking-[0.18em] text-white/55">Crew to guest</dt>
              <dd className="mt-1.5 font-display text-2xl text-white">Nearly 1:1</dd>
            </div>
            <div>
              <dt className="font-mark text-[10px] uppercase tracking-[0.18em] text-white/55">Sailing since</dt>
              <dd className="mt-1.5 font-display text-2xl text-white">2015</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* ================= THREE PATHS ================= */}
      <section className="border-b border-sand-300 bg-sand">
        <div className="mx-auto max-w-8xl px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <p className="font-mark text-eyebrow uppercase text-flame">Where would you like to start?</p>
            <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl lg:text-5xl">
              Inspire first. Clarify the choice.
              <br className="hidden sm:block" /> Guide the next step.
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3 lg:gap-6">
            <Link
              href={routes.destinations()}
              className="group flex flex-col rounded-3xl border border-sand-300 bg-white p-6 transition hover:border-mist-300 hover:shadow-card lg:p-8"
            >
              <span className="font-mark text-[11px] uppercase tracking-[0.2em] text-mist-700">Path one</span>
              <PathWavesMast className="mt-5 h-8 w-8 text-ink-700" aria-hidden="true" />
              <h3 className="mt-5 font-display text-2xl text-ink-700">Browse and be inspired</h3>
              <p className="mt-2.5 flex-1 text-sm leading-relaxed text-ink/70">
                No form, no funnel. Eight waters, twelve itineraries, four boats — wander through in
                any order and see what catches.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 font-mark text-[11px] uppercase tracking-[0.18em] text-flame-600">
                Destinations
                <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>

            <Link
              href={routes.plan()}
              className="group flex flex-col rounded-3xl border border-ink bg-ink p-6 text-white transition hover:bg-ink-600 lg:p-8"
            >
              <span className="font-mark text-[11px] uppercase tracking-[0.2em] text-mist-300">Path two · most popular</span>
              <Compass className="mt-5 h-8 w-8 text-white" aria-hidden="true" />
              <h3 className="mt-5 font-display text-2xl">Let us narrow it down</h3>
              <p className="mt-2.5 flex-1 text-sm leading-relaxed text-white/75">
                Five questions — what you want to do, which water, how long, and who is coming. We
                show the departures that actually fit.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 font-mark text-[11px] uppercase tracking-[0.18em] text-white">
                Plan your trip
                <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>

            <Link
              href={routes.charter()}
              className="group flex flex-col rounded-3xl border border-sand-300 bg-white p-6 transition hover:border-mist-300 hover:shadow-card lg:p-8"
            >
              <span className="font-mark text-[11px] uppercase tracking-[0.2em] text-mist-700">Path three</span>
              <HullMast className="mt-5 h-8 w-8 text-ink-700" aria-hidden="true" />
              <h3 className="mt-5 font-display text-2xl text-ink-700">Take the whole boat</h3>
              <p className="mt-2.5 flex-1 text-sm leading-relaxed text-ink/70">
                Your dates, your group, an itinerary we build together. Eight to twenty guests, and
                no strangers at dinner.
              </p>
              <span className="mt-5 inline-flex items-center gap-2 font-mark text-[11px] uppercase tracking-[0.18em] text-flame-600">
                Private charter
                <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= EDITOR'S PICK ================= */}
      {lead ? (
        <section className="mx-auto max-w-8xl px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <p className="font-mark text-eyebrow uppercase text-flame">Editor&rsquo;s pick</p>
              <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl lg:text-5xl">
                The two the crew argue about
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink/70">
                Chosen at the end of last season by the people who sailed them. Nobody consulted the
                bookings spreadsheet.
              </p>
            </div>
            <Link
              href={routes.destinations()}
              className="group inline-flex items-center gap-2 font-mark text-[11px] uppercase tracking-[0.18em] text-ink-700 hover:text-flame-600"
            >
              All twelve itineraries
              <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-7">
              <Link href={routes.trip(lead.slug)} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-ink lg:aspect-[16/11]">
                  <PhotoSlot
                    ph={lead.ph}
                    src={photoPath.trip(lead.slug)}
                    alt={lead.title}
                    sizes={PHOTO_SIZES.tripCard}
                    className="transition-transform duration-700 ease-swell group-hover:scale-[1.03]"
                  />
                  <div className="scrim absolute inset-0" aria-hidden="true" />
                  <div className="absolute inset-x-5 bottom-5 lg:inset-x-8 lg:bottom-8">
                    <span className="inline-flex items-center rounded-full bg-flame px-3 py-1.5 font-mark text-[10px] uppercase tracking-[0.18em] text-white">
                      Crew&rsquo;s first choice
                    </span>
                    <h3 className="mt-4 font-display text-3xl leading-tight text-white lg:text-4xl">{lead.title}</h3>
                    <p className="mt-2.5 max-w-md text-sm leading-relaxed text-white/85">{lead.summary}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mark text-[11px] uppercase tracking-[0.14em] text-white/80">
                      <span>{leadWater?.short ?? '—'}</span>
                      <span aria-hidden="true">·</span>
                      <Nights n={lead.nights} />
                      <span aria-hidden="true">·</span>
                      <span>{leadBoat?.name ?? '—'}</span>
                      <span aria-hidden="true">·</span>
                      <span>
                        from <Money usd={lead.from} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            {secondPick ? (
              <div className="lg:col-span-5">
                <TripCard trip={secondPick} />
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* ================= ITINERARIES INDEX (client island) ================= */}
      <HomeItineraryIndex tripPhotos={tripPhotos} />

      {/* ================= NEXT DEPARTURES ================= */}
      <section className="mx-auto max-w-8xl px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="font-mark text-eyebrow uppercase text-flame">Sailing next</p>
            <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl lg:text-5xl">
              Cabins open in the next few months
            </h2>
          </div>
          <Link
            href={routes.departures()}
            className="group inline-flex items-center gap-2 font-mark text-[11px] uppercase tracking-[0.18em] text-ink-700 hover:text-flame-600"
          >
            Full departure calendar
            <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-8 space-y-3">
          {nextDepartures.map((d) => (
            <DepartureCard key={d.id} departure={d} />
          ))}
        </div>
      </section>

      {/* ================= WATERS ================= */}
      <section className="overflow-hidden border-y border-sand-300 bg-ink py-16 lg:py-24">
        <div className="mx-auto max-w-8xl px-5 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <span className="wave-rule wave-rule-light block" aria-hidden="true" />
              <p className="mt-5 font-mark text-eyebrow uppercase text-mist-300">Waters</p>
              <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                Eight regions, each with its own season
              </h2>
            </div>
            <Link
              href={routes.destinations()}
              className="group inline-flex items-center gap-2 font-mark text-[11px] uppercase tracking-[0.18em] text-white hover:text-mist-300"
            >
              All destinations
              <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="mt-10 -mx-5 px-5 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
          <div className="rail mx-auto max-w-8xl pb-2 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:px-8">
            {railWaters.map((w) => (
              <div key={w.slug} className="w-[68vw] max-w-xs lg:w-auto lg:max-w-none">
                <WaterCard water={w} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FLEET ================= */}
      <section className="mx-auto max-w-8xl px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="font-mark text-eyebrow uppercase text-flame">The fleet</p>
            <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl lg:text-5xl">
              Four boats, built in Bira
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink/70">
              Every hull came out of the same yard in South Sulawesi, from the same family of Konjo
              shipwrights. They differ in size, not in how they were made.
            </p>
          </div>
          <Link
            href={routes.boats()}
            className="group inline-flex items-center gap-2 font-mark text-[11px] uppercase tracking-[0.18em] text-ink-700 hover:text-flame-600"
          >
            Compare the fleet
            <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {boats.map((b) => (
            <BoatCard key={b.slug} boat={b} />
          ))}
        </div>
      </section>

      {/* ================= OPEN TRIP vs CHARTER ================= */}
      <section className="bg-sand">
        <div className="mx-auto max-w-8xl px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <span className="wave-rule wave-rule-flame mx-auto block" aria-hidden="true" />
            <h2 className="mt-5 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">
              By the cabin, or the whole boat
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink/70">
              Two ways to sail with us, and the only real difference is who else is at dinner.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl gap-4 md:grid-cols-2 lg:gap-6">
            <div className="rounded-3xl border border-sand-300 bg-white p-6 lg:p-8">
              <h3 className="font-display text-2xl text-ink-700">Open trip</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                A scheduled departure. You reserve one cabin and share the boat with eight to twenty
                others.
              </p>
              <ul className="mt-5 space-y-2.5 text-sm text-ink/80">
                <li className="flex gap-2.5">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-flame" />
                  Priced per person, per cabin grade
                </li>
                <li className="flex gap-2.5">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-flame" />
                  Fixed dates and a published route
                </li>
                <li className="flex gap-2.5">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-flame" />
                  25% deposit, balance 60 days out
                </li>
                <li className="flex gap-2.5">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-flame" />
                  No single supplement on solo berths
                </li>
              </ul>
              <Link
                href={routes.departures()}
                className="mt-6 inline-flex h-12 items-center rounded-full bg-flame px-6 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-flame-600"
              >
                See departures
              </Link>
            </div>

            <div className="rounded-3xl border border-ink bg-ink p-6 text-white lg:p-8">
              <h3 className="font-display text-2xl">Private charter</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/75">
                The whole boat, your dates, and an itinerary we draw with you rather than hand to
                you.
              </p>
              <ul className="mt-5 space-y-2.5 text-sm text-white/85">
                <li className="flex gap-2.5">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-mist-300" />
                  Priced per boat, per day
                </li>
                <li className="flex gap-2.5">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-mist-300" />
                  Any dates the boat is free
                </li>
                <li className="flex gap-2.5">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-mist-300" />
                  Route built around your group
                </li>
                <li className="flex gap-2.5">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-mist-300" />A quote from a
                  human within one working day
                </li>
              </ul>
              <Link
                href={routes.charter()}
                className="mt-6 inline-flex h-12 items-center rounded-full bg-white px-6 font-mark text-[12px] uppercase tracking-[0.14em] text-ink-700 transition hover:bg-sand"
              >
                How charter works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= JOURNAL ================= */}
      <section className="mx-auto max-w-8xl px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="font-mark text-eyebrow uppercase text-flame">Journal</p>
            <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl lg:text-5xl">
              Written on the boat, mostly
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink/70">
              By the crew, the cook, the captain and the biologist who joins four crossings a season.
              Nobody here is a content producer.
            </p>
          </div>
          <Link
            href={routes.journal()}
            className="group inline-flex items-center gap-2 font-mark text-[11px] uppercase tracking-[0.18em] text-ink-700 hover:text-flame-600"
          >
            Read the journal
            <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-3 lg:gap-6">
          {journalPicks.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </section>

      {/* ================= TRUST ================= */}
      <section className="border-t border-sand-300 bg-white">
        <div className="mx-auto max-w-8xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
            <figure className="max-w-md">
              <blockquote className="pull-quote">
                &ldquo;We booked one cabin and left feeling like we had been adopted. The crew
                remembered our daughter&rsquo;s name before we remembered theirs.&rdquo;
              </blockquote>
              <figcaption className="mt-4 text-sm text-mist-700">
                Marieke &amp; Tom V. · Lagoons &amp; Little Explorers · October 2025
              </figcaption>
            </figure>

            <dl className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
              <div>
                <dt className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">Safety</dt>
                <dd className="mt-2 text-sm leading-relaxed text-ink/75">
                  Oxygen and first-response kits on every deck, two liferafts, EPIRB and satellite
                  phone. Crew drilled monthly, not annually.
                </dd>
              </div>
              <div>
                <dt className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">Diving cover</dt>
                <dd className="mt-2 text-sm leading-relaxed text-ink/75">
                  DAN-affiliated evacuation cover on all four boats. We ask for your policy number
                  with the joining form, and we do check it.
                </dd>
              </div>
              <div>
                <dt className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">Booking terms</dt>
                <dd className="mt-2 text-sm leading-relaxed text-ink/75">
                  Deposit fully refundable to 90 days. One free move to another departure in the same
                  season, whatever the notice.{' '}
                  <Link href={routes.policies('cancellation')} className="text-flame-600 underline underline-offset-4">
                    Read the policy
                  </Link>
                  .
                </dd>
              </div>
              <div>
                <dt className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">A person, not a bot</dt>
                <dd className="mt-2 text-sm leading-relaxed text-ink/75">
                  The office is two people in Labuan Bajo. They answer on WhatsApp within a few
                  hours, and it is genuinely them.{' '}
                  <Link href={routes.contact()} className="text-flame-600 underline underline-offset-4">
                    Contact us
                  </Link>
                  .
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}
