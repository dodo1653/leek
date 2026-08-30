// QBTC OS — shared utilities
let _uid = 0
export function generateId() { return Date.now().toString(36) + (++_uid).toString(36) }

export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
}

export function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag)
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null) continue
    if (k === 'class') node.className = v
    else if (k === 'style' && typeof v === 'object') Object.assign(node.style, v)
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v)
    else if (k in node && k !== 'list') { try { node[k] = v } catch { node.setAttribute(k, v) } }
    else node.setAttribute(k, v)
  }
  for (const c of children.flat()) {
    if (c == null) continue
    node.append(c.nodeType ? c : document.createTextNode(c))
  }
  return node
}

export async function api(path, opts = {}) {
  const res = await fetch(path, {
    method: opts.method || 'GET',
    headers: opts.body ? { 'content-type': 'application/json' } : undefined,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
  return data
}

export function fmtTime(ts) {
  const d = new Date(ts)
  let h = d.getHours(), m = String(d.getMinutes()).padStart(2, '0')
  const ap = h >= 12 ? 'PM' : 'AM'
  h = h % 12 || 12
  return `${h}:${m} ${ap}`
}

export function fmtDate(ts) {
  const d = new Date(ts)
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`
}

export const clamp = (v, min, max) => Math.min(Math.max(v, min), max)

const LS_PREFIX = 'qbtc_'
export const store = {
  get(key, fb = null) {
    try { const v = localStorage.getItem(LS_PREFIX + key); return v == null ? fb : JSON.parse(v) } catch { return fb }
  },
  set(key, val) { try { localStorage.setItem(LS_PREFIX + key, JSON.stringify(val)) } catch {} },
}
