// $LEEK Chart — dexscreener embed or TBA state
import { createWindow } from '../core/windowManager.js'
import { el, api } from '../core/utils.js'

export function launchChart() {
  const win = createWindow({
    appId: 'chart', title: '$LEEK Chart', icon: '📊',
    width: 640, height: 480, statusBar: 'market data',
  })

  const body = win.body
  body.style.overflow = 'hidden'
  body.style.display = 'flex'
  body.style.flexDirection = 'column'

  const stats = el('table', { class: 'info-table' })
  for (const [k, v] of [
    ['Total Supply', '1B'],
    ['Taxes', 'Buy 0% / Sell 0%'],
    ['Security', 'LP Burned ✓ · Mint Revoked ✓ · Freeze Revoked ✓'],
    ['Contract', 'TBA'],
  ]) stats.append(el('tr', {}, el('td', {}, k), el('td', {}, v)))

  async function render() {
    let cfg = {}
    try { cfg = await api('/api/config') } catch {}
    body.innerHTML = ''

    if (cfg.ca) {
      const iframe = el('iframe', {
        src: `https://dexscreener.com/solana/${cfg.ca}?embed=1&theme=dark&info=0`,
        style: { flex: '1', border: 'none', width: '100%' },
        allowfullscreen: true,
      })
      body.append(iframe)
      return
    }

    const empty = el('div', { style: 'flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:10px;padding:20px;' })
    empty.append(
      el('div', { style: 'font-size:52px;' }, '📊'),
      el('div', { style: 'color:var(--text-bright);font-weight:700;font-size:16px;' }, '$LEEK chart loads the moment the contract drops.'),
      el('div', { style: 'color:var(--text-dim);font-size:12px;line-height:1.8;' },
        'watch the ticker. be in the garden when it happens.\nno presale. no insiders. everyone sees the same block zero.'),
      el('div', { class: 'buy-popup-ca' }, 'CA: TBA — watch the LIVE FEED'),
      el('button', {
        class: 'app-btn primary',
        onclick: () => alert('you will know.\neveryone in the garden will know.'),
      }, 'Notify Me'))
    body.append(empty)
    body.append(stats)
  }

  render()
}
