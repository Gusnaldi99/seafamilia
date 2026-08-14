import { ImageSlot } from "@/components/ui/ImageSlot";
import Link from "next/link";
import { notFound } from "next/navigation";
import { experiences, waters, filterTrips, filterDepartures } from "@/lib/api/data";
import { TripCard, DepartureCard } from "@/components/ui/Cards";
import type { Metadata } from "next";

export function generateStaticParams() {
  return experiences.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const exp = experiences.find((e) => e.slug === resolvedParams.slug);
  if (!exp) return { title: "Not Found" };
  return {
    title: `${exp.name} — Sea Familia`,
    description: exp.tagline,
  };
}

export default async function ExperienceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const exp = experiences.find((e) => e.slug === resolvedParams.slug);
  if (!exp) notFound();

  const expTrips = filterTrips({ experience: exp.slug });
  const deps = filterDepartures({ experience: exp.slug, available: true }).slice(0, 3);
  const relatedWaters = waters.filter((w) => w.bestFor.includes(exp.slug)).slice(0, 3);
  const others = experiences.filter((x) => x.slug !== exp.slug);

  const WaterCard = ({ w }: { w: typeof waters[0] }) => {
    const t = filterTrips({ water: w.slug });
    return (
      <Link href={`/destinations/${w.slug}`} className="group block focus:outline-none focus:ring-2 focus:ring-mist focus:ring-offset-2">
        <div className="relative aspect-[3/4] overflow-hidden bg-ink arch-soft">
          <div className={`ph ph-${w.ph} absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.05]`}>
            <ImageSlot className="img-slot h-full w-full object-cover" src={`/media/photos/waters/${w.slug}.jpg`} alt={w.name} loading="lazy" />
          </div>
          <div className="scrim absolute inset-0"></div>
          <div className="absolute inset-x-4 bottom-4 text-center">
            <div className="font-mark text-[10px] uppercase tracking-[0.2em] text-white/75">{w.season}</div>
            <h3 className="mt-1.5 font-display text-2xl leading-tight text-white">{w.short}</h3>
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-white/80">{w.blurb}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-mist-700">
          <span className="whitespace-nowrap">{t.length} itineraries</span>
          <span className="text-mist-300" aria-hidden="true">·</span>
          <span className="whitespace-nowrap">From {w.gateway}</span>
        </div>
      </Link>
    );
  };

  return (
    <>
      <section className="relative isolate flex min-h-[62vh] items-end overflow-hidden bg-ink">
        <div className={`ph ph-${exp.ph} absolute inset-0`}>
          <ImageSlot className="img-slot h-full w-full object-cover" src={`/media/photos/experiences/${exp.slug}.jpg`} alt={exp.name} loading="lazy" />
        </div>
        <div className="scrim absolute inset-0"></div>
        <div className="relative mx-auto w-full max-w-[88rem] px-5 pb-12 pt-28 sm:px-6 lg:px-8 lg:pb-16">
          <nav aria-label="Breadcrumb" className="font-mark text-[11px] uppercase tracking-[0.16em] text-white/60">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="px-2" aria-hidden="true">/</span>
            <Link href="/experiences" className="hover:text-white">Experiences</Link>
            <span className="px-2" aria-hidden="true">/</span>
            <span className="text-white">{exp.name}</span>
          </nav>
          <div className="mt-8 max-w-2xl">
            <span className={`icon h-11 w-11 text-white/85 icon-exp-${exp.slug}`} aria-hidden="true"></span>
            <h1 className="mt-5 font-display text-4xl font-light leading-[1.06] tracking-tight text-white sm:text-5xl lg:text-6xl">
              {exp.name}
            </h1>
            <p className="mt-4 font-mark text-[11px] uppercase tracking-[0.18em] text-white/70">{exp.tagline}</p>
          </div>
        </div>
      </section>

      <section className="border-b border-sand-300 bg-white">
        <div className="mx-auto max-w-[88rem] px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
            <p className="font-display text-xl font-light leading-relaxed text-ink-700 sm:text-2xl lg:text-[1.7rem]">
              {exp.blurb}
            </p>

            <div className="space-y-8">
              <div>
                <h2 className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">Who it suits</h2>
                <ul className="mt-3 space-y-2">
                  {exp.forWho.map((w, i) => (
                    <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-ink/80">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-mist"></span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">What makes it ours</h2>
                <ul className="mt-3 space-y-2">
                  {exp.signature.map((s, i) => (
                    <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-ink/80">
                      <span className="icon icon-check mt-0.5 h-4 w-4 shrink-0 text-mist" aria-hidden="true"></span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {relatedWaters.length > 0 && (
        <section className="bg-sand">
          <div className="mx-auto max-w-[88rem] px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="max-w-xl">
              <p className="font-mark text-[11px] uppercase tracking-[0.2em] text-flame">Where it works best</p>
              <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">
                The waters built for this
              </h2>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedWaters.map(w => (
                <WaterCard key={w.slug} w={w} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-sand-300 bg-white">
        <div className="mx-auto max-w-[88rem] px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <p className="font-mark text-[11px] uppercase tracking-[0.2em] text-flame">Itineraries</p>
              <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">
                {expTrips.length} routes deliver this
              </h2>
            </div>
            <Link href={`/experiences?experience=${exp.slug}#matching`} className="group inline-flex items-center gap-2 font-mark text-[11px] uppercase tracking-[0.18em] text-ink-700 hover:text-flame-600">
              Filter these further
              <span className="icon icon-chevron-right h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true"></span>
            </Link>
          </div>

          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {expTrips.map(t => (
              <TripCard key={t.slug} trip={t} />
            ))}
          </div>
        </div>
      </section>

      {deps.length > 0 && (
        <section className="border-t border-sand-300 bg-sand">
          <div className="mx-auto max-w-[88rem] px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="max-w-xl">
              <p className="font-mark text-[11px] uppercase tracking-[0.2em] text-flame">Sailing next</p>
              <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">
                Dates with cabins open
              </h2>
            </div>
            <div className="mt-8 space-y-3">
              {deps.map(d => (
                <DepartureCard key={d.id} departure={d} />
              ))}
            </div>
            <Link href={`/departures?experience=${exp.slug}`} className="mt-8 inline-flex h-12 items-center gap-2 rounded-full border border-ink/20 px-6 font-mark text-[12px] uppercase tracking-[0.14em] text-ink-700 transition hover:border-ink hover:bg-ink hover:text-white">
              Search all departures
              <span className="icon icon-chevron-right h-4 w-4" aria-hidden="true"></span>
            </Link>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-[88rem] px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
        <h2 className="font-display text-2xl font-light text-ink-700 sm:text-3xl">The other five</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
          {others.map(o => (
            <Link key={o.slug} href={`/experience/${o.slug}`} className="group flex items-center gap-3 rounded-2xl border border-sand-300 p-4 transition hover:border-mist hover:bg-sand">
              <span className={`icon h-7 w-7 shrink-0 text-mist-700 icon-exp-${o.slug}`} aria-hidden="true"></span>
              <span className="font-display text-base leading-tight text-ink-700 transition-colors group-hover:text-flame-600">
                {o.name}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
