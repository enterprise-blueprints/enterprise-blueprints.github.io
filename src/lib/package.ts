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
      errors.push(`relation ${r.id}: "${r.predicate}" can't link a ${from.type} to a ${to.type}`);
    }
    for (const s of r.sourceIds ?? []) {
      if (!sourceIds.has(s)) errors.push(`relation ${r.id} cites unknown source ${s}`);
    }
    const edge = `${r.from} ${r.predicate} ${r.to}`;
    if (edges.has(edge)) errors.push(`relation ${r.id} repeats ${edge}`);
    edges.add(edge);
  }

  return errors;
}
