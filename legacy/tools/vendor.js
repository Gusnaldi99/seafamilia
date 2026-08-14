/* ============================================================================
   Sea Familia — vendoring third-party assets
   ----------------------------------------------------------------------------
   The site loads nothing from a third-party origin. This script is what fetches
   the two things that used to come from a CDN and writes them into the project.

     node tools/vendor.js            both
     node tools/vendor.js fonts      Google Fonts → assets/fonts/ + assets/css/fonts.css
     node tools/vendor.js alpine     Alpine       → assets/js/vendor/

   Run it once. Re-run it only to change the font request or bump Alpine — the
   downloaded files are part of the deliverable and are committed, so a fresh
   checkout needs no network at all.

   Needs network. Zero dependencies (Node's built-in fetch).
   ========================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

/* The exact request the pages used to make. Kept verbatim so the delivered
   faces are the ones the design was approved against:
     Fraunces  roman 300–600 + italic 300–500, optical size axis 9–144
     Inter     roman 300–600
     Jost      roman 300–600 */
const FONT_CSS_URL =
  'https://fonts.googleapis.com/css2' +
  '?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..500' +
  '&family=Inter:wght@300..600' +
  '&family=Jost:wght@300..600' +
  '&display=swap';

/* Google splits every family into unicode-range subsets. We serve Indonesian and
   English, so Latin is all we need; Inter alone would otherwise drag in Cyrillic,
   Greek and Vietnamese for nothing. */
const KEEP_SUBSETS = ['latin', 'latin-ext'];

/* Google returns woff2 only when it believes the client supports it. */
const UA_MODERN =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';

const ALPINE_VERSION = '3.14.9';
const ALPINE_URL =
  'https://cdn.jsdelivr.net/npm/alpinejs@' + ALPINE_VERSION + '/dist/cdn.min.js';
const ALPINE_OUT = 'assets/js/vendor/alpine-' + ALPINE_VERSION + '.min.js';

/* --------------------------------------------------------------------------
   Helpers
   ------------------------------------------------------------------------ */
function kb(bytes) {
  return (bytes / 1024).toFixed(1) + ' KB';
}

function ensureDir(rel) {
  fs.mkdirSync(path.join(ROOT, rel), { recursive: true });
}

async function get(url, asText) {
  const res = await fetch(url, { headers: { 'user-agent': UA_MODERN } });
  if (!res.ok) throw new Error(res.status + ' ' + res.statusText + ' ← ' + url);
  return asText ? res.text() : Buffer.from(await res.arrayBuffer());
}

/* --------------------------------------------------------------------------
   Fonts

   Google's css2 response is a run of @font-face blocks. Each one carries the
   family, the style, a weight range, one src URL and one unicode-range. We keep
   the Latin blocks, download their woff2, and re-emit the same rules pointing at
   the local copies — the unicode-range is preserved so the browser still only
   downloads the subset a page actually needs.
   ------------------------------------------------------------------------ */
function parseFontFaces(css) {
  return [...css.matchAll(/@font-face\s*\{([^}]*)\}/g)].map((m) => {
    const body = m[1];
    const one = (re) => {
      const hit = re.exec(body);
      return hit ? hit[1].trim() : '';
    };
    return {
      family: one(/font-family:\s*'([^']+)'/),
      style: one(/font-style:\s*([^;]+);/) || 'normal',
      weight: one(/font-weight:\s*([^;]+);/) || '400',
      stretch: one(/font-stretch:\s*([^;]+);/),
      url: one(/src:\s*url\(([^)]+)\)/),
      range: one(/unicode-range:\s*([^;]+);/),
      // the comment above each block names the subset: /* latin-ext */
      subset: '',
    };
  });
}

/** Google labels each block with a CSS comment naming its subset — pair them up. */
function withSubsets(css, faces) {
  const labels = [...css.matchAll(/\/\*\s*([a-z0-9-]+)\s*\*\//g)].map((m) => m[1]);
  faces.forEach((f, i) => { f.subset = labels[i] || 'unknown'; });
  return faces;
}

function fileNameFor(face) {
  const family = face.family.toLowerCase().replace(/\s+/g, '-');
  const italic = face.style === 'italic' ? 'italic-' : '';
  return family + '-' + italic + face.subset + '.woff2';
}

async function vendorFonts() {
  console.log('· fonts — GET ' + FONT_CSS_URL.slice(0, 58) + '…');
  const css = await get(FONT_CSS_URL, true);

  const all = withSubsets(css, parseFontFaces(css));
  if (!all.length) throw new Error('no @font-face blocks in the Google response');
  const faces = all.filter((f) => KEEP_SUBSETS.indexOf(f.subset) !== -1);
  if (!faces.length) {
    throw new Error('no ' + KEEP_SUBSETS.join('/') + ' subsets found — ' +
      'Google returned: ' + [...new Set(all.map((f) => f.subset))].join(', '));
  }
  console.log('  ' + all.length + ' faces offered, keeping ' + faces.length +
    ' (' + KEEP_SUBSETS.join(' + ') + ')');

  ensureDir('assets/fonts');
  let total = 0;

  for (const face of faces) {
    const name = fileNameFor(face);
    const buf = await get(face.url, false);
    fs.writeFileSync(path.join(ROOT, 'assets/fonts', name), buf);
    face.file = name;
    total += buf.length;
    console.log('  wrote  assets/fonts/' + name.padEnd(34) + kb(buf.length));
  }

  const rules = faces.map((f) => [
    '@font-face {',
    "  font-family: '" + f.family + "';",
    '  font-style: ' + f.style + ';',
    '  font-weight: ' + f.weight + ';',
    f.stretch ? '  font-stretch: ' + f.stretch + ';' : null,
    '  font-display: swap;',
    "  src: url('../fonts/" + f.file + "') format('woff2');",
    '  unicode-range: ' + f.range + ';',
    '}',
  ].filter(Boolean).join('\n')).join('\n\n');

  const out = [
    '/* GENERATED FILE — do not edit by hand.',
    '   Rebuild: node tools/vendor.js fonts',
    '',
    '   Self-hosted from Google Fonts, ' + KEEP_SUBSETS.join(' + ') + ' subsets only.',
    '   Source request:',
    '     ' + FONT_CSS_URL,
    '',
    '   Fraunces carries the optical-size axis (opsz 9..144); app.css opts into it',
    '   with `.font-display { font-optical-sizing: auto }`. The unicode-range on',
    '   each rule is Google\'s own, so a page still downloads only the subset it',
    '   actually needs. */',
    '',
    rules,
    '',
  ].join('\n');

  fs.writeFileSync(path.join(ROOT, 'assets/css/fonts.css'), out);
  console.log('  wrote  assets/css/fonts.css' + ' '.repeat(21) + kb(out.length));
  console.log('  ' + faces.length + ' files, ' + kb(total) + ' total');
  return faces;
}

/* --------------------------------------------------------------------------
   Alpine
   ------------------------------------------------------------------------ */
async function vendorAlpine() {
  console.log('· alpine — GET ' + ALPINE_URL);
  const buf = await get(ALPINE_URL, false);
  // A truncated bundle would be a silent disaster: Alpine simply never boots.
  if (buf.length < 30000) throw new Error('suspiciously small bundle: ' + buf.length + ' bytes');
  if (buf.indexOf('Alpine') === -1) throw new Error('bundle does not mention Alpine');
  ensureDir('assets/js/vendor');
  fs.writeFileSync(path.join(ROOT, ALPINE_OUT), buf);
  console.log('  wrote  ' + ALPINE_OUT.padEnd(41) + kb(buf.length));
}

/* --------------------------------------------------------------------------
   CLI
   ------------------------------------------------------------------------ */
async function main() {
  const what = process.argv[2] || 'all';
  if (what !== 'all' && what !== 'fonts' && what !== 'alpine') {
    console.log('usage: node tools/vendor.js [fonts|alpine]');
    process.exit(1);
  }
  if (what === 'all' || what === 'fonts') await vendorFonts();
  if (what === 'all' || what === 'alpine') await vendorAlpine();
  console.log('\n✓ vendored — the site now loads nothing from a third-party origin');
}

main().catch((e) => {
  console.error('✗ ' + e.message);
  process.exit(1);
});
