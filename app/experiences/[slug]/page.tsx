import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DepartureCard } from '@/components/cards/departure-card';
import { TripCard } from '@/components/cards/trip-card';
import { WaterCard } from '@/components/cards/water-card';
import { PhotoSlot } from '@/components/media/photo-slot';
import { Check, ChevronRight, EXPERIENCE_ICONS } from '@/components/icons';
import { PHOTO_SIZES, photoPath } from '@/lib/photo-paths';
import { experienceBySlug, filterDepartures, filterTrips } from '@/lib/queries';
import { routes } from '@/lib/routes';
import { experiences, waters } from '@/lib/data';

export function generateStaticParams() {
  return experiences.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: PageProps<'/experiences/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const experience = experienceBySlug(slug);
  if (!experience) return {};
  return { title: experience.name, description: experience.blurb };
}

export default async function ExperienceDetailPage({ params }: PageProps<'/experiences/[slug]'>) {
  const { slug } = await params;
  const experience = experienceBySlug(slug);
  if (!experience) notFound();

  const trips = filterTrips({ experience: experience.slug });
  const deps = filterDepartures({ experience: experience.slug, available: true }).slice(0, 3);
  const relatedWaters = waters.filter((w) => w.bestFor.includes(experience.slug)).slice(0, 3);
  const others = experiences.filter((x) => x.slug !== experience.slug);
  const Icon = EXPERIENCE_ICONS[experience.slug as keyof typeof EXPERIENCE_ICONS];

  return (
    <>
      <section className="relative isolate flex min-h-[62vh] items-end overflow-hidden bg-ink">
        <PhotoSlot ph={experience.ph} src={photoPath.experience(experience.slug)} alt={experience.name} sizes={PHOTO_SIZES.hero} />
        <div className="scrim absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto w-full max-w-8xl px-5 pb-12 pt-28 sm:px-6 lg:px-8 lg:pb-16">
          <nav aria-label="Breadcrumb" className="font-mark text-[11px] uppercase tracking-[0.16em] text-white/60">
            <Link href={routes.home()} className="hover:text-white">
              Home
            </Link>
            <span className="px-2" aria-hidden="true">
              /
            </span>
            <Link href={routes.experiences()} className="hover:text-white">
              Experiences
            </Link>
            <span className="px-2" aria-hidden="true">
              /
            </span>
            <span className="text-white">{experience.name}</span>
          </nav>
          <div className="mt-8 max-w-2xl">
            {Icon ? <Icon className="h-11 w-11 text-white/85" aria-hidden="true" /> : null}
            <h1 className="mt-5 font-display text-4xl font-light leading-[1.06] tracking-tight text-white sm:text-5xl lg:text-6xl">
              {experience.name}
            </h1>
            <p className="mt-4 font-mark text-eyebrow uppercase text-white/70">{experience.tagline}</p>
          </div>
        </div>
      </section>

      <section className="border-b border-sand-300 bg-white">
        <div className="mx-auto max-w-8xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
            <p className="font-display text-xl font-light leading-relaxed text-ink-700 sm:text-2xl lg:text-[1.7rem]">{experience.blurb}</p>
            <div className="space-y-8">
              {experience.forWho?.length ? (
                <div>
                  <h2 className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">Who it suits</h2>
                  <ul className="mt-3 space-y-2">
                    {experience.forWho.map((w) => (
                      <li key={w} className="flex gap-2.5 text-sm leading-relaxed text-ink/80">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-mist" />
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {experience.signature?.length ? (
                <div>
                  <h2 className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">What makes it ours</h2>
                  <ul className="mt-3 space-y-2">
                    {experience.signature.map((s) => (
                      <li key={s} className="flex gap-2.5 text-sm leading-relaxed text-ink/80">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-mist" aria-hidden="true" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {relatedWaters.length > 0 ? (
        <section className="bg-sand">
          <div className="mx-auto max-w-8xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="max-w-xl">
              <p className="font-mark text-eyebrow uppercase text-flame">Where it works best</p>
              <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">
                The waters built for this
              </h2>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedWaters.map((w) => (
                <WaterCard key={w.slug} water={w} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="border-t border-sand-300 bg-white">
        <div className="mx-auto max-w-8xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <p className="font-mark text-eyebrow uppercase text-flame">Itineraries</p>
              <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">
                {trips.length} routes deliver this
              </h2>
            </div>
            <Link
              href={`${routes.experiences({ experience: experience.slug })}#matching`}
              className="group inline-flex items-center gap-2 font-mark text-[11px] uppercase tracking-[0.18em] text-ink-700 hover:text-flame-600"
            >
              Filter these further
              <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {trips.map((t) => (
              <TripCard key={t.slug} trip={t} />
            ))}
          </div>
        </div>
      </section>

      {deps.length > 0 ? (
        <section className="border-t border-sand-300 bg-sand">
          <div className="mx-auto max-w-8xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="max-w-xl">
              <p className="font-mark text-eyebrow uppercase text-flame">Sailing next</p>
              <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">
                Dates with cabins open
              </h2>
            </div>
            <div className="mt-8 space-y-3">
              {deps.map((d) => (
                <DepartureCard key={d.id} departure={d} />
              ))}
            </div>
            <Link
              href={routes.departures({ experience: experience.slug })}
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-full border border-ink/20 px-6 font-mark text-[12px] uppercase tracking-[0.14em] text-ink-700 transition hover:border-ink hover:bg-ink hover:text-white"
            >
              Search all departures
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-8xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
        <h2 className="font-display text-2xl font-light text-ink-700 sm:text-3xl">The other five</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
          {others.map((o) => {
            const OtherIcon = EXPERIENCE_ICONS[o.slug as keyof typeof EXPERIENCE_ICONS];
            return (
              <Link
                key={o.slug}
                href={routes.experience(o.slug)}
                className="group flex items-center gap-3 rounded-2xl border border-sand-300 p-4 transition hover:border-mist hover:bg-sand"
              >
                {OtherIcon ? <OtherIcon className="h-7 w-7 shrink-0 text-mist-700" aria-hidden="true" /> : null}
                <span className="font-display text-base leading-tight text-ink-700 transition-colors group-hover:text-flame-600">{o.name}</span>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
