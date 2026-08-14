/* Sea Familia — zero-dependency static server for local review.
   The funnels use history.replaceState, so file:// works but a real origin is better.

   Usage:  node tools/serve.js          → http://localhost:8080
           node tools/serve.js 3000     → a different port

   Unknown paths return 404.html with a 404, and that is deliberate: it is the same
   behaviour the production server should have (see docs/HANDOFF.md §2).
*/
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PORT = Number(process.argv[2]) || 8080;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.woff2': 'font/woff2',
  '.md': 'text/plain; charset=utf-8',
  '.ico': 'image/x-icon',
};

http.createServer((req, res) => {
  let rel = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
  if (rel === '/' || rel === '') rel = '/index.html';

  // never serve outside the project directory
  const target = path.join(ROOT, path.normalize(rel).replace(/^([/\\])+/, ''));
  if (!target.startsWith(ROOT)) {
    res.writeHead(403).end('Forbidden');
    return;
  }

  fs.stat(target, (err, stat) => {
    if (err || stat.isDirectory()) {
      const fallback = path.join(ROOT, '404.html');
      fs.readFile(fallback, (e, body) => {
        if (e) { res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found'); return; }
        res.writeHead(404, { 'Content-Type': TYPES['.html'] }).end(body);
      });
      console.log('404  ' + rel);
      return;
    }
    fs.readFile(target, (e, body) => {
      if (e) { res.writeHead(500).end('Read error'); return; }
      res.writeHead(200, {
        'Content-Type': TYPES[path.extname(target).toLowerCase()] || 'application/octet-stream',
        'Cache-Control': 'no-cache',
      }).end(body);
      console.log('200  ' + rel);
    });
  });
}).listen(PORT, '127.0.0.1', () => {
  console.log('Sea Familia → http://localhost:' + PORT + '/index.html');
  console.log('Component inventory → http://localhost:' + PORT + '/components.html');
});
