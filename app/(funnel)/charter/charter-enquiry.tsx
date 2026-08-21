'use client';

/** Ported from charter.html's `charterFunnel()` — one react-hook-form
 * instance for the whole enquiry (steps 2-4); `step` is local state, not
 * part of the form. Step 3 (boat/waters/experiences/notes) has no
 * validation in the original and next() advances unconditionally there. */
import * as React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PhotoPlate } from '@/components/media/photo-plate';
import { FunnelFooter } from '@/components/funnel/funnel-footer';
import { IndeterminateBar } from '@/components/funnel/indeterminate-bar';
import { Stepper } from '@/components/form/stepper';
import { BigCheck, Check, ChevronLeft, ChevronRight, Cross, EXPERIENCE_ICONS } from '@/components/icons';
import { submitCharterEnquiry } from './actions';
import { CHARTER_DEFAULTS, CONTACT_VIA, COUNTERS, NIGHTS_OPTIONS, charterSchema, type CharterFormValues } from './schema';
import { useLocale } from '@/components/providers/locale-provider';
import { boatBySlug, waterBySlug } from '@/lib/queries';
import { forcedStateFrom } from '@/lib/qa';
import { routes } from '@/lib/routes';
import { toast } from '@/lib/toast';
import { boats, waters, experiences } from '@/lib/data';
import { cn } from '@/lib/utils';

const PROGRESS_STEPS = [2, 3, 4];
const STEP_LABELS: Record<number, string> = { 2: 'Dates and group', 3: 'Preferences', 4: 'Your details' };
// Fares differ per boat (e.g. dive support is Sea Familia 2 only) — the
// step-1 preview, shown before a boat is chosen, lists only what every boat
// includes.
const COMMON_INCLUDED = boats[0]?.included.filter((i) => boats.every((b) => b.included.includes(i))) ?? [];

function computeDefaults(searchParams: URLSearchParams): CharterFormValues {
  let values = { ...CHARTER_DEFAULTS };
  if (typeof window !== 'undefined') {
    try {
      const saved = window.sessionStorage.getItem('sf.charter');
      if (saved) values = { ...values, ...JSON.parse(saved) };
    } catch {
      // ignore malformed/unavailable storage
    }
  }
  const boat = searchParams.get('boat');
  if (boat && boatBySlug(boat)) values.boat = boat;
  const water = searchParams.get('water');
  if (water && waterBySlug(water) && !values.waters.includes(water)) values.waters = [...values.waters, water];
  return values;
}

export function CharterEnquiry() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const forced = forcedStateFrom(searchParams.get('state'));
  const { money, date } = useLocale();

  const [step, setStep] = React.useState(() => Math.max(1, Math.min(4, Number(searchParams.get('step')) || 1)));
  const [busy, setBusy] = React.useState(false);
  const [submitError, setSubmitError] = React.useState(false);
  const [reference, setReference] = React.useState('');
  const todayIso = React.useMemo(() => new Date().toISOString().slice(0, 10), []);

  const form = useForm<CharterFormValues>({
    resolver: zodResolver(charterSchema),
    defaultValues: computeDefaults(searchParams),
  });

  React.useEffect(() => {
    const sub = form.watch((value) => {
      try {
        window.sessionStorage.setItem('sf.charter', JSON.stringify(value));
      } catch {
        // ignore quota/availability errors — the draft just won't survive a reload
      }
    });
    return () => sub.unsubscribe();
  }, [form]);

  const values = form.watch();
  const groupTotal = values.adults + values.teens + values.children;
  const fitsBoats = boats.filter((b) => b.guests >= groupTotal);
  const selectedBoat = values.boat && values.boat !== 'recommend' ? boatBySlug(values.boat) : undefined;
  const waterOptions = selectedBoat ? waters.filter((w) => selectedBoat.waters.includes(w.slug)) : waters;
  const experienceOptions = selectedBoat && !selectedBoat.offersDiving ? experiences.filter((e) => e.slug !== 'diving') : experiences;

  React.useEffect(() => {
    if (!selectedBoat) return;
    const validWaters = values.waters.filter((s) => selectedBoat.waters.includes(s));
    if (validWaters.length !== values.waters.length) form.setValue('waters', validWaters);
    if (!selectedBoat.offersDiving && values.experiences.includes('diving')) {
      form.setValue('experiences', values.experiences.filter((s) => s !== 'diving'));
    }
    // Only re-run when the boat choice itself changes — pruning waters/experiences here would re-trigger this effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.boat]);

  function goto(n: number) {
    const target = Math.max(1, Math.min(5, n));
    setStep(target);
    router.replace(routes.charter({ step: target <= 4 ? target : undefined }), { scroll: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function next() {
    if (step === 2) {
      const ok = await form.trigger(['from', 'to', 'flexible', 'adults', 'teens', 'children']);
      if (!ok) return;
    }
    goto(step + 1);
  }
  function back() {
    goto(step - 1);
  }

  function toggle(key: 'waters' | 'experiences', slug: string) {
    const current = form.getValues(key);
    form.setValue(key, current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug]);
  }

  async function onSubmit(data: CharterFormValues) {
    setBusy(true);
    setSubmitError(false);
    const result = await submitCharterEnquiry(data, forced === 'error');
    if (!result.ok) {
      setBusy(false);
      setSubmitError(true);
      toast({ title: 'That did not send', body: 'Your answers are still on screen. Try again, or email charter@seafamilia.com.', variant: 'error' });
      return;
    }
    setReference(result.reference ?? '');
    setBusy(false);
    setStep(5);
    try {
      window.sessionStorage.removeItem('sf.charter');
    } catch {
      // ignore
    }
    router.replace('/charter?sent=1', { scroll: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast({ title: 'Charter request sent', body: `Reference ${result.reference}. Ratih replies within one working day.`, variant: 'success' });
  }

  const summaryBoat =
    values.boat === 'recommend' ? 'Your recommendation' : values.boat ? boatBySlug(values.boat)?.name ?? 'Not specified' : 'Not specified';
  const summaryWaters = values.waters.length ? values.waters.map((s) => waterBySlug(s)?.short).join(', ') : 'Open to suggestions';
  const summaryExperiences = values.experiences.length ? values.experiences.map((s) => experiences.find((e) => e.slug === s)?.name).join(', ') : 'Not specified';
  const summaryDates = values.flexible
    ? 'Flexible — advise us'
    : values.from || values.to
      ? [values.from, values.to].filter(Boolean).map((d) => date(d)).join(' → ')
      : 'Not specified';
  const summaryRows = [
    { label: 'Group', value: `${groupTotal} guests (${values.adults} adults, ${values.teens} teens, ${values.children} children)` },
    { label: 'Dates', value: summaryDates },
    { label: 'Length', value: NIGHTS_OPTIONS.find((n) => n.value === values.nights)?.label || 'Not sure yet' },
    { label: 'Boat', value: summaryBoat },
    { label: 'Waters', value: summaryWaters },
    { label: 'Interests', value: summaryExperiences },
    { label: 'Reply via', value: values.contactVia },
  ];

  const footerHint =
    step === 1
      ? 'Three minutes, nothing binding'
      : step === 2
        ? `${groupTotal} guests${values.flexible ? ' · dates flexible' : ''}`
        : step === 3
          ? (() => {
              const bits: string[] = [];
              if (values.boat) bits.push(values.boat === 'recommend' ? 'boat: our pick' : boatBySlug(values.boat)?.name ?? '');
              if (values.waters.length) bits.push(`${values.waters.length} waters`);
              if (values.experiences.length) bits.push(`${values.experiences.length} interests`);
              return bits.length ? bits.join(' · ') : 'All optional — skip if you like';
            })()
          : 'One reply, from a person, within a day';

  if (step === 5) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-14 sm:px-6 lg:py-20">
        <div className="rounded-4xl bg-white p-7 shadow-card lg:p-12">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-mist-100 text-ink-700">
            <BigCheck className="h-8 w-8" aria-hidden="true" />
          </span>
          <p className="mt-6 font-mark text-eyebrow uppercase text-flame">Request sent</p>
          <h1 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">
            Thank you — this is now on Ratih&rsquo;s desk
          </h1>
          <p className="mt-4 text-base leading-relaxed text-ink/70">
            Not a queue, not a CRM. She reads charter enquiries herself each morning, which is why the replies take a day and are worth reading.
          </p>

          <dl className="mt-8 grid gap-4 rounded-2xl bg-sand p-5 sm:grid-cols-2 lg:p-6">
            <div>
              <dt className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Your reference</dt>
              <dd className="mt-1 font-display text-2xl tracking-wide text-ink-700">{reference}</dd>
            </div>
            <div>
              <dt className="font-mark text-[10px] uppercase tracking-[0.16em] text-mist-700">Reply expected</dt>
              <dd className="mt-1 font-display text-2xl text-ink-700">Within 1 working day</dd>
            </div>
          </dl>

          <div className="mt-8">
            <h2 className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">What happens next</h2>
            <ol className="mt-4 space-y-3.5">
              <li className="flex gap-3 text-sm leading-relaxed text-ink/80">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mist" />
                A confirmation email is already on its way to <strong className="text-ink-700">{values.email}</strong>.
              </li>
              <li className="flex gap-3 text-sm leading-relaxed text-ink/80">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mist" />
                Ratih replies with available boats, a firm day rate and a first route sketch.
              </li>
              <li className="flex gap-3 text-sm leading-relaxed text-ink/80">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mist" />
                If it looks right, a call with the cruise director to shape the days.
              </li>
              <li className="flex gap-3 text-sm leading-relaxed text-ink/80">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mist" />
                30% holds the boat. Nothing is charged before you say so.
              </li>
            </ol>
          </div>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="https://wa.me/6281100000000"
              target="_blank"
              rel="noopener"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-ink px-6 py-4 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-ink-600"
            >
              Add it on WhatsApp
            </a>
            <Link
              href={routes.journal()}
              className="inline-flex flex-1 items-center justify-center rounded-full border border-ink/20 px-6 py-4 font-mark text-[12px] uppercase tracking-[0.14em] text-ink-700 transition hover:border-ink"
            >
              Read the journal meanwhile
            </Link>
          </div>

          <p className="mt-6 text-xs leading-relaxed text-ink/50">
            Nothing arrived within a working day? Something went wrong at our end rather than yours — message the office directly on WhatsApp and quote{' '}
            <span className="text-ink-700">{reference}</span>.
          </p>
        </div>
      </section>
    );
  }

  return (
    <main className="pb-28 lg:pb-32">
      {step === 1 ? (
        <section>
          <div className="relative isolate flex min-h-[70vh] items-end overflow-hidden bg-ink">
            <PhotoPlate ph="sunset" src={null} alt="" sizes="100vw" />
            <div className="scrim absolute inset-0" aria-hidden="true" />
            <div className="relative mx-auto w-full max-w-8xl px-5 pb-12 pt-28 sm:px-6 lg:px-8 lg:pb-16">
              <nav aria-label="Breadcrumb" className="font-mark text-[11px] uppercase tracking-[0.16em] text-white/60">
                <Link href={routes.home()} className="hover:text-white">
                  Home
                </Link>
                <span className="px-2" aria-hidden="true">
                  /
                </span>
                <Link href={routes.boats()} className="hover:text-white">
                  Boats
                </Link>
                <span className="px-2" aria-hidden="true">
                  /
                </span>
                <span className="text-white">Private charter</span>
              </nav>
              <div className="mt-8 max-w-2xl">
                <span className="wave-rule wave-rule-light block" aria-hidden="true" />
                <p className="mt-5 font-mark text-eyebrow uppercase text-white/70">Private charter</p>
                <h1 className="mt-4 font-display text-4xl font-light leading-[1.04] tracking-tight text-white sm:text-5xl lg:text-6xl">
                  The whole boat,
                  <br className="hidden sm:block" /> and no strangers at dinner
                </h1>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
                  Twelve to sixteen of you, on any dates a boat is free, sailing a route we draw with you rather than hand to you. Most of our
                  charters are families, a few are dive clubs, and one was a wedding.
                </p>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-8xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
              <div>
                <p className="font-mark text-eyebrow uppercase text-flame">How it works</p>
                <ol className="mt-6 space-y-7">
                  {[
                    { n: '01', title: 'You tell us four things', body: 'Roughly when, roughly how many, which water pulls at you, and what the group actually enjoys. Three minutes, and nothing is binding.' },
                    { n: '02', title: 'Ratih replies within a working day', body: 'A real person, with which boats are free, a firm day rate, and usually an opinion about your dates that you did not ask for.' },
                    { n: '03', title: 'We draw the route together', body: 'One or two calls with the cruise director. Anchorages, dive plan, what time your teenagers are likely to surface, whether anyone gets seasick.' },
                    { n: '04', title: '30% holds the boat', body: 'Balance 60 days out. Dates move once, free of charge, whatever the notice — charter groups have school terms and grandparents to work around.' },
                  ].map((item) => (
                    <li key={item.n} className="grid gap-3 sm:grid-cols-[3rem_1fr] sm:gap-5">
                      <span className="font-display text-2xl text-mist">{item.n}</span>
                      <div>
                        <h2 className="font-display text-xl text-ink-700">{item.title}</h2>
                        <p className="mt-1.5 text-sm leading-relaxed text-ink/70">{item.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <aside className="space-y-4 lg:pt-12">
                <div className="rounded-3xl bg-white p-6 lg:p-7">
                  <h2 className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">Indicative day rates</h2>
                  <p className="mt-2 text-xs leading-relaxed text-ink/60">
                    Per boat, per night, all guests included. High season and remote waters carry a surcharge; long charters carry a discount. The
                    quote you get is firm.
                  </p>
                  <ul className="mt-5 space-y-3">
                    {boats.map((b) => (
                      <li key={b.slug} className="flex items-baseline justify-between gap-4 border-b border-sand-200 pb-3 last:border-0 last:pb-0">
                        <span>
                          <Link href={routes.boat(b.slug)} className="font-display text-base text-ink-700 hover:text-flame-600">
                            {b.name}
                          </Link>
                          <span className="block font-mark text-[10px] uppercase tracking-[0.14em] text-mist-700">Up to {b.guests} guests</span>
                        </span>
                        <span className="shrink-0 text-right">
                          <span className="tnum font-display text-lg text-deep-700">{money(b.charterDay)}</span>
                          <span className="block text-[11px] text-ink/50">per night</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-3xl border border-sand-300 p-6 lg:p-7">
                  <h2 className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">What that covers</h2>
                  <ul className="mt-4 space-y-2.5">
                    {COMMON_INCLUDED.slice(0, 6).map((i) => (
                      <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink/80">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-mist" aria-hidden="true" />
                        <span>{i}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            </div>

            <div className="mt-14 rounded-3xl border border-sand-300 bg-white p-6 lg:p-8">
              <h2 className="font-display text-2xl font-light text-ink-700">Not sure charter is the right shape?</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/70">
                If there are fewer than six of you, an open trip is usually better value and rather more sociable — you get the same boat, crew and
                route for a fraction of the cost, and most guests end up friends by day three.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={routes.departures()}
                  className="inline-flex h-12 items-center rounded-full border border-ink/20 px-6 font-mark text-[12px] uppercase tracking-[0.14em] text-ink-700 transition hover:border-ink hover:bg-ink hover:text-white"
                >
                  Look at open trips
                </Link>
                <Link
                  href={routes.faq()}
                  className="inline-flex h-12 items-center rounded-full border border-ink/20 px-6 font-mark text-[12px] uppercase tracking-[0.14em] text-ink-700 transition hover:border-ink hover:bg-ink hover:text-white"
                >
                  Read the questions we get
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div>
          <div className="border-b border-sand-300 bg-white">
            <div className="mx-auto max-w-3xl px-5 py-5 sm:px-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-mark text-[11px] uppercase tracking-[0.18em] text-flame">Charter enquiry</p>
                  <p className="mt-1 font-mark text-[11px] uppercase tracking-[0.14em] text-mist-700">
                    Step {step - 1} of 3 · {STEP_LABELS[step]}
                  </p>
                </div>
                <button type="button" onClick={() => goto(1)} className="group inline-flex items-center gap-2 font-mark text-[11px] uppercase tracking-[0.16em] text-ink/70 hover:text-flame-600">
                  <Cross className="h-4 w-4" aria-hidden="true" />
                  Save and leave
                </button>
              </div>
              <ol className="mt-5 flex gap-1.5" aria-label="Progress">
                {PROGRESS_STEPS.map((n) => (
                  <li key={n} className="flex-1">
                    <span className={cn('block h-1 rounded-full transition', n < step ? 'bg-flame' : n === step ? 'bg-ink' : 'bg-sand-300')} />
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="mx-auto max-w-3xl px-5 py-10 sm:px-6 lg:py-14">
            {step === 2 ? (
              <section>
                <h1 className="font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">When, and how many of you?</h1>
                <p className="mt-3 text-base leading-relaxed text-ink/70">
                  Approximate is fine. If your dates are flexible, say so — it usually gets you a better boat and a better rate.
                </p>

                <div className="mt-8 space-y-6">
                  <fieldset className="rounded-2xl bg-white p-5 lg:p-6">
                    <legend className="sf-legend flex items-center gap-3 pb-3 font-mark text-[11px] font-medium uppercase tracking-[0.18em] text-ink-700">
                      <span className="h-3.5 w-[3px] shrink-0 rounded-full bg-flame" />
                      <span>Dates</span>
                      <span className="h-px flex-1 bg-sand-300" />
                    </legend>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="text-sm text-ink/70">Earliest you could sail</span>
                        <Input
                          type="date"
                          min={todayIso}
                          disabled={values.flexible}
                          aria-invalid={form.formState.errors.to ? true : undefined}
                          className="mt-1.5 h-12 rounded-xl border-sand-300 bg-sand text-ink-700 disabled:opacity-50"
                          {...form.register('from')}
                        />
                      </label>
                      <label className="block">
                        <span className="text-sm text-ink/70">Latest you would return</span>
                        <Input
                          type="date"
                          min={todayIso}
                          disabled={values.flexible}
                          aria-invalid={form.formState.errors.to ? true : undefined}
                          className="mt-1.5 h-12 rounded-xl border-sand-300 bg-sand text-ink-700 disabled:opacity-50"
                          {...form.register('to')}
                        />
                      </label>
                    </div>

                    <label className="mt-4 flex items-start gap-3">
                      <input type="checkbox" className="mt-0.5 h-5 w-5 rounded border-sand-300 text-flame" {...form.register('flexible')} />
                      <span className="text-sm leading-relaxed text-ink/80">
                        Our dates are open — tell us when the sailing is best.
                        <span className="mt-0.5 block text-xs text-ink/55">
                          Seasons vary by region; this lets us match you to the right water rather than the right week.
                        </span>
                      </span>
                    </label>

                    <label className="mt-4 block">
                      <span className="text-sm text-ink/70">How many nights, roughly?</span>
                      <select
                        className="mt-1.5 h-12 w-full rounded-xl border-sand-300 bg-sand text-ink-700 focus:border-mist focus:ring-2 focus:ring-mist/40"
                        {...form.register('nights')}
                      >
                        {NIGHTS_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    {form.formState.errors.to ? (
                      <p role="alert" className="mt-3 text-sm text-flame-600">
                        {form.formState.errors.to.message}
                      </p>
                    ) : null}
                  </fieldset>

                  <fieldset className="rounded-2xl bg-white p-5 lg:p-6">
                    <legend className="sf-legend flex items-center gap-3 pb-3 font-mark text-[11px] font-medium uppercase tracking-[0.18em] text-ink-700">
                      <span className="h-3.5 w-[3px] shrink-0 rounded-full bg-flame" />
                      <span>Your group</span>
                      <span className="h-px flex-1 bg-sand-300" />
                    </legend>
                    <p className="mt-1 text-xs text-ink/55">We ask about children separately because it changes which boat we suggest, not the price.</p>

                    <div className="mt-4 space-y-4">
                      {COUNTERS.map((c) => (
                        <div key={c.key} className="flex items-center justify-between gap-4 border-b border-sand-200 pb-4 last:border-0 last:pb-0">
                          <span>
                            <span className="block text-sm text-ink-700">{c.label}</span>
                            <span className="block text-xs text-ink/55">{c.note}</span>
                          </span>
                          <Stepper value={values[c.key]} min={c.min} max={c.max} onChange={(n) => form.setValue(c.key, n)} label={c.label.toLowerCase()} />
                        </div>
                      ))}
                    </div>

                    <p className="mt-4 rounded-xl bg-sand p-3.5 text-sm leading-relaxed text-ink/75" aria-live="polite">
                      {groupTotal} guests
                      {groupTotal > 0 ? (
                        <>
                          {' '}
                          · {fitsBoats.length} of our {boats.length} boats fit you
                        </>
                      ) : null}
                      {groupTotal > 20 ? (
                        <span className="block text-flame-600">Larger than our biggest boat — we can run two hulls together, which we have done twice.</span>
                      ) : null}
                      {groupTotal > 0 && groupTotal < 6 ? (
                        <span className="block text-ink/60">At this size an open trip is usually better value. We will say so in the reply, honestly.</span>
                      ) : null}
                    </p>
                    {form.formState.errors.adults ? (
                      <p role="alert" className="mt-3 text-sm text-flame-600">
                        {form.formState.errors.adults.message}
                      </p>
                    ) : null}
                  </fieldset>
                </div>
              </section>
            ) : null}

            {step === 3 ? (
              <section>
                <h1 className="font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">What would make it yours?</h1>
                <p className="mt-3 text-base leading-relaxed text-ink/70">
                  Pick as many as apply, or none — &ldquo;we have no idea, surprise us&rdquo; is a perfectly good brief and one we rather enjoy.
                </p>

                <div className="mt-8 space-y-6">
                  <fieldset className="rounded-2xl bg-white p-5 lg:p-6">
                    <legend className="sf-legend flex items-center gap-3 pb-3 font-mark text-[11px] font-medium uppercase tracking-[0.18em] text-ink-700">
                      <span className="h-3.5 w-[3px] shrink-0 rounded-full bg-flame" />
                      <span>Boat</span>
                      <span className="h-px flex-1 bg-sand-300" />
                    </legend>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {boats.map((b) => {
                        const selected = values.boat === b.slug;
                        const fits = b.guests >= groupTotal;
                        return (
                          <button
                            key={b.slug}
                            type="button"
                            onClick={() => form.setValue('boat', b.slug)}
                            aria-pressed={selected}
                            className={cn('flex items-center gap-3 rounded-xl border-2 p-3 text-left transition', selected ? 'border-flame' : 'border-sand-300 hover:border-mist')}
                          >
                            <span className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-ink">
                              <PhotoPlate ph={b.ph} src={null} alt={b.name} sizes="5rem" />
                            </span>
                            <span className="min-w-0">
                              <span className="block font-display text-base leading-tight text-ink-700">{b.name}</span>
                              <span className="block text-xs text-ink/60">
                                Up to {b.guests} · <span className="tnum">{money(b.charterDay)}</span>/day
                              </span>
                              {!fits ? <span className="mt-0.5 block font-mark text-[10px] uppercase tracking-[0.12em] text-flame-600">Too small for {groupTotal}</span> : null}
                            </span>
                          </button>
                        );
                      })}
                      <button
                        type="button"
                        onClick={() => form.setValue('boat', 'recommend')}
                        aria-pressed={values.boat === 'recommend'}
                        className={cn('rounded-xl border-2 border-dashed p-4 text-left transition sm:col-span-2', values.boat === 'recommend' ? 'border-flame' : 'border-sand-300 hover:border-mist')}
                      >
                        <span className="block font-display text-base text-ink-700">Recommend one for us</span>
                        <span className="block text-xs text-ink/60">Based on the group and the water. This is what most people choose.</span>
                      </button>
                    </div>
                  </fieldset>

                  <fieldset className="rounded-2xl bg-white p-5 lg:p-6">
                    <legend className="sf-legend flex items-center gap-3 pb-3 font-mark text-[11px] font-medium uppercase tracking-[0.18em] text-ink-700">
                      <span className="h-3.5 w-[3px] shrink-0 rounded-full bg-flame" />
                      <span>Waters</span>
                      <span className="h-px flex-1 bg-sand-300" />
                    </legend>
                    <p className="mt-1 text-xs text-ink/55">
                      {selectedBoat
                        ? `${selectedBoat.name} sails ${waterOptions.length > 1 ? 'these waters' : 'this water'}.`
                        : 'Choose any that appeal. Season may decide for us.'}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {waterOptions.map((w) => (
                        <button
                          key={w.slug}
                          type="button"
                          onClick={() => toggle('waters', w.slug)}
                          aria-pressed={values.waters.includes(w.slug)}
                          className={cn(
                            'rounded-full border px-4 py-2 font-mark text-[11px] uppercase tracking-[0.12em] transition',
                            values.waters.includes(w.slug) ? 'border-ink bg-ink text-white' : 'border-sand-300 text-ink-700 hover:border-mist'
                          )}
                        >
                          {w.short}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset className="rounded-2xl bg-white p-5 lg:p-6">
                    <legend className="sf-legend flex items-center gap-3 pb-3 font-mark text-[11px] font-medium uppercase tracking-[0.18em] text-ink-700">
                      <span className="h-3.5 w-[3px] shrink-0 rounded-full bg-flame" />
                      <span>What the group enjoys</span>
                      <span className="h-px flex-1 bg-sand-300" />
                    </legend>
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      {experienceOptions.map((e) => {
                        const Icon = EXPERIENCE_ICONS[e.slug as keyof typeof EXPERIENCE_ICONS];
                        const selected = values.experiences.includes(e.slug);
                        return (
                          <button
                            key={e.slug}
                            type="button"
                            onClick={() => toggle('experiences', e.slug)}
                            aria-pressed={selected}
                            className={cn(
                              'flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition',
                              selected ? 'border-ink bg-ink text-white' : 'border-sand-300 text-ink-700 hover:border-mist'
                            )}
                          >
                            {Icon ? <Icon className="h-5 w-5 shrink-0" aria-hidden="true" /> : null}
                            <span className="text-sm">{e.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>

                  <fieldset className="rounded-2xl bg-white p-5 lg:p-6">
                    <legend className="sf-legend flex items-center gap-3 pb-3 font-mark text-[11px] font-medium uppercase tracking-[0.18em] text-ink-700">
                      <span className="h-3.5 w-[3px] shrink-0 rounded-full bg-flame" />
                      <span>Anything we should know</span>
                      <span className="h-px flex-1 bg-sand-300" />
                    </legend>
                    <label className="mt-3 block">
                      <span className="sr-only">Notes for the office</span>
                      <Textarea
                        rows={4}
                        maxLength={600}
                        placeholder="Celebrating something? Non-swimmers, wheelchair user, a nervous flyer, a chef in the family with opinions? All useful."
                        className="rounded-xl border-sand-300 bg-sand text-ink-700 placeholder:text-ink/40"
                        {...form.register('notes')}
                      />
                    </label>
                    <p className="mt-1.5 text-right text-xs text-ink/45">{(values.notes || '').length} / 600</p>
                  </fieldset>
                </div>
              </section>
            ) : null}

            {step === 4 ? (
              <section>
                <h1 className="font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">Where should Ratih reach you?</h1>
                <p className="mt-3 text-base leading-relaxed text-ink/70">
                  One person from the office, one reply, within a working day. No sequence of automated emails — we do not have one.
                </p>

                <div className="mt-8 space-y-6">
                  <fieldset className="rounded-2xl bg-white p-5 lg:p-6">
                    <legend className="sf-legend flex items-center gap-3 pb-3 font-mark text-[11px] font-medium uppercase tracking-[0.18em] text-ink-700">
                      <span className="h-3.5 w-[3px] shrink-0 rounded-full bg-flame" />
                      <span>You</span>
                      <span className="h-px flex-1 bg-sand-300" />
                    </legend>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <label className="block sm:col-span-2">
                        <span className="text-sm text-ink/70">
                          Your name <span className="text-flame">*</span>
                        </span>
                        <Input
                          type="text"
                          autoComplete="name"
                          aria-invalid={form.formState.errors.name ? true : undefined}
                          className="mt-1.5 h-12 rounded-xl border-sand-300 bg-sand text-ink-700"
                          {...form.register('name')}
                        />
                        {form.formState.errors.name ? (
                          <span role="alert" className="mt-1.5 block text-sm text-flame-600">
                            {form.formState.errors.name.message}
                          </span>
                        ) : null}
                      </label>
                      <label className="block">
                        <span className="text-sm text-ink/70">
                          Email <span className="text-flame">*</span>
                        </span>
                        <Input
                          type="email"
                          autoComplete="email"
                          inputMode="email"
                          aria-invalid={form.formState.errors.email ? true : undefined}
                          className="mt-1.5 h-12 rounded-xl border-sand-300 bg-sand text-ink-700"
                          {...form.register('email')}
                        />
                        {form.formState.errors.email ? (
                          <span role="alert" className="mt-1.5 block text-sm text-flame-600">
                            {form.formState.errors.email.message}
                          </span>
                        ) : null}
                      </label>
                      <label className="block">
                        <span className="text-sm text-ink/70">Phone or WhatsApp</span>
                        <Input
                          type="tel"
                          autoComplete="tel"
                          inputMode="tel"
                          placeholder="+61 400 000 000"
                          className="mt-1.5 h-12 rounded-xl border-sand-300 bg-sand text-ink-700 placeholder:text-ink/35"
                          {...form.register('phone')}
                        />
                      </label>
                      <label className="block sm:col-span-2">
                        <span className="text-sm text-ink/70">Where are you travelling from?</span>
                        <Input
                          type="text"
                          autoComplete="country-name"
                          placeholder="Country or city — it helps us think about flights"
                          className="mt-1.5 h-12 rounded-xl border-sand-300 bg-sand text-ink-700 placeholder:text-ink/35"
                          {...form.register('country')}
                        />
                      </label>
                    </div>
                  </fieldset>

                  <fieldset className="rounded-2xl bg-white p-5 lg:p-6">
                    <legend className="sf-legend flex items-center gap-3 pb-3 font-mark text-[11px] font-medium uppercase tracking-[0.18em] text-ink-700">
                      <span className="h-3.5 w-[3px] shrink-0 rounded-full bg-flame" />
                      <span>Best way to reach you</span>
                      <span className="h-px flex-1 bg-sand-300" />
                    </legend>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {CONTACT_VIA.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => form.setValue('contactVia', c)}
                          aria-pressed={values.contactVia === c}
                          className={cn(
                            'rounded-full border px-4 py-2 font-mark text-[11px] uppercase tracking-[0.12em] transition',
                            values.contactVia === c ? 'border-ink bg-ink text-white' : 'border-sand-300 text-ink-700 hover:border-mist'
                          )}
                        >
                          {c}
                        </button>
                      ))}
                    </div>

                    <label className="mt-6 flex items-start gap-3">
                      <input
                        type="checkbox"
                        aria-invalid={form.formState.errors.consent ? true : undefined}
                        className="mt-0.5 h-5 w-5 rounded border-sand-300 text-flame"
                        {...form.register('consent')}
                      />
                      <span className="text-sm leading-relaxed text-ink/80">
                        Use my details to answer this enquiry. <span className="text-flame">*</span>
                        <span className="mt-0.5 block text-xs text-ink/55">
                          Kept on our own server, never passed on, deleted if nothing comes of it.{' '}
                          <Link href={routes.policies('privacy')} className="text-flame-600 underline underline-offset-4">
                            Privacy
                          </Link>
                          .
                        </span>
                      </span>
                    </label>
                    {form.formState.errors.consent ? (
                      <p role="alert" className="mt-2 text-sm text-flame-600">
                        {form.formState.errors.consent.message}
                      </p>
                    ) : null}

                    <label className="mt-4 flex items-start gap-3">
                      <input type="checkbox" className="mt-0.5 h-5 w-5 rounded border-sand-300 text-flame" {...form.register('newsletter')} />
                      <span className="text-sm leading-relaxed text-ink/80">Also send me the familia letter, once a month.</span>
                    </label>
                  </fieldset>

                  <div className="rounded-2xl border border-sand-300 bg-sand p-5 lg:p-6">
                    <h2 className="font-mark text-[11px] uppercase tracking-[0.16em] text-ink-700">What we will receive</h2>
                    <dl className="mt-4 space-y-2.5 text-sm">
                      {summaryRows.map((row) => (
                        <div key={row.label} className="flex flex-wrap justify-between gap-x-4 gap-y-1 border-b border-sand-300 pb-2.5 last:border-0 last:pb-0">
                          <dt className="text-ink/60">{row.label}</dt>
                          <dd className="text-right text-ink-700">{row.value}</dd>
                        </div>
                      ))}
                    </dl>
                    <button type="button" onClick={() => goto(2)} className="mt-4 font-mark text-[11px] uppercase tracking-[0.16em] text-flame-600 underline underline-offset-4">
                      Change any of this
                    </button>
                  </div>

                  {submitError ? (
                    <div role="alert" className="rounded-2xl border border-flame/25 bg-flame/5 p-5">
                      <h2 className="font-display text-lg text-ink-700">That did not send</h2>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink/75">
                        Your answers are still here — nothing is lost. Try once more, or send the same thing to{' '}
                        <a href="mailto:charter@seafamilia.com" className="text-flame-600 underline underline-offset-4">
                          charter@seafamilia.com
                        </a>{' '}
                        and we will pick it up either way.
                      </p>
                    </div>
                  ) : null}
                </div>
              </section>
            ) : null}
          </div>
        </div>
      )}

      <FunnelFooter
        left={
          step > 1 ? (
            <button
              type="button"
              onClick={back}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-sand-300 px-5 font-mark text-[12px] uppercase tracking-[0.14em] text-ink-700 transition hover:border-ink"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Back</span>
            </button>
          ) : (
            <span />
          )
        }
        center={<p className="truncate font-mark text-[11px] uppercase tracking-[0.14em] text-mist-700">{footerHint}</p>}
        right={
          step === 1 ? (
            <button
              type="button"
              onClick={() => goto(2)}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-flame px-6 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-flame-600"
            >
              Start a request
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : step === 2 || step === 3 ? (
            <button
              type="button"
              onClick={next}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-flame px-6 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-flame-600"
            >
              Continue
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : (
            <button
              type="button"
              onClick={form.handleSubmit(onSubmit)}
              disabled={busy}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-flame px-6 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-flame-600 disabled:opacity-60"
            >
              {busy ? 'Sending…' : 'Send request'}
            </button>
          )
        }
      />
      <IndeterminateBar show={busy} />
    </main>
  );
}
