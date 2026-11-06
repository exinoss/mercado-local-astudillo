# Contexto para agentes

Instalación y comprobaciones del 2026-10-27. Decisiones compartidas: D60 y D61 en `PROYECTO.md`.

## Qué pertenece a cada lugar

| Pieza | Ubicación | Git |
| --- | --- | --- |
| Reglas completas idénticas | `AGENTS.md`, `CLAUDE.md` | Versionadas |
| Memoria de cada equipo | `PROJECT_MEMORY.md` | Ignorada |
| Propósito, decisiones e historial | `PROYECTO.md` | Versionado, sin registro duplicado |
| Mapa AST y reporte | `graphify-out/` | Ignorados, salvo etiquetas y firma |
| Relaciones fuera del AST | `docs/mapa-del-proyecto.md` | Versionadas |
| Integración de Codex | `.codex/hooks.json`, `.codex/hooks/`, `.codex/skills/graphify/` | Versionada |
| Hooks de Git | `.git/hooks/` | Locales; se reinstalan por equipo |
| Ponytail | Perfil de plugins de Codex | Local al usuario |

Al iniciar, el agente debe indicar la fecha de «Estado actual» que leyó.
Al terminar, actualiza la memoria si cambió el estado, una decisión o un pendiente.
Solo una solicitud o aprobación del usuario permite cambiar las reglas.

## Instalación comprobada

Graphify: paquete `graphifyy` 0.9.97 instalado mediante `uv tool install`, con Python 3.14 existente.
El entorno de uv aísla sus dependencias de las del sitio; expone `graphify` y `graphify-mcp`.
No se instaló un runtime de Python nuevo ni dependencias de Astro para esta tarea.
Ponytail 5.3.2 quedó instalado y habilitado como `ponytail@ponytail` en Codex.
Node está disponible para sus hooks; el nivel inicial de Ponytail es `full`.
Las rutas personales de instalación se registran solamente en `PROJECT_MEMORY.md`.

Comandos para otro equipo, previa autorización para instalar:

```powershell
uv tool install graphifyy
graphify codex install --project
graphify hook install
codex plugin marketplace add DietrichGebert/ponytail
codex plugin add ponytail@ponytail
```

Revisar los archivos que modifica el instalador de Graphify y volver a sincronizar las reglas.
No copiar el `AGENTS.md` de Ponytail sobre los archivos del proyecto.
Referencias oficiales: [Graphify](https://github.com/Graphify-Labs/graphify),
[Ponytail INSTALL](https://github.com/DietrichGebert/ponytail/blob/main/INSTALL.md),
[hooks de Codex](https://learn.chatgpt.com/docs/hooks).

## Regenerar sin IA

Desde la raíz del repositorio, en PowerShell:

```powershell
$env:PYTHONIOENCODING='utf-8'
$env:GRAPHIFY_BACKEND='none'
$env:GRAPHIFY_QUERY_LOG_ENABLE='1'
graphify extract . --code-only --max-workers 2
graphify cluster-only . --no-label --no-viz
```

La versión validada separa la extracción del reporte: hace falta la segunda línea.
`--no-label` evita nombres mediante IA; no omitirlo ni habilitar un backend externo sin permiso.
El reporte inicial indicó **0 tokens de entrada y 0 de salida**.
Las comunidades mantienen nombres `Community N`.
Para actualizar después de cambios, con el mismo entorno: `graphify update .`.
Comparar el commit de «Graph Freshness» con `git rev-parse HEAD` y actualizar también tras cambios sin commit.

## Cobertura y consultas verificadas

Inventario inicial del sitio: 29 archivos de código, sin dependencias ni generados.
La tabla cuenta archivos mencionados en `source_file`, incluidos nodos de archivo/importación.
Ese conteo no significa que se extraigan todas sus funciones o relaciones.

| Extensión del sitio | Archivos | Presentes en el grafo inicial | Limitación |
| --- | ---: | ---: | --- |
| JavaScript `.js` | 17 | 17 | Incluye referencias a pruebas; callbacks y acciones por texto son parciales |
| Astro `.astro` | 8 | 8 | Frontmatter, plantillas y HTML generado parcialmente representados |
| MJS `.mjs` | 1 | 1 | Configuración mencionada, sin símbolos propios en la extracción inicial |
| CSS `.css` | 3 | 0 | Usar mapa escrito y revisar selectores y utilidades |

La primera extracción incluyó además dos CJS del hook y configuraciones JSON.
Produjo 181 nodos y 341 relaciones antes de incorporar la documentación de contexto.
El mapa escrito cubre las limitaciones detectadas sin afirmar cobertura completa del AST.

| Consulta real | Resultado contrastado con el código |
| --- | --- |
| `graphify explain 'transition'` | `src/local/transitions.js`, función `transition`; importación y uso desde el Worker |
| `graphify affected 'cartItems'` | Consumidores en controlador, vistas y transiciones; impacto indirecto en Worker/layout |
| `graphify path 'transition' 'cartItems'` | Un salto: llamada directa de `transition` a `cartItems` al construir un pedido |

Las consultas acotan la lectura a símbolos concretos. El ahorro medido de salida frente a los archivos
relacionados se conserva localmente en `graphify-out/context-validation.json`.
Antes de resolver el acceso a las referencias, el mapa actualizado tenía 247 nodos y 440 relaciones.
El tamaño actual se consulta en `graphify-out/GRAPH_REPORT.md` y en el informe local de validación.
Las salidas de `explain`, `affected` y `path` ocuparon 1 365, 1 058 y 76 caracteres,
frente a 22 868, 75 565 y 10 645 de los archivos relacionados completos, respectivamente.
Son comparaciones de tamaño de texto, no mediciones de tokens de una conversación.
No confundir una ruta basada en importaciones/contención con una secuencia de llamadas en ejecución.
`graphify query` usa palabras, por lo que no garantiza resolver una pregunta semántica.

## Hooks y cómo comprobarlos

El hook `SessionStart` de `.codex/hooks.json` ejecuta `.codex/hooks/load-memory.cjs`.
Resuelve la raíz con Git incluso si Codex abre una subcarpeta; el script lee desde su ubicación.
Entrega la memoria mediante `hookSpecificOutput.additionalContext`, en JSON UTF-8.
Si falta la memoria, da una instrucción concreta; no inventa un estado.
La imposibilidad de escribir el registro no impide entregar el contexto.
Registra únicamente fecha UTC, evento y tamaño en `graphify-out/memory-loads.jsonl`.

```powershell
node --test .codex/hooks/load-memory.test.cjs
```

Tres pruebas comprueban contexto exacto desde subcarpeta, memoria ausente y fallo del registro.
La ejecución manual y estas pruebas no acreditan el arranque automático en Codex.
Para esa comprobación: abrir `codex`, revisar `/hooks`, confiar los hooks del proyecto y del plugin,
abrir un hilo nuevo y comprobar la fecha leída y una nueva entrada del registro.
Codex exige confianza del proyecto y de las definiciones actuales; instalar no concede esa confianza.
Ponytail 5.3.2 trae tres eventos: `SessionStart`, `SubagentStart` y `UserPromptSubmit`.
Su instalación se comprueba con `codex plugin list --json`; no se crean subagentes para probarlo.

Graphify registró `PreToolUse` con `graphify hook-check`.
En 0.9.97 es intencionadamente vacío por compatibilidad con Codex Desktop.
No bloquea búsquedas ni garantiza una consulta previa: esa obligación está en las reglas.
Se conserva la integración oficial sin inventar un guard que no existe.

Los hooks Git locales son `post-commit`, `post-checkout`, `post-merge` y `post-rewrite`.
Además se registra el merge driver de Graphify y su atributo en `.gitattributes`.
No se crean commits para probarlos. `graphify hook status` comprueba la instalación.
La invocación directa de `post-merge` permite probar la reconstrucción sin hacer un merge:

```powershell
$env:GRAPHIFY_BACKEND='none'
git hook run post-merge -- 0
```

El hook lanza la reconstrucción local en segundo plano y escribe `~/.cache/graphify-rebuild.log`.
Se verificó la finalización en ese registro: 223 nodos y 380 relaciones antes de incorporar
el resto de documentación; después, `graphify update .` confirmó 247 nodos y 440 relaciones.
`post-checkout` no reconstruye cuando los dos hashes son iguales: ese caso se comprobó.
Para retirar solo estos hooks locales: `graphify hook uninstall`.

## Registro de consultas

Graphify 0.9.97 no registra consultas por defecto. Se habilitó `GRAPHIFY_QUERY_LOG_ENABLE=1`
en el entorno del usuario de este equipo; terminales ya abiertas requieren definirla en el proceso.
`~/.cache/graphify-queries.log` guarda JSONL con fecha, tipo, consulta y ruta del grafo.
No se habilitó `GRAPHIFY_QUERY_LOG_RESPONSES`; no guarda respuestas completas.
Se comprobaron entradas `explain` y `path`; `affected` no añade una entrada en esta versión.
El registro permite comprobar consultas realizadas, no demostrar que nunca hubo lecturas directas.

## Estado de validación y límites

- Reglas completas comparadas byte a byte y con «Antes de cualquier tarea» al inicio.
- Memoria local ignorada y por debajo de 200 líneas; sin credenciales ni contenido de `.env`.
- Tres pruebas del hook y seis pruebas de negocio con 30 aserciones correctas.
- Comando real del hook probado desde `src/local/`, con la memoria completa como contexto;
  validación local repetible: `node graphify-out/validate-context.cjs` (artefacto ignorado).
- Mapa generado y consultas contrastadas sin backend de IA ni etiquetado con tokens.
- Sin cambios en `src/`, sin commits, push ni tags, y sin servidores iniciados por esta tarea.
- Falta revisar la confianza de hooks y comprobar una sesión nueva en el cliente del usuario.
- Acceso de referencias resuelto el 2026-10-27 conforme a D61. Tras el rechazo inicial de la revisión
  automática, el usuario autorizó explícitamente habilitar herencia de permisos solo en
  `.codex/skills/graphify/references/` y sus ocho archivos. Se verificó la ruta y la ausencia de enlaces;
  se procesaron nueve objetos sin errores y las ocho referencias se leen desde el sandbox sin elevación.
  No se cambiaron permisos de otras carpetas. Las ACL son locales y no se conservan mediante Git.
  Si una reinstalación recrea la restricción, comprobar acceso y revisar la autorización antes de corregirla.
- No se repiten la compilación de Astro ni pruebas visuales: la interfaz y sus dependencias no cambiaron.
