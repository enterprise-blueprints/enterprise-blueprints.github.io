import { describe, expect, it } from 'vitest';
import { byRole, elements, missionBlueprint, solutionsFor, solutionView } from '../src/lib/library';

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

describe('example solutions', () => {
  const get = (id: string) => elements.find((e) => e.id === id)!;
  const shared = solutionView(get('eb:solution:agency-shared-platform'));
  const slug = (e: { id: string }) => e.id.split(':')[2];

  it('group their patterns by role, public facing first and infrastructure last', () => {
    expect(shared.roles.map((g) => g.role)).toEqual(['public-facing', 'business-applications', 'processing', 'ai-insights', 'infrastructure']);
    const systems = shared.roles.find((g) => g.role === 'business-applications')!.items.map((i) => slug(i.pattern));
    expect(systems).toEqual(expect.arrayContaining(['shared-case-platform', 'foia-tracking-with-review-tool']));
    for (const g of shared.roles) for (const i of g.items) expect(i.note, slug(i.pattern)).toBeTruthy();
  });

  it('say what they cover for each mission, and what has no pattern yet', () => {
    const [oig, foia] = shared.coverage;
    expect(slug(oig.mission)).toBe('independent-government-oversight');
    expect(oig.covered.map(slug)).toEqual(expect.arrayContaining(['complaint-allegation-disclosure-intake', 'investigation-management', 'case-management']));
    expect(foia.uncovered.map(slug)).toContain('data-protection-privacy');
    expect(oig.covered.length + oig.uncovered.length).toBe(missionBlueprint(oig.mission).capabilities.length);
  });

  it('are listed on both missions', () => {
    for (const id of ['eb:mission:independent-government-oversight', 'eb:mission:public-access-to-agency-records']) {
      expect(solutionsFor(get(id)).map((s) => slug(s.solution))).toEqual(['agency-shared-platform', 'purpose-built-systems', 'dedicated-oversight-shared-foia']);
    }
  });

  it('group a mission’s patterns the same way', () => {
    const groups = byRole(missionBlueprint(get('eb:mission:public-access-to-agency-records')).patterns, (p) => p);
    // The FOIA program has no AI and insights pattern yet.
    expect(groups.map((g) => g.label)).toEqual(['Public facing', 'Business applications', 'Processing service', 'Infrastructure']);
  });
});
