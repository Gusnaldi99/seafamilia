'use client';

/** Segmented, clickable progress bar shared by all three funnels — ported
 * from each funnel's own "clickable progress: completed steps are
 * navigable" block. A step ahead of `furthest` can't be jumped to. */
import { cn } from '@/lib/utils';

export interface FunnelStep {
  key: string;
  label: string;
}

export function FunnelStepper({
  steps,
  current,
  furthest,
  onNavigate,
}: {
  steps: FunnelStep[];
  current: number;
  furthest: number;
  onNavigate: (step: number) => void;
}) {
  return (
    <ol className="mt-5 flex gap-1.5" aria-label="Progress">
      {steps.map((s, i) => (
        <li key={s.key} className="flex-1">
          <button
            type="button"
            onClick={() => onNavigate(i + 1)}
            disabled={i + 1 > furthest}
            aria-current={current === i + 1 ? 'step' : undefined}
            aria-label={s.label}
            className="group block w-full text-left disabled:cursor-not-allowed"
          >
            <span
              className={cn(
                'block h-1 rounded-full transition',
                i + 1 < current ? 'bg-flame' : i + 1 === current ? 'bg-ink' : 'bg-sand-300'
              )}
            />
            <span
              className={cn(
                'mt-2 hidden font-mark text-[10px] uppercase tracking-[0.14em] sm:block',
                i + 1 <= current ? 'text-ink-700' : 'text-mist-400'
              )}
            >
              {s.label}
            </span>
          </button>
        </li>
      ))}
    </ol>
  );
}
