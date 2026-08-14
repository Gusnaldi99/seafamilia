/** Discovery card — experience tile, full-bleed with an icon overlay.
 * Ported from data.js's `cards.experience()`. */
import Link from 'next/link';
import { T } from '@/components/providers/locale-provider';
import { PhotoSlot } from '@/components/media/photo-slot';
import { ChevronRight, EXPERIENCE_ICONS } from '@/components/icons';
import { photoPath, PHOTO_SIZES } from '@/lib/photo-paths';
import { routes } from '@/lib/routes';
import type { Experience } from '@/lib/data/types';

export function ExperienceCard({ experience }: { experience: Experience }) {
  const Icon = EXPERIENCE_ICONS[experience.slug as keyof typeof EXPERIENCE_ICONS];

  return (
    <Link href={routes.experience(experience.slug)} className="group relative block overflow-hidden rounded-2xl bg-ink">
      <PhotoSlot
        ph={experience.ph}
        src={photoPath.experience(experience.slug)}
        alt={experience.name}
        sizes={PHOTO_SIZES.experienceCard}
        className="transition-transform duration-700 ease-swell group-hover:scale-[1.05]"
      />
      <div className="scrim absolute inset-0" aria-hidden="true" />
      <div className="relative flex aspect-[4/5] flex-col justify-end p-5 sm:aspect-[3/4] sm:p-6">
        {Icon ? <Icon className="mb-4 h-9 w-9 text-white/85" aria-hidden="true" /> : null}
        <h3 className="font-display text-2xl leading-tight text-white">{experience.name}</h3>
        <p className="mt-1.5 font-mark text-[11px] uppercase tracking-[0.16em] text-white/70">{experience.tagline}</p>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/85">{experience.blurb}</p>
        <span className="mt-4 inline-flex items-center gap-2 font-mark text-[11px] uppercase tracking-[0.18em] text-white">
          <T k="cta.explore" />
          <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
