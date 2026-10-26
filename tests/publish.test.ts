import { describe, expect, it } from 'vitest';
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
  it('lists every version and marks only the newest as latest', () => {
    const versions = catalog().packages.map((p) => [p.version, p.latest]);
    expect(versions).toEqual([
      ['0.1.0', false],
      ['0.2.0', true],
    ]);
  });

  it('shows the latest version on the pages', () => {
    expect(packages.map((p) => p.version)).toEqual(['0.2.0']);
  });
});
