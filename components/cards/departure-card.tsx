/** Commerce card — a dated departure with availability + price. Ported
 * from data.js's `cards.departure()`. */
import Link from 'next/link';
import { DateRangeLabel, Money, Nights, T } from '@/components/providers/locale-provider';
import { PhotoSlot } from '@/components/media/photo-slot';
import { MetaRow } from './shared';
import { DepartureAvailability, DepartureCta, DepartureDetailsLink } from './departure-parts';
import { BoatMast, MapPin } from '@/components/icons';
import { boatBySlug, gatewayParts, tripBySlug, waterBySlug } from '@/lib/queries';
import { photoPath, PHOTO_SIZES } from '@/lib/photo-paths';
import { cn } from '@/lib/utils';
import type { Departure } from '@/lib/data/types';

export function DepartureCard({ departure, hideCta }: { departure: Departure; hideCta?: boolean }) {
  const trip = tripBySlug(departure.trip);
  const boat = boatBySlug(departure.boat);
  const water = trip ? waterBySlug(trip.water) : undefined;
  const closed = departure.status === 'closed';
  const { boards, disembarks } = trip ? gatewayParts(trip) : { boards: null, disembarks: null };

  return (
    <article
      className={cn(
        'group relative flex flex-col gap-4 rounded-2xl border border-sand-300 bg-white p-4 transition hover:border-mist-300 hover:shadow-card sm:flex-row sm:items-center sm:gap-5 sm:p-5',
        closed && 'opacity-70'
      )}
    >
      <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl sm:h-24 sm:w-32">
        <PhotoSlot
          ph={trip?.ph ?? 'reef'}
          src={trip ? photoPath.trip(trip.slug) : ''}
          alt={trip?.title ?? ''}
          sizes={PHOTO_SIZES.departureThumb}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-flame px-2.5 py-1 text-[11px] font-mark font-medium uppercase tracking-[0.12em] text-white">
            <T k="lbl.sharing" />
          </span>
          <span className="font-mark text-[11px] uppercase tracking-[0.14em] text-mist-700">{departure.id}</span>
        </div>
        <h3 className="mt-2 font-display text-lg text-ink-700">
          {closed ? (
            trip?.title ?? '—'
          ) : (
            <Link href={`/departures/${departure.id}`} className="hover:text-flame-600">
              {trip?.title ?? '—'}
            </Link>
          )}
        </h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-ink/70">
          <BoatMast className="h-3.5 w-3.5 shrink-0 text-mist-700" aria-hidden="true" />
          {boat?.name ?? '—'}
        </p>
        {boards ? (
          <p className="mt-1 flex items-center gap-1.5 text-sm text-ink/70">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-mist-700" aria-hidden="true" />
            {disembarks && disembarks !== boards ? `Boards ${boards} · Disembarks ${disembarks}` : `Round trip from ${boards}`}
          </p>
        ) : null}
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink/70">
          <MetaRow
            items={[
              <DateRangeLabel key="range" iso={departure.start} nights={departure.nights} />,
              <Nights key="nights" n={departure.nights} />,
              water?.short,
            ]}
          />
        </div>
        <DepartureAvailability status={departure.status} cabinsLeft={departure.cabinsLeft} />
        {trip && !hideCta ? <DepartureDetailsLink tripSlug={trip.slug} /> : null}
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-sand-200 pt-4 sm:flex-col sm:items-end sm:border-0 sm:pt-0 sm:text-right">
        <div>
          <div className="font-mark text-[11px] uppercase tracking-[0.16em] text-mist-700">
            <T k="lbl.from" />
          </div>
          <span className="tnum font-display text-xl text-deep-700">
            <Money usd={departure.price} />
          </span>
          <div className="text-xs text-ink/70">
            <T k="lbl.pp" />
          </div>
        </div>
        {hideCta ? null : <DepartureCta status={departure.status} departureId={departure.id} />}
      </div>
    </article>
  );
}
