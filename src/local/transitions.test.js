import { test, expect } from 'bun:test';
import { initialState } from './catalog.js';
import { transition, cartItems } from './transitions.js';
test('Cantidades, conservación de otros carritos y precios en centavos', () => {
  let state=transition(initialState(),'add',{id:'telefono',qty:99},false);state=transition(state,'add',{id:'telefono',qty:2},false);
  expect(state.carts.tecno.telefono).toBe(99);expect(()=>transition(state,'quantity',{id:'telefono',qty:100})).toThrow();
  state=transition(state,'add',{id:'taladro',qty:1});state=transition(state,'draft',{id:'pedido-1',shop:'tecno',mode:'entrega',zone:'centro',address:'Calle central',payment:'pasarela'});
  const payload=state.drafts.tecno;state=transition(state,'order',payload);expect(state.orders[0].totalCents).toBe(39900*99+150);expect(state.carts.tecno).toBeUndefined();expect(state.carts.ferreteria.taladro).toBe(1);
  state=transition(state,'order',payload);expect(state.orders.length).toBe(1);expect(state.orders[0].items[0].priceCents).toBe(39900);
});
test('Restricciones de acceso, ofertas y valoraciones',()=>{
  expect(()=>transition(initialState(),'favorite',{id:'telefono'},false)).toThrow();
  expect(()=>transition(initialState(),'add',{id:'ausente'})).toThrow();
  expect(()=>transition(initialState(),'rating',{shop:'tecno',stars:5})).toThrow();
  let state=transition(initialState(),'add',{id:'telefono'});state=transition(state,'order',{id:'pedido-2',shop:'tecno',mode:'retiro',payment:'deuna'});
  expect(state.orders[0].paymentStatus).toBe('pendiente');state=transition(state,'order-status',{id:'pedido-2',status:'recibido'});state=transition(state,'rating',{shop:'tecno',stars:4});state=transition(state,'rating',{shop:'tecno',stars:2});expect(Object.keys(state.ratings).length).toBe(1);expect(state.ratings.tecno.stars).toBe(2);
  expect(()=>transition(state,'payment-status',{id:'pedido-2'})).toThrow();
});
test('Tienda propia, promoción, retirada de oferta y pedido conservado',()=>{
  let state=transition(initialState(),'shop',{name:'Mi negocio',category:'Hogar',description:'Comercio local',address:'Centro',hours:'9 a 18',startedAt:'2026-10-09',deliveryModes:['retiro'],centro:1,urbana:2});const shop=state.shops[0];
  state=transition(state,'offer',{shop:shop.id,name:'Silla',category:'Hogar',description:'Silla de madera',price:10.25,old:12,image:'',available:true});const offer=state.offers[0];state=transition(state,'add',{id:offer.id,qty:2});expect(cartItems(state,shop.id)[0].lineCents).toBe(2050);
  state=transition(state,'order',{id:'pedido-3',shop:shop.id,mode:'retiro',payment:'efectivo'});state=transition(state,'payment-status',{id:'pedido-3'});state=transition(state,'order-status',{id:'pedido-3',status:'entregado'});state=transition(state,'delete-offer',{id:offer.id});expect(state.orders[0].items[0].name).toBe('Silla');expect(state.orders[0].paymentStatus).toBe('pagado');expect(state.offers.length).toBe(0);
  expect(()=>transition(state,'offer',{shop:'tecno',name:'Incorrecta'})).toThrow();expect(()=>transition(state,'shop',{...shop,id:'otro'})).toThrow();
});
test('Entrega exige dirección; no admite efectivo ni modalidades inexistentes',()=>{
  let state=transition(initialState(),'add',{id:'telefono'});
  expect(()=>transition(state,'draft',{shop:'tecno',mode:'entrega',payment:'deuna'})).toThrow();expect(()=>transition(state,'draft',{shop:'tecno',mode:'entrega',payment:'efectivo',address:'Centro'})).toThrow();
  state=transition(state,'add',{id:'taladro'});expect(()=>transition(state,'draft',{shop:'ferreteria',mode:'entrega',payment:'pasarela',address:'Centro'})).toThrow();
});
test('Importación anterior valida referencias y combina cantidades',()=>{
  let state=transition(initialState(),'add',{id:'telefono',qty:2},false);state=transition(state,'migrate',{carts:{tecno:{telefono:3,taladro:4,ausente:1},ferreteria:{taladro:-1}}},false);expect(state.carts.tecno).toEqual({telefono:5});expect(state.carts.ferreteria).toBeUndefined();
});

test('Borrador parcial persistente sin permitir una compra incompleta',()=>{
  let state=transition(initialState(),'add',{id:'telefono'});
  state=transition(state,'draft-edit',{shop:'tecno',mode:'entrega',payment:'deuna',address:'',notes:'Tocar el timbre'});
  expect(state.drafts.tecno.notes).toBe('Tocar el timbre');
  expect(()=>transition(state,'order',state.drafts.tecno)).toThrow();
  const id=state.drafts.tecno.id;
  state=transition(state,'draft-edit',{...state.drafts.tecno,address:'Calle principal'});
  expect(state.drafts.tecno.id).toBe(id);
  state=transition(state,'order',state.drafts.tecno);
  expect(state.orders[0].address).toBe('Calle principal');
  expect(()=>transition(initialState(),'draft-edit',{shop:'tecno'},false)).toThrow();
});
