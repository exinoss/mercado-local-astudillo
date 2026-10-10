import sqlite3InitModule from '@sqlite.org/sqlite-wasm';
import wasmUrl from '@sqlite.org/sqlite-wasm/sqlite3.wasm?url';
import { initialState } from './catalog.js';
import { transition } from './transitions.js';
let sqlite, pool;
const hex = bytes => [...new Uint8Array(bytes)].map(byte => byte.toString(16).padStart(2, '0')).join('');
const unhex = value => new Uint8Array(value.match(/.{2}/g).map(byte => parseInt(byte, 16)));
async function derive(password, salt) { const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']); return hex(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: unhex(salt), iterations: 100000 }, key, 256)); }
function email(value) { const result = String(value || '').trim().toLowerCase(); if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result) || result.length > 160) throw new Error('Introduce un correo válido.'); return result; }
function password(value) { if (typeof value !== 'string' || value.length < 6 || value.length > 200) throw new Error('Usa una contraseña de 6 a 200 caracteres.'); return value; }
const read = (db, owner) => { const row = db.selectObject('SELECT data FROM workspaces WHERE owner=?', [owner]); return row ? JSON.parse(row.data) : initialState(); };
const write = (db, owner, state) => db.exec({ sql: 'INSERT INTO workspaces(owner,data) VALUES(?,?) ON CONFLICT(owner) DO UPDATE SET data=excluded.data', bind: [owner, JSON.stringify(state)] });
async function execute({ namespace, operation, args = {} }) {
  if (!/^[a-z0-9-]{1,60}$/.test(namespace)) throw new Error('Almacenamiento inválido.');
  if (!navigator.locks || !navigator.storage?.getDirectory) throw new Error('Este navegador no permite guardar cuentas. Usa una versión actual de Chrome, Firefox o Safari y permite el almacenamiento del sitio.');
  return navigator.locks.request('mercado-local-sqlite-' + namespace, async () => {
    let db;
    try {
      sqlite ||= await sqlite3InitModule({ locateFile: file => file.endsWith('.wasm') ? wasmUrl : file });
      if (!pool) pool = await sqlite.installOpfsSAHPoolVfs({ name: 'local-' + namespace, directory: '.mercado-' + namespace, initialCapacity: 6, preserveOnInitFailure: true });
      else await pool.unpauseVfs();
      db = new pool.OpfsSAHPoolDb('/mercado.sqlite');
      const version = db.selectValue('PRAGMA user_version');
      if (version > 1) throw new Error('Los datos pertenecen a una versión más reciente. Actualiza el sitio.');
      db.exec('BEGIN IMMEDIATE');
      if (version === 0) db.exec('CREATE TABLE accounts(id TEXT PRIMARY KEY,email TEXT NOT NULL UNIQUE,name TEXT NOT NULL,salt TEXT NOT NULL,password_hash TEXT NOT NULL); CREATE TABLE workspaces(owner TEXT PRIMARY KEY,data TEXT NOT NULL); PRAGMA user_version=1;');
      let result;
      const owner = args.owner || 'guest';
      if (owner !== 'guest' && !db.selectValue('SELECT id FROM accounts WHERE id=?', [owner]) && !['register', 'login', 'reset', 'legacy'].includes(operation)) throw new Error('Entra a tu cuenta para continuar.');
      if (operation === 'register') {
        const mail = email(args.email), pass = password(args.password), name = String(args.name || '').trim().slice(0, 80); if (!name) throw new Error('Completa tu nombre.');
        if (db.selectValue('SELECT id FROM accounts WHERE email=?', [mail])) throw new Error('Ya existe una cuenta con este correo en este navegador.');
        const id = crypto.randomUUID(), salt = hex(crypto.getRandomValues(new Uint8Array(16))), hash = await derive(pass, salt);
        db.exec({ sql: 'INSERT INTO accounts VALUES(?,?,?,?,?)', bind: [id, mail, name, salt, hash] });
        const state = read(db, 'guest'); state.profile = { name, phone: '' }; write(db, id, state); write(db, 'guest', initialState()); result = { id, email: mail, name };
      } else if (operation === 'login') {
        const account = db.selectObject('SELECT * FROM accounts WHERE email=?', [email(args.email)]);
        if (!account || await derive(password(args.password), account.salt) !== account.password_hash) throw new Error('Comprueba el correo y la contraseña de tu cuenta en este navegador.');
        const state = transition(read(db, account.id), 'migrate', read(db, 'guest')); write(db, account.id, state); write(db, 'guest', initialState()); result = { id: account.id, email: account.email, name: state.profile.name || account.name };
      } else if (operation === 'reset') {
        const account = db.selectObject('SELECT * FROM accounts WHERE email=?', [email(args.email)]); if (!account) throw new Error('No existe una cuenta con este correo en este navegador.');
        const salt = hex(crypto.getRandomValues(new Uint8Array(16))), hash = await derive(password(args.password), salt);
        db.exec({ sql: 'UPDATE accounts SET salt=?,password_hash=? WHERE id=?', bind: [salt, hash, account.id] }); result = true;
      } else if (operation === 'legacy') {
        const marker = ':legacy-migration-v1';
        if (!db.selectValue('SELECT owner FROM workspaces WHERE owner=?', [marker])) { write(db, 'guest', transition(read(db, 'guest'), 'migrate', { carts: args.carts || {} }, false)); write(db, marker, { completed: true }); }
        result = true;
      } else if (operation === 'read') result = { state: read(db, owner), account: owner === 'guest' ? null : db.selectObject('SELECT id,email,name FROM accounts WHERE id=?', [owner]), version: 1, engine: sqlite.version.libVersion };
      else if (operation === 'mutate') { const state = transition(read(db, owner), args.action, args.payload, owner !== 'guest'); write(db, owner, state); if (args.action === 'profile') db.exec({ sql: 'UPDATE accounts SET name=? WHERE id=?', bind: [state.profile.name, owner] }); result = state; }
      else throw new Error('Operación desconocida.');
      db.exec('COMMIT'); return result;
    } catch (error) { try { db?.exec('ROLLBACK'); } catch {} throw error; }
    finally { db?.close(); if (pool && !pool.isPaused()) pool.pauseVfs(); }
  });
}
let queue = Promise.resolve();
self.onmessage = ({ data }) => { queue = queue.then(async () => { try { self.postMessage({ id: data.id, result: await execute(data) }); } catch (error) { self.postMessage({ id: data.id, error: error.message || 'No se pudieron guardar los datos. Comprueba el almacenamiento de este navegador.' }); } }); };
