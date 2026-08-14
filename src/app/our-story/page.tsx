import { ImageSlot } from "@/components/ui/ImageSlot";
import Link from "next/link";
import type { Metadata } from "next";
import { team } from "@/lib/api/data";

export const metadata: Metadata = {
  title: "Our Story — Sea Familia",
  description: "Eleven years, four boats, and the eastern half of Indonesia.",
};

export default function OurStoryPage() {
  return (
    <>
      {/* ======================================================================
           HERO
           ==================================================================== */}
      <section className="relative isolate flex min-h-[70vh] items-end overflow-hidden bg-ink">
        <div className="ph ph-village absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <ImageSlot className="img-slot h-full w-full object-cover" src="/media/photos/our-story.jpg" alt="" loading="lazy" />
        </div>
        <div className="scrim absolute inset-0"></div>
        <div className="relative mx-auto w-full max-w-[88rem] px-5 pb-12 pt-28 sm:px-6 lg:px-8 lg:pb-16">
          <nav aria-label="Breadcrumb" className="font-mark text-[11px] uppercase tracking-[0.16em] text-white/60">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="px-2" aria-hidden="true">/</span>
            <span className="text-white">Our story</span>
          </nav>
          <div className="mt-8 max-w-2xl">
            <span className="wave-rule wave-rule-light block"></span>
            <p className="mt-5 font-mark text-[11px] uppercase tracking-[0.2em] text-white/70">Since 2015</p>
            <h1 className="mt-4 font-display text-4xl font-light leading-[1.04] tracking-tight text-white sm:text-5xl lg:text-6xl">
              One boat, one loan,<br className="hidden sm:block" /> and a very long list
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
              Sea Familia is a family company in the boring, literal sense: the founders are married,
              the cruise director is a cousin, and the shipwrights who built the boats built for our
              grandfather.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================================
           FOUNDING STORY
           ==================================================================== */}
      <section id="story" className="mx-auto max-w-[88rem] px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="font-mark text-[11px] uppercase tracking-[0.2em] text-flame">How it started</p>
            <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">
              Bira, 2014
            </h2>
            <div className="mt-8 hidden lg:block">
              <div className="relative aspect-[3/4] overflow-hidden bg-ink rounded-t-full rounded-b-3xl">
                <div className="ph ph-boat absolute inset-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <ImageSlot className="img-slot h-full w-full object-cover" src="/media/photos/our-story-founding.jpg" alt="Familia Satu on the beach at Bira before launch" loading="lazy" />
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-ink/55">
                Familia Satu on the beach at Bira, two months before launch. The keel is ironwood and
                still is.
              </p>
            </div>
          </div>

          <div className="prose max-w-prose prose-headings:font-display prose-headings:font-light prose-p:leading-relaxed text-ink-700">
            <p className="first-letter:float-left first-letter:mr-3 first-letter:text-7xl first-letter:font-display first-letter:text-ink-700 first-letter:leading-[0.8] mb-6">
              Bimo grew up in a boatyard that was, strictly speaking, a beach. In Bira the phinisi are
              built where the sand meets the treeline: no dry dock, no crane, just a hull growing under
              a tarpaulin while somebody’s uncle argues about the angle of a rib. His grandfather cut
              timber for those boats for forty years, and Bimo assumed he would end up doing something
              more sensible.
            </p>
            <p className="mb-6">
              He did, briefly — six years in a hotel group in Makassar, learning how tourism is normally
              organised. What he mostly learned was that the boats being chartered out of Labuan Bajo
              were beautiful and the arrangements around them were not. Crews were hired by the week.
              Nobody asked the cook what he could actually make. Guests were counted in units called
              “pax”.
            </p>
            <h2 className="text-2xl mt-12 mb-6">The unreasonable part</h2>
            <p className="mb-6">
              In 2014 he and Ratih borrowed more than either of them wants written down, and asked the
              yard for a thirty-two metre gaff-rigged ketch with eight cabins. The bank thought this was
              a poor idea. The yard, who had known the family for three generations, quietly extended
              the payment schedule and got on with it.
            </p>
            <blockquote className="border-l-2 border-mist-300 pl-6 my-8 italic text-lg text-ink/80">
              <p>
                We could not compete on price and we knew it. So we competed on the only thing nobody
                else was bothering with, which was how it felt to be on board.
              </p>
            </blockquote>
            <p className="mb-6">
              Familia Satu launched in 2016 with a crew of fourteen for sixteen guests — a ratio that
              made no commercial sense and which we have never changed. Nine of those fourteen are still
              with us. Two have since captained their own hulls.
            </p>
            <h2 className="text-2xl mt-12 mb-6">What actually grew</h2>
            <p className="mb-6">
              The second boat came in 2018 because divers kept asking for something faster. The third in
              2020, badly timed, and finished during a season when nobody sailed anywhere — we spent that
              year surveying reefs with a marine biologist and rebuilding the galley twice. The fourth in
              2021, deliberately small, because half our guests turned out to want the opposite of scale.
            </p>
            <p className="mb-6">
              Eleven years in, the company is four boats and fifty-one people. It is not large, it does
              not intend to be, and roughly a third of our guests each season were recommended by someone
              who sailed with us before.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================================
           VALUES
           ==================================================================== */}
      <section id="values" className="border-y border-sand-300 bg-sand">
        <div className="mx-auto max-w-[88rem] px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-xl">
            <p className="font-mark text-[11px] uppercase tracking-[0.2em] text-flame">What we hold to</p>
            <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl lg:text-5xl">
              Four things we will not trade
            </h2>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            <div>
              <span className="font-display text-3xl text-mist">01</span>
              <h3 className="mt-3 font-display text-xl text-ink-700">The crew ratio</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-ink/75">
                Nearly one crew member per guest, on every boat. It is the single largest line in our
                costs and the reason guests remember names.
              </p>
            </div>
            <div>
              <span className="font-display text-3xl text-mist">02</span>
              <h3 className="mt-3 font-display text-xl text-ink-700">Human language</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-ink/75">
                No “pax”, no “units”, no “F&amp;B”. You are guests, they are meals, and the boat is a
                she. It sounds small until you notice how much else follows from it.
              </p>
            </div>
            <div>
              <span className="font-display text-3xl text-mist">03</span>
              <h3 className="mt-3 font-display text-xl text-ink-700">The captain decides</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-ink/75">
                Not the itinerary PDF, not the office, not a guest who has read a forum. Weather and
                current win, every time, and we say so before you book.
              </p>
            </div>
            <div>
              <span className="font-display text-3xl text-mist">04</span>
              <h3 className="mt-3 font-display text-xl text-ink-700">Local first, always</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-ink/75">
                Every one of our fifty-one people is Indonesian, forty-three are from the islands we
                sail, and the boats were built by a family we have known for generations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================
           SUSTAINABILITY
           ==================================================================== */}
      <section id="sustainability" className="bg-ink text-white">
        <div className="mx-auto max-w-[88rem] px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
            <div>
              <span className="wave-rule wave-rule-light block"></span>
              <p className="mt-5 font-mark text-[11px] uppercase tracking-[0.2em] text-mist-300">Sustainability</p>
              <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                What we actually do, and what we do not
              </h2>
              <p className="mt-6 text-base leading-relaxed text-white/75">
                We are a company that burns diesel to take people to remote reefs. Calling that
                eco-tourism would be a lie, so here is the honest version: a list of specific things,
                some of which are inconvenient, and one thing we have not solved.
              </p>
            </div>

            <div className="space-y-8">
              <dl className="grid gap-8 sm:grid-cols-2">
                <div>
                  <dt className="font-display text-4xl font-light text-mist-300">37%</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-white/75">
                    of nautical miles last season made under sail rather than engine. We publish this
                    figure each year, and it went down in 2024 — the wind was poor and we did not
                    pretend otherwise.
                  </dd>
                </div>
                <div>
                  <dt className="font-display text-4xl font-light text-mist-300">Zero</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-white/75">
                    single-use plastic bottles on any boat since 2019. Filtered water, refillable steel
                    flasks, and a watermaker on all four hulls.
                  </dd>
                </div>
                <div>
                  <dt className="font-display text-4xl font-light text-mist-300">14</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-white/75">
                    reef-monitoring plots surveyed monthly by our own crew, with the data going to
                    Dr. Moerdani’s group at no charge to anyone.
                  </dd>
                </div>
                <div>
                  <dt className="font-display text-4xl font-light text-mist-300">4%</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-white/75">
                    of every fare goes to the village funds in the anchorages we use most — decided by
                    the villages, not by us, and audited annually.
                  </dd>
                </div>
              </dl>

              <div className="rounded-3xl bg-white/5 p-6 lg:p-7">
                <h3 className="font-mark text-[11px] uppercase tracking-[0.18em] text-mist-300">The part we have not solved</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/80">
                  Your flights. A return from Europe to Sorong emits several times more than your entire
                  two weeks on board, and no amount of solar panels on our sun deck changes that
                  arithmetic. We do not sell offsets, because we do not believe the ones available are
                  worth what they cost. What we do instead is encourage longer trips — if you are going
                  to make that flight, make it count for twelve nights rather than five.
                </p>
              </div>

              <div className="rounded-3xl bg-white/5 p-6 lg:p-7">
                <h3 className="font-mark text-[11px] uppercase tracking-[0.18em] text-mist-300">On the villages</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/80">
                  We visit eleven communities regularly and we arrive when they say to arrive. Nobody
                  performs a welcome. Nobody dances unless there is a reason to dance. Guests are asked
                  to put the camera down for the first hour, which almost everyone finds harder than the
                  diving.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================
           MEET THE FAMILIA
           ==================================================================== */}
      <section id="familia" className="mx-auto max-w-[88rem] px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="font-mark text-[11px] uppercase tracking-[0.2em] text-flame">Meet the familia</p>
            <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl lg:text-5xl">
              Fifty-one people, six of them here
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink/70">
              You will meet the rest on board, which is rather the point. These six are the ones you
              are most likely to correspond with first.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-12">
          {team.map((p) => (
            <figure key={p.name}>
              <div className="relative aspect-[3/4] overflow-hidden bg-ink rounded-t-full rounded-b-3xl">
                <div className={`ph ph-${p.ph} absolute inset-0`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <ImageSlot className="img-slot h-full w-full object-cover" src={`/media/photos/team/${p.slug}.jpg`} alt={p.name} loading="lazy" />
                </div>
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
              <h3 className="font-display text-2xl font-light text-ink-700 sm:text-3xl">
                We hire from the islands we sail
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/70">
                Deckhands, cooks, engineers, dive guides. No experience required for deck crew — we
                train, we pay through the off season, and we would rather teach someone from Komodo than
                import someone from Bali.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Link href="/contact?topic=crew" className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-4 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-ink-600">
                Ask about crewing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================
           CLOSING CTA
           ==================================================================== */}
      <section className="border-t border-sand-300 bg-white">
        <div className="mx-auto max-w-[88rem] px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-16">
            <div>
              <span className="wave-rule wave-rule-flame block"></span>
              <h2 className="mt-5 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">
                Come and see whether any of this is true
              </h2>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-ink/70">
                Everything on this page is easy to write and harder to do. The only test that matters is
                eight nights on a boat, so start there.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link href="/departures" className="inline-flex items-center justify-center gap-2 rounded-full bg-flame px-7 py-4 font-mark text-[13px] uppercase tracking-[0.16em] text-white transition hover:bg-flame-600">
                Find a departure
                <span className="icon icon-chevron-right h-4 w-4" aria-hidden="true"></span>
              </Link>
              <Link href="/journal" className="inline-flex items-center justify-center rounded-full border border-ink/20 px-7 py-4 font-mark text-[13px] uppercase tracking-[0.16em] text-ink-700 transition hover:border-ink hover:bg-ink hover:text-white">
                Read the journal
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
