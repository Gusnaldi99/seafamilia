'use server';

/** Stand-in for POST /charter-enquiries, ported from charter.html's
 * `submit()` — same fake-latency + `?state=error` pattern as the contact
 * form's action. */
import { charterSchema, type CharterFormValues } from './schema';
import { formatReference } from '@/lib/format';

export interface CharterActionResult {
  ok: boolean;
  reference?: string;
}

export async function submitCharterEnquiry(values: CharterFormValues, forcedError?: boolean): Promise<CharterActionResult> {
  const parsed = charterSchema.safeParse(values);
  if (!parsed.success) return { ok: false };

  await new Promise((resolve) => setTimeout(resolve, 900));
  if (forcedError) return { ok: false };

  const groupTotal = parsed.data.adults + parsed.data.teens + parsed.data.children;
  const seed = groupTotal * 7919 + parsed.data.name.length;
  return { ok: true, reference: formatReference(seed) };
}
