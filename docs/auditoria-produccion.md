# Auditoría de producción · 2026-10-30

Este repositorio publica Mercado Local como sitio estático, con catálogo ilustrativo y datos
SQLite guardados por perfil de navegador. Se evaluó la carga de una persona y varias pestañas
en el mismo origen, con catálogo pequeño; no un mercado compartido con cobros reales. Ese es
el alcance de publicación confirmado por el usuario en D94.

La auditoría de lectura identificó los hallazgos siguientes. La preparación posterior corrigió
los marcados como resueltos. Se conservan alcance, diseño aprobado y datos históricos; no se
crearon commits, push, tags ni despliegues.

## Prioridad alta · resueltos antes de la entrega

1. **La descripción de una tienda podía ejecutar HTML** (`src/local/views.js`, `heading`).
   - Qué hace: presenta el título y la descripción guardada desde el formulario de tienda.
   - Problema: escribir `<img src=x onerror="alert(1)">` en la descripción creaba una etiqueta al visitar la tienda. En este alcance el efecto queda en el perfil local, pero puede acceder a sus datos del mismo origen.
   - Corrección: escapar también la descripción con el helper existente; las acciones siguen siendo markup controlado. Prueba de renderizado y recorrido real desde el formulario.
   - Si se omite: contenido introducido como texto se convierte en código ejecutable.

2. **Confirmar podía guardar un importe distinto al revisado** (`src/local/transitions.js`, `app.js`, `views.js`).
   - Qué hace: la revisión muestra cantidades, entrega y total antes de crear un pedido local.
   - Problema: otra pestaña podía cambiar precio, cantidad, dirección o tarifa; al confirmar se tomaba el estado nuevo aunque el botón correspondiera a una revisión anterior.
   - Corrección: guardar la cotización validada en el borrador, mantener en el botón los datos realmente mostrados y compararlos dentro de la transacción. Si cambian, exigir revisión; conservar confirmación idempotente y cálculo en centavos.
   - Si se omite: un pedido puede contener importes o datos que la persona no confirmó. No se produce un cobro bancario en esta aplicación.

3. **Una oferta oculta podía quedar atrapada en el carrito** (`src/local/catalog.js`, `database.worker.js`).
   - Qué hace: combina catálogo inicial/local y limpia carritos anteriores.
   - Problema: al ocultar un producto, desaparecía de los artículos visibles pero seguía contado; quedaban carrito y borrador sin un artículo que se pudiera quitar.
   - Corrección: `pruneCarts` retira servicios, referencias ausentes, productos no disponibles, tienda incorrecta y cantidades inválidas; limpia carritos vacíos y sus borradores. Se ejecuta al leer y mutar, sin borrar pedidos históricos.
   - Si se omite: aparecen contadores y compras vacías que no se pueden completar.

4. **Nueve avisos en dependencias transitivas** (`bun.lock`).
   - Qué hace: Astro utiliza bibliotecas de red y validación durante desarrollo y compilación.
   - Problema: el primer `bun audit` reportó ocho avisos de Undici y uno de Zod, cinco altos y cuatro moderados. No implica que los nueve sean explotables desde el sitio estático.
   - Corrección: actualizar únicamente resoluciones compatibles: Undici 8.11.2 → 8.12.3 y Zod 4.6.5 → 4.6.7. `bun audit --json` posterior devuelve `{}` y código 0; instalación congelada y compilación comprobadas.
   - Si se omite: se conservan fallos conocidos en herramientas de construcción, aunque su exposición depende del uso.

Avisos consultados: [Undici](https://github.com/advisories/GHSA-2m5v-pch6-74hx),
[Zod](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5). El diagnóstico completo de los nueve
proviene del registro de paquetes consultado por `bun audit`, no de una prueba de explotación.

## Prioridad media · corregidos

5. **Validaciones de fecha y cantidad aceptaban valores erróneos** (`transitions.js`, `lib/market.js`).
   - Qué hace: guarda fecha de inicio y cantidades del carrito.
   - Problema: `2026-02-31` se normalizaba a marzo con `Date.parse`; una cantidad numérica 0 se convertía en 1 por `||`. Los formularios nativos frenan parte de estos casos, pero la capa de negocio también debe hacerlo.
   - Corrección: comprobar fecha de calendario exacta y usar `??` para la cantidad por defecto. Pruebas incluyen febrero bisiesto y no bisiesto; `isNewShop` comparte validación.
   - Si se omite: llamadas al repositorio o datos importados pueden guardar estados contradictorios.

6. **Archivos locales podían llegar a Git** (`.gitignore`, `debug.log`).
   - Qué hace: separa código compartido de memoria, herramientas y resultados locales.
   - Problema: `debug.log` estaba versionado y `.env.local` no estaba excluido. Había perfiles de navegador y cachés de pruebas acumulados.
   - Corrección: eliminar el registro, excluir variantes `.env*` dejando `.env.example`, logs, resultados y skills instaladas; conservar hooks del equipo. Retirados 343,66 MiB de 53 elementos temporales iniciales, sin borrar prototipos, evidencias ni originales aprobados.
   - Si se omite: registros o futuras variables locales pueden publicarse por accidente. Ignorar un archivo no lo elimina del historial anterior.

7. **La preparación no tenía una comprobación portable única** (`package.json`, `scripts/`, `.github/workflows/verify.yml`).
   - Qué hace: permite repetir verificación antes de publicar y en GitHub.
   - Problema: varias pruebas dependían de rutas de esta máquina en `design/`; un build local podía funcionar usando fuentes nuevas que aún no estaban en Git.
   - Corrección: `bun run check` reúne repositorio, 15 pruebas de lógica/renderizado, 3 de memoria, build y referencias de dist. CI con Node 24/Bun 1.4.2, lockfile congelado, auditoría, permisos mínimos y Actions fijados por SHA; genera un artefacto sin desplegar. Prueba opcional de navegador portable.
   - Si se omite: un cambio puede romper publicación sin detectarse hasta alojarlo. La CI remota aún no se ha ejecutado porque no se ha subido el cambio.

8. **El README público enlazaba documentación ignorada** (`README.md`).
   - Qué hace: orienta a quien recibe el repositorio.
   - Problema: numerosos enlaces a `design/` devolverían 404 en GitHub y la guía no precisaba raíz del dominio, HTTPS ni WASM.
   - Corrección: README portable y guías versionadas de publicación, recursos y auditoría. El historial mantiene referencias locales claramente identificadas.
   - Si se omite: una persona que clone el repositorio no dispone de instrucciones completas de publicación.

## Mejoras posteriores · no bloquean el alcance local

9. **Recursos originales y código histórico aumentan la entrega** (`public/images/`, componentes anteriores).
   - Qué hace: conserva fotografías originales y referencias de rondas previas. `public/` se copia completo a dist.
   - Problema: la distribución mide 37,77 MiB, en parte por PNG de más de 2 MiB que no son la imagen optimizada usada en las tarjetas. Es tamaño de entrega, no transferencia inicial de cada visita. Hay componentes/datos anteriores fuera de las entradas actuales.
   - Corrección propuesta: inventariar referencias históricas y separar originales de recursos públicos cuando se revise esa conservación. No se borraron imágenes o fuentes históricas como si fueran temporales.
   - Si se omite: aumenta el tamaño de subida y el mantenimiento; no fuerza a descargar cada archivo al abrir portada. Las tarjetas actuales usan carga diferida y proporciones estables.

10. **El estado local crece como un documento JSON** (`database.worker.js`, `transitions.js`).
    - Qué hace: cada transacción carga/clona/reescribe el espacio local completo.
    - Problema: miles de pedidos con fotografías incrustadas harían más costosa cada operación y podrían agotar la cuota del navegador. No se reprodujo un fallo con el catálogo actual.
    - Corrección propuesta: medir con datos del volumen real antes de convertir pedidos/ofertas en tablas separadas o añadir exportación. No introducir capas para una carga aún no requerida.
    - Si se omite: este diseño no debe presentarse como validado para historiales grandes ni almacenamiento ilimitado.

## Arquitectura y patrones

La estructura es adecuada para la versión estática local: páginas Astro → vistas compartidas →
controlador → repositorio → Worker → transiciones puras. El repositorio concentra persistencia;
la lógica de negocio no depende del DOM. SQL usa parámetros, las escrituras tienen commit/rollback,
el Worker mantiene cola y Web Locks serializa las pestañas. Los pedidos guardan precios históricos.

No se añadieron frameworks, servicios ni abstracciones nuevas. El helper de calendario, la
cotización y la limpieza de carritos se comparten en sus respectivos recorridos. CSS/Tailwind,
eventos, composición Astro, OPFS y mensajes Worker se revisaron directamente porque el grafo
no demuestra esas relaciones. `docs/mapa-del-proyecto.md` documenta estas limitaciones.

Autenticación y restablecimiento son **locales por decisión D53/D94**. PBKDF2 no convierte este
sitio en un servicio de identidad: quien controle el perfil puede acceder a SQLite o cambiar la
sesión; el correo no se verifica. Es un límite confirmado, no un mercado multiusuario seguro.
Las operaciones locales y la pasarela simulada no se deben usar como comprobantes de cobros reales.

## Evidencia y alcance comprobado

| Comprobación | Resultado |
| --- | --- |
| `bun install --frozen-lockfile --ignore-scripts` | Correcto en árbol principal y copia limpia de candidatos Git; sin cambiar el lockfile |
| `bun run check` | Correcto: 15 pruebas de lógica/renderizado, 3 de memoria, 33 páginas y referencias de 101 archivos |
| `bun audit --json` | 0 avisos al terminar; es una fotografía del registro consultado, no garantía futura |
| Chrome real, regresión D93 | 88 comprobaciones, sin fallos |
| Chrome visual/zoom | 14 comprobaciones: 320/390/768/1024/1440, texto 200 %, zoom 400 % nativo y colores forzados; capturas inspeccionadas |
| Prueba portable de navegador | 9 comprobaciones: HTML inyectado, concurrencia de 30 añadidos en dos Workers, revisión antigua rechazada, confirmación, persistencia y retirada de oferta |
| Perfil persistente | Cuenta, perfil y carrito sobreviven a cerrar y reabrir Chrome; error legible al faltar Web Locks. 2 comprobaciones |
| Seguridad del repositorio | Patrones de credenciales y archivos de entorno revisados en candidatos y único commit existente; sin coincidencias de esos patrones. No sustituye un detector completo de secretos |
| Integridad | AGENTS/CLAUDE idénticos; JSON originales del logo y barco intactos; sin imports oficiales desde design |
| Copia limpia / ZIP | Distribución idéntica byte a byte desde candidatos Git; ZIP verificado por SHA-256 para sus 101 archivos |
| Graphify sin IA | 65 archivos, 503 nodos, 1042 aristas, 25 comunidades; cobertura conservada y mapa actualizado |

Las pruebas de navegador suman **113 comprobaciones**. La prueba portable está en
`scripts/smoke-browser.mjs`; las capturas, manifiesto de limpieza, inventario y pruebas locales
complementarias permanecen en `design/auditoria-produccion-20261030/`, ignorado por Git.
El artefacto de distribución se entrega también como ZIP local; GitHub lo generará desde fuentes.

## Veredicto y límites

**Preparado para subir las fuentes y publicar el sitio estático con datos locales confirmado
en D94.** Los fallos reproducidos de seguridad, precios y carritos están corregidos y tienen
pruebas. No se afirma ausencia absoluta de errores ni cumplimiento WCAG completo.

No comprobado: Safari/iOS, lectores de pantalla, dispositivos físicos, carga de miles de pedidos,
fallos de disco/cuota reales, proveedor/HTTPS/cabeceras finales ni ejecución de Actions en GitHub.
No se auditó internamente el runtime minificado de Lottie ni el binario SQLite WASM.
El funcionamiento con navegador que bloquea capacidades se probó mediante una simulación controlada.
No se certifican derechos de las fotografías/marcas ni se otorga una licencia general al código.
Ver [publicación](publicacion.md) y [recursos](recursos.md).

Reducción realizada: 343,66 MiB de temporales iniciales; **0 dependencias añadidas**.
Los artefactos temporales de esta auditoría se limpian después de verificarlos. No se cuantifican
ahorros de código histórico que todavía se conserva.
