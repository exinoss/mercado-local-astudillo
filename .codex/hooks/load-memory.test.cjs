const { test } = require('node:test');
const assert = require('node:assert/strict');
const { mkdtempSync, mkdirSync, copyFileSync, writeFileSync, readFileSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { spawnSync } = require('node:child_process');

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'mercado-memory-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, '.codex/hooks'), { recursive: true });
  mkdirSync(join(root, 'src'));
  const script = join(root, '.codex/hooks/load-memory.cjs');
  copyFileSync(join(__dirname, 'load-memory.cjs'), script);
  return { root, run: () => spawnSync(process.execPath, [script], {
    cwd: join(root, 'src'), encoding: 'utf8', timeout: 5000,
  }) };
}

test('Entrega la memoria UTF-8 desde una subcarpeta y registra solo metadatos', t => {
  const { root, run } = fixture(t);
  const memory = '# Memoria\n## Estado actual\nActualizado el 2026-10-27.\nDecisión comprobada.';
  writeFileSync(join(root, 'PROJECT_MEMORY.md'), memory);
  const result = run();
  assert.equal(result.status, 0);
  assert.equal(result.stderr, '');
  const output = JSON.parse(result.stdout).hookSpecificOutput;
  assert.equal(output.hookEventName, 'SessionStart');
  assert.ok(output.additionalContext.endsWith(memory));
  const log = JSON.parse(readFileSync(join(root, 'graphify-out/memory-loads.jsonl'), 'utf8'));
  assert.deepEqual(Object.keys(log).sort(), ['bytes', 'event', 'time']);
  assert.equal(log.bytes, Buffer.byteLength(memory));
  assert.ok(Number.isFinite(Date.parse(log.time)));
});

test('La memoria ausente se anuncia sin inventar un estado', t => {
  const result = fixture(t).run();
  assert.equal(result.status, 0);
  const output = JSON.parse(result.stdout);
  assert.match(output.systemMessage, /Falta PROJECT_MEMORY\.md/);
  assert.equal(output.systemMessage, output.hookSpecificOutput.additionalContext);
});

test('Un registro no escribible no impide entregar la memoria', t => {
  const { root, run } = fixture(t);
  writeFileSync(join(root, 'PROJECT_MEMORY.md'), 'Memoria que debe llegar al agente.');
  writeFileSync(join(root, 'graphify-out'), 'Archivo que impide crear el directorio.');
  const result = run();
  assert.equal(result.status, 0);
  assert.match(result.stderr, /se entrega el contexto igualmente/);
  assert.match(JSON.parse(result.stdout).hookSpecificOutput.additionalContext, /Memoria que debe llegar/);
});
