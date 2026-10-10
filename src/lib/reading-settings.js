export const readingSettingsKey = 'mercado-local:accessibility-v1';
export const defaultReadingSettings = Object.freeze({ textSize:100, contrast:false, reducedMotion:false });
export function normalizeReadingSettings(value) {
  const settings = value && typeof value === 'object' ? value : {};
  return {
    textSize:[100,125,150,200].includes(settings.textSize) ? settings.textSize : 100,
    contrast:settings.contrast === true,
    reducedMotion:settings.reducedMotion === true
  };
}
