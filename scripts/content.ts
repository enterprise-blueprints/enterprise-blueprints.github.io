// Builds content/ from source/.
//
//   pnpm content:build   write each package whose source changed, at its next version
//   pnpm content:check   fail if content/ is behind source/, writing nothing
//
// A version is published once it's on origin/main, and never changes after
// that. A version built since then is rebuilt in place until it's pushed.

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { plan, readSources, SourceError } from '../src/lib/compile.ts';
import type { BlueprintPackage } from '../src/lib/package.ts';

const mode = process.argv[2];
if (mode !== 'build' && mode !== 'check') {
  console.error('Usage: content.ts build | check');
  process.exit(2);
}

const versionsOf = (name: string): Record<string, BlueprintPackage> => {
  const dir = join('content', name);
  if (!existsSync(dir)) return {};
  return Object.fromEntries(
    readdirSync(dir)
      .filter((v) => existsSync(join(dir, v, 'blueprint.json')))
      .map((v) => [v, JSON.parse(readFileSync(join(dir, v, 'blueprint.json'), 'utf8'))]),
  );
};

// Checking reads every version in content/ as published; building asks Git which are.
let isPublished = (_name: string, _version: string) => true;
if (mode === 'build') {
  let listed: string;
  try {
    listed = execFileSync('git', ['ls-tree', '-r', '--name-only', 'origin/main', '--', 'content'], { encoding: 'utf8' });
  } catch {
    console.error('content:build needs origin/main to tell which versions are published. Run git fetch first.');
    process.exit(1);
  }
  const live = new Set(listed.split('\n').filter((p) => p.endsWith('/blueprint.json')));
  isPublished = (name, version) => live.has(`content/${name}/${version}/blueprint.json`);
}

const today = new Date().toLocaleDateString('en-CA');
let steps;
try {
  steps = plan(readSources('source'), versionsOf, isPublished, today);
} catch (e) {
  if (e instanceof SourceError) {
    console.error(e.message);
    process.exit(1);
  }
  throw e;
}

const behind = steps.filter((s) => s.write || s.remove.length);
for (const s of steps) {
  const what = s.write ? (versionsOf(s.name)[s.version] ? 'rebuilt' : 'new') : 'stays on';
  console.log(`${s.name.padEnd(14)} ${what.padEnd(8)} ${s.version.padEnd(7)} ${s.reason}`);
}
const orphans = readdirSync('content').filter((name) => !steps.some((s) => s.name === name));
for (const name of orphans) console.log(`${name.padEnd(14)} no source; content/${name}/ is left as it is`);

if (mode === 'check') {
  if (behind.length) {
    console.error(`\ncontent/ is behind source/ for ${behind.map((s) => s.name).join(', ')}. Run pnpm content:build.`);
    process.exit(1);
  }
  process.exit(0);
}

for (const s of behind) {
  for (const v of s.remove) {
    rmSync(join('content', s.name, v), { recursive: true });
    console.log(`removed content/${s.name}/${v}/, which was never published`);
  }
  if (s.write) {
    const dir = join('content', s.name, s.version);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'blueprint.json'), JSON.stringify(s.write, null, 2) + '\n');
  }
}
if (behind.length) console.log('\nNow run pnpm verify to validate and build the site.');
