// Opciones elegidas por el usuario el 2026-10-09 (D58).
export const approvedVariants = Object.freeze({ nav: 'A', identity: 'B', catalog: 'A', access: 'B' });

export const pageTitles = {
  '/': 'Mercado Local | San Lorenzo',
  '/catalogo/': 'Productos y servicios',
  '/comercios/': 'Comercios de San Lorenzo',
  '/promociones/': 'Promociones',
  '/oferta/': 'Detalle de oferta',
  '/tiendas/ver/': 'Tienda',
  '/acceso/': 'Iniciar sesión',
  '/registro/': 'Crear cuenta',
  '/restablecer/': 'Restablecer contraseña',
  '/cuenta/': 'Mi cuenta',
  '/direcciones/': 'Mis direcciones',
  '/favoritos/': 'Mis favoritos',
  '/carritos/': 'Mis carritos',
  '/compra/': 'Revisar compra',
  '/pago/': 'Confirmar pago',
  '/pedidos/': 'Mis pedidos',
  '/pedido/': 'Detalle de pedido',
  '/panel/': 'Mi tienda',
  '/mi-tienda/': 'Gestionar tienda',
  '/editar-oferta/': 'Gestionar oferta',
  '/ayuda/': 'Ayuda',
  '/propuesta/': 'Sobre la propuesta',
};

export const localPagePaths = Object.keys(pageTitles);
export const protectedPaths = [
  '/cuenta/', '/direcciones/', '/favoritos/', '/pedidos/', '/pedido/',
  '/panel/', '/mi-tienda/', '/editar-oferta/', '/compra/', '/pago/',
];

export function pageTitle(path, shop) {
  if (path === '/') return pageTitles[path];
  return `${shop?.name || pageTitles[path] || 'Mercado Local'} | Mercado Local`;
}
