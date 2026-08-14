'use client';

/** Ported from article.html's share button (`navigator.clipboard` +
 * `SEA.toast()`). Email uses a plain mailto: link server-side, so only the
 * copy button needs to be a client component. */
import * as React from 'react';
import { LinkIcon } from '@/components/icons';
import { toast } from '@/lib/toast';

export function CopyLinkButton() {
  const [copied, setCopied] = React.useState(false);

  async function handleClick() {
    if (!navigator.clipboard) return;
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast({ title: 'Link copied', variant: 'info', timeout: 3000 });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex h-10 items-center gap-2 rounded-full border border-sand-300 px-4 font-mark text-[11px] uppercase tracking-[0.12em] text-ink-700 transition hover:border-mist"
    >
      <LinkIcon className="h-4 w-4" aria-hidden="true" />
      <span>{copied ? 'Copied' : 'Copy link'}</span>
    </button>
  );
}
