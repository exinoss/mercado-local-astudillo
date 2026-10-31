// Serialized into head; keep dependencies explicit so it runs before the first paint.
export function bootstrapPageNavigation(settingsKey,normalizeSettings){
  const root=document.documentElement;
  const route=value=>{try{const url=new URL(value,location.origin);return url.origin===location.origin?url.pathname+url.search:null;}catch{return null;}};
  const state=window.marketPageNavigation={key:'mercado-local:boat-transition-v1',route,pending:null,savedMotion:false,watchdog:null,transition:null,departing:false};
  const forget=()=>{state.pending=null;try{sessionStorage.removeItem(state.key);}catch{}};
  state.clear=()=>{clearTimeout(state.watchdog);delete root.dataset.transitionPhase;root.removeAttribute('aria-busy');if(!state.departing)forget();};
  try{state.savedMotion=normalizeSettings(JSON.parse(localStorage.getItem(settingsKey))).reducedMotion;}catch{}
  const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches||(root.dataset.motion?root.dataset.motion==='reduced':state.savedMotion);
  const valid=record=>{const age=Date.now()-record?.time;return record&&typeof record.to==='string'&&typeof record.time==='number'&&age>=0&&age<=10000&&route(record.to)!==null;};
  const matches=(record,value)=>{const url=new URL(value,location.origin),next=url.searchParams.get('next');return valid(record)&&(route(record.to)===route(url.href)||url.pathname==='/acceso/'&&next&&route(next)===route(record.to));};
  window.addEventListener('pageswap',event=>{
    state.departing=true;
    if(!event.viewTransition)return;
    event.viewTransition.ready.catch(()=>{});
    let requested;try{requested=JSON.parse(sessionStorage.getItem(state.key));}catch{}
    if(!valid(requested)||reduced()||event.activation?.entry?.url&&!matches(requested,event.activation.entry.url))event.viewTransition.skipTransition();
  });
  window.addEventListener('pagereveal',event=>{
    state.departing=false;state.transition=event.viewTransition;
    event.viewTransition?.ready.catch(()=>{});
    if(!state.pending||reduced()||!event.viewTransition){event.viewTransition?.skipTransition();state.clear();return;}
    state.watchdog=setTimeout(()=>{event.viewTransition.skipTransition();state.clear();},4500);
    event.viewTransition.finished.then(state.clear,state.clear);
    window.dispatchEvent(new Event('market-page-reveal'));
  });
  let record;try{record=JSON.parse(sessionStorage.getItem(state.key));}catch{}
  if(!matches(record,location.href)||reduced()||!('onpagereveal' in window)){forget();return;}
  state.pending=record;root.dataset.transitionPhase='waiting';root.setAttribute('aria-busy','true');
  state.watchdog=setTimeout(state.clear,4500);
}
