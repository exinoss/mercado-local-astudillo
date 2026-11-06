const { readFileSync, mkdirSync, appendFileSync } = require('node:fs');
const { resolve, join } = require('node:path');

const root = resolve(__dirname, '../..');
let memory;
try {
  memory = readFileSync(join(root, 'PROJECT_MEMORY.md'), 'utf8');
} catch (error) {
  const message = error.code === 'ENOENT'
    ? 'Falta PROJECT_MEMORY.md. Créalo según AGENTS.md antes de empezar; no supongas el estado de este equipo.'
    : `No se pudo leer PROJECT_MEMORY.md (${error.code}). Revisa su acceso antes de empezar.`;
  process.stdout.write(JSON.stringify({ systemMessage: message, hookSpecificOutput: {
    hookEventName: 'SessionStart', additionalContext: message,
  } }));
  return;
}

// El registro es local y no copia el contenido de la memoria ni identificadores de sesión.
try {
  const logDir = join(root, 'graphify-out');
  mkdirSync(logDir, { recursive: true });
  appendFileSync(join(logDir, 'memory-loads.jsonl'), JSON.stringify({
    time: new Date().toISOString(), event: 'SessionStart', bytes: Buffer.byteLength(memory),
  }) + '\n');
} catch (error) {
  process.stderr.write(`No se pudo registrar la lectura de memoria (${error.code}); se entrega el contexto igualmente.\n`);
}

process.stdout.write(JSON.stringify({ hookSpecificOutput: {
  hookEventName: 'SessionStart',
  additionalContext: `Memoria local del proyecto. Indica la fecha de «Estado actual» en tu primera respuesta.\n\n${memory}`,
} }));
