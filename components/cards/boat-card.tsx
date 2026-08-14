/** Discovery card — boat. Ported from data.js's `cards.boat()`. No
 * locale-dependent text at all (stat labels are English-only in the
 * original too), so this is a plain Server Component throughout. */
import Link from 'next/link';
import { PhotoSlot } from '@/components/media/photo-slot';
import { photoPath, PHOTO_SIZES } from '@/lib/photo-paths';
import { routes } from '@/lib/routes';
import type { Boat } from '@/lib/data/types';

const STATS: { label: string; value: (b: Boat) => string | number }[] = [
  { label: 'Length', value: (b) => b.length },
  { label: 'Guests', value: (b) => b.guests },
  { label: 'Cabins', value: (b) => b.cabins },
  { label: 'Crew', value: (b) => b.crew },
];

export function BoatCard({ boat }: { boat: Boat }) {
  return (
    <Link href={routes.boat(boat.slug)} className="group block">
      <div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-ink">
        <PhotoSlot
          ph={boat.ph}
          src={photoPath.boat(boat.slug)}
          alt={boat.name}
          sizes={PHOTO_SIZES.boatCard}
          className="transition-transform duration-700 ease-swell group-hover:scale-[1.04]"
        />
        <div className="scrim-soft absolute inset-0" aria-hidden="true" />
        <div className="absolute inset-x-4 bottom-4">
          <div className="font-mark text-[11px] uppercase tracking-[0.18em] text-white/80">{boat.type}</div>
          <div className="mt-1 font-display text-2xl text-white">{boat.name}</div>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-ink/75">{boat.tagline}</p>
      <dl className="mt-4 grid grid-cols-4 gap-2 border-t border-sand-300 pt-3 text-center">
        {STATS.map((s) => (
          <div key={s.label}>
            <dt className="font-mark text-[10px] uppercase tracking-[0.14em] text-mist-700">{s.label}</dt>
            <dd className="mt-0.5 font-display text-base text-ink-700">{s.value(boat)}</dd>
          </div>
        ))}
      </dl>
    </Link>
  );
}
