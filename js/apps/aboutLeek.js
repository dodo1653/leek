// About QBTC — Quantum Bitcoin
import { createWindow } from '../core/windowManager.js'
import { el } from '../core/utils.js'
import { APP_REGISTRY } from '../core/appRegistry.js'

export function launchAboutLeek() {
  const win = createWindow({
    appId: 'aboutLeek', title: 'About QBTC', iconImg: '/assets/qbtc-logo.svg',
    width: 540, height: 490, statusBar: 'quantum-safe since 2026',
  })

  const body = win.body
  body.style.overflow = 'auto'
  const wrap = el('div', { class: 'sys-groups', style: 'text-align:center;' })

  wrap.append(el('img', { src: '/assets/qbtc-logo.svg', alt: '', style: 'width:96px;height:96px;margin:8px auto 12px;display:block;' }))
  wrap.append(el('div', { style: 'font-size:26px;font-weight:700;letter-spacing:6px;color:var(--neon);text-shadow:0 0 20px var(--neon-glow);' }, 'QBTC'))
  wrap.append(el('div', { style: 'color:var(--text-dim);font-size:11.5px;letter-spacing:2px;margin-top:2px;' }, 'quantum-safe bitcoin · hash-based signatures · no quantum rekt'))
  wrap.append(el('div', { style: 'color:var(--text-dark);font-size:10.5px;margin-top:2px;' }, 'QSB-OS version 1.0.2026 (QUANTUM EDITION)'))

  const missionTitle = el('div', { class: 'sys-group-title', style: 'text-align:left;' }, 'MISSION')
  const mission = el('div', { style: 'text-align:left;color:var(--text);font-size:12px;line-height:1.7;' },
    'On August 30, 2026, StarkWare mined the first quantum-resistant Bitcoin transaction. 6.04 million BTC — 30.2% of the total supply — sit behind exposed public keys, vulnerable to Shor\'s algorithm. Satoshi\'s coins are the ultimate quantum treasure. This terminal tracks the quantum threat and the migration to Quantum-Safe Bitcoin (QSB).')
  wrap.append(missionTitle, mission)

  const cmdTitle = el('div', { class: 'sys-group-title', style: 'text-align:left;margin-top:14px;' }, 'KEY FACTS')
  const list = el('ol', { style: 'text-align:left;color:var(--text-bright);font-size:12px;line-height:1.9;padding-left:22px;' },
    el('li', {}, 'QSB uses hash-based signatures instead of elliptic curve cryptography.'),
    el('li', {}, '6.04M BTC ($483B at $80K) have exposed public keys = quantum vulnerable.'),
    el('li', {}, 'BIP-360 is the proposal for a permanent quantum-resistant fix.'),
    el('li', {}, 'A $15M consortium (Coinbase, BlackRock, Fidelity, Galaxy, Strategy, Blockstream) is backing the migration.'))
  wrap.append(cmdTitle, list)

  const links = el('div', { style: 'display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:18px;' })
  const mkLink = (label, fn) => el('button', { class: 'app-btn primary', onclick: fn }, label)
  links.append(
    mkLink('View BIP-360', () => window.open('https://github.com/bitcoin/bips', '_blank')),
    mkLink('BTC Forum', () => APP_REGISTRY.forum.launch()),
    mkLink('Terminal', () => APP_REGISTRY.terminal.launch()),
  )
  wrap.append(links)

  wrap.append(el('div', { style: 'margin-top:16px;color:var(--text-dark);font-size:10.5px;letter-spacing:3px;text-transform:uppercase;' }, "the lifeboat has launched"))
  body.append(wrap)
}
