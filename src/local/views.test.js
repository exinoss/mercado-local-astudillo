import {test,expect} from 'bun:test';
import {createViews} from './views.js';
import {initialState,seedShops} from './catalog.js';
import {money,isNewShop} from '../lib/market.js';
import {transition} from './transitions.js';

test('La portada muestra primero los dos comercios aprobados y enlaza al listado sin el filtro de emprendimientos nuevos',()=>{
  const state=initialState(),views=createViews(undefined,false);
  const home=views.page('/',new URLSearchParams(),state);
  const section=home.match(/<section[^>]* id="nuevos">([\s\S]*?)<\/section>/)[1];
  const cards=[...section.matchAll(/<article class="venture-card">([\s\S]*?)<\/article>/g)].map(match=>match[1]);
  for(const [index,id,name] of [[0,'tecnomovil','Tecnomovil'],[1,'variedades-aristi','Variedades Aristi']]){
    const shop=seedShops.find(shop=>shop.id===id);
    expect(cards[index]).toContain(`Visitar ${name}`);
    expect(cards[index]).toContain(`href="/tiendas/${shop.slug}/"`);
    expect(cards[index]).toContain(shop.image);
    expect(shop.startedAt).toBeUndefined();
    expect(isNewShop(shop)).toBe(false);
  }
  expect(section).toContain('href="/comercios/">Ver todos los comercios');
  expect(section).not.toContain('nuevos=si');
  const all=views.page('/comercios/',new URLSearchParams(),state);
  expect(all).toContain('Visitar Tecnomovil');
  expect(all).toContain('Visitar Variedades Aristi');
});

test('Un comercio aparece por la categoría de sus productos disponibles y conserva su categoría propia',()=>{
  const state=initialState(),views=createViews(undefined,false);
  state.shops=[{id:'variedad',name:'Variedad de prueba',category:'Hogar',description:'Ropa y hogar'}];
  state.offers=[{id:'prenda',shop:'variedad',name:'Prenda',category:'Moda',kind:'Producto',price:12,available:true}];
  const find=category=>views.page('/comercios/',new URLSearchParams({categoria:category,q:'Variedad de prueba'}),state);
  expect(find('Moda')).toContain('1 comercio encontrado');
  expect(find('Hogar')).toContain('1 comercio encontrado');
  expect(find('Tecnología')).toContain('0 comercios encontrados');
  state.offers[0].available=false;
  expect(find('Moda')).toContain('0 comercios encontrados');
  expect(find('Hogar')).toContain('1 comercio encontrado');
});

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

test('La revisión de compra y el pedido muestran el método de pago con su nombre visible, no con el código interno',()=>{
  const views=createViews(undefined,false),account={id:'cuenta',name:'Prueba',email:'prueba@example.test'};
  let state=transition(initialState(),'add',{id:'tecnomovil-cable-usb-v8'});
  state=transition(state,'draft',{shop:'tecnomovil',mode:'retiro',payment:'efectivo',zone:'centro',address:'',notes:''});
  expect(views.page('/compra/',new URLSearchParams('shop=tecnomovil&paso=revision'),state,account)).toContain('Método: Efectivo al retirar');
  const draft=state.drafts.tecnomovil;state=transition(state,'order',{...draft});
  const order=views.page('/pedido/',new URLSearchParams({id:draft.id}),state,account);
  expect(order).toContain('Efectivo al retirar · Pago pendiente');
  expect(order).not.toMatch(/>efectivo ·/);
});

test('Los identificadores guardados se escapan en atributos de acciones',()=>{
  const views=createViews(undefined,false),state=initialState(),id='x" onclick="alert(1)';
  state.addresses=[{id,label:'Casa',address:'Calle 1',zone:'centro'}];
  const html=views.page('/direcciones/',new URLSearchParams(),state,{id:'cuenta',email:'prueba@example.test'});
  expect(html).not.toContain('onclick="alert');expect(html).toContain('data-delete-address="x&quot; onclick=&quot;alert(1)"');
});

test('Crear una tienda no propone una fecha de inicio inventada y el carrito anuncia su cantidad',()=>{
  const views=createViews(undefined,false),account={id:'cuenta',email:'prueba@example.test'};
  const form=views.page('/mi-tienda/',new URLSearchParams(),initialState(),account);
  expect(form).toContain('name="startedAt" type="date" value="" required');
  const state=transition(initialState(),'add',{id:'freidora',qty:2});
  expect(views.header(state,null)).toContain('aria-label="Mis carritos: 2 productos"');
  expect(views.header(initialState(),null)).toContain('aria-label="Mis carritos: 0 productos"');
});
