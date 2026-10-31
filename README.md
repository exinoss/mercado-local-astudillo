# Mercado Local · San Lorenzo

Sitio estático para descubrir comercios, productos, promociones y profesionales de San Lorenzo,
Esmeraldas. Propuesta de Carlos Astudillo, construida con Astro, Tailwind y Bun.

**Alcance de esta publicación:** cuentas, tiendas, carritos y pedidos guardados únicamente en
el navegador mediante SQLite WASM/OPFS. No hay sincronización, autenticación de servidor ni
cobros reales. El catálogo y sus fotografías iniciales son ilustrativos. Restablecer la contraseña
es una operación local y directa; no acredita la propiedad de un correo.

## Empezar

Requisitos: Node >=22.12 y Bun 1.4.2. Usar el lockfile del repositorio.
En PowerShell usar `bun.cmd` si la política bloquea `bun.ps1`.

```sh
bun install --frozen-lockfile
bun run dev:background
bun run dev:status
bun run dev:logs
bun run dev:stop
```

El estado del servidor informa su URL y puerto. Para validar la distribución:

```sh
bun run check
bun audit
bun run preview
```

`check` verifica los archivos candidatos a Git, las pruebas de lógica y memoria,
la compilación estática y sus referencias locales. `preview` sirve `dist/` para
revisión; detenerlo con Ctrl+C. La aplicación no necesita variables de entorno.

## Estructura

| Ruta | Responsabilidad |
| --- | --- |
| `src/pages/`, `src/layouts/` | Rutas estáticas y entrada Astro |
| `src/data/catalog.js` | Catálogo ilustrativo único |
| `src/local/views.js`, `market-ui.js`, `service-view.js` | Renderizado compartido de páginas, tarjetas y modales |
| `src/local/app.js` | Eventos y coordinación de los recorridos |
| `src/local/transitions.js` | Reglas de negocio puras, validaciones y pedidos en centavos |
| `src/local/repository.js`, `database.worker.js` | Acceso a SQLite, transacciones y coordinación entre pestañas |
| `src/lib/`, `src/scripts/` | Funciones compartidas, animaciones y accesibilidad |
| `src/styles/`, `src/local/styles.css` | Identidad y composición Tailwind |
| `src/assets/`, `public/` | Animaciones originales y recursos estáticos locales |
| `scripts/`, `.github/workflows/` | Comprobaciones portables y verificación en GitHub |
| `docs/`, `PROYECTO.md` | Arquitectura, publicación, auditoría y decisiones |

El diseño aprobado incluye cabecera amarilla, carrusel de cuatro vistas de altura estable,
fondo dorado gradual, tarjetas por secciones y transición con el barco. Productos y servicios
abren en modal; las tiendas mantienen sus páginas. Los servicios muestran profesionales,
actividades y contactos publicados, sin carrito. Las pausas se encuentran en Accesibilidad;
se respeta el movimiento reducido.

La aplicación no importa archivos de `design/`. Esa carpeta contiene prototipos, originales,
entregables y evidencias locales conservados; está excluida de Git. Los enlaces históricos
a ella en el registro de decisiones requieren la copia local del equipo.

## Publicación y revisión

- [Preparar GitHub y publicar dist](docs/publicacion.md): requisitos del alojamiento y validación posterior.
- [Auditoría de producción](docs/auditoria-produccion.md): hallazgos corregidos, pruebas y límites.
- [Mapa del proyecto](docs/mapa-del-proyecto.md): dependencias y recorridos, incluidos los puntos ciegos del grafo.
- [Decisiones vigentes](PROYECTO.md): alcance, identidad y comportamiento aprobado.
- [Contexto para agentes](docs/contexto-agentes.md): memoria local y herramientas opcionales del equipo.
- [Recursos y licencias](docs/recursos.md): fuentes, runtime y material ilustrativo.

GitHub Actions instala con lockfile congelado, audita dependencias, prueba y compila; conserva
`dist/` como artefacto, sin desplegar. El alojamiento lo decide el responsable de la publicación.
Los archivos nuevos necesarios deben incluirse en el primer commit junto con los modificados.

Persistencia en [SQLite WASM](https://sqlite.org/wasm/doc/trunk/persistence.md).
Pendientes de validación: Safari/iOS, lectores de pantalla y dispositivos físicos.
No se afirma conformidad completa con WCAG.
