// The engine's version: the pages and code publishers' sites take from the
// library, as engine.json lists them. Each version is tagged engine-v<version>
// once it's deployed, and a tag always means one set of files, so publishers
// get exactly what the kit was checked with.
//
//   node scripts/engine.mjs check   fail if the files changed since this version's tag
//   node scripts/engine.mjs tag     tag this version here and push the tag, if it isn't yet
//
// Raise "version" in engine.json when the files change: the patch for a fix, the
// minor for something added, and the major when a publisher's own home page
// may need changes, such as a renamed export of src/lib/library.ts.

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const engine = JSON.parse(readFileSync('engine.json', 'utf8'));
const tag = `engine-v${engine.version}`;
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const tags = git('tag', '--list', 'engine-v*').split('\n').filter(Boolean);
const exists = tags.includes(tag);

const parts = (v) => v.split('.').map(Number);
const newer = (a, b) => {
  const [x, y] = [parts(a), parts(b)];
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] > y[i];
  return false;
};

if (process.argv[2] === 'check') {
  const latest = tags.map((t) => t.slice('engine-v'.length)).reduce((a, b) => (newer(b, a) ? b : a), '0.0.0');
  if (!exists && !newer(engine.version, latest)) {
    console.error(`engine.json says ${engine.version}, but ${latest} is already tagged. Use a later version.`);
    process.exit(1);
  }
  if (exists) {
    try {
      git('diff', '--quiet', tag, 'HEAD', '--', 'engine.json', ...engine.files);
    } catch {
      console.error(`The engine's files changed since ${tag}. Raise "version" in engine.json (see scripts/engine.mjs).`);
      process.exit(1);
    }
  }
  console.log(exists ? `Engine ${engine.version} matches ${tag}.` : `Engine ${engine.version} is new; it's tagged when deployed.`);
} else if (process.argv[2] === 'tag') {
  if (exists) {
    console.log(`${tag} is already tagged.`);
  } else {
    git('tag', tag);
    git('push', 'origin', tag);
    console.log(`Tagged and pushed ${tag}.`);
  }
} else {
  console.error('Usage: node scripts/engine.mjs check | tag');
  process.exit(1);
}
