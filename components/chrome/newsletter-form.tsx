'use client';

/** Ported from partials/footer.html + layout.js's `seaNewsletter()`. */
import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check } from '@/components/icons';
import { toast } from '@/lib/toast';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function NewsletterForm() {
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim();
    setError('');
    if (!value) {
      setError('An email address, and that is all we need.');
      return;
    }
    if (!EMAIL_RE.test(value)) {
      setError('That address does not look complete.');
      return;
    }
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      setSent(true);
      toast({ title: 'You are on the list', body: 'One letter a month, and nothing in between.', variant: 'success' });
    }, 650);
  }

  return (
    <div>
      <h2 className="font-mark text-[11px] uppercase tracking-[0.2em] text-white/50">The familia letter</h2>
      <p className="mt-3 text-sm leading-relaxed text-white/75">
        Once a month: where the boats are, what the reef is doing, and the occasional cabin that has opened
        up. No countdown timers.
      </p>
      <form onSubmit={submit} noValidate className="mt-5">
        {!sent ? (
          <>
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="flex-1">
                <span className="sr-only">Email address</span>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  aria-invalid={error ? true : undefined}
                  className="h-12 rounded-full border-white/20 bg-white/5 px-5 text-white placeholder:text-white/40"
                />
              </label>
              <Button type="submit" disabled={busy} variant="ghost" size="lg" className="h-12 shrink-0 bg-white px-6">
                {busy ? 'Sending…' : 'Subscribe'}
              </Button>
            </div>
            {error ? <p role="alert" className="mt-2 text-sm text-flame-300">{error}</p> : null}
            <p className="mt-3 text-xs leading-relaxed text-white/60">
              We keep your address on our own server and never pass it on. Unsubscribe is one click, in every
              letter.
            </p>
          </>
        ) : (
          <div className="flex items-start gap-3 rounded-2xl bg-white/5 p-4">
            <span className="mt-0.5 text-mist-300">
              <Check className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="text-sm leading-relaxed text-white/85">
              You are on the list. The next letter goes out at the start of the month — until then, nothing.
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
