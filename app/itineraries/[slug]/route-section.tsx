'use client';

/** Day-by-day accordion, ported from trip.html's `isOpen`/`toggleDay`/
 * `openAll`/`closeAll`. Both columns live in one client component because
 * the "Expand all"/"Collapse" buttons (left column) and the accordion
 * items (right column) share the same open-state. */
import * as React from 'react';
import { Plus } from '@/components/icons';
import { cn } from '@/lib/utils';
import type { RouteDay } from '@/lib/data/types';

export function RouteSection({ nights, route, provisional }: { nights: number; route: RouteDay[]; provisional: boolean }) {
  const [open, setOpen] = React.useState<number[]>([0]);

  function toggleDay(i: number) {
    setOpen((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));
  }

  return (
    <section id="route" className="mx-auto max-w-8xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="font-mark text-eyebrow uppercase text-flame">Day by day</p>
          <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight text-ink-700 sm:text-4xl">
            How the {nights} nights run
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ink/70">
            A plan rather than a promise. The captain reads the weather each morning and reorders freely — which is
            exactly why guests who have sailed with us twice stop reading this section.
          </p>
          <div className="mt-6 flex gap-2">
            <button
              type="button"
              onClick={() => setOpen(route.map((_, i) => i))}
              className="rounded-full border border-sand-300 px-4 py-2 font-mark text-[11px] uppercase tracking-[0.12em] text-ink-700 transition hover:border-mist"
            >
              Expand all
            </button>
            <button
              type="button"
              onClick={() => setOpen([])}
              className="rounded-full border border-sand-300 px-4 py-2 font-mark text-[11px] uppercase tracking-[0.12em] text-ink-700 transition hover:border-mist"
            >
              Collapse
            </button>
          </div>
          {provisional ? (
            <p className="mt-6 rounded-2xl bg-sand p-4 text-xs leading-relaxed text-ink/65">
              <strong className="text-ink-700">Outline only.</strong> The detailed day-by-day for this route is still
              being written up by the crew who sailed it. The anchorages listed are the ones we use; the order will
              shift.
            </p>
          ) : null}
        </div>

        <ol className="divide-y divide-sand-300 border-y border-sand-300">
          {route.map((d, i) => {
            const isOpen = open.includes(i);
            return (
              <li key={i}>
                <h3>
                  <button type="button" onClick={() => toggleDay(i)} aria-expanded={isOpen} className="group flex w-full items-start gap-5 py-5 text-left">
                    <span className="mt-0.5 shrink-0 font-mark text-[11px] uppercase tracking-[0.16em] text-mist">Day {d.day}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-lg text-ink-700 transition-colors group-hover:text-flame-600 sm:text-xl">{d.title}</span>
                    </span>
                    <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-sand-300 text-ink-700 transition group-hover:border-mist">
                      <Plus className={cn('h-3.5 w-3.5 transition-transform', isOpen && 'rotate-45')} aria-hidden="true" />
                    </span>
                  </button>
                </h3>
                {isOpen ? (
                  <div>
                    <p className="pb-6 pl-0 pr-10 text-sm leading-relaxed text-ink/75 sm:pl-[5.5rem]">{d.text}</p>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
