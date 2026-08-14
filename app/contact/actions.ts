'use server';

/**
 * Stand-in for POST /messages, ported from contact.html's `submit()`.
 * Still fake (a sleep() + a canned success) but living in a spot where
 * swapping in a real backend call later is a one-function change — and
 * `formatReference()`'s reference-number generation now happens server-side,
 * closing HANDOFF's own production checklist item 6.
 */
import { contactSchema, type ContactFormValues } from './schema';
import { formatReference } from '@/lib/format';

export interface ContactActionResult {
  ok: boolean;
  reference?: string;
}

export async function submitContactMessage(values: ContactFormValues, forcedError?: boolean): Promise<ContactActionResult> {
  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) {
    // The client already validated with the same schema — a failure here
    // means tampering, not a genuine user mistake. Fail closed.
    return { ok: false };
  }

  await new Promise((resolve) => setTimeout(resolve, 800));
  if (forcedError) return { ok: false };

  const seed = parsed.data.message.length * 131 + parsed.data.name.length;
  return { ok: true, reference: formatReference(seed) };
}
