#!/usr/bin/env node
// Proves /sitemap.xml is XML (not SPA index.html) and robots allows indexing.
// Requires a prior `npm run build` (server/dist/index.js + server/dist/public/*).
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fail = (m) => { console.error(`FAIL: ${m}`); process.exitCode = 1; };

for (const [f, needle] of [['public/sitemap.xml', '<urlset'], ['public/robots.txt', 'Sitemap: https://textguard.chrishacia.com/sitemap.xml']]) {
  if (!fs.existsSync(path.join(root, f))) fail(`${f} missing`);
  else if (!fs.readFileSync(path.join(root, f), 'utf8').includes(needle)) fail(`${f} missing ${needle}`);
}
if (process.exitCode) process.exit(1);

const port = 4123;
const child = spawn('node', [path.join(root, 'server/dist/index.js')], {
  env: { ...process.env, SERVER_PORT: String(port), SERVER_PROTOCOL: 'http', SERVER_DOMAIN: 'localhost' },
  stdio: 'ignore',
});
try {
  let up = false;
  for (let i = 0; i < 50 && !up; i++) {
    try { up = (await fetch(`http://127.0.0.1:${port}/api/alive`)).ok; } catch { await new Promise(r => setTimeout(r, 200)); }
  }
  if (!up) throw new Error('server did not start (run npm run build first)');
  const sm = await fetch(`http://127.0.0.1:${port}/sitemap.xml`);
  const smBody = await sm.text();
  console.log(`GET /sitemap.xml -> ${sm.status} ${sm.headers.get('content-type')}`);
  if (sm.status !== 200) fail('sitemap status != 200');
  if (!/xml/.test(sm.headers.get('content-type') || '')) fail('sitemap content-type is not XML');
  if (!smBody.includes('<urlset') || smBody.includes('id="root"')) fail('sitemap body is not XML (SPA fallback?)');
  const rb = await fetch(`http://127.0.0.1:${port}/robots.txt`);
  const rbBody = await rb.text();
  console.log(`GET /robots.txt -> ${rb.status} ${rb.headers.get('content-type')}\n${rbBody}`);
  if (!/text\/plain/.test(rb.headers.get('content-type') || '')) fail('robots content-type is not text/plain');
  if (!rbBody.includes('Allow: /') || !rbBody.includes('Sitemap: https://textguard.chrishacia.com/sitemap.xml')) fail('robots missing Allow/Sitemap');
  const home = await fetch(`http://127.0.0.1:${port}/`);
  console.log(`GET / -> ${home.status} ${home.headers.get('content-type')}`);
  if (home.status !== 200) fail('home status != 200');
} catch (e) { fail(e.message); } finally { child.kill(); }
console.log(process.exitCode ? 'check-indexable: FAILED' : 'check-indexable: OK');
