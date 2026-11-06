import { normalizeReadingSettings, readingSettingsKey } from '../lib/reading-settings.js';

let carouselNode,timer,current=0,running=false,manualPause=false,hovering=false;
const pauseKey='mercado-local:carousel-paused-v1',systemMotion=matchMedia('(prefers-reduced-motion: reduce)');
let savedMotion=false;try{savedMotion=normalizeReadingSettings(JSON.parse(localStorage.getItem(readingSettingsKey))).reducedMotion;manualPause=sessionStorage.getItem(pauseKey)==='true';}catch{}
const motionReduced=()=>systemMotion.matches||(document.documentElement.dataset.motion?document.documentElement.dataset.motion==='reduced':savedMotion);
const stopTimer=()=>{clearInterval(timer);timer=undefined;};
function controls(){
  if(carouselNode){carouselNode.dataset.playing=String(running);carouselNode.dataset.reduced=String(motionReduced());}
  for(const area of document.querySelectorAll('[data-carousel-control]'))area.hidden=!carouselNode;
  for(const button of document.querySelectorAll('[data-carousel-pause]')){
    button.disabled=motionReduced();button.setAttribute('aria-pressed',String(manualPause));
    button.textContent=motionReduced()?'Carrusel sin movimiento':manualPause?'Reanudar cambio automático del carrusel':'Pausar cambio automático del carrusel';
  }
}
function syncPlayback(){
  const active=carouselNode&&!manualPause&&!motionReduced()&&!document.hidden&&!hovering&&!carouselNode.contains(document.activeElement)&&!document.querySelector('dialog[open]');
  if(active&&!running){running=true;stopTimer();timer=setInterval(()=>select(current+1),8000);}
  else if(!active){running=false;stopTimer();}controls();
}
function select(index,announce=false){
  if(!carouselNode)return;const count=carouselNode.querySelectorAll('[data-hero-slide]').length;current=(index+count)%count;
  carouselNode.querySelectorAll('[data-hero-slide]').forEach(slide=>slide.hidden=Number(slide.dataset.heroSlide)!==current);
  carouselNode.querySelectorAll('[data-hero-select]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.heroSelect)===current)));
  carouselNode.querySelector('[data-hero-position]').textContent=`${current+1} / ${count}`;
  if(announce)carouselNode.querySelector('[data-hero-announcement]').textContent=`Imagen ${current+1} de ${count}`;
}
function sizeReferenceCarousel(carousel){
  const images=carousel?.querySelector('.carousel-images'),reference=images?.querySelector('[data-logo-hero]');if(!reference)return;
  const style=reference.style.cssText;reference.style.cssText+=';display:block!important;position:absolute;inset:0 0 auto;height:auto;visibility:hidden;';
  const height=Math.ceil(reference.querySelector('.logo-hero').getBoundingClientRect().height),logo=reference.querySelector('.hero-animated-logo').getBoundingClientRect();
  const arrowTop=innerWidth<601?logo.top+logo.height/2-images.getBoundingClientRect().top:height/2;
  reference.style.cssText=style;
  if(height>0){images.style.height=height+'px';images.dataset.sized='true';carousel.style.setProperty('--carousel-arrow-top',arrowTop+'px');}
}
function mount(){
  const next=document.querySelector('[data-carousel]');if(next===carouselNode)return;stopTimer();running=false;hovering=false;carouselNode=next;
  if(next){select(current);sizeReferenceCarousel(next);next.addEventListener('focusin',syncPlayback);next.addEventListener('focusout',()=>setTimeout(syncPlayback,0));next.addEventListener('pointerenter',()=>{hovering=true;syncPlayback();});next.addEventListener('pointerleave',()=>{hovering=false;syncPlayback();});}
  syncPlayback();
}
document.addEventListener('click',event=>{
  const button=event.target.closest('button');if(!button)return;
  if(button.hasAttribute('data-hero-step'))select(current+Number(button.dataset.heroStep),true);
  if(button.hasAttribute('data-hero-select'))select(Number(button.dataset.heroSelect),true);
  if(button.hasAttribute('data-carousel-pause')){manualPause=!manualPause;try{sessionStorage.setItem(pauseKey,String(manualPause));}catch{}syncPlayback();}
});
document.addEventListener('keydown',event=>{
  if(!event.target.matches('[data-hero-select]')||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
  event.preventDefault();select(event.key==='Home'?0:event.key==='End'?carouselNode.querySelectorAll('[data-hero-slide]').length-1:current+(event.key==='ArrowRight'?1:-1),true);
  carouselNode.querySelector(`[data-hero-select="${current}"]`).focus();
});
document.addEventListener('visibilitychange',syncPlayback);
for(const event of ['toggle','close'])document.addEventListener(event,syncPlayback,true);
systemMotion.addEventListener('change',()=>{syncPlayback();scheduleBackground();});
new MutationObserver(()=>{syncPlayback();scheduleBackground();}).observe(document.documentElement,{attributes:true,attributeFilter:['data-motion']});
new MutationObserver(mount).observe(document.querySelector('#main'),{childList:true});
new MutationObserver(controls).observe(document.querySelector('#reading-dialog'),{childList:true});
window.addEventListener('market-motion-reset',()=>{manualPause=false;try{sessionStorage.removeItem(pauseKey);}catch{}syncPlayback();});
window.addEventListener('pagehide',()=>{stopTimer();running=false;});window.addEventListener('pageshow',syncPlayback);
new MutationObserver(syncPlayback).observe(document.body,{attributes:true,attributeFilter:['data-ready']});
mount();
function placeReadingControl(){
  const trigger=document.querySelector('[data-accessibility-open]'),slot=document.querySelector('#reading-slot'),floating=document.querySelector('#reading-controls');
  if(!trigger||!slot||!floating)return;
  const docked=innerWidth<=600||document.documentElement.dataset.textSize==='200';
  const target=docked?slot:floating;
  if(trigger.parentElement!==target)target.append(trigger);
  trigger.dataset.docked=String(docked);
}
new MutationObserver(placeReadingControl).observe(document.body,{attributes:true,attributeFilter:['data-ready']});
window.addEventListener('resize',placeReadingControl);
placeReadingControl();
document.addEventListener('focusin',event=>{
  if(!event.target.matches(':focus-visible'))return;
  const trigger=document.querySelector('[data-accessibility-open]');
  if(!trigger||trigger.dataset.docked==='true'||trigger===event.target||event.target.closest('dialog'))return;
  const active=event.target.getBoundingClientRect(), floating=trigger.getBoundingClientRect();
  if(active.right>floating.left&&active.left<floating.right&&active.bottom>floating.top&&active.top<floating.bottom)window.scrollBy({top:active.bottom-floating.top+16,behavior:'instant'});
});

let backgroundFrame;
function paintBackground(){
  backgroundFrame=undefined;
  const maximum=Math.max(0,document.documentElement.scrollHeight-innerHeight);
  const progress=maximum?Math.max(0,Math.min(1,scrollY/maximum)):0;
  const amount=motionReduced()?1:progress;
  document.documentElement.style.setProperty('--market-wash-height',(100-76*amount)+'vh');
  document.documentElement.style.setProperty('--market-wash-middle',(72-54*amount)+'%');
}
function scheduleBackground(){if(!backgroundFrame)backgroundFrame=requestAnimationFrame(paintBackground);}
window.addEventListener('scroll',scheduleBackground,{passive:true});
window.addEventListener('resize',scheduleBackground);
window.addEventListener('pageshow',scheduleBackground);
new ResizeObserver(scheduleBackground).observe(document.body);
paintBackground();

window.addEventListener('resize',()=>sizeReferenceCarousel(carouselNode));
window.addEventListener('pageshow',()=>sizeReferenceCarousel(carouselNode));
document.fonts.ready.then(()=>sizeReferenceCarousel(carouselNode));
