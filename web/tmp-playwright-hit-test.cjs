const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

  const result = await page.evaluate(() => {
    const points = [
      { label: 'left', x: 40, y: 220 },
      { label: 'center', x: window.innerWidth / 2, y: 220 },
      { label: 'right', x: window.innerWidth - 40, y: 220 },
    ];

    return points.map((point) => ({
      ...point,
      stack: document.elementsFromPoint(point.x, point.y).slice(0, 8).map((el) => ({
        tag: el.tagName,
        className: el.className,
      })),
    }));
  });

  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})();
