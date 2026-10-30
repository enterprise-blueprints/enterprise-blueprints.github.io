// Builds blueprint packages from the source files people edit, and decides
// which version each one publishes as.
//
// Each package's source is a folder of YAML under source/<package>/:
// package.yaml, sources.yaml, one file per element type (capabilities.yaml,
// patterns.yaml, …) listing its elements in order with their links, links.yaml
// for links from other packages' elements, and discovery.yaml. A package's
// version is never written by hand: when its source no longer matches its
// published version, it gets the next one, and so does every package that
// builds on it. A version that isn't published yet is rebuilt in place.

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';
import { compareVersions } from './format.ts';
import { elementTypes, predicates } from './vocabulary.ts';
import type { Assessment, BlueprintPackage, Element, Question, Relation, Source } from './package.ts';

type Raw = Record<string, unknown>;

export interface PackageSource {
  /** The folder name, shared by source/<name>/ and content/<name>/. */
  name: string;
  meta: Raw;
  /** Folder names of the packages it builds on. */
  dependencies: string[];
  sources: Raw[];
  /** In vocabulary type order, then file order. */
  elements: { type: string; raw: Raw }[];
  links: Raw[];
  discovery: Raw[];
}

/** "capabilities" → "capability", for element files named after their type's section. */
const typeOfSection = Object.fromEntries(Object.entries(elementTypes).map(([type, info]) => [info.section, type]));
const PACKAGE_KEYS = ['schemaVersion', 'packageId', 'title', 'description', 'publisher', 'license', 'domain', 'jurisdictions', 'tags', 'dependencies'];
const ELEMENT_KEYS = ['id', 'title', 'description', 'status', 'replacedBy', 'sources', 'tags', 'jurisdictions', 'applicabilityNotes', 'attributes'];
const LINK_KEYS = ['to', 'note', 'sources', 'id', 'coverage', 'way', 'phase'];

// Written out in full, since Node runs this file without compiling it.
export class SourceError extends Error {
  readonly problems: string[];
  constructor(problems: string[]) {
    super(`Source problems:\n  ${problems.join('\n  ')}`);
    this.problems = problems;
  }
}

export function readSources(root: string): PackageSource[] {
  return readdirSync(root, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const dir = join(root, d.name);
      const files = Object.fromEntries(
        readdirSync(dir)
          .filter((f) => f.endsWith('.yaml'))
          .map((f) => [f, readFileSync(join(dir, f), 'utf8')]),
      );
      return parseSource(d.name, files);
    });
}

/** Reads one package's files, given as file name → text. */
export function parseSource(name: string, files: Record<string, string>): PackageSource {
  const problems: string[] = [];
  const at = (file: string) => `source/${name}/${file}`;
  const load = (file: string): unknown => {
    if (files[file] === undefined) return undefined;
    try {
      return parse(files[file]);
    } catch (e) {
      problems.push(`${at(file)}: ${(e as Error).message}`);
      return undefined;
    }
  };
  const list = (file: string): Raw[] => {
    const value = load(file);
    if (value == null) return [];
    if (!Array.isArray(value)) {
      problems.push(`${at(file)}: should be a list`);
      return [];
    }
    return value as Raw[];
  };

  const known = new Set(['package.yaml', 'sources.yaml', 'links.yaml', 'discovery.yaml', ...Object.keys(typeOfSection).map((s) => `${s}.yaml`)]);
  for (const file of Object.keys(files)) {
    if (!known.has(file)) problems.push(`${at(file)}: unknown file. Element files are named for their type, such as capabilities.yaml.`);
  }
  const meta = (load('package.yaml') ?? {}) as Raw;
  if (files['package.yaml'] === undefined) problems.push(`${at('package.yaml')}: missing`);
  for (const key of Object.keys(meta)) {
    if (key === 'version' || key === 'publishedAt') problems.push(`${at('package.yaml')}: "${key}" is set when the package is built, not by hand`);
    else if (!PACKAGE_KEYS.includes(key)) problems.push(`${at('package.yaml')}: unknown field "${key}"`);
  }
  const elements = Object.values(elementTypes).flatMap((info) =>
    list(`${info.section}.yaml`).map((raw) => ({ type: typeOfSection[info.section], raw })),
  );
  if (problems.length) throw new SourceError(problems);
  return {
    name,
    meta,
    dependencies: (meta.dependencies as string[] | undefined) ?? [],
    sources: list('sources.yaml'),
    elements,
    links: list('links.yaml'),
    discovery: list('discovery.yaml'),
  };
}

/** A package another one builds on, as it will be published. */
export interface Resolved {
  packageId: string;
  version: string;
}

const strings = (value: unknown): string[] => (value == null ? [] : Array.isArray(value) ? value.map(String) : [String(value)]);
const slugOf = (id: string) => id.split(':').at(-1)!;

/**
 * Builds the package a source describes, at the given version and date,
 * pinned to the given versions of the packages it builds on.
 */
export function compilePackage(src: PackageSource, deps: Record<string, Resolved>, version: string, publishedAt: string): BlueprintPackage {
  const problems: string[] = [];
  const m = src.meta;
  const at = (file: string, what?: string) => `source/${src.name}/${file}${what ? ` (${what})` : ''}`;

  /** "capability:case-management" → "eb:capability:case-management". */
  const ref = (text: string, where: string): string => {
    if (text.startsWith('eb:')) return text;
    const [type, key, extra] = text.split(':');
    if (!key || extra !== undefined || !elementTypes[type]) {
      problems.push(`${where}: "${text}" should name a type and a key, such as capability:case-management`);
      return text;
    }
    return `eb:${type}:${key}`;
  };

  const sources: Source[] = src.sources.map((s) => ({ ...s, id: `src:${s.id}` }) as Source);

  const elements: Element[] = src.elements.map(({ type, raw }) => {
    const where = at(`${elementTypes[type].section}.yaml`, String(raw.id));
    for (const key of Object.keys(raw)) {
      if (!ELEMENT_KEYS.includes(key) && !predicates[key]) problems.push(`${where}: unknown field "${key}"`);
    }
    if (!raw.id) problems.push(`${where}: needs an id`);
    const e: Element = {
      id: `eb:${type}:${raw.id}`,
      type,
      title: raw.title as string,
      description: raw.description as string,
      status: (raw.status as Element['status']) ?? 'reference',
    };
    if (raw.replacedBy) e.replacedBy = `eb:${type}:${raw.replacedBy}`;
    if (raw.sources) e.sourceIds = strings(raw.sources).map((s) => `src:${s}`);
    if (raw.tags) e.tags = raw.tags as string[];
    if (raw.jurisdictions) e.jurisdictions = raw.jurisdictions as string[];
    if (raw.applicabilityNotes) e.applicabilityNotes = raw.applicabilityNotes as string;
    if (raw.attributes) e.attributes = raw.attributes as Record<string, unknown>;
    return e;
  });

  // Links on an element, then links from other packages' elements, each in the order written.
  const relations: Relation[] = [];
  const addLinks = (from: string, raw: Raw, where: string) => {
    for (const [predicate, info] of Object.entries(predicates)) {
      if (raw[predicate] === undefined) continue;
      const entries = Array.isArray(raw[predicate]) ? (raw[predicate] as unknown[]) : [raw[predicate]];
      for (const entry of entries) {
        const link = (typeof entry === 'object' && entry !== null ? entry : { to: entry }) as Raw;
        for (const key of Object.keys(link)) if (!LINK_KEYS.includes(key)) problems.push(`${where}: unknown field "${key}" in a ${predicate} link`);
        const target = String(link.to);
        // A bare key names an element of the one type this link can reach.
        const to = target.includes(':')
          ? ref(target, where)
          : info.to.length === 1
            ? `eb:${info.to[0]}:${target}`
            : (problems.push(`${where}: "${predicate}" can reach more than one type, so "${target}" needs its type`), target);
        const r: Relation = {
          id: link.id ? `rel:${link.id}` : `rel:${slugOf(from)}-${predicate.replace(/_/g, '-')}-${slugOf(to)}`,
          from,
          predicate,
          to,
        };
        if (link.coverage !== undefined) r.coverage = link.coverage as Relation['coverage'];
        if (link.way !== undefined) r.way = String(link.way);
        if (link.phase !== undefined) r.phase = link.phase as Relation['phase'];
        if (link.note) r.description = link.note as string;
        if (link.sources) r.sourceIds = strings(link.sources).map((s) => `src:${s}`);
        relations.push(r);
      }
    }
  };
  src.elements.forEach(({ type, raw }, i) => addLinks(elements[i].id, raw, at(`${elementTypes[type].section}.yaml`, String(raw.id))));
  for (const raw of src.links) {
    const where = at('links.yaml', String(raw.from));
    for (const key of Object.keys(raw)) if (key !== 'from' && !predicates[key]) problems.push(`${where}: unknown field "${key}"`);
    addLinks(ref(String(raw.from), where), raw, where);
  }

  const assessments: Assessment[] = src.discovery.map((set) => {
    const a: Assessment = { id: `assessment:${set.id}`, title: set.title as string, questions: [] };
    if (set.description) a.description = set.description as string;
    a.questions = ((set.questions as Raw[]) ?? []).map((q) => {
      const where = at('discovery.yaml', `${set.id} / ${q.id}`);
      const question: Question = { id: `question:${q.id}`, prompt: q.prompt as string, kind: q.kind as Question['kind'] };
      if (q.options) {
        // Each option is written "value: label".
        question.options = (q.options as Raw[]).map((o) => {
          const [value, label] = Object.entries(o)[0] ?? [];
          return { value: String(value), label: String(label) };
        });
      }
      if (q.points) {
        // A group names the answers that point to one or more elements, for one reason.
        question.candidateMappings = (q.points as Raw[]).flatMap((group) =>
          strings(group.to).flatMap((target) =>
            strings(group.when).map((answerValue) => ({ answerValue, elementId: ref(target, where), interpretation: group.why as string })),
          ),
        );
      }
      return question;
    });
    return a;
  });

  const dependencies = src.dependencies.map((name) => {
    const d = deps[name];
    if (!d) problems.push(`${at('package.yaml')}: builds on "${name}", which isn't a package under source/`);
    return { packageId: d?.packageId ?? name, version: d?.version ?? '0.0.0' };
  });

  if (problems.length) throw new SourceError(problems);
  return {
    schemaVersion: m.schemaVersion as BlueprintPackage['schemaVersion'],
    packageId: m.packageId as string,
    version,
    title: m.title as string,
    description: m.description as string,
    publisher: m.publisher as BlueprintPackage['publisher'],
    license: m.license as string,
    publishedAt,
    domain: m.domain as string,
    ...(m.jurisdictions ? { jurisdictions: m.jurisdictions as string[] } : {}),
    ...(m.tags ? { tags: m.tags as string[] } : {}),
    ...(dependencies.length ? { dependencies } : {}),
    ...(sources.length ? { sources } : {}),
    elements,
    relations,
    ...(assessments.length ? { assessments } : {}),
  };
}

function equal(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (Array.isArray(a) || Array.isArray(b)) {
    return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((x, i) => equal(x, b[i]));
  }
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
  const ka = Object.keys(a), kb = Object.keys(b);
  return ka.length === kb.length && ka.every((k) => equal((a as Raw)[k], (b as Raw)[k]));
}

function groupBy<T>(list: T[], key: (x: T) => string): Record<string, T[]> {
  const groups: Record<string, T[]> = {};
  for (const x of list) (groups[key(x)] ??= []).push(x);
  return groups;
}

/**
 * Whether two packages say the same thing, apart from their version and date.
 * What the pages show in order stays in order: elements within a type, and
 * one element's links of one kind. The order across types, or of unrelated
 * links, carries no meaning.
 */
export function sameContent(a: BlueprintPackage, b: BlueprintPackage): boolean {
  const rest = (p: BlueprintPackage) => {
    const { version: _v, publishedAt: _d, elements: _e, relations: _r, ...others } = p;
    return others;
  };
  const links = (p: BlueprintPackage) => groupBy(p.relations, (r) => `${r.from} ${r.predicate}`);
  return equal(rest(a), rest(b)) && equal(groupBy(a.elements, (e) => e.type), groupBy(b.elements, (e) => e.type)) && equal(links(a), links(b));
}

/** What changed from one version to the next, in a few words. */
export function describeChange(before: BlueprintPackage, after: BlueprintPackage): string {
  const parts: string[] = [];
  const count = <T>(list: T[], noun: string) => `${list.length} ${noun}${list.length === 1 ? '' : 's'}`;
  const ids = (p: BlueprintPackage) => new Map(p.elements.map((e) => [e.id, e]));
  const was = ids(before), now = ids(after);
  const added = [...now.keys()].filter((id) => !was.has(id));
  const removed = [...was.keys()].filter((id) => !now.has(id));
  const edited = [...now.keys()].filter((id) => was.has(id) && !equal(was.get(id), now.get(id)));
  if (added.length) parts.push(`${count(added, 'element')} added`);
  if (removed.length) parts.push(`${count(removed, 'element')} removed`);
  if (edited.length) parts.push(`${count(edited, 'element')} edited`);
  const rel = (p: BlueprintPackage) => new Set(p.relations.map((r) => JSON.stringify([r.id, r.from, r.predicate, r.to, r.description, r.sourceIds])));
  const rb = rel(before), ra = rel(after);
  const linksChanged = [...ra].filter((r) => !rb.has(r)).length + [...rb].filter((r) => !ra.has(r)).length;
  if (linksChanged) parts.push('links changed');
  const pins = (p: BlueprintPackage) => new Map((p.dependencies ?? []).map((d) => [d.packageId, d.version]));
  const pb = pins(before);
  for (const [id, v] of pins(after)) if (pb.get(id) !== v) parts.push(`builds on ${id.split('.').at(-1)} ${v}`);
  if (!equal(before.assessments, after.assessments)) parts.push('discovery questions changed');
  if (!equal(before.sources, after.sources)) parts.push('sources changed');
  const meta = (p: BlueprintPackage) => [p.title, p.description, p.tags, p.jurisdictions, p.domain, p.license, p.publisher, p.schemaVersion];
  if (!equal(meta(before), meta(after))) parts.push('package details changed');
  return parts.join(', ') || 'order changed';
}

const nextMinor = (v: string) => {
  const [major, minor] = v.split('.').map(Number);
  return `${major}.${minor + 1}.0`;
};

export interface Step {
  name: string;
  /** The version the pages will show. */
  version: string;
  /** The package to write as content/<name>/<version>/blueprint.json, when it changed. */
  write?: BlueprintPackage;
  /** Unpublished versions that are no longer needed. */
  remove: string[];
  reason: string;
}

/**
 * Decides each package's version, packages that others build on first. A
 * package whose source matches its latest published version stays on it. One
 * that doesn't gets a version after it: the unpublished one already there,
 * rebuilt, or the next minor version.
 */
export function plan(
  sources: PackageSource[],
  versionsOf: (name: string) => Record<string, BlueprintPackage>,
  isPublished: (name: string, version: string) => boolean,
  today: string,
): Step[] {
  const byName = new Map(sources.map((s) => [s.name, s]));
  const order: PackageSource[] = [];
  const visiting = new Set<string>();
  const visit = (s: PackageSource) => {
    if (order.includes(s)) return;
    if (visiting.has(s.name)) throw new SourceError([`source/${s.name}: packages build on each other in a loop`]);
    visiting.add(s.name);
    for (const d of s.dependencies) {
      const dep = byName.get(d);
      if (!dep) throw new SourceError([`source/${s.name}/package.yaml: builds on "${d}", which isn't a package under source/`]);
      visit(dep);
    }
    order.push(s);
  };
  sources.forEach(visit);

  const resolved: Record<string, Resolved> = {};
  return order.map((src) => {
    const have = versionsOf(src.name);
    const sorted = Object.keys(have).sort(compareVersions);
    const published = sorted.filter((v) => isPublished(src.name, v)).at(-1);
    const drafts = sorted.filter((v) => !isPublished(src.name, v) && (!published || compareVersions(v, published) > 0));
    const build = (version: string, date: string) => compilePackage(src, resolved, version, date);
    const done = (step: Step): Step => {
      resolved[src.name] = { packageId: src.meta.packageId as string, version: step.version };
      return step;
    };

    if (published && sameContent(build(published, have[published].publishedAt), have[published])) {
      return done({ name: src.name, version: published, remove: drafts, reason: drafts.length ? `back to ${published}, as published` : 'unchanged' });
    }
    const draft = drafts.at(-1);
    const version = draft ?? (published ? nextMinor(published) : '0.1.0');
    const others = drafts.filter((v) => v !== version);
    if (draft && sameContent(build(draft, have[draft].publishedAt), have[draft])) {
      return done({ name: src.name, version: draft, remove: others, reason: 'unpublished, up to date' });
    }
    const pkg = build(version, today);
    const reason = published ? describeChange(have[published], pkg) : 'new package';
    return done({ name: src.name, version, write: pkg, remove: others, reason });
  });
}
