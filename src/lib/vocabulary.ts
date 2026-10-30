// The element types and relationship predicates the library knows how to
// publish. A package that uses anything else fails validation, so adding a
// type or predicate means adding it here first, with its labels.

export interface ElementTypeInfo {
  label: string;
  plural: string;
  /** Shorter label for the site navigation. */
  navLabel: string;
  /** URL section, as in /capabilities/<slug>/. */
  section: string;
  definition: string;
}

export const elementTypes: Record<string, ElementTypeInfo> = {
  mission: {
    label: 'Mission',
    plural: 'Missions',
    navLabel: 'Missions',
    section: 'missions',
    definition: 'An enduring public purpose or organizational responsibility.',
  },
  outcome: {
    label: 'Outcome',
    plural: 'Outcomes',
    navLabel: 'Outcomes',
    section: 'outcomes',
    definition: 'A result a mission seeks: the change in the world that shows the work is paying off.',
  },
  // Packages before schema 0.4.0 only. Since then, measures are part of their outcome.
  measure: {
    label: 'Measure',
    plural: 'Measures',
    navLabel: 'Measures',
    section: 'measures',
    definition: 'A way to tell how an outcome is going, such as a figure an office already reports.',
  },
  capability: {
    label: 'Capability',
    plural: 'Capabilities',
    navLabel: 'Capabilities',
    section: 'capabilities',
    definition: 'An ability an organization needs or has: what must be possible.',
  },
  requirement: {
    label: 'Requirement',
    plural: 'Requirements',
    navLabel: 'Requirements',
    section: 'requirements',
    definition: 'A condition or behavior that must be true: what a capability has to do or respect.',
  },
  implementationPattern: {
    label: 'Implementation pattern',
    plural: 'Implementation patterns',
    navLabel: 'Patterns',
    section: 'patterns',
    definition: 'An example approach that might realize a capability.',
  },
  // Packages before schema 0.4.0 only. Since then, a mission's own patterns are its architecture.
  solution: {
    label: 'Solution',
    plural: 'Solutions',
    navLabel: 'Solutions',
    section: 'solutions',
    definition: 'An example of how several patterns could fit together to support an agency’s missions.',
  },
};

export interface PredicateInfo {
  from: string[];
  to: string[];
  /** Heading on the "from" element's page, listing the "to" elements. */
  outgoing: string;
  /** Heading on the "to" element's page, listing the "from" elements. */
  incoming: string;
}

export const predicates: Record<string, PredicateInfo> = {
  seeks: {
    from: ['mission'],
    to: ['outcome'],
    outgoing: 'Outcomes it seeks',
    incoming: 'Missions that seek it',
  },
  contributes_to: {
    from: ['capability'],
    to: ['outcome'],
    outgoing: 'Outcomes it contributes to',
    incoming: 'Capabilities that contribute to it',
  },
  measured_by: {
    from: ['outcome'],
    to: ['measure'],
    outgoing: 'Measures',
    incoming: 'Outcomes it measures',
  },
  // Package 0.1.0 links capabilities straight to the mission. Later versions
  // go through the outcomes the mission seeks.
  supports_mission: {
    from: ['capability'],
    to: ['mission'],
    outgoing: 'Missions it supports',
    incoming: 'Capabilities that support it',
  },
  satisfies: {
    from: ['capability'],
    to: ['requirement'],
    outgoing: 'Reference requirements',
    incoming: 'Capabilities that satisfy it',
  },
  candidate_pattern: {
    from: ['capability'],
    to: ['implementationPattern'],
    outgoing: 'Candidate implementation patterns',
    incoming: 'Capabilities it might help realize',
  },
  includes: {
    from: ['solution'],
    to: ['implementationPattern'],
    outgoing: 'Patterns it includes',
    incoming: 'Solutions that include it',
  },
  supports: {
    from: ['solution'],
    to: ['mission'],
    outgoing: 'Missions it supports',
    incoming: 'Example solutions',
  },
  // How patterns fit together, since schema 0.3.0: one can't work without
  // the other, or the two are often used together.
  depends_on: {
    from: ['implementationPattern'],
    to: ['implementationPattern'],
    outgoing: 'Needs',
    incoming: 'Needed by',
  },
  works_with: {
    from: ['implementationPattern'],
    to: ['implementationPattern'],
    outgoing: 'Works well with',
    incoming: 'Works well with',
  },
};

// An implementation pattern describes itself in `attributes`, with these
// fields, so patterns can be compared side by side and grouped by the layer of
// a mission's architecture they belong to, which the `layer` field names
// (`role` before schema 0.4.0). A solution in an older package uses watchFor
// too. The layers are in the order the pages show them, and each hint says
// what belongs in it.
export const patternLayers: Record<string, { label: string; hint: string }> = {
  'public-facing': {
    label: 'Public facing',
    hint: 'How the public, applicants, vendors, and other agencies reach the office or find what it publishes.',
  },
  'ai-insights': {
    label: 'AI and insights',
    hint: 'Reporting, analytics, and AI that turn the office’s records into insight and suggestions, for staff to act on.',
  },
  'business-applications': {
    label: 'Business applications',
    hint: 'The system of record for each kind of work, where it’s tracked and done.',
  },
  'worker-productivity': {
    label: 'Worker productivity',
    hint: 'What staff write, collaborate, and draft in, alongside the business applications.',
  },
  connections: {
    label: 'Connections',
    hint: 'Exchanges with government-wide services and other agencies’ systems, such as SAM.gov, Grants.gov, and Treasury’s.',
  },
  'data-records': {
    label: 'Data and records',
    hint: 'Where the office’s records and content are stored, searched, and kept on their schedules.',
  },
  'security-identity': {
    label: 'Security and identity',
    hint: 'Who gets into each system, and a watch on what they do there, under everything else.',
  },
};

/** Layers that packages before schema 0.4.0 use too. Their patterns moved to the layers above. */
export const earlierLayers: Record<string, { label: string; hint: string }> = {
  processing: {
    label: 'Processing service',
    hint: 'Specialized processing on the records, such as search and review.',
  },
  infrastructure: {
    label: 'Infrastructure',
    hint: 'Shared services every system relies on, such as sign-on.',
  },
};

export const patternApproaches: Record<string, string> = {
  product: 'Configure a product',
  platform: 'Extend a platform the agency has',
  combine: 'Combine tools',
  build: 'Build to fit',
};

export const patternFields: Record<string, { label: string; definition: string }> = {
  parts: { label: 'What it’s made of', definition: 'The main pieces of the pattern.' },
  strengths: { label: 'Strengths', definition: 'What the pattern does well.' },
  fitsWhen: { label: 'Fits when', definition: 'Situations where the pattern is a good fit.' },
  watchFor: { label: 'Watch for', definition: 'Tradeoffs and risks to plan for.' },
};

export const sourceKinds: Record<string, string> = {
  'official-reference': 'Official reference',
  research: 'Research',
  background: 'Background',
  other: 'Other',
};

export const statuses: Record<string, string> = {
  reference: 'Reference',
  draft: 'Draft',
  deprecated: 'Deprecated',
};
