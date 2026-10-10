import { shops as originalShops, offers as originalOffers, categories, heroSlides } from '../data/catalog.js';
export { categories, heroSlides };
export const seedShops = originalShops.map(shop => ({ ...shop, address: 'Zona urbana de San Lorenzo', hours: 'Lunes a sábado, 08:00–18:00', contact: '', image: '/images/' + shop.image, deliveryModes: shop.delivery.includes('domicilio') ? ['retiro', 'entrega'] : ['retiro'] }));
export const seedOffers = originalOffers.map(offer => ({ ...offer, image: offer.image ? '/images/' + offer.image : '', available: true }));
export function catalog(state) { return { shops: [...seedShops, ...(state.shops || [])], offers: [...seedOffers, ...(state.offers || [])].filter(offer => offer.available !== false) }; }
export function initialState() { return { carts: {}, favorites: [], shops: [], offers: [], orders: [], ratings: {}, addresses: [], drafts: {}, profile: {} }; }
export const cents = value => Math.round(Number(value) * 100);
export const dollars = value => value / 100;
