import './market-controls.js';
import './logo-motion.js';
import {initializePageNavigation} from './page-navigation.js';
import { createRepository } from './repository.js';
import { initialState, catalog, dollars } from './catalog.js';
import { cartItems } from './transitions.js';
import { createViews, variantsFrom } from './views.js';
import { readingControls } from '../lib/accessibility-view.js';
import { manageDialog } from '../lib/dialog.js';
import { containDialogFocus } from './modal.js';
import { money } from '../lib/market.js';
import { approvedVariants, protectedPaths } from './routes.js';
import {initializeDiscountControls} from './discount-controls.js';
const namespace = document.body.dataset.namespace || 'main-v1';
const comparison = namespace === 'proposal-review-v1';
const repository = createRepository(namespace);
const variants = comparison ? variantsFrom(location.search) : approvedVariants;
const views = createViews(variants, comparison), params = new URLSearchParams(location.search);
const path = location.pathname.endsWith('/') ? location.pathname : location.pathname + '/';
const main = document.querySelector('#main'), status = document.querySelector('#feedback');
let state = initialState(), ready = false, feedbackTimer, storageProblem = '';
function say(message) { const modalStatus=document.querySelector('#quick-dialog[open] [data-offer-feedback]');if(modalStatus){modalStatus.textContent=message;modalStatus.hidden=false;return;}status.textContent = message; status.hidden = false; clearTimeout(feedbackTimer); feedbackTimer = setTimeout(() => status.hidden = true, 6000); }
function safeNext(value) { if (!value || !value.startsWith('/') || value.startsWith('//')) return '/cuenta/'; const url = new URL(value,location.origin); return url.origin === location.origin ? url.pathname + url.search : '/cuenta/'; }
function go(destination, values = {}) { location.href = views.h(destination,values); }
function badges() { document.querySelectorAll('[data-cart-count]').forEach(badge => badge.textContent = Object.values(state.carts).reduce((sum,cart)=>sum+Object.values(cart).reduce((a,b)=>a+b,0),0)); const label = document.querySelector('[data-account-label]'); if(label) label.textContent = repository.account ? 'Mi cuenta' : 'Entrar'; const accountLink = label?.closest('a'); if(accountLink) accountLink.href = views.h(repository.account ? '/cuenta/' : '/acceso/'); }

function enableLocalForms(container) { container.querySelectorAll('[data-local-fields]').forEach(fields => fields.disabled = false); }
function render() { main.innerHTML = views.page(path,params,state,repository.account); enableLocalForms(main); initializeDiscountControls(main); badges(); updateCheckout(); restoreContext(); const title = main.querySelector('h1')?.textContent; if (title && path !== '/') document.title = `${title} | Mercado Local`; }
function restoreActionFocus(origin) { const attributes = ['data-add','data-favorite','data-quantity','data-receive','data-paid','data-order-status']; for (const name of attributes) if (origin.hasAttribute(name)) { const candidate = [...document.querySelectorAll(`button[${name}]`)].find(button => button.getAttribute(name) === origin.getAttribute(name) && (!origin.hasAttribute('data-status') || button.dataset.status === origin.dataset.status)); if (candidate) { candidate.focus(); return; } } main.querySelector('h1')?.focus({preventScroll:true}); }
async function refresh(renderPage = true) { const result = await repository.read(); state = result.state; if(renderPage)render(); else badges(); return result; }
function updateCheckout() {
  const form = document.querySelector('[data-form="draft"]'); if (!form) return;
  const mode = form.elements.mode.value, fields = form.querySelector('#delivery-fields'); fields.hidden = mode !== 'entrega'; form.elements.address.required = mode === 'entrega';
  const payment = form.elements.payment; let cash = [...payment.options].find(option => option.value === 'efectivo');
  if (mode === 'entrega' && cash) { if(payment.value === 'efectivo')payment.value='pasarela'; cash.remove(); }
  if (mode === 'retiro' && !cash) { cash = new Option('Efectivo al retirar','efectivo'); payment.add(cash); }
  const shop = catalog(state).shops.find(item => item.id === form.elements.shop.value);
  const subtotal = cartItems(state,shop.id).reduce((sum,item)=>sum+item.lineCents,0), fee = mode === 'entrega' ? shop.deliveryFees[form.elements.zone.value] : 0;
  form.querySelector('#checkout-total').textContent = `Subtotal: ${money(dollars(subtotal))}. Entrega: ${money(fee)}. Total: ${money(dollars(subtotal)+fee)}.`;
}
const draftKey = () => 'mercado-local:' + namespace + ':draft:' + (repository.account?.id || 'guest');
async function saveCheckout(form) {
  if (!ready || !repository.account) return;
  const data = Object.fromEntries(new FormData(form)), pending = JSON.stringify({ data, changedAt: crypto.randomUUID() });
  // Copia transitoria por pestaña: recupera una edición interrumpida antes del commit en SQLite.
  try { sessionStorage.setItem(draftKey(), pending); } catch {}
  try {
    const saved = await repository.mutate('draft-edit', data);
    state.drafts[data.shop] = saved.drafts[data.shop];
    try { if (sessionStorage.getItem(draftKey()) === pending) sessionStorage.removeItem(draftKey()); } catch {}
  } catch (error) { const area = form.querySelector('.form-error'); area.textContent = error.message; area.hidden = false; }
}
async function recoverPendingDraft() {
  if (!repository.account) return;
  let pending; try { pending = JSON.parse(sessionStorage.getItem(draftKey()) || 'null'); } catch {}
  if (!pending?.data || !state.carts[pending.data.shop]) return;
  await repository.mutate('draft-edit', pending.data); sessionStorage.removeItem(draftKey()); await refresh(false);
}
function restoreContext() { try { const context = JSON.parse(sessionStorage.getItem('market-local-return') || 'null'); if (context && context.path === location.pathname + location.search) { requestAnimationFrame(()=>window.scrollTo(0,context.scroll)); sessionStorage.removeItem('market-local-return'); } } catch {} }
async function fileImage(form, data) {
  const file = form.querySelector('[name="image-file"]')?.files[0]; if (!file) return;
  if (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 5*1024*1024) throw new Error('Elige una imagen JPG, PNG o WebP de hasta 5 MB.');
  const bitmap = await createImageBitmap(file); const ratio = Math.min(1,1200/Math.max(bitmap.width,bitmap.height)); const canvas = document.createElement('canvas'); canvas.width = Math.round(bitmap.width*ratio); canvas.height = Math.round(bitmap.height*ratio); canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height); bitmap.close(); data.image = canvas.toDataURL('image/webp',0.82);
}
const quick = document.querySelector('#quick-dialog'), quickModal = quick ? manageDialog(quick) : null, confirm = document.querySelector('#confirm-dialog'), confirmModal = manageDialog(confirm);
let confirmAction,selectedOfferId,ownsModalHistory=false;
function showOffer(id,record=true,providerId=id){
  const offer=catalog(state).offers.find(item=>item.id===id);if(!offer){say('Esta oferta ya no está disponible.');return;}
  const wasOpen=quick.open;selectedOfferId=id;
  quick.querySelector('[data-offer-feedback]').hidden=true;
  quick.querySelector('#quick-content').innerHTML=views.detail(offer,state,'h2',providerId);enableLocalForms(quick);
  if(record&&!wasOpen){const url=new URL(location.href);url.searchParams.set('oferta',id);history.pushState({marketOffer:id},'',url);ownsModalHistory=true;}
  quickModal.open();
}
quick.addEventListener('close',()=>{
  if(ownsModalHistory){ownsModalHistory=false;history.back();}
  else{const url=new URL(location.href);if(url.searchParams.has('oferta')){url.searchParams.delete('oferta');history.replaceState(null,'',url);}else if(path==='/oferta/')history.replaceState(null,'',views.h('/catalogo/'));}
});
window.addEventListener('popstate',event=>{
  const id=new URLSearchParams(location.search).get('oferta');ownsModalHistory=!!event.state?.marketOffer;
  if(id)showOffer(id,false);else if(quick.open){ownsModalHistory=false;quick.close();}
});
function updateServiceFields(){const form=document.querySelector('[data-form=offer]'),fields=form?.querySelector('[data-service-fields]');if(fields){const service=form.elements.kind.value==='Servicio';fields.hidden=!service;form.elements.trade.required=service;}}
document.addEventListener('submit',async event => {
  const form = event.target.closest('[data-form]'); if (!form) return;
  event.preventDefault(); if(!ready) { const error = form.querySelector('.form-error'); error.textContent = storageProblem || 'Espera a que se abra el almacenamiento local.'; error.hidden = false; error.focus(); return; } if(!form.reportValidity())return;
  const submit = form.querySelector('[type="submit"]'); if(submit.disabled)return; submit.disabled=true;
  const error = form.querySelector('.form-error'); error.hidden=true;
  try {
    const fields = new FormData(form), data = Object.fromEntries(fields), action = form.dataset.form;
    if (action === 'register' || action === 'login') { await repository[action](data); await refresh(false); const favorite = params.get('favorite'); if(favorite && !state.favorites.includes(favorite))await repository.mutate('favorite',{id:favorite}); go(safeNext(params.get('next'))); }
    else if (action === 'reset') { await repository.reset(data); form.reset(); say('Contraseña guardada. Ya puedes iniciar sesión.'); }
    else if (action === 'draft') { await repository.mutate('draft',data); go('/compra/',{shop:data.shop,paso:'revision'}); }
    else {
      if (action === 'shop') { data.deliveryModes = fields.getAll('deliveryModes'); await fileImage(form,data); }
      if (action === 'offer') { data.available = fields.has('available'); data.discountPercent=form.elements.promotion.checked?form.elements.discountPercent.value:0; await fileImage(form,data); }
      await repository.mutate(action,data);
      if (action === 'shop' || action === 'offer')go('/panel/'); else { await refresh(!quick.open); say(action === 'add' ? 'Oferta añadida al carrito de esta tienda.' : 'Cambios guardados.'); }
    }
  } catch (failure) { error.textContent=failure.message;error.hidden=false;error.focus(); }
  finally { submit.disabled=false; }
});
document.addEventListener('change',event=> {
  if(event.target.name==='kind')updateServiceFields();
  if(event.target.name === 'saved-address') { const address=state.addresses.find(item=>item.id===event.target.value);const form=event.target.form;if(address){form.elements.address.value=address.address;form.elements.zone.value=address.zone;} }
  const form = event.target.closest('[data-form="draft"]');
  if(form) { updateCheckout(); void saveCheckout(form); }
});
document.addEventListener('input', event => { const form = event.target.closest('[data-form="draft"]'); if(form) void saveCheckout(form); });
document.addEventListener('click',async event=> {
  const target = event.target.closest('a,button'); if(!target)return;
  if(target.hasAttribute('data-service-provider')){showOffer(selectedOfferId,false,target.dataset.serviceProvider);quick.querySelector('#professional-name')?.focus({preventScroll:true});return;}
  if(target.tagName==='A'&&!event.defaultPrevented&&event.button===0&&!event.metaKey&&!event.ctrlKey&&!event.shiftKey&&!event.altKey&&!target.hasAttribute('download')&&(!target.target||target.target==='_self')){
    const url=new URL(target.href,location.href);if(url.origin===location.origin&&url.pathname==='/oferta/'&&url.searchParams.get('id')){event.preventDefault();showOffer(url.searchParams.get('id'));return;}
  }
  if(target.hasAttribute('data-context'))try{sessionStorage.setItem('market-local-return',JSON.stringify({path:location.pathname+location.search,scroll:scrollY}));}catch{}
  if(target.hasAttribute('data-back')) { try { const context=JSON.parse(sessionStorage.getItem('market-local-return')||'null');if(context?.path?.startsWith('/')&&!context.path.startsWith('//'))target.href=context.path; } catch{} }
  if(target.hasAttribute('data-logout')) { repository.logout();go('/');return; }
  if(target.hasAttribute('data-quick-close')) { quick.close();return; }
  if(target.hasAttribute('data-confirm-close')) { confirm.close();return; }
  if(target.hasAttribute('data-confirm-yes')) { confirm.close();if(confirmAction)await perform(confirmAction.action,confirmAction.payload);return; }
  if(target.dataset.quick) { event.preventDefault();showOffer(target.dataset.quick);return; }
  if(target.dataset.favorite && !repository.account) { go('/acceso/',{next:location.pathname+location.search,favorite:target.dataset.favorite});return; }
  if(!ready && [...target.attributes].some(attr=>/^data-(add|favorite|quantity|remove|confirm|receive|paid|delete)/.test(attr.name))) {say('No se pudo abrir el almacenamiento. Recarga la página o permite guardar datos en este navegador.');return;}
  let action,payload;
  if(target.dataset.add){action='add';payload={id:target.dataset.add,qty:1};}
  if(target.dataset.favorite){action='favorite';payload={id:target.dataset.favorite};}
  if(target.dataset.quantity){action=Number(target.dataset.qty)<=0?'remove':'quantity';payload={id:target.dataset.quantity,qty:Number(target.dataset.qty)};}
  if(target.dataset.remove){action='remove';payload={id:target.dataset.remove};}
  if(target.dataset.receive){action='order-status';payload={id:target.dataset.receive,status:'recibido'};}
  if(target.dataset.orderStatus){action='order-status';payload={id:target.dataset.orderStatus,status:target.dataset.status};}
  if(target.dataset.paid){action='payment-status';payload={id:target.dataset.paid};}
  if(target.dataset.deleteAddress){action='delete-address';payload={id:target.dataset.deleteAddress};}
  if(target.dataset.deleteOffer){confirmAction={action:'delete-offer',payload:{id:target.dataset.deleteOffer}};confirmModal.open();return;}
  if(target.dataset.confirm){
    if(target.disabled)return;target.disabled=true;
    try{const draft=JSON.parse(target.dataset.confirmPayload || 'null');if(!draft)throw new Error('Este pedido ya se confirmó o necesita completar sus datos.');await repository.mutate('order',draft);go('/pedido/',{id:draft.id});}catch(error){say(error.message);target.disabled=false;}return;
  }
  if(action){target.disabled=true;try{await perform(action,payload);target.disabled=false;restoreActionFocus(target);}finally{target.disabled=false;}}
});
async function perform(action,payload){try{await repository.mutate(action,payload);await refresh();say(action==='add'?'Oferta añadida al carrito de esta tienda.':'Cambios guardados.');}catch(error){say(error.message);}}
async function start(){
  try{await repository.migrateLegacy();await refresh(false);await recoverPendingDraft();ready=true;}catch(error){storageProblem=error.message;document.querySelector('#storage-error').hidden=false;document.querySelector('#storage-error').textContent=error.message;}
  if(protectedPaths.includes(path)&&(!ready||!repository.account)){location.replace(views.h('/acceso/',{next:location.pathname+location.search}));return;}
  document.querySelector('#local-header').innerHTML=views.header(state,repository.account);document.querySelector('#local-footer').innerHTML=views.footer();render();
  const controls=readingControls(variants.access);if(variants.access==='A')document.querySelector('#reading-slot').innerHTML=controls.trigger;else document.querySelector('#reading-controls').innerHTML=controls.trigger;
  document.querySelector('#reading-dialog').innerHTML=controls.dialog;await import('../scripts/accessibility.js');
  document.querySelectorAll('dialog').forEach(containDialogFocus);
  document.documentElement.classList.remove('no-js');document.body.dataset.ready='true';
  updateServiceFields();
  const initialOffer=params.get('oferta')||(path==='/oferta/'?params.get('id'):null);if(initialOffer)showOffer(initialOffer,false);
  repository.onChange(async()=>{try{const editing=!!document.activeElement?.closest('form');await refresh(!editing);if(editing)say('Los datos de tu cuenta se actualizaron en otra pestaña.');}catch(error){say(error.message);}});
  // Shared repository exposed for the browser regression suite; no SQL or server API.
  window.marketLocal={repository,get state(){return state;},refresh,variants};
}
initializePageNavigation();
start().catch(error=>say(error.message));
