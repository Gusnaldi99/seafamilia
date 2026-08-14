'use client';

/** Ported from reserve.html's `summaryHTML()` — one panel, reused by both
 * the desktop sticky rail and the mobile bottom sheet (`bare` drops the
 * photo + "Your voyage" heading the sheet already shows in its own
 * header). */
import { PhotoPlate } from '@/components/media/photo-plate';
import type { PriceLine } from '@/features/reserve/pricing';
import type { Trip, Water, Boat } from '@/lib/data/types';
import type { DerivedCabin } from '@/lib/queries';

export function VoyageSummary({
  bare,
  trip,
  water,
  boat,
  cabin,
  dateRange,
  nights,
  totalGuests,
  guestsLabel,
  priceLines,
  discount,
  voucher,
  total,
  deposit,
  money,
  onGoto,
}: {
  bare?: boolean;
  trip: Trip;
  water: Water;
  boat: Boat;
  cabin: DerivedCabin | null;
  dateRange: string;
  nights: string;
  totalGuests: number;
  guestsLabel: string;
  priceLines: PriceLine[];
  discount: number;
  voucher: string;
  total: number;
  deposit: number;
  money: (n: number) => string;
  onGoto: (step: number) => void;
}) {
  return (
    <div>
      {!bare ? (
        <div className="relative h-28">
          <PhotoPlate ph={trip.ph} src={null} alt="" sizes="22rem" />
          <div className="scrim-soft absolute inset-0" />
          <div className="absolute inset-x-5 bottom-3">
            <p className="font-mark text-[10px] uppercase tracking-[0.16em] text-white/80">{water.short}</p>
            <p className="font-display text-lg leading-tight text-white">{trip.title}</p>
          </div>
        </div>
      ) : null}

      <div className="p-5">
        {!bare ? <h2 className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">Your voyage</h2> : null}
        <dl className="mt-3">
          <SummaryRow label="Dates" value={dateRange} />
          <SummaryRow label="Length" value={nights} />
          <SummaryRow label="Boat" value={boat.name} />
          <SummaryRow
            label="Cabin"
            value={
              cabin ? (
                <>
                  {cabin.name}
                  <span className="block text-xs text-ink/50">{cabin.beds}</span>
                </>
              ) : (
                <>
                  <span className="text-ink/45">Not chosen</span>{' '}
                  <button type="button" onClick={() => onGoto(3)} className="font-mark text-[10px] uppercase tracking-[0.14em] text-flame-600 underline underline-offset-4">
                    Choose
                  </button>
                </>
              )
            }
          />
          <SummaryRow
            label="Guests"
            value={
              totalGuests ? (
                <>
                  {guestsLabel}{' '}
                  <button type="button" onClick={() => onGoto(4)} className="font-mark text-[10px] uppercase tracking-[0.14em] text-flame-600 underline underline-offset-4">
                    Edit
                  </button>
                </>
              ) : (
                <span className="text-ink/45">—</span>
              )
            }
          />
        </dl>

        {cabin ? (
          <div className="mt-4 border-t border-sand-300 pt-4">
            <dl className="space-y-1.5">
              {priceLines.map((l) => (
                <div key={l.label} className="flex items-baseline justify-between gap-3">
                  <dt className="text-xs text-ink/60">{l.label}</dt>
                  <dd className="text-sm text-ink-700">{money(l.amount)}</dd>
                </div>
              ))}
              {discount > 0 ? (
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-xs text-flame-600">Voucher {voucher}</dt>
                  <dd className="text-sm text-flame-600">−{money(discount)}</dd>
                </div>
              ) : null}
            </dl>
            <div className="mt-3 flex items-baseline justify-between gap-3 border-t border-ink/15 pt-3">
              <span className="font-mark text-[10px] uppercase tracking-[0.14em] text-ink-700">Total</span>
              <span className="font-display text-xl text-ink-700">{money(total)}</span>
            </div>
            <div className="mt-1.5 flex items-baseline justify-between gap-3">
              <span className="text-xs text-ink/60">Deposit to reserve</span>
              <span className="text-sm text-deep-700">{money(deposit)}</span>
            </div>
            <p className="mt-3 rounded-xl bg-sand p-3 text-[11px] leading-relaxed text-ink/60">
              Nothing is charged here. Reserving holds the cabin for 72 hours while the office confirms it and sends the deposit link.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 border-b border-sand-200 py-2 last:border-0">
      <dt className="text-xs text-ink/55">{label}</dt>
      <dd className="text-right text-sm text-ink-700">{value}</dd>
    </div>
  );
}
