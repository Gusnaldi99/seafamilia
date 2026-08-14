/**
 * Pricing math and reducer transitions for /reserve — flagged in the
 * migration plan as the highest-value place to catch a silent arithmetic
 * regression before it's wrapped in UI.
 */
import { describe, expect, it } from 'vitest';
import { cabinSubtotal, priceLinesFor, subtotalOf, totalGuestsOf, GUEST_BANDS, EXTRAS } from '../pricing';
import { reserveReducer, INITIAL_STATE, occupancyOk, type ReserveState } from '../state';
import type { DerivedCabin } from '@/lib/queries';

const CABIN: DerivedCabin = {
  code: 'DBL',
  name: 'Double Cabin',
  deck: 'Main deck',
  beds: '1 double',
  occupancy: 2,
  maxOccupancy: 4,
  price: 1000,
  left: 3,
  ph: 'cabin',
  features: [],
};

describe('totalGuestsOf', () => {
  it('sums every band', () => {
    expect(totalGuestsOf({ adults: 2, teens: 1, children: 1 })).toBe(4);
  });
});

describe('cabinSubtotal', () => {
  it('applies each band rate against the cabin price, per guest', () => {
    // 2 adults @ 100% of 1000 + 1 teen @ 90% of 1000 (rounded) = 2000 + 900
    expect(cabinSubtotal(1000, { adults: 2, teens: 1, children: 0 })).toBe(2900);
  });

  it('rounds each band unit price independently before multiplying', () => {
    // 90% of 333 = 299.7 -> rounds to 300, then x1
    expect(cabinSubtotal(333, { adults: 0, teens: 1, children: 0 })).toBe(300);
  });
});

describe('priceLinesFor', () => {
  const money = (n: number) => `$${n}`;

  it('returns one line per non-zero guest band plus one per chosen extra', () => {
    const lines = priceLinesFor(CABIN, { adults: 2, teens: 0, children: 1 }, ['guide'], money);
    expect(lines.map((l) => l.label)).toEqual(['Adults × 2', 'Children × 1', 'Private dive guide']);
  });

  it('prices a per-group extra once regardless of guest count', () => {
    const lines = priceLinesFor(CABIN, { adults: 4, teens: 0, children: 0 }, ['guide'], money);
    const guide = lines.find((l) => l.label === 'Private dive guide');
    expect(guide?.amount).toBe(EXTRAS.find((e) => e.key === 'guide')!.price);
  });

  it('prices a per-person extra against total guests, not just the band it appears under', () => {
    const lines = priceLinesFor(CABIN, { adults: 2, teens: 1, children: 0 }, ['gear'], money);
    const gear = lines.find((l) => l.label === 'Full dive equipment rental');
    expect(gear?.amount).toBe(EXTRAS.find((e) => e.key === 'gear')!.price * 3);
  });

  it('returns nothing when no cabin is chosen', () => {
    expect(priceLinesFor(null, { adults: 2, teens: 0, children: 0 }, [], money)).toEqual([]);
  });
});

describe('subtotalOf', () => {
  it('sums every line amount', () => {
    expect(subtotalOf([{ label: 'a', detail: '', amount: 10 }, { label: 'b', detail: '', amount: 5 }])).toBe(15);
  });
});

function withCabin(patch: Partial<ReserveState> = {}): ReserveState {
  return { ...INITIAL_STATE, cabin: CABIN, cabins: [CABIN], ...patch };
}

describe('reserveReducer CHOOSE_CABIN', () => {
  it('silently trims children, then teens, then adults down to a floor of one, to fit the new grade', () => {
    const state = withCabin({ guests: { adults: 2, teens: 1, children: 2 }, cabins: [{ ...CABIN, maxOccupancy: 2 }] });
    const next = reserveReducer(state, { type: 'CHOOSE_CABIN', code: CABIN.code });
    expect(totalGuestsOf(next.guests)).toBe(2);
    expect(next.guests.adults).toBeGreaterThanOrEqual(1);
  });

  it('does nothing if the cabin has no stock left', () => {
    const state = withCabin({ cabins: [{ ...CABIN, left: 0 }] });
    const next = reserveReducer(state, { type: 'CHOOSE_CABIN', code: CABIN.code });
    expect(next).toBe(state);
  });
});

describe('reserveReducer BUMP_GUESTS', () => {
  it('refuses to increment past the cabin max occupancy', () => {
    const state = withCabin({ guests: { adults: 4, teens: 0, children: 0 }, cabin: { ...CABIN, maxOccupancy: 4 } });
    const next = reserveReducer(state, { type: 'BUMP_GUESTS', key: 'adults', delta: 1 });
    expect(next).toBe(state);
  });

  it('refuses to go below a band minimum', () => {
    const state = withCabin({ guests: { adults: 1, teens: 0, children: 0 } });
    const next = reserveReducer(state, { type: 'BUMP_GUESTS', key: 'adults', delta: -1 });
    expect(next).toBe(state);
  });

  it('keeps guestList in sync with the new counts', () => {
    const state = withCabin({ guests: { adults: 1, teens: 0, children: 0 } });
    const next = reserveReducer(state, { type: 'BUMP_GUESTS', key: 'adults', delta: 1 });
    expect(next.guestList).toHaveLength(2);
    expect(next.guestList.every((g) => g.band === 'Adult')).toBe(true);
  });
});

describe('reserveReducer APPLY_VOUCHER', () => {
  it('applies a known code at its published rate', () => {
    const state = { ...INITIAL_STATE, voucher: { code: 'familia10', applied: '', rate: 0, error: '' } };
    const next = reserveReducer(state, { type: 'APPLY_VOUCHER' });
    expect(next.voucher).toEqual({ code: 'familia10', applied: 'FAMILIA10', rate: 0.1, error: '' });
  });

  it('rejects an unknown code without touching the applied rate', () => {
    const state = { ...INITIAL_STATE, voucher: { code: 'NOPE', applied: '', rate: 0, error: '' } };
    const next = reserveReducer(state, { type: 'APPLY_VOUCHER' });
    expect(next.voucher.applied).toBe('');
    expect(next.voucher.error).not.toBe('');
  });
});

describe('occupancyOk', () => {
  it('is false with zero guests', () => {
    expect(occupancyOk(withCabin({ guests: { adults: 0, teens: 0, children: 0 } }))).toBe(false);
  });

  it('is true at exactly the cabin max', () => {
    expect(occupancyOk(withCabin({ guests: { adults: 4, teens: 0, children: 0 } }))).toBe(true);
  });

  it('is false one guest over the cabin max', () => {
    expect(occupancyOk(withCabin({ guests: { adults: 4, teens: 1, children: 0 } }))).toBe(false);
  });
});

describe('GUEST_BANDS rates', () => {
  it('are all 100% or less, adults at full rate', () => {
    const adults = GUEST_BANDS.find((b) => b.key === 'adults')!;
    expect(adults.rate).toBe(1);
    GUEST_BANDS.forEach((b) => expect(b.rate).toBeLessThanOrEqual(1));
  });
});
