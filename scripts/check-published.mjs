// Checks that a build keeps every package version the live site already
// publishes, byte for byte. A published version never changes; changes go
// into a new version. Run it before deploying.
//
// Usage: node scripts/check-published.mjs [dist] [live site URL]
//   node scripts/check-published.mjs dist https://enterprise-blueprints.github.io/

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const dist = process.argv[2] ?? 'dist';
const site = (process.argv[3] ?? process.env.SITE_URL ?? 'https://enterprise-blueprints.github.io').replace(/\/?$/, '/');

let live;
try {
  const response = await fetch(new URL('catalog.json', site), { signal: AbortSignal.timeout(20_000) });
  // A site that hasn't published a catalog yet has nothing to keep.
  if (response.status === 404) {
    console.log(`check-published: ${site} has no catalog yet, so there's nothing to compare`);
    process.exit(0);
  }
  if (!response.ok) throw new Error(`the site answered ${response.status}`);
  live = await response.json();
} catch (error) {
  console.error(`check-published: couldn't read the live catalog at ${site}: ${error.message}`);
  process.exit(1);
}

const built = JSON.parse(readFileSync(join(dist, 'catalog.json'), 'utf8'));
const key = (p) => `${p.packageId}@${p.version}`;
const builtByKey = new Map(built.packages.map((p) => [key(p), p]));
const errors = [];
for (const p of live.packages ?? []) {
  const now = builtByKey.get(key(p));
  if (!now) errors.push(`${key(p)} is published but missing from this build`);
  else if (now.sha256 !== p.sha256) errors.push(`${key(p)} changed since it was published; put the changes in a new version`);
}

if (errors.length) {
  console.error(`check-published found ${errors.length} problem(s):\n  ${errors.join('\n  ')}`);
  process.exit(1);
}
console.log(`check-published: all ${live.packages?.length ?? 0} published version(s) unchanged`);
