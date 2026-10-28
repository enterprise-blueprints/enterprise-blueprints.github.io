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
    definition: 'A reusable, vendor-neutral approach that might realize a capability.',
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
