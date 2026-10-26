const { chromium } = require('C:/Users/jerem/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright-core');
(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    for (const url of ['reference-architecture/ai-native-enterprise.html', 'foundations/enterprise-capability-map.html']) {
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.goto(`http://127.0.0.1:4000/${url}`);
      const title = page.locator('.architecture-diagram .enterprise-stack-title a, .architecture-diagram .diagram-layer-heading a').first();
      if (await title.evaluate(node => getComputedStyle(node).textDecorationLine) !== 'none') throw new Error('Persistent title underline');
      await title.focus();
      const focus = await title.evaluate(node => ({ visible: node.matches(':focus-visible'), underline: getComputedStyle(node).textDecorationLine, outline: getComputedStyle(node).outlineStyle }));
      if (!focus.visible || focus.underline !== 'underline' || focus.outline === 'none') throw new Error(JSON.stringify(focus));
      const destination = await title.evaluate(node => node.href);
      await Promise.all([page.waitForURL(destination), page.keyboard.press('Enter')]);
      if (!new URL(page.url()).hash) throw new Error('Keyboard navigation failed');
      await page.setViewportSize({ width: 320, height: 1000 });
      await page.goto(`http://127.0.0.1:4000/${url}`);
      const small = await page.locator('.architecture-diagram').evaluate(node => ({ width: node.clientWidth, contentWidth: node.scrollWidth }));
      if (small.contentWidth > small.width) throw new Error(`320px overflow: ${JSON.stringify(small)}`);
      await page.setViewportSize({ width: 1440, height: 1000 });
      const style = await page.addStyleTag({ content: 'html{font-size:200%}' });
      const large = await page.locator('.architecture-diagram').evaluate(node => ({ width: node.clientWidth, contentWidth: node.scrollWidth }));
      if (large.contentWidth > large.width) throw new Error(`Large text overflow: ${JSON.stringify(large)}`);
      await style.evaluate(node => node.remove());
      await page.emulateMedia({ media: 'print' });
      const print = await page.locator('.diagram-title').evaluate(node => getComputedStyle(node).color);
      if (print !== 'rgb(34, 34, 34)') throw new Error(`Print title color: ${print}`);
      await page.emulateMedia({ media: 'screen' });
      console.log(JSON.stringify({ url, focus: 'visible', keyboardLink: 'pass', narrowLayout: small, enlargedText: large, printTitle: print }));
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
