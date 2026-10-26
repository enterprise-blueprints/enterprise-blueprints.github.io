// Checks a built site. Every internal link and asset must start with the base
// path and resolve to a built file, and every package in the catalog must
// match its digest and its source file in content/.
//
// Usage: node scripts/check-dist.mjs [dist] [base path]
//   node scripts/check-dist.mjs dist
//   node scripts/check-dist.mjs dist-subpath /baseurl-check

import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const dist = process.argv[2] ?? 'dist';
const base = (process.argv[3] ?? '').replace(/\/+$/, '');
const errors = [];

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return htmlFiles(path);
    return name.endsWith('.html') ? [path] : [];
  });
}

function resolves(path) {
  const file = join(dist, path);
  if (path.endsWith('/')) return existsSync(join(file, 'index.html'));
  return (existsSync(file) && statSync(file).isFile()) || existsSync(join(file, 'index.html'));
}

let linkCount = 0;
const pages = htmlFiles(dist);
for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  for (const [, url] of html.matchAll(/\s(?:href|src)="([^"]*)"/g)) {
    if (/^[a-z][a-z0-9+.-]*:/i.test(url) || url.startsWith('//') || url.startsWith('#')) continue;
    linkCount++;
    const where = relative(dist, page);
    if (!url.startsWith(`${base}/`)) {
      errors.push(`${where}: link ${url} doesn't start with the base path "${base}/"`);
      continue;
    }
    const path = decodeURI(url.slice(base.length).replace(/[?#].*$/, '').replace(/&amp;/g, '&'));
    if (!resolves(path)) errors.push(`${where}: link ${url} doesn't resolve`);
  }
}

const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const catalog = JSON.parse(readFileSync(join(dist, 'catalog.json'), 'utf8'));
for (const entry of catalog.packages) {
  const file = join(dist, entry.href);
  if (!existsSync(file)) {
    errors.push(`catalog: ${entry.href} doesn't exist`);
    continue;
  }
  const bytes = readFileSync(file);
  if (sha256(bytes) !== entry.sha256) errors.push(`catalog: digest for ${entry.href} doesn't match the file`);
  const name = entry.href.split('/')[1];
  if (!bytes.equals(readFileSync(join('content', name, 'blueprint.json')))) {
    errors.push(`${entry.href} differs from content/${name}/blueprint.json`);
  }
  const digestFile = readFileSync(`${file}.sha256`, 'utf8');
  if (digestFile !== `${entry.sha256}  blueprint.json\n`) errors.push(`${entry.href}.sha256 doesn't match the catalog`);
}
if (!existsSync(join(dist, catalog.schema))) {
  errors.push(`catalog: schema ${catalog.schema} doesn't exist`);
} else if (!readFileSync(join(dist, catalog.schema)).equals(readFileSync('schemas/blueprint-package.schema.json'))) {
  errors.push(`${catalog.schema} differs from schemas/blueprint-package.schema.json`);
}

if (errors.length) {
  console.error(`check-dist found ${errors.length} problem(s) in ${dist}:\n  ${errors.join('\n  ')}`);
  process.exit(1);
}
console.log(
  `check-dist: ${pages.length} pages, ${linkCount} internal links, ${catalog.packages.length} package(s) OK in ${dist}`,
);
