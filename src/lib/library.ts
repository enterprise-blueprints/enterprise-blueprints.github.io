// Loads every package version under content/<name>/<version>/, validates it,
// and indexes the latest version of each package for the pages. Earlier
// versions stay published exactly as they were. A package can build on
// another, such as a mission package on the common one, and point at its
// elements. Any validation problem stops the build.

import { validatePackage, type Assessment, type BlueprintPackage, type Element, type Question, type Relation, type Source } from './package';
import { elementTypes, predicates, type ElementTypeInfo } from './vocabulary';
import { href } from './paths';

export interface LibraryElement extends Element {
  package: BlueprintPackage;
  typeInfo: ElementTypeInfo;
  slug: string;
  url: string;
}

export interface RelationGroup {
  heading: string;
  /** Distinct notes on the relations in this group. */
  notes: string[];
  elements: LibraryElement[];
}

/** A package version as stored: its folder under content/, its exact text, and its data. */
export interface PackageFile {
  name: string;
  text: string;
  data: BlueprintPackage;
  /** True for the newest version of its package, the one the pages show. */
  latest: boolean;
}

const files = import.meta.glob<string>('/content/*/*/blueprint.json', {
  query: '?raw',
  import: 'default',
  eager: true,
});

/** Orders versions such as "0.10.0" after "0.9.0". */
export function compareVersions(a: string, b: string): number {
  const [x, y] = [a, b].map((v) => v.split('.').map(Number));
  return x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
}

function load(): PackageFile[] {
  const errors: string[] = [];
  const loaded: Omit<PackageFile, 'latest'>[] = [];
  const parsed = Object.entries(files).map(([path, text]) => ({ path, text, data: JSON.parse(text) as BlueprintPackage }));
  // Dependencies resolve against every package in content/, valid or not; their own problems are reported on their own.
  const resolve = (packageId: string, version: string) => parsed.find((p) => p.data.packageId === packageId && p.data.version === version)?.data;
  for (const { path, text, data } of parsed) {
    const [, , name, version] = path.split('/');
    const problems = validatePackage(data, resolve);
    errors.push(...problems.map((p) => `${path}: ${p}`));
    if (problems.length) continue;
    if (data.version !== version) errors.push(`${path}: the folder says ${version} but the package says ${data.version}`);
    loaded.push({ name, text, data });
  }

  // Every version of a package lives in one folder, under one package ID.
  const folderOf = new Map<string, string>();
  for (const { name, data } of loaded) {
    const folder = folderOf.get(data.packageId);
    if (folder && folder !== name) errors.push(`package ${data.packageId} is in both content/${folder} and content/${name}`);
    folderOf.set(data.packageId, name);
  }
  const versions = new Map<string, Omit<PackageFile, 'latest'>[]>();
  for (const file of loaded) versions.set(file.name, [...(versions.get(file.name) ?? []), file]);
  for (const [name, list] of versions) {
    if (new Set(list.map((f) => f.data.packageId)).size > 1) errors.push(`content/${name} holds more than one package ID`);
    list.sort((a, b) => compareVersions(a.data.version, b.data.version));
  }

  // The pages show the latest version of everything, so a latest version builds on latest versions.
  for (const list of versions.values()) {
    const pkg = list.at(-1)!.data;
    for (const d of pkg.dependencies ?? []) {
      const newest = [...versions.values()].find((l) => l[0].data.packageId === d.packageId)?.at(-1)?.data.version;
      if (newest && newest !== d.version) errors.push(`${pkg.packageId} ${pkg.version} builds on ${d.packageId} ${d.version}, but the latest is ${newest}`);
    }
  }

  // Element IDs are unique across the packages the pages show.
  const seen = new Map<string, string>();
  for (const list of versions.values()) {
    const pkg = list.at(-1)!.data;
    for (const e of pkg.elements) {
      const other = seen.get(e.id);
      if (other) errors.push(`element ${e.id} is defined in both ${other} and ${pkg.packageId}`);
      seen.set(e.id, pkg.packageId);
    }
  }
  if (!Object.keys(files).length) errors.push('no packages found under content/');
  if (errors.length) {
    throw new Error(`Blueprint package validation failed:\n  ${errors.join('\n  ')}`);
  }
  return [...versions.values()].flatMap((list) => list.map((f, i) => ({ ...f, latest: i === list.length - 1 })));
}

/** Every package version, oldest first within each package. */
export const packageFiles = load();
/** The latest version of each package. */
export const packages = packageFiles.filter((f) => f.latest).map((f) => f.data);

export const elements: LibraryElement[] = packages.flatMap((pkg) =>
  pkg.elements.map((e) => {
    const typeInfo = elementTypes[e.type];
    const slug = e.id.split(':')[2];
    return { ...e, package: pkg, typeInfo, slug, url: href(`${typeInfo.section}/${slug}/`) };
  }),
);

const byId = new Map(elements.map((e) => [e.id, e]));
const relations: (Relation & { package: BlueprintPackage })[] = packages.flatMap((p) => p.relations.map((r) => ({ ...r, package: p })));

export function elementsOfType(type: string): LibraryElement[] {
  return elements.filter((e) => e.type === type);
}

/** Types that have at least one element, in vocabulary order. */
export function typesInUse(): [string, ElementTypeInfo][] {
  return Object.entries(elementTypes).filter(([type]) => elements.some((e) => e.type === type));
}

/**
 * Elements linked to this one by a predicate, in either direction. With
 * `within`, only relations those packages define count, so a mission sees
 * what a shared capability does for it and not for other missions.
 */
export function related(
  element: LibraryElement,
  predicate: string,
  direction: 'outgoing' | 'incoming',
  within?: BlueprintPackage[],
): LibraryElement[] {
  return relationsOf(element, predicate, direction)
    .filter((r) => !within || within.includes(r.package))
    .map((r) => byId.get(direction === 'outgoing' ? r.to : r.from)!);
}

function relationsOf(element: LibraryElement, predicate: string, direction: 'outgoing' | 'incoming') {
  return relations.filter(
    (r) => r.predicate === predicate && (direction === 'outgoing' ? r.from : r.to) === element.id,
  );
}

/** A package and the packages it builds on, as the pages show them. */
function scopeOf(pkg: BlueprintPackage): BlueprintPackage[] {
  return [pkg, ...packages.filter((p) => pkg.dependencies?.some((d) => d.packageId === p.packageId))];
}

/** An element's relationships, grouped by predicate and direction. */
export function relationGroups(element: LibraryElement): RelationGroup[] {
  const groups: RelationGroup[] = [];
  for (const [name, info] of Object.entries(predicates)) {
    for (const direction of ['outgoing', 'incoming'] as const) {
      const rels = relationsOf(element, name, direction);
      if (!rels.length) continue;
      groups.push({
        heading: info[direction],
        notes: [...new Set(rels.flatMap((r) => (r.description ? [r.description] : [])))],
        elements: related(element, name, direction),
      });
    }
  }
  return groups;
}

export interface MissionBlueprint {
  outcomes: { outcome: LibraryElement; measures: LibraryElement[]; capabilities: LibraryElement[] }[];
  /** The mission's own capabilities first, then shared ones from packages it builds on. */
  capabilities: {
    capability: LibraryElement;
    /** The package it comes from, when that isn't the mission's own. */
    sharedFrom?: BlueprintPackage;
    outcomes: LibraryElement[];
    requirements: LibraryElement[];
    patterns: LibraryElement[];
  }[];
  measures: LibraryElement[];
  requirements: LibraryElement[];
  patterns: LibraryElement[];
}

/**
 * Everything under a mission, band by band: the outcomes it seeks and their
 * measures, the capabilities that contribute to them (or, in older packages,
 * support the mission directly), and those capabilities' requirements and
 * candidate patterns. Only the mission's package and the packages it builds
 * on count, so a shared capability brings what it does for this mission.
 */
export function missionBlueprint(mission: LibraryElement): MissionBlueprint {
  const unique = (list: LibraryElement[]) => [...new Set(list)];
  const scope = scopeOf(mission.package);
  const outcomes = related(mission, 'seeks', 'outgoing', scope).map((outcome) => ({
    outcome,
    measures: related(outcome, 'measured_by', 'outgoing', scope),
    capabilities: related(outcome, 'contributes_to', 'incoming', scope),
  }));
  const found = unique([...outcomes.flatMap((o) => o.capabilities), ...related(mission, 'supports_mission', 'incoming', scope)]);
  // In the order their packages define them, the mission's own first.
  const order = (e: LibraryElement) => (e.package === mission.package ? 0 : 1) * 1e6 + elements.indexOf(e);
  const capabilities = found
    .sort((a, b) => order(a) - order(b))
    .map((capability) => ({
      capability,
      ...(capability.package !== mission.package && { sharedFrom: capability.package }),
      outcomes: outcomes.filter((o) => o.capabilities.includes(capability)).map((o) => o.outcome),
      requirements: related(capability, 'satisfies', 'outgoing', scope),
      patterns: related(capability, 'candidate_pattern', 'outgoing', scope),
    }));
  return {
    outcomes,
    capabilities,
    measures: unique(outcomes.flatMap((o) => o.measures)),
    requirements: unique(capabilities.flatMap((c) => c.requirements)),
    patterns: unique(capabilities.flatMap((c) => c.patterns)),
  };
}

/** "Common Capabilities" for "Common Capabilities — Shared Across Missions". */
export const shortTitle = (pkg: BlueprintPackage) => pkg.title.split(' — ')[0];

/** The packages that build on this one, such as the mission packages that build on the common one. */
export function dependents(pkg: BlueprintPackage): BlueprintPackage[] {
  return packages.filter((p) => p.dependencies?.some((d) => d.packageId === pkg.packageId));
}

/** Other packages whose relations or discovery answers point at this element. */
export function usedBy(element: LibraryElement): BlueprintPackage[] {
  return packages.filter(
    (p) =>
      p !== element.package &&
      (p.relations.some((r) => r.from === element.id || r.to === element.id) ||
        (p.assessments ?? []).some((a) => a.questions.some((q) => q.candidateMappings?.some((m) => m.elementId === element.id)))),
  );
}

export function sourcesOf(element: LibraryElement): Source[] {
  const sources = element.package.sources ?? [];
  return (element.sourceIds ?? []).map((id) => sources.find((s) => s.id === id)!);
}

export interface LibrarySource extends Source {
  package: BlueprintPackage;
  citedBy: LibraryElement[];
}

export const sources: LibrarySource[] = packages.flatMap((pkg) =>
  (pkg.sources ?? []).map((s) => ({
    ...s,
    package: pkg,
    citedBy: elements.filter((e) => e.package === pkg && e.sourceIds?.includes(s.id)),
  })),
);

/** The most recent review date among the given sources. */
export function lastReviewed(list: Source[]): string | undefined {
  return list.map((s) => s.lastReviewedAt).filter(Boolean).sort().at(-1);
}

export interface LibraryQuestion extends Question {
  assessment: Assessment;
  package: BlueprintPackage;
  /** The anchor on its discovery page. */
  url: string;
}

export interface LibraryAssessment extends Assessment {
  package: BlueprintPackage;
  slug: string;
  url: string;
}

export const assessments: LibraryAssessment[] = packages.flatMap((pkg) =>
  (pkg.assessments ?? []).map((a) => {
    const slug = a.id.split(':')[1];
    return { ...a, package: pkg, slug, url: href(`discovery/${slug}/`) };
  }),
);

/** Discovery questions with an answer that points to this element, and the answers that do. */
export function questionsAbout(element: LibraryElement): { question: LibraryQuestion; answers: { label: string; interpretation: string }[] }[] {
  return assessments.flatMap((a) =>
    a.questions.flatMap((q) => {
      const mappings = (q.candidateMappings ?? []).filter((m) => m.elementId === element.id);
      if (!mappings.length) return [];
      const label = (value: string) => q.options?.find((o) => o.value === value)?.label ?? (value === 'true' ? 'Yes' : value === 'false' ? 'No' : value);
      // Answers that mean the same thing for this element are listed together.
      const byMeaning = new Map<string, string[]>();
      for (const m of mappings) byMeaning.set(m.interpretation, [...(byMeaning.get(m.interpretation) ?? []), m.answerValue]);
      const every = (values: string[]) => (q.options?.length ?? 2) === values.length;
      return [
        {
          question: { ...q, assessment: a, package: a.package, url: `${a.url}#${q.id.split(':')[1]}` },
          answers: [...byMeaning].map(([interpretation, values]) => ({
            label: every(values) && values.length > 1 ? 'Any answer' : values.map(label).join(', '),
            interpretation,
          })),
        },
      ];
    }),
  );
}
