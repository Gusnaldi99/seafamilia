'use server';

/**
 * Stand-in for POST /bookings/:ref/guests — the same fake-latency +
 * `?state=error` pattern as contact/charter/reserve. There is no booking
 * store to match the reference against yet, so this validates the shape and
 * accepts; a real backend would reject an unknown reference/email pair.
 */
import { joiningSchema, type JoiningFormValues } from './schema';

export interface JoiningActionResult {
  ok: boolean;
}

export async function submitJoiningForm(values: JoiningFormValues, forcedError?: boolean): Promise<JoiningActionResult> {
  const parsed = joiningSchema.safeParse(values);
  if (!parsed.success) {
    // The client already validated with the same schema — a failure here
    // means tampering, not a genuine user mistake. Fail closed.
    return { ok: false };
  }

  await new Promise((resolve) => setTimeout(resolve, 1100));
  if (forcedError) return { ok: false };

  return { ok: true };
}
