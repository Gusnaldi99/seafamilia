'use client';

/**
 * Ported from assets/js/data.js's `SEA.load()` — a fake-latency promise
 * wrapper every filterable listing awaited before showing results. The
 * data is already in memory (lib/data), so this exists purely to keep the
 * loading skeleton reachable and the `?state=loading|error` QA overrides
 * working (see lib/qa.ts) — not to simulate a real network call.
 */
import * as React from 'react';
import type { ForcedState } from '@/lib/qa';

export type ListingState = 'loading' | 'ready' | 'error';

export function useListingLoad(forced: ForcedState | null, delay = 420) {
  const [state, setState] = React.useState<ListingState>('loading');
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    // Resets to 'loading' on every reload() (tick bump) or forced/delay
    // change, not just on mount — this *is* the synchronization with the
    // external timer below, not a derivable-at-render value.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState('loading');
    if (forced === 'loading') return; // never resolves, matching SEA.load()
    const handle = setTimeout(() => setState(forced === 'error' ? 'error' : 'ready'), delay);
    return () => clearTimeout(handle);
  }, [forced, delay, tick]);

  const reload = React.useCallback(() => setTick((n) => n + 1), []);

  return { state, reload };
}
