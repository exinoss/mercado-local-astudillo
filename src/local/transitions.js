import { catalog, cents, dollars, initialState, categories } from './catalog.js';
const text = (value, max = 350) => String(value || '').trim().slice(0, max);
const required = (value, label, max) => { const result = text(value, max); if (!result) throw new Error(`Completa ${label}.`); return result; };
const price = value => { const result = Number(value); if (!Number.isFinite(result) || result < 0 || result > 1000000) throw new Error('Introduce un precio válido.'); return dollars(cents(result)); };
function validImage(value) { const result = String(value || '').trim(); if (result.length > 3000000) throw new Error('La imagen es demasiado grande. Elige una fotografía más pequeña.'); if (result && !/^\/images\/[\w./-]+$/.test(result) && !/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(result)) throw new Error('Elige una imagen JPG, PNG o WebP.'); return result; }
function quantity(value) { const result = Number(value); if (!Number.isInteger(result) || result < 1 || result > 99) throw new Error('La cantidad debe estar entre 1 y 99.'); return result; }
export function cartItems(state, shopId) {
  const data = catalog(state);
  return Object.entries(state.carts[shopId] || {}).map(([id, qty]) => { const offer = data.offers.find(item => item.id === id && item.shop === shopId); return offer ? { ...offer, qty, lineCents: cents(offer.price) * qty } : null; }).filter(Boolean);
}
export function transition(previous, action, payload = {}, authenticated = true) {
  const state = structuredClone(previous || initialState());
  if (!authenticated && !['add', 'quantity', 'remove', 'migrate'].includes(action)) throw new Error('Entra a tu cuenta para continuar.');
  const data = catalog(state);
  const offer = id => { const item = data.offers.find(item => item.id === id); if (!item) throw new Error('Esta oferta ya no está disponible.'); return item; };
  const shop = id => { const item = data.shops.find(item => item.id === id); if (!item) throw new Error('No encontramos esta tienda.'); return item; };
  const ownerShop = id => { const item = state.shops.find(item => item.id === id); if (!item) throw new Error('Esta tienda no pertenece a tu cuenta.'); return item; };
  if (action === 'add') { const item = offer(payload.id); const cart = state.carts[item.shop] ||= {}; cart[item.id] = Math.min(99, (cart[item.id] || 0) + quantity(payload.qty || 1)); }
  else if (action === 'quantity') { const item = offer(payload.id); if (!state.carts[item.shop]?.[item.id]) throw new Error('La oferta no está en el carrito.'); state.carts[item.shop][item.id] = quantity(payload.qty); }
  else if (action === 'remove') { const item = offer(payload.id); delete state.carts[item.shop]?.[item.id]; if (!Object.keys(state.carts[item.shop] || {}).length) delete state.carts[item.shop]; }
  else if (action === 'favorite') { offer(payload.id); state.favorites = state.favorites.includes(payload.id) ? state.favorites.filter(id => id !== payload.id) : [...state.favorites, payload.id]; }
  else if (action === 'profile') state.profile = { name: required(payload.name, 'tu nombre', 80), phone: text(payload.phone, 40) };
  else if (action === 'address') { const address = { id: payload.id || crypto.randomUUID(), label: required(payload.label, 'el nombre de la dirección', 60), address: required(payload.address, 'la dirección', 160), zone: payload.zone === 'urbana' ? 'urbana' : 'centro' }; state.addresses = [...state.addresses.filter(item => item.id !== address.id), address]; }
  else if (action === 'delete-address') state.addresses = state.addresses.filter(item => item.id !== payload.id);
  else if (action === 'shop') {
    const existing = state.shops[0]; if (payload.id && existing?.id !== payload.id) throw new Error('No puedes modificar esta tienda.');
    const modes = ['retiro', 'entrega'].filter(mode => payload.deliveryModes?.includes(mode)); if (!modes.length) throw new Error('Elige retiro, entrega o ambas modalidades.');
    if (!categories.includes(payload.category) || payload.category === 'Todas') throw new Error('Elige una categoría.');
    const item = { id: existing?.id || crypto.randomUUID(), name: required(payload.name, 'el nombre de la tienda', 90), category: payload.category, description: required(payload.description, 'la descripción', 350), address: required(payload.address, 'la dirección', 160), hours: required(payload.hours, 'el horario', 100), contact: text(payload.contact, 80), startedAt: payload.startedAt, image: validImage(payload.image || existing?.image), deliveryModes: modes, delivery: modes.length === 2 ? 'Retiro y entrega a domicilio' : modes[0] === 'entrega' ? 'Entrega a domicilio' : 'Retiro en el local', deliveryFees: { centro: price(payload.centro), urbana: price(payload.urbana) } };
    if (!/^\d{4}-\d{2}-\d{2}$/.test(item.startedAt || '') || !Number.isFinite(Date.parse(item.startedAt))) throw new Error('Indica la fecha de inicio de actividad.');
    state.shops = [item];
  } else if (action === 'offer') {
    ownerShop(payload.shop); if (payload.id && !state.offers.some(item => item.id === payload.id)) throw new Error('No puedes editar esta oferta.');
    if (!categories.includes(payload.category) || payload.category === 'Todas') throw new Error('Elige una categoría.');
    const item = { id: payload.id || crypto.randomUUID(), shop: payload.shop, name: required(payload.name, 'el nombre de la oferta', 100), category: payload.category, description: required(payload.description, 'la descripción', 350), price: price(payload.price), kind: payload.kind === 'Servicio' ? 'Servicio' : 'Producto', image: validImage(payload.image), icon: payload.kind === 'Servicio' ? 'tools' : 'shop', available: payload.available !== false };
    if (payload.old !== '' && payload.old != null) { item.old = price(payload.old); if (item.old <= item.price) throw new Error('El precio anterior debe ser mayor que el actual.'); }
    state.offers = [...state.offers.filter(entry => entry.id !== item.id), item];
  } else if (action === 'delete-offer') {
    if (!state.offers.some(item => item.id === payload.id)) throw new Error('Esta oferta no pertenece a tu cuenta.');
    state.offers = state.offers.filter(item => item.id !== payload.id); state.favorites = state.favorites.filter(id => id !== payload.id);
    for (const id of Object.keys(state.carts)) { delete state.carts[id][payload.id]; if (!Object.keys(state.carts[id]).length) delete state.carts[id]; }
  } else if (action === 'draft-edit') {
    const store = shop(payload.shop);
    if (!cartItems(state, store.id).length) throw new Error('El carrito de esta tienda está vacío.');
    const mode = store.deliveryModes.includes(payload.mode) ? payload.mode : store.deliveryModes[0];
    const allowed = mode === 'retiro' ? ['pasarela', 'deuna', 'transferencia', 'efectivo'] : ['pasarela', 'deuna', 'transferencia'];
    state.drafts[store.id] = {
      id: payload.id || state.drafts[store.id]?.id || crypto.randomUUID(), shop: store.id,
      mode, payment: allowed.includes(payload.payment) ? payload.payment : 'pasarela',
      zone: payload.zone === 'urbana' ? 'urbana' : 'centro',
      address: text(payload.address, 160), notes: text(payload.notes, 160),
    };
  } else if (action === 'draft' || action === 'order') {
    const store = shop(payload.shop), items = cartItems(state, store.id); const existing = state.orders.find(item => item.id === payload.id);
    if (action === 'order' && existing) return state;
    if (!items.length) throw new Error('El carrito de esta tienda está vacío.');
    const mode = payload.mode; if (!store.deliveryModes.includes(mode)) throw new Error('Esta modalidad no está disponible.');
    const allowed = mode === 'retiro' ? ['pasarela', 'deuna', 'transferencia', 'efectivo'] : ['pasarela', 'deuna', 'transferencia'];
    if (!allowed.includes(payload.payment)) throw new Error('Elige un método de pago disponible.');
    const draft = { id: payload.id || state.drafts[store.id]?.id || crypto.randomUUID(), shop: store.id, mode, payment: payload.payment, zone: payload.zone === 'urbana' ? 'urbana' : 'centro', address: mode === 'entrega' ? required(payload.address, 'la dirección de entrega', 160) : '', notes: text(payload.notes, 160) };
    state.drafts[store.id] = draft;
    if (action === 'order') {
      const feeCents = mode === 'entrega' ? cents(store.deliveryFees[draft.zone]) : 0;
      state.orders.unshift({ ...draft, shopName: store.name, items: items.map(item => ({ id: item.id, name: item.name, priceCents: cents(item.price), qty: item.qty })), feeCents, totalCents: items.reduce((sum, item) => sum + item.lineCents, feeCents), status: 'confirmado', paymentStatus: draft.payment === 'pasarela' ? 'pagado' : 'pendiente', createdAt: new Date().toISOString() });
      delete state.carts[store.id]; delete state.drafts[store.id];
    }
  } else if (action === 'order-status') {
    const order = state.orders.find(item => item.id === payload.id); if (!order) throw new Error('No encontramos este pedido.');
    if (payload.status === 'recibido') { if (order.status === 'cancelado') throw new Error('El pedido está cancelado.'); order.status = 'recibido'; }
    else { ownerShop(order.shop); if (!['preparando', 'entregado', 'cancelado'].includes(payload.status) || order.status === 'recibido' || order.status === 'cancelado') throw new Error('No puedes cambiar este estado.'); order.status = payload.status; }
  } else if (action === 'payment-status') { const order = state.orders.find(item => item.id === payload.id); if (!order) throw new Error('No encontramos este pedido.'); ownerShop(order.shop); if (order.status === 'cancelado') throw new Error('El pedido está cancelado.'); order.paymentStatus = 'pagado'; }
  else if (action === 'rating') {
    if (!state.orders.some(item => item.shop === payload.shop && item.status === 'recibido')) throw new Error('Marca un pedido de esta tienda como recibido para valorarla.');
    const stars = Number(payload.stars); if (!Number.isInteger(stars) || stars < 1 || stars > 5) throw new Error('Elige de 1 a 5 estrellas.');
    state.ratings[payload.shop] = { stars, comment: text(payload.comment) };
  } else if (action === 'migrate') {
    for (const [store, cart] of Object.entries(payload.carts || {})) for (const [id, qty] of Object.entries(cart || {})) if (data.offers.some(item => item.id === id && item.shop === store) && Number.isInteger(qty) && qty > 0 && qty <= 99) (state.carts[store] ||= {})[id] = Math.min(99, (state.carts[store]?.[id] || 0) + qty);
  } else throw new Error('Esta acción no está disponible.');
  return state;
}
