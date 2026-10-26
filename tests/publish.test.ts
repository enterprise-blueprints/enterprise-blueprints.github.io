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
