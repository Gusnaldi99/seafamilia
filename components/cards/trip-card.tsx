/** Discovery card — trip/itinerary. Ported from data.js's `cards.trip()`.
 * Used on home, experiences, destinations, boat listings/details. */
import Link from 'next/link';
import { Money, Nights, T } from '@/components/providers/locale-provider';
import { PhotoSlot } from '@/components/media/photo-slot';
import { CardChip, MetaRow } from './shared';
import { boatBySlug, waterBySlug } from '@/lib/queries';
import { photoPath, PHOTO_SIZES } from '@/lib/photo-paths';
import { routes } from '@/lib/routes';
import type { Trip } from '@/lib/data/types';

export function TripCard({ trip, hideBoat }: { trip: Trip; hideBoat?: boolean }) {
  const water = waterBySlug(trip.water);
  const boat = boatBySlug(trip.boat);

  return (
    <Link href={routes.trip(trip.slug)} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink">
        <PhotoSlot
          ph={trip.ph}
          src={photoPath.trip(trip.slug)}
          alt={trip.title}
          sizes={PHOTO_SIZES.tripCard}
          className="transition-transform duration-700 ease-swell group-hover:scale-[1.04]"
        />
        <div className="scrim-soft absolute inset-0" aria-hidden="true" />
        {trip.editorPick ? (
          <div className="absolute left-3 top-3">
            <CardChip>Editor&rsquo;s pick</CardChip>
          </div>
        ) : null}
        <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2">
          <span className="inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-mark uppercase tracking-[0.14em] text-ink-700">
            {water?.short ?? '—'}
          </span>
          <span className="font-mark text-[11px] uppercase tracking-[0.14em] text-white/90">
            <Nights n={trip.nights} />
          </span>
        </div>
      </div>
      <div className="pt-4">
        <h3 className="font-display text-xl leading-snug text-ink-700 transition-colors group-hover:text-flame-600">
          {trip.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink/70">{trip.summary}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-mist-700">
          <MetaRow items={[boat?.name, hideBoat ? null : boat?.type]} />
        </div>
        <div className="mt-3 flex items-baseline gap-1.5 border-t border-sand-300 pt-3">
          <span className="font-mark text-[11px] uppercase tracking-[0.16em] text-mist-700">
            <T k="lbl.from" />
          </span>
          <span className="tnum font-display text-lg text-deep-700">
            <Money usd={trip.from} />
          </span>
          <span className="text-xs text-ink/50">
            <T k="lbl.pp" />
          </span>
        </div>
      </div>
    </Link>
  );
}
