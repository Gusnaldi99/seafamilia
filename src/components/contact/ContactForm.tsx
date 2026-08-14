"use client";

import { useState, useEffect } from "react";

type Topic = {
  key: string;
  label: string;
  note: string;
  placeholder: string;
};

const topics: Topic[] = [
  { key: 'trip', label: 'Which trip suits us', note: 'Tell us who is coming, roughly when, and what you like doing. We will suggest two or three.', placeholder: 'Two of us, October, both Advanced, we would rather not see another boat all week…' },
  { key: 'booking', label: 'An existing booking', note: 'Quote your booking reference and we can see everything on our side.', placeholder: 'Reference SF-… — we would like to move to a later departure and add a night beforehand.' },
  { key: 'waitlist', label: 'Waitlist', note: 'We hold waitlists by hand and work through them in order. Cancellations happen more often than you would think.', placeholder: 'Please add us to the waitlist for…' },
  { key: 'charter', label: 'Private charter', note: 'The charter form asks better questions — but a plain message is fine too.', placeholder: 'Eight of us, one family, first week of July, ideally Komodo…' },
  { key: 'crew', label: 'Crewing with us', note: 'We hire from the islands we sail, and we train deck crew from scratch.', placeholder: 'I am from Labuan Bajo, I have two seasons as a deckhand…' },
  { key: 'other', label: 'Something else', note: 'Press, partnerships, a correction to something we wrote — all welcome.', placeholder: 'Whatever it is…' },
];

export function ContactForm() {
  const [topic, setTopic] = useState<string>('trip');
  const [form, setForm] = useState({ name: '', email: '', phone: '', reference: '', message: '', consent: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [referenceStr, setReferenceStr] = useState('');

  // Read URL parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qTopic = params.get('topic');
    const qRef = params.get('ref');
    
    if (qTopic && topics.some(t => t.key === qTopic)) setTopic(qTopic);
    if (qRef) setForm(prev => ({ ...prev, reference: qRef }));
    if (qRef && !qTopic) setTopic('booking');
  }, []);

  const activeTopic = topics.find(t => t.key === topic);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Tell us what to call you.";
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "We need an address to reply to.";
    if (!form.message.trim()) errs.message = "Don't send an empty box.";
    if (!form.consent) errs.consent = "Required so we can reply.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setBusy(true);
    setSubmitError(false);
    
    // Simulate API call
    setTimeout(() => {
      setBusy(false);
      setReferenceStr(`SF-${Math.floor(Math.random() * 89999 + 10000)}`);
      setSent(true);
    }, 1200);
  };

  const reset = () => {
    setSent(false);
    setForm(prev => ({ ...prev, message: '', consent: false }));
    setErrors({});
  };

  if (sent) {
    return (
      <div className="rounded-[2rem] bg-white p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] lg:p-10 animate-fade-in">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-mist-100 text-ink-700">
          <span className="icon icon-check h-7 w-7" aria-hidden="true"></span>
        </span>
        <h2 className="mt-5 font-display text-2xl font-light text-ink-700 sm:text-3xl">That has arrived</h2>
        <p className="mt-3 text-base leading-relaxed text-ink/70">
          Your reference is <strong className="text-ink-700">{referenceStr}</strong>. A reply is
          coming to <strong className="text-ink-700">{form.email}</strong> — from a person, and
          usually the same day.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <a href="https://wa.me/6281100000000" target="_blank" rel="noopener noreferrer"
             className="inline-flex h-12 items-center rounded-full bg-ink px-6 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-ink-600">
            Continue on WhatsApp
          </a>
          <button type="button" onClick={reset}
                  className="inline-flex h-12 items-center rounded-full border border-ink/20 px-6 font-mark text-[12px] uppercase tracking-[0.14em] text-ink-700 transition hover:border-ink">
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <h2 className="font-display text-2xl font-light text-ink-700 sm:text-3xl">Send us a message</h2>
      <p className="mt-2 text-base leading-relaxed text-ink/70">
        The more specific you are, the better the reply. “Two of us, October, we dive, we hate
        crowds” gets a much more useful answer than “please send brochure”.
      </p>

      <fieldset className="mt-7">
        <legend className="font-mark text-[11px] uppercase tracking-[0.16em] text-ink-700">What is this about?</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {topics.map(t => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTopic(t.key)}
              aria-pressed={topic === t.key}
              className={`rounded-full border px-4 py-2 font-mark text-[11px] uppercase tracking-[0.12em] transition ${
                topic === t.key 
                  ? 'border-ink bg-ink text-white' 
                  : 'border-sand-300 text-ink-700 hover:border-mist'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <p className="mt-2.5 text-sm text-ink/60">{activeTopic?.note}</p>
      </fieldset>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm text-ink/70">Your name <span className="text-flame">*</span></span>
          <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} autoComplete="name"
                 aria-invalid={!!errors.name}
                 className="mt-1.5 h-12 w-full rounded-xl border border-sand-300 bg-sand px-4 text-ink-700 focus:border-mist focus:outline-none focus:ring-2 focus:ring-mist/40" />
          {errors.name && <span role="alert" className="mt-1.5 block text-sm text-flame-600">{errors.name}</span>}
        </label>
        
        <label className="block">
          <span className="text-sm text-ink/70">Email <span className="text-flame">*</span></span>
          <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} autoComplete="email" inputMode="email"
                 aria-invalid={!!errors.email}
                 className="mt-1.5 h-12 w-full rounded-xl border border-sand-300 bg-sand px-4 text-ink-700 focus:border-mist focus:outline-none focus:ring-2 focus:ring-mist/40" />
          {errors.email && <span role="alert" className="mt-1.5 block text-sm text-flame-600">{errors.email}</span>}
        </label>
        
        <label className="block">
          <span className="text-sm text-ink/70">Phone or WhatsApp</span>
          <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} autoComplete="tel" inputMode="tel" placeholder="+61 400 000 000"
                 className="mt-1.5 h-12 w-full rounded-xl border border-sand-300 bg-sand px-4 text-ink-700 placeholder:text-ink/35 focus:border-mist focus:outline-none focus:ring-2 focus:ring-mist/40" />
        </label>
        
        <label className="block">
          <span className="text-sm text-ink/70">Booking or departure reference</span>
          <input type="text" value={form.reference} onChange={e => setForm({...form, reference: e.target.value})} placeholder="If you have one"
                 className="mt-1.5 h-12 w-full rounded-xl border border-sand-300 bg-sand px-4 uppercase tracking-wider text-ink-700 placeholder:normal-case placeholder:tracking-normal placeholder:text-ink/35 focus:border-mist focus:outline-none focus:ring-2 focus:ring-mist/40" />
        </label>
        
        <label className="block sm:col-span-2">
          <span className="text-sm text-ink/70">Your message <span className="text-flame">*</span></span>
          <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} rows={6} maxLength={1200}
                    aria-invalid={!!errors.message}
                    placeholder={activeTopic?.placeholder}
                    className="mt-1.5 w-full rounded-xl border border-sand-300 bg-sand p-4 text-ink-700 placeholder:text-ink/35 focus:border-mist focus:outline-none focus:ring-2 focus:ring-mist/40"></textarea>
          <span className="mt-1 block text-right text-xs text-ink/45">
            {form.message.length} / 1200
          </span>
          {errors.message && <span role="alert" className="block text-sm text-flame-600">{errors.message}</span>}
        </label>
      </div>

      <label className="mt-5 flex items-start gap-3">
        <input type="checkbox" checked={form.consent} onChange={e => setForm({...form, consent: e.target.checked})} aria-invalid={!!errors.consent}
               className="mt-0.5 h-5 w-5 rounded border border-sand-300 bg-white text-flame focus:ring-2 focus:ring-mist/40" />
        <span className="text-sm leading-relaxed text-ink/80">
          Use my details to reply to this message. <span className="text-flame">*</span>
          <span className="mt-0.5 block text-xs text-ink/55">
            Kept on our own server, never passed on.
            <a href="/policies#privacy" className="text-flame-600 underline underline-offset-4 ml-1">Privacy</a>.
          </span>
        </span>
      </label>
      {errors.consent && <p role="alert" className="mt-2 text-sm text-flame-600">{errors.consent}</p>}

      {submitError && (
        <div className="mt-5 rounded-2xl border border-flame/25 bg-flame/5 p-5" role="alert">
          <h3 className="font-display text-lg text-ink-700">That did not send</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-ink/75">
            Nothing is lost — your message is still in the box. Try again, or send the same thing
            to <a href="mailto:hello@seafamilia.com" className="text-flame-600 underline underline-offset-4">hello@seafamilia.com</a>.
          </p>
        </div>
      )}

      <button type="submit" disabled={busy}
              className="mt-7 inline-flex h-14 items-center gap-2.5 rounded-full bg-flame px-7 font-mark text-[13px] uppercase tracking-[0.16em] text-white transition hover:bg-flame-600 disabled:opacity-60">
        {!busy && <span>Send message</span>}
        {busy && <span>Sending…</span>}
        {!busy && <span className="icon icon-chevron-right h-4 w-4" aria-hidden="true"></span>}
      </button>
    </form>
  );
}
