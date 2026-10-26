const { chromium } = require('C:/Users/jerem/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright-core');
const fs = require('node:fs');
const path = require('node:path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const errors = [];
  const pages = [
    ['reference-architecture/ai-native-enterprise.html', '.enterprise-stack', 'reference-architecture'],
    ['foundations/enterprise-capability-map.html', '.capability-map', 'capability-map']
  ];
  try {
    const page = await browser.newPage();
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    for (const [url, figure, name] of pages) {
      for (const width of [1440, 768, 390]) {
        await page.setViewportSize({ width, height: 1000 });
        await page.goto(`http://127.0.0.1:4000/${url}`);
        await page.evaluate(() => document.fonts.ready);
        const report = await page.evaluate(selector => {
          const diagram = document.querySelector(selector);
          if (!diagram) throw new Error('Diagram missing');
          const ids = [...document.querySelectorAll('[id]')].map(node => node.id);
          return {
            overflow: document.documentElement.scrollWidth > innerWidth,
            duplicateIds: ids.filter((id, i) => ids.indexOf(id) !== i),
            securityPanel: diagram.textContent.includes('Security, Trust, and Policy'),
            operationsPanel: diagram.textContent.includes('Operations and Assurance')
          };
        }, figure);
        if (report.overflow || report.duplicateIds.length || !report.securityPanel || !report.operationsPanel) throw new Error(JSON.stringify({ name, width, ...report }));
        console.log(JSON.stringify({ name, width, ...report }));
        if (width !== 768) await page.locator(figure).screenshot({ path: `.preview/${name}-${width}.png` });
      }
      const hrefs = await page.locator('.prose a').evaluateAll(links => links.map(link => link.href));
      let checked = 0;
      for (const href of hrefs) {
        const url = new URL(href);
        if (url.origin !== 'http://127.0.0.1:4000') continue;
        let target = path.join('_site', decodeURIComponent(url.pathname));
        if (url.pathname.endsWith('/')) target = path.join(target, 'index.html');
        if (!fs.existsSync(target)) throw new Error(`Missing link: ${href}`);
        if (url.hash) {
          const html = fs.readFileSync(target, 'utf8');
          const found = await page.evaluate(({ html, id }) => !!new DOMParser().parseFromString(html, 'text/html').getElementById(id), { html, id: decodeURIComponent(url.hash.slice(1)) });
          if (!found) throw new Error(`Missing section: ${href}`);
        }
        checked++;
      }
      console.log(JSON.stringify({ name, checkedLocalLinksAndAnchors: checked }));
    }
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 1000 } });
    const noJs = await context.newPage();
    for (const [url, figure, name] of pages) {
      await noJs.goto(`http://127.0.0.1:4000/${url}`);
      if (!await noJs.locator(figure).isVisible()) throw new Error(`Missing no-JS diagram: ${name}`);
    }
    if (errors.length) throw new Error(errors.join('\n'));
    console.log('Both diagrams render without JavaScript; no browser errors.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
