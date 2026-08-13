import Link from "next/link";
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
    </>
  );
}
