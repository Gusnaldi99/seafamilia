import Link from "next/link";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { boats } from "@/lib/api/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Fleet — Sea Familia",
  description: "Four hand-built phinisi, crafted in Bira, South Sulawesi.",
};

export default function FleetPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink">
        <div className="ph ph-boat absolute inset-0 opacity-50" />
        <div className="scrim absolute inset-0" />
        <div className="relative mx-auto max-w-[88rem] px-5 pb-14 pt-32 sm:px-6 lg:px-8 lg:pb-20 lg:pt-40">
          <span className="wave-rule wave-rule-light block" />
          <p className="mt-5 font-mark text-[0.6875rem] uppercase leading-none tracking-[0.22em] text-white/75">
            The Fleet
          </p>
          <h1 className="mt-4 font-display text-4xl font-light leading-[1.04] tracking-tight text-white sm:text-5xl lg:text-7xl">
            Four boats,<br className="hidden sm:block" /> built in Bira
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85">
            Every hull came out of the same yard in South Sulawesi, from the same family of
            Konjo shipwrights. They differ in size and layout, not in how they were made.
          </p>
        </div>
      </section>

      <section className="bg-sand py-16 sm:py-24">
        <div className="mx-auto max-w-[88rem] px-5 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
            {boats.map((b) => (
              <Link
                key={b.slug}
                href={`/boats/${b.slug}`}
                className="group flex flex-col rounded-3xl border border-sand-300 bg-white transition hover:shadow-card"
              >
                <div className={`ph ph-${b.ph} relative aspect-[16/10] overflow-hidden rounded-t-3xl`}>
                  <div className="scrim absolute inset-0" />
                  <div className="absolute inset-x-5 bottom-4">
                    <h2 className="font-display text-3xl text-white">{b.name}</h2>
                    <p className="mt-1 font-mark text-[11px] uppercase tracking-[0.18em] text-white/70">
                      {b.type}
                    </p>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6 lg:p-8">
                  <div className="flex flex-wrap gap-x-6 gap-y-3 border-b border-sand-200 pb-5 font-mark text-[11px] uppercase tracking-[0.14em] text-ink-700">
                    <div>
                      <span className="text-mist-700">Length:</span> {b.length}
                    </div>
                    <div>
                      <span className="text-mist-700">Guests:</span> {b.guests}
                    </div>
                    <div>
                      <span className="text-mist-700">Cabins:</span> {b.cabins}
                    </div>
                  </div>
                  <p className="mt-5 text-base leading-relaxed text-ink/75">
                    {b.tagline}
                  </p>
                  <div className="mt-6 flex items-center gap-2 font-mark text-[11px] uppercase tracking-[0.14em] text-flame-600 transition-colors group-hover:text-flame">
                    View boat details →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="border-y border-sand-300 bg-sand">
        <div className="mx-auto max-w-[88rem] px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-xl">
            <p className="font-mark text-[11px] uppercase tracking-[0.2em] text-flame">Choosing between them</p>
            <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">
              Honestly, it depends on who is coming
            </h2>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            <div className="rounded-2xl bg-white p-6">
              <h3 className="font-mark text-[11px] uppercase tracking-[0.16em] text-flame">Diving-led weeks</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/75">
                <Link href="/boats/bintang-laut" className="font-display text-lg text-ink-700 hover:text-flame-600">Bintang Laut</Link>
                — narrow, fast, open dive deck, twelve guests. She can hold a seamount for two days waiting for the right water.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-6">
              <h3 className="font-mark text-[11px] uppercase tracking-[0.16em] text-flame">With children</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/75">
                <Link href="/boats/nusa-ombak" className="font-display text-lg text-ink-700 hover:text-flame-600">Nusa Ombak</Link>
                — interconnecting family suites, a plunge pool, and a crew who run reef school before breakfast.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-6">
              <h3 className="font-mark text-[11px] uppercase tracking-[0.16em] text-flame">Long crossings</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/75">
                <Link href="/boats/familia-satu" className="font-display text-lg text-ink-700 hover:text-flame-600">Familia Satu</Link>
                — provisioned for two weeks out, fourteen crew, and the boat the family still sails on.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-6">
              <h3 className="font-mark text-[11px] uppercase tracking-[0.16em] text-flame">Quiet, or private</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/75">
                <Link href="/boats/layar-kecil" className="font-display text-lg text-ink-700 hover:text-flame-600">Layar Kecil</Link>
                — eight guests, nine crew, and anchorages the larger boats cannot enter. Half her season is charter.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[88rem] px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-xl">
          <p className="font-mark text-[11px] uppercase tracking-[0.2em] text-flame">Side by side</p>
          <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">
            The numbers, without the adjectives
          </h2>
        </div>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[46rem] border-collapse text-left">
            <caption className="sr-only">Specification comparison across the four boats</caption>
            <thead>
              <tr>
                <th scope="col" className="w-40 border-b border-sand-300 pb-4 pr-4 font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">
                  Specification
                </th>
                {boats.map((b) => (
                  <th key={b.slug} scope="col" className="border-b border-sand-300 pb-4 pr-4 align-bottom">
                    <Link href={`/boats/${b.slug}`} className="group block">
                      <span className="relative mb-3 block aspect-[3/2] w-full overflow-hidden rounded-xl bg-ink">
                        <span className={`ph ph-${b.ph} absolute inset-0 block transition-transform duration-700 group-hover:scale-105`}>
                          <ImageSlot src={`/media/photos/boats/${b.slug}.jpg`} alt={b.name} />
                        </span>
                      </span>
                      <span className="block font-display text-lg text-ink-700 transition-colors group-hover:text-flame-600">{b.name}</span>
                      <span className="block font-mark text-[10px] uppercase tracking-[0.14em] text-mist-700">{b.type}</span>
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Length overall', key: 'length' },
                { label: 'Beam', key: 'beam' },
                { label: 'Rig', key: 'sails' },
                { label: 'Built / refit', key: 'builtRefit' },
                { label: 'Cabins', key: 'cabins' },
                { label: 'Guests', key: 'guests' },
                { label: 'Crew', key: 'crew' },
                { label: 'Tenders', key: 'tenders' },
                { label: 'Cruising speed', key: 'cruise' },
                { label: 'From, per person', key: 'from' }
              ].map((r) => (
                <tr key={r.label} className="border-b border-sand-200 align-top">
                  <th scope="row" className="py-4 pr-4 font-mark text-[11px] font-normal uppercase tracking-[0.12em] text-ink-700">{r.label}</th>
                  {boats.map((b) => {
                    const minPrice = Math.min(...b.cabinTypes.map(c => c.price));
                    return (
                      <td key={`${b.slug}-${r.label}`} className="py-4 pr-4 text-sm text-ink/80">
                        {r.key === 'builtRefit' ? (
                          <span>{b.built} · refit {b.refit}</span>
                        ) : r.key === 'from' ? (
                          <span className="tnum font-display text-base text-deep-700">
                            ${minPrice.toLocaleString('en-US')}
                          </span>
                        ) : (
                          <span>{String(b[r.key as keyof typeof b] ?? '')}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-ink/50">
          “From” is the lowest cabin grade on that boat, per person, for a typical week. Actual fares
          vary by route and season — every departure shows its own price.
        </p>
      </section>

      <section className="mx-auto max-w-[88rem] px-5 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="grid gap-8 rounded-[2rem] bg-ink p-8 text-white lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-16 lg:p-14">
          <div>
            <span className="wave-rule wave-rule-light block"></span>
            <h2 className="mt-5 font-display text-3xl font-light leading-tight tracking-tight sm:text-4xl">
              Any of the four, entirely to yourselves
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-white/75">
              Charter is priced per boat per day, on any dates the boat is free, with a route we draw
              together rather than hand you. Four questions to start, and a real quote from Ratih within
              one working day.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <Link href="/charter" className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-flame px-7 font-mark text-[13px] uppercase tracking-[0.16em] text-white transition hover:bg-flame-600">
              How charter works
              <span className="icon icon-chevron-right h-4 w-4" aria-hidden="true"></span>
            </Link>
            <Link href="/departures" className="inline-flex h-14 items-center justify-center rounded-full border border-white/30 px-7 font-mark text-[13px] uppercase tracking-[0.16em] text-white transition hover:bg-white hover:text-ink-700">
              Or a single cabin
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
