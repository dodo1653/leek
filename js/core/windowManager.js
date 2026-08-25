// CYBERLEEK OS — window manager
const windows = new Map()
let topZ = 100
let cascadeOffset = 0
let activeWindowId = null

const callbacks = { onCreated: null, onClosed: null, onFocused: null, onMinimized: null }
export function setWindowCallbacks(cb) { Object.assign(callbacks, cb) }

function getPointer(e) {
  if (e.touches?.length) return { x: e.touches[0].clientX, y: e.touches[0].clientY }
  return { x: e.clientX, y: e.clientY }
}

export function createWindow(opts) {
  const {
    id, appId, title, icon = '🥬', iconImg = null,
    width = 560, height = 420, x, y,
    content = '', statusBar = 'Ready', resizable = true,
    minWidth = 300, minHeight = 180,
    onClose = null, modal = false,
  } = opts

  if (id && windows.has(id)) return focusWindow(id)

  const isMobile = window.innerWidth <= 600
  cascadeOffset = (cascadeOffset + 30) % 150

  let wx, wy, ww, wh
  if (isMobile) {
    ww = Math.min(width, window.innerWidth - 16)
    wh = Math.min(height, window.innerHeight - 60)
    wx = Math.max(4, (window.innerWidth - ww) / 2)
    wy = Math.max(4, (window.innerHeight - 30 - wh) / 2)
  } else {
    ww = width; wh = height
    wx = x ?? (window.innerWidth / 2 - ww / 2 + cascadeOffset - 75)
    wy = y ?? (Math.max(34, window.innerHeight / 2 - wh / 2 + cascadeOffset - 60))
    wx = Math.max(8, Math.min(wx, window.innerWidth - 80))
    wy = Math.max(30, Math.min(wy, window.innerHeight - 90))
  }

  const root = document.createElement('div')
  root.className = 'xp-window opening'
  Object.assign(root.style, { left: wx + 'px', top: wy + 'px', width: ww + 'px', height: wh + 'px', zIndex: ++topZ })

  const titleBar = document.createElement('div')
  titleBar.className = 'xp-title-bar'
  const iconEl = document.createElement('span')
  if (iconImg) {
    const img = document.createElement('img'); img.src = iconImg; img.alt = ''
    iconEl.append(img)
  } else {
    iconEl.className = 'tb-icon'; iconEl.textContent = icon
  }
  const titleText = document.createElement('span')
  titleText.className = 'xp-title-text'
  titleText.textContent = title
  const controls = document.createElement('div')
  controls.className = 'xp-title-controls'
  const minBtn = mkBtn('_'), maxBtn = mkBtn('□'), closeBtn = mkBtn('×')
  closeBtn.classList.add('close')
  controls.append(minBtn, maxBtn, closeBtn)
  titleBar.append(iconEl, titleText, controls)

  const body = document.createElement('div')
  body.className = 'xp-window-body'
  if (typeof content === 'string') body.innerHTML = content
  else body.append(content)

  root.append(titleBar, body)

  if (statusBar) {
    const sb = document.createElement('div')
    sb.className = 'xp-status-bar'
    sb.textContent = statusBar
    root.append(sb)
  }

  const state = { id: id || 'w' + Date.now() + Math.random().toString(36).slice(2), appId, title, icon, iconImg, el: root, body, titleBar, minimized: false, maximized: false, preMaxBounds: null, minWidth, minHeight, resizable, onClose }
  windows.set(state.id, state)
  document.getElementById('windows-container').append(root)

  requestAnimationFrame(() => setTimeout(() => root.classList.remove('opening'), 160))

  // events
  titleBar.addEventListener('mousedown', () => focusWindow(state.id))
  titleBar.addEventListener('touchstart', () => focusWindow(state.id), { passive: true })
  root.addEventListener('mousedown', () => focusWindow(state.id))
  minBtn.addEventListener('click', (e) => { e.stopPropagation(); minimizeWindow(state.id, true) })
  maxBtn.addEventListener('click', (e) => { e.stopPropagation(); maximizeWindow(state.id) })
  closeBtn.addEventListener('click', (e) => { e.stopPropagation(); closeWindow(state.id) })

  startDrag(state, titleBar)
  if (resizable && !isMobile) addResizeHandles(state)

  callbacks.onCreated?.(state)
  focusWindow(state.id)
  return state
}

function mkBtn(label) {
  const b = document.createElement('button')
  b.className = 'xp-ctrl-btn'
  b.innerHTML = `<span>${label}</span>`
  return b
}

function startDrag(state, handle) {
  handle.addEventListener('mousedown', (e) => {
    if (e.target.closest('.xp-ctrl-btn') || state.maximized) return
    begin(e)
  })
  handle.addEventListener('touchstart', (e) => {
    if (e.target.closest('.xp-ctrl-btn') || state.maximized) return
    begin(e)
  }, { passive: true })

  function begin(e) {
    e.preventDefault?.()
    const p0 = getPointer(e)
    const startX = p0.x - parseInt(state.el.style.left, 10)
    const startY = p0.y - parseInt(state.el.style.top, 10)
    const move = (ev) => {
      const p = getPointer(ev)
      const nx = Math.max(-parseInt(state.el.style.width, 10) + 80, Math.min(p.x - startX, window.innerWidth - 40))
      const ny = Math.max(0, Math.min(p.y - startY, window.innerHeight - 60))
      state.el.style.left = nx + 'px'
      state.el.style.top = ny + 'px'
      ev.preventDefault()
    }
    const up = () => {
      document.removeEventListener('mousemove', move)
      document.removeEventListener('mouseup', up)
      document.removeEventListener('touchmove', move)
      document.removeEventListener('touchend', up)
      document.removeEventListener('touchcancel', up)
    }
    document.addEventListener('mousemove', move)
    document.addEventListener('mouseup', up)
    document.addEventListener('touchmove', move, { passive: false })
    document.addEventListener('touchend', up)
    document.addEventListener('touchcancel', up)
  }
}

function addResizeHandles(state) {
  for (const dir of ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']) {
    const h = document.createElement('div')
    h.className = `rs-handle rs-${dir}`
    h.addEventListener('mousedown', (e) => startResize(state, dir, e))
    state.el.append(h)
  }
}

function startResize(state, dir, e) {
  e.preventDefault(); e.stopPropagation()
  const el = state.el
  const rect = el.getBoundingClientRect()
  const p0 = getPointer(e)
  const move = (ev) => {
    const p = getPointer(ev)
    let { left, top, width, height } = { left: rect.left, top: rect.top, width: rect.width, height: rect.height }
    const dx = p.x - p0.x, dy = p.y - p0.y
    if (dir.includes('e')) width = Math.max(state.minWidth, rect.width + dx)
    if (dir.includes('s')) height = Math.max(state.minHeight, rect.height + dy)
    if (dir.includes('w')) { width = Math.max(state.minWidth, rect.width - dx); left = rect.right - width }
    if (dir.includes('n')) { height = Math.max(state.minHeight, rect.height - dy); top = rect.bottom - height }
    Object.assign(el.style, { left: left + 'px', top: top + 'px', width: width + 'px', height: height + 'px' })
  }
  const up = () => {
    document.removeEventListener('mousemove', move)
    document.removeEventListener('mouseup', up)
  }
  document.addEventListener('mousemove', move)
  document.addEventListener('mouseup', up)
}

export function focusWindow(id) {
  const s = windows.get(id)
  if (!s) return
  for (const [, w] of windows) w.el.classList.add('inactive')
  s.el.classList.remove('inactive')
  s.el.style.zIndex = ++topZ
  activeWindowId = id
  callbacks.onFocused?.(id)
  return s
}

export function minimizeWindow(id, minimized) {
  const s = windows.get(id)
  if (!s) return
  s.minimized = minimized
  if (minimized) {
    s.el.classList.add('minimizing')
    setTimeout(() => { s.el.style.display = 'none'; s.el.classList.remove('minimizing') }, 190)
  } else {
    s.el.style.display = ''
    s.el.classList.add('restoring')
    setTimeout(() => s.el.classList.remove('restoring'), 210)
  }
  callbacks.onMinimized?.(id, minimized)
  if (minimized) focusNext()
}

function focusNext() {
  let best = null
  for (const [, w] of windows) {
    if (w.minimized) continue
    if (!best || Number(w.el.style.zIndex) > Number(best.el.style.zIndex)) best = w
  }
  if (best) focusWindow(best.id)
}

export function maximizeWindow(id) {
  const s = windows.get(id)
  if (!s) return
  if (!s.maximized) {
    s.preMaxBounds = { left: s.el.style.left, top: s.el.style.top, width: s.el.style.width, height: s.el.style.height }
    Object.assign(s.el.style, { left: '0px', top: '0px', width: window.innerWidth + 'px', height: (window.innerHeight - 30) + 'px' })
    s.maximized = true
  } else {
    Object.assign(s.el.style, s.preMaxBounds || {})
    s.maximized = false
  }
  focusWindow(id)
}

export function closeWindow(id) {
  const s = windows.get(id)
  if (!s) return
  try { s.onClose?.(s) } catch {}
  s.el.classList.add('closing')
  setTimeout(() => s.el.remove(), 130)
  windows.delete(id)
  callbacks.onClosed?.(id, s.appId)
  focusNext()
}

export function focusExistingWindow(appId) {
  for (const [, w] of windows) {
    if (w.appId === appId) {
      if (w.minimized) minimizeWindow(w.id, false)
      focusWindow(w.id)
      return true
    }
  }
  return false
}

export function toggleFromTaskbar(id) {
  const s = windows.get(id)
  if (!s) return
  if (s.minimized) {
    minimizeWindow(id, false)
    focusWindow(id)
  } else if (activeWindowId === id && Number(s.el.style.zIndex) === topZ) {
    minimizeWindow(id, true)
  } else focusWindow(id)
}

export function initWindowManager() {
  document.addEventListener('dblclick', (e) => {
    const tb = e.target.closest('.xp-title-bar')
    if (!tb || e.target.closest('.xp-ctrl-btn')) return
    const win = tb.parentElement
    for (const [, w] of windows) if (w.el === win) return maximizeWindow(w.id)
  })
}
