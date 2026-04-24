const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

  const info = await page.evaluate(() => {
    const root = document.querySelector('.ald-home-robot-bg');
    const scene = document.querySelector('.ald-home-robot-bg__scene');
    const canvas = document.querySelector('.ald-home-robot-bg__canvas');
    const nodes = scene ? Array.from(scene.querySelectorAll('*')).slice(0, 20).map((el) => ({
      tag: el.tagName,
      className: el.className,
      id: el.id,
    })) : [];

    return {
      rootExists: !!root,
      sceneExists: !!scene,
      canvasExists: !!canvas,
      sceneHtml: scene ? scene.innerHTML.slice(0, 2000) : null,
      nodes,
    };
  });

  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})();
