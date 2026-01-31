const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://arbpay.me/#/login');
  await page.getByRole('textbox', { name: 'Please enter your phone' }).click();
  await page.getByRole('textbox', { name: 'Please enter your phone' }).fill('9911105153');
  await page.getByRole('textbox', { name: 'Please enter your login' }).click();
  await page.getByRole('textbox', { name: 'Please enter your login' }).fill('Afzal123');
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.getByText('Close').click();
  await page.getByText('Close').click();
  await page.getByText('Close').click();
  await page.getByText('Close').click();
  

  // ---------------------
  await context.close();
  await browser.close();
})();