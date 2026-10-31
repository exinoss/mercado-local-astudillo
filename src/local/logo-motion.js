import animationUrl from '../assets/logo-mercado-local.min.json?url';
import {logoPoster} from '../lib/animated-logo.js';
import {normalizeReadingSettings,readingSettingsKey} from '../lib/reading-settings.js';

const root=document.documentElement,systemMotion=matchMedia('(prefers-reduced-motion: reduce)'),entries=new Map(),pauseKey='mercado-local:logo-paused-v1';
let paused=false,savedMotion=false,lastReduced;
try{paused=sessionStorage.getItem(pauseKey)==='true';savedMotion=normalizeReadingSettings(JSON.parse(localStorage.getItem(readingSettingsKey))).reducedMotion;}catch{}
const reduced=()=>systemMotion.matches||(root.dataset.motion?root.dataset.motion==='reduced':savedMotion);
lastReduced=reduced();
const playerReady=new Promise((resolve,reject)=>{
  const ready=()=>window.lottie?resolve(window.lottie):reject(new Error('Reproductor no disponible'));
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
});
playerReady.catch(()=>{});
let data;
const logoData=()=>data??=fetch(animationUrl).then(response=>{if(!response.ok)throw new Error('Logo no disponible');return response.json();});
function controls(){
  document.querySelectorAll('[data-logo-pause]').forEach(button=>{
    button.disabled=reduced();button.textContent=reduced()?'Logos sin movimiento':paused?'Reanudar logos':'Pausar logos';
    button.setAttribute('aria-pressed',String(paused));
    button.setAttribute('aria-label',reduced()?'Logos sin animación por la preferencia de movimiento reducido':paused?'Reanudar animaciones de los logos':'Pausar animaciones de los logos');
  });
}
function poster(host){const image=document.createElement('img');image.src=logoPoster;image.width=240;image.height=288;image.alt='';host.replaceChildren(image);return image;}
function sync(entry){
  if(!entry.ready)return;
  const play=!paused&&!reduced()&&!document.hidden&&entry.visible&&!entry.host.closest('[hidden]');
  if(play){
    if(entry.phase==='ready'){
      entry.phase='entrada';entry.instance.loop=false;entry.image.hidden=true;entry.player.style.visibility='visible';entry.instance.playSegments(entry.entrada,true);
    }else entry.instance.play();
  }else entry.instance.pause();
  entry.host.dataset.logoPhase=entry.phase;entry.host.dataset.logoPlaying=String(!entry.instance.isPaused);
}
const visibility=new IntersectionObserver(items=>{for(const item of items){const entry=entries.get(item.target);if(entry){entry.visible=item.isIntersecting;sync(entry);}}},{threshold:.01});
async function mount(host){
  const entry={host,image:poster(host),phase:'loading',ready:false,visible:false,disposed:false};entries.set(host,entry);host.dataset.logoPhase='loading';host.dataset.logoPlaying='false';visibility.observe(host);
  if(reduced()){entry.phase='fijo';host.dataset.logoPhase='fijo';return;}
  try{
    const [original,lottie]=await Promise.all([logoData(),playerReady]);if(entry.disposed||!host.isConnected||reduced())return;
    const entrada=original.markers.find(marker=>marker.cm==='entrada'),bucle=original.markers.find(marker=>marker.cm==='bucle');if(!entrada||!bucle)throw new Error('Marcadores no disponibles');
    entry.entrada=[entrada.tm,entrada.tm+entrada.dr];entry.bucle=[bucle.tm,bucle.tm+bucle.dr];
    const player=entry.player=document.createElement('span');player.className='json-logo-player';player.setAttribute('aria-hidden','true');player.style.visibility='hidden';host.append(player);
    const instance=entry.instance=lottie.loadAnimation({container:player,renderer:'svg',loop:false,autoplay:false,animationData:structuredClone(original),rendererSettings:{preserveAspectRatio:'xMidYMid meet'}});
    function loaded(){if(entry.disposed||entry.ready)return;entry.ready=true;entry.phase='ready';const svg=player.querySelector('svg');svg?.setAttribute('aria-hidden','true');svg?.setAttribute('focusable','false');sync(entry);}
    instance.addEventListener('DOMLoaded',loaded);if(instance.isLoaded)loaded();
    instance.addEventListener('complete',()=>{if(entry.disposed||entry.phase!=='entrada')return;entry.phase='bucle';instance.loop=true;instance.playSegments(entry.bucle,true);sync(entry);});
  }catch{
    if(entry.disposed)return;entry.phase='fijo';host.dataset.logoPhase='fijo';entry.instance?.destroy();poster(host);
  }
}
function dispose(entry){entry.disposed=true;visibility.unobserve(entry.host);entry.instance?.destroy();entries.delete(entry.host);}
function mountAll(){
  if(document.body.dataset.ready!=='true')return;
  for(const entry of entries.values())if(!entry.host.isConnected)dispose(entry);
  for(const host of document.querySelectorAll('[data-animated-logo]'))if(!entries.has(host))mount(host);
  controls();
}
document.addEventListener('click',event=>{
  if(!event.target.closest('[data-logo-pause]')||reduced())return;
  paused=!paused;try{sessionStorage.setItem(pauseKey,String(paused));}catch{}
  for(const entry of entries.values())sync(entry);controls();
});
new MutationObserver(mountAll).observe(document.body,{attributes:true,attributeFilter:['data-ready']});
for(const selector of ['#local-header','#main'])new MutationObserver(mountAll).observe(document.querySelector(selector),{childList:true});
new MutationObserver(controls).observe(document.querySelector('#reading-dialog'),{childList:true});
window.addEventListener('market-motion-reset',()=>{paused=false;try{sessionStorage.removeItem(pauseKey);}catch{}for(const entry of entries.values())sync(entry);controls();});
function preferenceChanged(){const value=reduced();if(value!==lastReduced){lastReduced=value;for(const entry of [...entries.values()])dispose(entry);mountAll();}controls();}
new MutationObserver(preferenceChanged).observe(root,{attributes:true,attributeFilter:['data-motion']});systemMotion.addEventListener('change',preferenceChanged);
document.addEventListener('visibilitychange',()=>{for(const entry of entries.values())sync(entry);});
mountAll();
