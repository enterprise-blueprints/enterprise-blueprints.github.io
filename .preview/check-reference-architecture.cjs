const { chromium } = require('C:/Users/jerem/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright-core');
const fs = require('node:fs');
const path = require('node:path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const errors = [];
  try {
    const page = await browser.newPage();
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    for (const width of [1440, 768, 390]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto('http://127.0.0.1:4000/reference-architecture/ai-native-enterprise.html');
      await page.evaluate(() => document.fonts.ready);
      const report = await page.evaluate(() => {
        const figure = document.querySelector('.enterprise-stack');
        if (!figure) throw new Error('Architecture diagram missing');
        const ids = [...document.querySelectorAll('[id]')].map(node => node.id);
        const links = [...figure.querySelectorAll('a')].map(link => ({ href: link.getAttribute('href'), resolved: !!document.getElementById(new URL(link.href).hash.slice(1)) }));
        return {
          title: document.querySelector('h1').textContent,
          layers: figure.querySelectorAll('.enterprise-stack-layer').length,
          horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
          duplicateIds: ids.filter((id, i) => ids.indexOf(id) !== i),
          links,
          controlsColumns: getComputedStyle(document.querySelector('.enterprise-stack-controls')).gridTemplateColumns
        };
      });
      console.log(JSON.stringify({ width, ...report }));
      if (report.horizontalOverflow || report.layers !== 4 || report.duplicateIds.length || report.links.some(link => !link.resolved)) throw new Error(`Layout or links failed at ${width}px`);
      if (width !== 768) await page.locator('.enterprise-stack').screenshot({ path: `.preview/reference-architecture-${width}.png` });
    }
    const hrefs = await page.locator('.prose a').evaluateAll(links => links.map(link => link.getAttribute('href')));
    for (const href of hrefs) {
      const url = new URL(href, page.url());
      if (url.origin !== 'http://127.0.0.1:4000') continue;
      let target = path.join('_site', decodeURIComponent(url.pathname));
      if (url.pathname.endsWith('/')) target = path.join(target, 'index.html');
      if (!fs.existsSync(target)) throw new Error(`Missing article link: ${href}`);
    }
    await page.goto('http://127.0.0.1:4000/reference-architecture/');
    if (await page.getByRole('link', { name: /AI-Native Enterprise Reference Architecture/ }).count() !== 1) throw new Error('Category card missing');
    const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 1000 } });
    const noJsPage = await noJs.newPage();
    await noJsPage.goto('http://127.0.0.1:4000/reference-architecture/ai-native-enterprise.html');
    if (await noJsPage.locator('.enterprise-stack-layer').count() !== 4) throw new Error('Diagram missing without JavaScript');
    console.log(JSON.stringify({ articleLinks: 'pass', categoryCard: 'pass', withoutJavaScript: 'pass', browserErrors: errors }));
    if (errors.length) throw new Error('Browser errors detected');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
