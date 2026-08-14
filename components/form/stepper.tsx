'use client';

/** −/+ counter, ported from discover.html's guest-count control (and
 * reused wherever the funnels need a bounded number, e.g. reserve's cabin
 * occupancy). No shadcn equivalent — a plain number input with two
 * buttons either side, one pill. */
import { Minus, Plus } from '@/components/icons';

export function Stepper({
  value,
  min,
  max,
  onChange,
  label,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (next: number) => void;
  label: string;
}) {
  return (
    <span className="inline-flex items-center rounded-full border border-sand-300">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="grid h-11 w-11 place-items-center rounded-l-full text-ink-700 transition hover:bg-sand disabled:opacity-40 disabled:hover:bg-transparent"
        aria-label={`One fewer ${label}`}
      >
        <Minus className="h-4 w-4" aria-hidden="true" />
      </button>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => {
          const n = Number(e.target.value);
          if (Number.isFinite(n)) onChange(Math.max(min, Math.min(max, n)));
        }}
        className="counter-input h-11 w-14 border-0 bg-transparent p-0 text-center font-display text-lg text-ink-700 focus:ring-0"
        aria-label={`Number of ${label}`}
      />
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="grid h-11 w-11 place-items-center rounded-r-full text-ink-700 transition hover:bg-sand disabled:opacity-40 disabled:hover:bg-transparent"
        aria-label={`One more ${label}`}
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
      </button>
    </span>
  );
}
