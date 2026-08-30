// QBTC Block Explorer — simplified block view
import { createWindow } from '../core/windowManager.js'
import { el } from '../core/utils.js'

export function launchExplorer() {
  const win = createWindow({
    appId: 'explorer', title: 'QBTC Block Explorer', icon: '🌐',
    width: 680, height: 500, statusBar: 'Done — connected to quantum-safe network',
  })

  const body = win.body
  body.style.display = 'flex'
  body.style.flexDirection = 'column'
  body.style.overflow = 'hidden'

  let page = el('div', { class: 'page-home' })

  const addrInput = el('input', { class: 'addr', placeholder: 'enter block number or address...' })
  const goBtn = el('button', { class: 'app-btn primary' }, 'Search')

  function setAddr(v) { addrInput.value = v }

  function navigate(raw) {
    const input = (raw ?? addrInput.value).trim()
    if (!input) return
    showPage(blockPage(input), input)
  }

  function blockPage(query) {
    const d = el('div', { class: 'page-home' })
    d.append(
      el('div', { style: 'text-align:center;margin-bottom:16px;' },
        el('div', { style: 'color:var(--neon);font-weight:700;letter-spacing:3px;font-size:16px;text-shadow:0 0 12px var(--neon-glow);' }, 'QBTC BLOCK EXPLORER'),
        el('div', { style: 'color:var(--text-dim);font-size:11.5px;margin-top:4px;' }, 'quantum-resistant blockchain · hash-based signatures')))
    return d
  }

  function toolbar() {
    const bar = el('div', { class: 'app-toolbar' })
    const refresh = el('button', { class: 'app-btn', onclick: renderHome }, '⟳ Refresh')
    const home = el('button', { class: 'app-btn', onclick: () => { setAddr(''); renderHome() } }, '⌂ Home')
    bar.append(refresh, home)
    return bar
  }

  function showPage(node, addr) {
    page.remove()
    page = node
    body.append(page)
    if (addr !== undefined) setAddr(addr)
  }

  function renderHome() {
    const home = el('div', { class: 'page-home' })
    home.append(
      el('div', { style: 'text-align:center;margin-bottom:16px;' },
        el('div', { style: 'color:var(--neon);font-weight:700;letter-spacing:3px;font-size:17px;text-shadow:0 0 12px var(--neon-glow);' }, '◈ QBTC BLOCK EXPLORER ◈'),
        el('div', { style: 'color:var(--text-dim);font-size:11.5px;margin-top:4px;' }, 'quantum-safe blockchain · first QSB tx mined Aug 30, 2026')))

    const table = el('table', { class: 'info-table' })
    for (const [k, v] of [
      ['Network', 'Bitcoin Mainnet (QSB-enabled)'],
      ['Latest Block', '#891,427'],
      ['QSB Status', 'Active ✓'],
      ['Hash Algorithm', 'SHA-256 + QSB Signatures'],
      ['First QSB Tx', 'Aug 30, 2026 — mined by StarkWare'],
      ['Vulnerable Supply', '6.04M BTC (30.2%)'],
    ]) table.append(el('tr', {}, el('td', {}, k), el('td', {}, v)))
    home.append(table)

    home.append(el('div', { class: 'sys-group-title', style: 'margin-top:18px;' }, 'RECENT BLOCKS'))
    const grid = el('div', { class: 'link-grid' })
    for (const [num, txs, time] of [
      ['#891,427', '2,341 txs', '2 min ago'],
      ['#891,426', '3,102 txs', '14 min ago'],
      ['#891,425', '1,876 txs', '26 min ago'],
      ['#891,424', '2,944 txs', '38 min ago'],
      ['#891,423', '2,118 txs', '50 min ago'],
      ['#891,422', '3,067 txs', '1 hr ago'],
    ]) {
      grid.append(el('div', { class: 'link-card', onclick: () => showPage(blockPage(num), num) },
        el('b', {}, num),
        el('span', {}, `${txs} · ${time}`)))
    }
    home.append(grid)

    home.append(el('div', { class: 'sys-group-title', style: 'margin-top:18px;' }, 'QUANTUM TOOLS'))
    const tools = el('div', { class: 'link-grid' })
    for (const [name, sub, fn] of [
      ['Vulnerable Supply', '6.04M BTC at risk', () => alert('6.04M BTC (30.2% of supply) with exposed public keys.')],
      ['Migration Guide', 'How to move to QSB', () => window.open('https://github.com/bitcoin/bips', '_blank')],
      ['BIP-360', 'The quantum fix', () => window.open('https://github.com/bitcoin/bips', '_blank')],
    ]) {
      tools.append(el('div', { class: 'link-card', onclick: fn },
        el('b', {}, name), el('span', {}, sub)))
    }
    home.append(tools)
    showPage(home, '')
  }

  goBtn.addEventListener('click', () => navigate())
  addrInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') navigate() })

  const addrBar = el('div', { class: 'addr-bar' },
    el('span', { style: 'color:var(--green);font-size:11px;' }, 'ADDR'),
    addrInput, goBtn)

  body.style.overflow = 'auto'
  body.innerHTML = ''
  body.append(toolbar(), addrBar)
  body.style.overflow = 'auto'
  renderHome()
}
