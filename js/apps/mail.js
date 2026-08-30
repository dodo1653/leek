// Threat Alerts — quantum-related notifications
import { createWindow } from '../core/windowManager.js'
import { el, fmtDate, store } from '../core/utils.js'

const MAILS = [
  {
    id: 'm1', folder: 'Alerts', from: 'QSB Network', subj: 'CRITICAL: 6.04M BTC quantum vulnerable',
    ts: '2026-08-30T09:12:00Z', unread: true,
    body: `ALERT: 6.04 million BTC (30.2% of supply) have exposed public keys.

At $80K/BTC, this represents approximately $483 billion vulnerable to quantum computers running Shor's algorithm.

Satoshi's coins are among the most at-risk — they are the ultimate quantum treasure.

RECOMMENDATION: Migrate to QSB-compatible addresses immediately.`,
  },
  {
    id: 'm2', folder: 'Inbox', from: 'StarkWare', subj: 'First quantum-resistant tx mined successfully',
    ts: '2026-08-30T08:40:00Z', unread: true,
    body: `The first quantum-resistant Bitcoin transaction has been mined.

Block: #891,427
Timestamp: Aug 30, 2026
Protocol: QSB (Quantum-Safe Bitcoin)
Signature: Hash-based (quantum-resistant)

This is the lifeboat. Not everyday use — emergency escape.`,
  },
  {
    id: 'm3', folder: 'Alerts', from: 'BIP-360 Consortium', subj: '$15M backing quantum-resistant migration',
    ts: '2026-08-30T11:05:00Z', unread: true,
    body: `The quantum-resistant Bitcoin consortium has formed.

Members: Coinbase, BlackRock, Fidelity, Galaxy, Strategy, Blockstream
Total backing: $15 million
Goal: Support migration to BIP-360 quantum-resistant addresses

The permanent fix is here. Act now.`,
  },
  {
    id: 'm4', folder: 'Inbox', from: 'Michael Saylor', subj: 'RE: Quantum threat timeline',
    ts: '2026-08-29T23:59:00Z', unread: true,
    body: `The quantum threat is 10+ years away.

Bitcoin has survived every threat so far. The community should focus on long-term value, not short-term panic.

That said, I acknowledge the QSB technology is sound. Migration should happen when the time is right.`,
  },
  {
    id: 'm5', folder: 'Alerts', from: 'Coinbase Advisory Board', subj: 'Quantum computing threat assessment',
    ts: '2026-08-28T10:00:00Z', unread: true,
    body: `Coinbase Quantum Advisory Board Assessment:

Threat Level: MODERATE to HIGH
Timeline: 5-10 years for sufficient quantum computing power
Recommendation: Begin migration planning now

The board recommends all exchange users check their quantum exposure.`,
  },
  {
    id: 'm6', folder: 'Sent', from: 'you', subj: 'RE: Quantum threat timeline',
    ts: '2026-08-30T10:30:00Z', unread: false,
    body: `Michael,

The lifeboat has launched. The first QSB tx is mined.

10 years may not be enough. 6.04M BTC are vulnerable RIGHT NOW.

Satoshi's coins are the ultimate quantum treasure. We cannot wait.

Regards,
quantum_hodler`,
  },
  {
    id: 'm7', folder: 'Archive', from: 'BitcoinTalk — 2013', subj: 'I am HODLING',
    ts: '2013-12-18T10:03:00Z', unread: false,
    body: `I type d that tyitle twice because I knew it was wrong the first time. Still wrong. w/e.

GF's out at a lesbian bar, BTC crashing WHY AM I HOLDING? I'LL TELL YOU WHY...

(archived as a reminder — we were early then, and we are early now.)`,
  },
  {
    id: 'm8', folder: 'Trash', from: 'scam_wallet', subj: '[SCAM - DO NOT OPEN] free QSB giveaway!!!',
    ts: '2026-08-30T08:00:00Z', unread: true,
    body: `CONGRATULATIONS!!! you have been selected to DOUBLE YOUR QSB!!!

simply send your seed phrase, your house keys, and your childhood pet to:
0x0000000000000000000000000000000000000000

hurry limited time!!!

[marked SCAM by the quantum security daemon]`,
  },
]

const FOLDERS = ['Inbox', 'Alerts', 'Sent', 'Archive', 'Trash']

export function launchMail() {
  const win = createWindow({
    appId: 'mail', title: 'Threat Alerts — quantum notifications', icon: '📧',
    width: 780, height: 500, statusBar: 'Connected — quantum threat monitor active',
  })

  const state = { folder: 'Inbox', mailId: null }
  const readSet = new Set(store.get('mail_read', []))

  const layout = el('div', { class: 'mail-layout' })
  const foldersEl = el('div', { class: 'mail-folders' })
  const listEl = el('div', { class: 'mail-list' })
  const previewEl = el('div', { class: 'mail-preview' })
  layout.append(foldersEl, listEl, previewEl)
  win.body.append(layout)

  const unreadCount = (f) => MAILS.filter(m => m.folder === f && m.unread && !readSet.has(m.id)).length

  function renderFolders() {
    foldersEl.innerHTML = ''
    foldersEl.append(el('div', { style: 'padding:4px 12px;color:var(--green);font-size:11px;letter-spacing:1px;' }, 'MAILBOXES'))
    for (const f of FOLDERS) {
      const n = unreadCount(f)
      foldersEl.append(el('div', {
        class: 'mail-folder' + (state.folder === f ? ' active' : ''),
        onclick: () => { state.folder = f; render() },
      }, el('span', {}, f), n ? el('span', { class: 'unread-n' }, String(n)) : null))
    }
  }

  function renderList() {
    listEl.innerHTML = ''
    const mails = MAILS.filter(m => m.folder === state.folder)
      .sort((a, b) => b.ts.localeCompare(a.ts))
    if (!mails.length) listEl.append(el('div', { style: 'padding:14px;color:var(--text-dim);font-size:12px;' }, '(empty)'))
    for (const m of mails) {
      const unread = m.unread && !readSet.has(m.id)
      listEl.append(el('div', {
        class: 'mail-row' + (unread ? ' unread' : '') + (state.mailId === m.id ? ' active' : ''),
        onclick: () => { readSet.add(m.id); store.set('mail_read', [...readSet]); state.mailId = m.id; render() },
      },
        el('div', { class: 'm-from' }, el('span', {}, m.from), el('span', { style: 'color:var(--text-dark);font-weight:400;font-size:10px;' }, fmtDate(m.ts))),
        el('div', { class: 'm-subj' }, m.subj)))
    }
  }

  function renderPreview() {
    previewEl.innerHTML = ''
    const m = MAILS.find(x => x.id === state.mailId)
    if (!m) {
      previewEl.append(
        el('div', { style: 'display:grid;place-items:center;height:100%;text-align:center;color:var(--text-dim);' },
          el('div', {},
            el('div', { style: 'font-size:42px;margin-bottom:8px;' }, '📧'),
            'select a threat alert to read')))
      return
    }
    previewEl.append(
      el('h3', {}, m.subj),
      el('div', { class: 'mail-meta' }, `from ${m.from} · ${new Date(m.ts).toUTCString()}`),
      el('div', { class: 'mail-body-text' }, m.body),
      el('div', { class: 'mail-actions' },
        el('button', { class: 'app-btn', onclick: () => alert('your reply was forwarded to the quantum void.') }, 'Reply'),
        el('button', { class: 'app-btn', onclick: () => alert('forwarded to the BTC forum.') }, 'Forward'),
        el('button', { class: 'app-btn', onclick: () => { m.unread = false; renderFolders(); renderList(); renderPreview() } }, 'Mark as Read'),
      ))
  }

  function render() { renderFolders(); renderList(); renderPreview() }
  render()
}
