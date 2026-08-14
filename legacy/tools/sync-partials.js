/* ============================================================================
   Sea Familia — partial writer
   ----------------------------------------------------------------------------
   The global chrome is STATIC HTML in every page. This script is what keeps the
   23 copies identical: partials/ holds the canonical markup, and this writes it
   verbatim into each page between marker comments.

     node tools/sync-partials.js              write every page
     node tools/sync-partials.js index.html   write one page
     node tools/sync-partials.js --check      report drift only, exit 1

   Also exported for tools/check-pages.js:
     const { check } = require('./sync-partials.js')

   Three blocks per page:
     sea:assets   partials/assets.html   in <head>, below title/description
     sea:header   partials/header.html   top of <body>
     sea:footer   partials/footer.html   + partials/help.html

   What varies per page:
     · aria-current="page" on the nav anchor whose data-nav matches the page
     · partials/help.html is skipped when the page has <body data-sticky-bar>

   The nav group comes from <body data-page="…"> when present, otherwise from
   ROUTE_NAV below. Detail pages light up their parent section.
   ========================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PARTIALS = path.join(ROOT, 'partials');

/* Which nav item lights up. Only pages absent from this map AND without a
   data-page attribute end up with no active item — 404 and error, by design. */
const ROUTE_NAV = {
  'index.html': 'home',
  'experiences.html': 'experiences',
  'experience.html': 'experiences',
  'discover.html': 'experiences',
  'destinations.html': 'destinations',
  'destination.html': 'destinations',
  'trip.html': 'destinations',
  'boats.html': 'boats',
  'boat.html': 'boats',
  'charter.html': 'boats',
  'departures.html': 'departures',
  'departure.html': 'departures',
  'reserve.html': 'departures',
  'our-story.html': 'story',
  'faq.html': 'story',
  'contact.html': 'story',
  'partners.html': 'story',
  'journal.html': 'journal',
  'article.html': 'journal',
};

const MARK = {
  assets: {
    open: '<!-- sea:assets · static — edit partials/assets.html, then: node tools/sync-partials.js -->',
    close: '<!-- /sea:assets -->',
  },
  header: {
    open: '<!-- sea:header · static — edit partials/header.html, then: node tools/sync-partials.js -->',
    close: '<!-- /sea:header -->',
  },
  footer: {
    open: '<!-- sea:footer · static — edit partials/footer.html, then: node tools/sync-partials.js -->',
    close: '<!-- /sea:footer -->',
  },
};

/* First-run anchor for the assets block: the CDN-era <head> lines, byte-identical
   across every page. Matched once, then the markers take over. */
const LEGACY_HEAD = /[ \t]*<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com">[\s\S]*?<script defer src="https:\/\/cdn\.jsdelivr\.net\/npm\/alpinejs@[\d.]+\/dist\/cdn\.min\.js"><\/script>/;

/* --------------------------------------------------------------------------
   Reading the partials
   ------------------------------------------------------------------------ */
function readPartial(name) {
  const file = path.join(PARTIALS, name);
  if (!fs.existsSync(file)) throw new Error('missing partial: partials/' + name);
  // strip the leading banner comment — it documents the partial, not the pages
  return fs.readFileSync(file, 'utf8')
    .replace(/^<!--[\s\S]*?-->\s*/, '')
    .replace(/\s+$/, '');
}

/* --------------------------------------------------------------------------
   Rendering a page's two blocks
   ------------------------------------------------------------------------ */
function navGroup(page, src) {
  const declared = /<body[^>]*\bdata-page="([^"]*)"/.exec(src);
  return declared ? declared[1] : (ROUTE_NAV[page] || '');
}

/** Adds aria-current="page" to anchors whose data-nav matches. */
function markActive(html, group) {
  if (!group) return html;
  return html.replace(
    /<a href="([^"]+)" data-nav="([^"]+)"/g,
    (whole, href, key) => key === group
      ? '<a href="' + href + '" data-nav="' + key + '" aria-current="page"'
      : whole
  );
}

function renderBlocks(page, src, partials) {
  const group = navGroup(page, src);
  const stickyBar = /<body[^>]*\bdata-sticky-bar/.test(src);

  const assets = MARK.assets.open + '\n' +
    partials.assets + '\n' +
    MARK.assets.close;

  const header = MARK.header.open + '\n' +
    markActive(partials.header, group) + '\n' +
    MARK.header.close;

  const footer = MARK.footer.open + '\n' +
    partials.footer +
    (stickyBar ? '' : '\n\n' + partials.help) + '\n' +
    MARK.footer.close;

  return { assets, header, footer };
}

/* --------------------------------------------------------------------------
   Writing into a page
   ------------------------------------------------------------------------ */
function blockRegex(kind) {
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(
    esc(MARK[kind].open.slice(0, 18)) + '[\\s\\S]*?' + esc(MARK[kind].close),
    ''
  );
}

/** Replace an existing block, or install one on a page that has never been synced. */
function place(src, kind, block) {
  const re = blockRegex(kind);
  if (re.test(src)) return src.replace(re, block);

  if (kind === 'assets') {
    // the CDN-era block, or failing that just before </head>
    if (LEGACY_HEAD.test(src)) return src.replace(LEGACY_HEAD, block);
    return src.replace(/([ \t]*<\/head>)/, block + '\n$1');
  }

  if (kind === 'header') {
    // legacy host div, or straight after <body …>
    if (/<div id="sea-header"><\/div>/.test(src)) {
      return src.replace(/<div id="sea-header"><\/div>/, block);
    }
    return src.replace(/(<body[^>]*>\n)/, '$1' + block + '\n');
  }

  if (/<div id="sea-footer"><\/div>/.test(src)) {
    return src.replace(/<div id="sea-footer"><\/div>/, block);
  }
  // last resort: immediately before the layout.js tag
  return src.replace(
    /([ \t]*<script src="assets\/js\/layout\.js"><\/script>)/,
    block + '\n$1'
  );
}

function transform(page, src, partials) {
  const blocks = renderBlocks(page, src, partials);
  let out = place(src, 'assets', blocks.assets);
  out = place(out, 'header', blocks.header);
  out = place(out, 'footer', blocks.footer);
  return out;
}

/* --------------------------------------------------------------------------
   Public API
   ------------------------------------------------------------------------ */
function pages() {
  return fs.readdirSync(ROOT).filter((f) => f.endsWith('.html')).sort();
}

function loadPartials() {
  return {
    assets: readPartial('assets.html'),
    header: readPartial('header.html'),
    footer: readPartial('footer.html'),
    help: readPartial('help.html'),
  };
}

/** Writes every page (or just the ones named). Returns the list changed. */
function sync(only) {
  const partials = loadPartials();
  const list = only && only.length ? only : pages();
  const changed = [];
  list.forEach((page) => {
    const file = path.join(ROOT, page);
    if (!fs.existsSync(file)) throw new Error('no such page: ' + page);
    const src = fs.readFileSync(file, 'utf8');
    const out = transform(page, src, partials);
    if (out !== src) {
      fs.writeFileSync(file, out);
      changed.push(page);
    }
  });
  return changed;
}

/** Reports pages whose blocks differ from the partials. Writes nothing. */
function check() {
  const partials = loadPartials();
  const drift = [];
  pages().forEach((page) => {
    const src = fs.readFileSync(path.join(ROOT, page), 'utf8');
    if (!blockRegex('assets').test(src)) { drift.push(page + ' — no sea:assets block'); return; }
    if (!blockRegex('header').test(src)) { drift.push(page + ' — no sea:header block'); return; }
    if (!blockRegex('footer').test(src)) { drift.push(page + ' — no sea:footer block'); return; }
    if (transform(page, src, partials) !== src) {
      drift.push(page + ' — chrome differs from partials/');
    }
  });
  return drift;
}

module.exports = { sync, check, pages, ROUTE_NAV };

/* --------------------------------------------------------------------------
   CLI
   ------------------------------------------------------------------------ */
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.indexOf('--check') !== -1) {
    const drift = check();
    if (!drift.length) {
      console.log('✓ ' + pages().length + ' pages match partials/');
      process.exit(0);
    }
    drift.forEach((d) => console.log('✗ ' + d));
    console.log('\n' + drift.length + ' page(s) out of sync — run: node tools/sync-partials.js');
    process.exit(1);
  }

  const only = args.filter((a) => a.endsWith('.html'));
  const changed = sync(only);
  if (!changed.length) {
    console.log('· nothing to do, every page already matches partials/');
  } else {
    changed.forEach((p) => console.log('wrote  ' + p));
    console.log('\n' + changed.length + ' page(s) updated');
  }
}
