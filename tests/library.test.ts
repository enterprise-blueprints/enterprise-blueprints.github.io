import { describe, expect, it } from 'vitest';
import { byLayer, coversPartly, elements, elementsOfType, groupOf, indexGroups, indexParents, missionBlueprint, relationGroups, patternDetails, principlesOf, questionsAbout, discoveryTarget, tagline } from '../src/lib/library';
import { groupings } from '../src/lib/vocabulary';

describe('missionBlueprint', () => {
  const mission = elements.find((e) => e.id === 'eb:mission:independent-government-oversight')!;
  const blueprint = missionBlueprint(mission);
  const ids = (list: { id: string }[]) => list.map((e) => e.id);

  it('gathers the outcomes the mission seeks, with their measures', () => {
    expect(blueprint.outcomes).toHaveLength(6);
    expect(blueprint.measures).toHaveLength(10);
    const safely = blueprint.outcomes.find((o) => o.outcome.id === 'eb:outcome:concerns-raised-safely')!;
    expect(ids(safely.measures)).toEqual(['time-to-route', 'retaliation-found']);
    expect(safely.measures[0].url).toBe(`${safely.outcome.url}#measure-time-to-route`);
  });

  it('lists the mission’s own capabilities first, then the shared ones, with what each serves', () => {
    const order = blueprint.capabilities.map((c) => [c.capability.id.split(':')[2], c.sharedFrom?.packageId ?? null]);
    expect(order).toEqual([
      ['oversight-planning', null],
      ['complaint-allegation-disclosure-intake', null],
      ['audit-inspection-evaluation', null],
      ['investigation-management', null],
      ['whistleblower-protection', null],
      ['recommendations-corrective-action-monitoring', null],
      ['quality-assurance', null],
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
    expect(blueprint.capabilities).toHaveLength(12);
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

describe('a mission’s architecture', () => {
  const get = (id: string) => elements.find((e) => e.id === id)!;
  const slug = (e: { id: string }) => e.id.split(':')[2];
  const missions = elementsOfType('mission');

  it('is its own patterns, by layer, with no solutions in the library', () => {
    expect(elementsOfType('solution')).toEqual([]);
    for (const m of missions) {
      const layers = byLayer(missionBlueprint(m).patterns, (p) => p).map((g) => g.layer);
      expect(layers, slug(m)).toEqual(expect.arrayContaining(['business-applications', 'worker-productivity', 'data-records', 'security-identity']));
    }
  });

  it('follows the principles the mission lists', () => {
    for (const m of missions) expect(principlesOf(m).length, slug(m)).toBeGreaterThanOrEqual(5);
  });

  it('has a pattern for every capability of the mission', () => {
    for (const m of missions) for (const c of missionBlueprint(m).capabilities) expect(c.patterns.length, `${slug(m)}: ${slug(c.capability)}`).toBeGreaterThan(0);
  });

  it('leaves replaced patterns off the patterns index', () => {
    const listed = indexGroups('implementationPattern').flatMap((g) => g.items).map(slug);
    for (const id of ['audit-workpapers-collaboration', 'grants-management-product', 'contract-writing-system', 'foia-tracking-with-review-tool']) expect(listed).not.toContain(id);
  });

  it('groups a mission’s patterns by layer', () => {
    const groups = byLayer(missionBlueprint(get('eb:mission:public-access-to-agency-records')).patterns, (p) => p);
    expect(groups.map((g) => g.label)).toEqual(['Public facing', 'AI and insights', 'Business applications', 'Worker productivity', 'Connections', 'Data and records', 'Security and identity']);
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

  it('seeks eight outcomes, each with its measures and the capabilities that contribute to it', () => {
    expect(blueprint.outcomes.map((o) => slug(o.outcome))).toEqual([
      'open-fair-competition',
      'awards-to-capable-recipients',
      'funds-used-as-allowed',
      'applying-is-straightforward',
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

  it('group outcomes, capabilities, and requirements across missions, each item in its one group, and leave missions whole', () => {
    for (const [type, grouping] of Object.entries(groupings)) {
      const groups = indexGroups(type);
      // Every item in the library names a group, so nothing is left over.
      expect(groups.map((g) => g.id), type).toEqual(Object.keys(grouping.groups).filter((id) => groups.some((g) => g.id === id)));
      expect(groups.flatMap((g) => g.items).map((e) => e.id).sort(), type).toEqual(elementsOfType(type).map((e) => e.id).sort());
      for (const g of groups) for (const e of g.items) expect(groupOf(e)?.url, e.id).toMatch(new RegExp(`/${e.typeInfo.section}/#${g.id}$`));
    }
    // A group lists each mission's items together, missions in title order and the shared package last.
    const caps = indexGroups('capability');
    expect(caps.map((g) => g.label)).toEqual(['Plan and prepare', 'Reach and take in', 'Assess and decide', 'Deliver and operate', 'Monitor and correct', 'Report and close', 'Across the work']);
    expect(caps.find((g) => g.id === 'reach-take-in')!.items.map((e) => e.slug)).toEqual(['solicitation-publicizing', 'foia-request-intake', 'funding-opportunities-applications', 'complaint-allegation-disclosure-intake']);
    expect(caps.at(-1)!.items.every((e) => e.package.packageId.endsWith('.common'))).toBe(true);
    expect(indexGroups('mission')).toHaveLength(1);
  });

  it('group patterns by layer, and name each measure’s outcome and each requirement’s capability', () => {
    expect(indexGroups('implementationPattern').map((g) => g.id)).toEqual(['public-facing', 'ai-insights', 'business-applications', 'worker-productivity', 'connections', 'data-records', 'security-identity']);
    for (const type of ['measure', 'requirement']) {
      const parents = indexParents(type)!;
      for (const e of elementsOfType(type)) expect(parents.get(e.id)?.package, e.id).toBe(e.package);
    }
  });
});

describe('discovery answers that point at a measure', () => {
  it('link it to its place on its outcome’s page, and show on the outcome’s page', () => {
    const target = discoveryTarget('eb:measure:time-to-route')!;
    expect(target).toMatchObject({ type: 'measure', title: 'Time to review and route a matter' });
    expect(target.url).toMatch(/outcomes\/concerns-raised-safely\/#measure-time-to-route$/);
    const outcome = elements.find((e) => e.id === 'eb:outcome:concerns-raised-safely')!;
    expect(questionsAbout(outcome).map((q) => q.question.id)).toContain('question:tracked-measures');
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

