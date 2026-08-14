/** Commerce card — a selectable cabin grade. Ported from data.js's
 * `cards.cabin()`. Purely presentational: selection (click/keyboard
 * handling, "selected" outline) is wired by whichever page uses this — the
 * original's own comment says the same. */
import { Money, T } from '@/components/providers/locale-provider';
import { PhotoSlot } from '@/components/media/photo-slot';
import { photoPath, PHOTO_SIZES } from '@/lib/photo-paths';
import { cn } from '@/lib/utils';
import type { CabinType } from '@/lib/data/types';

export function CabinCard({ cabin, boatSlug }: { cabin: CabinType; boatSlug?: string }) {
  const sold = cabin.left <= 0;

  return (
    <div
      className={cn(
        'relative flex gap-4 rounded-2xl border p-4 transition',
        sold ? 'border-sand-300 bg-sand/60 opacity-70' : 'border-sand-300 bg-white hover:border-mist-400'
      )}
    >
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-32">
        <PhotoSlot
          ph={cabin.ph}
          src={boatSlug ? photoPath.cabin(boatSlug, cabin.code) : ''}
          alt={cabin.name}
          sizes={PHOTO_SIZES.cabinThumb}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-lg text-ink-700">{cabin.name}</h3>
            <p className="mt-0.5 text-xs text-mist-700">
              {cabin.deck} · {cabin.beds} · sleeps {cabin.maxOccupancy}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <span className="tnum font-display text-lg text-deep-700">
              <Money usd={cabin.price} />
            </span>
            <div className="text-[11px] text-ink/50">
              <T k="lbl.pp" />
            </div>
          </div>
        </div>
        {cabin.features?.length ? (
          <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink/65">
            {cabin.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        ) : null}
        <p
          className={cn(
            'mt-2 font-mark text-[11px] uppercase tracking-[0.14em]',
            sold ? 'text-ink/40' : cabin.left <= 1 ? 'text-flame-600' : 'text-mist-700'
          )}
        >
          {sold ? 'Fully booked' : cabin.left === 1 ? 'Last cabin' : `${cabin.left} cabins left`}
        </p>
      </div>
    </div>
  );
}
