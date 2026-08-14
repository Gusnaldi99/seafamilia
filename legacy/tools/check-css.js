/* ============================================================================
   Sea Familia — is the compiled CSS current?
   ----------------------------------------------------------------------------
     node tools/check-css.js      (exit 0 = current, exit 1 = stale)

   Compiling introduced exactly one new way to break the site: add a class in
   markup, forget `npm run css`, and that class simply has no rule. Nothing
   throws, nothing logs — the element just looks wrong. This is the guard.

   It rebuilds into a temp file with the same input and config, then compares
   bytes with the committed assets/css/tailwind.css. A rebuild is the whole
   check, so there is no selector-escaping guesswork to get wrong.

   Unlike the other three QA scripts this one needs node_modules. If Tailwind is
   not installed it says so and exits 0, so `npm run qa` still works on a fresh
   copy of the deliverable where only the compiled CSS was shipped.
   ========================================================================== */
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const INPUT = 'assets/css/tailwind-input.css';
const OUTPUT = path.join(ROOT, 'assets/css/tailwind.css');

function cliEntry() {
  try {
    // tailwindcss/lib/cli.js is the entry the `tailwindcss` bin points at
    return require.resolve('tailwindcss/lib/cli.js', { paths: [ROOT] });
  } catch (e) {
    return null;
  }
}

if (!fs.existsSync(OUTPUT)) {
  console.log('✗ assets/css/tailwind.css is missing — run: npm run css');
  process.exit(1);
}

const entry = cliEntry();
if (!entry) {
  console.log('· tailwindcss is not installed — skipping the freshness check.');
  console.log('  To verify the compiled CSS matches the markup: npm install && npm run css:check');
  process.exit(0);
}

const tmp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'sf-css-')), 'out.css');
const run = spawnSync(process.execPath, [entry, '-i', INPUT, '-o', tmp], {
  cwd: ROOT,
  encoding: 'utf8',
});

if (run.status !== 0) {
  console.log('✗ the Tailwind build failed:\n' + (run.stderr || run.stdout || '(no output)'));
  process.exit(1);
}

const fresh = fs.readFileSync(tmp);
const shipped = fs.readFileSync(OUTPUT);
fs.rmSync(path.dirname(tmp), { recursive: true, force: true });

if (fresh.equals(shipped)) {
  console.log('✓ assets/css/tailwind.css is current (' +
    (shipped.length / 1024).toFixed(1) + ' KB)');
  process.exit(0);
}

console.log('✗ assets/css/tailwind.css is STALE — the markup has classes it does not cover.');
console.log('  shipped ' + shipped.length + ' bytes, a fresh build is ' + fresh.length + ' bytes.');
console.log('  Fix: npm run css');
process.exit(1);
