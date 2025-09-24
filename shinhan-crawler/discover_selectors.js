import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto('https://www.shinhancard.com/pconts/html/card/apply/credit/1232369_2207.html', { waitUntil: 'load' });
    const htmlContent = await page.content();
    console.log(htmlContent);
  } catch (e) {
    console.error(e);
  } finally {
    await browser.close();
  }
})();