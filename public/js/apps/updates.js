// Announcements — live feed
import { createWindow } from '../core/windowManager.js'
import { el, api, fmtDate } from '../core/utils.js'

export function launchUpdates() {
  const win = createWindow({
    appId: 'updates', title: 'ANNOUNCEMENTS // LIVE FEED', icon: '📰',
    width: 560, height: 470, statusBar: 'feed online',
  })

  const body = win.body
  body.style.overflow = 'auto'
  let countdownTimer = null
  let liveEndsAt = null

  function renderPollMini(poll) {
    if (!poll) return null
    return el('div', { class: 'update-item', style: 'border-color:var(--green-dim);' },
      el('div', { style: 'display:flex;gap:8px;align-items:center;' },
        el('span', { class: 'tag live' }, 'ACTIVE POLL'),
        el('span', { style: 'color:var(--text-bright);font-weight:700;' }, poll.title)),
      el('div', { id: 'poll-countdown', style: 'color:var(--text-dim);font-size:11px;margin-top:6px;' }, ''))
  }

  async function render() {
    body.innerHTML = ''
    let polls = []
    try { polls = await api('/api/polls') } catch {}
    const live = polls.find(p => p.status === 'LIVE')
    if (live) {
      liveEndsAt = new Date(live.endsAt).getTime()
      body.append(renderPollMini(live))
    }

    let anns = []
    try { anns = await api('/api/announcements') } catch {}

    const head = el('div', { style: 'display:flex;align-items:center;gap:8px;padding:10px 12px 0;' },
      el('span', { class: 'tag neon' }, 'FEED'),
      el('span', { class: 'tag live' }, '● ONLINE'))
    body.append(head)

    if (!anns.length) {
      body.append(el('div', { class: 'update-item' }, 'no signal... corpos jamming the feed?'))
    }
    for (const a of anns) {
      body.append(el('div', { class: 'update-item' },
        el('div', { class: 'u-date' }, fmtDate(a.date)),
        el('h4', {}, a.title),
        el('p', {}, a.body)))
    }
    tickCountdown()
  }

  function tickCountdown() {
    const cd = document.getElementById('poll-countdown')
    if (!cd) return
    if (!liveEndsAt || Date.now() > liveEndsAt) {
      cd.textContent = 'voting closed'
      clearInterval(countdownTimer)
      return
    }
    const s = Math.floor((liveEndsAt - Date.now()) / 1000)
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60
    cd.textContent = `closes in ${h}h ${m}m ${sec}s — no wallet connect, your bags decide`
  }

  win.onClose = () => clearInterval(countdownTimer)
  countdownTimer = setInterval(tickCountdown, 1000)
  render()
}
