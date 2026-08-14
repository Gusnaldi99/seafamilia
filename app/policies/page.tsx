import type { Metadata } from 'next';
import Link from 'next/link';
import { PageBreadcrumb } from '@/components/chrome/page-breadcrumb';
import { routes } from '@/lib/routes';

export const metadata: Metadata = {
  title: 'Policies',
  description: 'Privacy, booking terms, cancellation, safety and accessibility — written to be read rather than to be defensible.',
};

const ON_THIS_PAGE = [
  { href: '#privacy', label: 'Privacy' },
  { href: '#terms', label: 'Booking terms' },
  { href: '#cancellation', label: 'Cancellation' },
  { href: '#safety', label: 'Safety' },
  { href: '#accessibility', label: 'Accessibility' },
];

export default function PoliciesPage() {
  return (
    <>
      <section className="border-b border-sand-300 bg-sand">
        <div className="mx-auto max-w-8xl px-5 pb-12 pt-8 sm:px-6 lg:px-8 lg:pb-16 lg:pt-12">
          <PageBreadcrumb label="Policies" />
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-16">
            <div>
              <p className="font-mark text-eyebrow uppercase text-flame">Policies</p>
              <h1 className="mt-4 font-display text-4xl font-light leading-[1.06] tracking-tight text-ink-700 sm:text-5xl lg:text-6xl">
                The small print,
                <br className="hidden sm:block" /> in ordinary words
              </h1>
            </div>
            <p className="text-base leading-relaxed text-ink/70">
              Written to be read rather than to be defensible. If anything here seems unfair, say
              so — two of these clauses exist because a guest argued with them and was right.
            </p>
          </div>
          <p className="mt-8 font-mark text-[11px] uppercase tracking-[0.14em] text-mist-700">Last updated 1 June 2026 · Version 4.2</p>
        </div>
      </section>

      <section className="mx-auto max-w-8xl px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[16rem_1fr] lg:gap-16">
          <nav aria-label="On this page" className="lg:sticky lg:top-28 lg:self-start">
            <p className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">On this page</p>
            <ul className="mt-4 space-y-1">
              {ON_THIS_PAGE.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="block rounded-lg px-3 py-2 font-mark text-[11px] uppercase tracking-[0.14em] text-ink-700 transition hover:bg-sand">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-8 rounded-2xl bg-sand p-5">
              <p className="text-sm leading-relaxed text-ink/75">Something unclear? Ask before you book, not after.</p>
              <Link href={routes.contact()} className="mt-4 inline-flex h-11 items-center rounded-full bg-ink px-5 font-mark text-[11px] uppercase tracking-[0.12em] text-white transition hover:bg-ink-600">
                Ask the office
              </Link>
            </div>
          </nav>

          <div className="min-w-0 max-w-prose">
            <section id="privacy">
              <h2 className="font-display text-3xl font-light tracking-tight text-ink-700">Privacy</h2>
              <div className="prose prose-familia mt-5 max-w-none prose-headings:font-display prose-headings:font-light">
                <p>
                  We hold the least we can get away with: your name, contact details, the details
                  you give us for the joining form (nationality, dietary needs, diving
                  qualification, insurance policy number) and a record of what you have booked.
                </p>
                <h3>Where it lives</h3>
                <p>
                  On our own server in Singapore, and in the office email accounts. Payment card
                  details never touch our systems — those go straight to our payment provider, and
                  we see only the last four digits and whether it worked.
                </p>
                <h3>Who else sees it</h3>
                <p>
                  The crew of your boat see your name, dietary needs, diving level and any medical
                  note you have given us, because that is the point of collecting them. Nobody
                  else. We do not sell lists, we have never run a retargeting pixel, and the only
                  third parties involved are our payment provider and the email service that sends
                  the familia letter.
                </p>
                <h3>How long</h3>
                <p>
                  Booking records for seven years, because Indonesian tax law says so. Enquiries
                  that came to nothing: deleted after eighteen months. Newsletter subscriptions:
                  until you unsubscribe, which is one click in every letter.
                </p>
                <h3>Your call</h3>
                <p>
                  Email <a href="mailto:hello@seafamilia.com">hello@seafamilia.com</a> and ask for
                  a copy of what we hold, a correction, or deletion. A person will do it by hand
                  within thirty days, and there is no form.
                </p>
              </div>
            </section>

            <section id="terms" className="mt-16">
              <h2 className="font-display text-3xl font-light tracking-tight text-ink-700">Booking terms</h2>
              <div className="prose prose-familia mt-5 max-w-none prose-headings:font-display prose-headings:font-light">
                <p>
                  A reservation is a request until we confirm it. Nothing is charged when you
                  reserve online: the cabin is held for 72 hours while the office checks
                  availability against the boat, then a payment link follows.
                </p>
                <h3>Deposit and balance</h3>
                <ul>
                  <li>25% of the cabin total confirms your place. 30% on the twelve-night Banda crossings.</li>
                  <li>The balance is due 60 days before you sail. We will remind you twice, not eleven times.</li>
                  <li>Booking inside 60 days means the full amount at once.</li>
                  <li>Private charter: 30% to hold the boat, balance at 60 days.</li>
                </ul>
                <h3>What the fare covers</h3>
                <p>
                  Everything listed on the itinerary page, including national park and marine
                  conservation fees, airport transfers on both travel days, all meals, and diving
                  where the route allows. Flights, insurance, alcohol, equipment rental and
                  gratuities are not included.
                </p>
                <h3>Currency</h3>
                <p>
                  Prices on this site convert from USD at a rate we refresh weekly. Your invoice is
                  issued in the currency you choose at checkout, and that is the rate you pay — it
                  does not move afterwards.
                </p>
                <h3>The itinerary is a plan</h3>
                <p>
                  The captain has final authority over route, anchorages and diving, and will
                  change them for weather, current, safety or a genuinely better opportunity. This
                  is not a disclaimer we hide; it is the entire reason the trips are any good. We
                  do not refund for weather-driven changes.
                </p>
                <h3>Insurance</h3>
                <p>
                  Compulsory, and it must cover emergency evacuation plus diving to the depth you
                  intend to dive. We are DAN-affiliated and will ask for your policy number with
                  the joining form. Guests without cover do not board — this has happened twice and
                  both times it was miserable for everyone.
                </p>
                <h3>Fitness and honesty</h3>
                <p>
                  Tell us about the knee, the asthma, the medication, the fact that you have not
                  swum since school. None of it will stop you sailing; all of it changes how we
                  plan your week. Withholding something medical is the one thing that genuinely
                  puts a crew in a difficult position.
                </p>
              </div>
            </section>

            <section id="cancellation" className="mt-16">
              <h2 className="font-display text-3xl font-light tracking-tight text-ink-700">Cancellation</h2>
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[30rem] border-collapse text-left text-sm">
                  <caption className="sr-only">Refund by notice period</caption>
                  <thead>
                    <tr className="border-b border-sand-300">
                      <th scope="col" className="pb-3 pr-4 font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">
                        If you cancel
                      </th>
                      <th scope="col" className="pb-3 pr-4 font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">
                        You get back
                      </th>
                      <th scope="col" className="pb-3 font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-sand-200">
                      <th scope="row" className="py-3 pr-4 font-normal text-ink-700">
                        More than 90 days out
                      </th>
                      <td className="py-3 pr-4 text-ink-700">Everything paid</td>
                      <td className="py-3 text-ink/65">Including the deposit, in full</td>
                    </tr>
                    <tr className="border-b border-sand-200">
                      <th scope="row" className="py-3 pr-4 font-normal text-ink-700">
                        60 – 90 days
                      </th>
                      <td className="py-3 pr-4 text-ink-700">50%</td>
                      <td className="py-3 text-ink/65">Or move once, free — see below</td>
                    </tr>
                    <tr className="border-b border-sand-200">
                      <th scope="row" className="py-3 pr-4 font-normal text-ink-700">
                        Inside 60 days
                      </th>
                      <td className="py-3 pr-4 text-ink-700">Nothing</td>
                      <td className="py-3 text-ink/65">The cabin is very unlikely to resell</td>
                    </tr>
                    <tr>
                      <th scope="row" className="py-3 pr-4 font-normal text-ink-700">
                        If we cancel
                      </th>
                      <td className="py-3 pr-4 text-ink-700">Everything, always</td>
                      <td className="py-3 text-ink/65">Plus help rearranging flights</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="prose prose-familia mt-6 max-w-none prose-headings:font-display prose-headings:font-light">
                <h3>The free move</h3>
                <p>
                  Once per booking, whatever the notice, we will move you to any other departure in
                  the same season at no charge — you pay only a fare difference if the new cabin
                  costs more. This covers the ordinary disasters: a visa, a funeral, a work crisis,
                  a child&rsquo;s exam results. Ask, and it is done. There is no form and nobody
                  will interrogate you.
                </p>
                <h3>Insurance, again</h3>
                <p>Inside 60 days, a decent travel policy is what gets your money back, not us. This is precisely why we insist on cover before you board.</p>
              </div>
            </section>

            <section id="safety" className="mt-16">
              <h2 className="font-display text-3xl font-light tracking-tight text-ink-700">Safety</h2>
              <div className="prose prose-familia mt-5 max-w-none prose-headings:font-display prose-headings:font-light">
                <p>
                  All four boats carry oxygen and a first-response kit on every deck, two or more
                  liferafts, an EPIRB, a satellite phone and a full complement of lifejackets
                  including child sizes. Crew are drilled monthly, not annually, and the drill log
                  is on the chart table if you would like to read it.
                </p>
                <h3>Diving</h3>
                <p>
                  Maximum depth 40 metres, no decompression diving, computers mandatory, and a
                  safety stop on every ascent. Guides carry surface marker buoys and a DSMB is
                  deployed on every drift. Nitrox is analysed in front of you and you sign for it
                  yourself. A guide will turn a dive around and we will back them every time.
                </p>
                <h3>Evacuation</h3>
                <p>
                  DAN-affiliated on all four boats. The nearest chambers are Bali, Makassar and
                  Manado, and on the remote crossings we are honest with you about the numbers:
                  from the middle of the Banda Sea, a serious incident is many hours from a
                  chamber. That is a real risk and we would rather you weighed it than discovered
                  it.
                </p>
                <h3>Children</h3>
                <p>
                  Welcome from four. Lifejackets in child sizes, a rule about the swim platform
                  that is enforced without negotiation, and a crew member assigned to the water
                  whenever children are in it.
                </p>
              </div>
            </section>

            <section id="accessibility" className="mt-16">
              <h2 className="font-display text-3xl font-light tracking-tight text-ink-700">Accessibility</h2>
              <div className="prose prose-familia mt-5 max-w-none prose-headings:font-display prose-headings:font-light">
                <p>
                  This website aims at WCAG 2.2 AA. Every interactive element is reachable and
                  operable by keyboard, focus is always visible, forms have real labels and errors,
                  motion respects your system&rsquo;s reduced-motion setting, and nothing depends
                  on colour alone.
                </p>
                <p>
                  The boats are a harder problem and we will not pretend otherwise. A traditional
                  phinisi has steep companionways, high sills and narrow doorways; none of the four
                  is wheelchair-accessible below deck. Guests with limited mobility have sailed
                  with us happily — Layar Kecil and Nusa Ombak are the most workable, with
                  main-deck cabins and a wide boarding platform. Talk to us first and we will tell
                  you honestly what is and is not possible on each hull.
                </p>
                <p>
                  Found something on this site that does not work with your assistive technology?{' '}
                  <a href="mailto:hello@seafamilia.com">Tell us</a> and it gets fixed, not triaged.
                </p>
              </div>
            </section>

            <div className="mt-16 rounded-3xl bg-sand p-6 lg:p-8">
              <h2 className="font-display text-2xl font-light text-ink-700">Company details</h2>
              <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-ink/60">Registered name</dt>
                  <dd className="text-ink-700">PT Keluarga Laut Nusantara</dd>
                </div>
                <div>
                  <dt className="text-ink/60">Trading as</dt>
                  <dd className="text-ink-700">Sea Familia</dd>
                </div>
                <div>
                  <dt className="text-ink/60">Registered office</dt>
                  <dd className="text-ink-700">Labuan Bajo, Nusa Tenggara Timur, Indonesia</dd>
                </div>
                <div>
                  <dt className="text-ink/60">Governing law</dt>
                  <dd className="text-ink-700">Republic of Indonesia</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
