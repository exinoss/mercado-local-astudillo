import {test,expect} from 'bun:test';
import {createViews} from './views.js';
import {initialState} from './catalog.js';
import {money} from '../lib/market.js';

test('El título y la descripción de tienda se representan como texto, sin ejecutar HTML',()=>{
  const views=createViews(undefined,false),payload='<img src=x onerror="alert(1)">';
  const state=initialState();state.shops=[{id:'local',name:payload,description:payload,address:payload,hours:'9 a 18',delivery:'Retiro'}];
  const html=views.page('/tiendas/ver/',new URLSearchParams('id=local'),state);
  expect(html).not.toContain('<img src=x');expect(html).not.toContain('onerror="alert');
  expect(html).toContain('&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');
});

test('El formulario compartido de productos/promociones utiliza precio base y el selector A simplificado',()=>{
  const state=initialState();state.shops=[{id:'local',name:'Mi tienda',category:'Hogar'}];
  const views=createViews(undefined,false),account={name:'Comerciante',email:'local@example.test'};
  const html=views.page('/editar-oferta/',new URLSearchParams(),state,account);
  expect(html).toContain('name="basePrice"');expect(html).toContain('name="discountPercent"');
  expect(html).toContain('offer-editor-page');
  expect(html).toContain('aria-controls="offer-discount-panel"');
  expect(html).toContain('data-discount-panel hidden');
  expect(html).toContain('data-discount-fields disabled hidden');
  expect(html).not.toContain('data-discount-off');
  expect(html).not.toContain('name="old"');expect(html).not.toContain('Precio anterior');
  expect(html).not.toContain('fine-toggle');expect(html).not.toContain('data-step');
  for(const value of [10,20,30])expect(html).toContain(`data-discount-preset="${value}"`);
  expect(html).toContain('data-discount-range type="range" min="0" max="100" step="1"');
  expect(views.page('/editar-oferta/',new URLSearchParams(),state,null)).not.toContain('name="basePrice"');
});

test('Editar una promoción anterior muestra la base, el descuento recuperado y el precio final guardado',()=>{
  const state=initialState();state.shops=[{id:'local',name:'Mi tienda',category:'Hogar'}];
  state.offers=[{id:'oferta',shop:'local',name:'Mesa',category:'Hogar',description:'Madera',kind:'Producto',price:25,old:35}];
  const html=createViews(undefined,false).page('/editar-oferta/',new URLSearchParams('id=oferta'),state,{name:'Comerciante'});
  expect(html).toContain('value="35"');expect(html).toContain('value="28.57142857"');
  expect(html).toContain(`data-discount-final>${money(25)}</strong>`);
  expect(html).toContain('name="promotion" type="checkbox" aria-controls="offer-discount-panel" checked');
  expect(html).not.toContain('data-discount-panel hidden');
  expect(html).not.toContain('data-discount-fields disabled');
});
