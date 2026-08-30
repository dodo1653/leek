// Recycle Bin — quantum threat artifacts
import { createWindow } from '../core/windowManager.js'
import { el } from '../core/utils.js'

const ITEMS = [
  ['🔑', 'Exposed ECDSA Keys', '6.04M BTC behind vulnerable elliptic curve signatures'],
  ['💻', 'Quantum Computer (Prototype)', 'Shor\'s algorithm can break ECDSA — time is running out'],
  ['📄', 'Satoshi\'s Public Key', 'the ultimate quantum treasure — exposed since 2009'],
  ['🔐', 'Legacy Bitcoin Address', 'single-key signatures = quantum vulnerable'],
  ['⚡', 'BIP-360 Draft', 'the permanent fix for quantum resistance — in progress'],
  ['📄', 'quantum_threat_timeline.txt', 'when will quantum computers break BTC? estimates vary'],
  ['📄', 'consortium_budget.doc', '$15M from Coinbase, BlackRock, Fidelity, Galaxy, Strategy, Blockstream'],
]

export function launchRecycleBin() {
  const win = createWindow({
    appId: 'recycleBin', title: 'Recycle Bin — quantum threat artifacts', icon: '🗑️',
    width: 480, height: 400, statusBar: `${ITEMS.length} objects · do not empty`,
  })

  const body = win.body
  body.style.overflow = 'auto'
  const list = el('div', { class: 'bin-list' })
  for (const [icon, name, desc] of ITEMS) {
    list.append(el('div', { class: 'bin-row', title: desc },
      el('span', { class: 'br-icon' }, icon),
      el('span', {}, el('b', {}, name)),
      el('small', {}, desc)))
  }
  body.append(list)

  body.append(el('div', { style: 'display:flex;gap:8px;padding:10px 14px;' },
    el('button', {
      class: 'app-btn',
      onclick: () => {
        if (confirm('this will restore quantum resistance. proceed?')) alert('refused.\n\nwe do not delete history.')
      },
    }, '🧹 Empty Bin'),
    el('button', {
      class: 'app-btn',
      onclick: () => alert('some things cannot be restored.\nthat is why BIP-360 exists.'),
    }, '♻ Restore'),
  ))
}
