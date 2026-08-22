/**
 * Reducer-driven state for /reserve, ported from reserve.html's
 * `reserveFlow()`. A reducer (not one big react-hook-form, unlike
 * /charter) because the real logic here is business-transitions —
 * adding a cabin, moving guests between cabins, applying a voucher —
 * which map onto discrete actions far more directly than form-field
 * bindings do.
 *
 * Two revisions since the original port:
 *   1. A reservation now holds several cabins (`selections`), each with its
 *      own party, rather than exactly one grade with one party.
 *   2. Per-guest details (nationality, diving, dietary) are no longer
 *      collected here — they move to /joining-form, after payment. The
 *      funnel only takes contact details now.
 */
import { departureById, tripBySlug, boatBySlug, waterBySlug, deriveCabinInventory, type DerivedCabin } from '@/lib/queries';
import { addDays } from '@/lib/format';
import { EMAIL_RE } from '@/lib/validation';
import { GUEST_BANDS, VOUCHERS, totalGuestsOf, sumGuests, type GuestCounts, type SelectedCabin } from './pricing';
import type { Departure, Trip, Boat, Water } from '@/lib/data/types';

export type DivingLevel = 'none' | 'learning' | 'open-water' | 'advanced' | 'rescue' | 'pro';

/** Per-guest joining-form record. Collected at /joining-form after the
 * deposit is paid, no longer part of the reservation funnel's state. */
export interface Guest {
  name: string;
  nationality: string;
  diving: DivingLevel;
  certNumber: string;
  dives: number;
  dietary: string;
}

export const EMPTY_GUEST: Guest = { name: '', nationality: '', diving: 'none', certNumber: '', dives: 0, dietary: '' };

/** Everything the office needs to reach the booker before payment. The
 * lead guest's name used to live in `guestList[0].name`; it belongs here
 * now that the guest list itself has moved past the payment step. */
export interface Contact {
  name: string;
  email: string;
  phone: string;
  notes: string;
}

/** One physical cabin. Two units of the same grade are two entries, so the
 * grade code is no longer unique — `uid` is the identity. */
export interface CabinSelection {
  uid: number;
  code: string;
  guests: GuestCounts;
}

export interface VoucherState {
  code: string;
  applied: string;
  rate: number;
  error: string;
}

export interface Consent {
  terms: boolean;
  insurance: boolean;
  newsletter: boolean;
}

export interface SearchFilters {
  water: string;
  month: string;
  length: string;
}

export interface ReserveState {
  step: number;
  furthest: number;
  search: SearchFilters;
  results: Departure[];
  dep: Departure | null;
  trip: Trip | null;
  boat: Boat | null;
  water: Water | null;
  endDate: string | null;
  cabins: DerivedCabin[];
  selections: CabinSelection[];
  /** Monotonic source of `CabinSelection.uid`, kept in state so the reducer
   * stays pure and the tests stay deterministic. */
  uidSeq: number;
  chosenExtras: string[];
  contact: Contact;
  voucher: VoucherState;
  consent: Consent;
  errors: Record<string, string>;
  sheet: boolean;
}

export const INITIAL_STATE: ReserveState = {
  step: 1,
  furthest: 1,
  search: { water: '', month: '', length: '' },
  results: [],
  dep: null,
  trip: null,
  boat: null,
  water: null,
  endDate: null,
  cabins: [],
  selections: [],
  uidSeq: 1,
  chosenExtras: [],
  contact: { name: '', email: '', phone: '', notes: '' },
  voucher: { code: '', applied: '', rate: 0, error: '' },
  consent: { terms: false, insurance: false, newsletter: false },
  errors: {},
  sheet: false,
};

/** A new cabin opens at its standard occupancy rather than empty or full —
 * `occupancy` is exactly what that field means in the catalogue. */
function defaultGuestsFor(cabin: DerivedCabin): GuestCounts {
  return { adults: Math.max(1, Math.min(cabin.occupancy, cabin.maxOccupancy)), teens: 0, children: 0 };
}

export function gradeCountOf(selections: CabinSelection[], code: string): number {
  return selections.filter((s) => s.code === code).length;
}

/**
 * How many more cabins of this grade may be added. Capped both by the
 * grade's own derived stock and by the departure's total — deriveCabinInventory
 * guarantees the per-grade figures sum to `cabinsLeft`, but its last grade is
 * not capped by its own catalogue stock, and multi-cabin makes that reachable.
 */
export function headroomFor(state: ReserveState, code: string): number {
  const grade = state.cabins.find((c) => c.code === code);
  if (!grade) return 0;
  const perGrade = grade.left - gradeCountOf(state.selections, code);
  const overall = (state.dep?.cabinsLeft ?? 0) - state.selections.length;
  return Math.max(0, Math.min(perGrade, overall));
}

/** Resolves the selections against the derived inventory for pricing. */
export function selectedCabinsOf(state: ReserveState): SelectedCabin[] {
  return state.selections.flatMap((s) => {
    const cabin = state.cabins.find((c) => c.code === s.code);
    return cabin ? [{ uid: s.uid, cabin, guests: s.guests }] : [];
  });
}

/** The whole party, across every booked cabin. */
export function partyGuestsOf(state: ReserveState): GuestCounts {
  return sumGuests(state.selections.map((s) => s.guests));
}

export function maxOccupancyOf(state: ReserveState, code: string): number {
  return state.cabins.find((c) => c.code === code)?.maxOccupancy ?? 2;
}

function selectDeparture(state: ReserveState, depId: string, cabinCode?: string): ReserveState {
  const dep = departureById(depId);
  if (!dep) return state;
  const trip = tripBySlug(dep.trip);
  if (!trip) return state;
  const boat = boatBySlug(dep.boat);
  if (!boat) return state;
  const water = waterBySlug(trip.water) ?? null;
  const endDate = addDays(dep.start, dep.nights);
  const cabins = deriveCabinInventory(dep, boat);
  // A different departure has different inventory, so any existing choice
  // is meaningless — start clean, then honour a ?cabin= preselect.
  const wanted = cabinCode ? cabins.find((c) => c.code === cabinCode && c.left > 0) : undefined;
  const selections: CabinSelection[] =
    wanted && dep.cabinsLeft > 0 ? [{ uid: state.uidSeq, code: wanted.code, guests: defaultGuestsFor(wanted) }] : [];
  return { ...state, dep, trip, boat, water, endDate, cabins, selections, uidSeq: state.uidSeq + selections.length };
}

export type ReserveAction =
  | { type: 'SET_SEARCH'; search: Partial<SearchFilters> }
  | { type: 'SET_RESULTS'; results: Departure[] }
  | { type: 'SELECT_DEPARTURE'; depId: string; cabinCode?: string }
  | { type: 'ADD_CABIN'; code: string }
  | { type: 'REMOVE_CABIN'; code: string }
  | { type: 'BUMP_GUESTS'; uid: number; key: keyof GuestCounts; delta: number }
  | { type: 'TOGGLE_EXTRA'; key: string }
  | { type: 'SET_CONTACT_FIELD'; field: keyof Contact; value: string }
  | { type: 'SET_CONSENT'; field: keyof Consent; value: boolean }
  | { type: 'SET_VOUCHER_CODE'; code: string }
  | { type: 'APPLY_VOUCHER' }
  | { type: 'REMOVE_VOUCHER' }
  | { type: 'GOTO'; step: number }
  | { type: 'SET_ERRORS'; errors: Record<string, string> }
  | { type: 'SET_SHEET'; open: boolean };

export function reserveReducer(state: ReserveState, action: ReserveAction): ReserveState {
  switch (action.type) {
    case 'SET_SEARCH':
      return { ...state, search: { ...state.search, ...action.search } };
    case 'SET_RESULTS':
      return { ...state, results: action.results };
    case 'SELECT_DEPARTURE':
      return selectDeparture(state, action.depId, action.cabinCode);
    case 'ADD_CABIN': {
      const grade = state.cabins.find((c) => c.code === action.code);
      if (!grade || headroomFor(state, action.code) <= 0) return state;
      return {
        ...state,
        selections: [...state.selections, { uid: state.uidSeq, code: grade.code, guests: defaultGuestsFor(grade) }],
        uidSeq: state.uidSeq + 1,
      };
    }
    case 'REMOVE_CABIN': {
      // Drops the most recently added unit of that grade, party and all.
      const idx = state.selections.map((s) => s.code).lastIndexOf(action.code);
      if (idx === -1) return state;
      return { ...state, selections: state.selections.filter((_, i) => i !== idx) };
    }
    case 'BUMP_GUESTS': {
      const band = GUEST_BANDS.find((b) => b.key === action.key);
      if (!band) return state;
      const sel = state.selections.find((s) => s.uid === action.uid);
      if (!sel) return state;
      const next = sel.guests[action.key] + action.delta;
      if (next < band.min) return state;
      const guests = { ...sel.guests, [action.key]: next };
      // Guard the resulting total, not the pre-change one — a multi-step
      // delta from typed input would otherwise vault straight past the cap.
      if (totalGuestsOf(guests) > maxOccupancyOf(state, sel.code)) return state;
      return { ...state, selections: state.selections.map((s) => (s.uid === action.uid ? { ...s, guests } : s)) };
    }
    case 'TOGGLE_EXTRA': {
      const has = state.chosenExtras.includes(action.key);
      return { ...state, chosenExtras: has ? state.chosenExtras.filter((k) => k !== action.key) : [...state.chosenExtras, action.key] };
    }
    case 'SET_CONTACT_FIELD':
      return { ...state, contact: { ...state.contact, [action.field]: action.value } };
    case 'SET_CONSENT':
      return { ...state, consent: { ...state.consent, [action.field]: action.value } };
    case 'SET_VOUCHER_CODE':
      return { ...state, voucher: { ...state.voucher, code: action.code, error: '' } };
    case 'APPLY_VOUCHER': {
      const code = (state.voucher.code || '').trim().toUpperCase();
      if (!code) return { ...state, voucher: { ...state.voucher, error: 'Type the code first.' } };
      const rate = VOUCHERS[code];
      if (!rate) {
        return {
          ...state,
          voucher: { ...state.voucher, error: 'We do not recognise that code. Check it with whoever gave it to you — agent codes are case-insensitive but do expire.' },
        };
      }
      return { ...state, voucher: { code: state.voucher.code, applied: code, rate, error: '' } };
    }
    case 'REMOVE_VOUCHER':
      return { ...state, voucher: { code: '', applied: '', rate: 0, error: '' } };
    case 'GOTO': {
      const target = Math.max(1, Math.min(7, action.step));
      return { ...state, step: target, furthest: Math.max(state.furthest, target), sheet: false };
    }
    case 'SET_ERRORS':
      return { ...state, errors: action.errors };
    case 'SET_SHEET':
      return { ...state, sheet: action.open };
    default:
      return state;
  }
}

/** Every booked cabin has to hold at least one guest and no more than it sleeps. */
export function occupancyOk(state: ReserveState): boolean {
  if (state.selections.length === 0) return false;
  return state.selections.every((s) => {
    const total = totalGuestsOf(s.guests);
    return total >= 1 && total <= maxOccupancyOf(state, s.code);
  });
}

export function contactComplete(state: ReserveState): boolean {
  return !!(state.contact.name.trim() && state.contact.email.trim() && state.contact.phone.trim());
}

export function firstIncomplete(state: ReserveState): number {
  if (!state.dep) return 1;
  if (state.selections.length === 0) return 3;
  if (!occupancyOk(state)) return 4;
  if (!contactComplete(state)) return 5;
  return 6;
}

export function canContinue(state: ReserveState): boolean {
  if (state.step === 1) return !!state.dep;
  if (state.step === 2) return !!state.dep;
  if (state.step === 3) return state.selections.length > 0;
  if (state.step === 4) return occupancyOk(state);
  return true;
}

/** Ported from `validate()` — only steps 5 and 6 have real field validation;
 * steps 1-4 gate via canContinue()/occupancyOk() instead. */
export function validateStep(state: ReserveState, step: number): Record<string, string> {
  const errors: Record<string, string> = {};
  if (step === 5) {
    if (!state.contact.name.trim()) errors.name = 'We need the lead guest’s name as it appears in the passport.';
    const email = state.contact.email.trim();
    if (!email) errors.email = 'Where should the confirmation go?';
    else if (!EMAIL_RE.test(email)) errors.email = 'That address is missing something — check for a typo.';
    if (!state.contact.phone.trim()) errors.phone = 'A number the crew can reach you on if a flight goes wrong.';
  }
  if (step === 6) {
    if (!state.consent.terms) errors.terms = 'Please confirm you have read the booking terms.';
    if (!state.consent.insurance) errors.insurance = 'Insurance covering evacuation is a condition of sailing with us.';
  }
  return errors;
}

/** Versioned since the multi-cabin revision: a v1 draft describes a single
 * `cabinCode` and a guest list this shape no longer has, so it is discarded
 * rather than half-restored. */
export const PERSIST_VERSION = 2;

export interface PersistedReserve {
  v: number;
  depId: string;
  selections: Array<{ code: string; guests: GuestCounts }>;
  contact: Contact;
  chosenExtras: string[];
}

export function toPersisted(state: Pick<ReserveState, 'dep' | 'selections' | 'contact' | 'chosenExtras'>): PersistedReserve {
  return {
    v: PERSIST_VERSION,
    depId: state.dep?.id ?? '',
    selections: state.selections.map((s) => ({ code: s.code, guests: s.guests })),
    contact: state.contact,
    chosenExtras: state.chosenExtras,
  };
}

/** Re-adds saved cabins one at a time so each is re-checked against current
 * stock — inventory may have moved since the draft was written. */
function restoreSelections(state: ReserveState, saved: Array<{ code: string; guests: GuestCounts }>): ReserveState {
  let next: ReserveState = { ...state, selections: [] };
  saved.forEach((s) => {
    const grade = next.cabins.find((c) => c.code === s.code);
    if (!grade || headroomFor(next, s.code) <= 0) return;
    const guests = { ...defaultGuestsFor(grade), ...s.guests };
    const total = totalGuestsOf(guests);
    if (total < 1 || total > grade.maxOccupancy) return;
    next = { ...next, selections: [...next.selections, { uid: next.uidSeq, code: s.code, guests }], uidSeq: next.uidSeq + 1 };
  });
  return next;
}

/**
 * Lazy useReducer initializer, ported from `init()`: restore sessionStorage
 * first, then let `?dep=`/`?cabin=`/`?guests=` override it, then clamp
 * `?step=` by firstIncomplete() so a deep link can't open past what the
 * restored/query-derived state actually supports.
 */
export function computeInitialState(searchParams: URLSearchParams): ReserveState {
  let state = INITIAL_STATE;

  if (typeof window !== 'undefined') {
    try {
      const saved = window.sessionStorage.getItem('sf.reserve');
      if (saved) {
        const s = JSON.parse(saved) as Partial<PersistedReserve>;
        if (s.v === PERSIST_VERSION) {
          state = {
            ...state,
            contact: { ...state.contact, ...s.contact },
            chosenExtras: s.chosenExtras ?? [],
          };
          if (s.depId) {
            state = selectDeparture(state, s.depId);
            state = restoreSelections(state, s.selections ?? []);
          }
        }
      }
    } catch {
      // ignore malformed/unavailable storage
    }
  }

  // selectDeparture() clears the cabins, so re-running it for a departure the
  // draft already restored would throw away every cabin but a `?cabin=` one.
  // Only re-select when the URL actually names a different departure.
  const depId = searchParams.get('dep');
  if (depId && (state.dep?.id !== depId || state.selections.length === 0)) {
    state = selectDeparture(state, depId, searchParams.get('cabin') ?? undefined);
  }

  const guestsParam = searchParams.get('guests');
  if (guestsParam && state.selections.length > 0) {
    const first = state.selections[0];
    const adults = Math.max(1, Math.min(maxOccupancyOf(state, first.code), Number(guestsParam) || 2));
    state = { ...state, selections: [{ ...first, guests: { ...first.guests, adults } }, ...state.selections.slice(1)] };
  }

  const wanted = Math.max(1, Math.min(6, Number(searchParams.get('step')) || 1));
  const step = Math.min(wanted, firstIncomplete(state));
  return { ...state, step, furthest: step };
}
