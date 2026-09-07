import type { TeamMember } from './types';

// Ported verbatim from assets/js/data.js §8 (6 records).
// Undocumented in HANDOFF §5, but real, rendered content (our-story.html,
// article author-bio blocks via teamMemberByName in lib/queries.ts).
export const team: TeamMember[] = [
  {
    slug: 'sean-justin',
    name: 'Sean Justin',
    role: 'Co-founder',
    home: 'Labuan Bajo',
    ph: 'portrait',
    note: 'Helped take Sea Familia from one boat to KLM Sea Familia I & II, and the Sea Familia Dive Academy.',
  },
  {
    slug: 'osbert',
    name: 'Osbert',
    role: 'Co-founder',
    home: 'Labuan Bajo',
    ph: 'portrait',
    note: 'Built Sea Familia into a bigger group alongside KLM Sea Familia I & II — with KLM Sea Familia III still on the way.',
  },
];
