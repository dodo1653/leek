// Leak Gallery — the archive
import { createWindow } from '../core/windowManager.js'
import { el, api, fmtDate } from '../core/utils.js'

export function launchGallery() {
  const win = createWindow({
    appId: 'gallery', title: 'LEAK ARCHIVE', icon: '🖼️',
    width: 660, height: 480, statusBar: 'mirrored forever',
  })

  let leaks = []
  let filter = 'all'
  const body = win.body
  body.style.display = 'flex'
  body.style.flexDirection = 'column'
  body.style.overflow = 'hidden'
  const content = el('div', { style: 'flex:1;overflow:auto;position:relative;' })
  const tabs = el('div', { class: 'app-toolbar' })

  function mkTab(label, key) {
    const b = el('button', { class: 'app-btn' + (filter === key ? ' primary' : '') }, label)
    b.addEventListener('click', () => { filter = key; renderTabs(); renderGrid() })
    return b
  }
  function renderTabs() {
    tabs.innerHTML = ''
    tabs.append(
      el('span', { style: 'color:var(--green);font-size:11px;letter-spacing:2px;margin-right:6px;' }, 'ARCHIVE:'),
      mkTab(`All`, 'all'), mkTab('Images', 'image'), mkTab('Videos', 'video'),
      el('span', { style: 'margin-left:auto;color:var(--text-dark);font-size:11px;' }, `${leaks.length} objects archived`))
  }

  async function load() {
    content.innerHTML = ''
    content.append(el('div', { style: 'text-align:center;padding:40px;color:var(--text-dim);' }, 'decrypting archive...'))
    try { leaks = await api('/api/leeks') } catch { leaks = [] }
    renderTabs()
    renderGrid()
  }

  function renderGrid() {
    content.innerHTML = ''
    const list = leaks.filter(l => filter === 'all' || l.kind === filter)
    if (!list.length) {
      content.append(el('div', { style: 'text-align:center;padding:40px;color:var(--text-dim);' }, 'nothing here. the corpos got to this folder first.'))
      return
    }
    const grid = el('div', { class: 'gallery-grid' })
    for (const leak of list) {
      const thumb = leak.kind === 'image' && leak.local
        ? el('div', { class: 'gallery-thumb', style: `background-image:url('${leak.local}')` })
        : el('div', { class: 'gallery-thumb' }, leak.kind === 'video' ? '▶' : '🖼')
      grid.append(el('div', { class: 'gallery-card', onclick: () => openLeak(leak) },
        thumb,
        el('div', { class: 'gallery-cap' },
          el('b', {}, leak.title),
          el('div', { style: 'color:var(--text-dark);font-size:10px;margin-top:2px;' }, fmtDate(leak.date)))))
    }
    content.append(grid)
  }

  function openLeak(leak) {
    closeLightbox()
    const lb = el('div', { class: 'lightbox', id: 'leek-lightbox' })
    const inner = el('div', { style: 'display:flex;flex-direction:column;align-items:center;max-width:100%;' })
    if (leak.kind === 'image' && leak.local) {
      inner.append(el('img', { src: leak.local, alt: leak.title }))
    } else {
      inner.append(el('div', {
        style: `width:min(480px,80vw);height:240px;border:1px solid var(--border);background:linear-gradient(180deg,#001233,#000713);display:grid;place-items:center;font-size:56px;color:var(--neon);`,
        onclick: () => window.open(leak.mirrors[0]?.url || '#', '_blank', 'noopener'),
        title: 'open first mirror',
        role: 'button',
      }, '▶'))
    }
    inner.append(el('div', { class: 'lb-caption' },
      el('b', {}, leak.title),
      el('div', { style: 'color:var(--text-dim);font-size:11px;margin-top:2px;' }, new Date(leak.date).toUTCString())))
    const mirrors = el('div', { class: 'lb-mirrors' })
    for (const m of leak.mirrors) {
      mirrors.append(el('a', { href: m.url, target: '_blank', rel: 'noopener', class: 'app-btn primary', style: 'text-decoration:none;' }, m.label))
    }
    inner.append(mirrors)
    inner.append(el('button', { class: 'app-btn', style: 'margin-top:12px;', onclick: closeLightbox }, '✕ Close'))
    lb.append(inner)
    lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox() })
    content.append(lb)
  }

  function closeLightbox() { content.querySelector('#leek-lightbox')?.remove() }
  document.addEventListener('keydown', escHandler)

  function escHandler(e) { if (e.key === 'Escape') closeLightbox() }
  win.onClose = () => document.removeEventListener('keydown', escHandler)

  body.append(tabs, content)
  load()
}
