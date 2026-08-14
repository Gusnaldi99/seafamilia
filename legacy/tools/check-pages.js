/* Static verification of the Sea Familia build.
   1. inline <script> blocks parse
   2. every literal internal href/src resolves (Alpine :href bindings excluded)
   3. every .ph-* class used in markup or data is defined in app.css
   4. every x-data="fn()" has a matching function in the page or layout.js
   5. every SEA.* member used in markup exists (data.js surface + layout.js additions)
   6. page contract: the three marker blocks, the assets, layout.js last
   7. tag balance
   8. every page is reachable from the global chrome or another page
   9. no third-party origin, and tailwind.css still precedes app.css
*/
/* Usage:  node tools/check-pages.js       (exit 0 = clean) */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

const pages = fs.readdirSync(ROOT).filter(f => f.endsWith('.html')).sort();
const css = fs.readFileSync(path.join(ROOT, 'assets/css/app.css'), 'utf8');
const dataJs = fs.readFileSync(path.join(ROOT, 'assets/js/data.js'), 'utf8');
const layoutJs = fs.readFileSync(path.join(ROOT, 'assets/js/layout.js'), 'utf8');

// deliberate: dropped in later by the client, poster carries the hero until then
const INTENTIONALLY_ABSENT = new Set([
  'assets/media/hero.mp4', 'assets/media/hero.webm',
  // one-off hero/section photos with no content record to key a slug off of —
  // the .ph gradient behind each <img class="img-slot"> carries these until
  // the client drops real photography into assets/media/photos/. Every OTHER
  // photo path in the site is slug-driven (SEA.photoPath.*) and reached only
  // through an Alpine :src binding, which this literal-href check never sees.
  'assets/media/photos/404.jpg', 'assets/media/photos/charter.jpg',
  'assets/media/photos/error.jpg', 'assets/media/photos/our-story.jpg',
  'assets/media/photos/our-story-founding.jpg',
]);

/* The only remote host a page may still LOAD from. Tailwind, Alpine and the fonts
   are vendored (see partials/assets.html); this one is a stand-in hero clip until
   assets/media/hero.mp4 arrives — production checklist item 7. It is preload="none"
   behind an SVG poster, so an unreachable network costs nothing but the motion.
   Outbound <a href> links (wa.me) are not asset loads and are not checked here. */
const REMOTE_ASSETS_OK = new Set(['assets.mixkit.co']);

const problems = [];
const notes = [];
const fail = (page, msg) => problems.push(page + ': ' + msg);

/* ---- SEA public surface: data.js return block + anything layout.js attaches -- */
const surface = (() => {
  const m = dataJs.match(/return \{([\s\S]*?)\n  \};\n\}\)\(\);/);
  if (!m) { fail('data.js', 'could not parse the public surface'); return new Set(); }
  const set = new Set(
    m[1].replace(/\/\/[^\n]*/g, '')
      .split(/[,\n]/)
      .map(s => s.trim().replace(/:.*$/, '').trim())
      .filter(s => /^[A-Za-z_$][\w$]*$/.test(s))
  );
  [...layoutJs.matchAll(/\bSEA\.([A-Za-z_$][\w$]*)\s*=/g)].forEach(x => set.add(x[1]));
  return set;
})();

const phDefined = new Set([...css.matchAll(/\.ph-([a-z-]+)\s*\{/g)].map(m => m[1]));
// allow indentation, e.g. classes declared inside @media print
const customClasses = new Set([...css.matchAll(/^[ \t]*\.([a-z][a-z0-9-]*)/gm)].map(m => m[1]));

const linkedPages = new Set();

pages.forEach(page => {
  const src = fs.readFileSync(path.join(ROOT, page), 'utf8');

  /* --- 1. inline scripts parse ------------------------------------------- */
  [...src.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].forEach((m, i) => {
    try { new Function(m[1]); }
    catch (e) { fail(page, 'inline script #' + (i + 1) + ' fails to parse — ' + e.message); }
  });

  /* --- 2. literal internal hrefs/srcs ----------------------------------- */
  // (?<![:\w-]) keeps Alpine's :href / x-bind:src out of the file check, and
  // script bodies are stripped first so href="' + x + '" inside JS is ignored
  const markup = src.replace(/<script[\s\S]*?<\/script>/g, '');
  [...markup.matchAll(/(?<![:\w-])(?:href|src)="([^"]*)"/g)].forEach(m => {
    const h = m[1];
    if (!h || h.startsWith('#')) return;
    if (/^(https?:|mailto:|tel:|data:|\/\/)/.test(h)) return;
    const clean = h.split('#')[0].split('?')[0];
    if (!clean) return;
    if (INTENTIONALLY_ABSENT.has(clean)) { notes.push(page + ': ' + clean + ' absent by design (poster fallback)'); return; }
    if (!fs.existsSync(path.join(ROOT, clean))) fail(page, 'missing file → ' + clean);
    if (clean.endsWith('.html')) linkedPages.add(clean);
  });

  /* page targets referenced from script/expressions */
  [...src.matchAll(/(?:SEA\.href\(|location\.href\s*=\s*)'([\w.-]+\.html)'/g)].forEach(m => {
    if (!fs.existsSync(path.join(ROOT, m[1]))) fail(page, 'link to missing page → ' + m[1]);
    linkedPages.add(m[1]);
  });

  /* --- 3. ph-* classes -------------------------------------------------- */
  [...src.matchAll(/\bph-([a-z-]+)\b/g)].forEach(m => {
    if (!phDefined.has(m[1])) fail(page, 'undefined placeholder class → .ph-' + m[1]);
  });

  /* --- 4. x-data functions --------------------------------------------- */
  [...src.matchAll(/x-data="([A-Za-z_$][\w$]*)\(\)"/g)].forEach(m => {
    const fn = m[1];
    if (new RegExp('function\\s+' + fn + '\\s*\\(').test(src)) return;
    if (new RegExp('window\\.' + fn + '\\s*=').test(layoutJs)) return;
    fail(page, 'x-data references undefined function → ' + fn + '()');
  });

  /* --- 5. SEA.* members ------------------------------------------------- */
  [...src.matchAll(/SEA\.([A-Za-z_$][\w$]*)/g)].forEach(m => {
    if (!surface.has(m[1])) fail(page, 'SEA.' + m[1] + ' is not on the public surface');
  });

  /* --- 6. page contract ------------------------------------------------- */
  ['<!-- sea:assets', '<!-- /sea:assets -->',
    '<!-- sea:header', '<!-- /sea:header -->', '<!-- sea:footer', '<!-- /sea:footer -->',
    'assets/js/layout.js', 'assets/js/data.js', 'assets/js/vendor/alpine-',
    'assets/css/fonts.css', 'assets/css/tailwind.css', 'assets/css/app.css',
    'id="main"', '<html lang=', '<title>', 'name="viewport"', 'assets/media/favicon.svg',
  ].forEach(needle => {
    if (src.indexOf(needle) === -1) fail(page, 'page contract: missing ' + needle);
  });
  // The chrome is static now, but seaChrome()/seaNewsletter() must still be
  // defined before the deferred Alpine bundle boots.
  const lastScript = src.lastIndexOf('<script');
  if (src.slice(lastScript).indexOf('assets/js/layout.js') === -1) {
    fail(page, 'layout.js is not the final script tag (seaChrome would be undefined at Alpine init)');
  }
  // the JS-injection hosts should be gone entirely
  ['id="sea-header"', 'id="sea-footer"'].forEach(dead => {
    if (src.indexOf(dead) !== -1) fail(page, 'leftover injection host: ' + dead);
  });

  /* --- 9. self-contained, and the cascade order holds -------------------
     Tailwind, Alpine and the fonts are vendored. Anything reaching a remote host
     again would work on the developer's machine and fail behind a firewall or on
     a plane, so it fails the build instead. */
  ['cdn.tailwindcss.com', 'cdn.jsdelivr.net', 'unpkg.com',
    'fonts.googleapis.com', 'fonts.gstatic.com',
  ].forEach(host => {
    if (src.indexOf(host) !== -1) fail(page, 'third-party origin is back → ' + host);
  });
  /* Outbound <a href> to wa.me is the point of the button; what must stay local is
     everything the page LOADS. src= plus the stylesheet/preload hrefs. */
  [...markup.matchAll(/(?<![:\w-])src="(https?:\/\/[^"]*)"/g)].forEach(m => {
    const host = m[1].replace(/^https?:\/\//, '').split('/')[0];
    if (!REMOTE_ASSETS_OK.has(host)) fail(page, 'loads a remote asset → ' + m[1]);
  });
  [...markup.matchAll(/rel="(?:stylesheet|preload)"[^>]*href="(https?:\/\/[^"]*)"/g)].forEach(m => {
    fail(page, 'loads a remote stylesheet/preload → ' + m[1]);
  });
  // app.css holds what Tailwind cannot express and is meant to have the last word
  const twAt = src.indexOf('assets/css/tailwind.css');
  const appAt = src.indexOf('assets/css/app.css');
  if (twAt !== -1 && appAt !== -1 && twAt > appAt) {
    fail(page, 'cascade: app.css is loaded before tailwind.css');
  }

  /* --- 7. tag balance --------------------------------------------------
     Counted on structural markup only: script bodies are already stripped from
     `markup`, and comments come out here too — a comment that mentions a tag by
     name, or example markup inside one, is prose and must not be counted. */
  const structural = markup.replace(/<!--[\s\S]*?-->/g, '');
  ['div', 'section', 'template', 'aside', 'form', 'fieldset', 'ol', 'ul', 'table', 'main',
    'header', 'nav', 'figure', 'dl', 'article'].forEach(tag => {
    const open = (structural.match(new RegExp('<' + tag + '(?=[\\s>])', 'g')) || []).length;
    const close = (structural.match(new RegExp('</' + tag + '>', 'g')) || []).length;
    if (open !== close) fail(page, `<${tag}> unbalanced: ${open} open vs ${close} close`);
  });
});

/* --- placeholders referenced from the content model --------------------- */
[...dataJs.matchAll(/\bph:\s*'([a-z-]+)'/g)].forEach(m => {
  if (!phDefined.has(m[1])) fail('data.js', 'record uses undefined placeholder → .ph-' + m[1]);
});
[...dataJs.matchAll(/gallery:\s*\[([^\]]+)\]/g)].forEach(m => {
  [...m[1].matchAll(/'([a-z-]+)'/g)].forEach(g => {
    if (!phDefined.has(g[1])) fail('data.js', 'gallery uses undefined placeholder → .ph-' + g[1]);
  });
});

/* --- custom classes the markup depends on ------------------------------- */
['ph', 'arch', 'arch-soft', 'wave-rule', 'wave-rule-flame', 'wave-rule-light', 'scrim',
  'scrim-soft', 'skeleton', 'dropcap', 'pull-quote', 'tnum', 'no-scrollbar', 'rail',
  'img-slot', 'counter-input', 'bar-indeterminate', 'no-print', 'skip-link', 'focus-ring-mist',
].forEach(c => {
  if (!customClasses.has(c)) fail('app.css', 'expected class not defined → .' + c);
});

/* --- static chrome must match partials/ --------------------------------- */
try {
  require('./sync-partials.js').check().forEach(d => problems.push(d));
} catch (e) {
  fail('tools/sync-partials.js', 'drift check could not run — ' + e.message);
}

/* --- reachability: every page linked from somewhere ----------------------
   Link sources are the pages themselves (scanned above), the canonical chrome
   partials, and the card renderers in data.js — departure.html, for instance,
   is only ever linked from SEA.cards.departure(). */
['assets.html', 'header.html', 'footer.html', 'help.html'].forEach(p => {
  const file = path.join(ROOT, 'partials', p);
  if (!fs.existsSync(file)) { fail('partials/' + p, 'missing canonical partial'); return; }
  const src = fs.readFileSync(file, 'utf8');
  [...src.matchAll(/href="([\w.-]+\.html)/g)].forEach(m => linkedPages.add(m[1]));
});
[dataJs, layoutJs].forEach(js => {
  [...js.matchAll(/href\('([\w.-]+\.html)'/g)].forEach(m => {
    if (!fs.existsSync(path.join(ROOT, m[1]))) fail('assets/js', 'link to missing page → ' + m[1]);
    linkedPages.add(m[1]);
  });
});
const orphans = pages.filter(p => !linkedPages.has(p));
if (orphans.length) notes.push('not linked from anywhere: ' + orphans.join(', '));

console.log(pages.length + ' pages checked · ' + surface.size + ' SEA members · ' +
  phDefined.size + ' placeholder variants\n');
notes.forEach(n => console.log('· ' + n));
if (notes.length) console.log('');
if (!problems.length) console.log('✓ no problems found');
else {
  problems.forEach(p => console.log('✗ ' + p));
  console.log('\n' + problems.length + ' problem(s)');
}
process.exit(problems.length ? 1 : 0);
