import { describe, expect, it } from 'vitest';
import { byRole, coversPartly, elements, elementsOfType, indexGroups, indexParents, missionBlueprint, relationGroups, patternDetails, solutionFor, tagline } from '../src/lib/library';

describe('missionBlueprint', () => {
  const mission = elements.find((e) => e.id === 'eb:mission:independent-government-oversight')!;
  const blueprint = missionBlueprint(mission);
  const ids = (list: { id: string }[]) => list.map((e) => e.id);

  it('gathers the outcomes the mission seeks, with their measures', () => {
    expect(blueprint.outcomes).toHaveLength(5);
    expect(blueprint.measures).toHaveLength(9);
    const safely = blueprint.outcomes.find((o) => o.outcome.id === 'eb:outcome:concerns-raised-safely')!;
    expect(ids(safely.measures)).toEqual(['eb:measure:time-to-route', 'eb:measure:retaliation-found']);
  });

  it('lists the mission’s own capabilities first, then the shared ones, with what each serves', () => {
    const order = blueprint.capabilities.map((c) => [c.capability.id.split(':')[2], c.sharedFrom?.packageId ?? null]);
    expect(order).toEqual([
      ['complaint-allegation-disclosure-intake', null],
      ['audit-inspection-evaluation', null],
      ['investigation-management', null],
      ['recommendations-corrective-action-monitoring', null],
      ['oversight-reporting-communication', null],
      ['identity-access-management', 'org.enterprise-blueprints.common'],
      ['data-protection-privacy', 'org.enterprise-blueprints.common'],
      ['records-management', 'org.enterprise-blueprints.common'],
      ['security-logging-monitoring', 'org.enterprise-blueprints.common'],
      ['case-management', 'org.enterprise-blueprints.common'],
    ]);
    for (const c of blueprint.capabilities) expect(c.outcomes.length, c.capability.id).toBeGreaterThan(0);
  });

  it('counts each requirement and pattern once, however many capabilities share it', () => {
    const all = blueprint.capabilities.flatMap((c) => c.requirements);
    expect(blueprint.requirements.length).toBeLessThan(all.length);
    expect(new Set(ids(blueprint.requirements)).size).toBe(blueprint.requirements.length);
    expect(ids(blueprint.patterns)).toEqual(expect.arrayContaining(['eb:implementationPattern:oversight-intake-case-tracking', 'eb:implementationPattern:shared-case-platform']));
    // The FOIA mission's own patterns stay on its side.
    expect(ids(blueprint.patterns)).not.toContain('eb:implementationPattern:foia-request-processing');
  });
});

describe('the FOIA mission', () => {
  const mission = elements.find((e) => e.id === 'eb:mission:public-access-to-agency-records')!;
  const blueprint = missionBlueprint(mission);
  const shared = blueprint.capabilities.filter((c) => c.sharedFrom).map((c) => c.capability.id.split(':')[2]);

  it('builds on four of the common capabilities', () => {
    expect(blueprint.outcomes).toHaveLength(6);
    expect(blueprint.capabilities).toHaveLength(11);
    expect(shared).toEqual(['identity-access-management', 'data-protection-privacy', 'records-management', 'case-management']);
  });

  it('shares case management’s requirements with the OIG mission', () => {
    const oig = missionBlueprint(elements.find((e) => e.id === 'eb:mission:independent-government-oversight')!);
    const both = blueprint.requirements.filter((r) => oig.requirements.includes(r)).map((r) => r.id.split(':')[2]);
    expect(both).toEqual(expect.arrayContaining(['multi-channel-intake', 'acknowledge-receipt', 'track-case-status']));
  });

  it('shows only what a shared capability does for this mission', () => {
    const oig = missionBlueprint(elements.find((e) => e.id === 'eb:mission:independent-government-oversight')!);
    const requirementsOf = (b: typeof blueprint, id: string) =>
      b.capabilities.find((c) => c.capability.id === id)!.requirements.map((r) => r.id.split(':')[2]);
    expect(requirementsOf(blueprint, 'eb:capability:identity-access-management')).toEqual(['access-by-role', 'strong-sign-in', 'review-access', 'protect-unredacted-records']);
    expect(requirementsOf(oig, 'eb:capability:identity-access-management')).toEqual(['access-by-role', 'strong-sign-in', 'review-access', 'restrict-case-access']);
    expect(oig.capabilities.find((c) => c.capability.id === 'eb:capability:case-management')!.outcomes.map((o) => o.package)).toEqual([oig.outcomes[0].outcome.package, oig.outcomes[0].outcome.package]);
  });
});

describe('solutions', () => {
  const get = (id: string) => elements.find((e) => e.id === id)!;
  const slug = (e: { id: string }) => e.id.split(':')[2];
  const missions = elementsOfType('mission');

  it('give every mission one, its north star', () => {
    expect(missions.map((m) => slug(solutionFor(m)!.solution)).sort()).toEqual(['acquisition-north-star', 'foia-north-star', 'grants-north-star', 'oig-north-star']);
    expect(elementsOfType('solution')).toHaveLength(missions.length);
    for (const m of missions) expect(solutionFor(m)!.solution.package, slug(m)).toBe(m.package);
  });

  it('cover every capability of their mission, and include everything their patterns need', () => {
    for (const m of missions) {
      const s = solutionFor(m)!;
      expect(s.coverage.map((c) => slug(c.mission)), slug(m)).toEqual([slug(m)]);
      expect(s.coverage[0].uncovered.map(slug), slug(m)).toEqual([]);
      expect(s.coverage[0].covered.length + s.coverage[0].partly.length, slug(m)).toBe(missionBlueprint(m).capabilities.length);
      expect(s.missing, slug(m)).toEqual([]);
    }
  });

  it('lay out their patterns by layer, follow their principles, and say why each pattern is there', () => {
    for (const m of missions) {
      const s = solutionFor(m)!;
      expect(s.roles.map((g) => g.role), slug(m)).toEqual(expect.arrayContaining(['public-facing', 'business-applications', 'worker-productivity', 'infrastructure']));
      expect(s.principles.length, slug(m)).toBeGreaterThanOrEqual(5);
      for (const g of s.roles) for (const i of g.items) expect(i.note, slug(i.pattern)).toBeTruthy();
      expect(s.patterns.map(slug), slug(m)).toContain('agency-sign-on');
      expect(s.patterns.filter((p) => p.status === 'deprecated'), slug(m)).toEqual([]);
    }
  });

  it('choose a way for the patterns they need one for', () => {
    const items = (id: string) => solutionFor(get(id))!.roles.flatMap((g) => g.items);
    const way = (id: string, pattern: string) => items(id).find((i) => slug(i.pattern) === pattern)?.way?.id;
    expect(way('eb:mission:independent-government-oversight', 'oversight-intake-case-tracking')).toBe('product');
    expect(way('eb:mission:public-access-to-agency-records', 'foia-request-processing')).toBe('product');
    expect(way('eb:mission:awarding-overseeing-federal-grants', 'grants-management')).toBe('product');
    expect(way('eb:mission:acquiring-goods-and-services', 'acquisition-management')).toBe('product');
    // The OIG leaves the evidence store's way open, since it depends on how much digital evidence it handles.
    expect(way('eb:mission:independent-government-oversight', 'digital-evidence-store')).toBeUndefined();
  });

  it('are listed whole on their index page, and leave replaced patterns off theirs', () => {
    expect(indexGroups('solution').map((g) => g.id)).toEqual(['all']);
    const listed = indexGroups('implementationPattern').flatMap((g) => g.items).map(slug);
    for (const id of ['audit-workpapers-collaboration', 'grants-management-product', 'contract-writing-system', 'foia-tracking-with-review-tool']) expect(listed).not.toContain(id);
  });

  it('group a mission’s patterns by layer', () => {
    const groups = byRole(missionBlueprint(get('eb:mission:public-access-to-agency-records')).patterns, (p) => p);
    expect(groups.map((g) => g.label)).toEqual(['Public facing', 'Business applications', 'Worker productivity', 'Processing service', 'AI and insights', 'Infrastructure']);
  });
});

describe('pattern connections', () => {
  const get = (id: string) => elements.find((e) => e.id === id)!;
  const slug = (e: { id: string }) => e.id.split(':')[2];

  it('read the same both ways for patterns that work well together', () => {
    const audit = relationGroups(get('eb:implementationPattern:audit-management-system'));
    const together = audit.filter((g) => g.heading === 'Works well with');
    expect(together).toHaveLength(1);
    expect(together[0].elements.map(slug)).toEqual(['shared-recommendation-tracker', 'oversight-reporting-from-source-data', 'oversight-data-analytics']);
    expect(together[0].links.get('eb:implementationPattern:oversight-reporting-from-source-data')?.note).toBe('Audit, inspection, and evaluation results.');
  });

  it('say what a pattern needs, and what needs it', () => {
    const groups = relationGroups(get('eb:implementationPattern:agency-sign-on'));
    expect(groups.find((g) => g.heading === 'Needed by')!.elements.map(slug)).toEqual(['shared-case-platform', 'records-aware-collaboration']);
  });

  it('mark a candidate pattern that covers only part of a capability', () => {
    const intake = get('eb:capability:foia-request-intake');
    expect(coversPartly(intake, get('eb:implementationPattern:national-portal-api'))).toBe(true);
    expect(coversPartly(intake, get('eb:implementationPattern:foia-request-processing'))).toBe(false);
  });
});

describe('the grants mission', () => {
  const get = (id: string) => elements.find((e) => e.id === id)!;
  const slug = (e: { id: string }) => e.id.split(':')[2];
  const blueprint = missionBlueprint(get('eb:mission:awarding-overseeing-federal-grants'));

  it('seeks seven outcomes, each with its measures and the capabilities that contribute to it', () => {
    expect(blueprint.outcomes.map((o) => slug(o.outcome))).toEqual([
      'open-fair-competition',
      'awards-to-capable-recipients',
      'funds-used-as-allowed',
      'program-results-achieved',
      'audit-findings-resolved',
      'awards-closed-on-time',
      'spending-public',
    ]);
    for (const o of blueprint.outcomes) {
      expect(o.measures.length, slug(o.outcome)).toBeGreaterThan(0);
      expect(o.capabilities.length, slug(o.outcome)).toBeGreaterThan(0);
    }
  });

  it('uses its own capabilities first, then the shared ones it connects to', () => {
    const caps = blueprint.capabilities.map((c) => [slug(c.capability), Boolean(c.sharedFrom)]);
    expect(caps.slice(0, 8).every(([, shared]) => !shared)).toBe(true);
    expect(caps.slice(8).map(([s]) => s)).toEqual(expect.arrayContaining(['case-management', 'records-management', 'identity-access-management', 'data-protection-privacy', 'security-logging-monitoring']));
  });
});

describe('the acquisition mission', () => {
  const get = (id: string) => elements.find((e) => e.id === id)!;
  const slug = (e: { id: string }) => e.id.split(':')[2];
  const blueprint = missionBlueprint(get('eb:mission:acquiring-goods-and-services'));

  it('seeks nine outcomes, each with its measures and the capabilities that contribute to it', () => {
    expect(blueprint.outcomes).toHaveLength(9);
    for (const o of blueprint.outcomes) {
      expect(o.measures.length, slug(o.outcome)).toBeGreaterThan(0);
      expect(o.capabilities.length, slug(o.outcome)).toBeGreaterThan(0);
    }
  });

  it('uses its own ten capabilities first, then the shared ones it connects to', () => {
    const caps = blueprint.capabilities.map((c) => [slug(c.capability), Boolean(c.sharedFrom)]);
    expect(caps.slice(0, 10).every(([, shared]) => !shared)).toBe(true);
    expect(caps.slice(10).map(([s]) => s)).toEqual(expect.arrayContaining(['case-management', 'records-management', 'data-protection-privacy']));
  });

  it('offers the common SAM.gov checks among its patterns', () => {
    expect(blueprint.patterns.map(slug)).toContain('sam-gov-entity-checks');
  });
});

describe('the index pages', () => {
  it('give each mission a plain name with its tagline', () => {
    for (const m of elementsOfType('mission')) {
      expect(m.title, m.id).toBe(m.package.title.split(' — ')[0]);
      expect(tagline(m), m.id).toMatch(/^[A-Z][a-z]/);
    }
  });

  it('group by mission, with the shared package last, and leave missions whole', () => {
    const caps = indexGroups('capability');
    expect(caps.map((g) => g.label)).toEqual(['Acquisition', 'FOIA Program', 'Grants Management', 'Office of Inspector General', 'Shared across missions']);
    expect(caps.slice(0, -1).every((g) => g.mission)).toBe(true);
    expect(caps.flatMap((g) => g.items)).toHaveLength(elementsOfType('capability').length);
    expect(indexGroups('mission')).toHaveLength(1);
  });

  it('group patterns by role, and name each measure’s outcome and each requirement’s capability', () => {
    expect(indexGroups('implementationPattern').map((g) => g.id)).toEqual(['public-facing', 'business-applications', 'worker-productivity', 'processing', 'ai-insights', 'infrastructure']);
    for (const type of ['measure', 'requirement']) {
      const parents = indexParents(type)!;
      for (const e of elementsOfType(type)) expect(parents.get(e.id)?.package, e.id).toBe(e.package);
    }
  });
});

describe('ways to source a pattern', () => {
  const get = (id: string) => elements.find((e) => e.id === id)!;
  const slug = (e: { id: string }) => e.id.split(':')[2];

  it('describe one way as its approach, and several as how many', () => {
    expect(patternDetails(get('eb:implementationPattern:agency-sign-on')).sourcing).toBe('Extend a platform the agency has');
    expect(patternDetails(get('eb:implementationPattern:grants-management')).sourcing).toBe('3 ways to source it');
  });

  it('lists a logical pattern’s ways, with what each one needs', () => {
    const ways = patternDetails(get('eb:implementationPattern:oversight-intake-case-tracking')).ways;
    expect(ways.map((w) => [w.id, w.needs.map((n) => slug(n.pattern))])).toEqual([
      ['product', []],
      ['agency-platform', ['shared-case-platform']],
    ]);
  });
});

