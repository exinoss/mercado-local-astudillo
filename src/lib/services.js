import {normalize} from './market.js';

export function phoneNumber(value=''){
  const text=String(value).trim();if(!/^[+\d\s().-]+$/.test(text))return '';
  let digits=text.replace(/\D/g,'');
  if(digits.startsWith('00'))digits=digits.slice(2);
  if(/^0\d{8,9}$/.test(digits))digits='593'+digits.slice(1);
  return /^[1-9]\d{7,14}$/.test(digits)?digits:'';
}
export const serviceGroup=offer=>offer.trade?.trim()||offer.name;
export function serviceProviders(offer,data){
  const key=normalize(serviceGroup(offer)),providers=new Map();
  for(const item of data.offers){
    if(item.kind!=='Servicio'||normalize(serviceGroup(item))!==key)continue;
    const shop=data.shops.find(shop=>shop.id===item.shop);if(!shop)continue;
    const name=item.professional?.trim()||shop.name,id=shop.id+':'+normalize(name);
    if(!providers.has(id))providers.set(id,{id,offerId:item.id,name,shop,offers:[]});
    providers.get(id).offers.push(item);
  }
  return [...providers.values()];
}
