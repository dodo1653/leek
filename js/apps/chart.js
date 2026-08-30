// BTC Price Chart — market data display
import { createWindow } from '../core/windowManager.js'
import { el } from '../core/utils.js'

export function launchChart() {
  const win = createWindow({
    appId: 'chart', title: 'BTC Price Chart', icon: '📊',
    width: 640, height: 480, statusBar: 'market data — quantum threat level',
  })

  const body = win.body
  body.style.overflow = 'hidden'
  body.style.display = 'flex'
  body.style.flexDirection = 'column'

  const stats = el('table', { class: 'info-table' })
  for (const [k, v] of [
    ['Price', '~$80,000'],
    ['At Risk', '$483B in exposed public keys'],
    ['Vulnerable Supply', '6.04M BTC (30.2%)'],
    ['QSB Status', 'First tx mined Aug 30, 2026'],
  ]) stats.append(el('tr', {}, el('td', {}, k), el('td', {}, v)))

  const empty = el('div', { style: 'flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:10px;padding:20px;' })
  empty.append(
    el('div', { style: 'font-size:52px;' }, '📊'),
    el('div', { style: 'color:var(--text-bright);font-weight:700;font-size:16px;' }, 'Bitcoin Price — Quantum Era'),
    el('div', { style: 'color:var(--text-dim);font-size:12px;line-height:1.8;' },
      '6.04M BTC sit behind exposed public keys.\n$483B at risk from quantum computers.\nBIP-360 is the permanent fix.'),
    el('div', { class: 'buy-popup-ca' }, 'The quantum clock is ticking'),
    el('button', {
      class: 'app-btn primary',
      onclick: () => alert('The quantum threat is real.\nMigrate to QSB-compatible addresses.'),
    }, 'Check Quantum Risk'))
  body.append(empty)
  body.append(stats)
}
