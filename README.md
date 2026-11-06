# Mercado Local

Propuesta de Carlos Astudillo, candidato a la alcaldía de San Lorenzo. Sitio estático con Astro, Tailwind y SQLite WebAssembly persistente en el navegador.

Publicado en [mercado.lanuevahistoria.tech](https://mercado.lanuevahistoria.tech/) mediante Cloudflare Pages, conectado al repositorio `exinoss/mercado-local-astudillo`. Dominio activo con SSL y portada funcionando confirmados por el usuario el 2026-10-10. Dirección de Pages: [mercado-local-astudillo.pages.dev](https://mercado-local-astudillo.pages.dev/). La validación completa de recorridos en el alojamiento público queda pendiente.

El sitio principal continúa en el VPS de Hostinger. SQLite conserva los datos de cada navegador y origen: las cuentas de localhost o de `pages.dev` no se trasladan al subdominio. La etiqueta `noindex` existente se conserva.

## Usar el proyecto

Bun 1.4.2 y Node.js 22.12 o superior son las versiones de referencia de `package.json`. La revisión local se ejecutó con Bun 1.3.14 y Node.js 26.4.0.

Desde la raíz:

```powershell
bun install --frozen-lockfile
bun run dev:background
bun run dev:status
bun run dev:logs
bun run dev:stop
bun run build
```

`dev:background` ejecuta `astro dev --background`. Estado, registros y detención gestionan esa instancia. Si ya está disponible [localhost:4321](http://localhost:4321), utiliza el servidor existente. La integración conserva la instancia del usuario. `build` genera 28 páginas estáticas en `dist/`; no hay funciones de servidor.

## Comportamiento implementado

- Navegación A: páginas para ofertas, cuenta, carritos, compra, pedidos, ayuda y gestión del comercio.
- Identidad B: marca secundaria de Carlos y Lista 6 en cabecera y pie, conservando Vitrina de comercios.
- Catálogo A: tarjetas completas, una columna a 320 px y dos desde 361 px. Con texto al 200 %, se amplía la lectura.
- Accesibilidad B: botón flotante, texto hasta 200 %, contraste reforzado, movimiento reducido y restablecimiento.
- Cuentas locales sin activación: registro, acceso, salida y restablecimiento directo con correo y nueva contraseña.
- Perfil, direcciones, favoritos y carritos por tienda. Al entrar se combinan los carritos del visitante y de la cuenta.
- Compra editable con borradores guardados durante la edición, revisión, pago y detalle de pedido.
- Tienda propia: datos, fotografías locales, ofertas, promociones, modalidades, tarifas y gestión de pedidos.
- Recepción y una valoración actualizable por comprador y tienda.

SQLite se ejecuta en un Worker y guarda en OPFS mediante `opfs-sahpool`. Web Locks coordina las pestañas; las operaciones usan transacciones y el esquema está versionado. Las contraseñas se derivan mediante Web Crypto y no se guardan como texto.

Las cuentas y sus cambios pertenecen a ese navegador; no se sincronizan ni se publican para otros visitantes. La pasarela local aprueba al confirmar sin solicitar datos bancarios. Deuna, transferencia y efectivo mantienen sus estados pendientes hasta confirmarlos en la tienda propia. El alcance del catálogo y las operaciones se explica en «Sobre la propuesta».

## Código y diseño

`src/local/` comparte catálogo, rutas, vistas, controlador y repositorio entre Astro y el navegador. `src/data/catalog.js` es la fuente única del catálogo inicial. `src/pages/` genera las rutas estáticas; las tiendas locales y ofertas usan identificadores en la URL.

La identidad reside en `src/styles/theme.css`; composición y estados usan utilidades Tailwind, con patrones repetidos mediante `@apply`. Los estilos de los comparadores no se incorporan a producción. VS Code asocia las hojas de estilos al modo Tailwind CSS y recomienda Tailwind CSS IntelliSense.

El controlador anterior y sus componentes se conservan únicamente como [referencia histórica](./design/propuesta-local/legacy-src/README.md). El comparador usa SQLite separado del sitio principal. Su servidor en 4336 quedó detenido y sus archivos se conservan.

## Verificación

Compilación correcta de las 28 páginas principales y 29 del comparador. **390 comprobaciones de integración correctas**: Chromium, Firefox, edición de comercio, teclado/contraste, migración, desarrollo y adaptación. **Seis pruebas de lógica con 30 aserciones**.

Se comprobaron 320/390/768/1024/1440 px, ajustes reales de texto al 200 % y zoom nativo al 400 % en Chromium, incluida una compra. Persistencia al recargar y al cerrar/reabrir el navegador, perfiles separados, diez cambios entre pestañas, precios históricos, confirmación idempotente y errores de almacenamiento. Capturas revisadas.

Pendientes: Safari/iOS, lectores de pantalla y auditoría completa de accesibilidad. No se afirma conformidad WCAG completa. La publicación posterior está registrada en D60 de PROYECTO.md.

Informes, comandos de prueba, procedencia de identidad y gestión del comparador en [design/propuesta-local](./design/propuesta-local/README.md).

## Documentación y referencias

- [Propósito, alcance, decisiones y estado real](./PROYECTO.md)
- [Comparador aprobado A/B/A/B y verificaciones](./design/propuesta-local/README.md)
- [Identidad C: Vitrina de comercios](./design/identidad-carrusel/README.md)
- [Procedencia de fotografías contextualizadas](./design/identidad-carrusel/IMAGENES.md)
- [Renovación de portada y comercios](./design/rediseno/IMAGENES.md)
- [Migración previa a Tailwind](./design/tailwind-migration/README.md)
- [SQLite: persistencia en navegador](https://sqlite.org/wasm/doc/trunk/persistence.md)
- [Rutas Astro](https://docs.astro.build/en/guides/routing/)
- [Estilos Astro](https://docs.astro.build/en/guides/styling/)
