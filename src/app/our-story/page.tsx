import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story — Sea Familia",
  description: "Eleven years, four boats, and the eastern half of Indonesia.",
};

export default function OurStoryPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink">
        <div className="ph ph-village absolute inset-0 opacity-50" />
        <div className="scrim absolute inset-0" />
        <div className="relative mx-auto max-w-[88rem] px-5 pb-14 pt-32 sm:px-6 lg:px-8 lg:pb-20 lg:pt-40">
          <span className="wave-rule wave-rule-light block" />
          <p className="mt-5 font-mark text-[0.6875rem] uppercase leading-none tracking-[0.22em] text-white/75">
            The Familia
          </p>
          <h1 className="mt-4 font-display text-4xl font-light leading-[1.04] tracking-tight text-white sm:text-5xl lg:text-7xl">
            Eleven years,<br className="hidden sm:block" /> four boats
          </h1>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-[88rem] px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-10 text-lg leading-relaxed text-ink/75 sm:text-xl">
            <p className="dropcap">
              We started with one phinisi built in Bira and a loan nobody sensible would have given us. 
              The boats have multiplied. The crew list has barely changed. We are still an independent, 
              family-run operation that cares more about the reef than the thread count of the sheets.
            </p>
            
            <h2 className="font-display text-3xl text-ink-700">Built by hand</h2>
            <p>
              Every hull in our fleet came out of the same yard in South Sulawesi, from the same family of 
              Konjo shipwrights. They differ in size, not in how they were made. We believe in keeping the 
              traditional phinisi craft alive, which means building them out of ironwood and teak, sealing 
              them with oakum, and maintaining them constantly.
            </p>

            <h2 className="font-display text-3xl text-ink-700">The crew is the company</h2>
            <p>
              Most of our crew grew up on the reefs we sail. They aren&apos;t seasonal contractors; 
              they are permanent staff who stay with us year after year. When you sail with us, you are 
              sailing with people who know exactly where the current will push you and exactly which 
              anchorage will be empty.
            </p>

            <blockquote className="pull-quote my-16">
              &ldquo;We don&apos;t run a floating hotel. We run a boat. The distinction matters when the wind gets up.&rdquo;
            </blockquote>

            <h2 className="font-display text-3xl text-ink-700">A lighter footprint</h2>
            <p>
              We don&apos;t drop anchor on the coral. We don&apos;t dump blackwater in the lagoons. 
              We don&apos;t serve endangered pelagics for dinner. These sound like baseline requirements, 
              but in this part of the world, they are still choices you have to actively make and enforce.
            </p>
          </div>
        </div>
      </section>
      
      <section className="border-t border-sand-300 bg-sand">
        <div className="mx-auto max-w-[88rem] px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl text-ink-700 sm:text-4xl">Meet the fleet</h2>
            <p className="mt-4 text-base text-ink/70">
              Read about the boats we built, the cabins we offer, and how to reserve them.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link href="/boats" className="inline-flex h-12 items-center rounded-full bg-flame px-6 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-flame-600">
                Compare the boats
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
