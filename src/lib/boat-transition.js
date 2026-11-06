export const boatDuration=2100;
export const boatFinish=120;
const clamp=value=>Math.max(0,Math.min(1,value));
const smooth=value=>{value=clamp(value);return value*value*(3-2*value);};

// D91: the approved B trajectory never stops; the feather follows the stern.
export function boatFrame(elapsed,width,height){
  const progress=clamp(elapsed/boatDuration),size=Math.min(310,width*.70,height*.5);
  const travel=progress+.10*Math.sin(2*Math.PI*progress);
  const center=-size*.65+(width+size*1.35)*travel,feather=Math.min(180,width*.25);
  const edge=Math.max(0,center-size*.24,(width+feather)*smooth((progress-.84)/.16));
  let frame,segment;
  if(elapsed<500){frame=Math.max(0,elapsed)/500*45;segment='entrar';}
  else if(elapsed>=boatDuration-400){frame=225+(elapsed-boatDuration+400)/400*45;segment='salir';}
  else{frame=45+((elapsed-500)/1000*60)%180;segment='bucle';}
  return {progress,size,center,x:center-size/2,y:(height-size)/2,edge,stop:Math.max(0,edge-feather),opacity:1-smooth((progress-.88)/.12),frame:Math.min(269.99,frame),segment};
}
