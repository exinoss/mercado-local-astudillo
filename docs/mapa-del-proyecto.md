# Mapa del proyecto

Revisado el 2026-10-30 sobre el código de esta copia.
Actualización acotada de D95/D96/D99/D102/D104/D105/D106 hasta el 2026-11-06.
D97/D98 se preservan en design/descuentos-20261105/, fuera del grafo por estar ignorado.
D99 integra A simplificada mediante los módulos compartidos descritos abajo, sin importar design/.
El contrato almacenado sigue siendo price final/old base; discountPercent es metadato opcional.
No hay migración: se recuperan porcentajes de promociones anteriores conservando sus centavos.
GRAPH_REPORT.md falta y Graphify no está disponible en esta copia; la revisión fue acotada por este
mapa, seguida de pruebas y navegador. Las relaciones DOM/CSS indicadas no están acreditadas por el grafo.
D102 integra B centrada de D101; referencia D100/D101 en design/descuento-desplegable-20261105/
(ignorada), con fuentes/compilación anterior en history/d100/ y servidor4348 cerrado.
lib/discount-view.js enlaza checkbox Agregar descuento con #offer-discount-panel mediante aria-controls;
renderiza todo el layout hidden si no hay promoción y conserva fieldset oculto/deshabilitado.
local/discount-controls.js sincroniza hidden del panel y controles al cambiar casilla, precio o porcentaje.
local/discount-styles.css iguala paneles y presets; capa utilities centra .offer-editor-page, limita
panel960px/formulario720px y centra el primer wrapper del título. views.js añade esa clase solo a
/editar-oferta/, compartida por Agregar producto/Añadir oferta/edición. Las demás páginas conservan composición.
La capa utilities evita que container/justify-between anulen el ajuste. No cambia el contrato D99.
El artefacto y relaciones CSS/DOM no están cubiertos por el grafo. Pruebas de renderizado y Chrome
confirman bloque cerrado inicial, promoción existente abierta, cinco anchos, texto200 y zoom400.
Complementa `graphify-out/GRAPH_REPORT.md`; no sustituye las decisiones de `PROYECTO.md`.
El grafo ayuda a localizar símbolos; este mapa describe rutas, eventos y estilos que no cubre bien.

D106: `views.page` enlaza Agregar producto con `modo=producto` y usa ese contexto para
mostrar «Añade un producto». Añadir oferta conserva el acceso genérico; edición mantiene su título.

## Auditoría D105

Informe: `docs/auditoria-2026-11-06.md`. `navigation-bootstrap.js` cancela el watchdog
inicial al recibir `pagereveal`, antes de asignar el nuevo plazo. La regresión se prueba
en `src/lib/navigation-bootstrap.test.js` con reloj/eventos simulados en VM; no demuestra
por sí sola pintura real ni el origen de una pantalla gris. Chrome valida navegación/modal.
`Layout.astro` conserva `#quick-title` desde el HTML inicial, reemplazado por `offerDetail`
al abrir el diálogo. `market-ui.renderSpecialPage` adapta el recuento al singular/plural.
`views.page` declara autocomplete off en el nombre de oferta para evitar autofill personal.
Sin cambios de diseño/CSS ni contrato de datos. Graphify explain/affected/update no disponibles;
se usaron este mapa y búsquedas acotadas. Suite vigente: 26 pruebas de aplicación (4019
aserciones), más 3 del hook; build33 y recursos completos. Los recuentos históricos de
secciones anteriores describen sus propias revisiones, no la suite actual.

## Autoría de cabecera D104 · A integrada

`renderHeader` de `src/local/market-ui.js` genera `.proposal-emphasis` dentro de `.header-lower`, con
texto intacto y SVG decorativo `.proposal-frame`, rectángulos `.proposal-track/.proposal-snake`.
`src/local/styles.css` contiene geometría adaptable, rojo canónico, ciclo5s y padding12px en texto200.
`logo-motion.controls` publica `data-logo-paused` en raíz; CSS anima cuando está inicializado y congela
con pausa o documento oculto. Movimiento reducido muestra borde fijo; sin JS el borde también es fijo.
Se reutiliza botón de Accesibilidad `data-logo-pause`, ahora «Pausar logos y marco»; sessionStorage,
restablecimiento y preferencias existentes conservados. Footer D56 intacto.
`design/autor-propuesta-20261105/` conserva comparación D103 A/B/C y compilación anterior; no reconstruir
sin adaptar al markup integrado, para no duplicar SVG. Servidor4349 cerrado tras registrar D104.
Fuentes del comparador fuera del grafo por estar ignoradas. SVG/CSS/movimiento y eventos requieren
navegador: Chrome oficial revisado en cinco anchos, texto200/zoom400, pausa y movimiento reducido.
GRAPH_REPORT/comando Graphify siguen ausentes; affected/update intentados y búsquedas acotadas por mapa.

## Preparación D94

Alcance estático local confirmado, con auditoría en `docs/auditoria-produccion.md` y requisitos
de alojamiento en `docs/publicacion.md`. No se añade backend ni cambia el diseño aprobado.

- `catalog.pruneCarts` amplía la limpieza D93: productos retirados, referencias ausentes,
  servicios, tienda incorrecta y cantidades inválidas; Worker y transiciones lo comparten.
- `checkoutQuote` guarda líneas, precios en centavos y entrega en el borrador validado;
  `sameQuote` compara revisión y estado actual. `order` exige esa revisión y conserva idempotencia.
  `views` incluye la copia revisada en el botón; `app` envía esa copia sin sustituirla al refrescar.
- `views.heading` escapa descripción y título. `lib/market.isCalendarDate` valida calendario
  real tanto para la tienda como para determinar si es nueva. `add` rechaza cantidad cero.
- `scripts/verify-repository.mjs` comprueba candidatos Git, exclusiones y patrones de secretos;
  `verify-dist.mjs` revisa referencias locales de la salida. La prueba de navegador opcional
  es portable mediante variables de entorno; no depende de la carpeta design.
- `.github/workflows/verify.yml` verifica con lockfile y genera dist sin desplegar.

El grafo sigue sin demostrar corrección de HTML escapado, igualdad de cotizaciones, garantías
entre pestañas, comportamiento del navegador ni configuración del proveedor. Se verifican con
pruebas de dominio, renderizado y Chrome real. La revisión D93 siguiente se conserva como historia;
`pruneServiceCarts` fue sustituido por `pruneCarts` en D94.

## Revisión directa D93

El usuario autoriza expresamente implementar sin prototipo estos ajustes. Revisan D12/D57/D58/D65/D83.

- `accessibility-view.js` contiene los únicos botones de pausa de logos y carrusel. `logo-motion.js`
  conserva la pausa de sesión y escucha el restablecimiento `market-motion-reset`; `accessibility.js`
  lo emite al restablecer. `animated-logo.js` ya no genera pausas en header/hero/acceso.
- `market-controls.js` conserva la altura común, flechas/selección y8s automático. Pausa por foco,
  puntero, ventana oculta, modal o preferencia; reanuda al salir cuando corresponde. Los controles
  solo se generan en Accesibilidad. `sizeReferenceCarousel` coloca las flechas sobre el arte en móvil.
- `global.css`, capa utilities: `select:not([multiple])` conserva controles nativos con chevron SVG
  y padding de44px; en colores forzados vuelve a la flecha nativa. Incluye filtros y formularios.
- `views.page` devuelve HTML neutral para rutas privadas sin cuenta; `app.start` valida repositorio
  antes de renderizar y redirige con replace al acceso. Evita la tarjeta/formulario de tienda previo.
- `market-ui.accessPage` reutiliza `renderAnimatedAccess` para acceso y registro. Restablecer conserva
  su composición. Registro también presenta primero el formulario en móvil.
- `Layout.astro` incluye siempre quick-dialog. `app.showOffer` delega en `views.detail` y mantiene
  URL `?oferta=…`, historial, filtros, retorno de foco, Escape y respuesta de añadido dentro del modal.
  `/oferta/?id=…` abre el mismo modal sobre catálogo; links modificados y tiendas siguen nativos.
- `lib/services.js`: normaliza teléfonos y agrupa ofertas disponibles por oficio/profesional/tienda.
  `local/service-view.js` presenta listado y ficha seleccionada: actividades, precio del servicio
  elegido, horario, ubicación, tienda y contactos publicados. No inventa teléfonos ni personas.
  `views.js` añade oficio, profesional, actividades, teléfono y WhatsApp al formulario de servicio;
  `app.updateServiceFields` alterna esos campos según el tipo. `transition` valida y guarda los datos.
- `catalog.pruneServiceCarts` retira solo servicios de carritos/drafts anteriores. El Worker lo
  ejecuta al leer dentro de su transacción y persiste cuando cambia. `cartItems`, add y migrate
  admiten productos; pedidos históricos se conservan, sin cambio del esquema SQLite.

El grafo no valida eventos delegados, history/popstate, foco/inert nativo del diálogo, selectores
CSS, puntero, relojes, OPFS ni redirecciones antes de pintar. Ver `design/cambios-finales-20261030/`.
Las secciones siguientes conservan referencias de rondas anteriores; D93 rige los recorridos afectados.

## Propósito y límites

Mercado Local presenta productos, servicios y comercios urbanos de San Lorenzo.
La aplicación es estática; Astro compila las páginas y el navegador guarda las operaciones.
Las cuentas, tiendas, carritos, pedidos y valoraciones pertenecen al perfil local del navegador.
No hay backend, sincronización entre dispositivos ni cobros externos.
Para cambiar alcance o diseño, leer primero `PROYECTO.md` y las reglas visuales de `AGENTS.md`.

## Entradas de compilación

- `package.json`: scripts, versiones de referencia y dependencias.
- `bun.lock`: resolución de dependencias con Bun.
- `astro.config.mjs`: Astro con Tailwind mediante Vite; SQLite se excluye de optimizeDeps.
- `tsconfig.json`: configuración de TypeScript utilizada por Astro.
- `src/pages/index.astro`: entrada de portada.
- `src/pages/[...path].astro`: genera las rutas de `localPagePaths`, excepto la portada.
- `src/pages/tiendas/[slug].astro`: genera páginas para las tiendas iniciales de `seedShops`.
- `src/layouts/Layout.astro`: delega en el layout compartido con espacio `main-v1`.
- `src/local/Layout.astro`: estructura HTML, título, estado inicial, cabecera, pie y script cliente.

La compilación comprobada tras D73 genera 33 páginas: 22 rutas comunes y once tiendas iniciales.
Los detalles variables usan identificadores en la URL sobre páginas estáticas.

## Rutas y navegación

`src/local/routes.js` define títulos, rutas generadas, rutas protegidas y variantes aprobadas.
`approvedVariants` conserva A/B/A/B: páginas, identidad secundaria, catálogo compacto y acceso flotante.
`localPagePaths` deriva de `pageTitles`; añadir una ruta requiere comprobar ambas vistas y navegación.
`protectedPaths` restringe recorridos en el cliente; no es autorización de un servidor.

| Recorrido | URL o fuente |
| --- | --- |
| Descubrimiento | `/`, `/catalogo/`, `/comercios/`, `/promociones/` |
| Oferta | `/oferta/?id=…` |
| Tienda inicial | `/tiendas/[slug]/` |
| Tienda creada localmente | `/tiendas/ver/?id=…` |
| Cuenta | `/registro/`, `/acceso/`, `/restablecer/`, `/cuenta/` |
| Selecciones | `/direcciones/`, `/favoritos/`, `/carritos/` |
| Compra | `/compra/`, `/pago/`, `/pedidos/`, `/pedido/` |
| Comercio propio | `/panel/`, `/mi-tienda/`, `/editar-oferta/` |
| Información | `/ayuda/`, `/propuesta/` |

Los filtros viajan en `q`, `categoria`, `tipo` y `nuevos`; no crear otra fuente de estado para ellos.
`views.h` construye enlaces y añade parámetros de comparación solo en el comparador.
`safeNext` en `app.js` comprueba el destino de regreso después del acceso.
`restoreContext` recupera la posición guardada al visitar detalles.

## Catálogo y estado

- `src/data/catalog.js`: fuente del catálogo inicial, categorías y diapositivas comerciales.
- `src/local/catalog.js`: adapta tiendas y ofertas iniciales a los recorridos locales.
- `seedShops` incorpora dirección, horario, modalidades e imagen de cada tienda inicial.
- `seedOffers` incorpora imagen y disponibilidad.
- `catalog(state)` combina datos iniciales con tiendas y ofertas del propietario.
- `initialState()` crea carritos, favoritos, tiendas, ofertas, pedidos, valoraciones y borradores vacíos.
- `cents` y `dollars` convierten importes para los cálculos en centavos.

`src/data/products.js` conserva datos anteriores; no es la fuente del catálogo activo.
Antes de reutilizar restos anteriores, revisar sus imports y las decisiones vigentes.
No duplicar el catálogo entre páginas, ventanas, pruebas y actualizaciones del navegador.

## Renderizado compartido

`src/local/views.js` exporta `createViews` y construye HTML a partir de ruta, parámetros y estado.
Se usa al compilar y al actualizar el navegador: evitar un segundo renderizador del recorrido.
`src/local/market-ui.js` comparte cabecera, pie, portada, listados, acceso, filtros y tarjetas;
`views.js` conserva enlaces, formularios, detalles, tiendas, cuenta, compra y estados vacíos.
`page` selecciona el contenido según la ruta y la cuenta.
`header` y `footer` comparten identidad, navegación, búsqueda y acciones.
D95 (2026-11-05): la rama `/cuenta/` de `views.page` sitúa el enlace `/panel/`
«Mi tienda» primero en el DOM y usa la clase primaria `button` (rojo corporativo).
Reutiliza `global.css`/`theme.css`, sin estilos nuevos ni cambios al menú de cabecera.
D96: la rama `/panel/` añade primero «Agregar producto» con `button`; «Ver mi tienda»
usa `button secondary`. Reutiliza `/editar-oferta/` y el handler `offer` existente:
nombre, tipo (Producto por defecto), categoría, descripción, precio y descuento (D99),
fotografía y disponibilidad. `app.fileImage` optimiza la foto; `transition` valida el producto.
Editar tienda y Añadir oferta conservan estilo/destino. Sin otro formulario ni CSS nuevo.
D99: `/editar-oferta/` llama a `src/lib/discount-view.js::renderDiscountFields` tanto al crear
como al editar. `src/lib/discount.js::discountQuote` valida y calcula centavos; `discountForOffer`
recupera base/porcentaje desde price/old y respeta el metadato válido al editar.
`app.render` llama a `initializeDiscountControls` de `src/local/discount-controls.js` después de
habilitar formularios: checkbox, presets, cifra, range, errores y resumen se sincronizan por eventos.
El handler offer envía basePrice/discountPercent (cero si se desactiva); `transition` calcula price/old
con el helper compartido, sin confiar en precios finales del cliente. Conserva compatibilidad con
payloads anteriores de price/old. `discount-styles.css`, importado por styles.css, comparte tokens
Tailwind y adapta foco, lectura ampliada y movimiento reducido. Sin controles de precisión ni±1.
`renderCard` y `renderGrid` en `market-ui.js` agrupan oferta, tienda, fotografía, precio y acciones.
`detail` presenta la oferta y el formulario de cantidad.
`renderHome` organiza categorías, emprendimientos nuevos, productos, promociones y oficios.
El layout incorpora este HTML con `set:html`; conservar el escapado de los valores variables.
`escapeHtml` procede de `src/lib/market.js`.

## Controlador del navegador

`src/local/app.js` inicia el repositorio, consulta el estado y conecta el HTML con los eventos.
`start` migra carritos anteriores, recupera datos y borradores e inicia la accesibilidad.
`render` actualiza el contenido, formularios, contadores, compra y contexto.
`refresh` relee el repositorio antes de renderizar cuando corresponde.
`perform` ejecuta una mutación y actualiza la interfaz con su resultado.
`badges` mantiene contadores y enlaces de cuenta.
`say` anuncia resultados mediante el área de estado.
`market-controls.js`, importado por `app.js`, controla el carrusel: inicio automático cada ocho segundos, pausa visible, selección y flechas con teclado. Detiene foco/interacción/ocultación y respeta movimiento reducido. Observa reemplazos de `#main` para conservar la pausa. También coloca el control de lectura y protege foco visible. El grafo no valida estas relaciones DOM.

La delegación de eventos conecta atributos `data-*` con acciones por nombre.
Los formularios `data-form` llaman a registro, acceso, restablecimiento o mutaciones.
Los botones `data-add`, `data-favorite` y `data-quantity` actualizan selecciones.
Los botones de recepción, pago, estado y borrado afectan pedidos o datos propios.
Estas relaciones de texto no equivalen a llamadas directas que el grafo pueda demostrar.
Los formularios permanecen desactivados hasta abrir el almacenamiento local.

## Repositorio y Worker

`src/local/repository.js` exporta `createRepository(namespace)`.
El espacio principal es `main-v1`; el comparador usa `proposal-review-v1`.
`request` envía `{ id, namespace, operation, args }` al Worker y espera la respuesta con ese ID.
Las operaciones de cuenta son `register`, `login`, `reset`, `read` y `legacy`.
`mutate(action, payload)` transmite una acción funcional al Worker.
La cuenta de la pestaña se conserva en `sessionStorage`; los datos persistentes viven en SQLite.
`BroadcastChannel` avisa de cambios a otras pestañas del mismo espacio.
`migrateLegacy` importa carritos anteriores una sola vez en el espacio principal.

`src/local/database.worker.js` importa SQLite WASM y la URL del binario mediante Vite.
`execute` valida espacio y operación, adquiere Web Lock y abre SQLite en OPFS.
El VFS es `opfs-sahpool`; la conexión se cierra y el VFS se pausa al terminar.
El esquema usa `PRAGMA user_version`; una versión más nueva impide modificar datos.
`accounts` guarda cuentas y credenciales derivadas; `workspaces` guarda el estado JSON por propietario.
Las operaciones usan transacciones, commit y rollback.
`derive` utiliza PBKDF2 mediante Web Crypto; no guardar contraseñas como texto.
`self.onmessage` procesa peticiones en cola y responde con resultado o error.
La comunicación por mensajes y su orden requieren pruebas de navegador además del grafo.

## Reglas de negocio

`src/local/transitions.js` exporta `transition` y `cartItems`.
`transition` clona el estado anterior y aplica una acción validada.
Visitantes pueden añadir, cambiar cantidades, retirar y migrar carritos.
Favoritos, cuenta, tienda, pedidos y valoraciones requieren cuenta local.
Las cantidades son enteros de 1 a 99 y los carritos se separan por comercio.
Las ofertas de tienda propia validan pertenencia, categoría, precio e imagen.
Las compras guardan artículos y precios históricos en centavos.
El ID del borrador permite confirmar sin crear pedidos duplicados.
La confirmación vacía solamente el carrito de esa tienda.
Pedidos y valoraciones conservan sus restricciones de estado y propietario.
`cartItems` combina referencias del carrito con ofertas disponibles y calcula importes de línea.

Para cambiar una regla, revisar `transition`, los controles de `views` y los eventos de `app`.
Registro y contraseñas se validan en el Worker; no trasladar SQL a las vistas.
El restablecimiento directo forma parte del alcance local acordado en `PROYECTO.md`.

## Accesibilidad y estilos

- `src/lib/accessibility-view.js`: botón y ventana de preferencias, incluidos icono y ubicación.
- `src/lib/reading-settings.js`: valores iniciales, clave de almacenamiento y normalización.
- `src/scripts/accessibility.js`: aplica tamaño de texto, contraste y movimiento y guarda preferencias.
- `src/lib/dialog.js`: apertura y cierre, Escape y devolución del foco.
- `src/local/modal.js`: contención del foco en ventanas.
- `src/lib/icons.js` y `src/components/Icon.astro`: recursos SVG y representación del icono.
- `src/lib/market-logo.js`: M1 elegido, con puerta contenida, dos olas y ave. Fuente vectorial compartida
  por el encabezado y los artefactos; `public/favicon.svg` y `public/images/branding/mercado-local.svg`
  son exportaciones del mismo símbolo. El logo no se mezcla con los iconos funcionales de tiendas.
- `src/styles/theme.css`: fuentes y variables de identidad en `@theme`.
- `src/styles/global.css`: Tailwind, base, utilidades, estados y patrones compartidos.
- `src/local/styles.css`: importa estilos globales y añade los patrones locales.

La composición está en `market-ui.js`, `views.js` y patrones Tailwind de `local/styles.css`.
`@theme` de `theme.css` define paleta y `--background-image-market-page`, usado por `body::before`.
D75 mantiene el fondo fijo detrás del contenido; `paintBackground`/`scheduleBackground` en
`market-controls.js` actualizan `--market-wash-height` y `--market-wash-middle` según scroll.
Alcance100→24vh y parada intermedia72→18 %, con franja24vh estable si se reduce movimiento.
Se recalcula por resize, ResizeObserver del cuerpo, pageshow y preferencia del sistema/guardada.
El grafo no valida el pseudo-elemento, stacking, progreso, eventos ni observadores DOM.
El carrusel ocupa el 100 % sin máximo; la máscara de la imagen revela ese fondo. Los recorridos
funcionales usan `.market-page-panel` blanco. `public/banners/` conserva seis SVG responsive aprobados
con fotografías/fuentes incrustadas, procedentes del generador del artefacto elegido.
Los selectores de lectura dependen de atributos del elemento raíz y de `prefers-reduced-motion`.
El grafo no representa CSS ni comprueba contraste, zoom, teclado, foco o movimiento.
El cambio visual exige el comparador y la elección establecidos en `AGENTS.md`.

## Recursos y archivos de apoyo

`public/` sirve imágenes, fuentes y favicon; no sustituye la procedencia de cada recurso.
`src/local/carlos-logo.webp` se importa desde las vistas y pasa por Vite.
`src/components/Welcome.astro` y `Accessibility.astro` no son las entradas de las páginas actuales.
`design/` está ignorado y no aparece en el grafo. D73 aprueba expresamente la captura de
`design/mercado-20261028/`; D74 ajusta ancho y fondo. Sus vistas, catálogo y controles activos se
promovieron a `src/`; el artefacto añade solamente comparadores mediante su adaptador Vite.
La aplicación no importa `design/`. Consultar `APROBACION.md` y `README.md` para límites y evidencia.
D75 se comparó aparte en `design/fondo-scroll-20261028/` desde una copia de dist/ actual.
A elegida e integrada; controles solo en la referencia y servidor4336 detenido. Su snapshot
conserva el sitio anterior al ajuste y sus pruebas. Esta carpeta tampoco aparece en el grafo.
Las otras rondas se conservan como historia, sin usarlas como base de nuevos diseños.
`.vscode/` conserva recomendaciones y asociaciones de estilos.
`.codex/` contiene integración de Graphify y carga de memoria; detalles en `contexto-agentes.md`.

D76 integra la escala A elegida en `src/local/styles.css`: logo60×80, ubicación16px/peso500,
marca34/40, navegación/cuenta16, búsqueda18 y autoría16px. Los iconos del header crecen a26px;
la regla del SVG de marca va después para conservar su tamaño completo. En lectura200 y
pantallas de hasta600px, la marca redistribuye logo/texto. No cambia `renderHeader` ni M1.
Referencia `design/header-legible-20261028/` conservada, con snapshot anterior y servidor4336
detenido tras elegir. No aparece en el grafo; PLAN.md/README.md explican medidas y pruebas.

D77 compara transiciones en `design/transiciones-20261029/`, ignorado y fuera del grafo.
La base es dist/ actual; no cambia src/. `navigation.js` reutiliza preferencias normalizadas,
conserva páginas reales y espera data-ready/fuentes. `server.mjs` añade solo la capa y scripts
al HTML de la referencia. Web Animations/SVG, sessionStorage privado, historial y redirección
a acceso no se validan por aristas del grafo: consultar PLAN.md, REFERENCIAS.md y README.md.
El usuario toma C como base de pruebas D78; servidor4336 cerrado al sustituir la ronda.

D78 está en `design/olas-20261029/`, también ignorado y fuera del grafo. Reutiliza el
controlador D77 sobre dist/ vigente, namespace `waves-review-v1`, servidor propio4337.
`wave-art.js` dibuja curvas, rizo, espuma y burbujas a escala de la ventana; `navigation.js`
mueve el grupo SVG interno hacia abajo, preservando el viewport para evitar recortes.
La B es translúcida durante el movimiento; una capa opaca cubre el cambio de documento.
Todas las animaciones se cancelan al restablecer la capa o activar movimiento reducido.
No cambia src/. CSS/SVG, composición dinámica, WAAPI, pintura real y almacenamiento se
comprueban en navegador; el grafo no demuestra su funcionamiento. PLAN.md/README.md y
evidence/ registran alcance y resultados. Las tres opciones se rechazaron en D79;
se conservan los archivos y se cierra su servidor4337.

D79 compara marea en `design/marea-20261029/`, fuera del grafo por estar ignorado.
`shore-art.js` genera un frente de orilla irregular y espuma procedural acotada a una
franja SVG. `navigation.js` mueve el grupo a la derecha, anima burbujas independientes,
inicia la variación de espuma y elimina sus nodos al terminar/cancelar. Conserva el
controlador de páginas reales y las preferencias actuales; namespace `tide-review-v1`.
No reutiliza la forma rechazada ni cambia src/. `transitions.css` usa Tailwind y variables
decorativas locales: @theme tras @reference no las emitía en este build aislado, comprobado
en píxeles. Pintura, filtros, SMIL y WAAPI requieren navegador; no inferirlos del grafo.
PLAN.md/README.md y evidence/ documentan diseño y verificación. C elegida después en D80;
servidor propio4338 detenido y referencia conservada.

## Transición de páginas aprobada D91 · B Página al paso

- `src/lib/boat-transition.js`: trayectoria B,2100ms+120ms, posición/tamaño responsive,
  máscara detrás de la popa y fases entrar/bucle/salir. Prueba de continuidad y salida completa.
- `src/assets/barco-transicion.min.json`: archivo original del usuario, sin alteraciones.
  Poster exacto frame45 en `public/images/branding/boat-transition.svg`; mismo runtime Lottie local.
- `src/local/Layout.astro`: declaración View Transitions crítica inline antes de CSS externo,
  bootstrap autocontenido en head y capa decorativa con poster/reproductor. Sin iframe ni router.
- `src/lib/navigation-bootstrap.js`: recibe normalizador/clave de lectura; valida origen, destino,
  edad y redirección de acceso. `pageswap`/`pagereveal` enlazan documentos reales. Límite4500ms,
  omisión segura si la transición nativa no está disponible y manejo de promesas rechazadas.
- `src/local/page-navigation.js`: inicializa tras manejadores de app.js; guarda solo metadatos
  de enlaces internos elegibles, sin interceptar la navegación. Espera data-ready/fuentes/JSON
  con límites y mueve barco/máscara en un único RAF. Limpia Lottie, inert y aria-busy al terminar.
  Escape finaliza el efecto en el destino; teclado enfoca main. Preferencias, visibilidad,
  BFCache, formularios, enlaces modificados e historial conservan comportamiento nativo.
- `src/local/styles.css`: grupos nativos root/market-boat, captura antigua sobre destino vivo,
  máscara gradual y barco sobre ambas páginas. Se retiran espuma y estilos/tokens celestes activos.
  `src/lib/tide.js` permanece solo como referencia de D80 para los artefactos históricos.

Estado temporal: sessionStorage `mercado-local:boat-transition-v1`, solo URL, fecha y origen
de teclado; sin cuentas/pedidos. `window.marketPageNavigation` comunica bootstrap y módulo.
El bootstrap/normalizador serializados deben ser autocontenidos: verificar dist/ y desarrollo.
CSS, capturas nativas entre documentos, máscaras, Lottie, foco y relojes son puntos ciegos del
grafo. La arista de importación no prueba su comportamiento; requieren navegador real.
Evidencia y límites en design/barco-solo-20261030/APROBACION.md y evidence/official/.
La evidencia anterior de design/marea-20261029/ describe D80, sustituida por D91.

## Prototipo de logo JSON D81

Esta sección describe las rondas históricas D81/D82. D83 integró después el JSON,
la entrada/bucle y la cuarta diapositiva; D85/D86 integraron Destacada y la altura común.
Las menciones siguientes de integración pendiente pertenecen al estado original de esas rondas.

Archivo del usuario en src/assets/logo-mercado-local.min.json, sin import oficial todavía.
Es Lottie240×288/60fps/4,5s, tres capas de formas sin imágenes externas ni expresiones.
`design/logo-json-20261029/`, ignorado y fuera del grafo, copia dist/ vigente y sustituye
el símbolo SSR por un SVG derivado. `preview.js` coloca Lottie después de data-ready y
vigila cambios del header; A reproduce una vez y B fija. Usa el movimiento reducido
canónico y destruye instancias al cambiar. `export-poster.mjs` produce el fijo desde frame269.
Reproductor oficial versionado local al artefacto, licencia y hashes en su README.
Servidor4340, namespace logo-review-v1; M1 oficial y sus fuentes conservados.
JSON, reproductor, DOM dinámico y preferencias no se validan con el grafo: consultar
PLAN.md/README.md y evidence/. Revisión e integración pendientes.

D82 amplía ese artefacto: build-site.mjs compila las fuentes actuales con un adaptador
Vite que añade la primera diapositiva y vuelve dinámico el recuento del controlador canónico.
No modifica src/ ni dist/. Salida site-loop/ y caché propia; site/ conserva D81.
hero.js comparte mensajes/markup; preview-loop.js administra ambos logos usando los
marcadores entrada0–90/bucle90–270, con pausa y suspensión por visibilidad. El carrusel
oficial conserva tres imágenes; el prototipo tiene cuatro. El adaptador está fuera del
grafo por estar design/ ignorado: consultar PLAN-LOOP.md, README.md y evidence/loop/.
Servidor4340; presentación e integración pendientes.

## Para cambiar X, consultar Y

D90 sustituye D89 con design/barco-solo-20261030/, ignorado y fuera del grafo.
Base build33 nueva, mismo JSON original, servidor4343/comparador/. No importa
renderTide ni genera agua/espuma/burbujas: solo figura y tratamientos de página.
preview.js prepara el destino en un segundo iframe del mismo origen antes del
cruce; los roles se intercambian al salir, con progreso1/opacidad0 en A/C. B revela
el destino mediante máscara gradual mientras avanza. A usa blanco detrás del barco;
C atenúa/enfoca el fondo. Velocidad continua, sin espera central ni pausa por carga.
El reloj comparte Lottie/posición/fundidos, preferencias y foco; historial del
comparador conserva rutas. Namespace boat-solo-review-v1, efecto nativo anulado
solo en el HTML de la copia. B fue elegida e integrada después mediante D91.
Preparación de documentos, inert/ARIA, máscaras/filtros, cuadros, tiempo y preferencia
son relaciones dinámicas no validadas por el grafo: PLAN.md/README.md/evidence/.
4343 de D90 quedó cerrado tras registrar D91;4342 de D89 sigue cerrado y ambos conservan archivos.

D89 está en design/barco-ola-20261030/, ignorado y fuera del grafo: copia una
compilación nueva del sitio vigente y compara barco+marea en /comparador/ (4342).
El recurso original es src/assets/barco-transicion.min.json; D89 no lo integró. D91 sí lo importa.
prepare.mjs coteja SHA256 y guarda huellas de src/. El comparador sirve renderTide y
reading-settings canónicos por rutas explícitas; reutiliza el reproductor local vigente.
preview.js coordina un reloj de dos fases, curvas A/B/C, Lottie entrar/bucle/salir y
la geometría/espuma/burbujas C. La capa del padre permanece sobre un iframe del sitio
actual, namespace boat-review-v1; solo en la copia se anula el bootstrap de transición
para evitar efectos dobles. El padre observa preferencias del mismo origen y conserva
el encuadre del iframe al ampliar texto. No se importan archivos de design/ en src/.
La continuidad entre documentos principales necesita integración después de elegir;
este artefacto evalúa la coreografía. Iframe, preferencias, pintura/SMIL, geometría,
temporización y legibilidad requieren navegador; consultar PLAN.md/README.md/evidence/.

D85 integra Destacada: `renderAnimatedAccess` en animated-logo.js se usa únicamente
en /acceso/ desde accessPage. Escala/alineación elegidas en estilos canónicos,
sin data-login-layout ni comparadores oficiales; animación compartida sin cambios.
D86 añade `sizeReferenceCarousel` a market-controls.js: mide la altura natural de
.logo-hero incluso oculto, con display temporal importante por la regla global [hidden].
Restaura el estilo en la misma tarea, sin cambiar hidden/foco ni pintar el elemento.
Fija altura del área de imágenes al montar, resize/lectura, pageshow y fonts.ready.
Con data-sized, los banners usan object-contain; contador/reproducción reservan ancho
para evitar variar las filas en móvil. DOM, geometría, pintura y carga de fuentes
requieren navegador: evidencia/stable/ y evidence/selected/ del artefacto conservado.
4341 quedó cerrado tras elegir; no reconstruir su adaptador anterior sobre D85.
El párrafo D84 inferior es histórico y su integración pendiente quedó resuelta por D85.

D83 integra A en las fuentes oficiales: `src/lib/animated-logo.js` genera el símbolo,
la pausa y la diapositiva comercial; `src/local/logo-motion.js` comparte el ciclo de
las instancias `data-animated-logo`, con marcadores del JSON importado como URL.
`Layout.astro` carga el reproductor diferido local de public/vendor/lottie-web/;
el módulo espera DOMContentLoaded y body[data-ready], con poster fijo ante fallos.
Pausa en sessionStorage, visibilidad, reemplazos de header/main y movimiento reducido
se comprueban en navegador; las aristas del grafo no validan pintura ni temporización.
El JSON del usuario permanece intacto; SVG derivado en public/images/branding/mercado-local-motion.svg.
`market-ui.js` usa la primera diapositiva A y tres promociones; `market-controls.js`
deriva el total del DOM. La máscara común76→100% afecta la superficie amarilla y las
fotografías, dejando texto/controles del banner HTML fuera de la máscara.
D83 también da ancho completo a cuenta en móvil/lectura200 y coloca carrito en otra fila.
M1 se conserva como fuente histórica y favicon; ya no representa el header activo.

D84 nuevo está en design/acceso-animado-20261029/, ignorado y fuera del grafo.
Su adaptador de compilación sustituye solo el panel azul de /acceso/ usando las
fuentes actuales y el mismo helper/runtime de animación. No duplica formularios
ni toca cuentas: namespace access-review-v1 y servidor4341. Compacta/Destacada
comparan escala/alineación, con mensaje B elegido y formulario primero en móvil.
Salida site/ y caché propias. Acceso oficial aún sin integrar; consultar su PLAN.md,
README.md y evidence/. El adaptador D82 anterior queda congelado y4340 cerrado.

| Cambio | Empezar por |
| --- | --- |
| Nueva página | `routes.js`, `views.js`, `src/pages/[...path].astro` |
| Oferta o tienda inicial | `src/data/catalog.js`, adaptación en `src/local/catalog.js` |
| Tamaños de header y logo | `.market-brand`, `.market-brand-symbol`, `.header-*`, `.market-search` en `local/styles.css`; D76 |
| Tarjetas y filtros | `renderCard`, `renderGrid`, `renderSpecialPage` en `src/local/market-ui.js` |
| Fondo durante el scroll | `paintBackground`, `scheduleBackground`, `body::before`, `theme.css`, D75 |
| Carrusel y control de lectura | `src/local/market-controls.js`, `renderHome`, eventos `data-hero-*` |
| Barco entre páginas | `navigation-bootstrap.js`, `page-navigation.js`, `boatFrame`, Layout.astro y D91 |
| Cantidades, pedidos o valoraciones | `transition`, `cartItems` y sus pruebas |
| Persistencia y cuentas | `createRepository` y `execute` en el Worker |
| Borradores de compra | `saveCheckout`, `recoverPendingDraft` y acciones `draft-*` |
| Accesibilidad | `accessibility-view`, `reading-settings`, `accessibility.js`, helpers de ventana |
| Identidad y estilos | `theme.css`, `global.css`, utilidades de `views.js`, aprobación visual |
| Contexto de agentes | `AGENTS.md`, `CLAUDE.md`, memoria local y `.codex/hooks.json` |

## Verificación

`bun.cmd test src/local/transitions.test.js` ejecuta seis pruebas con 30 aserciones.
`bun.cmd run build` requiere instalar las dependencias del sitio.
Los cambios de interfaz requieren navegador real y los tamaños/zoom de `AGENTS.md`.
Usar `graphify affected` antes de cambiar símbolos y `graphify update .` al terminar.
Las aristas `INFERRED` son hipótesis; importaciones o contención no prueban una llamada funcional.
No afirmar cobertura completa de Astro, pruebas funcionales o conformidad WCAG por tener un grafo.
