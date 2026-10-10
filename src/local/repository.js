import DatabaseWorker from './database.worker.js?worker';
import { initialState } from './catalog.js';
export function createRepository(namespace = 'main-v1') {
  let worker, sequence = 0, account;
  const pending = new Map(), sessionKey = 'mercado-local:' + namespace + ':account';
  const channel = typeof BroadcastChannel === 'function' ? new BroadcastChannel('mercado-local:' + namespace) : null;
  try { account = JSON.parse(sessionStorage.getItem(sessionKey) || 'null'); } catch {}
  function request(operation, args = {}) {
    if (!worker) { worker = new DatabaseWorker(); worker.onmessage = ({ data }) => { const callbacks = pending.get(data.id); if (!callbacks) return; pending.delete(data.id); data.error ? callbacks.reject(new Error(data.error)) : callbacks.resolve(data.result); }; worker.onerror = () => { for (const callbacks of pending.values()) callbacks.reject(new Error('No se pudo iniciar el almacenamiento local. Recarga la página.')); pending.clear(); worker.terminate(); worker = null; }; }
    return new Promise((resolve, reject) => { const id = ++sequence; pending.set(id, { resolve, reject }); worker.postMessage({ id, namespace, operation, args: { ...args, owner: account?.id || 'guest' } }); });
  }
  function setAccount(value) { account = value; try { value ? sessionStorage.setItem(sessionKey, JSON.stringify(value)) : sessionStorage.removeItem(sessionKey); } catch {} }
  return {
    get account() { return account; },
    async read() { try { const result = await request('read'); if (result.account) setAccount(result.account); return result; } catch (error) { if (account && error.message === 'Entra a tu cuenta para continuar.') { setAccount(null); return request('read'); } throw error; } },
    async register(data) { setAccount(await request('register', data)); channel?.postMessage('changed'); return account; },
    async login(data) { setAccount(await request('login', data)); channel?.postMessage('changed'); return account; },
    logout() { setAccount(null); },
    reset(data) { return request('reset', data); },
    async mutate(action, payload) { const state = await request('mutate', { action, payload }); channel?.postMessage('changed'); return state; },
    onChange(callback) { if (channel) channel.onmessage = callback; },
    async migrateLegacy() { if (namespace !== 'main-v1') return; let carts = {}; try { carts = JSON.parse(sessionStorage.getItem('mercado-local:demo-v1') || '{}').carts || {}; } catch {} await request('legacy', { carts }); },
    empty: initialState,
  };
}
