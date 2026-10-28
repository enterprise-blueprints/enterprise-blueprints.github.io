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
  it('lists every version and marks only the newest of each package as latest', () => {
    const versions = catalog().packages.map((p) => [p.packageId.split('.').at(-1), p.version, p.latest]);
    expect(versions).toEqual([
      ['common', '0.1.0', false],
      ['common', '0.2.0', false],
      ['common', '0.3.0', true],
      ['federal-foia', '0.1.0', false],
      ['federal-foia', '0.2.0', true],
      ['federal-oig', '0.1.0', false],
      ['federal-oig', '0.2.0', false],
      ['federal-oig', '0.3.0', false],
      ['federal-oig', '0.4.0', true],
    ]);
  });

  it('publishes every schema version, the newest as the current one', () => {
    expect(catalog().schemas).toEqual(['schemas/blueprint-package-0.1.0.schema.json', 'schemas/blueprint-package-0.2.0.schema.json']);
    expect(catalog().schema).toBe('schemas/blueprint-package-0.2.0.schema.json');
  });

  it('shows the latest version of each package on the pages', () => {
    expect(packages.map((p) => `${p.packageId.split('.').at(-1)} ${p.version}`)).toEqual(['common 0.3.0', 'federal-foia 0.2.0', 'federal-oig 0.4.0']);
  });
});
