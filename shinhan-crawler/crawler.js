import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.shinhancard.com/pconts/html/card/credit/MOBFM281/MOBFM281R11.html', { waitUntil: 'load' });

  // Wait for the selector to ensure elements are loaded
  await page.waitForSelector('div.card_img_wrap.vertical a');

  // Correctly evaluate the elements
  const links = await page.$$eval('div.card_img_wrap.vertical a', anchors => 
    anchors.map(a => `https://www.shinhancard.com${a.getAttribute('href')}`)
  );

  console.log(links.join('\n'));

  await browser.close();
})();