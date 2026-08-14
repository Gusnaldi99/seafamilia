'use client';

/**
 * Ported from discover.html's `guidedDiscovery()`. One real fix along the
 * way: the original's `href()` drops empty-string query values, so
 * choosing "no preference" on any of the four questions is indistinguishable
 * from not having answered it yet once it round-trips through the URL —
 * the documented QA deep link for the step-5 empty state silently lands on
 * step 4 instead. Here, an explicit answer of "no preference" serializes
 * as `?key=any`; only a genuinely absent param means "unanswered". See
 * encodeAnswer/decodeAnswer below.
 */
import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check, Cross, EmptyStateIcon, EXPERIENCE_ICONS, ChevronLeft, ChevronRight, Minus, Plus } from '@/components/icons';
import { CardSkeleton } from '@/components/states/card-skeleton';
import { PhotoPlate } from '@/components/media/photo-plate';
import { FunnelStepper, type FunnelStep } from '@/components/funnel/funnel-stepper';
import { FunnelFooter } from '@/components/funnel/funnel-footer';
import { useListingLoad } from '@/hooks/use-listing-load';
import { filterTrips } from '@/lib/queries';
import { forcedStateFrom, emptied } from '@/lib/qa';
import { PHOTO_SIZES } from '@/lib/photo-paths';
import { routes } from '@/lib/routes';
import { experiences, waters, lengths, parties, type LengthSlug, type PartySlug } from '@/lib/data';
import { cn } from '@/lib/utils';

type Key = 'experience' | 'water' | 'length' | 'party';
const ORDER: Key[] = ['experience', 'water', 'length', 'party'];

interface Answers {
  experience: string | null;
  water: string | null;
  length: string | null;
  party: string | null;
  guests: number;
}

const STEPS: FunnelStep[] = [
  { key: 'experience', label: 'Experience' },
  { key: 'water', label: 'Waters' },
  { key: 'length', label: 'Length' },
  { key: 'party', label: 'Who' },
  { key: 'matches', label: 'Matches' },
];

const STEP_PROMPTS = ['Choose what matters most', 'Choose a region, or say surprise me', 'Choose how long', 'Choose who is coming'];

const CLEAR_LABEL: Record<Key, string> = {
  experience: 'Any experience',
  water: 'Anywhere',
  length: 'Any length',
  party: 'Anyone',
};

/** '' (no preference) round-trips through the URL as the literal `any` —
 * only an absent param means "unanswered". */
function encodeAnswer(v: string | null): string | undefined {
  if (v === null) return undefined;
  if (v === '') return 'any';
  return v;
}
function decodeAnswer(v: string | null): string | null {
  if (v === null) return null;
  if (v === 'any') return '';
  return v;
}

function firstUnanswered(answers: Answers): number {
  for (let i = 0; i < ORDER.length; i++) {
    if (answers[ORDER[i]] === null) return i + 1;
  }
  return 5;
}

export function GuidedDiscovery({
  tripCards,
  departureCards,
  departureTrips,
}: {
  tripCards: Record<string, React.ReactNode>;
  departureCards: Record<string, React.ReactNode>;
  departureTrips: Record<string, string>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const forced = forcedStateFrom(searchParams.get('state'));

  const [answers, setAnswers] = React.useState<Answers>(() => ({
    experience: decodeAnswer(searchParams.get('experience')),
    water: decodeAnswer(searchParams.get('water')),
    length: decodeAnswer(searchParams.get('length')),
    party: decodeAnswer(searchParams.get('party')),
    guests: Math.max(1, Math.min(20, Number(searchParams.get('guests')) || 2)),
  }));
  const [step, setStep] = React.useState(() => {
    const wanted = Math.max(1, Math.min(5, Number(searchParams.get('step')) || 1));
    return Math.min(wanted, firstUnanswered(answers));
  });
  const [furthest, setFurthest] = React.useState(step);

  const filters = React.useMemo(
    () => ({
      experience: answers.experience || undefined,
      water: answers.water || undefined,
      length: (answers.length || undefined) as LengthSlug | undefined,
      party: (answers.party || undefined) as PartySlug | undefined,
    }),
    [answers]
  );

  const { state, reload } = useListingLoad(forced, 500);
  const prevStepRef = React.useRef(step);
  React.useEffect(() => {
    if (step === 5 && prevStepRef.current !== 5) reload();
    prevStepRef.current = step;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  function syncUrl(n: number, push: boolean) {
    const url = routes.plan({
      step: n,
      experience: encodeAnswer(answers.experience),
      water: encodeAnswer(answers.water),
      length: encodeAnswer(answers.length),
      party: encodeAnswer(answers.party),
      guests: answers.guests,
    });
    if (push) router.push(url, { scroll: false });
    else router.replace(url, { scroll: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goto(n: number, push: boolean) {
    if (n > furthest && n > firstUnanswered(answers)) return;
    setStep(n);
    setFurthest((f) => Math.max(f, n));
    syncUrl(n, push);
  }

  function pick(key: Key, value: string) {
    setAnswers((a) => ({ ...a, [key]: value }));
    if (step < 5) {
      const n = Math.min(5, step + 1);
      setStep(n);
      setFurthest((f) => Math.max(f, n));
      // syncUrl reads `answers` from closure, which hasn't re-rendered with
      // the new value yet — build the URL from the just-picked value directly.
      const next = { ...answers, [key]: value };
      const url = routes.plan({
        step: n,
        experience: encodeAnswer(next.experience),
        water: encodeAnswer(next.water),
        length: encodeAnswer(next.length),
        party: encodeAnswer(next.party),
        guests: next.guests,
      });
      router.push(url, { scroll: false });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function clear(key: Key) {
    setAnswers((a) => ({ ...a, [key]: null }));
    const idx = ORDER.indexOf(key);
    goto(idx + 1, false);
  }

  function next() {
    if (answers[STEPS[step - 1].key as Key] === null) return;
    goto(Math.min(5, step + 1), true);
  }
  function back() {
    goto(Math.max(1, step - 1), true);
  }
  function reset() {
    setAnswers({ experience: null, water: null, length: null, party: null, guests: 2 });
    setFurthest(1);
    goto(1, true);
  }

  const canContinue = answers[STEPS[step - 1].key as Key] !== null;
  const footerHint = canContinue
    ? (() => {
        const n = filterTrips(filters).length;
        return `${n} ${n === 1 ? 'itinerary still fits' : 'itineraries still fit'}`;
      })()
    : STEP_PROMPTS[step - 1];

  const chips = ORDER.filter((k) => answers[k] !== null).map((k) => {
    const v = answers[k];
    let label: string;
    if (!v) label = CLEAR_LABEL[k];
    else if (k === 'experience') label = experiences.find((e) => e.slug === v)?.name ?? v;
    else if (k === 'water') label = waters.find((w) => w.slug === v)?.short ?? v;
    else if (k === 'length') label = lengths.find((l) => l.slug === v)?.label ?? v;
    else label = parties.find((p) => p.slug === v)?.label ?? v;
    return { key: k, label };
  });

  const waterOptions = waters.map((w) => ({ ...w, matchCount: filterTrips({ ...filters, water: w.slug }).length }));
  const lengthOptions = lengths.map((l) => ({ ...l, matchCount: filterTrips({ ...filters, length: l.slug }).length }));
  const partyOptions = parties.map((p) => ({ ...p, matchCount: filterTrips({ ...filters, party: p.slug }).length }));

  const matches = React.useMemo(() => emptied(filterTrips(filters), forced), [filters, forced]);

  const relaxOptions =
    state === 'ready' && matches.length === 0
      ? ORDER.filter((k) => answers[k])
          .map((k) => {
            const test = { ...filters, [k]: undefined };
            const count = filterTrips(test).length;
            return count > 0 ? { key: k, count, label: CLEAR_LABEL[k] } : null;
          })
          .filter((x): x is { key: Key; count: number; label: string } => x !== null)
          .sort((a, b) => b.count - a.count)
      : [];

  const matchHeadline =
    matches.length === 0 ? 'Nothing fits — which is worth knowing' : matches.length === 1 ? 'One route does exactly this' : `${matches.length} routes fit what you asked for`;
  const matchSubline = chips.length
    ? `Based on ${chips.map((c) => c.label.toLowerCase()).join(', ')}. Open any of them for the day-by-day.`
    : 'You kept every option open, so this is the whole programme.';

  return (
    <main className="pb-28 lg:pb-32">
      <div className="border-b border-sand-300 bg-white">
        <div className="mx-auto max-w-5xl px-5 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">Guided discovery</p>
              <p className="mt-1 font-mark text-[11px] uppercase tracking-[0.14em] text-mist-700">
                Step {step} of 5 · {STEPS[step - 1].label}
              </p>
            </div>
            <Link href={routes.home()} className="group inline-flex items-center gap-2 font-mark text-[11px] uppercase tracking-[0.16em] text-ink/70 hover:text-flame-600">
              <Cross className="h-4 w-4" aria-hidden="true" />
              Leave the funnel
            </Link>
          </div>

          <FunnelStepper steps={STEPS} current={step} furthest={furthest} onNavigate={(n) => goto(n, false)} />
        </div>
      </div>

      {chips.length > 0 ? (
        <div className="border-b border-sand-300 bg-white/60">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-2 px-5 py-3 sm:px-6 lg:px-8">
            <span className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">So far</span>
            {chips.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => clear(c.key)}
                className="group inline-flex items-center gap-1.5 rounded-full border border-sand-300 bg-white px-3 py-1.5 font-mark text-[11px] uppercase tracking-[0.12em] text-ink-700 transition hover:border-flame hover:text-flame-600"
              >
                <span>{c.label}</span>
                <Cross className="h-3 w-3 opacity-50 group-hover:opacity-100" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-6 lg:px-8 lg:py-16">
        {step === 1 ? (
          <section>
            <h1 className="font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl lg:text-5xl">
              What do you most want out of the week?
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/70">
              Pick the one that matters most. You will probably get two of them anyway — that is how these routes tend to work.
            </p>

            <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {experiences.map((e) => {
                const Icon = EXPERIENCE_ICONS[e.slug as keyof typeof EXPERIENCE_ICONS];
                const selected = answers.experience === e.slug;
                return (
                  <button
                    key={e.slug}
                    type="button"
                    onClick={() => pick('experience', e.slug)}
                    aria-pressed={selected}
                    className={cn(
                      'group relative flex flex-col items-start rounded-2xl border-2 bg-white p-5 text-left transition',
                      selected ? 'border-flame shadow-card' : 'border-sand-300 hover:border-mist'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute right-4 top-4 grid h-6 w-6 place-items-center rounded-full border transition',
                        selected ? 'border-flame bg-flame text-white' : 'border-sand-300 text-transparent'
                      )}
                    >
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    {Icon ? <Icon className="h-8 w-8 text-mist-700" aria-hidden="true" /> : null}
                    <span className="mt-4 pr-8 font-display text-xl leading-tight text-ink-700">{e.name}</span>
                    <span className="mt-1.5 text-sm leading-relaxed text-ink/65">{e.tagline}</span>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => pick('experience', '')}
                aria-pressed={answers.experience === '' && furthest > 1}
                className="flex flex-col items-start justify-center rounded-2xl border-2 border-dashed border-sand-300 p-5 text-left transition hover:border-mist"
              >
                <span className="font-display text-xl leading-tight text-ink-700">Not sure yet</span>
                <span className="mt-1.5 text-sm leading-relaxed text-ink/65">Show me everything and I will react to it.</span>
              </button>
            </div>
          </section>
        ) : null}

        {step === 2 ? (
          <section>
            <h1 className="font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl lg:text-5xl">Which water pulls at you?</h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/70">
              Each region has its own season, so this partly decides when you sail. If you have no preference, say so — it widens what we can offer.
            </p>

            <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {waterOptions.map((w) => {
                const selected = answers.water === w.slug;
                return (
                  <button
                    key={w.slug}
                    type="button"
                    onClick={() => pick('water', w.slug)}
                    aria-pressed={selected}
                    className={cn(
                      'group relative overflow-hidden rounded-2xl border-2 text-left transition',
                      selected ? 'border-flame shadow-card' : 'border-sand-300 hover:border-mist'
                    )}
                  >
                    <span className="relative block h-28 w-full">
                      <PhotoPlate ph={w.ph} src={null} alt={w.name} sizes={PHOTO_SIZES.waterCard} />
                      <span className="scrim-soft absolute inset-0 block" />
                      <span className="absolute bottom-2.5 left-4 font-mark text-[10px] uppercase tracking-[0.16em] text-white/80">{w.season}</span>
                      {selected ? (
                        <span className="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-full bg-flame text-white">
                          <Check className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </span>
                    <span className="block bg-white p-4">
                      <span className="block font-display text-lg leading-tight text-ink-700">{w.name}</span>
                      <span className="mt-1 block text-xs leading-relaxed text-ink/60">
                        {w.matchCount} matching {w.matchCount === 1 ? 'itinerary' : 'itineraries'} · from {w.gateway}
                      </span>
                    </span>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => pick('water', '')}
                className="flex flex-col items-start justify-center rounded-2xl border-2 border-dashed border-sand-300 p-5 text-left transition hover:border-mist"
              >
                <span className="font-display text-xl leading-tight text-ink-700">Surprise me</span>
                <span className="mt-1.5 text-sm leading-relaxed text-ink/65">Anywhere we sail. The crew have opinions and are happy to share them.</span>
              </button>
            </div>
          </section>
        ) : null}

        {step === 3 ? (
          <section>
            <h1 className="font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl lg:text-5xl">How long can you be away?</h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/70">
              Count the flights. Getting to Sorong or Ambon eats a day at each end, which is why our remote crossings are long ones.
            </p>

            <div className="mt-9 grid gap-3 sm:grid-cols-3">
              {lengthOptions.map((l) => {
                const selected = answers.length === l.slug;
                return (
                  <button
                    key={l.slug}
                    type="button"
                    onClick={() => pick('length', l.slug)}
                    aria-pressed={selected}
                    className={cn(
                      'group relative flex flex-col items-start rounded-2xl border-2 bg-white p-6 text-left transition',
                      selected ? 'border-flame shadow-card' : 'border-sand-300 hover:border-mist'
                    )}
                  >
                    <span className="font-display text-3xl font-light text-ink-700">{l.label}</span>
                    <span className="mt-2 font-mark text-[11px] uppercase tracking-[0.14em] text-flame">{l.note}</span>
                    <span className="mt-4 text-sm text-ink/60">
                      {l.matchCount} {l.matchCount === 1 ? 'route' : 'routes'} at this length
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => pick('length', '')}
              className="mt-3 w-full rounded-2xl border-2 border-dashed border-sand-300 p-5 text-left transition hover:border-mist"
            >
              <span className="font-display text-xl text-ink-700">Flexible</span>
              <span className="mt-1 block text-sm text-ink/65">Show me every length and I will work around it.</span>
            </button>
          </section>
        ) : null}

        {step === 4 ? (
          <section>
            <h1 className="font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl lg:text-5xl">Who is coming with you?</h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/70">
              This changes the boat more than the route. Some hulls are built for children; one is built for eight people who want quiet.
            </p>

            <div className="mt-9 grid gap-3 sm:grid-cols-2">
              {partyOptions.map((p) => {
                const selected = answers.party === p.slug;
                return (
                  <button
                    key={p.slug}
                    type="button"
                    onClick={() => pick('party', p.slug)}
                    aria-pressed={selected}
                    className={cn(
                      'group relative flex items-center justify-between gap-4 rounded-2xl border-2 bg-white p-5 text-left transition',
                      selected ? 'border-flame shadow-card' : 'border-sand-300 hover:border-mist'
                    )}
                  >
                    <span>
                      <span className="block font-display text-xl leading-tight text-ink-700">{p.label}</span>
                      <span className="mt-1 block text-sm text-ink/65">{p.note}</span>
                      <span className="mt-2 block font-mark text-[10px] uppercase tracking-[0.14em] text-mist-700">{p.matchCount} matching</span>
                    </span>
                    <span
                      className={cn(
                        'grid h-7 w-7 shrink-0 place-items-center rounded-full border transition',
                        selected ? 'border-flame bg-flame text-white' : 'border-sand-300 text-transparent'
                      )}
                    >
                      <Check className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-2xl bg-white p-5">
              <label className="flex flex-wrap items-center gap-3">
                <span className="font-mark text-[11px] uppercase tracking-[0.16em] text-ink-700">Roughly how many of you?</span>
                <span className="inline-flex items-center rounded-full border border-sand-300">
                  <button
                    type="button"
                    onClick={() => setAnswers((a) => ({ ...a, guests: Math.max(1, a.guests - 1) }))}
                    className="grid h-11 w-11 place-items-center rounded-l-full text-ink-700 transition hover:bg-sand"
                    aria-label="One fewer guest"
                  >
                    <Minus className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={answers.guests}
                    onChange={(e) => {
                      const n = Number(e.target.value);
                      if (Number.isFinite(n)) setAnswers((a) => ({ ...a, guests: Math.max(1, Math.min(20, n)) }));
                    }}
                    className="counter-input h-11 w-14 border-0 bg-transparent p-0 text-center font-display text-lg text-ink-700 focus:ring-0"
                    aria-label="Number of guests"
                  />
                  <button
                    type="button"
                    onClick={() => setAnswers((a) => ({ ...a, guests: Math.min(20, a.guests + 1) }))}
                    className="grid h-11 w-11 place-items-center rounded-r-full text-ink-700 transition hover:bg-sand"
                    aria-label="One more guest"
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                  </button>
                </span>
                {answers.guests >= 8 ? (
                  <span className="text-sm text-ink/60">
                    At {answers.guests} you may be better off taking a whole boat —{' '}
                    <Link href={routes.charter()} className="text-flame-600 underline underline-offset-4">
                      see charter
                    </Link>
                    .
                  </span>
                ) : null}
              </label>
            </div>
          </section>
        ) : null}

        {step === 5 ? (
          <section>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-xl">
                <p className="font-mark text-eyebrow uppercase text-flame">Your matches</p>
                <h1 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl lg:text-5xl">{matchHeadline}</h1>
                <p className="mt-4 text-base leading-relaxed text-ink/70">{matchSubline}</p>
              </div>
              <button type="button" onClick={reset} className="font-mark text-[11px] uppercase tracking-[0.16em] text-flame-600 underline underline-offset-4">
                Start the five questions again
              </button>
            </div>

            {state === 'loading' ? (
              <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:gap-6">
                <CardSkeleton kind="trip" count={2} />
              </div>
            ) : matches.length === 0 ? (
              <div className="mt-10">
                <div className="rounded-3xl border border-dashed border-mist-300 bg-white px-6 py-12 text-center">
                  <EmptyStateIcon className="mx-auto h-12 w-12 text-mist-400" aria-hidden="true" />
                  <h2 className="mt-5 font-display text-2xl text-ink-700">Nothing fits all four answers</h2>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink/70">
                    That is useful information rather than a dead end. Loosen one answer and see what appears — or let us build it as a private charter, which is
                    where most impossible combinations end up.
                  </p>

                  {relaxOptions.length > 0 ? (
                    <div className="mt-7">
                      <p className="font-mark text-[11px] uppercase tracking-[0.16em] text-mist-700">Drop one answer</p>
                      <div className="mt-3 flex flex-wrap justify-center gap-2">
                        {relaxOptions.map((r) => (
                          <button
                            key={r.key}
                            type="button"
                            onClick={() => clear(r.key)}
                            className="rounded-full border border-sand-300 px-4 py-2 font-mark text-[11px] uppercase tracking-[0.12em] text-ink-700 transition hover:border-flame hover:text-flame-600"
                          >
                            <span>{r.label}</span>
                            <span className="text-mist-700">
                              {' '}
                              · {r.count} match
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                    <Link href={routes.charter()} className="inline-flex h-12 items-center rounded-full bg-flame px-6 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-flame-600">
                      Build it as a charter
                    </Link>
                    <Link
                      href={routes.contact()}
                      className="inline-flex h-12 items-center rounded-full border border-ink/20 px-6 font-mark text-[12px] uppercase tracking-[0.14em] text-ink-700 transition hover:border-ink hover:bg-ink hover:text-white"
                    >
                      Ask a person
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <MatchResults matches={matches} tripCards={tripCards} departureCards={departureCards} departureTrips={departureTrips} answers={answers} />
            )}
          </section>
        ) : null}
      </div>

      <FunnelFooter
        left={
          <button
            type="button"
            onClick={back}
            disabled={step === 1}
            className="inline-flex h-12 items-center gap-2 rounded-full border border-sand-300 px-5 font-mark text-[12px] uppercase tracking-[0.14em] text-ink-700 transition hover:border-ink disabled:opacity-40 disabled:hover:border-sand-300"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Back</span>
          </button>
        }
        center={
          <p className="truncate font-mark text-[11px] uppercase tracking-[0.14em] text-mist-700">
            {step < 5 ? footerHint : `${matches.length} ${matches.length === 1 ? 'match' : 'matches'}`}
          </p>
        }
        right={
          step < 5 ? (
            <button
              type="button"
              onClick={next}
              disabled={!canContinue}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-flame px-6 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-flame-600 disabled:opacity-40"
            >
              <span>{step === 4 ? 'See matches' : 'Continue'}</span>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : (
            <Link href={routes.departures()} className="inline-flex h-12 items-center gap-2 rounded-full bg-flame px-6 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-flame-600">
              All departures
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          )
        }
      />
    </main>
  );
}

function MatchResults({
  matches,
  tripCards,
  departureCards,
  departureTrips,
  answers,
}: {
  matches: ReturnType<typeof filterTrips>;
  tripCards: Record<string, React.ReactNode>;
  departureCards: Record<string, React.ReactNode>;
  departureTrips: Record<string, string>;
  answers: Answers;
}) {
  const matchDepartures = React.useMemo(() => {
    const slugs = new Set(matches.map((t) => t.slug));
    return Object.entries(departureCards).filter(([id]) => slugs.has(departureTrips[id])).slice(0, 3);
  }, [matches, departureCards, departureTrips]);

  return (
    <div className="mt-10 space-y-10">
      <div className="grid gap-8 sm:grid-cols-2 lg:gap-6">
        {matches.map((t) => (
          <React.Fragment key={t.slug}>{tripCards[t.slug]}</React.Fragment>
        ))}
      </div>

      {matchDepartures.length > 0 ? (
        <div className="rounded-3xl bg-white p-6 lg:p-8">
          <h2 className="font-display text-2xl font-light text-ink-700">The next dates on these routes</h2>
          <p className="mt-2 text-sm text-ink/65">Straight to a cabin, if you already know.</p>
          <div className="mt-6 space-y-3">
            {matchDepartures.map(([id, card]) => <React.Fragment key={id}>{card}</React.Fragment>)}
          </div>
        </div>
      ) : null}

      <p className="text-sm text-ink/60">
        Not quite it?{' '}
        <Link
          href={`${routes.experiences({ experience: answers.experience || undefined, water: answers.water || undefined, length: (answers.length as LengthSlug) || undefined, party: (answers.party as PartySlug) || undefined })}#matching`}
          className="text-flame-600 underline underline-offset-4"
        >
          Open these filters in the full index
        </Link>{' '}
        and adjust freely.
      </p>
    </div>
  );
}

