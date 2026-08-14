'use client';

/**
 * Prototype-only sign-in, ported from partials/header.html's modal +
 * layout.js's `submitSignin()` — no real auth, matches the original's
 * scope exactly (a fake 700ms delay, then a "check your inbox" state).
 */
import * as React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, Cross } from '@/components/icons';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function SignInDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const emailRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    // Matches the original: sign-in state isn't reset on close, so a
    // reopened dialog picks up wherever it left off (including "sent").
    if (!open) return;
    const handle = setTimeout(() => emailRef.current?.focus(), 0);
    return () => clearTimeout(handle);
  }, [open]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim();
    setError('');
    if (!value) {
      setError('Please enter the email address you booked with.');
      return;
    }
    if (!EMAIL_RE.test(value)) {
      setError('That address is missing something — check for a typo.');
      return;
    }
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      setSent(true);
    }, 700);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogContent showCloseButton={false} aria-labelledby="sf-signin-title" className="max-w-md gap-0 rounded-3xl p-6 shadow-lift ring-0 sm:p-8">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-ink/50"
        >
          <Cross className="h-4 w-4" aria-hidden="true" />
        </Button>

        {sent ? (
          <div className="py-6 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-mist-100 text-ink-700">
              <Check className="h-7 w-7" aria-hidden="true" />
            </span>
            <h2 className="mt-5 font-display text-2xl text-ink-700">Check your inbox</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/70">
              We sent a sign-in link to <strong className="text-ink-700">{email}</strong>. It is valid for one hour.
            </p>
            <button
              type="button"
              onClick={() => setSent(false)}
              className="mt-6 font-mark text-[11px] uppercase tracking-[0.16em] text-flame-600 underline underline-offset-4"
            >
              Use a different address
            </button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <span className="wave-rule wave-rule-flame mb-4 block" aria-hidden="true" />
            <h2 id="sf-signin-title" className="font-display text-2xl text-ink-700">
              Welcome back
            </h2>
            <p className="mt-1.5 text-sm text-ink/65">Your bookings, joining forms and past voyages.</p>
            <label className="mt-6 block">
              <span className="font-mark text-[11px] uppercase tracking-[0.16em] text-ink-700">Email</span>
              <Input
                ref={emailRef}
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={error ? true : undefined}
                placeholder="you@example.com"
                className="mt-1.5 h-12 rounded-xl border-sand-300 bg-sand text-ink-700"
              />
            </label>
            {error ? (
              <p role="alert" className="mt-2 flex items-start gap-1.5 text-sm text-flame-600">
                {error}
              </p>
            ) : null}
            <Button type="submit" disabled={busy} size="lg" className="mt-5 w-full">
              {busy ? 'Sending…' : 'Email me a sign-in link'}
            </Button>
            <p className="mt-4 text-center text-xs leading-relaxed text-ink/50">
              No password to remember. New here? A guest account is created with your first reservation.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
