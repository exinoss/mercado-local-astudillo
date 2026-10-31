# Publicación del sitio estático

Decisión D94, 2026-10-30: se publica el sitio actual con datos locales por navegador y sin cobros
reales. El alojamiento queda a cargo del usuario. Esta preparación no crea commits, push ni despliegues.

## Reproducir la entrega

Desde una copia del repositorio, con Node >=22.12 y Bun 1.4.2:

```sh
bun install --frozen-lockfile
bun audit
bun run check
```

La salida es `dist/`: HTML, CSS, JavaScript, SQLite WASM, fuentes, imágenes y animaciones locales.
No subir `node_modules/`, `.astro/`, `.env*`, perfiles de navegador, registros ni la memoria del equipo.
La CI genera el mismo artefacto, con permisos de lectura y sin credenciales de alojamiento.
Los Actions están fijados a commits verificados en sus repositorios oficiales.

La prueba opcional `bun run test:browser` usa una instalación existente de `playwright-core`
y Google Chrome, contra `MARKET_TEST_URL` (por defecto localhost:4321). Si no está en las
dependencias de esa máquina, `MARKET_PLAYWRIGHT_MODULE` admite su ruta absoluta. No se añade
Playwright a la aplicación ni se instala automáticamente. La prueba utiliza un perfil aislado
y escribe en `test-results/browser`; `MARKET_TEST_OUTPUT` permite elegir otra carpeta.

Antes de subir, revisar `git status --short` y `git diff --check`. Hay archivos nuevos de código,
assets, documentación y hooks que deben formar parte del commit. `check:repo` incluye nuevos
archivos sin seguimiento, pero solo un clon del commit final permite comprobar qué llegó a GitHub.
Las reglas del proyecto reservan commit/push a una instrucción explícita del usuario.

## Contrato del alojamiento

- Servir `dist/` en la raíz del dominio (`/`). Las rutas y recursos actuales usan direcciones
  absolutas; una subcarpeta como `/nombre-repo/` necesita adaptar y volver a probar `base` y enlaces.
- Usar HTTPS. OPFS, Web Crypto y Web Locks requieren un contexto seguro; localhost sirve para pruebas.
- Resolver rutas como `/catalogo/` a su `index.html`. No es una SPA: no redirigir todas las rutas al inicio.
- Servir `.wasm` como `application/wasm`, JS como JavaScript y CSS como `text/css`.
- Mantener los nombres generados. Usar caché prolongada para `_astro/` con hash y revalidar HTML;
  publicar una versión completa de forma atómica.
- El VFS es `opfs-sahpool`; no depende del VFS con SharedArrayBuffer. No añadir COOP/COEP sin
  necesidad ni bloquear Workers, WebAssembly o los scripts inline de navegación.

Si el proveedor añade CSP, probarla con SQLite y Lottie: una política genérica puede bloquear
WASM o el bootstrap inline. El sitio no carga scripts ni fuentes desde CDN.

## Comprobar después de alojarlo

1. Abrir portada y rutas interiores directamente, recargar y comprobar recursos y consola.
2. Registrar una cuenta de prueba, recargar y volver a entrar en el mismo perfil del navegador.
3. Crear tienda/producto, comprar, revisar el total y confirmar una sola vez; verificar persistencia.
4. Abrir producto y servicio en modal, cerrar con Escape y comprobar filtros, foco y retorno.
5. Verificar contactos publicados, carrusel, movimiento reducido, móvil y accesibilidad.
6. Probar dos pestañas y el rechazo explícito si el navegador bloquea almacenamiento.

Un dominio nuevo tiene un origen distinto: los datos locales anteriores no se trasladan.
Borrar datos del sitio o perder el perfil elimina las cuentas locales. La sesión es por pestaña;
la base y los bloqueos se comparten entre pestañas del mismo perfil y origen.

## Límites deliberados

Las cuentas no protegen datos frente a quien controle el perfil o las herramientas de desarrollo.
Restablecer por correo es local, sin verificación de identidad. Los pagos se simulan y las tiendas
creadas no se publican a otros visitantes. El sitio conserva `noindex` según el alcance vigente;
cambiar indexación o convertirlo en mercado compartido exige otra decisión.

Consultar [recursos y licencias](recursos.md). No se asigna una licencia general nueva al proyecto.

Referencias: [despliegue Astro](https://docs.astro.build/en/guides/deploy/),
[persistencia SQLite WASM](https://sqlite.org/wasm/doc/trunk/persistence.md).
