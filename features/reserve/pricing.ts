/**
 * Pure pricing helpers for /reserve, ported from reserve.html's
 * `reserveFlow()` getters (`priceLines`, `cabinSubtotal`, `subtotal`,
 * `discount`, `total`, `deposit`). Kept dependency-free (no locale
 * formatting) so they stay trivially testable — callers format `amount`
 * for display.
 *
 * Since the multi-cabin revision a reservation holds several cabins, each
 * with its own party, so the fare lines fan out per cabin and the caller
 * sums them. Extras stay at reservation level: a per-group extra is one
 * charge however many cabins are booked, and a per-person extra multiplies
 * by the whole party across every cabin.
 */
import type { DerivedCabin } from '@/lib/queries';

export interface GuestCounts {
  adults: number;
  teens: number;
  children: number;
}

export interface GuestBand {
  key: keyof GuestCounts;
  label: string;
  one: string;
  note: string;
  min: number;
  rate: number;
}

export const GUEST_BANDS: GuestBand[] = [
  { key: 'adults', label: 'Adults', one: 'Adult', note: '16 and over', min: 1, rate: 1 },
  { key: 'teens', label: 'Teenagers', one: 'Teenager', note: '12 – 15', min: 0, rate: 0.9 },
  { key: 'children', label: 'Children', one: 'Child', note: '4 – 11', min: 0, rate: 0.75 },
];

export interface ExtraOption {
  key: string;
  label: string;
  note: string;
  price: number;
  perPerson: boolean;
}

export const EXTRAS: ExtraOption[] = [
  { key: 'gear', label: 'Full dive equipment rental', note: 'BCD, regulator, wetsuit, computer', price: 180, perPerson: true },
  { key: 'guide', label: 'Private dive guide', note: 'Just your group, every dive', price: 520, perPerson: false },
  { key: 'massage', label: 'Massage package, four sessions', note: 'With the crew therapists', price: 240, perPerson: true },
  { key: 'hotel', label: 'Night before, in the gateway port', note: 'Hotel and transfer, twin share', price: 160, perPerson: true },
];

export const VOUCHERS: Record<string, number> = { FAMILIA10: 0.1, RETURNING: 0.05, AGENT15: 0.15 };

export const EMPTY_GUESTS: GuestCounts = { adults: 0, teens: 0, children: 0 };

export function totalGuestsOf(guests: GuestCounts): number {
  return guests.adults + guests.teens + guests.children;
}

/** The whole party across every booked cabin. */
export function sumGuests(list: GuestCounts[]): GuestCounts {
  return list.reduce<GuestCounts>(
    (sum, g) => ({ adults: sum.adults + g.adults, teens: sum.teens + g.teens, children: sum.children + g.children }),
    EMPTY_GUESTS
  );
}

export function cabinSubtotal(cabinPrice: number, guests: GuestCounts): number {
  return GUEST_BANDS.reduce((sum, b) => sum + Math.round(cabinPrice * b.rate) * guests[b.key], 0);
}

/** One booked cabin: the grade with its per-date fare, plus who sleeps in it. */
export interface SelectedCabin {
  uid: number;
  cabin: DerivedCabin;
  guests: GuestCounts;
}

/** Fares only — what the voucher discounts. Extras are deliberately excluded. */
export function cabinsSubtotal(selected: SelectedCabin[]): number {
  return selected.reduce((sum, s) => sum + cabinSubtotal(s.cabin.price, s.guests), 0);
}

/**
 * Two cabins of the same grade would otherwise both read "Manta Cabin" with
 * no way to tell which party belongs to which — number them only when a
 * grade is booked more than once.
 */
export function cabinLabelsFor(selected: SelectedCabin[]): Record<number, string> {
  const totals = new Map<string, number>();
  selected.forEach((s) => totals.set(s.cabin.code, (totals.get(s.cabin.code) ?? 0) + 1));
  const seen = new Map<string, number>();
  const labels: Record<number, string> = {};
  selected.forEach((s) => {
    const n = (seen.get(s.cabin.code) ?? 0) + 1;
    seen.set(s.cabin.code, n);
    labels[s.uid] = (totals.get(s.cabin.code) ?? 0) > 1 ? `${s.cabin.name} ${n}` : s.cabin.name;
  });
  return labels;
}

export interface PriceLine {
  /** Stable React key — `label` alone collides across same-grade cabins. */
  key: string;
  /** Cabin this line belongs to, or '' for reservation-level extras. */
  group: string;
  label: string;
  detail: string;
  amount: number;
}

/** `money` formats a USD amount for the `detail` display string only —
 * `amount` itself stays numeric for further arithmetic and locale-aware
 * rendering by the caller. */
export function priceLinesFor(selected: SelectedCabin[], chosenExtras: string[], money: (n: number) => string): PriceLine[] {
  if (selected.length === 0) return [];
  const labels = cabinLabelsFor(selected);
  const lines: PriceLine[] = [];
  selected.forEach((s) => {
    GUEST_BANDS.forEach((b) => {
      const n = s.guests[b.key];
      if (!n) return;
      const unit = Math.round(s.cabin.price * b.rate);
      lines.push({
        key: `${s.uid}:${b.key}`,
        group: labels[s.uid],
        label: `${b.label} × ${n}`,
        detail: `${money(unit)} each${b.rate < 1 ? ` (${Math.round(b.rate * 100)}%)` : ''}`,
        amount: unit * n,
      });
    });
  });
  const party = totalGuestsOf(sumGuests(selected.map((s) => s.guests)));
  chosenExtras.forEach((key) => {
    const x = EXTRAS.find((e) => e.key === key);
    if (!x) return;
    lines.push({
      key: `extra:${x.key}`,
      group: '',
      label: x.label,
      detail: x.perPerson ? `${money(x.price)} × ${party}` : 'One charge for the group',
      amount: x.perPerson ? x.price * party : x.price,
    });
  });
  return lines;
}

export function subtotalOf(lines: PriceLine[]): number {
  return lines.reduce((s, l) => s + l.amount, 0);
}
