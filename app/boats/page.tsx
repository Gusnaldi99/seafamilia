import type { Metadata } from 'next';
import Link from 'next/link';
import { PageBreadcrumb } from '@/components/chrome/page-breadcrumb';
import { BoatCard } from '@/components/cards/boat-card';
import { PhotoSlot } from '@/components/media/photo-slot';
import { Money } from '@/components/providers/locale-provider';
import { ChevronRight } from '@/components/icons';
import { photoPath, PHOTO_SIZES } from '@/lib/photo-paths';
import { routes } from '@/lib/routes';
import { boats } from '@/lib/data';

export const metadata: Metadata = {
  title: 'The Fleet',
  description: 'Two boats — Sea Familia and Sea Familia 2. Compare length, cabins, guests and crew side by side.',
};

const SPEC_ROWS: { label: string; render: (b: (typeof boats)[number]) => React.ReactNode }[] = [
  { label: 'Length overall', render: (b) => b.length },
  { label: 'Beam', render: (b) => b.beam },
  { label: 'Rig', render: (b) => b.sails },
  {
    label: 'Built / refit',
    render: (b) => (
      <>
        {b.built} · refit {b.refit}
      </>
    ),
  },
  { label: 'Cabins', render: (b) => b.cabins },
  { label: 'Guests', render: (b) => b.guests },
  { label: 'Crew', render: (b) => b.crew },
  { label: 'Tenders', render: (b) => b.tenders },
  { label: 'Cruising speed', render: (b) => b.cruise },
  {
    label: 'From, per person',
    render: (b) => (
      <span className="tnum font-display text-base text-deep-700">
        <Money usd={Math.min(...b.cabinTypes.map((c) => c.price))} />
      </span>
    ),
  },
];

export default function BoatsPage() {
  return (
    <>
      <section className="border-b border-sand-300 bg-sand">
        <div className="mx-auto max-w-8xl px-5 pb-12 pt-8 sm:px-6 lg:px-8 lg:pb-16 lg:pt-12">
          <PageBreadcrumb label="Boats" />
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-16">
            <div>
              <p className="font-mark text-eyebrow uppercase text-flame">The fleet</p>
              <h1 className="mt-4 font-display text-4xl font-light leading-[1.06] tracking-tight text-ink-700 sm:text-5xl lg:text-6xl">
                Two boats,
                <br className="hidden sm:block" /> one family
              </h1>
            </div>
            <p className="text-base leading-relaxed text-ink/70">
              Sea Familia 2 carries the bigger groups and the dive gear, and goes further — Sumbawa and
              Alor as well as Komodo. Sea Familia is smaller, and stays around Komodo.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-8xl px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:gap-x-6 lg:gap-y-14">
          {boats.map((b) => (
            <BoatCard key={b.slug} boat={b} />
          ))}
        </div>
      </section>

      <section className="border-y border-sand-300 bg-sand">
        <div className="mx-auto max-w-8xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-xl">
            <p className="font-mark text-eyebrow uppercase text-flame">Choosing between them</p>
            <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">
              Honestly, it depends on who is coming
            </h2>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:gap-6">
            <div className="rounded-2xl bg-white p-6">
              <h3 className="font-mark text-[11px] uppercase tracking-[0.16em] text-flame">Bigger groups, or diving</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/75">
                <Link href={routes.boat('sea-familia-2')} className="font-display text-lg text-ink-700 hover:text-flame-600">
                  Sea Familia 2
                </Link>{' '}
                — sixteen guests across six cabins, the only boat that carries dive gear, and goes
                further — Sumbawa and Alor as well as Komodo. Half her season is charter.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-6">
              <h3 className="font-mark text-[11px] uppercase tracking-[0.16em] text-flame">Smaller groups, or quiet and private</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/75">
                <Link href={routes.boat('sea-familia')} className="font-display text-lg text-ink-700 hover:text-flame-600">
                  Sea Familia
                </Link>{' '}
                — twelve guests across six cabins, and the boat the family still sails on.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-8xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-xl">
          <p className="font-mark text-eyebrow uppercase text-flame">Side by side</p>
          <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">
            The numbers, without the adjectives
          </h2>
        </div>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[46rem] border-collapse text-left">
            <caption className="sr-only">Specification comparison across both boats</caption>
            <thead>
              <tr>
                <th scope="col" className="w-40 border-b border-sand-300 pb-4 pr-4 font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">
                  Specification
                </th>
                {boats.map((b) => (
                  <th key={b.slug} scope="col" className="border-b border-sand-300 pb-4 pr-4 align-bottom">
                    <Link href={routes.boat(b.slug)} className="group block">
                      <span className="relative mb-3 block aspect-[3/2] w-full overflow-hidden rounded-xl bg-ink">
                        <PhotoSlot
                          ph={b.ph}
                          src={photoPath.boat(b.slug)}
                          alt={b.name}
                          sizes={PHOTO_SIZES.boatCard}
                          className="transition-transform duration-700 group-hover:scale-105"
                        />
                      </span>
                      <span className="block font-display text-lg text-ink-700 transition-colors group-hover:text-flame-600">{b.name}</span>
                      <span className="block font-mark text-[10px] uppercase tracking-[0.14em] text-mist-700">{b.type}</span>
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SPEC_ROWS.map((row) => (
                <tr key={row.label} className="border-b border-sand-200 align-top">
                  <th scope="row" className="py-4 pr-4 font-mark text-[11px] font-normal uppercase tracking-[0.12em] text-ink-700">
                    {row.label}
                  </th>
                  {boats.map((b) => (
                    <td key={b.slug} className="py-4 pr-4 text-sm text-ink/80">
                      {row.render(b)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-ink/50">
          &ldquo;From&rdquo; is the lowest cabin grade on that boat, per person, for a typical week.
          Actual fares vary by route and season — every departure shows its own price.
        </p>
      </section>

      <section className="mx-auto max-w-8xl px-5 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="grid gap-8 rounded-4xl bg-ink p-8 text-white lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-16 lg:p-14">
          <div>
            <span className="wave-rule wave-rule-light block" aria-hidden="true" />
            <h2 className="mt-5 font-display text-3xl font-light leading-tight tracking-tight sm:text-4xl">
              Either boat, entirely to yourselves
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-white/75">
              Charter is priced per boat per night, on any dates the boat is free, with a route we draw
              together rather than hand you. Four questions to start, and a real quote from Ratih
              within one working day.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <Link
              href={routes.charter()}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-flame px-7 font-mark text-[13px] uppercase tracking-[0.16em] text-white transition hover:bg-flame-600"
            >
              How charter works
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href={routes.departures()}
              className="inline-flex h-14 items-center justify-center rounded-full border border-white/30 px-7 font-mark text-[13px] uppercase tracking-[0.16em] text-white transition hover:bg-white hover:text-ink-700"
            >
              Or a single cabin
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
