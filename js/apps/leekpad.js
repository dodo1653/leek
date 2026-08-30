// QBTCpad — notepad containing the Quantum Edict
import { createWindow } from '../core/windowManager.js'
import { el } from '../core/utils.js'

const EDICT = `THE QUANTUM BITCOIN EDICT
=========================

On August 30, 2026, StarkWare mined the first quantum-resistant Bitcoin transaction using Quantum-Safe Bitcoin (QSB). This is the beginning of a new era for Bitcoin security.

The quantum threat is real. 6.04 million BTC — 30.2% of the total supply, worth approximately $483 billion at $80K per bitcoin — sit behind exposed public keys, vulnerable to quantum computers running Shor's algorithm.

Satoshi's coins are the ultimate quantum treasure. If quantum computers advance faster than expected, these coins could be at risk.


COMMANDMENT I: MIGRATE VULNERABLE WALLETS

Any Bitcoin holder with funds behind an exposed public key must migrate to a quantum-resistant address. The longer you wait, the higher the risk. The first quantum-resistant transaction has been mined — the technology is ready.

Do not rely on "10+ years" estimates. Michael Saylor says the threat is a decade away. History teaches us that technology advances faster than predictions.


COMMANDMENT II: ADOPT BIP-360

BIP-360 is the proposal for a permanent quantum-resistant fix to Bitcoin. It replaces elliptic curve cryptography with hash-based signatures that are resistant to quantum attack.

A $15 million consortium — Coinbase, BlackRock, Fidelity, Galaxy, Strategy, and Blockstream — is backing the migration. This is not a test. This is not a simulation. This is the real thing.


COMMANDMENT III: PROTECT THE NETWORK

The quantum threat affects not just individual wallets but the entire Bitcoin network. If a significant portion of supply is compromised, it undermines trust in the entire system.

Run a QSB-compatible node. Support quantum-resistant development. Verify that your services are quantum-safe. The future of Bitcoin depends on it.


FINAL WORD

The lifeboat has launched. The first quantum-resistant transaction is mined. The question is no longer "if" but "when" — and the answer depends on how quickly the community acts.

These three commandments are the floor — not the ceiling — of what is acceptable. Quantum resistance is not optional. It is survival.

This is the Quantum Bitcoin Edict, and it is non-negotiable.`

export function launchLeekpad() {
  const win = createWindow({
    appId: 'leekpad', title: 'QBTCpad - quantum_edict.txt', icon: '📝',
    width: 620, height: 460, statusBar: 'Ln 1, Col 1',
  })

  const body = win.body
  body.style.display = 'flex'
  body.style.flexDirection = 'column'

  let wrap = true

  const area = el('textarea', {
    class: 'leekpad-area', spellcheck: 'false', style: { flex: '1' },
  })
  area.value = EDICT

  const statusText = el('span', {}, 'Ln 1, Col 1')
  win.el.querySelectorAll('.xp-status-bar').forEach(sb => { sb.innerHTML = ''; sb.append(statusText) })
  const updateStatus = () => {
    const pos = area.selectionStart
    const upto = area.value.slice(0, pos)
    const ln = upto.split('\n').length
    const col = pos - upto.lastIndexOf('\n')
    statusText.textContent = `Ln ${ln}, Col ${col}${wrap ? '' : '   [no wrap]'}`
  }
  area.addEventListener('keyup', updateStatus)
  area.addEventListener('click', updateStatus)

  const menubar = el('div', { class: 'menubar' })
  const mkMenu = (label, items) => {
    const mi = el('div', { class: 'menu-item' }, label)
    const dd = el('div', { class: 'menu-dropdown hidden' })
    for (const it of items) {
      if (it === '-') { dd.append(el('div', { class: 'md-sep' })); continue }
      dd.append(el('div', { class: 'md-item', onclick: () => { hideAll(); it.fn() } }, it.label))
    }
    mi.append(dd)
    mi.addEventListener('click', (e) => {
      e.stopPropagation()
      const open = !dd.classList.contains('hidden')
      hideAll()
      if (!open) { dd.classList.remove('hidden'); mi.classList.add('open') }
    })
    menubar.append(mi)
  }
  const hideAll = () => {
    menubar.querySelectorAll('.menu-dropdown').forEach(d => d.classList.add('hidden'))
    menubar.querySelectorAll('.menu-item.open').forEach(m => m.classList.remove('open'))
  }
  document.addEventListener('click', hideAll)

  mkMenu('File', [
    { label: 'New', fn: () => { area.value = ''; updateStatus() } },
    { label: 'Save as .txt', fn: () => {
      const blob = new Blob([area.value], { type: 'text/plain' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = 'quantum_edict.txt'
      a.click()
      URL.revokeObjectURL(a.href)
    } },
    '-',
    { label: 'Exit', fn: () => win.el.querySelector('.xp-ctrl-btn.close').click() },
  ])
  mkMenu('Edit', [
    { label: 'Select All', fn: () => area.select() },
    { label: 'Copy All', fn: () => { area.select(); document.execCommand('copy') } },
  ])
  mkMenu('Format', [
    { label: 'Word Wrap (toggle)', fn: () => {
      wrap = !wrap
      area.style.whiteSpace = wrap ? 'pre-wrap' : 'pre'
    } },
  ])
  mkMenu('Help', [
    { label: 'About QBTCpad', fn: () => alert('QBTCpad\nthe only notepad that ships quantum-resistant.\n\nNo quantum rekt inside.') },
  ])

  body.append(menubar, area)
}
