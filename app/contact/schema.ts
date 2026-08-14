/**
 * The contact form's shape and validation, ported from contact.html's
 * `contactForm()`. This is the site's first real form and establishes the
 * RHF + zod pattern the funnels (Phase 10) build on.
 */
import { z } from 'zod';
import { EMAIL_RE } from '@/lib/validation';

export const TOPICS = [
  {
    key: 'trip',
    label: 'Which trip suits us',
    note: 'Tell us who is coming, roughly when, and what you like doing. We will suggest two or three.',
    placeholder: 'Two of us, October, both Advanced, we would rather not see another boat all week…',
  },
  {
    key: 'booking',
    label: 'An existing booking',
    note: 'Quote your booking reference and we can see everything on our side.',
    placeholder: 'Reference SF-… — we would like to move to a later departure and add a night beforehand.',
  },
  {
    key: 'waitlist',
    label: 'Waitlist',
    note: 'We hold waitlists by hand and work through them in order. Cancellations happen more often than you would think.',
    placeholder: 'Please add us to the waitlist for…',
  },
  {
    key: 'charter',
    label: 'Private charter',
    note: 'The charter form asks better questions — but a plain message is fine too.',
    placeholder: 'Eight of us, one family, first week of July, ideally Komodo…',
  },
  {
    key: 'crew',
    label: 'Crewing with us',
    note: 'We hire from the islands we sail, and we train deck crew from scratch.',
    placeholder: 'I am from Labuan Bajo, I have two seasons as a deckhand…',
  },
  {
    key: 'other',
    label: 'Something else',
    note: 'Press, partnerships, a correction to something we wrote — all welcome.',
    placeholder: 'Whatever it is…',
  },
] as const;

export type ContactTopic = (typeof TOPICS)[number]['key'];
const TOPIC_KEYS = TOPICS.map((t) => t.key) as [ContactTopic, ...ContactTopic[]];

export const contactSchema = z.object({
  topic: z.enum(TOPIC_KEYS),
  name: z.string().trim().min(1, 'What should we call you?'),
  email: z.string().superRefine((val, ctx) => {
    const trimmed = val.trim();
    if (!trimmed) {
      ctx.addIssue({ code: 'custom', message: 'We need somewhere to reply.' });
      return;
    }
    if (!EMAIL_RE.test(trimmed)) {
      ctx.addIssue({ code: 'custom', message: 'That address is missing something — check for a typo.' });
    }
  }),
  phone: z.string().optional(),
  reference: z.string().optional(),
  message: z.string().superRefine((val, ctx) => {
    const trimmed = val.trim();
    if (!trimmed) {
      ctx.addIssue({ code: 'custom', message: 'Tell us what you need, in as much detail as you like.' });
      return;
    }
    if (trimmed.length < 10) {
      ctx.addIssue({ code: 'custom', message: 'A little more detail would help us reply properly.' });
    }
  }),
  consent: z.boolean().refine((v) => v === true, {
    message: 'We cannot reply without your permission to use these details.',
  }),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

export const CONTACT_DEFAULTS: ContactFormValues = {
  topic: 'trip',
  name: '',
  email: '',
  phone: '',
  reference: '',
  message: '',
  consent: false,
};
