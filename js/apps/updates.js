// Vulnerable Supply — quantum threat data feed
import { createWindow } from '../core/windowManager.js'
import { el } from '../core/utils.js'

export function launchUpdates() {
  const win = createWindow({
    appId: 'updates', title: 'VULNERABLE SUPPLY // THREAT FEED', icon: '📰',
    width: 560, height: 470, statusBar: 'quantum threat monitor active',
  })

  const body = win.body
  body.style.overflow = 'auto'

  function render() {
    body.innerHTML = ''

    const header = el('div', { style: 'display:flex;align-items:center;gap:8px;padding:10px 12px 0;' },
      el('span', { class: 'tag neon' }, 'THREAT INTEL'),
      el('span', { class: 'tag live' }, '● MONITORING'))
    body.append(header)

    body.append(el('div', { class: 'update-item', style: 'border-color:var(--red);' },
      el('div', { style: 'display:flex;gap:8px;align-items:center;' },
        el('span', { class: 'tag live' }, 'CRITICAL'),
        el('span', { style: 'color:var(--red);font-weight:700;' }, '6.04M BTC Vulnerable')),
      el('div', { style: 'color:var(--text);font-size:12px;line-height:1.7;margin-top:8px;' },
        '30.2% of Bitcoin supply sits behind exposed public keys. At $80K/BTC, this represents ~$483 billion at risk from quantum computers running Shor\'s algorithm. Satoshi\'s coins are the ultimate quantum treasure.')))

    body.append(el('div', { class: 'update-item', style: 'border-color:var(--green-dim);' },
      el('div', { style: 'display:flex;gap:8px;align-items:center;' },
        el('span', { class: 'tag live' }, 'MILESTONE'),
        el('span', { style: 'color:var(--green);font-weight:700;' }, 'First QSB Transaction Mined')),
      el('div', { style: 'color:var(--text);font-size:12px;line-height:1.7;margin-top:8px;' },
        'Aug 30, 2026 — StarkWare mined the first quantum-resistant Bitcoin transaction using QSB (Quantum-Safe Bitcoin). This is the lifeboat. Not everyday use — emergency escape.')))

    body.append(el('div', { class: 'update-item', style: 'border-color:var(--neon);' },
      el('div', { style: 'display:flex;gap:8px;align-items:center;' },
        el('span', { class: 'tag neon' }, 'CONSORTIUM'),
        el('span', { style: 'color:var(--neon);font-weight:700;' }, '$15M Backing BIP-360')),
      el('div', { style: 'color:var(--text);font-size:12px;line-height:1.7;margin-top:8px;' },
        'Coinbase, BlackRock, Fidelity, Galaxy, Strategy, and Blockstream have formed a $15M consortium to support the migration to quantum-resistant Bitcoin. BIP-360 is the permanent fix.')))

    body.append(el('div', { class: 'update-item' },
      el('div', { style: 'display:flex;gap:8px;align-items:center;' },
        el('span', { class: 'tag' }, 'ANALYSIS'),
        el('span', { style: 'color:var(--text-bright);font-weight:700;' }, 'Saylor: Threat 10+ Years Away')),
      el('div', { style: 'color:var(--text);font-size:12px;line-height:1.7;margin-top:8px;' },
        'Michael Saylor states the quantum threat is 10+ years away. StarkWare and the consortium disagree — the lifeboat has already launched. Better safe than rekt.')))

    body.append(el('div', { class: 'update-item' },
      el('div', { style: 'display:flex;gap:8px;align-items:center;' },
        el('span', { class: 'tag' }, 'ADVISORY'),
        el('span', { style: 'color:var(--text-bright);font-weight:700;' }, 'Coinbase Quantum Advisory Board')),
      el('div', { style: 'color:var(--text);font-size:12px;line-height:1.7;margin-top:8px;' },
        'Coinbase has established an advisory board focused on quantum computing threats. The board is assessing migration timelines and developing tools for quantum-safe wallet management.')))
  }

  render()
}
