import boatURL from '../assets/barco-transicion.min.json?url';
import {boatDuration,boatFinish,boatFrame} from '../lib/boat-transition.js';

export function initializePageNavigation(){
  const bootstrap=window.marketPageNavigation,layer=document.querySelector('#page-transition-layer');
  if(!bootstrap||!layer)return;
  const root=document.documentElement,systemMotion=matchMedia('(prefers-reduced-motion: reduce)'),boat=layer.querySelector('.transition-boat'),player=layer.querySelector('.transition-boat-player'),poster=layer.querySelector('.transition-boat-poster');
  const pending=bootstrap.pending,route=bootstrap.route,regions=[...document.querySelectorAll('#local-header,#main,#local-footer,#reading-controls')];
  let clock,instance,entering=false,started=false,startTime,elapsed=0;
  const reduced=()=>systemMotion.matches||(root.dataset.motion?root.dataset.motion==='reduced':bootstrap.savedMotion);
  const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  function reset(){
    cancelAnimationFrame(clock);instance?.destroy();instance=null;player.replaceChildren();poster.hidden=false;
    for(const region of regions)region.inert=false;
    bootstrap.clear();
    if(started){started=false;root.dataset.transitionCompleted='true';if(pending?.keyboard)document.querySelector('#main')?.focus({preventScroll:true});}
  }
  function skip(){bootstrap.transition?.skipTransition();reset();}
  function paint(){
    const pose=boatFrame(elapsed,innerWidth,innerHeight);
    for(const key of ['size','x','y','edge','stop'])root.style.setProperty('--boat-'+key,pose[key]+'px');
    root.style.setProperty('--boat-opacity',String(pose.opacity));
    boat.dataset.progress=String(pose.progress);boat.dataset.center=String(pose.center);boat.dataset.segment=pose.segment;
    instance?.goToAndStop(pose.frame,true);
  }
  async function loadBoat(){
    if(!window.lottie)return;
    try{
      const response=await fetch(boatURL,{signal:AbortSignal.timeout(1000)});if(!response.ok)return;
      const data=await response.json();if(!['entrar','bucle','salir'].every(name=>data.markers?.some(marker=>marker.cm===name)))return;
      if(!root.dataset.transitionPhase)return;
      instance=window.lottie.loadAnimation({container:player,renderer:'svg',autoplay:false,loop:false,animationData:data,rendererSettings:{preserveAspectRatio:'xMidYMid meet'}});
      await Promise.race([new Promise(resolve=>{instance.addEventListener('DOMLoaded',resolve);instance.addEventListener('data_failed',resolve);if(instance.isLoaded)resolve();}),sleep(250)]);
      if(instance?.isLoaded){instance.goToAndStop(0,true);poster.hidden=true;}
    }catch{/* The exact frame-45 poster keeps the approved boat visible if JSON fails. */}
  }
  function tick(now){
    if(!root.dataset.transitionPhase)return;
    elapsed=Math.min(boatDuration,now-startTime);paint();
    if(elapsed<boatDuration)clock=requestAnimationFrame(tick);
    else{root.dataset.transitionPhase='finishing';setTimeout(skip,boatFinish);}
  }
  async function enter(){
    const transition=bootstrap.transition;
    if(!transition||entering||!pending)return;entering=true;
    transition.finished.then(reset,reset);
    try{
      await transition.ready;
      await Promise.all([loadBoat(),new Promise(resolve=>{
        if(document.body.dataset.ready==='true'){resolve();return;}
        const observer=new MutationObserver(()=>{if(document.body.dataset.ready==='true'){observer.disconnect();clearTimeout(timeout);resolve();}});
        const timeout=setTimeout(()=>{observer.disconnect();resolve();},1200);observer.observe(document.body,{attributes:true,attributeFilter:['data-ready']});
      }),Promise.race([document.fonts.ready,sleep(180)])]);
      if(!root.dataset.transitionPhase||document.body.dataset.ready!=='true'||reduced()||document.hidden){skip();return;}
      for(const region of regions)region.inert=true;
      elapsed=0;paint();started=true;root.dataset.transitionPhase='sailing';startTime=performance.now();clock=requestAnimationFrame(tick);
    }catch{reset();}
  }
  const motionChanged=()=>{if(reduced()&&root.dataset.transitionPhase)skip();};
  systemMotion.addEventListener('change',motionChanged);
  new MutationObserver(motionChanged).observe(root,{attributes:true,attributeFilter:['data-motion']});
  window.addEventListener('pageshow',event=>{if(event.persisted)reset();});
  window.addEventListener('market-page-reveal',enter);
  window.addEventListener('resize',()=>{if(started)paint();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&started)skip();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&root.dataset.transitionPhase)skip();});
  enter();
  document.addEventListener('click',event=>{
    const link=event.target?.closest?.('a[href]');
    if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||link.hasAttribute('download')||link.target&&link.target!=='_self')return;
    const to=new URL(link.href,location.href);
    if(to.origin!==location.origin||!to.pathname.endsWith('/')||route(to.href)===route(location.href))return;
    if(root.dataset.transitionPhase){event.preventDefault();return;}
    if(reduced()||!('onpagereveal' in window))return;
    const record={to:to.pathname+to.search+to.hash,time:Date.now(),keyboard:event.detail===0};
    try{sessionStorage.setItem(bootstrap.key,JSON.stringify(record));}catch{}
  });
}
