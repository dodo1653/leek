// Leek Explorer — browser clone & mirror hub
import { createWindow } from '../core/windowManager.js'
import { el, esc, api, fmtDate, store } from '../core/utils.js'

export function launchExplorer() {
  const win = createWindow({
    appId: 'explorer', title: 'Leek Explorer', icon: '🌐',
    width: 680, height: 500, statusBar: 'Done — connection routed through the garden',
  })

  const body = win.body
  body.style.display = 'flex'
  body.style.flexDirection = 'column'
  body.style.overflow = 'hidden'

  let page = el('div', { class: 'page-home' })

  const addrInput = el('input', { class: 'addr', placeholder: 'type a URL or leek:// address...' })
  const goBtn = el('button', { class: 'app-btn primary' }, 'Go')

  function setAddr(v) { addrInput.value = v }

  async function navigate(raw) {
    const input = (raw ?? addrInput.value).trim()
    if (!input) return
    if (/^https?:\/\//i.test(input)) {
      window.open(input, '_blank', 'noopener')
      return
    }
    const key = input.toUpperCase()
    if (key === 'V1CEC1TY') {
      if ((store.get('egg_step', 0)) >= 1) {
        store.set('egg_step', 2)
        showPage(accessGranted())
      } else {
        showPage(errPage('ACCESS DENIED — you have not spoken with the rabbit yet.'))
      }
      return
    }
    if (input === 'leek://home' || input.toLowerCase() === 'home') return renderHome()
    if (input.startsWith('leek://mirrors/')) {
      const id = input.slice('leek://mirrors/'.length)
      const leaks = await safeLeaks()
      const leak = leaks.find(l => l.id === id)
      if (leak) return showLeak(leak)
    }
    showPage(errPage(`DNS_PROBE_FELL_IN_THE_GARDEN\n\n"${esc(input)}" could not be resolved.\nthe corpos may have taken this route down. try a mirror.`))
  }

  function errPage(msg) {
    const d = el('div', { class: 'page-home' })
    d.append(
      el('div', { style: 'font-size:40px;margin-bottom:10px;' }, '🥀'),
      el('div', { style: 'color:var(--red);font-weight:700;letter-spacing:2px;margin-bottom:8px;' }, 'PAGE NOT FOUND'),
      el('pre', { style: 'color:var(--text);white-space:pre-wrap;font-size:12.5px;line-height:1.7;' }, msg))
    return d
  }

  function accessGranted() {
    const d = el('div', { class: 'page-home', style: 'text-align:center;' })
    d.append(
      el('div', { style: 'font-size:44px;margin-bottom:8px;filter:drop-shadow(0 0 12px var(--green-glow));' }, '🐇'),
      el('div', { class: 'term-cmd', style: 'font-size:16px;color:var(--green);letter-spacing:3px;margin-bottom:10px;' }, '> ACCESS GRANTED'),
      el('div', { style: 'color:var(--text);font-size:12.5px;line-height:1.8;' },
        'the key fits. one trial remains:\nscore 2013 in Corpo Breakout 🧱\nthen check your desktop for the rabbit.'))
    return d
  }

  function toolbar() {
    const bar = el('div', { class: 'app-toolbar' })
    const back = el('button', { class: 'app-btn', disabled: true }, '◂ Back')
    const fwd = el('button', { class: 'app-btn', disabled: true }, 'Forward')
    const refresh = el('button', { class: 'app-btn', onclick: renderHome }, '⟳ Refresh')
    const home = el('button', { class: 'app-btn', onclick: () => { setAddr('leek://home'); renderHome() } }, '⌂ Home')
    const mirrors = el('button', { class: 'app-btn', onclick: renderHome }, '🥬 Mirrors')
    bar.append(back, fwd, refresh, home, mirrors)
    return bar
  }

  function showPage(node, addr) {
    page.remove()
    page = node
    body.append(page)
    if (addr !== undefined) setAddr(addr)
  }

  async function safeLeaks() { try { return await api('/api/leeks') } catch { return [] } }

  async function renderHome() {
    showPage(el('div', { class: 'page-home', style: 'text-align:center;color:var(--text-dim);' }, 'resolving mirrors...'), 'leek://home')
    const leaks = await safeLeaks()
    const home = el('div', { class: 'page-home' })
    home.append(
      el('div', { style: 'text-align:center;' },
        el('div', { style: 'color:var(--neon);font-weight:700;letter-spacing:3px;font-size:17px;text-shadow:0 0 12px var(--neon-glow);' }, '◈ THE LEEK WEB DIRECTORY ◈'),
        el('div', { style: 'color:var(--text-dim);font-size:11.5px;margin-top:4px;' }, 'hand-indexed by the garden · no ads · no trackers · no preorders')))
    const grid = el('div', { class: 'link-grid' })
    for (const leak of leaks) {
      const host = (() => { try { return new URL(leak.mirrors[0].url).hostname } catch { return 'mirror' } })()
      grid.append(el('div', { class: 'link-card', onclick: () => showLeak(leak) },
        el('b', {}, leak.title),
        el('span', {}, `${fmtDate(leak.date)} · ${host}`)))
    }
    home.append(grid)
    home.append(el('div', { class: 'sys-group-title', style: 'margin-top:18px;' }, 'DIRECTORY'))
    const dirGrid = el('div', { class: 'link-grid' })
    for (const [name, sub, url] of [
      ['2shot Discord', 'discord.gg/2shot', 'https://discord.gg/2shot'],
      ['Arweave', 'permanent archive', 'https://arweave.net'],
      ['BitcoinTalk', 'where it all began', 'https://bitcointalk.org'],
    ]) {
      dirGrid.append(el('div', { class: 'link-card', onclick: () => window.open(url, '_blank', 'noopener') },
        el('b', {}, name), el('span', {}, sub)))
    }
    home.append(dirGrid)
    showPage(home, 'leek://home')
  }

  function showLeak(leak) {
    const d = el('div', { class: 'page-home' })
    d.append(
      el('button', { class: 'app-btn', onclick: renderHome }, '◂ back to directory'))
    d.append(
      el('h2', { style: 'color:var(--text-bright);margin:10px 0 2px;font-size:17px;' }, leak.title),
      el('div', { style: 'color:var(--text-dark);font-size:11px;letter-spacing:1px;margin-bottom:12px;' },
        `${new Date(leak.date).toUTCString()} · ${leak.kind.toUpperCase()}`))
    if (leak.local) {
      d.append(el('img', { src: leak.local, alt: '', style: 'max-width:100%;max-height:300px;border:1px solid var(--border);display:block;margin-bottom:12px;' }))
    } else {
      d.append(el('div', { style: 'border:1px dashed var(--border);padding:26px;text-align:center;color:var(--neon);font-size:15px;letter-spacing:2px;background:var(--card-2);margin-bottom:12px;' }, '▶ VIDEO LEAK'))
    }
    d.append(el('div', { class: 'sys-group-title' }, 'MIRRORS — take it before they do'))
    const row = el('div', { style: 'display:flex;gap:8px;flex-wrap:wrap;' })
    for (const m of leak.mirrors) {
      row.append(el('a', { href: m.url, target: '_blank', rel: 'noopener', class: 'app-btn primary', style: 'text-decoration:none;' }, m.label))
    }
    d.append(row)
    showPage(d, `leek://mirrors/${leak.id}`)
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
