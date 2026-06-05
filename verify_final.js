const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + process.cwd() + '/index.html');
  await page.setViewportSize({ width: 1280, height: 1000 });

  // Verify LEOFARME section
  await page.click('a[href="#leofarme"]');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'verify_leofarme.png' });

  // Verify Services price range in UI
  await page.click('a[href="#services"]');
  await page.waitForTimeout(500);
  // Click on a service to see price
  await page.click('[data-service="facebook"]');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'verify_services_price.png' });

  // Check music control visibility
  const musicControl = await page.$('#musicToggle');
  if (musicControl) {
    console.log('Music control found');
  } else {
    console.log('Music control NOT found');
  }

  await browser.close();
})();
