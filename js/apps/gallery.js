// Quantum Gallery — images and media
import { createWindow } from '../core/windowManager.js'
import { el } from '../core/utils.js'

const GALLERY_ITEMS = [
  { id: 'qc1', title: 'Quantum Computer Core', type: 'image', src: '/assets/quantum-computer.jpg', desc: 'Dilution refrigerator housing quantum processor at near absolute zero' },
  { id: 'qc2', title: 'Quantum Circuit Diagram', type: 'image', src: '/assets/quantum-circuit.svg', desc: 'Qubit gate operations for Shor\'s algorithm decomposition' },
  { id: 'qc3', title: 'QSB Transaction Flow', type: 'info', desc: 'Hash-based signature verification process for quantum-safe Bitcoin transactions' },
  { id: 'qc4', title: 'ECDSA vs QSB', type: 'info', desc: 'Elliptic curve cryptography vulnerable to Shor\'s algorithm — hash-based signatures are quantum-resistant' },
  { id: 'qc5', title: 'StarkWare QSB Mining', type: 'info', desc: 'Aug 30, 2026: First quantum-resistant Bitcoin transaction mined' },
  { id: 'qc6', title: 'Vulnerable Supply Map', type: 'info', desc: '6.04M BTC (30.2% of supply) with exposed public keys' },
]

export function launchGallery() {
  const win = createWindow({
    appId: 'gallery', title: 'QUANTUM GALLERY', icon: '🖼️',
    width: 660, height: 480, statusBar: 'quantum-resistant media archive',
  })

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
      mkTab('All', 'all'), mkTab('Images', 'image'), mkTab('Info', 'info'),
      el('span', { style: 'margin-left:auto;color:var(--text-dark);font-size:11px;' }, `${GALLERY_ITEMS.length} items`))
  }

  function renderGrid() {
    content.innerHTML = ''
    const list = GALLERY_ITEMS.filter(l => filter === 'all' || l.type === filter)
    if (!list.length) {
      content.append(el('div', { style: 'text-align:center;padding:40px;color:var(--text-dim);' }, 'nothing here. quantum decoherence may have erased this folder.'))
      return
    }
    const grid = el('div', { class: 'gallery-grid' })
    for (const item of list) {
      const thumb = item.type === 'image'
        ? el('div', { class: 'gallery-thumb', style: `background-image:url('${item.src}')` })
        : el('div', { class: 'gallery-thumb' }, item.type === 'info' ? '📊' : '🖼')
      grid.append(el('div', { class: 'gallery-card', onclick: () => openItem(item) },
        thumb,
        el('div', { class: 'gallery-cap' },
          el('b', {}, item.title),
          el('div', { style: 'color:var(--text-dark);font-size:10px;margin-top:2px;' }, item.desc))))
    }
    content.append(grid)
  }

  function openItem(item) {
    closeLightbox()
    const lb = el('div', { class: 'lightbox', id: 'qc-lightbox' })
    const inner = el('div', { style: 'display:flex;flex-direction:column;align-items:center;max-width:100%;' })
    if (item.type === 'image') {
      inner.append(el('img', { src: item.src, alt: item.title, style: 'max-width:100%;max-height:340px;' }))
    } else {
      inner.append(el('div', {
        style: 'width:min(480px,80vw);height:240px;border:1px solid var(--border);background:linear-gradient(180deg,#001233,#000713);display:grid;place-items:center;font-size:14px;color:var(--neon);padding:20px;text-align:center;line-height:1.8;',
      }, item.desc))
    }
    inner.append(el('div', { class: 'lb-caption' },
      el('b', {}, item.title),
      el('div', { style: 'color:var(--text-dim);font-size:11px;margin-top:2px;' }, item.desc)))
    inner.append(el('button', { class: 'app-btn', style: 'margin-top:12px;', onclick: closeLightbox }, '✕ Close'))
    lb.append(inner)
    lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox() })
    content.append(lb)
  }

  function closeLightbox() { content.querySelector('#qc-lightbox')?.remove() }
  document.addEventListener('keydown', escHandler)
  function escHandler(e) { if (e.key === 'Escape') closeLightbox() }
  win.onClose = () => document.removeEventListener('keydown', escHandler)

  body.append(tabs, content)
  renderTabs()
  renderGrid()
}
