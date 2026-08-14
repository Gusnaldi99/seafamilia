/** Shared pieces used by more than one card renderer — ported from data.js's
 * `chip()` and `metaRow()` helpers (§11). */
import { Fragment } from 'react';

export function CardChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-mark uppercase tracking-[0.14em] text-white ring-1 ring-inset ring-white/25 backdrop-blur">
      {children}
    </span>
  );
}

/** Renders a "·"-separated row, silently dropping empty items — same
 * contract as the original so callers don't need to pre-filter. Items can
 * be plain strings or a locale-reactive fragment (e.g. <Nights/>), which is
 * why the filter checks for null/undefined/'' explicitly rather than via
 * `Boolean()` (always-truthy JSX would otherwise never be droppable, which
 * is fine, but a plain `Boolean()` check reads as if it were). */
export function MetaRow({ items }: { items: React.ReactNode[] }) {
  const filtered = items.filter((item) => item !== null && item !== undefined && item !== '');
  return (
    <>
      {filtered.map((item, i) => (
        <Fragment key={i}>
          {i > 0 ? (
            <span className="text-mist-300" aria-hidden="true">
              ·
            </span>
          ) : null}
          <span className="whitespace-nowrap">{item}</span>
        </Fragment>
      ))}
    </>
  );
}
