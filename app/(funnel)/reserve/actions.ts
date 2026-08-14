'use server';

/** Stand-in for POST /reservations, ported from reserve.html's `submit()`
 * — same fake-latency + `?state=error` pattern as contact/charter. The
 * client already runs validateStep() before this is ever called, so a
 * failure here (empty lead name/email or no cabin) means tampering rather
 * than a genuine user mistake — fail closed, matching contact's action. */
import { formatReference } from '@/lib/format';

export interface ReserveSubmission {
  depStart: string;
  totalGuests: number;
  cabinCode: string;
  leadName: string;
  leadEmail: string;
}

export interface ReserveActionResult {
  ok: boolean;
  reference?: string;
}

export async function submitReservation(data: ReserveSubmission, forcedError?: boolean): Promise<ReserveActionResult> {
  if (!data.leadName.trim() || !data.leadEmail.trim() || !data.cabinCode || !data.depStart) {
    return { ok: false };
  }

  await new Promise((resolve) => setTimeout(resolve, 1100));
  if (forcedError) return { ok: false };

  const seed = Number(data.depStart.replace(/-/g, '')) + data.totalGuests * 31 + data.cabinCode.length;
  return { ok: true, reference: formatReference(seed) };
}
