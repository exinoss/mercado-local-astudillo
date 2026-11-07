# Auditoría general · 2026-11-06

Estado: completada con las correcciones verificadas que se detallan abajo. Solicitud D105: revisar y corregir directamente errores comprobados, conservando las decisiones aprobadas y el alcance estático/local al navegador. Fecha del equipo: 2026-11-06, America/Guayaquil. La revisión no certifica ausencia absoluta de errores ni conformidad WCAG completa.

## Alcance y método

Código de aplicación, transiciones, formularios, persistencia local, recursos/rutas de distribución, controles de movimiento y gestión del servidor. Pruebas automatizadas, lectura dirigida desde el mapa y navegador real mediante CUA; las pruebas con escritura se aíslan del origen y cuentas del usuario.

Memoria y decisiones consultadas; GRAPH_REPORT ausente y Graphify fuera de PATH. Se intentaron explain, affected y update con backend sin IA; se usaron el mapa escrito y búsquedas acotadas. CSS/Astro/eventos/Worker/OPFS no quedan acreditados por un grafo. Skills Ponytail full y frontend-design aplicadas; no instalaciones. Para la corrección del componente se consultó la documentación oficial de [componentes Astro](https://docs.astro.build/en/basics/astro-components/) y [estilos](https://docs.astro.build/en/guides/styling/).

Se revisó la compilación con un servidor preview independiente, en loopback y otro origen, usando datos sintéticos. No se modificaron las cuentas ni los datos del origen principal. No hubo pagos reales, envío de mensajes ni llamadas telefónicas. Las capturas de Chrome se inspeccionaron sin guardar ventanas completas ni metadatos privados.

## Resultados y correcciones

| ID | Hallazgo y efecto | Corrección | Evidencia final |
| --- | --- | --- | --- |
| A01 · Media | Al recibir `pagereveal` quedaba activo el temporizador inicial además del nuevo. El primero podía limpiar el estado y cancelar el plazo del segundo antes de tiempo. | `src/lib/navigation-bootstrap.js` cancela el temporizador anterior antes de asignar el del revelado. | Nueva prueba de regresión: fallaba antes, con dos temporizadores; pasa después con uno, conserva el estado hasta el plazo correcto y termina sin temporizadores. Segunda prueba verifica ausencia de petición válida y movimiento reducido. |
| A02 · Baja | El diálogo cerrado declaraba `aria-labelledby="quick-title"`, pero ese identificador no existía en el HTML inicial de las 33 páginas. | `src/local/Layout.astro` incluye un título accesible inicial dentro del contenido del diálogo. Al abrirlo se sustituye por el título real de la oferta. | Las 33 páginas pasan la revisión de identificadores y referencias. En Chrome, el detalle anuncia su nombre, contiene el foco y se cierra con Escape devolviéndolo al producto. |
| A03 · Baja | Los resultados usaban plural incluso cuando solo había una oferta o un comercio: «1 ofertas encontradas». | `src/local/market-ui.js` elige singular o plural según el total. | Búsqueda de «freidora» en Chrome compilado: «1 oferta encontrada». El mismo criterio se aplica a comercios. |
| A04 · Mejora menor | Chrome reconocía el campo `name` de la oferta como dato personal sin una instrucción de autocompletado y mostraba un aviso. | `src/local/views.js` declara `autocomplete="off"` únicamente para el nombre del producto/servicio. | Tras compilar y recargar el formulario, DevTools muestra 0 errores de página, 0 cambios incompatibles y 0 mejoras pendientes en esa revisión. |
| E01 · Entorno local | El CLI decía que el servidor estaba detenido aunque seguía escuchando. En el sandbox, la comprobación de proceso devolvía `EPERM`; Astro interpretaba ese error como proceso inexistente y eliminaba sus metadatos locales. | Tras comprobar identidad del proceso y respuesta HTTP, se recuperó el registro ignorado `.astro/dev.json` con el helper de Astro. Las consultas de estado/cierre se ejecutaron fuera de esa restricción. | `bun run dev:status` vuelve a reconocer el servidor principal en segundo plano sin reiniciarlo. No se modificaron dependencias ni código de Astro. |

Una pantalla gris observada previamente en desarrollo no se reprodujo en el preview compilado. A01 es un fallo demostrado de temporización, pero esta auditoría **no establece que sea la causa de aquella pantalla**.

## Comprobaciones

| Comprobación | Resultado |
| --- | --- |
| `bun run check` final | Correcto: verificación de repositorio, pruebas, compilación y recursos. |
| `bun test src/` incluido en check | 26 pruebas correctas, 0 fallos, 4019 aserciones en 6 archivos. Incluye precios en centavos, descuentos, pedidos históricos, revisión vinculante de compra, restricciones de servicios y navegación. |
| Hook de memoria | 3 pruebas correctas, 0 fallos. No acredita confianza ni ejecución automática del hook en Codex. |
| Compilación | 33 páginas, 101 archivos, 37.80 MiB. |
| Referencias de distribución | Referencias locales completas; sin archivos privados de los patrones comprobados. |
| HTTP del preview | 101/101 archivos con estado 200 y bytes iguales a dist; tipos MIME comprobados para HTML, JS, CSS, WASM, SVG y WOFF2. Realizado antes del último ajuste de autocompletado; ese ajuste volvió a compilar y se verificó por recarga real de Chrome. |
| HTML inicial | 33/33 páginas sin IDs duplicados ni destinos ausentes en `for`, `aria-labelledby`, `aria-describedby` y `aria-controls`. |
| Renderizado con datos sintéticos | 60 vistas, entre visitante, sesión, tiendas y rutas parametrizadas, sin IDs duplicados ni referencias de etiquetas/ARIA rotas. Es una revisión de HTML generado, no 60 recorridos completos de navegador. |
| `bun audit --json` | Salida `{}`, código 0: ninguna vulnerabilidad reportada por el registro consultado en esta ejecución. No garantiza ausencia de vulnerabilidades desconocidas. |
| Consola Chrome | Sin mensajes de error de aplicación en las páginas inspeccionadas. El aviso de autocompletado del editor desaparece tras A04. |
| Reglas y formato | `AGENTS.md`/`CLAUDE.md` idénticos y `git diff --check` correcto. |

Recorridos revisados manualmente en Chrome, sobre datos sintéticos del origen de auditoría:

1. Portada → catálogo mediante la transición del barco → búsqueda con un resultado → detalle modal. Escape conserva la búsqueda; Shift+Tab desde el primer control vuelve al último y el cierre devuelve el foco.
2. Producto al carrito → acceso/registro local con retorno a la compra → entrega a domicilio. Subtotal $89, tarifa $1.50 y total $90.50; modo, dirección y notas se conservan después de recargar.
3. Revisión → pago simulado → pedido confirmado → marcar recibido → valoración. El flujo se completó sin cobros reales.
4. Crear tienda → agregar producto con base $25 → activar descuento rápido del 30 % → guardar a $17.50. Al editar se recuperan base y porcentaje; al quitar descuento y guardar vuelve a $25 sin promoción.
5. Crear servicio con oficio, actividades y teléfono ficticio reservado. El detalle muestra contacto directo y no ofrece carrito. No se activaron enlaces externos de contacto.
6. Descripción de tienda con etiquetas `<b>`: se muestra literalmente como texto, sin interpretarlas como HTML.
7. Mi cuenta conserva «Mi tienda» como primer acceso; panel conserva «Agregar producto» primero y «Ver mi tienda» blanco. El formulario mantiene el descuento oculto hasta marcar su casilla.

Se inspeccionaron capturas actuales del encabezado y editor a 320, 390, 768, 1024 y 1440 px: redistribución y centrado conservados, sin cortes observados en esas zonas. El descuento abierto se inspeccionó a 320 px. La revisión previa de D102/D104 de texto al 200 %, zoom al 400 %, pausa y movimiento reducido se conserva como antecedente; no se presenta como repetición completa en esta auditoría. No hubo cambios de CSS en D105.

Las referencias de `design/` permanecen conservadas: las cinco carpetas presentes tienen elección e integración registradas en D95/D96/D99/D102/D104. No apareció una nueva aprobación de prototipo pendiente.

## Gestión de servidores y reproducción

El preview propio se inició con `bun run astro preview --host 127.0.0.1 --port 4350 --background` y se detuvo con `bun run astro preview stop` tras verificar su identidad. Se comprobó el cierre del puerto. Se cerró solo su pestaña temporal y se conservaron el servidor principal y su pestaña. DevTools y emulación se cerraron; ancho de emulación restaurado al valor anterior.

El principal continúa en [localhost:4321](http://localhost:4321/). Comandos desde la raíz en macOS: `bun run dev:background`, `bun run dev:status`, `bun run dev:logs`, `bun run dev:stop`. En Windows usar `bun.cmd`. Ejecutar la gestión desde una terminal con acceso real a los procesos; un `EPERM` de sandbox no demuestra que el servidor esté detenido. Verificar identidad y puerto antes de cerrar.

Para repetir las comprobaciones automatizadas: `bun run check` y `bun audit --json`. Para la regresión A01 aislada: `bun test src/lib/navigation-bootstrap.test.js`. Los diagnósticos temporales y la salida de ejecución se conservan en `test-results/audit-20261106/`, ignorado por Git; el informe versionable es este archivo. Los cambios quedan sin commit ni despliegue y preservan los trabajos aprobados anteriores.

## Límites y pendientes

| Pendiente o límite | Implicación |
| --- | --- |
| Safari/iOS, lectores de pantalla, teclado físico completo, trackpad y movimiento reducido físico del sistema | Requieren validación manual adicional. No se certifica WCAG 2.2 AA completa. |
| Cuotas de almacenamiento, disco lleno, recuperación de corrupción y concurrencia prolongada entre pestañas | No se hicieron pruebas destructivas ni de resistencia sobre datos reales. |
| Fotografías propias | No se subieron archivos del usuario; el selector y sus tipos admitidos se inspeccionaron, sin auditar todos los formatos, tamaños y fallos de decodificación. |
| Autenticación local y restablecimiento | Se revisaron registro/retorno y restricciones del modelo. No se cambió ninguna contraseña existente ni se auditó exhaustivamente recuperación de cuentas. |
| Hosting, HTTPS, cabeceras y acceso desde otros equipos | No evaluados sobre un proveedor publicado. Véase `docs/publicacion.md`. |
| Alcance D53/D94 | Los datos siguen siendo locales al navegador; no hay backend compartido ni cobros reales. Esta auditoría no cambia esa decisión. |
| Graphify no disponible | No se pudo regenerar el grafo; `graphify update .` termina en «command not found». Mapa escrito actualizado; no se instaló software. |

No quedan fallos reproducidos sin corregir en las comprobaciones ejecutadas. Los límites anteriores son trabajo de verificación pendiente, no una garantía de que todos los escenarios posibles estén libres de errores.
