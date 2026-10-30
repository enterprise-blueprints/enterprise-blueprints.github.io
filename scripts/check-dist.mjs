// Checks a built site. Every internal link and asset must start with the base
// path and resolve to a built file, every package in the catalog must match
// its digest and its source file in content/, and the vocabulary must cover
// every element, with a page for each.
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
  const [, name, version] = entry.href.split('/');
  const source = join('content', name, version, 'blueprint.json');
  if (!existsSync(source) || !bytes.equals(readFileSync(source))) {
    errors.push(`${entry.href} differs from content/${name}/${version}/blueprint.json`);
  }
  const digestFile = readFileSync(`${file}.sha256`, 'utf8');
  if (digestFile !== `${entry.sha256}  blueprint.json\n`) errors.push(`${entry.href}.sha256 doesn't match the catalog`);
}
// The packages in the current release are marked latest, at its version. A retired package has none.
for (const id of new Set(catalog.packages.map((p) => p.packageId))) {
  const latest = catalog.packages.filter((p) => p.packageId === id && p.latest);
  if (latest.length > 1) errors.push(`catalog: ${id} has ${latest.length} versions marked latest`);
  if (latest.some((p) => p.version !== catalog.release)) errors.push(`catalog: ${id} is marked latest at a version other than the release, ${catalog.release}`);
}
if (!catalog.packages.some((p) => p.latest)) errors.push('catalog: no package is in the current release');
if (!(catalog.schemas ?? []).includes(catalog.schema)) errors.push(`catalog: schema ${catalog.schema} isn't in its list of schemas`);
for (const schema of catalog.schemas ?? []) {
  const source = join('schemas', schema.split('/').at(-1));
  if (!existsSync(join(dist, schema))) errors.push(`catalog: schema ${schema} doesn't exist`);
  else if (!existsSync(source) || !readFileSync(join(dist, schema)).equals(readFileSync(source))) errors.push(`${schema} differs from ${source}`);
}

const vocabulary = catalog.vocabulary && existsSync(join(dist, catalog.vocabulary)) ? JSON.parse(readFileSync(join(dist, catalog.vocabulary), 'utf8')) : null;
if (!vocabulary) errors.push(`catalog: vocabulary ${catalog.vocabulary} doesn't exist`);
let elementCount = 0;
// The pages show the current release, so its elements are the ones with pages. Earlier versions stay downloadable.
for (const entry of vocabulary ? catalog.packages.filter((p) => p.latest) : []) {
  const pkg = JSON.parse(readFileSync(join(dist, entry.href), 'utf8'));
  for (const element of pkg.elements) {
    elementCount++;
    const type = vocabulary.types[element.type];
    if (!type) {
      errors.push(`vocabulary: no type ${element.type} for ${element.id}`);
      continue;
    }
    const page = type.page.replace('{key}', element.id.split(':')[2]);
    if (!resolves(page)) errors.push(`vocabulary: page ${page} for ${element.id} doesn't resolve`);
  }
  for (const relation of pkg.relations) {
    if (!vocabulary.predicates[relation.predicate]) errors.push(`vocabulary: no predicate ${relation.predicate} for ${relation.id}`);
  }
}

if (errors.length) {
  console.error(`check-dist found ${errors.length} problem(s) in ${dist}:\n  ${errors.join('\n  ')}`);
  process.exit(1);
}
console.log(
  `check-dist: ${pages.length} pages, ${linkCount} internal links, ${catalog.packages.length} package(s), ${elementCount} element pages OK in ${dist}`,
);
