import {test,expect} from 'bun:test';
import {createViews} from './views.js';
import {initialState} from './catalog.js';

test('El título y la descripción de tienda se representan como texto, sin ejecutar HTML',()=>{
  const views=createViews(undefined,false),payload='<img src=x onerror="alert(1)">';
  const state=initialState();state.shops=[{id:'local',name:payload,description:payload,address:payload,hours:'9 a 18',delivery:'Retiro'}];
  const html=views.page('/tiendas/ver/',new URLSearchParams('id=local'),state);
  expect(html).not.toContain('<img src=x');expect(html).not.toContain('onerror="alert');
  expect(html).toContain('&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');
});
