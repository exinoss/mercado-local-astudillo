import {test,expect} from 'bun:test';
import {phoneNumber,serviceProviders} from './services.js';
import {initialState,catalog,pruneCarts} from '../local/catalog.js';
import {transition,cartItems} from '../local/transitions.js';
import {renderServiceDirectory} from '../local/service-view.js';

test('contacts accept local/international numbers and reject links or text',()=>{
  expect(phoneNumber('099 123 4567')).toBe('593991234567');
  expect(phoneNumber('+593 (99) 123-4567')).toBe('593991234567');
  expect(phoneNumber('00593991234567')).toBe('593991234567');
  for(const value of ['javascript:alert(1)','https://wa.me/123','contacto@example.test','',null])expect(phoneNumber(value)).toBe('');
});
test('service directory groups the profession, keeps providers distinct and consolidates activities',()=>{
  const data={shops:[{id:'a',name:'Uno'},{id:'b',name:'Dos'}],offers:[{id:'1',shop:'a',kind:'Servicio',trade:'Plomería'},{id:'2',shop:'a',kind:'Servicio',trade:'plomeria'},{id:'3',shop:'b',kind:'Servicio',trade:'Plomería'},{id:'4',shop:'b',kind:'Servicio',trade:'Electricidad'}]};
  const result=serviceProviders(data.offers[0],data);expect(result.length).toBe(2);expect(result[0].offers.length).toBe(2);expect(result[1].offerId).toBe('3');
});
test('services cannot enter the cart through add, migration, quantity or checkout',()=>{
  expect(()=>transition(initialState(),'add',{id:'visita-plomero'},false)).toThrow('Contacta');
  let state=initialState();state.carts={'plomeria-local':{'visita-plomero':2},tecno:{telefono:1}};state.drafts={'plomeria-local':{id:'old-draft'}};state.orders=[{id:'historical',items:[{id:'visita-plomero',priceCents:1500}]}];
  const orders=structuredClone(state.orders);expect(pruneCarts(state)).toBe(true);expect(state.carts).toEqual({tecno:{telefono:1}});expect(state.drafts).toEqual({});expect(state.orders).toEqual(orders);
  state=transition(state,'migrate',{carts:{'plomeria-local':{'visita-plomero':1}}},false);expect(state.carts['plomeria-local']).toBeUndefined();expect(cartItems(state,'plomeria-local')).toEqual([]);
  expect(()=>transition(state,'quantity',{id:'visita-plomero',qty:2})).toThrow();expect(()=>transition(state,'draft',{shop:'plomeria-local',mode:'retiro',payment:'pasarela'})).toThrow();
});
test('published services preserve profession, activities and validated contact without changing orders',()=>{
  let state=transition(initialState(),'shop',{name:'Mi negocio',category:'Hogar',description:'Servicios',address:'Centro',hours:'9 a 18',startedAt:'2026-10-09',deliveryModes:['retiro'],centro:1,urbana:2});
  const payload={shop:state.shops[0].id,name:'Visita técnica',kind:'Servicio',category:'Hogar',description:'Revisión',price:12,trade:'Plomería',professional:'Profesional de prueba',activities:'Revisión de fugas\nMantenimiento',phone:'0991234567',whatsapp:'+593991234567'};
  state=transition(state,'offer',payload);const offer=catalog(state).offers.at(-1);expect(offer.activities).toEqual(['Revisión de fugas','Mantenimiento']);expect(offer.phone).toBe('593991234567');expect(offer.whatsapp).toBe('593991234567');
  expect(serviceProviders(offer,catalog(state)).length).toBe(2);expect(()=>transition(state,'offer',{...payload,phone:'javascript:bad'})).toThrow('teléfono');
  state=transition(state,'offer',{...payload,id:offer.id,kind:'Producto'});state=transition(state,'add',{id:offer.id});expect(cartItems(state,payload.shop).length).toBe(1);
  state=transition(state,'offer',{...payload,id:offer.id});expect(state.carts[payload.shop]).toBeUndefined();
  state=transition(state,'offer',{...payload,name:'Visita ampliada',description:'Descripción de la visita ampliada',price:22});const second=state.offers.at(-1);
  expect(renderServiceDirectory(offer,state,path=>path,second.id)).toContain('Descripción de la visita ampliada');
});
