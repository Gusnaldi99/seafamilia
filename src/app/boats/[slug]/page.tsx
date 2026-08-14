import { ImageSlot } from "@/components/ui/ImageSlot";
import Link from "next/link";
import { notFound } from "next/navigation";
import { boats, trips, departures, findWater, filterTrips, filterDepartures } from "@/lib/api/data";
import { CabinCard, TripCard, DepartureCard, BoatCard } from "@/components/ui/Cards";
import type { Metadata } from "next";

export function generateStaticParams() {
  return boats.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const boat = boats.find((b) => b.slug === resolvedParams.slug);
  if (!boat) return { title: "Not Found" };
  return {
    title: `${boat.name} · ${boat.type} — Sea Familia`,
    description: boat.tagline,
  };
}

export default async function BoatDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const boat = boats.find((b) => b.slug === resolvedParams.slug);
  if (!boat) notFound();

  const tripsOnBoat = filterTrips({ boat: boat.slug });
  const depsOnBoat = filterDepartures({ boat: boat.slug, available: true }).slice(0, 4);
  const others = boats.filter(x => x.slug !== boat.slug);

  const specStrip = [
    { label: 'Length', value: boat.length },
    { label: 'Beam', value: boat.beam },
    { label: 'Guests', value: boat.guests },
    { label: 'Cabins', value: boat.cabins },
    { label: 'Crew', value: boat.crew },
    { label: 'Rig', value: boat.sails },
  ];

  const decks: { name: string, cabins: string[] }[] = [];
  boat.cabinTypes.forEach(c => {
    let d = decks.find(x => x.name === c.deck);
    if (!d) {
      d = { name: c.deck, cabins: [] };
      decks.push(d);
    }
    d.cabins.push(`${c.name} (${c.beds.toLowerCase()})`);
  });
  
  const deckPlan = decks.map(d => ({
    name: d.name,
    detail: d.cabins.join(', ') + '.',
  }));
  deckPlan.push({
    name: 'Shared spaces',
    detail: boat.facilities.slice(0, 4).join(', ') + '.',
  });

  return (
    <>
      <section className="relative isolate flex min-h-[72vh] items-end overflow-hidden bg-ink">
        <div className={`ph ph-${boat.ph} absolute inset-0`}>
          <ImageSlot className="img-slot h-full w-full object-cover" src={`/media/photos/boats/${boat.slug}.jpg`} alt={boat.name} loading="lazy" />
        </div>
        <div className="scrim absolute inset-0"></div>
        <div className="relative mx-auto w-full max-w-[88rem] px-5 pb-12 pt-28 sm:px-6 lg:px-8 lg:pb-16">
          <nav aria-label="Breadcrumb" className="font-mark text-[11px] uppercase tracking-[0.16em] text-white/60">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="px-2" aria-hidden="true">/</span>
            <Link href="/boats" className="hover:text-white">Boats</Link>
            <span className="px-2" aria-hidden="true">/</span>
            <span className="text-white">{boat.name}</span>
          </nav>
          <div className="mt-8 max-w-3xl">
            <p className="font-mark text-[11px] uppercase tracking-[0.2em] text-white/70">{boat.type}</p>
            <h1 className="mt-4 font-display text-4xl font-light leading-[1.04] tracking-tight text-white sm:text-5xl lg:text-6xl">
              {boat.name}
            </h1>
            <p className="mt-5 max-w-xl font-display text-lg font-light leading-relaxed text-white/85 sm:text-2xl">
              {boat.tagline}
            </p>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#dates" className="inline-flex items-center gap-2.5 rounded-full bg-flame px-6 py-4 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-flame-600">
              Dates on this boat
              <span className="icon icon-chevron-right h-4 w-4" aria-hidden="true"></span>
            </a>
            <Link href={`/charter?boat=${boat.slug}`} className="inline-flex items-center rounded-full border border-white/35 px-6 py-4 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-white hover:text-ink-700">
              Charter her privately
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-sand-300 bg-white">
        <div className="mx-auto max-w-[88rem] px-5 sm:px-6 lg:px-8">
          <dl className="grid grid-cols-2 gap-y-6 py-8 sm:grid-cols-3 lg:grid-cols-6 lg:divide-x lg:divide-sand-300">
            {specStrip.map(s => (
              <div key={s.label} className="lg:px-6 lg:first:pl-0 lg:last:pr-0">
                <dt className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">{s.label}</dt>
                <dd className="mt-1.5 font-display text-lg text-ink-700">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-[88rem] px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          <div>
            <p className="font-mark text-[11px] uppercase tracking-[0.2em] text-flame">Her story</p>
            <p className="mt-5 font-display text-xl font-light leading-relaxed text-ink-700 sm:text-2xl">{boat.blurb}</p>

            <div className="mt-8 grid grid-cols-2 gap-3">
              {boat.gallery?.map((g, i) => (
                <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink">
                  <div className={`ph ph-${g} absolute inset-0`}>
                    <ImageSlot className="img-slot h-full w-full object-cover" src={`/media/photos/boats/${boat.slug}-${i + 1}.jpg`} alt={boat.name} loading="lazy" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-3xl bg-sand p-6 lg:p-7">
              <h2 className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">On board</h2>
              <ul className="mt-4 space-y-2.5">
                {boat.facilities?.map(f => (
                  <li key={f} className="flex gap-3 text-sm leading-relaxed text-ink/80">
                    <span className="icon icon-check mt-0.5 h-4 w-4 shrink-0 text-mist" aria-hidden="true"></span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-sand-300 p-6 lg:p-7">
              <h2 className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">Safety on board</h2>
              <ul className="mt-4 space-y-2.5">
                {boat.safety?.map(s => (
                  <li key={s} className="flex gap-3 text-sm leading-relaxed text-ink/80">
                    <span className="icon icon-shield mt-0.5 h-4 w-4 shrink-0 text-mist" aria-hidden="true"></span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
              <Link href="/policies#safety" className="mt-5 inline-block font-mark text-[11px] uppercase tracking-[0.16em] text-flame-600 underline underline-offset-4">
                Full safety policy
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section id="cabins" className="border-y border-sand-300 bg-sand">
        <div className="mx-auto max-w-[88rem] px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <p className="font-mark text-[11px] uppercase tracking-[0.2em] text-flame">Cabins</p>
              <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">
                {boat.cabins} cabins, {boat.cabinTypes.length} grades
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink/70">
                Prices shown are per person for a typical week on this boat. The exact fare depends
                on the route — pick a date and you will see it before anything is confirmed.
              </p>
            </div>
            <a href="#dates" className="inline-flex h-12 items-center gap-2 rounded-full bg-flame px-6 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-flame-600">
              Choose a date
              <span className="icon icon-chevron-right h-4 w-4" aria-hidden="true"></span>
            </a>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {boat.cabinTypes.map(c => (
              <CabinCard key={c.code} cabin={c} boatSlug={boat.slug} />
            ))}
          </div>

          <div className="mt-10 rounded-3xl bg-white p-6 lg:p-8">
            <h3 className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">How she is laid out</h3>
            <ol className="mt-5 space-y-4">
              {deckPlan.map(d => (
                <li key={d.name} className="grid gap-2 border-b border-sand-200 pb-4 last:border-0 last:pb-0 sm:grid-cols-[10rem_1fr] sm:gap-6">
                  <span className="font-display text-lg text-ink-700">{d.name}</span>
                  <span className="text-sm leading-relaxed text-ink/75">{d.detail}</span>
                </li>
              ))}
            </ol>
            <p className="mt-5 text-xs leading-relaxed text-ink/50">
              A measured deck plan is available on request — the office will email the PDF.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[88rem] px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-xl">
          <p className="font-mark text-[11px] uppercase tracking-[0.2em] text-flame">Where she sails</p>
          <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">
            {tripsOnBoat.length} routes on {boat.name}
          </h2>
        </div>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {tripsOnBoat.map(t => (
            <TripCard key={t.slug} trip={t} hideBoat={true} />
          ))}
        </div>
      </section>

      <section id="dates" className="border-t border-sand-300 bg-ink text-white">
        <div className="mx-auto max-w-[88rem] px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <span className="wave-rule wave-rule-light block"></span>
              <p className="mt-5 font-mark text-[11px] uppercase tracking-[0.2em] text-mist-300">Dates</p>
              <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight sm:text-4xl">
                Sailing on {boat.name}
              </h2>
            </div>
            <Link href={`/departures?boat=${boat.slug}`} className="group inline-flex items-center gap-2 font-mark text-[11px] uppercase tracking-[0.18em] text-white hover:text-mist-300">
              Search her whole calendar
              <span className="icon icon-chevron-right h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true"></span>
            </Link>
          </div>

          {depsOnBoat.length > 0 ? (
            <div className="mt-8 space-y-3">
              {depsOnBoat.map(d => (
                <DepartureCard key={d.id} departure={d} />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-3xl border border-dashed border-white/25 px-6 py-12 text-center">
              <h3 className="font-display text-xl">She is fully booked</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-white/70">
                Every published date on this boat has gone. The other three sail the same waters —
                or ask about a charter, where cancellations tend to surface first.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link href="/departures" className="inline-flex h-11 items-center rounded-full bg-flame px-5 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-flame-600">
                  All departures
                </Link>
                <Link href="/contact" className="inline-flex h-11 items-center rounded-full border border-white/30 px-5 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-white hover:text-ink-700">
                  Join the waitlist
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-[88rem] px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
        <h2 className="font-display text-2xl font-light text-ink-700 sm:text-3xl">The other three</h2>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {others.map(o => (
            <BoatCard key={o.slug} boat={o} />
          ))}
        </div>
      </section>
    </>
  );
}
