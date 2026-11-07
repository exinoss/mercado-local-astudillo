export const logoPoster = '/images/branding/mercado-local-motion.svg';

export const animatedMarketLogo = (className = 'market-brand-symbol') => `<span class="${className}" data-animated-logo aria-hidden="true"><img src="${logoPoster}" width="240" height="288" alt=""></span>`;

export const logoPauseButton = (className = 'logo-motion-toggle') => `<button type="button" class="${className}" data-logo-pause>Pausar logos y marco</button>`;

export function renderLocalBenefit(h) {
  return `<div data-hero-slide="0" data-logo-hero role="group" aria-roledescription="diapositiva" aria-label="1 de 4: Mercado Local y los comercios de San Lorenzo"><div class="logo-hero"><div class="container logo-hero-layout"><div class="logo-hero-copy"><h2>Tu compra impulsa San Lorenzo</h2><p>Descubre productos y servicios de tu cantón y apoya a quienes emprenden cerca de ti.</p><a class="button" href="${h('/comercios/')}">Explorar comercios</a></div><div class="logo-hero-art">${animatedMarketLogo('hero-animated-logo')}</div></div></div></div>`;
}

export function renderAnimatedAccess(){
  return `<div class="access-intro access-animated-intro"><div class="access-logo-surface">${animatedMarketLogo('access-animated-logo')}</div><h2>Dale más alcance a lo que haces</h2><p>Descubre los negocios de San Lorenzo y ayuda a dar a conocer el talento de tu comunidad.</p><div class="access-color-line" aria-hidden="true"></div></div>`;
}
