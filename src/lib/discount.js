export function discountQuote(basePrice,percent){
  const raw=String(basePrice).trim().replace(',','.');
  if(!/^\d+(?:\.\d{1,2})?$/.test(raw)||Number(raw)>1000000)throw Error('Escribe un precio entre 0 y 1.000.000 con hasta dos decimales.');
  const percentage=String(percent).trim().replace(',','.');
  if(!/^\d+(?:\.\d{1,8})?$/.test(percentage)||Number(percentage)>100)throw Error('Escribe un porcentaje entre 0 y 100, con hasta ocho decimales.');
  const baseCents=Math.round(Number(raw)*100),discountPercent=Number(percentage);
  const totalCents=Math.round(baseCents*(100-discountPercent)/100);
  return {baseCents,totalCents,savingCents:baseCents-totalCents,discountPercent};
}

export function discountForOffer(offer={}){
  if(offer.price==null)return {basePrice:'',discountPercent:0};
  const basePrice=offer.old>offer.price?offer.old:offer.price;
  if(offer.discountPercent!=null){
    try{const quote=discountQuote(basePrice,offer.discountPercent);if(quote.totalCents===Math.round(offer.price*100))return {basePrice,discountPercent:quote.discountPercent};}catch{}
  }
  // Eight decimals recover legacy price/old pairs within half a cent even at the maximum price.
  const discountPercent=basePrice>offer.price?Number(((basePrice-offer.price)/basePrice*100).toFixed(8)):0;
  return {basePrice,discountPercent};
}
