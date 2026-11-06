import { describe, expect, it } from 'vitest';
import { byLayer, componentsOf, coversPartly, hostingOf, searchIndex, elements, elementsOfType, groupOf, indexGroups, indexParents, missionBlueprint, relationGroups, patternDetails, principlesOf, questionsAbout, discoveryTarget, resourceDetails, resourcesFor, tagline } from '../src/lib/library';
import { groupings } from '../src/lib/vocabulary';
import { prepare, search } from '../src/lib/search';

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

  it('is its own patterns, by layer, with the library’s solutions to source them', () => {
    expect(elementsOfType('solution')).toHaveLength(97);
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
    expect(groups.find((g) => g.heading === 'Needed by')!.elements.map(slug)).toEqual(['shared-case-platform', 'records-aware-collaboration', 'core-hr-system']);
    // The solutions that need it are listed apart, right after, each with its own pattern.
    const headings = groups.map((g) => g.heading);
    expect(headings.indexOf('Solutions that need it')).toBe(headings.indexOf('Needed by') + 1);
    const apart = groups.find((g) => g.heading === 'Solutions that need it')!;
    expect(apart.elements.map(slug)).toContain('oversight-intake-case-tracking-product');
    expect(apart.parents!.get('eb:solution:oversight-intake-case-tracking-product')!.title).toBe('Oversight Case Management');
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
    expect(caps.find((g) => g.id === 'reach-take-in')!.items.map((e) => e.slug)).toEqual(['solicitation-publicizing', 'public-guidance', 'application-intake', 'contact-intake-routing', 'self-service-virtual-assistance', 'foia-request-intake', 'funding-opportunities-applications', 'recruitment-hiring', 'complaint-allegation-disclosure-intake']);
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

describe('resources', () => {
  const get = (id: string) => elements.find((e) => e.id === id)!;
  it('list what helps with an item, kind by kind, and a solution’s own', () => {
    const records = resourcesFor(get('eb:capability:records-management'));
    expect(records.map((r) => [r.resource.slug, r.details.kind])).toEqual([['nara-records-management-training', 'Course'], ['universal-erm-requirements', 'Template']]);
    expect(resourcesFor(get('eb:solution:records-in-business-systems-built-in')).map((r) => r.resource.slug)).toEqual(['universal-erm-requirements']);
    expect(resourceDetails(get('eb:resource:what-is-login-gov'))).toEqual({ kind: 'Video', url: 'https://www.youtube.com/watch?v=ayDtFd5Ugyk', by: 'Login.gov, General Services Administration', lastReviewedAt: '2026-10-30' });
  });

  it('group the resources index by kind', () => {
    expect(indexGroups('resource').map((g) => g.id)).toEqual(['video', 'course', 'guide', 'site', 'community', 'dataset', 'tool', 'template', 'case-study']);
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

describe('solutions to source a pattern', () => {
  const get = (id: string) => elements.find((e) => e.id === id)!;
  const slug = (e: { id: string }) => e.id.split(':')[2];

  it('describe one solution as its approach, and several as how many', () => {
    expect(patternDetails(get('eb:implementationPattern:agency-sign-on')).sourcing).toBe('Extend a platform the agency has');
    expect(patternDetails(get('eb:implementationPattern:grants-management')).sourcing).toBe('3 solutions');
    expect(patternDetails(get('eb:solution:public-sign-in-login-gov')).sourcing).toBe('Use a shared service');
  });

  it('lists a logical pattern’s solutions, with what each one needs', () => {
    const ways = patternDetails(get('eb:implementationPattern:oversight-intake-case-tracking')).ways;
    expect(ways.map((w) => [w.id, slug(w.solution!), w.needs.map((n) => slug(n.pattern))])).toEqual([
      ['oversight-intake-case-tracking-product', 'oversight-intake-case-tracking-product', ['agency-sign-on']],
      ['oversight-intake-case-tracking-agency-platform', 'oversight-intake-case-tracking-agency-platform', ['shared-case-platform']],
    ]);
    expect(ways[1].fields.map((f) => f.key)).toEqual(['strengths', 'fitsWhen', 'watchFor']);
  });

  it('list a solution’s components, with what each sends to and needs, and who runs it', () => {
    const product = get('eb:solution:oversight-intake-case-tracking-product');
    const parts = componentsOf(product);
    expect(parts.map((c) => [c.id, c.tier])).toEqual([
      ['staff-intake', 'front'],
      ['case-workspace', 'front'],
      ['case-workflow', 'service'],
      ['statistics', 'service'],
      ['case-records', 'data'],
    ]);
    const workspace = parts[1];
    expect(workspace).toMatchObject({ elementId: 'eb:component:oversight-intake-case-tracking-product-case-workspace', tierLabel: 'Front', exposure: 'Internal', sendsTo: [{ id: 'case-workflow', title: 'Triage and case workflow' }] });
    expect(workspace.needs.map(slug)).toEqual(['agency-sign-on']);
    expect(workspace.url).toMatch(/#component-case-workspace$/);
    expect(hostingOf(product)).toMatchObject({ label: 'Hosted by its maker', said: true });
    // Unsaid, the approach suggests it where it can.
    expect(hostingOf(get('eb:solution:shared-case-platform-platform'))).toMatchObject({ label: 'Run by the agency', said: false });
    expect(hostingOf(get('eb:solution:public-sign-in-login-gov'))).toMatchObject({ label: 'Run by another agency', said: false });
    expect(hostingOf(get('eb:solution:audit-management-system-workspace'))).toBeUndefined();
  });

  it('group the solutions index by approach', () => {
    expect(indexGroups('solution').map((g) => g.id)).toEqual(['product', 'platform', 'shared', 'combine', 'build']);
    expect(groupOf(get('eb:solution:public-sign-in-login-gov'))?.label).toBe('Use a shared service');
  });
});

describe('what search looks through', () => {
  const index = searchIndex();
  const kinds = new Set(index.map((i) => i.type));

  it('holds every kind of thing, each with a place to go', () => {
    for (const type of ['mission', 'outcome', 'measure', 'capability', 'requirement', 'implementationPattern', 'solution', 'resource', 'discovery', 'source']) expect(kinds, type).toContain(type);
    for (const i of index) {
      expect(i.title, i.url).toBeTruthy();
      expect(i.url, i.title).toMatch(i.external ? /^https?:/ : /^\//);
    }
  });

  it('finds real things', () => {
    const found = (query: string) => search(prepare(index), query).results;
    expect(found('records management')[0]).toMatchObject({ title: 'Records Management', type: 'capability', label: 'Capability', url: '/capabilities/records-management/' });
    expect(found('freedom of information act').some((r) => r.type === 'source' && r.external)).toBe(true);
    expect(found('sam.gov system for award').filter((r) => r.title === 'SAM.gov — System for Award Management')).toHaveLength(1);
    expect(found('backlog').some((r) => r.type === 'measure')).toBe(true);
    expect(found('hotline').some((r) => r.type === 'discovery' && r.url.includes('#'))).toBe(true);
  });

  it('leaves out what’s been replaced', () => {
    const gone = elements.filter((e) => e.status === 'deprecated').map((e) => e.url);
    expect(index.filter((i) => gone.includes(i.url))).toEqual([]);
  });

  it('stays small enough to load when search opens', () => {
    expect(JSON.stringify(index).length).toBeLessThan(600_000);
  });
});
