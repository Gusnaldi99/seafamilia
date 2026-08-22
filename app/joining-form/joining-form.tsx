'use client';

/**
 * Per-guest details, collected after the deposit. The field set is lifted
 * wholesale from what used to be /reserve step 5 — name, nationality,
 * diving (with certification shown only when it applies), dietary needs —
 * so the crew end up with exactly the same information, just later.
 *
 * Without a booking store there is nothing to look the reference up
 * against, so the guest tells us how many are coming by adding rows
 * rather than the form deriving them from the reservation.
 */
import * as React from 'react';
import Link from 'next/link';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BigCheck, Cross, Plus } from '@/components/icons';
import { IndeterminateBar } from '@/components/funnel/indeterminate-bar';
import { submitJoiningForm } from './actions';
import { DIVING_OPTIONS, EMPTY_GUEST_VALUES, joiningDefaults, joiningSchema, type JoiningFormValues } from './schema';
import { forcedStateFrom } from '@/lib/qa';
import { routes } from '@/lib/routes';
import { toast } from '@/lib/toast';

export function JoiningForm() {
  const searchParams = useSearchParams();
  const forced = forcedStateFrom(searchParams.get('state'));

  const [sent, setSent] = React.useState(false);
  const [submitError, setSubmitError] = React.useState(false);

  const form = useForm<JoiningFormValues>({
    resolver: zodResolver(joiningSchema),
    // Read once from the initial URL, matching /contact's timing — RHF only
    // reads defaultValues on the first render.
    defaultValues: joiningDefaults(searchParams.get('ref') ?? ''),
  });
  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'guests' });
  const guests = form.watch('guests');
  const busy = form.formState.isSubmitting;

  async function onSubmit(values: JoiningFormValues) {
    setSubmitError(false);
    const result = await submitJoiningForm(values, forced === 'error');
    if (!result.ok) {
      setSubmitError(true);
      toast({ title: 'That did not send', body: 'Nothing is lost — every answer is still on screen. Try again.', variant: 'error' });
      return;
    }
    setSent(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast({ title: 'Joining form received', body: 'The crew have what they need. You can send it again if anything changes.', variant: 'success' });
  }

  if (sent) {
    return (
      <div className="rounded-4xl bg-white p-7 shadow-card lg:p-10">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-mist-100 text-ink-700">
          <BigCheck className="h-7 w-7" aria-hidden="true" />
        </span>
        <h2 className="mt-5 font-display text-2xl font-light text-ink-700 sm:text-3xl">That is with the crew</h2>
        <p className="mt-3 text-base leading-relaxed text-ink/70">
          Filed against <strong className="text-ink-700">{form.getValues('reference')}</strong>. The kitchen and the dive deck both work from this, so if anything changes — a new
          certification, someone dropping out, an allergy you forgot — send it again and the later one wins.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              setSent(false);
              setSubmitError(false);
            }}
            className="inline-flex h-12 items-center rounded-full bg-ink px-6 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-ink-600"
          >
            Change something
          </button>
          <Link
            href={routes.contact({ ref: form.getValues('reference') })}
            className="inline-flex h-12 items-center rounded-full border border-ink/20 px-6 font-mark text-[12px] uppercase tracking-[0.14em] text-ink-700 transition hover:border-ink"
          >
            Message the office
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <fieldset className="rounded-2xl bg-white p-5 lg:p-6">
        <legend className="sf-legend flex items-center gap-3 pb-3 font-mark text-[11px] font-medium uppercase tracking-[0.18em] text-ink-700">
          <span className="h-3.5 w-[3px] shrink-0 rounded-full bg-flame" />
          <span>Your booking</span>
          <span className="h-px flex-1 bg-sand-300" />
        </legend>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm text-ink/70">
              Booking reference <span className="text-flame">*</span>
            </span>
            <Input
              type="text"
              placeholder="SF-26A7K4"
              aria-invalid={form.formState.errors.reference ? true : undefined}
              className="mt-1.5 h-12 rounded-xl border-sand-300 bg-sand uppercase tracking-wider text-ink-700 placeholder:normal-case placeholder:tracking-normal placeholder:text-ink/35"
              {...form.register('reference')}
            />
            {form.formState.errors.reference ? (
              <span role="alert" className="mt-1.5 block text-sm text-flame-600">
                {form.formState.errors.reference.message}
              </span>
            ) : null}
          </label>
          <label className="block">
            <span className="text-sm text-ink/70">
              Email you booked with <span className="text-flame">*</span>
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
        </div>
      </fieldset>

      <div className="mt-4 space-y-4">
        {fields.map((field, i) => {
          const diving = guests?.[i]?.diving ?? 'none';
          const showCert = diving !== 'none' && diving !== 'learning';
          const errors = form.formState.errors.guests?.[i];
          return (
            <fieldset key={field.id} className="rounded-2xl bg-white p-5 lg:p-6">
              <legend className="sf-legend flex items-center gap-3 pb-3 font-mark text-[11px] font-medium uppercase tracking-[0.18em] text-ink-700">
                <span className="h-3.5 w-[3px] shrink-0 rounded-full bg-flame" />
                <span>{i === 0 ? 'Lead guest' : `Guest ${i + 1}`}</span>
                <span className="h-px flex-1 bg-sand-300" />
                {fields.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-sand-300 px-3 py-1.5 font-mark text-[10px] uppercase tracking-[0.12em] text-ink/70 transition hover:border-ink hover:text-ink-700"
                  >
                    <Cross className="h-3 w-3" aria-hidden="true" />
                    Remove
                  </button>
                ) : null}
              </legend>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="text-sm text-ink/70">
                    Full name, as in the passport <span className="text-flame">*</span>
                  </span>
                  <Input
                    type="text"
                    autoComplete={i === 0 ? 'name' : 'off'}
                    aria-invalid={errors?.name ? true : undefined}
                    className="mt-1.5 h-12 rounded-xl border-sand-300 bg-sand text-ink-700"
                    {...form.register(`guests.${i}.name`)}
                  />
                  {errors?.name ? (
                    <span role="alert" className="mt-1.5 block text-sm text-flame-600">
                      {errors.name.message}
                    </span>
                  ) : null}
                </label>

                <label className="block">
                  <span className="text-sm text-ink/70">Nationality</span>
                  <Input type="text" autoComplete="country-name" className="mt-1.5 h-12 rounded-xl border-sand-300 bg-sand text-ink-700" {...form.register(`guests.${i}.nationality`)} />
                </label>
                <label className="block">
                  <span className="text-sm text-ink/70">Diving</span>
                  <select
                    className="mt-1.5 h-12 w-full rounded-xl border-sand-300 bg-sand text-ink-700 focus:border-mist focus:ring-2 focus:ring-mist/40"
                    {...form.register(`guests.${i}.diving`)}
                  >
                    {DIVING_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </label>

                {showCert ? (
                  <>
                    <label className="block">
                      <span className="text-sm text-ink/70">Certification number</span>
                      <Input
                        type="text"
                        placeholder="Optional — can follow later"
                        className="mt-1.5 h-12 rounded-xl border-sand-300 bg-sand text-ink-700 placeholder:text-ink/35"
                        {...form.register(`guests.${i}.certNumber`)}
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm text-ink/70">Logged dives, roughly</span>
                      <Input
                        type="number"
                        min={0}
                        max={9999}
                        className="counter-input mt-1.5 h-12 rounded-xl border-sand-300 bg-sand text-ink-700"
                        {...form.register(`guests.${i}.dives`, { valueAsNumber: true })}
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
                    className="mt-1.5 rounded-xl border-sand-300 bg-sand text-ink-700 placeholder:text-ink/35"
                    {...form.register(`guests.${i}.dietary`)}
                  />
                </label>
              </div>
            </fieldset>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => append({ ...EMPTY_GUEST_VALUES })}
        className="mt-4 inline-flex h-12 items-center gap-2 rounded-full border border-ink/20 px-5 font-mark text-[12px] uppercase tracking-[0.14em] text-ink-700 transition hover:border-ink"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Add another guest
      </button>

      {submitError ? (
        <div role="alert" className="mt-6 rounded-2xl border border-flame/25 bg-flame/5 p-5">
          <h2 className="font-display text-lg text-ink-700">That did not send</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-ink/75">
            Nothing is lost — every answer is still on this screen. Try again, or send the details to{' '}
            <a href="mailto:hello@seafamilia.com" className="text-flame-600 underline underline-offset-4">
              hello@seafamilia.com
            </a>{' '}
            quoting your reference.
          </p>
        </div>
      ) : null}

      <div className="mt-8 border-t border-sand-300 pt-6">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex h-13 items-center justify-center rounded-full bg-flame px-7 py-4 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-flame-600 disabled:opacity-60"
        >
          {busy ? 'Sending…' : 'Send to the crew'}
        </button>
        <p className="mt-3 text-xs leading-relaxed text-ink/55">
          You can send this as many times as you like — the most recent one is the one the crew work from. Nothing here is charged, and none of it is shared outside the boat.
        </p>
      </div>
      <IndeterminateBar show={busy} />
    </form>
  );
}
