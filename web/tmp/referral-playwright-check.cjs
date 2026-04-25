const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });

  if (!page.url().includes('/login')) {
    await page.goto('http://127.0.0.1:5173/login', {
      waitUntil: 'networkidle',
    });
  }

  await page.getByPlaceholder(/用户名|username/i).fill('ALD');
  await page.getByPlaceholder(/密码|password/i).fill('Ald@2026!Temp');
  await page.getByRole('button', { name: /登录|login/i }).click();
  await page.waitForLoadState('networkidle');
  console.log('LOGIN_URL=' + page.url());

  await page.goto('http://127.0.0.1:5173/console/referralcenter', {
    waitUntil: 'networkidle',
  });
  console.log('USER_REFERRAL_URL=' + page.url());

  await page.goto('http://127.0.0.1:5173/console/referralmanage', {
    waitUntil: 'networkidle',
  });
  console.log('ADMIN_REFERRAL_URL=' + page.url());

  await browser.close();
})();
