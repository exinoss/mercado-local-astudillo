import { manageDialog } from '../lib/dialog.js';
import { defaultReadingSettings, normalizeReadingSettings, readingSettingsKey } from '../lib/reading-settings.js';

const dialog = document.querySelector('#accessibility-dialog');
const trigger = document.querySelector('[data-accessibility-open]');
if (dialog && trigger) {
  const modal = manageDialog(dialog);
  const form = dialog.querySelector('form');
  const textSize = form.elements.namedItem('textSize');
  const contrast = form.elements.namedItem('contrast');
  const motion = form.elements.namedItem('reducedMotion');
  const status = dialog.querySelector('[role=status]');
  let settings = { ...defaultReadingSettings };
  try { settings = normalizeReadingSettings(JSON.parse(localStorage.getItem(readingSettingsKey))); } catch {}

  function apply() {
    const root = document.documentElement;
    root.style.fontSize = settings.textSize === 100 ? '' : `${settings.textSize}%`;
    root.dataset.contrast = settings.contrast ? 'enhanced' : 'standard';
    root.dataset.textSize = String(settings.textSize);
    root.dataset.motion = settings.reducedMotion ? 'reduced' : 'system';
    textSize.value = String(settings.textSize);
    contrast.checked = settings.contrast;
    motion.checked = settings.reducedMotion;
    // Notify components whose available space or font metrics changed.
    window.dispatchEvent(new Event('resize'));
  }
  function save() {
    apply();
    try {
      localStorage.setItem(readingSettingsKey,JSON.stringify(settings));
      status.textContent = `Texto al ${settings.textSize} %. Preferencias guardadas en este navegador.`;
    } catch {
      status.textContent = `Texto al ${settings.textSize} %. Ajustes aplicados; este navegador no permite guardarlos.`;
    }
  }
  trigger.addEventListener('click',()=>modal.open());
  dialog.querySelector('[data-accessibility-close]').addEventListener('click',()=>modal.close());
  form.addEventListener('change',()=> {
    settings = normalizeReadingSettings({textSize:Number(textSize.value),contrast:contrast.checked,reducedMotion:motion.checked});
    save();
  });
  form.addEventListener('submit',event=>event.preventDefault());
  form.addEventListener('reset',event=> {
    event.preventDefault();
    settings = { ...defaultReadingSettings };
    save();
  });
  trigger.hidden = false;
  apply();
}
