/**
 * The `?state=loading|empty|error` QA override, ported from
 * assets/js/data.js's `forcedState()` (§10) and documented in
 * docs/HANDOFF.md §7 as a stakeholder-demo affordance available on *any*
 * listing or funnel URL.
 *
 * Pure and isomorphic (no `next/navigation` import) so both Server
 * Components (reading the `searchParams` prop directly) and Client
 * Components (reading `useSearchParams().get('state')`) can call the same
 * parser: `forcedStateFrom(searchParams.state)` /
 * `forcedStateFrom(useSearchParams().get('state'))`.
 *
 * Gated to non-production by default — a real visitor should not be able
 * to force a fake error, but every URL in HANDOFF §7's table keeps working
 * on preview deployments and in development.
 */
export const FORCED_STATES = ['loading', 'empty', 'error'] as const;
export type ForcedState = (typeof FORCED_STATES)[number];

export function qaEnabled(): boolean {
  return process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_SF_QA === '1';
}

export function forcedStateFrom(value: string | string[] | null | undefined): ForcedState | null {
  if (!qaEnabled()) return null;
  const v = Array.isArray(value) ? value[0] : value;
  return (FORCED_STATES as readonly string[]).includes(v ?? '') ? (v as ForcedState) : null;
}

/** Wraps a result so a forced `?state=empty` blanks any listing on the site
 * — mirrors emptied()'s original insight: an empty array is truthy, so
 * "genuinely empty" can't be inferred from the value alone once real data
 * fetching replaces this. */
export function emptied<T>(list: T[], forced: ForcedState | null): T[] {
  return forced === 'empty' ? [] : list;
}
