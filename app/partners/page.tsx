import type { Metadata } from 'next';
import Link from 'next/link';
import { PageBreadcrumb } from '@/components/chrome/page-breadcrumb';
import { routes } from '@/lib/routes';
import { boats } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Travel Agents',
  description: 'For agents, dive shops and operators — straightforward commission, real allocation, and a human who answers within a day.',
};

const TIERS = [
  { tier: 'Introducing', cabins: '1 – 5', commission: '10%', allocation: 'On request, per booking' },
  { tier: 'Preferred', cabins: '6 – 20', commission: '13%', allocation: 'Two cabins held to 90 days out' },
  { tier: 'Partner', cabins: '21+', commission: '15%', allocation: 'Named departures, negotiated annually' },
  { tier: 'Full charter', cabins: 'Any', commission: '12%', allocation: 'On the boat day rate' },
];

const STEPS = [
  {
    n: '01',
    title: 'Check live availability here',
    body: (
      <>
        The <Link href={routes.departures()} className="text-flame-600 underline underline-offset-4">departures page</Link> shows genuine
        remaining cabins — the same numbers the office sees. No separate agent feed to fall behind.
      </>
    ),
  },
  {
    n: '02',
    title: 'Reserve with your agent code',
    body: 'Use the normal reservation flow and enter your code in the voucher field at review. Commission is applied on our side; your client sees the gross fare.',
  },
  {
    n: '03',
    title: 'We invoice you, not the guest',
    body: 'Net of commission, in your choice of USD, EUR, AUD, SGD or IDR. Deposit at confirmation, balance at 60 days, same as everyone.',
  },
  {
    n: '04',
    title: 'Your client hears from us anyway',
    body: 'Joining instructions, dietary and diving forms go direct, with you copied. It saves a round trip and nobody has ever objected.',
  },
];

const ASSETS = [
  {
    title: 'Image library',
    body: 'Around 400 selected frames per boat and region, print resolution, with crew credits attached. Attribution required, no editing of people.',
  },
  {
    title: 'Deck plans & specs',
    body: 'Measured plans for both hulls, cabin dimensions, bed configurations and safety equipment lists, as PDF.',
  },
  {
    title: 'Itinerary copy',
    body: 'Long and short versions of both routes, in English and Bahasa Indonesia, free to adapt for your own audience.',
  },
  {
    title: 'Brand marks',
    body: 'The lockup in light and dark, with clear-space rules. Please do not stretch the arch — it is a dome, and it shows.',
  },
];

export default function PartnersPage() {
  return (
    <>
      <section className="border-b border-sand-300 bg-sand">
        <div className="mx-auto max-w-8xl px-5 pb-12 pt-8 sm:px-6 lg:px-8 lg:pb-16 lg:pt-12">
          <PageBreadcrumb label="Travel agents" />
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-16">
            <div>
              <p className="font-mark text-eyebrow uppercase text-flame">Trade</p>
              <h1 className="mt-4 font-display text-4xl font-light leading-[1.06] tracking-tight text-ink-700 sm:text-5xl lg:text-6xl">
                For agents, dive shops
                <br className="hidden sm:block" /> and operators
              </h1>
            </div>
            <p className="text-base leading-relaxed text-ink/70">
              We work with about thirty partners worldwide and would rather have forty good ones
              than three hundred listings. Straightforward commission, real allocation, and a human
              who answers within a day.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-8xl px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-16">
          <div className="min-w-0">
            <h2 className="font-display text-3xl font-light tracking-tight text-ink-700">Commission and allocation</h2>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
                <caption className="sr-only">Commission tiers by annual cabin volume</caption>
                <thead>
                  <tr className="border-b border-sand-300">
                    <th scope="col" className="pb-3 pr-4 font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">
                      Tier
                    </th>
                    <th scope="col" className="pb-3 pr-4 font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">
                      Cabins per year
                    </th>
                    <th scope="col" className="pb-3 pr-4 font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">
                      Commission
                    </th>
                    <th scope="col" className="pb-3 font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">
                      Allocation
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {TIERS.map((t) => (
                    <tr key={t.tier} className="border-b border-sand-200 last:border-0">
                      <th scope="row" className="py-3.5 pr-4 font-normal text-ink-700">
                        {t.tier}
                      </th>
                      <td className="py-3.5 pr-4 text-ink/75">{t.cabins}</td>
                      <td className="py-3.5 pr-4 font-display text-base text-deep-700">{t.commission}</td>
                      <td className="py-3.5 text-ink/65">{t.allocation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-ink/55">
              Commission is on the cabin fare, not on park fees or third-party extras. Net rates
              available for operators who invoice their own clients — ask.
            </p>

            <h2 className="mt-14 font-display text-3xl font-light tracking-tight text-ink-700">How booking works</h2>
            <ol className="mt-6 space-y-6">
              {STEPS.map((s) => (
                <li key={s.n} className="grid gap-3 sm:grid-cols-[3rem_1fr] sm:gap-5">
                  <span className="font-display text-2xl text-mist">{s.n}</span>
                  <div>
                    <h3 className="font-display text-lg text-ink-700">{s.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink/70">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <h2 className="mt-14 font-display text-3xl font-light tracking-tight text-ink-700">Media and copy</h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink/70">
              Photography, deck plans, boat specifications and itinerary copy, cleared for partner
              use. Request access and we send a link the same day — there is no portal to log into,
              because thirty partners do not need one.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {ASSETS.map((a) => (
                <div key={a.title} className="rounded-2xl border border-sand-300 p-5">
                  <h3 className="font-display text-lg text-ink-700">{a.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink/70">{a.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-14 rounded-3xl bg-ink p-7 text-white lg:p-10">
              <h2 className="font-display text-2xl font-light sm:text-3xl">Familiarisation places</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80">
                We hold two cabins on selected shoulder-season departures for partner staff, at 40%
                of the published fare. You should sail on a boat before you sell it, and we would
                rather that were easy.
              </p>
              <Link
                href={routes.contact({ topic: 'other' })}
                className="mt-6 inline-flex h-12 items-center rounded-full bg-flame px-6 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-flame-600"
              >
                Ask about fam places
              </Link>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-3xl bg-sand p-6 lg:p-7">
              <h2 className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">Become a partner</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink/75">
                Tell us who your clients are and which regions you sell. We will come back with
                rates, an agent code and, if it fits, an allocation.
              </p>
              <Link
                href={routes.contact({ topic: 'other' })}
                className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-full bg-flame font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-flame-600"
              >
                Apply
              </Link>
              <a
                href="mailto:agents@seafamilia.com"
                className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-full border border-ink/20 font-mark text-[12px] uppercase tracking-[0.14em] text-ink-700 transition hover:border-ink"
              >
                agents@seafamilia.com
              </a>
            </div>

            <div className="rounded-3xl border border-sand-300 p-6 lg:p-7">
              <h2 className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">Already working with us</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink/75">Sign in for your bookings, invoices and allocation. Same login as your client-facing account.</p>
              <p className="mt-4 text-xs leading-relaxed text-ink/55">
                Use the <strong className="text-ink-700">Sign in</strong> button in the header — a link goes to your registered address, no
                password to remember.
              </p>
            </div>

            <div className="rounded-3xl border border-sand-300 p-6 lg:p-7">
              <h2 className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">The fleet, at a glance</h2>
              <ul className="mt-4 space-y-3">
                {boats.map((b) => (
                  <li key={b.slug} className="flex items-baseline justify-between gap-3 border-b border-sand-200 pb-2.5 last:border-0 last:pb-0">
                    <Link href={routes.boat(b.slug)} className="text-sm text-ink-700 hover:text-flame-600">
                      {b.name}
                    </Link>
                    <span className="shrink-0 font-mark text-[10px] uppercase tracking-[0.12em] text-mist-700">
                      {b.guests} guests · {b.cabins} cabins
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
