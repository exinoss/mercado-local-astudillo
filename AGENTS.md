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
- El banner principal será un carrusel de promociones, productos nuevos y descubrimiento de comercios, con acciones concretas hacia ofertas o tiendas. Mostrar controles visibles y accesibles, el elemento seleccionado y su posición. Iniciar sin rotación automática; cualquier reproducción opcional debe poder pausarse y detenerse al interactuar, al ocultarse la página y con movimiento reducido. No esconder información indispensable exclusivamente en una diapositiva.
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
