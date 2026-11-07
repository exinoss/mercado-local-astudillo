import { test, expect } from 'bun:test';
import { initialState } from './catalog.js';
import { transition, cartItems } from './transitions.js';
import {discountForOffer} from '../lib/discount.js';
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
  let state=transition(initialState(),'add',{id:'telefono'});state=transition(state,'draft',{id:'pedido-2',shop:'tecno',mode:'retiro',payment:'deuna'});state=transition(state,'order',state.drafts.tecno);
  expect(state.orders[0].paymentStatus).toBe('pendiente');state=transition(state,'order-status',{id:'pedido-2',status:'recibido'});state=transition(state,'rating',{shop:'tecno',stars:4});state=transition(state,'rating',{shop:'tecno',stars:2});expect(Object.keys(state.ratings).length).toBe(1);expect(state.ratings.tecno.stars).toBe(2);
  expect(()=>transition(state,'payment-status',{id:'pedido-2'})).toThrow();
});
test('Tienda propia, promoción, retirada de oferta y pedido conservado',()=>{
  let state=transition(initialState(),'shop',{name:'Mi negocio',category:'Hogar',description:'Comercio local',address:'Centro',hours:'9 a 18',startedAt:'2026-10-09',deliveryModes:['retiro'],centro:1,urbana:2});const shop=state.shops[0];
  state=transition(state,'offer',{shop:shop.id,name:'Silla',category:'Hogar',description:'Silla de madera',price:10.25,old:12,image:'',available:true});const offer=state.offers[0];state=transition(state,'add',{id:offer.id,qty:2});expect(cartItems(state,shop.id)[0].lineCents).toBe(2050);
  state=transition(state,'draft',{id:'pedido-3',shop:shop.id,mode:'retiro',payment:'efectivo'});state=transition(state,'order',state.drafts[shop.id]);state=transition(state,'payment-status',{id:'pedido-3'});state=transition(state,'order-status',{id:'pedido-3',status:'entregado'});state=transition(state,'delete-offer',{id:offer.id});expect(state.orders[0].items[0].name).toBe('Silla');expect(state.orders[0].paymentStatus).toBe('pagado');expect(state.offers.length).toBe(0);
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
  state=transition(state,'draft',state.drafts.tecno);
  state=transition(state,'order',state.drafts.tecno);
  expect(state.orders[0].address).toBe('Calle principal');
  expect(()=>transition(initialState(),'draft-edit',{shop:'tecno'},false)).toThrow();
});

const ownShop = () => transition(initialState(),'shop',{name:'Local',category:'Hogar',description:'Local',address:'Centro',hours:'9 a 18',startedAt:'2026-10-30',deliveryModes:['retiro','entrega'],centro:1.5,urbana:2.5});
function reviewedCart() {
  let state=ownShop();const shop=state.shops[0].id;
  state=transition(state,'offer',{shop,name:'Silla',category:'Hogar',description:'Madera',price:10.25});
  state=transition(state,'add',{id:state.offers[0].id,qty:2});
  return transition(state,'draft',{shop,mode:'entrega',zone:'centro',address:'Centro',payment:'deuna'});
}

test('La confirmación exige la revisión exacta: precio, tarifa, cantidad y datos',()=>{
  const original=reviewedCart(),shop=original.shops[0].id,payload=original.drafts[shop];
  for(const change of [state=>{state.offers[0].price=20;},state=>{state.shops[0].deliveryFees.centro=3;},state=>{state.carts[shop][state.offers[0].id]=3;}]){
    const state=structuredClone(original);change(state);
    expect(()=>transition(state,'order',payload)).toThrow('Tu compra ha cambiado');
    expect(state.orders).toHaveLength(0);
    const reviewed=transition(state,'draft',payload),ordered=transition(reviewed,'order',reviewed.drafts[shop]);
    expect(ordered.orders[0].totalCents).toBe(reviewed.drafts[shop].quote.totalCents);
  }
  let edited=transition(original,'draft-edit',{...payload,address:'Otra calle'});
  expect(()=>transition(edited,'order',payload)).toThrow('Tu compra ha cambiado');
  edited=transition(edited,'draft',edited.drafts[shop]);
  expect(()=>transition(edited,'order',payload)).toThrow('Tu compra ha cambiado');
  expect(()=>transition(original,'order',{...payload,quote:{...payload.quote,totalCents:1}})).toThrow();
  const ordered=transition(original,'order',payload);
  expect(ordered.orders[0].totalCents).toBe(2200);
  expect(transition(ordered,'order',payload).orders).toHaveLength(1);
  expect(original.orders).toHaveLength(0);
});

test('Retirar un producto limpia su carrito y borrador; conserva pedidos históricos',()=>{
  const original=reviewedCart(),shop=original.shops[0].id,offer=original.offers[0];
  original.orders=[{id:'historico',items:[{id:offer.id,qty:2}],totalCents:2200}];
  const state=transition(original,'offer',{...offer,available:false});
  expect(state.carts[shop]).toBeUndefined();expect(state.drafts[shop]).toBeUndefined();
  expect(state.orders).toEqual(original.orders);
  const stale=structuredClone(original);stale.offers[0].available=false;
  expect(()=>transition(stale,'order',original.drafts[shop])).toThrow();
});

test('No acepta cero, fechas inexistentes ni cantidades importadas inválidas',()=>{
  expect(()=>transition(initialState(),'add',{id:'telefono',qty:0})).toThrow();
  const state=ownShop(),shop=state.shops[0];
  for(const startedAt of ['2026-02-31','2026-02-29','2026-13-01','no-fecha'])expect(()=>transition(state,'shop',{...shop,centro:1,urbana:2,startedAt})).toThrow();
  expect(transition(state,'shop',{...shop,centro:1,urbana:2,startedAt:'2024-02-29'}).shops[0].startedAt).toBe('2024-02-29');
});

test('Publicar con porcentaje calcula el precio en el dominio y conserva pedidos históricos',()=>{
  let state=ownShop();const shop=state.shops[0].id;
  state=transition(state,'offer',{shop,name:'Mesa',description:'Madera',category:'Hogar',basePrice:'25.00',discountPercent:'20',price:0.01,old:1000});
  const item=state.offers[0];expect(item.price).toBe(20);expect(item.old).toBe(25);expect(item.discountPercent).toBe(20);
  state=transition(state,'add',{id:item.id,qty:2});
  state=transition(state,'draft',{shop,mode:'retiro',payment:'deuna'});
  state=transition(state,'order',state.drafts[shop]);
  expect(state.orders[0].totalCents).toBe(4000);
  state=transition(state,'offer',{...item,basePrice:100,discountPercent:50});
  expect(state.offers[0].price).toBe(50);expect(state.orders[0].items[0].priceCents).toBe(2000);
});

test('Editar y retirar descuentos mantiene compatibilidad con promociones anteriores',()=>{
  let state=ownShop();const shop=state.shops[0].id;
  state=transition(state,'offer',{shop,name:'Mesa',description:'Madera',category:'Hogar',price:25,old:35});
  let item=state.offers[0];state=transition(state,'offer',{...item,...discountForOffer(item),name:'Mesa editada'});
  item=state.offers[0];expect(item.price).toBe(25);expect(item.old).toBe(35);
  state=transition(state,'offer',{...item,basePrice:35,discountPercent:0});
  expect(state.offers[0].price).toBe(35);expect(state.offers[0].old).toBeUndefined();
  state=transition(state,'offer',{...item,basePrice:35,discountPercent:100});
  expect(state.offers[0].price).toBe(0);expect(state.offers[0].old).toBe(35);
});

test('Rechaza porcentajes inválidos sin mutar datos y conserva descuentos menores a un centavo',()=>{
  const state=ownShop(),payload={shop:state.shops[0].id,name:'Artículo',description:'Local',category:'Hogar',basePrice:25};
  for(const discountPercent of ['',-1,101,'1.000000001'])expect(()=>transition(state,'offer',{...payload,discountPercent})).toThrow();
  expect(()=>transition(state,'offer',{...payload,discountPercent:20},false)).toThrow();expect(state.offers).toHaveLength(0);
  const updated=transition(state,'offer',{...payload,basePrice:'0.05',discountPercent:10});
  expect(updated.offers[0].old).toBeUndefined();expect(discountForOffer(updated.offers[0]).discountPercent).toBe(10);
});
