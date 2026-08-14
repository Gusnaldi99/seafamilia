'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { BigCheck, ChevronRight } from '@/components/icons';
import { submitContactMessage } from './actions';
import { CONTACT_DEFAULTS, contactSchema, TOPICS, type ContactFormValues, type ContactTopic } from './schema';
import { departureById, tripBySlug } from '@/lib/queries';
import { formatDateRange } from '@/lib/format';
import { forcedStateFrom } from '@/lib/qa';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/utils';

function computeDefaults(searchParams: URLSearchParams): ContactFormValues {
  const topicParam = searchParams.get('topic');
  const ref = searchParams.get('ref') ?? '';
  let topic: ContactTopic = 'trip';
  if (topicParam && TOPICS.some((t) => t.key === topicParam)) {
    topic = topicParam as ContactTopic;
  } else if (ref) {
    topic = 'booking';
  }

  let message = '';
  if (topic === 'waitlist' && ref) {
    const departure = departureById(ref);
    const trip = departure ? tripBySlug(departure.trip) : undefined;
    if (departure && trip) {
      message = `Please add me to the waitlist for ${trip.title}, ${formatDateRange(departure.start, departure.nights)} (${departure.id}).`;
    }
  }

  return { ...CONTACT_DEFAULTS, topic, reference: ref, message };
}

export function ContactForm() {
  const searchParams = useSearchParams();
  const forced = forcedStateFrom(searchParams.get('state'));

  const [sent, setSent] = React.useState(false);
  const [reference, setReference] = React.useState('');
  const [submitError, setSubmitError] = React.useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    // Computed once from the initial URL (?topic=/?ref=), same timing as
    // the original's one-time init() — RHF only reads defaultValues on the
    // first render.
    defaultValues: computeDefaults(searchParams),
  });

  const topic = form.watch('topic');
  const message = form.watch('message') ?? '';
  const activeTopic = TOPICS.find((t) => t.key === topic);

  async function onSubmit(values: ContactFormValues) {
    setSubmitError(false);
    const result = await submitContactMessage(values, forced === 'error');
    if (!result.ok) {
      setSubmitError(true);
      toast({ title: 'That did not send', body: 'Your message is still on screen. Try again.', variant: 'error' });
      return;
    }
    setReference(result.reference ?? '');
    setSent(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast({
      title: 'Message sent',
      body: `Reference ${result.reference}. A person replies, usually the same day.`,
      variant: 'success',
    });
  }

  function sendAnother() {
    setSent(false);
    form.reset(CONTACT_DEFAULTS);
    setSubmitError(false);
  }

  if (sent) {
    return (
      <div className="rounded-4xl bg-white p-7 shadow-card lg:p-10">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-mist-100 text-ink-700">
          <BigCheck className="h-7 w-7" aria-hidden="true" />
        </span>
        <h2 className="mt-5 font-display text-2xl font-light text-ink-700 sm:text-3xl">That has arrived</h2>
        <p className="mt-3 text-base leading-relaxed text-ink/70">
          Your reference is <strong className="text-ink-700">{reference}</strong>. A reply is coming to{' '}
          <strong className="text-ink-700">{form.getValues('email')}</strong> — from a person, and usually the same day.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <a
            href="https://wa.me/6281100000000"
            target="_blank"
            rel="noopener"
            className="inline-flex h-12 items-center rounded-full bg-ink px-6 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-ink-600"
          >
            Continue on WhatsApp
          </a>
          <button
            type="button"
            onClick={sendAnother}
            className="inline-flex h-12 items-center rounded-full border border-ink/20 px-6 font-mark text-[12px] uppercase tracking-[0.14em] text-ink-700 transition hover:border-ink"
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <h2 className="font-display text-2xl font-light text-ink-700 sm:text-3xl">Send us a message</h2>
      <p className="mt-2 text-base leading-relaxed text-ink/70">
        The more specific you are, the better the reply. &ldquo;Two of us, October, we dive, we hate crowds&rdquo; gets a
        much more useful answer than &ldquo;please send brochure&rdquo;.
      </p>

      <fieldset className="mt-7">
        <legend className="font-mark text-[11px] uppercase tracking-[0.16em] text-ink-700">What is this about?</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {TOPICS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => form.setValue('topic', t.key)}
              aria-pressed={topic === t.key}
              className={cn(
                'rounded-full border px-4 py-2 font-mark text-[11px] uppercase tracking-[0.12em] transition',
                topic === t.key ? 'border-ink bg-ink text-white' : 'border-sand-300 text-ink-700 hover:border-mist'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <p className="mt-2.5 text-sm text-ink/60">{activeTopic?.note}</p>
      </fieldset>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <label className="block">
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
        <label className="block">
          <span className="text-sm text-ink/70">Booking or departure reference</span>
          <Input
            type="text"
            placeholder="If you have one"
            className="mt-1.5 h-12 rounded-xl border-sand-300 bg-sand uppercase tracking-wider text-ink-700 placeholder:normal-case placeholder:tracking-normal placeholder:text-ink/35"
            {...form.register('reference')}
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm text-ink/70">
            Your message <span className="text-flame">*</span>
          </span>
          <Textarea
            rows={6}
            maxLength={1200}
            placeholder={activeTopic?.placeholder}
            aria-invalid={form.formState.errors.message ? true : undefined}
            className="mt-1.5 rounded-xl border-sand-300 bg-sand text-ink-700 placeholder:text-ink/35"
            {...form.register('message')}
          />
          <span className="mt-1 block text-right text-xs text-ink/45">{message.length} / 1200</span>
          {form.formState.errors.message ? (
            <span role="alert" className="block text-sm text-flame-600">
              {form.formState.errors.message.message}
            </span>
          ) : null}
        </label>
      </div>

      <label className="mt-5 flex items-start gap-3">
        <input
          type="checkbox"
          aria-invalid={form.formState.errors.consent ? true : undefined}
          className="mt-0.5 h-5 w-5 rounded border-sand-300 text-flame"
          {...form.register('consent')}
        />
        <span className="text-sm leading-relaxed text-ink/80">
          Use my details to reply to this message. <span className="text-flame">*</span>
          <span className="mt-0.5 block text-xs text-ink/55">
            Kept on our own server, never passed on.{' '}
            <a href="/policies#privacy" className="text-flame-600 underline underline-offset-4">
              Privacy
            </a>
            .
          </span>
        </span>
      </label>
      {form.formState.errors.consent ? (
        <p role="alert" className="mt-2 text-sm text-flame-600">
          {form.formState.errors.consent.message}
        </p>
      ) : null}

      {submitError ? (
        <div role="alert" className="mt-5 rounded-2xl border border-flame/25 bg-flame/5 p-5">
          <h3 className="font-display text-lg text-ink-700">That did not send</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-ink/75">
            Nothing is lost — your message is still in the box. Try again, or send the same thing to{' '}
            <a href="mailto:hello@seafamilia.com" className="text-flame-600 underline underline-offset-4">
              hello@seafamilia.com
            </a>
            .
          </p>
        </div>
      ) : null}

      <Button type="submit" disabled={form.formState.isSubmitting} size="xl" className="mt-7">
        {form.formState.isSubmitting ? 'Sending…' : 'Send message'}
        {!form.formState.isSubmitting ? <ChevronRight data-icon="inline-end" className="h-4 w-4" aria-hidden="true" /> : null}
      </Button>
    </form>
  );
}
