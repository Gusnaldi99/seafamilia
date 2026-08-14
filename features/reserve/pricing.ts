/**
 * Pure pricing helpers for /reserve, ported from reserve.html's
 * `reserveFlow()` getters (`priceLines`, `cabinSubtotal`, `subtotal`,
 * `discount`, `total`, `deposit`). Kept dependency-free (no locale
 * formatting) so they stay trivially testable — callers format `amount`
 * for display.
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

export function totalGuestsOf(guests: GuestCounts): number {
  return guests.adults + guests.teens + guests.children;
}

export function cabinSubtotal(cabinPrice: number, guests: GuestCounts): number {
  return GUEST_BANDS.reduce((sum, b) => sum + Math.round(cabinPrice * b.rate) * guests[b.key], 0);
}

export interface PriceLine {
  label: string;
  detail: string;
  amount: number;
}

/** `money` formats a USD amount for the `detail` display string only —
 * `amount` itself stays numeric for further arithmetic and locale-aware
 * rendering by the caller. */
export function priceLinesFor(cabin: DerivedCabin | null, guests: GuestCounts, chosenExtras: string[], money: (n: number) => string): PriceLine[] {
  if (!cabin) return [];
  const lines: PriceLine[] = [];
  GUEST_BANDS.forEach((b) => {
    const n = guests[b.key];
    if (!n) return;
    const unit = Math.round(cabin.price * b.rate);
    lines.push({
      label: `${b.label} × ${n}`,
      detail: `${cabin.name} · ${money(unit)} each${b.rate < 1 ? ` (${Math.round(b.rate * 100)}%)` : ''}`,
      amount: unit * n,
    });
  });
  const total = totalGuestsOf(guests);
  chosenExtras.forEach((key) => {
    const x = EXTRAS.find((e) => e.key === key);
    if (!x) return;
    lines.push({
      label: x.label,
      detail: x.perPerson ? `${money(x.price)} × ${total}` : 'One charge for the group',
      amount: x.perPerson ? x.price * total : x.price,
    });
  });
  return lines;
}

export function subtotalOf(lines: PriceLine[]): number {
  return lines.reduce((s, l) => s + l.amount, 0);
}
