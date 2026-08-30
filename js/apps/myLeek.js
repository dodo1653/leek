// My Wallet — quantum risk status hub
import { createWindow } from '../core/windowManager.js'
import { el } from '../core/utils.js'
import { APP_REGISTRY } from '../core/appRegistry.js'

export function launchMyLeek() {
  const win = createWindow({
    appId: 'myLeek', title: 'My Wallet', icon: '🖥️', width: 640, height: 460,
    statusBar: 'QBTC OS — quantum-safe access granted',
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
    wrap.append(groupTitle('QUANTUM STATUS'))
    wrap.append(el('div', { class: 'sys-tiles' },
      tile('ℹ️', 'Wallet Overview', () => renderSysInfo()),
      tile('🔐', 'About QBTC', () => APP_REGISTRY.aboutLeek.launch()),
    ))
    wrap.append(groupTitle('QUANTUM TOOLS'))
    wrap.append(el('div', { class: 'sys-tiles' },
      tile('🖼️', 'Q: [QUANTUM_VAULT]', () => APP_REGISTRY.gallery.launch()),
      tile('🌐', 'Block Explorer', () => APP_REGISTRY.explorer.launch()),
      tile('🗳️', 'Quantum Polls', () => APP_REGISTRY.pollBooth.launch()),
      tile('⬛', 'QSB:\\> terminal', () => APP_REGISTRY.terminal.launch()),
    ))
    wrap.append(groupTitle('CONTROLS'))
    wrap.append(el('div', { class: 'sys-tiles' },
      tile('⚖️', 'BIP-360 Proposal', () => window.open('https://github.com/bitcoin/bips', '_blank')),
      tile('📊', 'BTC Price', () => APP_REGISTRY.chart.launch()),
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
      ['OS', 'QBTC-OS build 1.0.2026 (QUANTUM EDITION)'],
      ['Registered to', 'quantum_hodler'],
      ['Uptime', 'since Aug 30, 2026'],
      ['Protocol', 'QSB v1.0 (hash-based signatures)'],
      ['Security', 'QUANTUM RESISTANT ✓'],
      ['At Risk', '6.04M BTC with exposed public keys'],
      ['Threat Level', 'CRITICAL — migration needed'],
      ['First QSB Tx', 'Mined by StarkWare, Aug 30, 2026'],
    ]
    for (const [k, v] of rows) table.append(el('tr', {}, el('td', {}, k), el('td', {}, v)))
    wrap.append(groupTitle('WALLET INFORMATION'), table)
    const note = el('div', { style: 'margin-top:12px;color:var(--text-dim);font-size:11.5px;' },
      'Check your address quantum risk status in the Terminal. Use "threats" command.')
    wrap.append(note)
    body.append(wrap)
  }

  renderHome()
}
