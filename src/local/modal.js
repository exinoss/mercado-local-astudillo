// Supplement native dialogs at keyboard boundaries; lifecycle remains shared.
export function containDialogFocus(dialog) {
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const controls = [...dialog.querySelectorAll('a[href],button,input,select,textarea,[tabindex]')].filter(item => !item.disabled && item.tabIndex >= 0 && item.getClientRects().length);
    if (!controls.length) { event.preventDefault(); return; }
    const first = controls[0], last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
}
