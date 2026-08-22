/**
 * The joining form's shape and validation. These are the per-guest details
 * the reservation funnel used to ask for up front; they moved here so that
 * nothing but contact details is needed before the deposit is paid.
 *
 * Follows the RHF + zod pattern established by /contact rather than
 * /reserve's reducer — this is a flat form with no business transitions.
 */
import { z } from 'zod';
import { EMAIL_RE } from '@/lib/validation';
import type { DivingLevel } from '@/features/reserve/state';

export const DIVING_OPTIONS: Array<{ value: DivingLevel; label: string }> = [
  { value: 'none', label: 'Not diving — snorkelling only' },
  { value: 'learning', label: 'Would like to learn on board' },
  { value: 'open-water', label: 'Open Water' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'rescue', label: 'Rescue or above' },
  { value: 'pro', label: 'Instructor / divemaster' },
];

const DIVING_VALUES = DIVING_OPTIONS.map((o) => o.value) as [DivingLevel, ...DivingLevel[]];

/** Matches formatReference(): 'SF-' plus six characters. */
const REFERENCE_RE = /^SF-[A-Za-z0-9]{6}$/;

export const guestSchema = z.object({
  name: z.string().trim().min(1, 'We need this guest’s name as it appears in the passport.'),
  nationality: z.string(),
  diving: z.enum(DIVING_VALUES),
  certNumber: z.string(),
  dives: z.number().min(0).max(9999),
  dietary: z.string(),
});

export const joiningSchema = z.object({
  reference: z.string().superRefine((val, ctx) => {
    const trimmed = val.trim();
    if (!trimmed) {
      ctx.addIssue({ code: 'custom', message: 'It is on your confirmation screen and in the confirmation email.' });
      return;
    }
    if (!REFERENCE_RE.test(trimmed)) {
      ctx.addIssue({ code: 'custom', message: 'References look like SF-26A7K4 — check it against your confirmation.' });
    }
  }),
  email: z.string().superRefine((val, ctx) => {
    const trimmed = val.trim();
    if (!trimmed) {
      ctx.addIssue({ code: 'custom', message: 'The address you booked with, so we can match this to the right reservation.' });
      return;
    }
    if (!EMAIL_RE.test(trimmed)) {
      ctx.addIssue({ code: 'custom', message: 'That address is missing something — check for a typo.' });
    }
  }),
  guests: z.array(guestSchema).min(1, 'Tell us about at least one guest.'),
});

export type GuestFormValues = z.infer<typeof guestSchema>;
export type JoiningFormValues = z.infer<typeof joiningSchema>;

export const EMPTY_GUEST_VALUES: GuestFormValues = {
  name: '',
  nationality: '',
  diving: 'none',
  certNumber: '',
  dives: 0,
  dietary: '',
};

export function joiningDefaults(reference: string): JoiningFormValues {
  return { reference, email: '', guests: [{ ...EMPTY_GUEST_VALUES }] };
}
