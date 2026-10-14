# Repository structure

The repository holds the architecture content and a custom Jekyll site. Markdown files remain the content source.

```text
enterprise-blueprints.github.io/
├── .github/
│   └── workflows/
│       └── pages.yml
├── _data/
│   ├── capabilities/
│   │   └── <slug>.yml (one per capability)
│   ├── missions/
│   │   └── inspector-general-investigations.yml
│   ├── navigation.yml
│   └── use-cases/
│       └── public-sector-case-management.yml
├── _includes/
│   ├── capability-catalog.html
│   ├── capability-link.html
│   ├── content-card.html
│   ├── icon.html
│   ├── mission-activity-title.html
│   ├── mission-model.html
│   ├── mission-process.html
│   ├── mission-requirement-link.html
│   ├── navigation.html
│   ├── use-case-model.html
│   └── use-case-requirement.html
├── _layouts/
│   ├── article.html
│   ├── category.html
│   ├── default.html
│   └── home.html
├── assets/
│   ├── brand/
│   │   ├── architecture-field.svg
│   │   └── icons.svg
│   ├── css/
│   │   └── site.css
│   ├── diagrams/
│   │   ├── ai-native-enterprise-stack.html
│   │   ├── enterprise-capability-map.html
│   │   └── README.md
│   ├── fonts/
│   │   ├── InterVariable-Italic.woff2
│   │   ├── InterVariable.woff2
│   │   └── OFL-Inter.txt
│   ├── js/
│   │   └── site.js
│   └── favicon.svg
├── blueprints/
│   └── README.md
├── brand_kit/
│   ├── AI-Native Enterprise Brand Kit.png
│   └── AI-Native Enterprise Dark Brand Board.png
├── capabilities/
│   ├── catalog.md
│   ├── index.json
│   └── README.md
├── charter/
│   ├── project-charter-v0.3.md
│   ├── project-charter-v0.4.md
│   └── project-charter-v0.5.md
├── decisions/
│   ├── 0001-add-use-cases-and-rename-objects-to-entities.md
│   ├── 0002-build-experiences-share-capabilities.md
│   ├── 0003-add-machine-readable-mission-models.md
│   ├── 0004-add-machine-readable-use-case-processes.md
│   ├── 0005-add-a-machine-readable-capability-catalog.md
│   └── README.md
├── entities/
│   └── README.md
├── foundations/
│   ├── ai-native-enterprise.md
│   ├── enterprise-capability-map.md
│   └── README.md
├── implementations/
│   └── README.md
├── missions/
│   ├── index.json
│   ├── inspector-general-investigations.md
│   └── README.md
├── patterns/
│   └── README.md
├── policies/
│   └── README.md
├── reference-architecture/
│   ├── ai-native-enterprise.md
│   └── README.md
├── templates/
│   ├── architecture-decision.md
│   ├── blueprint.md
│   ├── capability.md
│   ├── capability.yml
│   ├── entity.md
│   ├── foundation.md
│   ├── implementation.md
│   ├── lab.md
│   ├── mission.md
│   ├── mission.yml
│   ├── pattern.md
│   ├── policy.md
│   ├── README.md
│   ├── reference-architecture.md
│   ├── use-case.md
│   └── use-case.yml
├── use-cases/
│   ├── index.json
│   ├── public-sector-case-management.md
│   └── README.md
├── .gitignore
├── 404.html
├── _config.yml
├── about.md
├── AUTHORING.md
├── Gemfile
├── Gemfile.lock
├── index.html
├── LICENSE-CC-BY-4.0.txt
├── LICENSE-MIT.txt
├── LICENSING.md
├── README.md
├── SITE.md
└── structure.md
```

Git metadata, build output, caches, and local dependencies are omitted. Mission models in `_data/missions/`, use case process models in `_data/use-cases/`, and the capability catalog in `_data/capabilities/` are machine-readable content. Labs and formal schema validation remain deferred.

See the [repository overview](README.md), [authoring guide](AUTHORING.md), [site development guide](SITE.md), and [template catalog](templates/README.md).
