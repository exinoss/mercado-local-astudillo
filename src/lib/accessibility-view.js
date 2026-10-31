import { svg } from './icons.js';
import {logoPauseButton} from './animated-logo.js';
export function readingControls(placement = 'A') {
  const position = ['A','B','C'].includes(placement) ? placement : 'A';
  const placements = {
    A: 'max-[600px]:ml-auto',
    B: 'fixed right-[16px] bottom-[20px] z-7 shadow-reading size-[48px] min-h-[48px] p-[8px] [&_svg]:size-[22px]',
    C: 'fixed bottom-0 left-0 z-7 w-full rounded-none bg-brand text-white',
  };
  return {
    trigger:`<button type="button" class="accessibility-trigger placement-${position} ${placements[position]}" data-accessibility-open aria-label="Accesibilidad" aria-haspopup="dialog" aria-controls="accessibility-dialog" hidden>${svg('accessibility')}</button>`,
    dialog:`<dialog class="market-dialog" id="accessibility-dialog" aria-labelledby="accessibility-title" aria-describedby="accessibility-description">
      <button type="button" class="dialog-close ml-auto block min-w-11 py-2 pl-[15px] underline" data-accessibility-close aria-label="Cerrar ajustes de accesibilidad">Cerrar</button>
      <h2 id="accessibility-title">Ajusta tu lectura</h2>
      <p id="accessibility-description">Elige cómo prefieres explorar Mercado Local. Tus preferencias se guardan en este navegador.</p>
      <form class="checkout-form">
        <label for="reading-size">Tamaño del texto<select id="reading-size" name="textSize">
          <option value="100">Estándar (100 %)</option><option value="125">Grande (125 %)</option><option value="150">Muy grande (150 %)</option><option value="200">Máximo (200 %)</option>
        </select></label>
        <label class="reading-toggle" for="reading-contrast"><input id="reading-contrast" name="contrast" type="checkbox">Contraste reforzado</label>
        <label class="reading-toggle" for="reading-motion"><input id="reading-motion" name="reducedMotion" type="checkbox">Reducir movimiento</label>
        <fieldset class="grid gap-3 rounded-lg border border-line p-4"><legend class="px-1 font-bold">Animaciones</legend>${logoPauseButton('button secondary')}<div data-carousel-control><button type="button" class="button secondary" data-carousel-pause>Pausar cambio automático del carrusel</button></div></fieldset>
        <button class="button secondary" type="reset">Restablecer ajustes</button>
      </form>
      <p class="text-sm text-muted" role="status" aria-live="polite" aria-atomic="true"></p>
    </dialog>`
  };
}
