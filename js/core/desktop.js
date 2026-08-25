// CYBERLEEK OS — desktop (icons, marquee ticker, context menu, selection)
import { APP_REGISTRY } from './appRegistry.js'
import { showBuyPopup } from '../main.js'
import { el, api, store } from './utils.js'

let serverApps = null
let desktopItems = []

export async function initDesktop(enabledApps, items) {
  serverApps = enabledApps || null
  desktopItems = items || []
  renderIcons()
  initSelectionBox()
  initContextMenu()
  await loadTicker()
}

function isOn(key) {
  if (!serverApps) return true
  const a = serverApps.find(x => x.id === key)
  return !a || a.showOnDesktop !== false
}

export function renderIcons() {
  const container = document.getElementById('desktop-icons')
  container.innerHTML = ''
  const order = store.get('icon_order', [])
  let entries = Object.entries(APP_REGISTRY).filter(([k, v]) => v.desktop !== false && isOn(k))
  entries.sort((a, b) => {
    const ia = order.indexOf(a[0]), ib = order.indexOf(b[0])
    const oa = a[1].desktopOrder ?? 99, ob = b[1].desktopOrder ?? 99
    return (ia === -1 ? 9999 : ia) - (ib === -1 ? 9999 : ib) || oa - ob
  })
  for (const [key, app] of entries) {
    container.append(makeIcon(key, app.name, app.emoji || '🥬', app.iconImg))
  }
}

function makeIcon(key, label, emoji, iconImg) {
  const icon = el('div', { class: 'desktop-icon', 'data-app': key },
    el('span', { class: 'notif-dot' }),
    iconImg ? el('img', { src: iconImg, alt: '' }) : el('span', { class: 'icon-emoji' }, emoji),
    el('div', { class: 'icon-label' }, label)
  )
  const isTouch = matchMedia('(pointer: coarse)').matches
  if (isTouch) {
    icon.addEventListener('click', () => { markSeen(key); APP_REGISTRY[key]?.launch() })
  } else {
    icon.addEventListener('click', () => selectOnly(icon))
    icon.addEventListener('dblclick', () => { markSeen(key); APP_REGISTRY[key]?.launch() })
  }
  return icon
}

function selectOnly(icon) {
  document.querySelectorAll('.desktop-icon.selected').forEach(i => i.classList.remove('selected'))
  icon.classList.add('selected')
}

function markSeen(key) {
  const seen = store.get('seen', {})
  seen[key] = Date.now()
  store.set('seen', seen)
  window.dispatchEvent(new CustomEvent('leek-seen', { detail: key }))
}

// ---- rubber-band selection ----
function initSelectionBox() {
  const desk = document.getElementById('desktop')
  const iconsEl = document.getElementById('desktop-icons')
  let sx, sy, active = false
  const box = el('div', { id: 'selection-box' })
  desk.append(box)

  desk.addEventListener('mousedown', (e) => {
    if (e.target !== desk && e.target !== iconsEl && e.target.id !== 'watermark') return
    if (!e.target.closest('#ticker-dock')) {
      document.querySelectorAll('.desktop-icon.selected').forEach(i => i.classList.remove('selected'))
    }
    if (e.target.closest('#windows-container')) return
    active = true
    const r = desk.getBoundingClientRect()
    sx = e.clientX - r.left; sy = e.clientY - r.top
    Object.assign(box.style, { display: 'block', left: sx + 'px', top: sy + 'px', width: '0px', height: '0px' })
  })
  document.addEventListener('mousemove', (e) => {
    if (!active) return
    const r = desk.getBoundingClientRect()
    const cx = e.clientX - r.left, cy = e.clientY - r.top
    const x = Math.min(sx, cx), y = Math.min(sy, cy)
    Object.assign(box.style, { left: x + 'px', top: y + 'px', width: Math.abs(cx - sx) + 'px', height: Math.abs(cy - sy) + 'px' })
    const br = box.getBoundingClientRect()
    document.querySelectorAll('.desktop-icon').forEach(i => {
      const ir = i.getBoundingClientRect()
      i.classList.toggle('selected', !(ir.right < br.left || ir.left > br.right || ir.bottom < br.top || ir.top > br.bottom))
    })
  })
  document.addEventListener('mouseup', () => { active = false; box.style.display = 'none' })
}

// ---- context menu ----
function initContextMenu() {
  const desk = document.getElementById('desktop')
  let menu = null
  const close = () => { menu?.remove(); menu = null }
  desk.addEventListener('contextmenu', (e) => {
    if (e.target.closest('.xp-window')) return
    e.preventDefault()
    close()
    menu = el('div', { class: 'context-menu' },
      menuItem('🔄 Refresh', () => location.reload()),
      sep(),
      menuItem('🖥 Open $LEEK Terminal', () => APP_REGISTRY.terminal?.launch()),
      menuItem('🖼 Leak Gallery', () => APP_REGISTRY.gallery?.launch()),
      sep(),
      menuItem('🥬 BUY $LEEK', () => showBuyPopup()),
      sep(),
      menuItem('ℹ Properties — The Edict', () => APP_REGISTRY.aboutLeek?.launch()),
    )
    document.body.append(menu)
    const mw = 200, mh = menu.offsetHeight || 180
    menu.style.left = Math.min(e.clientX, innerWidth - mw - 4) + 'px'
    menu.style.top = Math.min(e.clientY, innerHeight - mh - 4) + 'px'
  })
  document.addEventListener('mousedown', (e) => { if (menu && !menu.contains(e.target)) close() })
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close() })

  function menuItem(label, fn) {
    return el('div', { class: 'cm-item', onclick: () => { close(); fn() } }, label)
  }
  function sep() { return el('div', { class: 'cm-sep' }) }
}

// ---- announcements ticker ----
async function loadTicker() {
  try {
    const cfg = await api('/api/config')
    const dock = document.getElementById('ticker-dock')
    if (!dock || !cfg.tickerItems?.length) return
    document.getElementById('desktop').classList.add('has-ticker')
    const mkSet = () => el('span', {},
      ...cfg.tickerItems.map(t => {
        const parts = t.split('—')
        return [
          el('span', { class: 'ticker-item' },
            parts.length > 1 ? el('b', {}, parts[0].trim() + ' ') : null,
            parts.length > 1 ? parts.slice(1).join('—').trim() : t,
          ),
          el('span', { class: 'ticker-sep' }, ' ◈ '),
        ]
      }).flat()
    )
    dock.innerHTML = ''
    dock.append(
      el('div', { class: 'ticker-tag' }, el('span', { class: 'dot' }), 'LIVE FEED'),
      el('div', { class: 'ticker-view' }, el('div', { class: 'ticker-track' }, mkSet(), mkSet()))
    )
  } catch {}
}
