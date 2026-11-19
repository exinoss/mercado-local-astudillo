# Auditoría del sistema · 2026-11-19

Estado: completada. Se corrigieron directamente los errores reproducidos que se detallan abajo. Solicitud D115: auditar el sistema, verificar errores, corregirlos y generar un informe Markdown con los cambios. Se conservan las decisiones aprobadas (D108–D114), el alcance estático y los datos locales del navegador. La revisión no certifica ausencia absoluta de errores ni conformidad WCAG completa.

Antecedente: [auditoría D105 del 2026-11-06](auditoria-2026-11-06.md). Esta revisión cubre el código actual, incluidos los cambios locales sin commit de D108–D114 (Tecnomovil, Variedades Aristi y portada).

## Alcance y método

- **Código revisado por lectura dirigida:** Worker SQLite y repositorio (`database.worker.js`, `repository.js`), reglas de negocio (`transitions.js`, `catalog.js`, `lib/market.js`, `lib/discount.js`, `lib/services.js`), vistas (`views.js`, `market-ui.js`, `service-view.js`, `discount-view.js`), controladores de navegador (`app.js`, `market-controls.js`, `page-navigation.js`, `discount-controls.js`, `dialog.js`, `modal.js`, `scripts/accessibility.js`), `Layout.astro` y las rutas de `src/pages/`.
- **Pruebas automáticas:** `bun run check`, que verifica el repositorio, ejecuta las pruebas, compila y comprueba los recursos de distribución.
- **Barrido de renderizado con datos sintéticos:** 120 vistas. Incluye todas las rutas con y sin sesión, las 13 fichas de tienda, una tienda propia con producto con descuento y servicio, carritos y borradores en todas las tiendas con productos, los cuatro métodos de pago y los pedidos confirmados. Busca `undefined`, `NaN`, `[object`, IDs duplicados, referencias ARIA/`for` rotas y códigos internos visibles.
- **HTML compilado:** las 35 páginas de `dist/` se revisaron en busca de IDs duplicados y destinos ausentes de `for`, `aria-labelledby`, `aria-controls` y `aria-describedby`.
- **Dependencias:** `bun audit --json` y `bun outdated`.
- **Sin servidores:** D114 exige mantener detenidos todos los servidores hasta nueva petición. No se levantó ninguno, ni de desarrollo ni de preview ni de comparador, y no hubo revisión en navegador real. Las correcciones no cambian CSS ni composición visual.
- **Graphify** sigue sin estar instalado (`command not found`) y no hay `GRAPH_REPORT.md`. La localización se hizo con `docs/mapa-del-proyecto.md` y búsquedas acotadas.

## Resultados y correcciones

| ID | Hallazgo y efecto | Corrección | Evidencia |
| --- | --- | --- | --- |
| B01 · Media | La revisión y el pago mostraban el código interno del método de pago: «Método: deuna», «Método: transferencia», «Método: efectivo». En el detalle del pedido aparecía «pasarela · Pago aprobado». El comprador veía identificadores internos en lugar de los nombres que eligió. | `src/local/views.js` define `paymentLabels`/`paymentLabel` en el ámbito de las vistas y lo usa en la revisión, el pago y el detalle del pedido: «Pago en línea», «Deuna», «Transferencia», «Efectivo al retirar». Los valores guardados no cambian. | El barrido reproducía el fallo en 10 vistas de revisión/pago y 9 de pedido; tras la corrección, 0. Nueva prueba: revisión con efectivo y detalle del pedido «Efectivo al retirar · Pago pendiente». |
| B02 · Baja (accesibilidad) | El contador del carrito de la cabecera tenía `aria-hidden` y el enlace se llamaba solo «Mis carritos». Quien usa lector de pantalla no conocía cuántos productos había añadido, y la información solo se comunicaba visualmente. | `src/local/market-ui.js` exporta `cartLabel(count)` y la cabecera lo usa: «Mis carritos: N producto(s)». `src/local/app.js` actualiza ese nombre al refrescar el contador, con el mismo total ya calculado, sin cambios visuales. | Las 35 páginas compiladas llevan «Mis carritos: 0 productos». La prueba verifica 0 y 2 productos. |
| B03 · Baja | Al crear una tienda, el campo obligatorio «Inicio de actividad» venía rellenado con una fecha fija, `2026-10-09` (la fecha de implementación). Si alguien guardaba sin revisarla, su tienda quedaba con una fecha de apertura inventada, que afecta a la etiqueta «Nuevo» y al filtro de emprendimientos nuevos (D20/D39). | El campo de una tienda nueva queda vacío y sigue siendo `required`: el comerciante debe indicar su fecha real. Al editar una tienda existente se conserva su fecha guardada. | Prueba: `name="startedAt" type="date" value="" required`. La validación `isCalendarDate` del modelo no cambia. |
| B04 · Baja (robustez) | Algunos identificadores se insertaban en atributos HTML sin escapar: `data-delete-address`, `data-quantity`, `data-remove`, `data-receive`, `data-order-status`, `data-paid`, `data-delete-offer` y dos `input hidden` de tienda. El identificador de dirección acepta texto del payload. Un valor con comillas guardado en los datos locales podía romper el atributo e inyectar marcado. El riesgo se limita a los propios datos de la cuenta en ese navegador. | Todos esos valores pasan por el `escapeHtml` compartido, igual que el resto de textos. | Prueba con `x" onclick="alert(1)`: se representa escapado y no genera atributo. Barrido: 0 referencias rotas. |
| B05 · Media (redistribución) | Detectado después, al revisar D117. En catálogo, servicios, comercios y promociones, los selectores de filtro desbordaban 25 px a 320 px y 58 px con texto al 200 % (390 px). Sus etiquetas tenían `flex-basis: 0`, se comprimían a 4 px junto al buscador y nunca bajaban de línea. A 768 px los selectores medían 92 px y cortaban textos. | `src/local/styles.css`: `.catalog-filters label` pasa de `min-w-0` a `min-w-[min(100%,10rem)]`, el mismo patrón que ya usa el buscador. | Chrome: 0 px de desbordamiento en las cuatro páginas a 320, 390 (texto al 200 %), 768, 1024 y 1440 px. Posiciones idénticas a 1024 y 1440 px; a 768 px los selectores miden 160 px y «Quitar filtros» pasa a la línea siguiente. |

## Comprobaciones finales

| Comprobación | Resultado |
| --- | --- |
| `bun run check` | Correcto. |
| Repositorio | 154 archivos candidatos (incluido este informe); reglas, exclusiones y patrones de credenciales comprobados. |
| `bun test src/` | 31 pruebas correctas, 0 fallos, 4046 aserciones (antes 28/4038; 3 pruebas nuevas). |
| Hook de memoria | 3 pruebas correctas. No acredita la ejecución automática en Codex. |
| Compilación | 35 páginas, 116 archivos, 42.49 MiB; referencias locales completas. |
| HTML compilado | 35/35 páginas sin IDs duplicados ni destinos ARIA/`for` ausentes. |
| Barrido de vistas | 120 vistas sin `undefined`/`NaN`/`[object`, sin IDs duplicados ni referencias rotas. No quedan códigos de pago visibles. |
| Reglas y formato | `AGENTS.md` y `CLAUDE.md` idénticos; `git diff --check` correcto. |

Revisado sin hallazgos que corregir: el aislamiento por cuenta y namespace del Worker; PBKDF2 con sal aleatoria; las transacciones con `ROLLBACK`; el modo privado de Firefox (IndexedDB); la revalidación vinculante del total al confirmar el pedido (`sameQuote`); la depuración de carritos con ofertas retiradas; los límites de cantidad 1–99; los precios en centavos y los descuentos. También se revisaron la redirección segura `safeNext`, el escape de textos de tienda/oferta, los diálogos (foco, Escape, retorno del foco) y el carrusel con pausa y movimiento reducido.

## Dependencias: actualizadas (D116)

`bun audit` informaba dos avisos de `astro` 7.3.8. Ninguno aplicaba a este sitio estático:

| Aviso | Severidad | Aplicación a este proyecto |
| --- | --- | --- |
| [GHSA-mh32-jxcr-mh9f](https://github.com/advisories/GHSA-mh32-jxcr-mh9f): XSS por inyección de atributos en nombres de etiqueta dinámicos | Baja | No se usan etiquetas dinámicas de Astro con datos externos. |
| [GHSA-r3h5-4585-7x3w](https://github.com/advisories/GHSA-r3h5-4585-7x3w): endpoint de imágenes de `@astrojs/node` | Moderada | No aplica: salida `static`, sin `@astrojs/node`. |

Con autorización expresa del usuario, el mismo día se actualizaron:

| Paquete | Antes | Después |
| --- | --- | --- |
| `astro` | 7.3.8 | 7.4.13 |
| `tailwindcss` | 4.3.3 | 4.3.5 |
| `@tailwindcss/vite` | 4.3.3 | 4.3.5 |
| `@sqlite.org/sqlite-wasm` | 3.53.4-build2 | 3.54.1-build1 |

Verificación posterior:

- `bun audit --json` devuelve `{}` y `bun outdated` no lista paquetes pendientes.
- `bun run check` pasa: 31 pruebas con 4046 aserciones, 3 del hook, compilación de 35 páginas y 116 archivos (42.50 MiB) y referencias completas. Las 35 páginas siguen sin IDs ni referencias ARIA rotos y el barrido de 120 vistas sigue sin problemas.
- **SQLite WASM:** el paquete conserva la exportación `./sqlite3.wasm` y las funciones que usa el Worker, entre ellas `installOpfsSAHPoolVfs` (en la versión para navegador), `OpfsSAHPoolDb`, `pauseVfs`/`unpauseVfs`, `sqlite3_deserialize` y `sqlite3_js_db_export`. En Node, con SQLite 3.54.1, se ejecutó la ruta del modo privado: esquema, `user_version`, UPSERT, exportación, restauración y escritura posterior. Todo correcto. El Worker compilado referencia el `.wasm` con hash.
- **Navegador:** OPFS, Web Locks y los recorridos de cuentas, carritos y pedidos se comprobaron después en Chrome, WebKit y Firefox (ver la sección siguiente). Si aparece un problema, se puede volver a las versiones anteriores, que siguen en Git, con `git checkout -- package.json bun.lock` seguido de `bun install --frozen-lockfile`.

## Verificación en navegador real (D116, misma fecha)

Con autorización del usuario se levantó el servidor de desarrollo (`bun run dev:background`, puerto 4321). Las pruebas usan perfiles efímeros de Playwright, aislados de los datos del navegador del usuario. `playwright-core` se instaló de forma temporal fuera del proyecto, en la versión 1.64, que corresponde a los navegadores ya descargados en el equipo. No se añadió ninguna dependencia al proyecto.

| Prueba | Resultado |
| --- | --- |
| `scripts/smoke-browser.mjs` en Chrome (OPFS real, SQLite 3.54.1) | 9/9: texto de tienda sin HTML ejecutable, 30 añadidos concurrentes desde dos Workers, revisión antes de confirmar, rechazo del importe antiguo, pedido único con total revisado, persistencia tras recargar, producto retirado fuera del carrito, sin errores JS. |
| Correcciones D115 en Chrome | 20/20: el nombre accesible del carrito pasa de 0 a «1 producto» (también en el árbol de accesibilidad); revisión «Método: Efectivo al retirar»; pedido «Efectivo al retirar · Pago pendiente»; el alta de tienda sin fecha no se guarda y con fecha guarda la elegida; sin desbordamiento horizontal en portada y compra a 320, 390, 768, 1024 y 1440 px; pedidos con texto al 200 % a 390 px; sin errores de consola. |
| WebKit (motor de Safari) | Registro, carrito y persistencia tras recargar correctos; motor SQLite 3.54.1. |
| Firefox | Correcto, igual que WebKit. |
| Firefox en modo privado | OPFS bloqueado (`SecurityError`), como se espera; la base en memoria con copia en IndexedDB conserva cuenta y carrito tras recargar. |

Se revisaron capturas de revisión de compra y pedido a 1440 px, portada a 320 px y pedidos a 390 px con texto al 200 %, sin cortes ni solapamientos. Sigue sin revisarse con lectores de pantalla reales, en Safari/iOS físico ni con teclado físico completo.

## Observaciones sin corrección (fuera del alcance de un error)

- **Peso de imágenes:** `aristi/blusa-sin-fondo.png` pesa 818 KiB y `tecnomovil/cargador-18w.png` 389 KiB, para tarjetas de unos 300 px. Además, `dist/` publica los respaldos `tienda.jpeg` (4000×3000, unos 1.3 MiB cada uno), que ningún HTML referencia. D111/D112 decidieron conservar originales y respaldos, así que no se modificaron. Se sugiere decidir si se generan versiones WebP optimizadas o si los respaldos salen de `public/`.
- **Código sin uso:** `shopById`, `offerById`, `matches` y `shopHref` de `src/lib/market.js` no se importan en la aplicación. No causan errores; pueden retirarse en una limpieza.
- **Estados de pedido:** el comprador puede marcar «recibido» un pedido aún «confirmado», y la tienda puede pasar de «entregado» a «preparando». Es coherente con el modelo local actual, pero puede definirse un orden estricto si se desea.

## Límites y pendientes

| Límite | Implicación |
| --- | --- |
| Navegador | Verificado después con autorización (ver la sección anterior). Pendiente: zoom al 400 % y lectores de pantalla reales. |
| Safari/iOS, lectores de pantalla, teclado físico, movimiento reducido del sistema | Siguen pendientes de validación manual; no se certifica WCAG 2.2 AA completa. |
| Cuota de almacenamiento, corrupción, concurrencia prolongada, hosting/HTTPS | No evaluados (igual que en D105). |
| Graphify | Instalado después de la auditoría (0.9.97, D116). Mapa regenerado sin IA; `explain`, `affected` y `path` comprobados. Hooks de Git instalados después con autorización; la integración con Codex no se ha instalado. |

## Archivos modificados

- `src/local/views.js`: B01, B03 y B04.
- `src/local/styles.css`: B05 (ancho mínimo de las etiquetas de filtro).
- `src/local/market-ui.js`: B02 (`cartLabel` y nombre accesible del carrito).
- `src/local/app.js`: B02 (actualización del nombre accesible junto al contador).
- `src/local/views.test.js`: tres pruebas de regresión.
- `package.json`, `bun.lock`: dependencias actualizadas (D116).
- `docs/auditoria-2026-11-19.md` (este informe), `PROYECTO.md` (D115 e historial) y `docs/mapa-del-proyecto.md`.

Sin commits, push ni publicación. Para repetir: `bun run check`, `bun audit --json` y `bun test src/local/views.test.js`.
