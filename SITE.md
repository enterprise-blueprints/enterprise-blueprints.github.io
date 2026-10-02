# Site development

The knowledge site uses Jekyll and a custom theme stored in this repository. Markdown remains the content source. There is no separate copy of an article for the site.

## Preview locally

Install Ruby and Bundler. This workspace already has both.

```powershell
bundle install
bundle exec jekyll serve --host 127.0.0.1 --port 4000 --watch --force_polling
```

Open [http://127.0.0.1:4000/](http://127.0.0.1:4000/). Jekyll rebuilds when content changes. Restart the server after changing `_config.yml`.

Use `bundle exec jekyll build` to generate the site in `_site/`. Build output, caches, and local Bundler settings are ignored by Git.

## Content and navigation

- Author articles in their existing category directories with the metadata described in [AUTHORING.md](AUTHORING.md).
- The site shows draft, review, published, and superseded labels. Drafts remain visible so we can review them in context. Metadata status does not control access.
- Each category's README supplies its landing page metadata. The category layout lists articles automatically; maintain the README's Markdown links for GitHub readers.
- Add or change library sections in `_data/navigation.yml`. Add matching defaults in `_config.yml` when introducing a directory.
- Front matter defaults provide the article layout and section without adding site fields to each article. Relative Markdown links become links to rendered pages.
- Templates and authoring guides stay outside the built site. Both charter versions remain readable.
- Every page, including the home page, uses the same left navigation. Mobile readers use the “Browse the library” menu. A long article's headings populate its contents panel. Articles still render without JavaScript.

The AI-Native Enterprise article's filename is `foundations/ai-native-enterprise.md`. Its text and metadata remain as authored. Its summary still contains the template prompt; the listing uses a short display description until the author replaces it.

## Theme

Layouts live in `_layouts/`; reusable navigation and cards live in `_includes/`. CSS and JavaScript live under `assets/`.

The theme follows the reference boards in `brand_kit/`, while retaining the Enterprise Blueprints name and signature principle. It uses deep blue, primary blue, teal, and gold, with lighter accents for readable links on dark backgrounds. Inter serves headings and body text; monospaced labels support the blueprint style.

Outline icons and diagonal blue-and-teal graphics live in `assets/brand/`. The home page combines those graphics with its architecture diagram. Article text sits on a plain background and fills the available reading area.

Inter font files are served locally from `assets/fonts/`. Their [SIL Open Font License](assets/fonts/OFL-Inter.txt) remains with them. The source is the [official Inter project](https://rsms.me/inter/). The site does not request fonts from a third-party service.

The boards are design references and stay outside the built site. The header retains an EB monogram until a standalone Enterprise Blueprints logo is available. The reference boards' AI-Native Enterprise wordmark does not rename this project.

Theme HTML, CSS, JavaScript, and configuration are software under MIT. Article prose and diagrams retain CC BY 4.0. See [LICENSING.md](LICENSING.md).

### USWDS guidance

The theme adapts guidance from the U.S. Web Design System. It does not load the USWDS component package or claim USWDS conformance.

- [Spacing units](https://designsystem.digital.gov/design-tokens/spacing-units/): local CSS spacing tokens follow the 8px scale, with a 4px half-step. Layout gutters, cards, and navigation use these tokens.
- [Typography](https://designsystem.digital.gov/components/typography/): article text uses 18px on desktop and 17px on mobile at the default browser size. Labels and supporting text use at least 14px. Paragraphs use the full article column, matching the heading width; the page layout sets the reading area.
- [Side navigation](https://designsystem.digital.gov/components/side-navigation/): navigation uses a named landmark and a list of links. The current page or section has a visible indicator and an accessible current-state label. The mobile menu works without JavaScript.
- [Government banner](https://designsystem.digital.gov/components/banner/): the site does not use the official-government banner. Enterprise Blueprints is an independent resource hosted on a GitHub domain.

The custom dark palette remains in place. Check text contrast when changing colors. These adaptations do not replace keyboard, screen-reader, zoom, and visual testing.

## Publishing

The [Pages workflow](.github/workflows/pages.yml) builds with the locked gems and Ruby 3.4 on Ubuntu. It sets `JEKYLL_ENV=production` and uploads the generated site. Pushes and pull requests to `main` run the build; pull requests do not deploy.

For this organization's GitHub Free plan, deployment runs only for a public repository. Enable GitHub Pages with GitHub Actions as the source, then push to `main` or run the workflow manually to publish. The intended address is [enterprise-blueprints.github.io](https://enterprise-blueprints.github.io/). If the organization upgrades to support Pages from private repositories, update the workflow's deployment condition before using that option.

The site includes draft articles with visible labels. Templates, authoring guides, and brand reference boards stay out of the published site. The public source repository includes those materials.

Set `baseurl` if the site moves beneath a URL path. Monitor the workflow's build and deployment jobs, then check the live home page, articles, navigation, fonts, and icons.

See [GitHub's Pages workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) for hosting requirements.

## Jekyll references

See the official documentation for [front matter defaults](https://jekyllrb.com/docs/configuration/front-matter-defaults/) and [Windows setup](https://jekyllrb.com/docs/installation/windows/).
