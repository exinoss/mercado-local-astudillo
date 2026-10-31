import {catalog} from './catalog.js';
import {escapeHtml as e,money} from '../lib/market.js';
import {phoneNumber,serviceGroup,serviceProviders} from '../lib/services.js';

export function renderServiceDirectory(offer,state,h,selectedId=offer.id){
  const providers=serviceProviders(offer,catalog(state));
  const selected=providers.find(provider=>provider.offers.some(item=>item.id===selectedId))||providers[0];
  if(!selected)return '<h2 id="quick-title">Este servicio ya no está disponible</h2>';
  const active=selected.offers.find(item=>item.id===selectedId)||selected.offers[0];
  const phone=phoneNumber(active.phone||selected.offers.find(item=>item.phone)?.phone||selected.shop.contact);
  const whatsapp=phoneNumber(active.whatsapp||selected.offers.find(item=>item.whatsapp)?.whatsapp);
  const activities=[...new Set(selected.offers.flatMap(item=>(item.activities?.length?item.activities:[item.name]).filter(Boolean)))];
  const store=selected.shop,storeURL=store.slug?h(`/tiendas/${store.slug}/`):h('/tiendas/ver/',{id:store.id});
  return `<h2 id="quick-title">${e(serviceGroup(offer))} en San Lorenzo</h2><p>Elige un profesional para conocer sus actividades y cómo contactarlo.</p><div class="service-directory"><section aria-labelledby="professionals-title"><h3 id="professionals-title">Profesionales disponibles (${providers.length})</h3><ul class="professional-list">${providers.map(provider=>`<li><button type="button" class="professional-choice" data-service-provider="${e(provider.offerId)}" aria-pressed="${provider.id===selected.id}"><strong>${e(provider.name)}</strong><span>${e(provider.shop.name)}</span></button></li>`).join('')}</ul></section><section class="professional-profile" aria-labelledby="professional-name"><h3 id="professional-name" tabindex="-1">${e(selected.name)}</h3><p>${e(active.description)}</p><h4 class="font-bold">Actividades que realiza</h4><ul class="list-disc pl-5">${activities.map(activity=>`<li>${e(activity)}</li>`).join('')}</ul><p><strong>Horario:</strong> ${e(store.hours)}</p><p><strong>Ubicación:</strong> ${e(store.address)}</p><p><strong>Precio publicado:</strong> ${money(active.price)}</p><div class="professional-contact">${whatsapp?`<a class="button" href="https://wa.me/${whatsapp}?text=${encodeURIComponent('Hola, me interesa tu servicio de '+serviceGroup(offer)+' en Mercado Local.')}" target="_blank" rel="noopener">Contactar por WhatsApp<span class="sr-only">, abre otra pestaña</span></a>`:''}${phone?`<a class="button secondary" href="tel:+${phone}">Llamar al +${phone}</a>`:''}${!phone&&!whatsapp?`<p>${store.contact?e(store.contact):'Este profesional aún no ha publicado su contacto.'}</p>`:''}</div><a class="section-link" href="${e(storeURL)}">Ver tienda de ${e(store.name)}</a></section></div>`;
}
