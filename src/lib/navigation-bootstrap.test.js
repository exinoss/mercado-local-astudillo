import {test,expect} from 'bun:test';
import {runInNewContext} from 'node:vm';
import {bootstrapPageNavigation} from './navigation-bootstrap.js';

function navigation({record,reduced=false}={}){
  let now=1000,sequence=0,skips=0;
  const timers=new Map(),listeners=new Map(),storage=new Map();
  const root={dataset:{},setAttribute(){},removeAttribute(){}};
  const window={onpagereveal:null,addEventListener(name,callback){listeners.set(name,callback);},dispatchEvent(event){listeners.get(event.type)?.(event);}};
  const key='mercado-local:boat-transition-v1';
  if(record!==null)storage.set(key,JSON.stringify(record??{to:'/catalogo/',time:now}));
  const context={window,document:{documentElement:root},location:{origin:'https://local.invalid',href:'https://local.invalid/catalogo/'},URL,Event,Date:{now:()=>now},matchMedia:()=>({matches:reduced}),localStorage:{getItem:()=>null},sessionStorage:{getItem:key=>storage.get(key)??null,removeItem:key=>storage.delete(key)},setTimeout(callback,delay){const id=++sequence;timers.set(id,{callback,at:now+delay});return id;},clearTimeout:id=>timers.delete(id)};
  runInNewContext(`(${bootstrapPageNavigation.toString()})('settings',()=>({reducedMotion:false}))`,context);
  return {root,storage,window,get skips(){return skips;},get timerCount(){return timers.size;},advance(ms){const target=now+ms;while(true){const next=[...timers].filter(([,timer])=>timer.at<=target).sort((a,b)=>a[1].at-b[1].at)[0];if(!next)break;now=next[1].at;timers.delete(next[0]);next[1].callback();}now=target;},reveal(){const transition={ready:Promise.resolve(),finished:new Promise(()=>{}),skipTransition(){skips++;}};window.dispatchEvent({type:'pagereveal',viewTransition:transition});}};
}

test('La espera de revelado sustituye el plazo inicial sin cancelar prematuramente la transición',()=>{
  const page=navigation();
  expect(page.root.dataset.transitionPhase).toBe('waiting');
  page.advance(2000);page.reveal();
  expect(page.timerCount).toBe(1);
  page.advance(2500);
  expect(page.root.dataset.transitionPhase).toBe('waiting');
  expect(page.skips).toBe(0);
  page.advance(2000);
  expect(page.skips).toBe(1);
  expect(page.root.dataset.transitionPhase).toBeUndefined();
  expect(page.timerCount).toBe(0);
});

test('Sin petición válida o con movimiento reducido se conserva la navegación sin bloqueo',()=>{
  for(const options of [{record:null},{record:{to:'https://otro.invalid/',time:1000}},{record:{to:'/catalogo/',time:-100000}},{reduced:true}]){
    const page=navigation(options);page.reveal();
    expect(page.root.dataset.transitionPhase).toBeUndefined();
    expect(page.timerCount).toBe(0);
    expect(page.storage.size).toBe(0);
    expect(page.skips).toBe(1);
  }
});
