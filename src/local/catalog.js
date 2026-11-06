import { shops as originalShops, offers as originalOffers, categories, heroSlides } from '../data/catalog.js';
export { categories, heroSlides };
export const seedShops = originalShops.map(shop => ({ ...shop, address: shop.address ?? 'Zona urbana de San Lorenzo', hours: shop.hours ?? 'Lunes a sábado, 08:00–18:00', contact: shop.contact ?? '', image: shop.image ? '/images/' + shop.image : '', deliveryModes: shop.deliveryModes ?? (shop.delivery.includes('domicilio') ? ['retiro', 'entrega'] : ['retiro']) }));
export const seedOffers = originalOffers.map(offer => ({ ...offer, image: offer.image ? '/images/' + offer.image : '', available: offer.available !== false }));
export function catalog(state) { return { shops: [...seedShops, ...(state.shops || [])], offers: [...seedOffers, ...(state.offers || [])].filter(offer => offer.available !== false) }; }
export function initialState() { return { carts: {}, favorites: [], shops: [], offers: [], orders: [], ratings: {}, addresses: [], drafts: {}, profile: {} }; }
export function pruneCarts(state){
  const data=catalog(state), products=new Map(data.offers.filter(offer=>offer.kind==='Producto').map(offer=>[offer.id,offer.shop]));let changed=false;
  for(const [shop,cart] of Object.entries(state.carts||{})){
    for(const [id,qty] of Object.entries(cart))if(products.get(id)!==shop||!Number.isInteger(qty)||qty<1||qty>99){delete cart[id];changed=true;}
    if(!Object.keys(cart).length){delete state.carts[shop];delete state.drafts?.[shop];changed=true;}
  }
  return changed;
}
export const cents = value => Math.round(Number(value) * 100);
export const dollars = value => value / 100;
