import puppeteer from 'puppeteer';
import fs from 'fs/promises';

(async () => {
  console.log('Starting the new (slower, more reliable) scraping process...');
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const allRows = [];

  try {
    const urls = (await fs.readFile('E:\\card_crawler\\shinhan-crawler\\card_links.txt', 'utf-8')).split('\n').filter(Boolean);
    console.log(`Found ${urls.length} URLs to process.`);

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      console.log(`Processing URL ${i + 1}/${urls.length}: ${url}`);
      
      // Go to the page once to find out the card name and number of benefits
      await page.goto(url, { waitUntil: 'load' });

      // Handle potential popups by looking for a "확인" (Confirm) button and clicking it.
      try {
        // Wait a bit for any popups to load
        await new Promise(r => setTimeout(r, 500));

        // Attempt 1: Find and click "확인" button
        const confirmButtons = await page.$x("//button[contains(., '확인')] | //a[contains(., '확인')]");
        if (confirmButtons.length > 0) {
          const buttonVisible = await confirmButtons[0].isIntersectingViewport();
          if(buttonVisible) {
            console.log('  - Initial popup detected. Clicking "확인" to close it.');
            await confirmButtons[0].click();
            await new Promise(r => setTimeout(r, 500)); // Wait for popup to disappear
          }
        }

        // Attempt 2: Find and click a generic close button (e.g., 'X')
        const closeButtons = await page.$x("//button[contains(@class, 'close')] | //a[contains(@class, 'close')] | //button[contains(@class, 'btn_close')] | //a[contains(@class, 'btn_close')]");
        if (closeButtons.length > 0) {
          const buttonVisible = await closeButtons[0].isIntersectingViewport();
          if(buttonVisible) {
            console.log('  - Initial popup detected. Clicking generic close button.');
            await closeButtons[0].click();
            await new Promise(r => setTimeout(r, 500)); // Wait for popup to disappear
          }
        }

        // Attempt 3: Press Escape key as a fallback
        console.log('  - No specific popup button found. Pressing Escape key as a fallback.');
        await page.keyboard.press('Escape');
        await new Promise(r => setTimeout(r, 500)); // Wait for popup to disappear

      } catch (e) {
        console.log('  - No popup handled or an error occurred during handling. Continuing...');
      }
      const cardName = (await page.title()).trim().replace(' : 신한카드', '');
      const numButtons = (await page.$$('#benefitType1 .item button')).length;
      console.log(`  - Found ${numButtons} benefits for "${cardName}".`);

      // Loop for each benefit, reloading the page every time
      for (let j = 0; j < numButtons; j++) {
        console.log(`    - Scraping benefit ${j + 1}/${numButtons}...`);
        // Reload the page to ensure a clean state
        await page.goto(url, { waitUntil: 'load' });

        // Handle potential popups by looking for a "확인" (Confirm) button and clicking it.
        try {
          // Wait a bit for any popups to load
          await new Promise(r => setTimeout(r, 500));
          const buttons = await page.$x("//button[contains(., '확인')] | //a[contains(., '확인')]");
          if (buttons.length > 0) {
            const buttonVisible = await buttons[0].isIntersectingViewport();
            if(buttonVisible) {
              console.log('  - Initial popup detected. Clicking "확인" to close it.');
              await buttons[0].click();
              // Wait a bit for the popup to disappear.
              await new Promise(r => setTimeout(r, 500));
            }
          }
        } catch (e) {
          // No popup with "확인" button found, continue.
        }

        const buttons = await page.$('#benefitType1 .item button');
        if (buttons[j]) {
          await buttons[j].click();
          await page.waitForSelector('#popBenefitDetail', { visible: true });

          // For debugging, save the innerHTML of the popup
          try {
            const popupHtml = await page.$eval('#popBenefitDetail', el => el.innerHTML);
            const debugFileName = `debug_popup_card${i}_benefit${j}.html`;
            await fs.writeFile(`E:\\card_crawler\\shinhan-crawler\\${debugFileName}`, popupHtml);
            console.log(`    - DEBUG: Saved popup HTML to ${debugFileName}`);
          } catch (debugError) {
            console.log(`    - DEBUG: Could not save popup HTML: ${debugError.message}`);
          }

          const benefitsFromTds = await page.$eval(
            '#popBenefitDetail td.align_c + td',
            tds => tds.flatMap(td => td.textContent.split(',').map(s => s.trim()))
          ).catch(() => []);

          const benefitsFromLis = await page.$eval(
            '#popBenefitDetail ul.marker_hyphen li',
            lis => lis.flatMap(li => {
                const text = li.textContent.trim().replace(/"/g, '');
                const colonIndex = text.indexOf(':');
                let benefitsText = colonIndex !== -1 ? text.substring(colonIndex + 1) : text;
                return benefitsText.split(',').map(s => s.trim()).filter(Boolean);
            })
          ).catch(() => []);

          const benefitsInPopup = [...new Set([...benefitsFromTds, ...benefitsFromLis])];

          for (const benefit of benefitsInPopup) {
            if (benefit) {
              allRows.push(`"${cardName}","${benefit}"`);
            }
          }
          // No need to close the popup, we will reload the page
        }
      }
    }

    const csvHeader = 'Card,Benefit\n';
    const csvContent = csvHeader + allRows.join('\n');
    await fs.writeFile('E:\\card_crawler\\shinhan-crawler\\benefits.csv', csvContent);
    console.log('Successfully created benefits.csv');

  } catch (e) {
    console.error('An error occurred:', e);
  } finally {
    await browser.close();
    console.log('Scraping process finished.');
  }
})();