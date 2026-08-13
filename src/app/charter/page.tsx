import Link from "next/link";
import { boats } from "@/lib/api/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Private Charter — Sea Familia",
  description: "Take the whole boat. Your dates, your group, and an itinerary we build together.",
};

export default function CharterPage() {
  return (
    <>
      <section className="bg-sand pb-16 pt-32 sm:pb-24 sm:pt-40">
        <div className="mx-auto max-w-[88rem] px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="wave-rule wave-rule-flame block" />
            <h1 className="mt-5 font-display text-4xl font-light leading-tight tracking-tight text-ink-700 sm:text-5xl lg:text-6xl">
              Take the whole boat
            </h1>
            <p className="mt-6 text-base leading-relaxed text-ink/70 sm:text-lg">
              Your dates, your group, and an itinerary we build together. Eight to twenty guests,
              and no strangers at dinner.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-[88rem] px-5 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_24rem] lg:gap-20">
            
            <div className="space-y-12">
              <div>
                <h2 className="font-display text-3xl text-ink-700">How it works</h2>
                <div className="mt-6 space-y-5 text-base leading-relaxed text-ink/75">
                  <p>
                    A private charter means the boat is entirely yours. We don&apos;t just sell you 
                    an empty boat; we work with you to design the trip. You tell us if you want to 
                    dive every morning, if you have children who need calm water to snorkel, or if 
                    you just want to read a book on a beach with nobody else on it.
                  </p>
                  <p>
                    We suggest the route, the anchorage, and the timing to avoid the crowds. You 
                    can change the plan over breakfast if you want to stay another day in the same bay.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="font-display text-3xl text-ink-700">The process</h2>
                <ol className="mt-8 space-y-8 border-l border-sand-300 pl-6 sm:pl-8">
                  <li className="relative">
                    <span className="absolute -left-[1.8125rem] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-sand text-[10px] font-bold text-mist-700 sm:-left-[2.3125rem]">
                      1
                    </span>
                    <h3 className="font-display text-lg text-ink-700">The brief</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/75">
                      Tell us rough dates, how many people, and what you want to get out of it. 
                      You&apos;ll get a reply from a human in Labuan Bajo within 24 hours.
                    </p>
                  </li>
                  <li className="relative">
                    <span className="absolute -left-[1.8125rem] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-sand text-[10px] font-bold text-mist-700 sm:-left-[2.3125rem]">
                      2
                    </span>
                    <h3 className="font-display text-lg text-ink-700">The proposal</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/75">
                      We check which boats are where. We send you a proposed route and a clear, 
                      all-in price per night. No hidden fees.
                    </p>
                  </li>
                  <li className="relative">
                    <span className="absolute -left-[1.8125rem] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-sand text-[10px] font-bold text-mist-700 sm:-left-[2.3125rem]">
                      3
                    </span>
                    <h3 className="font-display text-lg text-ink-700">Refinement</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/75">
                      We hop on a call or email back and forth until the itinerary matches exactly 
                      what your group needs.
                    </p>
                  </li>
                </ol>
              </div>
            </div>

            <div>
              <div className="sticky top-32 rounded-3xl border border-ink bg-ink p-6 text-white sm:p-8">
                <h3 className="font-display text-2xl">Start the conversation</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/75">
                  Send us an email or WhatsApp. Even if you only have a vague idea of the month, 
                  we can tell you what the weather and the reef will be doing.
                </p>
                <div className="mt-8 space-y-3">
                  <a href="mailto:hello@example.com" className="flex h-12 w-full items-center justify-center rounded-full bg-flame px-6 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-flame-600">
                    Email the office
                  </a>
                  <a href="https://wa.me/6281100000000" target="_blank" rel="noopener noreferrer" className="flex h-12 w-full items-center justify-center rounded-full border border-white/25 px-6 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-white/10">
                    WhatsApp us
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
      
      <section className="border-t border-sand-300 bg-sand py-16 sm:py-24">
        <div className="mx-auto max-w-[88rem] px-5 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl text-ink-700">Which boat?</h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink/70">
            It mostly comes down to how many cabins you need. All our boats are built by the same 
            shipwrights and run by the same familia.
          </p>
          
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {boats.map((b) => (
              <Link key={b.slug} href={`/boats/${b.slug}`} className="group block">
                <div className={`ph ph-${b.ph} relative aspect-[4/3] overflow-hidden rounded-2xl`}>
                  <div className="scrim absolute inset-0" />
                  <div className="absolute inset-x-4 bottom-4">
                    <h3 className="font-display text-xl text-white">{b.name}</h3>
                    <p className="mt-0.5 font-mark text-[11px] uppercase tracking-[0.14em] text-white/70">{b.type}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-mist-700">
                  <span>{b.guests} guests</span>
                  <span aria-hidden="true">·</span>
                  <span>{b.cabins} cabins</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
