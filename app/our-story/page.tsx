import type { Metadata } from 'next';
import Link from 'next/link';
import { PhotoSlot } from '@/components/media/photo-slot';
import { ChevronRight } from '@/components/icons';
import { LITERAL_PHOTOS, PHOTO_SIZES, photoPath } from '@/lib/photo-paths';
import { routes } from '@/lib/routes';
import { team } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Our Story',
  description:
    'One boat, one loan, and a very long list — how Sea Familia started in Bira in 2014 and grew to four boats and fifty-one people.',
};

const VALUES = [
  {
    n: '01',
    title: 'The crew ratio',
    body: 'Nearly one crew member per guest, on every boat. It is the single largest line in our costs and the reason guests remember names.',
  },
  {
    n: '02',
    title: 'Human language',
    body: 'No “pax”, no “units”, no “F&B”. You are guests, they are meals, and the boat is a she. It sounds small until you notice how much else follows from it.',
  },
  {
    n: '03',
    title: 'The captain decides',
    body: 'Not the itinerary PDF, not the office, not a guest who has read a forum. Weather and current win, every time, and we say so before you book.',
  },
  {
    n: '04',
    title: 'Local first, always',
    body: 'Every one of our fifty-one people is Indonesian, forty-three are from the islands we sail, and the boats were built by a family we have known for generations.',
  },
];

const STATS = [
  {
    value: '37%',
    body: 'of nautical miles last season made under sail rather than engine. We publish this figure each year, and it went down in 2024 — the wind was poor and we did not pretend otherwise.',
  },
  {
    value: 'Zero',
    body: 'single-use plastic bottles on any boat since 2019. Filtered water, refillable steel flasks, and a watermaker on all four hulls.',
  },
  {
    value: '14',
    body: "reef-monitoring plots surveyed monthly by our own crew, with the data going to Dr. Moerdani's group at no charge to anyone.",
  },
  {
    value: '4%',
    body: 'of every fare goes to the village funds in the anchorages we use most — decided by the villages, not by us, and audited annually.',
  },
];

export default function OurStoryPage() {
  return (
    <>
      <section className="relative isolate flex min-h-[70vh] items-end overflow-hidden bg-ink">
        <PhotoSlot ph="village" src={LITERAL_PHOTOS.ourStory} alt="" sizes={PHOTO_SIZES.hero} />
        <div className="scrim absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto w-full max-w-8xl px-5 pb-12 pt-28 sm:px-6 lg:px-8 lg:pb-16">
          <nav aria-label="Breadcrumb" className="font-mark text-[11px] uppercase tracking-[0.16em] text-white/60">
            <Link href={routes.home()} className="hover:text-white">
              Home
            </Link>
            <span className="px-2" aria-hidden="true">
              /
            </span>
            <span className="text-white">Our story</span>
          </nav>
          <div className="mt-8 max-w-2xl">
            <span className="wave-rule wave-rule-light block" aria-hidden="true" />
            <p className="mt-5 font-mark text-eyebrow uppercase text-white/70">Since 2015</p>
            <h1 className="mt-4 font-display text-4xl font-light leading-[1.04] tracking-tight text-white sm:text-5xl lg:text-6xl">
              One boat, one loan,
              <br className="hidden sm:block" /> and a very long list
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
              Sea Familia is a family company in the boring, literal sense: the founders are
              married, the cruise director is a cousin, and the shipwrights who built the boats
              built for our grandfather.
            </p>
          </div>
        </div>
      </section>

      <section id="story" className="mx-auto max-w-8xl px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="font-mark text-eyebrow uppercase text-flame">How it started</p>
            <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">Bira, 2014</h2>
            <div className="mt-8 hidden lg:block">
              <div className="arch-soft relative aspect-[3/4] overflow-hidden bg-ink">
                <PhotoSlot ph="boat" src={LITERAL_PHOTOS.ourStoryFounding} alt="Familia Satu on the beach at Bira before launch" sizes={PHOTO_SIZES.portrait} />
              </div>
              <p className="mt-3 text-xs leading-relaxed text-ink/55">
                Familia Satu on the beach at Bira, two months before launch. The keel is ironwood and still is.
              </p>
            </div>
          </div>

          <div className="prose prose-familia max-w-prose prose-headings:font-display prose-headings:font-light prose-p:leading-relaxed">
            <p className="dropcap">
              Bimo grew up in a boatyard that was, strictly speaking, a beach. In Bira the phinisi
              are built where the sand meets the treeline: no dry dock, no crane, just a hull
              growing under a tarpaulin while somebody&rsquo;s uncle argues about the angle of a
              rib. His grandfather cut timber for those boats for forty years, and Bimo assumed he
              would end up doing something more sensible.
            </p>
            <p>
              He did, briefly — six years in a hotel group in Makassar, learning how tourism is
              normally organised. What he mostly learned was that the boats being chartered out of
              Labuan Bajo were beautiful and the arrangements around them were not. Crews were
              hired by the week. Nobody asked the cook what he could actually make. Guests were
              counted in units called &ldquo;pax&rdquo;.
            </p>
            <h2>The unreasonable part</h2>
            <p>
              In 2014 he and Ratih borrowed more than either of them wants written down, and asked
              the yard for a thirty-two metre gaff-rigged ketch with eight cabins. The bank thought
              this was a poor idea. The yard, who had known the family for three generations,
              quietly extended the payment schedule and got on with it.
            </p>
            <blockquote>
              <p>
                We could not compete on price and we knew it. So we competed on the only thing
                nobody else was bothering with, which was how it felt to be on board.
              </p>
            </blockquote>
            <p>
              Familia Satu launched in 2016 with a crew of fourteen for sixteen guests — a ratio
              that made no commercial sense and which we have never changed. Nine of those
              fourteen are still with us. Two have since captained their own hulls.
            </p>
            <h2>What actually grew</h2>
            <p>
              The second boat came in 2018 because divers kept asking for something faster. The
              third in 2020, badly timed, and finished during a season when nobody sailed anywhere
              — we spent that year surveying reefs with a marine biologist and rebuilding the
              galley twice. The fourth in 2021, deliberately small, because half our guests turned
              out to want the opposite of scale.
            </p>
            <p>
              Eleven years in, the company is four boats and fifty-one people. It is not large, it
              does not intend to be, and roughly a third of our guests each season were recommended
              by someone who sailed with us before.
            </p>
          </div>
        </div>
      </section>

      <section id="values" className="border-y border-sand-300 bg-sand">
        <div className="mx-auto max-w-8xl px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-xl">
            <p className="font-mark text-eyebrow uppercase text-flame">What we hold to</p>
            <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl lg:text-5xl">
              Four things we will not trade
            </h2>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {VALUES.map((v) => (
              <div key={v.n}>
                <span className="font-display text-3xl text-mist">{v.n}</span>
                <h3 className="mt-3 font-display text-xl text-ink-700">{v.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink/75">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="sustainability" className="bg-ink text-white">
        <div className="mx-auto max-w-8xl px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
            <div>
              <span className="wave-rule wave-rule-light block" aria-hidden="true" />
              <p className="mt-5 font-mark text-eyebrow uppercase text-mist-300">Sustainability</p>
              <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                What we actually do, and what we do not
              </h2>
              <p className="mt-6 text-base leading-relaxed text-white/75">
                We are a company that burns diesel to take people to remote reefs. Calling that
                eco-tourism would be a lie, so here is the honest version: a list of specific
                things, some of which are inconvenient, and one thing we have not solved.
              </p>
            </div>

            <div className="space-y-8">
              <dl className="grid gap-8 sm:grid-cols-2">
                {STATS.map((s) => (
                  <div key={s.value}>
                    <dt className="font-display text-4xl font-light text-mist-300">{s.value}</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-white/75">{s.body}</dd>
                  </div>
                ))}
              </dl>

              <div className="rounded-3xl bg-white/5 p-6 lg:p-7">
                <h3 className="font-mark text-[11px] uppercase tracking-[0.18em] text-mist-300">The part we have not solved</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/80">
                  Your flights. A return from Europe to Sorong emits several times more than your
                  entire two weeks on board, and no amount of solar panels on our sun deck changes
                  that arithmetic. We do not sell offsets, because we do not believe the ones
                  available are worth what they cost. What we do instead is encourage longer trips
                  — if you are going to make that flight, make it count for twelve nights rather
                  than five.
                </p>
              </div>

              <div className="rounded-3xl bg-white/5 p-6 lg:p-7">
                <h3 className="font-mark text-[11px] uppercase tracking-[0.18em] text-mist-300">On the villages</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/80">
                  We visit eleven communities regularly and we arrive when they say to arrive.
                  Nobody performs a welcome. Nobody dances unless there is a reason to dance.
                  Guests are asked to put the camera down for the first hour, which almost everyone
                  finds harder than the diving.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="familia" className="mx-auto max-w-8xl px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="font-mark text-eyebrow uppercase text-flame">Meet the familia</p>
            <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl lg:text-5xl">
              Fifty-one people, six of them here
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink/70">
              You will meet the rest on board, which is rather the point. These six are the ones
              you are most likely to correspond with first.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-12">
          {team.map((p) => (
            <figure key={p.slug}>
              <div className="arch-soft relative aspect-[3/4] overflow-hidden bg-ink">
                <PhotoSlot ph={p.ph} src={photoPath.team(p.slug)} alt={p.name} sizes={PHOTO_SIZES.portrait} />
              </div>
              <figcaption className="mt-4">
                <h3 className="font-display text-xl text-ink-700">{p.name}</h3>
                <p className="mt-0.5 font-mark text-[11px] uppercase tracking-[0.14em] text-flame">{p.role}</p>
                <p className="mt-0.5 text-xs text-mist-700">{p.home}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink/75">{p.note}</p>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-14 rounded-4xl border border-sand-300 bg-sand p-7 lg:p-10">
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-center">
            <div>
              <h3 className="font-display text-2xl font-light text-ink-700 sm:text-3xl">We hire from the islands we sail</h3>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/70">
                Deckhands, cooks, engineers, dive guides. No experience required for deck crew — we
                train, we pay through the off season, and we would rather teach someone from
                Komodo than import someone from Bali.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Link
                href={routes.contact({ topic: 'crew' })}
                className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-4 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-ink-600"
              >
                Ask about crewing
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-sand-300 bg-white">
        <div className="mx-auto max-w-8xl px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-16">
            <div>
              <span className="wave-rule wave-rule-flame block" aria-hidden="true" />
              <h2 className="mt-5 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">
                Come and see whether any of this is true
              </h2>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-ink/70">
                Everything on this page is easy to write and harder to do. The only test that
                matters is eight nights on a boat, so start there.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href={routes.departures()}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-flame px-7 py-4 font-mark text-[13px] uppercase tracking-[0.16em] text-white transition hover:bg-flame-600"
              >
                Find a departure
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href={routes.journal()}
                className="inline-flex items-center justify-center rounded-full border border-ink/20 px-7 py-4 font-mark text-[13px] uppercase tracking-[0.16em] text-ink-700 transition hover:border-ink hover:bg-ink hover:text-white"
              >
                Read the journal
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
