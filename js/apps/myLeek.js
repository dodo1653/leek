// My LEEK — system information hub
import { createWindow } from '../core/windowManager.js'
import { el } from '../core/utils.js'
import { APP_REGISTRY } from '../core/appRegistry.js'
import { showBuyPopup } from '../main.js'

export function launchMyLeek() {
  const win = createWindow({
    appId: 'myLeek', title: 'My LEEK', icon: '🖥️', width: 640, height: 460,
    statusBar: 'CYBERLEEK OS — garden access granted',
  })

  const body = win.body
  body.style.overflow = 'auto'
  let view = renderHome

  function tile(icon, label, onClick) {
    return el('div', { class: 'sys-tile', onclick: onClick },
      el('span', { class: 'st-icon' }, icon), label)
  }
  function groupTitle(t) { return el('div', { class: 'sys-group-title' }, t) }

  function renderHome() {
    view = renderHome
    body.innerHTML = ''
    const wrap = el('div', { class: 'sys-groups' })
    wrap.append(groupTitle('SYSTEM'))
    wrap.append(el('div', { class: 'sys-tiles' },
      tile('ℹ️', 'System Information', () => renderSysInfo()),
      tile('🥬', 'About CYBERLEEK', () => APP_REGISTRY.aboutLeek.launch()),
    ))
    wrap.append(groupTitle('ARCHIVE DRIVES'))
    wrap.append(el('div', { class: 'sys-tiles' },
      tile('💾', 'C: [LEAK_DRIVE]', () => APP_REGISTRY.gallery.launch()),
      tile('🌐', 'N: [NETWORK_MIRRORS]', () => APP_REGISTRY.explorer.launch()),
      tile('🗳️', '/dev/garden', () => APP_REGISTRY.pollBooth.launch()),
      tile('⬛', 'C:\\LEEK\\shell.exe', () => APP_REGISTRY.terminal.launch()),
    ))
    wrap.append(groupTitle('CONTROL PANEL'))
    wrap.append(el('div', { class: 'sys-tiles' },
      tile('⚖️', 'The Edict', () => window.open('/about.html', '_blank')),
      tile('💸', 'BUY $LEEK', () => showBuyPopup()),
      tile('🗑️', 'Recycle Bin', () => APP_REGISTRY.recycleBin.launch()),
    ))
    body.append(wrap)
  }

  function renderSysInfo() {
    view = renderSysInfo
    body.innerHTML = ''
    const wrap = el('div', { class: 'sys-groups' })
    wrap.append(el('button', { class: 'app-btn', onclick: renderHome }, '◂ Back'))
    const table = el('table', { class: 'info-table' })
    const rows = [
      ['OS', 'CYBERLEEK OS build 6.0.2025 (GARDEN EDITION)'],
      ['Registered to', 'an0n_leek'],
      ['Uptime', 'since the 2022 leak'],
      ['Processor', 'Vegetable Core i9 @ 4.20GHz (overclocked by community)'],
      ['Memory', '64 GB decentralized leeks'],
      ['Graphics', 'Rockstar-Adjacent RenderMax 6000'],
      ['Firewall', 'EDICT-enabled — preorders blocked at kernel level'],
      ['Contract address', 'TBA — watch the ticker'],
    ]
    for (const [k, v] of rows) table.append(el('tr', {}, el('td', {}, k), el('td', {}, v)))
    wrap.append(groupTitle('SYSTEM INFORMATION'), table)
    const note = el('div', { style: 'margin-top:12px;color:var(--text-dim);font-size:11.5px;' },
      'This copy of CYBERLEEK OS is fully offline-capable. No server can take it from you.')
    wrap.append(note)
    body.append(wrap)
  }

  renderHome()
}
