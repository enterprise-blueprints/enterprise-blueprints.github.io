import type { SiteConfig } from './lib/config';

// The library's own site. The pages are shared with publishers' sites, which
// describe themselves in a file like this one.
export const site: SiteConfig & { repositoryUrl: string } = {
  title: 'Enterprise Blueprints',
  description:
    'An independent, open reference library of public-sector missions, the capabilities they depend on, and example patterns that might realize them.',
  repositoryUrl: 'https://github.com/enterprise-blueprints/enterprise-blueprints.github.io',
  nav: [
    { label: 'Data', path: 'data/' },
    { label: 'About', path: 'about/' },
  ],
  footer: 'Released under the MIT License.',
  links: [{ label: 'Source on GitHub', url: 'https://github.com/enterprise-blueprints/enterprise-blueprints.github.io' }],
};
