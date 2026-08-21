/**
 * One-off pipeline that turns curated raw shoot photos into the optimized
 * JPEGs the app reads via lib/photo-paths.ts's `photoPath.*` helpers. See
 * the "Curated photo selections" table in the plan this script implements
 * for why each source file was picked.
 *
 * Usage: npm run photos:process
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, 'public');

const SIZES = {
  hero: 2400,
  gallery: 1600,
  cabin: 1000,
};

const JOBS = [
  // Sea Familia
  { kind: 'hero', src: 'assets/media/seafamilia/04. Vessel/DJI_0007.JPG', dest: 'assets/media/photos/boats/sea-familia.jpg' },
  { kind: 'gallery', src: 'assets/media/seafamilia/03. Communal Area/IMG_4575.jpg', dest: 'assets/media/photos/boats/sea-familia-gallery-1.jpg' },
  { kind: 'gallery', src: 'assets/media/seafamilia/04. Vessel/Drone SFI 0001.png', dest: 'assets/media/photos/boats/sea-familia-gallery-2.jpg' },
  { kind: 'gallery', src: 'assets/media/seafamilia/03. Communal Area/DSC04167.jpg', dest: 'assets/media/photos/boats/sea-familia-gallery-3.jpg' },
  { kind: 'gallery', src: 'assets/media/seafamilia/03. Communal Area/DSC04172.jpg', dest: 'assets/media/photos/boats/sea-familia-gallery-4.jpg' },
  { kind: 'cabin', src: 'assets/media/seafamilia/01. Manta Cabin/IMG_4462.jpg', dest: 'assets/media/photos/cabins/sea-familia-MN.jpg' },
  { kind: 'cabin', src: 'assets/media/seafamilia/02. Turtle Cabin/IMG_4542.jpg', dest: 'assets/media/photos/cabins/sea-familia-TR.jpg' },

  // Sea Familia 2
  { kind: 'hero', src: 'assets/media/seafamilia_II/Dining Room/6C588EC8-76F0-4506-B375-2258598D4F24.jpeg', dest: 'assets/media/photos/boats/sea-familia-2.jpg' },
  { kind: 'gallery', src: 'assets/media/seafamilia_II/Dining Room/03502059-BB65-4F05-9971-4298ADD4D034.jpeg', dest: 'assets/media/photos/boats/sea-familia-2-gallery-1.jpg' },
  { kind: 'gallery', src: 'assets/media/seafamilia_II/Dining Room/34E96494-682A-4443-B9E0-841280EF74CB.jpeg', dest: 'assets/media/photos/boats/sea-familia-2-gallery-2.jpg' },
  { kind: 'gallery', src: 'assets/media/seafamilia_II/Dining Room/BD8E0EE3-67D0-458E-876F-2132B0A26510.jpeg', dest: 'assets/media/photos/boats/sea-familia-2-gallery-3.jpg' },
  { kind: 'gallery', src: 'assets/media/seafamilia_II/Dining Room/C83D0F49-AFF7-4727-B529-1BE5B5942056.jpeg', dest: 'assets/media/photos/boats/sea-familia-2-gallery-4.jpg' },
  { kind: 'cabin', src: 'assets/media/seafamilia_II/Master Cabin/1E6F16EE-7263-4586-A5A9-E88995618EF9.jpeg', dest: 'assets/media/photos/cabins/sea-familia-2-MC.jpg' },
  { kind: 'cabin', src: 'assets/media/seafamilia_II/Twinbed Cabin/A8B275BD-E893-43AB-B3CE-16B926B3980F.jpeg', dest: 'assets/media/photos/cabins/sea-familia-2-DC.jpg' },
  { kind: 'cabin', src: 'assets/media/seafamilia_II/Family Cabin/92F44FC2-4C21-4A5B-8E56-408A0D7E2BC8.jpeg', dest: 'assets/media/photos/cabins/sea-familia-2-FC.jpg' },
  { kind: 'cabin', src: 'assets/media/seafamilia_II/Bunkbed Cabin/6D9D4F0C-9B76-4B6C-9056-292EB28B64C7.jpeg', dest: 'assets/media/photos/cabins/sea-familia-2-BB.jpg' },
];

async function run() {
  for (const job of JOBS) {
    const srcPath = path.join(PUBLIC, job.src);
    const destPath = path.join(PUBLIC, job.dest);
    fs.mkdirSync(path.dirname(destPath), { recursive: true });

    await sharp(srcPath)
      .rotate() // bake in EXIF orientation before it's stripped below
      .resize({ width: SIZES[job.kind], withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(destPath);

    const { size } = fs.statSync(destPath);
    console.log(`${job.dest}  (${(size / 1024).toFixed(0)} KB)`);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
