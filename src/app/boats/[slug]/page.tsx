import Link from "next/link";
import { notFound } from "next/navigation";
import { boats } from "@/lib/api/data";
import type { Metadata } from "next";

export function generateStaticParams() {
  return boats.map((b) => ({ slug: b.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const boat = boats.find((b) => b.slug === params.slug);
  if (!boat) return { title: "Not Found" };
  return {
    title: `${boat.name} — The Fleet — Sea Familia`,
    description: boat.tagline,
  };
}

export default function BoatDetailPage({ params }: { params: { slug: string } }) {
  const boat = boats.find((b) => b.slug === params.slug);
  if (!boat) notFound();

  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink">
        <div className={`ph ph-${boat.ph} absolute inset-0 opacity-60`} />
        <div className="scrim absolute inset-0" />
        <div className="relative mx-auto max-w-[88rem] px-5 pb-14 pt-32 sm:px-6 lg:px-8 lg:pb-20 lg:pt-40">
          <nav className="mb-6 flex items-center gap-2 font-mark text-[10px] uppercase tracking-[0.18em] text-white/55">
            <Link href="/boats" className="transition hover:text-white">The Fleet</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white/90">{boat.name}</span>
          </nav>
          
          <span className="wave-rule wave-rule-light block" />
          <p className="mt-5 font-mark text-[0.6875rem] uppercase leading-none tracking-[0.22em] text-white/75">
            {boat.type}
          </p>
          <h1 className="mt-4 font-display text-4xl font-light leading-[1.04] tracking-tight text-white sm:text-5xl lg:text-7xl">
            {boat.name}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85 sm:text-xl">
            {boat.tagline}
          </p>
          
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/15 pt-6 font-mark text-[11px] uppercase tracking-[0.14em] text-white/80">
            <div>
              <span className="text-white/40">Length</span>
              <div className="mt-1 text-white">{boat.length}</div>
            </div>
            <div>
              <span className="text-white/40">Guests</span>
              <div className="mt-1 text-white">{boat.guests}</div>
            </div>
            <div>
              <span className="text-white/40">Cabins</span>
              <div className="mt-1 text-white">{boat.cabins}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-[88rem] px-5 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
            
            <div className="space-y-12">
              <div>
                <h2 className="font-display text-3xl text-ink-700">About the boat</h2>
                <div className="mt-6 space-y-5 text-base leading-relaxed text-ink/75">
                  <p>
                    {boat.name} is a traditional Indonesian phinisi, hand-crafted by Konjo shipwrights 
                    in South Sulawesi using ironwood and teak. She is designed for the remote archipelago 
                    waters, blending heritage lines with modern safety and comfort.
                  </p>
                  <p>
                    She carries {boat.guests} guests in {boat.cabins} en-suite cabins, serviced by a dedicated 
                    crew. Whether you are joining an open trip or charting her privately, she offers an intimate 
                    and authentic way to experience eastern Indonesia.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-display text-2xl text-ink-700">Deck plan</h3>
                <div className="mt-6 aspect-[4/3] rounded-3xl bg-sand p-8 text-center flex items-center justify-center border border-sand-300">
                  <span className="font-mark text-xs uppercase tracking-[0.14em] text-mist-700">
                    Deck plan illustration
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="rounded-3xl border border-sand-300 bg-sand p-6 sm:p-8">
                <h3 className="font-display text-2xl text-ink-700">Technical specifications</h3>
                <ul className="mt-6 space-y-4 font-mark text-[11px] uppercase tracking-[0.14em] text-ink-700">
                  <li className="flex justify-between border-b border-sand-300 pb-3">
                    <span className="text-mist-700">Type</span>
                    <span>{boat.type}</span>
                  </li>
                  <li className="flex justify-between border-b border-sand-300 pb-3">
                    <span className="text-mist-700">Length</span>
                    <span>{boat.length}</span>
                  </li>
                  <li className="flex justify-between border-b border-sand-300 pb-3">
                    <span className="text-mist-700">Beam</span>
                    <span>Typically 6 - 8m</span>
                  </li>
                  <li className="flex justify-between border-b border-sand-300 pb-3">
                    <span className="text-mist-700">Cruising Speed</span>
                    <span>8 - 10 knots</span>
                  </li>
                  <li className="flex justify-between border-b border-sand-300 pb-3">
                    <span className="text-mist-700">Navigation</span>
                    <span>GPS, Radar, AIS, Depth Sounder</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-mist-700">Safety</span>
                    <span className="text-right">Liferafts, EPIRB, Sat Phone,<br/>O2 Kits, First Aid</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-3xl border border-ink bg-ink p-6 text-white sm:p-8">
                <h3 className="font-display text-2xl">Take the whole boat</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/75">
                  {boat.name} is available for private charter. Your dates, your group, and an itinerary 
                  we build together.
                </p>
                <Link href="/charter" className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-white px-6 font-mark text-[12px] uppercase tracking-[0.14em] text-ink-700 transition hover:bg-sand">
                  Request a charter
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
