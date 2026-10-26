// The Enterprise Blueprints package format (schemaVersion 0.1.0) and its
// validation: JSON Schema first, then the reference checks a schema can't do.

import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import schema from '../../schemas/blueprint-package.schema.json';
import { elementTypes, predicates } from './vocabulary';

export interface Source {
  id: string;
  title: string;
  url: string;
  kind: 'official-reference' | 'research' | 'background' | 'other';
  publicationDate?: string;
  lastReviewedAt?: string;
  note?: string;
}

export interface Element {
  id: string;
  type: string;
  title: string;
  description: string;
  status?: 'reference' | 'draft' | 'deprecated';
  replacedBy?: string;
  sourceIds?: string[];
  tags?: string[];
  jurisdictions?: string[];
  applicabilityNotes?: string;
  attributes?: Record<string, unknown>;
}

export interface Relation {
  id: string;
  from: string;
  predicate: string;
  to: string;
  description?: string;
  sourceIds?: string[];
}

export interface QuestionOption {
  value: string;
  label: string;
}

/** An answer that points to an element worth exploring, and why. */
export interface CandidateMapping {
  answerValue: string;
  elementId: string;
  interpretation: string;
}

export interface Question {
  id: string;
  prompt: string;
  kind: 'single-choice' | 'multiple-choice' | 'text' | 'number' | 'boolean';
  options?: QuestionOption[];
  candidateMappings?: CandidateMapping[];
}

/** A set of discovery questions. */
export interface Assessment {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

export interface BlueprintPackage {
  schemaVersion: '0.1.0';
  packageId: string;
  version: string;
  title: string;
  description: string;
  publisher: { name: string; url?: string };
  license: string;
  publishedAt: string;
  domain: string;
  jurisdictions?: string[];
  tags?: string[];
  sources?: Source[];
  elements: Element[];
  relations: Relation[];
  assessments?: Assessment[];
}

const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);
const matchesSchema = ajv.compile<BlueprintPackage>(schema);

function duplicates(ids: string[]): string[] {
  const seen = new Set<string>();
  const repeated = new Set<string>();
  for (const id of ids) (seen.has(id) ? repeated : seen).add(id);
  return [...repeated];
}

/** Returns every problem found; an empty list means the package is valid. */
export function validatePackage(data: unknown): string[] {
  if (!matchesSchema(data)) {
    return (matchesSchema.errors ?? []).map(
      (e) => `schema: ${e.instancePath || '(root)'} ${e.message ?? 'is invalid'}`,
    );
  }
  const pkg = data;
  const errors: string[] = [];
  const sources = pkg.sources ?? [];

  for (const id of duplicates(pkg.elements.map((e) => e.id))) errors.push(`duplicate element ID ${id}`);
  for (const id of duplicates(pkg.relations.map((r) => r.id))) errors.push(`duplicate relation ID ${id}`);
  for (const id of duplicates(sources.map((s) => s.id))) errors.push(`duplicate source ID ${id}`);

  const elementsById = new Map(pkg.elements.map((e) => [e.id, e]));
  const sourceIds = new Set(sources.map((s) => s.id));

  for (const e of pkg.elements) {
    if (!elementTypes[e.type]) errors.push(`element ${e.id} has unknown type "${e.type}"`);
    // The ID names its type, which keeps IDs and page URLs unique per type.
    if (!e.id.startsWith(`eb:${e.type}:`)) errors.push(`element ${e.id} doesn't match its type "${e.type}"`);
    for (const s of e.sourceIds ?? []) {
      if (!sourceIds.has(s)) errors.push(`element ${e.id} cites unknown source ${s}`);
    }
    if (e.replacedBy && !elementsById.has(e.replacedBy)) {
      errors.push(`element ${e.id} is replaced by unknown element ${e.replacedBy}`);
    }
  }

  const edges = new Set<string>();
  for (const r of pkg.relations) {
    const from = elementsById.get(r.from);
    const to = elementsById.get(r.to);
    if (!from) errors.push(`relation ${r.id} starts at unknown element ${r.from}`);
    if (!to) errors.push(`relation ${r.id} ends at unknown element ${r.to}`);
    const predicate = predicates[r.predicate];
    if (!predicate) {
      errors.push(`relation ${r.id} uses unknown predicate "${r.predicate}"`);
    } else if (from && to && (!predicate.from.includes(from.type) || !predicate.to.includes(to.type))) {
      errors.push(`relation ${r.id}: "${r.predicate}" can't link ${from.type} ${r.from} to ${to.type} ${r.to}`);
    }
    for (const s of r.sourceIds ?? []) {
      if (!sourceIds.has(s)) errors.push(`relation ${r.id} cites unknown source ${s}`);
    }
    const edge = `${r.from} ${r.predicate} ${r.to}`;
    if (edges.has(edge)) errors.push(`relation ${r.id} repeats ${edge}`);
    edges.add(edge);
  }

  errors.push(...assessmentProblems(pkg.assessments ?? [], elementsById));
  return errors;
}

const CHOICE = new Set(['single-choice', 'multiple-choice']);

/**
 * Question sets: IDs that name what they are, choices with distinct values,
 * and mappings that use a real answer and point at a real element. Text and
 * number answers are recorded as said, so they don't map to anything.
 */
function assessmentProblems(assessments: Assessment[], elementsById: Map<string, Element>): string[] {
  const errors: string[] = [];
  for (const id of duplicates(assessments.map((a) => a.id))) errors.push(`duplicate assessment ID ${id}`);
  const questions = assessments.flatMap((a) => a.questions);
  for (const id of duplicates(questions.map((q) => q.id))) errors.push(`duplicate question ID ${id}`);

  for (const a of assessments) {
    if (!/^assessment:[a-z0-9][a-z0-9-]*$/.test(a.id)) errors.push(`assessment ${a.id} should look like assessment:<name>`);
    if (!a.questions.length) errors.push(`assessment ${a.id} has no questions`);
  }
  for (const q of questions) {
    if (!/^question:[a-z0-9][a-z0-9-]*$/.test(q.id)) errors.push(`question ${q.id} should look like question:<name>`);
    const options = q.options ?? [];
    const choice = CHOICE.has(q.kind);
    if (choice && options.length < 2) errors.push(`question ${q.id} needs at least two options`);
    if (!choice && options.length) errors.push(`question ${q.id} is ${q.kind}, so it can't have options`);
    for (const v of duplicates(options.map((o) => o.value))) errors.push(`question ${q.id} repeats option ${v}`);

    const answers = choice ? new Set(options.map((o) => o.value)) : q.kind === 'boolean' ? new Set(['true', 'false']) : new Set<string>();
    for (const m of q.candidateMappings ?? []) {
      if (!answers.size) {
        errors.push(`question ${q.id} is ${q.kind}, so its answers can't map to elements`);
        break;
      }
      if (!answers.has(m.answerValue)) errors.push(`question ${q.id} maps answer "${m.answerValue}", which isn't one of its answers`);
      if (!elementsById.has(m.elementId)) errors.push(`question ${q.id} maps to unknown element ${m.elementId}`);
    }
    const pairs = (q.candidateMappings ?? []).map((m) => `${m.answerValue} → ${m.elementId}`);
    for (const pair of duplicates(pairs)) errors.push(`question ${q.id} repeats mapping ${pair}`);
  }
  return errors;
}
