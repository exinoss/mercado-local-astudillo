// Shore geometry is sampled in viewport pixels; the foam texture is confined to this narrow band.
export function renderTide(width,height,tail=false){
  const duration=760,depth=Math.min(width*.2,150),side=tail?1:-1,band=Math.min(width*.2,80),seed=17;
  const n=value=>Math.round(value*100)/100;
  const edge=y=>{
    const t=y/height;
    const broad=Math.cos((t-.48)*Math.PI*1.6)*depth*.65;
    return broad+Math.sin(y/43+seed)*depth*.1+Math.sin(y/15.7)*depth*.045+Math.sin(y/5.9+seed)*2.8;
  };
  const points=Array.from({length:Math.ceil((height+64)/7)+1},(_,i)=>{const y=Math.min(height+32,-32+i*7);return {x:edge(y),y};});
  const line=points.map((p,i)=>`${i?'L':'M'}${n(p.x)} ${n(p.y)}`).join(' '),last=points.at(-1);
  const body=`${line} L${side*width*3} ${n(last.y)} V-32Z`;
  const inner=points.toReversed().map(p=>`L${n(p.x+side*band*(.68+.2*Math.sin(p.y/21+seed)+.1*Math.sin(p.y/7)))} ${n(p.y)}`).join(' ');
  const foam=`${line} ${inner}Z`;
  const filterLeft=-depth-band-32,filterWidth=2*(depth+band+32);
  const foamLayer=(offset=0,secondary=false)=>`<g class="${secondary?'tide-secondary':'tide-foam-group'}" transform="translate(${offset} 0)"><path class="tide-foam-wash" d="${foam}"/><path class="tide-foam-lace" d="${foam}" filter="url(#seafoam)"/><path class="tide-foam-rim" d="${line}" filter="url(#foam-edge)"/></g>`;
  const trails=[1,2,3].map((i)=>`<path class="tide-trail" d="${line}" transform="translate(${side*band*(1.5+i*.8)} 0)" opacity="${.2-i*.035}"/>`).join('');
  const spray=points.filter((_,i)=>i%3===0).map((p,i)=>`<circle class="tide-droplet" cx="${n(p.x-side*(4+i%4*3))}" cy="${n(p.y+Math.sin(i)*4)}" r="${n(1+i%3*.7)}"/>`).join('');
  const bubbles=Array.from({length:24},(_,i)=>{
    const x=width*(.04+((i*41+seed*3)%91)/100),y=height*(.06+((i*31+seed)%90)/100),radius=(6+i%7*1.8)*Math.min(1,width/500+.4);
    return `<g class="tide-bubble" data-drift="${i%2?1:-1}" data-rise="${46+i%5*12}"><circle cx="${n(x)}" cy="${n(y)}" r="${n(radius)}" fill="url(#bubble)"/><path d="M${n(x-radius*.58)} ${n(y-radius*.15)} Q${n(x-radius*.6)} ${n(y-radius*.62)} ${n(x-radius*.05)} ${n(y-radius*.68)}"/></g>`;
  }).join('');
  const x1=tail?-depth:-width,x2=tail?width:depth;
  return {duration,reach:depth+32,html:`<defs>
    <linearGradient id="tide-water" gradientUnits="userSpaceOnUse" x1="${x1}" y1="0" x2="${x2}" y2="0"><stop stop-color="var(${tail?'--color-tide-shallow':'--color-tide-depth'})"/><stop offset=".48" stop-color="var(--color-tide-water)"/><stop offset="1" stop-color="var(${tail?'--color-tide-depth':'--color-tide-shallow'})"/></linearGradient>
    <radialGradient id="bubble" cx=".35" cy=".3"><stop stop-color="#FFFFFF" stop-opacity=".08"/><stop offset=".68" stop-color="var(--color-tide-shallow)" stop-opacity=".04"/><stop offset=".9" stop-color="#FFFFFF" stop-opacity=".7"/><stop offset="1" stop-color="var(--color-tide-depth)" stop-opacity=".55"/></radialGradient>
    <filter id="seafoam" filterUnits="userSpaceOnUse" x="${filterLeft}" y="-40" width="${filterWidth}" height="${height+80}" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".055 .08" numOctaves="3" seed="${seed}" result="noise"><animate attributeName="baseFrequency" begin="indefinite" dur="${duration}ms" values=".055 .08;.063 .074;.055 .08" fill="freeze"/></feTurbulence><feColorMatrix in="noise" type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 9 0 0 0 -3.7" result="froth"/><feComposite in="froth" in2="SourceGraphic" operator="in"/></filter>
    <filter id="foam-edge" filterUnits="userSpaceOnUse" x="${filterLeft}" y="-40" width="${filterWidth}" height="${height+80}"><feTurbulence type="fractalNoise" baseFrequency=".065 .1" numOctaves="2" seed="${seed}" result="rough"/><feDisplacementMap in="SourceGraphic" in2="rough" scale="9" xChannelSelector="R" yChannelSelector="G"/></filter>
  </defs><g class="tide-moving"><path data-water-fill class="tide-water" d="${body}" fill="url(#tide-water)"/>${trails}${foamLayer(side*band*2.4,true)}${foamLayer()}<g class="tide-spray">${spray}</g></g><g class="tide-bubbles">${bubbles}</g>`};
}
