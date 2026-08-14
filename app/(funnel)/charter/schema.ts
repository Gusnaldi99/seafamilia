/** Ported from charter.html's `charterFunnel()` — one schema for the whole
 * enquiry (steps 2–4); step 3 (boat/waters/experiences/notes) has no
 * validation in the original and stays that way here. */
import { z } from 'zod';
import { EMAIL_RE } from '@/lib/validation';

export const NIGHTS_OPTIONS = [
  { value: '', label: 'Not sure yet' },
  { value: '3-5', label: '3 – 5 nights' },
  { value: '6-8', label: '6 – 8 nights' },
  { value: '9-12', label: '9 – 12 nights' },
  { value: '13+', label: 'Longer than a fortnight' },
] as const;

export const CONTACT_VIA = ['Email', 'WhatsApp', 'A phone call'] as const;

export const COUNTERS = [
  { key: 'adults', label: 'Adults', note: '16 and over', min: 0, max: 24 },
  { key: 'teens', label: 'Teenagers', note: '12 – 15', min: 0, max: 12 },
  { key: 'children', label: 'Children', note: '4 – 11 — younger, please ask', min: 0, max: 12 },
] as const;

export const charterSchema = z
  .object({
    from: z.string(),
    to: z.string(),
    flexible: z.boolean(),
    nights: z.string(),
    adults: z.number().min(0).max(24),
    teens: z.number().min(0).max(12),
    children: z.number().min(0).max(12),
    boat: z.string(),
    waters: z.array(z.string()),
    experiences: z.array(z.string()),
    notes: z.string().max(600),
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    country: z.string(),
    contactVia: z.enum(CONTACT_VIA),
    consent: z.boolean(),
    newsletter: z.boolean(),
  })
  .superRefine((val, ctx) => {
    if (!val.flexible) {
      if (!val.from && !val.to) {
        ctx.addIssue({ code: 'custom', path: ['to'], message: 'Give us a rough window, or tick “our dates are open”.' });
      } else if (val.from && val.to && val.to < val.from) {
        ctx.addIssue({ code: 'custom', path: ['to'], message: 'The return date is before the departure date.' });
      }
    }
    if (val.adults + val.teens + val.children < 1) {
      ctx.addIssue({ code: 'custom', path: ['adults'], message: 'There has to be at least one of you.' });
    }
    if (!val.name.trim()) {
      ctx.addIssue({ code: 'custom', path: ['name'], message: 'What should we call you?' });
    }
    const email = val.email.trim();
    if (!email) {
      ctx.addIssue({ code: 'custom', path: ['email'], message: 'We need somewhere to send the quote.' });
    } else if (!EMAIL_RE.test(email)) {
      ctx.addIssue({ code: 'custom', path: ['email'], message: 'That address is missing something — check for a typo.' });
    }
    if (!val.consent) {
      ctx.addIssue({ code: 'custom', path: ['consent'], message: 'We cannot reply without your permission to use these details.' });
    }
  });

export type CharterFormValues = z.infer<typeof charterSchema>;

export const CHARTER_DEFAULTS: CharterFormValues = {
  from: '',
  to: '',
  flexible: false,
  nights: '',
  adults: 2,
  teens: 0,
  children: 0,
  boat: '',
  waters: [],
  experiences: [],
  notes: '',
  name: '',
  email: '',
  phone: '',
  country: '',
  contactVia: 'Email',
  consent: false,
  newsletter: false,
};
