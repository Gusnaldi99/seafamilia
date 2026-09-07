/**
 * One-off pipeline that turns curated raw destination/experience/departure
 * photos into the optimized JPEGs lib/photo-paths.ts's `photoPath.*` helpers
 * read. Same shape as scripts/process-boat-photos.mjs (which handles
 * boats/cabins) — see that file for the base pattern.
 *
 * The Alor source is a DNG (raw drone capture; no JPEG sibling was supplied
 * and no exiftool/imagemagick/dcraw is available to convert it), so
 * extractDngPreview walks the DNG's TIFF/IFD structure by hand to pull out
 * whichever embedded JPEG preview is largest — sharp/libvips can't decode
 * DNG directly. Best-effort: if no usable preview is found, that job is
 * skipped and the page keeps rendering its gradient placeholder, same as
 * every other not-yet-shot photo.
 *
 * Usage: npm run photos:process:content
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, 'public');
const HERO_WIDTH = 2400;

const JOBS = [
  { src: 'assets/media/photos/destinations/komodo/20240322-KomodoD-65.jpg', dest: 'assets/media/photos/waters/komodo.jpg' },
  { src: 'assets/media/photos/destinations/sumbawa/20240322-KomodoD-155.jpg', dest: 'assets/media/photos/waters/sumbawa.jpg' },
  { src: 'assets/media/photos/experiences/diving/GOPR1385.JPG', dest: 'assets/media/photos/experiences/diving.jpg' },
  { src: 'assets/media/photos/experiences/culture/OZS03053.JPG', dest: 'assets/media/photos/experiences/culture.jpg' },
  { src: 'assets/media/photos/experiences/family_voyages/OZS02155.JPG', dest: 'assets/media/photos/experiences/family.jpg' },
  { src: 'assets/media/photos/experiences/remote_passages/OZS02727.JPG', dest: 'assets/media/photos/experiences/remote.jpg' },
  { src: 'assets/media/photos/experiences/photography/OZS01564.JPG', dest: 'assets/media/photos/experiences/light.jpg' },
  { src: 'assets/media/photos/20240322-KomodoD-28.jpg', dest: 'assets/media/photos/experiences/wellness.jpg' },
  { src: 'assets/media/photos/departures/OZS02724.JPG', dest: 'assets/media/photos/trips/three-days-aboard-sea-familia.jpg' },
  { src: 'assets/media/photos/departures/GOPR1385.JPG', dest: 'assets/media/photos/trips/three-days-aboard-sea-familia-2.jpg' },
];

const DNG_JOB = { src: 'assets/media/photos/destinations/alor/PANO0003.DNG', dest: 'assets/media/photos/waters/alor.jpg' };

// --- DNG preview extraction -------------------------------------------------

const TAG = {
  ImageWidth: 256,
  Compression: 259,
  PhotometricInterpretation: 262,
  StripOffsets: 273,
  StripByteCounts: 279,
  SubIFDs: 330,
  JPEGInterchangeFormat: 513,
  JPEGInterchangeFormatLength: 514,
  TileOffsets: 324,
};

const TYPE_SIZE = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 6: 1, 7: 1, 8: 2, 9: 4, 10: 8, 11: 4, 12: 8 };

function readIfdValues(buf, le, type, count, valueOffsetField) {
  const size = TYPE_SIZE[type] ?? 1;
  const readAt = (base) => {
    const out = [];
    for (let i = 0; i < count; i++) {
      const off = base + i * size;
      if (type === 3) out.push(le ? buf.readUInt16LE(off) : buf.readUInt16BE(off));
      else if (type === 4) out.push(le ? buf.readUInt32LE(off) : buf.readUInt32BE(off));
      else out.push(buf.readUInt8(off));
    }
    return out;
  };
  if (size * count <= 4) return readAt(valueOffsetField);
  const offset = le ? buf.readUInt32LE(valueOffsetField) : buf.readUInt32BE(valueOffsetField);
  return readAt(offset);
}

function readIfd(buf, le, offset) {
  const entryCount = le ? buf.readUInt16LE(offset) : buf.readUInt16BE(offset);
  const entries = new Map();
  for (let i = 0; i < entryCount; i++) {
    const eOff = offset + 2 + i * 12;
    const tag = le ? buf.readUInt16LE(eOff) : buf.readUInt16BE(eOff);
    const type = le ? buf.readUInt16LE(eOff + 2) : buf.readUInt16BE(eOff + 2);
    const count = le ? buf.readUInt32LE(eOff + 4) : buf.readUInt32BE(eOff + 4);
    entries.set(tag, readIfdValues(buf, le, type, count, eOff + 8));
  }
  const nextOffset = le ? buf.readUInt32LE(offset + 2 + entryCount * 12) : buf.readUInt32BE(offset + 2 + entryCount * 12);
  return { entries, nextOffset };
}

/** Walks every IFD reachable from the header (via NextIFD chaining and via
 * SubIFDs), then returns the largest embedded JPEG (YCbCr/RGB, single
 * contiguous strip — not tiled) it can find, or null. */
function extractDngPreview(buf) {
  const byteOrder = buf.toString('ascii', 0, 2);
  if (byteOrder !== 'II' && byteOrder !== 'MM') return null;
  const le = byteOrder === 'II';
  const magic = le ? buf.readUInt16LE(2) : buf.readUInt16BE(2);
  if (magic !== 42) return null;

  const toVisit = [le ? buf.readUInt32LE(4) : buf.readUInt32BE(4)];
  const visited = new Set();
  const ifds = [];

  while (toVisit.length) {
    const offset = toVisit.pop();
    if (!offset || visited.has(offset)) continue;
    visited.add(offset);
    let ifd;
    try {
      ifd = readIfd(buf, le, offset);
    } catch {
      continue;
    }
    ifds.push(ifd);
    if (ifd.nextOffset) toVisit.push(ifd.nextOffset);
    for (const sub of ifd.entries.get(TAG.SubIFDs) ?? []) toVisit.push(sub);
  }

  const candidates = [];
  for (const ifd of ifds) {
    const compression = ifd.entries.get(TAG.Compression)?.[0];
    const photometric = ifd.entries.get(TAG.PhotometricInterpretation)?.[0];
    if (compression !== 6 && compression !== 7) continue; // not JPEG-compressed
    if (photometric !== 2 && photometric !== 6) continue; // not RGB/YCbCr (excludes raw CFA sensor data)
    if (ifd.entries.has(TAG.TileOffsets)) continue; // tiled JPEG — not one extractable blob

    const width = ifd.entries.get(TAG.ImageWidth)?.[0] ?? 0;
    const jpegIF = ifd.entries.get(TAG.JPEGInterchangeFormat)?.[0];
    const jpegIFLength = ifd.entries.get(TAG.JPEGInterchangeFormatLength)?.[0];
    const stripOffsets = ifd.entries.get(TAG.StripOffsets);
    const stripByteCounts = ifd.entries.get(TAG.StripByteCounts);

    if (jpegIF !== undefined && jpegIFLength) {
      candidates.push({ width, data: buf.subarray(jpegIF, jpegIF + jpegIFLength) });
    } else if (stripOffsets?.length === 1 && stripByteCounts?.length === 1) {
      candidates.push({ width, data: buf.subarray(stripOffsets[0], stripOffsets[0] + stripByteCounts[0]) });
    }
  }

  candidates.sort((a, b) => b.width - a.width);
  for (const candidate of candidates) {
    if (candidate.data.length > 2 && candidate.data[0] === 0xff && candidate.data[1] === 0xd8) return candidate.data;
  }
  return null;
}

// --- run ---------------------------------------------------------------

async function processJob(job, input) {
  const destPath = path.join(PUBLIC, job.dest);
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  await sharp(input)
    .rotate()
    .resize({ width: HERO_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(destPath);
  const { size } = fs.statSync(destPath);
  console.log(`${job.dest}  (${(size / 1024).toFixed(0)} KB)`);
}

async function run() {
  for (const job of JOBS) {
    const srcPath = path.join(PUBLIC, job.src);
    if (!fs.existsSync(srcPath)) {
      console.log(`Skipped ${job.dest}: raw source ${job.src} no longer on disk (already processed previously)`);
      continue;
    }
    await processJob(job, srcPath);
  }

  if (!fs.existsSync(path.join(PUBLIC, DNG_JOB.src))) {
    console.log(`Skipped ${DNG_JOB.dest}: raw source ${DNG_JOB.src} no longer on disk (already processed previously)`);
    return;
  }
  const dngBuffer = fs.readFileSync(path.join(PUBLIC, DNG_JOB.src));
  const preview = extractDngPreview(dngBuffer);
  if (!preview) {
    console.warn(`Skipped ${DNG_JOB.dest}: no extractable JPEG preview found inside ${DNG_JOB.src}`);
    return;
  }
  await processJob(DNG_JOB, preview);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
