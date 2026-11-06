import { shops, offers } from '../data/catalog.js';

export const normalize = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
export const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
export const money = value => new Intl.NumberFormat('es-EC', { style:'currency', currency:'USD' }).format(value);
export const shopById = id => shops.find(shop => shop.id === id);
export const offerById = id => offers.find(offer => offer.id === id);
export const shopHref = shop => `/tiendas/${shop.slug}/`;

export function matches(offer, state) {
  return (state.category === 'Todas' || offer.category === state.category)
    && (!normalize(state.query) || normalize(offer.name + ' ' + shopById(offer.shop).name).includes(normalize(state.query)));
}

export function rating(shop, ratings = {}) {
  const baseCount = shop.rating ? 10 : 0;
  const score = ratings[shop.id]?.stars;
  const reviews = baseCount + (score ? 1 : 0);
  return { score: reviews ? ((shop.rating || 0) * baseCount + (score || 0)) / reviews : 0, reviews };
}

export function isCalendarDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0,10) === value;
}

export function isNewShop(shop, now = new Date()) {
  if (!isCalendarDate(shop.startedAt)) return false;
  const start = new Date(`${shop.startedAt}T00:00:00Z`);
  if (!Number.isFinite(start.getTime())) return false;
  const until = new Date(start);
  until.setUTCDate(1);
  until.setUTCMonth(start.getUTCMonth() + 6);
  const lastDay = new Date(Date.UTC(until.getUTCFullYear(), until.getUTCMonth() + 1, 0)).getUTCDate();
  until.setUTCDate(Math.min(start.getUTCDate(), lastDay));
  const localDay = new Intl.DateTimeFormat('sv-SE', { timeZone:'America/Guayaquil', year:'numeric', month:'2-digit', day:'2-digit' }).format(now);
  const today = new Date(`${localDay}T00:00:00Z`);
  return today >= start && today < until;
}
