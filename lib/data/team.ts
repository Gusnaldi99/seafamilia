import type { TeamMember } from './types';

// Ported verbatim from assets/js/data.js §8 (6 records).
// Undocumented in HANDOFF §5, but real, rendered content (our-story.html,
// article author-bio blocks via teamMemberByName in lib/queries.ts).
export const team: TeamMember[] = [
  {
    slug: 'bimo-santoso',
    name: 'Bimo Santoso',
    role: 'Co-founder',
    home: 'Bira, South Sulawesi',
    ph: 'portrait',
    note: 'Grandson of a Konjo shipwright. Signed the loan for Familia Satu at 29 and still checks every hull himself.',
  },
  {
    slug: 'ratih-santoso',
    name: 'Ratih Santoso',
    role: 'Co-founder',
    home: 'Labuan Bajo',
    ph: 'portrait',
    note: 'Ran the office out of a spare room for three years. Handles every charter enquiry personally, which is why they take a day.',
  },
  {
    slug: 'ayu-prasetya',
    name: 'Ayu Prasetya',
    role: 'Cruise director',
    home: 'Labuan Bajo',
    ph: 'portrait',
    note: 'Learned the currents from her uncle’s outrigger at fourteen. Has logged over four thousand dives in the Flores Sea.',
  },
  {
    slug: 'yos-tanuwijaya',
    name: 'Captain Yos Tanuwijaya',
    role: 'Master, Bintang Laut',
    home: 'Ambon',
    ph: 'portrait',
    note: 'Twenty-two Banda crossings. Will change the day’s plan for a good breeze and make no apology.',
  },
  {
    slug: 'rudi-hartawan',
    name: 'Rudi Hartawan',
    role: 'Head cook',
    home: 'Makassar',
    ph: 'portrait',
    note: 'Cooks for sixteen with no gimballed stove. Buys whatever the market had, which is why the menu is written at 6am.',
  },
  {
    slug: 'lila-moerdani',
    name: 'Dr. Lila Moerdani',
    role: 'Marine biologist',
    home: 'Bogor',
    ph: 'portrait',
    note: 'Joins four crossings a season as guest lecturer. Runs the reef-monitoring plots the crew survey each month.',
  },
];
