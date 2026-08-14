import Link from "next/link";
import { boats } from "@/lib/api/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Travel agents & partners — Sea Familia",
  description: "Commission, allocation, booking process and media assets for travel agents, dive shops and tour operators working with Sea Familia.",
};

export default function PartnersPage() {
  return (
    <>
      <section className="border-b border-sand-300 bg-sand">
        <div className="mx-auto max-w-[88rem] px-5 pb-12 pt-8 sm:px-6 lg:px-8 lg:pb-16 lg:pt-12">
          <nav aria-label="Breadcrumb" className="font-mark text-[11px] uppercase tracking-[0.16em] text-mist-700">
            <Link href="/" className="hover:text-flame-600">Home</Link>
            <span className="px-2 text-mist-300" aria-hidden="true">/</span>
            <span className="text-ink-700">Travel agents</span>
          </nav>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-16">
            <div>
              <p className="font-mark text-eyebrow uppercase text-flame">Trade</p>
              <h1 className="mt-4 font-display text-4xl font-light leading-[1.06] tracking-tight text-ink-700 sm:text-5xl lg:text-6xl">
                For agents, dive shops<br className="hidden sm:block" /> and operators
              </h1>
            </div>
            <p className="text-base leading-relaxed text-ink/70">
              We work with about thirty partners worldwide and would rather have forty good ones than
              three hundred listings. Straightforward commission, real allocation, and a human who
              answers within a day.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[88rem] px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-16">
          <div>
            <h2 className="font-display text-3xl font-light tracking-tight text-ink-700">Commission and allocation</h2>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
                <caption className="sr-only">Commission tiers by annual cabin volume</caption>
                <thead>
                  <tr className="border-b border-sand-300">
                    <th scope="col" className="pb-3 pr-4 font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Tier</th>
                    <th scope="col" className="pb-3 pr-4 font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Cabins per year</th>
                    <th scope="col" className="pb-3 pr-4 font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Commission</th>
                    <th scope="col" className="pb-3 font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Allocation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-sand-200">
                    <th scope="row" className="py-3.5 pr-4 font-normal text-ink-700">Introducing</th>
                    <td className="py-3.5 pr-4 text-ink/75">1 – 5</td>
                    <td className="py-3.5 pr-4 font-display text-base text-deep-700">10%</td>
                    <td className="py-3.5 text-ink/65">On request, per booking</td>
                  </tr>
                  <tr className="border-b border-sand-200">
                    <th scope="row" className="py-3.5 pr-4 font-normal text-ink-700">Preferred</th>
                    <td className="py-3.5 pr-4 text-ink/75">6 – 20</td>
                    <td className="py-3.5 pr-4 font-display text-base text-deep-700">13%</td>
                    <td className="py-3.5 text-ink/65">Two cabins held to 90 days out</td>
                  </tr>
                  <tr className="border-b border-sand-200">
                    <th scope="row" className="py-3.5 pr-4 font-normal text-ink-700">Partner</th>
                    <td className="py-3.5 pr-4 text-ink/75">21+</td>
                    <td className="py-3.5 pr-4 font-display text-base text-deep-700">15%</td>
                    <td className="py-3.5 text-ink/65">Named departures, negotiated annually</td>
                  </tr>
                  <tr>
                    <th scope="row" className="py-3.5 pr-4 font-normal text-ink-700">Full charter</th>
                    <td className="py-3.5 pr-4 text-ink/75">Any</td>
                    <td className="py-3.5 pr-4 font-display text-base text-deep-700">12%</td>
                    <td className="py-3.5 text-ink/65">On the boat day rate</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-ink/55">
              Commission is on the cabin fare, not on park fees or third-party extras. Net rates available
              for operators who invoice their own clients — ask.
            </p>

            <h2 className="mt-14 font-display text-3xl font-light tracking-tight text-ink-700">How booking works</h2>
            <ol className="mt-6 space-y-6">
              <li className="grid gap-3 sm:grid-cols-[3rem_1fr] sm:gap-5">
                <span className="font-display text-2xl text-mist">01</span>
                <div>
                  <h3 className="font-display text-lg text-ink-700">Check live availability here</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink/70">
                    The <Link href="/departures" className="text-flame-600 underline underline-offset-4">departures page</Link> shows genuine remaining cabins — the same numbers the office sees. No separate agent feed to fall behind.
                  </p>
                </div>
              </li>
              <li className="grid gap-3 sm:grid-cols-[3rem_1fr] sm:gap-5">
                <span className="font-display text-2xl text-mist">02</span>
                <div>
                  <h3 className="font-display text-lg text-ink-700">Reserve with your agent code</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink/70">
                    Use the normal reservation flow and enter your code in the voucher field at review.
                    Commission is applied on our side; your client sees the gross fare.
                  </p>
                </div>
              </li>
              <li className="grid gap-3 sm:grid-cols-[3rem_1fr] sm:gap-5">
                <span className="font-display text-2xl text-mist">03</span>
                <div>
                  <h3 className="font-display text-lg text-ink-700">We invoice you, not the guest</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink/70">
                    Net of commission, in your choice of USD, EUR, AUD, SGD or IDR. Deposit at
                    confirmation, balance at 60 days, same as everyone.
                  </p>
                </div>
              </li>
              <li className="grid gap-3 sm:grid-cols-[3rem_1fr] sm:gap-5">
                <span className="font-display text-2xl text-mist">04</span>
                <div>
                  <h3 className="font-display text-lg text-ink-700">Your client hears from us anyway</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink/70">
                    Joining instructions, dietary and diving forms go direct, with you copied. It saves a
                    round trip and nobody has ever objected.
                  </p>
                </div>
              </li>
            </ol>

            <h2 className="mt-14 font-display text-3xl font-light tracking-tight text-ink-700">Media and copy</h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink/70">
              Photography, deck plans, boat specifications and itinerary copy, cleared for partner use.
              Request access and we send a link the same day — there is no portal to log into, because
              thirty partners do not need one.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-sand-300 p-5">
                <h3 className="font-display text-lg text-ink-700">Image library</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/70">
                  Around 400 selected frames per boat and region, print resolution, with crew credits
                  attached. Attribution required, no editing of people.
                </p>
              </div>
              <div className="rounded-2xl border border-sand-300 p-5">
                <h3 className="font-display text-lg text-ink-700">Deck plans &amp; specs</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/70">
                  Measured plans for all four hulls, cabin dimensions, bed configurations and safety
                  equipment lists, as PDF.
                </p>
              </div>
              <div className="rounded-2xl border border-sand-300 p-5">
                <h3 className="font-display text-lg text-ink-700">Itinerary copy</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/70">
                  Long and short versions of all twelve routes, in English and Bahasa Indonesia, free to
                  adapt for your own audience.
                </p>
              </div>
              <div className="rounded-2xl border border-sand-300 p-5">
                <h3 className="font-display text-lg text-ink-700">Brand marks</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/70">
                  The lockup in light and dark, with clear-space rules. Please do not stretch the arch —
                  it is a dome, and it shows.
                </p>
              </div>
            </div>

            <div className="mt-14 rounded-3xl bg-ink p-7 text-white lg:p-10">
              <h2 className="font-display text-2xl font-light sm:text-3xl">Familiarisation places</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80">
                We hold two cabins on selected shoulder-season departures for partner staff, at 40% of the
                published fare. You should sail on a boat before you sell it, and we would rather that
                were easy.
              </p>
              <Link href="/contact?topic=other" className="mt-6 inline-flex h-12 items-center rounded-full bg-flame px-6 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-flame-600">
                Ask about fam places
              </Link>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-3xl bg-sand p-6 lg:p-7">
              <h2 className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">Become a partner</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink/75">
                Tell us who your clients are and which regions you sell. We will come back with rates,
                an agent code and, if it fits, an allocation.
              </p>
              <Link href="/contact?topic=other" className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-full bg-flame font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-flame-600">
                Apply
              </Link>
              <a href="mailto:agents@seafamilia.com" className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-full border border-ink/20 font-mark text-[12px] uppercase tracking-[0.14em] text-ink-700 transition hover:border-ink">
                agents@seafamilia.com
              </a>
            </div>

            <div className="rounded-3xl border border-sand-300 p-6 lg:p-7">
              <h2 className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">Already working with us</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink/75">
                Sign in for your bookings, invoices and allocation. Same login as your client-facing
                account.
              </p>
              <p className="mt-4 text-xs leading-relaxed text-ink/55">
                Use the <strong className="text-ink-700">Sign in</strong> button in the header — a link goes
                to your registered address, no password to remember.
              </p>
            </div>

            <div className="rounded-3xl border border-sand-300 p-6 lg:p-7">
              <h2 className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">The fleet, at a glance</h2>
              <ul className="mt-4 space-y-3">
                {boats.map(b => (
                  <li key={b.slug} className="flex items-baseline justify-between gap-3 border-b border-sand-200 pb-2.5 last:border-0 last:pb-0">
                    <Link href={`/boats/${b.slug}`} className="text-sm text-ink-700 hover:text-flame-600">{b.name}</Link>
                    <span className="shrink-0 font-mark text-[10px] uppercase tracking-[0.12em] text-mist-700">
                      <span>{b.guests}</span> guests · <span>{b.cabins}</span> cabins
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
