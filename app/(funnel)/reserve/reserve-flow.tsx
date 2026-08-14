'use client';

/**
 * Ported from reserve.html's `reserveFlow()` — the most complex of the
 * three funnels, hence the reducer (features/reserve/state.ts) rather than
 * a form library. Two deliberate fixes over the original, both called out
 * in the migration plan: `guestList` now survives a sessionStorage reload
 * (the original loses every typed name, including the lead's own, on
 * reload mid-step-5 — see state.ts's PersistedReserve), and the
 * `[aria-invalid="true"]` autofocus-on-error query is scoped to this
 * funnel's own root rather than the whole document.
 */
import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  BigCheck,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Cross,
  EmptyStateIcon,
  Print,
} from '@/components/icons';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PhotoPlate } from '@/components/media/photo-plate';
import { CardSkeleton } from '@/components/states/card-skeleton';
import { ErrorState } from '@/components/states/error-state';
import { FunnelFooter } from '@/components/funnel/funnel-footer';
import { IndeterminateBar } from '@/components/funnel/indeterminate-bar';
import { Stepper } from '@/components/form/stepper';
import { VoyageSummary } from './voyage-summary';
import { submitReservation } from './actions';
import {
  computeInitialState,
  firstIncomplete,
  leadComplete,
  occupancyOk,
  reserveReducer,
  toPersisted,
  validateStep,
  canContinue as canContinueOf,
  type DivingLevel,
} from '@/features/reserve/state';
import { EXTRAS, GUEST_BANDS, cabinSubtotal, priceLinesFor, subtotalOf, totalGuestsOf } from '@/features/reserve/pricing';
import { useLocale } from '@/components/providers/locale-provider';
import { filterDepartures, departureMonthOptions, tripBySlug, boatBySlug } from '@/lib/queries';
import { forcedStateFrom, emptied } from '@/lib/qa';
import { routes } from '@/lib/routes';
import { toast } from '@/lib/toast';
import { waters, lengths, inclusions, type LengthSlug } from '@/lib/data';
import { cn } from '@/lib/utils';

const INCLUSIONS_PREVIEW = inclusions.included.slice(0, 6);

const STEPS = [
  { key: 'search', label: 'Search' },
  { key: 'summary', label: 'Trip summary' },
  { key: 'cabin', label: 'Cabin' },
  { key: 'guests', label: 'Guests' },
  { key: 'details', label: 'Your details' },
  { key: 'review', label: 'Review' },
];

const DIVING_LABELS: Record<DivingLevel, string> = {
  none: 'Snorkelling',
  learning: 'Learning on board',
  'open-water': 'Open Water',
  advanced: 'Advanced',
  rescue: 'Rescue+',
  pro: 'Pro',
};

export function ReserveFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const forced = forcedStateFrom(searchParams.get('state'));
  const { money, date, dateRange, nights, guests: guestsLabel } = useLocale();
  const rootRef = React.useRef<HTMLDivElement>(null);

  const [state, dispatch] = React.useReducer(reserveReducer, searchParams, computeInitialState);
  const [searchState, setSearchState] = React.useState<'loading' | 'ready' | 'error'>('loading');
  const [searchTick, setSearchTick] = React.useState(0);
  const [busy, setBusy] = React.useState(false);
  const [submitError, setSubmitError] = React.useState(false);
  const [reference, setReference] = React.useState('');

  const months = React.useMemo(() => departureMonthOptions(), []);

  React.useEffect(() => {
    // Mirrors useListingLoad's own pattern: this synchronizes with an
    // external timer (the fake search latency), it isn't a derivable
    // render-time value.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchState('loading');
    if (forced === 'loading') return;
    const handle = setTimeout(() => {
      if (forced === 'error') {
        setSearchState('error');
        return;
      }
      const results = emptied(
        filterDepartures({
          available: true,
          water: state.search.water || undefined,
          month: state.search.month || undefined,
          length: (state.search.length || undefined) as LengthSlug | undefined,
        }).slice(0, 8),
        forced
      );
      dispatch({ type: 'SET_RESULTS', results });
      setSearchState('ready');
    }, 480);
    return () => clearTimeout(handle);
  }, [state.search, forced, searchTick]);

  const { dep, cabin, guests, guestList, lead, chosenExtras, step } = state;
  React.useEffect(() => {
    try {
      window.sessionStorage.setItem('sf.reserve', JSON.stringify(toPersisted({ dep, cabin, guests, guestList, lead, chosenExtras })));
    } catch {
      // ignore quota/availability errors — the draft just won't survive a reload
    }
  }, [dep, cabin, guests, guestList, lead, chosenExtras, step]);

  const totalGuests = totalGuestsOf(state.guests);
  const maxOccupancy = state.cabin ? state.cabin.maxOccupancy : 2;
  const priceLines = React.useMemo(
    () => (state.cabin ? priceLinesFor(state.cabin, state.guests, state.chosenExtras, money) : []),
    [state.cabin, state.guests, state.chosenExtras, money]
  );
  const subtotal = subtotalOf(priceLines);
  const discount = state.cabin && state.voucher.rate ? Math.round(cabinSubtotal(state.cabin.price, state.guests) * state.voucher.rate) : 0;
  const total = Math.max(0, subtotal - discount);
  const deposit = state.dep ? Math.round(total * state.dep.deposit) : 0;

  function focusFirstInvalid() {
    requestAnimationFrame(() => {
      const first = rootRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
      if (first) {
        first.focus();
        first.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    });
  }

  function goto(n: number) {
    const target = Math.max(1, Math.min(7, n));
    if (target > state.step && target > firstIncomplete(state)) return;
    dispatch({ type: 'GOTO', step: target });
    if (target < 7) {
      router.replace(routes.reserve({ dep: state.dep?.id, cabin: state.cabin?.code, step: target }), { scroll: false });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function back() {
    dispatch({ type: 'SET_ERRORS', errors: {} });
    goto(state.step - 1);
  }
  function next() {
    if (!canContinueOf(state)) return;
    const errors = validateStep(state, state.step);
    if (Object.keys(errors).length > 0) {
      dispatch({ type: 'SET_ERRORS', errors });
      focusFirstInvalid();
      return;
    }
    dispatch({ type: 'SET_ERRORS', errors: {} });
    goto(state.step + 1);
  }

  function chooseDeparture(id: string) {
    // goto()'s gating reads the *current* render's `state`, which doesn't
    // yet reflect this dispatch — React state updates aren't synchronous.
    // Compute the post-select state directly so the step-2 gate check
    // (and the URL we write) both see the departure that was just chosen.
    const nextState = reserveReducer(state, { type: 'SELECT_DEPARTURE', depId: id });
    if (!nextState.dep) return;
    dispatch({ type: 'SELECT_DEPARTURE', depId: id });
    dispatch({ type: 'GOTO', step: 2 });
    router.replace(routes.reserve({ dep: nextState.dep.id, cabin: nextState.cabin?.code, step: 2 }), { scroll: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function onSubmit() {
    const errors = validateStep(state, 6);
    if (Object.keys(errors).length > 0) {
      dispatch({ type: 'SET_ERRORS', errors });
      focusFirstInvalid();
      return;
    }
    if (!state.dep || !state.cabin) return;
    setBusy(true);
    setSubmitError(false);
    const result = await submitReservation(
      {
        depStart: state.dep.start,
        totalGuests,
        cabinCode: state.cabin.code,
        leadName: state.guestList[0]?.name ?? '',
        leadEmail: state.lead.email,
      },
      forced === 'error'
    );
    if (!result.ok) {
      setBusy(false);
      setSubmitError(true);
      toast({ title: 'The reservation did not go through', body: 'Nothing was charged and your answers are intact. Try again, or message the office.', variant: 'error' });
      return;
    }
    setReference(result.reference ?? '');
    setBusy(false);
    dispatch({ type: 'GOTO', step: 7 });
    try {
      window.sessionStorage.removeItem('sf.reserve');
    } catch {
      // ignore
    }
    router.replace(routes.reserve({ ref: result.reference }), { scroll: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast({ title: `Cabin reserved — ${result.reference}`, body: 'Held for 72 hours. The deposit link follows within one working day.', variant: 'success' });
  }

  const footerHint =
    state.step === 1
      ? state.dep
        ? 'Date chosen'
        : `${state.results.length} dates with cabins free`
      : state.step === 3
        ? state.cabin?.name ?? 'Choose a cabin grade'
        : state.step === 4
          ? occupancyOk(state)
            ? 'Fits the cabin'
            : 'Too many for this cabin'
          : state.step === 5
            ? leadComplete(state)
              ? 'Lead guest complete'
              : 'Lead guest details needed'
            : state.step === 6
              ? 'Nothing is charged yet'
              : 'Your voyage';

  if (state.step === 7 && state.dep && state.trip && state.boat) {
    return (
      <main className="pb-32 lg:pb-28">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8 lg:py-12">
          <section className="lg:col-span-2">
            <div className="mx-auto max-w-2xl">
              <div className="rounded-4xl bg-white p-7 shadow-card lg:p-12">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-mist-100 text-ink-700">
                  <BigCheck className="h-8 w-8" aria-hidden="true" />
                </span>
                <p className="mt-6 font-mark text-eyebrow uppercase text-flame">Cabin reserved</p>
                <h1 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">Held for you — welcome to the familia</h1>
                <p className="mt-4 text-base leading-relaxed text-ink/70">
                  Your cabin is held for 72 hours. Nothing has been charged: the office confirms availability by hand first, then sends the deposit link.
                </p>

                <dl className="mt-8 grid gap-5 rounded-2xl bg-sand p-5 sm:grid-cols-2 lg:p-6">
                  <div>
                    <dt className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Booking reference</dt>
                    <dd className="mt-1 font-display text-2xl tracking-wide text-ink-700">{reference}</dd>
                  </div>
                  <div>
                    <dt className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Payment status</dt>
                    <dd className="mt-1 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-flame" />
                      <span className="font-display text-xl text-ink-700">Awaiting deposit</span>
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Voyage</dt>
                    <dd className="mt-1 text-sm text-ink-700">
                      {state.trip.title}
                      <br />
                      {dateRange(state.dep.start, state.dep.nights)} · {state.boat.name}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Held until</dt>
                    <dd className="mt-1 text-sm text-ink-700">
                      72 hours from now
                      <br />
                      <span className="text-ink/55">Then the cabin returns to the pool</span>
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Deposit due</dt>
                    <dd className="mt-1">
                      <span className="tnum font-display text-2xl text-deep-700">{money(deposit)}</span>
                      <span className="text-sm text-ink/60"> of {money(total)} total</span>
                    </dd>
                  </div>
                </dl>

                <div className="mt-8">
                  <h2 className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">What happens next</h2>
                  <ol className="mt-4 space-y-3.5">
                    <li className="flex gap-3 text-sm leading-relaxed text-ink/80">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mist" />A confirmation is on its way to <strong className="text-ink-700">{state.lead.email}</strong> with
                      everything on this screen.
                    </li>
                    <li className="flex gap-3 text-sm leading-relaxed text-ink/80">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mist" />
                      Within one working day: the deposit link, joining instructions and a short form for dietary and diving details.
                    </li>
                    <li className="flex gap-3 text-sm leading-relaxed text-ink/80">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mist" />
                      Sixty days before you sail: the balance, and the crew list for your week.
                    </li>
                    <li className="flex gap-3 text-sm leading-relaxed text-ink/80">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mist" />
                      Any time before that: one free move to another departure in the same season.
                    </li>
                  </ol>
                </div>

                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-ink px-6 py-4 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-ink-600"
                  >
                    <Print className="h-4 w-4" aria-hidden="true" />
                    Print this page
                  </button>
                  <Link
                    href={routes.trip(state.trip.slug)}
                    className="inline-flex flex-1 items-center justify-center rounded-full border border-ink/20 px-6 py-4 font-mark text-[12px] uppercase tracking-[0.14em] text-ink-700 transition hover:border-ink"
                  >
                    Read the itinerary again
                  </Link>
                </div>

                <div className="mt-8 border-t border-sand-300 pt-6">
                  <h2 className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">If anything looks wrong</h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink/75">
                    Message the office on{' '}
                    <a href="https://wa.me/6281100000000" target="_blank" rel="noopener" className="text-flame-600 underline underline-offset-4">
                      WhatsApp
                    </a>{' '}
                    or email{' '}
                    <a href="mailto:hello@seafamilia.com" className="text-flame-600 underline underline-offset-4">
                      hello@seafamilia.com
                    </a>
                    , quoting <strong className="text-ink-700">{reference}</strong>. Two people, both in Labuan Bajo, usually within a few hours.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="pb-32 lg:pb-28" ref={rootRef}>
      <div className="border-b border-sand-300 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">Reserve a cabin</p>
              <p className="mt-1 font-mark text-[11px] uppercase tracking-[0.14em] text-mist-700">
                Step {state.step} of 6 · {STEPS[state.step - 1].label}
              </p>
            </div>
            <Link href={routes.departures()} className="group inline-flex items-center gap-2 font-mark text-[11px] uppercase tracking-[0.16em] text-ink/70 hover:text-flame-600">
              <Cross className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Leave — nothing is saved to your account</span>
              <span className="sm:hidden">Leave</span>
            </Link>
          </div>

          <ol className="mt-4 flex gap-1.5" aria-label="Progress">
            {STEPS.map((s, i) => (
              <li key={s.key} className="flex-1">
                <button
                  type="button"
                  onClick={() => goto(i + 1)}
                  disabled={i + 1 > state.furthest}
                  aria-current={state.step === i + 1 ? 'step' : undefined}
                  className="block w-full text-left disabled:cursor-not-allowed"
                >
                  <span className={cn('block h-1 rounded-full transition', i + 1 < state.step ? 'bg-flame' : i + 1 === state.step ? 'bg-ink' : 'bg-sand-300')} />
                  <span className={cn('mt-1.5 hidden font-mark text-[9px] uppercase tracking-[0.12em] lg:block', i + 1 <= state.step ? 'text-ink-700' : 'text-mist-400')}>{s.label}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:gap-12">
          <div className="min-w-0">
            {state.step === 1 ? (
              <section>
                <h1 className="font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">Which date suits you?</h1>
                <p className="mt-3 text-base leading-relaxed text-ink/70">Pick a water and a month, or leave both open and read the list. Everything shown has at least one cabin free.</p>

                <div className="mt-7 grid gap-3 rounded-2xl bg-white p-5 sm:grid-cols-3 lg:p-6">
                  <label className="block">
                    <span className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Water</span>
                    <select
                      value={state.search.water}
                      onChange={(e) => dispatch({ type: 'SET_SEARCH', search: { water: e.target.value } })}
                      className="mt-1.5 h-12 w-full rounded-xl border-sand-300 bg-sand text-ink-700 focus:border-mist focus:ring-2 focus:ring-mist/40"
                    >
                      <option value="">Anywhere</option>
                      {waters.map((w) => (
                        <option key={w.slug} value={w.slug}>
                          {w.short}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Month</span>
                    <select
                      value={state.search.month}
                      onChange={(e) => dispatch({ type: 'SET_SEARCH', search: { month: e.target.value } })}
                      className="mt-1.5 h-12 w-full rounded-xl border-sand-300 bg-sand text-ink-700 focus:border-mist focus:ring-2 focus:ring-mist/40"
                    >
                      <option value="">Any month</option>
                      {months.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Length</span>
                    <select
                      value={state.search.length}
                      onChange={(e) => dispatch({ type: 'SET_SEARCH', search: { length: e.target.value } })}
                      className="mt-1.5 h-12 w-full rounded-xl border-sand-300 bg-sand text-ink-700 focus:border-mist focus:ring-2 focus:ring-mist/40"
                    >
                      <option value="">Any</option>
                      {lengths.map((l) => (
                        <option key={l.slug} value={l.slug}>
                          {l.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="mt-6">
                  {searchState === 'loading' ? (
                    <div className="space-y-3">
                      <CardSkeleton kind="departure" count={4} />
                    </div>
                  ) : searchState === 'error' ? (
                    <ErrorState onRetry={() => setSearchTick((t) => t + 1)} />
                  ) : state.results.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-mist-300 bg-white px-6 py-12 text-center">
                      <EmptyStateIcon className="mx-auto h-12 w-12 text-mist-400" aria-hidden="true" />
                      <h2 className="mt-5 font-display text-2xl text-ink-700">Nothing free on those terms</h2>
                      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink/70">
                        Regions run in their own seasons, so a month and a water can cancel each other out. Clear the month first — that usually does it.
                      </p>
                      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => dispatch({ type: 'SET_SEARCH', search: { water: '', month: '', length: '' } })}
                          className="inline-flex h-11 items-center rounded-full bg-ink px-5 font-mark text-[12px] uppercase tracking-[0.12em] text-white transition hover:bg-ink-600"
                        >
                          Clear the search
                        </button>
                        <Link
                          href={routes.charter()}
                          className="inline-flex h-11 items-center rounded-full border border-ink/20 px-5 font-mark text-[12px] uppercase tracking-[0.12em] text-ink-700 transition hover:border-ink"
                        >
                          Charter your own dates
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {state.results.map((d) => {
                        const trip = tripBySlug(d.trip);
                        const boat = boatBySlug(d.boat);
                        if (!trip || !boat) return null;
                        return (
                          <li key={d.id}>
                            <button
                              type="button"
                              onClick={() => chooseDeparture(d.id)}
                              className={cn(
                                'group flex w-full items-center gap-4 rounded-2xl border-2 bg-white p-4 text-left transition',
                                state.dep?.id === d.id ? 'border-flame shadow-card' : 'border-sand-300 hover:border-mist'
                              )}
                            >
                              <span className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-ink">
                                <PhotoPlate ph={trip.ph} src={null} alt="" sizes="6rem" />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block font-mark text-[10px] uppercase tracking-[0.16em] text-flame">{dateRange(d.start, d.nights)}</span>
                                <span className="mt-1 block font-display text-lg leading-tight text-ink-700">{trip.title}</span>
                                <span className="mt-1 block text-xs text-mist-700">
                                  {nights(d.nights)} · {boat.name} · {d.cabinsLeft} cabins left
                                </span>
                              </span>
                              <span className="shrink-0 text-right">
                                <span className="tnum block font-display text-lg text-deep-700">{money(d.price)}</span>
                                <span className="block text-[11px] text-ink/50">per person</span>
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </section>
            ) : null}

            {state.step === 2 && state.dep && state.trip && state.boat && state.water ? (
              <section>
                <h1 className="font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">Is this the week?</h1>
                <p className="mt-3 text-base leading-relaxed text-ink/70">
                  Everything below is fixed for this departure. Check the dates against your flights before going on — the day you board is not the day you fly.
                </p>

                <div className="mt-7 overflow-hidden rounded-2xl bg-white">
                  <div className="relative aspect-[16/7]">
                    <PhotoPlate ph={state.trip.ph} src={null} alt={state.trip.title} sizes="60rem" />
                    <div className="scrim-soft absolute inset-0" />
                    <div className="absolute inset-x-5 bottom-4">
                      <p className="font-mark text-[10px] uppercase tracking-[0.18em] text-white/80">{state.water.short}</p>
                      <p className="mt-1 font-display text-2xl text-white sm:text-3xl">{state.trip.title}</p>
                    </div>
                  </div>

                  <dl className="grid grid-cols-2 gap-x-6 gap-y-5 p-5 sm:grid-cols-3 lg:p-6">
                    <div>
                      <dt className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Dates</dt>
                      <dd className="mt-1 font-display text-lg text-ink-700">{dateRange(state.dep.start, state.dep.nights)}</dd>
                    </div>
                    <div>
                      <dt className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Length</dt>
                      <dd className="mt-1 font-display text-lg text-ink-700">{nights(state.dep.nights)}</dd>
                    </div>
                    <div>
                      <dt className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Boat</dt>
                      <dd className="mt-1 font-display text-lg text-ink-700">{state.boat.name}</dd>
                    </div>
                    <div>
                      <dt className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Boards &amp; ends</dt>
                      <dd className="mt-1 font-display text-lg text-ink-700">{state.trip.gateway}</dd>
                    </div>
                    <div>
                      <dt className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Guests on board</dt>
                      <dd className="mt-1 font-display text-lg text-ink-700">Up to {state.boat.guests}</dd>
                    </div>
                    <div>
                      <dt className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Cabins left</dt>
                      <dd className={cn('mt-1 font-display text-lg', state.dep.cabinsLeft <= 1 ? 'text-flame-600' : 'text-ink-700')}>{state.dep.cabinsLeft}</dd>
                    </div>
                  </dl>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white p-5">
                    <h2 className="font-mark text-[11px] uppercase tracking-[0.16em] text-flame">Key inclusions</h2>
                    <ul className="mt-3 space-y-2">
                      {INCLUSIONS_PREVIEW.map((i) => (
                        <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-ink/80">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-mist" aria-hidden="true" />
                          <span>{i}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl bg-white p-5">
                    <h2 className="font-mark text-[11px] uppercase tracking-[0.16em] text-flame">First and last day</h2>
                    <ul className="mt-3 space-y-3 text-sm leading-relaxed text-ink/80">
                      <li>
                        <strong className="text-ink-700">{date(state.dep.start)}</strong> — aboard by 2pm, transfer from the airport included.
                      </li>
                      <li>
                        <strong className="text-ink-700">{state.endDate ? date(state.endDate) : ''}</strong> — alongside by 9am, transfer to the airport included.
                      </li>
                      <li className="text-ink/60">Book flights out after 1pm on the last day. Inland flights get cancelled, and we would rather you had a buffer.</li>
                    </ul>
                  </div>
                </div>

                <Link href={routes.trip(state.trip.slug)} target="_blank" rel="noopener" className="mt-5 inline-flex items-center gap-2 font-mark text-[11px] uppercase tracking-[0.16em] text-flame-600 underline underline-offset-4">
                  Read the full day-by-day in a new tab
                </Link>
              </section>
            ) : null}

            {state.step === 3 && state.boat ? (
              <section>
                <h1 className="font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">Choose your cabin</h1>
                <p className="mt-3 text-base leading-relaxed text-ink/70">Prices are per person for this departure, everything on board included. Choosing holds the cabin for 72 hours — no card details yet.</p>

                <div className="mt-7 space-y-3">
                  {state.cabins.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => dispatch({ type: 'CHOOSE_CABIN', code: c.code })}
                      disabled={c.left <= 0}
                      aria-pressed={state.cabin?.code === c.code}
                      className={cn(
                        'flex w-full gap-4 rounded-2xl border-2 bg-white p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-60',
                        state.cabin?.code === c.code ? 'border-flame shadow-card' : 'border-sand-300 hover:border-mist'
                      )}
                    >
                      <span className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-ink sm:h-28 sm:w-36">
                        <PhotoPlate ph={c.ph} src={null} alt={c.name} sizes="9rem" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                          <span>
                            <span className="block font-display text-lg text-ink-700">{c.name}</span>
                            <span className="mt-0.5 block text-xs text-mist-700">
                              {c.deck} · {c.beds} · sleeps {c.maxOccupancy}
                            </span>
                          </span>
                          <span className="shrink-0 text-right">
                            <span className="tnum block font-display text-lg text-deep-700">{money(c.price)}</span>
                            <span className="block text-[11px] text-ink/50">per person</span>
                          </span>
                        </span>
                        <span className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink/65">
                          {(c.features ?? []).map((f) => (
                            <span key={f}>{f}</span>
                          ))}
                        </span>
                        <span className={cn('mt-2 block font-mark text-[10px] uppercase tracking-[0.14em]', c.left <= 0 ? 'text-ink/40' : c.left === 1 ? 'text-flame-600' : 'text-mist-700')}>
                          {c.left <= 0 ? 'Fully booked on this date' : c.left === 1 ? 'Last one' : `${c.left} left`}
                        </span>
                      </span>
                      <span className={cn('mt-1 grid h-7 w-7 shrink-0 place-items-center self-start rounded-full border transition', state.cabin?.code === c.code ? 'border-flame bg-flame text-white' : 'border-sand-300 text-transparent')}>
                        <Check className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </button>
                  ))}
                </div>

                <p className="mt-5 rounded-2xl bg-white p-4 text-xs leading-relaxed text-ink/60">
                  Travelling alone? The single berths carry no supplement and we will not pair you with a stranger unless you ask. Need two cabins side by side, or an interconnecting pair?{' '}
                  <Link href={routes.contact()} className="text-flame-600 underline underline-offset-4">
                    Tell the office
                  </Link>{' '}
                  and they will arrange it by hand.
                </p>
              </section>
            ) : null}

            {state.step === 4 ? (
              <section>
                <h1 className="font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">Who is sailing?</h1>
                <p className="mt-3 text-base leading-relaxed text-ink/70">
                  Numbers first, names next. We ask ages because the kitchen, the dive plan and the cabin beds all depend on them — not the price bands alone.
                </p>

                <div className="mt-7 rounded-2xl bg-white p-5 lg:p-6">
                  <div className="space-y-4">
                    {GUEST_BANDS.map((b) => (
                      <div key={b.key} className="flex items-center justify-between gap-4 border-b border-sand-200 pb-4 last:border-0 last:pb-0">
                        <div>
                          <p className="text-sm text-ink-700">{b.label}</p>
                          <p className="text-xs text-ink/55">{b.note}</p>
                          {b.rate < 1 ? <p className="mt-0.5 font-mark text-[10px] uppercase tracking-[0.14em] text-mist-700">{Math.round(b.rate * 100)}% of the cabin fare</p> : null}
                        </div>
                        <Stepper
                          value={state.guests[b.key]}
                          min={b.min}
                          max={state.guests[b.key] + Math.max(0, maxOccupancy - totalGuests)}
                          onChange={(n) => dispatch({ type: 'BUMP_GUESTS', key: b.key, delta: n - state.guests[b.key] })}
                          label={b.label.toLowerCase()}
                        />
                      </div>
                    ))}
                  </div>

                  <div className={cn('mt-5 rounded-xl p-4', occupancyOk(state) ? 'bg-sand' : 'bg-flame/5 ring-1 ring-inset ring-flame/25')} aria-live="polite">
                    <p className={cn('text-sm leading-relaxed', occupancyOk(state) ? 'text-ink/75' : 'text-flame-700')}>
                      {occupancyOk(state) ? (
                        <>
                          <strong className="text-ink-700">{totalGuests}</strong> in the {state.cabin ? state.cabin.name : 'cabin'}, which sleeps {maxOccupancy}.
                          {totalGuests < maxOccupancy ? <span className="text-ink/60"> Room for {maxOccupancy - totalGuests} more if someone else joins.</span> : null}
                        </>
                      ) : (
                        <>
                          <strong>{totalGuests}</strong> will not fit — the {state.cabin ? state.cabin.name : 'cabin'} sleeps {maxOccupancy}. Choose a larger grade, or ask us for a second cabin nearby.
                        </>
                      )}
                    </p>
                    {!occupancyOk(state) ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button type="button" onClick={() => goto(3)} className="inline-flex h-10 items-center rounded-full bg-flame px-4 font-mark text-[11px] uppercase tracking-[0.12em] text-white transition hover:bg-flame-600">
                          Choose another cabin
                        </button>
                        <Link href={routes.contact()} className="inline-flex h-10 items-center rounded-full border border-ink/20 px-4 font-mark text-[11px] uppercase tracking-[0.12em] text-ink-700 transition hover:border-ink">
                          Ask for two cabins
                        </Link>
                      </div>
                    ) : null}
                  </div>

                  {state.guests.children > 0 ? (
                    <p className="mt-4 text-xs leading-relaxed text-ink/60">Children are welcome from four upwards. Under four, please talk to us first — it depends on the route rather than the child.</p>
                  ) : null}
                </div>

                <div className="mt-4 rounded-2xl bg-white p-5 lg:p-6">
                  <h2 className="font-mark text-[11px] uppercase tracking-[0.16em] text-ink-700">Anything to add?</h2>
                  <p className="mt-1 text-xs text-ink/55">All optional, all addable later. Nothing here is a trap.</p>
                  <div className="mt-4 space-y-3">
                    {EXTRAS.map((x) => (
                      <label key={x.key} className="flex items-start gap-3 border-b border-sand-200 pb-3 last:border-0 last:pb-0">
                        <input
                          type="checkbox"
                          checked={state.chosenExtras.includes(x.key)}
                          onChange={() => dispatch({ type: 'TOGGLE_EXTRA', key: x.key })}
                          className="mt-0.5 h-5 w-5 rounded border-sand-300 text-flame focus:ring-mist/40"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-baseline justify-between gap-x-4">
                            <span className="text-sm text-ink-700">{x.label}</span>
                            <span className="tnum shrink-0 text-sm text-deep-700">{money(x.price)}</span>
                          </span>
                          <span className="mt-0.5 block text-xs text-ink/60">
                            {x.note} · {x.perPerson ? 'per person' : 'per group'}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </section>
            ) : null}

            {state.step === 5 ? (
              <section>
                <h1 className="font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">Guest details</h1>
                <p className="mt-3 text-base leading-relaxed text-ink/70">Only the lead guest is needed now — the rest can follow on the joining form. Anything you tell us here reaches the crew before you board.</p>

                <div className="mt-7 space-y-4">
                  {state.guestList.map((g, i) => (
                    <fieldset key={i} className="rounded-2xl bg-white p-5 lg:p-6">
                      <legend className="sf-legend flex items-center gap-3 pb-3 font-mark text-[11px] font-medium uppercase tracking-[0.18em] text-ink-700">
                        <span className="h-3.5 w-[3px] shrink-0 rounded-full bg-flame" />
                        <span>{i === 0 ? 'Lead guest' : `Guest ${i + 1}`}</span>
                        <span className="shrink-0 rounded-full bg-sand px-2.5 py-1 font-mark text-[10px] uppercase tracking-[0.12em] text-mist-700">{g.band}</span>
                        <span className="h-px flex-1 bg-sand-300" />
                      </legend>

                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <label className="block sm:col-span-2">
                          <span className="text-sm text-ink/70">
                            Full name, as in the passport {i === 0 ? <span className="text-flame">*</span> : null}
                          </span>
                          <Input
                            type="text"
                            autoComplete={i === 0 ? 'name' : 'off'}
                            value={g.name}
                            onChange={(e) => dispatch({ type: 'SET_GUEST_FIELD', index: i, field: 'name', value: e.target.value })}
                            aria-invalid={i === 0 && state.errors.name0 ? true : undefined}
                            className="mt-1.5 h-12 rounded-xl border-sand-300 bg-sand text-ink-700"
                          />
                          {i === 0 && state.errors.name0 ? (
                            <span role="alert" className="mt-1.5 block text-sm text-flame-600">
                              {state.errors.name0}
                            </span>
                          ) : null}
                        </label>

                        {i === 0 ? (
                          <label className="block">
                            <span className="text-sm text-ink/70">
                              Email <span className="text-flame">*</span>
                            </span>
                            <Input
                              type="email"
                              autoComplete="email"
                              inputMode="email"
                              value={state.lead.email}
                              onChange={(e) => dispatch({ type: 'SET_LEAD_FIELD', field: 'email', value: e.target.value })}
                              aria-invalid={state.errors.email ? true : undefined}
                              className="mt-1.5 h-12 rounded-xl border-sand-300 bg-sand text-ink-700"
                            />
                            {state.errors.email ? (
                              <span role="alert" className="mt-1.5 block text-sm text-flame-600">
                                {state.errors.email}
                              </span>
                            ) : null}
                          </label>
                        ) : null}
                        {i === 0 ? (
                          <label className="block">
                            <span className="text-sm text-ink/70">
                              Phone or WhatsApp <span className="text-flame">*</span>
                            </span>
                            <Input
                              type="tel"
                              autoComplete="tel"
                              inputMode="tel"
                              placeholder="+61 400 000 000"
                              value={state.lead.phone}
                              onChange={(e) => dispatch({ type: 'SET_LEAD_FIELD', field: 'phone', value: e.target.value })}
                              aria-invalid={state.errors.phone ? true : undefined}
                              className="mt-1.5 h-12 rounded-xl border-sand-300 bg-sand text-ink-700 placeholder:text-ink/35"
                            />
                            {state.errors.phone ? (
                              <span role="alert" className="mt-1.5 block text-sm text-flame-600">
                                {state.errors.phone}
                              </span>
                            ) : null}
                          </label>
                        ) : null}

                        <label className="block">
                          <span className="text-sm text-ink/70">Nationality</span>
                          <Input
                            type="text"
                            autoComplete="country-name"
                            value={g.nationality}
                            onChange={(e) => dispatch({ type: 'SET_GUEST_FIELD', index: i, field: 'nationality', value: e.target.value })}
                            className="mt-1.5 h-12 rounded-xl border-sand-300 bg-sand text-ink-700"
                          />
                        </label>
                        <label className="block">
                          <span className="text-sm text-ink/70">Diving</span>
                          <select
                            value={g.diving}
                            onChange={(e) => dispatch({ type: 'SET_GUEST_FIELD', index: i, field: 'diving', value: e.target.value })}
                            className="mt-1.5 h-12 w-full rounded-xl border-sand-300 bg-sand text-ink-700 focus:border-mist focus:ring-2 focus:ring-mist/40"
                          >
                            <option value="none">Not diving — snorkelling only</option>
                            <option value="learning">Would like to learn on board</option>
                            <option value="open-water">Open Water</option>
                            <option value="advanced">Advanced</option>
                            <option value="rescue">Rescue or above</option>
                            <option value="pro">Instructor / divemaster</option>
                          </select>
                        </label>
                        {g.diving !== 'none' && g.diving !== 'learning' ? (
                          <>
                            <label className="block">
                              <span className="text-sm text-ink/70">Certification number</span>
                              <Input
                                type="text"
                                placeholder="Optional — can follow later"
                                value={g.certNumber}
                                onChange={(e) => dispatch({ type: 'SET_GUEST_FIELD', index: i, field: 'certNumber', value: e.target.value })}
                                className="mt-1.5 h-12 rounded-xl border-sand-300 bg-sand text-ink-700 placeholder:text-ink/35"
                              />
                            </label>
                            <label className="block">
                              <span className="text-sm text-ink/70">Logged dives, roughly</span>
                              <Input
                                type="number"
                                min={0}
                                max={9999}
                                value={g.dives}
                                onChange={(e) => dispatch({ type: 'SET_GUEST_FIELD', index: i, field: 'dives', value: Number(e.target.value) || 0 })}
                                className="counter-input mt-1.5 h-12 rounded-xl border-sand-300 bg-sand text-ink-700"
                              />
                            </label>
                          </>
                        ) : null}
                        <label className="block sm:col-span-2">
                          <span className="text-sm text-ink/70">Dietary needs, allergies, anything medical</span>
                          <Textarea
                            rows={2}
                            maxLength={300}
                            placeholder="Coeliac, vegan, nut allergy, halal, a knee that objects to ladders — all useful, and all easy if we know early."
                            value={g.dietary}
                            onChange={(e) => dispatch({ type: 'SET_GUEST_FIELD', index: i, field: 'dietary', value: e.target.value })}
                            className="mt-1.5 rounded-xl border-sand-300 bg-sand text-ink-700 placeholder:text-ink/35"
                          />
                        </label>
                      </div>
                    </fieldset>
                  ))}

                  <fieldset className="rounded-2xl bg-white p-5 lg:p-6">
                    <legend className="sf-legend flex items-center gap-3 pb-3 font-mark text-[11px] font-medium uppercase tracking-[0.18em] text-ink-700">
                      <span className="h-3.5 w-[3px] shrink-0 rounded-full bg-flame" />
                      <span>Anything else</span>
                      <span className="h-px flex-1 bg-sand-300" />
                    </legend>
                    <label className="mt-3 block">
                      <span className="sr-only">Notes for the office</span>
                      <Textarea
                        rows={3}
                        maxLength={500}
                        placeholder="Celebrating something? Arriving a day early? Want us to hold this without a payment link for 72 hours? Say so here."
                        value={state.lead.notes}
                        onChange={(e) => dispatch({ type: 'SET_LEAD_FIELD', field: 'notes', value: e.target.value })}
                        className="rounded-xl border-sand-300 bg-sand text-ink-700 placeholder:text-ink/35"
                      />
                    </label>
                  </fieldset>
                </div>
              </section>
            ) : null}

            {state.step === 6 && state.dep && state.trip && state.boat && state.cabin ? (
              <section>
                <h1 className="font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">Review and reserve</h1>
                <p className="mt-3 text-base leading-relaxed text-ink/70">Nothing is charged on this screen. Reserving holds your cabin for 72 hours while the office confirms it by hand and sends a payment link.</p>

                <div className="mt-7 rounded-2xl bg-white p-5 lg:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="font-mark text-[11px] uppercase tracking-[0.16em] text-ink-700">Your voyage</h2>
                    <button type="button" onClick={() => goto(2)} className="font-mark text-[11px] uppercase tracking-[0.14em] text-flame-600 underline underline-offset-4">
                      Change
                    </button>
                  </div>
                  <dl className="mt-4 space-y-2.5 text-sm">
                    <div className="flex flex-wrap justify-between gap-x-4 border-b border-sand-200 pb-2.5">
                      <dt className="text-ink/60">Itinerary</dt>
                      <dd className="text-right text-ink-700">{state.trip.title}</dd>
                    </div>
                    <div className="flex flex-wrap justify-between gap-x-4 border-b border-sand-200 pb-2.5">
                      <dt className="text-ink/60">Dates</dt>
                      <dd className="text-right text-ink-700">{dateRange(state.dep.start, state.dep.nights)}</dd>
                    </div>
                    <div className="flex flex-wrap justify-between gap-x-4 border-b border-sand-200 pb-2.5">
                      <dt className="text-ink/60">Boat</dt>
                      <dd className="text-right text-ink-700">{state.boat.name}</dd>
                    </div>
                    <div className="flex flex-wrap justify-between gap-x-4 border-b border-sand-200 pb-2.5">
                      <dt className="text-ink/60">Boards &amp; ends</dt>
                      <dd className="text-right text-ink-700">{state.trip.gateway}</dd>
                    </div>
                    <div className="flex flex-wrap justify-between gap-x-4">
                      <dt className="text-ink/60">Reference</dt>
                      <dd className="text-right text-ink-700">{state.dep.id}</dd>
                    </div>
                  </dl>
                </div>

                <div className="mt-4 rounded-2xl bg-white p-5 lg:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="font-mark text-[11px] uppercase tracking-[0.16em] text-ink-700">Guests</h2>
                    <button type="button" onClick={() => goto(5)} className="font-mark text-[11px] uppercase tracking-[0.14em] text-flame-600 underline underline-offset-4">
                      Change
                    </button>
                  </div>
                  <ul className="mt-4 space-y-2.5">
                    {state.guestList.map((g, i) => (
                      <li key={i} className="flex flex-wrap items-baseline justify-between gap-x-4 border-b border-sand-200 pb-2.5 text-sm last:border-0 last:pb-0">
                        <span className="text-ink-700">{g.name || (i === 0 ? 'Lead guest — name missing' : `Guest ${i + 1} — name to follow`)}</span>
                        <span className="text-xs text-mist-700">
                          {g.band}
                          {g.diving !== 'none' ? <> · {DIVING_LABELS[g.diving]}</> : null}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs text-ink/55">
                    {state.lead.email}
                    {state.lead.phone ? <> · {state.lead.phone}</> : null}
                  </p>
                </div>

                <div className="mt-4 rounded-2xl bg-white p-5 lg:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="font-mark text-[11px] uppercase tracking-[0.16em] text-ink-700">Full breakdown</h2>
                    <button type="button" onClick={() => goto(3)} className="font-mark text-[11px] uppercase tracking-[0.14em] text-flame-600 underline underline-offset-4">
                      Change cabin
                    </button>
                  </div>

                  <table className="mt-4 w-full text-sm">
                    <caption className="sr-only">Price breakdown for this reservation</caption>
                    <tbody>
                      {priceLines.map((line) => (
                        <tr key={line.label} className="border-b border-sand-200">
                          <th scope="row" className="py-2.5 text-left font-normal text-ink/70">
                            {line.label}
                            <span className="block text-xs text-ink/50">{line.detail}</span>
                          </th>
                          <td className="tnum py-2.5 text-right text-ink-700">{money(line.amount)}</td>
                        </tr>
                      ))}
                      {discount > 0 ? (
                        <tr className="border-b border-sand-200">
                          <th scope="row" className="py-2.5 text-left font-normal text-flame-600">
                            Voucher {state.voucher.applied}
                          </th>
                          <td className="tnum py-2.5 text-right text-flame-600">{money(-discount)}</td>
                        </tr>
                      ) : null}
                      <tr className="border-b-2 border-ink/15">
                        <th scope="row" className="py-3 text-left font-mark text-[11px] uppercase tracking-[0.14em] text-ink-700">
                          Total, all guests
                        </th>
                        <td className="tnum py-3 text-right font-display text-xl text-ink-700">{money(total)}</td>
                      </tr>
                      <tr>
                        <th scope="row" className="py-2.5 text-left font-normal text-ink-700">
                          Deposit to reserve
                          <span className="block text-xs text-ink/50">{Math.round(state.dep.deposit * 100)}% — payment link follows, not charged now</span>
                        </th>
                        <td className="tnum py-2.5 text-right font-display text-lg text-deep-700">{money(deposit)}</td>
                      </tr>
                      <tr>
                        <th scope="row" className="py-2.5 text-left font-normal text-ink/70">
                          Balance, due 60 days before you sail
                        </th>
                        <td className="tnum py-2.5 text-right text-ink-700">{money(total - deposit)}</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="mt-5 border-t border-sand-200 pt-5">
                    {!state.voucher.applied ? (
                      <div>
                        <label className="block">
                          <span className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Voucher or agent code</span>
                          <span className="mt-1.5 flex gap-2">
                            <Input
                              type="text"
                              placeholder="If you have one"
                              value={state.voucher.code}
                              onChange={(e) => dispatch({ type: 'SET_VOUCHER_CODE', code: e.target.value })}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  dispatch({ type: 'APPLY_VOUCHER' });
                                }
                              }}
                              aria-invalid={state.voucher.error ? true : undefined}
                              className="h-12 flex-1 rounded-xl border-sand-300 bg-sand uppercase tracking-wider text-ink-700 placeholder:normal-case placeholder:tracking-normal placeholder:text-ink/35"
                            />
                            <button
                              type="button"
                              onClick={() => dispatch({ type: 'APPLY_VOUCHER' })}
                              className="h-12 shrink-0 rounded-xl border border-ink/20 px-5 font-mark text-[11px] uppercase tracking-[0.12em] text-ink-700 transition hover:border-ink hover:bg-ink hover:text-white"
                            >
                              Apply
                            </button>
                          </span>
                        </label>
                        {state.voucher.error ? (
                          <p role="alert" className="mt-2 text-sm text-flame-600">
                            {state.voucher.error}
                          </p>
                        ) : null}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-4 rounded-xl bg-mist-50 p-3.5">
                        <p className="text-sm text-ink/80">
                          <strong className="text-ink-700">{state.voucher.applied}</strong> applied — {Math.round(state.voucher.rate * 100)}% off the cabin fare.
                        </p>
                        <button type="button" onClick={() => dispatch({ type: 'REMOVE_VOUCHER' })} className="font-mark text-[11px] uppercase tracking-[0.14em] text-flame-600 underline underline-offset-4">
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-white p-5 lg:p-6">
                  <h2 className="font-mark text-[11px] uppercase tracking-[0.16em] text-ink-700">Before you reserve</h2>
                  <div className="mt-4 space-y-4">
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={state.consent.terms}
                        onChange={(e) => dispatch({ type: 'SET_CONSENT', field: 'terms', value: e.target.checked })}
                        aria-invalid={state.errors.terms ? true : undefined}
                        className="mt-0.5 h-5 w-5 rounded border-sand-300 text-flame focus:ring-mist/40"
                      />
                      <span className="text-sm leading-relaxed text-ink/80">
                        I have read the{' '}
                        <Link href={routes.policies('terms')} className="text-flame-600 underline underline-offset-4">
                          booking terms
                        </Link>{' '}
                        and the{' '}
                        <Link href={routes.policies('cancellation')} className="text-flame-600 underline underline-offset-4">
                          cancellation policy
                        </Link>
                        . <span className="text-flame">*</span>
                      </span>
                    </label>
                    {state.errors.terms ? (
                      <p role="alert" className="text-sm text-flame-600">
                        {state.errors.terms}
                      </p>
                    ) : null}

                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={state.consent.insurance}
                        onChange={(e) => dispatch({ type: 'SET_CONSENT', field: 'insurance', value: e.target.checked })}
                        aria-invalid={state.errors.insurance ? true : undefined}
                        className="mt-0.5 h-5 w-5 rounded border-sand-300 text-flame focus:ring-mist/40"
                      />
                      <span className="text-sm leading-relaxed text-ink/80">
                        Everyone in my party will hold travel insurance covering emergency evacuation, and diving to the depth they intend to dive. <span className="text-flame">*</span>
                        <span className="mt-0.5 block text-xs text-ink/55">We are DAN-affiliated and will ask for the policy number with the joining form.</span>
                      </span>
                    </label>
                    {state.errors.insurance ? (
                      <p role="alert" className="text-sm text-flame-600">
                        {state.errors.insurance}
                      </p>
                    ) : null}

                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={state.consent.newsletter}
                        onChange={(e) => dispatch({ type: 'SET_CONSENT', field: 'newsletter', value: e.target.checked })}
                        className="mt-0.5 h-5 w-5 rounded border-sand-300 text-flame focus:ring-mist/40"
                      />
                      <span className="text-sm leading-relaxed text-ink/80">Send me the familia letter, once a month.</span>
                    </label>
                  </div>
                </div>

                {submitError ? (
                  <div role="alert" className="mt-4 rounded-2xl border border-flame/25 bg-flame/5 p-5">
                    <h2 className="font-display text-lg text-ink-700">The reservation did not go through</h2>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink/75">
                      Nothing was charged and nothing is lost — every answer is still on this screen. Your cabin is not held yet, so if the date is nearly full, message the office and quote{' '}
                      <strong className="text-ink-700">{state.dep.id}</strong>.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button type="button" onClick={onSubmit} className="inline-flex h-11 items-center gap-2 rounded-full bg-flame px-5 font-mark text-[11px] uppercase tracking-[0.12em] text-white transition hover:bg-flame-600">
                        Try again
                      </button>
                      <a href="https://wa.me/6281100000000" target="_blank" rel="noopener" className="inline-flex h-11 items-center rounded-full border border-ink/20 px-5 font-mark text-[11px] uppercase tracking-[0.12em] text-ink-700 transition hover:border-ink">
                        Message the office
                      </a>
                    </div>
                  </div>
                ) : null}
              </section>
            ) : null}
          </div>

          {state.step > 1 && state.dep && state.trip && state.water && state.boat ? (
            <aside className="hidden lg:block">
              <div className="lg:sticky lg:top-28">
                <div className="overflow-hidden rounded-3xl bg-white shadow-card">
                  <VoyageSummary
                    trip={state.trip}
                    water={state.water}
                    boat={state.boat}
                    cabin={state.cabin}
                    dateRange={dateRange(state.dep.start, state.dep.nights)}
                    nights={nights(state.dep.nights)}
                    totalGuests={totalGuests}
                    guestsLabel={guestsLabel(totalGuests)}
                    priceLines={priceLines}
                    discount={discount}
                    voucher={state.voucher.applied}
                    total={total}
                    deposit={deposit}
                    money={money}
                    onGoto={goto}
                  />
                </div>
                <p className="mt-4 px-1 text-xs leading-relaxed text-ink/55">
                  Prices shown are converted at our weekly rate. The invoice is issued in the currency you choose at checkout, and that is the rate you pay.
                </p>
              </div>
            </aside>
          ) : null}
        </div>
      </div>

      {state.sheet && state.dep && state.trip && state.water && state.boat ? (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Your voyage summary">
          <div className="absolute inset-0 bg-ink-950/60" onClick={() => dispatch({ type: 'SET_SHEET', open: false })} />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white pb-24">
            <div className="sticky top-0 flex items-center justify-between border-b border-sand-200 bg-white px-5 py-4">
              <h2 className="font-mark text-[11px] uppercase tracking-[0.16em] text-ink-700">Your voyage</h2>
              <button type="button" onClick={() => dispatch({ type: 'SET_SHEET', open: false })} aria-label="Close summary" className="grid h-9 w-9 place-items-center rounded-full text-ink/50 transition hover:bg-sand">
                <Cross className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <VoyageSummary
              bare
              trip={state.trip}
              water={state.water}
              boat={state.boat}
              cabin={state.cabin}
              dateRange={dateRange(state.dep.start, state.dep.nights)}
              nights={nights(state.dep.nights)}
              totalGuests={totalGuests}
              guestsLabel={guestsLabel(totalGuests)}
              priceLines={priceLines}
              discount={discount}
              voucher={state.voucher.applied}
              total={total}
              deposit={deposit}
              money={money}
              onGoto={goto}
            />
          </div>
        </div>
      ) : null}

      <FunnelFooter
        left={
          <button
            type="button"
            onClick={back}
            disabled={state.step === 1}
            className="inline-flex h-12 items-center gap-2 rounded-full border border-sand-300 px-4 font-mark text-[12px] uppercase tracking-[0.14em] text-ink-700 transition hover:border-ink disabled:opacity-40 sm:px-5"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Back</span>
          </button>
        }
        center={
          state.step > 1 ? (
            <button type="button" onClick={() => dispatch({ type: 'SET_SHEET', open: true })} className="min-w-0 flex-1 text-left lg:pointer-events-none">
              <span className="flex items-center gap-1.5">
                <span className="truncate font-mark text-[10px] uppercase tracking-[0.14em] text-mist-700">{footerHint}</span>
                <ChevronDown className="h-3.5 w-3.5 shrink-0 text-mist-700 lg:hidden" aria-hidden="true" />
              </span>
              <span className="block text-sm text-ink-700">
                {state.cabin ? (
                  <>
                    <span className="tnum font-display text-base">{money(total)}</span> <span className="text-xs text-ink/55">total · {guestsLabel(totalGuests)}</span>
                  </>
                ) : (
                  <span className="text-xs text-ink/55">No cabin chosen yet</span>
                )}
              </span>
            </button>
          ) : (
            <p className="truncate font-mark text-[10px] uppercase tracking-[0.14em] text-mist-700">{footerHint}</p>
          )
        }
        right={
          state.step < 6 ? (
            <button
              type="button"
              onClick={next}
              disabled={!canContinueOf(state)}
              className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-flame px-5 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-flame-600 disabled:opacity-40 sm:px-6"
            >
              <span>{state.step === 5 ? 'Review' : 'Continue'}</span>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onSubmit}
              disabled={busy}
              className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-flame px-5 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-flame-600 disabled:opacity-60 sm:px-6"
            >
              {busy ? 'Reserving…' : 'Reserve my cabin'}
            </button>
          )
        }
      />
      <IndeterminateBar show={busy} />
    </main>
  );
}
