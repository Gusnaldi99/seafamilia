"use client";

import Link from "next/link";
import { ImageSlot } from "@/components/ui/ImageSlot";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main id="main">
      <section className="relative isolate overflow-hidden bg-ink">
        <div className="ph ph-deep absolute inset-0">
          <ImageSlot className="img-slot h-full w-full object-cover" src="/media/photos/error.jpg" alt="" />
        </div>
        <div className="scrim absolute inset-0"></div>
        <div className="relative mx-auto max-w-3xl px-5 pb-16 pt-32 text-center sm:px-6 lg:pb-24 lg:pt-40">
          <span className="wave-rule wave-rule-light mx-auto block"></span>
          <p className="mt-6 font-mark text-eyebrow uppercase text-white/60">500</p>
          <h1 className="mt-4 font-display text-4xl font-light leading-[1.06] tracking-tight text-white sm:text-5xl">
            Something broke at our end
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            A server error occurred. Your booking is safe, and the office is still answering on WhatsApp.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <button type="button" onClick={() => reset()}
                    className="inline-flex items-center gap-2.5 rounded-full bg-flame px-6 py-4 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-flame-600">
              <span className="icon icon-refresh h-4 w-4" aria-hidden="true"></span>
              <span>Try again</span>
            </button>
            <Link href="https://wa.me/6281100000000" target="_blank" rel="noopener"
               className="inline-flex items-center rounded-full border border-white/30 px-6 py-4 font-mark text-[12px] uppercase tracking-[0.14em] text-white transition hover:bg-white hover:text-ink-700">
              WhatsApp the office
            </Link>
          </div>

          {error.digest && (
            <p className="mt-6 text-xs leading-relaxed text-white/50">
              Reference <span className="text-white/80">{error.digest}</span> — quote this if you message us
              and we can find exactly what failed.
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-[88rem] px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl border border-sand-300 bg-sand p-6 lg:p-8">
            <h2 className="font-display text-2xl font-light text-ink-700">Your booking is not affected</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/75">
              Reservations, deposits and payments live in a separate system from this website. If you had
              a confirmed booking a minute ago, you still do — and if you were part-way through
              reserving, nothing was charged. Message the office and they will confirm it by hand.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-sand-300 p-5">
              <h3 className="font-mark text-[11px] uppercase tracking-[0.16em] text-flame">Still works</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                WhatsApp, email and the phones. Two people in Labuan Bajo, and neither of them depends
                on this website.
              </p>
            </div>
            <div className="rounded-2xl border border-sand-300 p-5">
              <h3 className="font-mark text-[11px] uppercase tracking-[0.16em] text-flame">Might work</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                Pages you have already visited, from your browser’s cache. Try <Link href="/" className="text-flame-600 underline underline-offset-4">the homepage</Link> or hitting back.
              </p>
            </div>
            <div className="rounded-2xl border border-sand-300 p-5">
              <h3 className="font-mark text-[11px] uppercase tracking-[0.16em] text-flame">Being fixed</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                Someone has been paged. In eleven years the longest this has lasted is about forty
                minutes.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link href="mailto:hello@seafamilia.com" className="font-mark text-[11px] uppercase tracking-[0.16em] text-ink-700 underline underline-offset-4 hover:text-flame-600">
              hello@seafamilia.com
            </Link>
            <span className="hidden h-3 w-px bg-sand-300 sm:block"></span>
            <span className="font-mark text-[11px] uppercase tracking-[0.16em] text-mist-700">+62 811 0000 0000</span>
            <span className="hidden h-3 w-px bg-sand-300 sm:block"></span>
            <span className="font-mark text-[11px] uppercase tracking-[0.16em] text-mist-700">08:00 – 18:00 WITA</span>
          </div>
        </div>
      </section>
    </main>
  );
}
