/** Discovery card — destination/water, framed in the logo's arch. Ported
 * from data.js's `cards.water()`. No locale-dependent text (English-only
 * in the original here too), so this stays a plain Server Component. */
import Link from 'next/link';
import { PhotoSlot } from '@/components/media/photo-slot';
import { tripsInWater } from '@/lib/queries';
import { photoPath, PHOTO_SIZES } from '@/lib/photo-paths';
import { routes } from '@/lib/routes';
import type { Water } from '@/lib/data/types';

export function WaterCard({ water }: { water: Water }) {
  const itineraryCount = tripsInWater(water.slug).length;

  return (
    <Link href={routes.destination(water.slug)} className="group block">
      <div className="arch-soft relative aspect-[3/4] overflow-hidden bg-ink">
        <PhotoSlot
          ph={water.ph}
          src={photoPath.water(water.slug)}
          alt={water.name}
          sizes={PHOTO_SIZES.waterCard}
          className="transition-transform duration-700 ease-swell group-hover:scale-[1.05]"
        />
        <div className="scrim absolute inset-0" aria-hidden="true" />
        <div className="absolute inset-x-4 bottom-4 text-center">
          <div className="font-mark text-[10px] uppercase tracking-[0.2em] text-white/75">{water.season}</div>
          <h3 className="mt-1.5 font-display text-2xl leading-tight text-white">{water.short}</h3>
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-white/80">{water.blurb}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-center gap-2 text-xs text-mist-700">
        <span className="whitespace-nowrap">{itineraryCount} itineraries</span>
        <span className="text-mist-300" aria-hidden="true">
          ·
        </span>
        <span className="whitespace-nowrap">From {water.gateway}</span>
      </div>
    </Link>
  );
}
