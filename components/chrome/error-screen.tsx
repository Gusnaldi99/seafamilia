'use client';

/**
 * Shared visual content behind error.html's two runtime states (500 vs
 * `?mode=maintenance` 503) — one screen, switched by `mode`. The "Try
 * again" button's original behaviour was purely cosmetic (a fake delay,
 * then a hard redirect home, since a static page has nothing to actually
 * retry); `onRetry` lets callers wire in something real when one exists
 * (app/error.tsx passes Next's `reset()`).
 */
import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PhotoPlate } from '@/components/media/photo-plate';
import { Refresh } from '@/components/icons';
import { formatReference } from '@/lib/format';
import { PHOTO_SIZES } from '@/lib/photo-paths';
import { routes } from '@/lib/routes';

const COPY = {
  error: {
    code: '500 · Unexpected error',
    title: 'Something broke at our end',
    body: 'Not your connection, not your browser — ours. Try again in a moment; if it keeps happening, the office can do anything this website can, by hand.',
  },
  maintenance: {
    code: '503 · Planned maintenance',
    title: 'We are in the boatyard, briefly',
    body: 'The booking system is being updated and will be back within the hour. Everything already booked is untouched, and the office is answering as normal.',
  },
} as const;

export function ErrorScreen({
  mode,
  onRetry,
  photoSrc = null,
}: {
  mode: 'error' | 'maintenance';
  onRetry?: () => void;
  /** Resolved server-side by a Server Component parent (e.g. /maintenance) —
   * this component is 'use client' itself and can't check the filesystem,
   * so app/error.tsx (which has no such parent) just renders the gradient. */
  photoSrc?: string | null;
}) {
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);
  const copy = COPY[mode];
  const incident = React.useMemo(() => formatReference(mode.length * 977).replace('SF-', 'IN-'), [mode]);

  function retry() {
    setBusy(true);
    setTimeout(() => {
      if (onRetry) onRetry();
      else router.push(routes.home());
    }, 900);
  }

  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink">
        <PhotoPlate ph="deep" src={photoSrc} alt="" sizes={PHOTO_SIZES.hero} />
        <div className="scrim absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-3xl px-5 pb-16 pt-32 text-center sm:px-6 lg:pb-24 lg:pt-40">
          <span className="wave-rule wave-rule-light mx-auto block" aria-hidden="true" />
          <p className="mt-6 font-mark text-eyebrow uppercase text-white/60">{copy.code}</p>
          <h1 className="mt-4 font-display text-4xl font-light leading-[1.06] tracking-tight text-white sm:text-5xl">{copy.title}</h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">{copy.body}</p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={retry}
              disabled={busy}
              className="inline-flex items-center gap-2.5 rounded-full bg-flame px-6 py-4 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-flame-600 disabled:opacity-60"
            >
              {!busy ? <Refresh className="h-4 w-4" aria-hidden="true" /> : null}
              <span>{busy ? 'Trying…' : 'Try again'}</span>
            </button>
            <a
              href="https://wa.me/6281100000000"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center rounded-full border border-white/30 px-6 py-4 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-white hover:text-ink-700"
            >
              WhatsApp the office
            </a>
          </div>

          <p className="mt-6 text-xs leading-relaxed text-white/50">
            Reference <span className="text-white/80">{incident}</span> — quote this if you message us and we can
            find exactly what failed.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-8xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl border border-sand-300 bg-sand p-6 lg:p-8">
            <h2 className="font-display text-2xl font-light text-ink-700">Your booking is not affected</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/75">
              Reservations, deposits and payments live in a separate system from this website. If you had a
              confirmed booking a minute ago, you still do — and if you were part-way through reserving, nothing
              was charged. Message the office and they will confirm it by hand.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-sand-300 p-5">
              <h3 className="font-mark text-[11px] uppercase tracking-[0.16em] text-flame">Still works</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                WhatsApp, email and the phones. Two people in Labuan Bajo, and neither of them depends on this
                website.
              </p>
            </div>
            <div className="rounded-2xl border border-sand-300 p-5">
              <h3 className="font-mark text-[11px] uppercase tracking-[0.16em] text-flame">Might work</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                Pages you have already visited, from your browser&rsquo;s cache. Try{' '}
                <Link href={routes.home()} className="text-flame-600 underline underline-offset-4">
                  the homepage
                </Link>{' '}
                or hitting back.
              </p>
            </div>
            <div className="rounded-2xl border border-sand-300 p-5">
              <h3 className="font-mark text-[11px] uppercase tracking-[0.16em] text-flame">Being fixed</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                Someone has been paged. In eleven years the longest this has lasted is about forty minutes.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <a
              href="mailto:hello@seafamilia.com"
              className="font-mark text-[11px] uppercase tracking-[0.16em] text-ink-700 underline underline-offset-4 hover:text-flame-600"
            >
              hello@seafamilia.com
            </a>
            <span className="hidden h-3 w-px bg-sand-300 sm:block" aria-hidden="true" />
            <span className="font-mark text-[11px] uppercase tracking-[0.16em] text-mist-700">+62 811 0000 0000</span>
            <span className="hidden h-3 w-px bg-sand-300 sm:block" aria-hidden="true" />
            <span className="font-mark text-[11px] uppercase tracking-[0.16em] text-mist-700">08:00 – 18:00 WITA</span>
          </div>
        </div>
      </section>
    </>
  );
}
