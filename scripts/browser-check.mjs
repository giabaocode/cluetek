/** Optional real-browser QA. Set PLAYWRIGHT_MODULE_PATH to a local Playwright install. */
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const site=process.env.PREVIEW_URL||'http://127.0.0.1:4173/';
const reportDir=fileURLToPath(new URL('../docs/qa/',import.meta.url));
await mkdir(reportDir,{recursive:true});
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1440,height:960},reducedMotion:'reduce'});
const page=await context.newPage();
const errors=[],failed=[],checks=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.url().startsWith(site)&&r.status()>=400)failed.push(`${r.status()} ${r.url()}`);});
const pass=label=>{checks.push(label);console.log('PASS',label);};
try{
 await page.goto(site,{waitUntil:'networkidle'});
 await page.waitForFunction(()=>document.body.dataset.ready==='true');
 await page.waitForFunction(()=>document.querySelector('#speed-result')?.textContent==='12.5');
 assert.equal(await page.locator('.learn-card').count(),6);
 await page.screenshot({path:reportDir+'hero-desktop.png'});
 pass('Home page loads with real assets and six initial explanations');

 await page.locator('[data-filter=hardware]').click();
 assert.equal(await page.locator('.learn-card').count(),6);
 assert.ok((await page.locator('.learn-card').first().textContent()).includes('USB-C'));
 await page.locator('#load-more').click();
 assert.equal(await page.locator('.learn-card').count(),10);
 pass('Category filters and pagination');
 await page.locator('[data-filter=all]').click();
 await page.locator('#library-search').fill('OLED');
 assert.equal(await page.locator('.learn-card').count(),1);
 await page.locator('#library-search').fill('this-topic-does-not-exist');
 assert.ok(await page.locator('#empty-state').isVisible());
 await page.locator('#clear-filters').click();
 assert.equal(await page.locator('.learn-card').count(),6);
 pass('Library search, empty state and reset');

 await page.locator('[data-save=CT001]').click();
 await page.locator('[data-filter=saved]').click();
 assert.equal(await page.locator('.learn-card').count(),1);
 await page.reload({waitUntil:'networkidle'});
 await page.waitForFunction(()=>document.body.dataset.ready==='true');
 assert.equal(await page.locator('[data-save=CT001]').getAttribute('aria-pressed'),'true');
 await page.locator('[data-filter=saved]').click();
 assert.equal(await page.locator('.learn-card').count(),1);
 pass('Bookmarks persist across reloads');

 await page.locator('.search-open').click();
 await page.locator('#global-search').fill('DNS');
 assert.ok((await page.locator('#search-results').textContent()).includes('website'));
 assert.ok(await page.locator('#search-dialog').isVisible());
 await page.keyboard.press('Escape');
 await page.locator('#search-dialog').waitFor({state:'hidden'});
 assert.ok(!(await page.locator('#search-dialog').isVisible()));
 assert.equal(await page.evaluate(()=>document.activeElement?.classList.contains('search-open')),true);
 pass('Global search, Escape dismissal and focus restoration');

 await page.locator('[data-speed="1000"]').click();
 assert.equal(await page.locator('#speed-result').textContent(),'125');
 await page.locator('[data-speed="300"]').click();
 assert.equal(await page.locator('#speed-result').textContent(),'37.5');
 await page.locator('#speed-range').fill('8');
 await page.locator('#speed-range').dispatchEvent('input');
 assert.equal(await page.locator('#speed-result').textContent(),'1');
 pass('Mbps to MB/s conversion: presets and range input');

 await page.locator('#internet-switch').uncheck();
 assert.ok((await page.locator('#connection-state').textContent()).includes('full bars'));
 assert.ok(await page.locator('#internet-wire').evaluate(el=>el.classList.contains('off')));
 await page.locator('#wifi-switch').uncheck();
 assert.ok((await page.locator('#connection-state').textContent()).includes('Both links are down'));
 await page.locator('#internet-switch').check();
 assert.ok((await page.locator('#connection-state').textContent()).includes('no Wi-Fi'));
 await page.locator('#wifi-switch').check();
 assert.ok((await page.locator('#connection-state').textContent()).includes('Both links work'));
 pass('Network experiment: all four connection states');

 await page.locator('[data-video=CT006]').click();
 await page.waitForFunction(()=>document.querySelector('#video-player').readyState>=2);
 const before=await page.locator('#video-player').evaluate(v=>v.currentTime);
 await page.waitForFunction(t=>document.querySelector('#video-player').currentTime>t+.1,before);
 assert.ok(await page.locator('#video-dialog').isVisible());
 await page.keyboard.press('Escape');
 await page.waitForFunction(()=>document.querySelector('#video-player').paused);
 assert.equal(await page.locator('#video-player').evaluate(v=>v.paused),true);
 await page.locator('#all-films').click();assert.equal(await page.locator('.reel-card').count(),10);
 pass('Real MP4 playback, pause on close, all ten films');

 await page.goto(new URL('learn/wifi-vs-internet/',site).href,{waitUntil:'networkidle'});
 assert.ok((await page.locator('h1').textContent()).includes('Wi-Fi'));
 assert.ok(await page.locator('.article-gallery img').count()>0);
 assert.ok(await page.locator('.source-section a').count()>=2);
 assert.equal(await page.locator('[data-save=CT001]').getAttribute('aria-pressed'),'true');
 await page.locator('.language-switch').click();
 assert.equal(await page.locator('html').getAttribute('lang'),'vi');
 assert.ok((await page.locator('h1').textContent()).includes('đầy vạch'));
 await page.screenshot({path:reportDir+'article-vietnamese.png',fullPage:true});
 pass('Article pages, real infographics, source references and bilingual routing');

 for(const width of [320,375,390,768,1024,1440]){
  await page.setViewportSize({width,height:900});
  for(const path of ['','vi/','learn/usb-c-capabilities/','vi/learn/wifi-vs-internet/']){
   await page.goto(new URL(path,site).href,{waitUntil:'networkidle'});
   const sizes=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,view:innerWidth}));
   assert.ok(sizes.scroll<=sizes.view+1,`Overflow ${width}px ${path}: ${sizes.scroll}`);
  }
 }
 pass('No horizontal overflow on home/article pages at 320, 375, 390, 768, 1024, 1440px');

 await page.setViewportSize({width:390,height:844});
 await page.goto(new URL('vi/',site).href,{waitUntil:'networkidle'});
 await page.screenshot({path:reportDir+'hero-vietnamese.png'});
 await page.locator('.menu-toggle').click();
 assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');
 await page.locator('#mobile-nav a').first().click();
 assert.ok(!(await page.locator('#mobile-nav').isVisible()));
 pass('Mobile navigation opens and closes after selecting a destination');

 await page.goto(new URL('cluetek-ecosystem/',site).href,{waitUntil:'networkidle'});
 await page.locator('.learn-card h3 a').first().click();
 assert.ok(page.url().includes('/cluetek-ecosystem/learn/'));
 await page.locator('.language-switch').click();
 assert.ok(page.url().includes('/cluetek-ecosystem/vi/learn/'));
 assert.equal(await page.locator('html').getAttribute('lang'),'vi');
 pass('GitHub Pages repository-subpath navigation and language switch');

 await page.goto(site,{waitUntil:'networkidle'});
 await page.locator('[data-info=privacy]').click();
 await page.locator('#clear-storage').click();
 assert.ok((await page.locator('#info-status').textContent()).includes('cleared'));
 await page.keyboard.press('Escape');
 assert.equal(await page.locator('[data-save=CT001]').getAttribute('aria-pressed'),'false');
 pass('Privacy dialog clears saved preferences');
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
 pass('No browser JavaScript errors or failed site resources');
 await writeFile(reportDir+'browser-results.json',JSON.stringify({date:'2026-10-14',engine:'Chromium',status:'passed',checks,errors,failedResources:failed},null,2)+'\n');
 console.log(`${checks.length} browser checks passed.`);
}finally{await browser.close();}
