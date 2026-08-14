'use client';

/**
 * Brand toast, ported from assets/js/layout.js's `SEA.toast()` — same 3
 * variants (success/error/info), same ring/bottom-bar/icon treatment, same
 * dismiss button and 6s auto-expiry. Built on shadcn's Sonner host
 * (components/ui/sonner.tsx's `<Toaster/>`, mounted once in the root
 * layout) via `toast.custom()` rather than Sonner's title/description API —
 * the brand card has no equivalent there.
 */
import * as React from 'react';
import { toast as sonnerToast } from 'sonner';
import { Check, Cross, Globe } from '@/components/icons';
import { cn } from '@/lib/utils';

export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastOptions {
  title: string;
  body?: string;
  variant?: ToastVariant;
  action?: { href: string; label: string };
  /** ms before auto-dismiss; 0 disables it. Defaults to 6000, as before. */
  timeout?: number;
}

const VARIANT: Record<
  ToastVariant,
  { ring: string; bar: string; iconCls: string; Icon: typeof Check }
> = {
  success: { ring: 'ring-mist-300', bar: 'bg-ink', iconCls: 'bg-mist-100 text-ink-700', Icon: Check },
  error: { ring: 'ring-flame/30', bar: 'bg-flame', iconCls: 'bg-flame/10 text-flame-600', Icon: Cross },
  info: { ring: 'ring-sand-300', bar: 'bg-mist', iconCls: 'bg-sand-200 text-ink-700', Icon: Globe },
};

export function toast(opts: ToastOptions) {
  const v = VARIANT[opts.variant ?? 'success'];
  const Icon = v.Icon;
  sonnerToast.custom(
    (id) => (
      <div className={cn('w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-lift ring-1', v.ring)}>
        <div className="flex items-start gap-3 p-4">
          <span className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-full', v.iconCls)}>
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-base leading-snug text-ink-700">{opts.title}</p>
            {opts.body ? <p className="mt-1 text-sm leading-relaxed text-ink/70">{opts.body}</p> : null}
            {opts.action ? (
              <a
                href={opts.action.href}
                className="mt-2.5 inline-flex items-center gap-1.5 font-mark text-[11px] uppercase tracking-[0.16em] text-flame-600 underline underline-offset-4"
              >
                {opts.action.label}
              </a>
            ) : null}
          </div>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => sonnerToast.dismiss(id)}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-ink/40 transition hover:bg-sand"
          >
            <Cross className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className={cn('h-0.5 w-full opacity-25', v.bar)} />
      </div>
    ),
    { duration: opts.timeout === 0 ? Infinity : opts.timeout ?? 6000 }
  );
}
