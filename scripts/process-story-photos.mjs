/**
 * One-off pipeline that turns curated raw our-story/journal photos into the
 * optimized JPEGs `photoPath.article`/`LITERAL_PHOTOS.ourStory` (lib/photo-paths.ts)
 * read. Same shape as scripts/process-content-photos.mjs — see that file for
 * the base pattern.
 *
 * Scope, per explicit decisions made with the requester (the curated source
 * material didn't map 1:1 the way destinations/experiences did):
 * - our-story/DSC06672.JPG (crew on Sea Familia 2's deck) is the
 *   `our-story.jpg` hero. `our-story-founding.jpg` (the "story" section's
 *   sidebar photo) later got its own dedicated source, OZS01467.JPG (a
 *   Labuan Bajo harbour-at-dusk shot) — its alt/caption in
 *   app/our-story/page.tsx was updated to match, since the original
 *   "before launch" wording was written for a different photo.
 * - journal/IMG_4525.jpg (one of six near-duplicate crops of the same bow
 *   lounge deck scene) is used as a shared generic/atmosphere image across
 *   all 8 article slugs — it doesn't depict any article's specific subject.
 * - Team headshots: lib/data/team.ts was later cut down to the 2 real
 *   co-founders shown in these photos (slugs `sean-justin`/`osbert`, using
 *   the `justin.png`/`osbert.png` headshots) — the other 3 real headshots
 *   (adam.png, andrew.png, rahmat-julio.png) tried in an earlier iteration
 *   are no longer referenced by any team.ts entry and are left unprocessed.
 *
 * Usage: npm run photos:process:story
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const PUBLIC = path.join(process.cwd(), 'public');
const HERO_WIDTH = 2400;

const ARTICLE_SLUGS = [
  'reading-the-current',
  'the-kitchen-on-a-swell',
  'a-reef-that-grew-on-lava',
  'eight-years-at-one-loom',
  'why-we-stopped-selling-fourteen-guests',
  'the-bagan-agreement',
  'night-watch',
  'what-we-buy-in-the-market',
];

// team.ts slug -> real headshot filename.
const TEAM_PHOTOS = {
  'sean-justin': 'justin',
  osbert: 'osbert',
};

const JOBS = [
  { src: 'assets/media/photos/our-story/DSC06672.JPG', dest: 'assets/media/photos/our-story.jpg' },
  { src: 'assets/media/photos/OZS01467.JPG', dest: 'assets/media/photos/our-story-founding.jpg' },
  ...ARTICLE_SLUGS.map((slug) => ({
    src: 'assets/media/photos/journal/IMG_4525.jpg',
    dest: `assets/media/photos/articles/${slug}.jpg`,
  })),
  ...Object.entries(TEAM_PHOTOS).map(([slug, file]) => ({
    src: `assets/media/photos/our-story/${file}.png`,
    dest: `assets/media/photos/team/${slug}.jpg`,
  })),
];

async function processJob(job) {
  const srcPath = path.join(PUBLIC, job.src);
  const destPath = path.join(PUBLIC, job.dest);
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  await sharp(srcPath)
    .rotate()
    .resize({ width: HERO_WIDTH, withoutEnlargement: true })
    .flatten({ background: '#ffffff' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(destPath);
  const { size } = fs.statSync(destPath);
  console.log(`${job.dest}  (${(size / 1024).toFixed(0)} KB)`);
}

async function run() {
  for (const job of JOBS) await processJob(job);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
