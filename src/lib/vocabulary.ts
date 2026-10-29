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
// fields, so patterns can be compared side by side and grouped by the part
// they play in a solution. A solution uses fitsWhen and watchFor too.
export const patternRoles: Record<string, { label: string; hint: string }> = {
  'public-facing': {
    label: 'Public facing',
    hint: 'What the public and other agencies use to reach the office or find what it publishes. Add the ones it offers.',
  },
  'business-applications': {
    label: 'Business applications',
    hint: 'Where the office’s work is tracked and done. These are alternatives: a solution usually picks one for each kind of work.',
  },
  'worker-productivity': {
    label: 'Worker productivity',
    hint: 'What staff use every day to write, collaborate, and find what they need, alongside the business applications.',
  },
  processing: {
    label: 'Processing service',
    hint: 'Specialized processing on the records, such as search and review. Add as needed.',
  },
  'ai-insights': {
    label: 'AI and insights',
    hint: 'Reporting, analytics, and AI that turn the office’s records into insight for leaders, Congress, and the public.',
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
