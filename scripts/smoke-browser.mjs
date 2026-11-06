// Optional real-browser checks. Use an existing Playwright installation; no runtime dependency.
import {writeFile,mkdir} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {isAbsolute} from 'node:path';
const moduleName=process.env.MARKET_PLAYWRIGHT_MODULE||'playwright-core';
const {chromium}=await import(isAbsolute(moduleName)?pathToFileURL(moduleName).href:moduleName);
const base=process.env.MARKET_TEST_URL||'http://localhost:4321';
const out=process.env.MARKET_TEST_OUTPUT||'test-results/browser';
const checks=[],errors=[],browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext({reducedMotion:'reduce',viewport:{width:1440,height:1000}});
context.on('page',page=>{
  page.on('pageerror',error=>errors.push(error.message));
  page.on('response',response=>{if(response.status()>=400&&response.url().startsWith(base))errors.push(`HTTP ${response.status()}: ${new URL(response.url()).pathname}`);});
});
const check=(name,pass)=>{checks.push({name,pass:!!pass});if(!pass)throw Error(name);};
async function ready(page){await page.locator('body[data-ready=true]').waitFor();}
async function go(page,path){await page.goto(base+path);await ready(page);}
try{
  const page=await context.newPage(),mail=`audit-${Date.now()}@example.test`,password='PruebaLocal2026';
  await go(page,'/registro/');await page.locator('#name').fill('Prueba aislada');await page.locator('#email').fill(mail);await page.locator('#password').fill(password);await page.locator('[data-form=register] [type=submit]').click();await page.waitForURL('**/cuenta/');await ready(page);
  await go(page,'/mi-tienda/');
  const attack='<img src=x onerror="window.auditInjected=true">';
  for(const [name,value] of Object.entries({name:'Tienda aislada',description:attack,address:'Centro',hours:'9 a 18',startedAt:'2026-10-30'}))await page.locator('#'+name).fill(value);
  await page.locator('#category').selectOption('Hogar');await page.locator('[data-form=shop] [type=submit]').click();await page.waitForURL('**/panel/');await ready(page);
  const ids=await page.evaluate(async()=>{const {repository}=marketLocal;let {state}=await repository.read();const shop=state.shops[0].id;state=await repository.mutate('offer',{shop,name:'Silla de prueba',description:'Madera',category:'Hogar',price:10.25});return {shop,offer:state.offers[0].id};});
  await go(page,'/tiendas/ver/?id='+ids.shop);
  check('Descripción de tienda como texto, sin HTML ejecutable',await page.locator('#main').textContent().then(text=>text.includes(attack))&&await page.locator('#main img[src=x]').count()===0&&!await page.evaluate(()=>window.auditInjected));
  const second=await context.newPage();await go(second,'/acceso/');await second.locator('#email').fill(mail);await second.locator('#password').fill(password);await second.locator('[data-form=login] [type=submit]').click();await second.waitForURL('**/cuenta/');await ready(second);
  await Promise.all([page,second].map(tab=>tab.evaluate(async id=>{for(let i=0;i<15;i++)await marketLocal.repository.mutate('add',{id});},ids.offer)));
  check('Dos Workers conservan 30 añadidos concurrentes',await page.evaluate(async ids=>(await marketLocal.repository.read()).state.carts[ids.shop][ids.offer]===30,ids));
  await go(page,'/compra/?shop='+ids.shop);await page.locator('#payment').selectOption('deuna');await page.locator('[data-form=draft] [type=submit]').click();await page.waitForURL('**/compra/?*paso=revision*');await ready(page);
  check('Revisión visible antes de confirmar',await page.locator('[data-confirm]').isVisible());
  // Freeze the previously displayed button. A second tab's change must never confirm that quote.
  const reviewed=await page.locator('[data-confirm]').getAttribute('data-confirm-payload');
  await second.evaluate(async()=>{const {repository}=marketLocal,{state}=await repository.read();await repository.mutate('offer',{...state.offers[0],price:20});});
  check('El Worker rechaza el importe antiguo',await page.evaluate(async payload=>{try{await marketLocal.repository.mutate('order',JSON.parse(payload));return false;}catch(error){return error.message.includes('Tu compra ha cambiado');}},reviewed));
  await page.reload();await ready(page);check('La vista exige revisar los nuevos importes',await page.locator('[data-confirm]').count()===0&&await page.locator('#main').textContent().then(text=>text.includes('Tu compra ha cambiado')));
  await page.locator('#main a[href^="/compra/"]').click();await ready(page);await page.locator('[data-form=draft] [type=submit]').click();await page.waitForURL('**/compra/?*paso=revision*');await ready(page);
  await page.locator('[data-confirm]').click();await page.waitForURL('**/pedido/?id=*');await ready(page);
  check('Confirmar guarda una sola compra con el total revisado',await page.evaluate(async()=>{const {state}=await marketLocal.repository.read();return state.orders.length===1&&state.orders[0].totalCents===60000&&state.orders[0].paymentStatus==='pendiente';}));
  await page.reload();await ready(page);check('El pedido persiste tras recargar',await page.locator('#main').textContent().then(text=>text.includes('Pedido de Tienda aislada')));
  await page.evaluate(async id=>marketLocal.repository.mutate('add',{id}),ids.offer);
  await second.evaluate(async()=>{const {repository}=marketLocal,{state}=await repository.read();await repository.mutate('offer',{...state.offers[0],available:false});});
  await go(page,'/carritos/');check('Producto retirado desaparece del carrito y contador',await page.locator('#main').textContent().then(text=>text.includes('Tus carritos están vacíos'))&&await page.locator('[data-cart-count]').textContent()==='0');
  check('Sin errores JavaScript',errors.length===0);
}catch(error){checks.push({name:'Excepción',pass:false,details:error.stack});}
finally{await browser.close();await mkdir(out,{recursive:true});await writeFile(out+'/checks.json',JSON.stringify({checks,errors},null,2));}
console.log(JSON.stringify({total:checks.length,failed:checks.filter(check=>!check.pass)},null,2));if(checks.some(check=>!check.pass))process.exitCode=1;
