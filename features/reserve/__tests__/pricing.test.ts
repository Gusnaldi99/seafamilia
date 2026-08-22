/**
 * Pricing math and reducer transitions for /reserve — flagged in the
 * migration plan as the highest-value place to catch a silent arithmetic
 * regression before it's wrapped in UI. Extended for the multi-cabin
 * revision: fares fan out per cabin, extras stay at reservation level, and
 * occupancy is enforced per cabin rather than once for the whole party.
 */
import { describe, expect, it } from 'vitest';
import {
  cabinLabelsFor,
  cabinSubtotal,
  cabinsSubtotal,
  priceLinesFor,
  subtotalOf,
  sumGuests,
  totalGuestsOf,
  GUEST_BANDS,
  EXTRAS,
  type SelectedCabin,
} from '../pricing';
import {
  reserveReducer,
  computeInitialState,
  headroomFor,
  occupancyOk,
  INITIAL_STATE,
  PERSIST_VERSION,
  type ReserveState,
  type CabinSelection,
} from '../state';
import type { DerivedCabin } from '@/lib/queries';
import type { Departure } from '@/lib/data/types';

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

/** A second, cheaper grade so the per-cabin fan-out is observable. */
const BUNK: DerivedCabin = { ...CABIN, code: 'BNK', name: 'Bunk Cabin', price: 600, maxOccupancy: 2, left: 2 };

const DEP: Departure = {
  id: 'TEST-0001',
  trip: 'test-trip',
  boat: 'test-boat',
  start: '2026-09-05',
  nights: 2,
  cabinsLeft: 4,
  price: 950,
  status: 'open',
  deposit: 0.25,
};

function sel(uid: number, cabin: DerivedCabin, adults: number, teens = 0, children = 0): SelectedCabin {
  return { uid, cabin, guests: { adults, teens, children } };
}

/** State builder: inventory plus already-chosen cabins, by grade code. */
function withCabins(selections: CabinSelection[], patch: Partial<ReserveState> = {}): ReserveState {
  return { ...INITIAL_STATE, dep: DEP, cabins: [CABIN, BUNK], selections, uidSeq: selections.length + 1, ...patch };
}

function pick(uid: number, code: string, adults: number, teens = 0, children = 0): CabinSelection {
  return { uid, code, guests: { adults, teens, children } };
}

describe('totalGuestsOf / sumGuests', () => {
  it('counts every band', () => {
    expect(totalGuestsOf({ adults: 2, teens: 1, children: 3 })).toBe(6);
  });

  it('sums a party spread across cabins', () => {
    expect(sumGuests([{ adults: 2, teens: 1, children: 0 }, { adults: 1, teens: 0, children: 2 }])).toEqual({ adults: 3, teens: 1, children: 2 });
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

describe('cabinsSubtotal', () => {
  it('sums the fares of every cabin, each at its own grade price', () => {
    // 2 adults @ 1000 = 2000, plus 2 adults @ 600 = 1200
    expect(cabinsSubtotal([sel(1, CABIN, 2), sel(2, BUNK, 2)])).toBe(3200);
  });
});

describe('cabinLabelsFor', () => {
  it('leaves a single cabin of a grade unnumbered', () => {
    expect(cabinLabelsFor([sel(1, CABIN, 2), sel(2, BUNK, 2)])).toEqual({ 1: 'Double Cabin', 2: 'Bunk Cabin' });
  });

  it('numbers repeats of the same grade so the two parties can be told apart', () => {
    expect(cabinLabelsFor([sel(1, CABIN, 2), sel(2, CABIN, 1)])).toEqual({ 1: 'Double Cabin 1', 2: 'Double Cabin 2' });
  });
});

describe('priceLinesFor', () => {
  const money = (n: number) => `$${n}`;

  it('emits a line per band per cabin, grouped by cabin', () => {
    const lines = priceLinesFor([sel(1, CABIN, 2), sel(2, BUNK, 1, 1)], [], money);
    expect(lines.map((l) => [l.group, l.label, l.amount])).toEqual([
      ['Double Cabin', 'Adults × 2', 2000],
      ['Bunk Cabin', 'Adults × 1', 600],
      // 90% of 600 = 540
      ['Bunk Cabin', 'Teenagers × 1', 540],
    ]);
  });

  it('gives every line a unique key — two same-grade cabins would collide on label alone', () => {
    const lines = priceLinesFor([sel(1, CABIN, 2), sel(2, CABIN, 2)], ['gear'], money);
    expect(lines.map((l) => l.label)).toEqual(['Adults × 2', 'Adults × 2', 'Full dive equipment rental']);
    expect(new Set(lines.map((l) => l.key)).size).toBe(lines.length);
  });

  it('charges a per-group extra once however many cabins are booked', () => {
    const guide = EXTRAS.find((e) => e.key === 'guide')!;
    const lines = priceLinesFor([sel(1, CABIN, 2), sel(2, BUNK, 2)], ['guide'], money);
    const line = lines.find((l) => l.label === guide.label)!;
    expect(line.amount).toBe(guide.price);
    expect(line.group).toBe('');
  });

  it('multiplies a per-person extra by the whole party, across every cabin', () => {
    const gear = EXTRAS.find((e) => e.key === 'gear')!;
    // 2 in the double + 2 in the bunk = 4 heads
    const lines = priceLinesFor([sel(1, CABIN, 2), sel(2, BUNK, 2)], ['gear'], money);
    expect(lines.find((l) => l.label === gear.label)!.amount).toBe(gear.price * 4);
  });

  it('returns nothing when no cabin is chosen', () => {
    expect(priceLinesFor([], ['gear'], money)).toEqual([]);
  });
});

describe('subtotalOf', () => {
  it('adds every line', () => {
    expect(subtotalOf([{ key: 'a', group: '', label: 'a', detail: '', amount: 100 }, { key: 'b', group: '', label: 'b', detail: '', amount: 250 }])).toBe(350);
  });
});

describe('voucher discount', () => {
  it('discounts the summed cabin fares only, never the extras', () => {
    const selected = [sel(1, CABIN, 2), sel(2, BUNK, 2)];
    const lines = priceLinesFor(selected, ['guide'], (n) => `$${n}`);
    // fares 2000 + 1200 = 3200; the $520 guide is excluded from the 10%
    const discount = Math.round(cabinsSubtotal(selected) * 0.1);
    expect(discount).toBe(320);
    expect(subtotalOf(lines) - discount).toBe(3200 + 520 - 320);
  });
});

describe('reserveReducer ADD_CABIN', () => {
  it('adds a cabin at its standard occupancy', () => {
    const next = reserveReducer(withCabins([]), { type: 'ADD_CABIN', code: 'DBL' });
    expect(next.selections).toHaveLength(1);
    expect(next.selections[0]).toMatchObject({ code: 'DBL', guests: { adults: 2, teens: 0, children: 0 } });
  });

  it('allows a second cabin of the same grade, with its own uid', () => {
    const once = reserveReducer(withCabins([]), { type: 'ADD_CABIN', code: 'DBL' });
    const twice = reserveReducer(once, { type: 'ADD_CABIN', code: 'DBL' });
    expect(twice.selections).toHaveLength(2);
    expect(twice.selections[0].uid).not.toBe(twice.selections[1].uid);
  });

  it('refuses once the grade has no stock left', () => {
    // BNK has left: 2 — a third is not on offer
    const state = withCabins([pick(1, 'BNK', 2), pick(2, 'BNK', 2)]);
    expect(reserveReducer(state, { type: 'ADD_CABIN', code: 'BNK' })).toBe(state);
  });

  it('refuses once the departure itself is out of cabins, even if the grade is not', () => {
    // DEP.cabinsLeft is 4 and four are taken, though DBL still shows stock
    const state = withCabins([pick(1, 'DBL', 2), pick(2, 'DBL', 2), pick(3, 'DBL', 2), pick(4, 'BNK', 2)]);
    expect(headroomFor(state, 'DBL')).toBe(0);
    expect(reserveReducer(state, { type: 'ADD_CABIN', code: 'DBL' })).toBe(state);
  });

  it('does nothing for a grade this departure does not carry', () => {
    const state = withCabins([]);
    expect(reserveReducer(state, { type: 'ADD_CABIN', code: 'NOPE' })).toBe(state);
  });
});

describe('reserveReducer REMOVE_CABIN', () => {
  it('drops the most recently added cabin of that grade, leaving the rest alone', () => {
    const state = withCabins([pick(1, 'DBL', 2), pick(2, 'BNK', 1), pick(3, 'DBL', 3)]);
    const next = reserveReducer(state, { type: 'REMOVE_CABIN', code: 'DBL' });
    expect(next.selections.map((s) => s.uid)).toEqual([1, 2]);
  });

  it('does nothing when that grade is not booked', () => {
    const state = withCabins([pick(1, 'DBL', 2)]);
    expect(reserveReducer(state, { type: 'REMOVE_CABIN', code: 'BNK' })).toBe(state);
  });
});

describe('reserveReducer BUMP_GUESTS', () => {
  it('changes only the cabin it targets', () => {
    const state = withCabins([pick(1, 'DBL', 2), pick(2, 'DBL', 2)]);
    const next = reserveReducer(state, { type: 'BUMP_GUESTS', uid: 2, key: 'adults', delta: 1 });
    expect(next.selections[0].guests.adults).toBe(2);
    expect(next.selections[1].guests.adults).toBe(3);
  });

  it('refuses to exceed that cabin grade’s maxOccupancy', () => {
    // BNK sleeps 2
    const state = withCabins([pick(1, 'BNK', 2)]);
    expect(reserveReducer(state, { type: 'BUMP_GUESTS', uid: 1, key: 'teens', delta: 1 })).toBe(state);
  });

  it('refuses a multi-step delta that would vault past the cap', () => {
    // DBL sleeps 4, sitting at 2 — a jump of 3 lands on 5 and must be rejected
    const state = withCabins([pick(1, 'DBL', 2)]);
    expect(reserveReducer(state, { type: 'BUMP_GUESTS', uid: 1, key: 'adults', delta: 3 })).toBe(state);
  });

  it('honours each band’s own minimum', () => {
    const state = withCabins([pick(1, 'DBL', 1)]);
    expect(reserveReducer(state, { type: 'BUMP_GUESTS', uid: 1, key: 'adults', delta: -1 })).toBe(state);
  });

  it('ignores a uid that is not booked', () => {
    const state = withCabins([pick(1, 'DBL', 2)]);
    expect(reserveReducer(state, { type: 'BUMP_GUESTS', uid: 99, key: 'adults', delta: 1 })).toBe(state);
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
  it('is false with no cabin at all', () => {
    expect(occupancyOk(withCabins([]))).toBe(false);
  });

  it('is false when any one cabin is empty, even if the others are fine', () => {
    expect(occupancyOk(withCabins([pick(1, 'DBL', 2), pick(2, 'BNK', 0)]))).toBe(false);
  });

  it('is true when every cabin sits within its own grade’s limit', () => {
    // 4 fills the double exactly; 2 fills the bunk exactly
    expect(occupancyOk(withCabins([pick(1, 'DBL', 4), pick(2, 'BNK', 2)]))).toBe(true);
  });

  it('is false when one cabin is over its own limit, not the party total', () => {
    expect(occupancyOk(withCabins([pick(1, 'BNK', 3)]))).toBe(false);
  });
});

describe('computeInitialState', () => {
  it('discards a draft written before the multi-cabin revision', () => {
    // A v1 draft names a single `cabinCode` and a guestList this shape no
    // longer has — restoring it half-way would be worse than starting over.
    window.sessionStorage.setItem('sf.reserve', JSON.stringify({ depId: 'SFD-2609-SF1', cabinCode: 'MN', guests: { adults: 2, teens: 0, children: 0 }, guestList: [], lead: {} }));
    const state = computeInitialState(new URLSearchParams());
    expect(state.dep).toBeNull();
    expect(state.selections).toEqual([]);
    window.sessionStorage.clear();
  });

  it('restores a v2 draft, cabins and all', () => {
    window.sessionStorage.setItem(
      'sf.reserve',
      JSON.stringify({
        v: PERSIST_VERSION,
        depId: 'SFD-2610-SF1',
        selections: [{ code: 'MN', guests: { adults: 2, teens: 0, children: 0 } }, { code: 'MN', guests: { adults: 1, teens: 1, children: 0 } }],
        contact: { name: 'Ada', email: 'ada@example.com', phone: '+61400000000', notes: '' },
        chosenExtras: ['gear'],
      })
    );
    const state = computeInitialState(new URLSearchParams());
    expect(state.dep?.id).toBe('SFD-2610-SF1');
    expect(state.selections).toHaveLength(2);
    expect(state.contact.name).toBe('Ada');
    expect(state.chosenExtras).toEqual(['gear']);
    window.sessionStorage.clear();
  });

  it('keeps a restored multi-cabin draft when the URL names the same departure', () => {
    // ?dep= re-selects the departure, which clears the cabins — it must not
    // fire when the draft already holds that same departure's choices.
    window.sessionStorage.setItem(
      'sf.reserve',
      JSON.stringify({
        v: PERSIST_VERSION,
        depId: 'SFD-2610-SF1',
        selections: [{ code: 'MN', guests: { adults: 2, teens: 0, children: 0 } }, { code: 'MN', guests: { adults: 2, teens: 0, children: 0 } }],
        contact: { name: '', email: '', phone: '', notes: '' },
        chosenExtras: [],
      })
    );
    const state = computeInitialState(new URLSearchParams('dep=SFD-2610-SF1&step=4'));
    expect(state.selections).toHaveLength(2);
    window.sessionStorage.clear();
  });

  it('honours a ?cabin= deep link on a fresh visit', () => {
    const state = computeInitialState(new URLSearchParams('dep=SFD-2609-SF1&cabin=MN&step=3'));
    expect(state.selections).toHaveLength(1);
    expect(state.selections[0].code).toBe('MN');
    expect(state.step).toBe(3);
  });
});

describe('GUEST_BANDS rates', () => {
  it('are all 100% or less, adults at full rate', () => {
    const adults = GUEST_BANDS.find((b) => b.key === 'adults')!;
    expect(adults.rate).toBe(1);
    GUEST_BANDS.forEach((b) => expect(b.rate).toBeLessThanOrEqual(1));
  });
});
