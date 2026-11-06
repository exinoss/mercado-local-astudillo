# Antes de cualquier tarea (obligatorio)

1. Lee `PROJECT_MEMORY.md` completo y las decisiones vigentes de `PROYECTO.md`. En la primera respuesta de cada sesión indica en una línea la fecha de «Estado actual» que leíste. Si falta la memoria, créala con la plantilla de «Memoria y contexto», usando solo información comprobada.
2. Señala las contradicciones con decisiones registradas. Una petición explícita del usuario puede revisarlas y debe registrarse sin borrar la historia; si la intención es ambigua, pregunta antes de cambiarla.
3. Antes de buscar o leer código, consulta `graphify-out/GRAPH_REPORT.md` y usa `explain`, `affected` o `path` para localizar símbolos. Para CSS, composición Astro y relaciones dinámicas, consulta también `docs/mapa-del-proyecto.md`. Si el mapa no cubre algo, documenta la limitación y haz una búsqueda acotada.
4. Trabaja en modo Ponytail, nivel `full`, salvo indicación distinta del usuario.

# Archivos de reglas

`AGENTS.md` y `CLAUDE.md` son copias completas e idénticas, versionadas. Quien cambie uno sincroniza el otro en el mismo cambio y compara sus bytes. Si un instalador modifica reglas, revisa e integra su contenido y vuelve a sincronizarlas. Las reglas solo cambian cuando el usuario lo pide o aprueba una propuesta; lo ocurrido en una sesión va a la memoria.

# Memoria y contexto

- `PROJECT_MEMORY.md` es la memoria local compartida por los agentes de este equipo. Está ignorada por Git y debe mantenerse por debajo de unas 200 líneas. Secciones: «El proyecto en breve», «Estado actual», «Decisiones vigentes», «Pendientes» y «Lecciones».
- Si no existe, crea esas cinco secciones: propósito y carpetas en breve; «Actualizado el AAAA-MM-DD» y estado comprobado; enlace a decisiones compartidas y particularidades del equipo; tareas pendientes; herramientas, comandos y problemas comprobados. Marca lo desconocido como pendiente, sin inventarlo.
- Al terminar una tarea con cambios, decisiones, pendientes o descubrimientos del entorno, reescribe «Estado actual», registra las decisiones locales con fecha y motivo y actualiza los pendientes. No acumules resúmenes de sesiones.
- Las decisiones que afectan al equipo se registran en `PROYECTO.md`, con el siguiente ID D y una entrada fechada en el historial. Este documento ya cumple la función de registro de decisiones; no duplicarlo en `docs/decisiones.md`.
- Nunca guardar credenciales ni contenido de `.env`. Enlaza Git, README y documentación en lugar de copiarlos. Las rutas personales y datos propios de esta máquina van solo en la memoria ignorada.
- `.codex/hooks.json` configura la inyección de memoria en `SessionStart`, incluidos inicio, reanudación y compactación. Requiere confianza del proyecto y del hook mediante `/hooks` en Codex. `graphify-out/memory-loads.jsonl` registra ejecución, fecha y tamaño, sin copiar la memoria; una ejecución manual no acredita el inicio automático de una sesión.

# Mapa del código

- Graphify usa `graphify-out/graph.json` y `GRAPH_REPORT.md` como mapa local regenerable. El mapa escrito complementario está en `docs/mapa-del-proyecto.md`; las comprobaciones de instalación, cobertura y consultas, en `docs/contexto-agentes.md`.
- Antes de las consultas en PowerShell, configura el entorno del proceso:

```powershell
$env:PYTHONIOENCODING='utf-8'
$env:GRAPHIFY_BACKEND='none'
$env:GRAPHIFY_QUERY_LOG_ENABLE='1'
```

- Usa símbolos concretos: `graphify explain 'transition'`, `graphify affected 'cartItems'` y `graphify path 'transition' 'cartItems'`. Si un nombre es ambiguo, usa el ID que devuelve Graphify.
- `graphify query` busca por palabras, no por significado. No supongas que una pregunta en lenguaje natural devuelve todas las relaciones relevantes. Si existe `graphify-out/wiki/index.md`, puede orientar la navegación general.
- Puntos ciegos comprobados: CSS/Tailwind sin nodos; frontmatter Astro y HTML generado con `set:html` con cobertura parcial; rutas basadas en configuración; eventos `data-*`, acciones por nombre y mensajes de Worker; OPFS, Web Locks, concurrencia y estado de navegador no se validan con el grafo. Una arista de importación o contención no demuestra una llamada real.
- Si falta el mapa o cambia el commit de «Graph Freshness», regenera desde la raíz con estos comandos, después de configurar el entorno anterior:

```powershell
graphify extract . --code-only --max-workers 2
graphify cluster-only . --no-label --no-viz
```

- `extract --code-only` no genera el informe por sí solo en la versión validada. La segunda línea está autorizada exclusivamente con `--no-label` y `GRAPHIFY_BACKEND=none`: agrupa sin IA ni gasto de tokens.
- Después de cambiar código, ejecuta `graphify update .` con `GRAPHIFY_BACKEND=none`. No basta comparar commits si hay cambios sin commit. Comprueba que genera el informe y no pierde cobertura. Si una extracción legítima elimina nodos, revisa la advertencia antes de usar `--force`.
- No ejecutar `graphify label`, `cluster-only` con etiquetado mediante IA ni `/graphify` con extracción semántica sin permiso explícito para llamadas externas y gasto de tokens. No instalar, actualizar herramientas ni añadir hooks sin autorización; no copiar reglas de terceros sobre las del proyecto.
- El registro de consultas es optativo en Graphify 0.9.97: `GRAPHIFY_QUERY_LOG_ENABLE=1` lo habilita en `~/.cache/graphify-queries.log`. No habilitar respuestas completas. Los hooks Git locales actualizan tras commit, checkout de rama, merge y rebase; revisar `graphify hook status` y el registro de reconstrucción.
- `graphify codex install --project` instala la skill en `.codex/skills/graphify/` y registra `graphify hook-check` en `PreToolUse`. En la versión validada este hook es intencionadamente vacío: no obliga a consultar el grafo. Las reglas y los registros permiten comprobar su uso. Preserva los demás hooks al reinstalar y vuelve a sincronizar ambos archivos de reglas.

# Ponytail

- En tareas de código, revisión y dependencias usa la skill Ponytail, nivel `full`: el cambio más pequeño que resuelve toda la tarea, reutilizando componentes, helpers y convenciones existentes.
- Si falta, consulta [INSTALL.md](https://github.com/DietrichGebert/ponytail/blob/main/INSTALL.md) y solicita autorización antes de instalar. En Codex, el plugin se instala con `codex plugin marketplace add DietrichGebert/ponytail` y `codex plugin add ponytail@ponytail`; requiere Node en PATH, revisión en `/hooks` y un hilo nuevo. No sobrescribir estas reglas con el `AGENTS.md` del plugin.
- Ponytail no recorta validación, seguridad, accesibilidad, pruebas ni ningún requisito del usuario. No hace falta añadir funciones, dependencias o abstracciones ajenas a la tarea.

# Comandos comprobados

- Gestor: Bun y `bun.lock`; instalar dependencias del sitio solo cuando la tarea lo requiera, con `bun install --frozen-lockfile`.
- PowerShell de este equipo bloquea `bun.ps1`; usar `bun.cmd` sin cambiar la política de ejecución.
- Desarrollo en segundo plano: `bun.cmd run dev:background`; gestión: `bun.cmd run dev:status`, `bun.cmd run dev:logs`, `bun.cmd run dev:stop`.
- Compilación: `bun.cmd run build`. Lógica: `bun.cmd test src/local/transitions.test.js`. Hook de memoria: `node --test .codex/hooks/load-memory.test.cjs`.
- No crear commits, push, tags ni releases sin solicitud explícita. No restaurar documentación o artefactos que hayan desaparecido sin consultar al usuario.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Project documentation

Read `PROYECTO.md` before changing project scope, structure, behavior, or design. Update it when the conversation establishes or revises a decision in these areas, and after implementing related changes. Keep confirmed decisions, proposals, unanswered questions, and implemented behavior distinct. Record the date and a concise history entry. Explicit user instructions take precedence over proposals in the document.

## Decisiones visuales de interfaz

Antes de cada decisión visual o cambio de interfaz, seguir este flujo:

1. Crear un prototipo o artefacto interactivo en la carpeta `design/` de la raíz, con varias opciones claramente identificadas que el usuario pueda explorar y comparar.
2. Levantar un servidor local independiente del artefacto en segundo plano, comprobar que funciona y compartir su URL en el chat. Registrar su proceso, puerto y comando de detención para gestionar únicamente ese servidor.
3. Mantener el artefacto disponible mientras el usuario decide. Esperar su elección antes de aplicar el cambio visual a la aplicación principal.
4. Cuando el usuario comunique su elección, actualizar `PROYECTO.md` y detener el servidor del artefacto que se haya levantado. Comprobar que quedó detenido y conservar los archivos del prototipo como referencia.
5. Implementar la opción elegida cuando corresponda al alcance de la tarea. Reutilizar o ampliar el artefacto si ya permite comparar esa decisión, sin volver a pedir una elección ya confirmada.

No detener otros servidores locales al cerrar un artefacto.

## Calidad de interfaz: diseño, accesibilidad y usabilidad

Para crear o rediseñar interfaces, aplicar la skill `frontend-design` y el flujo de aprobación anterior. Usar `PROYECTO.md` como guía estructural de la skill: leer primero el propósito, las personas, la estructura, los recorridos y las decisiones vigentes. Antes de construir, explicar en el plan cómo la composición facilita descubrir productos y servicios, comparar precios, visitar tiendas y dar exposición a comercios locales y negocios nuevos. La identidad corporativa debe apoyar esa finalidad comercial. Respetar las decisiones vigentes; una instrucción nueva del usuario puede revisarlas y debe registrarse sin borrar su historia.

- Cuando se use una web como referencia de identidad, consultar sus recursos y documentar colores, fuentes y procedencia. Mantener el nombre y la finalidad del proyecto según la decisión del usuario; adaptar la identidad a los recorridos del mercado.
- El banner principal será un carrusel de promociones, productos nuevos y descubrimiento de comercios, con acciones concretas hacia ofertas o tiendas. Mostrar controles visibles y accesibles, el elemento seleccionado y su posición. Por defecto iniciar sin rotación automática; si el usuario la solicita explícitamente, como en la propuesta del 2026-10-28, iniciar automáticamente en condiciones normales con pausa visible, detención al interactuar y al ocultarse la página, y sin inicio automático con movimiento reducido. No esconder información indispensable exclusivamente en una diapositiva.
- Las tarjetas de ofertas deben percibirse como unidades completas: contorno visible, superficie propia, foto e información agrupadas, tienda, precio y acciones claras. Las imágenes de ejemplo mostrarán el producto en contexto, evitando fondos blancos incrustados; conservar originales y diferenciar recursos ilustrativos de fotografías de comercios reales.

- Aplicar DRY: compartir catálogo, renderizado de ofertas, encabezados, controles y comportamiento de ventanas entre páginas y actualizaciones del navegador. Evitar mantener dos implementaciones del mismo recorrido.
- Usar Tailwind para los estilos del sitio: identidad centralizada en `@theme`, utilidades responsive y estados; extraer patrones repetidos con `@apply` en componentes. Reservar CSS directo para fuentes, variables y comportamientos que lo necesiten; retirar reglas obsoletas y hojas superpuestas.
- Validar durante la construcción: compilar y revisar en navegador después de cada cambio relevante. Comprobar ajustes reales de lectura, además de simulaciones. Las preferencias de accesibilidad deben respetar el movimiento reducido del sistema, validarse al recuperarse y poder restablecerse.
- Registrar los servidores de pruebas propios y detenerlos al terminar si el usuario lo solicita. Verificar identidad del proceso y cierre de puertos; dar los comandos concretos para iniciar y detener el proyecto. Si pide cerrar también un comparador con elección pendiente, conservarlo y documentar cómo reiniciarlo.

- Diseñar desde móvil y adaptar contenido, navegación, imágenes y controles a distintos tamaños. Verificar al menos 320, 390, 768, 1024 y 1440 px, ampliación de texto al 200 % y redistribución del contenido al 400 % de zoom. Evitar desbordamientos, texto cortado y acciones ocultas.
- Tomar WCAG 2.2 nivel AA como objetivo de accesibilidad. Comprobar contraste de texto normal de al menos 4.5:1, texto grande de 3:1 y elementos visuales necesarios de controles de 3:1. Usar objetivos táctiles de al menos 44 × 44 px como criterio de usabilidad del proyecto.
- Usar HTML semántico, títulos jerárquicos, un enlace para saltar al contenido, etiquetas de formularios y textos alternativos útiles. Los iconos decorativos se ocultan a lectores de pantalla; los controles con iconos tienen un nombre accesible. Mantener iconos SVG y evitar emojis en la interfaz.
- Permitir completar los recorridos con teclado, con orden de foco lógico y foco visible que no quede tapado por cabeceras o barras. Las ventanas deben anunciar su título, contener el foco mientras están abiertas, cerrarse con Escape y devolver el foco al control que las abrió.
- Respetar `prefers-reduced-motion`, evitar movimiento automático innecesario y no depender del color, el hover o gestos de arrastre para comunicar información o ejecutar acciones.
- Priorizar acciones claras, precios legibles, búsqueda y categorías fáciles de encontrar, estado de selección visible y carritos identificados por tienda. Conservar el contexto al abrir detalles y las selecciones al avanzar en un recorrido. Dar instrucciones concretas en estados vacíos, errores y confirmaciones.
- Preparar imágenes con dimensiones o proporciones estables, carga diferida fuera de la primera vista y tamaños apropiados. Mantener la identidad y separar fotografías de referencia de recursos definitivos aprobados.
- Antes de solicitar aprobación, verificar los recorridos principales en un navegador real, revisar capturas de varios tamaños y registrar qué se comprobó y qué queda pendiente. Las comprobaciones automáticas complementan la revisión manual; no afirmar conformidad completa con WCAG sin una auditoría suficiente.

Referencia: [guía rápida de WCAG 2.2](https://www.w3.org/WAI/WCAG22/quickref/).

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
