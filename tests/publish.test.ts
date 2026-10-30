import { readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { compareVersions } from '../src/lib/format';
import { catalog, vocabulary } from '../src/lib/publish';
import { packages } from '../src/lib/library';

describe('vocabulary', () => {
  it('names every type and predicate the packages use', () => {
    const v = vocabulary();
    for (const pkg of packages) {
      for (const e of pkg.elements) expect(v.types, e.id).toHaveProperty(e.type);
      for (const r of pkg.relations) expect(v.predicates, r.id).toHaveProperty(r.predicate);
    }
  });

  it('gives each type a page address with the element key in it', () => {
    expect(vocabulary().types.capability).toEqual({
      label: 'Capability',
      plural: 'Capabilities',
      definition: expect.any(String),
      page: 'capabilities/{key}/',
    });
  });

  it('is linked from the catalog', () => {
    expect(catalog().vocabulary).toBe('vocabulary.json');
  });
});

describe('catalog', () => {
  it('lists every version, and marks the packages in the current release as latest', () => {
    const { packages: listed, release } = catalog();
    expect(release).toMatch(/^\d+\.\d+\.\d+$/);
    for (const id of new Set(listed.map((p) => p.packageId))) {
      const versions = listed.filter((p) => p.packageId === id).map((p) => p.version);
      expect(versions, id).toEqual([...versions].sort(compareVersions));
      const latest = listed.filter((p) => p.packageId === id && p.latest).map((p) => p.version);
      expect(latest, id).toEqual(versions.at(-1) === release ? [release] : []);
    }
  });

  it('publishes every schema version, the newest as the current one', () => {
    expect(catalog().schemas).toEqual([
      'schemas/blueprint-package-0.1.0.schema.json',
      'schemas/blueprint-package-0.2.0.schema.json',
      'schemas/blueprint-package-0.3.0.schema.json',
      'schemas/blueprint-package-0.4.0.schema.json',
    ]);
    expect(catalog().schema).toBe('schemas/blueprint-package-0.4.0.schema.json');
  });

  it('shows the current release on the pages, one package for each source folder', () => {
    expect(packages.map((p) => p.packageId.split('.').at(-1))).toEqual(readdirSync('source'));
    expect(new Set(packages.map((p) => p.version))).toEqual(new Set([catalog().release]));
  });
});
