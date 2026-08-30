// Poll Booth — quantum threat community voting
import { createWindow } from '../core/windowManager.js'
import { el, api, fmtDate, store } from '../core/utils.js'

function compact(n) {
  if (n >= 1e12) return (n / 1e12).toFixed(1) + 'T'
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B'
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  return n.toLocaleString()
}

export function launchPollBooth() {
  const win = createWindow({
    appId: 'pollBooth', title: 'POLL BOOTH // quantum threat voting', icon: '🗳️',
    width: 560, height: 480, statusBar: 'no wallet connect · BTC holders decide',
  })

  const body = win.body
  body.style.overflow = 'auto'

  async function render() {
    body.innerHTML = ''
    body.append(header())
    let polls = []
    try { polls = await api('/api/polls') } catch {}
    if (!polls.length) {
      body.append(el('div', { style: 'padding:20px;color:var(--text-dim);' }, 'no polls found. the quantum vacuum is quiet.'))
      return
    }
    for (const p of polls) body.append(pollCard(p))
  }

  function header() {
    return el('div', { style: 'display:flex;align-items:center;gap:10px;padding:10px 14px;' },
      el('span', { class: 'tag neon' }, 'QUANTUM POLLS'),
      el('button', { class: 'app-btn', onclick: render }, '⟳ Refresh'))
  }

  function pollCard(p) {
    const total = p.votes.reduce((a, b) => a + Number(b), 0)
    const maxIdx = p.votes.indexOf(Math.max(...p.votes))
    const voted = store.get('voted_' + p.id, false)
    const live = p.status === 'LIVE' && !p.finalized

    const card = el('div', { class: 'poll-card' })
    card.append(
      el('span', { class: 'tag ' + (live ? 'live' : 'ended') }, live ? '● LIVE — VOTE NOW' : 'ENDED'),
      el('div', { class: 'poll-q' }, p.title),
      el('div', { class: 'poll-date' },
        `created ${fmtDate(new Date(new Date(p.endsAt).getTime() - 86400000 * 2))} · ends ${fmtDate(p.endsAt)} · ${compact(total)} votes`))

    p.choices.forEach((choice, i) => {
      const votes = Number(p.votes[i] || 0)
      const pct = total > 0 ? Math.round((votes / total) * 100) : 0
      const isWinner = !live && i === maxIdx
      const rowClass = 'choice-row' + (isWinner ? ' winning' : '')
      const row = el('div', { class: rowClass },
        el('div', { class: 'choice-top' },
          el('span', { class: 'choice-name' + (isWinner ? ' winner' : '') }, choice),
          el('span', { class: 'pct' }, `${pct}%`)),
        el('div', { class: 'bar-track' }, el('div', { class: 'bar-fill' + (isWinner ? ' winner' : ''), style: `width:${pct}%` })),
        el('div', { style: 'display:flex;justify-content:space-between;margin-top:5px;font-size:10.5px;color:var(--text-dark);' },
          el('span', { title: `${votes.toLocaleString()} votes` }, `${compact(votes)} votes`),
          live && !voted
            ? el('button', {
                class: 'app-btn primary', style: 'padding:2px 10px;',
                onclick: async (e) => {
                  e.stopPropagation()
                  try {
                    await api(`/api/poll/${p.id}/vote`, { method: 'POST', body: { choice: i } })
                    store.set('voted_' + p.id, true)
                    render()
                  } catch (err) { alert(err.message) }
                },
              }, 'Vote')
            : (live && voted ? el('span', { style: 'color:var(--green);' }, 'you voted ✓') : null)))
      card.append(row)
    })

    if (p.finalized) card.append(el('div', { style: 'margin-top:8px;color:var(--text-dark);font-size:11px;' }, '✔ finalized — results permanent'))
    return card
  }

  render()
}
