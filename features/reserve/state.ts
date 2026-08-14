/**
 * Reducer-driven state for /reserve, ported from reserve.html's
 * `reserveFlow()`. A reducer (not one big react-hook-form, unlike
 * /charter) because the real logic here is business-transitions —
 * choosing a cabin can silently trim the party, changing guest counts
 * reshapes guestList — which map onto discrete actions far more directly
 * than form-field bindings do.
 */
import { departureById, tripBySlug, boatBySlug, waterBySlug, deriveCabinInventory, type DerivedCabin } from '@/lib/queries';
import { addDays } from '@/lib/format';
import { EMAIL_RE } from '@/lib/validation';
import { GUEST_BANDS, VOUCHERS, totalGuestsOf, type GuestCounts } from './pricing';
import type { Departure, Trip, Boat, Water } from '@/lib/data/types';

export type DivingLevel = 'none' | 'learning' | 'open-water' | 'advanced' | 'rescue' | 'pro';

export interface Guest {
  name: string;
  band: string;
  nationality: string;
  diving: DivingLevel;
  certNumber: string;
  dives: number;
  dietary: string;
}

export interface Lead {
  email: string;
  phone: string;
  notes: string;
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
  cabin: DerivedCabin | null;
  guests: GuestCounts;
  chosenExtras: string[];
  guestList: Guest[];
  lead: Lead;
  voucher: VoucherState;
  consent: Consent;
  errors: Record<string, string>;
  sheet: boolean;
}

export const EMPTY_GUEST: Guest = { name: '', band: '', nationality: '', diving: 'none', certNumber: '', dives: 0, dietary: '' };

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
  cabin: null,
  guests: { adults: 2, teens: 0, children: 0 },
  chosenExtras: [],
  guestList: [],
  lead: { email: '', phone: '', notes: '' },
  voucher: { code: '', applied: '', rate: 0, error: '' },
  consent: { terms: false, insurance: false, newsletter: false },
  errors: {},
  sheet: false,
};

export function syncGuestList(guestList: Guest[], guests: GuestCounts): Guest[] {
  const wanted: string[] = [];
  GUEST_BANDS.forEach((b) => {
    for (let i = 0; i < guests[b.key]; i++) wanted.push(b.one);
  });
  return wanted.map((band, i) => {
    const existing = guestList[i];
    return existing ? { ...existing, band } : { ...EMPTY_GUEST, band };
  });
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
  const wanted = cabinCode ? cabins.find((c) => c.code === cabinCode && c.left > 0) : undefined;
  return { ...state, dep, trip, boat, water, endDate, cabins, cabin: wanted ?? null };
}

export type ReserveAction =
  | { type: 'SET_SEARCH'; search: Partial<SearchFilters> }
  | { type: 'SET_RESULTS'; results: Departure[] }
  | { type: 'SELECT_DEPARTURE'; depId: string; cabinCode?: string }
  | { type: 'CHOOSE_CABIN'; code: string }
  | { type: 'BUMP_GUESTS'; key: keyof GuestCounts; delta: number }
  | { type: 'TOGGLE_EXTRA'; key: string }
  | { type: 'SET_GUEST_FIELD'; index: number; field: keyof Guest; value: string | number }
  | { type: 'SET_LEAD_FIELD'; field: keyof Lead; value: string }
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
    case 'CHOOSE_CABIN': {
      const c = state.cabins.find((x) => x.code === action.code);
      if (!c || c.left <= 0) return state;
      const guests = { ...state.guests };
      // Silently trims the party (children -> teens -> adults, floor 1
      // adult) to fit the newly chosen grade — matches the original
      // exactly, including the lack of any confirmation prompt.
      while (totalGuestsOf(guests) > c.maxOccupancy) {
        if (guests.children > 0) guests.children--;
        else if (guests.teens > 0) guests.teens--;
        else if (guests.adults > 1) guests.adults--;
        else break;
      }
      return { ...state, cabin: c, guests, guestList: syncGuestList(state.guestList, guests) };
    }
    case 'BUMP_GUESTS': {
      const band = GUEST_BANDS.find((b) => b.key === action.key);
      if (!band) return state;
      const next = state.guests[action.key] + action.delta;
      if (next < band.min) return state;
      const maxOccupancy = state.cabin ? state.cabin.maxOccupancy : 2;
      if (action.delta > 0 && totalGuestsOf(state.guests) >= maxOccupancy) return state;
      const guests = { ...state.guests, [action.key]: next };
      return { ...state, guests, guestList: syncGuestList(state.guestList, guests) };
    }
    case 'TOGGLE_EXTRA': {
      const has = state.chosenExtras.includes(action.key);
      return { ...state, chosenExtras: has ? state.chosenExtras.filter((k) => k !== action.key) : [...state.chosenExtras, action.key] };
    }
    case 'SET_GUEST_FIELD':
      return { ...state, guestList: state.guestList.map((g, i) => (i === action.index ? { ...g, [action.field]: action.value } : g)) };
    case 'SET_LEAD_FIELD':
      return { ...state, lead: { ...state.lead, [action.field]: action.value } };
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

export function occupancyOk(state: ReserveState): boolean {
  const total = totalGuestsOf(state.guests);
  const max = state.cabin ? state.cabin.maxOccupancy : 2;
  return total >= 1 && total <= max;
}

export function leadComplete(state: ReserveState): boolean {
  return !!(state.guestList[0]?.name.trim() && state.lead.email.trim() && state.lead.phone.trim());
}

export function firstIncomplete(state: ReserveState): number {
  if (!state.dep) return 1;
  if (!state.cabin) return 3;
  if (!occupancyOk(state)) return 4;
  if (!leadComplete(state)) return 5;
  return 6;
}

export function canContinue(state: ReserveState): boolean {
  if (state.step === 1) return !!state.dep;
  if (state.step === 2) return !!state.dep;
  if (state.step === 3) return !!state.cabin;
  if (state.step === 4) return occupancyOk(state);
  return true;
}

/** Ported from `validate()` — only steps 5 and 6 have real field validation;
 * steps 1-4 gate via canContinue()/occupancyOk() instead. */
export function validateStep(state: ReserveState, step: number): Record<string, string> {
  const errors: Record<string, string> = {};
  if (step === 5) {
    const lead0 = state.guestList[0];
    if (!lead0 || !lead0.name.trim()) errors.name0 = 'We need the lead guest’s name as it appears in the passport.';
    const email = state.lead.email.trim();
    if (!email) errors.email = 'Where should the confirmation go?';
    else if (!EMAIL_RE.test(email)) errors.email = 'That address is missing something — check for a typo.';
    if (!state.lead.phone.trim()) errors.phone = 'A number the crew can reach you on if a flight goes wrong.';
  }
  if (step === 6) {
    if (!state.consent.terms) errors.terms = 'Please confirm you have read the booking terms.';
    if (!state.consent.insurance) errors.insurance = 'Insurance covering evacuation is a condition of sailing with us.';
  }
  return errors;
}

/** Only the fields the original persists to sessionStorage, plus
 * `guestList` — the original drops per-guest names/nationality/diving/
 * dietary notes (and even the lead's own name) on reload; ported as a real
 * fix per the migration plan rather than carried over. */
export interface PersistedReserve {
  depId: string;
  cabinCode: string;
  guests: GuestCounts;
  guestList: Guest[];
  lead: Lead;
  chosenExtras: string[];
}

export function toPersisted(state: Pick<ReserveState, 'dep' | 'cabin' | 'guests' | 'guestList' | 'lead' | 'chosenExtras'>): PersistedReserve {
  return {
    depId: state.dep?.id ?? '',
    cabinCode: state.cabin?.code ?? '',
    guests: state.guests,
    guestList: state.guestList,
    lead: state.lead,
    chosenExtras: state.chosenExtras,
  };
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
        state = {
          ...state,
          guests: { ...state.guests, ...s.guests },
          lead: { ...state.lead, ...s.lead },
          chosenExtras: s.chosenExtras ?? [],
          guestList: s.guestList ?? [],
        };
        if (s.depId) state = selectDeparture(state, s.depId, s.cabinCode);
      }
    } catch {
      // ignore malformed/unavailable storage
    }
  }

  const depId = searchParams.get('dep');
  if (depId) state = selectDeparture(state, depId, searchParams.get('cabin') ?? undefined);

  const guestsParam = searchParams.get('guests');
  if (guestsParam) state = { ...state, guests: { ...state.guests, adults: Math.max(1, Math.min(4, Number(guestsParam) || 2)) } };

  state = { ...state, guestList: syncGuestList(state.guestList, state.guests) };

  const wanted = Math.max(1, Math.min(6, Number(searchParams.get('step')) || 1));
  const step = Math.min(wanted, firstIncomplete(state));
  return { ...state, step, furthest: step };
}
