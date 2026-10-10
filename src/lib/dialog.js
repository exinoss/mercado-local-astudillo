/** Native modal lifecycle shared by market details and reading preferences. */
export function manageDialog(dialog, fallback = () => document.querySelector('#main')) {
  let opener;
  dialog.addEventListener('close', () => {
    if (dialog.open) return;
    const target = opener?.isConnected ? opener : fallback();
    target?.focus({ preventScroll:true });
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  return {
    open() {
      if (dialog.open) {
        dialog.querySelector('button')?.focus();
        return;
      }
      opener = document.activeElement;
      dialog.showModal();
    },
    close() { dialog.close(); }
  };
}
