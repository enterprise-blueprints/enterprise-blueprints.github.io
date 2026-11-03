import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, normalize } from 'node:path';
import { describe, expect, it } from 'vitest';

// The pages publishers' sites share with the library, which the kit copies with pnpm sync --tools.
const engine = JSON.parse(readFileSync('engine.json', 'utf8')) as { files: string[] };
const listed = new Set(engine.files.map((f) => normalize(f)));

describe('the engine', () => {
  it('lists files that exist', () => {
    for (const f of engine.files) expect(existsSync(f), f).toBe(true);
  });

  // A publisher's site has these files, its own src/site.ts, and the schemas pnpm sync brings, and nothing else of the library's.
  it('imports only its own files, the site config, and the schemas', () => {
    const allowed = (p: string) => listed.has(p) || p === normalize('src/site.ts') || p.startsWith(normalize('schemas/'));
    for (const f of engine.files.filter((f) => /\.(ts|astro)$/.test(f))) {
      for (const [, spec] of readFileSync(f, 'utf8').matchAll(/from '(\.{1,2}\/[^']+)'/g)) {
        const target = normalize(join(dirname(f), spec.replace(/\?raw$/, '')));
        const resolved = [target, `${target}.ts`].find(allowed);
        expect(resolved, `${f} imports ${spec}`).toBeDefined();
      }
    }
  });
});
